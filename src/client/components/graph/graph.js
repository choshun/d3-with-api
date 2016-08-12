import angular from 'angular';
import graphComponent from './graph.component';
import graphService from './graph.service';

const graphModule = angular.module('graph', [])
  .component('graph', graphComponent)
  .service('graphService', graphService);

export default graphModule;