import angular from 'angular';
import Controls from './controls/controls';
import Graph from './graph/graph';

export default angular.module('app.components', [
	Controls.name,
	Graph.name
]);