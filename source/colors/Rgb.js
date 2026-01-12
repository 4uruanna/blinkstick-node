import CONSTANTS from "../constants.js";

export default class Rgb
{
    static BLACK = new Rgb(0, 0, 0);

    static RED = new Rgb(255, 0, 0);

    static GREEN = new Rgb(0, 255, 0);

    static BLUE = new Rgb(0, 0, 255);

    /**
     * Red intensity 0 is off, 255 is full
     * @type {number}
     */
    red = 0;

    /**
     * Green intensity 0 is off, 255 is full
     * @type {number}
     */
    green = 0;

    /**
     * Blue intensity 0 is off, 255 is full
     * @type {number}
     */
    blue = 0;

    /**
     * @param {number|undefined} red color intensity 0 is off, 255 is full red intensity.
     * @param {number|undefined} green color intensity 0 is off, 255 is full green intensity.
     * @param {number|undefined} blue color intensity 0 is off, 255 is full blue intensity.
     */
    constructor(red, green, blue)
    {
        this.red = Math.max(Math.min(red, CONSTANTS.MAX_RGB_VALUE), CONSTANTS.MIN_RGB_VALUE);
        this.green = Math.max(Math.min(green, CONSTANTS.MAX_RGB_VALUE), CONSTANTS.MIN_RGB_VALUE);
        this.blue = Math.max(Math.min(blue, CONSTANTS.MAX_RGB_VALUE), CONSTANTS.MIN_RGB_VALUE);
    }
}
