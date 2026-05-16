const header = document.querySelector("[data-header]");
const form = document.querySelector("#registration-form");
const reviewButton = document.querySelector("[data-review]");
const submitButton = document.querySelector("[data-submit]");
const editButton = document.querySelector("[data-edit]");
const reviewList = document.querySelector("[data-review-list]");
const reviewEmpty = document.querySelector("[data-review-empty]");
const statusMessage = document.querySelector("[data-status]");
const modal = document.querySelector("[data-modal]");
const closeModalButton = document.querySelector("[data-close]");

const reviewFields = [
  ["Full name", "fullName"],
  ["Email", "email"],
  ["Phone", "phone"],
  ["Institution", "institution"],
  ["Grade / class", "grade"],
  ["City", "city"],
  ["First committee preference", "committeeOne"],
  ["Second committee preference", "committeeTwo"],
  ["Third committee preference", "committeeThree"],
  ["Previous MUN experience", "experience"],
  ["Portfolio preference 1", "portfolioOne"],
  ["Portfolio preference 2", "portfolioTwo"],
  ["Portfolio preference 3", "portfolioThree"],
  ["Emergency contact", "emergencyName"],
  ["Emergency number", "emergencyPhone"],
  ["Accessibility requirements", "accessibility"]
];

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function getFieldWrap(field) {
  return field.closest(".field, .check-field");
}

function setFieldError(field, showError) {
  const wrap = getFieldWrap(field);
  if (!wrap) return;

  wrap.classList.toggle("has-error", showError);

  const error = wrap.querySelector(".error");
  if (error && error.id) {
    if (showError) {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", error.id);
    } else {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }
  }
}

function validateForm() {
  const fields = [...form.querySelectorAll("input, select, textarea")];
  let firstInvalid = null;

  fields.forEach((field) => {
    const invalid = !field.checkValidity();
    setFieldError(field, invalid);
    if (invalid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    statusMessage.textContent = "Please complete the highlighted required fields before reviewing.";
    return false;
  }

  statusMessage.textContent = "";
  return true;
}

function getValue(name) {
  const field = form.elements[name];
  if (!field) return "";
  return field.value.trim();
}

function buildReview() {
  reviewList.innerHTML = "";

  reviewFields.forEach(([label, name]) => {
    const value = getValue(name) || "Not provided";
    const item = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;
    item.append(term, description);
    reviewList.append(item);
  });

  reviewEmpty.hidden = true;
  reviewList.hidden = false;
  editButton.hidden = false;
  submitButton.hidden = false;
  statusMessage.textContent = "Details ready for final submission.";
}

function openSuccessModal() {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeSuccessModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  reviewButton.focus();
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

form.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, select, textarea")) {
    setFieldError(field, false);
  }
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
    form.querySelectorAll("[aria-invalid]").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    reviewList.innerHTML = "";
    reviewList.hidden = true;
    reviewEmpty.hidden = false;
    editButton.hidden = true;
    submitButton.hidden = true;
    statusMessage.textContent = "";
  }, 0);
});

reviewButton.addEventListener("click", () => {
  if (!validateForm()) return;
  buildReview();
  document.querySelector(".review-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

editButton.addEventListener("click", () => {
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  form.elements.fullName.focus();
});

submitButton.addEventListener("click", () => {
  if (!validateForm()) return;
  submitButton.textContent = "Submitting...";
  submitButton.disabled = true;

  window.setTimeout(() => {
    submitButton.textContent = "Submit Registration";
    submitButton.disabled = false;
    statusMessage.textContent = "Registration prepared successfully.";
    openSuccessModal();
  }, 700);
});

closeModalButton.addEventListener("click", closeSuccessModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeSuccessModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeSuccessModal();
});
