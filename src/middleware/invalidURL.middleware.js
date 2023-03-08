// middelwares de chequeo de sesion sin passport

/* const authMiddleware = (req, res, next) => {
  const user = req.session.user;

  if (user) {
    return next();
  }

  res.redirect("/login");
};

const checkNotLogged = (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    return next();
  }

  res.redirect("/welcome");
}; */

//middleware a partir de utilizacion de paassport
import logger from "../lib/logger.js";
const invalidUrl = (req, res, next) => {
  logger.warn("Ruta no valida");
  res.render("routing-error");
};
//checkNotLogged, authMiddleware, esto es lo q se exporta
export const authMiddlewares = { invalidUrl };
