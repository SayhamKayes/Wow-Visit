import "./OffersBoard.css";

function makeImage(background, title, subtitle, accent = "#ffffff") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360">
      <rect width="600" height="360" rx="18" fill="${background}" />
      <text
        x="300" y="172"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="42"
        font-weight="700"
        fill="${accent}"
      >${title}</text>
      <text
        x="300" y="222"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="#ffffff"
      >${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const hotDeals = [
  {
    id: "city-18",
    image: makeImage("#070866", "18% Savings*", "City Bank · AMEX", "#ffce32"),
    imageAlt: "Placeholder artwork for 18 percent savings",
    title: "Up to 18% Discount on Int’l Flight Bookings",
    description:
      "On base fare, for City Bank American Express® Platinum & Gold credit cards. Till 31 Dec’26",
    
  },
  {
    id: "city-30000",
    image: makeImage("#070866", "BDT 30,000", "savings* · City Bank AMEX", "#ffce32"),
    imageAlt: "Placeholder artwork for BDT 30,000 savings",
    title: "Up to BDT 30,000 Discount on Int’l Flight Bookings",
    description:
      "On total fare, for City Bank American Express® Ultramarine credit cards. Min. purchase value has to be BDT 50,000. Till 30 Sept’27.",
    
  },
];

const specialOffers = [
  {
    id: "qatar",
    image: makeImage("#390014", "QATAR", "AIRWAYS"),
    imageAlt: "Qatar Airways placeholder artwork",
    title: "Qatar Airways Special Fare to Lisbon",
  },
  {
    id: "air-india",
    image: makeImage("#a41e0b", "AIR INDIA", "Explore European routes"),
    imageAlt: "Air India placeholder artwork",
    title: "Get Up to 22% Discount on Selected European Routes",
  },
  {
    id: "tropical-daisy",
    image: makeImage("#176477", "Tropical Daisy", "HOTEL · GULSHAN, DHAKA"),
    imageAlt: "Hotel Tropical Daisy placeholder artwork",
    title:
      "Hotel Tropical Daisy – Panorama Lake View Deluxe Deal from BDT 3,399/night",
  },
];

function OffersBoard() {
  function showDemoNotice() {
    window.alert(
      "This is a demo offer copied from the reference. No live promotion or booking is available."
    );
  }

  return (
    <div className="offers-board">
      

      <section className="offers-section" aria-labelledby="hot-deals-title">
        <h2 id="hot-deals-title">Hot Deals</h2>

        <div className="hot-deals-grid">
          {hotDeals.map((deal) => (
            <article className="hot-deal-card" key={deal.id}>
              <img
                className="hot-deal-image"
                src={deal.image}
                alt={deal.imageAlt}
                loading="lazy"
              />

              <div className="hot-deal-content">
                <h3>{deal.title}</h3>
                <p>{deal.description}</p>
              </div>

              <div className="hot-deal-footer">
                
                <button
                  type="button"
                  className="offer-button"
                  onClick={showDemoNotice}
                  aria-label={`Learn more about ${deal.title}`}
                >
                  ↗ Learn More
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="offers-section"
        aria-labelledby="special-offers-title"
      >
        <h2 id="special-offers-title">Special Offers</h2>

        <div className="special-offers-grid">
          {specialOffers.map((offer) => (
            <article className="special-offer-card" key={offer.id}>
              <img
                className="special-offer-image"
                src={offer.image}
                alt={offer.imageAlt}
                loading="lazy"
              />

              <h3>{offer.title}</h3>

              <button
                type="button"
                className="offer-button"
                onClick={showDemoNotice}
                aria-label={`Learn more about ${offer.title}`}
              >
                ↗ Learn More
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OffersBoard;