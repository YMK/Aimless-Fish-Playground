/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['d3fc', 'd3'], function (fc, d3) {
  'use strict';

  var savedData = [];
  var savedIndex = 0;

  function lineChart() {
    return generateChart()
      .then(() => setInterval(generateChart, 500));
  }

  function generateChart() {
    return getData()
      .then(displayInitialChart);
  }

  function getData() {
    return new Promise((res, rej) => {
      var generator = fc.randomGeometricBrownianMotion().steps(0);

      var data = savedData.concat(generator(1).map(function(d, i) {
        return {
          month: savedIndex++,
          sales: Math.random() * (12 - 0) + 0
        };
      }));
      if (data.length > 11) {
        data.shift();
      }
      savedData = data;
      res(data);
    });
  }

  function displayInitialChart(data) {
    var yExtent = fc.extentLinear()
        .include([0, 12])
        .accessors([function(d) { return d.sales; }]);
    var xExtent = fc.extentLinear()
        .accessors([function(d) { return d.month; }]);

    var chart = fc.chartSvgCartesian(
            d3.scaleLinear(),
            d3.scaleLinear())
        .xDomain(xExtent(data))
        .yDomain(yExtent(data))
        .yTicks(5)
        .yTickFormat(d3.format('$.0f'))
        .yLabel('Sales (millions)')
        .yNice();

    var series = fc.seriesSvgLine()
        .crossValue(function(d) { return d.month; })
        .mainValue(function(d) { return d.sales; });

    chart.plotArea(series);

    d3.select('#chart-line')
        .datum(data)
        .call(chart);
  }

  return lineChart;
});
