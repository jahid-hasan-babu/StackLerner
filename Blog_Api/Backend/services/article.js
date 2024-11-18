const Article = require("../models/Article");
const databaseConnection = require("../db");
const findArticles = async ({
  page = 1,
  limit = 5,
  sortType = "dsc",
  sortBy = "updatedAt",
  searchTerm = "",
}) => {
  // get articles

  const articleInstance = new Article(databaseConnection.db.articles);
  // await articleInstance.init();
  let articles;

  if (searchTerm) {
    articles = await articleInstance.search(searchTerm);
  } else {
    articles = await articleInstance.find();
  }

  //sorting
  articles = [...articles];
  articles = await articleInstance.sort(articles, sortType, sortBy);

  //pagination

  const { result, totalItems, totalPage, hasNext, hasPrev } =
    await articleInstance.pagination(articles, page, limit);
  articles = result;

  return {
    totalItems,
    totalPage,
    hasNext,
    hasPrev,
    articles: result,
  };
};

const transformedArticles = ({ articles = [] }) => {
  return articles.map((article) => {
    const transformed = { ...article };
    transformed.author = {
      id: transformed.authorId,
    };
    transformed.link = `/articles/${transformed.id}`;
    delete transformed.body;
    delete transformed.authorId;
    return transformed;
  });
};

const createArticle = async ({
  title,
  body,
  authorId,
  cover = "",
  status = "draft",
}) => {
  const articleInstance = new Article(databaseConnection.db.articles);
  const article = await articleInstance.create(
    { title, body, authorId, cover, status },
    databaseConnection
  );
  return article;
};

module.exports = { findArticles, transformedArticles, createArticle };
