import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const prompt = `
    Identify the object being held by the person in the image. Focus exclusively on the item in their hands; if there are multiple items, identify only one and say you cannot identify the others. Ignore all background elements.

    You must ONLY choose an item from the exact list of general merchandise items and their sub-items provided below. Do NOT name, guess, or infer any object that is NOT explicitly included in this list.

    If the object in the image does NOT match any item in the list, respond with the exact phrase:  
    "The item cannot be identified from the given categories."

    If the object matches an item in the list, respond with the exact item name only.

    ---

    General Merchandise Items:

    Groceries:  
    sachet coffee, instant coffee, powdered milk, canned sardines, canned tuna, canned corned beef, canned meat loaf, canned baked beans, canned vegetables, canned fruit cocktail, instant noodles, rice, sugar, salt, cooking oil, soy sauce, vinegar, fish sauce, peanut butter, bread, biscuits, crackers, cookies, chips, candies, chocolates, chewing gum, soft drinks, bottled water, powdered juice, energy drinks, powdered soup, canned soup, powdered spices, cooking spices, dried fish, salted eggs, fresh eggs, frozen meat, frozen fish, fresh vegetables, fresh fruits, garlic, onions, ginger, shallots, tomatoes, potatoes, carrots, green beans

    Household Supplies:  
    cooking utensils, pots, pans, frying pans, cooking knives, chopping boards, plastic containers, food storage bags, aluminum foil, cling wrap, disposable plates, disposable cups, spoons, forks, knives, glasses, mugs, bowls, plates, cooking thermometers, measuring cups, kitchen towels, dishwashing liquid, laundry soap bars, liquid detergent, fabric softener, bleach, floor cleaner, toilet cleaner, disinfectant spray, hand sanitizer, face masks, mosquito coils, mosquito nets, insect repellents, candles, lighters, flashlights, batteries (AA, AAA, C, D, 9V), extension cords, light bulbs, electric fans, rice cookers, kettles, water dispensers, plastic bags, garbage bags, brooms, dustpans, mops, cleaning cloths, scrub brushes, soap bars, bath soap, shampoo, conditioner, toothpaste, toothbrush mouthwash, deodorants, hairbrushes, combs, razors, shaving cream, nail clippers, cotton balls, bandages, ointments, paracetamol, cough syrup, vitamins, herbal medicines, baby diapers, baby wipes, baby powder, baby lotion, disposable gloves

    Clothing & Accessories:  
    slippers, sandals, socks, t-shirts, hats, tote bags, backpacks, school bags, umbrellas, raincoats, scarves, belts, sunglasses, costume jewelry, watches, wallets

    School & Office Supplies:  
    notebooks, pencils, pens, highlighters, crayons, coloring books, rulers, erasers, sharpeners, glue sticks, tape, scissors, staplers, staples, chalk, chalkboard erasers, whiteboard markers, plastic folders, envelopes, paper clips, binders, calendars, planners, flash drives, USB cables, phone chargers, headphones, power banks

    Toys & Games:  
    small toys, puzzles, playing cards, board games

    Gardening & Outdoor:  
    charcoal, barbecue sticks, cooking skewers, gardening tools, vegetable seeds, fertilizers, pesticides, pots for plants, plastic chairs, plastic stools, plastic tables

    Home & Living:  
    blankets, pillows, towels, mats, sewing machines, electric irons, mirrors, picture frames, wall clocks, plastic storage boxes, hangers, clothes pins, laundry baskets, water jugs, plastic funnels, cooking aprons, ice cube trays, baking trays, cake molds, measuring spoons, spice racks, bread boxes, food thermos, cookie jars, rolling pins, hand mixers

    ---

    Return a single item only if it is clearly and unambiguously visible and matches exactly with an item from the list. If there is any uncertainty or if the object resembles but does not perfectly match a listed item, respond with: “The item cannot be identified from the given categories.”

    If multiple items are held and one or more cannot be identified, state:  
    "I cannot identify the other item(s)."

    Strictly follow these rules. No exceptions.
    `;

const ai = new GoogleGenAI({ apiKey: "AIzaSyDqmPnLlDKnSl-NlaLFQWrkY1EOhW2Nln0" });
const base64ImageFile = fs.readFileSync("./routes/uploads/captured-1747839651016.jpeg", {
  encoding: "base64",
});

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: prompt },
];

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: contents,
});
console.log(response.text);