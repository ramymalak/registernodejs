var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    get=require("./get"),
    post=require("./post");
var port=Number(process.env.PORT || 3000);
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var method = req.method;
    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);
    if (method === "GET") {
        if(uri==="/signup" || uri==="/check" || uri==="/questions"){
            get.doservice(req, res,uri);
        }else{
        path.exists(filename, function(exists) {
            if (!exists) {
                res.writeHead(404, {
                    "Content-Type": "text/plain"
                });
                res.write("404 Not Found\n");
                res.end();
                return;
            }
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.write(err + "\n");
                    res.end();
                    return;
                }
                get.getURLParam(req, res,file);
            });
        })};

        //res.writeHead(200);
        //res.write(file, "binary");
        //res.end();
    } else if (method === "POST") {
        post.getPostContent(req, res,uri);

    }

}).listen(port);
console.log("Static file server running at\n  => http://localhost:" + 3000 + "/\nCTRL + C to shutdown");
