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

    handleNewLine() {
        const [r, c] = this.positionToCoord(this.position);

        if (r < 0) {
            console.log("Row is less than 0, early.");
            return;
        }

        if (r >= this.lineLengths.length) {
            this.lineLengths.push(0);
        }
        const currentLineLength = this.lineLengths[r];
        this.lineLengths[r] = c > 0 ? c - 1 : 0;
        this.lineLengths.splice(r + 1, 0, currentLineLength - c);

        this.gb.insert("\n", this.position);
        const nextCoords: [number, number] = [r + 1, 1];
        this.screen.moveCursor(...nextCoords);
        this.position = this.coordToPosition(this.screen.cursorPosition);
        process.stdout.write("\n");
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
            // const [r, c] = nextCursorMove;
            const nextPos = this.coordToPosition(nextCursorMove);
            console.log("nextPos", nextPos);
            // const offsetLineIndex = r - 3;

            // // Prevent cursor from moving to non-existing lines
            // if (
            //     offsetLineIndex < 0 ||
            //     offsetLineIndex >= this.lineLengths.length
            // ) {
            //     return;
            // }

            // // Ensure the cursor does not move beyond the length of the line
            // if (c > this.lineLengths[offsetLineIndex] + 1) {
            //     return;
            // }

            this.screen.moveCursor(...nextCursorMove);
            this.position = nextPos;
        } else if (
            inputStr === EscapeCodes.CARRIAGE_RETURN_CRLF ||
            inputStr === EscapeCodes.CARRIAGE_RETURN_LF ||
            inputStr === EscapeCodes.LINE_FEED
        ) {
            this.handleNewLine();
        } else if (inputStr === EscapeCodes.DISCARD) {
            this.screen.moveCursor(1, 1, true);
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
