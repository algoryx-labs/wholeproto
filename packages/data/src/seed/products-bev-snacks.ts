import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

export const productSeedsBevSnacks: ProductSeed[] = [
  p("WW-BEV-50101", "Sparkling water lemon 12 × 355 mL", "Clear Spring", "cat-beverages", "12 × 355 mL", "2 × 12-packs", 2, 6.99, null, 11.2, 7, 40, ["beverage", "high-velocity"], "Lemon sparkling water multipacks.", "sparkling-lemon"),
  p("WW-BEV-50102", "Still water 24 × 500 mL", "Clear Spring", "cat-beverages", "24 × 500 mL", "1 flat", 1, 4.99, null, 4.2, 2.6, 80, ["beverage", "staple"], "Purified still water flat.", "water-24pk"),
  p("WW-BEV-50103", "Cola classic 12 × 355 mL", "Harbour Fizz", "cat-beverages", "12 × 355 mL", "2 × 12-packs", 2, 7.49, null, 12, 7.5, 50, ["beverage"], "Classic cola fridge packs.", "cola-12pk"),
  p("WW-BEV-50104", "Orange juice NFC 1.75 L", "Sunrise Press", "cat-beverages", "1.75 L", "6 × 1.75 L", 6, 5.99, null, 28.8, 18.5, 28, ["beverage", "chilled"], "Not-from-concentrate orange juice.", "oj-nfc"),
  p("WW-BEV-50105", "Iced tea peach 6 × 340 mL", "Leaf & Ice", "cat-beverages", "6 × 340 mL", "4 × 6-packs", 4, 5.49, null, 16.8, 10.5, 32, ["beverage"], "Ready-to-drink peach iced tea.", "iced-tea-peach"),
  p("WW-BEV-50106", "Cold brew coffee 1 L", "Mill Street Roasters", "cat-beverages", "1 L", "8 × 1 L", 8, 8.99, null, 56, 36, 16, ["beverage", "chilled"], "Smooth cold brew concentrate-ready bottle.", "cold-brew"),
  p("WW-BEV-50107", "Ginger ale 12 × 355 mL", "Harbour Fizz", "cat-beverages", "12 × 355 mL", "2 × 12-packs", 2, 6.99, null, 11, 6.8, 36, ["beverage"], "Crisp ginger ale multipacks.", "ginger-ale"),
  p("WW-BEV-50108", "Apple cider 1 L", "Orchard Lane", "cat-beverages", "1 L", "8 × 1 L", 8, 4.49, null, 26.4, 16, 20, ["beverage", "seasonal"], "Pressed apple cider, pasteurized.", "apple-cider"),
  p("WW-BEV-50109", "Sparkling water lime 12 × 355 mL", "Clear Spring", "cat-beverages", "12 × 355 mL", "2 × 12-packs", 2, 6.99, null, 11.2, 7, 36, ["beverage"], "Lime sparkling water multipacks.", "sparkling-lime"),
  p("WW-SNK-60101", "Sea salt kettle chips 200 g", "Crunch Ridge", "cat-snacks", "200 g", "12 × 200 g", 12, 3.99, null, 33.6, 20, 30, ["snacks"], "Kettle-cooked potato chips, sea salt.", "kettle-chips"),
  p("WW-SNK-60102", "Tortilla chips restaurant style", "Casa Norte", "cat-snacks", "400 g", "10 × 400 g", 10, 4.49, null, 32, 19.5, 28, ["snacks"], "Thick restaurant-style tortilla chips.", "tortilla-chips"),
  p("WW-SNK-60103", "Mixed nuts roasted 750 g", "Trail Peak", "cat-snacks", "750 g", "6 × 750 g", 6, 12.99, 14.99, 58.8, 40, 16, ["snacks"], "Roasted mixed nuts family jar.", "mixed-nuts"),
  p("WW-SNK-60104", "Crackers salted tops", "Biscotte", "cat-snacks", "450 g", "12 × 450 g", 12, 3.49, null, 30, 18, 26, ["snacks", "staple"], "Classic salted-top crackers.", "crackers"),
  p("WW-SNK-60105", "Dark chocolate bars 100 g", "Cocoa North", "cat-snacks", "100 g", "24 × 100 g", 24, 3.29, null, 55.2, 34, 20, ["snacks", "confectionery"], "70% cacao dark chocolate bars.", "dark-chocolate"),
  p("WW-SNK-60106", "Granola bars variety 8-pack", "Trail Peak", "cat-snacks", "8-pack", "12 × 8-pack", 12, 5.49, null, 48, 30, 24, ["snacks"], "Chewy granola bar variety box.", "granola-bars"),
  p("WW-SNK-60107", "Popcorn microwave butter", "Crunch Ridge", "cat-snacks", "6-pack", "8 × 6-pack", 8, 4.99, null, 28.8, 17, 22, ["snacks"], "Butter-flavour microwave popcorn.", "microwave-popcorn"),
  p("WW-SNK-60108", "Pretzel sticks 400 g", "Biscotte", "cat-snacks", "400 g", "12 × 400 g", 12, 3.29, null, 28.8, 17.5, 24, ["snacks"], "Classic pretzel sticks bag.", "pretzel-sticks"),
  p("WW-SNK-60109", "Rice crackers seaweed", "East Gate", "cat-snacks", "150 g", "16 × 150 g", 16, 3.79, null, 42, 24, 18, ["snacks"], "Light seaweed rice crackers.", "rice-crackers", { status: "archived", visibleOnB2B: false, visibleOnMobile: false }),
];
