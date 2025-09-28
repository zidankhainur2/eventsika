import { type ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  children?: ReactNode;
}

export function EmptyState({
  icon = <FiInbox className="h-16 w-16 text-gray-400" />,
  title,
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-md border border-dashed">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-neutral-dark">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
