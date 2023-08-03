import findLocationsInText from "./findLocationsInText";

fdescribe('findLocationsInText', function() {
    it('works', function() {
        const text = 'Hello world... this is some text ! ';
        const tokens = ['Hello', 'world', 'this', 'is', 'some', 'text'];
        const locations = findLocationsInText(text, tokens);
        expect(locations).toEqual([
            {startIndex: 0, endIndex: 5},
            {startIndex: 6, endIndex: 11},
            {startIndex: 15, endIndex: 19},
            {startIndex: 20, endIndex: 22},
            {startIndex: 23, endIndex: 27},
            {startIndex: 28, endIndex: 32},
        ]);
    });

    it('handles weird space', function() {
        const text = "eg eg  .";
        // This is how abair tokenizes this sentence:
        const tokens = ['eg', 'eg.'];
        const locations = findLocationsInText(text,tokens);
        expect(locations).toEqual([{"startIndex":0,"endIndex":2},{"startIndex":3,"endIndex":5}]);
    });
});