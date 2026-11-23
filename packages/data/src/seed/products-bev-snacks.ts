import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

/** Drinks, dry fruits, and snacks from wholesalecalgary.ca */
export const productSeedsBevSnacks: ProductSeed[] = [
  p("CW-BEV-5101", "Mango Juice Concentrate 1L×12", "Riwayat", "cat-beverages", "1 L × 12", "12 × 1 L", 12, 48.99, null, 48.99, 32, 16, ["beverage", "juice"], "Mango juice concentrate for restaurants and juice bars.", "mango-juice-conc"),
  p("CW-BEV-5102", "Guava Nectar 1L×12", "Riwayat", "cat-beverages", "1 L × 12", "12 × 1 L", 12, 42.99, null, 42.99, 28, 14, ["beverage", "juice"], "Guava nectar multipack for chilled retail and foodservice.", "guava-nectar"),
  p("CW-BEV-5103", "Concentrated Syrup Assorted 4L", "Galaxy", "cat-beverages", "4 L", "4 × 4 L", 4, 28.99, null, 98, 64, 12, ["beverage", "syrup"], "Assorted concentrated beverage syrups — 4 L jugs.", "conc-syrup-4l"),
  p("CW-BEV-5104", "Can Pop Assorted 24-pack", "Harbour Fizz", "cat-beverages", "24 cans", "2 × 24-packs", 2, 14.99, null, 26, 16, 40, ["beverage", "high-velocity"], "Assorted can pops in 24-can flats.", "can-pop-24"),
  p("CW-BEV-5105", "Chai Masala Tea 1kg", "Shan", "cat-beverages", "1 kg", "10 × 1 kg", 10, 14.99, null, 118, 78, 16, ["beverage", "tea"], "Masala chai tea blend for restaurants and cafés.", "chai-masala-tea"),
  p("CW-BEV-5106", "Loose Black Tea 900g", "Lipton", "cat-beverages", "900 g", "12 × 900 g", 12, 12.99, null, 118, 76, 18, ["beverage", "tea"], "Loose black tea for high-volume brewing.", "loose-black-tea"),
  p("CW-BEV-5107", "Instant Coffee 200g", "Nescafé", "cat-beverages", "200 g", "24 × 200 g", 24, 9.99, null, 168, 110, 14, ["beverage", "coffee"], "Instant coffee jars for kitchens and offices.", "instant-coffee"),
  p("CW-BEV-5108", "Rose Syrup 750mL×12", "Rooh Afza", "cat-beverages", "750 mL × 12", "12 × 750 mL", 12, 54.99, null, 54.99, 36, 12, ["beverage", "syrup"], "Classic rose syrup for sharbat and desserts.", "rose-syrup"),
  p("CW-SNK-0322", "Almonds 50lbs / 5lb packs", "Wholesale Calgary", "cat-snacks", "50 lb (5 lb packs)", "10 × 5 lb", 10, 189.99, 209.99, 189.99, 140, 10, ["dry-fruits", "featured", "nuts"], "Natural almonds — 50 lb total in 5 lb packs.", "almonds-50lb"),
  p("CW-SNK-6102", "Cashew Kernels WW320 50lbs", "Wholesale Calgary", "cat-snacks", "50 lb", "1 × 50 lb", 1, 249.99, null, 249.99, 190, 8, ["dry-fruits", "nuts"], "Whole cashew kernels WW320 — 50 lb case.", "cashew-ww320"),
  p("CW-SNK-6103", "Cashew Kernels LP 50lbs", "Wholesale Calgary", "cat-snacks", "22.68 kg / 50 lb", "1 × 50 lb", 1, 229.99, null, 229.99, 175, 8, ["dry-fruits", "nuts"], "Large piece cashew kernels — 50 lb.", "cashew-lp"),
  p("CW-SNK-6104", "Pistachio 30lbs", "Wholesale Calgary", "cat-snacks", "30 lb", "1 × 30 lb", 1, 198.99, null, 198.99, 150, 8, ["dry-fruits", "nuts"], "In-shell / kernel pistachios — 30 lb wholesale.", "pistachio-30lb"),
  p("CW-SNK-6105", "Green Raisins 22lb / 5lb", "Wholesale Calgary", "cat-snacks", "22 lb (5 lb packs)", "1 × 22 lb", 1, 54.99, null, 54.99, 36, 12, ["dry-fruits"], "Green raisins packed for mithai and trail mix.", "green-raisins"),
  p("CW-SNK-6106", "Red Skin Peanuts Jumbo 55lbs", "Wholesale Calgary", "cat-snacks", "55 lb", "1 × 55 lb", 1, 72.99, null, 72.99, 48, 12, ["dry-fruits", "nuts"], "Jumbo red-skin peanuts — 55 lb sack.", "peanuts-jumbo"),
  p("CW-SNK-6107", "Blanched Peanut 50lb", "Wholesale Calgary", "cat-snacks", "50 lb", "1 × 50 lb", 1, 68.99, null, 68.99, 45, 12, ["dry-fruits", "nuts"], "Blanched peanuts for chikki and kitchens — 50 lb.", "blanched-peanut"),
  p("CW-SNK-6108", "Coconut Desiccated Fine 25lb", "Macaroon", "cat-snacks", "25 lb", "1 × 25 lb", 1, 48.99, null, 48.99, 32, 12, ["dry-fruits", "baking"], "Fine desiccated coconut — 25 lb.", "coconut-desiccated"),
  p("CW-SNK-6109", "Heritage Pitted Dates 680g", "Heritage", "cat-snacks", "680 g", "12 × 680 g", 12, 7.99, null, 72, 48, 16, ["dry-fruits"], "Pitted dates for snacking and baking.", "pitted-dates"),
  p("CW-SNK-6110", "Saffron 5 Grams", "Riwayat", "cat-snacks", "5 g", "20 × 5 g", 20, 14.99, null, 220, 150, 10, ["dry-fruits", "premium"], "Premium saffron threads — 5 g packs.", "saffron-5g"),
  p("CW-SNK-6111", "Pani Puri Shells 200pcs×6", "Haldiram's", "cat-snacks", "200 pcs × 6", "6 × 200 pcs", 6, 28.99, null, 28.99, 18, 16, ["snacks", "south-asian"], "Ready pani puri shells for chaat counters.", "pani-puri"),
  p("CW-SNK-6112", "Plain Papad 200g×20", "Lijjat", "cat-snacks", "200 g × 20", "20 × 200 g", 20, 42.99, null, 42.99, 26, 18, ["snacks", "south-asian"], "Classic plain papad — 20 packs per case.", "plain-papad"),
];
