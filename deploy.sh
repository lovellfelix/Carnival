#! /bin/bash

grunt build
git commit -am "Building for deployment"
git remote add production echo $SERVER_ADDRESS
git push production master -f
