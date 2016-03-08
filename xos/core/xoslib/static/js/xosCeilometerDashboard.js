"use strict";angular.module("xos.ceilometerDashboard",["ngResource","ngCookies","ngLodash","ui.router","xos.helpers","ngAnimate","chart.js","ui.bootstrap.accordion"]).config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("ceilometerDashboard",{url:"/",template:"<ceilometer-dashboard></ceilometer-dashboard>"}).state("samples",{url:"/:name/:tenant/samples",template:"<ceilometer-samples></ceilometer-samples>"}),t.otherwise("/")}]).config(["$httpProvider",function(e){e.interceptors.push("NoHyperlinks")}]).run(["$rootScope",function(e){e.stateName="ceilometerDashboard",e.$on("$stateChangeStart",function(t,n){e.stateName=n.name})}]).service("Ceilometer",["$http","$q",function(e,t){this.getMappings=function(){var n=t.defer();return e.get("/xoslib/xos-slice-service-mapping/").then(function(e){n.resolve(e.data)})["catch"](function(e){n.reject(e)}),n.promise},this.getMeters=function(n){var s=t.defer();return e.get("/xoslib/meters/",{cache:!0,params:n}).then(function(e){s.resolve(e.data)})["catch"](function(e){s.reject(e)}),s.promise},this.getSamples=function(n,s){var r=t.defer();return e.get("/xoslib/metersamples/",{params:{meter:n,tenant:s}}).then(function(e){r.resolve(e.data)})["catch"](function(e){r.reject(e)}),r.promise},this.getStats=function(n){var s=t.defer();return e.get("/xoslib/meterstatistics/",{cache:!0,params:n}).then(function(e){s.resolve(e.data)})["catch"](function(e){s.reject(e)}),s.promise},this.selectedService=null,this.selectedSlice=null,this.selectedResource=null}]).directive("ceilometerDashboard",["lodash",function(e){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/ceilometer-dashboard.tpl.html",controller:["Ceilometer",function(t){var n=this;this.showStats=!1,this.accordion={open:{}},this.openPanels=function(){t.selectedService&&(n.accordion.open[t.selectedService]=!0,t.selectedSlice&&(n.loadSliceMeter(t.selectedSlice,t.selectedService),n.selectedSlice=t.selectedSlice,t.selectedResource&&(n.selectedResource=t.selectedResource)))},this.loadMappings=function(){n.loader=!0,t.getMappings().then(function(e){e.map(function(e){return"service_ONOS_vBNG"===e.service&&(e.service="ONOS_FABRIC",e.slices.map(function(e){"mysite_onos_vbng"===e.slice&&(e.slice="ONOS_FABRIC")})),"service_ONOS_vOLT"===e.service&&(e.service="ONOS_CORD",e.slices.map(function(e){"mysite_onos_volt"===e.slice&&(e.slice="ONOS_CORD")})),e}),n.services=e,n.openPanels()})["catch"](function(e){n.error=e.data&&e.data.detail?e.data.detail:"An Error occurred. Please try again later."})["finally"](function(){n.loader=!1})},this.loadMappings(),this.loadSliceMeter=function(s,r){t.selectedSlice=null,t.selectedService=null,t.selectedResources=null,n.loader=!0,n.error=null,n.ceilometerError=null,t.getMeters({tenant:s.project_id}).then(function(a){n.selectedSlice=s.slice,n.selectedTenant=s.project_id,t.selectedSlice=s,t.selectedService=r,a.map(function(e){return e.resource_name=e.resource_name.replace("mysite_onos_vbng","ONOS_FABRIC"),e.resource_name=e.resource_name.replace("mysite_onos_volt","ONOS_CORD"),e}),n.selectedResources=e.groupBy(a,"resource_name"),t.selectedResource&&(n.selectedMeters=n.selectedResources[t.selectedResource])})["catch"](function(e){return 503===e.status?n.ceilometerError=e.data.detail.specific_error:void(n.error=e.data&&e.data.detail.specific_error?e.data.detail.specific_error:"An Error occurred. Please try again later.")})["finally"](function(){n.loader=!1})},this.selectedMeters=null,this.selectMeters=function(e,s){n.selectedMeters=e,t.selectedResource=s,n.selectedResource=s}}]}}]).directive("ceilometerSamples",["lodash","$stateParams",function(e,t){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/ceilometer-samples.tpl.html",controller:["Ceilometer",function(n){var s=this;if(this.chartColors=["#286090","#F7464A","#46BFBD","#FDB45C","#97BBCD","#4D5360","#8c4f9f"],this.chart={series:[],labels:[],data:[]},Chart.defaults.global.colours=this.chartColors,this.chartType="line",!t.name||!t.tenant)throw new Error("Missing Name and Tenant Params!");this.name=t.name,this.tenant=t.tenant,this.getLabels=function(e){return e.reduce(function(e,t){var n=new Date(t.timestamp);return e.push(n.getHours()+":"+((n.getMinutes()<10?"0":"")+n.getMinutes())+":"+n.getSeconds()),e},[])},this.getData=function(e){return e.reduce(function(e,t){return e.push(t.volume),e},[])},this.chartMeters=[],this.addMeterToChart=function(t){s.chart.labels=s.getLabels(e.sortBy(s.samplesList[t],"timestamp")),s.chart.series.push(t),s.chart.data.push(s.getData(e.sortBy(s.samplesList[t],"timestamp"))),s.chartMeters.push(s.samplesList[t][0]),e.remove(s.sampleLabels,{id:t})},this.removeFromChart=function(t){s.chart.data.splice(s.chart.series.indexOf(t.project_id),1),s.chart.series.splice(s.chart.series.indexOf(t.project_id),1),s.chartMeters.splice(e.findIndex(s.chartMeters,{project_id:t.project_id}),1),s.sampleLabels.push({id:t.project_id,name:t.resource_name||t.project_id})},this.formatSamplesLabels=function(t){return e.uniq(t,"project_id").reduce(function(e,t){return e.push({id:t.project_id,name:t.resource_name||t.project_id}),e},[])},this.showSamples=function(){s.loader=!0,n.getSamples(s.name).then(function(t){t.map(function(e){return e.resource_name=e.resource_name.replace("mysite_onos_vbng","ONOS_FABRIC"),e.resource_name=e.resource_name.replace("mysite_onos_volt","ONOS_CORD"),e}),s.samplesList=e.groupBy(t,"project_id"),s.sampleLabels=s.formatSamplesLabels(t),s.addMeterToChart(s.tenant)})["catch"](function(e){s.error=e.data.detail})["finally"](function(){s.loader=!1})},this.showSamples()}]}}]).directive("ceilometerStats",function(){return{restrict:"E",scope:{name:"=name",tenant:"=tenant"},bindToController:!0,controllerAs:"vm",templateUrl:"templates/ceilometer-stats.tpl.html",controller:["$scope","Ceilometer",function(e,t){var n=this;this.getStats=function(e){n.loader=!0,t.getStats({tenant:e}).then(function(e){e.map(function(e){return e.resource_name=e.resource_name.replace("mysite_onos_vbng","ONOS_FABRIC"),e.resource_name=e.resource_name.replace("mysite_onos_volt","ONOS_CORD"),e}),n.stats=e})["catch"](function(e){n.error=e.data})["finally"](function(){n.loader=!1})},e.$watch(function(){return n.name},function(e){e&&n.getStats(n.tenant)})}]}}),angular.module("xos.ceilometerDashboard").run(["$templateCache",function(e){e.put("templates/accordion-group.html",'<div class="panel {{panelClass || \'panel-default\'}}">\n  <div class="panel-heading" ng-keypress="toggleOpen($event)">\n    <h5>\n      <a href tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h5>\n  </div>\n  <div class="panel-collapse collapse" uib-collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n'),e.put("templates/accordion.html",'<div class="panel-group" ng-transclude></div>'),e.put("templates/ceilometer-dashboard.tpl.html",'<div class="row">\n  <div class="col-sm-10">\n    <h3>XOS Monitoring Statistics</h3>\n  </div>\n  <div class="col-xs-2 text-right">\n    <a href="" class="btn btn-default" \n      ng-show="vm.selectedSlice && !vm.showStats"\n      ng-click="vm.showStats = true">\n      <i class="glyphicon glyphicon-transfer"></i>\n    </a>\n    <a href="" class="btn btn-default" \n      ng-show="vm.selectedSlice && vm.showStats"\n      ng-click="vm.showStats = false">\n      <i class="glyphicon glyphicon-transfer"></i>\n    </a>\n  </div>\n</div>\n\n<div class="row" ng-show="vm.loader">\n  <div class="col-xs-12">\n    <div class="loader">Loading</div>\n  </div>\n</div>\n\n<section ng-hide="vm.loader" ng-class="{animate: !vm.loader}">\n  <div class="row">\n    <div class="col-sm-3 service-list">\n        <h4>XOS Service: </h4>\n        <uib-accordion close-others="true" template-url="templates/accordion.html">\n          <uib-accordion-group\n            ng-repeat="service in vm.services | orderBy:\'-service\'"\n            template-url="templates/accordion-group.html"\n            is-open="vm.accordion.open[service.service]"\n            heading="{{service.service}}">\n            <h5>Slices:</h5>\n            <a ng-repeat="slice in service.slices" \n              ng-class="{active: slice.slice === vm.selectedSlice}"\n              ng-click="vm.loadSliceMeter(slice, service.service)"\n              href="#" class="list-group-item" >\n              {{slice.slice}} <i class="glyphicon glyphicon-chevron-right pull-right"></i>\n            </a>\n          </uib-accordion-group>\n        </uib-accordion>\n    </div>\n    <section class="side-container col-sm-9">\n      <div class="row">\n        <!-- STATS -->\n        <article ng-hide="!vm.showStats" class="stats animate-slide-left">\n          <div class="col-xs-12">\n            <div class="list-group">\n              <div class="list-group-item">\n                <h4>Stats</h4>\n              </div>\n              <div class="list-group-item">\n                <ceilometer-stats ng-if="vm.selectedSlice" name="vm.selectedSlice" tenant="vm.selectedTenant"></ceilometer-stats>\n              </div>\n            </div>\n          </div>\n        </article>\n        <!-- METERS -->\n        <article ng-hide="vm.showStats" class="meters animate-slide-left">\n          <div class="alert alert-danger" ng-show="vm.ceilometerError">\n            {{vm.ceilometerError}}\n          </div>\n          <div class="col-sm-4 animate-slide-left" ng-hide="!vm.selectedSlice">\n            <div class="list-group">\n              <div class="list-group-item">\n                <h4>Resources</h4>\n              </div>\n              <a href="#" \n                ng-click="vm.selectMeters(meters, resource)" \n                class="list-group-item" \n                ng-repeat="(resource, meters) in vm.selectedResources" \n                ng-class="{active: resource === vm.selectedResource}">\n                {{resource}} <i class="glyphicon glyphicon-chevron-right pull-right"></i>\n              </a>\n            </div>\n          </div>\n          <div class="col-sm-8 animate-slide-left" ng-hide="!vm.selectedMeters">\n            <div class="list-group">\n              <div class="list-group-item">\n                <h4>Meters</h4>\n              </div>\n              <div class="list-group-item">\n                <div class="row">\n                  <div class="col-xs-6">\n                    <label>Name:</label>\n                  </div>\n                  <div class="col-xs-3">\n                    <label>Unit:</label>\n                  </div>\n                  <div class="col-xs-3"></div>\n                </div>\n                <div class="row" ng-repeat="meter in vm.selectedMeters" style="margin-bottom: 10px;">\n                  <div class="col-xs-6">\n                    {{meter.name}}\n                  </div>\n                  <div class="col-xs-3">\n                    {{meter.unit}}\n                  </div>\n                  <div class="col-xs-3">\n                    <a ui-sref="samples({name: meter.name, tenant: meter.project_id})" class="btn btn-primary">\n                      <i class="glyphicon glyphicon-search"></i>\n                    </a>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </article>\n      </div>\n    </section>\n  </div>\n</section>\n<section ng-if="!vm.loader && vm.error">\n  <div class="alert alert-danger">\n    {{vm.error}}\n  </div>\n</section>\n'),e.put("templates/ceilometer-samples.tpl.html",'<!-- <pre>{{ vm | json}}</pre> -->\n\n<div class="row">\n  <div class="col-xs-10">\n    <h1>{{vm.name | uppercase}}</h1>\n  </div>\n  <div class="col-xs-2">\n    <a ui-sref="ceilometerDashboard" class="btn btn-primary pull-right">\n      <i class="glyphicon glyphicon-arrow-left"></i> Back to list\n    </a>\n  </div>\n</div>\n<div class="row" ng-show="vm.loader">\n  <div class="col-xs-12">\n    <div class="loader">Loading</div>\n  </div>\n</div>\n<section ng-if="!vm.loader && !vm.error">\n  <div class="row">\n    <form class="form-inline col-xs-8" ng-submit="vm.addMeterToChart(vm.addMeterValue)">\n      <select ng-model="vm.addMeterValue" class="form-control" ng-options="resource.id as resource.name for resource in vm.sampleLabels"></select>\n      <button class="btn btn-success"> \n        <i class="glyphicon glyphicon-plus"></i> Add\n      </button>\n    </form>\n    <div class="col-xs-4 text-right">\n      <a ng-click="vm.chartType = \'line\'" class="btn" ng-class="{\'btn-default\': vm.chartType != \'bar\', \'btn-primary\': vm.chartType == \'line\'}">Lines</a>\n      <a ng-click="vm.chartType = \'bar\'" class="btn" ng-class="{\'btn-default\': vm.chartType != \'line\', \'btn-primary\': vm.chartType == \'bar\'}">Bars</a>\n    </div>\n  </div>\n  <div class="row" ng-if="!vm.loader">\n    <div class="col-xs-12">\n      <canvas ng-if="vm.chartType === \'line\'" id="line" class="chart chart-line" chart-data="vm.chart.data" chart-options="{datasetFill: false}"\n        chart-labels="vm.chart.labels" chart-legend="false" chart-series="vm.chart.series">\n      </canvas>\n      <canvas ng-if="vm.chartType === \'bar\'" id="bar" class="chart chart-bar" chart-data="vm.chart.data"\n        chart-labels="vm.chart.labels" chart-legend="false" chart-series="vm.chart.series">\n      </canvas>\n      <!-- <pre>{{vm.chartMeters | json}}</pre> -->\n    </div>\n  </div>\n  <div class="row" ng-if="!vm.loader">\n    <div class="col-xs-12">\n      <a ng-click="vm.removeFromChart(meter)" class="btn btn-chart" ng-style="{\'background-color\': vm.chartColors[$index]}" ng-repeat="meter in vm.chartMeters">\n        {{meter.resource_name || meter.resource_id}}\n      </a>\n    </div>\n  </div>\n</section>\n<section ng-if="!vm.loader && vm.error">\n  <div class="alert alert-danger">\n    {{vm.error}}\n  </div>\n</section>'),e.put("templates/ceilometer-stats.tpl.html",'<div ng-show="vm.loader" class="loader">Loading</div>\n\n<section ng-if="!vm.loader && !vm.error">\n\n  <div class="alert alert-danger" ng-if="vm.stats.length == 0">\n    No result\n  </div>  \n\n  <table class="table" ng-if="vm.stats.length > 0">\n    <tr>\n      <th>\n        <a ng-click="(order == \'category\') ? order = \'-category\' : order = \'category\'">Type:</a>\n      </th>\n      <th>\n        <a ng-click="(order == \'resource_name\') ? order = \'-resource_name\' : order = \'resource_name\'">Resource:</a>\n      </th>\n      <th>\n        <a ng-click="(order == \'meter\') ? order = \'-meter\' : order = \'meter\'">Meter:</a>\n      </th>\n      <th>\n        Unit:\n      </th>\n      <th>\n        Value:\n      </th>\n    </tr>\n    <!-- <tr>\n      <td>\n        <input type="text" ng-model="query.category">\n      </td>\n      <td>\n        <input type="text" ng-model="query.resource_name">\n      </td>\n      <td>\n        <input type="text" ng-model="query.meter">\n      </td>\n      <td>\n        <input type="text" ng-model="query.unit">\n      </td>\n      <td>\n        <input type="text" ng-model="query.value">\n      </td>\n    </tr> -->\n    <tr ng-repeat="item in vm.stats | orderBy:order">\n      <td>{{item.category}}</td>\n      <td>{{item.resource_name}}</td>\n      <td>{{item.meter}}</td>\n      <td>{{item.unit}}</td>\n      <td>{{item.value}}</td>\n    </tr>\n  </table>\n</section>\n\n<section ng-if="!vm.loader && vm.error">\n  <div class="alert alert-danger">\n    {{vm.error}}\n  </div>\n</section>\n')}]),angular.module("xos.ceilometerDashboard").run(["$location",function(e){e.path("/")}]),angular.bootstrap(angular.element("#xosCeilometerDashboard"),["xos.ceilometerDashboard"]);