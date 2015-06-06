app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/days",

		

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
           // _calculatePeoplePerFak(data);
              _calculateEventsPerDay(data);

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
    
      _calculateEventsPerDay = function (json){
          var facs = [];
          var numFac = json.length;
        
            for(var i = 0 ; i < numFac ; i ++){

            var c = json[i];
           
            var objName = Object.getOwnPropertyNames(c)[0];
                
           var mo =  JSPath.apply('..Montag', c)[0],
              di =  JSPath.apply('..Dienstag', c)[0],
              mi =  JSPath.apply('..Mittwoch', c)[0],
              don = JSPath.apply('..Donnerstag', c)[0],
              fr =  JSPath.apply('..Freitag', c)[0],
              sa =  JSPath.apply('..Samstag', c)[0],
              so =  JSPath.apply('..Sonntag', c)[0];
                
                if(mo==undefined){
                    mo = 0 ; 
                }
                
                if(di==undefined){
                    di = 0 ; 
                }
                if(mi==undefined){
                    mi = 0 ; 
                }
                if(don==undefined){
                    don = 0 ; 
                }
                if(fr==undefined){
                    fr = 0 ; 
                }
                if(sa==undefined){
                    sa = 0 ; 
                }
                if(so==undefined){
                    so = 0 ; 
                }
                
                var ges = mo+di+mi+don+fr+sa+so;
                
                   facs.push({
                name: objName,
                Montag:mo,
                Dienstag:di,
                Mittwoch:mi,
                Donnerstag:don,
                Freitag:fr,
                Samstag:sa,
                Sonntag:so,
                Gesamt:ges      
            
            }
            );

            }
          
          console.log(facs);

    },


 	 

	_initUI = function(){
		$(document).ready(function(){
            $(".button-collapse").sideNav();
     
    });
	
	
	};

	var _registerListeners = function(){
        
       $(".fak").on("click", function (event) {
            var target = event.target;

            console.log(target.attributes.id);
        });
        

	};

that.init = init;

return that;

})();