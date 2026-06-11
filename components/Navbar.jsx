"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ alwaysScrolled = false }) {
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysScrolled]);

  const close = () => setOpen(false);

  // Active-link helper replaces react-router's <NavLink>.
  const linkClass = (href) => (pathname === href ? "active" : undefined);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="mainNav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" onClick={close}>
          <img src="/logo.avif" alt="Himalayan Flames Logo" />
          <div className="nav-logo-text">
            Himalayan Flames<span>Nepali &amp; Indian Cuisine</span>
          </div>
        </Link>
        <ul className={`nav-links${open ? " mobile-open" : ""}`} id="navLinks">
          <li><Link href="/" className={linkClass("/")} onClick={close}>Home</Link></li>
          <li><Link href="/menu" className={linkClass("/menu")} onClick={close}>Menu</Link></li>
          <li><Link href="/about" className={linkClass("/about")} onClick={close}>About</Link></li>
          <li><Link href="/contact" className={linkClass("/contact")} onClick={close}>Contact</Link></li>
          <li>
            <Link href="/order" className="btn btn-gold nav-cta" onClick={close}>
              Order Online
            </Link>
          </li>
        </ul>
        <button
          className={`hamburger${open ? " open" : ""}`}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
