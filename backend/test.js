const fs = require('fs');

if (!fs.existsSync('myFolder')) {
  fs.mkdirSync('myFolder');
}