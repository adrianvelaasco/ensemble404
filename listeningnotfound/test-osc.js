const { Client } = require('node-osc');

const client = new Client('127.0.0.1', 53001);
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

let i = 0;
setInterval(() => {
    // Test Color
    const color = colors[i % colors.length];
    console.log(`Sending color: ${color}`);
    client.send('/color', color);

    // Test Instruments
    const state = (i % 2) + 1; // Toggles between 1 and 2
    console.log(`Toggling instruments to state: ${state}`);
    client.send('/bassoon', state);
    client.send('/drumset', state);
    client.send('/piano', state);

    i++;
}, 2000);
