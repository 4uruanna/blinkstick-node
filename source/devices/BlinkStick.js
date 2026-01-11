import hid from "node-hid";
import CONSTANTS from "../constants.js";
import Rgb from "../colors/Rgb.js";
import HidDevice from "./HidDevice.js";

export class BlinkStick extends HidDevice {
    /**
     * Find all attached BlinkStick devices
     * 
     * @returns {BlinkStick[]}
     */
    static findAll() {
        const   deviceList = hid.devices(),
                result = [];
    
        for (const device of deviceList) {
            const { vendorId, productId } = device;
    
            if(vendorId === CONSTANTS.VENDOR_ID && productId === CONSTANTS.PRODUCT_ID) {
                result.push(new BlinkStick(device));
            }
        }
    
        return result;
    }

    /**
     * Find BlinkStick device based on serial number
     *
     * @param {string} serialNumber
     * @returns {BlinkStick|undefined}
     */
    static findBySerial(serialNumber) {
        const deviceList = BlinkStick.findDevices();
        let result = undefined;

        for(let index=0; index < deviceList.length; index++) {
            if(deviceList[index].device.serialNumber === serialNumber) {
                result = deviceList[index];
                break;
            }
        }

        return result;
    }

    /** @type {number} */
    ledCount = 1;

    /**
     * @param {hid.Device} device
     */
    constructor(device)
    {
        super(device);
    }

    /**
     * Shutdown all leds
     * 
     * @returns {Promise<boolean>}
     */
    shutdown() {
        return new Promise((resolve, reject) => {
            let result = false;

            if(this.isConnected()) {
                for(const index of Array(this.ledCount).keys()) {
                    this.setColor(Rgb.BLACK, index);
                }

                result = true;
            } else {
                reject();
            }

            resolve(result);
        });
    }

    /**
     * Get feature report
     * 
     * @param {number} id Report ID to receive
     * @returns {Promise<number[]>}
     */
    getFeatureReport(id) {
        return new Promise((resolve, reject) => {
            let result = [];

            if(this.isConnected()) {
                result = this.hid.getFeatureReport(id, CONSTANTS.FEATURE_REPORT_LENGTH);
            } else {
                reject();
            }

            resolve(result);
        });
    }

    /**
     * Get visible color of an led from its index
     *
     * @param {number} index led index
     * @returns {Promise<Rgb|undefined>}
     */
    getLedColor(index=0) {
        return new Promise((resolve, reject) => {
            let result = undefined;

            if(this.isConnected()) {
                const   cursor = index * 3 + 2,
                        buffer = this.getFeatureReport(CONSTANTS.ADDRESS_BLOCK_GET_COLOR);
            
                result = new Rgb(
                    buffer[cursor + 1],
                    buffer[cursor],
                    buffer[cursor + 2]
                );
            } else {
                reject();
            }

            resolve(result);
        });
    }

    /**
     * Get visible color of each led
     *
     * @returns {Promise<{ [key:number]: Rgb|undefined }>}
     */
    async getLedsColors() {
        const   promises = [],
                result = {};

        for(const index of Array(this.ledCount).keys()) {
            promises.push(this.getLedColor(index));
        }

        const colors = await Promise.all(promises);

        for(let i=0; i<colors.length; i++) {
            result[i] = colors[i];
        }

        return result;
    }

    /**
     * Get color of an led from its index
     * 
     * @param {Rgb} color 
     * @param {number} index 
     * @returns {Promise<void>}
     */
    setLedColor(color, index=0) {
        new Promise((resolve,) => {
            this.hid.sendFeatureReport([
                CONSTANTS.ADDRESS_BLOCK_SET_COLOR,
                0,
                index,
                color.red,
                color.green,
                color.blue
            ]);

            resolve();
        });
    }

    /**
     * Returns the serial number of device.
     *
     * ```
     * BSnnnnnn-1.0
     * ||  |    | |- Software minor version
     * ||  |    |--- Software major version
     * ||  |-------- Denotes sequential number
     * ||----------- Denotes BlinkStick device
     * ```
     *
     * @returns {{ major: number|undefined, minor: number|undefined }}
     */
    getVersion() {
        const   serial = this.device.serialNumber,
                result = { major: undefined, minor: undefined };

        if(serial) {
            result.major = parseInt(this.device.serialNumber.at(CONSTANTS.VERSION_MAJOR));
            result.minor = parseInt(this.device.serialNumber.at(CONSTANTS.VERSION_MINOR));
        }

        return result;
    }
}
