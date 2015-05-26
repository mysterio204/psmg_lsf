require('../index');
var fs = require('fs');


var xotree = new UTIL.XML.ObjTree();



	 for(var i = 1 ; i < 25 ; i ++ ){
      var n = i.toString();
      parseXMLtoJSON(n);
  }



 function parseXMLtoJSON(index){


                   
                    var pfad = '/Vorlesungsverzeichnis/vv'+index+'.xml';
                    var parsePfad = "vv"+n;


					fs.readFile(__dirname + pfad, function(err, data) {

	            if(err){
	                    return console.log(err);
	            }



                  clearJSON(data,parsePfad);



                        
       });

	};

// tests to convert XML strings to JSON objects


 function clearJSON(data,pfad){
 				  var json =  xotree.parseXML( "'"+data+"'" );
                  var tree =  json.publishDetail.Vorlesungsverzeichnis;

                 
               
            writeJSON(tree,pfad)

            };


function writeJSON(data,pfad){

		var jsonPfad = "/parsedVV/"+pfad+".json";


      fs.writeFile(__dirname+jsonPfad, JSON.stringify(data), function(err){
                    if(err){
                         return console.log(err);
                   }
               });
                console.log("file saved");
    




};






