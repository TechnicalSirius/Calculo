const previewElement = document.querySelector('.screen-preview');
const displayElement = document.querySelector('.screen-display');
const buttons = document.querySelectorAll('[data-value]');
const historyListElement = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggleBtn = document.getElementById('theme-toggle');
const advancedToggleBtn = document.getElementById('advanced-toggle');
const advancedPanel = document.getElementById('advanced-panel');
const advancedTabs = document.querySelectorAll('.advanced-tab');
const advancedSections = document.querySelectorAll('.advanced-panel-section');
const toolContainer = document.getElementById('tool-container');
const toolReadyBtn = document.getElementById('tool-ready');
const toolResetBtn = document.getElementById('tool-reset');
const selectedToolStatus = document.getElementById('selected-tool-status');
const calculatorCard = document.querySelector('.calculator-card');
const historyTitleElement = document.querySelector('.history-title');
const historySubtitleElement = document.querySelector('.history-subtitle');

let expression = '';
let standardHistory = [];
let advancedHistory = [];
let activeMode = 'Standard';
let isAdvancedOpen = false;
let selectedTool = null;
const operators = ['+', '-', '*', '/'];
const toolLabels = {
  age: 'Age Calculator',
  bmi: 'BMI Calculator',
  discount: 'Discount Calculator',
  percentage: 'Percentage Calculator',
  date: 'Date Tools',
  length: 'Length Converter',
  area: 'Area Converter',
  volume: 'Volume Converter',
  mass: 'Mass Converter',
  gst: 'GST Calculator',
  numbers: 'Numerical System',
  currency: 'Currency Converter',
  trig: 'Trigonometry',
  logs: 'Logarithms',
  powers: 'Powers',
  permutations: 'Permutations',
  equation: 'Equation Solver',
  unit: 'Unit Converter',
  programmer: 'Programmer Mode',
  storage: 'Data Storage',
};

const currencyList = {
  USD: 'United States Dollar', EUR: 'Euro', GBP: 'British Pound',
  INR: 'Indian Rupee', JPY: 'Japanese Yen', CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  AED: 'UAE Dirham', SGD: 'Singapore Dollar', ZAR: 'South African Rand',
  MXN: 'Mexican Peso', BRL: 'Brazilian Real', RUB: 'Russian Ruble',
  KRW: 'South Korean Won', TRY: 'Turkish Lira', NZD: 'New Zealand Dollar',
  THB: 'Thai Baht', MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah',
  SAR: 'Saudi Riyal', QAR: 'Qatari Rial', KWD: 'Kuwaiti Dinar',
  HKD: 'Hong Kong Dollar', SEK: 'Swedish Krona', NOK: 'Norwegian Krone',
  DKK: 'Danish Krone', EGP: 'Egyptian Pound', PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka', VND: 'Vietnamese Dong', PHP: 'Philippine Peso',
  ILS: 'Israeli New Shekel', PLN: 'Polish Zloty', ARS: 'Argentine Peso',
  CLP: 'Chilean Peso', COP: 'Colombian Peso', PEN: 'Peruvian Sol',
  NGN: 'Nigerian Naira', KES: 'Kenyan Shilling', GHS: 'Ghanaian Cedi',
  MAD: 'Moroccan Dirham', DZD: 'Algerian Dinar', TND: 'Tunisian Dinar',
  ISK: 'Icelandic Króna', LKR: 'Sri Lankan Rupee', OMR: 'Omani Rial',
  BHD: 'Bahraini Dinar', HUF: 'Hungarian Forint', CZK: 'Czech Koruna',
  RON: 'Romanian Leu', PLN: 'Polish Zloty', NOK: 'Norwegian Krone',
};

const currencyRates = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 138.2, CAD: 1.35,
  AUD: 1.47, CHF: 0.93, CNY: 7.25, AED: 3.67, SGD: 1.35, ZAR: 18.3,
  MXN: 18.7, BRL: 5.16, RUB: 96.8, KRW: 1320, TRY: 30.4, NZD: 1.61,
  THB: 34.3, MYR: 4.45, IDR: 15400, SAR: 3.75, QAR: 3.64, KWD: 0.30,
  HKD: 7.82, SEK: 10.5, NOK: 10.8, DKK: 6.9, EGP: 30.9, PKR: 279,
  BDT: 111, VND: 23600, PHP: 56.3, ILS: 3.5, PLN: 4.2, ARS: 800,
  CLP: 824, COP: 3880, PEN: 3.7, NGN: 1280, KES: 147, GHS: 12.5,
  MAD: 10.4, DZD: 139, TND: 3.1, ISK: 135, LKR: 324, OMR: 0.38,
  BHD: 0.38, HUF: 336, CZK: 23.1, RON: 4.3,
};

function updateSelectedToolStatus() {
  const name = selectedTool ? (toolLabels[selectedTool] || selectedTool) : 'none';
  selectedToolStatus.textContent = `Selected tool: ${name}`;
  if (toolReadyBtn) {
    toolReadyBtn.disabled = !selectedTool;
    toolReadyBtn.textContent = selectedTool ? 'Ready' : 'Ready';
  }
}

function selectAdvancedTool(toolName) {
  selectedTool = toolName;
  document.querySelectorAll('.advanced-item').forEach((item) => {
    item.classList.toggle('selected', item.dataset.tool === toolName);
  });
  updateSelectedToolStatus();
}

function resetToolSelection() {
  selectedTool = null;
  document.querySelectorAll('.advanced-item').forEach((item) => {
    item.classList.remove('selected');
  });
  updateSelectedToolStatus();
}

function openAdvancedPanel() {
  isAdvancedOpen = !isAdvancedOpen;
  advancedPanel.classList.toggle('open', isAdvancedOpen);
  advancedPanel.setAttribute('aria-hidden', (!isAdvancedOpen).toString());
  advancedToggleBtn.setAttribute('aria-expanded', isAdvancedOpen.toString());
  advancedToggleBtn.textContent = isAdvancedOpen ? 'Close Advanced ⚙️' : 'Advanced Options ⚙️';
}

function switchAdvancedTab(tabName) {
  advancedTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  advancedSections.forEach((section) => {
    section.classList.toggle('active', section.dataset.panel === tabName);
  });
}

function closeToolView() {
  toolContainer.classList.add('hidden');
  calculatorCard.classList.remove('hidden');
  toolContainer.innerHTML = '';
  resetToolSelection();
  setHistoryMode('Standard');
}

