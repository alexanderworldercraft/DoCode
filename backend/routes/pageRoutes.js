import { pageController } from "../controllers/pageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export default async function pageRoutes(fastify) {
  fastify.get("/public-links", pageController.listPublicLinks);
  fastify.get("/search", pageController.searchPublicPages);
  fastify.get("/public/:slug", pageController.getPublicPage);

  fastify.get("/themes", { preHandler: authMiddleware }, pageController.listThemes);
  fastify.post("/themes", { preHandler: authMiddleware }, pageController.createTheme);
  fastify.put("/themes/:themeId", { preHandler: authMiddleware }, pageController.updateTheme);
  fastify.delete("/themes/:themeId", { preHandler: authMiddleware }, pageController.deleteTheme);

  fastify.get("/", { preHandler: authMiddleware }, pageController.listAdminPages);
  fastify.post("/", { preHandler: authMiddleware }, pageController.createPage);
  fastify.get("/:pageId", { preHandler: authMiddleware }, pageController.getAdminPage);
  fastify.put("/:pageId", { preHandler: authMiddleware }, pageController.updatePage);
  fastify.delete("/:pageId", { preHandler: authMiddleware }, pageController.deletePage);
  fastify.post("/:pageId/sections", { preHandler: authMiddleware }, pageController.createSection);
  fastify.put("/:pageId/sections/:sectionId", { preHandler: authMiddleware }, pageController.updateSection);
  fastify.delete("/:pageId/sections/:sectionId", { preHandler: authMiddleware }, pageController.deleteSection);
}
