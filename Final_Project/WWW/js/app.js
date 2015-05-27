app = (function(){
var that = {},

		



 	init = function () {
   
 		_initUI();
 		_registerListeners();
        _fetchData();
    

		return that;
 	},
    
    fetchData = function () {
        
        //TODO
        
        
    }, 

 	 

	_initUI = function(){
		$(document).ready(function(){
            $(".button-collapse").sideNav();
     
    });
	
	
	},

	var _registerListeners = function(){
        
        
   
	

	};

that.init = init;

return that;

})();