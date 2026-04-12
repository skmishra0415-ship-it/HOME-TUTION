// Tutor listing, filtering, profile rendering, and prefill behavior.
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedTutors();
  renderTutorListingPage();
  renderTutorProfilePage();
  attachTutorSelectionHandlers();
  prefillTutorRequestSummary();
});

function renderFeaturedTutors() {
  const container = document.querySelector("#featured-tutors");
  if (!container || !Array.isArray(tutorsData)) {
    return;
  }

  const featuredTutors = tutorsData.slice(0, 3);
  container.innerHTML = featuredTutors
    .map((tutor) => createTutorCardHTML(tutor).replaceAll("../pages/", "pages/"))
    .join("");
}

function renderTutorListingPage() {
  const listingContainer = document.querySelector("#tutor-list");
  if (!listingContainer) {
    return;
  }

  const filters = {
    classLevel: document.querySelector("#filter-class"),
    subject: document.querySelector("#filter-subject"),
    location: document.querySelector("#filter-location"),
    budget: document.querySelector("#filter-budget")
  };

  const applyFilters = () => {
    const classValue = filters.classLevel.value.trim().toLowerCase();
    const subjectValue = filters.subject.value.trim().toLowerCase();
    const locationValue = filters.location.value.trim().toLowerCase();
    const budgetValue = Number(filters.budget.value || 0);

    const filteredTutors = tutorsData.filter((tutor) => {
      const matchesClass = !classValue || tutor.classes.toLowerCase().includes(classValue);
      const matchesSubject = !subjectValue || tutor.subject.some((item) => item.toLowerCase() === subjectValue);
      const locationText = `${tutor.location} ${tutor.area}`.toLowerCase();
      const matchesLocation = !locationValue || locationText.includes(locationValue);
      const matchesBudget = !budgetValue || tutor.budget <= budgetValue;

      return matchesClass && matchesSubject && matchesLocation && matchesBudget;
    });

    renderTutorCards(listingContainer, filteredTutors);
  };

  Object.values(filters).forEach((field) => {
    field.addEventListener("change", applyFilters);
    field.addEventListener("input", applyFilters);
  });

  const resetButton = document.querySelector("#reset-filters");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      Object.values(filters).forEach((field) => {
        field.value = "";
      });
      renderTutorCards(listingContainer, tutorsData);
    });
  }

  renderTutorCards(listingContainer, tutorsData);
}

function renderTutorCards(container, tutors) {
  if (!tutors.length) {
    container.innerHTML = `<div class="empty-state">No tutors match these filters yet. Try changing subject, class, location, or budget.</div>`;
    return;
  }

  container.innerHTML = tutors.map((tutor) => createTutorCardHTML(tutor)).join("");
  attachTutorSelectionHandlers();
}

function attachTutorSelectionHandlers() {
  document.querySelectorAll("[data-tutor-id]").forEach((element) => {
    element.addEventListener("click", () => saveSelectedTutor(element.dataset.tutorId));
  });
}

function renderTutorProfilePage() {
  const profileRoot = document.querySelector("#tutor-profile-page");
  if (!profileRoot) {
    return;
  }

  const tutorId = getSelectedTutorId();
  const tutor = tutorsData.find((item) => item.id === tutorId) || tutorsData[0];
  if (!tutor) {
    return;
  }

  saveSelectedTutor(tutor.id);

  const initials = tutor.name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2);

  profileRoot.innerHTML = `
    <div class="profile-layout">
      <section class="card profile-card">
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div>
            <h2>${tutor.name}</h2>
            <p class="text-muted">${tutor.subject.join(", ")} | ${tutor.classes}</p>
          </div>
        </div>
        <p>${tutor.bio}</p>
        <div class="detail-grid">
          <div class="detail-item"><strong>Location</strong><br>${tutor.area}, ${tutor.location}</div>
          <div class="detail-item"><strong>Experience</strong><br>${tutor.experience} years</div>
          <div class="detail-item"><strong>Monthly Fees</strong><br>${formatCurrency(tutor.budget)}</div>
          <div class="detail-item"><strong>Rating</strong><br>${tutor.rating} / 5</div>
          <div class="detail-item"><strong>Education</strong><br>${tutor.education}</div>
          <div class="detail-item"><strong>Availability</strong><br>${tutor.availability}</div>
          <div class="detail-item"><strong>Languages</strong><br>${tutor.languages}</div>
          <div class="detail-item"><strong>Subjects</strong><br>${tutor.subject.join(", ")}</div>
          <div class="detail-item"><strong>Gender</strong><br>${tutor.gender || "Not specified"}</div>
          <div class="detail-item"><strong>Teaching Mode</strong><br>${tutor.teachingMode || "Offline"}</div>
          <div class="detail-item"><strong>Phone</strong><br>${tutor.phone || "Available on request"}</div>
          <div class="detail-item"><strong>Email</strong><br>${tutor.email || "Available on request"}</div>
        </div>
      </section>
      <aside class="sticky-card">
        <div class="card profile-card sidebar-box">
          <h3>Take the next step</h3>
          <div class="button-row">
            <a class="btn btn-primary" href="../pages/request-tutor.html?id=${tutor.id}" data-tutor-id="${tutor.id}">Request Tutor</a>
            <a class="btn btn-secondary" href="https://wa.me/${tutor.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Tutor</a>
          </div>
        </div>
        <div class="card profile-card sidebar-box">
          <h3>Quick Summary</h3>
          <div class="profile-list">
            <span><strong>Classes:</strong> ${tutor.classes}</span>
            <span><strong>Area:</strong> ${tutor.area}</span>
            <span><strong>Mode:</strong> ${tutor.teachingMode || "Offline"}</span>
            <span><strong>Best For:</strong> ${tutor.subject.join(", ")}</span>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function prefillTutorRequestSummary() {
  const summaryBox = document.querySelector("#selected-tutor-summary");
  if (!summaryBox) {
    return;
  }

  const tutorId = getSelectedTutorId();
  const tutor = tutorsData.find((item) => item.id === tutorId);

  if (!tutor) {
    summaryBox.classList.add("hidden");
    return;
  }

  summaryBox.classList.remove("hidden");
  summaryBox.innerHTML = `
    <strong>Selected Tutor:</strong> ${tutor.name}<br>
    <span class="text-muted">${tutor.subject.join(", ")} | ${tutor.area}, ${tutor.location} | ${tutor.teachingMode || "Offline"} | ${formatCurrency(tutor.budget)} / month</span>
  `;
}
