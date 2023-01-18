require("core-js/stable");
const holegen = require("./holegen.js");

module.exports =  {
  getData: holegen.getData,
  getTestResult: holegen.getTestResult,
  executeClipper: holegen.executeClipper,
  executeOffset: holegen.executeOffset
};
