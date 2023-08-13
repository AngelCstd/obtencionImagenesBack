require("dotenv").config();
const multer = require("multer"),
  upload = multer();
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  port = process.env.PORT || 3001;
const cors = require("cors");
const { main } = require("./azure.js");

const { Client } = require("@notionhq/client");
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const databaseId = process.env.DATABASE_ID;

const filters = {
  ID: (filterBy) => {
    return {
      property: "ID",
      number: {
        equals: Number.parseInt(filterBy),
      },
    };
  },
  Category: (filterBy) => {
    return {
      property: "Categoría",
      select: {
        equals: filterBy,
      },
    };
  },
  Especial: (filterBy) => {
    return {
      property: "Especial",
      select: {
        equals: filterBy,
      },
    };
  },
  Comprados: (filterBy) =>{
    return {
        property: 'comprados',
        checkbox: {
          equals: Boolean(filterBy),
        },
      };
  },

};

async function getNotion(filterQuery) {
  const query = { database_id: databaseId };

  if (filterQuery) {
    let { key, filterBy } = filterQuery;
    console.log(key);
    console.log(filters[key](filterBy));
    query.filter = filters[key](filterBy);
  }

  try {
    const response = await notion.databases.query(query);
    return response.results;
  } catch (error) {
    console.error("Error fetching database data:", error);
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async function (req, res) {
  try {
    res.send("ya estoy");
    res.end();
  } catch (err) {
    console.error(err);
  }
});
app.post("/", upload.single("image"), async function (req, res, next) {
  try {
    res.send(await main(req));
    //
    res.end();
  } catch (error) {
    console.error(error);
  }
});

app.get("/notion", async function (req, res) {
  try {
    console.log(req.query.filterBy);
    res.send(await getNotion(req.query));
    res.end();
  } catch (err) {
    console.error(err);
  }
});

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
});

app.listen(port, () => {
  console.log("server iniciado paps");
});
