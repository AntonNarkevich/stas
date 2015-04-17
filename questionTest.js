var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question("What1", function (ans) {
    console.log(ans);
});

console.log("log")

rl.question("What2", function (ans) {
    console.log(ans);
});

rl.question("What3", function (ans) {
    console.log(ans);
});