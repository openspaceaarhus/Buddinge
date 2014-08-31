#!/bin/bash

for SHA1 in $(git log --pretty="%H")
do
    ./snapshot.sh $SHA1
#    exit
done
