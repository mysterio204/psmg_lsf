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
    
    /* vars needed */

    var data = {};
    var events= [];
    var timesgeneral=[];
    var eventsperfak=[];
    var possibleDates=[];

    /* configuration of the server */
    
    var PORT = 3333;
    var WWW = path.join(__dirname, "./www/");
    var PDATA = path.join(__dirname, "./parsedPD/");
    var VDATA = path.join(__dirname, "./parsedVV/");
    var PEOPLE = path.join(PDATA, "PersonenDaten.json");
    var EVENTS = path.join(VDATA, "vv1.json");
    
    /*vars needed */
    
    var peopledata;
    var eventdata =[];
    var allHours = [];
    var allDays = [];
    var facs =[];
    var allData = {};
    var d ;
    var persCount=0;


    /*
    Call the functions that load the json files
     */
    function initData() {
       
        _readPersData(); 
        _readAllVV();
        
        
            
       
    }
    
    /*
    read all files that contain the information about the events 
    */
    
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

     
    filesloaded = true;
    };
    
    /*
    get the time of all events, sorted by the day of the week they take place
    */
    
    var _getHours = function(){
            console.log("calulating hours...");
        
        for(var f in eventdata){
            
            var name =eventdata[f].Fak;
            var onefak = JSON.parse(eventdata[f].vv);
        
            var monday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Mo')].VZBeginn");
            var tuesday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Di')].VZBeginn");
            var wednesday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Mi')].VZBeginn");
            var thursday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Do')].VZBeginn");
            var friday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Fr')].VZBeginn");
            var saturday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='Sa')].VZBeginn");
            var sunday = jsonPath.query(onefak, "$..VZeit[?(@.VZWoTagKurz=='So')].VZBeginn");
              
        
                   
                var re = new RegExp(/.*Fakultät.*/);
           
                if(re.test(name)){
                     if(hasFak(allHours,name)==false){
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
            }

            console.log("Done");
                _implementNewDataStructure(allHours);
        
        
            

            };
    /*
    arrange the data in a new json style which is more easy to handle 
    */
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
    /*
    read the json file which contains the information about the staff
    */
      var _readPersData = function(){
        
        
           fs.readFile(PEOPLE, function(err, data) {
                          
            peopledata = JSON.parse(data);
            
            console.log("Read file Person-Data : success");
               
            var structure = jsonPath.query(peopledata, "$.*");
            
            var PersonArray = _fillArrayWithPersonData(structure);   
               
               
              
        });
    
    };
    /*
    get the needed information about the staff and their relations
    @Exception: Some of the Staff is not fetched due to inconsitency of the raw-data.
    */
   var _fillArrayWithPersonData = function (data){

                var persArr = [];
                var dataSet = data[0];
                var chaircounter = 0 ;
       
       
       /* get all the Staff that is directly employed at the faculties */
    
        for(var i = 0 ; i < dataSet.length; i++){
            
          var personalArray = [];
              var chairArr = [];

       
              if(dataSet[i].hasOwnProperty('Einrichtung')==true ){
                  
                     var FacultyName = dataSet[i].Einrichtung.EinBez;
                     var direct_Personal = dataSet[i].Einrichtung.Funktion;
                  
            
                        for(var j = 0 ; j < direct_Personal.length; j++){
               
               
               if(direct_Personal[j].hasOwnProperty('Personal')==true){

               var person = direct_Personal[j].Personal;
                   
                   
                    if(person.hasOwnProperty('PerID')==true ){
                   
                    var id = person.PerID;
                     var n = person.PersName;

                    personalArray.push({
                    personID : id ,
                    name : n 
                 });
                                   
               }
                   else{

                    for(var k = 0 ; k < person.length; k++){
                        
                       var id = person[k].PerID;
                       var n = person[k].PersName;
                
                        personalArray.push({
                        personID : id,
                            name : n
   
                 });
                
                    }
                }
            }                 
        }
                  
                  
                  // get all the staff of the chairs and the smaller instituts 
                  
                  
                  
                if(dataSet[i].hasOwnProperty('Ueberschrift')==true ){
                    var chairs = dataSet[i].Ueberschrift;
                    
                    
                
                    for(var x = 0 ; x < chairs.length; x ++){
                        var perrArr = [];
                        
                         if(chairs[x].hasOwnProperty('Einrichtung')==true){
                            
                         if(chairs[x].Einrichtung.hasOwnProperty('EinBez')==true ){
                     
                           var chairNames = chairs[x].Einrichtung.EinBez;
                                                    
                              
                                 if(chairs[x].Einrichtung.hasOwnProperty('Funktion')==true ){

                             
                             
                                  var currChair =  chairs[x].Einrichtung.Funktion;
                             
                             for(var l = 0 ; l < currChair.length; l++){
                                 
                                    
                                 
                                   if(currChair[l].hasOwnProperty('Personal')==true &&
                                     currChair[l].Personal.hasOwnProperty('PerID') == true){
                                 
                                 
                                   var id = currChair[l].Personal.PerID;
                                   var n = currChair[l].Personal.PersName;
                                       perrArr.push({
                                       persId : id,
                                       name : n 
                                       });
                                       
                             }
  
                         }
                         }
                         }
                             
                             
                               chairArr.push({
                                 name : chairNames,
                                 personal : perrArr
                             });
                             
                             
                              
                          if(chairs[x].hasOwnProperty('Einrichtung')==true){
                              
                              if(chairs[x].Einrichtung.hasOwnProperty('Funktion')==true){
                                                          
                              }
                              
                              
                        
                            
                         if(chairs[x].Einrichtung.hasOwnProperty('EinBez')==true ){     
                             
                    
                             
                        if(chairs[x].hasOwnProperty('Ueberschrift')==true ){
                            
                        
                            
                                        
                                  
                                       var curr = chairs[x].Ueberschrift;
                            
                                    for(var l = 0 ; l < curr.length; l++){
                                        
                                        
                                            var perrArr = [];


                     
                                                                             
                                          if(curr[l].hasOwnProperty('Einrichtung')==true ){
                                        var chairNames = curr[l].Einrichtung.EinBez;
                                              
                                    
                                              
                                              if(curr[l].Einrichtung.hasOwnProperty('Funktion')==true){
                                                  
                                                var temp = curr[l].Einrichtung.Funktion;
                                                  
                                                  if(temp.length == undefined){
                                                      
                                                     var perrArr = [];

                                                      
                                                     var persId =  temp.Personal.PerID;
                                                      var name = temp.Personal.PersName;
                                                      
                                                               perrArr.push({
                                                                persId : id,
                                                                name : n 
                                                                });
                                                      
                                                  }
                                                  
                                                  for( var k = 0 ; k < temp.length; k++){
                                                      
                                                            
                                                if(temp[k].hasOwnProperty('Personal') == true){
                                                     var pers = temp[k].Personal;
                                                    for(var p = 0 ; p<pers.length; p++){
                                                        
                                                     var currPers = pers[p];
                                                    
                                                                                                                                                            if(currPers.hasOwnProperty('PerID') == true){
                                                                                                                                                                
    
                                                   var id = currPers.PerID;
                                                    var n = currPers.PersName;
                                                    
                                                    
                                       perrArr.push({
                                       persId : id,
                                       name : n 
                                       });
                                       

                                                    }
                                                }
                                              }
                                              
                                              
                                          }
                                              
                                              }
                                              
                                              
                                      chairArr.push({
                                            name : chairNames,
                                           personal : perrArr
                                    });

                                          }
    
                                    }
                               
                              if(chairs[x].Ueberschrift.hasOwnProperty('Einrichtung')==true ){
                                 
                                    var chairNames = chairs[x].Ueberschrift.Einrichtung.EinBez;

                                        chairArr.push({
                                        name : chairNames
                                         });
                                  

                                        }
                        }}
                            
                        
                              
                               if(chairs[x].hasOwnProperty('Einrichtung')==true){
                            
                         if(chairs[x].Einrichtung.hasOwnProperty('EinBez')==true ){     
                             
                    
                        if(chairs[x].hasOwnProperty('Ueberschrift')==true ){
                            
                              if(chairs[x].Ueberschrift.hasOwnProperty('Ueberschrift')==true ){
 
                                    var k = chairs[x].Ueberschrift.Ueberschrift;
                                  
                                   for(var p = 0 ; p < k.length; p++){
                                     
                                        var chairNames = k[p].Einrichtung.EinBez;
 
                                         chairArr.push({
                                        name : chairNames
                                         });

                                   }
                                       
                               }
                        }
                         
                         }
                             }
                                }
                            }
                        }
                    }
                  
                  /*The Final Array which is parsed is filled here*/
                  
                  persCount+= personalArray.length;
            
               persArr.push({
                
                Faculty : FacultyName, 
                Personal: personalArray,
                Chairs  :   chairArr
                
            
            });   
     }
            
        }
                    d = persArr;
                    var personal = "personal";
                    allData[personal] = d;


    };
    
    

    /*
    get the days where events take place
    */
    var _getDays = function(){
    
    for(var f in eventdata){
            var name =eventdata[f].Fak;;
                
                var onefak = JSON.parse(eventdata[f].vv)
                var days = jsonPath.query(onefak, "$..VZWoTag");
                if(count(name,days)!=null){
                     if(hasFak(allDays,name)==false){
                 allDays.push(count(name,days));
                }
        
                }
           
            }
        
          
        
        var days = "days";
        
        allData[days]=allDays;
        
    };
    
  // counts same elements in array
    
    var count = function(name,ar){
        
        var currentFak=[];
        var array_elements = ar;

        array_elements.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
              
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
    
      // counts occurance of same hour values in array

    
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

          // calculates all dates where a event takes place. If only start and end date are given, the events between are calculated (if rythm is given)

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
                
                var onefak = JSON.parse(eventdata[f].vv)
                var ver = jsonPath.query(onefak, "$..Veranstaltung[*]");

       
       for(var v in ver){
            var id = ver[v].VName;
            var vt = ver[v].VZeit;
           if(vt!=undefined){
           if(vt.VZBeginDat!=undefined){var sd = vt.VZBeginDat;}
           if(vt.VZEndDat!=undefined){var ed = vt.VZEndDat;}
           if(vt.VZBeginn!=undefined){var td = vt.VZBeginn;}
           }
         

               if(sd!=undefined&&ed!=undefined&&td!=undefined){
              var beg= new Date( sd.replace( /(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3") );
                   beg.setHours(td.slice(0,2));
                   beg.setMinutes(td.slice(3));
                var end= new Date( ed.replace( /(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3") );
        
                   
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
                   }else{
                        norythmcounter++;}
               }else{
                    notimecounter++;}
       
       }else{
            nodates++;}

                

        
           totalevents++;

   }
       var re = new RegExp(/.*Fakultät\W.*/);
        
    if(re.test(name)){
      var key = name.replace(/Lehrveranstaltungen der Fakultät für /,"");
        if(hasKey(timesgeneral,key)==false){
               var fakk= {name:key,color: _getFakClass(name),data:sortAndCoutTimes(timesforfak)};
                var fakcount = {label:key,count:ver.length,color: _getFakClass(name)};
                eventsperfak.push(fakcount);
           
               timesgeneral.push(fakk);
        
        }
       totalfaks++;
        
           
    
    }
     
       
   }

    console.log("server status : online ");
    
   
    
};
    
          // sorts dates and counts occurance

    
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
    
      // fills all positions with zero to where other faculties have a value

    
    
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

     
    }
    



return arr;

        
}; 
    
      // checks if array has a specific value

var contains = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};
    
      // checks if array has object with specific value for variable "x"

    
