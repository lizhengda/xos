/* global angular */
/* eslint-disable dot-location*/

// TODO
// - Add Cache
// - Refactor routing with ui.router and child views (share the navigation and header)
// - Add Eslint
// - Add Es6 (Babel) and a build script
// - Autogenerate ngResource from swagger definition json

'use strict';

console.log('test ' + (1 + 2));

angular.module('xos.contentProviderApp', ['ngResource', 'ngRoute', 'ngCookies', 'ngLodash']).config(function ($interpolateProvider, $routeProvider, $resourceProvider) {
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');

  // NOTE http://www.masnun.com/2013/09/18/django-rest-framework-angularjs-resource-trailing-slash-problem.html
  $resourceProvider.defaults.stripTrailingSlashes = false;

  $routeProvider.when('/', {
    template: '<content-provider-list></content-provider-list>'
  }).when('/contentProvider/:id?', {
    template: '<content-provider-detail></content-provider-detail>'
  }).when('/contentProvider/:id/cdn_prefix', {
    template: '<content-provider-cdn></content-provider-cdn>'
  }).when('/contentProvider/:id/origin_server', {
    template: '<content-provider-server></content-provider-server>'
  }).when('/contentProvider/:id/users', {
    template: '<content-provider-users></content-provider-users>'
  }).otherwise('/');
}).config(function ($httpProvider) {

  // add X-CSRFToken header for update, create, delete (!GET)
  $httpProvider.interceptors.push('SetCSRFToken');
}).factory('SetCSRFToken', function ($cookies) {
  return {
    request: function request(_request) {
      if (_request.method !== 'GET') {
        _request.headers['X-CSRFToken'] = $cookies.get('csrftoken');
      }
      return _request;
    }
  };
}).constant('apiBaseUrl', 'http://localhost:4000').service('ContentProvider', function ($resource, apiBaseUrl) {
  return $resource(apiBaseUrl + '/hpcapi/contentproviders/:id/', { id: '@id' }, {
    'update': { method: 'PUT' }
  });
}).service('ServiceProvider', function ($resource) {
  return $resource('/hpcapi/serviceproviders/:id/', { id: '@id' });
}).service('CdnPrefix', function ($resource) {
  return $resource('/hpcapi/cdnprefixs/:id/', { id: '@id' });
}).service('OriginServer', function ($resource) {
  return $resource('/hpcapi/originservers/:id/', { id: '@id' });
}).service('User', function ($resource) {
  return $resource('/xos/users/:id/', { id: '@id' });
}).directive('cpActions', function (ContentProvider, $location) {
  return {
    restrict: 'E',
    scope: {
      id: '=id'
    },
    bindToController: true,
    controllerAs: 'vm',
    templateUrl: 'templates/cp_actions.html',
    controller: function controller() {
      this.deleteCp = function (id) {
        ContentProvider['delete']({ id: id }).$promise.then(function () {
          $location.url('/');
        });
      };
    }
  };
}).directive('contentProviderList', function (ContentProvider, lodash) {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    scope: {},
    templateUrl: 'templates/cp_list.html',
    controller: function controller() {
      var _this = this;

      ContentProvider.query().$promise.then(function (cp) {
        _this.contentProviderList = cp;
      })['catch'](function (e) {
        throw new Error(e);
      });

      this.deleteCp = function (id) {
        ContentProvider['delete']({ id: id }).$promise.then(function () {
          lodash.remove(_this.contentProviderList, { id: id });
        });
      };
    }
  };
}).directive('contentProviderDetail', function (ContentProvider, ServiceProvider, $routeParams, $location) {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    scope: {},
    templateUrl: 'templates/cp_detail.html',
    controller: function controller() {
      this.pageName = 'detail';
      var _this = this;

      if ($routeParams.id) {
        ContentProvider.get({ id: $routeParams.id }).$promise.then(function (cp) {
          _this.cp = cp;
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      }

      ServiceProvider.query().$promise.then(function (sp) {
        _this.sp = sp;
      });

      // check if the list id match with item url
      this.activeServiceProvide = function (id, SPurl) {
        if (SPurl && SPurl.length > 0) {
          // take the last 2 char and remove trailing /
          return parseInt(SPurl.substr(SPurl.length - 2).replace('/', '')) === id;
        }
        return false;
      };

      this.saveContentProvider = function (cp) {
        var p,
            isNew = false;

        if (cp.id) {
          p = cp.$update();
        } else {
          isNew = true;
          cp.name = cp.humanReadableName;
          p = new ContentProvider(cp).$save();
        }

        p.then(function (res) {
          console.log('save done', res);
          _this.result = {
            status: 1,
            msg: 'Content Provider Saved'
          };
          if (isNew) {
            $location.url('contentProvider/' + res.id + '/');
          }
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      };
    }
  };
}).directive('contentProviderCdn', function ($routeParams, CdnPrefix, ContentProvider, lodash) {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    templateUrl: 'templates/cp_cdn_prefix.html',
    controller: function controller() {
      var _this = this;

      this.pageName = 'cdn';

      if ($routeParams.id) {
        ContentProvider.get({ id: $routeParams.id }).$promise.then(function (cp) {
          _this.cp = cp;
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      }

      // TODO filter on client
      CdnPrefix.query({ contentProvider: $routeParams.id }).$promise.then(function (cp_prf) {
        _this.cp_prf = cp_prf;
      })['catch'](function (e) {
        _this.result = {
          status: 0,
          msg: e.data.detail
        };
      });

      CdnPrefix.query().$promise.then(function (prf) {
        _this.prf = prf;
      })['catch'](function (e) {
        _this.result = {
          status: 0,
          msg: e.data.detail
        };
      });

      this.addPrefix = function (prf) {
        prf.contentProvider = '/hpcapi/contentproviders/' + $routeParams.id + '/';

        var item = new CdnPrefix(prf);

        item.$save().then(function (res) {
          _this.cp_prf.push(res);
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      };

      this.removePrefix = function (item) {
        item.$delete().then(function () {
          lodash.remove(_this.cp_prf, item);
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      };
    }
  };
}).directive('contentProviderServer', function ($routeParams, OriginServer, ContentProvider, lodash) {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    templateUrl: 'templates/cp_origin_server.html',
    controller: function controller() {
      this.pageName = 'server';
      this.protocols = ['HTTP', 'RTMP', 'RTP', 'SHOUTcast'];

      var _this = this;

      if ($routeParams.id) {
        ContentProvider.get({ id: $routeParams.id }).$promise.then(function (cp) {
          _this.cp = cp;
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      }

      // TODO filter on client
      OriginServer.query({ contentProvider: $routeParams.id }).$promise.then(function (cp_os) {
        _this.cp_os = cp_os;
      })['catch'](function (e) {
        _this.result = {
          status: 0,
          msg: e.data.detail
        };
      });

      // TODO everytime protocall error, ask Scott
      this.addOrigin = function (os) {
        os.contentProvider = '/hpcapi/contentproviders/' + $routeParams.id + '/';

        var item = new OriginServer(os);

        item.$save().then(function (res) {
          _this.cp_os.push(res);
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      };

      this.removeOrigin = function (item) {
        item.$delete().then(function () {
          lodash.remove(_this.cp_os, item);
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      };
    }
  };
}).directive('contentProviderUsers', function ($routeParams, ContentProvider, User, lodash) {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    templateUrl: 'templates/cp_user.html',
    controller: function controller() {
      var _this = this;

      this.pageName = 'user';

      this.cp_users = [];

      if ($routeParams.id) {
        ContentProvider.get({ id: $routeParams.id }).$promise.then(function (cp) {
          _this.cp = cp;
        })['catch'](function (e) {
          _this.result = {
            status: 0,
            msg: e.data.detail
          };
        });
      }

      User.query().$promise.then(function (users) {
        _this.users = users;
      })['catch'](function (e) {
        _this.result = {
          status: 0,
          msg: e.data.detail
        };
      });

      this.addUserToCp = function (user) {
        _this.cp_users.push(user);
      };

      this.removeUserFromCp = function (user) {
        lodash.remove(_this.cp_users, user);
      };
    }
  };
});