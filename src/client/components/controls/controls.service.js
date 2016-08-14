import { forOwn } from 'lodash';

class ControlsService {
  constructor($http) {
    this.$http = $http;

    this.api = 'https://api.nextbigsound.com/';
    this.apiArtist = this.api + 'search/v1/artists/';
    this.apiMetrics = this.api + 'metrics/v1/entityData/';
    this.apiEvents = this.api + 'events/v1/artists/';
    this.accessToken = '2e7b54f5516e40969a07ec5a9f82f5c1';
    this.baseParams = {
      access_token: this.accessToken,
      start: '2015-08-01',
      end: '2016-08-01'
    };
    // this.metrics = '44,28,11'; 44 is facebook, 11 fb, 28 twitter
    this.metrics = '28,11';
    this.highestDelta = 0;
    this.time = 7;

    this.data = {
      metrics: {
        highestDelta: {},
        delta: {},
        social: {}
      },
      artist: {
        id: 0,
        name: 'Nothing coming back :('
      },
      events: {},
      delta: {}
    };

    this.dataCoefficent = 86400000;
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
      // console.log('get something useful', data);
      this.data.metrics.social = this.prepMetricsData(data);
    }).error((data, status) => {
      console.error(status);
    });
  }

  getEvents(artistId) {
    let end = parseInt(this.getFirstKey(this.data.metrics.highestDelta)),
        start = end - this.time;

    return this.$http({
      url: this.apiEvents + artistId,
      params: Object.assign({}, this.baseParams, {
        start: start,
        end: end
      })
    }).success((data) => {
      this.data.events = data;
    }).error((data, status) => {
      console.error(status);
    });
  }

  prepMetricsData(data) {
    let baseKey;

    if (data.output) {
      baseKey = data.output.artists[this.data.artist.id];
    }

    if (baseKey) {
      let metrics = [];
      // Get fb and twitter totals
      metrics.push(this.getTwitterData(baseKey, data), this.getFacebookData(baseKey, data));
      // Get fb and twitter deltas
      // TODO aggregate? only getting fb
      this.findDelta(this.getFacebookData(baseKey, data).facebookMetric);

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

  findDelta(data) {
    let deltaMetric = {},
        deltaMetricFlat = [],
        deltaMetricOverTime = {},
        index = 0,
        oldObjKey;

    _.forOwn(data, (value, key) => {
      if (index === 0) {
        oldObjKey = key;
        
      } else {
        deltaMetric[key] = (value - data[oldObjKey]);
        deltaMetricFlat.push(value);

        if (index > this.time) {
          deltaMetricOverTime[key] = this.getDeltaOverTime(deltaMetricFlat, index, this.time, key);
        }

        // console.log(value, value - data[oldObjKey], (value - data[oldObjKey]) / value + '%');
        oldObjKey = key;
      }

      index++;
    });

    this.data.metrics.delta = deltaMetricOverTime;
  }

  getDeltaOverTime(data, start, time, key) {
    let delta = 0;

    let deltaStart = data[start - time],
        deltaEnd = data[start - 1];

    // delta = (deltaEnd - deltaStart) / deltaEnd;
    delta = (deltaEnd - deltaStart);

    // console.log(delta, this.highestDelta);

    if (delta > this.highestDelta) {
      this.highestDelta = delta;
      this.data.metrics.highestDelta = {
        [key - time]: this.highestDelta
      };
    }

    return delta;
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