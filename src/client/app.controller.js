class AppController {
  constructor(graphService) {
    this.data = undefined;
  }

  modifyData(data) {
    this.data = data;
  }
}

export default AppController;