# linkjs
Basic server manager to connect small servers that will run their own independent scripts.

## Context
Those 24/7 free Discord Bot hosters that host on Pterodactly, Jexactyl, etc. have low power servers. This essentially just aims to connect all those servers to do small tasks, like processing basic data and just horizontally scales servers.

## How it works
Will have a main website that just serves redirect links
Will have as many seperate servers that are running set code imported from you the user

Connect to try to connect to main server (I'll focus on security later probably), through websockets which the main server will then use to distribute data by redirecting users to the other servers where they will probably process specific code pre-implemented onto the server.

## How to Setup
1. Find a relatively strong computational system that is capable of running Node.js as the main server
2. Download the source code for the main server source code in the main directory
3. Tweak the name, subdirectory, port, and timeout duration to your liking [Main Server Configuration](#Configuration)
4. Find other smaller systems that are also capable of running Node.js
5. Download the source code for the edge servers in the edge directory
6. Tweak the main server URL (socket url), your edge server's URL, your edge server's PORT, and whether your need the PORT in your connection or not [Edge Server Configuration](#Configuration)
7. Run the main server code (npm run main)
8. Run all the edge server code (npm run edge)
9. Check for bugs, and enjoy!

Note:

- Ensure necessary dependencies in Node.js for both main and edge server are installed before running
   
   You can do this by doing "npm run install-main" or "npm run install-edge" based on which server you need to install dependencies for!
- With the edge server configurations, you MUST REPLACE HTTP/HTTPS with WSS TO PROPERLY CONNECT TO THE MAIN SERVER in the Mainframe URL 


# Configuration
Main Server Configuration: 
    
    Name: Whatever you want it to be
    
    PORT: The port that your main server will be listening on
    
    Subdirectory: The subdirectory that your server will run the computations to redirect users
    
    Timeout Duration: How often you want to ping edge servers on usage statistics to accurately redirect users (in minutes)

Edge Server Configuration:

    Mainframe URL: The main server URL (no subdirectories or anything)
    
    Server URL REST: The URL of your edge server
    
    PORT: The PORT your edge server will be listening on
    
    Require Port: Determine whether you need a specific port to go to when redirecting to the server

# How to add custom code
Go into the edge server code and inside 'app.get('/', (req, res) => {', change the code to your custom code and you can run other code within the scripts directory that contain the index.html page!

## Purpose
To take those 24/7 Discord Bot servers that run Node.js and cluster servers to do menial computational tasks or communicate with lots of users. It's really cool if you don't like paying for big servers, even though this script is currently horrible unsecure.

## To-Do
- Add security
- Add demonstration video

## Security Issues
- Being able to connect to the main websocket server as anyone
- Being able to emit to other clients
- Probably unsecure data transfers (?)