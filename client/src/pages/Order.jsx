import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/order.css";

const CLOVER = "https://www.clover.com/online-ordering/the-himalayan-flames-dearborn";
const UBER = "https://www.ubereats.com/store/the-himalayan-flames/WDKvhQUcSbeyZNHpC0xGgg";
const GRUBHUB = "https://www.grubhub.com/restaurant/the-himalayan-flames-22266-michigan-ave-dearborn/1445618";
const DOORDASH = "https://www.doordash.com/store/the-himalayan-flames-(gaurishankar-inc)-dearborn-788261/";

export default function Order() {
  // Replicates the original page's no-scroll, full-viewport behaviour.
  useEffect(() => {
    document.body.classList.add("order-active");
    return () => document.body.classList.remove("order-active");
  }, []);

  return (
    <div className="order-page">
      <Navbar alwaysScrolled />

      {/* HEADER */}
      <div className="order-header">
        <span className="overline">Fast &amp; Easy</span>
        <h1>Order <span className="gold">Online</span></h1>
        <p>Choose how you'd like to order — delivered or ready for pickup.</p>
      </div>

      {/* CARDS */}
      <div className="order-cards-wrap">
        <div className="order-cards">
          <a href={CLOVER} target="_blank" rel="noreferrer" className="order-card card-direct">
            <span className="card-badge">Best Value</span>
            <div className="card-icon-wrap"><i className="fas fa-globe"></i></div>
            <div className="card-platform-label">Direct</div>
            <div className="card-title">Order Online Directly</div>
            <div className="card-desc">Order straight from us — no extra platform fees. Fast, simple, and direct.</div>
            <span className="card-btn"><i className="fas fa-arrow-right"></i> Order Now</span>
          </a>

          <a href={UBER} target="_blank" rel="noreferrer" className="order-card card-uber">
            <div className="card-icon-wrap"><i className="fas fa-motorcycle"></i></div>
            <div className="card-platform-label">Delivery</div>
            <div className="card-title">Uber Eats</div>
            <div className="card-desc">Real-time tracking and fast delivery right to your door.</div>
            <span className="card-btn"><i className="fas fa-external-link-alt"></i> Open Uber Eats</span>
          </a>

          <a href={GRUBHUB} target="_blank" rel="noreferrer" className="order-card card-grubhub">
            <div className="card-icon-wrap"><i className="fas fa-utensils"></i></div>
            <div className="card-platform-label">Delivery</div>
            <div className="card-title">Grubhub</div>
            <div className="card-desc">Earn rewards on every order with easy reordering and delivery tracking.</div>
            <span className="card-btn"><i className="fas fa-external-link-alt"></i> Open Grubhub</span>
          </a>

          <a href={DOORDASH} target="_blank" rel="noreferrer" className="order-card card-doordash">
            <div className="card-icon-wrap"><i className="fas fa-car"></i></div>
            <div className="card-platform-label">Delivery</div>
            <div className="card-title">DoorDash</div>
            <div className="card-desc">Schedule ahead or get it delivered ASAP — quick and convenient.</div>
            <span className="card-btn"><i className="fas fa-external-link-alt"></i> Open DoorDash</span>
          </a>
        </div>
      </div>

      {/* SLIM FOOTER STRIP */}
      <div className="order-footer-strip">
        <a href="tel:3139081193"><i className="fas fa-phone"></i>(313) 908-1193</a>
        <span><i className="fas fa-map-marker-alt" style={{ color: "var(--gold)" }}></i>22266 Michigan Ave, Dearborn MI</span>
        <span><i className="fas fa-clock" style={{ color: "var(--gold)" }}></i>Open Daily · 11am – 9:30pm</span>
        <Link to="/menu"><i className="fas fa-book-open"></i>View Menu</Link>
      </div>
    </div>
  );
}
