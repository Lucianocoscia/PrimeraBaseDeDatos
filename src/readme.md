node ./src/server.js -p 8080 -m cluster

pm2 start ./src/server.js -- -p 8080 -m fork
pm2 start ./src/server2.js -f -- -p 8081 -m fork
pm2 start ./src/server2.js -f -- -p 8082 -m fork
pm2 start ./src/server2.js -f -- -p 8083 -m fork
pm2 start ./src/server2.js -f -- -p 8084 -m fork
pm2 start ./src/server2.js -f -- -p 8085 -m fork

//profilin
-node --prof ./src/server.js
-artillery quick --count 10 -n 50 "http://localhost:3000/info-gzip" > reporte_info.txt // se queda colgado y no frena nunca
-cambiar el nombre al archivo isolated al nombre q quiera
-node --prof-process (el nombre q le puse al archivo, le puse reportev8) > reporte_v8-info.txt
