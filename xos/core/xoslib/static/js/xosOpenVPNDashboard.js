
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


"use strict";angular.module("xos.openVPNDashboard",["ngResource","ngCookies","ui.router","xos.helpers"]).config(["$stateProvider",function(n){n.state("openVPNList",{url:"/",template:"<vpn-list></vpn-list>"})}]).config(["$compileProvider",function(n){n.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/)}]).service("Vpn",["$http","$q",function(n,t){this.getOpenVpnTenants=function(){var e=t.defer();return n.get("/api/tenant/openvpn/list/").then(function(n){e.resolve(n.data)})["catch"](function(n){e.reject(n)}),e.promise}}]).config(["$httpProvider",function(n){n.interceptors.push("NoHyperlinks")}]).directive("vpnList",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/openvpn-list.tpl.html",controller:["Vpn",function(n){var t=this;n.getOpenVpnTenants().then(function(n){t.vpns=n;for(var e=0;e<t.vpns.length;e++){var i=new Blob([t.vpns[e].script_text],{type:"text/plain"});t.vpns[e].script_text=(window.URL||window.webkitURL).createObjectURL(i)}})["catch"](function(n){throw new Error(n)})}]}}),angular.module("xos.openVPNDashboard").run(["$templateCache",function(n){n.put("templates/openvpn-list.tpl.html",'<div style="display: table;">\n  <div class="vpn-row">\n    <h1 class="vpn-cell">VPN List</h1>\n  </div>\n  <div class="vpn-row">\n    <div class="vpn-cell vpn-header">ID</div>\n    <div class="vpn-cell vpn-header">VPN Network</div>\n    <div class="vpn-cell vpn-header">VPN Subnet</div>\n    <div class="vpn-cell vpn-header">Script Link</div>\n  </div>\n  <div class="vpn-row" ng-repeat="vpn in vm.vpns">\n    <div class="vpn-cell">{{ vpn.id }}</div>\n    <div class="vpn-cell">{{ vpn.server_network }}</div>\n    <div class="vpn-cell">{{ vpn.vpn_subnet }}</div>\n    <div class="vpn-cell">\n      <a download="connect-{{ vpn.id }}.vpn" ng-href="{{ vpn.script_text }}">Script</a>\n    </div>\n  </div>\n</div>\n'),n.put("templates/users-list.tpl.html",'<xos-table config="vm.tableConfig" data="vm.users"></xos-table>')}]),angular.module("xos.openVPNDashboard").run(["$location",function(n){n.path("/")}]);