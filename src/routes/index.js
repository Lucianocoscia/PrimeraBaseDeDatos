import { Router } from "express";
import Contenedor from "../api.js";
import generateFaker from "../faker.js";
// import { authMiddlewares } from "../middleware/index.js";
import { authController } from "../controllers/index.js";
import passport from "passport";
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
  // .get(authMiddlewares.checkNotLogged, authController.serverLogin)
  .get(authController.getLogin)
  // .post(authMiddlewares.checkNotLogged, authController.login);
  .post(
    passport.authenticate("login", { failureRedirect: "/fail-login" }),
    authController.getLogin
  );

router
  .route("/register")
  // .get(authMiddlewares.checkNotLogged, authController.serverRegister)
  // .post(authMiddlewares.checkNotLogged, authController.register);
  .get(authController.getRegister)
  .post(
    passport.authenticate("register", { failureRedirect: "/fail-register" }),
    authController.getLogin
  );

// router
//   .route("/logout")
//   .get(authMiddlewares.authMiddleware, authController.logout);

// router
//   .route("/welcome")
//   .get(authMiddlewares.authMiddleware, authController.serverWelcome);


router.get("logout", authController.logOut);
router.get("/fail-login", authController.getLoginFailiure);
router.get("/fail-register", authController.getRegisterFailiure);

export default router;
