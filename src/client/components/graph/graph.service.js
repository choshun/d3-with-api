import * as D3 from 'd3';
import { forOwn } from 'lodash';

class TargetService {
  constructor() {
    this.name = 'graph service';

    this.padding = 100;
    this.pathClass = 'path';
    this.svg = undefined;
    this.xScale = undefined;
    this.twitterYScale = undefined;
    this.facebookYScale = undefined;
    this.deltaYScale = undefined;
    this.xAxisGen = undefined;
    this.twitterYAxisGen = undefined;
    this.facebookYAxisGen = undefined;
    this.lineFun = undefined;

    this.twitterData = [];
    this.facebookData = [];
    this.deltaData = [];
  }

  graph(rawSvg, data) {
    this.svg = D3.select(rawSvg);
    this.drawCharts(rawSvg, data);
  }

  getName() {
    return this.name;
  }

  setChartParameters(rawSvg) {
    this.xScale = D3.scale.linear()
      .domain([this.twitterData[0].day, this.twitterData[this.twitterData.length - 1].day])
      .range([this.padding + 5, rawSvg.clientWidth - this.padding]);

    this.twitterYScale = D3.scale.linear()
      .domain([d3.min(this.twitterData, (d) => d.total), d3.max(this.twitterData, (d) => d.total)])
      .range([rawSvg.clientHeight - this.padding, this.padding]);

    this.facebookYScale = D3.scale.linear()
      .domain([d3.min(this.facebookData, (d) => d.total), d3.max(this.facebookData, (d) => d.total)])
      .range([rawSvg.clientHeight - this.padding, this.padding]);

    this.deltaYScale = D3.scale.linear()
      .domain([d3.min(this.deltaData, (d) => d.total), d3.max(this.deltaData, (d) => d.total)])
      .range([rawSvg.clientHeight - this.padding, this.padding]);

    this.xAxisGen = D3.svg.axis()
      .scale(this.xScale)
      .orient("bottom")
      .ticks(12)

    this.twitterYAxisGen = D3.svg.axis()
      .scale(this.twitterYScale)
      .orient("right")
      .ticks(5)
      .tickFormat(d3.format("0s"));

    this.facebookYAxisGen = D3.svg.axis()
      .scale(this.facebookYScale)
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format("0s"));

    this.deltaYAxisGen = D3.svg.axis()
      .scale(this.deltaYScale)
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format("0s"));

    this.twitterArea = D3.svg.area()
      .x((d) => this.xScale(d.day))
      .y((d) => this.twitterYScale(d.total))
      .y0(rawSvg.clientHeight - (this.padding + 5))
      .interpolate("basis");

    this.facebookArea = D3.svg.area()
      .x((d) => this.xScale(d.day))
      .y((d) => this.facebookYScale(d.total))
      .y0(rawSvg.clientHeight - (this.padding + 5))
      .interpolate("basis");


    this.lineFun = D3.svg.line()
      .x((d) => this.xScale(d.day))
      .y((d) => this.deltaYScale(d.total))
      .interpolate("basis");
  }

  prepData(data) {
    let preppedData = [];

    _.forOwn(data, (value, key) => {
      preppedData.push({
        day: key,
        total: value
      });
    });

    return preppedData;
  }

  drawCharts(rawSvg, data) {
    if (data.metrics === undefined) return;

    let twitterData = data.metrics.social[0]['twitterMetric'];
    let facebookData = data.metrics.social[1]['facebookMetric'];
    let deltaData = data.metrics.delta;
    this.twitterData = this.prepData(twitterData);
    this.facebookData = this.prepData(facebookData);
    this.deltaData = this.prepData(deltaData);

    this.setChartParameters(rawSvg);

    if (!this.initialized) {
      this.instantiateGraph(rawSvg);
    } else {
      this.updateGraph();
    }
  }

  instantiateGraph(rawSvg) {

    // Axes.
    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${rawSvg.clientHeight - this.padding})`)
      .call(this.xAxisGen);

    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'y-axis-twitter')
      .attr('transform', `translate(${rawSvg.clientWidth - this.padding + 5}, -5)`)
      .call(this.twitterYAxisGen);

    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'y-axis-facebook')
      .attr('transform', `translate(${rawSvg.clientWidth - this.padding + 5}, -5)`)
      .call(this.facebookYAxisGen);

    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'y-axis-delta')
      .attr('transform', `translate(${this.padding + 5}, -5)`)
      .call(this.deltaYAxisGen);

    // Areas.
    this.svg.append('svg:path')
      .attr('d', this.twitterArea(this.twitterData))
      .attr('stroke', '#07A0C3')
      .attr('stroke-width', 2)
      .attr('class', 'twitter-area');

    this.svg.append('svg:path')
      .attr('d', this.facebookArea(this.facebookData))
      .attr('stroke', '#07A0C3')
      .attr('stroke-width', 2)
      .attr('class', 'facebook-area');

    // Lines.
    this.svg.append('svg:path')
      .attr('d', this.lineFun(this.deltaData))
      .attr('stroke', '#07A0C3')
      .attr('stroke-width', 2)
      .attr('class', 'delta-line');

    this.initialized = true;
  }

  updateGraph() {
    this.svg.select(".twitter-area")
      .transition()
      .duration(1000)
      .ease("cubic")
      .attr("d", this.twitterArea(this.twitterData))

    this.svg.select(".facebook-area")
      .transition()
      .duration(1000)
      .ease("cubic")
      .attr("d", this.facebookArea(this.facebookData))

    this.svg.select(".delta-line")
      .transition()
      .duration(1000)
      .ease("cubic")
      .attr("d", this.lineFun(this.deltaData))

    this.svg.selectAll("g.y-axis-twitter").call(this.twitterYAxisGen);
    this.svg.selectAll("g.y-axis-facebook").call(this.facebookYAxisGen);
    this.svg.selectAll("g.y-axis-delta").call(this.deltaYAxisGen);
    this.svg.selectAll("g.x.axis").call(this.xAxisGen);
  }

  // Helpers
  getFirstKey(data) {
    for (var key in data) return key;
  }
}

export default TargetService;