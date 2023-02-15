import yargs from "yargs";
// config de argumentos donde declaro por default el puerto q va a escuchar
const args = yargs(process.argv.slice(2))
  .alias({
    p: "puerto",
  })
  .default({
    puerto: 8080,
  }).argv;

export default args;
