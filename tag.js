/**
 * This struct represents different types of tags
 * found on nhentai.net
 */
const TagType = {
    UNDEFINED: null,
    ARTIST: "artist",
    CATEGORY: "category",
    CHARACTER: "character",
    GROUP: "group",
    LANGUAGE: "language",
    PARODY: "parody",
    TAG: "tag",

    /**
     * Gets a TagType based on a string
     * @param {string} tag Tag type in string format.
     * @returns {TagType} TagType if successful, if not, Null is returned.
     */
    valueOf(tag) {
        if(!(typeof(tag) === "string")) return null;
        let type = tag.toUpperCase();
        let result = this[type];
        return result;
    }
}

/**
 * This class represents a Tag found on nhentai.net
 */
class Tag {
    
    constructor(tagType, id = 0, name = "", url = "", count = 0) {
        this.type = tagType;
        this.id = id;
        this.name = name;
        this.url = url;
        this.count = count;
    }

    /**
     * Retrieves the Tag type
     * @returns {TagType}
     */
    GetType() {
        return TagType.valueOf(this.type);
    }

    /**
     * Retrieves the ID of the Tag. This ID is used on nhentai.net to represent this Tag.
     * @returns {number}
     */
    GetID() {
        return this.id;
    }

    /**
     * Retrieves the Tag name.
     * @returns {string}
     */
    GetName() {
        return this.name;
    }

    /**
     * Retrieves the Tag URL.
     * @returns {string}
     */
    GetURL() {
        return this.url;
    }

    /**
     * @returns {number}
     */
    GetCount() {
        return this.count;
    }

}

module.exports = {
    TagType: TagType,
    Tag: Tag
}