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
    var eventdata =[];


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
        
        _readAllVV();
              
            
       
    }
    
    var _readAllVV = function(){
    for(var i = 1; i<25;i++){
     var EVENTS = path.join(VDATA, "vv"+i+".json");
    fs.readFile(EVENTS, function(err, data) {
            var file= JSON.parse(data);  
            var name = file.UeBez;
        var obj = {
            Fak: name,
            vv:JSON.stringify(file)
            };
        
        eventdata.push(obj);
           
            console.log("Read file: success");
              
        });
    }
    console.log(eventdata);
    
    };
    
    
    var count = function(name,ar){
        
        var currentFak=[];
        console.log("\n\n"+name);
        var array_elements = ar;

        array_elements.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
                console.log(current + ' comes --> ' + cnt + ' times ');
                var key = current;
                var curD = {};
                curD[key]=cnt
                currentFak.push(curD);
            }
            current = array_elements[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times');
    }
        var re = new RegExp(/.*Fakultät.*/);
        if(re.test(name)){
        var key = name;
        var res ={};
        res[key]= currentFak;
    return res;   }
        return null;
        

}
    


    /**
     * starts serving a static web site from ./www
     * starts routing api requests from /api/get/*
     */
    function start() {
        server.use(cors());
        server.get("/api/get/days", function (req, res) {
            var summary = [];
            
            for(var f in eventdata){
            var name =eventdata[f].Fak;;
                var bums = JSON.parse(eventdata[f].vv)
                //console.log(bums);
         var days = jsonPath.eval(bums, "$..VZWoTag");
                if(count(name,days)!=null){
                 summary.push(count(name,days));
                }
           
                
//                summary.push({
//                fakultät: name,
//                tage: days
//                
//                })
            }
            
            
            
          // var fakultät =jsonPath.eval(eventdata, "$..Fak");
            //console.log(summary);
            res.send(JSON.stringify(summary));
        });
        
             server.get("/api/get/hours", function (req, res) {
            var summary = [];
            
            for(var f in eventdata){
            var name =eventdata[f].Fak;;
                var bums = JSON.parse(eventdata[f].vv)
                //console.log(bums);
         var days = jsonPath.eval(bums, "$..VZBeginn");
                if(count(name,days)!=null){
                 summary.push(count(name,days));
                }
           
                
//                summary.push({
//                fakultät: name,
//                tage: days
//                
//                })
            }
            
            
            
          // var fakultät =jsonPath.eval(eventdata, "$..Fak");
            //console.log(summary);
            res.send(JSON.stringify(summary));
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
