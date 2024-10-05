import { ComponentLoader } from "./core.js";
/**
 * RecipeModal Component
 */
export const RecipeModal = {
  /**
   * Prepare theme-agnostic data for the template.
   */
  prepareData(recipe, index) {
    if (!recipe) return {};

    const catEmoji = { carne: "🥩", peixe: "🐟", sobremesa: "🍮", geral: "🍲" };
    const catLabels = {
      carne: "Carnes & Aves",
      peixe: "Peixe & Marisco",
      sobremesa: "Doçaria",
      geral: "Geral",
    };
    const romans = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
    ];

    const data = {
      title: recipe.title,
      category: recipe.category,
      categoryUpper: recipe.category.toUpperCase(),
      categoryLabel: catLabels[recipe.category] || recipe.category,
      emoji: recipe.emoji || catEmoji[recipe.category] || "🍲",
      ingredientsCount: recipe.ingredients.length,
      stepsCount: recipe.steps.length,
      displayIndex: String(index + 1).padStart(2, "0"),
      displayIndexModal: String(index + 1).padStart(3, "0"),
      notes: recipe.notes || "",
      notesHTML: recipe.notes
        ? `<div class="notes-box"><strong>Nota:</strong> ${recipe.notes}</div>`
        : "",
    };

    // Standard Ingredients Formats
    data.ingredientsLI = recipe.ingredients
      .map((i) => `<li>${i}</li>`)
      .join("");
    data.ingredientsDIV = recipe.ingredients
      .map((i) => `<div class="ing-item">${i}</div>`)
      .join("");
    data.ingredientsDIV_DOT = recipe.ingredients
      .map(
        (i) => `
            <div class="ing-item">
                <span class="ing-dot"></span>
                ${i}
            </div>
        `,
      )
      .join("");

    // Standard Steps Formats
    data.stepsLI = recipe.steps
      .map(
        (s, i) => `
            <li class="step-item">
                <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
                <span class="step-text">${s}</span>
            </li>
        `,
      )
      .join("");
    data.stepsDIV_BLOCK = recipe.steps
      .map(
        (s, i) => `
            <div class="step-block">
                <div class="step-n">${String(i + 1).padStart(2, "0")}</div>
                <div class="step-content">${s}</div>
            </div>
        `,
      )
      .join("");
    data.stepsDIV_BADGE = recipe.steps
      .map(
        (s, i) => `
            <div class="step-item">
                <div class="step-badge">${i + 1}</div>
                <div class="step-text">${s}</div>
            </div>
        `,
      )
      .join("");
    data.stepsROMAN = recipe.steps
      .map(
        (s, i) => `
            <div class="step-item">
                <div class="step-roman">${romans[i] || i + 1}</div>
                <div class="step-rule"></div>
                <div class="step-text">${s}</div>
            </div>
        `,
      )
      .join("");

    return data;
  },

  async init(
    containerId = "modal-content",
    recipe,
    index,
    theme = "editorial",
  ) {
    const designPath = `/designs/${theme}`;
    const data = this.prepareData(recipe, index);
    await ComponentLoader.render("RecipeModal", containerId, data, designPath);
  },
};
