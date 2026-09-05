import type { ReactNode } from "react";

/**
 * Shared section shell: consistent editorial rhythm (generous vertical air,
 * safe-area-aware gutters) and a single place to change page-wide spacing.
 */
export function Section({
  id,
  children,
  className = "",
  innerClassName = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative w-full py-[clamp(5.5rem,13vh,10rem)] ${className}`}
    >
      <div
        className={`relative mx-auto w-full max-w-[78rem] px-[max(1.5rem,env(safe-area-inset-left))] sm:px-8 lg:px-12 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

export default Section;
