class ControlsService {
  constructor($http) {
    this.$http = $http;

    this.api = 'https://api.nextbigsound.com/';
    this.apiArtist = this.api + 'search/v1/artists/';
    this.apiMetrics = this.api + 'metrics/v1/entityData/';
    this.accessToken = '2e7b54f5516e40969a07ec5a9f82f5c1';
    this.baseParams = {
      access_token: this.accessToken,
      start: '2015-08-01',
      end: '2016-08-01'
    }
    // this.metrics = '44,28,11'; 44 is facebook, 11 fb, 28 twitter
    this.metrics = '28,11';

    this.data = {
      metrics: {},
      artist: {
        id: 0,
        name: 'Nothing coming back :('
      }
    };
  }

  getArtist(artist) {
    let cleanArtistName = this.cleanArtistName(artist);

    return this.$http({
      url: this.apiArtist,
      params: Object.assign({}, this.baseParams, {
        limit: 1,
        query: artist
      })
    }).success((data) => {
      if (data.artists.length > 0) {
        this.data.artist.id = data.artists[0].id;
        this.data.artist.name = data.artists[0].name;
      } else {
        this.data.artist.name = `We've never of this artist before ¯\\_(ツ)_/¯`;
      }
      
    }).error((data, status) => {
      console.error(status);
    });
  }

  getMetrics(artistId) {
    return this.$http({
      url: this.apiMetrics,
      params: Object.assign({}, this.baseParams, {
        metrics: this.metrics,
        entities: artistId // artist from get artist
      })
    }).success((data) => {
      console.log('get something useful', data);
      this.data.metrics = this.prepMetricsData(data);
    }).error((data, status) => {
      console.error(status);
    });
  }

  prepMetricsData(data) {
    let baseKey = data.output.artists[this.data.artist.id];
    if (baseKey) {
      let metrics = [];
      metrics.push(this.getTwitterData(baseKey, data), this.getFacebookData(baseKey, data));

      // let preppedData = data.output.artists[5373].metrics['11'].endpoints['658357_starkeymusic'].data.global.values.totals;
      return metrics;
    }
    
  }

  // TODO consolidate metric getters.
  getFacebookData(baseKey, data) {
    let metricData = baseKey.metrics['11'].endpoints;
    return {
      'facebookMetric': metricData[this.getFirstKey(metricData)].data.global.values.totals
    };
  }

  getTwitterData(baseKey, data) {
    let metricData = baseKey.metrics['28'];

    if (metricData) {
      return {
        'twitterMetric': metricData.endpoints[this.getFirstKey(metricData.endpoints)].data.global.values.totals
      };
    }
  }

  // Helpers.
  getData(key) {
    return (key !== undefined) ? this.data[key] : this.data;
  }

  cleanArtistName(artist) {
    return artist.replace(/\s+/g, '+').toLowerCase();
  }

  getFirstKey(data) {
    for (var key in data) return key;
  }
}

export default ControlsService;