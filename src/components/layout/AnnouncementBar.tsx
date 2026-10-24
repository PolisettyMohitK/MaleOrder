/** Plain text only. WhatsApp lives in one place on screen: the corner button. */
const BULLETS = ["Free alterations in store", "Pay on delivery", "Order your bag on WhatsApp"];

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-accent px-4">
      <p className="flex items-center justify-center gap-3 text-center text-xs font-medium text-paper">
        {BULLETS.map((bullet, index) => (
          <span
            key={bullet}
            className={`items-center gap-3 ${index === 2 ? "hidden sm:inline-flex" : "inline-flex"}`}
          >
            {index > 0 ? (
              <span aria-hidden="true" className="opacity-50">
                •
              </span>
            ) : null}
            {bullet}
          </span>
        ))}
      </p>
    </div>
  );
}
