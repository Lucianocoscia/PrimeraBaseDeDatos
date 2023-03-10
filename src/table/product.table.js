import knex from "knex";
import configMYSQL from "../db/mysql";

const database = knex(configMYSQL);

const createTable = async () => {
  try {
    await database.schema.dropTableIfExists("product");
    await database.schema.createTable("product", (productTable) => {
      productTable.increments("id").primary();
      productTable.string("title", 50).notNullable();
      productTable.integer("price").notNullable();
      productTable.string("thumbnail", 500).notNullable();
    });

    console.log("Product table created!");
    database.destroy();
  } catch (err) {
    console.log("Error:", err);
    database.destroy();
  }
};

createTable();
