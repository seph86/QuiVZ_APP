fs = require("fs");
glob = require("glob");
console.log("Sourcing...");

glob( "./build/static/*/*", function(err, files) { 
    // Do something here with files found
});

