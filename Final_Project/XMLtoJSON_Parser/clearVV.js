(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
   
            var fs = require('fs'),
            xml2js = require('xml2js');


            function clearJSON(data,i){
                console.log(i);
                      var clearedJSON = data.publishDetail.Vorlesungsverzeichnis[0].Tree;
                //    var  tree = clearedJSON[0].Einrichtungen[0].Tree;
            writeJSON(clearedJSON,i)

           console.log(clearedJSON)

             //delete data.publishDetail.global[1];

        
            }

            function writeJSON(tree,pfad){
                    var jsonPfad = pfad+".json";
                    fs.writeFile(jsonPfad, JSON.stringify(tree), function(err){
                    if(err){
                        return console.log(err);
                    }
                });
                console.log("file saved");
            }
















            function parseXMLtoJSON(n){
               
                    var parser = new xml2js.Parser();
                    console.log(n);
                    var index = n;
                    var pfad = '/Vorlesungsverzeichnis/vv'+n+'.xml';
                  
               
                    var parsePfad = "vv"+n;
                    
                    fs.readFile(__dirname+pfad, function(err, data) {
                        console.log(n);
                        console.log("i was here");
                        console.log(__dirname+pfad);

                    parser.parseString(data, function (err, result) {
                       clearJSON(result,parsePfad);

                        


                    


            });
        });
                 
                


          
                

      }

      for(var i = 1 ; i < 25 ; i ++ ){
         var n = i.toString();
      parseXMLtoJSON(n);
  }

  
  


}());
