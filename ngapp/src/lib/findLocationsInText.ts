export type Location = {
    startIndex: number;
    endIndex: number;
}

/**
 * Get the start and end indices of each synthesised word res in relation to Quill plaintext
 * @param text plaintext of word or sentence synthesised
 * @param tokens array of words returned from synth api response
 * @param offset start index of 'text' in relation to quill editor
 * @returns array of start and end indices for each word in quill
 */
export default function findLocationsInText(text: string, tokens: string[], offset: number = 0): Location[] {
    const locations: Location[] = []
    let textPointer = 0;
    for (const token of tokens) {
        const startIndex = textPointer + text.slice(textPointer).indexOf(token);
        const endIndex = startIndex + token.length;
        locations.push({startIndex: offset + startIndex, endIndex: offset + endIndex});
        textPointer = endIndex;
    }
    return locations;
}

// TODO => get rid of Location type
/*
export default function findLocationsInText(text: string, tokens: string[], offset: number = 0): {
    startIndex: number;
    endIndex: number;
}[] {
    const locations = []
    let textPointer = 0;
    for (const token of tokens) {
        const startIndex = textPointer + text.slice(textPointer).indexOf(token);
        const endIndex = startIndex + token.length;
        locations.push({startIndex: offset + startIndex, endIndex: offset + endIndex});
        textPointer = endIndex;
    }
    return locations;
}
*/