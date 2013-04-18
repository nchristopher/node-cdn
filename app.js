// Generated by CoffeeScript 1.4.0

/* jslint nomen: true, plusplus: true, vars: true, indent: 2, node: true
*/


(function() {
  "use strict";

  var $, CreateFakeApp, ECT, Faker, S3Config, S3CreateNewAppsJSONFile, S3UpdateAppsJSON, S3upload, app, appdir, apps, apps_file_url, apps_filename, cleanbodyjson, client, ectRenderer, exampleapp, express, fs, knox, port, uniqueId,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  express = require('express');

  $ = require('jquery');

  ECT = require('ect');

  fs = require('fs');

  Faker = require('Faker');

  require('js-yaml');

  S3Config = require('./config/S3.yml');

  knox = require('knox');

  client = knox.createClient(S3Config);

  appdir = '/apps/';

  apps_filename = 'apps.json';

  apps_file_url = 'https://' + S3Config['bucket'] + '.s3.amazonaws.com' + appdir + apps_filename;

  console.log("apps.json is: " + apps_file_url);

  port = process.env.PORT || 5000;

  /* MUST Move these Methods to Lib in Next sprint
  */


  uniqueId = function(length) {
    var id;
    if (length == null) {
      length = 18;
    }
    id = '_TEST';
    while (id.length < length) {
      id += Math.random().toString(36).substr(2);
    }
    return id.substr(0, length);
  };

  CreateFakeApp = function() {
    var exampleapp, _ref;
    exampleapp = require('./public/app-example.json');
    exampleapp['Active__c'] = false;
    exampleapp['Id'] = uniqueId(18);
    exampleapp['Mandatory__c'] = (_ref = Math.random() < 0.5) != null ? _ref : {
      "true": false
    };
    exampleapp['Name'] = Faker.random.bs_buzz();
    exampleapp['Description__c'] = Faker.Lorem.sentence();
    return exampleapp;
  };

  S3upload = function(filename, jsonstr) {
    var req;
    req = client.put(appdir + filename, {
      'Content-Length': jsonstr.length,
      'Content-Type': 'application/json',
      'x-amz-acl': 'public-read'
    });
    req.on('response', function(res) {
      if (200 === res.statusCode) {
        return console.log('saved to %s', req.url);
      }
    });
    return req.end(jsonstr);
  };

  S3UpdateAppsJSON = function(newapp) {
    var existing_apps;
    console.log(newapp['Id']);
    existing_apps = [];
    return $.getJSON(apps_file_url, function(apps) {
      var app, appsnew, _i, _len, _ref;
      console.log("There are " + apps.length + " Apps");
      if (apps.length > 0) {
        for (_i = 0, _len = apps.length; _i < _len; _i++) {
          app = apps[_i];
          existing_apps.push(app['Id']);
          if (app['Id'] === newapp['Id']) {
            app = newapp;
          }
        }
      } else {
        S3CreateNewAppsJSONFile(newapp);
      }
      if (_ref = newapp['Id'], __indexOf.call(existing_apps, _ref) >= 0) {
        return S3upload(apps_filename, JSON.stringify(apps));
      } else {
        console.log("*NEW* App: " + newapp['Id']);
        apps.push(newapp);
        console.log("Number of apps with *New* App: " + apps.length);
        appsnew = apps;
        return S3upload(apps_filename, JSON.stringify(appsnew));
      }
    }).error(function() {
      console.log('error fetching apps.json ... CREATE it!');
      return S3CreateNewAppsJSONFile(newapp);
    });
  };

  S3CreateNewAppsJSONFile = function(newapp) {
    var apps;
    apps = [];
    apps.push(newapp);
    return S3upload(apps_filename, JSON.stringify(apps));
  };

  exampleapp = require('./public/app-example.json');

  apps = S3UpdateAppsJSON(exampleapp);

  /* The Mini Express App
  */


  app = module.exports = express();

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express["static"](__dirname + '/public'));
    app.use(express["static"](__dirname + '/spec'));
    app.use(express["static"](__dirname + '/lib'));
    return app.use(express["static"](__dirname + '/apps'));
  });

  ectRenderer = ECT({
    watch: true,
    root: __dirname + '/views'
  });

  app.engine('.html', ectRenderer.render);

  app.get('/', function(req, res) {
    return res.render('layout.html', {
      title: 'Hello!'
    });
  });

  app.get('/upload', function(req, res) {
    return res.render('uploadform.html', {
      title: 'Basic Uploader Form'
    });
  });

  cleanbodyjson = function(dirty) {
    var len, pos1, pos2, pos3, pos4;
    console.log("........................         BODY IS DIRTY!! :-( ");
    console.dir(dirty);
    console.log("........................   ");
    console.log("     TYPE : " + (typeof dirty));
    if (typeof dirty === 'object') {
      if (dirty['json'] === !void 0) {
        dirty = JSON.stringify(dirty['json']);
      } else {
        dirty = JSON.stringify(dirty);
      }
      dirty.replace(/\\"/g, '"');
    }
    len = dirty.length;
    console.log("Length: " + len);
    pos1 = dirty.search(/{"attributes":/);
    console.log("Pos1:" + pos1);
    if (pos1 > 0) {
      console.log("found {\"attributes\": at " + pos1);
      dirty = dirty.slice(pos1, len);
    }
    pos2 = dirty.search(/,"Featured__c":false}'/);
    console.log("Pos2:" + pos2);
    if (pos2 > 0) {
      console.log("found :false} at " + pos2);
      dirty = dirty.slice(0, pos2 + 21);
    }
    pos3 = dirty.search(/,"Featured__c":true}/);
    console.log("Pos3:" + pos3);
    if (pos3 > 0) {
      console.log("found :true} at " + pos3);
      dirty = dirty.slice(0, pos3 + 20);
    }
    pos4 = dirty.search(/' }]/);
    console.log("Pos4:" + pos4);
    if (pos4 > 0) {
      console.log("found ' }] at " + pos4);
      dirty = dirty.slice(0, pos4);
    }
    console.log("CLEAN: " + dirty);
    return dirty;
  };

  app.post('/upload', function(req, res, next) {
    var filename, json, newapp;
    console.log('..................................>> req.body:');
    console.dir(req.body);
    console.log('..................................<< req.body');
    try {
      console.log('..................................??? req.body.json');
      console.dir(req.body.json);
      console.log('..................................??? req.body.json');
    } catch (error) {
      console.log("InVALID JSON");
    }
    if (req.body.json === void 0) {
      json = req.body;
    } else {
      json = req.body.json;
    }
    try {
      json = cleanbodyjson(json);
      newapp = JSON.parse(json);
      newapp = cleanbodyjson(json);
      newapp = JSON.parse(json);
    } catch (error) {
      console.log("InVALID JSON");
      throw error;
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW APP');
    console.dir(newapp);
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NEW APP');
    console.log('>>> STRING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW APP');
    console.log(JSON.stringify(newapp));
    console.log('<<< STRING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NEW APP');
    filename = newapp['Id'] + '.json';
    S3upload(filename, JSON.stringify(newapp));
    console.log('\n # # # # # # # # # \n');
    console.dir(newapp);
    console.log('\n # # # # # # # # # \n');
    S3UpdateAppsJSON(newapp);
    console.log('\n ------------------- NEXT CALL --------------------- \n');
    return res.send(newapp);
  });

  app.get('/uploadraw', function(req, res) {
    return res.render('uploadraw.html', {
      title: 'Basic Uploader Form'
    });
  });

  app.post('/uploadraw', function(req, res) {
    var filename, newapp, raw;
    raw = $.parseJSON(req.body.json);
    newapp = raw['json'];
    filename = newapp['Id'] + '.json';
    S3upload(filename, JSON.stringify(newapp));
    console.log('\n # # # # # # # # # RAW START \n');
    console.dir(newapp);
    console.log('\n # # # # # # # # # RAW END \n');
    S3UpdateAppsJSON(json);
    console.log('\n ------------------- NEXT CALL --------------------- \n');
    return res.end();
  });

  app.get('/fakeapp', function(req, res) {
    exampleapp = CreateFakeApp();
    return res.send(exampleapp);
  });

  app.get('/tdd', function(req, res) {
    return res.render('SpecRunner.html', {
      title: 'Test Runner'
    });
  });

  app.get('/s3url', function(req, res) {
    return res.send({
      url: 'http://' + S3.S3Config.bucket + '.s3.amazonaws.com/'
    });
  });

  app.get('/appsjson', function(req, res) {
    return $.getJSON(apps_file_url, function(json) {
      return res.send(json);
    });
  });

  app.listen(port);

  console.log("Express started on port " + port);

}).call(this);
