var url = "http://localhost:3333/api/get/counter"
var jData = new Array();
var eventArr = [];



d3.json(url, function (data) {

    eventArr = data;

    (function (d3) {
        'use strict';

        eventArr.forEach(function (d) {

            d.enabled = true;
        });
        var width = 350;
        var height = 350;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 100;
        var legendRectSize = 20;
        var legendSpacing = 8;

        var color = d3.scale.category20b();

        var svg = d3.select('#piechart')
            .append('svg')
            .attr('width', 500)
            .attr('height', 500)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');


        var test = d3.select('#pielegend')
            .append('svg')
            .attr('width', 700)
            .attr('height', 400)
            .append('g')
            .attr('transform', 'translate(' + (200 / 2) +
                ',' + (400 / 2) + ')');

        var arc = d3.svg.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

        var pie = d3.layout.pie()
            .value(function (d) {
                return d.count;
            })
            .sort(null);

        var tooltip = d3.select('#piechart')
            .append('div')
            .attr('class', 'pietooltip');

        tooltip.append('div')
            .attr('class', 'label');

        tooltip.append('div')
            .attr('class', 'count');

        tooltip.append('div')
            .attr('class', 'percent');

        var path = svg.selectAll('path')
            .data(pie(eventArr))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {

                var col = color(d.data.label)
                return _getColor(d.data.label);

            })
            .each(function (d) {
                this._current = d;
            });

        path.on('mouseover', function (d) {
            var total = d3.sum(eventArr.map(function (d) {
                return (d.enabled) ? d.count : 0;
            }));
            var percent = Math.round(1000 * d.data.count / total) / 10;
            tooltip.select('.label').html(d.data.label);
            tooltip.select('.count').html(d.data.count);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function () {
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function (d) {
            tooltip.style('top', (d3.event.pageY + 10) + 'px')
                .style('left', (d3.event.pageX + 10) + 'px');
        });


        var legend = test.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function (d) {
                var col = color;
                return _getColor(d);
            })
            .style('stroke', function (d) {
                var col = color;
                return _getColor(d);
            })
            .on('click', function (label) {
                var rect = d3.select(this);
                var enabled = true;
                var totalEnabled = d3.sum(eventArr.map(function (d) {
                    return (d.enabled) ? 1 : 0;


                }));

                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', '');
                } else {
                    if (totalEnabled < 2) return;
                    rect.attr('class', 'disabled');
                    enabled = false;

                }

                pie.value(function (d) {
                    if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                path = path.data(pie(eventArr));

                path.transition()
                    .duration(750)
                    .attrTween('d', function (d) {
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
            });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return d;
            });

    })(window.d3);

});

function _getColor(currFak) {
    switch (currFak) {
        case "Rechtswissenschaft":
            return "#CDD30F"
            break;

        case "Wirtschaftswissenschaften":
            return "#AEA700"
            break;

        case "Katholische Theologie":
            return "#ECBC00"
            break;

        case "Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften":
            return "#EC6200"
            break;

        case "Psychologie, Pädagogik und Sportwissenschaft":
            return "#BF002A"
            break;

        case "Sprach-, Literatur- und  Kulturwissenschaften":
            return "#9C004B"
            break;

        case "Biologie und Vorklinische Medizin":
            return "#4FB800"
            break;

        case "Mathematik":
            return "#009B77"
            break;

        case "Physik / Courses in Physics":
            return "#008993"
            break;

        case "Chemie und Pharmazie":
            return "#0087B2"
            break;

        case "Medizin":
            return "#00556A"
            break;

        default:
            return "#F0F8FF";

    }
};
