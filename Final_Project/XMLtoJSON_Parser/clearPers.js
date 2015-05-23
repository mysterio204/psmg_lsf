(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
   
            var fs = require('fs'),
            xml2js = require('xml2js');


            function clearJSON(data){
                    var clearedJSON = data.publishDetail.VVZPublish;
                    var  tree = clearedJSON[0].Einrichtungen[0].Tree;
               
            writeJSON(tree, data)

             //delete data.publishDetail.global[1];

        
            }

            function writeJSON(tree, raw){

                    fs.writeFile("PersTree.json", JSON.stringify(tree), function(err){
                    if(err){
                        return console.log(err);
                    }
                });


//                    fs.writeFile("PersonenDaten.json", JSON.stringify(raw), function(err){
//                    if(err){
//                        return console.log(err);
//                    }
//                });
                console.log("file saved");
            }



            function parseXMLtoJSON(){

                    var parser = new xml2js.Parser();
                    fs.readFile(__dirname + '/PersRaw.xml', function(err, data) {
                        console.log(data);
                    parser.parseString(data, function (err, result) {


                      // clearJSON(result);



            });
        });

      }


      parseXMLtoJSON();


}());
