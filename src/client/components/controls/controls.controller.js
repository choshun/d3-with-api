class ControlsController {
  constructor(controlsService) {
    this.controlsService = controlsService;

    this.data = {};
    this.result = {};
    this.timeout = {};
    this.timeoutTime = 1000;
    this.artist = 'Kid cudi';

    this.init();
  }

  init() {
    this.getArtist();
  }

  getDetails() {
    this.setView(this.controlsService.getItems());
  }

  getArtist() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.controlsService.getArtist(this.artist).then((res) => {
        console.log('result', this.result);

        if (res.data.artists.length > 0) {
          this.result = res.data.artists[0].id;
          this.setView(this.result);
        } else {
          this.setView('nothin for ' + this.artist);
        }
        
      });
    }, this.timeoutTime);
  }

  getMetric() {
    // TODO loop through like, tweet metrics and aggregate
    this.controlsService.getMetrics(11).then((res) => {
      this.result = res.data;
      console.log('result', this.result);

      this.setView(this.result);
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