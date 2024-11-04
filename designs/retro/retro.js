import { FilterBar } from "/scripts/FilterBar.js";
import { StyleSwitcher } from "/scripts/StyleSwitcher.js";
import { AppFooter } from "/scripts/AppFooter.js";
import { AppHeader } from "/scripts/AppHeader.js";
import { RecipeApp } from "/scripts/core.js";
import { RecipeCard } from "/scripts/RecipeCard.js";
import { RecipeModal } from "/scripts/RecipeModal.js";

/**
 * UI logic for the Retro design.
 */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function renderGrid(filtered) {
  const grid = document.getElementById("recipe-grid");
  const rows = chunkArray(filtered, 3);
  const renderedRows = await Promise.all(
    rows.map(async (row) => {
      const cards = await Promise.all(
        row.map((r) =>
          RecipeCard.render(r, RecipeApp.recipes.indexOf(r), "retro"),
        ),
      );
      return `
            <div class="recipe-row">
                <div class="recipe-columns">
                    ${cards.join("")}
                </div>
            </div>
        `;
    }),
  );
  grid.innerHTML = renderedRows.join("");
}

function filterRecipes(cat, btn) {
  RecipeApp.setCategory(cat);
  document
    .querySelectorAll(".cat-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function handleSearch(term) {
  RecipeApp.setSearchTerm(term);
}

async function openModal(idx) {
  const r = RecipeApp.recipes[idx];
  await RecipeModal.init("modal-content", r, idx, "retro");
  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// Expose functions to window for HTML onclick handlers
window.filterRecipes = filterRecipes;
window.handleSearch = handleSearch;
window.openModal = openModal;
window.closeModal = closeModal;

// Initialize
async function initTheme() {
  FilterBar.init("filter-bar-container", "retro");
  StyleSwitcher.init("style-switcher-container", "retro");
  AppFooter.init("app-footer", "retro");
  AppHeader.init("app-header", "retro");

  RecipeApp.init((filtered) => {
    const titleEl = document.getElementById("chapter-title");
    if (titleEl) {
      const catLabels = {
        carne: "Carnes & Aves",
        peixe: "Peixe & Marisco",
        sobremesa: "Doçaria",
        geral: "Geral",
      };
      if (RecipeApp.currentSearchTerm) {
        titleEl.textContent = `Resultados para "${RecipeApp.currentSearchTerm}"`;
      } else {
        titleEl.textContent =
          RecipeApp.currentCategory === "all"
            ? "Todas as Receitas"
            : catLabels[RecipeApp.currentCategory] || RecipeApp.currentCategory;
      }
    }
    renderGrid(filtered);
  });
}

window.addEventListener("DOMContentLoaded", initTheme);
