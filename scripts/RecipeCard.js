import { ComponentLoader, RecipeApp } from "./core.js";
/**
 * RecipeCard Component
 */
export const RecipeCard = {
  /**
   * Prepare theme-agnostic data for the template.
   */
  prepareData(recipe, index) {
    const idx = RecipeApp.recipes.indexOf(recipe);
    const catEmoji = { carne: "🥩", peixe: "🐟", sobremesa: "🍮", geral: "🍲" };
    const catLabels = {
      carne: "Carnes & Aves",
      peixe: "Peixe & Marisco",
      sobremesa: "Doçaria",
      geral: "Geral",
    };

    return {
      idx: idx,
      title: recipe.title,
      category: recipe.category,
      categoryUpper: recipe.category.toUpperCase(),
      categoryLabel: catLabels[recipe.category] || recipe.category,
      emoji: recipe.emoji || catEmoji[recipe.category] || "🍲",
      ingredientsCount: recipe.ingredients.length,
      stepsCount: recipe.steps.length,
      displayIndex: String(index + 1).padStart(2, "0"),
      ingredientsPreview: recipe.ingredients.slice(0, 3).join(", "),
      ingredientsPreviewDots: recipe.ingredients.slice(0, 3).join(" · "),
      ingredientsPreviewSlash: recipe.ingredients.slice(0, 4).join(" / "),
    };
  },

  /**
   * Render a single recipe card.
   */
  async render(recipe, index, theme = "editorial") {
    const designPath = `/designs/${theme}`;
    const template = await ComponentLoader.loadTemplate(
      "RecipeCard",
      designPath,
    );
    const data = this.prepareData(recipe, index);

    let html = template;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, value);
    }
    return html;
  },
};
