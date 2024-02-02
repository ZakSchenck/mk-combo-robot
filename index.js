const HID = require('node-hid');
const robot = require('robotjs');

const vendorId = 1356;
const productId = 2508;

const device = new HID.HID(vendorId, productId);

let squareButtonPressed = false;
let xButtonPressed = false;

device.on('data', function(data) {
    parsePS4ControllerData(data);
});

function parsePS4ControllerData(data) {
    const dpad = data[5] & 0xF;
    const squareButton = data[5] & 0x10;
    const xButton = data[5] & 0x20;

    // Handle square button
    if (squareButton > 0 && !squareButtonPressed) {
        // Simulate a keyboard key press for 'a'
        robot.keyToggle('a', 'down');
        setTimeout(() => {
            robot.keyToggle('a', 'up');
        }, 16.7);
        squareButtonPressed = true; // Set the state to pressed
    } else if (squareButton === 0 && squareButtonPressed) {
        squareButtonPressed = false; // Reset the state when the button is released
    }

    // Handle X button
    if (xButton > 0 && !xButtonPressed) {
        // Simulate a keyboard key press for 'd'
        robot.keyToggle('d', 'down');
        robot.keyToggle('k', 'down');
        setTimeout(() => {
            robot.keyToggle('d', 'up');
            robot.keyToggle('k', 'up');
        }, 16.7);

        // Simulate a keyboard key press for 'i' after 200ms
        setTimeout(() => {
            robot.keyToggle('j', 'down');
            setTimeout(() => {
                robot.keyToggle('j', 'up');
            }, 16.7); // The duration of the 'i' key press
        }, 150); // Delay for pressing 'i' after 'd'

        setTimeout(() => {
            robot.keyToggle('i', 'down');
            setTimeout(() => {
                robot.keyToggle('i', 'up');
            }, 16.7); // The duration of the 'i' key press
        }, 280); // Delay for pressing 'i' after 'd'

        xButtonPressed = true; // Set the state to pressed
    } else if (xButton === 0 && xButtonPressed) {
        xButtonPressed = false; // Reset the state when the button is released
    }

    // Log button states
    console.log(`D-Pad: ${dpad}, Square: ${squareButton > 0}, X: ${xButton > 0}`);
}