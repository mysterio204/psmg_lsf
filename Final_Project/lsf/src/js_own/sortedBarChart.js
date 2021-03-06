var personalurl = "http://localhost:3333/api/get/personal"
var eventurl = "http://localhost:3333/api/get/counter"
var persArrFak = [];
var proportionArr = [];


d3.json(personalurl, function (data) {

    _countPersonalForFaculties(data);

    function _countPersonalForFaculties(data) {

        for (var i = 0; i < data.length - 2; i++) {

            personalCounter = 0;
            currentFaculty = data[i];

            personalCounter += currentFaculty.Personal.length;


            for (var j = 0; j < currentFaculty.Chairs.length; j++) {


                var personalOfFaculty = currentFaculty.Chairs;
                var chair = personalOfFaculty[j];

                if (chair.personal == undefined) {
                    personalCounter += 0;
                } else {


                    var chairPersonal = chair.personal.length;
                    var chairName = chair.name;
                    personalCounter += chairPersonal;

                }
            }

            persArrFak.push({

                name: currentFaculty.Faculty,
                freq: personalCounter

            });
        }
    };

    d3.json(eventurl, function (data) {


        _calculateProportion(data);


        function _calculateProportion(data) {
            
                for(var i = 0 ; i < data.length; i++){
                    
                    
                    if(data[i].label =="Physik / Courses in Physics" ){
                            var phy = data[i].count / persArrFak[8].freq;
                        proportionArr.push({
                        name: "Physik",
                        frequency: phy,
                        number: 9
            });

                       }
                       
                        if(data[i].label == "Wirtschaftswissenschaften" ){
                           
                           
                 var wiwi = data[i].count / persArrFak[2].freq;
            proportionArr.push({
                name: "Wirtschaft",
                frequency: wiwi,
                number: 2
            });
                       }
                    
                     if(data[i].label == "Medizin"){
                        
                           var medizin = data[i].count / persArrFak[3].freq;
            proportionArr.push({
                name: "Medizin",
                frequency: medizin,
                number: 11
            });
                       
                       }
                        
                         if(data[i].label == "Psychologie, Pädagogik und Sportwissenschaft"){
                            
                              var psy = data[i].count / persArrFak[5].freq;
            proportionArr.push({
                name: "Psychologie",
                frequency: psy,
                number: 5
            });
                       
                       }
                    
                     if(data[i].label =="Chemie und Pharmazie" ){
                        
                           var chemie = data[i].count / persArrFak[10].freq;
            proportionArr.push({
                name: "Chemie",
                frequency: chemie,
                number: 10
            });
                       
                       }
                        
                         if(data[i].label == "Mathematik" ){
                            
                               var math = data[i].count / persArrFak[7].freq;
            proportionArr.push({
                name: "Mathematik",
                frequency: math,
                number: 8
            });
                       
                       }
                    
                     if(data[i].label == "Rechtswissenschaft"){
                        
                         var law = data[i].count / persArrFak[1].freq;
            proportionArr.push({
                name: "Recht",
                frequency: law,
                number: 1
            });
                       
                       }
                        
                        
                         if(data[i].label == "Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften" ){
                            
                              var phil = data[i].count / persArrFak[4].freq;
            proportionArr.push({
                name: "Philosophie",
                frequency: phil,
                number: 4
            });
                       
                       }
                    
                     if(data[i].label =="Biologie und Vorklinische Medizin" ){
                        
                          var bio = data[i].count / persArrFak[9].freq;
            proportionArr.push({
                name: "Biologie",
                frequency: bio,
                number: 7
            });
                       
                       }
                        
                         if(data[i].label =="Katholische Theologie" ){
                            
                             var rel = data[i].count / persArrFak[0].freq;
            proportionArr.push({
                name: "Theologie",
                frequency: rel,
                number: 3
            });
                       
                       }
                    
                        if(data[i].label =="Sprach-, Literatur- und  Kulturwissenschaften" ){
                            
                            var slk = data[i].count / persArrFak[6].freq;
            proportionArr.push({
                name: "SLK",
                frequency: slk,
                number: 6
            });
                       
                       }
                    
 
                    
                }

        };

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 1000 - margin.left - margin.right,
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

        data.forEach(function (d) {

            d.frequency = +d.frequency;
        });

        x.domain(data.map(function (d) {
            return d.name;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.frequency;
        })]);

        var div = d3.select("body").append("div")
            .attr("class", "bar_tooltip")
            .style("opacity", 0);

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
            .attr("fill", function (d) {

                var col = _getFakClass(d.name);
                return col;
            })
            .attr("x", function (d) {
                return x(d.name);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.frequency);
            })
            .attr("height", function (d) {
                return height - y(d.frequency);
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(extround(d.frequency, 10))
                    .style("z-index", "300")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        d3.select("#sort").on("change", change);

        var sortTimeout = setTimeout(function () {
            d3.select("#sort").property("checked", false).each(change);
        }, 2000);

        function change() {
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(data.sort(this.checked ? function (a, b) {
                        return b.frequency - a.frequency;
                    } : function (a, b) {
                        return d3.ascending(a.number, b.number);
                    })
                    .map(function (d) {
                        return d.name;
                    }))
                .copy();

            svg.selectAll(".bar")
                .sort(function (a, b) {
                    return x0(a.name) - x0(b.name);
                });

            var transition = svg.transition().duration(750),
                delay = function (d, i) {
                    return i * 50;
                };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function (d) {
                    return x0(d.name);
                });

            transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .delay(delay);
        }


    });

});


var extround = function (zahl, n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}

var _getFakClass = function (currFak) {
    switch (currFak) {
        case "Recht":
            return "#CDD30F"
            break;

        case "Wirtschaft":
            return "#AEA700"
            break;

        case "Theologie":
            return "#ECBC00"
            break;

        case "Philosophie":
            return "#EC6200"
            break;

        case "Psychologie":
            return "#BF002A"
            break;

        case "SLK":
            return "#9C004B"
            break;

        case "Biologie":
            return "#4FB800"
            break;

        case "Mathematik":
            return "#009B77"
            break;

        case "Physik":
            return "#008993"
            break;

        case "Chemie":
            return "#0087B2"
            break;

        case "Medizin":
            return "#00556A"
            break;

        default:
            return "#F0F8FF";

    }
};
