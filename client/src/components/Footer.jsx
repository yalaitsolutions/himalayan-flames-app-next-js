import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo.avif" alt="Himalayan Flames" />
            <h3>Himalayan Flames</h3>
            <p>
              Authentic Nepali &amp; Indian cuisine in the heart of Dearborn, MI.
              100% Halal certified, crafted with love and heritage.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/himalayanflames/" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/thehimalayanflames/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://www.ubereats.com/store/the-himalayan-flames/WDKvhQUcSbeyZNHpC0xGgg" target="_blank" rel="noreferrer" aria-label="Uber Eats"><i className="fas fa-motorcycle"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/order">Order Online</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Hours</h4>
            <div className="footer-hours-row"><span className="day">Mon</span><span>11am–2:30pm, 4:30–9:30pm</span></div>
            <div className="footer-hours-row"><span className="day">Tue–Thu</span><span>11am–3pm, 5–9:30pm</span></div>
            <div className="footer-hours-row"><span className="day">Fri–Sat</span><span>11am–2:30pm, 4:30–9:30pm</span></div>
            <div className="footer-hours-row"><span className="day">Sun</span><span>12pm–2:30pm, 4:30–9pm</span></div>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>22266 Michigan Ave<br />Dearborn, MI 48124</p>
            <br />
            <p><a href="tel:3139081193" style={{ color: "var(--gold)" }}>(313) 908-1193</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 The Himalayan Flames. All Rights Reserved.</p>
          <p>Crafted with <span style={{ color: "var(--gold)" }}>♥</span> in Dearborn, MI</p>
        </div>
      </div>
    </footer>
  );
}
