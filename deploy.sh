#! /bin/bash
grunt build
git config user.name ci
git config user.email ci@lovellfelix.com
git commit -am "Building for deployment"
git remote add production dokku@ny.arawak.space:carnival
git push production master -f
