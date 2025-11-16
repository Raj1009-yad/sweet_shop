// src/startupSeeder.ts
import Sweet from "../models/sweet.model";

export async function seedSweets() {
  try {
    const count = await Sweet.countDocuments();

    if (count > 0) {
      console.log("🍬 Sweet collection already has data. Skipping seeding.");
      return;
    }

    const defaultSweets = [
  {
    name: "Gulab Jamun",
    category: "Indian",
    description: "Soft and juicy sweet balls made from khoya.",
    price: 120,
    quantity: 50,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Mini_Gulab_Jamun.jpg"
  },
  {
    name: "Rasgulla",
    category: "Bengali",
    description: "Spongy cottage cheese balls soaked in sugar syrup.",
    price: 150,
    quantity: 40,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rasgulla.jpg"
  },
  {
    name: "Kaju Katli",
    category: "Dry Sweet",
    description: "Premium cashew barfi with silver foil.",
    price: 400,
    quantity: 30,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaju_Katli_Barfi_Indian_Sweet.jpg"
  },
  {
    name: "Ladoo",
    category: "Indian",
    description: "Traditional festival special sweet.",
    price: 90,
    quantity: 60,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ladoo_Indian_Sweet.jpg"
  },
  {
    name: "Barfi",
    category: "Milk Sweet",
    description: "Classic sweet made using milk solids.",
    price: 160,
    quantity: 50,
    image: "https://en.wikipedia.org/wiki/List_of_Indian_sweets_and_desserts#/media/File:Carrot_gajar_halwa_with_kheer_India_Sweets.jpg"
  }
];


    await Sweet.insertMany(defaultSweets);
    console.log("✅ Default sweets inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding sweets:", error);
  }
}
