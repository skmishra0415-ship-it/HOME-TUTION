// Frontend-only admin dashboard rendering.
document.addEventListener("DOMContentLoaded", () => {
  const requestsRoot = document.querySelector("#request-cards");
  const tutorsRoot = document.querySelector("#registration-cards");

  if (!requestsRoot || !tutorsRoot || !adminData) {
    return;
  }

  renderAdminCards(requestsRoot, adminData.tutorRequests, "request");
  renderAdminCards(tutorsRoot, adminData.tutorRegistrations, "tutor");

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const target = button.dataset.adminTab;
      document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.tabPanel !== target);
      });
    });
  });
});

function renderAdminCards(container, items, type) {
  container.innerHTML = items
    .map((item) => {
      const title = type === "request" ? item.subject : item.subjects;
      const secondary = type === "request" ? item.classLevel : item.classes;
      const extra = type === "request" ? item.timing : item.experience;

      return `
        <article class="card admin-card">
          <div class="lead-card-header">
            <div>
              <h3>${item.name}</h3>
              <p class="text-muted">${title}</p>
            </div>
            <span class="status-tag status-${item.status}">${capitalizeText(item.status)}</span>
          </div>
          <div class="meta-list">
            <span><strong>Phone:</strong> ${item.phone}</span>
            <span><strong>Classes:</strong> ${secondary}</span>
            <span><strong>Location:</strong> ${item.location || item.area}</span>
            <span><strong>Budget / Fees:</strong> ${item.budget || item.fees}</span>
            <span><strong>Timing / Experience:</strong> ${extra}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function capitalizeText(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
