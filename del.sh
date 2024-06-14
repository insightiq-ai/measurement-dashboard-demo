#!/bin/bash

# Define the directory to search in
DIRECTORY="/Users/abhinandkr/WebstormProjects/measurement-dashboard-demo/src/components/Icons"

# List of files to keep
KEEP_FILES=(
    "users_icon.svg"
    "youtube_demo.svg"
    "link_to_icon.svg"
    "smartphone_line.svg"
    "chrome.svg"
    "total_roi.svg"
    "circular_loader.svg"
    "ctr.svg"
    "youtube_demo.svg"
    "tiktok_demo.svg"
    "instagram_demo.svg"
    "twitter_demo.svg"
    "facebook_demo.svg"
)

# Navigate to the directory
cd "$DIRECTORY"

# Loop over all files in the directory
for file in *; do
    # Check if the current file is in the KEEP_FILES array
    if [[ ! " ${KEEP_FILES[*]} " =~ " $file " ]]; then
        # If the file is not in the keep list, delete it
        echo "Deleting: $file"  # Echo file name for confirmation
        rm -f "$file"          # Uncomment this line to perform deletion
    else
        echo "Keeping: $file"  # Echo file name for keeping
    fi
done
