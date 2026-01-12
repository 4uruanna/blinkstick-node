# Blinkstick - Node

Provides an interface to control [Blinkstick](https://www.blinkstick.com/) devices with Node.Js.

## Install

```
npm install blinkstick-node
```

## Usage

```js
import { BlinkStick } from "blinkstick-node";

const devices = BlinkStick.findAll();

if(devices.length) {
    const device = devices[0];
    await device.connect();
    await device.setLedsColor(Rgb.GREEN);
    await device.disconnect();
}
```