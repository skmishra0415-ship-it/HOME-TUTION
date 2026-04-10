// Client-side validation for the public forms.
document.addEventListener("DOMContentLoaded", () => {
  setupForm("#request-tutor-form", {
    name: "Please enter the parent or student name.",
    phone: "Please enter a valid 10-digit phone number.",
    classLevel: "Please select a class.",
    subject: "Please select a subject.",
    area: "Please enter your area or locality."
  });

  setupForm("#become-tutor-form", {
    fullName: "Please enter your full name.",
    phone: "Please enter a valid 10-digit phone number.",
    email: "Please enter a valid email address.",
    subjects: "Please enter at least one subject.",
    classes: "Please enter the classes you teach.",
    location: "Please enter your location.",
    fees: "Please enter your fee details."
  });

  setupForm("#contact-form", {
    name: "Please enter your name.",
    phone: "Please enter a valid 10-digit phone number.",
    message: "Please share a short message."
  });
});

function setupForm(formSelector, rules) {
  const form = document.querySelector(formSelector);
  if (!form) {
    return;
  }

  // Each form keeps its own success box right after the form element.
  const successBox = form.nextElementSibling;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);
    let formIsValid = true;

    Object.entries(rules).forEach(([fieldName, message]) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const value = field ? field.value.trim() : "";
      let isValid = Boolean(value);

      if (fieldName === "phone") {
        isValid = /^[6-9]\d{9}$/.test(value);
      }

      if (fieldName === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (!isValid && field) {
        formIsValid = false;
        showError(field, message);
      }
    });

    if (!formIsValid) {
      return;
    }

    form.reset();

    if (successBox) {
      successBox.classList.remove("hidden");
      successBox.textContent = "Form submitted successfully. This is a frontend demo, so the data is not sent to a server yet.";
    }
  });
}

function showError(field, message) {
  field.classList.add("input-error");
  const error = document.createElement("span");
  error.className = "error-text";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
}

function clearErrors(form) {
  form.querySelectorAll(".input-error").forEach((field) => field.classList.remove("input-error"));
  form.querySelectorAll(".error-text").forEach((error) => error.remove());
}
