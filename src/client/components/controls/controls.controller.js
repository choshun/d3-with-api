class ControlsController {
  constructor(controlsService) {
    this.controlsService = controlsService;
    this.name = 'I get ler Component';
    this.githubUsername = 'choshun';
    this.result = {};
    this.timeout = {};
    this.timeoutTime = 1000;
    this.type = 'User';
  }

  getServiceName() {
    return this.controlsService.getName();
  }

  // getDetails() {
  //   clearTimeout(this.timeout);

  //   this.timeout = setTimeout(() => {
  //     this.controlsService.getItems(this.githubUsername, this.type).then((res) => {
  //         this.result = res.data;
  //         console.log('result?', this.result);
  //         console.log(this.result);

  //         this.setView(this.result.data.id);
  //       });
  //   }, this.timeoutTime);
  // }

  getDetails() {
    this.setView(this.controlsService.getItems());
  }

  setView(data) {
    // console.log('data!!', data);
    this.data = data;
    this.onDataChange({
      $event: { data: this.data }
    });
  }
}

export default ControlsController;