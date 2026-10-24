import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <a className="navbar-logo" href="/">
        WowVisit
      </a>

      {scrolled && (
        <nav className="navbar-links" aria-label="Main navigation">
          <a href="#flights">Flights</a>
          <a href="#hotels">Hotels</a>
          <a href="#tours">Tours</a>
        </nav>
      )}

      <button className="login-button" type="button">
        Sign in
      </button>
    </header>
  );
}

export default Navbar;