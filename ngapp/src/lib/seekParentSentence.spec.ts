import seekParentSentence from './seekParentSentence';


const TESTS = [
    // Basic cases
    {
        desc: 'Pre-boundary marked by full stop',
        pre: 'Hello world. This is ',
        after: 'a sentence.',
        expected: 'This is a sentence.',
    },
    {
        desc: 'After-boundary marked by full stop',
        pre: 'This is a sen',
        after: 'tence. This is another.',
        expected: 'This is a sentence.',
    },
    {
        desc: 'After-boundary marked by end of string',
        pre: 'Hello world. This is a sen',
        after: 'tence ',
        expected: 'This is a sentence',
    },
    // Trivial cases
    {
        desc: 'Empty string should return empty string',
        pre: '',
        after: '',
        expected: '',
    },
    {
        desc: 'Single sentence returned as-is',
        pre: 'This is ',
        after: 'a sentence.',
        expected: 'This is a sentence.',
    },
    // Funky cases
    {
        desc: 'Exactly in the middle of two sentences (left side of whitespace)',
        pre: 'This is a sentence.',
        after: ' This is another sentence.',
        expected: 'This is a sentence.',
    },
    {
        desc: 'Exactly in the middle of two sentences (right side of whitespace)',
        pre: 'This is a sentence. ',
        after: 'This is another sentence.',
        expected: 'This is another sentence.',
    },
    {
        desc: 'URL',
        pre: 'Some text before http://local',
        after: 'host:9876/# and text after.',
        expected: 'Some text before http://localhost:9876/# and text after.',
    },
    {
        desc: 'email',
        pre: 'Some text before oinol',
        after: 'an@tcd.ie and some text after',
        expected: 'Some text before oinolan@tcd.ie and some text after',
    },
    {
        desc: 'decimal number',
        pre: 'Some text before 3.14',
        after: '159 and so on and so on',
        expected: 'Some text before 3.14159 and so on and so on',
    },
    // The zoo of boundaries
    {
        desc: 'Newline as start',
        pre: 'Some stuff before \nThis is a',
        after: ' sentence.',
        expected: 'This is a sentence.',
    },
    {
        desc: 'Newline as end',
        pre: 'This is a',
        after: ' sentence\n some stuff here',
        expected: 'This is a sentence',
    },
]


fdescribe("seekParentSentence", function() {
    for (const test of TESTS) {
        it(test.desc, function() {
            const output = seekParentSentence(test.pre.concat(test.after), test.pre.length);
            expect(output).toEqual(test.expected);
        });
    }
});


