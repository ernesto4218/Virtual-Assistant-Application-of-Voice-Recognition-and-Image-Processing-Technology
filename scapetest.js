import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeAndModify(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(html);

  // ✅ Change the text of the <span id="app-name">
  $("#app-name").text("Ernesto's Machine");

  console.log($.html());
}

scrapeAndModify("https://teachablemachine.withgoogle.com/train/image");
