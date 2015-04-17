var qs = require("qs");

var getUrl = function (apiMethod, params) {
    var query = qs.stringify(params);

    return "https://api.vk.com/method/" + apiMethod + "?" + query;
};

module.exports = getUrl;