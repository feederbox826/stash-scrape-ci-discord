const embedContent = (scrapeResult) => ({
  "content": `Results: [${scrapeResult.jobId}](https://scrape.feederbox.cc/${scrapeResult.runnerInfo.scrapeType}?id=${scrapeResult.jobId})`,
})

export const scrapeURLEmbed = (scrapeResult) => {
  const scrapeType = scrapeResult.runnerInfo.scrapeType;
  switch (scrapeType) {
    case "scene":
      return sceneEmbed(scrapeResult);
    case "group":
      return groupEmbed(scrapeResult);
    case "performer":
      return performerEmbed(scrapeResult);
    case "gallery":
      return galleryEmbed(scrapeResult);
    case "image":
      return imageEmbed(scrapeResult);
    default:
      return { content: `Results: [${scrapeResult.jobId}](https://scrape.feederbox.cc/${scrapeType}?id=${scrapeResult.jobId})` };
  }
}

const sceneEmbed = (scrapeResult) => ({
  ...embedContent(scrapeResult),
  "embeds": [{
      "author": {
        "name": scrapeResult.result.studio
      },
      "title": scrapeResult.result.title,
      "description": scrapeResult.result.details || "No description available.",
      "fields": [{
          "name": "Performers",
          "value": scrapeResult.result.performers.join(", ") || "N/A",
          "inline": false
        }, {
          "name": "Date",
          "value": scrapeResult.result.date
        }, {
          "name": "URL",
          "value": scrapeResult.result.urls ? scrapeResult.result.urls.join(", ") : "N/A",
          "inline": false
        }],
      "timestamp": scrapeResult.runnerInfo.date,
      "footer": {
        "text": `stash ${scrapeResult.stashInfo.version.version}`
      },
      "color": 9499119
    }
  ]
})

const groupEmbed = (scrapeResult) => ({
  ...embedContent(scrapeResult),
  "embeds": [{
    "author": { "name": scrapeResult.result.studio },
    "title": scrapeResult.result.name,
    "description": scrapeResult.result.synopsis || "No synopsis available.",
    "fields": [{
        "name": "Duration",
        "value": scrapeResult.result.duration || "N/A",
        "inline": true
      }, {
        "name": "Date",
        "value": scrapeResult.result.date,
        "inline": true
      }, {
        "name": "Director",
        "value": scrapeResult.result.director || "N/A",
        "inline": true
      }, {
        "name": "URL",
        "value": scrapeResult.result.urls ? scrapeResult.result.urls.join(", ") : "N/A",
      }
    ],
    "timestamp": scrapeResult.runnerInfo.date,
    "footer": { "text": `stash ${scrapeResult.stashInfo.version.version}` },
    "color": 16773023
  }]
})

const performerEmbed = (scrapeResult) => ({
  ...embedContent(scrapeResult),
  "embeds": [{
    "title": scrapeResult.result.name,
    "fields": [{
        "name": "Aliases",
        "value": scrapeResult.result.aliases || "N/A",
      }, {
        "name": "Birthdate",
        "value": scrapeResult.result.birthdate || "N/A",
        "inline": true
      }, {
        "name": "Career Length",
        "value": scrapeResult.result.career_length || "N/A",
        "inline": true
      }, {
        "name": "URL",
        "value": scrapeResult.result.urls ? scrapeResult.result.urls.join(", ") : "N/A",
      }
    ],
    "timestamp": scrapeResult.runnerInfo.date,
    "footer": { "text": `stash ${scrapeResult.stashInfo.version.version}`},
    "color": 16766688
  }]
})


const galleryEmbed = (scrapeResult) => ({
  ...embedContent(scrapeResult),
  "embeds": [{
    "author": { "name": scrapeResult.result.studio },
    "title": scrapeResult.result.title,
    "description": scrapeResult.result.details || "No details available.",
    "fields": [{
      "name": "Performers",
      "value": scrapeResult.result.performers.join(", ") || "N/A",
    }, {
      "name": "Date",
      "value": scrapeResult.result.date
    }, {
      "name": "URL",
      "value": scrapeResult.result.urls ? scrapeResult.result.urls.join(", ") : "N/A",
    }],
    "timestamp": scrapeResult.runnerInfo.date,
    "footer": { "text": `stash ${scrapeResult.stashInfo.version.version}` },
    "color": 12712868
  }]
})

const imageEmbed = (scrapeResult) => ({
  ...embedContent(scrapeResult),
  "embeds": [{
    "author": { "name": scrapeResult.result.studio},
    "title": scrapeResult.result.title,
    "description": scrapeResult.result.details || "No details available.",
    "fields": [{
      "name": "Performers",
      "value": scrapeResult.result.performers.join(", ") || "N/A",
      "inline": false
    }, {
      "name": "Date",
      "value": scrapeResult.result.date
    }, {
      "name": "URL",
      "value": scrapeResult.result.urls ? scrapeResult.result.urls.join(", ") : "N/A",
      "inline": false
    }],
    "timestamp": scrapeResult.runnerInfo.date,
    "footer": {
      "text": `stash ${scrapeResult.stashInfo.version.version}`
    },
    "color": 8122792
  }]
})