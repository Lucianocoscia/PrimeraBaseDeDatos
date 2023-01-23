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

export default router;
