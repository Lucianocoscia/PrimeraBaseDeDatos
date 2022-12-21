import express, { json, urlencoded } from "express";
//dirname
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import router from "./routes/index.js";
//importo socket
import { Server as IOServer } from "socket.io";
import Contenedor from "./api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

//app use
app.use(json());
app.use("/", router);
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views/layouts"));

// lo definimos SEteamos HBS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.html",
    layoutsDir: join(__dirname, "/views/layouts"),
    partialsDir: join(__dirname, "/views/partials"),
  })
);

//app set
app.set("view engine", "hbs"); // se lo damos a express para q lo peuda setear
app.set("views", join(__dirname, "/views"));

const expressServer = app.listen("3000", () => {
  console.log("server listening port 3000");
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
