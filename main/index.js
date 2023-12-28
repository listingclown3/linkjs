const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const fs = require('fs')

const app = express();
const server = createServer(app);
const io = new Server(server);

const config = JSON.parse(fs.readFileSync('./main/config.json', { encoding: "utf-8", flag: "r"}));
const serverFile = JSON.parse(fs.readFileSync('./main/servers.json', { encoding: "utf-8", flag: "r"}));
const PORT = config["PORT"][0];
const subdirectory = config["subdirectory"][0];
const name = config["name"][0];
const timeout = config["timeout-duration-minutes"][0];
var userCount = 0;

function print(args) {
    console.log(args)
  }

for (const key in serverFile) {
   delete serverFile[key];
}
  
  // Write the updated serverFile to the file
  fs.writeFileSync('./main/servers.json', JSON.stringify(serverFile, null, 2));
  
  app.get('/', (req, res) => {
    res.redirect(`/${subdirectory}`);
  });

  app.get(`/${subdirectory}`, (req, res) => {
    let leastLoadedServer = null;
    let lowestWeight = Number.MAX_SAFE_INTEGER;
  
    for (const [serverId, serverData] of Object.entries(serverFile)) {
      const weight = serverData[2]; // Assuming weight is stored at index 2
  
      if (weight < lowestWeight) {
        lowestWeight = weight;
        leastLoadedServer = serverId;
      }
    }

    if (leastLoadedServer) {
      // Redirect the user to the least loaded server
      const leastLoadedServerData = serverFile[leastLoadedServer];
      res.redirect(leastLoadedServerData[3]); // Assuming the link is stored at index 3
    } else {
      res.status(500).send("No servers available... try again later");
    }
  });
  

  
  io.on('connection', (socket) => {
    userCount++;
    const id = Array(4).fill().map(z=>Math.random().toString(36).slice(2)).join("")
    serverFile[id] = [0, 0, 0, "", ""];
    print("An edge server connected : TOTAL USER COUNT [" + userCount + "] : USER ID [" + id + "]")
    socket.emit('server-data-edge')
  
    socket.on('disconnect', () => {
      userCount--;
      print("A user disconnected : TOTAL USER COUNT [" + userCount + "] : USER ID {" + id + "]")

      delete serverFile[id]; 
      fs.writeFileSync('./main/servers.json', JSON.stringify(serverFile, null, 2));
    });
  
    setInterval(() => {
      socket.broadcast.emit('server-data-edge')
    }, 1000 * 60 * timeout);
  
    socket.on('server-data-main', (message) => {

      const data = JSON.parse(message);
      const cpu = data.cpu
      const ram = data.ram
      const weight = data.weight;
      const link = data.link;
  
      serverFile[id] = [cpu, ram, weight, link];
      fs.writeFileSync('./main/servers.json', JSON.stringify(serverFile, null, 2));
  
      /* 
          CPU: percentage, usage
          RAM: percentage, usage
          WEIGHT: Added total of the CPU and RAM usage to determine the lowest loaded server
          LINK: {STRING}, the full link to connect to the edge server via REST
      */
  
    })
  
  });

server.listen(PORT, () => {
  print(name + ' running... at PORT : ' + PORT);
});