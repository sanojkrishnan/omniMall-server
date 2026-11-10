const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const paginationValidation = Joi.object({
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
  search: commonPatterns.search.messages(customMessages),
  // Category filter (name/slug, not an ObjectId)
  category: commonPatterns.search.messages(customMessages),
  priceSort: commonPatterns.priceSort.messages(customMessages),
  minPrice: commonPatterns.minPrice.messages(customMessages),
  maxPrice: commonPatterns.maxPrice.messages(customMessages),
  isFeatured: commonPatterns.boolean.optional().messages(customMessages),
  ids: commonPatterns.idsCsv.messages(customMessages),
  sort: commonPatterns.sort.messages(customMessages),
});

module.exports = {
  paginationValidation,
};
