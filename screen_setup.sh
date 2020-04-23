#!/bin/bash

sudo nohup Xvfb :1 -screen 0 1024x768x24 &
export DISPLAY=":1"

