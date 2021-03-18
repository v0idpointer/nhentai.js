const Doujin = require("./doujin.js");
const API = require("./api.js");
const Tag = require("./tag.js");
const MediaSeeking = require("./mediaseek.js");

/**
 * Retrieves a Doujin from nhentai.net using an ID, known commonly as "sauce code".
 * @param {number|string} id - Doujin ID on nhentai.net . Ex: https://nhentai.net/g/297974 where 297974 is the ID.
 * @returns {Promise<Doujin>} Promise to Doujin object.
 */
function GetDoujin(id) {
    return new Promise((resolve) => {
        API.Fetch(id).then(json => {
            API.GetDoujinTags(json);
            let doujin = new Doujin(json);
            resolve(doujin);
        });
    });
}

/**
 * Retrieves the author, or authors, of the specified Doujin.
 * This function is designed for easier retrieval of Doujin authors.
 * @param {Doujin} doujin Doujin object.
 * @returns {String|String[]} String if there is only one author, or a String array if there are multiple authors.
 */
function GetDoujinAuthor(doujin) {
    let authorTags = doujin.GetTagByType(Tag.TagType.ARTIST);
    let arr = [];
    for(let i = 0; i < authorTags.length; i++) {
        arr.push(authorTags[i].name);
    }
    if(arr.length == 1) return arr[0];
    else return arr;
}

module.exports = {
    Doujin: Doujin,
    API: API,
    Tag: Tag.Tag,
    TagType: Tag.TagType,
    MediaSeeking: MediaSeeking,

    GetDoujin: GetDoujin,
    GetDoujinAuthor: GetDoujinAuthor,

    /**
     * Creates a new MediaSeeking object.
     * @returns {MediaSeeking} MediaSeeking object
     */
    BeginSearch: () => {
        return new MediaSeeking();
    }
};