var url = require('url');
var myParse = require('node-parse-api').Parse;
var request = require('request');
var options = {
    app_id: 'VtAjy6BIVr4W0MQEgjNzM3ICRDo3aY99How88x1H',   //,'pDtAUHjSAtHMTLe6zBxg63ErnnljvnMbRpyCPvlN'
    api_key: 'Xiwg1hTtE8wZ26PnIwXkcim1TlWpaZynyer3yegj'  //  master_key:'...''91ZFcZIyABToFORuw4r7pVi13hoxrpkyTtdzvWyT' could be used too
}

var app = new myParse(options);
var fParse= require('parse/node').Parse;

fParse.initialize('VtAjy6BIVr4W0MQEgjNzM3ICRDo3aY99How88x1H','QamFPX8Nz8podCO3irExdYcLwK5pZmB8fyXLPRWK');
localStorage = require('localStorage');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
exports.getPostContent = function(req, res, uri) {
    var data = "";
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        if (uri === "/adduser") {
            //res.writeHead(200);
            //res.write("inside adduser");
            data = JSON.parse(data);
            console.log(req.connection.remoteAddress);
            if (data.captcha!=null) {



            request("https://www.google.com/recaptcha/api/siteverify?secret=6LewMg0TAAAAAGjXPeujN2PWYaLWVSAGoTXrKtLu&response=" + data.captcha + "&remoteip=" + req.connection.remoteAddress, function (error, response, body) {
                if (error) {
                    console.log(error) // Show the HTML for the Google homepage.
                    res.end();
                }
                //console.log(response);
                //console.log();
                if (JSON.parse(body).success) {
                    if (data.password.length >= 8 && data.password === data.confirmPassword && re.test(data.email) && data.fullName.replace(/\s/g, '').length >= 5) {
                        delete data.confirmPassword;
                        delete data.captcha;
                        data.email = data.email.toLowerCase();
                        if (!data.image) {
                            data.image = '';
                        }
                        console.log("before save file");
                        data.image = new fParse.File('user.png', {base64: data.image}, "image/png");
                        data.image.save().then(function () {
                            console.log("after save file");

                            if (!data.image) {
                                delete data.image;
                            }
                            data.username = data.email;
                            data = JSON.stringify(data);
                            console.log(data);
                            app.insertUser(data, function (err, response) {
                                if (err) {
                                    console.log("database error");

                                    console.log(JSON.stringify(err));
                                    res.write("2:");
                                    res.end(JSON.stringify(err.error));

                                    return;
                                }
                                console.log("File created and saved in Parse")
                                console.log(response);
                                // res.write("inside adduser");
                                // res.write(JSON.stringify(response));
                                data = JSON.parse(data);
                                var fs = require("fs");
                                //var css1 = fs.readFileSync('bootstrap/css/bootstrap.css');
                                //var css2 = fs.readFileSync('css/flat-ui.css');
                                //var css3 = fs.readFileSync('css/style.css');
                                //var css4 = fs.readFileSync('css/style.complete.css');


                                fs.readFile('header.html', function (err, eheader) {
                                    if (err) {

                                        res.write(err + "\n");
                                        res.end();
                                        return;
                                    }

                                    fs.readFile('Email.html', function (err, wemail) {
                                        if (err) {

                                            res.write(err + "\n");
                                            res.end();
                                            return;
                                        }

                                        var welemail = require("emailjs/email");
                                        var server = welemail.server.connect({
                                            user: "noreply@digipharma.me",
                                            password: "DigiPharma@123",
                                            host: "mail.digipharma.me",
                                            ssl: false,
                                            tls: true
                                        });
                                        var total = eheader+"Dear "+data.fullName+",</h2></div>"+wemail;
                                        //fs.writeFileSync('mytry.html',total);
                                        server.send({
                                            from: "noreply@digipharma.me",
                                            to: data.email,
                                            subject: "confirmation Email",
                                            text:"confirm my mail",
                                            attachment: [
                                                {data: total, alternative: true},
                                            ]
                                        }, function (err, message) {
                                            if (err) {
                                                res.write("error while sending email");
                                                console.log(err);
                                                res.end("something went wrong");
                                                return;
                                            }
                                            console.log(message);
                                            res.write("1:");
                                            //res.end('Message sent: ' + message);

                                            //var fs = require("fs");
                                            fs.readFile('ThankYou.html', "binary", function(err, thanksfile) {
                                                if (err) {

                                                    res.write(err + "\n");
                                                    res.end();
                                                    return;
                                                }
                                                res.write(thanksfile);
                                                res.end();
                                            });
                                        });






                                    });







                                });


                                //var nodemailer = require('nodemailer');

                                // create reusable transporter object using SMTP transport
                                //var transporter = nodemailer.createTransport({
                                //    host: 'mail.digipharma.me',
                                //    secure: true, // use SSL
                                //    port: 25, // port for secure SMTP
                                //    auth: {
                                //        user: 'noreply@digipharma.me',
                                //        pass: 'DigiPharma@123'
                                //    }
                                //    //,
                                //    //tls: {
                                //    //    rejectUnauthorized: false
                                //    //}
                                //});
                                //var mailOptions = {
                                //    from: 'noreply@digipharma.me', // sender address
                                //    to: data.email, // list of receivers
                                //    subject: 'Hello app', // Subject line
                                //    text: 'Welcome to Our Application. Your Account has created Successfully'  // plaintext body
                                //};
                                //transporter.sendMail(mailOptions, function(error, info) {
                                //    if (error) {
                                //        res.write("error while sending email");
                                //        console.log(error);
                                //        res.end("something went wrong");
                                //    }
                                //    res.write("1:");
                                //    //res.end('Message sent: ' + info.response);
                                //    var fs = require("fs");
                                //    fs.readFile('links.html', "binary", function(err, file) {
                                //        if (err) {
                                //
                                //            res.write(err + "\n");
                                //            res.end();
                                //            return;
                                //        }
                                //        res.write(file);
                                //        res.end();
                                //    });
                                //
                                //});


                            });


                        }, function (error) {
                            console.log(error);
                        });


                    } else {
                        res.write("3:");
                        var validation_errors = "";

                        if (data.password.length < 8) {
                            console.log("password must be greater than or equal 8 characters");
                            validation_errors += ("password must be greater than or equal 8 characters<br/>");
                        }
                        if (data.password !== data.confirmPassword) {
                            console.log("confirmed password does not match password");
                            validation_errors += ("confirmed password does not match password<br/>");
                        }
                        if (!re.test(data.email)) {
                            console.log("not a valid email");
                            validation_errors += ("not a valid email<br/>");
                        }

                        if (data.fullName.replace(/\s/g, '').length < 5) {
                            console.log("fullname must be greater than or equal 5 characters");
                            validation_errors += ("fullname must be greater than or equal 5 characters<br/>");
                        }

                        res.end(validation_errors);

                    }

                } else {
                    res.end();
                }
            })
        }else {
            res.end();
        }

        }else  if (uri === "/checkuser") {
            data = JSON.parse(data);
            console.log(data.email);
            if(re.test(data.email) && data.email!=''){
                var query = {
                    where: {
                        email: data.email
                    },
                    limit: 1
                };
                app.find('Registerd', query, function (err, response) {
                    if(err){
                        console.log(err);
                        res.end();
                        return;
                    }
                    console.log(response.results);
                    console.log(response.results.length);
                    if(response.results.length==1){
                        res.write('<div> Welcome Dr. '+response.results[0].name+'</div>'+'<div>Your registration number is '+response.results[0].objectId+'</div>'+'<div><a href="http://localhost:3000/check">Back</a></div>');
                        res.end();
                    }else{
                        res.write('<div> There is no registration with this email: '+data.email+'</div>'+'<div>Please review your issue with the Help desk</div>'+'<div><a href="http://localhost:3000/check">Back</a></div>');
                        res.end();
                    }
                });

            }else{
                res.write("enter a valid email");
                res.end();
            }
        }else if (uri === "/allquestions") {
            console.log("inside allquestions");
            app.find('Questions','', function (err, response) {
                if(err){
                    console.log(err);
                    res.end();
                    return;
                }
                console.log(response);
                res.end(JSON.stringify(response.results));
            });
        }else{
            res.end();
        }


    });
};