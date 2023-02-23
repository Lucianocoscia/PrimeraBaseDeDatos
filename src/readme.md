node ./src/server.js -p 8080 -m cluster

pm2 start ./src/server.js -- -p 8080 -m fork
pm2 start ./src/server2.js -f -- -p 8081 -m fork
pm2 start ./src/server2.js -f -- -p 8082 -m fork
pm2 start ./src/server2.js -f -- -p 8083 -m fork
pm2 start ./src/server2.js -f -- -p 8084 -m fork
pm2 start ./src/server2.js -f -- -p 8085 -m fork
