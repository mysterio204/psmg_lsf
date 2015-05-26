require('../index');
var fs = require('fs');


var xotree = new UTIL.XML.ObjTree();


fs.readFile(__dirname + '/PersRaw.xml', function(err, data) {

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


      fs.writeFile("PersonenDatenDeep.json", JSON.stringify(data), function(err){
                    if(err){
                         return console.log(err);
                   }
               });
                console.log("file saved");
    




};

// test('xotree-test', function(t) {
	
// 	xotree_out = xotree.parseXML( pers_xml);
//     console.log(xotree_out);
	
// });





