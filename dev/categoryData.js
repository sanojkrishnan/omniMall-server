// dev/categoryData.js
const img = (name) => ({
  url: `https://placehold.co/800x400?text=${encodeURIComponent(name)}`,
  publicId: `seed_category_${name.replace(/\s+/g, "_").toLowerCase()}`,
});

const sampleCategories = [
  {
    name: "Electronics",
    subCategories: ["Mobile Phones", "Laptops", "Audio", "Wearables"],
    availableColors: ["Black", "White", "Silver", "Gold"],
    specSheet: [{ ram: 4 }, { rom: 120 }],
  },
  {
    name: "Home Appliances",
    subCategories: ["Kitchen", "Cleaning", "Cooling"],
    availableColors: ["Black", "White", "Silver"],
    specSheet: [{ capacity: "5L" }, { warranty: "2 years" }],
  },
  {
    name: "Beauty",
    subCategories: ["Skincare", "Makeup", "Haircare"],
    availableColors: ["N/A"],
    specSheet: [{ volume: "100ml" }],
  },
  {
    name: "Fashion",
    subCategories: ["Men", "Women", "Footwear"],
    availableColors: ["Black", "White", "Blue", "Red"],
    specSheet: [{ fabric: "Cotton" }],
  },
  {
    name: "Accessories",
    subCategories: ["Bags", "Watches", "Sunglasses"],
    availableColors: ["Black", "Brown", "Tan"],
    specSheet: [{ material: "Leather" }],
  },
  {
    name: "Beverages",
    subCategories: ["Coffee", "Tea", "Juices", "Water"],
    availableColors: ["N/A"],
    specSheet: [{ volume: "1L" }],
  },
];

const categoryDocs = sampleCategories.map((item) => ({
  ...item,
  categoryImage: img(item.name),
}));

module.exports = categoryDocs;
