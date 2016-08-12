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
  }

  getName() {
    return this.name;
  }

  getItems(githubUsername, type) {
    
    return this.data;
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