function loadToolInterface(toolName) {
  const todayValue = new Date().toISOString().slice(0, 10);
  let toolHtml = '';

  if (toolName === 'age') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Age Calculator 📅</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-grid">
          <div>
            <div class="tool-field">
              <label for="dob-input">Date of Birth</label>
              <div class="date-picker-row">
                <input id="dob-input" name="dob-date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input hidden-date-input" type="date" />
                <button id="calendar-toggle" class="tool-button secondary calendar-picker" type="button">
                  <span id="dob-display">MM/DD/YYYY</span>
                  <span class="calendar-icon">📅</span>
                </button>
              </div>
            </div>
            <div class="tool-field">
              <label for="today-input">Today's Date</label>
              <input id="today-input" name="today-date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input" type="date" value="${todayValue}" />
            </div>
            <div class="tool-actions">
              <button id="calculate-age" class="tool-button primary" type="button">Calculate</button>
            </div>
            <div id="tool-result" class="tool-result">Enter your birth date and press Calculate.</div>
          </div>
          <aside class="calendar-widget" id="calendar-widget">
            <div class="calendar-header">
              <button id="calendar-prev" type="button" class="calendar-nav-btn" aria-label="Previous month">‹</button>
              <div id="calendar-month" class="calendar-month"></div>
              <button id="calendar-next" type="button" class="calendar-nav-btn" aria-label="Next month">›</button>
            </div>
            <div class="calendar-weekdays">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div id="calendar-grid" class="calendar-grid"></div>
          </aside>
        </div>
      </div>
    `;
  } else if (toolName === 'bmi') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>BMI Calculator ⚖️</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="weight-input">Weight (kg)</label>
          <input id="weight-input" name="bmi-weight" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input" type="number" min="0" placeholder="e.g. 72" />
        </div>
        <div class="tool-field">
          <label for="height-input">Height (cm)</label>
          <input id="height-input" name="bmi-height" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input" type="number" min="0" placeholder="e.g. 175" />
        </div>
        <div class="tool-actions">
          <button id="calculate-bmi" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Fill the fields and press Calculate.</div>
      </div>
    `;
  } else if (toolName === 'gst') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>GST Calculator 🧾</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="gst-amount-input">Amount</label>
          <input id="gst-amount-input" name="gst-amount" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input" type="number" min="0" step="0.01" placeholder="e.g. 1000" />
        </div>
        <div class="tool-field">
          <label for="gst-rate-input">GST Rate (%)</label>
          <input id="gst-rate-input" name="gst-rate" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input" type="number" min="0" step="0.1" placeholder="e.g. 18" />
        </div>
        <div class="tool-field">
          <label for="gst-mode-select">Mode</label>
          <select id="gst-mode-select" class="tool-select">
            <option value="add">Add GST</option>
            <option value="remove">Find original price</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-gst" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Enter amount and rate, then press Calculate.</div>
      </div>
    `;
  } else if (toolName === 'discount') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Discount Calculator 💸</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="discount-amount-input">Original Price</label>
          <input id="discount-amount-input" class="tool-input" type="number" min="0" step="0.01" placeholder="e.g. 1000" />
        </div>
        <div class="tool-field">
          <label for="discount-rate-input">Discount (%)</label>
          <input id="discount-rate-input" class="tool-input" type="number" min="0" step="0.1" placeholder="e.g. 20" />
        </div>
        <div class="tool-actions">
          <button id="calculate-discount" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Enter price and discount to see the final amount.</div>
      </div>
    `;
  } else if (toolName === 'percentage') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Percentage Calculator 📊</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="percentage-mode-select">Mode</label>
          <select id="percentage-mode-select" class="tool-select">
            <option value="part">What is X% of Y?</option>
            <option value="whole">X is what % of Y?</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="percentage-value-input">Value X</label>
          <input id="percentage-value-input" class="tool-input" type="number" step="0.01" placeholder="e.g. 25" />
        </div>
        <div class="tool-field">
          <label for="percentage-base-input">Base Y</label>
          <input id="percentage-base-input" class="tool-input" type="number" step="0.01" placeholder="e.g. 200" />
        </div>
        <div class="tool-actions">
          <button id="calculate-percentage" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Use this tool for percentage calculations.</div>
      </div>
    `;
  } else if (toolName === 'date') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Date Tools 📅</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="date-mode-select">Mode</label>
          <select id="date-mode-select" class="tool-select">
            <option value="difference">Difference between two dates</option>
            <option value="add">Add days to a date</option>
            <option value="subtract">Subtract days from a date</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="date-start-input">Date</label>
          <input id="date-start-input" class="tool-input" type="date" />
        </div>
        <div class="tool-field">
          <label for="date-end-input">Second Date</label>
          <input id="date-end-input" class="tool-input" type="date" />
        </div>
        <div class="tool-field">
          <label for="date-days-input">Days to add/subtract</label>
          <input id="date-days-input" class="tool-input" type="number" min="0" placeholder="e.g. 10" />
        </div>
        <div class="tool-actions">
          <button id="calculate-date" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Find date differences or adjust a date by days.</div>
      </div>
    `;
  } else if (toolName === 'length') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Length Converter 📏</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="length-value-input">Value</label>
          <input id="length-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1" />
        </div>
        <div class="tool-field">
          <label for="length-from-select">From</label>
          <select id="length-from-select" class="tool-select">
            <option value="meters">Meters</option>
            <option value="kilometers">Kilometers</option>
            <option value="centimeters">Centimeters</option>
            <option value="millimeters">Millimeters</option>
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="length-to-select">To</label>
          <select id="length-to-select" class="tool-select">
            <option value="kilometers">Kilometers</option>
            <option value="meters">Meters</option>
            <option value="centimeters">Centimeters</option>
            <option value="millimeters">Millimeters</option>
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-length" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between length units.</div>
      </div>
    `;
  } else if (toolName === 'area') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Area Converter 📐</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="area-value-input">Value</label>
          <input id="area-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1" />
        </div>
        <div class="tool-field">
          <label for="area-from-select">From</label>
          <select id="area-from-select" class="tool-select">
            <option value="sqm">Square meters</option>
            <option value="sqkm">Square kilometers</option>
            <option value="sqft">Square feet</option>
            <option value="sqyd">Square yards</option>
            <option value="acre">Acres</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="area-to-select">To</label>
          <select id="area-to-select" class="tool-select">
            <option value="sqft">Square feet</option>
            <option value="sqm">Square meters</option>
            <option value="sqkm">Square kilometers</option>
            <option value="acre">Acres</option>
            <option value="sqyd">Square yards</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-area" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between area units.</div>
      </div>
    `;
  } else if (toolName === 'volume') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Volume Converter 🧊</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="volume-value-input">Value</label>
          <input id="volume-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1" />
        </div>
        <div class="tool-field">
          <label for="volume-from-select">From</label>
          <select id="volume-from-select" class="tool-select">
            <option value="liter">Liters</option>
            <option value="milliliter">Milliliters</option>
            <option value="cubicMeter">Cubic meters</option>
            <option value="cubicCentimeter">Cubic centimeters</option>
            <option value="gallon">Gallons</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="volume-to-select">To</label>
          <select id="volume-to-select" class="tool-select">
            <option value="milliliter">Milliliters</option>
            <option value="liter">Liters</option>
            <option value="cubicMeter">Cubic meters</option>
            <option value="cubicCentimeter">Cubic centimeters</option>
            <option value="gallon">Gallons</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-volume" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between volume units.</div>
      </div>
    `;
  } else if (toolName === 'mass') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Mass Converter ⚖️</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="mass-value-input">Value</label>
          <input id="mass-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1" />
        </div>
        <div class="tool-field">
          <label for="mass-from-select">From</label>
          <select id="mass-from-select" class="tool-select">
            <option value="gram">Grams</option>
            <option value="kilogram">Kilograms</option>
            <option value="pound">Pounds</option>
            <option value="ounce">Ounces</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="mass-to-select">To</label>
          <select id="mass-to-select" class="tool-select">
            <option value="kilogram">Kilograms</option>
            <option value="gram">Grams</option>
            <option value="pound">Pounds</option>
            <option value="ounce">Ounces</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-mass" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between mass units.</div>
      </div>
    `;
  } else if (toolName === 'numbers') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Numerical System Converter 🔢</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="number-input">Number</label>
          <input id="number-input" class="tool-input" type="text" placeholder="e.g. 1010 or 255" />
        </div>
        <div class="tool-field">
          <label for="number-from-select">From</label>
          <select id="number-from-select" class="tool-select">
            <option value="decimal">Decimal</option>
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="hexadecimal">Hexadecimal</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="number-to-select">To</label>
          <select id="number-to-select" class="tool-select">
            <option value="binary">Binary</option>
            <option value="decimal">Decimal</option>
            <option value="octal">Octal</option>
            <option value="hexadecimal">Hexadecimal</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-numbers" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert numbers between common systems.</div>
      </div>
    `;
  } else if (toolName === 'currency') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Currency Converter 💱</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="amount-input">Amount</label>
          <input id="amount-input" class="tool-input" type="number" min="0" step="0.01" placeholder="e.g. 100" />
        </div>
        <div class="tool-field">
          <label for="source-currency-input">Source Currency</label>
          <input id="source-currency-input" name="source-currency" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input currency-search" type="text" placeholder="Search source currency..." />
          <select id="source-currency-select" class="tool-select"></select>
        </div>
        <div class="tool-field">
          <label for="target-currency-input">Target Currency</label>
          <input id="target-currency-input" name="target-currency" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="tool-input currency-search" type="text" placeholder="Search target currency..." />
          <select id="target-currency-select" class="tool-select"></select>
        </div>
        <div class="tool-actions">
          <button id="calculate-currency" class="tool-button primary" type="button">Convert Now</button>
        </div>
        <div id="tool-result" class="tool-result">Enter an amount and choose source and target currencies.</div>
      </div>
    `;
  } else if (toolName === 'trig') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Trigonometry 📐</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="trig-mode-select">Function</label>
          <select id="trig-mode-select" class="tool-select">
            <option value="sin">sin</option>
            <option value="cos">cos</option>
            <option value="tan">tan</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="trig-value-input">Value</label>
          <input id="trig-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 30" />
        </div>
        <div class="tool-field">
          <label for="trig-unit-select">Unit</label>
          <select id="trig-unit-select" class="tool-select">
            <option value="degrees">Degrees</option>
            <option value="radians">Radians</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-trig" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Compute basic trigonometric values.</div>
      </div>
    `;
  } else if (toolName === 'logs') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Logarithms 🧠</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="log-mode-select">Mode</label>
          <select id="log-mode-select" class="tool-select">
            <option value="ln">Natural log</option>
            <option value="log10">Log base 10</option>
            <option value="logb">Log base N</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="log-value-input">Value</label>
          <input id="log-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 100" />
        </div>
        <div class="tool-field">
          <label for="log-base-input">Base</label>
          <input id="log-base-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 2" />
        </div>
        <div class="tool-actions">
          <button id="calculate-logs" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Calculate natural, base-10, or custom log values.</div>
      </div>
    `;
  } else if (toolName === 'powers') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Powers & Roots ⁿ</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="power-mode-select">Mode</label>
          <select id="power-mode-select" class="tool-select">
            <option value="power">Power</option>
            <option value="root">Root</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="power-base-input">Base</label>
          <input id="power-base-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 4" />
        </div>
        <div class="tool-field">
          <label for="power-exponent-input">Exponent / Root</label>
          <input id="power-exponent-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 2" />
        </div>
        <div class="tool-actions">
          <button id="calculate-powers" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Compute powers and nth roots.</div>
      </div>
    `;
  } else if (toolName === 'permutations') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>nPr / nCr 🔣</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="perm-mode-select">Mode</label>
          <select id="perm-mode-select" class="tool-select">
            <option value="nPr">Permutation (nPr)</option>
            <option value="nCr">Combination (nCr)</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="perm-n-input">n</label>
          <input id="perm-n-input" class="tool-input" type="number" min="0" step="1" placeholder="e.g. 10" />
        </div>
        <div class="tool-field">
          <label for="perm-r-input">r</label>
          <input id="perm-r-input" class="tool-input" type="number" min="0" step="1" placeholder="e.g. 3" />
        </div>
        <div class="tool-actions">
          <button id="calculate-permutations" class="tool-button primary" type="button">Calculate</button>
        </div>
        <div id="tool-result" class="tool-result">Compute permutations or combinations.</div>
      </div>
    `;
  } else if (toolName === 'equation') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Equation Solver 🧮</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="equation-mode-select">Mode</label>
          <select id="equation-mode-select" class="tool-select">
            <option value="linear">Linear (ax + b = 0)</option>
            <option value="quadratic">Quadratic (ax² + bx + c = 0)</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="equation-a-input">a</label>
          <input id="equation-a-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1" />
        </div>
        <div class="tool-field">
          <label for="equation-b-input">b</label>
          <input id="equation-b-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. -3" />
        </div>
        <div class="tool-field">
          <label for="equation-c-input">c</label>
          <input id="equation-c-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 2" />
        </div>
        <div class="tool-actions">
          <button id="calculate-equation" class="tool-button primary" type="button">Solve</button>
        </div>
        <div id="tool-result" class="tool-result">Solve linear and quadratic equations.</div>
      </div>
    `;
  } else if (toolName === 'unit') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Unit Converter 🔁</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="temperature-value-input">Value</label>
          <input id="temperature-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 25" />
        </div>
        <div class="tool-field">
          <label for="temperature-from-select">From</label>
          <select id="temperature-from-select" class="tool-select">
            <option value="celsius">Celsius</option>
            <option value="fahrenheit">Fahrenheit</option>
            <option value="kelvin">Kelvin</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="temperature-to-select">To</label>
          <select id="temperature-to-select" class="tool-select">
            <option value="fahrenheit">Fahrenheit</option>
            <option value="celsius">Celsius</option>
            <option value="kelvin">Kelvin</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-unit" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between temperature units.</div>
      </div>
    `;
  } else if (toolName === 'storage') {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>Data Storage Converter 💾</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-field">
          <label for="storage-value-input">Value</label>
          <input id="storage-value-input" class="tool-input" type="number" step="0.0001" placeholder="e.g. 1024" />
        </div>
        <div class="tool-field">
          <label for="storage-from-select">From</label>
          <select id="storage-from-select" class="tool-select">
            <option value="B">Bytes</option>
            <option value="KB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </select>
        </div>
        <div class="tool-field">
          <label for="storage-to-select">To</label>
          <select id="storage-to-select" class="tool-select">
            <option value="KB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
            <option value="B">Bytes</option>
          </select>
        </div>
        <div class="tool-actions">
          <button id="calculate-storage" class="tool-button primary" type="button">Convert</button>
        </div>
        <div id="tool-result" class="tool-result">Convert between storage units.</div>
      </div>
    `;
  } else {
    toolHtml = `
      <div class="tool-card">
        <div class="tool-card-header">
          <h2>${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Tool</h2>
          <button id="close-tool" class="tool-button secondary" type="button">Back</button>
        </div>
        <div class="tool-result">This tool template is ready. Expand it with more features.</div>
      </div>
    `;
  }

  toolContainer.innerHTML = toolHtml;
  toolContainer.classList.remove('hidden');
  calculatorCard.classList.add('hidden');

  const closeToolBtn = document.getElementById('close-tool');
  if (closeToolBtn) {
    closeToolBtn.addEventListener('click', closeToolView);
  }

  if (toolName === 'age') {
    document.getElementById('calculate-age').addEventListener('click', calculateAge);
    const dobInput = document.getElementById('dob-input');
    const calendarToggle = document.getElementById('calendar-toggle');
    const calendarWidget = document.getElementById('calendar-widget');
    const prevBtn = document.getElementById('calendar-prev');
    const nextBtn = document.getElementById('calendar-next');
    const currentDate = new Date();
    let calendarMonth = currentDate.getMonth();
    let calendarYear = currentDate.getFullYear();

    function formatDateDisplay(dateValue) {
      if (!dateValue) return 'MM/DD/YYYY';
      const [year, month, day] = dateValue.split('-');
      return `${month}/${day}/${year}`;
    }

    function updateDobDisplay() {
      const dobDisplay = document.getElementById('dob-display');
      if (!dobDisplay) return;
      dobDisplay.textContent = formatDateDisplay(dobInput.value);
    }

    function renderCalendar() {
      updateDobDisplay();
      const selectedValue = dobInput.value;
      const grid = document.getElementById('calendar-grid');
      if (!grid) return;
      const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleString('en-US', { month: 'long' });
      document.getElementById('calendar-month').textContent = `${monthName} ${calendarYear}`;
      grid.innerHTML = '';
      const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
      const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

      for (let i = 0; i < firstDay; i += 1) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        grid.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const dayButton = document.createElement('button');
        dayButton.type = 'button';
        dayButton.className = 'calendar-day';
        dayButton.textContent = `${day}`;
        const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (selectedValue === dateString) {
          dayButton.classList.add('selected');
        }
        dayButton.addEventListener('click', () => {
          dobInput.value = dateString;
          updateDobDisplay();
          calendarWidget.classList.remove('open');
          calendarToggle.classList.remove('active');
          renderCalendar();
        });
        grid.appendChild(dayButton);
      }
    }

    prevBtn.addEventListener('click', () => {
      calendarMonth -= 1;
      if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear -= 1;
      }
      renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
      calendarMonth += 1;
      if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear += 1;
      }
      renderCalendar();
    });

    calendarToggle.addEventListener('click', () => {
      const isOpen = calendarWidget.classList.toggle('open');
      calendarToggle.classList.toggle('active', isOpen);
      if (isOpen) renderCalendar();
    });

    dobInput.addEventListener('change', () => {
      const newDate = new Date(dobInput.value);
      if (!Number.isNaN(newDate)) {
        calendarMonth = newDate.getMonth();
        calendarYear = newDate.getFullYear();
      }
      updateDobDisplay();
      renderCalendar();
    });

    renderCalendar();
  } else if (toolName === 'bmi') {
    document.getElementById('calculate-bmi').addEventListener('click', calculateBMI);
  } else if (toolName === 'currency') {
    populateCurrencySelectOptions('source-currency-select');
    populateCurrencySelectOptions('target-currency-select');
    document.getElementById('source-currency-input').addEventListener('input', (event) => {
      populateCurrencySelectOptions('source-currency-select', event.target.value);
    });
    document.getElementById('target-currency-input').addEventListener('input', (event) => {
      populateCurrencySelectOptions('target-currency-select', event.target.value);
    });
    document.getElementById('calculate-currency').addEventListener('click', calculateCurrency);
  } else if (toolName === 'trig') {
    document.getElementById('calculate-trig').addEventListener('click', calculateTrig);
  } else if (toolName === 'logs') {
    document.getElementById('calculate-logs').addEventListener('click', calculateLogs);
  } else if (toolName === 'powers') {
    document.getElementById('calculate-powers').addEventListener('click', calculatePowers);
  } else if (toolName === 'permutations') {
    document.getElementById('calculate-permutations').addEventListener('click', calculatePermutations);
  } else if (toolName === 'equation') {
    document.getElementById('calculate-equation').addEventListener('click', calculateEquation);
  } else if (toolName === 'unit') {
    document.getElementById('calculate-unit').addEventListener('click', convertTemperature);
  } else if (toolName === 'storage') {
    document.getElementById('calculate-storage').addEventListener('click', convertStorage);
  } else if (toolName === 'gst') {
    document.getElementById('calculate-gst').addEventListener('click', () => {
      const amountInput = parseFloat(document.getElementById('gst-amount-input').value);
      const rateInput = parseFloat(document.getElementById('gst-rate-input').value);
      const mode = document.getElementById('gst-mode-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amountInput) || amountInput < 0) {
        resultBox.textContent = 'Enter a valid amount.';
        return;
      }
      if (Number.isNaN(rateInput) || rateInput < 0) {
        resultBox.textContent = 'Enter a valid rate.';
        return;
      }

      const rateFactor = rateInput / 100;
      let resultText = '';
      let resultValue = '';

      if (mode === 'remove') {
        const originalAmount = amountInput / (1 + rateFactor);
        resultText = `Original price before GST: ${originalAmount.toFixed(2)}.`;
        resultValue = `Reverse GST ${rateInput.toFixed(2)}% from ${amountInput.toFixed(2)} = ${originalAmount.toFixed(2)}`;
      } else {
        const gstAmount = amountInput * rateFactor;
        const totalWithGst = amountInput + gstAmount;
        resultText = `Total with GST: ${totalWithGst.toFixed(2)} (GST ${gstAmount.toFixed(2)})`;
        resultValue = `GST ${rateInput.toFixed(2)}% on ${amountInput.toFixed(2)} = ${totalWithGst.toFixed(2)}`;
      }

      resultBox.textContent = resultText;
      addHistoryEntry(resultValue, resultText, 'Advanced');
    });
  } else if (toolName === 'discount') {
    document.getElementById('calculate-discount').addEventListener('click', () => {
      const amountInput = parseFloat(document.getElementById('discount-amount-input').value);
      const rateInput = parseFloat(document.getElementById('discount-rate-input').value);
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amountInput) || amountInput < 0) {
        resultBox.textContent = 'Enter a valid amount.';
        return;
      }
      if (Number.isNaN(rateInput) || rateInput < 0) {
        resultBox.textContent = 'Enter a valid discount rate.';
        return;
      }

      const discountAmount = amountInput * (rateInput / 100);
      const totalAfterDiscount = amountInput - discountAmount;
      const resultText = `Final price: ${totalAfterDiscount.toFixed(2)} (Saved ${discountAmount.toFixed(2)}).`;
      const resultValue = `${rateInput.toFixed(2)}% off ${amountInput.toFixed(2)} = ${totalAfterDiscount.toFixed(2)}`;
      resultBox.textContent = resultText;
      addHistoryEntry(resultValue, resultText, 'Advanced');
    });
  } else if (toolName === 'percentage') {
    document.getElementById('calculate-percentage').addEventListener('click', () => {
      const valueInput = parseFloat(document.getElementById('percentage-value-input').value);
      const baseInput = parseFloat(document.getElementById('percentage-base-input').value);
      const mode = document.getElementById('percentage-mode-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(valueInput) || Number.isNaN(baseInput)) {
        resultBox.textContent = 'Enter both values.';
        return;
      }

      if (mode === 'part') {
        const result = (valueInput / 100) * baseInput;
        const resultText = `${valueInput}% of ${baseInput.toFixed(2)} is ${result.toFixed(2)}.`;
        resultBox.textContent = resultText;
        addHistoryEntry(`${valueInput}% of ${baseInput}`, resultText, 'Advanced');
      } else {
        if (baseInput === 0) {
          resultBox.textContent = 'Base value cannot be zero.';
          return;
        }
        const result = (valueInput / baseInput) * 100;
        const resultText = `${valueInput.toFixed(2)} is ${result.toFixed(2)}% of ${baseInput.toFixed(2)}.`;
        resultBox.textContent = resultText;
        addHistoryEntry(`${valueInput} of ${baseInput}`, resultText, 'Advanced');
      }
    });
  } else if (toolName === 'date') {
    document.getElementById('calculate-date').addEventListener('click', () => {
      const date1Value = document.getElementById('date-start-input').value;
      const date2Value = document.getElementById('date-end-input').value;
      const mode = document.getElementById('date-mode-select').value;
      const days = parseInt(document.getElementById('date-days-input').value, 10);
      const resultBox = document.getElementById('tool-result');

      if (!date1Value) {
        resultBox.textContent = 'Choose a start date.';
        return;
      }
      const startDate = new Date(date1Value);
      if (Number.isNaN(startDate.getTime())) {
        resultBox.textContent = 'Enter a valid date.';
        return;
      }

      if (mode === 'difference') {
        if (!date2Value) {
          resultBox.textContent = 'Choose the second date.';
          return;
        }
        const endDate = new Date(date2Value);
        if (Number.isNaN(endDate.getTime())) {
          resultBox.textContent = 'Enter a valid second date.';
          return;
        }

        const earlier = startDate < endDate ? startDate : endDate;
        const later = startDate < endDate ? endDate : startDate;
        let years = later.getFullYear() - earlier.getFullYear();
        let months = later.getMonth() - earlier.getMonth();
        let daysDiff = later.getDate() - earlier.getDate();

        if (daysDiff < 0) {
          months -= 1;
          const previousMonthDays = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
          daysDiff += previousMonthDays;
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }

        const resultText = `Difference: ${years} years, ${months} months, ${daysDiff} days.`;
        resultBox.textContent = resultText;
        addHistoryEntry(`Date difference`, resultText, 'Advanced');
      } else {
        if (Number.isNaN(days) || days < 0) {
          resultBox.textContent = 'Enter valid days to add or subtract.';
          return;
        }
        const resultDate = new Date(startDate);
        resultDate.setDate(startDate.getDate() + (mode === 'add' ? days : -days));
        const formatted = resultDate.toISOString().slice(0, 10);
        const resultText = mode === 'add'
          ? `Add ${days} day(s): ${formatted}`
          : `Subtract ${days} day(s): ${formatted}`;
        resultBox.textContent = resultText;
        addHistoryEntry(`Date ${mode} ${days}`, resultText, 'Advanced');
      }
    });
  } else if (toolName === 'length') {
    document.getElementById('calculate-length').addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('length-value-input').value);
      const fromUnit = document.getElementById('length-from-select').value;
      const toUnit = document.getElementById('length-to-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amount)) {
        resultBox.textContent = 'Enter a valid length.';
        return;
      }
      const units = {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        inches: 0.0254,
        feet: 0.3048,
        yards: 0.9144,
        miles: 1609.34,
      };
      const converted = amount * units[fromUnit] / units[toUnit];
      const resultText = `${amount} ${fromUnit} = ${converted.toFixed(5)} ${toUnit}.`;
      resultBox.textContent = resultText;
      addHistoryEntry(`Length ${amount} ${fromUnit}`, resultText, 'Advanced');
    });
  } else if (toolName === 'area') {
    document.getElementById('calculate-area').addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('area-value-input').value);
      const fromUnit = document.getElementById('area-from-select').value;
      const toUnit = document.getElementById('area-to-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amount)) {
        resultBox.textContent = 'Enter a valid area value.';
        return;
      }
      const units = {
        sqm: 1,
        sqkm: 1000000,
        sqft: 0.092903,
        sqyd: 0.836127,
        acre: 4046.86,
      };
      const converted = amount * units[fromUnit] / units[toUnit];
      const resultText = `${amount} ${fromUnit} = ${converted.toFixed(5)} ${toUnit}.`;
      resultBox.textContent = resultText;
      addHistoryEntry(`Area ${amount} ${fromUnit}`, resultText, 'Advanced');
    });
  } else if (toolName === 'volume') {
    document.getElementById('calculate-volume').addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('volume-value-input').value);
      const fromUnit = document.getElementById('volume-from-select').value;
      const toUnit = document.getElementById('volume-to-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amount)) {
        resultBox.textContent = 'Enter a valid volume value.';
        return;
      }
      const units = {
        liter: 1,
        milliliter: 0.001,
        cubicMeter: 1000,
        cubicCentimeter: 0.001,
        gallon: 3.78541,
      };
      const converted = amount * units[fromUnit] / units[toUnit];
      const resultText = `${amount} ${fromUnit} = ${converted.toFixed(5)} ${toUnit}.`;
      resultBox.textContent = resultText;
      addHistoryEntry(`Volume ${amount} ${fromUnit}`, resultText, 'Advanced');
    });
  } else if (toolName === 'mass') {
    document.getElementById('calculate-mass').addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('mass-value-input').value);
      const fromUnit = document.getElementById('mass-from-select').value;
      const toUnit = document.getElementById('mass-to-select').value;
      const resultBox = document.getElementById('tool-result');

      if (Number.isNaN(amount)) {
        resultBox.textContent = 'Enter a valid mass value.';
        return;
      }
      const units = {
        gram: 1,
        kilogram: 1000,
        pound: 453.592,
        ounce: 28.3495,
      };
      const converted = amount * units[fromUnit] / units[toUnit];
      const resultText = `${amount} ${fromUnit} = ${converted.toFixed(5)} ${toUnit}.`;
      resultBox.textContent = resultText;
      addHistoryEntry(`Mass ${amount} ${fromUnit}`, resultText, 'Advanced');
    });
  } else if (toolName === 'numbers') {
    document.getElementById('calculate-numbers').addEventListener('click', () => {
      const inputValue = document.getElementById('number-input').value.trim();
      const fromBase = document.getElementById('number-from-select').value;
      const toBase = document.getElementById('number-to-select').value;
      const resultBox = document.getElementById('tool-result');

      if (!inputValue) {
        resultBox.textContent = 'Enter a number to convert.';
        return;
      }

      const baseMap = { decimal: 10, binary: 2, octal: 8, hexadecimal: 16 };
      const fromRadix = baseMap[fromBase];
      const toRadix = baseMap[toBase];

      let decimalValue;
      if (fromBase === 'decimal') {
        decimalValue = Number(inputValue);
      } else {
        decimalValue = parseInt(inputValue, fromRadix);
      }

      if (Number.isNaN(decimalValue)) {
        resultBox.textContent = 'Enter a valid number for the selected system.';
        return;
      }

      const converted = toBase === 'decimal'
        ? String(decimalValue)
        : decimalValue.toString(toRadix).toUpperCase();
      const resultText = `${inputValue} (${fromBase}) = ${converted} (${toBase}).`;
      resultBox.textContent = resultText;
      addHistoryEntry(`Number system ${inputValue}`, resultText, 'Advanced');
    });
  }
}

function calculateAge() {
  const dobInput = document.getElementById('dob-input').value;
  const todayInput = document.getElementById('today-input').value;
  const resultBox = document.getElementById('tool-result');

  if (!dobInput || !todayInput) {
    resultBox.textContent = 'Please provide both dates.';
    return;
  }

  const dob = new Date(dobInput);
  const now = new Date(todayInput);
  if (dob >= now) {
    resultBox.textContent = 'Please choose a birth date before today.';
    return;
  }

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const ageText = `You are ${years} years, ${months} months, and ${days} days old.`;
  resultBox.textContent = ageText;
  addHistoryEntry(`Age: ${years}y ${months}m ${days}d`, ageText, 'Advanced');
}

function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight-input').value);
  const height = parseFloat(document.getElementById('height-input').value);
  const resultBox = document.getElementById('tool-result');

  if (!weight || !height) {
    resultBox.textContent = 'Enter both weight and height.';
    return;
  }

  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);
  let category = 'Unknown';

  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 24.9) category = 'Normal weight';
  else if (bmi < 29.9) category = 'Overweight';
  else category = 'Obese';

  const bmiText = `BMI: ${bmi.toFixed(1)} — ${category}.`;
  resultBox.textContent = bmiText;
  addHistoryEntry(`BMI ${bmi.toFixed(1)}`, bmiText, 'Advanced');
}

function calculateCurrency() {
  const amount = parseFloat(document.getElementById('amount-input').value);
  const sourceCurrency = document.getElementById('source-currency-select').value;
  const targetCurrency = document.getElementById('target-currency-select').value;
  const resultBox = document.getElementById('tool-result');

  if (!amount || amount <= 0) {
    resultBox.textContent = 'Enter a valid amount.';
    return;
  }
  if (!sourceCurrency || !targetCurrency) {
    resultBox.textContent = 'Select both currencies.';
    return;
  }

  const sourceRate = currencyRates[sourceCurrency] || 1;
  const targetRate = currencyRates[targetCurrency] || 1;
  const usdValue = amount / sourceRate;
  const converted = usdValue * targetRate;

  const formatted = `${amount.toFixed(2)} ${sourceCurrency} = ${converted.toFixed(2)} ${targetCurrency}`;
  resultBox.textContent = formatted;
  addHistoryEntry(`${amount.toFixed(2)} ${sourceCurrency} → ${targetCurrency}`, formatted, 'Advanced');
}

function calculateTrig() {
  const mode = document.getElementById('trig-mode-select').value;
  const rawValue = parseFloat(document.getElementById('trig-value-input').value);
  const unit = document.getElementById('trig-unit-select').value;
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(rawValue)) {
    resultBox.textContent = 'Enter a valid value.';
    return;
  }

  const angle = unit === 'degrees' ? (rawValue * Math.PI) / 180 : rawValue;
  let result = 0;

  if (mode === 'sin') result = Math.sin(angle);
  else if (mode === 'cos') result = Math.cos(angle);
  else if (mode === 'tan') result = Math.tan(angle);

  const resultText = `${mode}(${rawValue}${unit === 'degrees' ? '°' : ''}) = ${result.toFixed(6)}.`;
  resultBox.textContent = resultText;
  addHistoryEntry(`Trig ${mode}(${rawValue})`, resultText, 'Advanced');
}

function calculateLogs() {
  const mode = document.getElementById('log-mode-select').value;
  const value = parseFloat(document.getElementById('log-value-input').value);
  const base = parseFloat(document.getElementById('log-base-input').value);
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(value) || value <= 0) {
    resultBox.textContent = 'Enter a positive value.';
    return;
  }

  let result;
  if (mode === 'ln') result = Math.log(value);
  else if (mode === 'log10') result = Math.log10(value);
  else {
    if (Number.isNaN(base) || base <= 0 || base === 1) {
      resultBox.textContent = 'Enter a valid base greater than 0 and not equal to 1.';
      return;
    }
    result = Math.log(value) / Math.log(base);
  }

  const formatted = `Result: ${result.toFixed(6)}`;
  resultBox.textContent = formatted;
  addHistoryEntry(`Log ${mode}(${value})`, formatted, 'Advanced');
}

function calculatePowers() {
  const mode = document.getElementById('power-mode-select').value;
  const base = parseFloat(document.getElementById('power-base-input').value);
  const exponent = parseFloat(document.getElementById('power-exponent-input').value);
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(base) || Number.isNaN(exponent)) {
    resultBox.textContent = 'Enter valid values.';
    return;
  }

  let result;
  if (mode === 'power') {
    result = Math.pow(base, exponent);
  } else {
    if (exponent === 0) {
      resultBox.textContent = 'Root cannot be zero.';
      return;
    }
    result = Math.pow(base, 1 / exponent);
  }

  const resultText = mode === 'power'
    ? `${base}^${exponent} = ${result.toFixed(6)}`
    : `${exponent}th root of ${base} = ${result.toFixed(6)}`;
  resultBox.textContent = resultText;
  addHistoryEntry(`Powers ${mode}`, resultText, 'Advanced');
}

function calculatePermutations() {
  const mode = document.getElementById('perm-mode-select').value;
  const n = parseInt(document.getElementById('perm-n-input').value, 10);
  const r = parseInt(document.getElementById('perm-r-input').value, 10);
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(n) || Number.isNaN(r) || n < 0 || r < 0 || r > n) {
    resultBox.textContent = 'Enter valid n and r values.';
    return;
  }

  const fact = (value) => {
    let acc = 1;
    for (let i = 2; i <= value; i += 1) acc *= i;
    return acc;
  };

  const permutation = fact(n) / fact(n - r);
  const combination = fact(n) / (fact(r) * fact(n - r));

  const resultText = mode === 'nPr'
    ? `nP r = ${permutation}`
    : `nC r = ${combination}`;
  resultBox.textContent = resultText;
  addHistoryEntry(resultText, resultText, 'Advanced');
}

function calculateEquation() {
  const mode = document.getElementById('equation-mode-select').value;
  const a = parseFloat(document.getElementById('equation-a-input').value);
  const b = parseFloat(document.getElementById('equation-b-input').value);
  const c = parseFloat(document.getElementById('equation-c-input').value);
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(a) || Number.isNaN(b)) {
    resultBox.textContent = 'Enter valid coefficients.';
    return;
  }

  if (mode === 'linear') {
    if (a === 0) {
      resultBox.textContent = 'Coefficient a cannot be zero for a linear equation.';
      return;
    }
    const x = -b / a;
    const resultText = `Solution: x = ${x.toFixed(6)}`;
    resultBox.textContent = resultText;
    addHistoryEntry(`Linear equation`, resultText, 'Advanced');
    return;
  }

  if (Number.isNaN(c)) {
    resultBox.textContent = 'Enter a valid c coefficient for quadratic.';
    return;
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    resultBox.textContent = 'No real roots.';
    return;
  }

  const sqrtDisc = Math.sqrt(discriminant);
  const x1 = (-b + sqrtDisc) / (2 * a);
  const x2 = (-b - sqrtDisc) / (2 * a);
  const resultText = `Roots: x1=${x1.toFixed(6)}, x2=${x2.toFixed(6)}`;
  resultBox.textContent = resultText;
  addHistoryEntry(`Quadratic equation`, resultText, 'Advanced');
}

function convertTemperature() {
  const value = parseFloat(document.getElementById('temperature-value-input').value);
  const fromUnit = document.getElementById('temperature-from-select').value;
  const toUnit = document.getElementById('temperature-to-select').value;
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(value)) {
    resultBox.textContent = 'Enter a valid temperature value.';
    return;
  }

  const toCelsius = {
    celsius: (v) => v,
    fahrenheit: (v) => (v - 32) * (5 / 9),
    kelvin: (v) => v - 273.15,
  };

  const fromCelsius = {
    celsius: (v) => v,
    fahrenheit: (v) => (v * 9 / 5) + 32,
    kelvin: (v) => v + 273.15,
  };

  const cValue = toCelsius[fromUnit](value);
  const converted = fromCelsius[toUnit](cValue);
  const resultText = `${value.toFixed(2)} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`;
  resultBox.textContent = resultText;
  addHistoryEntry(`Temp ${value} ${fromUnit}`, resultText, 'Advanced');
}

function convertStorage() {
  const value = parseFloat(document.getElementById('storage-value-input').value);
  const fromUnit = document.getElementById('storage-from-select').value;
  const toUnit = document.getElementById('storage-to-select').value;
  const resultBox = document.getElementById('tool-result');

  if (Number.isNaN(value)) {
    resultBox.textContent = 'Enter a valid storage value.';
    return;
  }

  const unitScale = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const bytes = value * unitScale[fromUnit];
  const converted = bytes / unitScale[toUnit];
  const resultText = `${value.toFixed(4)} ${fromUnit} = ${converted.toFixed(4)} ${toUnit}`;
  resultBox.textContent = resultText;
  addHistoryEntry(`Storage ${value} ${fromUnit}`, resultText, 'Advanced');
}

function populateCurrencySelectOptions(selectId, filterTerm = '') {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  const normalizedFilter = filterTerm.trim().toLowerCase();
  const entries = Object.entries(currencyList)
    .sort(([aCode], [bCode]) => aCode.localeCompare(bCode));

  const optionsHtml = entries
    .filter(([code, name]) => {
      if (!normalizedFilter) return true;
      return code.toLowerCase().includes(normalizedFilter) || name.toLowerCase().includes(normalizedFilter);
    })
    .map(([code, name]) => `<option value="${code}">${code} — ${name}</option>`) 
    .join('');

  selectElement.innerHTML = optionsHtml || '<option disabled>No currencies found</option>';
  if (!selectElement.value || selectElement.value === '') {
    selectElement.value = selectElement.querySelector('option')?.value || '';
  }
}

function openSelectedTool() {
  if (!selectedTool) {
    selectedToolStatus.textContent = 'Please choose a tool first.';
    return;
  }
  setHistoryMode('Advanced');
  if (!isAdvancedOpen) openAdvancedPanel();
  loadToolInterface(selectedTool);
}

function switchAdvancedTab(tabName) {
  advancedTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  advancedSections.forEach((section) => {
    section.classList.toggle('active', section.dataset.panel === tabName);
  });
}

function setHistoryMode(mode) {
  activeMode = mode;
  historyTitleElement.textContent = mode === 'Advanced' ? 'Advanced History' : 'History';
  historySubtitleElement.textContent = mode === 'Advanced'
    ? 'Advanced tool activity only'
    : 'Recent calculations';
  renderHistory();
}

function updateScreen() {
  previewElement.textContent = expression || '0';
  displayElement.textContent = expression || '0';
}

function saveHistory() {
  try {
    localStorage.setItem('calculator_history', JSON.stringify(standardHistory));
    localStorage.setItem('adv_history', JSON.stringify(advancedHistory));
  } catch {
    // ignore storage errors
  }
}

function loadHistoryData() {
  try {
    const standardSaved = localStorage.getItem('calculator_history');
    const advancedSaved = localStorage.getItem('adv_history');
    standardHistory = standardSaved ? JSON.parse(standardSaved) : [];
    advancedHistory = advancedSaved ? JSON.parse(advancedSaved) : [];
  } catch {
    standardHistory = [];
    advancedHistory = [];
  }
}

function renderHistory() {
  const historySource = activeMode === 'Advanced' ? advancedHistory : standardHistory;
  if (!historySource.length) {
    historyListElement.innerHTML = '<div class="history-empty">No history yet. Start with a calculation.</div>';
    return;
  }

  historyListElement.innerHTML = historySource
    .map((entry, index) => `
      <div class="history-entry" data-index="${index}">
        <strong>${entry.expression}</strong>
        <div>${entry.result}</div>
        <div class="history-time">${entry.time}</div>
      </div>
    `)
    .join('');
}

function loadHistoryEntry(index) {
  const historySource = activeMode === 'Advanced' ? advancedHistory : standardHistory;
  const entry = historySource[index];
  if (!entry) return;
  expression = entry.expression;
  updateScreen();
}

function addHistoryEntry(expressionValue, resultValue, mode = activeMode) {
  const now = new Date();
  const entry = {
    expression: expressionValue,
    result: resultValue,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  if (mode === 'Advanced') {
    advancedHistory.unshift(entry);
    advancedHistory = advancedHistory.slice(0, 12);
  } else {
    standardHistory.unshift(entry);
    standardHistory = standardHistory.slice(0, 12);
  }

  saveHistory();
  renderHistory();
}

function clearHistory() {
  if (activeMode === 'Advanced') {
    advancedHistory = [];
  } else {
    standardHistory = [];
  }
  saveHistory();
  renderHistory();
}

function setTheme(isLight) {
  document.body.classList.toggle('light-mode', isLight);
  themeToggleBtn.textContent = isLight ? 'Dark mode' : 'Light mode';
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  themeToggleBtn.textContent = isLight ? 'Dark mode' : 'Light mode';
}

function safeTokenize(input) {
  const tokens = [];
  let current = '';

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (/[0-9.]/.test(char)) {
      current += char;
      continue;
    }

    if (char === '-') {
      if (current) {
        tokens.push(current);
        current = '';
      }

      const previous = tokens[tokens.length - 1];
      if (!previous || operators.includes(previous)) {
        current = '-';
      } else {
        tokens.push('-');
      }
      continue;
    }

    if (['+', '*', '/'].includes(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      tokens.push(char);
      continue;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function toPostfix(tokens) {
  const output = [];
  const ops = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  for (const token of tokens) {
    if (!Number.isNaN(Number(token))) {
      output.push(token);
    } else if (token in precedence) {
      while (
        ops.length &&
        precedence[ops[ops.length - 1]] >= precedence[token]
      ) {
        output.push(ops.pop());
      }
      ops.push(token);
    } else {
      throw new Error('Invalid token');
    }
  }

  while (ops.length) {
    output.push(ops.pop());
  }

  return output;
}

function evaluatePostfix(postfix) {
  const stack = [];
  for (const token of postfix) {
    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Syntax error');

      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') {
        if (b === 0) throw new Error('Division by zero');
        stack.push(a / b);
      }
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

function calculateResult() {
  try {
    const cleaned = expression.trim();
    if (!cleaned) return;

    if (/[^0-9.+\-*/]/.test(cleaned)) throw new Error('Invalid input');
    if (/[+\-*/]{2,}/.test(cleaned.slice(1))) throw new Error('Invalid syntax');

    const tokens = safeTokenize(cleaned);
    const postfix = toPostfix(tokens);
    const result = evaluatePostfix(postfix);
    expression = String(Number(result.toPrecision(12))).replace(/\.0+$/, '');
    addHistoryEntry(cleaned, expression);
  } catch {
    expression = 'Error';
  }
  updateScreen();
}

function applyPercent() {
  const match = expression.match(/(\d*\.?\d+)$/);
  if (!match) return;
  expression = expression.slice(0, -match[0].length) + String(Number(match[0]) / 100);
  updateScreen();
}

function handleInput(value) {
  if (value === 'clear') {
    expression = '';
    updateScreen();
    return;
  }

  if (value === 'delete') {
    expression = expression.slice(0, -1);
    updateScreen();
    return;
  }

  if (value === 'percent') {
    applyPercent();
    return;
  }

  if (value === 'equals') {
    calculateResult();
    return;
  }

  const last = expression.slice(-1);

  if (operators.includes(value)) {
    if (!expression) {
      if (value === '-') {
        expression += value;
        updateScreen();
      }
      return;
    }

    if (operators.includes(last)) {
      if (value === '-' && last !== '-') {
        expression += value;
        updateScreen();
      }
      return;
    }
  }

  if (value === '.') {
    const current = expression.split(/[+\-*/]/).pop();
    if (current.includes('.')) return;
  }

  expression += value;
  updateScreen();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    handleInput(button.dataset.value);
  });
});

clearHistoryBtn.addEventListener('click', clearHistory);
themeToggleBtn.addEventListener('click', toggleTheme);
advancedToggleBtn?.addEventListener('click', openAdvancedPanel);

// Search functionality for advanced tools
const drawerSearchInput = document.getElementById('drawer-search-input');
if (drawerSearchInput) {
  drawerSearchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    const advancedItems = document.querySelectorAll('.advanced-item');
    const sections = document.querySelectorAll('.drawer-section');
    
    advancedItems.forEach((item) => {
      const label = item.querySelector('.advanced-item-label')?.textContent.toLowerCase() || '';
      const icon = item.querySelector('.advanced-item-icon')?.textContent || '';
      const toolName = item.dataset.tool?.toLowerCase() || '';
      
      const matchesSearch = label.includes(searchTerm) || 
                           toolName.includes(searchTerm) ||
                           icon.includes(searchTerm);
      
      if (searchTerm === '' || matchesSearch) {
        item.style.display = '';
        item.classList.remove('hidden-by-search');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden-by-search');
      }
    });
    
    // Show/hide sections based on whether they have visible items
    sections.forEach((section) => {
      const sectionBody = section.querySelector('.drawer-section-body');
      if (sectionBody) {
        const visibleItems = sectionBody.querySelectorAll('.advanced-item:not(.hidden-by-search)');
        if (searchTerm !== '' && visibleItems.length === 0) {
          section.style.display = 'none';
        } else {
          section.style.display = '';
        }
      }
    });
  });
}
advancedTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    switchAdvancedTab(tab.dataset.tab);
  });
});

document.querySelectorAll('.advanced-item').forEach((item) => {
  item.addEventListener('click', () => {
    selectAdvancedTool(item.dataset.tool);
  });
});

toolReadyBtn?.addEventListener('click', openSelectedTool);
toolResetBtn?.addEventListener('click', resetToolSelection);

historyListElement.addEventListener('click', (event) => {
  const entry = event.target.closest('.history-entry');
  if (!entry) return;
  const index = Number(entry.dataset.index);
  loadHistoryEntry(index);
});

window.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    handleInput(key);
  } else if (key === '%') {
    handleInput('percent');
  } else if (key === 'Enter') {
    handleInput('equals');
  } else if (key === 'Backspace') {
    handleInput('delete');
  } else if (key === 'Escape') {
    handleInput('clear');
  }
});

window.addEventListener('load', () => {
  loadHistoryData();
  setHistoryMode('Standard');
  setTheme(false);
  updateSelectedToolStatus();
  updateSelectedToolStatus();
});
