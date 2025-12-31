#!/bin/bash

# Script to setup GitHub labels
# Usage: ./setup-labels.sh <repo-owner> <repo-name> <github-token>

REPO_OWNER=$1
REPO_NAME=$2
GITHUB_TOKEN=$3

if [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "Usage: ./setup-labels.sh <repo-owner> <repo-name> <github-token>"
  exit 1
fi

API_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/labels"

# Read labels from JSON file
while IFS= read -r line; do
  if [[ $line =~ \"name\":\"([^\"]+)\" ]]; then
    NAME="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"color\":\"([^\"]+)\" ]]; then
    COLOR="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"description\":\"([^\"]+)\" ]]; then
    DESCRIPTION="${BASH_REMATCH[1]}"
    
    # Create label
    curl -X POST "$API_URL" \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      -d "{\"name\":\"$NAME\",\"color\":\"$COLOR\",\"description\":\"$DESCRIPTION\"}"
    
    echo "Created label: $NAME"
  fi
done < "$(dirname "$0")/../labels.json"

echo "Labels setup complete!"

