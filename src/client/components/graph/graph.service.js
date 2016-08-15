import * as D3 from 'd3';
import { forOwn } from 'lodash';

class TargetService {
  constructor() {
    this.name = 'graph service';

    this.padding = 100;
    this.pathClass = 'path';
    this.svg = undefined;
    this.xScale = undefined;
    this.yScale = undefined;
    this.xAxisGen = undefined;
    this.yAxisGen = undefined;
    this.lineFun = undefined;

    this.twitterData = [];
    this.facebookData = [];
  }

  graph(rawSvg, data) {
    this.svg = D3.select(rawSvg);
    this.drawLineChart(rawSvg, data);
  }

  getName() {
    return this.name;
  }

  setChartParameters(rawSvg, twitterData) {

    this.xScale = D3.scale.linear()
      .domain([this.twitterData[0].day, this.twitterData[this.twitterData.length - 1].day])
      .range([this.padding + 5, rawSvg.clientWidth - this.padding]);

    this.yScale = D3.scale.linear()
      .domain([d3.min(twitterData, (d) => d.total), d3.max(twitterData, (d) => d.total)])
      .range([rawSvg.clientHeight - this.padding, this.padding]);

    this.xAxisGen = D3.svg.axis()
      .scale(this.xScale)
      .orient("bottom")
      .ticks(12)

    this.yAxisGen = D3.svg.axis()
      .scale(this.yScale)
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format("0s"));

    this.lineFun = D3.svg.line()
      .x((d) => {
        // console.log(d.day)
        return this.xScale(d.day)
      })
      .y((d) => {
        // console.log(d.total);
        return this.yScale(d.total)
      })
      .interpolate("basis");

    this.area = D3.svg.area()
      .x((d) => {
        // console.log(d.day)
        return this.xScale(d.day)
      })
      .y((d) => {
        // console.log(d.total);
        return this.yScale(d.total)
      })
      .y0(rawSvg.clientHeight - (this.padding + 5))
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

  drawLineChart(rawSvg, data) {

    if (data.metrics === undefined) return;

    let twitterData = data.metrics.social[0]['twitterMetric'];
    let facebookData = data.metrics.social[1]['facebookMetric'];
    this.twitterData = this.prepData(twitterData);
    this.facebookData = this.prepData(facebookData);

    this.setChartParameters(rawSvg, this.twitterData);

    if (!this.initialized) {
      this.instantiateGraph(rawSvg);
    } else {
      this.updateGraph();
    }
  }

  instantiateGraph(rawSvg) {
    let axisStyles = { 
      'stroke': '#086788',
      'fill': 'none',
      'stroke-width': '0.5px',
      'font-size': '0.5em'
    };

    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'x axis')
      .style(axisStyles)
      .attr('transform', `translate(0, ${rawSvg.clientHeight - this.padding})`)
      .call(this.xAxisGen);

    this.svg.append('svg:g')
      .classed("svg-container", true)
      .attr('class', 'y axis')
      .style(axisStyles)
      .attr('transform', `translate(${this.padding}, 0)`)
      .call(this.yAxisGen);

    this.svg.append('svg:path')
      .attr('d', this.area(this.twitterData))
      .attr('stroke', '#07A0C3')
      .attr('stroke-width', 2)
      .attr('class', 'area')

    this.initialized = true;
  }

  updateGraph() {
    this.svg.select(".area")
      .transition()
      .duration(1000)
      .ease("cubic")
      .attr("d", this.area(this.twitterData))

    this.svg.selectAll("g.y.axis").call(this.yAxisGen);
    this.svg.selectAll("g.x.axis").call(this.xAxisGen);
  }

  // Helpers
  getFirstKey(data) {
    for (var key in data) return key;
  }
}

export default TargetService;