import knex from "knex";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

//conexion con sqlite3
const configSqlite3 = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "../database/ecommerce.sqlite"),
  },
  useNullAsDefault: true,
};

const database = knex(configSqlite3);

const createMessageTable = async () => {
  try {
    await database.schema.createTable("message", (messageTable) => {
      messageTable.increments("id").primary();
      messageTable.string("username", 100).notNullable();
      messageTable.string("message", 500).notNullable();
      messageTable.string("time", 250).notNullable();
    });

    console.log("Message table created");
    database.destroy();
  } catch (err) {
    console.log(err);
  }
};

// createMessageTable();

export default configSqlite3;
