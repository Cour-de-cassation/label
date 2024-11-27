#!/bin/bash

# Variables
AUTHOR="Saad-Bouh Diallo"
NEW_COMMIT_MESSAGE="docs: SSO documentation" # Change this to your desired message

# Find all commits by the author
commit_hashes=$(git log --author="$AUTHOR" --pretty=format:"%H")

# Check if any commits were found
if [ -z "$commit_hashes" ]; then
    echo "No commits found for author: $AUTHOR"
    exit 1
fi

# Loop through each commit and change the message
for commit in $commit_hashes; do
    echo "Changing message for commit: $commit"

    # Check out the commit (to avoid issues with detached HEAD)
    git checkout "$commit" --quiet

    # Amend the commit message
    git commit --amend --no-edit -m "$NEW_COMMIT_MESSAGE"

    # Note: You may want to create a new branch for each amended commit
done

# Return to the original branch (if needed)
git checkout -