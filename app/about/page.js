import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealEffects from "@/components/RevealEffects";
import "@/styles/about.css";

export const metadata = {
  title: "Our Story | Himalayan Flames",
  description:
    "From the foothills of the Himalayas to the heart of Dearborn, MI — a journey of flavor, tradition, and hospitality.",
};

const CLOVER = "https://www.clover.com/online-ordering/the-himalayan-flames-dearborn";
const overlineStyle = { color: "var(--gold)", fontSize: ".8rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: ".75rem" };

export default function About() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div>
          <span className="overline">Established in Dearborn, MI</span>
          <h1>Our <span className="gold">Story</span></h1>
          <p>From the foothills of the Himalayas to the heart of Michigan — a journey of flavor, tradition, and hospitality.</p>
        </div>
      </div>

      {/* OUR STORY */}
      <section className="section" style={{ background: "var(--charcoal)" }}>
        <div className="container">
          <div className="story-grid">
            <div className="story-img-stack reveal-left">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Restaurant dining room" />
              <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80" alt="Authentic dish" />
              <div className="story-img-badge"><span className="num">10+</span><span className="lbl">Years of<br />Tradition</span></div>
            </div>
            <div className="story-text reveal-right">
              <span className="overline" style={overlineStyle}>Who We Are</span>
              <h2>Born From the <span className="gold">Heart</span> of the Himalayas</h2>
              <p>Himalayan Flames began with a simple but powerful dream: to bring the <em>authentic, soul-warming flavors</em> of Nepal and India to the people of Dearborn, Michigan. What started as a family-driven vision has grown into one of the most beloved South Asian restaurants in the region.</p>
              <p>Our founders came to the United States carrying not just suitcases, but <em>generations of culinary heritage</em> — passed down through grandmothers who measured spices by memory, and chefs who learned their craft beside open flames and clay ovens in the valleys of Nepal and the streets of India.</p>
              <p>Every dish on our menu tells a story. The rich creaminess of our Butter Chicken echoes the Mughal kitchens of northern India. Our Everest Thukpa warms the soul just as it warmed the bodies of Tibetan mountain climbers. And our Nepali Chowmein is the taste of home — vibrant, familiar, and full of love.</p>
              <div className="heritage-pills">
                <span className="heritage-pill"><i className="fas fa-map-marker-alt"></i> Nepali Heritage</span>
                <span className="heritage-pill"><i className="fas fa-fire"></i> Indian Traditions</span>
                <span className="heritage-pill"><i className="fas fa-leaf"></i> Fresh Ingredients</span>
                <span className="heritage-pill"><i className="fas fa-heart"></i> Family Recipes</span>
                <span className="heritage-pill"><i className="fas fa-certificate"></i> 100% Halal</span>
              </div>
              <Link href="/menu" className="btn btn-gold"><i className="fas fa-book-open"></i> Explore Our Menu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CULINARY HERITAGE */}
      <section className="heritage-section section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Dual Heritage</span>
            <h2>Two Culinary <span className="gold">Traditions</span></h2>
            <p>We draw from two of the world's most vibrant food cultures — each distinct, each extraordinary.</p>
            <div className="divider"></div>
          </div>
          <div className="heritage-grid">
            <div className="heritage-card reveal-left">
              <div className="heritage-card-img"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" alt="Nepali cuisine" /></div>
              <div className="heritage-card-body">
                <span className="heritage-card-flag">🇳🇵</span>
                <h3>Nepali Culinary Heritage</h3>
                <p>Nepal's cuisine is as diverse as its landscape — from the hearty soups and noodles of the Himalayan highlands to the spiced street foods of the Kathmandu Valley. Our Thukpa, Chowmein, and Kathmandu Chilli reflect this rich tradition. Nepali cooking relies on fresh, locally sourced ingredients and bold flavors that warm the body and nourish the soul.</p>
              </div>
            </div>
            <div className="heritage-card reveal-right">
              <div className="heritage-card-img"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Indian cuisine" /></div>
              <div className="heritage-card-body">
                <span className="heritage-card-flag">🇮🇳</span>
                <h3>Indian Culinary Traditions</h3>
                <p>India's cuisine spans thousands of years and dozens of distinct regional traditions. From the creamy Mughlai dishes of the north — Butter Chicken, Korma, Biryani — to the fiery Vindaloos and Chettinad recipes of the south, our menu celebrates India's incredible diversity. Our tandoor oven, imported Indian spices, and heritage recipes honor this extraordinary culinary legacy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="mission-section section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Our Purpose</span>
            <h2>Our <span className="gold">Mission</span></h2>
            <p>We are committed to delivering an experience that goes beyond food — it's about culture, community, and connection.</p>
            <div className="divider"></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card reveal" data-delay="0"><div className="mission-card-icon"><i className="fas fa-star"></i></div><h3>Authentic Flavors</h3><p>We refuse to compromise. Every dish is made with the same spice blends, techniques, and care that have been used for generations. When you taste our food, you taste the real thing — no shortcuts, no substitutions.</p></div>
            <div className="mission-card reveal" data-delay="100"><div className="mission-card-icon"><i className="fas fa-seedling"></i></div><h3>Quality Ingredients</h3><p>We source the freshest produce and the finest whole spices, grinding and blending them in-house daily. Our dairy is locally sourced, our proteins are 100% Halal certified, and our commitment to quality is unwavering.</p></div>
            <div className="mission-card reveal" data-delay="200"><div className="mission-card-icon"><i className="fas fa-hands-holding-heart"></i></div><h3>Genuine Hospitality</h3><p>In Nepali culture, guests are considered God — &quot;Atithi Devo Bhava.&quot; This is the spirit we bring to every table. Our team is trained not just to serve food, but to create a warm, welcoming experience that feels like family.</p></div>
            <div className="mission-card reveal" data-delay="300"><div className="mission-card-icon"><i className="fas fa-globe-asia"></i></div><h3>Cultural Experience</h3><p>Dining at Himalayan Flames is a journey. From the mountain-inspired décor to the traditional music playing softly in the background, we work to transport you — even if just for an hour — to the warmth of the Himalayas.</p></div>
          </div>
        </div>
      </section>

      {/* WHY CUSTOMERS LOVE US */}
      <section className="section" style={{ background: "var(--charcoal)" }}>
        <div className="container">
          <div className="section-header">
            <span className="overline">Customer Love</span>
            <h2>Why Guests <span className="gold">Love Us</span></h2>
            <p>Four pillars that have made Himalayan Flames a Dearborn institution.</p>
            <div className="divider"></div>
          </div>
          <div className="why-cards-grid">
            <div className="why-card reveal" data-delay="0"><div className="why-card-icon"><i className="fas fa-leaf"></i></div><h4>Fresh Ingredients</h4><p>Locally sourced produce, freshly ground spices, and premium proteins — every day, no exceptions.</p></div>
            <div className="why-card reveal" data-delay="100"><div className="why-card-icon"><i className="fas fa-book"></i></div><h4>Authentic Recipes</h4><p>Recipes passed through generations — unchanged, uncompromised, and bursting with heritage.</p></div>
            <div className="why-card reveal" data-delay="200"><div className="why-card-icon"><i className="fas fa-hat-chef"></i></div><h4>Skilled Chefs</h4><p>Our culinary team brings decades of experience from Nepal and India, with mastery of tandoor, curry, and more.</p></div>
            <div className="why-card reveal" data-delay="300"><div className="why-card-icon"><i className="fas fa-heart"></i></div><h4>Warm Hospitality</h4><p>Every guest is family. From your first visit to your hundredth, you'll always feel welcome here.</p></div>
          </div>
        </div>
      </section>

      {/* CHEF BANNER */}
      <section className="chef-section section">
        <div className="container">
          <div className="chef-banner reveal">
            <div>
              <span style={overlineStyle}>Our Culinary Team</span>
              <h2>Chefs Who Cook With <span style={{ color: "var(--gold)" }}>Passion</span></h2>
              <p style={{ marginBottom: "1.5rem" }}>Our executive chef leads a team trained in both traditional Nepali and Indian cooking. From perfecting the clay oven temperature to balancing the exact blend of 30+ spices in our signature dishes, every detail is deliberate.</p>
              <p>Their signature creation, the <strong style={{ color: "var(--gold)" }}>Nalli Gosht</strong> — slow-braised Himalayan lamb shanks — has become one of the most-ordered dishes in the restaurant's history.</p>
            </div>
            <div className="chef-stats">
              <div className="chef-stat"><div className="n">30+</div><div className="l">Spice Blends</div></div>
              <div className="chef-stat"><div className="n">900°F</div><div className="l">Tandoor Temp</div></div>
              <div className="chef-stat"><div className="n">80+</div><div className="l">Menu Items</div></div>
              <div className="chef-stat"><div className="n">Daily</div><div className="l">Fresh Prep</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <span className="overline" style={overlineStyle}>Come Dine With Us</span>
          <h2>Experience the <span className="gold">Himalayan Flames</span> Difference</h2>
          <p>Whether you're a first-time visitor or a longtime regular, we promise an experience that nourishes both body and soul.</p>
          <div className="about-cta-btns">
            <Link href="/menu" className="btn btn-gold"><i className="fas fa-utensils"></i> View Our Menu</Link>
            <Link href="/contact" className="btn btn-outline"><i className="fas fa-map-marker-alt"></i> Find Us</Link>
            <a href={CLOVER} target="_blank" rel="noreferrer" className="btn btn-red"><i className="fas fa-shopping-bag"></i> Order Online</a>
          </div>
        </div>
      </section>

      <Footer />
      <RevealEffects />
    </>
  );
}
