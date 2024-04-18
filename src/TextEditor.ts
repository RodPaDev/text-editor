import GapBuffer from "./DataStructures/GapBuffer";
import { EscapeCodes } from "./EscapeCodes";
import Screen from "./Screen";

class TextEditor {
    private gb: GapBuffer;
    private screen: Screen;
    private position: number;

    private lineLengths: number[];

    constructor() {
        this.gb = new GapBuffer();
        this.screen = new Screen();
        this.position = 0;
        this.lineLengths = [0];
        this.initScreen();
        this.initStdin();

        this.onData = this.onData.bind(this);
        process.stdin.on("data", this.onData);
    }

    initScreen() {
        process.stdout.on("resize", this.screen.resize);
        this.screen.drawToolbars();
        this.screen.moveCursor(3, 1, true);
    }

    initStdin() {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
    }

    positionToCoord(position: number): [number, number] {
        const r = Math.floor(position / this.screen.columns) + 1;
        const c = (position % this.screen.columns) + 1;
        return [r, c];
    }

    coordToPosition(coordinates: [number, number]): number {
        const [r, c] = coordinates;
        return (r - 3) * this.screen.columns + (c - 1);
    }

    onData(input: Buffer) {
        const inputStr = input.toString()!;

        if (
            inputStr === EscapeCodes.ARROW_DOWN ||
            inputStr === EscapeCodes.ARROW_UP ||
            inputStr === EscapeCodes.ARROW_LEFT ||
            inputStr === EscapeCodes.ARROW_RIGHT
        ) {
            const nextCursorMove = this.screen.calcCursorMove(inputStr);
            const nextPos = this.coordToPosition(nextCursorMove);
            if (nextPos < this.gb.buffer.length - this.gb.gapSize) {
                this.screen.moveCursor(...nextCursorMove);
                this.position = nextPos;
            }
        } else if (inputStr === "\x03") {
            // Ctrl+C
            process.exit();
        } else {
            this.gb.insert(inputStr, this.position);
            this.screen.moveCursor(...this.positionToCoord(this.position));
            process.stdout.write(input.toString("utf-8"));
            this.position += 1;
        }
    }
}

export default TextEditor;
