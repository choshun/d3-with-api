class ControlsService {
  constructor($http) {
    this.$http = $http;

    this.api = 'https://api.nextbigsound.com/';
    this.apiArtist = this.api + 'search/v1/artists/';
    this.apiMetrics = this.api + 'metrics/v1/entityData';
    this.accessToken = '2e7b54f5516e40969a07ec5a9f82f5c1';
    this.baseParams = {
      access_token: this.accessToken,
      start: '2013-01-01',
      end: '2014-01-01'
    }
  }

  cleanArtistName(artist) {
    return artist.replace(/\s+/g, '+').toLowerCase();
  }

  getArtist(artist) {
    let cleanArtistName = this.cleanArtistName(artist);

    console.log(cleanArtistName);
    return this.$http({
      url: this.apiArtist,
      params: Object.assign({}, this.baseParams, {
        limit: 1,
        query: artist
      })
    }).success(function(data) {
      // TODO: pluck description of metric
      return data;
    }).error(function(data, status) {
      console.error(status);
    });
  }

  getMetrics(metric, entity = 12) {
    console.log(metric);
    return this.$http({
      url: this.apiMetrics,
      params: Object.assign({}, this.baseParams, {
        metrics: metric,
        entities: entity // artist from get artist
      })
    }).success(function(data) {
      // TODO: pluck description of metric
      return data;
    }).error(function(data, status) {
      console.error(status);
    });
  }
}

export default ControlsService;