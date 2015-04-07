var dump = require("./dump.json");
var fs = require("fs");
var _ = require("lodash");

var dump2 = _.take(dump, 1);

fs.writeFile("dump2.json", JSON.stringify(dump2));