var hasXValue = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
    
        if (a[i].x == obj) {
            
            return true;
        }
    }
 
    return false;
};
    
      // checks if array has object with specific key

var hasKey = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
    
        if (a[i].name == obj) {
            
            return true;
        }
    }
 
    return false;
};
    
      // checks if array has object with specifik faculty

    var hasFak = function (a, obj) {
    for (var i = 0; i < a.length; i++) {

        if (Object.keys(a[i])[0] == obj) {
            
            return true;
        }
    }
 
    return false;
};
    
      /* This method returns the rythm of a event wether it is weekly, single, in 14-days, etc.*/

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
    
    
    /* This method is for getting the specific hex-code of each faculty */ 
    
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
    
      // checks if instance is a valid date object

    
 var isDate = function(dateArg) {
    var t = (dateArg instanceof Date) ? dateArg : (new Date(dateArg));
    return !isNaN(t.valueOf());
}
 
   // checks if date is in a valid range

 
 var isValidRange=function(minDate, maxDate) {
    return (new Date(minDate) <= new Date(maxDate));
}
 
 
      // checks if date is between two given dates

var betweenDate= function(startDt, endDt,rythm) {
    var error = ((isDate(endDt)) && (isDate(startDt)) && isValidRange(startDt, endDt)) ? false : true;
    var between = [];
    if (error) {
        //console.log('error occured!!!... Please Enter Valid Dates');
    } else {
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
        server.get("/api/get/allData", function (req, res) {
            
              console.log("hier sind alldata");
          
            res.send(allData);
        });
        
         
           server.use(cors());
        server.get("/api/get/personal", function (req, res) {
            
              console.log("hier sind personal");
          
            res.send(d);
        });
        
        
          server.use(cors());
        server.get("/api/get/events", function (req, res) {
            
              console.log("hier sind events");
          
            res.send(timesgeneral);
        });
          server.use(cors());
        server.get("/api/get/counter", function (req, res) {
            
              console.log("hier sind counter");
          
            res.send(eventsperfak);
        });

        server.use(express.static(WWW));
        server.listen(PORT);
    }

    initData();
    start();
    setTimeout(function(){ _getAllDates(); }, 3000);
    setTimeout(function(){ _getDays(); }, 1500);
    setTimeout(function(){ _getHours(); }, 1500);
    
}());
