app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/allData",
    chart,
    allData,
    hourData,
    daysData,
    daysAllFacs =[],
    arr = [],
    currDay="all",
    currFak= "Alle Fakultäten",
    
    names={"1":"Lehrveranstaltungen der Fakultät für Physik / Courses in Physics",
           "2":"Lehrveranstaltungen der Fakultät für Wirtschaftswissenschaften",
           "3":"Lehrveranstaltungen der Fakultät für Medizin",
           "4":"Lehrveranstaltungen der Fakultät für Chemie und Pharmazie",
           "5":"Lehrveranstaltungen der Fakultät für Psychologie, Pädagogik und Sportwissenschaft",
           "6":"Lehrveranstaltungen der Fakultät für Mathematik",
           "7":"Lehrveranstaltungen für Hörer aller Fakultäten",
           "8":"Lehrveranstaltungen der Fakultät für Rechtswissenschaft",
           "9":"Lehrveranstaltungen der Fakultät für Biologie und Vorklinische Medizin",
           "10":"Lehrveranstaltungen der Fakultät für Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften",
           "11":"Lehrveranstaltungen der Fakultät für Katholische Theologie",
           "12":"Lehrveranstaltungen der Fakultät für Sprach-, Literatur- und  Kulturwissenschaften", 
          },
     fakultäten=[
    "Alle Fakultäten",
    "Lehrveranstaltungen der Fakultät für Rechtswissenschaft",
    "Lehrveranstaltungen der Fakultät für Wirtschaftswissenschaften",
    "Lehrveranstaltungen der Fakultät für Katholische Theologie",
    "Lehrveranstaltungen der Fakultät für Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften",
    "Lehrveranstaltungen der Fakultät für Psychologie, Pädagogik und Sportwissenschaft",
    "Lehrveranstaltungen der Fakultät für Sprach-, Literatur- und  Kulturwissenschaften",
    "Lehrveranstaltungen der Fakultät für Biologie und Vorklinische Medizin",
    "Lehrveranstaltungen der Fakultät für Mathematik",
    "Lehrveranstaltungen der Fakultät für Physik / Courses in Physics",
    "Lehrveranstaltungen der Fakultät für Chemie und Pharmazie",
    "Lehrveranstaltungen der Fakultät für Medizin"
     ],
    
   
		

        /* This function initializes everything needed for running the webApplication*/

 	init = function () {
           d3.json(url,function(err,data){
              
               hourData = data.hours;
               daysData = data.days;
        if(err){
        console.log(err)
        }
        
        chart = new ChartController({
        chartContainer: document.querySelector(".chart"),
        dataURL: "http://localhost:3333/api/get/hours",
        detailURL: "http://localhost:3333/api/get/meals/"
    });
   
 		_initUI();
 		_registerListeners();
        _calculateFreqPerDayForAllFaculties();
        _fetchData(hourData,currFak,currDay);
               

		return that;
 	},
    
    /* This private Method fetches the data from the webserver when a request is made
     * the data is fetched through the library "d3.js" 
     * The Method throws an error when a error appears within fetching the data via d3
     * If fetching is sucessfull the method calls the Method "_calculatePeoplePerFak"
     */
    
  _fetchData = function (data,faculty,day) {
      var currentData = new Array();
               
               console.log(faculty);
               console.log(day);
               
        if(day == "all" && faculty!="Alle Fakultäten"){
            console.log("alle Tage, eine Fakultät");
            $('.chart').empty();
            chart.renderBarChart(_daysPerFacluty(currFak),"days");
            $(".bar").css("fill",_getFakClass);
        } else
         if(day != "all" && faculty=="Alle Fakultäten"){
            console.log("ein Tag, alle Fakultäten");
            $('.chart').empty();
           chart.renderBarChart(_oneDayAllFac(day),"hours");
             $(".bar").css("fill",_getFakClass);
        } else
      
        if(day == "all" && faculty=="Alle Fakultäten"){
            console.log("alle Tage, alle Fakultäten" );
            $('.chart').empty();
            chart.renderBarChart(daysAllFacs,"days");
            $(".bar").css("fill",_getFakClass);
        
        }else if (day != "all" && faculty!="Alle Fakultäten"){
            console.log("ein Tag, eine Fakultät");
     
            
            
           for(var i = 0 ; i < data.length; i++){
                
                if ( data[i].name==faculty){
                    if(data[i].day ==day){
                    currentData = data[i].time
                        console.log(currentData);
                        $('.chart').empty();
                        var cl = _getFakClass();
                         chart.renderBarChart(currentData,"hours");
                         $(".bar").css("fill",_getFakClass);
                        $('.daybutton').css("background_color",_getFakClass);

                    break;
                    }
                }
            }
        }
            
        });
           
      
      
    }, 
    
    _calculatePeoplePerFak=function(json){
        var countPeople=[];
    
    json.Ueberschrift.forEach(function(obj){
        
       if(obj.Einrichtung!=null&&obj.Ueberschrift!=null){
           
            countPeople.push({
                name: obj.Einrichtung.EinBez,
                people: obj.Einrichtung.Funktion.length,
                chairs: obj.Ueberschrift.length
            
            }
            );
        
       }
        
        });
        
        countPeople.forEach(function(obj){
        console.log(obj.name+" hat "+obj.people+" direkte Angestellte und "+obj.chairs+" Lehrstühle");
        });
    
    },
    
    _getDay = function(gerDay){
  switch(gerDay) {
    case "Mo":
        return "monday"
        break;
    case "Di":
        return "tuesday"
        break;
    case "Mi":
        return "wednesday"
        break;
    case "Do":
        return "thursday"
        break;
    case "Fr":
        return "friday"
        break;
    case "Sa":
        return "saturday"
        break;
    case "So":
        return "sunday"
        break;
          case "Alle Tage":
        return "all"
        break;
    default:
         return "monday"
}
    },
    
    _getFakClass = function (){
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
    
    
    },
    
 	 

	_initUI = function(){
		$(document).ready(function(){
            $(".button-collapse").sideNav();
     
    });
	
	
	};

	var _registerListeners = function(){
        
        _facultybuttonListener();
        _daybuttonListener();
        
        
	};
    
    var _calculateFreqPerDayForAllFaculties = function(){
        
        arr = [];
        daysAllFacs =[];
        
        
        
        var mo = 0, 
            di = 0, 
            mi = 0,
            don = 0,
            fr = 0,
            sa = 0,
            so = 0;
       
                
        for(var i = 0 ; i < daysData.length; i++){
            var currentFak;
            currentFak = daysData[i];
          
            
           var currMo = JSPath.apply('$..{.weekday=="Montag"}.freq[0]',currentFak);
             if(currMo===undefined){
                currMo = 0;
            }
               arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Montag",
                   freq : currMo
                   
               });
           var currDi = JSPath.apply('$..{.weekday=="Dienstag"}.freq[0]',currentFak);
               if(currDi===undefined){
                currDi = 0;
            }
                 arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Dienstag",
                   freq : currDi
                   
               });
           var currMi = JSPath.apply('$..{.weekday=="Mittwoch"}.freq[0]',currentFak);
             if(currMi===undefined){
                currMi = 0;
            }
                  arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Mittwoch",
                   freq : currMi
                   
               });
          var   currDon =  JSPath.apply('$..{.weekday=="Donnerstag"}.freq[0]',currentFak);
           if(currDon===undefined){
                currDon = 0;
            }
              arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Donnerstag",
                   freq : currDon
                   
               });
           var  currFr = JSPath.apply('$..{.weekday=="Freitag"}.freq[0]',currentFak);
            if(currFr===undefined){
                currFr = 0;
            }
              arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Freitag",
                   freq : currFr
                   
               });
             var currSa =  JSPath.apply('$..{.weekday=="Samstag"}.freq[0]',currentFak);
            if(currSa===undefined){
                currSa = 0;
            }
              arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Samstag",
                   freq : currSa
                   
               });
             var currSo =  JSPath.apply('$..{.weekday=="Sonntag"}.freq[0]',currentFak);
            if(currSo===undefined){
                currSo = 0;
            }
              arr.push({
                   
                   name:Object.getOwnPropertyNames(daysData[i])[0],
                   hour: "Sonntag",
                   freq : currSo
                   
               });
            
            
           

            mo+=currMo;
            di+=currDi;
            mi+=currMi;
            don+=currDon;
            fr+=currFr;
            sa+=currSa;
            so+=currSo;

            
        }
        
        daysAllFacs.push({
            
            hour : "montag",
            freq : mo
            
            
        });
        
       
         daysAllFacs.push({
            
            hour : "dienstag",
            freq : di
            
            
        });
         daysAllFacs.push({
            
            hour : "mittwoch",
            freq : mi
            
            
        });
         daysAllFacs.push({
            
            hour : "donnerstag",
            freq : don
            
            
        });
         daysAllFacs.push({
            
            hour : "freitag",
            freq : fr
            
            
        });
         daysAllFacs.push({
            
            hour : "samstag",
            freq : sa
            
            
        });
        
         daysAllFacs.push({
            
            hour : "sonntag",
            freq : so
            
            
        });
        
        console.log(arr);
        console.log(daysAllFacs);
        
          
    };
    
    
    var _daysPerFacluty = function(fk){
    var path = '$.{.name=="'+fk+'"}'
    var resArray = JSPath.apply(path,arr);
    return resArray;
    };
    
    
    
    
    var _oneDayAllFac = function(day){
    var path = '$.{.day=="'+day+'"}.time'
    var dt= JSON.stringify(hourData);
        console.log(dt);
    var resArray = JSPath.apply(path,JSON.parse(dt));
        console.log(resArray);
        
       

         
         resArray.forEach(function(obj){
             var s ="April, 16, 1992,"+ obj.hour+":00";
             var d = new Date(s);
         obj.hour = d;
         
         });
         
         
    resArray.sort(function(a, b) {
    return new Date(a.hour).getTime() - new Date(b.hour).getTime();
});
         
    var secres = [];
    var curT=new Date (resArray[0].hour).getTime();
    var cnt=0;
         
    resArray.forEach(function(obj){
    if(new Date (obj.hour).getTime() == curT){
            cnt+= obj.freq
    }else{
        var h = new Date(curT).getHours();
        var m = new Date(curT).getMinutes();
        var t = ""+h.toString()+":"+m.toString();
        secres.push({hour:t,freq:cnt});
        cnt=obj.freq;
        curT=new Date (obj.hour).getTime();
    
    }
    
    });
    return secres;
         
         //return resArray;
    };
    
    
  
    
    
    var _facultybuttonListener = function () {
        
           $(".fak").on("click", function (event) {
            var target = event.target;
               $(".fak").removeClass('selected');
            
               if ($(target).hasClass('selected') ){
                $(target).removeClass('selected');
                //Insert logic if you want a type of optional click/off click code
            } 
            else
            {
                $(target).addClass('selected');
                var numer = target.id;

               console.log(fakultäten[numer]);
                var clickedFac = fakultäten[numer];
                currFak=clickedFac;
                
                _fetchData(hourData,currFak,currDay);
                
               

                //Insert event handling logic
            }
               
        });
        
        
        
    };
        var _daybuttonListener = function () {
                
           $(".daybutton").on("click", function (event) {
            var target = event.target;
               $(".daybutton").removeClass('btn-floating btn-large');
            
               if ($(target).hasClass('btn-floating btn-large') ){
                $(target).removeClass('btn-floating btn-large');
                //Insert logic if you want a type of optional click/off click code
            } 
            else
            {
                $(target).addClass('btn-floating btn-large');
          var clickedDay = _getDay(event.target.textContent);
                currDay= clickedDay;
                _fetchData(hourData,currFak,currDay);
            }
        });
        
    };

that.init = init;

return that;

})();

