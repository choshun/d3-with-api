class ControlsController {
  constructor(controlsService) {
    this.controlsService = controlsService;

    this.data = {};
    this.timeout = {};
    this.timeoutTime = 1000;

    this.artistRequested = 'Starkey';
    this.artistId = undefined;
    this.artistName = undefined;

    this.init();
  }

  init() {
    this.getArtist();
  }

  getArtist() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.controlsService.getArtist(this.artistRequested).then((res) => {
        let serviceData = this.controlsService.getData('artist');
        this.artistId = serviceData.id;
        this.artistName = serviceData.name;

        this.getMetrics(this.artistId);
        this.setView(this.artistId);
      });
    }, this.timeoutTime);
  }

  getMetrics(artistId) {
    // TODO loop through like, tweet metrics and aggregate
    this.controlsService.getMetrics(artistId).then((res) => {
      console.log('METRICS PEW PEW', this.controlsService.getData('metrics'));

      this.setView(this.controlsService.getData('metrics'));
    });;
  }

  setView(data) {
    this.data = data;
    this.onDataChange({
      $event: { data: this.data }
    });
  }
}

export default ControlsController;