interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** Which surface the heading sits on, so the silver ramp matches. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * The repeated heading block: small muted eyebrow, large serif title rendered
 * in metallic silver, optional one-line intro.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const centred = align === "center";
  const dark = tone === "dark";

  return (
    <div data-reveal="up" className={className}>
      <div
        className={
          centred
            ? "mx-auto max-w-2xl text-center"
            : "grid gap-6 md:max-w-3xl md:grid-cols-12"
        }
      >
        {eyebrow ? (
          <p
            className={`label ${centred ? "mb-6" : "md:col-span-12"} ${
              dark ? "text-silver-200" : "text-muted"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2
          data-reveal="sheen"
          className={`t-head ${dark ? "type-silver-dark" : "type-silver"} ${
            centred ? "" : "md:col-span-12"
          }`}
        >
          {title}
        </h2>

        {intro ? (
          <p
            className={`t-body max-w-xl ${
              dark ? "text-neutral-300" : "text-neutral-600"
            } ${centred ? "mx-auto mt-6" : "md:col-span-12 md:col-start-7 md:row-start-1 md:mt-0"}`}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}