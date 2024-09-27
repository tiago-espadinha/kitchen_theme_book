import { ComponentLoader } from "./core.js";
/**
 * AppFooter Component
 */
export const AppFooter = {
  async init(containerId = "app-footer", theme = "editorial") {
    const designPath = `/designs/${theme}`;
    await ComponentLoader.render("AppFooter", containerId, {}, designPath);
  },
};
