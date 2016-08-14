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

    /**
     * Metric type request params. 44 is youtube, 11 fb, 28 twitter
     * @type {String}
     */
    this.metrics = '28,11';

    /**
     * The value of the highest week of increased social followers.
     * Sort of a placeholder, 
     *     {['day']: ['number for the week']}
     *
     * is in this.data.metrics.
     * @type {Number}
     */
    this.highestDelta = 0;

    /**
     * A day threshold.
     * @type {Number}
     */
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
      events: {}
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
      this.data.metrics.social = this.prepMetricsData(data);
      this.data.metrics.delta = this.findDelta(this.data.metrics.social);
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

      return metrics;
    }
  }

  // TODO consolidate metric getters.
  getFacebookData(baseKey, data) {
    // Something fishy is going on here, when I move .endpoints to the return key it borks.
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

  findDelta(socialData) {
    let data = this.aggregateSocialTotals(socialData),
        deltaMetric = {},
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

        oldObjKey = key;
      }

      index++;
    });

    return deltaMetricOverTime;
  }

  aggregateSocialTotals(socialData) {
    let aggregateData = {},
        twitterData = socialData[0][this.getFirstKey(socialData[0])],
        faceBookData = socialData[1][this.getFirstKey(socialData[1])];

    _.forOwn(twitterData, (value, key) => {
      aggregateData[key] = (parseInt(twitterData[key]) + parseInt(faceBookData[key]));
    });

    return aggregateData;
  }

  getDeltaOverTime(data, start, time, key) {
    let delta = 0;

    let deltaStart = data[start - time],
        deltaEnd = data[start - 1];

    // delta = (deltaEnd - deltaStart) / deltaEnd;
    delta = (deltaEnd - deltaStart);

    // Get highest delta. This will drive what events I request.
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