import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar({ alwaysScrolled = false }) {
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysScrolled]);

  const close = () => setOpen(false);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="mainNav">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" onClick={close}>
          <img src="/logo.avif" alt="Himalayan Flames Logo" />
          <div className="nav-logo-text">
            Himalayan Flames<span>Nepali &amp; Indian Cuisine</span>
          </div>
        </Link>
        <ul className={`nav-links${open ? " mobile-open" : ""}`} id="navLinks">
          <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
          <li><NavLink to="/menu" onClick={close}>Menu</NavLink></li>
          <li><NavLink to="/about" onClick={close}>About</NavLink></li>
          <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
          <li>
            <NavLink to="/order" className="btn btn-gold nav-cta" onClick={close}>
              Order Online
            </NavLink>
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
