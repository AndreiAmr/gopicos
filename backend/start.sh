#!/bin/sh

chmod +x ./wait-for.sh
./wait-for.sh

yarn setup

yarn start