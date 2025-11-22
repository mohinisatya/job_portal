document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("filterForm");
  const clearBtn = document.getElementById("clearFilters");
  const resultCount = document.getElementById("resultCount");
  const candidateList = document.getElementById("candidateList");
  const cards = Array.from(candidateList.querySelectorAll(".candidate-card"));
  const searchInput = document.getElementById("search");
  const locationSelect = document.getElementById("location");
  const experienceSelect = document.getElementById("experience");
  const sortBySelect = document.getElementById("sortBy");
  const workTypeCheckboxes = Array.from(
    document.querySelectorAll(".work-type")
  );

  // Apply filters
  function applyFilters(e) {
    if (e) e.preventDefault();

    const keyword = searchInput.value.toLowerCase().trim();
    const location = locationSelect.value;
    const experience = experienceSelect.value;
    const selectedWorkTypes = workTypeCheckboxes
      .filter((c) => c.checked)
      .map((c) => c.value);

    let visibleCount = 0;

    cards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const role = card.dataset.role.toLowerCase();
      const skills = card.dataset.skills.toLowerCase();
      const cardLocation = card.dataset.location;
      const cardExperience = card.dataset.experience;
      const cardWork = card.dataset.work.toLowerCase();

      let matches = true;

      // Keyword search
      if (keyword) {
        const combined = `${name} ${role} ${skills}`;
        if (!combined.includes(keyword)) {
          matches = false;
        }
      }

      // Location filter
      if (matches && location && cardLocation !== location) {
        matches = false;
      }

      // Experience filter
      if (matches && experience && cardExperience !== experience) {
        matches = false;
      }

      // Work type filter (all selected types must be present)
      if (matches && selectedWorkTypes.length > 0) {
        const workOk = selectedWorkTypes.every((type) =>
          cardWork.includes(type)
        );
        if (!workOk) matches = false;
      }

      if (matches) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    resultCount.textContent = `${visibleCount} candidate${
      visibleCount === 1 ? "" : "s"
    } found`;
  }

  // Clear filters
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    locationSelect.value = "";
    experienceSelect.value = "";
    workTypeCheckboxes.forEach((c) => (c.checked = false));
    applyFilters();
  });

  form.addEventListener("submit", applyFilters);

  // Live filter on typing (optional, you can remove this if you want only submit)
  searchInput.addEventListener("input", () => applyFilters());

  // Save button toggle
  document.querySelectorAll(".btn-save").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("saved");
      btn.textContent = btn.classList.contains("saved") ? "Saved" : "Save";
    });
  });

  // Simple sort (front-end only)
  sortBySelect.addEventListener("change", () => {
    const value = sortBySelect.value;

    const sortedCards = [...cards].sort((a, b) => {
      if (value === "name") {
        return a.dataset.name.localeCompare(b.dataset.name);
      }
      if (value === "experience") {
        const expOrder = { "fresher": 0, "1-3": 1, "3-5": 2, "5+": 3 };
        return (
          (expOrder[a.dataset.experience] || 0) -
          (expOrder[b.dataset.experience] || 0)
        );
      }
      // "recent" – keep original order
      return 0;
    });

    // Re-append cards in sorted order
    sortedCards.forEach((card) => candidateList.appendChild(card));
  });
});
