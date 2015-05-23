app = (function(){
var that = {},

		



 	init = function () {
   
 		_initUI();
 		_registerListeners();
    
  console.log("meikel stinkt");


    


 		
		return that;
 	},

 	 

	_initUI = function(){
		$(document).ready(function(){
     
      $(".button-collapse").sideNav();
     
    });
	
	
	},




	
	
	_registerListeners = function(){
   
	

	};

that.init = init;

return that;

})();