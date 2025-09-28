import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-neutral-dark">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <FiChevronRight className="mx-2" />}
        </div>
      ))}
    </nav>
  );
}
