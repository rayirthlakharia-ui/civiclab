import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import representatives from "@/data/representatives.json";
export function Representatives({
  cityId,
  cityName,
}: {
  cityId: string;
  cityName: string;
}) {
  return (
    <section
      className="representatives"
      aria-labelledby="representatives-title"
    >
      <p className="eyebrow">THE PEOPLE WHO REPRESENT YOU</p>
      <h2 id="representatives-title">Meet your elected representatives.</h2>
      <p>
        {cityName}’s mayor and councilmembers. Select a card for official
        information and contact details.
      </p>
      <div className="representative-grid">
        {representatives
          .filter((p) => p.cityId === cityId)
          .map((p) => (
            <a
              className="representative-card"
              key={p.name}
              href={p.profileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name}, ${p.role}, ${p.district} — official information (opens in a new tab)`}
            >
              <div className="representative-portrait">
                <Image
                  src={p.image}
                  alt={`Official portrait of ${p.name}`}
                  width={320}
                  height={360}
                  sizes="(max-width: 760px) 45vw, 220px"
                />
              </div>
              <div className="representative-caption">
                <span>
                  {p.role} · {p.district}
                </span>
                <h3>{p.name}</h3>
                <p>
                  Official {cityId === "dublin" ? "council page" : "profile"}{" "}
                  <ArrowUpRight size={15} />
                </p>
              </div>
            </a>
          ))}
      </div>
      <p className="fine-print">
        Photos and roles from official city websites. Last verified October 24,
        2026. This is a saved directory; membership and roles can change.
      </p>
    </section>
  );
}
