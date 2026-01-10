export default class Rgb
{
    static BLACK = new Rgb();

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
     * @param {number|undefined} r Red color intensity 0 is off, 255 is full red intensity.
     * @param {number|undefined} g Green color intensity 0 is off, 255 is full green intensity.
     * @param {number|undefined} b Blue color intensity 0 is off, 255 is full blue intensity.
     */
    constructor(r=0, g=0, b=0)
    {
        this.red = Math.max(Math.min(r, 255), 0);
        this.green = Math.max(Math.min(g, 255), 0);
        this.blue = Math.max(Math.min(b, 255), 0);
    }
}
