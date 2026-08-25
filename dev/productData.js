const { default: mongoose } = require("mongoose");

const SELLER_ID = "6a213d5a23da8241fc385b3d";

const CATEGORIES = {
  Electronics: "6a8c9e11adf0b4cb404bad57",
  Beauty: "6a8c9e11adf0b4cb404bad59",
  HomeApp: "6a8c9e11adf0b4cb404bad58",
  Fashion: "6a8c9e11adf0b4cb404bad5a",
  Beverages: "6a8c9e11adf0b4cb404bad5c",
  Accessories: "6a8c9e11adf0b4cb404bad5b",
};

// placeholder image — valid url + publicId format the schema requires
const img = (name) => [
  {
    url: `https://placehold.co/400x400?text=${encodeURIComponent(name)}`,
    publicId: `seed_${name.replace(/\s+/g, "_").toLowerCase()}`,
  },
];

const products = [
  // Electronics (10)
  {
    productName: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    productDesc:
      "Flagship Android phone with S-Pen, 200MP camera and AI features.",
    categoryId: CATEGORIES.Electronics,
    mrp: 129999,
    offerPrice: 119999,
    stock: 40,
  },
  {
    productName: "Apple iPhone 16 Pro",
    brand: "Apple",
    productDesc:
      "A18 Pro chip, titanium build, ProRes video and dynamic island.",
    categoryId: CATEGORIES.Electronics,
    mrp: 134900,
    offerPrice: 129900,
    stock: 35,
  },
  {
    productName: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    productDesc: "Industry-leading noise cancellation with 30hr battery life.",
    categoryId: CATEGORIES.Electronics,
    mrp: 29990,
    offerPrice: 24990,
    stock: 60,
  },
  {
    productName: "Dell XPS 15 Laptop",
    brand: "Dell",
    productDesc: "15.6-inch OLED display, Intel Core i9, 32GB RAM powerhouse.",
    categoryId: CATEGORIES.Electronics,
    mrp: 189990,
    offerPrice: 174990,
    stock: 20,
  },
  {
    productName: "iPad Pro 13-inch M4",
    brand: "Apple",
    productDesc:
      "Ultra-thin tablet with M4 chip and stunning Liquid Retina XDR.",
    categoryId: CATEGORIES.Electronics,
    mrp: 108900,
    offerPrice: 99900,
    stock: 25,
  },
  {
    productName: "OnePlus 13 5G",
    brand: "OnePlus",
    productDesc:
      "Snapdragon 8 Elite chip, 100W fast charging, Hasselblad camera.",
    categoryId: CATEGORIES.Electronics,
    mrp: 69999,
    offerPrice: 64999,
    stock: 50,
  },
  {
    productName: "Bose QuietComfort 45",
    brand: "Bose",
    productDesc: "Premium wireless headphones with balanced sound and ANC.",
    categoryId: CATEGORIES.Electronics,
    mrp: 24500,
    offerPrice: 19999,
    stock: 45,
  },
  {
    productName: "Sony 55-inch 4K OLED TV",
    brand: "Sony",
    productDesc: "Bravia XR OLED with Cognitive Processor and Dolby Atmos.",
    categoryId: CATEGORIES.Electronics,
    mrp: 159990,
    offerPrice: 139990,
    stock: 15,
  },
  {
    productName: "Xiaomi Redmi Note 14 Pro",
    brand: "Xiaomi",
    productDesc: "50MP triple camera, 5500mAh battery, 120Hz AMOLED display.",
    categoryId: CATEGORIES.Electronics,
    mrp: 24999,
    offerPrice: 21999,
    stock: 80,
  },
  {
    productName: "Logitech MX Master 3S Mouse",
    brand: "Logitech",
    productDesc: "Ergonomic wireless mouse with MagSpeed scroll and 8K DPI.",
    categoryId: CATEGORIES.Electronics,
    mrp: 9995,
    offerPrice: 8499,
    stock: 100,
  },

  // Beauty (8)
  {
    productName: "Lakme 9-to-5 Foundation",
    brand: "Lakme",
    productDesc:
      "Matte finish foundation with SPF 25, 16hr long-wearing formula.",
    categoryId: CATEGORIES.Beauty,
    mrp: 699,
    offerPrice: 559,
    stock: 200,
  },
  {
    productName: "Maybeline Fit Me Concealer",
    brand: "Maybelline",
    productDesc:
      "Lightweight concealer that blends seamlessly for natural finish.",
    categoryId: CATEGORIES.Beauty,
    mrp: 399,
    offerPrice: 319,
    stock: 180,
  },
  {
    productName: "LOreal Paris Revitalift Serum",
    brand: "L'Oreal",
    productDesc: "1.5% pure hyaluronic acid serum for deep skin hydration.",
    categoryId: CATEGORIES.Beauty,
    mrp: 1299,
    offerPrice: 999,
    stock: 120,
  },
  {
    productName: "Forest Essentials Rose Water",
    brand: "Forest Essentials",
    productDesc: "Pure steam-distilled rose water toner for glowing skin.",
    categoryId: CATEGORIES.Beauty,
    mrp: 595,
    offerPrice: 475,
    stock: 150,
  },
  {
    productName: "Biotique Bio Papaya Scrub",
    brand: "Biotique",
    productDesc: "Revitalizing tan removal scrub for smooth and bright skin.",
    categoryId: CATEGORIES.Beauty,
    mrp: 299,
    offerPrice: 239,
    stock: 220,
  },
  {
    productName: "Nykaa Cosmetics Matte Lipstick",
    brand: "Nykaa",
    productDesc: "Rich pigment matte lipstick in 30 shades, long-lasting wear.",
    categoryId: CATEGORIES.Beauty,
    mrp: 449,
    offerPrice: 359,
    stock: 300,
  },
  {
    productName: "Plum Goodness Face Wash",
    brand: "Plum",
    productDesc: "Green tea face wash for oily skin, SLS and paraben free.",
    categoryId: CATEGORIES.Beauty,
    mrp: 375,
    offerPrice: 299,
    stock: 250,
  },
  {
    productName: "The Ordinary Niacinamide Serum",
    brand: "The Ordinary",
    productDesc: "10% niacinamide and 1% zinc serum to reduce blemishes.",
    categoryId: CATEGORIES.Beauty,
    mrp: 1150,
    offerPrice: 950,
    stock: 160,
  },

  // Home Appliances (9)
  {
    productName: "LG 8kg Front Load Washing Machine",
    brand: "LG",
    productDesc: "AI Direct Drive motor, steam wash, and TurboWash 360 tech.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 54990,
    offerPrice: 44990,
    stock: 18,
  },
  {
    productName: "Dyson V15 Detect Vacuum",
    brand: "Dyson",
    productDesc: "Laser dust detection, HEPA filtration and 60min battery.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 62900,
    offerPrice: 54900,
    stock: 12,
  },
  {
    productName: "Philips Air Fryer XXL",
    brand: "Philips",
    productDesc: "7.3L capacity, Rapid Air technology, 90% less fat cooking.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 16995,
    offerPrice: 12995,
    stock: 35,
  },
  {
    productName: "Whirlpool 265L Double Door Fridge",
    brand: "Whirlpool",
    productDesc:
      "Intellifresh motor, 6th Sense technology, frost-free cooling.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 32990,
    offerPrice: 27990,
    stock: 14,
  },
  {
    productName: "Prestige Electric Kettle 1.5L",
    brand: "Prestige",
    productDesc:
      "1500W rapid boil kettle with auto shut-off and boil-dry protection.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 1299,
    offerPrice: 999,
    stock: 90,
  },
  {
    productName: "Havells Instanio Water Heater 25L",
    brand: "Havells",
    productDesc:
      "25L storage geyser with adjustable thermostat and anti-rust tank.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 9490,
    offerPrice: 7490,
    stock: 30,
  },
  {
    productName: "Bajaj Majesty OTX 9 Toaster",
    brand: "Bajaj",
    productDesc:
      "1200W pop-up toaster with 7 browning settings and defrost mode.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 2299,
    offerPrice: 1799,
    stock: 60,
  },
  {
    productName: "Crompton Aura 50L Water Purifier",
    brand: "Crompton",
    productDesc:
      "RO+UV+UF purification with 7-stage filtration and 50L/hr output.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 14999,
    offerPrice: 11499,
    stock: 22,
  },
  {
    productName: "Pigeon Healthifry 4L Air Fryer",
    brand: "Pigeon",
    productDesc:
      "Compact 4L air fryer with 8 preset functions and digital panel.",
    categoryId: CATEGORIES.HomeApp,
    mrp: 5499,
    offerPrice: 3999,
    stock: 55,
  },

  // Fashion (9)
  {
    productName: "Levi's 511 Slim Fit Jeans",
    brand: "Levi's",
    productDesc: "Classic slim fit jeans in stretch denim for all-day comfort.",
    categoryId: CATEGORIES.Fashion,
    mrp: 3999,
    offerPrice: 2999,
    stock: 120,
  },
  {
    productName: "Adidas Ultraboost 22 Sneakers",
    brand: "Adidas",
    productDesc:
      "Responsive Boost midsole, Primeknit upper for premium running.",
    categoryId: CATEGORIES.Fashion,
    mrp: 16999,
    offerPrice: 13999,
    stock: 75,
  },
  {
    productName: "Nike Dri-FIT Running T-Shirt",
    brand: "Nike",
    productDesc: "Sweat-wicking Dri-FIT fabric keeps you cool during workouts.",
    categoryId: CATEGORIES.Fashion,
    mrp: 2499,
    offerPrice: 1899,
    stock: 200,
  },
  {
    productName: "H&M Oversized Hoodie",
    brand: "H&M",
    productDesc: "Soft cotton blend oversized hoodie with kangaroo pocket.",
    categoryId: CATEGORIES.Fashion,
    mrp: 2999,
    offerPrice: 2199,
    stock: 150,
  },
  {
    productName: "Zara Floral Midi Dress",
    brand: "Zara",
    productDesc:
      "Flowy floral midi dress with puff sleeves and tie waist detail.",
    categoryId: CATEGORIES.Fashion,
    mrp: 3599,
    offerPrice: 2799,
    stock: 80,
  },
  {
    productName: "Peter England Formal Shirt",
    brand: "Peter England",
    productDesc:
      "Premium cotton formal shirt with slim-fit cut and spread collar.",
    categoryId: CATEGORIES.Fashion,
    mrp: 1799,
    offerPrice: 1299,
    stock: 180,
  },
  {
    productName: "Woodland Leather Boots",
    brand: "Woodland",
    productDesc: "Genuine leather ankle boots with oil-resistant rubber sole.",
    categoryId: CATEGORIES.Fashion,
    mrp: 4999,
    offerPrice: 3799,
    stock: 60,
  },
  {
    productName: "US Polo Assn Polo T-Shirt",
    brand: "US Polo Assn",
    productDesc:
      "Classic pique polo with embroidered logo, regular fit design.",
    categoryId: CATEGORIES.Fashion,
    mrp: 1599,
    offerPrice: 1199,
    stock: 220,
  },
  {
    productName: "Fastrack Analog Watch",
    brand: "Fastrack",
    productDesc: "Stainless steel case, leather strap, water resistant to 30m.",
    categoryId: CATEGORIES.Fashion,
    mrp: 2995,
    offerPrice: 2299,
    stock: 95,
  },

  // Beverages (7)
  {
    productName: "Nescafe Classic Instant Coffee 200g",
    brand: "Nescafe",
    productDesc: "Rich and smooth instant coffee made from 100% pure coffee.",
    categoryId: CATEGORIES.Beverages,
    mrp: 499,
    offerPrice: 399,
    stock: 300,
  },
  {
    productName: "Tata Tea Gold 500g",
    brand: "Tata Tea",
    productDesc:
      "Premium blend of long leaf and short leaf teas for rich flavour.",
    categoryId: CATEGORIES.Beverages,
    mrp: 329,
    offerPrice: 269,
    stock: 400,
  },
  {
    productName: "Red Bull Energy Drink 250ml Pack of 6",
    brand: "Red Bull",
    productDesc: "Caffeinated energy drink with B vitamins and taurine blend.",
    categoryId: CATEGORIES.Beverages,
    mrp: 720,
    offerPrice: 599,
    stock: 250,
  },
  {
    productName: "Bisleri Mineral Water 1L Pack of 12",
    brand: "Bisleri",
    productDesc: "Pure and safe packaged drinking water with added minerals.",
    categoryId: CATEGORIES.Beverages,
    mrp: 240,
    offerPrice: 199,
    stock: 500,
  },
  {
    productName: "Tropicana Orange Juice 1L",
    brand: "Tropicana",
    productDesc: "100% pure squeezed orange juice with no added sugar.",
    categoryId: CATEGORIES.Beverages,
    mrp: 175,
    offerPrice: 139,
    stock: 350,
  },
  {
    productName: "Starbucks VIA Instant Coffee 8 Sticks",
    brand: "Starbucks",
    productDesc:
      "Premium microground instant coffee with signature Starbucks taste.",
    categoryId: CATEGORIES.Beverages,
    mrp: 599,
    offerPrice: 479,
    stock: 180,
  },
  {
    productName: "Lipton Green Tea 100 Bags",
    brand: "Lipton",
    productDesc:
      "Natural green tea bags rich in antioxidants for healthy living.",
    categoryId: CATEGORIES.Beverages,
    mrp: 350,
    offerPrice: 279,
    stock: 320,
  },

  // Accessories (7)
  {
    productName: "Wildcraft 45L Hiking Backpack",
    brand: "Wildcraft",
    productDesc:
      "Durable 45L backpack with rain cover and ergonomic back panel.",
    categoryId: CATEGORIES.Accessories,
    mrp: 3499,
    offerPrice: 2699,
    stock: 70,
  },
  {
    productName: "Fossil Quinn Leather Wallet",
    brand: "Fossil",
    productDesc:
      "Slim bifold leather wallet with 6 card slots and RFID blocking.",
    categoryId: CATEGORIES.Accessories,
    mrp: 2995,
    offerPrice: 2295,
    stock: 110,
  },
  {
    productName: "Ray-Ban Aviator Sunglasses",
    brand: "Ray-Ban",
    productDesc:
      "Classic aviator with polarized lenses and gold-tone metal frame.",
    categoryId: CATEGORIES.Accessories,
    mrp: 7990,
    offerPrice: 6490,
    stock: 45,
  },
  {
    productName: "Skybags Suitcase 68cm",
    brand: "Skybags",
    productDesc:
      "Lightweight polycarbonate hard case with TSA lock and spinner wheels.",
    categoryId: CATEGORIES.Accessories,
    mrp: 6999,
    offerPrice: 4999,
    stock: 38,
  },
  {
    productName: "Titan Raga Rose Gold Watch",
    brand: "Titan",
    productDesc:
      "Elegant rose gold watch with mother of pearl dial and leather strap.",
    categoryId: CATEGORIES.Accessories,
    mrp: 8995,
    offerPrice: 7495,
    stock: 55,
  },
  {
    productName: "Puma Gym Duffel Bag",
    brand: "Puma",
    productDesc:
      "Spacious 40L duffel bag with separate shoe compartment and wet pocket.",
    categoryId: CATEGORIES.Accessories,
    mrp: 2499,
    offerPrice: 1899,
    stock: 90,
  },
  {
    productName: "Noise ColorFit Pro 5 Smartwatch",
    brand: "Noise",
    productDesc:
      "AMOLED display smartwatch with health tracking and 7-day battery.",
    categoryId: CATEGORIES.Accessories,
    mrp: 4999,
    offerPrice: 3499,
    stock: 130,
  },
];

const productDocs = products.map((p) => ({
  ...p,
  sellerId: new mongoose.Types.ObjectId(SELLER_ID),
  categoryId: new mongoose.Types.ObjectId(p.categoryId),
  productImage: img(p.productName),
  couponId: null,
}));

module.exports = productDocs;
