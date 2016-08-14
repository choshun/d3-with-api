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
      this.getEvents(artistId);
      this.setView(this.controlsService.getData());
    });
  }

  getEvents(artistId) {
    this.controlsService.getEvents(artistId).then((res) => {
      console.log('EVENTS PEW PEW', this.controlsService.getData('events'));
      this.setView(this.controlsService.getData());
    });
  }

  setView(data) {
    this.data = data;
    this.onDataChange({
      $event: { data: this.data }
    });
  }
}

export default ControlsController;