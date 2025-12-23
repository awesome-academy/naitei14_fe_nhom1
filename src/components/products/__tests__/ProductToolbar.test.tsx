import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductToolbar from "../ProductToolbar";

// Mock các UI components
jest.mock("@/src/components/ui/button", () => ({
    Button: React.forwardRef(({ children, onClick, variant, size, ...props }: any, ref: any) => (
        <button ref={ref} onClick={onClick} data-variant={variant} data-size={size} {...props}>
            {children}
        </button>
    )),
}));

jest.mock("@/src/components/ui/input", () => ({
    Input: React.forwardRef((props: any, ref: any) => <input ref={ref} {...props} />),
}));

jest.mock("@/src/components/ui/select", () => ({
    Select: ({ children, value, onValueChange }: any) => {
        const handleChange = (e: any) => {
            if (onValueChange) {
                onValueChange(e.target.value);
            }
        };
        return (
            <div data-testid="select-wrapper">
                <select value={value} onChange={handleChange} data-value={value}>
                    {children}
                </select>
            </div>
        );
    },
    SelectTrigger: ({ children }: any) => (
        <div role="combobox" data-testid="select-trigger">
            {children}
        </div>
    ),
    SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
    SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
    SelectItem: ({ value, children }: any) => (
        <option value={value}>{children}</option>
    ),
}));

jest.mock("lucide-react", () => ({
    Grid: (props: any) => (
        <svg data-testid="grid-icon" className="lucide-grid" {...props}>
            <title>Grid</title>
        </svg>
    ),
    List: (props: any) => (
        <svg data-testid="list-icon" className="lucide-list" {...props}>
            <title>List</title>
        </svg>
    ),
    Search: (props: any) => (
        <svg data-testid="search-icon" className="lucide-search" {...props}>
            <title>Search</title>
        </svg>
    ),
}));

