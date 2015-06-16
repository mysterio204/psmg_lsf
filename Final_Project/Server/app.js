(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
    var express = require("express");
    var path = require("path");
    var fs = require("fs");
    var cors = require("cors");
    var csvtojson = require("csvtojson");
    var jsonPath = require('jsonpath');
    
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
    var allData = {};
    var d ;


    /*
     * reads in the xml file needed and parses it into json. The Data is stored in a global variable
     * console logs appear when the server is online and the file is read in 
     */
    function initData() {
       
        _readPersData(); 
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
        
            var monday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Mo')].VZBeginn");
            var tuesday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Di')].VZBeginn");
            var wednesday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Mi')].VZBeginn");
            var thursday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Do')].VZBeginn");
            var friday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Fr')].VZBeginn");
            var saturday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='Sa')].VZBeginn");
            var sunday = jsonPath.query(bums, "$..VZeit[?(@.VZWoTagKurz=='So')].VZBeginn");
              
        
                   
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
        
        
       var arr = jsonPath.query(hours, "$.*");
   
        
        for( var faculties=0; faculties<arr.length;faculties++){
              var currFac = arr[faculties];
              var days = jsonPath.query(currFac,"$.*");
              var facName = Object.getOwnPropertyNames(currFac)[0];
              var exactDays = days[0];

            
           
            

               for(var days = 0 ; days<exactDays.length; days++){
                        
                        var currDay = exactDays[days];
                        var dayValue = jsonPath.query(currDay, "$.*")[0];
                        var dayName = Object.getOwnPropertyNames(currDay)[0];
        
                facs.push({
                name: facName,
                day : dayName,
                time : dayValue
            }
            );
         
             }
        }  
        
        
         var hours = "hours";
        
        allData[hours]=facs;
        
    };
    
    var _readPersData = function(){
        
        
           fs.readFile(PEOPLE, function(err, data) {
                          
            peopledata = JSON.parse(data);
            console.log("server status : online ");
            console.log("Read file Person-Data : success");
               
            var structure = jsonPath.query(peopledata, "$.Ueberschrift[*].Einrichtung");
            
            var PersonArray = _fillArrayWithPersonData(structure);   
               
               
              
        });
    
    };
    
    var _fillArrayWithPersonData = function (data){
        
                var persArr = [];

    
        for(var i = 0 ; i < data.length; i++){
            
          var personalArray = [];

          var name = data[i].EinBez;
          var value = data[i].Funktion;
            
           
        

            
            
           

           for(var j = 0 ; j < value.length; j++){
               

               
               
               if(value[j].hasOwnProperty('Personal')==true){

               var person = value[j].Personal;
                   
                   
               if(person.hasOwnProperty('PerID')==true ){
                   
               var id = person.PerID;

                    personalArray.push({
                    personID : id 
                 });
                                   
               }
                   else{
                   
                   
                   for(var k = 0 ; k < person.length; k++){
                       var id = person[k].PerID;
                        personalArray.push({
                        personID : id
                     
                 
                     
                 });
                
                   }
               }
               
           }
                     
               
           }
            
            
            
         var staffCount = personalArray.length;
            
            if(staffCount == 0){
                staffCount=1;
            }
          
         
               persArr.push({
                
                FakName : name, 
                Personal: staffCount
            
            });
            
            
     }
        
        
                    d = persArr;
        

         
    };
    

    
    var _getDays = function(){
    
    for(var f in eventdata){
            var name =eventdata[f].Fak;;
                
                var bums = JSON.parse(eventdata[f].vv)
                var days = jsonPath.query(bums, "$..VZWoTag");
                if(count(name,days)!=null){
                 allDays.push(count(name,days));
                }
        
        
           
            }
        
          
        
        var days = "days";
        
        allData[days]=allDays;
        
    };
    
  
    
    var count = function(name,ar){
        
        var currentFak=[];
        var array_elements = ar;

        array_elements.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
               // var key = current;
               // var curD = {};
               // curD[key]=cnt
                currentFak.push({
                weekday : current,
                freq : cnt
                });
            }
            current = array_elements[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
    }
        var re = new RegExp(/.*Fakultät.*/);
        if(re.test(name)){
        var key = name;
        var res = {};
        res[key]= currentFak;
    return res;   }
        return null;
        

}
    
var countHours = function(name,ar){
        
        var currentFak=[];
        var array_elements = ar;

        array_elements.sort();
            

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
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
    }
        var re = new RegExp(/.*Fakultät.*/);
        
    if(re.test(name)){
    
        return currentFak;   
    
    }
    
    
    
        return null;
        

}
        
         
    


    /**
     * starts serving a static web site from ./www
     * starts routing api requests from /api/get/*
     */
    function start() {
        server.use(cors());
        
        server.get("/api/get/days", function (req, res) {
            
            

            res.send(JSON.stringify(allDays));
        });
        
            server.get("/api/get/hours", function (req, res) {
       
            
            
           
            
            res.send(JSON.stringify(facs));
          
        });
        
        server.use(cors());
        server.get("/api/get/fak", function (req, res) {
            var fak = jsonPath.query(peopledata, "$.Ueberschrift[*].Einrichtung");
            res.send(JSON.stringify(d));
        });
        
        
           server.use(cors());
        server.get("/api/get/allData", function (req, res) {
          
            res.send(allData);
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
