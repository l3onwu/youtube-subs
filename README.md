# youtube-subs

A minimalist node application run in the Command Line, to get a list of the latest videos from YouTube Channels. The script queries the Youtube Data API (https://developers.google.com/youtube/v3)

### Change log
Version 1 used the puppeteer web scraper to create headless chrome instances and scrape the html of youtube channels. However, it seems that YouTube added some protection to prevent scraping which led to inconsistent html responses. Version 2 uses YouTube's official API to query channel info.

## Usage

### Install
Make sure you have node installed. Clone the repo and `npm install` from the main directory.
### Run
`npm run check` from the main directory.
## Inputs
User variables are configured at the top of index.js
### API Key
```
const API_KEY = xxx
```
You will need to get an API key from Google to allow the script to use the YouTube API. Instructions can be found here https://developers.google.com/youtube/v3/getting-started

Put the API key inside of a .env file in the root directory, and gitignore .env to prevent accidentally exposing your key on Github. 
### Subscribed Channels
```
const SUBSCRIBED = ["UCBJycsmduvYEL83R_U4JriQ", "UCXuqSBlHAE6Xw-yeJA0Tunw", "UC0VVYtw21rg2cokUystu2Dw"]
```
Select channels to query by adding the channel id as a string to the SUBSCRIBED array.

Unfortunately YouTube does not make channel ID's readily available, but expects them for queries to their API. There doesn't seem to be a foolproof way to get a channel's ID, but you can usually get it using https://commentpicker.com/youtube-channel-id.php or the great work from stvar at https://gist.github.com/stvar/f57e9792c3dc49fab2690247d6ee74de#file-youtube-search-py

### Number of videos
```
let TOTALVIDS = 3
```
Select the number of latest videos you want to return, as an integer.  
NB: Max number of 50 videos. The tool will automatically adjust if you enter a higher value.
