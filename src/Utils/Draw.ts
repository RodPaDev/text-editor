import chalk from "chalk";

export default class Draw {
    static TextBar(text: string, columns: number, prefixLength: number = 2) {
        const prefixText = new Array(prefixLength).fill(" ").join("");
        const remaindingSpace = columns - text.length - prefixLength;
        const outText =
            prefixText + text + new Array(remaindingSpace).fill(" ").join("");
        process.stdout.write(chalk.bgWhite.black(outText));
    }
}
