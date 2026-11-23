import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

/** Packaging, disposables, and dessert mixes for Wholesale Calgary categories */
export const productSeedsHouseholdPersonal: ProductSeed[] = [
  // Takeout & Catering Boxes
  p("CW-HSH-9101", "Galaxy 8-inch Extra Heavy Container", "Galaxy", "cat-household", "Case", "150 / cs", 150, 42.99, null, 42.99, 26, 16, ["packaging", "containers", "featured"], "Extra-heavy 8-inch round takeout containers — Galaxy.", "galaxy-8-container"),
  p("CW-HSH-9102", "Galaxy Full Size Aluminium Container", "Galaxy", "cat-household", "Case", "50 / cs", 50, 48.99, null, 48.99, 30, 14, ["packaging", "foil"], "Full-size aluminium steam-table pan.", "galaxy-full-foil"),
  p("CW-HSH-9103", "Galaxy Half Size Deep 100pcs/cs", "Galaxy", "cat-household", "100 pcs", "100 / cs", 100, 54.99, null, 54.99, 34, 14, ["packaging", "foil"], "Half-size deep aluminium pans — 100/cs.", "galaxy-half-deep"),
  p("CW-HSH-9104", "EP-81 8x8 Compostable Container 150/cs", "EP", "cat-household", "150 / cs", "150 / cs", 150, 58.99, null, 58.99, 36, 12, ["packaging", "compostable", "featured"], "8x8 compostable hinged container — 150/cs.", "ep81-compostable"),
  p("CW-HSH-9108", "Kraft Takeout Boxes Assorted 200/cs", "Galaxy", "cat-household", "200 / cs", "200 / cs", 200, 44.99, null, 44.99, 28, 16, ["packaging", "featured"], "Kraft paper takeout boxes — 200/cs assortment.", "kraft-takeout"),

  // Single-Use Cutlery
  p("CW-HSH-9105", "Galaxy PLA White Cutlery Set 400/cs", "Galaxy", "cat-bakery", "400 sets", "400 / cs", 400, 36.99, null, 36.99, 22, 16, ["packaging", "cutlery", "featured"], "PLA compostable cutlery sets — 400/cs.", "pla-cutlery-set"),
  p("CW-CUT-9201", "Heavy Duty Black Forks 1000/cs", "Galaxy", "cat-bakery", "1000 / cs", "1000 / cs", 1000, 28.99, null, 28.99, 16, 18, ["packaging", "cutlery"], "Heavy-duty black plastic forks — 1000/cs.", "hd-forks"),
  p("CW-CUT-9202", "Heavy Duty Spoons 1000/cs", "Galaxy", "cat-bakery", "1000 / cs", "1000 / cs", 1000, 28.99, null, 28.99, 16, 18, ["packaging", "cutlery"], "Heavy-duty plastic spoons — 1000/cs.", "hd-spoons"),
  p("CW-CUT-9203", "Heavy Duty Knives 1000/cs", "Galaxy", "cat-bakery", "1000 / cs", "1000 / cs", 1000, 27.99, null, 27.99, 15, 18, ["packaging", "cutlery"], "Heavy-duty plastic knives — 1000/cs.", "hd-knives"),

  // Beverage Packaging & Cups
  p("CW-HSH-9106", "Galaxy 16oz Clear PET Cup 1000/cs", "Galaxy", "cat-beverages", "1000 / cs", "1000 / cs", 1000, 64.99, null, 64.99, 40, 14, ["packaging", "cups", "featured"], "16 oz clear PET cups — 1000/cs.", "pet-cup-16oz"),
  p("CW-HSH-9107", "12oz Paper Cups 1000/cs", "Galaxy", "cat-beverages", "1000 / cs", "1000 / cs", 1000, 52.99, null, 52.99, 32, 16, ["packaging", "cups"], "12 oz hot paper cups — 1000/cs.", "paper-cup-12oz"),
  p("CW-CUP-9301", "Dome Lids for 16oz PET 1000/cs", "Galaxy", "cat-beverages", "1000 / cs", "1000 / cs", 1000, 34.99, null, 34.99, 20, 16, ["packaging", "cups"], "Clear dome lids for 16 oz PET cups.", "dome-lids-16"),
  p("CW-CUP-9302", "Cup Sleeves Kraft 1000/cs", "Galaxy", "cat-beverages", "1000 / cs", "1000 / cs", 1000, 22.99, null, 22.99, 12, 20, ["packaging", "cups"], "Kraft paper cup sleeves — 1000/cs.", "cup-sleeves"),
  p("CW-CUP-9303", "Individually Wrapped Straws 2000/cs", "Galaxy", "cat-beverages", "2000 / cs", "2000 / cs", 2000, 24.99, null, 24.99, 14, 18, ["packaging", "cups"], "Wrapped drinking straws — 2000/cs.", "wrapped-straws"),

  // Large Bags
  p("CW-HSH-9109", "Brown Paper Bag 10lb 500/bundle", "Galaxy", "cat-produce", "500 / bundle", "500 / bundle", 500, 28.99, null, 28.99, 16, 18, ["packaging", "bags", "featured"], "Brown paper grocery bags — 10 lb, 500/bundle.", "brown-bag-10lb"),
  p("CW-HSH-9116", "Garbage Bags Heavy Duty 200/cs", "Clean Harbour", "cat-produce", "200 / cs", "200 / cs", 200, 34.99, null, 34.99, 20, 16, ["janitorial", "bags"], "Heavy-duty garbage bags — 200/cs.", "garbage-bags"),
  p("CW-BAG-9401", "Clear Poly Bags 11x17 1000/cs", "Galaxy", "cat-produce", "1000 / cs", "1000 / cs", 1000, 26.99, null, 26.99, 15, 18, ["packaging", "bags"], "Clear poly bags 11×17 — 1000/cs.", "poly-bags-1117"),
  p("CW-BAG-9402", "T-Shirt Bags Large 1000/cs", "Galaxy", "cat-produce", "1000 / cs", "1000 / cs", 1000, 31.99, null, 31.99, 18, 16, ["packaging", "bags"], "Large t-shirt style carry bags — 1000/cs.", "tshirt-bags"),

  // Food Prep Wraps & Films
  p("CW-HSH-9110", "Galaxy Food Film 18-inch 500ft", "Galaxy", "cat-snacks", "500 ft roll", "1 roll", 1, 32.99, null, 32.99, 20, 16, ["packaging", "film", "featured"], "18-inch foodservice cling film — 500 ft.", "food-film-18"),
  p("CW-WRP-9501", "Aluminium Foil 18-inch 500ft", "Galaxy", "cat-snacks", "500 ft roll", "1 roll", 1, 38.99, null, 38.99, 24, 14, ["packaging", "film"], "Heavy-duty aluminium foil — 18-inch × 500 ft.", "foil-18"),
  p("CW-WRP-9502", "Parchment Paper 15-inch 200ft", "Galaxy", "cat-snacks", "200 ft roll", "1 roll", 1, 29.99, null, 29.99, 18, 16, ["packaging", "film"], "Foodservice parchment paper — 15-inch × 200 ft.", "parchment-15"),
  p("CW-WRP-9503", "Deli Wrap Sheets 1000/cs", "Galaxy", "cat-snacks", "1000 / cs", "1000 / cs", 1000, 27.99, null, 27.99, 16, 18, ["packaging", "film"], "Interfolded deli wrap sheets — 1000/cs.", "deli-wrap"),

  // Workwear & Protective Gear
  p("CW-HSH-9111", "Poly/Vinyl/Nitrile Gloves Assorted", "Galaxy", "cat-personal", "Case", "10 boxes", 10, 38.99, null, 38.99, 24, 18, ["gloves", "safety", "featured"], "Assorted poly, vinyl, and nitrile glove boxes.", "gloves-assorted"),
  p("CW-WRK-9601", "Disposable Aprons 100/cs", "Galaxy", "cat-personal", "100 / cs", "100 / cs", 100, 22.99, null, 22.99, 12, 18, ["safety", "aprons"], "Poly disposable aprons — 100/cs.", "disposable-aprons"),
  p("CW-WRK-9602", "Bouffant Hairnets 1000/cs", "Galaxy", "cat-personal", "1000 / cs", "1000 / cs", 1000, 18.99, null, 18.99, 10, 20, ["safety"], "Bouffant hairnets — 1000/cs.", "hairnets"),
  p("CW-WRK-9603", "Nitrile Gloves XL Blue 100/box ×10", "Galaxy", "cat-personal", "10 boxes", "10 × 100", 10, 44.99, null, 44.99, 28, 16, ["gloves", "safety"], "Blue nitrile gloves XL — 10 boxes.", "nitrile-xl"),

  // Commercial Napkins
  p("CW-HSH-9112", "Paper Towels & Bath Tissue Bundle", "Clean Harbour", "cat-frozen", "Bundle", "1 bundle", 1, 36.99, null, 36.99, 22, 16, ["janitorial", "paper"], "Paper towels and bath tissue for washrooms and kitchens.", "paper-towel-bath"),
  p("CW-NAP-9701", "Dinner Napkins White 3000/cs", "Clean Harbour", "cat-frozen", "3000 / cs", "3000 / cs", 3000, 42.99, null, 42.99, 26, 14, ["napkins", "featured"], "1-ply white dinner napkins — 3000/cs.", "dinner-napkins"),
  p("CW-NAP-9702", "Dispenser Napkins 6000/cs", "Clean Harbour", "cat-frozen", "6000 / cs", "6000 / cs", 6000, 38.99, null, 38.99, 24, 16, ["napkins"], "Interfold dispenser napkins — 6000/cs.", "dispenser-napkins"),
  p("CW-NAP-9703", "Beverage Napkins 4000/cs", "Clean Harbour", "cat-frozen", "4000 / cs", "4000 / cs", 4000, 29.99, null, 29.99, 18, 18, ["napkins"], "Cocktail / beverage napkins — 4000/cs.", "bev-napkins"),

  // Packaging & Operations
  p("CW-HSH-9113", "Dishwashing Soap 4L×4", "Stellar", "cat-pantry", "4 L × 4", "4 × 4 L", 4, 42.99, null, 42.99, 26, 14, ["janitorial", "cleaning"], "Manual dishwashing soap — 4 × 4 L case.", "dish-soap-4l"),
  p("CW-HSH-9114", "Degreaser Extra Performance 4L×4", "Stellar", "cat-pantry", "4 L × 4", "4 × 4 L", 4, 48.99, null, 48.99, 30, 12, ["janitorial", "cleaning"], "Heavy-duty kitchen degreaser — 4 × 4 L.", "degreaser-4l"),
  p("CW-HSH-9115", "Bleach 4L×4/case", "Stellar", "cat-pantry", "4 L × 4", "4 × 4 L", 4, 28.99, null, 28.99, 16, 18, ["janitorial"], "Commercial bleach — 4 × 4 L case.", "bleach-4l"),
  p("CW-HSH-9117", "Mop Head, Handle & Bucket Set", "Clean Harbour", "cat-pantry", "Set", "1 set", 1, 54.99, null, 54.99, 34, 10, ["janitorial"], "Cotton mop head, 60\" handle, and mop bucket.", "mop-set"),

  // Tableware & Dinnerware
  p("CW-TAB-9801", "Paper Plates 9-inch 1000/cs", "Galaxy", "cat-meat", "1000 / cs", "1000 / cs", 1000, 36.99, null, 36.99, 22, 16, ["tableware", "featured"], "9-inch coated paper plates — 1000/cs.", "paper-plates-9"),
  p("CW-TAB-9802", "Compostable Bowls 12oz 500/cs", "EP", "cat-meat", "500 / cs", "500 / cs", 500, 41.99, null, 41.99, 26, 14, ["tableware", "compostable"], "12 oz compostable bowls — 500/cs.", "compost-bowls-12"),
  p("CW-TAB-9803", "Clear Salad Bowls with Lid 150/cs", "Galaxy", "cat-meat", "150 / cs", "150 / cs", 150, 48.99, null, 48.99, 30, 14, ["tableware", "featured"], "Clear salad bowls with lids — 150/cs.", "salad-bowls-lid"),
  p("CW-TAB-9804", "Kraft Plates 10-inch 500/cs", "Galaxy", "cat-meat", "500 / cs", "500 / cs", 500, 33.99, null, 33.99, 20, 16, ["tableware"], "10-inch kraft paper plates — 500/cs.", "kraft-plates-10"),

  // Pastries, Desserts & Mixes
  p("CW-SWT-0237", "Nanak Gulab Jamun 200 Pcs", "Nanak", "cat-dairy", "200 pcs", "1 case", 1, 48.99, 54.99, 48.99, 32, 14, ["sweets", "featured", "deal"], "Nanak gulab jamun — 200 pieces per case.", "gulab-jamun-200"),
  p("CW-SWT-0387", "Frozen Nanak Rasmalai 850g×10", "Nanak", "cat-dairy", "850 g × 10", "10 × 850 g", 10, 72.99, 79.99, 72.99, 48, 12, ["sweets", "frozen", "deal"], "Frozen Nanak rasmalai — 10 × 850 g case.", "nanak-rasmalai-frozen"),
  p("CW-SWT-7177", "Riwayat Rasmalai 3.7kg", "Riwayat", "cat-dairy", "3.7 kg", "1 × 3.7 kg", 1, 34.99, null, 34.99, 22, 14, ["sweets", "deal"], "Riwayat rasmalai tin — 3.7 kg.", "riwayat-rasmalai"),
  p("CW-SWT-7159", "Riwayat Rasgulla 3.7kg×4", "Riwayat", "cat-dairy", "3.7 kg × 4", "4 × 3.7 kg", 4, 68.99, null, 68.99, 44, 12, ["sweets", "deal"], "Riwayat rasgulla — 4 × 3.7 kg case.", "riwayat-rasgulla"),
  p("CW-SWT-7114", "Riwayat Rasbhari 3.7kg×4", "Riwayat", "cat-dairy", "3.7 kg × 4", "4 × 3.7 kg", 4, 68.99, 74.99, 68.99, 44, 12, ["sweets", "deal", "featured"], "Riwayat rasbhari (orange balls) — 4 × 3.7 kg.", "riwayat-rasbhari"),
  p("CW-SWT-7585", "Riwayat Petha Cubes 3.7kg×4", "Riwayat", "cat-dairy", "3.7 kg × 4", "4 × 3.7 kg", 4, 64.99, null, 64.99, 42, 12, ["sweets", "deal"], "Riwayat petha cubes — 4 × 3.7 kg case.", "riwayat-petha"),
];
