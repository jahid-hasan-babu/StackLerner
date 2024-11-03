const Article = require("../models/Article");
const findArticles = async ({
  page = 1,
  limit = 5,
  sortType = "asc",
  sortBy = "updatedAt",
  searchTerm = "",
}) => {
  const articleInstance = new Article();
  await articleInstance.init();
  let articles;

  if (searchTerm) {
    articles = await articleInstance.search(searchTerm);
  } else {
    articles = await articleInstance.find();
  }

  //sorting
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

module.exports = { findArticles, transformedArticles };
