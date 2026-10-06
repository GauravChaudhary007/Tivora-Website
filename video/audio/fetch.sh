#!/bin/sh
# usage: fetch.sh <index> <url>   downloads a generated narration clip (git-ignored)
curl -sf -o "video/audio/clip-$1.wav" "$2" && echo "ok $1"
