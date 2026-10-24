import "./Footer.css";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            WowVisit
          </a>
          <p>Your next journey starts here. A travel website built for learning.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <h3>Explore</h3>
          <a href="#flights">Flights</a>
          <a href="#hotels">Hotels</a>
          <a href="#tours">Tours</a>
        </nav>

        <div className="footer-about">
          <h3>About Us</h3>
          <p>
            travel booking platforms.
            
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} WowVisit.
        </p>
        <p>.</p>
      </div>
    </footer>
  );
}
