class TargetController {
  constructor($window, graphService) {
    this.graphService = graphService;

    this.data = {};
    this.rawSvg = document.getElementById('graph');
  }

  $onChanges(changesObj) {
    this.graphService.graph(this.rawSvg, this.data);
  }
}

export default TargetController;