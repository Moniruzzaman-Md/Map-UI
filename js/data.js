// Shared master data for the mynztrip.com design pages: the system country
// list and every supplier's country list + mapping state. Both
// country-system.html and country-supplier.html read from this single
// source so the two pages never drift out of sync (e.g. for the System
// page's cross-supplier mapping Summary).

// nationality is optional (null allowed) — Singapore, Qatar, and Nepal are
// left unset below on purpose, as demo cases for the null state.
const SYSTEM_COUNTRIES = [
  { name: "United States", code: "US", nationality: "American" },
  { name: "United Kingdom", code: "GB", nationality: "British" },
  { name: "Canada", code: "CA", nationality: "Canadian" },
  { name: "Australia", code: "AU", nationality: "Australian" },
  { name: "India", code: "IN", nationality: "Indian" },
  { name: "Germany", code: "DE", nationality: "German" },
  { name: "France", code: "FR", nationality: "French" },
  { name: "Japan", code: "JP", nationality: "Japanese" },
  { name: "China", code: "CN", nationality: "Chinese" },
  { name: "Brazil", code: "BR", nationality: "Brazilian" },
  { name: "United Arab Emirates", code: "AE", nationality: "Emirati" },
  { name: "Singapore", code: "SG", nationality: null },
  { name: "Italy", code: "IT", nationality: "Italian" },
  { name: "Spain", code: "ES", nationality: "Spanish" },
  { name: "Netherlands", code: "NL", nationality: "Dutch" },
  { name: "Switzerland", code: "CH", nationality: "Swiss" },
  { name: "Sweden", code: "SE", nationality: "Swedish" },
  { name: "Norway", code: "NO", nationality: "Norwegian" },
  { name: "Thailand", code: "TH", nationality: "Thai" },
  { name: "Malaysia", code: "MY", nationality: "Malaysian" },
  { name: "Indonesia", code: "ID", nationality: "Indonesian" },
  { name: "New Zealand", code: "NZ", nationality: "New Zealander" },
  { name: "South Korea", code: "KR", nationality: "South Korean" },
  { name: "South Africa", code: "ZA", nationality: "South African" },
  { name: "Mexico", code: "MX", nationality: "Mexican" },
  { name: "Turkey", code: "TR", nationality: "Turkish" },
  { name: "Qatar", code: "QA", nationality: null },
  { name: "Saudi Arabia", code: "SA", nationality: "Saudi" },
  { name: "Egypt", code: "EG", nationality: "Egyptian" },
  { name: "Portugal", code: "PT", nationality: "Portuguese" },
  { name: "Ireland", code: "IE", nationality: "Irish" },
  { name: "Greece", code: "GR", nationality: "Greek" },
  { name: "Vietnam", code: "VN", nationality: "Vietnamese" },
  { name: "Philippines", code: "PH", nationality: "Filipino" },
  { name: "Sri Lanka", code: "LK", nationality: "Sri Lankan" },
  { name: "Nepal", code: "NP", nationality: null },
];

SYSTEM_COUNTRIES.forEach((c, i) => {
  c.id = i;
  c.history = [];
});

// sample history for a couple of countries, for demo purposes
SYSTEM_COUNTRIES[0].history.push(
  { operation: "Edit", name: "United States", description: "Name: USA -> United States", userName: "Farhan Ahmed", userEmail: "farhan.ahmed@mynztrip.com", timestamp: new Date("2026-06-18T09:12:00") },
  { operation: "Edit", name: "United States of America", description: "Name: United States -> United States of America", userName: "Nusrat Jahan", userEmail: "nusrat.jahan@mynztrip.com", timestamp: new Date("2026-06-20T14:47:00") },
  // Mirrors supplierCountries.agoda[0] / supplierCountries.hotelbeds[0]'s own
  // seeded "Create" entries below (same users/timestamps), viewed from the
  // system country's side — see SYSTEM_CITIES' matching comment above for
  // why this demo needs both sides pre-seeded rather than created live.
  { operation: "Map", description: "Agoda — United States — ID: AG-US-001", userName: "Farhan Ahmed", userEmail: "farhan.ahmed@mynztrip.com", timestamp: new Date("2026-06-18T09:12:00") },
  { operation: "Map", description: "HotelBeds — USA — ID: HB_USA", userName: "Rafiul Karim", userEmail: "rafiul.karim@mynztrip.com", timestamp: new Date("2026-06-25T15:30:00") }
);
SYSTEM_COUNTRIES[4].history.push(
  { operation: "Edit", name: "India", description: "Name: Bharat -> India", userName: "Rafiul Karim", userEmail: "rafiul.karim@mynztrip.com", timestamp: new Date("2026-05-30T11:05:00") }
);

// restore any name edits saved from a previous session
hydrateArray(SYSTEM_COUNTRIES, loadFromStorage("SYSTEM_COUNTRIES"));

// Computed after hydration so a renamed country's code still resolves
// correctly (this is a name-keyed lookup, built from whatever names are
// current, not the ones baked into the literal array above).
const SYSTEM_COUNTRY_CODES = Object.fromEntries(SYSTEM_COUNTRIES.map((c) => [c.name, c.code]));

// A country's code is the one part of it that's never editable (see
// country-system.html's Edit Country modal), so it's the stable key to
// resolve a CURRENT country name through — anything that stored a country
// as a { name, code } snapshot (SYSTEM_CITIES, SYSTEM_HOTELS) should
// display via this instead of the snapshot's own .name, or a rename on
// country-system.html won't show up anywhere that snapshot was taken.
function getSystemCountryName(code) {
  const match = SYSTEM_COUNTRIES.find((c) => c.code === code);
  return match ? match.name : null;
}

// Appends a system country's code to its name for mapping-history text
// (e.g. "India (IN)") — used instead of a bare name wherever a supplier
// country's own changelog references the system-country side, mirroring how
// the city version's changelog already carries the system city's own
// identifying details via getSystemCityHistoryLabel(). Falls back to the
// bare name if the code can't be resolved (e.g. a stale name snapshot that
// predates a rename no longer in SYSTEM_COUNTRY_CODES).
function getSystemCountryNameWithCode(name) {
  if (!name) return name;
  const code = SYSTEM_COUNTRY_CODES[name];
  return code ? `${name} (${code})` : name;
}

const SUPPLIER_LABELS = {
  agoda: "Agoda",
  booking: "Booking.com",
  hotelbeds: "HotelBeds",
  tbo: "TBO Holidays",
};

const supplierCountries = {
  agoda: [
    { name: "United States", code: "US", supplierId: "AG-US-001", systemCountry: "United States" },
    { name: "United Kingdom", code: "GB", supplierId: "AG-GB-002", systemCountry: "United Kingdom" },
    { name: "Bharat", code: "IN", supplierId: "AG-IN-014", systemCountry: null },
    { name: "Deutschland", code: "DE", supplierId: "AG-DE-021", systemCountry: null },
    { name: "France", code: "FR", supplierId: "AG-FR-033", systemCountry: "France" },
    { name: "Japan", code: "JP", supplierId: "AG-JP-045", systemCountry: "Japan" },
    { name: "Singapore", code: "SG", supplierId: "AG-SG-050", systemCountry: "Singapore" },
    { name: "Thailand", code: "TH", supplierId: "AG-TH-062", systemCountry: null },
    { name: "Australia", code: "AU", supplierId: "AG-AU-071", systemCountry: "Australia" },
    { name: "Canada", code: "CA", supplierId: "AG-CA-080", systemCountry: null },
    // Deliberately absurd-length name/id — a stress-test entry for the
    // Supplier Hotel List's "very long value in every field" demo row
    // below, exercising the Country column's fade/truncation the same way
    // that row's own name/address/etc. do.
    {
      name: "The United Federative Democratic Republic of Testlandia and Overseas Territories",
      code: "ZZ",
      supplierId: "AG-ZZ-999999999-EXTREMELY-VERBOSE-STRESS-TEST-SUPPLIER-COUNTRY-IDENTIFIER-CODE",
      systemCountry: null,
    },
  ],
  booking: [
    { name: "United States", code: "US", supplierId: "10023456", systemCountry: "United States" },
    { name: "United Kingdom", code: "GB", supplierId: "10023789", systemCountry: "United Kingdom" },
    { name: "India", code: "IN", supplierId: "10024011", systemCountry: "India" },
    { name: "Germany", code: "DE", supplierId: "10024456", systemCountry: null },
    { name: "Spain", code: "ES", supplierId: "10024900", systemCountry: null },
    { name: "Italy", code: "IT", supplierId: "10025123", systemCountry: "Italy" },
    { name: "Netherlands", code: "NL", supplierId: "10025560", systemCountry: null },
    { name: "Turkiye", code: "TR", supplierId: "10025980", systemCountry: null },
    { name: "Canada", code: "CA", supplierId: "10026400", systemCountry: null },
  ],
  hotelbeds: [
    { name: "USA", code: "US", supplierId: "HB_USA", systemCountry: "United States" },
    { name: "GBR", code: "GB", supplierId: "HB_GBR", systemCountry: "United Kingdom" },
    { name: "UAE", code: "AE", supplierId: "HB_ARE", systemCountry: "United Arab Emirates" },
    { name: "SAU", code: "SA", supplierId: "HB_SAU", systemCountry: null },
    { name: "QAT", code: "QA", supplierId: "HB_QAT", systemCountry: null },
    { name: "EGY", code: "EG", supplierId: "HB_EGY", systemCountry: "Egypt" },
    { name: "MEX", code: "MX", supplierId: "HB_MEX", systemCountry: null },
    { name: "THA", code: "TH", supplierId: "HB_THA", systemCountry: null },
    { name: "MYS", code: "MY", supplierId: "HB_MYS", systemCountry: null },
    // Was missing even though the hand-authored "Marina Bay Sands" hotel
    // below is set in Singapore (code "SG") — without this entry that row
    // fell back to showing the bare code for both name and id ("SG SG")
    // instead of a real supplier country, the exact inconsistency with
    // country-supplier.html's own Supplier Country list this fixes.
    { name: "SGP", code: "SG", supplierId: "HB_SGP", systemCountry: "Singapore" },
  ],
  tbo: [
    { name: "India", code: "IN", supplierId: "1", systemCountry: "India" },
    { name: "Nepal", code: "NP", supplierId: "155", systemCountry: "Nepal" },
    { name: "Sri Lanka", code: "LK", supplierId: "162", systemCountry: null },
    { name: "Malaysia", code: "MY", supplierId: "118", systemCountry: "Malaysia" },
    { name: "Indonesia", code: "ID", supplierId: "95", systemCountry: null },
    { name: "Vietnam", code: "VN", supplierId: "233", systemCountry: null },
    { name: "Philippines", code: "PH", supplierId: "168", systemCountry: "Philippines" },
    // Was missing even though the hand-authored "Shangri-La Bangkok" hotel
    // below is set in Thailand (code "TH") — same fallback bug as HotelBeds'
    // missing Singapore entry above.
    { name: "Thailand", code: "TH", supplierId: "204", systemCountry: "Thailand" },
  ],
};

