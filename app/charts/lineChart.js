/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['d3fc', 'd3'], function (fc, d3) {
  'use strict';

  var savedData = [];
  var savedIndex = 0;

  function lineChart() {
    return generateChart()
      .then(() => setInterval(generateChart, 60000));
  }

  function generateChart() {
    return getData()
      .then(displayInitialChart);
  }

  function getData() {
    return fetch('http://localhost:8081/twitter/followers')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return res;
      });
  }

  function displayInitialChart(data) {
    var xExtent = fc.extentDate()
        .accessors([(d) => d.time]);
    var yExtent = fc.extentLinear()
        .accessors([(d) => d.num]);

    var chart = fc.chartSvgCartesian(
            d3.scaleTime(),
            d3.scaleLinear())
        .xDomain(xExtent(data))
        .xLabel('Date')
        .yDomain(yExtent(data))
        .yLabel('Followers')
        .yNice();

    var series = fc.seriesSvgLine()
        .crossValue((d) => d.time)
        .mainValue((d) => d.num);

    chart.plotArea(series);

    d3.select('#chart-line')
        .datum(data)
        .call(chart);
  }

  return lineChart;
});
