"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const emptyPopup = { visible: false, spicy: false, img: "", name: "", desc: "", price: "", left: 0, top: 0 };

export default function MenuClient({ sections = [] }) {
  const [active, setActive] = useState(sections[0]?.id || "");
  const [popup, setPopup] = useState(emptyPopup);
  const [fireDissolved, setFireDissolved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dissolveTimerRef = useRef(null);
  const popupTimerRef = useRef(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Scrollspy: highlight active tab on scroll ---
  useEffect(() => {
    if (!sections.length) return;
    const ids = sections.map((s) => "section-" + s.id);
    const onScroll = () => {
      const y = window.scrollY + 220;
      let cur = sections[0].id;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id.replace("section-", "");
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const goToSection = (id) => {
    setActive(id);
    const target = document.getElementById("section-" + id);
    const tabsEl = document.getElementById("menuTabs");
    if (target && tabsEl) {
      const offset = tabsEl.offsetHeight + 90;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
    }
  };

  // --- Floating hover popup + fire dissolve ---
  const showPopup = useCallback((item, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const popW = 300, popH = 360, gap = 20;
    let left = window.innerWidth - popW - gap;
    if (left < 10) left = 10;
    let top = r.top - 10;
    if (top + popH > window.innerHeight - 10) top = window.innerHeight - popH - 10;
    if (top < 10) top = 10;
    setPopup({ visible: true, spicy: item.spicy, img: item.img, name: item.name, desc: item.desc, price: item.price, left, top });

    // Fire animation timing - exactly 1 second on both mobile and desktop
    if (item.spicy) {
      setFireDissolved(false);
      clearTimeout(dissolveTimerRef.current);
      dissolveTimerRef.current = setTimeout(() => setFireDissolved(true), 1000);
    }

    // On mobile, auto-close popup after 2 seconds
    if (isMobile) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => {
        setPopup((p) => ({ ...p, visible: false }));
      }, 2000);
    }
  }, [isMobile]);

  const hidePopup = useCallback(() => {
    setPopup((p) => ({ ...p, visible: false }));
    clearTimeout(dissolveTimerRef.current);
    clearTimeout(popupTimerRef.current);
    setFireDissolved(false);
  }, []);

  return (
    <>
      <Navbar />

      {/* PAGE HERO */}
      <div className="page-hero">
        <div>
          <span className="overline">Explore Our Offerings</span>
          <h1>Our <span className="gold">Menu</span></h1>
          <p>Authentic flavors of Nepal &amp; India — hover a dish to preview it. 🌶️ = Spicy</p>
        </div>
      </div>

      <main>
        <div className="container" style={{ paddingTop: "1.5rem" }}>
          {/* TABS */}
          <div className="menu-tabs" id="menuTabs">
            {sections.map((s) => (
              <button
                key={s.id}
                className={`menu-tab${active === s.id ? " active" : ""}`}
                onClick={() => goToSection(s.id)}
                dangerouslySetInnerHTML={{ __html: s.tab }}
              />
            ))}
          </div>

          {/* LAYOUT */}
          <div className="menu-layout">
            <div id="menuMain">
              {sections.map((s) => (
                <div className="menu-section" id={"section-" + s.id} key={s.id}>
                  <div className="menu-section-header">
                    <div className="menu-section-icon"><i className={s.icon}></i></div>
                    <div>
                      <div className="menu-section-title">{s.title}</div>
                      <div className="menu-section-subtitle">{s.subtitle}</div>
                    </div>
                  </div>
                  {s.note && <div className="menu-section-note">{s.note}</div>}
                  <div className="menu-items">
                    {s.items.map((item, i) => (
                      <div
                        className={`menu-item${item.spicy ? " spicy" : ""}`}
                        key={item.name + i}
                      >
                        {item.spicy && <div className={`fire-bg${fireDissolved ? " dissolving" : ""}`} />}
                        <div className="item-main">
                          <div
                            className="item-name-row"
                            onMouseEnter={!isMobile ? (e) => showPopup(item, e) : undefined}
                            onMouseLeave={!isMobile ? hidePopup : undefined}
                            onTouchStart={isMobile ? (e) => showPopup(item, e) : undefined}
                            onTouchEnd={isMobile ? hidePopup : undefined}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="item-name-group">
                              <span className="item-name">{item.name}</span>
                              {item.vegan && <span className="vegan-inline"> (VEGAN)</span>}
                              {item.label && (
                                <span className="item-label"> ({item.label})</span>
                              )}
                              {item.spicy && <span className="spicy-badge">🌶️</span>}
                            </span>
                            <span className="item-price">{item.price}</span>
                          </div>
                          <div className="item-desc">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergen note */}
          <div style={{ background: "var(--dark)", border: "1px solid rgba(212,175,55,.1)", borderRadius: "12px", padding: "1.5rem 2rem", marginBottom: "4rem", fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--cream)" }}>⚠️ Allergen Information:</strong> Our food may contain dairy, eggs, wheat, soybean, tree nuts, peanuts, fish, shellfish or other common allergens. Please let us know about your allergies. An 18% gratuity is included for parties of 5 or more. <span style={{ color: "var(--gold)" }}>🌶️</span> = Spicy · Can be made Vegan upon request.
          </div>
        </div>
      </main>

      {/* FLOATING DISH POPUP */}
      <div
        id="dishPopup"
        className={`${popup.visible ? "pop-visible " : ""}${popup.spicy ? "pop-spicy" : ""}`}
        style={{
          display: popup.visible ? "block" : "none",
          left: popup.left + "px",
          top: popup.top + "px",
          borderColor: popup.spicy ? "rgba(255,80,0,0.6)" : "rgba(212,175,55,0.35)",
        }}
      >
        <div id="popupImgWrap">
          {popup.img && <img id="popupImg" src={popup.img} alt={popup.name} />}
          {popup.spicy && <div key={popup.name} className={`popup-fire-overlay${fireDissolved ? " dissolving" : ""}`} />}
          <div className="popup-spicy-badge" style={{ display: popup.spicy ? "block" : "none" }}>🌶️ Spicy</div>
        </div>
        <div id="popupBody">
          <div id="popupName">{popup.name}</div>
          <div id="popupDesc">{popup.desc}</div>
          <div id="popupPriceRow"><span id="popupPrice">{popup.price}</span></div>
        </div>
      </div>

      <Footer />
    </>
  );
}
