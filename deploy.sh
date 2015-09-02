#! /bin/bash
grunt build
git commit -am "Building for deployment"
git remote add production dokku@ny.arawak.space:carnival
git push production master -f
