"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  House,
  Landmark,
  MapPin,
  Shield,
} from "lucide-react";
const links = [
  { href: "/", text: "Home", icon: House },
  { href: "/rights", text: "Rights", icon: Shield },
  { href: "/local-government", text: "Explore", icon: MapPin },
  { href: "/bills", text: "Bills", icon: FileText },
  { href: "/sources", text: "Sources", icon: BookOpen },
];
export function Navigation() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="CivicLab home">
          <span className="brand-mark">
            <Landmark size={36} strokeWidth={1.6} />
          </span>
          Civic<span className="brand-accent">Lab</span>
        </Link>
        <nav aria-label="Main navigation">
          {links.map(({ href, text, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={21} strokeWidth={1.7} />
              <span>{text}</span>
            </Link>
          ))}
        </nav>
        <Link
          href="/sources"
          className="header-source"
          aria-label="About CivicLab and our sources"
        >
          <BookOpen size={21} />
        </Link>
      </div>
    </header>
  );
}