// ---------- Bulk demo suppliers ----------
// 50 extra suppliers on top of the 4 hand-authored ones, so the screens that
// list every supplier are exercised at a realistic deployment's scale rather
// than at four. Names are a fixed 10x5 word-pair grid (deterministic, no
// randomness, so ids and order are identical on every load) and the keys are
// the slugged names. Each gets 2-3 countries and a slice of the shared bulk
// city-name pool further down; nothing here is mapped to a system city, and
// none of them get supplier hotels at all (every consumer already reads
// supplierHotels[key] || []) — 310 hotels x 50 suppliers would multiply the
// demo's data volume for no extra coverage, since these exist to test
// breadth (how many suppliers), not depth (how much data per supplier).
const BULK_SUPPLIER_PREFIXES = [
  "Skyline",
  "Blue Orbit",
  "Nomad",
  "Vertex",
  "Harborline",
  "Solstice",
  "Lantern",
  "Cobalt",
  "Meridian",
  "Zephyr",
];
const BULK_SUPPLIER_SUFFIXES = ["Travel", "Stays", "Holidays", "Rooms", "Getaways"];

const BULK_SUPPLIER_COUNTRY_POOL = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Japan", code: "JP" },
  { name: "Singapore", code: "SG" },
  { name: "Australia", code: "AU" },
];

const BULK_SUPPLIER_KEYS = [];

BULK_SUPPLIER_PREFIXES.forEach((prefix, p) => {
  BULK_SUPPLIER_SUFFIXES.forEach((suffix, s) => {
    const index = p * BULK_SUPPLIER_SUFFIXES.length + s;
    const label = `${prefix} ${suffix}`;
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, "");
    BULK_SUPPLIER_KEYS.push(key);
    SUPPLIER_LABELS[key] = label;

    // 2-3 countries each, walked round-robin through the pool so different
    // suppliers cover different countries instead of all starting at the US.
    const countryCount = 2 + (index % 2);
    supplierCountries[key] = Array.from({ length: countryCount }, (_, i) => {
      const meta = BULK_SUPPLIER_COUNTRY_POOL[(index + i) % BULK_SUPPLIER_COUNTRY_POOL.length];
      return {
        name: meta.name,
        code: meta.code,
        supplierId: `${key.slice(0, 3).toUpperCase()}-${meta.code}-${String(index + 1).padStart(3, "0")}`,
        // Only the first country is mapped to its system counterpart, so
        // these suppliers show a partly-mapped state rather than a
        // uniformly empty or uniformly complete one.
        systemCountry: i === 0 ? meta.name : null,
      };
    });
  });
});

// Looks up how a specific supplier names a country (by real-world ISO code),
// e.g. getSupplierCountryName("hotelbeds", "US") -> "USA". Keeps the city
// list's country display in sync with that supplier's own country list
// instead of duplicating a possibly-inconsistent name.
function getSupplierCountryName(supplierKey, code) {
  const row = (supplierCountries[supplierKey] || []).find((c) => c.code === code);
  return row ? row.name : code;
}

// Looks up that supplier's own country identifier (by real-world ISO
// code) — e.g. getSupplierCountrySupplierId("agoda", "US") -> "AG-US-001",
// the same id shown as country-supplier.html's own ID column — rather than
// the plain 2-letter code, which isn't what that supplier's feed actually
// keys its country by.
function getSupplierCountrySupplierId(supplierKey, code) {
  const row = (supplierCountries[supplierKey] || []).find((c) => c.code === code);
  return row ? row.supplierId : code;
}

// Looks up whether/how a specific supplier maps a given system country name
// to one of its own country rows — e.g.
// findSupplierCountryBySystemCountry("agoda", "United States") -> the
// AG-US-001 row. Returns null if that supplier has no country row whose
// systemCountry equals the given name (covers both "supplier doesn't operate
// there" and "operates there but it's explicitly unmapped", e.g. Agoda's
// Bharat/IN row).
function findSupplierCountryBySystemCountry(supplierKey, systemCountryName) {
  if (!systemCountryName) return null;
  return (supplierCountries[supplierKey] || []).find((c) => c.systemCountry === systemCountryName) || null;
}

// stable per-supplier row ids + history log
Object.keys(supplierCountries).forEach((key) => {
  supplierCountries[key].forEach((row, i) => {
    row.id = i;
    row.history = [];
  });
});

// sample mapping history for demo purposes
supplierCountries.agoda[0].history.push({
  operation: "Map",
  systemCountry: "United States",
  description: "United States (US)",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-18T09:12:00"),
});
supplierCountries.hotelbeds[0].history.push({
  operation: "Map",
  systemCountry: "United States",
  description: "United States (US)",
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-25T15:30:00"),
});

// restore any edits/mappings saved from a previous session
hydrateObject(supplierCountries, loadFromStorage("supplierCountries"));

// Looks up, for a given system country name, whether/where each supplier maps it.
// A supplier can have more than one of its own country rows mapped to the
// same system country at once, so each entry carries a `countries` array
// (filter, not find) rather than a single match.
// Returns [{ supplierKey, supplierLabel, mapped, countries: [row, ...] }]
function getMappingSummary(systemCountryName) {
  return Object.keys(SUPPLIER_LABELS).map((key) => {
    const countries = (supplierCountries[key] || []).filter((row) => row.systemCountry === systemCountryName);
    return {
      supplierKey: key,
      supplierLabel: SUPPLIER_LABELS[key],
      mapped: countries.length > 0,
      countries,
    };
  });
}

// ---------- City (System) ----------

// Only US and Canada carry a state/province in this system. In the real
// system this list is fetched per-country from the backend; this stands in
// for that API response.
const STATES_BY_COUNTRY_CODE = {
  US: ["California", "Texas", "New York", "Florida", "Illinois", "Washington", "Georgia", "Nevada"],
  CA: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Nova Scotia"],
};

function getStatesForCountryCode(code) {
  return STATES_BY_COUNTRY_CODE[code] || [];
}

const BULK_NAME_PREFIXES = ["North", "South", "East", "West", "New", "Lake", "Port", "Fort", "Mount", "Spring", "River", "Green", "Sunset", "Maple", "Oak", "Pine", "Cedar", "Elm", "Willow", "Birch"];
const BULK_NAME_SUFFIXES = ["ville", "town", "burg", "field", "wood", "land", "haven", "view", "dale", "ford", "port", "ridge", "brook", "glen", "shore"];

// Deterministically combines the word lists above into up to prefixes.length
// * suffixes.length plausible-sounding city names — used to bulk out demo
// data to a realistic scale (200+ rows) for testing pagination/search/filter
// UI, since the hand-authored seed list above is intentionally small.
// `altOrder` swaps which list is iterated outer/inner, so a second call with
// the same word lists only partially overlaps with the first instead of
// producing identical names in identical order — closer to how a real
// supplier's own city list only partially matches the system list.
function generateBulkCityNames(count, altOrder) {
  const outer = altOrder ? BULK_NAME_SUFFIXES : BULK_NAME_PREFIXES;
  const inner = altOrder ? BULK_NAME_PREFIXES : BULK_NAME_SUFFIXES;
  const names = [];
  for (const a of outer) {
    for (const b of inner) {
      names.push(altOrder ? `${b}${a}` : `${a}${b}`);
      if (names.length === count) return names;
    }
  }
  return names;
}

