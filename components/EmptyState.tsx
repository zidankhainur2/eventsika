import { type ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  children?: ReactNode;
}

export function EmptyState({
  icon = <FiInbox className="h-10 w-10 text-primary" />,
  title,
  message,
  children,
}: EmptyStateProps) {
  return (
    // UPDATE: Rounded lebih besar, shadow halus, dan warna border stone
    <div className="text-center bg-white dark:bg-card p-10 sm:p-14 rounded-3xl shadow-lg shadow-stone-200/20 dark:shadow-none border border-stone-200 dark:border-border flex flex-col items-center justify-center">
      {/* UPDATE: Lingkaran icon yang lebih berwarna */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        {icon}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
        {message}
      </p>

      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
