
var url = "http://localhost:3333/api/get/events"
var jData=new Array();



d3.json(url,function(data){

        jData=data;
    jData.sort(function(a,b){d3.ascending(a.length,b.length)});

var graph = new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        width: 600,
        height: 300,
        renderer: 'area',
        unstack:true,
        stack:false,
        stroke: false,
        smoother:true,
        preserve: true,
        series: jData
} );

graph.render();
//document.getElementById("smoothingSection").style.visibility = "hidden";


var preview = new Rickshaw.Graph.RangeSlider.Preview( {
        graph: graph,
        element: document.getElementById('preview'),
} );

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        xFormatter: function(x) {
                return new Date(x * 1000).toString();
        }
} );

var annotator = new Rickshaw.Graph.Annotate( {
        graph: graph,
        element: document.getElementById('timeline')
} );

var legend = new Rickshaw.Graph.Legend( {
        graph: graph,
        element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
        graph: graph,
        legend: legend
} );

var order = new Rickshaw.Graph.Behavior.Series.Order( {
        graph: graph,
        legend: legend
} );

var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
        graph: graph,
        legend: legend
} );

var smoother = new Rickshaw.Graph.Smoother( {
        graph: graph,
        element: document.querySelector('#smoother')
} );


var ticksTreatment = 'glow';

var xAxis = new Rickshaw.Graph.Axis.Time( {
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
} );

xAxis.render();

var yAxis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
} );

yAxis.render();


// var controls = new RenderControls( {
//         element: document.querySelector('form'),
//         graph: graph
// } );

// add some data every so often

var rendererForm = document.getElementById('renderer_form');

        rendererForm.addEventListener('change', function(e) {
                var renderMode = e.target.value;

                if (renderMode == 'line') {
                        graph.setRenderer('line');
                } else if (renderMode == 'area') {
                        graph.setRenderer('area');
                } else if (renderMode == 'scatterplot') {
                        graph.setRenderer('scatterplot');
                }  
            
                graph.render();
//            console.log(new Date(extround(graph.window.xMax,1)*1000));
//            console.log(new Date(extround(graph.window.xMin,1)*1000));




        }, false);
    
        var  extround= function(zahl,n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}

var messages = [
        "Changed home page welcome message",
        "Minified JS and CSS",
        "Changed button color from blue to green",
        "Refactored SQL query to use indexed columns",
        "Added additional logging for debugging",
        "Fixed typo",
        "Rewrite conditional logic for clarity",
        "Added documentation for new methods"
];

// setInterval( function() {
//      random.removeData(seriesData);
//      random.addData(seriesData);
//      graph.update();

// }, 3000 );

// function addAnnotation(force) {
//      if (messages.length > 0 && (force || Math.random() >= 0.95)) {
//              annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
//              annotator.update();
//      }
// }

// addAnnotation(true);
// setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );

 var previewXAxis = new Rickshaw.Graph.Axis.Time({
         graph: preview.previews[0],
         timeFixture: new Rickshaw.Fixtures.Time.Local(),
         ticksTreatment: ticksTreatment
 });

previewXAxis.render();
    
     setTimeout(function(){ graph.render(); }, 100);
    graph.onUpdate(function(){
        console.log();
        var min;
        var max;
        if(graph.window.xMin==undefined){
        min=1427781600;
        }else{
        min = extround(graph.window.xMin,1)
        }
        if(graph.window.xMax==undefined){
        max =1443510000;
        }else{
        max = extround(graph.window.xMax,1)
        }
        console.log(new Date(min*1000));
        console.log(new Date(max*1000)); 
         $('#range').html('<b>Range:</b> '+new Date(min*1000)+' - '+new Date(max*1000));         
    
    });


});
