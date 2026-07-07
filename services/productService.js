const logger = require("../utils/logger");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { NotFoundError } = require("../utils/errors");
const { default: mongoose } = require("mongoose");

class ProductService {
  static async addProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      logger.error("Add product error:", error);
      throw error;
    }
  }
  //fetch single product with _id
  static async fetchOneProduct(productId) {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      logger.info("Product send:", product);
      return product;
    } catch (error) {
      logger.error("Fetch product error:", error);
      throw error;
    }
  }
  //fetch products with pagination from the database
  // fetch products with pagination from the database
  static async fetchProduct({
    page = 1,
    limit = 15,
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    priceSort = "",
    sort = "newest",
    isFeatured = false,
    ids = "", // <-- new: comma-separated string of product _ids
  } = {}) {
    try {
      const filter = {};

      // Filter by specific product IDs (e.g. cart contents)
      if (ids) {
        const idList = ids
          .split(",")
          .filter(Boolean)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));

        if (idList.length > 0) {
          filter._id = { $in: idList };
        }
      }

      // Text search across productName, brand, productDesc
      if (search) {
        filter.$text = { $search: search };
      }

      // Category: look up by name first, then filter by its ObjectId
      if (category) {
        const categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(category, "i") }, // case-insensitive match
        }).lean();

        if (!categoryDoc) {
          // category name doesn't exist — return empty result immediately
          return {
            data: [],
            pagination: {
              total: 0,
              page: Number(page),
              limit: Number(limit),
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          };
        }

        filter.categoryId = categoryDoc._id;
      }

      // Price range
      if (minPrice || maxPrice) {
        filter.offerPrice = {};
        if (minPrice) filter.offerPrice.$gte = Number(minPrice);
        if (maxPrice) filter.offerPrice.$lte = Number(maxPrice);
      }

      // Sort — price and date are independent axes, combined when both are present
      const sortFieldMap = {
        price_asc: { offerPrice: 1 },
        price_desc: { offerPrice: -1 },
      };
      const dateFieldMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
      };

      const priceSortField = sortFieldMap[priceSort];
      const dateSortField = dateFieldMap[sort];

      let sortOption;
      if (priceSortField && dateSortField) {
        sortOption = { ...priceSortField, ...dateSortField };
      } else if (priceSortField) {
        sortOption = priceSortField;
      } else if (dateSortField) {
        sortOption = dateSortField;
      } else {
        sortOption = { createdAt: -1 };
      }

      const skip = (Number(page) - 1) * Number(limit);

      //FEATURED PATH
      if (isFeatured) {
        const pipeline = [
          { $match: filter },
          { $sort: { ordered: -1, createdAt: -1 } }, // most-ordered first, tiebreak by newest
          {
            $group: {
              _id: "$categoryId",
              product: { $first: "$$ROOT" },
            },
          },
          { $replaceRoot: { newRoot: "$product" } },
          { $sort: sortOption }, // apply the requested display sort to the featured set
          {
            $facet: {
              data: [
                { $skip: skip },
                { $limit: Number(limit) },
                {
                  $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryId",
                  },
                },
                { $unwind: "$categoryId" },
                {
                  $project: {
                    "categoryId.name": 1,
                    "categoryId._id": 1,
                    productName: 1,
                    brand: 1,
                    productDesc: 1,
                    sellerId: 1,
                    couponId: 1,
                    stock: 1,
                    mrp: 1,
                    offerPrice: 1,
                    offerPercentage: 1,
                    ordered: 1,
                    productImage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ];

        const result = await Product.aggregate(pipeline);
        const data = result[0]?.data ?? [];
        const total = result[0]?.totalCount[0]?.count ?? 0;
        const totalPages = Math.ceil(total / Number(limit));

        return {
          data,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages,
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
          },
        };
      }

      //REGULAR PATH
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(Number(limit))
          .populate("categoryId", "name")
          .lean(),
        Product.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return {
        data: products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      };
    } catch (error) {
      logger.error("Fetch product error:", error);
      throw error;
    }
  }
  //delete product
  static async deleteProduct(productId) {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      logger.info("Product deleted:", productId);
      return product;
    } catch (error) {
      logger.error("Delete product error:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
