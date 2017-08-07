
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


import os
import inspect
import imp
import sys
import threading
import time
from syncstep import SyncStep
from synchronizers.new_base.event_loop import XOSObserver
from xos.logger import Logger, logging
from xosconfig import Config

watchers_enabled = Config.get("enable_watchers")

# NOTE is this used or can be removed?
if (watchers_enabled):
    from synchronizers.new_base.watchers import XOSWatcher

logger = Logger(level=logging.INFO)

class Backend:
    def run(self):
        # start model policies thread
        policies_dir = Config("model_policies_dir")
        if policies_dir:
            from synchronizers.model_policy import run_policy
            model_policy_thread = threading.Thread(target=run_policy)
            model_policy_thread.start()
        else:
            model_policy_thread = None
            logger.info("Skipping model policies thread due to no model_policies dir.")

        while True:
            try:
                time.sleep(1000)
            except KeyboardInterrupt:
                print "exiting due to keyboard interrupt"
                if model_policy_thread:
                    model_policy_thread._Thread__stop()
                sys.exit(1)

