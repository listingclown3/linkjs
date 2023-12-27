# linkjs
Basic script to connect small servers that will run their own independent scripts.

## Context
Those 24/7 free Discord Bot hsoters that host on Pterodactly, Jexactyl, etc. have low power servers. This essentially just makes a script to connect all those servers to do small tasks, like processing basic data and just horizontally scales servers.

## How it works
Will have a main website that just serves redirect links
Will have as many seperate servers that are running the script

Connect to try to connect to main server (I'll focus on security later probably), through websockets which the main server will then use to distribute data by redirecting users to the other servers where they will probably process specific code pre-implemented onto the server.

# To-Do
Add code for main server
Add code for edge servers
Add code to main the edge servers run specific imported scripts
