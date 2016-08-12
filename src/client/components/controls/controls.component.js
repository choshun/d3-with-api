import template from './controls.html';
import controller from './controls.controller';

let controlsComponent = {
  restrict: 'E',
  scope: {},
  template: template,
  controller: controller,
  controllerAs: 'controlsCtrl',
  bindings: {
    data: '<',
    onDataChange: '&'
  }
};

export default controlsComponent;