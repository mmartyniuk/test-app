#!/usr/bin/env bash
if [ -f /usr/bin/sudo ]; then
       SUDO="/usr/bin/sudo"
   else
       SUDO=""
   fi
$SUDO npm install
$SUDO npm install -g nodemon
$SUDO npm install -g babel-cli
gulp && nodemon index.js --exec babel-node --presets es2015,stage-2
/bin/bash