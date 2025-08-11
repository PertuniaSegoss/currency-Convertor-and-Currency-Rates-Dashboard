const API_BASE_URL = "https://api.frankfurter.app";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultDisplay = document.getElementById("result");
const ctx = document.getElementById("rateChart").getContext("2d");

const ratesTableBody = document.querySelector("#ratesTable tbody");
const baseCurrencyDisplay = document.getElementById("baseCurrencyDisplay");
const searchInput = document.getElementById("searchRates");

let chart;

// List of supported currencies and their names
const supportedCurrencies = {
  AED: "United Arab Emirates Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTC: "Bitcoin",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswana Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUC: "Cuban Convertible Peso",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  GBP: "British Pound Sterling",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanaese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  IMP: "Manx pound",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Króna",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgystani Som",
  KHR: "Cambodian Riel",
  KMF: "Comorian Franc",
  KPW: "North Korean Won",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Laotian Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanma Kyat",
  MNT: "Mongolian Tugrik",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Nuevo Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Zloty",
  PYG: "Paraguayan Guarani",
  QAR: "Qatari Rial",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLL: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SPL: "Seborgan Luigino",
  SRD: "Surinamese Dollar",
  STN: "Sao Tomean Dobra",
  SVC: "Salvadoran Colón",
  SYP: "Syrian Pound",
  SZL: "Swazi Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Paʻanga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TVD: "Tuvaluan Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistani Som",
  VES: "Venezuelan Bolívar Soberano",
  VND: "Vietnamese Dong",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XAF: "Central African CFA Franc",
  XCD: "East Caribbean Dollar",
  XDR: "Special Drawing Rights",
  XOF: "West African CFA Franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWD: "Zimbabwean Dollar"
};

// Populate dropdown menus
function populateCurrencyDropdowns() {
  fromCurrency.innerHTML = "";
  toCurrency.innerHTML = "";

  for (const [code, name] of Object.entries(supportedCurrencies)) {
    const optionFrom = document.createElement("option");
    optionFrom.value = code;
    optionFrom.textContent = `${code} — ${name}`;
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = code;
    optionTo.textContent = `${code} — ${name}`;
    toCurrency.appendChild(optionTo);
  }

  // Set defaults
  fromCurrency.value = "EUR";
  toCurrency.value = "USD";
}

// Fetch latest rate for one pair
async function fetchLatestRate(from, to) {
  const url = `${API_BASE_URL}/latest?from=${from}&to=${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch latest rate");
  const data = await res.json();
  return data.rates[to];
}

// Fetch historical rates for last `days` days
async function fetchHistoricalRates(from, to, days = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  const start = startDate.toISOString().slice(0, 10);
  const end = endDate.toISOString().slice(0, 10);

  const url = `${API_BASE_URL}/${start}..${end}?from=${from}&to=${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch historical rates");
  const data = await res.json();
  return data.rates;
}

// Fetch all latest rates for base currency
async function fetchAllLatestRates(base = "EUR") {
  const url = `${API_BASE_URL}/latest?from=${base}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch all latest rates");
  const data = await res.json();
  return data.rates;
}

// Update chart with new data
function updateChart(labels, data) {
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Exchange Rate",
        data,
        borderColor: "rgba(74, 144, 226, 1)",
        backgroundColor: "rgba(74, 144, 226, 0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 7
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Rate" }, beginAtZero: false }
      },
      responsive: true,
      plugins: {
        legend: { display: true, labels: { font: { size: 14 } } },
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });
}

// Populate rates table, filter optional
function populateRatesTable(rates, filter = "") {
  ratesTableBody.innerHTML = "";
  filter = filter.trim().toUpperCase();

  const filteredRates = Object.entries(rates)
    .filter(([code]) => {
      const name = supportedCurrencies[code] || "";
      return code.includes(filter) || name.toUpperCase().includes(filter);
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (filteredRates.length === 0) {
    const row = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "No currencies match your search.";
    td.style.textAlign = "center";
    row.appendChild(td);
    ratesTableBody.appendChild(row);
    return;
  }

  for (const [currency, rate] of filteredRates) {
    const row = document.createElement("tr");
    const currencyCell = document.createElement("td");
    currencyCell.textContent = `${currency} — ${supportedCurrencies[currency] || ""}`;
    const rateCell = document.createElement("td");
    rateCell.textContent = rate.toFixed(4);
    row.appendChild(currencyCell);
    row.appendChild(rateCell);
    ratesTableBody.appendChild(row);
  }
}

// Main function: convert and update all displays
async function convertAndGraph() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(amountInput.value);

  baseCurrencyDisplay.textContent = from;

  if (!amount || amount <= 0) {
    resultDisplay.textContent = "Enter a valid amount";
    if (chart) chart.destroy();
    ratesTableBody.innerHTML = "";
    return;
  }

  try {
    const rate = await fetchLatestRate(from, to);
    const converted = (amount * rate).toFixed(4);
    resultDisplay.textContent = `${amount} ${from} = ${converted} ${to}`;

    const historicalRates = await fetchHistoricalRates(from, to, 7);
    const labels = Object.keys(historicalRates);
    const data = labels.map(date => historicalRates[date][to]);

    updateChart(labels, data);

    const allRates = await fetchAllLatestRates(from);
    populateRatesTable(allRates, searchInput.value);

  } catch (error) {
    resultDisplay.textContent = "Error fetching data. Try again later.";
    if (chart) chart.destroy();
    ratesTableBody.innerHTML = "";
    console.error(error);
  }
}

// Event listeners
amountInput.addEventListener("input", convertAndGraph);
fromCurrency.addEventListener("change", convertAndGraph);
toCurrency.addEventListener("change", convertAndGraph);
searchInput.addEventListener("input", () => {
  // Filter the table based on search input
  populateRatesTable(allRatesCache, searchInput.value);
});

let allRatesCache = {};

// Initial setup
(async function init() {
  populateCurrencyDropdowns();

  // Fetch initial all rates for default base (EUR)
  allRatesCache = await fetchAllLatestRates("EUR");

  // Initial populate table and graph
  populateRatesTable(allRatesCache);
  convertAndGraph();
})();

