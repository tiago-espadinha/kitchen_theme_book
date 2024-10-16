import { FilterBar } from "/scripts/FilterBar.js";
import { StyleSwitcher } from "/scripts/StyleSwitcher.js";
import { AppFooter } from "/scripts/AppFooter.js";
import { AppHeader } from "/scripts/AppHeader.js";
import { RecipeApp } from "/scripts/core.js";
import { RecipeCard } from "/scripts/RecipeCard.js";
import { RecipeModal } from "/scripts/RecipeModal.js";

/**
 * UI logic for the Brutalist design.
 */
async function renderGrid(filtered) {
  const grid = document.getElementById("recipe-grid");
  const cards = await Promise.all(
    filtered.map((r, i) => RecipeCard.render(r, i, "brutalist")),
  );
  grid.innerHTML = cards.join("");
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
  await RecipeModal.init("modal-content", r, idx, "brutalist");
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
  FilterBar.init("filter-bar-container", "brutalist");
  StyleSwitcher.init("style-switcher-container", "brutalist");
  AppFooter.init("app-footer", "brutalist");
  AppHeader.init("app-header", "brutalist");

  RecipeApp.init((filtered) => {
    renderGrid(filtered);
  });
}

window.addEventListener("DOMContentLoaded", initTheme);
