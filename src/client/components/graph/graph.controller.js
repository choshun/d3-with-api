class TargetController {
  constructor($window, graphService) {
    this.graphService = graphService;

    this.data = {};
    this.rawSvg = document.getElementById('graph');

    this.init();
  }

  init() {
    
  }

  $onChanges(changesObj) {
    console.log('change!!!', this.data);
    // this.graphService.graph(this.rawSvg, this.data);
  }
}

export default TargetController;