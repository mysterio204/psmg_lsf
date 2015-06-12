ChartController = function (options) {
    "use strict";
    /* eslint-env browser, jquery */
    /* global d3 */

    var margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 40
        },
//        options = {
//        chartContainer: document.querySelector(".chart"),
//        dataURL: "http://localhost:3333/api/get/hours",
//        detailURL: "http://localhost:3333/api/get/meals/"
//    },
        width = 480 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    
    function renderChart(JSONData){
        
        
        console.log(JSONData);
         var data = JSONData.slice()
         
         //if(wich.equals("hours")){
         var xValues = function(d) { return d.hour }
        var yValues = function(d) { return d.freq }
         
         
        // }
//         if(wich.equals("days")){
//         var xValues = function(d) { return d.Day }
//        var yValues = function(d) { return d.Value }
//         
//         
//         }
  
        
       
        
//        var y = d3.scale.linear().range([height,0]);
//        var x = d3.scale.ordinal().rangeRoundBands([0,width]);
        
         var x = d3.scale.ordinal()
                .rangeRoundBands([0,width])
                .domain(d3.extent(data, yValues))

         var y = d3.scale.linear()
                .range([height,0])
                .domain(d3.extent(data, xValues))
        
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");
        
        var chart = d3.select(options.chartContainer).attr("width",width+margin.left+margin.right).attr("height",height+margin.top+margin.bottom);
        
        x.domain(data.map(function(d){
        return xValues(d);
        }));
        
        
        y.domain([0,d3.max(data,function(d){
            
            return yValues(d);
        
        })]);
        
        chart.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis);
        
        chart.append("g").attr("class","y axis").call(yAxis);
        
        chart.selectAll(".bar").data(data).enter().append("rect").attr("class","bar").attr("x",function(d){
            return x(xValues(d));
        }).attr("y",function(d){
        
        return y(yValues(d));
        
        }).attr("height",function(d){
        return height - y(yValues(d));
        
        }).attr("width", "40px")
        .on("mouseover",function(d){
        console.log(d)});
        
    }
    
    
    
    
    
 
    
    
    
    
    

    function getData(){
        
        d3.json(options.dataURL, function(error, json) {
            if (error) return console.warn(error);
            var data = json;
            console.log(data);
            
            renderChart(data);
});
        

//        d3.csv(options.dataURL,function(d){
//        
//            return{
//            day:d.day,
//            customers:parseInt(d.customers)    
//            }
//            
//            
//            console.log(d);
//            
//        } ,renderChart);
    
    }
    
    
    function renderBarChart(data) {
    renderChart(data);
    }

    return {
        renderBarChart: renderBarChart
    };

};