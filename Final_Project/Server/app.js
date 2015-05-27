(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
    var express = require("express");
    var path = require("path");
    var fs = require("fs");
    var cors = require("cors");
    var csvtojson = require("csvtojson");
    var jsonPath = require('JSONPath');
    
    /* http server */
    var server = express();

    /* mensa data */
    var data = {};

    /* configuration */
    
    var PORT = 3333;
    var WWW = path.join(__dirname, "./www/");
    var PDATA = path.join(__dirname, "./parsedPD/");
    var VDATA = path.join(__dirname, "./parsedVV/");
    var PEOPLE = path.join(PDATA, "PersonenDaten.json");
    var EVENTS = path.join(VDATA, "vv1.json");
    
    var peopledata;


    /*
     * reads in the xml file needed and parses it into json. The Data is stored in a global variable
     * console logs appear when the server is online and the file is read in 
     */
    function initData() {
          fs.readFile(PEOPLE, function(err, data) {
                          
            peopledata = JSON.parse(data);
            console.log("server status : online ");
            console.log("Read file: success");
              
        });
            
       
    }

    /**
     * starts serving a static web site from ./www
     * starts routing api requests from /api/get/*
     */
    function start() {
        server.use(cors());
        server.get("/api/get/people", function (req, res) {
            res.send(JSON.stringify(peopledata));
        });
        
        server.use(cors());
        server.get("/api/get/fak", function (req, res) {
            var fak = jsonPath.eval(peopledata, "$.Ueberschrift[*].Einrichtung.Funktion");
            res.send(JSON.stringify(fak));
        });
        
        
    
    
//        server.get("/api/get/meals/*", function (req, res) {
//            var requestedDay = req.params[0];
//            res.send({
//                day: requestedDay,
//                meal: getMealForDay(requestedDay)
//            });
//        });
        server.use(express.static(WWW));
        server.listen(PORT);
    }

    initData();
    start();
}());
