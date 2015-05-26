require('../index');
var fs = require('fs');
var xotree = new UTIL.XML.ObjTree();



  

fs.readFile(__dirname + '/PersonenDaten/PersRaw.xml', function(err, data) {

            if(err){
                    return console.log(err);
            }

                  clearJSON(data);



                        
       });

// tests to convert XML strings to JSON objects


 function clearJSON(data){
                  var xotree_out = xotree.parseXML( "'"+data+"'" );

                  var tree = xotree_out.publishDetail.VVZPublish.Einrichtungen.Tree
               
            writeJSON(tree)

            };


function writeJSON(data){


      fs.writeFile(__dirname+"/parsedPD/PersonenDaten.json", JSON.stringify(data), function(err){
                    if(err){
                         return console.log(err);
                   }
               });
                console.log("file saved");
    




};