const SYSTEM_CITIES = [
  { name: "New York", state: "New York", country: { name: "United States", code: "US" } },
  { name: "Los Angeles", state: "California", country: { name: "United States", code: "US" } },
  { name: "San Francisco", state: "California", country: { name: "United States", code: "US" } },
  { name: "Chicago", state: "Illinois", country: { name: "United States", code: "US" } },
  { name: "Miami", state: "Florida", country: { name: "United States", code: "US" } },
  { name: "Las Vegas", state: "Nevada", country: { name: "United States", code: "US" } },
  { name: "Seattle", state: "Washington", country: { name: "United States", code: "US" } },
  { name: "Atlanta", state: "Georgia", country: { name: "United States", code: "US" } },
  { name: "Houston", state: "Texas", country: { name: "United States", code: "US" } },
  { name: "Austin", state: "Texas", country: { name: "United States", code: "US" } },
  { name: "Toronto", state: "Ontario", country: { name: "Canada", code: "CA" } },
  { name: "Vancouver", state: "British Columbia", country: { name: "Canada", code: "CA" } },
  { name: "Montreal", state: "Quebec", country: { name: "Canada", code: "CA" } },
  { name: "Calgary", state: "Alberta", country: { name: "Canada", code: "CA" } },
  { name: "Ottawa", state: "Ontario", country: { name: "Canada", code: "CA" } },
  { name: "Winnipeg", state: "Manitoba", country: { name: "Canada", code: "CA" } },
  { name: "Halifax", state: "Nova Scotia", country: { name: "Canada", code: "CA" } },
  { name: "London", state: null, country: { name: "United Kingdom", code: "GB" } },
  { name: "Manchester", state: null, country: { name: "United Kingdom", code: "GB" } },
  { name: "Paris", state: null, country: { name: "France", code: "FR" } },
  { name: "Nice", state: null, country: { name: "France", code: "FR" } },
  { name: "Tokyo", state: null, country: { name: "Japan", code: "JP" } },
  { name: "Osaka", state: null, country: { name: "Japan", code: "JP" } },
  { name: "Singapore", state: null, country: { name: "Singapore", code: "SG" } },
  { name: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" } },
  { name: "Abu Dhabi", state: null, country: { name: "United Arab Emirates", code: "AE" } },
  { name: "Bangkok", state: null, country: { name: "Thailand", code: "TH" } },
  { name: "Kuala Lumpur", state: null, country: { name: "Malaysia", code: "MY" } },
  { name: "Sydney", state: null, country: { name: "Australia", code: "AU" } },
  { name: "Melbourne", state: null, country: { name: "Australia", code: "AU" } },
  { name: "Mumbai", state: null, country: { name: "India", code: "IN" } },
  { name: "Delhi", state: null, country: { name: "India", code: "IN" } },
  { name: "Rome", state: null, country: { name: "Italy", code: "IT" } },
  { name: "Milan", state: null, country: { name: "Italy", code: "IT" } },
  { name: "Berlin", state: null, country: { name: "Germany", code: "DE" } },
  { name: "Munich", state: null, country: { name: "Germany", code: "DE" } },
];

// Bulk demo cities for pagination/search/filter testing at realistic scale —
// 200 more United States cities, spread across its existing states, on top
// of the hand-authored US entries above. Matched by a same-size bulk batch
// of Agoda supplier cities for the US further below, so the mapping UI has
// something realistic to page/search/filter through too, not just the
// curated examples.
generateBulkCityNames(200).forEach((name, i) => {
  SYSTEM_CITIES.push({
    name,
    state: STATES_BY_COUNTRY_CODE.US[i % STATES_BY_COUNTRY_CODE.US.length],
    country: { name: "United States", code: "US" },
  });
});

SYSTEM_CITIES.forEach((c, i) => {
  c.id = i;
  c.history = [];
  c.active = true;
});
const SEED_CITY_COUNT = SYSTEM_CITIES.length;

// sample edit history for demo purposes
SYSTEM_CITIES[0].history.push({
  operation: "Edit",
  name: "New York",
  description: "Name: New York City -> New York",
  userName: "Nusrat Jahan",
  userEmail: "nusrat.jahan@mynztrip.com",
  timestamp: new Date("2026-06-10T10:20:00"),
});

// sample mapping history, mirroring the seeded supplierCities.agoda[0] /
// supplierCities.booking[0] / supplierCities.agoda[8] entries below (same
// actions, same users/times, viewed from the system city's side) — see the
// comment there for why this demo needs its history pre-seeded rather than
// created live.
SYSTEM_CITIES[0].history.push({
  operation: "Map",
  description: "Agoda — New York City (US) — ID: AG-US-001",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-19T13:40:00"),
});
SYSTEM_CITIES[0].history.push({
  operation: "Map",
  description: "Booking.com — New York (US) — ID: 20050000",
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-20T09:15:00"),
});
SYSTEM_CITIES[0].history.push({
  operation: "Map",
  description: "Agoda — Manhattan (US) — ID: AG-US-009",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-21T11:05:00"),
});

// Demo city added via Add City, pre-seeded here rather than requiring the
// Add City feature to be used live — a live-created city only exists in
// localStorage, and some browsers (Firefox) partition that per file://
// document, so a deep link that depends on it silently can't find it when
// the project is opened as local files instead of served over http. This
// example lives directly in this seed data instead, exactly like every
// prepopulated city above, so the Map/Summary features are demoable with
// zero setup regardless of how the project is opened. It carries no special
// status of any kind — an added city is an ordinary system city.
const DEMO_NEW_CITY_ID = SYSTEM_CITIES.length;
SYSTEM_CITIES.push({
  id: DEMO_NEW_CITY_ID,
  name: "Crestwood Bay",
  state: "Florida",
  country: { name: "United States", code: "US" },
  active: true,
  history: [
    {
      operation: "Create",
      name: "Crestwood Bay",
      description: "Name: Crestwood Bay, State: Florida, Country: United States (US)",
      userName: "Nusrat Jahan",
      userEmail: "nusrat.jahan@mynztrip.com",
      timestamp: new Date("2026-06-22T14:00:00"),
    },
  ],
});

// restore any edits/added cities saved from a previous session
hydrateArray(SYSTEM_CITIES, loadFromStorage("SYSTEM_CITIES"));

// Every system city is now equal — there is no New City / Merged City status
// any more (a city's type never decides what can be mapped to it, and a
// system city can never be mapped to another system city at all). A save
// written by an older build of the app still carries the retired cityType/
// mergedFrom fields, so strip them immediately after hydrating — before any
// other section of this file reads a city — rather than depending on the
// user clearing localStorage by hand. A city that used to be "merged" simply
// becomes an ordinary city, keeping its own name/state/country/history.
SYSTEM_CITIES.forEach((c) => {
  delete c.cityType;
  delete c.mergedFrom;
});

// ---------- System Hotel ----------
// Plain literal fields (name/address/lat/long/starRating/city/state/country),
// same shape philosophy as SYSTEM_CITIES above — not a foreign key into
// SYSTEM_CITIES, matching how city/state/country are just literals there too.

// systemCityId is hardcoded per seed hotel (matching SYSTEM_CITIES' fixed
// definition-order indices above) rather than computed by matching name +
// country code at runtime — a name-match retrofit is fragile against a
// rename that happens before a hotel's systemCityId is ever computed (e.g.
// renaming "Los Angeles" before hotel-system.html has ever loaded once
// would permanently fail to find "Los Angeles" and leave The Beverly
// Hilton unlinked). city/state/country below are still the display
// snapshot (kept for the same reasons as elsewhere), but the reference is
// the actual source of truth wherever it's set.
const SYSTEM_HOTELS = [
  { name: "Grand Plaza New York", address: "123 5th Ave", latitude: 40.7128, longitude: -74.006, starRating: 5, city: "New York", state: "New York", country: { name: "United States", code: "US" }, systemCityId: 0, email: "reservations@grandplazanewyork.com", phoneNumber: "+1 212 555 0101", providerId: "PRV-1001" },
  { name: "The Beverly Hilton", address: "9876 Wilshire Blvd", latitude: 34.0522, longitude: -118.2437, starRating: 4, city: "Los Angeles", state: "California", country: { name: "United States", code: "US" }, systemCityId: 1, email: "info@beverlyhilton.com", phoneNumber: "+1 310 555 0172", providerId: "PRV-1002" },
  { name: "The Peninsula Chicago", address: "108 E Superior St", latitude: 41.8955, longitude: -87.6244, starRating: 5, city: "Chicago", state: "Illinois", country: { name: "United States", code: "US" }, systemCityId: 3, email: "reservations@peninsulachicago.com", phoneNumber: "+1 312 555 0134", providerId: "PRV-1003" },
  { name: "Fairmont Royal York", address: "100 Front St W", latitude: 43.6455, longitude: -79.3806, starRating: 4, city: "Toronto", state: "Ontario", country: { name: "Canada", code: "CA" }, systemCityId: 10, email: "frontdesk@fairmontroyalyork.com", phoneNumber: "+1 416 555 0198", providerId: "PRV-1004" },
  { name: "The Savoy London", address: "Strand", latitude: 51.51, longitude: -0.12, starRating: 5, city: "London", state: null, country: { name: "United Kingdom", code: "GB" }, systemCityId: 17, email: "info@thesavoylondon.co.uk", phoneNumber: "+44 20 7555 0123", providerId: "PRV-1005" },
  { name: "Hotel Ritz Paris", address: "15 Place Vendome", latitude: 48.8683, longitude: 2.3289, starRating: 5, city: "Paris", state: null, country: { name: "France", code: "FR" }, systemCityId: 19, email: "reservation@ritzparis.fr", phoneNumber: "+33 1 55 55 0145", providerId: "PRV-1006" },
  { name: "Hotel Adlon Berlin", address: "Pariser Platz 3", latitude: 52.5163, longitude: 13.3777, starRating: 5, city: "Berlin", state: null, country: { name: "Germany", code: "DE" }, systemCityId: 34, email: "info@adlonberlin.de", phoneNumber: "+49 30 555 0187", providerId: "PRV-1007" },
  { name: "Park Hyatt Tokyo", address: "3-7-1-2 Nishi Shinjuku", latitude: 35.6852, longitude: 139.6905, starRating: 5, city: "Tokyo", state: null, country: { name: "Japan", code: "JP" }, systemCityId: 21, email: "tokyo.park@hyatt.jp", phoneNumber: "+81 3 5555 0162", providerId: "PRV-1008" },
  { name: "Marina Bay Sands", address: "10 Bayfront Ave", latitude: 1.2834, longitude: 103.8607, starRating: 5, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, systemCityId: 23, email: "enquiry@marinabaysands.sg", phoneNumber: "+65 6555 0188", providerId: "PRV-1009" },
  { name: "The Fullerton Hotel", address: "1 Fullerton Square", latitude: 1.2865, longitude: 103.8535, starRating: 5, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, systemCityId: 23, email: "info@fullertonhotel.sg", phoneNumber: "+65 6555 0133", providerId: "PRV-1010" },
  { name: "Burj Al Arab", address: "Jumeirah St", latitude: 25.1412, longitude: 55.1853, starRating: 5, city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, systemCityId: 24, email: "reservations@burjalarab.ae", phoneNumber: "+971 4 555 0199", providerId: "PRV-1011" },
  { name: "Taj Mahal Palace", address: "Apollo Bunder", latitude: 18.922, longitude: 72.8332, starRating: 5, city: "Mumbai", state: null, country: { name: "India", code: "IN" }, systemCityId: 30, email: "tajmahalpalace.mumbai@tajhotels.in", phoneNumber: "+91 22 5555 0166", providerId: "PRV-1012" },
  { name: "Shangri-La Bangkok", address: "89 Soi Wat Suan Plu", latitude: 13.7223, longitude: 100.5147, starRating: 5, city: "Bangkok", state: null, country: { name: "Thailand", code: "TH" }, systemCityId: 26, email: "sbk@shangri-la.th", phoneNumber: "+66 2 555 0177", providerId: "PRV-1013" },
  { name: "Park Hyatt Sydney", address: "7 Hickson Rd", latitude: -33.8568, longitude: 151.2153, starRating: 5, city: "Sydney", state: null, country: { name: "Australia", code: "AU" }, systemCityId: 28, email: "sydney.park@hyatt.au", phoneNumber: "+61 2 5555 0144", providerId: "PRV-1014" },
  // Deliberately every free-text field long enough to overflow its column
  // on hotel-system.html (Name/Address/City/State/Country/Email/Phone/
  // Provider ID all treated with the fixed-width + fade-on-overflow
  // .truncatable component) — a test row, not a real hotel, so the fade
  // effect is exercised on every one of those columns at once instead of
  // relying on scattered real-looking values to happen to be long enough.
  // systemCityId is deliberately null so city/state resolve from this
  // row's own (fictional, over-long) literals instead of a real
  // SYSTEM_CITIES match.
  {
    name: "The Grand Intercontinental Royal Meridien Palace Resort & Spa Collection",
    address: "Building 42, Sector 7, Phase 3, Near Central Business District, Boulevard Extension Road",
    latitude: 25.276987,
    longitude: 55.296249,
    starRating: 5,
    city: "Northeast Port Alexandria Harbourfront Township",
    state: "Southwestern Autonomous Province Territory",
    country: { name: "United Arab Emirates", code: "AE" },
    systemCityId: null,
    email: "reservations.concierge.frontdesk@thegrandintercontinentalroyalmeridienpalace-resort.com",
    phoneNumber: "+1 (800) 555-0100 extension 123456789",
    providerId: "PRV-TEST-INTENTIONALLY-VERY-LONG-0000001",
  },
];

// Bulk demo hotels — every one of the SEED_CITY_COUNT seed cities (the 36
// hand-authored ones and the 200 generated US filler ones) gets at least one
// hotel, and the 36 hand-authored/"named" cities get 2 more each on top of
// whatever's hand-authored above, since a handful of real-sounding cities
// carrying several hotels reads better than every city having exactly one.
// This is also what makes bulk supplier hotels (further below) able to
// resolve a Provider ID match in most of the real system cities they land
// in, not just the ~15 hand-authored ones. Provider IDs continue the
// PRV-10xx sequence used by the hand-authored hotels above (next free number
// is 1016 — 1001-1014 are hand-authored, 1015 belongs to the New City demo
// hotel pushed further below).
const HOTEL_NAME_WORDS = ["Grand", "Royal", "Regal", "Imperial", "Golden", "Silver", "Crown", "Central", "Riverside", "Hillside", "Garden", "Sunset", "Harbor", "Palm", "Ocean", "Skyline", "Heritage", "Continental", "Premier", "Boutique", "National", "Downtown", "Coastal", "Emerald", "Crystal", "Summit", "Meridian", "Landmark", "Plaza", "Metropolitan"];
const HOTEL_TYPE_WORDS = ["Hotel", "Inn", "Suites", "Resort", "Lodge", "Towers", "Residency", "Palace", "Manor"];

// Deterministic name generator shared by both the bulk system hotels below
// and the bulk supplier hotels further down this file — same idea as
// generateBulkCityNames above, a `seed` offset rather than a shared counter
// so the two call sites can't accidentally collide on the same sequence.
function generateBulkHotelName(cityName, seed) {
  const word = HOTEL_NAME_WORDS[seed % HOTEL_NAME_WORDS.length];
  const type = HOTEL_TYPE_WORDS[Math.floor(seed / HOTEL_NAME_WORDS.length) % HOTEL_TYPE_WORDS.length];
  return `${word} ${type} ${cityName}`;
}

let nextBulkProviderIdNum = 1016;
function generateBulkSystemHotel(city, seed) {
  return {
    name: generateBulkHotelName(city.name, seed),
    address: `${100 + (seed % 900)} Main Street`,
    latitude: Number((((seed * 37) % 180) - 90).toFixed(4)),
    longitude: Number((((seed * 53) % 360) - 180).toFixed(4)),
    starRating: 3 + (seed % 3),
    city: city.name,
    state: city.state,
    country: { name: city.country.name, code: city.country.code },
    systemCityId: city.id,
    email: null,
    phoneNumber: null,
    providerId: `PRV-${nextBulkProviderIdNum++}`,
  };
}

{
  const eligibleHotelCities = SYSTEM_CITIES.slice(0, SEED_CITY_COUNT);
  let bulkSeed = 0;
  eligibleHotelCities.forEach((city) => {
    SYSTEM_HOTELS.push(generateBulkSystemHotel(city, bulkSeed++));
  });
  eligibleHotelCities.slice(0, 36).forEach((city) => {
    SYSTEM_HOTELS.push(generateBulkSystemHotel(city, bulkSeed++));
    SYSTEM_HOTELS.push(generateBulkSystemHotel(city, bulkSeed++));
  });
}

SYSTEM_HOTELS.forEach((h, i) => {
  h.id = i;
  h.history = [];
  h.active = true;
  h.mappedCityIds = [];
});
const SEED_HOTEL_COUNT = SYSTEM_HOTELS.length;

// Same long-form display-id convention as getSystemCityDisplayId, with a
// different offset so hotel ids never collide with city ids if the two are
// ever shown side by side (e.g. a future Hotel Mapping page).
function getSystemHotelDisplayId(id) {
  return String(50000000000 + id);
}

// Demo hotel directly added under the seeded added city above (Crestwood
// Bay) — gives that city's Summary a real "Directly Added Hotels" example
// with zero setup, same reasoning as the city seeding above.
const DEMO_NEW_CITY_HOTEL_ID = SYSTEM_HOTELS.length;
SYSTEM_HOTELS.push({
  id: DEMO_NEW_CITY_HOTEL_ID,
  name: "Crestwood Bay Grand Hotel",
  address: "500 Bayfront Drive",
  latitude: 27.9506,
  longitude: -82.4572,
  starRating: 4,
  city: "Crestwood Bay",
  state: "Florida",
  country: { name: "United States", code: "US" },
  systemCityId: DEMO_NEW_CITY_ID,
  email: "reservations@crestwoodbaygrand.com",
  phoneNumber: "+1 727 555 0110",
  providerId: "PRV-1015",
  active: true,
  mappedCityIds: [],
  history: [
    {
      operation: "Create",
      description: "Name: Crestwood Bay Grand Hotel, City: Crestwood Bay, State: Florida, Country: United States (US)",
      userName: "Nusrat Jahan",
      userEmail: "nusrat.jahan@mynztrip.com",
      timestamp: new Date("2026-06-22T14:30:00"),
    },
  ],
});

// Demo "additionally mapped" hotel — The Beverly Hilton's home city stays
// Los Angeles (its own systemCityId, untouched), but it's also mapped to the
// seeded New City above, so New City's Summary "Additionally Mapped Hotels"
// group has a real example too. Logged on both sides, same dual-side
// convention applyHotelCityMap() uses for a live Map action.
// Looked up (not raw array-indexed) and guarded: SYSTEM_CITIES was already
// hydrated from localStorage above (city section runs first in this file),
// so on a browser with pre-existing saved data from before this demo seed
// existed, DEMO_NEW_CITY_ID may not resolve to anything at all until Reset
// Demo Data (same caveat as rule 40) — skip quietly instead of crashing the
// whole page on an undefined `.history`.
const demoNewCityForHotelDemo = SYSTEM_CITIES.find((c) => c.id === DEMO_NEW_CITY_ID);
const demoMappedHotel = SYSTEM_HOTELS.find((h) => h.id === 1);
if (demoNewCityForHotelDemo && demoMappedHotel) {
  demoMappedHotel.mappedCityIds = [DEMO_NEW_CITY_ID];
  demoMappedHotel.history.push({
    operation: "Map",
    description: getSystemCityHistoryLabel(DEMO_NEW_CITY_ID),
    userName: "Farhan Ahmed",
    userEmail: "farhan.ahmed@mynztrip.com",
    timestamp: new Date("2026-06-22T15:00:00"),
  });
  demoNewCityForHotelDemo.history.push({
    operation: "Map",
    description: getSystemHotelHistoryLabel(demoMappedHotel.id),
    userName: "Farhan Ahmed",
    userEmail: "farhan.ahmed@mynztrip.com",
    timestamp: new Date("2026-06-22T15:00:00"),
  });
}

// Bulk secondary hotel-city mappings, so the demo shows both relation types
// instead of a wall of Primary. A hotel's own city is always its primary;
// every *additional* city it is mapped to is a secondary one. This maps a
// scattered share of the hotels into one other city in the same country, so
// a city's Summary shows a mix of its own hotels (Primary) and hotels
// visiting from elsewhere (Secondary) — without touching any hotel's own
// city, and therefore without changing the location it resolves to anywhere
// else in the app.
// Deterministic (every third hotel, a neighbouring city in the same
// country) rather than Math.random: the demo has to look the same on every
// reload, or a screenshot stops being reproducible and two people comparing
// notes see different data.
// No history entries: the bulk seed invents hotels and mappings without
// writing an audit trail for them — only the hand-authored demos above log
// one — and inventing a hundred entries under a made-up author's name would
// be worse than having none.
{
  const citiesByCountry = {};
  SYSTEM_CITIES.forEach((city) => {
    const code = city.country.code;
    if (!citiesByCountry[code]) citiesByCountry[code] = [];
    citiesByCountry[code].push(city);
  });

  // Counts only the hotels actually considered, so the target index below
  // advances by one each time. Deriving it from the hotel's own index
  // instead advanced in steps of two, which — against a country list of
  // even length — could only ever land on half the cities, leaving the
  // other half with nothing but Primary rows however many hotels were
  // mapped.
  let pick = 0;

  SYSTEM_HOTELS.forEach((hotel, i) => {
    if (i % 2 !== 0) return;
    pick++;
    // Leave the hand-authored demo mapping (The Beverly Hilton -> Crestwood
    // Bay) exactly as it is — it's referenced by name in the dev notes.
    if (hotel.mappedCityIds.length) return;

    const siblings = citiesByCountry[hotel.country.code] || [];
    if (siblings.length < 2) return;

    // Spread across the whole country rather than stepping forward from the
    // hotel's own city: that variant only ever mapped hotels onto their
    // later neighbours, so the cities at the front of each country's list —
    // New York, Chicago, Toronto, the ones a demo actually opens first —
    // never received one and showed nothing but Primary.
    const target = siblings[(pick * 7 + 3) % siblings.length];
    if (!target || target.id === hotel.systemCityId) return;

    hotel.mappedCityIds = [target.id];
  });
}

hydrateArray(SYSTEM_HOTELS, loadFromStorage("SYSTEM_HOTELS"));

// hydrateArray fully replaces SYSTEM_HOTELS with whatever's in localStorage,
// which wipes out systemCityId for any hotel saved before the Add/Edit form
// switched City from free text to a SYSTEM_CITIES picker (or before
// systemCityId was hardcoded into the seed literals above) — self-heal it
// the same way the retired-field strip above does, instead of relying on
// the user clearing localStorage by hand. This is a last-resort fallback
// for genuinely legacy saved data only: the seed hotels above already carry
// a hardcoded systemCityId (not name-matched, precisely to avoid this same
// matching being fragile against a city rename — see the comment on
// SYSTEM_HOTELS), and every hotel created via the form always has one set
// too, so this loop is a no-op for all of them.
SYSTEM_HOTELS.forEach((h) => {
  if (h.systemCityId !== undefined && h.systemCityId !== null) return;
  const match = SYSTEM_CITIES.find((c) => c.name === h.city && c.country.code === h.country.code);
  h.systemCityId = match ? match.id : null;
});

// Resolves a hotel's current city/state/country — live via systemCityId
// when the referenced system city still exists, so a rename on
// city-system.html propagates here too, instead of trusting the hotel's
// own stored city/state/country snapshot (kept only for display/filter
// convenience and as a fallback for records with no matching reference).
// Shared by hotel-system.html's table/filters and getSystemHotelLabel below.
function resolveHotelLocation(hotel) {
  if (hotel.systemCityId !== null && hotel.systemCityId !== undefined) {
    const city = SYSTEM_CITIES.find((c) => c.id === hotel.systemCityId);
    if (city) return { city: city.name, state: city.state, country: city.country };
  }
  return { city: hotel.city, state: hotel.state, country: hotel.country };
}

// Full disambiguating label for a system hotel, mirroring getSystemCityLabel.
function getSystemHotelLabel(id) {
  const hotel = SYSTEM_HOTELS.find((h) => h.id === id);
  if (!hotel) return null;
  const loc = resolveHotelLocation(hotel);
  return [hotel.name, loc.city, loc.state, getSystemCountryName(loc.country.code) || loc.country.name].filter(Boolean).join(", ");
}

// Same as getSystemHotelLabel, but with the id appended and the country
// shown as its permanent code rather than its full name — used for Hotel
// Mapping history entries specifically (every call site is a history
// entry), same reasoning/pattern as getSystemCityHistoryLabel above. Kept
// separate from getSystemHotelLabel itself, which is also used in
// non-history UI (hotel-supplier.html's own list) where the full country
// name reads better and the id would just be clutter.
function getSystemHotelHistoryLabel(id) {
  const hotel = SYSTEM_HOTELS.find((h) => h.id === id);
  if (!hotel) return null;
  const loc = resolveHotelLocation(hotel);
  const parts = [hotel.name, loc.city, loc.state, loc.country.code].filter(Boolean);
  return `${parts.join(", ")} (ID: ${getSystemHotelDisplayId(id)})`;
}

// Resolves a supplier hotel's Provider ID against SYSTEM_HOTELS — used by
// hotel-supplier.html in place of a stored id reference (unlike City/Country,
// a supplier hotel is read-only reference data straight off that supplier's
// feed, and a real feed can only ever report the provider id it was given,
// never one of this project's own internal ids). Multiple supplier hotels —
// even from different suppliers — legitimately resolve to the same system
// hotel this way, exactly like two suppliers both reporting the same real
// hotel's provider id.
function findSystemHotelByProviderId(providerId) {
  if (!providerId) return null;
  return SYSTEM_HOTELS.find((h) => h.providerId === providerId) || null;
}

// Full disambiguating label for a system city, e.g. "New York, New York, United States"
// or "London, United Kingdom" when there's no state.
function getSystemCityLabel(id) {
  const city = SYSTEM_CITIES.find((c) => c.id === id);
  if (!city) return null;
  return [city.name, city.state, getSystemCountryName(city.country.code) || city.country.name].filter(Boolean).join(", ");
}

// System City's id is shown as a long-form number (not the small sequential
// index used internally for lookups/references elsewhere in the project)
// — purely a display convention, doesn't touch the actual c.id used for
// matching/URLs/cross-entity references. Shared here (rather than kept
// page-local) since more than one page now needs to show it.
function getSystemCityDisplayId(id) {
  return String(10000000000 + id);
}

// Same as getSystemCityLabel, but with the id appended and the country
// shown as its permanent code rather than its (renameable, longer) full
// name — used specifically for History descriptions (every call site is a
// history entry, seeded or live), so a city's history stays unambiguous
// even if it's later renamed, and doesn't run as long as getSystemCityLabel
// would once an id is added on top. Kept separate from getSystemCityLabel
// itself since that one is also used in non-history UI (checklist notes,
// remap preview, pinned-city meta) where the full country name reads
// better and the id would just be clutter.
function getSystemCityHistoryLabel(id) {
  const city = SYSTEM_CITIES.find((c) => c.id === id);
  if (!city) return null;
  const parts = [city.name, city.state, city.country.code].filter(Boolean);
  return `${parts.join(", ")} (ID: ${getSystemCityDisplayId(id)})`;
}

// ---------- Supplier City ----------

const supplierCities = {
  agoda: [
    { name: "New York City", state: "New York", countryCode: "US", systemCityId: 0 },
    { name: "Los Angeles", state: "California", countryCode: "US", systemCityId: 1 },
    { name: "Toronto", state: "Ontario", countryCode: "CA", systemCityId: 10 },
    { name: "Vancouver", state: "British Columbia", countryCode: "CA", systemCityId: null },
    { name: "London", state: null, countryCode: "GB", systemCityId: 17 },
    { name: "Paris", state: null, countryCode: "FR", systemCityId: 19 },
    { name: "Tokyo Metro", state: null, countryCode: "JP", systemCityId: null },
    { name: "Singapore City", state: null, countryCode: "SG", systemCityId: 23 },
    // Deliberately a second Agoda entry mapped to the same system city as
    // "New York City" above — Agoda's own list sometimes splits one metro
    // area into multiple entries, and both can map to the same system city.
    // Demonstrates one supplier having 2 of its own cities mapped to the
    // same target, not just 2 different suppliers mapped to it.
    { name: "Manhattan", state: "New York", countryCode: "US", systemCityId: 0 },
  ],
  booking: [
    { name: "New York", state: "New York", countryCode: "US", systemCityId: 0 },
    { name: "Chicago", state: "Illinois", countryCode: "US", systemCityId: 3 },
    { name: "Miami Beach", state: "Florida", countryCode: "US", systemCityId: null },
    { name: "Montreal", state: "Quebec", countryCode: "CA", systemCityId: 12 },
    { name: "Manchester", state: null, countryCode: "GB", systemCityId: 18 },
    { name: "Rome", state: null, countryCode: "IT", systemCityId: null },
    // Was missing even though the hand-authored "Hotel Adlon Berlin" hotel
    // (js/data.js, supplierHotels.booking) is set in Germany (code "DE") —
    // without this, Edit City on that row had zero eligible cities to pick
    // for its own country.
    { name: "Berlin", state: null, countryCode: "DE", systemCityId: 34 },
  ],
  hotelbeds: [
    { name: "Las Vegas", state: "Nevada", countryCode: "US", systemCityId: 5 },
    { name: "Dubai Marina", state: null, countryCode: "AE", systemCityId: 24 },
    { name: "Abu Dhabi City", state: null, countryCode: "AE", systemCityId: null },
    { name: "Bangkok", state: null, countryCode: "TH", systemCityId: 26 },
    { name: "Kuala Lumpur City", state: null, countryCode: "MY", systemCityId: null },
    // Was missing even though the hand-authored "Marina Bay Sands" hotel is
    // set in Singapore (code "SG") — same gap as Berlin above.
    { name: "Singapore City", state: null, countryCode: "SG", systemCityId: 23 },
  ],
  tbo: [
    { name: "Mumbai", state: null, countryCode: "IN", systemCityId: 30 },
    { name: "New Delhi", state: null, countryCode: "IN", systemCityId: null },
    { name: "Colombo", state: null, countryCode: "LK", systemCityId: null },
    { name: "Kathmandu", state: null, countryCode: "NP", systemCityId: null },
    // Was missing even though the hand-authored "Shangri-La Bangkok" hotel
    // is set in Thailand (code "TH") — same gap as Berlin/Singapore above.
    { name: "Bangkok", state: null, countryCode: "TH", systemCityId: 26 },
  ],
};

// Bulk demo cities, matching the 200 bulk system cities above — same idea,
// appended (never inserted) so none of the hand-authored ids above shift.
// Unmapped (systemCityId: null); the curated entries already demonstrate
// the mapping features, these are purely for pagination/search/filter
// volume testing on the Supplier City List and mapping pages.
generateBulkCityNames(200, true).forEach((name, i) => {
  supplierCities.agoda.push({
    name,
    state: STATES_BY_COUNTRY_CODE.US[i % STATES_BY_COUNTRY_CODE.US.length],
    countryCode: "US",
    systemCityId: null,
  });
});

// Cities for the 50 bulk suppliers declared near SUPPLIER_LABELS above.
// Each takes its own window of one shared name pool (offset by supplier
// index) so no two of them look like copies of each other, spread across
// that supplier's own countries. Unmapped, same reasoning as the bulk Agoda
// rows above — these exist for volume, not to demonstrate mapping.
const BULK_SUPPLIER_CITY_POOL = generateBulkCityNames(400);

BULK_SUPPLIER_KEYS.forEach((key, index) => {
  const countries = supplierCountries[key];
  const cityCount = 6 + (index % 9);
  const offset = (index * 13) % (BULK_SUPPLIER_CITY_POOL.length - cityCount);
  supplierCities[key] = BULK_SUPPLIER_CITY_POOL.slice(offset, offset + cityCount).map((name, i) => {
    const country = countries[i % countries.length];
    return {
      name,
      state: country.code === "US" ? STATES_BY_COUNTRY_CODE.US[i % STATES_BY_COUNTRY_CODE.US.length] : null,
      countryCode: country.code,
      systemCityId: null,
    };
  });
});

// TBO's ids look like lowercase 3-letter city/airport codes (e.g. real-world
// "dac"/"kul" style) rather than a sequential number — matches real codes
// where one exists, falls back to the city name's own first 3 letters for
// anything not in this list (deduplicated against codes already handed out,
// since e.g. two different "New ..." cities would otherwise collide).
const TBO_CITY_CODE_OVERRIDES = { Mumbai: "bom", "New Delhi": "del", Colombo: "cmb", Kathmandu: "ktm" };
const usedTboCityCodes = new Set();

// A supplier city's id is whatever format that supplier's own system uses —
// unlike SYSTEM_CITIES (one internal id scheme), each supplier is a
// separate external system with its own id conventions, so these
// deliberately differ in shape per supplier (string, not always numeric),
// mirroring how supplierCountries' own supplierId already varies by
// supplier ("AG-US-001", "10023456", "HB_USA", "155"). Always a string,
// even where a supplier's own style happens to look like a plain number.
function generateSupplierCityId(supplierKey, countryCode, seq, cityName) {
  const n = seq + 1;
  switch (supplierKey) {
    case "agoda":
      return `AG-${countryCode}-${String(n).padStart(3, "0")}`;
    case "booking":
      return String(20050000 + seq);
    case "hotelbeds":
      return `HB_${countryCode}_${String(n).padStart(3, "0")}`;
    case "tbo": {
      if (TBO_CITY_CODE_OVERRIDES[cityName]) return TBO_CITY_CODE_OVERRIDES[cityName];
      const base = (cityName.toLowerCase().match(/[a-z]/g) || []).slice(0, 3).join("").padEnd(3, "x");
      let candidate = base;
      let suffix = 2;
      while (usedTboCityCodes.has(candidate)) {
        candidate = `${base.slice(0, 2)}${suffix}`;
        suffix++;
      }
      usedTboCityCodes.add(candidate);
      return candidate;
    }
    default:
      return String(n);
  }
}

Object.keys(supplierCities).forEach((key) => {
  supplierCities[key].forEach((row, i) => {
    row.id = generateSupplierCityId(key, row.countryCode, i, row.name);
    row.history = [];
    row.active = true;
  });
});

// sample mapping history for demo purposes — deliberately covers both
// 2 different suppliers AND the same supplier twice, all mapped to the
// same system city (New York), so both flavors of the "one system city,
// many supplier cities" story are visible without having to perform a
// live mapping first (this is a static, serverless demo, so there's no
// shared backend session to generate that history on the fly).
supplierCities.agoda[0].history.push({
  operation: "Map",
  systemCityLabel: getSystemCityLabel(0),
  description: getSystemCityHistoryLabel(0),
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-19T13:40:00"),
});
supplierCities.booking[0].history.push({
  operation: "Map",
  systemCityLabel: getSystemCityLabel(0),
  description: getSystemCityHistoryLabel(0),
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-20T09:15:00"),
});
supplierCities.agoda[8].history.push({
  operation: "Map",
  systemCityLabel: getSystemCityLabel(0),
  description: getSystemCityHistoryLabel(0),
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-21T11:05:00"),
});

// Illustrative example of a grouped batch, pre-seeded so it's demoable
// without performing a live action: city-mapping.html's Save is always
// scoped to one supplier at a time, but within that one supplier it can map
// and unmap several of that supplier's own cities against the same pinned
// system city in a single click — Los Angeles's own history should show all
// 3 as one grouped card (see renderHistoryList() in js/app.js), not three
// disconnected entries. Story: two Agoda cities were mapped into Los
// Angeles in one sitting and a duplicate/test entry was removed from it.
// Deliberately no Remap anywhere: with set-valued mappings a supplier city
// is never moved off one system city by being added to another.
supplierCities.agoda[9].systemCityId = 1; // final state must match the "Map" entry below
supplierCities.agoda[2].systemCityId = 10; // mapped to Toronto, not to LA
{
  const laLabel = getSystemCityHistoryLabel(1);
  const groupId = "grp-demo-la-cleanup";
  const timestamp = new Date("2026-06-27T16:00:00");
  const userName = "Farhan Ahmed";
  const userEmail = "farhan.ahmed@mynztrip.com";

  const secondRow = supplierCities.agoda[2]; // also mapped to LA in the same batch
  const freshRow = supplierCities.agoda[9]; // freshly mapped to LA in the same batch
  const removedRow = supplierCities.agoda[10]; // unmapped from LA in the same batch

  freshRow.history.push({
    operation: "Map",
    description: laLabel,
    userName,
    userEmail,
    timestamp,
  });
  removedRow.history.push({
    operation: "Unmap",
    description: `${laLabel} -> Not mapped`,
    userName,
    userEmail,
    timestamp,
  });

  SYSTEM_CITIES[1].history.push(
    {
      operation: "Map",
      description: `${SUPPLIER_LABELS.agoda} — ${freshRow.name} — ID: ${freshRow.id}`,
      userName,
      userEmail,
      timestamp,
      groupId,
    },
    {
      operation: "Unmap",
      description: `${SUPPLIER_LABELS.agoda} — ${removedRow.name} — ID: ${removedRow.id}`,
      userName,
      userEmail,
      timestamp,
      groupId,
    }
  );
  SYSTEM_CITIES[10].history.push({
    operation: "Map",
    description: `${SUPPLIER_LABELS.agoda} — ${secondRow.name} — ID: ${secondRow.id}`,
    userName,
    userEmail,
    timestamp,
    groupId,
  });
}

// restore any mappings saved from a previous session
hydrateObject(supplierCities, loadFromStorage("supplierCities"));

// ---------- Many-to-many normalisation ----------
// A supplier city is mapped to a SET of system cities, not one: the same
// supplier city can legitimately belong to several system cities, and
// whether it counts as "mapped" is only ever a question about one specific
// system city. The seed literals above (and any save written by an older
// build) still use the single-valued `systemCityId`, so both are converted
// here, after hydration, before anything reads a row — one place, rather
// than every reader having to cope with both shapes.
Object.keys(supplierCities).forEach((key) => {
  supplierCities[key].forEach((row) => {
    if (!Array.isArray(row.systemCityIds)) {
      row.systemCityIds = row.systemCityId === null || row.systemCityId === undefined ? [] : [row.systemCityId];
    }
    delete row.systemCityId;
  });
});

// Ties together every history entry created by one user action (e.g. every
// row touched by a single city-mapping.html Save click) so the frontend can
// merge them into one card on the system city's side — see
// renderHistoryList() in js/app.js. Doesn't change the entry shape
// itself, just tags related entries; entries with no groupId (a single
// quick action, or old seed data) simply render as their own one-entry group.
let historyGroupCounter = 0;
function generateHistoryGroupId() {
  return `grp${++historyGroupCounter}-${Date.now()}`;
}

// Shared by every page that maps/unmaps a supplier city to a system city
// (city-mapping.html, city-supplier.html). Adds or removes ONE link between
// this supplier city and ONE system city, and logs it from both sides.
//
// There is deliberately no Remap: with a set-valued mapping, "already mapped
// somewhere else" is not a conflict to resolve, so every change is either a
// Map or an Unmap, and each one concerns exactly one system city. Mapping a
// supplier city to a second system city leaves the first mapping alone —
// nothing is ever silently taken away from another city. Edit/Create stay
// reserved for entity-property changes, never mapping actions (same
// vocabulary as applyCountryMapping's country equivalent).
//
// `groupId` is optional — callers that apply several rows in one batch
// (city-mapping.html's Save, always scoped to one supplier at a time)
// generate one shared id and pass it into every call so the affected system
// city's history can show them as one grouped event; a caller that only ever
// changes one row at a time can omit it and this function makes its own.
function applyCityMap(supplierKey, row, systemCityId, mapped, groupId) {
  if (systemCityId === null || systemCityId === undefined) return;
  if (!Array.isArray(row.systemCityIds)) row.systemCityIds = [];

  const wasMapped = row.systemCityIds.includes(systemCityId);
  if (wasMapped === mapped) return;

  const cityLabel = getSystemCityHistoryLabel(systemCityId);
  const supplierCityLabel = `${SUPPLIER_LABELS[supplierKey]} — ${row.name} — ID: ${row.id}`;
  const resolvedGroupId = groupId || generateHistoryGroupId();
  const timestamp = new Date();

  row.systemCityIds = mapped
    ? [...row.systemCityIds, systemCityId]
    : row.systemCityIds.filter((id) => id !== systemCityId);

  // Both sides describe the *other* record, so either history reads on its
  // own. Neither carries an "old -> new" suffix any more: there is no
  // previous value to contrast with when a link is simply added or removed.
  row.history.push({
    operation: mapped ? "Map" : "Unmap",
    description: mapped ? cityLabel : `${cityLabel} -> Not mapped`,
    userName: CURRENT_USER.name,
    userEmail: CURRENT_USER.email,
    timestamp,
  });

  const city = SYSTEM_CITIES.find((c) => c.id === systemCityId);
  if (city) {
    city.history.push({
      operation: mapped ? "Map" : "Unmap",
      description: supplierCityLabel,
      userName: CURRENT_USER.name,
      userEmail: CURRENT_USER.email,
      timestamp,
      groupId: resolvedGroupId,
    });
  }

  saveToStorage("supplierCities", supplierCities);
  saveToStorage("SYSTEM_CITIES", SYSTEM_CITIES);
}

// One supplier's own cities mapped to a system city — the lookup behind
// city-system.html's Summary popup, and deliberately scoped to a SINGLE
// supplier. Suppliers are independent sources with independent storage:
// there is no cross-supplier query to be had, so anything that wants
// "every supplier's rows for this city" has to ask each supplier in turn
// and should be designed knowing that. The cross-supplier version this
// replaced was used to label a tab per supplier with its own count, which
// meant paying that fan-out on every open just to draw the tabs.
// Unlike country mapping (getMappingSummary() above, still cross-supplier
// because a country summary is a handful of rows either way), a system
// city can have MANY of the same supplier's cities mapped to it, so this
// returns an array.
function supplierCitiesForCity(supplierKey, systemCityId) {
  return (supplierCities[supplierKey] || []).filter((row) => (row.systemCityIds || []).includes(systemCityId));
}

// ---------- Supplier Hotel ----------
// Mirrors SYSTEM_HOTELS' own fields (name/address/city/state/country/star
// rating/email/phone), plus its own providerId — the id this supplier's feed
// reports for the hotel, matched against SYSTEM_HOTELS' own providerId via
// findSystemHotelByProviderId() rather than stored as a direct reference
// (a real feed can only ever report the provider id it was given — never one
// of this project's own internal ids). Each row also gets an updatedAt
// snapshot (when the feed last reported this hotel) alongside its own
// history array — hotel-supplier.html has a History action and an
// Active/Inactive toggle (same "Status Change" logging convention as
// hotel-system.html's own toggle), but no Edit — the name/address/etc.
// fields themselves still only ever come from what the feed reports, not
// from a form on this page.
// supplierCityId links a supplier hotel to one of that *same supplier's*
// own cities (supplierCities[key], js/data.js:720-758) — the first hop of
// the "Supplier Hotel -> Supplier City -> System City" chain shown on
// hotel-supplier.html, independent of the other, Provider-ID-based chain
// ("Supplier Hotel -> System Hotel -> System City" via
// findSystemHotelByProviderId() below). null where that supplier's own
// city list genuinely has no matching entry for this hotel's city — a
// real, demonstrable case (e.g. Agoda's own city list has no Chicago
// entry, so "Downtown Chicago Inn" can't link to one), not a data gap.
const supplierHotels = {
  agoda: [
    { name: "Grand Plaza New York", address: "123 5th Ave", latitude: 40.7128, longitude: -74.006, city: "New York", state: "New York", country: { name: "United States", code: "US" }, starRating: 5, email: "reservations@grandplazanewyork.com", phoneNumber: "+1 212 555 0101", providerId: "PRV-1001", supplierCityId: supplierCities.agoda[0].id, active: true, updatedAt: new Date("2026-06-18T09:12:00") },
    { name: "The Beverly Hilton", address: "9876 Wilshire Blvd", latitude: 34.0522, longitude: -118.2437, city: "Los Angeles", state: "California", country: { name: "United States", code: "US" }, starRating: 4, email: "info@beverlyhilton.com", phoneNumber: "+1 310 555 0172", providerId: "PRV-1002", supplierCityId: supplierCities.agoda[1].id, active: true, updatedAt: new Date("2026-06-19T11:40:00") },
    { name: "Ritz Paris Suites", address: "15 Place Vendome", latitude: 48.8683, longitude: 2.3289, city: "Paris", state: null, country: { name: "France", code: "FR" }, starRating: 5, email: "reservation@ritzparis.fr", phoneNumber: "+33 1 55 55 0145", providerId: "PRV-1006", supplierCityId: supplierCities.agoda[5].id, active: true, updatedAt: new Date("2026-06-20T08:05:00") },
    { name: "Agoda Exclusive Sentosa Resort", address: "8 Sentosa Gateway", latitude: 1.2494, longitude: 103.8303, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, starRating: 4, email: "stay@sentosaresort.sg", phoneNumber: "+65 6555 0120", providerId: null, supplierCityId: supplierCities.agoda[7].id, active: true, updatedAt: new Date("2026-06-21T14:22:00") },
    { name: "Downtown Chicago Inn", address: "220 E Superior St", latitude: 41.8955, longitude: -87.6244, city: "Chicago", state: "Illinois", country: { name: "United States", code: "US" }, starRating: 3, email: "frontdesk@downtownchicagoinn.com", phoneNumber: "+1 312 555 0199", providerId: null, supplierCityId: null, active: false, updatedAt: new Date("2026-06-15T16:50:00") },
    // Deliberately extreme-length values in every text field — a stress-test
    // row for the Supplier Hotel List's fade/truncation + info-popover
    // behavior (every other hand-authored row above has realistic,
    // comfortably-short values). No providerId/supplierCityId, so System
    // Hotel shows "Not mapped" — this row is only stress-testing the
    // supplier's own fields, not a matched system hotel's.
    {
      name: "The Grand Royal International Luxury Business Convention Center Hotel & Spa Resort and Residences",
      address: "1 Extremely Long Boulevard Avenue Street, Suite 000000000000, Building Complex Wing C, Industrial Business Park Zone",
      city: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch-on-Sea",
      state: "The Somewhat Overly Verbose Administrative Region of Upper Lower Central Province",
      country: { name: "The United Federative Democratic Republic of Testlandia and Overseas Territories", code: "ZZ" },
      // Null Island — the classic "no real coordinates" placeholder (0,0),
      // fitting for a hotel in an otherwise-fictional stress-test country.
      latitude: 0,
      longitude: 0,
      starRating: 5,
      email: "reservations.frontdesk.customerservice.internationalguestrelations@thegrandroyalinternationalluxurybusinessconventioncenterhotelandsparesortandresidences.example.com",
      phoneNumber: "+1 (800) 555-0100 ext. 999999999 (International Reservations Department Extension Line)",
      providerId: null,
      supplierCityId: null,
      active: true,
      updatedAt: new Date("2026-06-22T10:00:00"),
    },
  ],
  booking: [
    { name: "Grand Plaza New York", address: "123 5th Ave", latitude: 40.7128, longitude: -74.006, city: "New York", state: "New York", country: { name: "United States", code: "US" }, starRating: 5, email: "reservations@grandplazanewyork.com", phoneNumber: "+1 212 555 0101", providerId: "PRV-1001", supplierCityId: supplierCities.booking[0].id, active: true, updatedAt: new Date("2026-06-17T10:30:00") },
    { name: "Hotel Adlon Berlin", address: "Pariser Platz 3", latitude: 52.5163, longitude: 13.3777, city: "Berlin", state: null, country: { name: "Germany", code: "DE" }, starRating: 5, email: "info@adlonberlin.de", phoneNumber: "+49 30 555 0187", providerId: "PRV-1007", supplierCityId: null, active: true, updatedAt: new Date("2026-06-19T09:00:00") },
    { name: "Booking Riverside Lodge", address: "44 Riverside Ave", latitude: 43.6455, longitude: -79.3806, city: "Toronto", state: "Ontario", country: { name: "Canada", code: "CA" }, starRating: 3, email: "stay@riversidelodge.ca", phoneNumber: "+1 416 555 0166", providerId: null, supplierCityId: null, active: true, updatedAt: new Date("2026-06-22T13:15:00") },
    { name: "Manchester City Suites", address: "12 Deansgate", latitude: 53.4808, longitude: -2.2426, city: "Manchester", state: null, country: { name: "United Kingdom", code: "GB" }, starRating: 3, email: "reservations@manchestercitysuites.co.uk", phoneNumber: "+44 161 555 0110", providerId: null, supplierCityId: supplierCities.booking[4].id, active: true, updatedAt: new Date("2026-06-14T09:45:00") },
  ],
  hotelbeds: [
    { name: "Marina Bay Sands", address: "10 Bayfront Ave", latitude: 1.2834, longitude: 103.8607, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, starRating: 5, email: "enquiry@marinabaysands.sg", phoneNumber: "+65 6555 0188", providerId: "PRV-1009", supplierCityId: null, active: true, updatedAt: new Date("2026-06-20T17:10:00") },
    { name: "Burj Al Arab", address: "Jumeirah St", latitude: 25.1412, longitude: 55.1853, city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, starRating: 5, email: "reservations@burjalarab.ae", phoneNumber: "+971 4 555 0199", providerId: "PRV-1011", supplierCityId: supplierCities.hotelbeds[1].id, active: true, updatedAt: new Date("2026-06-21T12:00:00") },
    { name: "HotelBeds Desert Oasis Resort", address: "Al Maktoum Rd", latitude: 25.2048, longitude: 55.2708, city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, starRating: 4, email: "stay@desertoasisresort.ae", phoneNumber: "+971 4 555 0166", providerId: null, supplierCityId: supplierCities.hotelbeds[1].id, active: true, updatedAt: new Date("2026-06-16T15:35:00") },
  ],
  tbo: [
    { name: "Taj Mahal Palace", address: "Apollo Bunder", latitude: 18.922, longitude: 72.8332, city: "Mumbai", state: null, country: { name: "India", code: "IN" }, starRating: 5, email: "tajmahalpalace.mumbai@tajhotels.in", phoneNumber: "+91 22 5555 0166", providerId: "PRV-1012", supplierCityId: supplierCities.tbo[0].id, active: true, updatedAt: new Date("2026-06-18T14:40:00") },
    { name: "Shangri-La Bangkok", address: "89 Soi Wat Suan Plu", latitude: 13.7223, longitude: 100.5147, city: "Bangkok", state: null, country: { name: "Thailand", code: "TH" }, starRating: 5, email: "sbk@shangri-la.th", phoneNumber: "+66 2 555 0177", providerId: "PRV-1013", supplierCityId: null, active: true, updatedAt: new Date("2026-06-19T16:20:00") },
    { name: "TBO Heritage Haveli", address: "Pink City Rd", latitude: 26.9124, longitude: 75.7873, city: "Jaipur", state: null, country: { name: "India", code: "IN" }, starRating: 3, email: "stay@heritagehaveli.in", phoneNumber: "+91 141 555 0122", providerId: null, supplierCityId: null, active: false, updatedAt: new Date("2026-06-13T10:05:00") },
  ],
};

// Bulk demo hotels for pagination/search/filter volume — brings every
// supplier's own list to 300+ rows on top of the hand-authored examples
// above, split across two independent axes:
//  - City: most rows sit in a real SYSTEM_CITIES city (name/state/country
//    copied straight from that city, same as every hand-authored row
//    above); a minority sit in a city the system has no record of at all
//    (NON_SYSTEM_DEMO_CITIES below), same idea as the hand-authored "TBO
//    Heritage Haveli" in Jaipur.
//  - Hotel: of the rows in a real system city, most carry a Provider ID
//    copied from one of that city's own SYSTEM_HOTELS (mirroring a real
//    supplier feed reporting the same provider id the system already
//    knows), so they resolve to a System Hotel match via
//    findSystemHotelByProviderId(); some deliberately don't — either the
//    row has no Provider ID at all (the feed never sent one), or it sits in
//    a system city but is a supplier-only property with no system-side
//    counterpart yet (same case as the hand-authored Downtown Chicago Inn /
//    Booking Riverside Lodge / HotelBeds Desert Oasis Resort rows above). A
//    Provider ID can and does repeat across rows — even across different
//    suppliers — exactly like Grand Plaza New York being reported by both
//    Agoda and Booking.com above.
const BULK_SUPPLIER_HOTEL_COUNT = 310; // per supplier — comfortably over the 300 minimum

// Small deterministic hash, keyed by an extra `salt` — used below instead of
// plain `seed % n` for every independent choice. Several of those choices
// share a divisor with each other (e.g. "which of the 36 named cities" and
// "1-of-4 candidate hotels in that city" both fit evenly into 36), so
// picking straight off `seed % n` for both makes one fully determined by the
// other (always the same candidate for a given city) instead of varying
// independently. A different salt per call gives independent-looking picks
// from the same seed.
function hashSeed(seed, salt) {
  let x = (seed * 2654435761 + salt * 40503) >>> 0;
  x = (x ^ (x >>> 15)) >>> 0;
  x = (x * 0x45d9f3b) >>> 0;
  x = (x ^ (x >>> 13)) >>> 0;
  return x;
}

// ~80% of rows land in one of this supplier's own cities (weighted toward
// its hand-authored ones over Agoda's 200 bulk filler towns, same "named
// entries get fair representation" reasoning this used to apply to
// SYSTEM_CITIES' 36 named vs. 200 filler split, back when this picked a
// system city directly), ~20% in a city not even in this supplier's own
// city list at all — one level up from the old "system has no record of
// this city" case, now that city comes from supplierCities rather than
// SYSTEM_CITIES. Returns supplierCityId (null for the no-own-city case) so
// the caller can persist the same link the hand-authored rows above carry.
function pickBulkHotelCity(key, seed) {
  const cities = supplierCities[key] || [];
  if (!cities.length || hashSeed(seed, 1) % 5 === 4) {
    // "ZZ" is excluded — that's the one deliberately-absurd stress-test
    // country added for the long-value demo row, not meant to appear on
    // ordinary bulk rows.
    const ownCountries = (supplierCountries[key] || []).filter((c) => c.code !== "ZZ");
    const country = ownCountries[hashSeed(seed, 8) % ownCountries.length];
    // The city name is generated (BULK_NAME_PREFIXES/SUFFIXES, same word
    // list used for SYSTEM_CITIES' own bulk filler towns) rather than a
    // real-world name (the previous NON_SYSTEM_DEMO_CITIES list) — a real
    // city like "Amsterdam" carries its own real country (Netherlands),
    // which doesn't necessarily overlap with `country` above (one of this
    // supplier's own countries), producing rows like "Amsterdam, Australia"
    // that made the Country -> City filter cascade show cities that don't
    // actually belong to the selected country. This hotel is deliberately
    // left unlinked to any of this supplier's own cities anyway, so the
    // name only ever needs to be a plausible label, not a real one.
    const cityName = `${BULK_NAME_PREFIXES[hashSeed(seed, 40) % BULK_NAME_PREFIXES.length]}${BULK_NAME_SUFFIXES[hashSeed(seed, 41) % BULK_NAME_SUFFIXES.length]}`;
    return { supplierCityId: null, name: cityName, state: null, country: { name: country.name, code: country.code }, systemCity: null };
  }
  const namedCities = cities.length > 20 ? cities.slice(0, 9) : cities;
  const pool = cities.length > 20 && hashSeed(seed, 3) % 3 !== 0 ? namedCities : cities;
  const city = pool[hashSeed(seed, 4) % pool.length];
  const systemCity = (city.systemCityIds && city.systemCityIds.length) ? SYSTEM_CITIES.find((c) => c.id === city.systemCityIds[0]) : null;
  return {
    supplierCityId: city.id,
    name: city.name,
    state: city.state,
    country: { name: getSystemCountryName(city.countryCode) || city.countryCode, code: city.countryCode },
    systemCity,
  };
}

Object.keys(supplierHotels).forEach((key, supplierIndex) => {
  for (let i = 0; i < BULK_SUPPLIER_HOTEL_COUNT; i++) {
    const seed = supplierIndex * 1000 + i;
    const place = pickBulkHotelCity(key, seed);
    let providerId = null;
    if (place.systemCity) {
      const candidates = SYSTEM_HOTELS.filter((h) => h.systemCityId === place.systemCity.id);
      // ~75% of rows in a real system city resolve to one of that city's
      // system hotels; the rest are supplier-only properties with no system
      // counterpart (yet).
      if (candidates.length && hashSeed(seed, 5) % 4 !== 3) {
        providerId = candidates[hashSeed(seed, 6) % candidates.length].providerId;
      }
    }
    supplierHotels[key].push({
      name: generateBulkHotelName(place.name, seed + 7), // +7 offset so these don't line up name-for-name with the bulk system hotels in the same city
      address: `${100 + (seed % 900)} ${place.name} Road`,
      // Same deterministic-pseudo-GPS approach as generateBulkSystemHotel's
      // own latitude/longitude above, salted (hashSeed's own documented
      // purpose) rather than reusing `seed` directly so these don't line up
      // number-for-number with a system hotel that happens to share a seed.
      latitude: Number(((hashSeed(seed, 9) % 1800) / 10 - 90).toFixed(4)),
      longitude: Number(((hashSeed(seed, 10) % 3600) / 10 - 180).toFixed(4)),
      supplierCityId: place.supplierCityId,
      city: place.name,
      state: place.state,
      country: { name: place.country.name, code: place.country.code },
      starRating: 3 + (seed % 3),
      email: null,
      phoneNumber: null,
      providerId,
      active: hashSeed(seed, 7) % 9 !== 8,
      updatedAt: new Date(2026, 5, 1 + (seed % 28), 8 + (seed % 10), (seed * 7) % 60),
    });
  }
});

// Resolves a supplier hotel's own supplierCityId back to that supplierCities
// row (js/data.js:720-758), or null if this hotel isn't linked to any of
// this supplier's own cities. The first hop of the "Supplier Hotel ->
// Supplier City -> System City" chain — pair with
// `row.systemCityId !== null ? SYSTEM_CITIES.find(...) : null` on the
// result to get the second hop, matching the separate Provider-ID-based
// chain findSystemHotelByProviderId() already provides above.
function resolveSupplierHotelCity(supplierKey, hotelRow) {
  if (hotelRow.supplierCityId === null || hotelRow.supplierCityId === undefined) return null;
  return (supplierCities[supplierKey] || []).find((c) => c.id === hotelRow.supplierCityId) || null;
}

// A supplier hotel's id is whatever format that supplier's own system uses —
// same reasoning as generateSupplierCityId above, deliberately different
// shape per supplier.
function generateSupplierHotelId(supplierKey, seq) {
  const n = seq + 1;
  switch (supplierKey) {
    case "agoda":
      return `AG-HTL-${String(n).padStart(3, "0")}`;
    case "booking":
      return String(80010000 + seq);
    case "hotelbeds":
      return `HB_HTL_${String(n).padStart(3, "0")}`;
    case "tbo":
      return `TBO-HTL-${String(n).padStart(3, "0")}`;
    default:
      return String(n);
  }
}

const ROOM_TYPE_WORDS = ["Standard", "Deluxe", "Suite", "Executive", "Family"];
const MEAL_PLAN_WORDS = ["Room Only", "Breakfast Included", "Half Board", "Full Board", "All Inclusive"];

// A real supplier feed reports a bunch of extra, vendor-specific fields that
// don't fit this project's own common schema (name/address/star rating/etc,
// already normalized above) — this is that "extra, shape varies per
// supplier" bucket, surfaced verbatim via the Details action's raw-JSON
// view (hotel-supplier.html) rather than flattened into more table columns.
// Deterministic (hashSeed, same convention as every other bulk-demo field
// in this file) so it's stable across renders/reloads without needing to be
// persisted.
function generateSupplierHotelRawDetails(supplierKey, seed) {
  switch (supplierKey) {
    case "agoda":
      return {
        agodaPropertyType: hashSeed(seed, 20) % 2 === 0 ? "Hotel" : "Resort",
        agodaReviewScore: Number((6 + (hashSeed(seed, 21) % 40) / 10).toFixed(1)),
        agodaReviewCount: 50 + (hashSeed(seed, 22) % 5000),
        freeCancellation: hashSeed(seed, 23) % 3 !== 0,
        roomTypesAvailable: ROOM_TYPE_WORDS.filter((_, i) => hashSeed(seed, 24 + i) % 2 === 0),
      };
    case "booking":
      return {
        geniusLevelRequired: hashSeed(seed, 20) % 4,
        guestReviewScore: Number((5 + (hashSeed(seed, 21) % 50) / 10).toFixed(1)),
        propertyClass: 1 + (hashSeed(seed, 22) % 5),
        preferredPartner: hashSeed(seed, 23) % 5 === 0,
      };
    case "hotelbeds":
      return {
        boardBasis: MEAL_PLAN_WORDS[hashSeed(seed, 20) % MEAL_PLAN_WORDS.length],
        allotment: 1 + (hashSeed(seed, 21) % 30),
        contractId: `HB-CT-${10000 + (hashSeed(seed, 22) % 89999)}`,
        giataId: String(100000 + (hashSeed(seed, 23) % 899999)),
      };
    case "tbo":
      return {
        supplierHotelCode: `TBO${1000 + (hashSeed(seed, 20) % 8999)}`,
        mealPlanCodes: MEAL_PLAN_WORDS.slice(0, 1 + (hashSeed(seed, 21) % 3)),
        markupPercentage: Number((5 + (hashSeed(seed, 22) % 20)).toFixed(1)),
        bookingWindowDays: 1 + (hashSeed(seed, 23) % 60),
      };
    default:
      return {};
  }
}

Object.keys(supplierHotels).forEach((key) => {
  supplierHotels[key].forEach((row, i) => {
    row.id = generateSupplierHotelId(key, i);
    row.history = [];
    row.rawDetails = generateSupplierHotelRawDetails(key, i);
  });
});

// restore any status-toggle changes saved from a previous session
hydrateObject(supplierHotels, loadFromStorage("supplierHotels"));

// ---------- Hotel Mapping (New City) ----------
// A New City has no supplier-city mapping (see #newCityInfo on
// city-system.html) — instead, system hotels are mapped to it, either
// directly (Add Hotel's own city field, hotel.systemCityId) or via this
// separate many-to-many layer (hotel.mappedCityIds), reached from a New
// City row's Map button (hotel-mapping.html?cityId=X). Unlike every other
// mapping in this project, a hotel can be mapped to more than one city, so
// there's no "remap" concept here — purely additive/removable.

// Pushes/removes cityId onto/from hotel.mappedCityIds and logs matching
// Map/Unmap history on BOTH sides (same dual-side convention as
// applyMapping above / rule 9 in project history): hotel.history gets an
// Edit-shaped Map/Unmap changelog line, city.history gets the mirrored
// additive/removal line. `groupId` is optional, same convention as
// applyMapping's own — hotel-mapping.html's Save is always scoped to one
// pinned city, but can map/unmap several different hotels against it in one
// click, so the city (the "one" side several entries land on in a batch)
// needs a shared id to show them as one grouped card; a caller that only
// ever changes one hotel at a time can omit it and this function makes its
// own. Never added to the hotel's own entry — a single hotel only ever gets
// one entry per batch, nothing to group there.
function applyHotelCityMap(hotel, city, mapped, groupId) {
  hotel.mappedCityIds = hotel.mappedCityIds || [];
  const alreadyMapped = hotel.mappedCityIds.includes(city.id);
  if (mapped === alreadyMapped) return;

  const hotelLabel = getSystemHotelHistoryLabel(hotel.id);
  const cityLabel = getSystemCityHistoryLabel(city.id);
  const resolvedGroupId = groupId || generateHistoryGroupId();
  const timestamp = new Date();

  if (mapped) {
    hotel.mappedCityIds.push(city.id);
  } else {
    hotel.mappedCityIds = hotel.mappedCityIds.filter((id) => id !== city.id);
  }

  hotel.history.push({
    operation: mapped ? "Map" : "Unmap",
    description: cityLabel,
    userName: CURRENT_USER.name,
    userEmail: CURRENT_USER.email,
    timestamp,
  });
  city.history.push({
    operation: mapped ? "Map" : "Unmap",
    description: hotelLabel,
    userName: CURRENT_USER.name,
    userEmail: CURRENT_USER.email,
    timestamp,
    groupId: resolvedGroupId,
  });

  saveToStorage("SYSTEM_HOTELS", SYSTEM_HOTELS);
  saveToStorage("SYSTEM_CITIES", SYSTEM_CITIES);
}

// Hotel-based Summary for a system city: hotels attached directly (via Add
// Hotel's own city field) vs hotels attached through the Map feature above.
// Kept as two separate lists (rather than merged/deduped) since they're
// added through two different actions and a city-system.html Summary
// reader should be able to tell which is which.
function getCityHotelSummary(cityId) {
  return {
    direct: SYSTEM_HOTELS.filter((h) => h.systemCityId === cityId),
    mapped: SYSTEM_HOTELS.filter((h) => (h.mappedCityIds || []).includes(cityId)),
  };
}
