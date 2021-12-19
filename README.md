# youtube-subs
![ytsubs](https://user-images.githubusercontent.com/85681107/146662583-2371f1f1-2e1c-4158-b55d-123f14941519.png)

A minimalist node application run in the Command Line, to get a list of the latest videos from Youtube Channels. Uses the 'puppeteer' web scraper.
### Install
Make sure you have node installed. Clone the repo and `npm install` from the main directory.
### Run
`npm run check` from the main directory.
## Inputs
User variables are configured at the top of index.js
### Subscribed Channels
```
const SUBSCRIBED = ["mkbhd", "LinusTechTips", "ESPN"]
```
Select channels to query by adding the channel name as a string to the SUBSCRIBED array.
### Number of videos
```
let TOTAL = 3
```
Select the number of latest videos you want to return, as an integer.  
NB: Max number of 30 videos. The tool will automatically adjust if you enter a higher value.
