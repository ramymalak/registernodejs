var url = require('url');

exports.getURLParam = function(req, res, file) {
    params = url.parse(req.url, true);
    var paramsArr = params.query;

    res.writeHead(200);
    res.write(file, "binary");
    res.end();

};

exports.doservice = function(req, res, uri) {
    if (uri === "/signup") {
        var fs = require("fs");
        fs.readFile('index.html', "binary", function(err, file) {
            if (err) {

                res.write(err + "\n");
                res.end();
                return;
            }
            res.write(file);
            res.end();
        });
    }else if (uri === "/check") {
        var fs = require("fs");
        fs.readFile('check_register.html', "binary", function(err, file) {
            if (err) {

                res.write(err + "\n");
                res.end();
                return;
            }
            res.write(file);
            res.end();
        });
    }else if (uri === "/questions") {
        console.log("inside questions");
        var fs = require("fs");
        fs.readFile('questions.html', "binary", function(err, file) {
            if (err) {

                res.write(err + "\n");
                res.end();
                return;
            }
            res.write(file);
            res.end();
        });

    }else {
        res.end();
    }
};
