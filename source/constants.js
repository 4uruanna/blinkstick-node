const BLINKSTICK = {
    VENDOR_ID: 0x20a0,

    PRODUCT_ID: 0x41e5,

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
    }
}

export default BLINKSTICK;