import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealEffects from "@/components/RevealEffects";
import { getReviews } from "@/lib/data";
import "@/styles/home.css";

// Reads reviews from MongoDB at request time.
export const dynamic = "force-dynamic";

const CLOVER = "https://www.clover.com/online-ordering/the-himalayan-flames-dearborn";
const UBER = "https://www.ubereats.com/store/the-himalayan-flames/WDKvhQUcSbeyZNHpC0xGgg";
const GRUBHUB = "https://www.grubhub.com/restaurant/the-himalayan-flames-22266-michigan-ave-dearborn/1445618";
const DOORDASH = "https://www.doordash.com/store/the-himalayan-flames-(gaurishankar-inc)-dearborn-788261/";

const dishes = [
  { name: "The Classic Butter Chicken", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80", desc: "Roasted marinated chicken breast pieces slowly simmered in a rich, creamy cashew tomato sauce.", price: "$16.95", tag: "Chicken", badge: "Fan Favorite", delay: 0 },
  { name: "Lamb Dum Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", desc: "Slow-cooked basmati rice layered with tender lamb, saffron, caramelized onions & whole spices.", price: "$17", tag: "Biryani", badge: "Signature", delay: 100 },
  { name: "Tandoori Chicken", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80", desc: "Bone-in chicken marinated in yogurt with ginger, garlic & herbs, barbecued in our clay oven.", price: "From $16", tag: "Tandoor", badge: "Tandoor", delay: 200 },
  { name: "Rogan Josh", img: "https://images.unsplash.com/photo-1596797038530-2c107aa7497d?w=600&q=80", desc: "Tender lamb cubes cooked with onion, tomato & yogurt base with a blend of aromatic spices.", price: "$17.95", tag: "Lamb", badge: null, delay: 0 },
  { name: "Samosa Chaat", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80", desc: "Indian savory snack topped with onion, tomatoes, yogurt, fresh mint and tamarind chutney.", price: "$11", tag: "Starter", badge: "Starter", delay: 100 },
  { name: "Nalli Gosht", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", desc: "Himalayan special lamb shanks — a signature dish from our executive chef, slow-braised to perfection.", price: "$23", tag: "Himalayan Special", badge: "Chef's Special", delay: 200 },
];

export default async function Home() {
  let reviews = [];
  try {
    reviews = await getReviews();
  } catch {
    reviews = [];
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <svg className="hero-mountains" viewBox="0 0 1440 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="rgba(17,17,17,0.9)" d="M0,160 L0,100 L120,40 L240,80 L360,20 L480,70 L600,10 L720,55 L840,15 L960,60 L1080,25 L1200,65 L1320,30 L1440,70 L1440,160 Z" />
          <path fill="rgba(17,17,17,1)" d="M0,160 L0,130 L100,90 L220,120 L340,80 L480,110 L600,75 L720,105 L840,70 L960,100 L1100,78 L1220,108 L1340,85 L1440,110 L1440,160 Z" />
        </svg>
        <div className="container hero-content">
          <div className="hero-badge"><i className="fas fa-certificate"></i>&nbsp; 100% Halal Certified</div>
          <h1>Taste the <em>Himalayas</em><br />In Every Bite</h1>
          <p className="hero-tagline">Authentic Nepali &amp; Indian Cuisine crafted with heritage recipes, fresh ingredients, and the warmth of mountain hospitality.</p>
          <div className="hero-cta">
            <Link href="/menu" className="btn btn-gold"><i className="fas fa-utensils"></i> View Menu</Link>
            <a href={CLOVER} target="_blank" rel="noreferrer" className="btn btn-red"><i className="fas fa-shopping-bag"></i> Order Online</a>
            <Link href="/contact" className="btn btn-outline"><i className="fas fa-map-marker-alt"></i> Contact Us</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* HALAL BAR */}
      <div className="halal-bar">
        <p><span>★</span>&nbsp; We Serve 100% Halal Certified Food &nbsp;<span>·</span>&nbsp; Dine In · Carry Out · Online Delivery &nbsp;<span>★</span></p>
      </div>

      {/* FEATURES STRIP */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item reveal" data-delay="0"><div className="feature-icon"><i className="fas fa-leaf"></i></div><h4>Fresh Ingredients</h4><p>Locally sourced produce, freshest spices</p></div>
            <div className="feature-item reveal" data-delay="100"><div className="feature-icon"><i className="fas fa-fire-alt"></i></div><h4>Clay Oven Tandoor</h4><p>Traditional charcoal-fired clay oven</p></div>
            <div className="feature-item reveal" data-delay="200"><div className="feature-icon"><i className="fas fa-star"></i></div><h4>Authentic Recipes</h4><p>Heritage Nepali &amp; Indian culinary traditions</p></div>
            <div className="feature-item reveal" data-delay="300"><div className="feature-icon"><i className="fas fa-heart"></i></div><h4>Warm Hospitality</h4><p>Family-friendly, welcoming atmosphere</p></div>
          </div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="dishes-section section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Chef's Picks</span>
            <h2>Featured <span className="gold">Dishes</span></h2>
            <p>A curated selection of our most celebrated dishes — from the clay oven to your table.</p>
            <div className="divider"></div>
          </div>
          <div className="dishes-grid">
            {dishes.map((d) => (
              <div className="dish-card reveal" data-delay={d.delay} key={d.name}>
                <div className="dish-img">
                  <img src={d.img} alt={d.name} loading="lazy" />
                  {d.badge && <span className="dish-badge">{d.badge}</span>}
                </div>
                <div className="dish-body">
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                  <div className="dish-footer">
                    <span className="dish-price">{d.price}</span>
                    <span className="dish-tag">{d.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/menu" className="btn btn-outline"><i className="fas fa-book-open"></i> Explore Full Menu</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal"><div className="stat-number"><span className="counter" data-target="500" data-suffix="+">0</span></div><div className="stat-label">Happy Customers Daily</div></div>
            <div className="stat-item reveal" data-delay="100"><div className="stat-number"><span className="counter" data-target="80" data-suffix="+">0</span></div><div className="stat-label">Menu Items</div></div>
            <div className="stat-item reveal" data-delay="200"><div className="stat-number"><span className="counter" data-target="10" data-suffix="+">0</span></div><div className="stat-label">Years of Excellence</div></div>
            <div className="stat-item reveal" data-delay="300"><div className="stat-number"><span className="counter" data-target="100" data-suffix="%">0</span></div><div className="stat-label">Halal Certified</div></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section section">
        <div className="container">
          <div className="why-grid">
            <div className="why-img-wrap reveal-left">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Restaurant ambiance" loading="lazy" />
              <div className="why-img-badge"><span className="number">100%</span><span className="label">Halal</span></div>
            </div>
            <div className="reveal-right">
              <span className="overline" style={{ color: "var(--gold)", fontSize: ".8rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Why Dine With Us</span>
              <h2 style={{ margin: ".75rem 0 1rem" }}>The Himalayan<br /><span className="gold">Difference</span></h2>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>We bring the authentic flavors of Nepal and India to your table with passion, precision, and a deep respect for culinary heritage.</p>
              <div className="why-list">
                <div className="why-item"><div className="why-icon"><i className="fas fa-seedling"></i></div><div className="why-text"><h4>Farm-Fresh Ingredients</h4><p>We source the freshest local produce and premium spices to ensure every dish bursts with authentic flavor.</p></div></div>
                <div className="why-item"><div className="why-icon"><i className="fas fa-fire"></i></div><div className="why-text"><h4>Traditional Clay Oven</h4><p>Our tandoor oven reaches 900°F, giving dishes the authentic smoky, charred perfection you can't replicate.</p></div></div>
                <div className="why-item"><div className="why-icon"><i className="fas fa-award"></i></div><div className="why-text"><h4>Award-Winning Chefs</h4><p>Our culinary team brings decades of expertise from Nepal and India, preserving recipes passed through generations.</p></div></div>
                <div className="why-item"><div className="why-icon"><i className="fas fa-users"></i></div><div className="why-text"><h4>Family &amp; Group Friendly</h4><p>Whether it's an intimate dinner or a celebration, our warm, spacious dining room welcomes everyone.</p></div></div>
              </div>
              <Link href="/about" className="btn btn-gold"><i className="fas fa-info-circle"></i> Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="reviews-section section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Customer Love</span>
            <h2>What Our Guests <span className="gold">Say</span></h2>
            <p>Real experiences from our wonderful guests who keep coming back for more.</p>
            <div className="divider"></div>
          </div>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div className="review-card reveal" data-delay={i * 100} key={r.name}>
                <div className="review-quote">&ldquo;</div>
                <div className="review-stars stars">{"★".repeat(r.stars)}</div>
                <p className="review-text">&quot;{r.text}&quot;</p>
                <div className="review-author">
                  <div className="review-avatar">{r.initial}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-source"><i className={r.icon}></i> {r.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a href="https://www.google.com/search?q=himalayan+flames+dearborn" target="_blank" rel="noreferrer" className="btn btn-outline"><i className="fab fa-google"></i> See All Google Reviews</a>
          </div>
        </div>
      </section>

      {/* ORDER CTA */}
      <section className="order-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Enjoy our authentic Nepali &amp; Indian cuisine from the comfort of your home — available on all major platforms.</p>
          <div className="order-cta">
            <a href={CLOVER} target="_blank" rel="noreferrer" className="btn btn-gold"><i className="fas fa-globe"></i> Order Online</a>
            <a href={UBER} target="_blank" rel="noreferrer" className="btn btn-outline"><i className="fas fa-motorcycle"></i> Uber Eats</a>
            <a href={DOORDASH} target="_blank" rel="noreferrer" className="btn btn-outline"><i className="fas fa-car"></i> DoorDash</a>
          </div>
        </div>
      </section>

      {/* DELIVERY STRIP */}
      <div className="delivery-strip">
        <div className="container">
          <div className="delivery-inner">
            <span className="delivery-label">Also available on</span>
            <div className="delivery-logos">
              <a href={UBER} target="_blank" rel="noreferrer"><i className="fas fa-motorcycle"></i> Uber Eats</a>
              <a href={GRUBHUB} target="_blank" rel="noreferrer"><i className="fas fa-utensils"></i> Grubhub</a>
              <a href={DOORDASH} target="_blank" rel="noreferrer"><i className="fas fa-car"></i> DoorDash</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <RevealEffects />
    </>
  );
}
