const express = require('express')
const fs = require('fs')
const app = express();
const { io } = require("socket.io-client");
const os = require('node-os-utils');
const { join } = require('path');

const config = JSON.parse(fs.readFileSync('./edge/config.json', { encoding: "utf-8", flag: "r"}));
const socket = io(config["mainframe-url"][0]);
var link = config["server-url-rest"][0];
const PORT = config["PORT"][0];
const needPort = config["requires-port"][0];

function print(args) {
    console.log(args);
}

if (link.endsWith('/')) {
  link = link.substring(0, link.length - 1);
}

app.get('/', (req, res) => {

  // Add your custom code and computations here!
    res.sendFile(join(__dirname + '/scripts/index.html'));

})

socket.on("connect", () => {
    print("Connected to main server...");
});

socket.on("disconnect", () => {
    print("Disconnected from main server...");
});

socket.on('server-data-edge', () => {
    os.cpu.usage().then((cpuInfo) => {
      os.mem.info().then((memInfo) => {
        const cpuUsage = cpuInfo;
        const ramUsage = 100 - (memInfo.freeMemPercentage || 0); // Normalize to a value between 0 and 100
        
        if (needPort == false) {
          socket.emit('server-data-main', JSON.stringify({
            cpu: cpuUsage,
            ram: ramUsage,
            weight: (cpuUsage + ramUsage),
            link: link,
          }));
        } else {
          socket.emit('server-data-main', JSON.stringify({
            cpu: cpuUsage,
            ram: ramUsage,
            weight: (cpuUsage + ramUsage),
            link: link + ":" + PORT,
  
          }));
        }
      });
    });
  });

app.listen(PORT, () => {
    print("REST now listening on port : " + PORT + "\nConnecting to main server: " + config['mainframe-url'][0])
})
  

