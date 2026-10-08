import { addressLines, directionsQuery, placeLine, store } from "@/data/store.config";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function VisitStore() {
  return (
    <section
      id="visit"
      className="section-y scroll-mt-28 bg-paper"
      aria-labelledby="visit-heading"
    >
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div data-reveal="up">
            <p className="label text-muted">Visit the store</p>
            <h2
              id="visit-heading"
              data-reveal="sheen"
              data-lines
              className="t-head type-silver mt-5"
            >
              Come in and try it on.
            </h2>
            <p className="t-body mt-7 max-w-md text-neutral-600">
              Everything on this site is on the rail in store. If you are within
              driving distance of {store.city}, come and see the fabric in person
              before you order.
            </p>
          </div>

          <div data-reveal="up">
            <dl className="mt-10 space-y-7">
              <div className="flex gap-4">
                <dt className="shrink-0">
                  <PinIcon width={19} height={19} className="text-silver-400" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd>
                  <address className="t-body not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="shrink-0">
                  <ClockIcon width={19} height={19} className="text-silver-400" />
                  <span className="sr-only">Opening hours</span>
                </dt>
                <dd className="t-body">
                  {store.hours.map((slot) => (
                    <span key={slot.days} className="block">
                      <span className="text-neutral-500">{slot.days}</span>{" "}
                      {slot.time}
                    </span>
                  ))}
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="shrink-0">
                  <PhoneIcon width={19} height={19} className="text-silver-400" />
                  <span className="sr-only">Phone</span>
                </dt>
                <dd className="t-body">
                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className="link-draw"
                  >
                    {store.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div data-reveal="up">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${directionsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ink mt-10"
            >
              Get directions
            </a>
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal="up">
          <div className="draw-border relative h-full min-h-[22rem] overflow-hidden bg-bone">
            <iframe
              title={`Map showing ${store.name} in ${placeLine}`}
              src={store.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[22rem] w-full border-0 grayscale contrast-[1.05]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}