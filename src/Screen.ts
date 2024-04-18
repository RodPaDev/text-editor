import { EscapeCodes } from "./EscapeCodes";
import Draw from "./Utils/Draw";
import config from "./config";
class Screen {
    public columns: number;
    public rows: number;
    public cursorPosition: [number, number] = [0, 0];

    constructor() {
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
    }

    resize(): void {
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
        this.drawToolbars();
    }

    drawToolbars() {
        this.clear();
        this.moveCursor(1, 1, true);
        Draw.TextBar(`${config.title} ${config.version}`, this.columns);
        this.moveCursor(this.rows, 1, true);
        Draw.TextBar(
            `^S (Save) | ^Q (Save & Exit) | ^E (Exit & Discard)`,
            this.columns
        );
    }

    clear(): void {
        process.stdout.write(EscapeCodes.CLEAR_SCREEN);
    }

    moveCursor(row: number, col: number, isSet = false): void {
        if (
            !isSet &&
            (row < 3 || row > this.rows - 2 || col < 1 || col > this.columns)
        ) {
            return;
        }
        this.cursorPosition = [row, col];
        process.stdout.write(`${EscapeCodes.CSI}${row};${col}H`);
    }

    calcCursorMove(arrowKey: EscapeCodes): [number, number] {
        const [row, col] = this.cursorPosition;
        if (arrowKey === EscapeCodes.ARROW_DOWN) {
            return [row + 1, col];
        } else if (arrowKey === EscapeCodes.ARROW_UP) {
            return [row - 1, col];
        } else if (arrowKey === EscapeCodes.ARROW_LEFT) {
            return [row, col - 1];
        } else if (arrowKey === EscapeCodes.ARROW_RIGHT) {
            return [row, col + 1];
        }
        return [row, col];
    }
}

export default Screen;
