/*init the required libraries needed */

        require('../index');
        var fs = require('fs');
        var xotree = new UTIL.XML.ObjTree();


        /* This Part of the script gets executed directly after the script is started
         * it iterates 24 times and calls the method parseXMLtoJSON with also parsing the index of the loop
         * This is needed to read in the Data from the "vorlesungsverzeichnis" 
        */

             for(var i = 1 ; i < 25 ; i ++ ){
              var n = i.toString();
              parseXMLtoJSON(n);
            }

            /* This Method reads in the .xml-Files of the "Vorlesungsverzeichnis" by 
             * getting the right path through the parsed index of the for-loop befor
             * It returns an error in the console when something is wrong with readin-in the file
             * It calls the Method clearJSON and parses the xml-File and the path of the data */

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

            /* This Method clears the JSON out to the declared point by going deeper into the JSON-Structure
             * Afterwards the method calls the method "writeJSON" and parses the "new" JSON-Object and the path
            */

             function clearJSON(data,pfad){
                              var json =  xotree.parseXML( "'"+data+"'" );
                              var tree =  json.publishDetail.Vorlesungsverzeichnis;

                        writeJSON(tree,pfad)

                        };


            /* This Method declares the path where the new file is saved with the helped of the path parsed
             * It then writes the JSON-File into the the directory set and returns "file saved" when everything
             * went without an error.
             * If an error appears the error will be logged into the console
            */
            
            function writeJSON(data,pfad){

                    var jsonPfad = "/parsedVV/"+pfad+".json";


                  fs.writeFile(__dirname+jsonPfad, JSON.stringify(data), function(err){
                                if(err){
                                     return console.log(err);
                               }
                           });
                            console.log("file saved");

            };






