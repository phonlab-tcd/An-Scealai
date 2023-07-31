function reverseString(str) {
    return str.split("").reverse().join("");
}

function seekBoundary(text: string, reverse: boolean = false): number {
    const boundary = reverse ? / \.|\n/ : /\. |\n/
    const search = text.search(boundary);
    if (search > -1) {
        return search + (reverse ? 0 : 1);
    }
    return text.trimEnd().length; // If we don't find any sentence boundary, then go to the start / end of the string
}

function isAtBoundary(text: string, index: number): boolean {
    return text[index - 1] === '.' && text[index] === '\s';
}

export default function seekParentSentece(text: string, index: number): string {
    const [before, after] = [text.slice(0, index), text.slice(index)];
    const startIndex = isAtBoundary(text, index) ? index : index - seekBoundary(reverseString(before), true);
    const endIndex = index + seekBoundary(after);
    return text.slice(startIndex, endIndex);
}