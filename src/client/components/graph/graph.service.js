import * as D3 from 'd3';

class TargetService {
  constructor() {
    this.name = 'graph service';

    this.padding = 20;
    this.pathClass = 'path';
    this.svg = undefined;
    this.xScale = undefined;
    this.yScale = undefined;
    this.xAxisGen = undefined;
    this.yAxisGen = undefined;
    this.lineFun = undefined;
  }

  graph(rawSvg, data) {
    this.svg = D3.select(rawSvg);
    this.drawLineChart(rawSvg, data.data);
  }

  getName() {
    return this.name;
  }

  setChartParameters(rawSvg, data) {
    this.xScale = D3.scale.linear()
      .domain([data[0].hour, data[data.length - 1].hour])
      .range([this.padding + 5, rawSvg.clientWidth - this.padding]);

    this.yScale = D3.scale.linear()
      .domain([0, d3.max(data, function (d) {
        return d.sales;
      })])
      .range([rawSvg.clientHeight - this.padding, 0]);

    this.xAxisGen = D3.svg.axis()
      .scale(this.xScale)
      .orient("bottom")
      .ticks(data.length - 1);

    this.yAxisGen = D3.svg.axis()
      .scale(this.yScale)
      .orient("left")
      .ticks(5);

    this.lineFun = D3.svg.line()
      .x((d) => this.xScale(d.hour))
      .y((d) => this.yScale(d.sales))
      .interpolate("basis");
  }

  drawLineChart(rawSvg, data) {
    if (data === undefined) return;

    this.setChartParameters(rawSvg, data);

    this.svg.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,180)')
      .call(this.xAxisGen);

    this.svg.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(20,0)')
      .call(this.yAxisGen);

    this.svg.append('svg:path')
      .attr('d', this.lineFun(data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', this.pathClass);
  }
}

export default TargetService;