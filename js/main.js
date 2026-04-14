// Shared navigation and UI helpers used on all pages.
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#current-year");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const toggleButton = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggleButton && nav) {
    toggleButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggleButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  const pageName = document.body.dataset.page;
  if (pageName) {
    const activeLink = document.querySelector(`[data-nav="${pageName}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
});

// Store the last selected tutor so we can reuse it across pages.
function saveSelectedTutor(tutorId) {
  localStorage.setItem("selectedTutorId", tutorId);
}

function getSelectedTutorId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id") || localStorage.getItem("selectedTutorId");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function createTutorCardHTML(tutor) {
  const initials = tutor.name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2);

  return `
    <article class="card tutor-card">
      <div class="tutor-top">
        <div class="avatar">${initials}</div>
        <span class="rating-badge">${tutor.rating} ★</span>
      </div>
      <div>
        <h3>${tutor.name}</h3>
        <p class="text-muted">${tutor.subject.join(", ")}</p>
      </div>
      <div class="meta-list">
        <span><strong>Classes:</strong> ${tutor.classes}</span>
        <span><strong>Area:</strong> ${tutor.area}, ${tutor.location}</span>
        <span><strong>Mode:</strong> ${tutor.teachingMode || "Offline"}</span>
        <span><strong>Fees:</strong> ${formatCurrency(tutor.budget)} / month</span>
        <span><strong>Experience:</strong> ${tutor.experience} years</span>
      </div>
      <div class="button-row">
        <a class="btn btn-secondary" href="/student.html?id=${tutor.id}" data-tutor-id="${tutor.id}">Select Tutor</a>
        <a class="btn btn-primary" href="/student.html?id=${tutor.id}" data-tutor-id="${tutor.id}">Request Tutor</a>
      </div>
    </article>
  `;
}
