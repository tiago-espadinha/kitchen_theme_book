import { ComponentLoader } from "./core.js";
/**
 * StyleSwitcher Component
 */
export const StyleSwitcher = {
  async init(
    containerId = "style-switcher-container",
    currentStyle = "editorial",
  ) {
    const designPath = `/designs/${currentStyle}`;
    const data = {
      currentStyle: currentStyle,
      activeEditorial: currentStyle === "editorial" ? "active" : "",
      activeBrutalist: currentStyle === "brutalist" ? "active" : "",
      activeOrganic: currentStyle === "organic" ? "active" : "",
      activeRetro: currentStyle === "retro" ? "active" : "",
    };
    await ComponentLoader.render(
      "StyleSwitcher",
      containerId,
      data,
      designPath,
    );
  },
};
