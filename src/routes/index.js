import { Router } from "express";

import Contenedor from "../api.js";
import generateFaker from "../faker.js";

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
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    console.log("hola");
    let user = req.body.username;

    if (user) {
      req.session.user = user;
      res.render("bienvenida", { user });
    }
  });

router.route("/logout").get(async (req, res) => {
  let user = req.session.user;
  req.session.destroy();
  res.render("logout", { user });
});

export default router;
