import * as readline from 'readline';

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

export function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function confirmOverwrite(filePath: string): Promise<boolean> {
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        const answer = await question(`File ${filePath} already exists. Do you want to overwrite it? (y/n): `);
        return answer.toLowerCase() === 'y';
    }
    return true;
}

export function findMatchingBracket(content: string, startIndex: number): number {
    let bracketCount = 1;
    let index = startIndex + 1;

    while (bracketCount > 0 && index < content.length) {
        if (content[index] === '[') bracketCount++;
        if (content[index] === ']') bracketCount--;
        index++;
    }

    return index - 1;
}
