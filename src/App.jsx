import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';


const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bloom-shine-api.onrender.com' 
  : 'http://localhost:5000';


function PurchaseDrawer({ open, onClose }) {
  const [form, setForm] = useState({
    firstName: '',
    secondName: '',
    phone: '',
    email: '',
    city: '',
    town: '',
    address1: '',
    address2: '',
    quantity: 1,
    price: 500,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'First name required';
    if (!form.secondName) errs.secondName = 'Second name required';
    if (!form.phone || !/^\d{10,}$/.test(form.phone)) errs.phone = 'Valid phone required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.city) errs.city = 'City required';
    if (!form.town) errs.town = 'Town required';
    if (!form.address1) errs.address1 = 'Address line 1 required';
    if (!form.quantity || form.quantity < 1) errs.quantity = 'Quantity must be at least 1';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuantity = (delta) => {
    setForm(prev => {
      const newQuantity = Math.max(1, Number(prev.quantity) + delta);
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setForm({
              firstName: '',
              secondName: '',
              phone: '',
              email: '',
              city: '',
              town: '',
              address1: '',
              address2: '',
              quantity: 1,
              price: 500,
            });
            
            onClose();
          }, 2000);
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="drawer-overlay">
      <div className="drawer">
        <button className="drawer-close" onClick={onClose}>×</button>
        {success ? (
          <div className="order-success">Order placed successfully!</div>
        ) : (
          <form className="purchase-form" onSubmit={handleSubmit}>
            <h3>Purchase Details</h3>
            <div className="purchase-form-row">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                {errors.firstName && <div className="form-error">{errors.firstName}</div>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="secondName" placeholder="Second Name" value={form.secondName} onChange={handleChange} />
                {errors.secondName && <div className="form-error">{errors.secondName}</div>}
              </div>
            </div>
            <div className="purchase-form-row">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>
            <div className="purchase-form-row">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input name="town" placeholder="Town" value={form.town} onChange={handleChange} />
                {errors.town && <div className="form-error">{errors.town}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input name="address1" placeholder="Shipping Address Line 1" value={form.address1} onChange={handleChange} />
              {errors.address1 && <div className="form-error">{errors.address1}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input name="address2" placeholder="Shipping Address Line 2 (optional)" value={form.address2} onChange={handleChange} />
            </div>

            <div className="quantity-controls">
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantity(-1)}
                aria-label="Decrease quantity"
              >−</button>
              <input
                name="quantity"
                type="number"
                min="1"
                style={{ width: 60, textAlign: 'center' }}
                value={form.quantity}
                onChange={handleChange}
              />
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantity(1)}
                aria-label="Increase quantity"
              >+</button>
            </div>
            {errors.quantity && <div className="form-error">{errors.quantity}</div>}

            <div className="form-price">Price: Kshs{form.price * form.quantity}</div>
            <button type="submit" className="cta-button">Place Order</button>
          </form>
        )}
      </div>
    </div>
  );
}

// Update ProductDetails to use the drawer
function ProductDetails() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="product-details-modern-bg">
      <div className="product-details-modern-card">
        <div className="product-details-modern-image-col">
          <img
            src="/hair-oil-bottle.png"
            alt="Bloom&Shine Hair Oil"
            className="product-details-modern-image"
          />
          <div className="product-badge">100% Natural</div>
        </div>
        <div className="product-details-modern-info-col">
          <h2 className="product-title-modern">Bloom&Shine Hair Oil</h2>
          <p className="product-modern-desc">
            <span className="product-highlight">Best Seller</span> <br />
            Experience the nourishing power of Bloom&Shine Hair Oil. Our unique blend revitalizes your hair, leaving it shiny, soft, and healthy. 
            <br /><br />
            <strong>Benefits:</strong>
            <ul className="product-benefits-list">
              <li>Promotes hair growth</li>
              <li>Reduces dandruff & dryness</li>
              <li>Strengthens roots</li>
              <li>100% natural ingredients</li>
            </ul>
          </p>
          <div className="product-modern-price">Kshs500</div>
          <button className="buy-button-modern" onClick={() => setDrawerOpen(true)}>
            <span role="img" aria-label="cart">🛒</span> Buy Now
          </button>
          <Link to="/" className="cta-button-modern">Back to Home</Link>
        </div>
      </div>
      <PurchaseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">Bloom&Shine</div>
        <ul className="navbar-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/product-details">Shop</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-column hero-image-col">
            <img
              src="/hair-oil-bottle.png  "
              alt="Bloom&Shine Hair Oil Bottle"
              className="hero-image"
            />
          </div>
          <div className="hero-column hero-text-col">
            <h1>
              Bloom<span style={{ color: '#3ecf8e' }}>&</span>Shine Hair Oil
            </h1>
            <p className="tagline">
              Reveal your hair’s natural beauty with our nourishing, all-natural blend.
            </p>
            <a href="#shop" className="cta-button">Shop Now</a>
          </div>
        </div>
      </header>
      {/* Products Section */}
      <section className="products-section">
        <h2>Our Product</h2>
        <div className="product-card">
          <Link to="/product-details" className="product-link">
            <img src="/hair-oil-bottle.png" alt="Bloom&Shine Hair Oil" className="product-image" />
            <div className="product-info">
              <h3>Bloom&Shine 50ml </h3>
              <p className="product-price"> Kshs500.00 </p>
            </div>
          </Link>
        </div>
      </section>
      <footer className="App-footer">
        <p>&copy; 2025 Bloom&Shine. All rights reserved.</p>
      </footer>
    </>
  );
}

function ContactPage() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p className="contact-intro">
        Have questions or want to know more about Bloom&Shine? Reach out to us!
      </p> 
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows={5} required />
        <button type="submit" className="cta-button">Send Message</button>
      </form>
      <div className="contact-details"> 
        <p><strong>Email:</strong> Bloom&shine@gmail.com </p>
        <p><strong>Phone:</strong> +254 702962902  </p>
      </div>
    </div>
  );  
}

function About() {
  return (
    <div className="about-page" style={{maxWidth: 600, margin: "120px auto 40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(62,207,142,0.10)", padding: "32px 20px 28px 20px", textAlign: "center"}}>
      <h2>About Bloom&Shine</h2>
      <p>
        Bloom&Shine is dedicated to providing natural, nourishing hair oil that revitalizes your hair and brings out its natural shine. Our unique blend is crafted with care to promote healthy, beautiful hair for everyone.
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
