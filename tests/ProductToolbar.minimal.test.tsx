import React from "react";
import { render } from "@testing-library/react";

// Add mocks before imports
jest.mock("@/src/components/ui/button");
jest.mock("@/src/components/ui/input");
jest.mock("@/src/components/ui/select");
jest.mock("lucide-react");

import ProductToolbar from "@/src/components/products/ProductToolbar";

describe("ProductToolbar - Minimal Test", () => {
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

    it("should render without crashing", () => {
        const { container } = render(<ProductToolbar {...defaultProps} />);
        console.log("Container HTML:", container.innerHTML);
    });
});
