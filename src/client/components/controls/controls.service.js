class ControlsService {
  constructor($http) {
    this.name = 'control service';
    this.$http = $http;
    this.data = { data: [
      {hour: 1, sales: 54},
      {hour: 2, sales: 66},
      {hour: 3, sales: 77},
      {hour: 4, sales: 70},
      {hour: 5, sales: 60},
      {hour: 6, sales: 63},
      {hour: 7, sales: 55},
      {hour: 8, sales: 47},
      {hour: 9, sales: 55},
      {hour: 10, sales: 20}
    ]};

    this.metric = 1;
    this.api = 'https://api.nextbigsound.com/metrics/v1/entityData';
    this.accessToken = '2e7b54f5516e40969a07ec5a9f82f5c1';
    // this.serviceCall = 'https://api.nextbigsound.com/metrics/v1/entityData?start=2016-01-01&end=2016-02-01&metrics=' + this.metric + '&entities=11&access_token=' + this.accessToken;
  }

  getName() {
    return this.name;
  }

  getItems(githubUsername, type) {
    
    return this.data;
  }

  getMetrics(metric) {
    console.log(metric);
    return this.$http({
      url: this.api,
      params: {
        metrics: metric,
        access_token: this.accessToken,
        start: '2013-01-01',
        end: '2014-01-01',
        entities: 11
      }
    }).success(function(data) {
      // TODO: pluck description of metric
      return data;
    }).error(function(data, status) {
      console.error(status);
    });
  }

  // getItems(githubUsername, type) {
  //   console.log(type, githubUrl + '/users/' +
  //     githubUsername + '?callback=JSON_CALLBACK&status=' + type);
  //   const githubUrl = 'https://api.github.com';
  //   return this.$http({
  //     method: 'JSONP',
  //     url: githubUrl + '/users/' +
  //     githubUsername + '?callback=JSON_CALLBACK&status=' + type
  //   }).success(function(data) {
  //     // this callback will be called asynchronously
  //     // when the response is available
  //     return data.data;
  //   }).error(function(data, status) {
  //     // called asynchronously if an error occurs
  //     // or server returns response with an error status.
  //     alert(status);
  //   });
  // }
}

export default ControlsService;