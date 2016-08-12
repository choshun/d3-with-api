import angular from 'angular';
import Controls from './controls/controls';
import Target from './graph/graph';

export default angular.module('app.components', [
	Controls.name,
	Target.name
]);