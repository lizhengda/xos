
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


"use strict";angular.module("xos.hpc",["ngResource","ngCookies","ui.router","xos.helpers"]).config(["$stateProvider",function(e){e.state("hpc-list",{url:"/",template:"<hpcs-list></hpcs-list>"})}]).config(["$httpProvider",function(e){e.interceptors.push("NoHyperlinks")}]).service("Hpc",["$q","$http",function(e,r){this.query=function(t){var n=e.defer();return r.get("/xoslib/hpcview",{params:t}).then(function(e){n.resolve(e.data)})["catch"](n.reject),{$promise:n.promise}}}]).directive("hpcsList",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/hpc-list.tpl.html",controller:["Hpc",function(e){var r=this,t=function(e){e=Number(e);var r=Math.floor(e/3600),t=Math.floor(e%3600/60),n=Math.floor(e%3600%60);return(r>0?r+"h "+(10>t?"0":""):"")+t+"m "+(10>n?"0":"")+n+"s"},n=function(e){return function(r){return angular.isNumber(r[e])?t(r[e]):r[e]}};this.routerConfig={filter:"field",order:!0,columns:[{label:"Name",prop:"name"},{label:"Ip Address",prop:"ip"},{label:"Record Checker",prop:"watcher.DNS.msg"},{label:"Name Servers",prop:"nameservers",type:"array"},{label:"Dns Demux Config Age",prop:"dnsdemux_config_age",type:"custom",formatter:n("dnsdemux_config_age")},{label:"Dns Redir Config Age",prop:"dnsredir_config_age",type:"custom",formatter:n("dnsredir_config_age")}]},this.cacheConfig={filter:"field",order:!0,columns:[{label:"Name",prop:"name"},{label:"Prober",prop:"watcher.HPC-hb.msg"},{label:"Fetcher",prop:"watcher.HPC-fetch.msg"},{label:"Config Age",prop:"config_age",type:"custom",formatter:n("config_age")}]},this.fetch=function(){e.query().$promise.then(function(e){r.routers=e[0].dnsdemux,r.caches=e[0].hpc})["catch"](function(e){throw new Error(e)})},this.fetch()}]}}),angular.module("xos.hpc").run(["$templateCache",function(e){e.put("templates/hpc-list.tpl.html",'<div class="container-fluid">\n    <div class="row">\n        <div class="col-xs-10">\n            <h1>Request Routers</h1>\n        </div>\n        <div class="col-xs-2 text-right">\n            <a href="" ng-click="vm.fetch()" class="btn btn-primary btn-reload">\n                <i class="glyphicon glyphicon-refresh"></i>\n                Refresh\n            </a>\n        </div>\n    </div>\n    <div class="row">\n        <div class="col-xs-12">\n            <xos-table config="vm.routerConfig" data="vm.routers"></xos-table>\n        </div>\n    </div>\n    <div class="row">\n        <div class="col-xs-12">\n            <h1>HyperCache</h1>\n        </div>\n    </div>\n    <div class="row">\n        <div class="col-xs-12">\n            <xos-table config="vm.cacheConfig" data="vm.caches"></xos-table>\n        </div>\n    </div>\n</div>')}]),angular.module("xos.hpc").run(["$location",function(e){e.path("/")}]);