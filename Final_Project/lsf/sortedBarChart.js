
    var personalurl = "http://localhost:3333/api/get/personal"
    var eventurl = "http://localhost:3333/api/get/counter"
    var persArrFak = [];
    var proportionArr = [];


        d3.json(personalurl,function(data){
    
        _countPersonalForFaculties(data); 
            function _countPersonalForFaculties(data){

        for(var i = 0 ; i < data.length-2; i++){
 
            personalCounter = 0 ;
            currentFaculty = data[i];
            
            personalCounter += currentFaculty.Personal.length;
            

                for(var j = 0 ; j<currentFaculty.Chairs.length; j++){
                    
                    
                    var personalOfFaculty = currentFaculty.Chairs;
                    var chair = personalOfFaculty[j];
                    
                    if(chair.personal==undefined){
                        personalCounter+=0;
                    }else{
                        
                     
                    var chairPersonal = chair.personal.length;
                    var chairName     = chair.name;
                    personalCounter+=chairPersonal; 
                        
                        }
                    }
            
              persArrFak.push({
                
               name : currentFaculty.Faculty,
               freq : personalCounter

            });
          }
        };

            d3.json(eventurl, function(data){
                
               
              _calculateProportion(data);
                
                
                function _calculateProportion(data){
                
               
            
            var phy = data[0].count / persArrFak[8].freq;
                    proportionArr.push({
                        name: "Physik",
                        frequency: phy
                    });        
                    
            var wiwi = data[1].count / persArrFak[2].freq;
                     proportionArr.push({
                        name: "Wirtschaft",
                        frequency: wiwi
                    });
            var medizin = data[2].count / persArrFak[3].freq;
                     proportionArr.push({
                        name: "Medizin",
                        frequency: medizin
                    });
            var chemie = data[3].count / persArrFak[10].freq;
                     proportionArr.push({
                        name: "Chemie",
                        frequency: chemie
                    });
            var psy = data[4].count / persArrFak[5].freq;
                     proportionArr.push({
                        name: "Psychologie ",
                        frequency: psy
                    });
            var math = data[5].count / persArrFak[7].freq;
                     proportionArr.push({
                        name: "Mathematik",
                        frequency: math
                    });
            var law = data[6].count / persArrFak[1].freq;
                     proportionArr.push({
                        name: "Recht",
                        frequency: law
                    });
            var phil = data[7].count / persArrFak[4].freq;
                     proportionArr.push({
                        name: "Philosophie",
                        frequency: phil
                    });
            var bio = data[8].count / persArrFak[9].freq;
                     proportionArr.push({
                        name: "Biologie",
                        frequency: bio
                    });
            var rel = data[9].count / persArrFak[0].freq;
                     proportionArr.push({
                        name: "Theologie",
                        frequency: rel
                    });
            var slk = data[10].count / persArrFak[6].freq;
                     proportionArr.push({
                        name: "SLK",
                        frequency: slk
                    }); 
                    
                };

            var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 1300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, 1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var svg = d3.select("#sortedBarChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var data = proportionArr;

          data.forEach(function(d) {

            d.frequency = +d.frequency;
          });

          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Verteilung");

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.name); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.frequency); })
              .attr("height", function(d) { return height - y(d.frequency); });

          d3.select("#sort").on("change", change);

          var sortTimeout = setTimeout(function() {
            d3.select("#sort").property("checked", false).each(change);
          }, 2000);

          function change() {
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(data.sort(this.checked
                ? function(a, b) { return b.frequency - a.frequency; }
                : function(a, b) { return d3.ascending(a.name, b.name); })
                .map(function(d) { return d.name; }))
                .copy();

            svg.selectAll(".bar")
                .sort(function(a, b) { return x0(a.name) - x0(b.name); });

            var transition = svg.transition().duration(750),
                delay = function(d, i) { return i * 50; };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function(d) { return x0(d.name); });

            transition.select(".x.axis")
                .call(xAxis)
              .selectAll("g")
                .delay(delay);
          }


                    });

        });


           
           
           
       
           
           
           
           
           
           
           
           

        







