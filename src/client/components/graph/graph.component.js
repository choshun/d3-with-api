import template from './graph.html';
import controller from './graph.controller';

let graphComponent = {
  restrict: 'E',
  template,
  controller,
  controllerAs: 'graphCtrl',
  bindings: {
    data: '<'
  }
};

export default graphComponent;