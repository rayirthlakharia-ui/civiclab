import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Landmark,
  Map,
  MapPin,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    href: "/rights",
    title: "Know Your Rights",
    copy: "Constitutional guidance with sources",
    icon: FileText,
    className: "rights-card",
    label: "01 / YOUR RIGHTS",
  },
  {
    href: "/local-government",
    title: "Local Government Explorer",
    copy: "Explore Dublin & San Ramon",
    icon: MapPin,
    className: "local-card",
    label: "02 / YOUR COMMUNITY",
  },
  {
    href: "/bills",
    title: "AI Bill Simplifier",
    copy: "Plain-English bill explanations",
    icon: Sparkles,
    className: "bills-card",
    label: "03 / LEGISLATION",
  },
];
const focus = [
  {
    href: "/bills",
    title: "Read a bill",
    copy: "Make sense of the details",
    icon: FileText,
    color: "violet",
  },
  {
    href: "/local-government",
    title: "Find your city",
    copy: "Dublin & San Ramon",
    icon: Map,
    color: "cyan",
  },
  {
    href: "/rights",
    title: "Check your rights",
    copy: "Learn. Question. Understand.",
    icon: Shield,
    color: "blue",
  },
];
export default function Home() {
  return (
    <div className="dashboard container">
      <section className="dashboard-welcome">
        <div>
          <p className="welcome-label">
            A LITTLE KNOWLEDGE. A WORLD OF POSSIBILITY.
          </p>
          <h1>Welcome, explorer.</h1>
          <p>Understand government. Take action with clarity.</p>
        </div>
        <span className="dashboard-status">
          <span />
          YOUR CIVIC DASHBOARD
        </span>
      </section>
      <section className="dashboard-hero" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="dashboard-hero-copy">
          <p className="eyebrow">YOUR CIVIC DASHBOARD</p>
          <h2 id="hero-title">
            A more informed
            <br />
            tomorrow starts today.
          </h2>
          <p>
            Explore your rights, your local government, and the bills shaping
            your future.
          </p>
          <Link href="/rights" className="button primary">
            Let’s explore <ArrowRight size={19} />
          </Link>
        </div>
        <span className="hero-motto" aria-hidden="true">
          PEOPLE
          <br />
          KNOWLEDGE
          <br />
          PROGRESS
          <i />
        </span>
      </section>
      <section className="dashboard-features" aria-label="Explore CivicLab">
        {features.map((feature) => (
          <Link
            href={feature.href}
            className={`dashboard-card ${feature.className}`}
            key={feature.href}
          >
            <div className="card-illustration" aria-hidden="true">
              {feature.className === "rights-card" ? (
                <div className="constitution-art">
                  <span>We the People</span>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              ) : feature.className === "local-card" ? (
                <div className="landscape-art">
                  <div />
                  <div />
                  <div />
                </div>
              ) : (
                <div className="documents-art">
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}
            </div>
            <span className="glow-icon">
              <feature.icon strokeWidth={1.7} />
            </span>
            <span className="card-kicker">{feature.label}</span>
            <h2>{feature.title}</h2>
            <p>{feature.copy}</p>
            <div className="card-bottom-row">
              <span className="card-arrow">
                <ArrowRight size={19} />
              </span>
              {feature.className === "bills-card" && (
                <span className="offline-chip">Offline demo</span>
              )}
            </div>
          </Link>
        ))}
      </section>
      <section className="daily-focus">
        <div className="focus-heading">
          <h2>Today’s focus</h2>
          <Link href="/sources">
            Explore our sources <ArrowRight size={15} />
          </Link>
        </div>
        <div className="focus-grid">
          {focus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-card ${item.color}`}
            >
              <span className="focus-icon">
                <item.icon size={23} strokeWidth={1.7} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.copy}</small>
              </span>
              <ChevronRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <Link href="/sources" className="official-banner">
        <span className="official-mark">
          <Landmark strokeWidth={1.4} />
        </span>
        <div>
          <p className="eyebrow">POWERED BY OFFICIAL CIVIC SOURCES</p>
          <p>
            Learn with source-backed content from Congress.gov, Constitution
            Annotated, and official city websites.
          </p>
        </div>
        <span className="official-trust">
          <ShieldCheck size={35} strokeWidth={1.4} />
          <span>
            SOURCE-BACKED
            <br />
            TRANSPARENT
            <br />
            EDUCATIONAL
          </span>
        </span>
        <ArrowRight className="official-arrow" size={18} />
      </Link>
    </div>
  );
}
