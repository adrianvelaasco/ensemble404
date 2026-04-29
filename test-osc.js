const { Client } = require('node-osc');
const client = new Client('127.0.0.1', 53001);
client.send('/startagain', (err) => {
  if (err) console.error(err);
  console.log('Sent /startagain');
  client.close();
});
