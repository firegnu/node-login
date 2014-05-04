
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var LM = require('./modules/lend-manager.js');

var fs = require('fs');

var path = require('path');
var EasyZip = require('easy-zip').EasyZip;

module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});

//return qita dbfile json
    app.get('/dbQitafile', function(req, res) {
        fs.readFile('C:\\SQLDB_DATUM.json', 'utf-8', function(err, data) {
            if(err) {
                res.json({data: "fail"});
            }
            else {
                res.json(data);
            }
        });
    });
//return dem dbfile json
    app.get('/dbfile', function(req, res) {
        var dataJson = [];
        var demData = fs.readFileSync('C:\\SQLDB_DEM.json', 'utf-8');
        var qitaData = fs.readFileSync('C:\\SQLDB_DATUM.json', 'utf-8');
        var imageData = fs.readFileSync('C:\\SQLDB_IMAGE.json', 'utf-8');
        var vectorData = fs.readFileSync('C:\\SQLDB_VECTOR.json', 'utf-8');
        var scanningData = fs.readFileSync('C:\\SQLDB_SCANIMG.json', 'utf-8');
        dataJson.push(vectorData);
        dataJson.push(imageData);
        dataJson.push(demData);
        dataJson.push(scanningData);
        dataJson.push(qitaData);
        res.json(dataJson);
    });

//get worldmap Geojson file
    app.get('/worldmap', function(req, res) {
        fs.readFile('c:\\world.json', 'utf-8' ,function(err, data) {
            res.json(data);
        });
    });

    app.get('/fakeWorldmap', function(req, res) {
        fs.readFile('c:\\world.json', function(err, data) {
            res.json(data);
        });
    });
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
	    }
	});
	
	app.post('/home', function(req, res){
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});

    var addNewLendRecord = function(username, file) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var timeHour = currentDate.getHours();
        var timeMinutes = currentDate.getMinutes();
        var timeSeconds = currentDate.getSeconds();
        var lendDate = day + '/' + month + '/' + year + ' ' + timeHour + ':' + timeMinutes + ':' + timeSeconds;
        LM.addNewLendRecord({
            username 	: username,
            lenddate 	: lendDate,
            lendfile 	: file
        });
    };

    app.post('/Download', function(req, res) {
        if (req.session.user == null){
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        }   else {
            if (!fs.existsSync(req.session.user.name)) {
                fs.mkdirSync(req.session.user.name);
            }
            var downFiles = req.body.image_path.split(',');
            //download multi files
            if(downFiles.length > 1) {
                var zipDownloadFolder = new EasyZip();
                var addZipFileIndex = 0;
                for(var i = 0; i < downFiles.length; i++) {
                    var fileStat = fs.statSync(downFiles[i]);
                    if(fileStat.isFile()) {
                        var fileName = downFiles[i].split('\\');
                        zipDownloadFolder.addFile(fileName[fileName.length - 1], downFiles[i],function() {
                            addZipFileIndex++;
                            zipDownloadFolder.writeToFileSycn(req.session.user.name + '//' + 'download.zip');
                            if(addZipFileIndex === downFiles.length) {
                                res.download(req.session.user.name + '//' + 'download.zip', function() {
                                    for(var j = 0; j < downFiles.length; j++) {
                                        addNewLendRecord(req.session.user.name, downFiles[j]);
                                    }
                                });
                            }
                        });
                    }
                    if(fileStat.isDirectory()) {
                        zipDownloadFolder.zipFolder(downFiles[i], function() {
                            addZipFileIndex++;
                            zipDownloadFolder.writeToFileSycn(req.session.user.name + '//' + 'download.zip');
                            if(addZipFileIndex === downFiles.length) {
                                res.download(req.session.user.name + '//' + 'download.zip', function() {
                                    for(var j = 0; j < downFiles.length; j++) {
                                        addNewLendRecord(req.session.user.name, downFiles[j]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            //download only one file/folder
            else {
                fs.stat(downFiles[0], function (err, stats) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (stats.isFile()) {
                        //download directly
                        res.download(downFiles[0], function() {
                            addNewLendRecord(req.session.user.name, downFiles[0]);
                        });
                    }
                    if (stats.isDirectory()) {
                        //compass first and then download
                        var zipDownloadFolder = new EasyZip();
                        zipDownloadFolder.zipFolder(downFiles[0], function() {
                            zipDownloadFolder.writeToFileSycn(req.session.user.name + '//' + 'download.zip');
                            res.download(req.session.user.name + '//' + 'download.zip', function() {
                                addNewLendRecord(req.session.user.name, downFiles[0]);
                            });
                        });
                    }
                });
            }
        }
    });
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};