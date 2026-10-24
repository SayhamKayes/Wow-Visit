import "./SearchTabs.css";

const tabs = [
  { name: "Flight", icon: "✈" },
  { name: "Hotel", icon: "▥" },
  { name: "Tour", icon: "♧" },
  { name: "Visa", icon: "▣" },
];

function SearchTabs({ activeTab, onTabChange }) {
  return (
    <div className="search-tabs" role="group" aria-label="Travel service">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          type="button"
          className={`search-tab ${activeTab === tab.name ? "is-active" : ""}`}
          aria-pressed={activeTab === tab.name}
          onClick={() => onTabChange(tab.name)}
        >
          <span className="search-tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
          {tab.name}
        </button>
      ))}
    </div>
  );
}

export default SearchTabs;