import express, { json, urlencoded } from "express"; //importo express
//dirname
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
// importo hbs
import { engine } from "express-handlebars";
//importo rutas
import router from "./routes/index.js";

//importo socket
import { Server as IOServer } from "socket.io";
//importo contendor con clase q maneja todo el crud
import Contenedor from "./api.js";

//  COmienza config para loguear con mongo y session
import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
//desafio passport
import passport from "passport";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./models/user.model.js";
import { authMiddlewares } from "./middleware/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express(); //Inicializo la app

// middleware
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views/layouts"));
app.use(json());

// termino config de mongo logging
//  Comienza config para loguear con mongo
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(
  session({
    secret: "coderhouse",
    rolling: true, // Esto lo que hace es que reinicia el tiempo de expiracion de las sesiones con cada request
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://admin:admin123@segundaentregabackend.ily8srs.mongodb.net/user?retryWrites=true&w=majority",
      //  "mongodb://localhost:27017/",
      mongoOptions,
    }),
    cookie: {
      maxAge: 10000,
    },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((data) => {
      done(null, data);
    })
    .catch((err) => {
      console.error(err);
    });
});

//le paso las rutas
app.use("/", router);
app.use(authMiddlewares.invalidUrl);
// definimos la configuracion HBS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.html",
    layoutsDir: join(__dirname, "/views/layouts"),
    partialsDir: join(__dirname, "/views/partials"),
  })
);

//app set hbs
app.set("view engine", "hbs"); // se lo damos a express para q lo pueda setear
app.set("views", join(__dirname, "/views"));

const expressServer = app.listen(3000, () => {
  console.log("listening on port 3000");
});
const io = new IOServer(expressServer);
// product api es un contenedor para los productos
const productApi = new Contenedor(
  {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "ecommerce",
    },
    pool: { min: 0, max: 7 },
  },
  "product"
);
// messageapi es un contenedor para los mensajes
const messageApi = new Contenedor(
  {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "./database/ecommerce.sqlite"),
    },
    useNullAsDefault: true,
  },
  "message"
);

io.on("connection", async (socket) => {
  console.log(`New connection, socket ID: ${socket.id}`);

  // Cuando se conecta un nuevo cliente le emitimos a ese cliente todos los productos que se mandaron hasta el momento
  socket.emit("server:message", await messageApi.getAll());
  // Cuando se conecta un nuevo cliente le emitimos a ese cliente todos los productos que se mandaron hasta el momento
  socket.emit("server:product", await productApi.getAll());

  //Formateo la hora
  let date = new Date();
  let dateOficial = date.toLocaleString();

  // Nos ponemos a escuchar el evento "client:message" que recibe la info de un mensaje
  socket.on("client:message", async (messageInfo) => {
    await messageApi.save({ ...messageInfo, time: dateOficial });

    io.emit("server:message", await messageApi.getAll());
  });

  // Nos ponesmo a escuchar el evento "client:product" que recibe la info de un producto
  socket.on("client:product", async (product) => {
    await productApi.save({
      title: product.title,
      price: Number(product.price),
      thumbnail: product.thumbnail,
    });

    //Emitimos a TODOS los sockets conectados el arreglo de productos actualizados
    io.emit("server:product", await productApi.getAll());
  });
});

app.on("error", (err) => {
  console.log(err);
});
