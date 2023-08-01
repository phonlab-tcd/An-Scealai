import seekParentWord from './seekParentWord';

fdescribe("seekParentWord", () => {
    it("returns the word that the cursor starts at", function() {
        // "|Hello world" -> "Hello"
        expect(seekParentWord("Hello world", 0).text).toEqual("Hello");
    });

    it("returns the word that the cursor ends at", () => {
        // "Hello| world" -> "Hello"
        expect(seekParentWord("Hello world", 5).text).toEqual("Hello");
    });

    it("returns the word that the cursor is in the middle of", () => {
        // "Hel|lo world" -> "Hello"
        expect(seekParentWord("Hello world", 3).text).toEqual("Hello");
    });

    it("recognises the start of the string as a boundary", () => {
        // "H|ello world" -> "Hello"
        expect(seekParentWord("Hello world", 1).text).toEqual("Hello");
    });

    it("recognises the end of the string as a boundary", () => {
        // "Hello wor|ld" -> "world"
        expect(seekParentWord("Hello world", 9).text).toEqual("world");
    });

    it("returns the empty string if the index is between whitesspaces", () => {
        // "a    |      b" -> ""
        expect(seekParentWord("a        b", 4).text).toEqual("");
    });

    it("considers contiguous punctuation to be part of the word", () => {
        // "Hello.....|.... world" -> "Hello"
        expect(seekParentWord("Hello......... world", 11).text).toEqual("Hello.........");
    });

    it("matches tabs as well as spaces", () => {
        // "Hell|o\tworld" -> "Hello"
        expect(seekParentWord("Hello\tworld", 4).text).toEqual("Hello");
    });
});