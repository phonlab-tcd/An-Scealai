export type Location = {
    startIndex: number;
    endIndex: number;
}

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