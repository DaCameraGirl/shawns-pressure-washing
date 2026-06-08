const serviceSelect = document.querySelector("#service");
const sizeInput = document.querySelector("#size");
const sizeOutput = document.querySelector("#size-output");
const grimeInputs = document.querySelectorAll("input[name='grime']");
const sealantInput = document.querySelector("#sealant");
const quoteTotal = document.querySelector("#quote-total");
const quoteSummary = document.querySelector("#quote-summary");
const quoteMail = document.querySelector("#quote-mail");
const bookingForm = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const serviceCards = document.querySelectorAll(".service-card");

const serviceLabels = {
  driveway: "Driveway cleanup",
  house: "House wash",
  deck: "Deck or patio wash",
  storefront: "Storefront rinse"
};

const servicePricing = {
  driveway: { minimum: 150, rate: 0.28 },
  house: { minimum: 300, rate: 0.30 },
  deck: { minimum: 200, rate: 0.40 },
  storefront: { minimum: 500, rate: 0.52 }
};

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function dollars(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(safeValue);
}

function selectedGrime() {
  return cleanNumber([...grimeInputs].find((input) => input.checked)?.value, 0);
}

function selectedGrimeLabel() {
  const checked = [...grimeInputs].find((input) => input.checked);
  return checked?.nextElementSibling?.textContent?.toLowerCase() ?? "easy rinse";
}

function setServiceCardState(card, isFlipped) {
  card.classList.toggle("is-flipped", isFlipped);
  card.setAttribute("aria-pressed", String(isFlipped));
}

function toggleServiceCard(card) {
  const shouldFlip = !card.classList.contains("is-flipped");

  serviceCards.forEach((serviceCard) => {
    setServiceCardState(serviceCard, serviceCard === card ? shouldFlip : false);
  });
}

function updateQuote() {
  const selected = serviceSelect.selectedOptions[0];
  const service = serviceSelect.value;
  const size = cleanNumber(sizeInput.value, 1200);
  const configured = servicePricing[service] ?? servicePricing.driveway;
  const legacyBase = cleanNumber(selected?.dataset.base, configured.minimum);
  const minimum = cleanNumber(selected?.dataset.min, legacyBase);
  const rate = cleanNumber(selected?.dataset.rate, configured.rate);
  const basePrice = Math.max(minimum, size * rate);
  const conditionCharge = basePrice * selectedGrime();
  const protectantRate = cleanNumber(sealantInput.value, 0.12);
  const protectant = sealantInput.checked ? Math.max(75, size * protectantRate) : 0;
  const total = Math.ceil((basePrice + conditionCharge + protectant) / 5) * 5;
  const sealantText = sealantInput.checked ? " plus protectant" : "";
  const summary = `${serviceLabels[service]} for ${size.toLocaleString()} sq ft with ${selectedGrimeLabel()}${sealantText}.`;

  sizeOutput.value = `${size.toLocaleString()} sq ft`;
  quoteTotal.textContent = dollars(total);
  quoteSummary.textContent = summary;
  quoteMail.href = `mailto:shawn@example.com?subject=${encodeURIComponent("Pressure washing quote request")}&body=${encodeURIComponent(`${summary}\nEstimated total: ${dollars(total)}\n\nPlease send photos and the service address for a final quote.`)}`;
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

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    toggleServiceCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleServiceCard(card);
  });
});

bookingForm.addEventListener("submit", handleBookingSubmit);
year.textContent = new Date().getFullYear();

updateQuote();
