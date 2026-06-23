"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealEffects from "@/components/RevealEffects";
import "@/styles/contact.css";

const CLOVER = "https://www.clover.com/online-ordering/the-himalayan-flames-dearborn";
const UBER = "https://www.ubereats.com/store/the-himalayan-flames/WDKvhQUcSbeyZNHpC0xGgg";
const GRUBHUB = "https://www.grubhub.com/restaurant/the-himalayan-flames-22266-michigan-ave-dearborn/1445618";
const DOORDASH = "https://www.doordash.com/store/the-himalayan-flames-(gaurishankar-inc)-dearborn-788261/";
const MAPS = "https://www.google.com/maps/place/The+Himalayan+Flames/@42.3173,-83.1935,15z";

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const hours = [
  { key: "mon", day: "Monday", time: "11:00 AM – 2:30 PM, 4:30 – 9:30 PM" },
  { key: "tue", day: "Tuesday", time: "11:00 AM – 3:00 PM, 5:00 – 9:30 PM" },
  { key: "wed", day: "Wednesday", time: "11:00 AM – 3:00 PM, 5:00 – 9:30 PM" },
  { key: "thu", day: "Thursday", time: "11:00 AM – 3:00 PM, 5:00 – 9:30 PM" },
  { key: "fri", day: "Friday", time: "11:00 AM – 2:30 PM, 4:30 – 9:30 PM" },
  { key: "sat", day: "Saturday", time: "11:00 AM – 2:30 PM, 4:30 – 9:30 PM" },
  { key: "sun", day: "Sunday", time: "12:00 PM – 2:30 PM, 4:30 – 9:00 PM" },
];

