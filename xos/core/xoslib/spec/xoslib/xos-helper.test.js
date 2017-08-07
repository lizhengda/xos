
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


/* eslint-disable no-unused-vars*/
'use strict';

describe('The Xos Helper', () => {
  var f;
  beforeEach(() => {
    f = jasmine.getFixtures();
    f.fixturesPath = 'base/spec/xoslib/fixtures/xos-utils';
  });

  describe('XOSDetailView', () => {

    describe('onFormDataInvalid', () => {

      // TODO understand how to attach XOSDetailView to a custom template and test its methods

      const err = {name: 'must start with mysite_'};
      var view;
      beforeEach(() => {
        try{
          f.set(`
            <script type="text/template" id="fake-template">
              <div>
                <input name="name" />
              </div>
            </script>
          `);
        }
        catch(e){
          console.log('err: ' + e);
        }

        view = XOSDetailView.extend({
          template: '#fake-template'
        });

      });

      xit('should show an error', () => {

        // view.onFormDataInvalid(err);
        // view().onFormDataInvalid(err)

        expect($('.alert').length).toBe(1);
      });
    });

  });

});