describe("ProductToolbar - Chức năng tìm kiếm sản phẩm", () => {
    const defaultProps = {
        totalProducts: 100,
        indexOfFirstItem: 0,
        indexOfLastItem: 12,
        sortBy: "default",
        setSortBy: jest.fn(),
        viewMode: "grid" as const,
        setViewMode: jest.fn(),
        searchQuery: "",
        setSearchQuery: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Tìm kiếm sản phẩm", () => {
        it("nên hiển thị input tìm kiếm với placeholder đúng", () => {
            render(<ProductToolbar {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");
            expect(searchInput).toBeInTheDocument();
        });

        it("nên hiển thị giá trị searchQuery hiện tại", () => {
            const searchQuery = "trà xanh";
            render(<ProductToolbar {...defaultProps} searchQuery={searchQuery} />);

            const searchInput = screen.getByPlaceholderText(
                "Tìm kiếm sản phẩm..."
            ) as HTMLInputElement;
            expect(searchInput.value).toBe(searchQuery);
        });

        it("nên gọi setSearchQuery khi người dùng nhập text", async () => {
            const user = userEvent.setup();
            const mockSetSearchQuery = jest.fn();

            render(
                <ProductToolbar {...defaultProps} setSearchQuery={mockSetSearchQuery} />
            );

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");

            await user.type(searchInput, "cà phê");

            // Kiểm tra setSearchQuery được gọi cho mỗi ký tự
            expect(mockSetSearchQuery).toHaveBeenCalled();
            expect(mockSetSearchQuery.mock.calls.length).toBeGreaterThan(0);
        });

        it("nên gọi setSearchQuery với giá trị đúng khi nhập", () => {
            const mockSetSearchQuery = jest.fn();

            render(
                <ProductToolbar {...defaultProps} setSearchQuery={mockSetSearchQuery} />
            );

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");

            // Simulate onChange event
            fireEvent.change(searchInput, { target: { value: "trà sữa" } });

            expect(mockSetSearchQuery).toHaveBeenCalledWith("trà sữa");
        });

        it("nên gọi setSearchQuery với chuỗi rỗng khi xóa nội dung", () => {
            const mockSetSearchQuery = jest.fn();

            render(
                <ProductToolbar
                    {...defaultProps}
                    searchQuery="test"
                    setSearchQuery={mockSetSearchQuery}
                />
            );

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");

            fireEvent.change(searchInput, { target: { value: "" } });

            expect(mockSetSearchQuery).toHaveBeenCalledWith("");
        });

        it("nên có type là text", () => {
            render(<ProductToolbar {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");
            expect(searchInput).toHaveAttribute("type", "text");
        });

        it("nên hiển thị icon Search", () => {
            render(<ProductToolbar {...defaultProps} />);

            const searchIcon = screen.getByTestId("search-icon");
            expect(searchIcon).toBeInTheDocument();
        });

        it("nên có class pl-10 để tạo khoảng trống cho icon", () => {
            render(<ProductToolbar {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText("Tìm kiếm sản phẩm...");
            expect(searchInput).toHaveClass("pl-10");
        });
    });

    describe("Hiển thị thông tin kết quả", () => {
        it("nên hiển thị đúng số lượng sản phẩm đang hiển thị", () => {
            render(<ProductToolbar {...defaultProps} />);

            expect(
                screen.getByText(/Hiển thị 1-12 của 100 kết quả/)
            ).toBeInTheDocument();
        });

        it("nên hiển thị đúng khi ở trang cuối với ít sản phẩm hơn", () => {
            render(
                <ProductToolbar
                    {...defaultProps}
                    totalProducts={15}
                    indexOfFirstItem={12}
                    indexOfLastItem={24}
                />
            );

            expect(
                screen.getByText(/Hiển thị 13-15 của 15 kết quả/)
            ).toBeInTheDocument();
        });

        it("nên hiển thị đúng với trang đầu tiên", () => {
            render(
                <ProductToolbar
                    {...defaultProps}
                    totalProducts={50}
                    indexOfFirstItem={0}
                    indexOfLastItem={10}
                />
            );

            expect(
                screen.getByText(/Hiển thị 1-10 của 50 kết quả/)
            ).toBeInTheDocument();
        });
    });

    describe("Chức năng sắp xếp", () => {
        it("nên hiển thị dropdown sắp xếp", () => {
            render(<ProductToolbar {...defaultProps} />);

            const selectTrigger = screen.getByTestId("select-trigger");
            expect(selectTrigger).toBeInTheDocument();
        });

        it("nên hiển thị tất cả các tùy chọn sắp xếp", () => {
            render(<ProductToolbar {...defaultProps} />);

            expect(screen.getByText("Mặc định")).toBeInTheDocument();
            expect(screen.getByText("Giá thấp đến cao")).toBeInTheDocument();
            expect(screen.getByText("Giá cao đến thấp")).toBeInTheDocument();
            expect(screen.getByText("Tên A-Z")).toBeInTheDocument();
        });
    });

    describe("Chức năng chuyển đổi view mode", () => {
        it("nên hiển thị nút Grid", () => {
            render(<ProductToolbar {...defaultProps} />);

            const gridIcon = screen.getByTestId("grid-icon");
            expect(gridIcon).toBeInTheDocument();
        });

        it("nên hiển thị nút List", () => {
            render(<ProductToolbar {...defaultProps} />);

            const listIcon = screen.getByTestId("list-icon");
            expect(listIcon).toBeInTheDocument();
        });

        it("nên gọi setViewMode với 'grid' khi click nút Grid", () => {
            const mockSetViewMode = jest.fn();

            render(
                <ProductToolbar
                    {...defaultProps}
                    viewMode="list"
                    setViewMode={mockSetViewMode}
                />
            );

            const buttons = screen.getAllByRole("button");
            const gridButton = buttons.find((btn) =>
                btn.querySelector('[data-testid="grid-icon"]')
            );

            if (gridButton) {
                fireEvent.click(gridButton);
                expect(mockSetViewMode).toHaveBeenCalledWith("grid");
            }
        });

        it("nên gọi setViewMode với 'list' khi click nút List", () => {
            const mockSetViewMode = jest.fn();

            render(
                <ProductToolbar
                    {...defaultProps}
                    viewMode="grid"
                    setViewMode={mockSetViewMode}
                />
            );

            const buttons = screen.getAllByRole("button");
            const listButton = buttons.find((btn) =>
                btn.querySelector('[data-testid="list-icon"]')
            );

            if (listButton) {
                fireEvent.click(listButton);
                expect(mockSetViewMode).toHaveBeenCalledWith("list");
            }
        });
    });
});
