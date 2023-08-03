function reverseString(str) {
    return str.split("").reverse().join("");
}

function seekBoundary(text: string): number {
    const search = text.search(/\s/);
    if (search > -1) {
        return search;
    }
    return text.length; // If we don't find any space, then go to the start / end of the string
}

type SeekResult = {
    text: string,
    startIndex: number,
    endIndex: number
}

/**
 * Return the word of wherever the cursor is in the quill editor
 * @param text entire story text
 * @param index index of cursor in quill
 * @returns word along with its start/end indices
 */
export default function seekParentWord(text: string, index: number): SeekResult {
    const [before, after] = [text.slice(0, index), text.slice(index)];
    const startIndex = index - seekBoundary(reverseString(before));
    const endIndex = index + seekBoundary(after);
    return {
        text: text.slice(startIndex, endIndex),
        startIndex: startIndex,
        endIndex: endIndex
    }
}