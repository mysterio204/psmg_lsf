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
    var events= [];
    var timesgeneral=[];
    
    var possibleDates=[];

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
var _getAllDates = function(){
    var types=[];
    
    
    var notimecounter =0;
    var norythmcounter =0;
    var nodates =0;
    var totalfaks=0;
    var totalevents =0;
    
   for(var f in eventdata){
       var timesforfak=[];
            var name =eventdata[f].Fak;;
                
                var bums = JSON.parse(eventdata[f].vv)
                var ver = jsonPath.query(bums, "$..Veranstaltung[*]");
       
       for(var v in ver){
            var id = ver[v].VName;
            var vt = ver[v].VZeit;
           if(vt!=undefined){
           if(vt.VZBeginDat!=undefined){var sd = vt.VZBeginDat;}
           if(vt.VZEndDat!=undefined){var ed = vt.VZEndDat;}
           if(vt.VZBeginn!=undefined){var td = vt.VZBeginn;}
           }
         
        //console.log(id+"  "+vt);
//           if(id!=undefined){
           //console.log(id+"  "+sd+"  "+ed+"  "+td );
               if(sd!=undefined&&ed!=undefined&&td!=undefined){
              var beg= new Date( sd.replace( /(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3") );
                   beg.setHours(td.slice(0,2));
                   beg.setMinutes(td.slice(3));
                var end= new Date( ed.replace( /(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3") );
               //"VZRhythmus": "wöchentlich"
                   
                   if(vt!=undefined){
                   if(vt.VZRhythmus!=undefined){
                       var ryth = vt.VZRhythmus;
                       if(contains(types,ryth)==false){
                       types.push(ryth);
                       }
                   
               var alle = betweenDate(new Date(beg),new Date(end),getRythm(vt.VZRhythmus));
               if(alle.length>0){
              
                   for(var i in alle){
                   timesforfak.push(alle[i]);
                   }
                 
               }
                   }else{//console.log("no rythm" );
                        norythmcounter++;}
               }else{//console.log("no time object");
                    notimecounter++;}
       
       }else{//console.log("no start or end or time");
            nodates++;}

                

        
           totalevents++;
//            }else{console.log("no id")}
   }
       var re = new RegExp(/.*Fakultät\W.*/);
        
    if(re.test(name)){
      var key = name.replace(/Lehrveranstaltungen der Fakultät für /,"");;
        
       var fakk= {name:key,color: _getFakClass(name),data:sortAndCoutTimes(timesforfak)};
       //fakk[key]= sortAndCoutTimes(timesforfak);
       timesgeneral.push(fakk);
       totalfaks++;
           
    
    }
     
       
   }
   timesgeneral= fillUp(timesgeneral);
    

   //console.log("Termine konnten von "+events.length+" Veranstaltungen ermittelt werden");
    console.log("kein rythmus angegeben: "+norythmcounter);
    console.log("kein zeitobjekt: "+notimecounter);
     console.log("keine zeitangaben: "+nodates);
    console.log("fakultäten: "+ totalfaks);
    console.log("events: "+totalevents);
    console.log(possibleDates.length);
    
};
    
    var sortAndCoutTimes = function(arr){
    
    arr.sort(function(a, b) {
    return new Date(a) - new Date(b);
        
});
        
    var secres = [];
    var curT=new Date(arr[0]);
    var cnt=1;
    arr.forEach(function(obj){
        if(contains(possibleDates,new Date(obj).getTime())==false){
                       possibleDates.push(new Date(obj).getTime());
                       }
    if(new Date(obj).getTime() == new Date(curT).getTime()){
        
            cnt++;
    }else{
        
        secres.push({x:new Date(obj).getTime()/1000,y:cnt});
        cnt=1;
        curT=new Date (obj);
    
    }
    
    });
        
    
        return secres;
    
    
    
    };
    
    
var fillUp = function(arr){
    
    
    for(var f in arr){
            for(var i in possibleDates){
                if(hasXValue(arr[f].data,possibleDates[i])==false){
                    var filler = {x:new Date(possibleDates[i]).getTime()/1000,y:0};

                    arr[f].data.push(filler);
           }
        
        }
                arr[f].data.sort(function(a, b) {
        return new Date(a.x) - new Date(b.x);
        
});
        console.log(arr[f].data.length)
     
    }
    
//    for(var f in arr){
//        console.log(arr[f].data.length);
//        console.log(possibleDates.length);
//      for (var i in possibleDates){
//        if(hasXValue(arr[f].data,possibleDates[i])==false) {
//                    
//                    var filler = {x:new Date(possibleDates[i]).getTime(),y:0};
//                    arr[f].data.push(filler);
//            
//        } 
//      }
//    }


return arr;

        
}; 
var contains = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};
var hasXValue = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
    
        if (a[i].x == obj) {
            
            return true;
        }
    }
 
    return false;
};
//    [ 'Blockveranstaltung',
//  'nicht angegeben',
//  'wöchentlich',
//  'Blockveranstaltung + Sa',
//  'Einzeltermin',
//  'nach Vereinbarung',
//  '14-tägig',
//  'dreiwöchentlich' ]
    
var getRythm = function(ryth){
switch(ryth){
        case 'Blockveranstaltung':
        return 1;         
        case 'nicht angegeben':
        return 1;
        case 'wöchentlich':
        return 7;
        case 'Blockveranstaltung + Sa':
        return 1;
        case 'Einzeltermin':
        return 1;
        case 'nach Vereinbarung':
        return 1;
    case '14-tägig':
        return 14;
    case 'dreiwöchentlich':
        return 21;
    default:
        return 1;

}


};    
    
    var _getFakClass = function (currFak){
    switch (currFak){
        case "Lehrveranstaltungen der Fakultät für Rechtswissenschaft":
            return"#CDD30F"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Wirtschaftswissenschaften":
            return"#AEA700"
            break;
        
        case "Lehrveranstaltungen der Fakultät für Katholische Theologie":
            return"#ECBC00"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften":
            return"#EC6200"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Psychologie, Pädagogik und Sportwissenschaft":
            return"#BF002A"
            break;
        
        case "Lehrveranstaltungen der Fakultät für Sprach-, Literatur- und  Kulturwissenschaften":
            return"#9C004B"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Biologie und Vorklinische Medizin":
            return"#4FB800"
            break; 
        
        case "Lehrveranstaltungen der Fakultät für Mathematik":
            return"#009B77"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Physik / Courses in Physics":
            return"#008993"
            break;
            
         case "Lehrveranstaltungen der Fakultät für Chemie und Pharmazie":
            return"#0087B2"
            break;
            
        case "Lehrveranstaltungen der Fakultät für Medizin":
            return"#00556A"
            break; 
        
        default:
            return "#1D3F4B";
    
    }
    
    
    };
 var isDate = function(dateArg) {
    var t = (dateArg instanceof Date) ? dateArg : (new Date(dateArg));
    return !isNaN(t.valueOf());
}
 
 var isValidRange=function(minDate, maxDate) {
    return (new Date(minDate) <= new Date(maxDate));
}
 
var betweenDate= function(startDt, endDt,rythm) {
    var error = ((isDate(endDt)) && (isDate(startDt)) && isValidRange(startDt, endDt)) ? false : true;
    var between = [];
    if (error) console.log('error occured!!!... Please Enter Valid Dates');
    else {
        var currentDate = new Date(startDt),
            end = new Date(endDt);
        while (currentDate <= end) {
            between.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + rythm);
        }
    }
    return between;
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
          server.use(cors());
        server.get("/api/get/events", function (req, res) {
          
            res.send(timesgeneral);
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
    setTimeout(function(){ _getAllDates(); }, 3000);
    setTimeout(function(){ _getDays(); }, 1500);
    setTimeout(function(){ _getHours(); }, 1500);
    
}());
