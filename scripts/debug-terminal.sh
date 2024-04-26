#!/bin/bash

touch /tmp/current_tty
touch rm .env

# Script to open a new iTerm2 window and capture TTY
osascript <<EOF
tell application "iTerm"
    set newWindow to (create window with default profile)
    tell current session of newWindow
        write text "tty > /tmp/current_tty"
    end tell
end tell
EOF

# Give iTerm2 a moment to execute and capture the TTY
sleep 1
TTY=$(cat /tmp/current_tty)
rm /tmp/current_tty

# create new .env file
echo "TTY=$TTY" > .env