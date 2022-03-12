#!/bin/bash
i=0; temp=$(mktemp -p .); for file in "$1/$2"*
do
mv "$file" $temp;
mv $temp $(printf "$1/%0.3d.png" $i)
i=$((i + 1))
done
