import type { PropsWithChildren, HTMLAttributes } from "react";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={[
        "rounded-2xl shadow-md border border-gray-200 bg-white/90",
        "dark:bg-gray-900/80 dark:border-gray-800",
        "p-4 md:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
export default Card;

