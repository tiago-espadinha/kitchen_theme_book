import { ComponentLoader } from "./core.js";
/**
 * AppHeader Component
 */
export const AppHeader = {
  async init(containerId = "app-header", theme = "editorial") {
    const designPath = `/designs/${theme}`;
    await ComponentLoader.render("AppHeader", containerId, {}, designPath);
  },
};
