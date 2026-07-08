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
  { operation: "Edit", name: "United States of America", description: "Name: United States -> United States of America", userName: "Nusrat Jahan", userEmail: "nusrat.jahan@mynztrip.com", timestamp: new Date("2026-06-20T14:47:00") }
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
  operation: "Create",
  systemCountry: "United States",
  description: "Mapped To: United States",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-18T09:12:00"),
});
supplierCountries.hotelbeds[0].history.push({
  operation: "Create",
  systemCountry: "United States",
  description: "Mapped To: United States",
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
  description: "Mapped supplier city: Agoda — New York City (US)",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-19T13:40:00"),
});
SYSTEM_CITIES[0].history.push({
  operation: "Map",
  description: "Mapped supplier city: Booking.com — New York (US)",
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-20T09:15:00"),
});
SYSTEM_CITIES[0].history.push({
  operation: "Map",
  description: "Mapped supplier city: Agoda — Manhattan (US)",
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-21T11:05:00"),
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
  { name: "Grand Plaza New York", address: "123 5th Ave", latitude: 40.7128, longitude: -74.006, starRating: 5, city: "New York", state: "New York", country: { name: "United States", code: "US" }, systemCityId: 0 },
  { name: "The Beverly Hilton", address: "9876 Wilshire Blvd", latitude: 34.0522, longitude: -118.2437, starRating: 4, city: "Los Angeles", state: "California", country: { name: "United States", code: "US" }, systemCityId: 1 },
  { name: "The Peninsula Chicago", address: "108 E Superior St", latitude: 41.8955, longitude: -87.6244, starRating: 5, city: "Chicago", state: "Illinois", country: { name: "United States", code: "US" }, systemCityId: 3 },
  { name: "Fairmont Royal York", address: "100 Front St W", latitude: 43.6455, longitude: -79.3806, starRating: 4, city: "Toronto", state: "Ontario", country: { name: "Canada", code: "CA" }, systemCityId: 10 },
  { name: "The Savoy London", address: "Strand", latitude: 51.51, longitude: -0.12, starRating: 5, city: "London", state: null, country: { name: "United Kingdom", code: "GB" }, systemCityId: 17 },
  { name: "Hotel Ritz Paris", address: "15 Place Vendome", latitude: 48.8683, longitude: 2.3289, starRating: 5, city: "Paris", state: null, country: { name: "France", code: "FR" }, systemCityId: 19 },
  { name: "Hotel Adlon Berlin", address: "Pariser Platz 3", latitude: 52.5163, longitude: 13.3777, starRating: 5, city: "Berlin", state: null, country: { name: "Germany", code: "DE" }, systemCityId: 34 },
  { name: "Park Hyatt Tokyo", address: "3-7-1-2 Nishi Shinjuku", latitude: 35.6852, longitude: 139.6905, starRating: 5, city: "Tokyo", state: null, country: { name: "Japan", code: "JP" }, systemCityId: 21 },
  { name: "Marina Bay Sands", address: "10 Bayfront Ave", latitude: 1.2834, longitude: 103.8607, starRating: 5, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, systemCityId: 23 },
  { name: "The Fullerton Hotel", address: "1 Fullerton Square", latitude: 1.2865, longitude: 103.8535, starRating: 5, city: "Singapore", state: null, country: { name: "Singapore", code: "SG" }, systemCityId: 23 },
  { name: "Burj Al Arab", address: "Jumeirah St", latitude: 25.1412, longitude: 55.1853, starRating: 5, city: "Dubai", state: null, country: { name: "United Arab Emirates", code: "AE" }, systemCityId: 24 },
  { name: "Taj Mahal Palace", address: "Apollo Bunder", latitude: 18.922, longitude: 72.8332, starRating: 5, city: "Mumbai", state: null, country: { name: "India", code: "IN" }, systemCityId: 30 },
  { name: "Shangri-La Bangkok", address: "89 Soi Wat Suan Plu", latitude: 13.7223, longitude: 100.5147, starRating: 5, city: "Bangkok", state: null, country: { name: "Thailand", code: "TH" }, systemCityId: 26 },
  { name: "Park Hyatt Sydney", address: "7 Hickson Rd", latitude: -33.8568, longitude: 151.2153, starRating: 5, city: "Sydney", state: null, country: { name: "Australia", code: "AU" }, systemCityId: 28 },
];

SYSTEM_HOTELS.forEach((h, i) => {
  h.id = i;
  h.history = [];
  h.active = true;
});
const SEED_HOTEL_COUNT = SYSTEM_HOTELS.length;

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

// Full disambiguating label for a system hotel, mirroring getSystemCityLabel
// — not called by anything yet, but the eventual Hotel Mapping feature will
// need it the same way city-mapping.html needs getSystemCityLabel.
function getSystemHotelLabel(id) {
  const hotel = SYSTEM_HOTELS.find((h) => h.id === id);
  if (!hotel) return null;
  const loc = resolveHotelLocation(hotel);
  return [hotel.name, loc.city, loc.state, getSystemCountryName(loc.country.code) || loc.country.name].filter(Boolean).join(", ");
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

Object.keys(supplierCities).forEach((key) => {
  supplierCities[key].forEach((row, i) => {
    row.id = i;
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
  operation: "Create",
  systemCityLabel: getSystemCityLabel(0),
  description: `Mapped To: ${getSystemCityLabel(0)}`,
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-19T13:40:00"),
});
supplierCities.booking[0].history.push({
  operation: "Create",
  systemCityLabel: getSystemCityLabel(0),
  description: `Mapped To: ${getSystemCityLabel(0)}`,
  userName: "Rafiul Karim",
  userEmail: "rafiul.karim@mynztrip.com",
  timestamp: new Date("2026-06-20T09:15:00"),
});
supplierCities.agoda[8].history.push({
  operation: "Create",
  systemCityLabel: getSystemCityLabel(0),
  description: `Mapped To: ${getSystemCityLabel(0)}`,
  userName: "Farhan Ahmed",
  userEmail: "farhan.ahmed@mynztrip.com",
  timestamp: new Date("2026-06-21T11:05:00"),
});

// restore any mappings saved from a previous session
hydrateObject(supplierCities, loadFromStorage("supplierCities"));

// Shared by every page that maps/unmaps a supplier city to a system city
// (city-mapping.html, city-supplier.html) — assigns (or clears) the
// mapping and logs it from BOTH sides. The supplier city has one evolving
// value (its systemCityId), so it gets an old -> new changelog entry, same
// as every other Edit. A system city instead has a *set* of supplier cities
// mapped to it, so it gets additive/removal log lines (Map/Unmap) rather
// than a changelog — a remap (city A -> city B) therefore writes 3 entries
// total: one Edit on the supplier city, one Unmap on A, one Map on B.
function applyMapping(supplierKey, row, newSystemCityId) {
  const oldId = row.systemCityId;
  if (oldId === newSystemCityId) return;
  const oldLabel = oldId !== null && oldId !== undefined ? getSystemCityLabel(oldId) : null;
  const newLabel = newSystemCityId !== null ? getSystemCityLabel(newSystemCityId) : null;
  const supplierCityLabel = `${SUPPLIER_LABELS[supplierKey]} — ${row.name} (${row.countryCode})`;

  row.systemCityId = newSystemCityId;
  row.history.push({
    operation: oldLabel ? "Edit" : "Create",
    description: newLabel ? (oldLabel ? `Mapped To: ${oldLabel} -> ${newLabel}` : `Mapped To: ${newLabel}`) : `Mapped To: ${oldLabel} -> Not mapped`,
    userName: CURRENT_USER.name,
    userEmail: CURRENT_USER.email,
    timestamp: new Date(),
  });

  if (oldId !== null && oldId !== undefined) {
    const oldCity = SYSTEM_CITIES.find((c) => c.id === oldId);
    if (oldCity) {
      oldCity.history.push({
        operation: "Unmap",
        description: `Unmapped supplier city: ${supplierCityLabel}`,
        userName: CURRENT_USER.name,
        userEmail: CURRENT_USER.email,
        timestamp: new Date(),
      });
    }
  }
  if (newSystemCityId !== null) {
    const newCity = SYSTEM_CITIES.find((c) => c.id === newSystemCityId);
    if (newCity) {
      newCity.history.push({
        operation: "Map",
        description: `Mapped supplier city: ${supplierCityLabel}`,
        userName: CURRENT_USER.name,
        userEmail: CURRENT_USER.email,
        timestamp: new Date(),
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
function getCityMappingSummary(systemCityId) {
  return Object.keys(SUPPLIER_LABELS).map((key) => {
    const cities = (supplierCities[key] || []).filter((row) => row.systemCityId === systemCityId);
    return {
      supplierKey: key,
      supplierLabel: SUPPLIER_LABELS[key],
      mapped: cities.length > 0,
      cities,
    };
  });
}
