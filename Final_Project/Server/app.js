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
    
    
    
    /* JSONPath Object */
    
    
    
   

    /* http server */
    var server = express();

    /* mensa data */
    var data = {};

    /* configuration */
    var PORT = 3333;
    var WWW = path.join(__dirname, "./www/");
    var DATA = path.join(__dirname, "./data/");
    var PEOPLE = path.join(DATA, "PersTree.json");
    var EVENTS = path.join(DATA, "vv1.json");
    
    var peopledata;


    /**
     * loads the csv formatted mensa data (day,meal) and stores it in a lookup table
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
     * starts routing api requests from /api/get/
     */
    function start() {
        server.use(cors());
        server.get("/api/get/people", function (req, res) {
            console.log(typeof JSON.stringify(peopledata));
            res.send(JSON.stringify(peopledata));
        });
        
         server.use(cors());
        server.get("/api/get/fak", function (req, res) {
            var fak = jsonPath.eval(peopledata, "$...Einrichtung[*]");
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
