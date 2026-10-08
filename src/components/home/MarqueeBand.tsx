const ITEMS = [
  "Office Casuals",
  "Kurta Pajama",
  "Erise, Ahmedabad",
  "Easy ordering on WhatsApp",
  "Honest fabrics",
  "Fits you properly",
];

/**
 * Slow, endless marquee. Now a LIGHT band with metallic silver type, which
 * brightens the page and is the first place the silver-as-typography
 * direction becomes visible. Pauses on hover. Pure CSS.
 */
export function MarqueeBand() {
  return (
    <div className="marquee overflow-hidden border-b border-black/8 bg-bone py-5 select-none">
      <p className="sr-only">
        Office Casuals and Kurta Pajama from our store in Erise, Ahmedabad.
        Easy ordering on WhatsApp.
      </p>

      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: "48s" }}
        aria-hidden="true"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {ITEMS.map((item) => (
              <li key={item} className="flex shrink-0 items-center">
                <span className="type-silver label px-7 text-[0.6875rem]">
                  {item}
                </span>
                <span className="text-silver-400" aria-hidden="true">
                  •
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}