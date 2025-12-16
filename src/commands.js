import { update_scrapers, scrape_url } from "./stash-scrape-ci.js";
import { followUpDeferred } from "./utils.js";
import { scrapeURLEmbed } from "./embedGen.js";

export const UPDATE_SCRAPERS = {
  name: "update_scrapers",
  description: "Update all scrapers and run database migration.",
  options: [],
  execute: async ({ interaction, auth }) => {
    await update_scrapers(auth);
    return({
      type: 4,
      data: {
        content: "Scrapers updated and database migrated successfully.",
        flags: 64
      }
    });
  }
}

export const SCRAPE_URL = {
  name: "scrape_url",
  description: "Scrape a specific URL.",
  nsfw: true,
  options: [
    {
      name: "url",
      description: "The URL to scrape.",
      type: 3,
      required: true
    }, {
      name: "type",
      description: "The type of scraper to use.",
      type: 3,
      required: true,
      choices: [
        { name: "Scene", value: "scene" },
        { name: "Performer", value: "performer" },
        { name: "Group", value: "group"},
        { name: "Gallery", value: "gallery" },
        { name: "Image", value: "image" }
      ]
    }
  ],
  execute: async ({ interaction, env, wait }) => {
    const auth = env.AUTH_KEY;
    const url = interaction.data.options.find(opt => opt.name === "url").value;
    const type = interaction.data.options.find(opt => opt.name === "type").value;

    // defer response since it can take >3s
    const applicationId = interaction.application_id;
    const token = interaction.token;

    const sendScrape = async () => {
      const jobResults = await scrape_url(url, type, auth);
      const embed = scrapeURLEmbed(jobResults);
      await followUpDeferred(applicationId, token, embed)
        .then(async (result) => console.log(await result.json()))
        .catch((error) => console.error('Error sending follow-up:', error));
    }
    wait(sendScrape());
    // immediately defer, ephemeral not available
    return({ type: 5 });
  }
}