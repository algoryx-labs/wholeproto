import { p } from "./product-compact";
import type { ProductSeed } from "./product-builder";

/** Fresh produce + dairy essentials from wholesalecalgary.ca */
export const productSeedsProduceDairy: ProductSeed[] = [
  p("CW-PRD-3003", "Roma Tomatoes 30lb", "Wholesale Calgary", "cat-produce", "30 lb case", "1 × 30 lb", 1, 34.99, 39.99, 34.99, 22, 20, ["fresh", "featured", "high-velocity"], "Firm Roma tomatoes in a 30 lb wholesale case for kitchens and retailers.", "roma-tomatoes-30lb"),
  p("CW-PRD-0374", "Red Onion 5lb", "Wholesale Calgary", "cat-produce", "5 lb bag", "1 × 5 lb", 1, 6.49, null, 6.49, 3.8, 40, ["fresh", "staple"], "Red onions packed in 5 lb bags for foodservice prep.", "red-onion-5lb"),
  p("CW-PRD-0231", "Yellow Onion 50lbs", "Wholesale Calgary", "cat-produce", "50 lb bag", "1 × 50 lb", 1, 28.99, null, 28.99, 18, 25, ["fresh", "staple"], "Bulk yellow cooking onions in a 50 lb sack.", "yellow-onion-50lb"),
  p("CW-PRD-0356", "Russet Potato 50lb", "Wholesale Calgary", "cat-produce", "50 lb bag", "1 × 50 lb", 1, 32.99, null, 32.99, 20, 20, ["fresh", "staple"], "Russet potatoes in a 50 lb wholesale bag.", "russet-potato-50lb"),
  p("CW-PRD-0374A", "Potatoes 10lb", "Wholesale Calgary", "cat-produce", "10 lb bag", "1 × 10 lb", 1, 8.99, null, 8.99, 5.2, 30, ["fresh"], "All-purpose potatoes in a 10 lb bag.", "potatoes-10lb"),
  p("CW-PRD-0362", "Peeled Garlic 5lb×4", "Wholesale Calgary", "cat-produce", "5 lb × 4", "4 × 5 lb", 4, 48.99, null, 48.99, 32, 16, ["fresh", "prep-ready"], "Peeled garlic packs — 4 × 5 lb for high-volume kitchens.", "peeled-garlic"),
  p("CW-PRD-0269", "Ginger 30lbs", "Wholesale Calgary", "cat-produce", "30 lb case", "1 × 30 lb", 1, 54.99, null, 54.99, 36, 18, ["fresh"], "Fresh ginger root in a 30 lb wholesale case.", "ginger-30lb"),
  p("CW-PRD-0241", "Green Pepper 25lb", "Wholesale Calgary", "cat-produce", "25 lb case", "1 × 25 lb", 1, 42.99, null, 42.99, 28, 18, ["fresh"], "Green bell peppers packed for foodservice.", "green-pepper-25lb"),
  p("CW-PRD-0552", "Red Pepper 11lb", "Wholesale Calgary", "cat-produce", "11 lb case", "1 × 11 lb", 1, 29.99, null, 29.99, 19, 16, ["fresh"], "Sweet red peppers in an 11 lb case.", "red-pepper-11lb"),
  p("CW-PRD-3098", "Thai Chili 30lb", "Wholesale Calgary", "cat-produce", "30 lb case", "1 × 30 lb", 1, 68.99, null, 68.99, 45, 12, ["fresh", "hot"], "Hot Thai chillies in a 30 lb wholesale case.", "thai-chili-30lb"),
  p("CW-PRD-3098A", "Achari Long Chilli Lb", "Wholesale Calgary", "cat-produce", "1 lb", "1 × 1 lb", 1, 4.99, null, 4.99, 2.8, 24, ["fresh", "hot"], "Achari-style long chillies sold by the pound.", "achari-long-chilli"),
  p("CW-PRD-0375", "Cabbage Green 1lb", "Wholesale Calgary", "cat-produce", "1 lb", "1 × 1 lb", 1, 1.79, null, 1.79, 0.9, 40, ["fresh"], "Fresh green cabbage by the pound.", "cabbage-green"),
  p("CW-PRD-0375A", "Jhad Karela 1lb", "Wholesale Calgary", "cat-produce", "1 lb", "1 × 1 lb", 1, 3.49, null, 3.49, 2, 20, ["fresh", "south-asian"], "Jhad (scrubbed) bitter melon / karela by the pound.", "jhad-karela"),
  p("CW-PRD-0375B", "Karela 1lb", "Wholesale Calgary", "cat-produce", "1 lb", "1 × 1 lb", 1, 2.99, null, 2.99, 1.7, 20, ["fresh", "south-asian"], "Fresh karela (bitter melon) by the pound.", "karela"),
  p("CW-PRD-0545", "Green Onion 48'", "Wholesale Calgary", "cat-produce", "48 bunch", "1 × 48'", 1, 24.99, null, 24.99, 15, 16, ["fresh", "herbs"], "Green onion bunches — 48 count wholesale pack.", "green-onion-48"),
  p("CW-PRD-0988", "Cilantro 60'", "Wholesale Calgary", "cat-produce", "60 bunch", "1 × 60'", 1, 29.99, null, 29.99, 18, 16, ["fresh", "herbs"], "Fresh cilantro bunches — 60 count case.", "cilantro-60"),
  p("CW-PRD-0467", "Fresh Mint 60'", "Wholesale Calgary", "cat-produce", "60 bunch", "1 × 60'", 1, 32.99, null, 32.99, 20, 14, ["fresh", "herbs"], "Fresh mint bunches — 60 count wholesale pack.", "fresh-mint-60"),
  p("CW-DRY-8801", "Boondi Plain 1kg", "Riwayat", "cat-dairy", "1 kg", "10 × 1 kg", 10, 8.99, null, 72, 48, 18, ["dairy-aisle", "south-asian"], "Plain boondi for raita and chaat prep.", "boondi-plain"),
  p("CW-DRY-8802", "Semolina / Sooji 4lb", "Riwayat", "cat-dairy", "4 lb", "6 × 4 lb", 6, 7.49, null, 36, 22, 20, ["staple", "south-asian"], "Fine semolina (sooji) for halwa and upma.", "semolina-4lb"),
  p("CW-DRY-8803", "Skim Milk Powder 2kg", "Riwayat", "cat-dairy", "2 kg", "6 × 2 kg", 6, 18.99, null, 96, 64, 16, ["dairy", "baking"], "Skim milk powder for sweets and baking.", "skim-milk-powder"),
  p("CW-DRY-8804", "Whole Milk Powder 2kg", "Riwayat", "cat-dairy", "2 kg", "6 × 2 kg", 6, 21.99, null, 108, 72, 14, ["dairy", "baking"], "Whole milk powder for mithai and kitchen use.", "whole-milk-powder"),
  p("CW-DRY-8805", "Savera Ghee Clarified Butter 1.6kg", "Savera", "cat-dairy", "1.6 kg / 3.5 lb", "6 × 1.6 kg", 6, 24.99, 27.99, 126, 88, 16, ["dairy", "featured"], "Clarified butter (ghee) in a 1.6 kg foodservice tub.", "savera-ghee"),
];
