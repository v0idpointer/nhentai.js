const https = require("https");
const Doujin = require("./doujin.js");
const Tag = require("./tag.js").Tag;
const TagType = require("./tag.js").TagType;

/**
* This class is used internally for retrieving information
* from nhentai.net
*/
module.exports = class API {

    /**
     * Retrieves Doujin information from nhentai.net
     * @param {number|string} id - Doujin ID on nhentai.net . Ex: https://nhentai.net/g/297974 where 297974 is the ID.
     * @returns {Promise<JSON>}
     */
    static Fetch(id) {
        return new Promise( (resolve) => {
            https.get("https://nhentai.net/api/gallery/" + id, (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    let json = JSON.parse(body);
                    resolve(json);
                });

            });
        } );
    }

    /**
     * Retrieves an image format based on a type specified in JSON retrieved
     * from nhentai.net/api/gallery ...
     * @param {string} x Image type character ("j" for JPG, "p" for PNG, etc.)
     */
    static GetImageFormat(x) {
        switch(x) {
            case 'j': case 'jpg': case 'jpeg':
                return 'jpg';
            case 'p': case 'png':
                return 'png';
            default:
                return "jpg"; // kinda stupid solution, but it's fine, because most of doujin media is in JPG format.
        }  
    }

    /**
     * @param {string|number} mediaId 
     * @param {string} imageType 
     * @returns {string} URL to the Doujin cover art.
     */
    static GetDoujinArtURL(mediaId, imageType) {
        return "https://t.nhentai.net/galleries/" + mediaId + "/cover." + this.GetImageFormat(imageType);
    }

    /**
     * @param {number|string} mediaId 
     * @param {number|string} page 
     * @param {string} imageType
     * @returns {string} URL to the desired Doujin page.
     */
    static GetDoujinPageURL(mediaId, page, imageType) {
        return "https://i.nhentai.net/galleries/" + mediaId + "/" + page + "." + this.GetImageFormat(imageType);
    }

    /**
     * Gets all tags from a Doujin.
     * @param {JSON} json 
     * @returns {Array<Tag>}
     */
    static GetDoujinTags(json) {
        let count = json.tags.length;
        let arr = [];
        for(let i = 0; i < count; i++) {
            let tag = API.ToTag(json.tags[i]);
            arr.push(tag);
        }
        return arr;
    }

    /**
     * Converts a JSON representation of a nhentai.net tag to a Tag class.
     * @param {JSON} json
     * @returns {Tag} 
     */
    static ToTag(json) {
        return new Tag(TagType.valueOf(json.type), json.id, json.name, json.url, json.count);
    }

    /**
     * Creates a valid nhentai.net Tag URL.
     * @param {string} name 
     * @param {TagType} type 
     * @returns {string}
     */
    static ToTagURL(name, type) {
        let nameFormatted = (name.toLowerCase()).split(" ").join("-");
        return "/" + type.valueOf(type) + "/" + nameFormatted + "/";
    }

    /**
     * Returns a Tag ID based on the Tag name.
     * @param {string} tagName Internal nhentai.net Tag URL. Generate a URL using API.ToTagURL() function.
     * @returns {Promise<Number>} A promise to a Number object containing the ID.
     */
    static GetTagIDByName(tagName) {
        return new Promise( (resolve) => {
            
            https.get("https://nhentai.net/" + tagName, (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    let m = body.search('<a href="' + tagName + '"');
                    let c = body.substring(m);
                    let d = c.split(">")[0] + ">";
                    let cx = d.search("class=");
                    let tx = ((d.substring(cx)).replace("class=\"tag tag-", "")).replace(" \">", "");
                    let id = Number(tx);
                    return resolve(id);
                });

            });

        } );
    }

    /**
     * Returns a Tag based on a Tag name.
     * @param {string} tagName Internal nhentai.net Tag URL. Generate a URL using API.ToTagURL() function.
     * @returns {Promise<Tag>} A promise to a Tag object.
     */
    static GetTagByName(tagName) {
        return new Promise( (resolve) => {

            https.get("https://nhentai.net/" + tagName, (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    let m = body.search('<a href="' + tagName + '"');
                    let c = body.substring(m);
                    let d = c.split(">")[0] + ">";
                    let cx = d.search("class=");
                    let tx = ((d.substring(cx)).replace("class=\"tag tag-", "")).replace(" \">", "");
                    let id = Number(tx);
                    
                    https.get("https://nhentai.net/api/galleries/tagged?tag_id=" + String(id), (r) => {
                        let rb = "";

                        r.on("data", (ch) => {
                            rb += ch;
                        });

                        r.on("end", () => {
                            let json = JSON.parse(rb);

                            if(json.result == undefined || json.result == null) {
                                let m = new Tag(TagType.UNDEFINED);
                                resolve(m);
                                return;
                            }
                            let entry = json.result[0];

                            let tagCount = entry.tags.length;
                            let finalTag = null;

                            for(let ii = 0; ii < tagCount; ii++) {
                                let temp = entry.tags[ii];
                                if(temp.id === id) finalTag = temp;
                            }

                            let m = new Tag(TagType.valueOf(finalTag.type), finalTag.id, finalTag.name, finalTag.url, finalTag.count);
                            resolve(m);
                        });

                    });

                });

            });

        } );
    }

    /**
     * Returns all Doujins that match the specific criteria (Tags and page offsets).
     * @param {Tag[]} tags 
     * @returns {Promise<Doujin[]>}
     */
    static GetTagRelated(tags, offset = 1) {
        return new Promise( (resolve) => {

            let arr = [];

            if(Array.isArray(tags) == false) {
                tags = [tags];
            }

            https.get("https://nhentai.net/api/galleries/tagged?tag_id=" + String(tags[0].id) + "&page=" + Number(offset), (res) => { 
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    
                    let json = JSON.parse(body);
                    if(json.result == null || json.result == undefined) {
                        resolve(null);
                        return;
                    }

                    for(let index = 0; index < json.result.length; index++) {
                        let doujinJson = json.result[index];
                        
                        let match = true;
                        let rq = [];
                        for(let ti = 0; ti < doujinJson.tags.length; ti++) {
                            rq.push(doujinJson.tags[ti].url);
                        }
                        for(let ri = 0; ri < tags.length; ri++) {
                            if(!(rq.includes(tags[ri].url))) match = false;
                        }

                        if(match) {
                            const nHentai = require("./index.js");
                            let d = new nHentai.Doujin(doujinJson);
                            arr.push(d);
                        }
                    }

                    resolve(arr);
                }); 

            } );

        } );
    }

    /**
     * Returns the amount of pages that exist for a specific Tag.
     * @param {Tag} tag 
     * @returns {Promise<Number>}
     */
    static GetRelatedTagPageCount(tag) {
        return new Promise( (resolve) => {

            https.get("https://nhentai.net/api/galleries/tagged?tag_id=" + String(tag.id), (res) => {

                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    let json = JSON.parse(body);
                    let c = json.num_pages;
                    resolve(Number(c));
                });

            } );

        } );
    }

}