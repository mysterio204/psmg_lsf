app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/hours",
    chart,
    vvdata,
     
		

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
        _fetchData(vvdata);

		return that;
 	},
    
    /* This private Method fetches the data from the webserver when a request is made
     * the data is fetched through the library "d3.js" 
     * The Method throws an error when a error appears within fetching the data via d3
     * If fetching is sucessfull the method calls the Method "_calculatePeoplePerFak"
     */
    
  _fetchData = function (data) {
      var currentData = new Array();
      
        
     
            
            
            console.log(data);
           for(var i = 0 ; i < data.length; i++){
                
                if ( data[i].name=="Lehrveranstaltungen der Fakultät für Wirtschaftswissenschaften"){
                    currentData = data[i].time
                    //console.log(currentData);
                         chart.renderBarChart(currentData);

                    break;
                  
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
                //Insert event handling logic
            }
        });
        
    };

that.init = init;

return that;

})();

