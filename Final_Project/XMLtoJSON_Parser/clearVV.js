(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
   
            var fs = require('fs'),
            xml2js = require('xml2js');


             /* This Function clears out the JSON - Data from all not necessary information 
               It then parses the cleared JSON-File  to the "writeJSON" method   */


            function clearJSON(data,i){
               
                      var clearedJSON = data.publishDetail.Vorlesungsverzeichnis[0].Tree;
                      writeJSON(clearedJSON,i)

            

              /* This Method writes the cleared JSON-File  to the root-Directory 
                When an error appears the function throws a error-message in the console
                When no error appears as "file saved" massege appears in the console                   */


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




              /* This function uses the xml2js library to parse a xml-File you declared intot a JSON file.
                - The function parses the raw-Json-File to the function clearJSON
                - if an error appears the console throws an error-message in the console            */
            
            function parseXMLtoJSON(n){
               
                    var parser = new xml2js.Parser();
                    var index = n;
                    var pfad = '/Vorlesungsverzeichnis/vv'+n+'.xml';
                  
               
                    var parsePfad = "vv"+n;
                    fs.readFile(__dirname+pfad, function(err, data) {

                    parser.parseString(data, function (err, result) {
                       clearJSON(result,parsePfad);

            });
        });
                 
         
      }

      /* The Method 'parseXMLtoJSON' runs as often as "Vorlesungsverzeichnis"-Files exist in the root-directory
         The index gets parsed to the parseXMLtoJSON directory to read in the necessary file */


      for(var i = 1 ; i < 25 ; i ++ ){
      var n = i.toString();
      parseXMLtoJSON(n);
  }

}());
