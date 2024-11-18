require("dotenv").config();
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");
const databaseConnection = require("./db");

const Article = require("./models/Article");
const articleService = require("./services/article");

// express app
const app = express();
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  })
);

app.use((req, _res, next) => {
  req.user = {
    id: 999,
    name: "John Doe",
  };
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    health: "OK",
  });
});

app.get("/api/v1/articles", async (req, res) => {
  //extract query params
  const page = +req.query.page;
  const limit = +req.query.limit || 10;
  const sortType = req.query.sort_type || "dsc";
  const sortBy = req.query.sort_by || "updatedAt";
  const searchTerm = req.query.searchTerm || "";

  let { totalItems, totalPage, hasNext, hasPrev, articles } =
    await articleService.findArticles({
      page,
      limit,
      sortType,
      sortBy,
      searchTerm,
    });

  // generate necessary response

  const response = {
    data: articleService.transformedArticles({ articles }),
    pagination: {
      page,
      limit,
      totalPage,
      totalItems,
    },
    links: {
      self: req.url,
    },
  };
  if (hasPrev) {
    response.pagination.prev = page - 1;
    response.links.prev = `${req.url}?page=${page - 1}&limit=${limit}`;
  }

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `${req.url}?page=${page + 1}&limit=${limit}`;
  }

  res.status(200).json(response);
});

app.post("/api/v1/articles", async (req, res) => {
  // step 1: extract request body
  const { title, body, cover, status } = req.body;

  // step 2: invoke the service function
  const article = await articleService.createArticle({
    title,
    body,
    cover,
    status,
    authorId: req.user.id,
  });

  // step 3: generate necessary response
  const response = {
    code: 201,
    message: "Article created successfully",
    data: article,
    links: {
      self: `${req.url}/${article.id}`,
      author: `${req.url}/${article.id}/author`,
      comment: `${req.url}/${article.id}/comments`,
    },
  };
  res.status(201).json(response);
});

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

(async () => {
  await databaseConnection.connect();
  console.log("Database connected");
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
})();
