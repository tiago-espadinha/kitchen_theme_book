import { ComponentLoader } from "./core.js";
/**
 * FilterBar Component
 */
export const FilterBar = {
  async init(containerId = "filter-bar-container", theme = "editorial") {
    const designPath = `/designs/${theme}`;
    await ComponentLoader.render("FilterBar", containerId, {}, designPath);
  },
};
