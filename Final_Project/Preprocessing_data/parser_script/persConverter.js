/*init the required libraries needed */

        require('../index');
        var fs = require('fs');
        var xotree = new UTIL.XML.ObjTree();



        /* This "function" is called immediataly with the start of the script 
         * It reads in the .xml-File needed and parses the data to the "clearJSON" Method
         * The "function" logs when a error appears during the read-in process 
        */

        fs.readFile(__dirname + '/PersonenDaten/PersRaw.xml', function(err, data) {

                if(err){
                return console.log(err);
            }
                clearJSON(data);
         });



        /* This Method clears out the parsed data to the point declared 
         * It also parses the .xml data into a JSON-Object with the help of the objTree.js library 
         * It then calls the Methode "writeJSON" and parses the JSON-Object which is stored in "xotree_out"
        */

             function clearJSON(data){
                var xotree_out = xotree.parseXML( "'"+data+"'" );
                var tree = xotree_out.publishDetail.VVZPublish.Einrichtungen.Tree

                    writeJSON(tree);
         };


        /* This Method writes the parsed data (stringified JSON) into the path declared 
         * The Method logs when an error appears and when the file is read in sucessfully
        */

        function writeJSON(data){
              fs.writeFile(__dirname+"/parsedPD/PersonenDaten.json", JSON.stringify(data), function(err){
                  
                    if(err){
                    return console.log(err);
                }
         });
                    console.log("file saved");

    };
