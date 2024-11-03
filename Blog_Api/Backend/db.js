// const fs = require("fs/promises");
// const path = require("path");

// // const dbPath = path.join(__dirname, "db", "data.json");
// // const items = process.env.DB_URL.split("/");
// // console.log(path.resolve(...items));
// // console.log(process.env.DB_URL);
// // console.log(path.resolve(process.env.DB_URL));

// class DatabaseConnection {
//   constructor() {
//     this.db = null;
//     this.dbURL = path.resolve(process.env.DB_URL);
//   }
//   async readDB() {
//     const dbStr = (this.db = await fs.readFile(this.dbURL, {
//       encoding: "utf-8",
//     }));

//     this.db = JSON.parse(dbStr);
//   }

//   async writeDB() {
//     if (this.db) {
//       await fs.writeFile(this.dbURL, JSON.stringify(this.db));
//     }
//   }

//   async getDB() {
//     if (!this.db) {
//       return this.db;
//     }
//     await this.readDB();
//     return this.db;
//   }
// }

// const main = async () => {
//   const dbConnection = new DatabaseConnection();
//   const db = await dbConnection.getDB();
//   console.log("Database");
//   console.log(db);
// };

// main();

const fs = require("fs/promises");
const path = require("path");

class DatabaseConnection {
  constructor(dbURL) {
    this.db = null;
    this.dbURL = dbURL;
  }

  async readDB() {
    try {
      const dbStr = await fs.readFile(this.dbURL, { encoding: "utf-8" });
      this.db = JSON.parse(dbStr);
    } catch (error) {
      console.error(`Error reading the database: ${error.message}`);
      throw error;
    }
  }

  async writeDB() {
    if (this.db) {
      try {
        await fs.writeFile(this.dbURL, JSON.stringify(this.db, null, 2), {
          encoding: "utf-8",
        });
      } catch (error) {
        console.error(`Error writing to the database: ${error.message}`);
        throw error;
      }
    }
  }

  async getDB() {
    if (!this.db) {
      await this.readDB(); // Only read the DB if it's not already read
    }
    return this.db;
  }
}

const connection = new DatabaseConnection(path.resolve(process.env.DB_URL));
module.exports = connection;
