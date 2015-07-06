

    Highcharts.theme = {
       colors: ["#ECBC00", "#CDD30F", "#AEA700", "#00556A", "#EC6200", "#BF002A", "#9C004B",
          "#009B77", "#008993", "#4FB800", "#0087B2"],
       chart: {
          backgroundColor: {
             linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
             stops: [
                [0, 'rgba(0,0,0,0)'],
                [1, 'rgba(0,0,0,0)']
             ]
          },
          style: {
             fontFamily: " 'Roboto'"
          },
          plotBorderColor: '#606063'
       },
       title: {
          style: {
             color: 'aliceblue',
             textTransform: 'uppercase',
             fontSize: '20px'
          }
       },
       subtitle: {
          style: {
             color: 'aliceblue',
             textTransform: 'uppercase'
          }
       },
       xAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
             style: {
                color: 'aliceblue'

             }
          }
       },
       yAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
             style: {
                color: 'aliceblue'
             }
          }
       },
       tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          style: {
             color: '#F0F0F0'
          }
       },
       plotOptions: {
          series: {
             dataLabels: {
                color: '#B0B0B3'
             },
             marker: {
                lineColor: '#333'
             }
          },
          boxplot: {
             fillColor: '#505053'
          },
          candlestick: {
             lineColor: 'white'
          },
          errorbar: {
             color: 'white'
          }
       },
       legend: {
          itemStyle: {
             color: '#E0E0E3'
          },
          itemHoverStyle: {
             color: '#FFF'
          },
          itemHiddenStyle: {
             color: '#606063'
          }
       },
       credits: {
          style: {
             color: '#666'
          }
       },
       labels: {
          style: {
             color: '#707073'
          }
       },

       drilldown: {
          activeAxisLabelStyle: {
             color: '#F0F0F3'
          },
          activeDataLabelStyle: {
             color: '#F0F0F3'
          }
       },

       navigation: {
          buttonOptions: {
             symbolStroke: '#DDDDDD',
             theme: {
                fill: '#505053'
             }
          }
       },

       // scroll charts
       rangeSelector: {
          buttonTheme: {
             fill: '#505053',
             stroke: '#000000',
             style: {
                color: '#CCC'
             },
             states: {
                hover: {
                   fill: '#707073',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                },
                select: {
                   fill: '#000003',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                }
             }
          },
          inputBoxBorderColor: '#505053',
          inputStyle: {
             backgroundColor: '#333',
             color: 'silver'
          },
          labelStyle: {
             color: 'silver'
          }
       },

       navigator: {
          handles: {
             backgroundColor: '#666',
             borderColor: '#AAA'
          },
          outlineColor: '#CCC',
          maskFill: 'rgba(255,255,255,0.1)',
          series: {
             color: '#7798BF',
             lineColor: '#A6C7ED'
          },
          xAxis: {
             gridLineColor: '#505053'
          }
       },

       scrollbar: {
          barBackgroundColor: '#808083',
          barBorderColor: '#808083',
          buttonArrowColor: '#CCC',
          buttonBackgroundColor: '#606063',
          buttonBorderColor: '#606063',
          rifleColor: '#FFF',
          trackBackgroundColor: '#404043',
          trackBorderColor: '#404043'
       },

       // special colors for some of the
       legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
       background2: '#505053',
       dataLabelsColor: '#B0B0B3',
       textColor: '#C0C0C0',
       contrastTextColor: '#F0F0F3',
       maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);



// code of the chart itself



        $(function () {
            
    var url = "http://localhost:3333/api/get/personal"
    var jData=new Array();
    var persArrFak = [];
    var persArrChairs = [];

     
            
            d3.json(url,function(data){
    
        _countPersonalForFaculties(data);

        function _countPersonalForFaculties(data){

        for(var i = 0 ; i < data.length-2; i++){
 
            personalCounter = 0 ;
            currentFaculty = data[i];
            
            personalCounter += currentFaculty.Personal.length;
            
            
             var directPersonal = ["Direkte Angestellte",currentFaculty.Personal.length];
            
                              var  currChairs =[];
            currChairs[0] = directPersonal;
            
              persArrChairs.push({
                        name:currentFaculty.Faculty,
                        id:currentFaculty.Faculty,
                        data:currChairs
                    });
            

                for(var j = 0 ; j<currentFaculty.Chairs.length; j++){
                    
                    
                    var personalOfFaculty = currentFaculty.Chairs;
                    var chair = personalOfFaculty[j];
                    
                    if(chair.personal==undefined){
                        personalCounter+=0;
                    }else{
                        
                        
                    var chairPersonal = chair.personal.length;
                    var chairName     = chair.name;
                    personalCounter+=chairPersonal; 
                        
                        if(chairPersonal>0){
                    currChairs[j+1] =  [chairName,chairPersonal];
                        
                        
                        persArrChairs.push({
                        
                            name:currentFaculty.Faculty,
                            id  :currentFaculty.Faculty,
                            data:currChairs
                        
                        });
                        }
                    }
                }
            
            if(currentFaculty.Faculty =="Fakultät für Medizin"){
                persArrFak.push({
                
               name : currentFaculty.Faculty,
               y: personalCounter,
                drilldown: null
                
            
            });
            }else
            
            persArrFak.push({
                
               name : currentFaculty.Faculty,
               y: personalCounter,
                drilldown: currentFaculty.Faculty
                
            
            });
            
        }
                    
                
    };
            
   
                
                    $('#container').highcharts({
                                
        chart: {
            type: 'column'
        },
        title: {
            text: ' '
        },
        subtitle: {
            text: ''
        },
                                   

        xAxis: {
            
            type: 'category',
            labels:{
                formatter: function(){
                    var label =this.value;
                    var lehr = new RegExp(/.*Lehrstuhl.*/);
           
                if(lehr.test(label)){
                label = label.replace(/Lehrstuhl für /gi," ");
                }
                        var inst = new RegExp(/.*Institut.*/);
           
                if(inst.test(label)){
                label = label.replace(/Institut für /,"");
                }
                
                    
                    if (label.length > 15){
                        return label.substr(0,15) + "...";
                    }else{
                         return label;   
                    }                        
                }
            }
        },
        yAxis: {
            title: {
                text: 'Verteilung der Personalanzahl über die Fakultäten'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    allowOverlap: false,
//                    format: '{point.y:.1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
        },

        series: [{
            name: "Fakultäten",
            colorByPoint: true,
            data: persArrFak
        }],
        drilldown: {
            series: persArrChairs
        }
                });
            });
        });
 




            
   







