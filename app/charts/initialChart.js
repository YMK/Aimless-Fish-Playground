/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'd3fc', 'd3'], function (angular, fc, d3) {
  'use strict';

  function generateChart() {
    return getData()
            .then(displayInitialChart);
  }

  function getData() {
    return new Promise((res, rej) => {
      // a random number generator
      var generator = fc.randomGeometricBrownianMotion()
          .steps(11);

      // some formatters
      var dateFormatter = d3.timeFormat('%b');

      // randomly generated sales data starting at one
      var data = generator(1).map(function(d, i) {
        return {
          month: dateFormatter(new Date(0, i + 1, 0)),
          sales: d + i / 2
        };
      });
      res(data);
    });
  }

  function displayInitialChart(data) {
    var yExtent = fc.extentLinear()
        .include([0])
        .pad([0, 0.5])
        .accessors([function(d) { return d.sales; }]);

    var chart = fc.chartSvgCartesian(
            d3.scalePoint(),
            d3.scaleLinear())
        .xDomain(data.map(function(d) { return d.month; }))
        .xPadding(0.5)
        .yDomain(yExtent(data))
        .yTicks(5)
        .xPadding(0.5)
        .yTickFormat(d3.format('$.0f'))
        .yLabel('Sales (millions)')
        .yNice();

    var series = fc.seriesSvgBar()
        .crossValue(function(d) { return d.month; })
        .mainValue(function(d) { return d.sales; });

    chart.plotArea(series);

    d3.select('#chart-initial')
        .datum(data)
        .call(chart);
  }

  return generateChart;
});
