/**
 * Core logic for the Recipe Site.
 * Handles state management, filtering, and searching.
 */
export const RecipeApp = {
  recipes: [],
  currentCategory: "all",
  currentSearchTerm: "",
  onUpdate: null,

  /**
   * Initialize the application by loading recipes from the database manifest.
   */
  async init(onUpdate) {
    this.onUpdate = onUpdate;

    try {
      const response = await fetch("/database/index.json");
      const filePaths = await response.json();

      const recipePromises = filePaths.map(async (path) => {
        const res = await fetch(`/database/${path}`);
        const recipe = await res.json();

        // Infer category from file path (folder name)
        const parts = path.split("/");
        if (parts.length > 1) {
          recipe.category = parts[0];
        } else {
          recipe.category = "geral"; // Default category
        }

        return recipe;
      });

      this.recipes = await Promise.all(recipePromises);
      this.update();
    } catch (error) {
      console.error("Failed to load recipes:", error);
    }
  },

  /**
   * Set the current category and trigger update.
   * @param {string} category
   */
  setCategory(category) {
    this.currentCategory = category;
    this.update();
  },

  /**
   * Set the search term and trigger update.
   * @param {string} term
   */
  setSearchTerm(term) {
    this.currentSearchTerm = term.toLowerCase();
    this.update();
  },

  /**
   * Filter recipes based on current state and notify the UI.
   */
  update() {
    const filtered = this.recipes.filter((r) => {
      const matchesCategory =
        this.currentCategory === "all" || r.category === this.currentCategory;
      const matchesSearch =
        !this.currentSearchTerm ||
        r.title.toLowerCase().includes(this.currentSearchTerm) ||
        r.ingredients.some((ing) =>
          ing.toLowerCase().includes(this.currentSearchTerm),
        );
      return matchesCategory && matchesSearch;
    });

    if (this.onUpdate) {
      this.onUpdate(filtered);
    }
  },
};

/**
 * Utility for loading and rendering components.
 */
export const ComponentLoader = {
  cache: {},

  /**
   * Load a component's HTML template.
   * @param {string} componentName - Name of the component folder.
   * @param {string} designPath - Path if it's a design-specific component.
   */
  async loadTemplate(componentName, designPath) {
    const designSpecificPath = `${designPath}/components/${componentName}/${componentName}.html`;

    if (this.cache[designSpecificPath]) return this.cache[designSpecificPath];

    try {
      let response = await fetch(designSpecificPath);

      if (!response.ok) throw new Error(`Template not found: ${componentName}`);

      const html = await response.text();
      this.cache[designSpecificPath] = html;
      return html;
    } catch (error) {
      console.error(`Failed to load template for ${componentName}:`, error);
      return "";
    }
  },

  /**
   * Load and inject a component's CSS.
   */
  async loadStyle(componentName, designPath) {
    const designSpecificPath = `${designPath}/components/${componentName}/${componentName}.css`;
    await this.injectStylesheet(designSpecificPath);
  },

  async injectStylesheet(path) {
    if (!path || document.querySelector(`link[href="${path}"]`)) return;

    try {
      const response = await fetch(path, { method: "HEAD" });
      if (response.ok) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        document.head.appendChild(link);
      }
    } catch (error) {
      // Silently ignore network failures for optional CSS
    }
  },

  /**
   * Render a component into a container.
   */
  async render(componentName, containerId, data = {}, designPath) {
    await this.loadStyle(componentName, designPath);
    const template = await this.loadTemplate(componentName, designPath);
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = template;
    // Simple data binding: replace {{key}} with data[key]
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, value);
    }

    container.innerHTML = html;
  },
};

/**
 * Common style switcher logic.
 */
function initStyleSwitcher(currentStyle) {
  const switcher = document.querySelector(".style-switcher");
  if (!switcher) return;

  // Highlight active style
  const buttons = switcher.querySelectorAll("button");
  buttons.forEach((btn) => {
    const onclick = btn.getAttribute("onclick") || "";
    if (onclick.includes(currentStyle)) {
      btn.style.fontWeight = "bold";
    }
  });
}
