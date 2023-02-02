import { Router } from "express";
import Contenedor from "../api.js";
import generateFaker from "../faker.js";
import { authMiddlewares } from "../middleware/index.js";
import { authController } from "../controllers/index.js";

const router = Router();

const api = new Contenedor("./src/productos.txt");

router.get("/", async (req, res) => {
  res.render("form", { items: await api.getAll() });
});

router.route("/api/productos-test").get(async (req, res) => {
  res.render("test", { items: generateFaker() });
});

// login
router
  .route("/login")
  .get(authMiddlewares.checkNotLogged, authController.serverLogin)
  .post(authMiddlewares.checkNotLogged, authController.login);

router
  .route("/register")
  .get(authMiddlewares.checkNotLogged, authController.serverRegister)
  .post(authMiddlewares.checkNotLogged, authController.register);

router
  .route("/logout")
  .get(authMiddlewares.authMiddleware, authController.logout);

router
  .route("/welcome")
  .get(authMiddlewares.authMiddleware, authController.serverWelcome);
export default router;
