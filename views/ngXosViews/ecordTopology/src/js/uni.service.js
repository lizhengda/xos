
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


/**
 * © OpenCORD
 *
 * Visit http://guide.xosproject.org/devguide/addview/ for more information
 *
 * Created by teone on 6/27/16.
 */

(function () {
  'use strict';

  angular.module('xos.ecordTopology')
    .service('Uni', ($resource, _) => {
      return $resource(`/api/service/metronetworkservice/SCA_ETH_FPP_UNI_N/:id`, {id: '@id'}, {
        query: {
          isArray: true,
          interceptor: {
            response: (res) => {
              const augmentedUnis = _.map(res.data, (uni, i) => {
                var latlng_val = uni.latlng;
                var lat_val = latlng_val.substring(1, latlng_val.indexOf(',') - 1);
                lat_val = lat_val.trim();
                var lng_val = latlng_val.substring(latlng_val.indexOf(',') + 1, latlng_val.length - 1);
                lng_val = lng_val.trim()

                uni.latlng = [lat_val, lng_val];
                return uni;
              });
              return augmentedUnis;
            }
          }
        }
      });
    });
})();

