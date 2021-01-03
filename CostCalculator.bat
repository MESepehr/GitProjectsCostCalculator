title Cost calculator

echo off
cls
git log --all >logs.txt
node TimeLogger.js
del logs.txt
echo .
echo .
pause