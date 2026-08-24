// dev/categoryData.js
const img = (name) => ({
  url: `https://placehold.co/800x400?text=${encodeURIComponent(name)}`,
  publicId: `seed_category_${name.replace(/\s+/g, "_").toLowerCase()}`,
});

const sampleCategories = [
  { name: "Electronics", isActive: true },
  { name: "Home Appliances", isActive: true },
  { name: "Beauty", isActive: true },
  { name: "Fashion", isActive: true },
  { name: "Accessories", isActive: false },
  { name: "Beverages", isActive: true },
];

const categoryDocs = sampleCategories.map((item) => ({
  ...item,
  categoryImage: img(item.name),
}));

module.exports = categoryDocs;
