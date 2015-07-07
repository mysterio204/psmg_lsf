ChartController = function (options) {
    "use strict";


    var margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 30
        },
    
        width = 480 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;


    function renderChart(JSONData, which) {




        var data = JSONData.slice();


        var xValues = function (d) {
            return d.hour
        }
        var yValues = function (d) {
            return d.freq
        }



        var y = d3.scale.linear().range([height, 0]);
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 1);



        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        var chart = d3.select(options.chartContainer).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

        x.domain(data.map(function (d) {
            return xValues(d);
        }));


        y.domain([0, d3.max(data, function (d) {

            return yValues(d);

        })]);

        chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

        var div = d3.select("body").append("div")
            .attr("class", "bar_tooltip")
            .style("opacity", 0);


        chart.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("class", "circlebar").attr("x", function (d) {
                return x(xValues(d));
            }).attr("y", function (d) {

                return y(yValues(d));

            }).attr("height", function (d) {
                return height - y(yValues(d));

            }).attr("width", "40px")
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.freq)
                    .style("z-index", "300")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });






    }



    function getData() {

        d3.json(options.dataURL, function (error, json) {
            if (error) return console.warn(error);
            var data = json;
            console.log(data);

            renderChart(data);
        });




    }


    function renderBarChart(data) {
        renderChart(data);
    }

    return {
        renderBarChart: renderBarChart
    };

};
