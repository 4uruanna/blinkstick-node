const CONSTANTS = {
    VENDOR_ID: 0x20a0,

    PRODUCT_ID: 0x41e5,

    PRODUCT: {
        UNKNOWN: { id: 0, release: undefined, name: "unknown", ledCount: 0 },
        BLINKSTICK: { id: 1, release: undefined, name: "blinkstick", ledCount: 1 },
        BLINKSTICK_PRO: { id: 2, release: undefined, name: "blinkstick pro", ledCount: 1 },
        BLINKSTICK_SQUARE: { id: 3, release: 0x200, name: "blinkstick square", ledCount: 8 },
        BLINKSTICK_STRIP: { id: 4, release: 0x201, name: "blinkstick strip", ledCount: 8 },
        BLINKSTICK_NANO: { id: 5, release: 0x202, name: "blinkstick nano", ledCount: 2 },
        BLINKSTICK_FLEX: { id: 6, release: 0x203, name: "blinkstick flex", ledCount: 32 },
        BLINKSTICK_STRIP_MINI: { id: 7, release: undefined, name: "blinkstick strip mini", ledCount: 4 },
    },

    MIN_RGB_VALUE: 0,
    MAX_RGB_VALUE: 255,

    FEATURE_REPORT_LENGTH: 33,
    VERSION_MAJOR: -3,
    VERSION_MINOR: -1,
    
    ADDRESS_BLOCK_1: 0x0002,
    ADDRESS_BLOCK_2: 0x0003,
    ADDRESS_BLOCK_MODE: 0x0004,
    ADDRESS_BLOCK_SET_COLOR: 0x0005,
    ADDRESS_BLOCK_GET_COLOR_8: 0x0006,
    ADDRESS_BLOCK_GET_COLOR_16: 0x0007,
    ADDRESS_BLOCK_GET_COLOR_32: 0x0008,
    ADDRESS_BLOCK_GET_COLOR_64: 0x0009,

    /**
     * @see http://www.blinkstick.com/help/tutorials/blinkstick-pro-modes
     */
    MODES: {
        0: "Normal",
        1: "Inverse",
        2: "WS2812"
    },
}

export default CONSTANTS;