export default function Contact() {
  const today = days[new Date().getDay()];
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSent(true);
    } catch {
      alert("Sorry, something went wrong sending your message. Please call us at (313) 908-1193.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div>
          <span className="overline">We&apos;d Love to Hear From You</span>
          <h1>Contact <span className="gold">Us</span></h1>
          <p>Visit us at 22266 Michigan Ave, Dearborn, MI — or reach out anytime below.</p>
        </div>
      </div>

      <div style={{ background: "var(--charcoal)" }}>
        <div className="container">
          <div className="contact-grid">
            {/* LEFT: Info */}
            <div className="contact-info-panel">
              <div className="contact-info-card reveal-left" data-delay="0">
                <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <h4>Address</h4>
                  <p>22266 Michigan Ave<br />Dearborn, MI 48124</p>
                  <a href={MAPS} target="_blank" rel="noreferrer" style={{ color: "var(--gold)", fontSize: ".85rem", fontWeight: 600, marginTop: ".4rem", display: "inline-block" }}><i className="fas fa-directions"></i> Get Directions</a>
                </div>
              </div>

              <div className="contact-info-card reveal-left" data-delay="100">
                <div className="contact-info-icon"><i className="fas fa-phone"></i></div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:3139081193" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--gold)" }}>(313) 908-1193</a>
                  <p style={{ marginTop: ".3rem" }}>Call us to place an order or ask questions</p>
                </div>
              </div>

              <div className="contact-info-card reveal-left" data-delay="200">
                <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:thehimalayanflames@gmail.com">thehimalayanflames@gmail.com</a>
                  <p style={{ marginTop: ".3rem" }}>For catering, private events, or general inquiries</p>
                </div>
              </div>

              <div className="contact-info-card reveal-left" data-delay="300">
                <div className="contact-info-icon"><i className="fas fa-clock"></i></div>
                <div>
                  <h4>Business Hours</h4>
                  <table className="hours-table">
                    <tbody>
                      {hours.map((h) => (
                        <tr key={h.key} className={today === h.key ? "today" : undefined}>
                          <td className="day-col">{h.day}</td>
                          <td className="time-col">{h.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="contact-info-card reveal-left" data-delay="400">
                <div className="contact-info-icon"><i className="fas fa-share-alt"></i></div>
                <div>
                  <h4>Follow Us</h4>
                  <p style={{ marginBottom: ".75rem" }}>Stay connected for updates, specials and more!</p>
                  <div className="social-row">
                    <a href="https://www.facebook.com/himalayanflames/" target="_blank" rel="noreferrer" className="social-link facebook"><i className="fab fa-facebook-f"></i> Facebook</a>
                    <a href="https://www.instagram.com/thehimalayanflames/" target="_blank" rel="noreferrer" className="social-link instagram"><i className="fab fa-instagram"></i> Instagram</a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="contact-form-panel reveal-right">
              <div className="contact-form-wrap">
                {!sent ? (
                  <>
                    <h3>Send Us a <span className="gold">Message</span></h3>
                    <p>Have a question, feedback, or a special request? We&apos;d love to hear from you. We&apos;ll get back within 24 hours.</p>
                    <form onSubmit={onSubmit} noValidate>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Your Name *</label>
                          <input type="text" id="name" name="name" placeholder="John Smith" value={form.name} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number</label>
                          <input type="tel" id="phone" name="phone" placeholder="(555) 000-0000" value={form.phone} onChange={onChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <select id="subject" name="subject" value={form.subject} onChange={onChange}>
                          <option value="">Select a topic...</option>
                          <option value="reservation">Reservation / Table Request</option>
                          <option value="catering">Catering Inquiry</option>
                          <option value="order">Order Question</option>
                          <option value="feedback">General Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Message *</label>
                        <textarea id="message" name="message" placeholder="Tell us how we can help you..." value={form.message} onChange={onChange} required></textarea>
                      </div>
                      <button type="submit" className="btn btn-gold form-submit" disabled={sending}>
                        <i className="fas fa-paper-plane"></i>&nbsp; {sending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="form-success" style={{ display: "block" }}>
                    <i className="fas fa-check-circle"></i>
                    <h4>Message Sent!</h4>
                    <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours. In the meantime, feel free to call us at <a href="tel:3139081193" style={{ color: "var(--gold)" }}>(313) 908-1193</a>.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAP */}
      <section className="map-section">
        <div className="map-wrap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.123!2d-83.1935!3d42.3173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b35a4aeacf82d%3A0x6b167ca45e7024a1!2sThe%20Himalayan%20Flames!5e0!3m2!1sen!2sus!4v1720000000000!5m2!1sen!2sus"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Himalayan Flames Location Map"
          ></iframe>
          <div className="map-overlay-card">
            <h4><i className="fas fa-map-marker-alt" style={{ color: "var(--red)", marginRight: ".4rem" }}></i> Himalayan Flames</h4>
            <p>22266 Michigan Ave<br />Dearborn, MI 48124<br /><br /><a href="tel:3139081193" style={{ color: "var(--gold)" }}>(313) 908-1193</a></p>
            <a href={MAPS} target="_blank" rel="noreferrer" className="directions-btn"><i className="fas fa-directions"></i> Get Directions</a>
          </div>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="reservation-section">
        <div className="container">
          <h2>Reserve Your Table</h2>
          <p>Planning a special occasion or a group dinner? Call us directly and we&apos;ll make it memorable.</p>
          <div className="reservation-cta">
            <a href="tel:3139081193" className="btn btn-gold"><i className="fas fa-phone"></i> Call to Reserve</a>
            <a href={CLOVER} target="_blank" rel="noreferrer" className="btn btn-outline"><i className="fas fa-globe"></i> Order Online</a>
          </div>
          <div className="reservation-note"><i className="fas fa-info-circle"></i> Walk-ins welcome · Parties of 5+ please call ahead · 18% gratuity for large groups</div>
        </div>
      </section>

      {/* ORDER PLATFORMS */}
      <section className="platforms-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Order From Home</span>
            <h2>We Deliver <span className="gold">Everywhere</span></h2>
            <p>Order on your favorite platform and get authentic Himalayan flavors delivered to your door.</p>
            <div className="divider"></div>
          </div>
          <div className="platforms-grid">
            <div className="platform-card reveal" data-delay="0"><i className="fas fa-motorcycle"></i><h4>Uber Eats</h4><p>Fast delivery through Uber Eats. Track your order in real time.</p><a href={UBER} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: ".85rem", padding: ".6rem 1.3rem" }}>Order on Uber Eats</a></div>
            <div className="platform-card reveal" data-delay="100"><i className="fas fa-utensils"></i><h4>Grubhub</h4><p>Order seamlessly on Grubhub and earn rewards on every order.</p><a href={GRUBHUB} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: ".85rem", padding: ".6rem 1.3rem" }}>Order on Grubhub</a></div>
            <div className="platform-card reveal" data-delay="200"><i className="fas fa-car"></i><h4>DoorDash</h4><p>Quick DoorDash delivery right to your doorstep.</p><a href={DOORDASH} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: ".85rem", padding: ".6rem 1.3rem" }}>Order on DoorDash</a></div>
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a href={CLOVER} target="_blank" rel="noreferrer" className="btn btn-gold"><i className="fas fa-globe"></i> Order Directly Online</a>
          </div>
        </div>
      </section>

      <Footer />
      <RevealEffects />
    </>
  );
}
