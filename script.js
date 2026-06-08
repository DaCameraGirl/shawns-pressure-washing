const serviceSelect = document.querySelector("#service");
const sizeInput = document.querySelector("#size");
const sizeOutput = document.querySelector("#size-output");
const grimeInputs = document.querySelectorAll("input[name='grime']");
const sealantInput = document.querySelector("#sealant");
const quoteTotal = document.querySelector("#quote-total");
const quoteSummary = document.querySelector("#quote-summary");
const quoteMail = document.querySelector("#quote-mail");
const comparisonSlider = document.querySelector("#comparison-slider");
const beforeLayer = document.querySelector("#before-layer");
const comparisonHandle = document.querySelector("#comparison-handle");
const bookingForm = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");

const serviceLabels = {
  driveway: "Driveway cleanup",
  house: "House wash",
  deck: "Deck or patio wash",
  storefront: "Storefront rinse"
};

function dollars(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function selectedGrime() {
  return Number([...grimeInputs].find((input) => input.checked)?.value ?? 0);
}

function selectedGrimeLabel() {
  const checked = [...grimeInputs].find((input) => input.checked);
  return checked?.nextElementSibling?.textContent?.toLowerCase() ?? "easy rinse";
}

function updateQuote() {
  const selected = serviceSelect.selectedOptions[0];
  const service = serviceSelect.value;
  const size = Number(sizeInput.value);
  const base = Number(selected.dataset.base);
  const rate = Number(selected.dataset.rate);
  const grime = selectedGrime();
  const sealant = sealantInput.checked ? Number(sealantInput.value) : 0;
  const total = Math.ceil((base + size * rate + grime + sealant) / 5) * 5;
  const sealantText = sealantInput.checked ? " plus protectant" : "";
  const summary = `${serviceLabels[service]} for ${size.toLocaleString()} sq ft with ${selectedGrimeLabel()}${sealantText}.`;

  sizeOutput.value = `${size.toLocaleString()} sq ft`;
  quoteTotal.textContent = dollars(total);
  quoteSummary.textContent = summary;
  quoteMail.href = `mailto:shawn@example.com?subject=${encodeURIComponent("Pressure washing quote request")}&body=${encodeURIComponent(`${summary}\nEstimated total: ${dollars(total)}\n\nPlease send photos and the service address for a final quote.`)}`;
}

function updateComparison() {
  const value = `${comparisonSlider.value}%`;
  beforeLayer.style.width = value;
  comparisonHandle.style.left = value;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get("name");
  const email = data.get("email");
  const address = data.get("address");
  const preferred = data.get("preferred");
  const notes = data.get("notes") || "No extra notes.";
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Service address: ${address}`,
    `Preferred service: ${preferred}`,
    "",
    `Notes: ${notes}`
  ].join("\n");

  window.location.href = `mailto:shawn@example.com?subject=${encodeURIComponent("New pressure washing request")}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Email draft created. Replace shawn@example.com with the real booking inbox in script.js.";
}

[serviceSelect, sizeInput, sealantInput, ...grimeInputs].forEach((control) => {
  control.addEventListener("input", updateQuote);
  control.addEventListener("change", updateQuote);
});

comparisonSlider.addEventListener("input", updateComparison);
bookingForm.addEventListener("submit", handleBookingSubmit);
year.textContent = new Date().getFullYear();

updateQuote();
updateComparison();
