const BASE_URL = "https://scrape.feederbox.cc/api"

export const update_scrapers = (auth) => fetch(`${BASE_URL}/update`, {
  method: "POST",
  body: JSON.stringify({ auth })
})

export const scrape_url = (url, scrapeType, auth) => fetch(`${BASE_URL}/scrape`, {
  method: "POST",
  body: JSON.stringify({ url, scrapeType, auth })
}).then(res => res.json())