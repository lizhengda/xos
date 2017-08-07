
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


/* eslint-disable new-cap*/
'use strict';

describe('When XOS Lib is created', () => {
  let _slicePlus, _slice;

  console.log(xos.slice, xos.slices);

  beforeEach(() => {
    _slicePlus = xos.slicesPlus;
    _slice = xos.slices;

    xos.tenantview.models.push({
      attributes: {
        current_user_login_base: 'test'
      }
    });
  });

  it('should have a slicePlus collection', () => {
    expect(_slicePlus.modelName).toEqual('slicePlus');
  });

  it('should have a slice collection', () => {
    // console.log(_slicePlus, '********************',_slice);
    expect(_slice.modelName).toEqual('slice');
  });

  describe('and slicePlus model is saved', () => {
    var _slicePlusModel;
    beforeEach(() => {
      _slicePlusModel = new xos.slicesPlus.model({
        creator: 1
      });
    });

    it('should not validate a wrong name', () => {
      const err = _slicePlusModel.xosValidate({name: 'mysite_aaaa', description: ''});
      expect(err).toEqual({name: 'must start with test_'});
    });

    it('should not validate a name with spaces', () => {
      const err = _slicePlusModel.xosValidate({name: 'test_ aaaa', description: ''});
      expect(err).toEqual({name: 'must not contain spaces'});
    });
  });

});