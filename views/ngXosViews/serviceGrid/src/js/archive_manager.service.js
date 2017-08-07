
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
 * Created by teone on 6/22/16.
 */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name xos.ArchiveManager.serviceGrid
   **/

  angular.module('xos.serviceGrid')
  .service('ArchiveManager', function(){
    this.createArchive = () => {
      this.archive = new JSZip();
    };

    this.addFile = (fileName, content) => {
      this.archive.file(fileName, content);
    };

    this.download = (name) => {
      console.log(this.archive);
      this.archive.generateAsync({type: 'blob'})
        .then(function(content) {
          saveAs(content, `${name}.zip`);
        })
        .catch(e => {
          console.log(e);
        });
    };
  });
})();

