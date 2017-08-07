
# Copyright 2017-present Open Networking Foundation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


from xosresource import XOSResource
from core.models import Slice,User,Network,NetworkParameterType

class XOSNetworkParameterType(XOSResource):
    provides = "tosca.nodes.NetworkParameterType"
    xos_model = NetworkParameterType
    copyin_props = []

    def get_xos_args(self):
        args = super(XOSNetworkParameterType, self).get_xos_args()

        return args

    def create(self):
        xos_args = self.get_xos_args()

        networkParameterType = NetworkParameterType(**xos_args)
        networkParameterType.caller = self.user
        networkParameterType.save()

        self.info("Created NetworkParameterType '%s' " % (str(networkParameterType), ))

    def delete(self, obj):
        if obj.networkparameters.exists():
            return

        super(XOSNetworkParameterType, self).delete(obj)



