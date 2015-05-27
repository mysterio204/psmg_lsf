app = (function(){
var that = {},
    url = "http://localhost:3333/api/get/people",

		



 	init = function () {
   
 		_initUI();
 		_registerListeners();
        _fetchData();
    

		return that;
 	},
    
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