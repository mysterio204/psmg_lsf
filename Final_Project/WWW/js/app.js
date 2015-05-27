app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/people",

		

        /* This function initializes everything needed for running the webApplication*/

 	init = function () {
   
 		_initUI();
 		_registerListeners();
        _fetchData();

		return that;
 	},
    
    /* This private Method fetches the data from the webserver when a request is made
     * the data is fetched through the library "d3.js" 
     * The Method throws an error when a error appears within fetching the data via d3
     * If fetching is sucessfull the method calls the Method "_calculatePeoplePerFak"
     */
    
  _fetchData = function () {
        
        d3.json(url,function(err,data){
        if(err){
        console.log(err)
        }
            console.log(data);
            _calculatePeoplePerFak(data);

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
   // console.log(countPeople);
    
    },

 	 

	_initUI = function(){
		$(document).ready(function(){
            $(".button-collapse").sideNav();
     
    });
	
	
	};

	var _registerListeners = function(){
        

	};

that.init = init;

return that;

})();