const DEFAULT_GAP_SIZE = 10;

class GapBuffer {
    public buffer: (string | null)[] = new Array(DEFAULT_GAP_SIZE).fill(null);
    private gapLeft: number = 0;
    private gapRight: number = this.gapLeft + DEFAULT_GAP_SIZE - 1;
    public gapSize = DEFAULT_GAP_SIZE;

    insert(input: string, position: number) {
        if (position !== this.gapLeft) {
            this.moveGap(position);
        }

        let pos = position;
        for (let i = 0; i < input.length; i++) {
            if (this.gapLeft > this.gapRight) {
                this.grow(10, pos);
            }

            this.buffer[this.gapLeft] = input[i];
            this.gapLeft += 1;
            pos += 1;
        }
    }

    moveGap(position: number) {
        if (position < this.gapLeft) {
            this.left(position);
        } else {
            this.right(position);
        }
    }

    left(position: number) {
        while (position < this.gapLeft) {
            this.gapLeft -= 1;
            this.gapRight -= 1;
            this.buffer[this.gapRight + 1] = this.buffer[this.gapLeft];
            this.buffer[this.gapLeft] = null;
        }
    }

    right(position: number) {
        while (position > this.gapLeft) {
            this.gapLeft += 1;
            this.gapRight += 1;
            this.buffer[this.gapLeft - 1] = this.buffer[this.gapRight];
            this.buffer[this.gapRight] = null;
        }
    }

    grow(gapSize: number, position: number) {
        // add gap at the end of array
        for (let i = 0; i < gapSize; i++) {
            this.buffer.push(null);
        }
        // Shift elements starting from the end to prevent overwriting
        for (let i = this.buffer.length - gapSize - 1; i >= position; i--) {
            this.buffer[i + gapSize] = this.buffer[i];
        }
        // set the gap where the previous position of the shifted items was
        for (let i = position; i < position + gapSize; i++) {
            this.buffer[i] = null;
        }

        this.gapRight = position + gapSize - 1;
        this.gapLeft = position;
        this.gapSize = gapSize;
    }
}

export default GapBuffer;
