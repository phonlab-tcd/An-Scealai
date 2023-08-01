const BOUNDARY_TOKEN = /\.|\n|!|\?/
const BOUNDARY_REGEX_FORWARD = /\. |\n|! |\? /
const BOUNDARY_REGEX_BACKWARD = / \.|\n| !| \?/

function reverseString(str) {
    return str.split("").reverse().join("");
}

function seekBoundary(text: string, reverse: boolean = false): number {
    const boundary = reverse ? BOUNDARY_REGEX_BACKWARD : BOUNDARY_REGEX_FORWARD
    const search = text.search(boundary);
    if (search > -1) {
        return search + (reverse ? 0 : 1);
    }
    return text.trimEnd().length; // If we don't find any sentence boundary, then go to the start / end of the string
}

function isAtBoundary(text: string, index: number): boolean {
    if (index === 0 || index >= text.length) return false;
    return text[index - 1].match(BOUNDARY_TOKEN) && text[index] === ' ';
}

type SeekResult = {
    text: string,
    startIndex: number,
    endIndex: number
}

export default function seekParentSentence(text: string, index: number): SeekResult {
    if (!text) return {text: text, startIndex: index, endIndex: index};
    const [before, after] = [text.slice(0, index), text.slice(index)];
    const startIndex = index - seekBoundary(reverseString(before), true);
    const endIndex = isAtBoundary(text, index) ? index : (index + seekBoundary(after));
    return {
        text: text.slice(startIndex, endIndex).trim(),
        startIndex: startIndex,
        endIndex: endIndex
    };
}