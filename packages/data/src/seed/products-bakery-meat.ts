import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

/** Flour, baking, and meat items from wholesalecalgary.ca */
export const productSeedsBakeryMeat: ProductSeed[] = [
  p("CW-BKY-3227", "Heer Atta 20lb", "Heer", "cat-dairy", "20 lb bag", "1 × 20 lb", 1, 18.99, null, 18.99, 12, 24, ["flour", "staple", "featured"], "Whole wheat atta for rotis — 20 lb bag.", "heer-atta-20lb"),
  p("CW-BKY-3228", "Sher Atta Desi Style 20lb", "Sher", "cat-dairy", "20 lb bag", "1 × 20 lb", 1, 19.49, null, 19.49, 12.5, 20, ["flour", "staple"], "Desi-style atta milled for soft rotis and parathas.", "sher-atta-20lb"),
  p("CW-BKY-3229", "Golden Temple Atta 20lb", "Golden Temple", "cat-dairy", "20 lb bag", "1 × 20 lb", 1, 19.99, null, 19.99, 13, 20, ["flour"], "Golden Temple whole wheat atta, 20 lb.", "golden-temple-atta"),
  p("CW-BKY-3230", "Aashirvaad Wholewheat Atta 20lb", "Aashirvaad", "cat-dairy", "20 lb bag", "1 × 20 lb", 1, 21.99, null, 21.99, 14.5, 18, ["flour"], "Aashirvaad whole wheat atta in a 20 lb bag.", "aashirvaad-atta"),
  p("CW-BKY-3231", "ADM Baker Roses Flour 20kg", "ADM", "cat-dairy", "20 kg", "1 × 20 kg", 1, 28.99, null, 28.99, 18, 16, ["flour", "baking"], "Baker’s flour for commercial baking — 20 kg.", "adm-baker-flour"),
  p("CW-BKY-3232", "Corn Flour / Makki Da Atta 20lb", "Heer", "cat-dairy", "20 lb", "1 × 20 lb", 1, 22.99, null, 22.99, 14, 14, ["flour", "south-asian"], "Makki da atta (corn flour) for rotis — 20 lb.", "corn-flour-20lb"),
  p("CW-BKY-3233", "Heer Besan Fine 40lb", "Heer", "cat-dairy", "40 lb", "1 × 40 lb", 1, 48.99, null, 48.99, 32, 12, ["flour", "besan"], "Fine chickpea flour (besan) in a 40 lb bag.", "heer-besan-fine"),
  p("CW-BKY-3234", "Riwayat Cornstarch 25kg", "Riwayat", "cat-dairy", "25 kg", "1 × 25 kg", 1, 42.99, null, 42.99, 28, 12, ["baking"], "Foodservice cornstarch — 25 kg sack.", "riwayat-cornstarch"),
  p("CW-BKY-3235", "Riwayat Urad Flour 5lb", "Riwayat", "cat-dairy", "5 lb / 2.27 kg", "4 × 5 lb", 4, 12.99, null, 44, 28, 14, ["flour", "south-asian"], "Urad flour for dosas, vadas, and papad.", "urad-flour"),
  p("CW-BKY-3236", "Baking Powder 5kg", "Pinnacle", "cat-dairy", "5 kg", "4 × 5 kg", 4, 16.99, null, 58, 36, 16, ["baking"], "Commercial baking powder — 5 kg.", "baking-powder-5kg"),
  p("CW-BKY-3237", "Yeast Instant 500g", "Pinnacle", "cat-dairy", "500 g", "20 × 500 g", 20, 6.49, null, 98, 62, 18, ["baking"], "Instant dry yeast for bakery and naan.", "yeast-instant"),
  p("CW-BKY-3238", "Breadcrumbs 50lbs", "Breaders", "cat-dairy", "50 lb", "1 × 50 lb", 1, 54.99, null, 54.99, 36, 10, ["baking", "coating"], "Dry breadcrumbs for coating and stuffing — 50 lb.", "breadcrumbs-50lb"),
  p("CW-MEA-4101", "Harabhara Kabab 600g×10", "Nanak", "cat-dairy", "600 g × 10", "10 × 600 g", 10, 64.99, 72.99, 64.99, 42, 14, ["frozen", "featured", "veg-protein"], "Frozen hara bhara kababs — 10 × 600 g case.", "harabhara-kabab"),
  p("CW-MEA-4102", "Nanak Aloo Tikki 720g×10", "Nanak", "cat-dairy", "720 g × 10", "10 × 720 g", 10, 58.99, null, 58.99, 38, 14, ["frozen", "veg-protein"], "Frozen aloo tikki — 10 × 720 g case.", "aloo-tikki"),
  p("CW-MEA-4103", "Y & Y Noodle 454g×12", "Y & Y", "cat-dairy", "454 g × 12", "12 × 454 g", 12, 36.99, null, 36.99, 22, 16, ["frozen", "noodles"], "Frozen noodles for Indo-Chinese and stir-fry — 12 packs.", "yy-noodle"),
  p("CW-MEA-4104", "Frozen Drumsticks 340g×24", "Surati", "cat-dairy", "340 g × 24", "24 × 340 g", 24, 72.99, null, 72.99, 48, 12, ["frozen", "veg"], "Frozen drumstick (moringa) packs — 24 × 340 g.", "frozen-drumsticks"),
];
