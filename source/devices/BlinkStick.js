import hid from "node-hid";
import CONSTANTS from "../constants.js";
import Rgb from "../colors/Rgb.js";
import BLINKSTICK from "../constants.js";
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
                result = this.hid.getFeatureReport(id, BLINKSTICK.FEATURE_REPORT_LENGTH);
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
}
