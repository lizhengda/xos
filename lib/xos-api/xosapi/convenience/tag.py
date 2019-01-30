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

from xosapi.orm import ORMWrapper, register_convenience_wrapper


class ORMWrapperTag(ORMWrapper):
    def get_generic_foreignkeys(self):
        return [
            {
                "name": "content_object",
                "content_type": "content_type",
                "id": "object_id",
            }
        ]


register_convenience_wrapper("Tag", ORMWrapperTag)