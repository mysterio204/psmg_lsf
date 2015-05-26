(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
           
            var fs = require('fs'),
            xml2js = require('xml2js');

            /* This Function clears out the JSON - Data from all not necessary information 
               It then parses the cleared JSON-File and the RAW-JSON-File to the "writeJSON" method   */


            function clearJSON(data){
                    var clearedJSON = data.publishDetail.VVZPublish;
                    var  tree = clearedJSON[0].Einrichtungen[0].Tree;
               
            writeJSON(tree, data)

            }

            /* This Method writes both the cleared JSON-File and the RAW-JSON-File to the root-Directory 
                When an error appears the function throws a error-message in the console
                When no error appears as "file saved" massege appears in the console                   */

            function writeJSON(tree, raw){

                    fs.writeFile("PersTree.json", JSON.stringify(tree), function(err){
                    if(err){
                        return console.log(err);
                    }
                });


                    fs.writeFile("PersonenDaten.json", JSON.stringify(raw), function(err){
                    if(err){
                         return console.log(err);
                   }
               });
                console.log("file saved");
            }


            /* This function uses the xml2js library to parse a xml-File you declared intot a JSON file.
                - The function parses the raw-Json-File to the function clearJSON
                - if an error appears the console throws an error-message in the console            */

            function parseXMLtoJSON(){

                    var parser = new xml2js.Parser();
                    fs.readFile(__dirname + '/PersRaw.xml', function(err, data) {
                        parser.ParseString(data, function(err, result){
  
                       clearJSON(result);
            });
       
        });

      }


      parseXMLtoJSON();


}());
