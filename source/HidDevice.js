import hid from "node-hid";

export default class HidDevice
{
    /** @type {hid.Device} */
    device = undefined;

    /** @type {hid.HID|undefined} */
    hid = undefined;

    /** @type {boolean} */
    started = false;

    /** @type {boolean} */
    disposed = false;

    /**
     * @param {hid.Device} device
     */
    constructor(device)
    {
        this.device = device;
    }

    /**
     * Connect Blinkstick
     * 
     * @returns {Promise<void>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.hid = new hid.HID(this.device.path);
                this.started = true;
            } catch (exception) {
                reject(exception);
            }

            resolve();
        });
    }

    /**
     * Disconnect Blinkstick
     * 
     * @returns {Promise<void>}
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if(this.disposed === false && this.hid) {
                this.hid.close();
                this.hid = undefined;
                this.disposed = true;
            }

            resolve();
        });
    }

    isConnected() {
        return this.started && this.disposed === false;
    }
}