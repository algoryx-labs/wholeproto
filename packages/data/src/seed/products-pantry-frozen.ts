import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

export const productSeedsPantryFrozen: ProductSeed[] = [
  p("WW-PTY-70101", "Basmati rice 10 kg", "Golden Grain", "cat-pantry", "10 kg", "2 × 10 kg", 2, 24.99, null, 42, 28, 20, ["pantry", "staple"], "Aged basmati rice in bulk bags.", "basmati-rice"),
  p("WW-PTY-70102", "Extra virgin olive oil 1 L", "Mediterranean Grove", "cat-pantry", "1 L", "6 × 1 L", 6, 14.99, 16.99, 66, 42, 18, ["pantry"], "Cold-pressed extra virgin olive oil.", "olive-oil"),
  p("WW-PTY-70103", "Canned diced tomatoes 796 mL", "Nonna's Pantry", "cat-pantry", "796 mL", "12 × 796 mL", 12, 2.29, null, 19.2, 11.5, 40, ["pantry", "staple"], "Diced tomatoes in juice.", "diced-tomatoes"),
  p("WW-PTY-70104", "Pasta spaghetti 900 g", "Nonna's Pantry", "cat-pantry", "900 g", "12 × 900 g", 12, 2.99, null, 25.2, 14.5, 36, ["pantry", "staple"], "Durum wheat spaghetti.", "spaghetti"),
  p("WW-PTY-70105", "Peanut butter smooth 1 kg", "Trail Peak", "cat-pantry", "1 kg", "8 × 1 kg", 8, 7.99, null, 48, 30, 22, ["pantry"], "Smooth peanut butter family jar.", "peanut-butter"),
  p("WW-PTY-70106", "All-purpose flour 10 kg", "Golden Grain", "cat-pantry", "10 kg", "2 × 10 kg", 2, 12.99, null, 21, 13.5, 24, ["pantry", "staple"], "Unbleached all-purpose flour.", "flour-ap"),
  p("WW-PTY-70107", "Soy sauce 1.8 L", "East Gate", "cat-pantry", "1.8 L", "6 × 1.8 L", 6, 8.49, null, 39, 24, 16, ["pantry"], "Naturally brewed soy sauce foodservice size.", "soy-sauce"),
  p("WW-PTY-70108", "Black beans canned 540 mL", "Nonna's Pantry", "cat-pantry", "540 mL", "24 × 540 mL", 24, 1.79, null, 28.8, 16.5, 30, ["pantry"], "Canned black beans, low sodium option.", "black-beans"),
  p("WW-PTY-70109", "Maple syrup amber 500 mL", "Cabane Nord", "cat-pantry", "500 mL", "12 × 500 mL", 12, 11.99, null, 108, 72, 14, ["pantry", "canadian"], "Grade A amber maple syrup from Quebec.", "maple-syrup"),
  p("WW-PTY-70110", "Chicken broth low sodium 900 mL", "Kitchen Stock", "cat-pantry", "900 mL", "12 × 900 mL", 12, 2.99, null, 25.2, 14, 28, ["pantry"], "Low-sodium chicken broth cartons.", "chicken-broth"),
  p("WW-PTY-70111", "Honey liquid 500 g", "Bee Meadow", "cat-pantry", "500 g", "12 × 500 g", 12, 8.49, null, 72, 48, 16, ["pantry", "canadian"], "Canadian liquid clover honey.", "honey"),
  p("WW-PTY-70112", "Tomato pasta sauce 650 mL", "Nonna's Pantry", "cat-pantry", "650 mL", "12 × 650 mL", 12, 3.49, null, 30, 17.5, 32, ["pantry"], "Classic tomato basil pasta sauce.", "pasta-sauce"),
  p("WW-PTY-70113", "Quinoa white 1 kg", "Golden Grain", "cat-pantry", "1 kg", "8 × 1 kg", 8, 9.99, null, 56, 36, 14, ["pantry"], "Pre-washed white quinoa.", "quinoa", { status: "draft", visibleOnB2B: false, visibleOnMobile: false }),
  p("WW-FRZ-80101", "Frozen peas 1 kg", "Frostfield", "cat-frozen", "1 kg", "10 × 1 kg", 10, 3.99, null, 28, 16.5, 30, ["frozen", "staple"], "IQF green peas in retail bags.", "frozen-peas"),
  p("WW-FRZ-80102", "Mixed berries frozen 600 g", "Frostfield", "cat-frozen", "600 g", "8 × 600 g", 8, 6.99, null, 40, 26, 20, ["frozen"], "Strawberry, blueberry, and raspberry blend.", "frozen-berries"),
  p("WW-FRZ-80103", "Vanilla ice cream 2 L", "Harbour Creamery", "cat-frozen", "2 L", "6 × 2 L", 6, 6.49, null, 28.8, 17, 24, ["frozen", "dessert"], "Classic vanilla ice cream tubs.", "vanilla-ice-cream"),
  p("WW-FRZ-80104", "Cheese pizza 12-inch", "Stone Oven", "cat-frozen", "Each", "8 pizzas", 8, 7.99, null, 48, 30, 18, ["frozen", "meals"], "Rising-crust cheese pizza.", "cheese-pizza"),
  p("WW-FRZ-80105", "Chicken nuggets 800 g", "Prairie Protein", "cat-frozen", "800 g", "8 × 800 g", 8, 9.99, null, 56, 36, 20, ["frozen", "protein"], "Breaded chicken nuggets family pack.", "chicken-nuggets"),
  p("WW-FRZ-80106", "Frozen fries straight cut 2 kg", "Frostfield", "cat-frozen", "2 kg", "6 × 2 kg", 6, 5.99, null, 26.4, 15.5, 28, ["frozen", "staple"], "Straight-cut frozen french fries.", "frozen-fries"),
  p("WW-FRZ-80107", "Vegetable spring rolls 12-pack", "East Gate", "cat-frozen", "12-pack", "10 × 12-pack", 10, 6.49, null, 46, 28, 16, ["frozen"], "Vegetable spring rolls ready to fry or bake.", "spring-rolls"),
  p("WW-FRZ-80108", "Waffle fries 1.5 kg", "Frostfield", "cat-frozen", "1.5 kg", "8 × 1.5 kg", 8, 5.49, null, 32, 19, 22, ["frozen"], "Seasoned waffle-cut fries.", "waffle-fries"),
];
