import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

type BreadcrumbItemType = {
  label: string;
  href?: string; // nếu không có href thì là trang hiện tại
};

type BreadcrumbComponentProps = {
  items: BreadcrumbItemType[];
};

// C006: Renamed to DisplayBreadcrumbComponent
const DisplayBreadcrumbComponent = ({ items }: BreadcrumbComponentProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-(--chart-5)">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DisplayBreadcrumbComponent;
