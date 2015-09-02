#! /bin/bash

git remote add production echo $SERVER_ADDRESS
git push production master -f
