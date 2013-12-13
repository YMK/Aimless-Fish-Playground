#!/bin/bash

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "Karma tests running in the background. Watch here for issues"
echo "End to end tests on http://localhost:8000/test/e2e/runner.html"
echo "-------------------------------------------------------------------"

karma start &

echo ""
echo "Starting Web Server"
echo "Web accessible on http://localhost:8000/"
echo "Watch here for http request logs"
echo "-------------------------------------------------------------------"
node scripts/web-server.js &