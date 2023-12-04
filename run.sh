#/bin/bash

docker build -t the-ship . && docker run -p 80:80 the-ship
