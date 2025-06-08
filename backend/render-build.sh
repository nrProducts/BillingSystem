#!/usr/bin/env bash

# Install backend dependencies
cd backend
npm install

# Manually install Chromium for Puppeteer
npx puppeteer browsers install chrome
