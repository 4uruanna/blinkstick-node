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
    ledCount;

    /** @type {number} */
    colorReportId;

    /**
     * @param {hid.Device} device
     */
    constructor(device)
    {
        super(device);
        this.ledCount = this.getModel().ledCount;
        this.colorReportId = (
            this.ledCount < 8
                    ? CONSTANTS.ADDRESS_BLOCK_GET_COLOR_8
                    : this.ledCount < 16
                        ? CONSTANTS.ADDRESS_BLOCK_GET_COLOR_16
                        : this.ledCount < 32
                            ? CONSTANTS.ADDRESS_BLOCK_GET_COLOR_32
                            : CONSTANTS.ADDRESS_BLOCK_GET_COLOR_64
        );
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
                        buffer = this.getFeatureReport(this.colorReportId);
            
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
        const   promises = Array(this.ledCount).keys().map(index => this.getLedColor(index)),
                colors = await Promise.all(promises),
                result = {};

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

    /**
     * Get the product model of the device.
     *
     * @return {{ id: number, release: undefined|number, name: string, ledCount: number }}
     */
    getModel() {
        const version = this.getVersion();
        let result = CONSTANTS.PRODUCT.UNKNOWN;

        switch(version.major) {
            case 1:
                result = CONSTANTS.PRODUCT.BLINKSTICK;
                break;
            
            case 2:
                result = CONSTANTS.PRODUCT.BLINKSTICK_PRO;
                break;

            case 3:
                switch(this.device.release) {
                    case CONSTANTS.PRODUCT.BLINKSTICK_SQUARE.release:
                        result = CONSTANTS.PRODUCT.BLINKSTICK_SQUARE;
                        break;

                    case CONSTANTS.PRODUCT.BLINKSTICK_STRIP.release:
                        result = CONSTANTS.PRODUCT.BLINKSTICK_STRIP;
                        break;
                        
                    case CONSTANTS.PRODUCT.BLINKSTICK_NANO.release:
                        result = CONSTANTS.PRODUCT.BLINKSTICK_NANO;
                        break

                    case CONSTANTS.PRODUCT.BLINKSTICK_FLEX.release:
                        result = CONSTANTS.PRODUCT.BLINKSTICK_FLEX;
                        break;
                }
                break;
        }

        return result;
    }
}
