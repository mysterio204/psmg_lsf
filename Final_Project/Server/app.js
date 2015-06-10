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
    
    var filesloaded = false;
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
    var allHours = [];
    var allDays = [];
    var facs =[];



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
           
              
        });
    }
//    console.log(eventdata);
     
    filesloaded = true;
    };
    var _getHours = function(){
            console.log("calulating hours...");
                 
            
            for(var f in eventdata){
            var name =eventdata[f].Fak;
            var bums = JSON.parse(eventdata[f].vv);
               
            var monday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Mo')].VZBeginn");
            var tuesday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Di')].VZBeginn");
            var wednesday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Mi')].VZBeginn");
            var thursday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Do')].VZBeginn");
            var friday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Fr')].VZBeginn");
            var saturday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='Sa')].VZBeginn");
            var sunday = jsonPath.eval(bums, "$..VZeit[?(@.VZWoTagKurz='So')].VZBeginn");
               
                var re = new RegExp(/.*Fakultät.*/);
                if(re.test(name)){
                    var mo = {monday:countHours(name,monday)};
                    var di = {tuesday:countHours(name,tuesday)};
                    var mi = {wednesday:countHours(name,wednesday)};
                    var don = {thursday:countHours(name,thursday)};
                    var fr = {friday:countHours(name,friday)};
                    var sa = {saturday:countHours(name,saturday)};
                    var so = {sunday: countHours(name,sunday)};
                    
                    var key = name;
                    var result =[];
                    result.push(mo);
                    result.push(di);
                    result.push(mi);
                    result.push(don);
                    result.push(fr);
                    result.push(sa);
                    result.push(so);
                    
                    
                    var res2 ={};
                    res2[key]=result;
                    
                    
                    allHours.push(res2);

                }
           
            }

            console.log("Hours: ready");
                _implementNewDataStructure(allHours);

            };
    
    var _implementNewDataStructure = function(hours){
        
        
       var arr = jsonPath.eval(hours, "$.*");
     /*  var monday,
        tuesday,
        wednesday, 
        thursday, 
        friday,
        saturday,
        sunday;*/
        
        
      
        
      
        
        for( var faculties=0; faculties<arr.length;faculties++){
              var currFac = arr[faculties];
              var days = jsonPath.eval(currFac,"$.*");
              var facName = Object.getOwnPropertyNames(currFac)[0];
              var exactDays = days[0];
            
           
            
               for(var days = 0 ; days<exactDays.length; days++){
                        
                        var currDay = exactDays[days];
                        var dayValue = jsonPath.eval(currDay, "$.*")[0];
                        var dayName = Object.getOwnPropertyNames(currDay)[0];
               
                   
               /*    if(dayName=="monday"){
                       monday = dayValue;
                   }
                   
                     if(dayName=="tuesday"){
                       tuesday = dayValue;
                   }
                   
                     if(dayName=="wednesday"){
                       wednesday = dayValue;
                   }
                   
                     if(dayName=="thursday"){
                       thursday = dayValue;
                   }
                   
                     if(dayName=="friday"){
                       friday = dayValue;
                   }
                   
                     if(dayName=="saturday"){
                       saturday = dayValue;
                   }
                   
                     if(dayName=="sunday"){
                       sunday = dayValue;
                   }
                   */
                   
                facs.push({
                name: facName,
               /* Montag:monday,
                Dienstag:tuesday,
                Mittwoch:wednesday,
                Donnerstag:thursday,
                Freitag:friday,
                Samstag:saturday,
                Sonntag:sunday*/
                day : dayName,
                time : dayValue
            }
            );

                    
                    
                }
             
            
        }        
        
    };
    

    
    var _getDays = function(){
    
    for(var f in eventdata){
            var name =eventdata[f].Fak;;
                
                var bums = JSON.parse(eventdata[f].vv)
         var days = jsonPath.eval(bums, "$..VZWoTag");
                if(count(name,days)!=null){
                 allDays.push(count(name,days));
                }
           
            }
    
    
    };
    
    
    var count = function(name,ar){
        
        var currentFak=[];
       // console.log("\n\n"+name);
        var array_elements = ar;

        array_elements.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
               // console.log(current + ' comes --> ' + cnt + ' times ');
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
        //console.log(current + ' comes --> ' + cnt + ' times');
    }
        var re = new RegExp(/.*Fakultät.*/);
        if(re.test(name)){
        var key = name;
        var res ={};
        res[key]= currentFak;
    return res;   }
        return null;
        

}
    
        var countHours = function(name,ar){
        
        var currentFak=[];
       // console.log("\n\n"+name);
        var array_elements = ar;

        array_elements.sort();
            

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
                //console.log(current + ' comes --> ' + cnt + ' times ');
                var key = current;
                var curD = {};
                curD[key]=cnt
                var hourobj = {"hour":current,"freq":cnt};
                
                
                currentFak.push(hourobj);
            }
            current = array_elements[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        //console.log(current + ' comes --> ' + cnt + ' times');
    }
        var re = new RegExp(/.*Fakultät.*/);
        if(re.test(name)){
        var key = name;
        var res ={};
        res[key]= currentFak;
    return currentFak;   }
        return null;
        

}
        
         
    


    /**
     * starts serving a static web site from ./www
     * starts routing api requests from /api/get/*
     */
    function start() {
        server.use(cors());
        
        server.get("/api/get/days", function (req, res) {
            
            

            res.send(JSON.stringify(facs));
        });
        
            server.get("/api/get/hours", function (req, res) {
       
            
            
           
            
            res.send(JSON.stringify(facs));
          
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
    setTimeout(function(){ _getDays(); }, 3000);
    setTimeout(function(){ _getHours(); }, 3000);
    
}());
