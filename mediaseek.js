const API = require("./api.js");
const Tag = require("./tag.js").Tag;
const TagType = require("./tag.js").TagType;

/**
 * MediaSeeking is a class created for searching
 * different content on nhentai.net
 */
module.exports = class MediaSeeking {

    constructor() { }

    /**
     * Get a Tag based on the name and type.
     * @param {string} name - Tag name is the name of the tag, as found on nhentai.net website.
     * @param {TagType} type - Tag type describes what the Tag is about, such as, is it an artist tag, or a language tag...
     * @returns {Promise<Tag>} A Promise to a Tag object.
     */
    GetTag(name, type = TagType.TAG) {
        let url = API.ToTagURL(name, type);
        return API.GetTagByName(url);
    }

    /**
     * Returns up to 100 Doujins that match the specified Tags.
     * @param {Tag|Tag[]} tags - A Tag or a Tag array.
     * @returns {Promise<Doujin[]>} A Promise to a Doujin array.
     */
    SearchByTags(tags) {
        if(!Array.isArray(tags)) tags = [tags];
        return new Promise( (resolve) => {
            // Get the maximum page count.
            API.GetRelatedTagPageCount(tags[0]).then(pages => {

                let pageArr = [];
                if(pages > 4) {
                    for(let i = 0; i < 4; i++) {
                        let n = Math.floor(Math.random() * Math.floor(pages));
                        if(!pageArr.includes(n)) pageArr.push(n);
                    }
                }else{
                    for(let i = 0; i < pages; i++) pageArr.push(i+1);
                }

                let promises = pageArr.map( (page) => API.GetTagRelated(tags, page) );

                Promise.all(promises).then( (data) => {
                    let arr = [];

                    for(let xx = 0; xx < data.length; xx++) {
                        for(let yy = 0; yy < data[xx].length; yy++) {
                            arr.push(data[xx][yy]);
                        }
                    }

                    resolve(arr);
                } );

            });
        } );
    }

    /**
     * Searches multiple times for Doujins that match the specified Tags.
     * For complex searches, you might need to search multiple times. After
     * a specified amount (4 retries by default), the function will return
     * an empty array, if no matches have been found. Note: making too many
     * requests might crash the program, or cause unexpected behaviour.
     * A crash might occur if the "too many requests" error is not
     * parsed properly.
     * @param {Tag|Tag[]} tags - A Tag or a Tag array.
     * @param {number} maxRetry - Maximum amount of search retries. Default value: 3
     * @returns {Promise<Doujin>} A Promise to a Doujin array.
     */
    SearchByTagsEx(tags, maxRetry = 3) {
        return new Promise( (resolve) => {

            var promise = ( function continueSearch(times) {
                if(times > maxRetry) {
                    resolve([]);
                    return;
                }
                const nHentai = require("./index.js");
                nHentai.BeginSearch().SearchByTags(tags).then(promise => {
                    if(promise == undefined || promise.length == 0) continueSearch(times + 1);
                    else resolve(promise);
                });
            }(0) );

        } );
    }

};