import Product from "./model/Product.js";

const sampleProducts = [
  {
    name: "Everyday Essential",
    description:
      "A comfortable everyday piece designed for office days, campus life, and easy weekends.",
    price: 1290,
    costPrice: 650,
    stock: 12,
    ratings: 4.8,
    numOfReviews: 6,
    isFeatured: true,
    image: "product1.jpeg",
  },
  {
    name: "Soft Structure Shirt",
    description:
      "A refined, versatile layer with a relaxed shape and a considered feel.",
    price: 1590,
    costPrice: 800,
    stock: 8,
    ratings: 4.7,
    numOfReviews: 4,
    isFeatured: true,
    image: "product2.jpeg",
  },
  {
    name: "Earthbound Layer",
    description:
      "An easy-to-style Wearthly layer made for comfortable daily dressing.",
    price: 1890,
    costPrice: 950,
    stock: 10,
    ratings: 4.9,
    numOfReviews: 8,
    isFeatured: true,
    image: "product3.jpeg",
  },
];

export const seedSampleProducts = async (ownerId) => {
  if (process.env.SEED_SAMPLE_PRODUCTS !== "true") return;
  if (!ownerId) throw new Error("An owner is required for sample products.");

  const publicUrl = (
    process.env.PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 4001}`
  ).replace(/\/$/, "");

  const existingProducts = await Product.countDocuments({
    isArchived: { $ne: true },
  });

  for (const product of sampleProducts) {
    const image = {
      url: `${publicUrl}/sample-products/${product.image}`,
      publicId: `wearthly-sample-${product.image}`,
    };
    const existing = await Product.findOne({ name: product.name });

    if (existing) {
      existing.user = ownerId;
      existing.images = [image];
      existing.isArchived = false;
      existing.isFeatured = true;
      await existing.save();
      continue;
    }

    await Product.create({
      name: product.name,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
      isFeatured: product.isFeatured,
      user: ownerId,
      images: [image],
    });
  }

  console.log(
    existingProducts > 0
      ? "Repaired Wearthly sample products."
      : `Seeded ${sampleProducts.length} Wearthly sample products.`,
  );
};
