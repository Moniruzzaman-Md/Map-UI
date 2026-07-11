// Shared master data for the mynztrip.com design pages: the system country
// list and every supplier's country list + mapping state. Both
// country-system.html and country-supplier.html read from this single
// source so the two pages never drift out of sync (e.g. for the System
// page's cross-supplier mapping Summary).

const SYSTEM_COUNTRIES = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "India", code: "IN" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "Brazil", code: "BR" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Singapore", code: "SG" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Netherlands", code: "NL" },
  { name: "Switzerland", code: "CH" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Thailand", code: "TH" },
  { name: "Malaysia", code: "MY" },
  { name: "Indonesia", code: "ID" },
  { name: "New Zealand", code: "NZ" },
  { name: "South Korea", code: "KR" },
  { name: "South Africa", code: "ZA" },
  { name: "Mexico", code: "MX" },
  { name: "Turkey", code: "TR" },
  { name: "Qatar", code: "QA" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Egypt", code: "EG" },
  { name: "Portugal", code: "PT" },
  { name: "Ireland", code: "IE" },
  { name: "Greece", code: "GR" },
  { name: "Vietnam", code: "VN" },
  { name: "Philippines", code: "PH" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Nepal", code: "NP" },
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
  { operation: "Map", description: "Agoda — United States (US) — ID: AG-US-001", userName: "Farhan Ahmed", userEmail: "farhan.ahmed@mynztrip.com", timestamp: new Date("2026-06-18T09:12:00") },
  { operation: "Map", description: "HotelBeds — USA (US) — ID: HB_USA", userName: "Rafiul Karim", userEmail: "rafiul.karim@mynztrip.com", timestamp: new Date("2026-06-25T15:30:00") }
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
  ],
  tbo: [
    { name: "India", code: "IN", supplierId: "1", systemCountry: "India" },
    { name: "Nepal", code: "NP", supplierId: "155", systemCountry: "Nepal" },
    { name: "Sri Lanka", code: "LK", supplierId: "162", systemCountry: null },
    { name: "Malaysia", code: "MY", supplierId: "118", systemCountry: "Malaysia" },
    { name: "Indonesia", code: "ID", supplierId: "95", systemCountry: null },
    { name: "Vietnam", code: "VN", supplierId: "233", systemCountry: null },
    { name: "Philippines", code: "PH", supplierId: "168", systemCountry: "Philippines" },
  ],
};

// Looks up how a specific supplier names a country (by real-world ISO code),
// e.g. getSupplierCountryName("hotelbeds", "US") -> "USA". Keeps the city
// list's country display in sync with that supplier's own country list
// instead of duplicating a possibly-inconsistent name.
function getSupplierCountryName(supplierKey, code) {
  const row = (supplierCountries[supplierKey] || []).find((c) => c.code === code);
  return row ? row.name : code;
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
// Returns [{ supplierKey, supplierLabel, mapped, countryName, countryId }]
function getMappingSummary(systemCountryName) {
  return Object.keys(SUPPLIER_LABELS).map((key) => {
    const match = (supplierCountries[key] || []).find((row) => row.systemCountry === systemCountryName);
    return {
      supplierKey: key,
      supplierLabel: SUPPLIER_LABELS[key],
      mapped: Boolean(match),
      countryName: match ? match.name : null,
      countryId: match ? match.supplierId : null,
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

// Demo "New City" and "Merged City" examples, pre-seeded here rather than
// requiring the Add City feature to be used live — a live-created city only
// exists in localStorage, and some browsers (Firefox) partition that per
// file:// document, so a deep link that depends on it (e.g. New City's Map
// button -> hotel-mapping.html?cityId=X) silently can't find it when the
// project is opened as local files instead of served over http. These two
// examples live directly in this seed data instead, exactly like every
// prepopulated city above, so the Map/Summary features are demoable with
// zero setup regardless of how the project is opened.
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
  cityType: "normal",
});

const DEMO_MERGED_CITY_ID = SYSTEM_CITIES.length;
SYSTEM_CITIES.push({
  id: DEMO_MERGED_CITY_ID,
  name: "Liberty Metro",
  state: null,
  country: { name: "United States", code: "US" },
  active: true,
  history: [
    {
      operation: "Create",
      name: "Liberty Metro",
      description: `Name: Liberty Metro, Country: United States (US), Merged from: ${SYSTEM_CITIES[0].name} (ID: ${getSystemCityDisplayId(0)}), ${SYSTEM_CITIES[1].name} (ID: ${getSystemCityDisplayId(1)})`,
      userName: "Rafiul Karim",
      userEmail: "rafiul.karim@mynztrip.com",
      timestamp: new Date("2026-06-23T09:30:00"),
    },
  ],
  cityType: "merged",
  mergedFrom: [0, 1],
});

// Matching component-side entries for the Liberty Metro demo above — same
// user/timestamp as its own Create entry, so New York's and Los Angeles's
// own History views show they were folded into it (see the dual-side
// Merged/Unmerged convention in city-system.html's saveMergeCityBtn/
// saveEditMergeBtn handlers).
SYSTEM_CITIES[0].history.push({
  operation: "Merged",
  description: `Merged into: Liberty Metro (ID: ${getSystemCityDisplayId(DEMO_MERGED_CITY_ID)})`,
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-23T09:30:00"),
});
SYSTEM_CITIES[1].history.push({
  operation: "Merged",
  description: `Merged into: Liberty Metro (ID: ${getSystemCityDisplayId(DEMO_MERGED_CITY_ID)})`,
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-23T09:30:00"),
});

// restore any edits/new/merged cities saved from a previous session
hydrateArray(SYSTEM_CITIES, loadFromStorage("SYSTEM_CITIES"));

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

// Demo hotel directly added under the seeded New City above (Crestwood Bay)
// — gives New City's Summary a real "Directly Added Hotels" example with
// zero setup, same reasoning as the New City/Merged City seeding above.
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
const demoNewCityForHotelDemo = SYSTEM_CITIES.find((c) => c.id === DEMO_NEW_CITY_ID && c.cityType === "normal");
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

hydrateArray(SYSTEM_HOTELS, loadFromStorage("SYSTEM_HOTELS"));

// hydrateArray fully replaces SYSTEM_HOTELS with whatever's in localStorage,
// which wipes out systemCityId for any hotel saved before the Add/Edit form
// switched City from free text to a SYSTEM_CITIES picker (or before
// systemCityId was hardcoded into the seed literals above) — self-heal it
// the same way the cityType correction above does, instead of relying on
// the user clearing localStorage by hand. This is a last-resort fallback
// for genuinely legacy saved data only: the seed hotels above already carry
// a hardcoded systemCityId (not name-matched, precisely to avoid this same
// matching being fragile against a city rename — see the comment on
// SYSTEM_HOTELS), and every hotel created via the form always has one set
// too, so this loop is a no-op for all of them.
SYSTEM_HOTELS.forEach((h) => {
  if (h.systemCityId !== undefined && h.systemCityId !== null) return;
  const match = SYSTEM_CITIES.find((c) => !c.cityType && c.name === h.city && c.country.code === h.country.code);
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

// The seed cities (first SEED_CITY_COUNT, in their fixed definition order —
// nothing ever removes or reorders them) must never carry a cityType, even
// if a stale save from an older build of the app persisted one. This makes
// "which cities were actually created via Add City" self-correcting on every
// load instead of depending on the user clearing localStorage by hand.
SYSTEM_CITIES.slice(0, SEED_CITY_COUNT).forEach((c) => {
  delete c.cityType;
});

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
  ],
  hotelbeds: [
    { name: "Las Vegas", state: "Nevada", countryCode: "US", systemCityId: 5 },
    { name: "Dubai Marina", state: null, countryCode: "AE", systemCityId: 24 },
    { name: "Abu Dhabi City", state: null, countryCode: "AE", systemCityId: null },
    { name: "Bangkok", state: null, countryCode: "TH", systemCityId: 26 },
    { name: "Kuala Lumpur City", state: null, countryCode: "MY", systemCityId: null },
  ],
  tbo: [
    { name: "Mumbai", state: null, countryCode: "IN", systemCityId: 30 },
    { name: "New Delhi", state: null, countryCode: "IN", systemCityId: null },
    { name: "Colombo", state: null, countryCode: "LK", systemCityId: null },
    { name: "Kathmandu", state: null, countryCode: "NP", systemCityId: null },
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
// scoped to one supplier at a time, but within that one supplier it can
// map/remap/unmap several of that supplier's own cities against the same
// pinned system city in a single click — Los Angeles's own history should
// show all 3 as one grouped card (see renderHistoryList() in
// js/app.js), not three disconnected entries. Story: Agoda's "Toronto" row
// had been mis-mapped to Los Angeles by mistake and got corrected over to
// the real Toronto system city in the same sitting a newly-found Agoda
// city was mapped in and a duplicate/test entry was removed.
supplierCities.agoda[9].systemCityId = 1; // final state must match the "Map" entry below
{
  const laLabel = getSystemCityHistoryLabel(1);
  const torontoLabel = getSystemCityHistoryLabel(10);
  const groupId = "grp-demo-la-cleanup";
  const timestamp = new Date("2026-06-27T16:00:00");
  const userName = "Farhan Ahmed";
  const userEmail = "farhan.ahmed@mynztrip.com";

  const torontoRow = supplierCities.agoda[2]; // was mapped to LA, corrected to the real Toronto
  const freshRow = supplierCities.agoda[9]; // freshly mapped to LA in the same batch
  const removedRow = supplierCities.agoda[10]; // unmapped from LA in the same batch

  torontoRow.history.push({
    operation: "Remap",
    description: `${laLabel} -> ${torontoLabel}`,
    userName,
    userEmail,
    timestamp,
  });
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
      operation: "Remap",
      description: `${SUPPLIER_LABELS.agoda} — ${torontoRow.name} (${torontoRow.countryCode}) — ID: ${torontoRow.id}${HISTORY_LINE_BREAK}${laLabel} -> ${torontoLabel}`,
      userName,
      userEmail,
      timestamp,
      groupId,
    },
    {
      operation: "Map",
      description: `${SUPPLIER_LABELS.agoda} — ${freshRow.name} (${freshRow.countryCode}) — ID: ${freshRow.id}`,
      userName,
      userEmail,
      timestamp,
      groupId,
    },
    {
      operation: "Unmap",
      description: `${SUPPLIER_LABELS.agoda} — ${removedRow.name} (${removedRow.countryCode}) — ID: ${removedRow.id}`,
      userName,
      userEmail,
      timestamp,
      groupId,
    }
  );
  SYSTEM_CITIES[10].history.push({
    operation: "Remap",
    description: `${SUPPLIER_LABELS.agoda} — ${torontoRow.name} (${torontoRow.countryCode}) — ID: ${torontoRow.id}${HISTORY_LINE_BREAK}${laLabel} -> ${torontoLabel}`,
    userName,
    userEmail,
    timestamp,
    groupId,
  });
}

// restore any mappings saved from a previous session
hydrateObject(supplierCities, loadFromStorage("supplierCities"));

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
// (city-mapping.html, city-supplier.html) — assigns (or clears) the
// mapping and logs it from BOTH sides. The supplier city has one evolving
// value (its systemCityId), so it gets a Map (first time) / Remap (changed
// to a different city) / Unmap (cleared) changelog entry — never Edit/Create,
// which are reserved for entity-property changes, not mapping actions (same
// vocabulary as applyCountryMapping's country-mapping equivalent). A system
// city instead has a *set* of supplier cities mapped to it, so each affected
// system city gets its own additive/removal log line — but a remap (city A
// -> city B) is one event touching two records, not two independent actions,
// so BOTH A and B log it as Remap too, not Unmap/Map. `groupId` is optional —
// callers that apply several rows in one batch (city-mapping.html's Save,
// always scoped to one supplier at a time) generate one shared id and pass
// it into every call so the affected system city's history can show them as
// one grouped event instead of several disconnected entries; a caller that
// only ever changes one row at a time (every other call site) can omit it
// and this function makes its own.
function applyMapping(supplierKey, row, newSystemCityId, groupId) {
  const oldId = row.systemCityId;
  if (oldId === newSystemCityId) return;
  const oldLabel = oldId !== null && oldId !== undefined ? getSystemCityHistoryLabel(oldId) : null;
  const newLabel = newSystemCityId !== null ? getSystemCityHistoryLabel(newSystemCityId) : null;
  const supplierCityLabel = `${SUPPLIER_LABELS[supplierKey]} — ${row.name} (${row.countryCode}) — ID: ${row.id}`;
  const isRemap = Boolean(oldLabel) && Boolean(newLabel);
  const resolvedGroupId = groupId || generateHistoryGroupId();
  const timestamp = new Date();
  // On a genuine remap, both affected system cities' own history must say
  // exactly where the supplier city moved from and to, including each
  // city's own ID (same ID-suffixed getSystemCityHistoryLabel used for
  // oldLabel/newLabel above) — same "old -> new" convention as country
  // mapping. HISTORY_LINE_BREAK (js/app.js) puts this on its own line
  // instead of cramming the "who" and the "old -> new" (now with two IDs)
  // into one dense sentence.
  const remapSuffix = isRemap ? `${HISTORY_LINE_BREAK}${getSystemCityHistoryLabel(oldId)} -> ${getSystemCityHistoryLabel(newSystemCityId)}` : "";

  row.systemCityId = newSystemCityId;
  row.history.push({
    operation: !oldLabel ? "Map" : newLabel ? "Remap" : "Unmap",
    description: newLabel ? (oldLabel ? `${oldLabel} -> ${newLabel}` : `${newLabel}`) : `${oldLabel} -> Not mapped`,
    userName: CURRENT_USER.name,
    userEmail: CURRENT_USER.email,
    timestamp,
  });

  if (oldId !== null && oldId !== undefined) {
    const oldCity = SYSTEM_CITIES.find((c) => c.id === oldId);
    if (oldCity) {
      oldCity.history.push({
        operation: isRemap ? "Remap" : "Unmap",
        description: `${supplierCityLabel}${remapSuffix}`,
        userName: CURRENT_USER.name,
        userEmail: CURRENT_USER.email,
        timestamp,
        groupId: resolvedGroupId,
      });
    }
  }
  if (newSystemCityId !== null) {
    const newCity = SYSTEM_CITIES.find((c) => c.id === newSystemCityId);
    if (newCity) {
      newCity.history.push({
        operation: isRemap ? "Remap" : "Map",
        description: `${supplierCityLabel}${remapSuffix}`,
        userName: CURRENT_USER.name,
        userEmail: CURRENT_USER.email,
        timestamp,
        groupId: resolvedGroupId,
      });
    }
  }

  saveToStorage("supplierCities", supplierCities);
  saveToStorage("SYSTEM_CITIES", SYSTEM_CITIES);
}

// Cross-supplier mapping summary for a system city — used by city-system.html's
// Summary action. Unlike country mapping (at most one supplier country maps
// to a given system country), a system city can have MANY supplier cities
// mapped to it from the same supplier, so each entry carries a `cities`
// array rather than a single match like getMappingSummary() does.
// `systemCityId` also accepts an array of ids — a merged city has no supplier
// cities mapped to it directly, so its Summary instead unions the mappings of
// every system city it was merged from, showing every hotel indirectly linked
// to it through any of those component cities.
function getCityMappingSummary(systemCityId) {
  const ids = Array.isArray(systemCityId) ? systemCityId : [systemCityId];
  return Object.keys(SUPPLIER_LABELS).map((key) => {
    const cities = (supplierCities[key] || []).filter((row) => ids.includes(row.systemCityId));
    return {
      supplierKey: key,
      supplierLabel: SUPPLIER_LABELS[key],
      mapped: cities.length > 0,
      cities,
    };
  });
}

// ---------- Supplier Hotel ----------
// Mirrors SYSTEM_HOTELS' own fields (name/address/city/state/country/star
// rating/email/phone), plus its own providerId — the id this supplier's feed
// reports for the hotel, matched against SYSTEM_HOTELS' own providerId via
// findSystemHotelByProviderId() rather than stored as a direct reference
// (unlike every other supplier entity in this project, a supplier hotel is
// read-only: hotel-supplier.html has no Map/Edit/History action for it, it's
// purely a reference list of what each supplier's own hotel feed last
// reported (hence updatedAt per row instead of a history array), and a real
// feed can only ever report the provider id it was given — never one of
// this project's own internal ids).
const supplierHotels = {
  agoda: [
    { name: "Grand Plaza New York", address: "123 5th Ave", city: "New York", state: "New York", country: { name: "United States", code: "US" }, starRating: 5, email: "reservations@grandplazanewyork.com", phoneNumber: "+1 212 555 0101", providerId: "PRV-1001", active: true, updatedAt: new Date("2026-06-18T09:12:00") },
    { name: "The Beverly Hilton", address: "9876 Wilshire Blvd", city: "Los Angeles", state: "California", country: { name: "United States", code: "US" }, starRating: 4, email: "info@beverlyhilton.com", phoneNumber: "+1 310 555 0172", providerId: "PRV-1002", active: true, updatedAt: new Date("2026-06-19T11:40:00") },
    { name: "Ritz Paris Suites", address: "15 Place Vendome", city: "Paris", state: null, country: { name: "France", code: "FR" }, starRating: 5, email: "reservation@ritzparis.fr", phoneNumber: "+33 1 55 55 0145", providerId: "PRV-1006", active: true, updatedAt: new Date("2026-06-20T08:05:00") },
    { name: "Agoda Exclusive Sentosa Resort", address: "8 Sentosa Gateway", city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, starRating: 4, email: "stay@sentosaresort.sg", phoneNumber: "+65 6555 0120", providerId: null, active: true, updatedAt: new Date("2026-06-21T14:22:00") },
    { name: "Downtown Chicago Inn", address: "220 E Superior St", city: "Chicago", state: "Illinois", country: { name: "United States", code: "US" }, starRating: 3, email: "frontdesk@downtownchicagoinn.com", phoneNumber: "+1 312 555 0199", providerId: null, active: false, updatedAt: new Date("2026-06-15T16:50:00") },
  ],
  booking: [
    { name: "Grand Plaza New York", address: "123 5th Ave", city: "New York", state: "New York", country: { name: "United States", code: "US" }, starRating: 5, email: "reservations@grandplazanewyork.com", phoneNumber: "+1 212 555 0101", providerId: "PRV-1001", active: true, updatedAt: new Date("2026-06-17T10:30:00") },
    { name: "Hotel Adlon Berlin", address: "Pariser Platz 3", city: "Berlin", state: null, country: { name: "Germany", code: "DE" }, starRating: 5, email: "info@adlonberlin.de", phoneNumber: "+49 30 555 0187", providerId: "PRV-1007", active: true, updatedAt: new Date("2026-06-19T09:00:00") },
    { name: "Booking Riverside Lodge", address: "44 Riverside Ave", city: "Toronto", state: "Ontario", country: { name: "Canada", code: "CA" }, starRating: 3, email: "stay@riversidelodge.ca", phoneNumber: "+1 416 555 0166", providerId: null, active: true, updatedAt: new Date("2026-06-22T13:15:00") },
    { name: "Manchester City Suites", address: "12 Deansgate", city: "Manchester", state: null, country: { name: "United Kingdom", code: "GB" }, starRating: 3, email: "reservations@manchestercitysuites.co.uk", phoneNumber: "+44 161 555 0110", providerId: null, active: true, updatedAt: new Date("2026-06-14T09:45:00") },
  ],
  hotelbeds: [
    { name: "Marina Bay Sands", address: "10 Bayfront Ave", city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, starRating: 5, email: "enquiry@marinabaysands.sg", phoneNumber: "+65 6555 0188", providerId: "PRV-1009", active: true, updatedAt: new Date("2026-06-20T17:10:00") },
    { name: "Burj Al Arab", address: "Jumeirah St", city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, starRating: 5, email: "reservations@burjalarab.ae", phoneNumber: "+971 4 555 0199", providerId: "PRV-1011", active: true, updatedAt: new Date("2026-06-21T12:00:00") },
    { name: "HotelBeds Desert Oasis Resort", address: "Al Maktoum Rd", city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, starRating: 4, email: "stay@desertoasisresort.ae", phoneNumber: "+971 4 555 0166", providerId: null, active: true, updatedAt: new Date("2026-06-16T15:35:00") },
  ],
  tbo: [
    { name: "Taj Mahal Palace", address: "Apollo Bunder", city: "Mumbai", state: null, country: { name: "India", code: "IN" }, starRating: 5, email: "tajmahalpalace.mumbai@tajhotels.in", phoneNumber: "+91 22 5555 0166", providerId: "PRV-1012", active: true, updatedAt: new Date("2026-06-18T14:40:00") },
    { name: "Shangri-La Bangkok", address: "89 Soi Wat Suan Plu", city: "Bangkok", state: null, country: { name: "Thailand", code: "TH" }, starRating: 5, email: "sbk@shangri-la.th", phoneNumber: "+66 2 555 0177", providerId: "PRV-1013", active: true, updatedAt: new Date("2026-06-19T16:20:00") },
    { name: "TBO Heritage Haveli", address: "Pink City Rd", city: "Jaipur", state: null, country: { name: "India", code: "IN" }, starRating: 3, email: "stay@heritagehaveli.in", phoneNumber: "+91 141 555 0122", providerId: null, active: false, updatedAt: new Date("2026-06-13T10:05:00") },
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
const NON_SYSTEM_DEMO_CITIES = [
  { name: "Rio de Janeiro", country: { name: "Brazil", code: "BR" } },
  { name: "Amsterdam", country: { name: "Netherlands", code: "NL" } },
  { name: "Zurich", country: { name: "Switzerland", code: "CH" } },
  { name: "Stockholm", country: { name: "Sweden", code: "SE" } },
  { name: "Oslo", country: { name: "Norway", code: "NO" } },
  { name: "Jakarta", country: { name: "Indonesia", code: "ID" } },
  { name: "Auckland", country: { name: "New Zealand", code: "NZ" } },
  { name: "Seoul", country: { name: "South Korea", code: "KR" } },
  { name: "Cape Town", country: { name: "South Africa", code: "ZA" } },
  { name: "Cancun", country: { name: "Mexico", code: "MX" } },
  { name: "Istanbul", country: { name: "Turkey", code: "TR" } },
  { name: "Doha", country: { name: "Qatar", code: "QA" } },
  { name: "Riyadh", country: { name: "Saudi Arabia", code: "SA" } },
  { name: "Cairo", country: { name: "Egypt", code: "EG" } },
  { name: "Lisbon", country: { name: "Portugal", code: "PT" } },
  { name: "Dublin", country: { name: "Ireland", code: "IE" } },
  { name: "Athens", country: { name: "Greece", code: "GR" } },
  { name: "Hanoi", country: { name: "Vietnam", code: "VN" } },
  { name: "Manila", country: { name: "Philippines", code: "PH" } },
  { name: "Jaipur", country: { name: "India", code: "IN" } },
];

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

// ~80% of rows land in a real system city (weighted toward the 36
// hand-authored/"named" ones so results read like real destinations, not
// just the 200 generated US filler towns), ~20% in a city the system has no
// record of at all.
function pickBulkHotelCity(seed) {
  if (hashSeed(seed, 1) % 5 === 4) {
    const demoCity = NON_SYSTEM_DEMO_CITIES[hashSeed(seed, 2) % NON_SYSTEM_DEMO_CITIES.length];
    return { name: demoCity.name, state: null, country: demoCity.country, systemCity: null };
  }
  const namedCities = SYSTEM_CITIES.slice(0, 36);
  const pool = hashSeed(seed, 3) % 3 === 0 ? SYSTEM_CITIES.slice(0, SEED_CITY_COUNT) : namedCities;
  const city = pool[hashSeed(seed, 4) % pool.length];
  return { name: city.name, state: city.state, country: city.country, systemCity: city };
}

Object.keys(supplierHotels).forEach((key, supplierIndex) => {
  for (let i = 0; i < BULK_SUPPLIER_HOTEL_COUNT; i++) {
    const seed = supplierIndex * 1000 + i;
    const place = pickBulkHotelCity(seed);
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

Object.keys(supplierHotels).forEach((key) => {
  supplierHotels[key].forEach((row, i) => {
    row.id = generateSupplierHotelId(key, i);
  });
});

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

// Hotel-based Summary for a New City: hotels attached directly (via Add
// Hotel's own city field) vs hotels attached through the Map feature above.
// Kept as two separate lists (rather than merged/deduped) since they're
// added through two different actions and a city-system.html Summary
// reader should be able to tell which is which.
function getNewCityHotelSummary(cityId) {
  return {
    direct: SYSTEM_HOTELS.filter((h) => h.systemCityId === cityId),
    mapped: SYSTEM_HOTELS.filter((h) => (h.mappedCityIds || []).includes(cityId)),
  };
}
