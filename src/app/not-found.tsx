import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">404 / A SMALL DETOUR</p>
      <h1>This page isn’t on the map.</h1>
      <p>There’s still plenty to explore.</p>
      <Link className="button primary" href="/">
        <ArrowLeft size={17} /> Back to CivicLab
      </Link>
    </div>
  );
}
