const fs = require('fs');
const path = require('path');

module.exports = function (robot, scripts) {
  let scriptsPath = path.resolve(__dirname, 'src');
  return fs.exists(scriptsPath, function (exists) {
    if (exists) {
      (() => {
        let result = [];
        let scripts = fs.readdirSync(scriptsPath);
        for (let script of scripts) {
          if (scripts.includes('*')) {
            result.push(robot.loadFile(scriptsPath, script));
          } else if (scripts.includes(script)) {
            result.push(robot.loadFile(scriptsPath, script));
          }
        }
        return result;
      })();
    }
  });
};
