const puppeteer = require("puppeteer");

// USER INPUTS
// Add the channel names you would like to check to this array
const SUBSCRIBED = [
  "mkbhd",
  "LinusTechTips",
  "macaddress",
  "Smallant",
  "Oliur",
  "aliabdaal",
  "jomaoppa",
  "marselaaa",
  "YeahRussia",
];

// Select the number of latest videos per channel you would like to display
// NOTE: Must be an integer between 1 and 30
let VIDEOCOUNT = 3;

// FUNCTION
const scrapeAll = async () => {
  if (!SUBSCRIBED[0]) {
    console.log("No subscribed channels");
    return;
  }
  if (VIDEOCOUNT > 30) {
    console.log("Adjusted video count to 30 (max)...");
    VIDEOCOUNT = 30;
  }
  if (VIDEOCOUNT < 1) {
    console.log("Adjusted video count to 1 (min)...");
    VIDEOCOUNT = 1;
  }
  console.log(`Collecting latest ${VIDEOCOUNT} videos for ${SUBSCRIBED}...`);
  // Launch browser and loop channels
  const browser = await puppeteer.launch({ headless: true });
  videoloop: for (let i = 0; i < SUBSCRIBED.length; i++) {
    console.log(`Scraping ${SUBSCRIBED[i]}...`);
    try {
      // Launch individual channel
      const page = await browser.newPage();
      await page.goto(`https://www.youtube.com/c/${SUBSCRIBED[i]}/videos`);
      const result = await page.evaluate((count) => {
        let channelName = document.querySelector(
          "yt-formatted-string.ytd-channel-name"
        ).innerHTML;
        let videoData = [];
        // Loop through each video, collect data
        for (let j = 1; j < count + 1; j++) {
          const title = document.querySelector(
            "ytd-grid-video-renderer.style-scope:nth-child(" +
              j +
              ") #video-title"
          ).innerHTML;
          const views = document.querySelector(
            "ytd-grid-video-renderer.style-scope:nth-child(" +
              j +
              ") #metadata-line > span:nth-child(1)"
          ).innerHTML;
          const date = document.querySelector(
            "ytd-grid-video-renderer.style-scope:nth-child(" +
              j +
              ") #metadata-line > span:nth-child(2)"
          ).innerHTML;
          // Push video data
          videoData.push({ title, views, date });
        }
        return { channelName, videoData };
      }, VIDEOCOUNT);
      const channelResult = {
        channel: result["channelName"],
        latest_videos: result["videoData"],
      };
      console.log("Done");
      console.log(channelResult);
    } catch (error) {
      console.log(`Error - ${error.message}`);
    } finally {
      continue videoloop;
    }
  }
  console.log("Scraping complete");
  browser.close();
};

scrapeAll();
