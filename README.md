# nHentai.JS

nHentai.JS is a JavaScript library for interacting with nHentai.net

## Installation

Use the Node Package Manager ([npm](https://www.npmjs.com/)) to install nHentai.JS.

```bash
npm install @v0idpointer/nhentai.js
```
## Features
- Search Doujins using an ID.
- Search for Doujins using tags, characters, artists, parodies, etc.
- JSDoc.

## Usage
The following example shows how to retrieve a Doujin using an ID, commonly known as a "sauce code":

```javascript
const nHentai = require("@v0idpointer/nhentai.js");

nHentai.GetDoujin(297974).then(doujin => {
    let title = doujin.GetEnglishTitle(); // Gets the English title of the Doujin.
    let pages = doujin.GetPageCount(); // Gets the amount of pages.
    let cover = doujin.GetCover(); // Gets the URL to the cover image.
    let page7 = doujin.GetPage(7); // Gets the URL to the 7th page.
});

```
The following shows how to search for Doujins that match specified tags:
```javascript
const nHentai = require("@v0idpointer/nhentai.js");

var search = nHentai.BeginSearch(); // Creates a new search object.
search.GetTag("catgirl").then(tag => { // Get a Tag object using a name.
    // 'doujins' is an array containing all Doujins that match the specified tag(s).
    search.SearchByTags(tag).then(doujins => {
        for(let i = 0; i < doujins.length; i++)
            console.log(doujins[i].GetStylizedTitle()); // Print Doujin titles.
    });
});
```
Here's another example showing how to search with tags. In this case, the code is searching for a character:
```javascript
const nHentai = require("@v0idpointer/nhentai.js");

var search = nHentai.BeginSearch(); // Creates a new search object.

// Get a character Tag object using a name.
search.GetTag("origami tobiichi", nHentai.TagType.CHARACTER).then(tag => {
    // 'doujins' is an array containing all Doujins that match the specified tag(s).
    search.SearchByTags(tag).then(doujins => {
        for(let i = 0; i < doujins.length; i++)
            console.log(doujins[i].GetStylizedTitle()); // Print Doujin titles.
    });
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)