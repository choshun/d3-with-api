class TargetController {
  constructor(graphService) {
    this.graphService = graphService;
    this.name = 'Controller Component';
    this.data = {};
    this.rawSvg = document.getElementById('graph');
  }

  getServiceName() {
    return this.graphService.getName();
  }

  $onChanges(changesObj) {
    this.graphService.graph(this.rawSvg, this.data);
  }
}

export default TargetController;