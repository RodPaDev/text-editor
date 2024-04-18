export enum EscapeCodes {
    ESC = "\x1b",
    CSI = `${ESC}[`,
    SGR = `${CSI}m`,
    ARROW_UP = `${CSI}A`,
    ARROW_DOWN = `${CSI}B`,
    ARROW_RIGHT = `${CSI}C`,
    ARROW_LEFT = `${CSI}D`,
    CLEAR_LINE = `${CSI}2K`,
    CLEAR_SCREEN = `${CSI}2J`,
    SHOW_CURSOR = `${CSI}?25h`,
    HIDE_CURSOR = `${CSI}?25l`,
}
