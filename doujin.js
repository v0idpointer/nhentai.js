const API = require("./api.js");
const Tag = require("./tag").Tag;
const TagType = require("./tag.js").TagType;

/**
 * This class represents a Doujin from nhentai.net
 */
module.exports = class Doujin {

    constructor(json) {
        if(json == undefined) return;

        this.id = json.id;
        this.mediaId = json.media_id;
        this.title = {
            english: json.title.english,
            japanese: json.title.japanese,
            stylized: json.title.pretty
        };
        this.pageCount = json.num_pages;
        this.likes = json.num_favorites;

        this.media = { }
        this.media.cover = {
            type: json.images.cover.t
        }
        this.media.pages = { };
        for(let i = 1; i < Number(json.num_pages); i++) {
            this.media.pages[i] = {
                type: json.images.pages[i].t
            }
        }

        this.tags = API.GetDoujinTags(json);
        this.tagCount = this.tags.length;
    }

    /**
     * Retrieves the Doujin ID on nhentai.net
     * IDs are commonly known as "sauce codes", or six-digit codes.
     * @returns {number|string}
     */
    GetID() {
        return this.id;
    }

    /**
     * Retrieves the internal Media ID.
     * This ID is used to retrive all media (pages, image covers, etc.)
     * related to this Doujin.
     * @returns {number|string}
     */
    GetMediaID() {
        return this.mediaId;
    }

    /**
     * Retrieves the title of this Doujin in English.
     * @returns {string}
     */
    GetEnglishTitle() {
        return this.title.english;
    }

    /**
     * Retrieves the title of this Doujin in Japanese.
     * @returns {string}
     */
    GetJapaneseTitle() {
        return this.title.japanese;
    }

    /**
     * Retrieves the title of this Doujin.
     * @returns {string}
     */
    GetStylizedTitle() {
        return this.title.stylized;
    }

    /**
     * Retrieves the total amount of pages.
     * @returns {number|string}
     */
    GetPageCount() {
        return this.pageCount;
    }

    /**
     * Retrieves the total amount of likes.
     * @returns {number|string}
     */
    GetLikes() {
        return this.likes;
    }

    /**
     * Retrieves the URL of the Doujin cover.
     * @returns {string}
     */
    GetCover() {
        return API.GetDoujinArtURL(this.GetMediaID(), this.media.cover.type);
    }

    /**
     * Retrieves the URL of the desired page.
     * @param {number|string} pageNumber Number of the page. Note: Pages start at number 1. There is no page 0!
     */
    GetPage(pageNumber) {
        return API.GetDoujinPageURL(this.GetMediaID(), pageNumber, this.media.pages[pageNumber].type);
    }

    /**
     * Retrieves all the tags.
     * @returns {Array<Tag>}
     */
    GetTags() {
        return this.tags;
    }

    /**
     * Retrieves the total amount of tags.
     * @returns {number}
     */
    GetTagCount() {
        return this.tagCount;
    }

    /**
     * Retrieves the desired tag.
     * @param {number} tag 
     * @returns {Tag}
     */
    GetTag(tag) {
        return this.tags[tag];
    }

    /**
     * Returns all tags that match the specified Tag type. Ex: "GetTagByType(TagType.ARTIST)" would
     * return all tags that describe the authors of the Doujin.
     * @param {TagType} tagType 
     * @returns {Array<Tag>}
     */
    GetTagByType(tagType) {
        let tags = [];

        for(let i = 0; i < this.GetTagCount(); i++) {
            let tag = this.GetTag(i);
            if(tag.type == tagType) tags.push(tag);
        }

        return tags;
    }

};