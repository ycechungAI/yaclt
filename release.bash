#!/usr/bin/env bash

yarn version --no-git-tag-version
yaclt prepare-release
git add .
git diff --staged -- package.json
git status

PACKAGE_VERSION=$(cat package.json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g')

read -p "Do these changes look correct and is $PACKAGE_VERSION the correct version? (Y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Creating release $PACKAGE_VERSION"
  git commit -m "Bump version to $PACKAGE_VERSION"
  git tag $PACKAGE_VERSION

  read -p "Created tag $PACKAGE_VERSION, push and release? (Y/n)" -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push
    git push --tags
  fi
else
  exit 1
fi
