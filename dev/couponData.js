const sampleCoupons = [
  {
    name: "Summer Sale Flat 200",
    code: "SUMMER200",
    description:
      "Get flat ₹200 off on orders above ₹999 during the summer sale.",
    discountType: "flat",
    discountValue: 200,
    maxDiscount: 200,
    minOrderAmount: 999,
    startDate: "2026-07-20T00:00:00.000Z",
    endDate: "2026-08-20T23:59:59.000Z",
    status: "active",
    usageLimit: 5000,
    usagePerUser: 1,
    applicableProducts: [],
    applicableCategories: [
      "6a493ee8d8dca79e5dd3c9df",
      "6a493ee8d8dca79e5dd3c9e0",
    ],
    excludedProducts: ["6a4a41dc4e2a2b76f6199619"],
    sellerIds: ["6a213d5a23da8241fc385b3d"],
    eligibleUsers: "all",
    paymentMethods: "CARD",
    stackable: false,
    autoApply: true,
    createdBy: "6a213d5923da8241fc385b3b",
  },
  
];
const couponDocs = sampleCoupons;

module.exports = couponDocs;
