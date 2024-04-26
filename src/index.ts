import { createWriteStream } from "fs";
import { PassThrough } from "stream";
import dotenv from "dotenv";

import TextEditor from "./TextEditor";

dotenv.config();

let passThrough: PassThrough;
// check if the terminal at tty is still available
if (process.env.TTY && process.env.DEBUG && process.env.DEBUG === "true") {
    const ttyStream = createWriteStream(process.env.TTY!);
    passThrough = new PassThrough();
    passThrough.pipe(ttyStream);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
    console.log = (...args: any[]) => {
        passThrough.write(args.join(" ") + "\n");
    };
    // clear the terminal
    passThrough.write("\x1Bc");
    // eslint-disable-next-line no-console
    console.log("Debug mode enabled.");
}

new TextEditor();
