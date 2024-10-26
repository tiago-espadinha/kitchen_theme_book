import { FilterBar } from "/scripts/FilterBar.js";
import { StyleSwitcher } from "/scripts/StyleSwitcher.js";
import { AppFooter } from "/scripts/AppFooter.js";
import { AppHeader } from "/scripts/AppHeader.js";
import { RecipeApp } from "/scripts/core.js";
import { RecipeCard } from "/scripts/RecipeCard.js";
import { RecipeModal } from "/scripts/RecipeModal.js";

/**
 * UI logic for the Organic design.
 */
async function renderGrid(filtered) {
  const grid = document.getElementById("recipe-grid");
  const cards = await Promise.all(
    filtered.map((r, i) => RecipeCard.render(r, i, "organic")),
  );
  grid.innerHTML = cards.join("");
}

function filterRecipes(cat, btn, activeClass) {
  RecipeApp.setCategory(cat);
  document.querySelectorAll(".pill").forEach((b) => {
    b.className = "pill";
  });
  btn.classList.add(`active-${cat}`);
}

function handleSearch(term) {
  RecipeApp.setSearchTerm(term);
}

async function openModal(idx) {
  const r = RecipeApp.recipes[idx];
  const modalContent = document.getElementById("modal-content");
  modalContent.className = `modal ${r.category}-modal`;
  await RecipeModal.init("modal-content", r, idx, "organic");
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
  FilterBar.init("filter-bar-container", "organic");
  StyleSwitcher.init("style-switcher-container", "organic");
  AppFooter.init("app-footer", "organic");
  AppHeader.init("app-header", "organic");

  RecipeApp.init((filtered) => {
    renderGrid(filtered);
  });
}

window.addEventListener("DOMContentLoaded", initTheme);
