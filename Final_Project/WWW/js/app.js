app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/hours",
    chart,
    vvdata,
    currDay="monday",
    currFak="Lehrveranstaltungen der Fakultät für Physik / Courses in Physics",
    
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
               vvdata=data;
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
        _fetchData(vvdata,currFak,currDay);

		return that;
 	},
    
    /* This private Method fetches the data from the webserver when a request is made
     * the data is fetched through the library "d3.js" 
     * The Method throws an error when a error appears within fetching the data via d3
     * If fetching is sucessfull the method calls the Method "_calculatePeoplePerFak"
     */
    
  _fetchData = function (data,faculty,day) {
      var currentData = new Array();
      
        
     
            
            
           for(var i = 0 ; i < data.length; i++){
                
                if ( data[i].name==faculty){
                    if(data[i].day ==day){
                    currentData = data[i].time
                    //console.log(currentData);
                    console.log(currDay);
                        $('.chart').empty();
                        var cl = _getFakClass();
                         chart.renderBarChart(currentData);
                         $(".bar").css("fill",_getFakClass);

                    break;
                    }
                }
            }
            
            
            
           // _calculatePeoplePerFak(data);
           // _calculateEventsPerDay(data);

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
                
                _fetchData(vvdata,currFak,currDay);
               
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
                console.log(event.target.textContent);
          var clickedDay = _getDay(event.target.textContent);
                currDay= clickedDay;
                _fetchData(vvdata,currFak,currDay);
                //Insert event handling logic
            }
        });
        
    };

that.init = init;

return that;

})();

