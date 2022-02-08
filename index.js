const axios = require("axios").default;

// 1.USER INPUTS
// Copy your Youtube Data API key from Google Cloud and save in .env
const { API_KEY } = require("./.env");

// Add channel ID's to this array to query
const SUBSCRIBED = [
  "UCBJycsmduvYEL83R_U4JriQ",
  "UCXuqSBlHAE6Xw-yeJA0Tunw",
  "UC0VVYtw21rg2cokUystu2Dw",
  "UC0KfjyvabuE2J-RBC6ko2Lw",
  "UCzJjUHizQfPYywqt1mSEMww",
  "UCoOae5nYA7VqaXzerajD0lg",
  "UCV0qA-eDDICsRR9rPcnG7tw",
  "UCWf43GShTqMDdJN9pICYd2Q",
];

// Select number of latest videos to return
// Must be integer between 0 and 50
let TOTALVIDS = 3;

// Validate TOTALVIDS input
if (TOTALVIDS < 1) {
  TOTALVIDS = 1;
}
if (TOTALVIDS > 50) {
  TOTALVIDS = 50;
}

// 2.FUNCTION SETUP
// Query Youtube API with channel ID
// Get uploads playlist ID and channel name
const getUploadPlaylist = async (channelID) => {
  const channelURL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&part=contentDetails&id=${channelID}&key=${API_KEY}`;
  const result = await axios.get(channelURL);
  const playlistID =
    result.data.items[0].contentDetails.relatedPlaylists.uploads;
  const channelName = result.data.items[0].snippet.title;
  return [playlistID, channelName];
};

// Query Youtube API with uploads playlist ID
// Get latest videos IDs
const getLatestVids = async (playlistID) => {
  const playlistURL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistID}&maxResults=${TOTALVIDS}&key=${API_KEY}`;
  const result = await axios.get(playlistURL);
  const latestVids = result.data.items;
  return latestVids;
};

// Query Youtube API with array of latest video IDs
// Get latest video info
const extractVids = async (vidsArray) => {
  return new Promise(async (resolve) => {
    const newArray = [];
    let counter = 0;
    await vidsArray.forEach(async (vid) => {
      const vidID = vid.contentDetails.videoId;
      const vidURL = `https://youtube.googleapis.com/youtube/v3/videos?part=player&part=contentDetails&part=snippet&id=${vidID}&key=${API_KEY}`;
      const result = await axios.get(vidURL);
      counter++;
      const resultObject = result.data.items[0];
      const vidObject = resultObject.snippet;
      const timeObject = new Date(vidObject.publishedAt);
      const id = resultObject.id;
      newArray.push({
        title: vidObject.title,
        published: timeObject,
        url: `https://www.youtube.com/watch?v=${id}`,
      });
      if (counter === vidsArray.length) {
        newArray.sort((a, b) => {
          return b.published - a.published;
        });
        resolve(newArray);
      }
    });
  });
};

// 3. SCRIPT COMBINE + CALL
const factoryFunction = async () => {
  for (let i = 0; i < SUBSCRIBED.length; i++) {
    try {
      console.log(`Retrieving ${SUBSCRIBED[i]}...`);
      // Query chain, request API data from channel id
      const [playlistID, channelName] = await getUploadPlaylist(SUBSCRIBED[i]);
      const playlistVids = await getLatestVids(playlistID);
      const vidInfo = await extractVids(playlistVids);
      // Normalize time objects into UTC strings
      for (vid of vidInfo) {
        vid.published = vid.published.toUTCString();
      }
      // Log channelname, videoname, published, and url
      console.log(`Channel: ${channelName}`);
      console.log(vidInfo);
      console.log(`\n`);
    } catch (err) {
      console.error(err.message);
    } finally {
      continue;
    }
  }
};

factoryFunction();
