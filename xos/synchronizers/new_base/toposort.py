
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


#!/usr/bin/env python

import time
import traceback
import commands
import threading
import json
import pdb

from datetime import datetime
from collections import defaultdict

# Topological sort
# Notes:
# - Uses a stack instead of recursion
# - Forfeits optimization involving tracking currently visited nodes
def toposort(g, steps=None):
	# Get set of all nodes, including those without outgoing edges
	keys = set(g.keys())
	values = set({})
	for v in g.values():
		values=values | set(v)
	
	all_nodes=list(keys|values)
	if (not steps):
		steps = all_nodes

	# Final order
	order = []

	# DFS stack, not using recursion
	stack = []

	# Unmarked set
	unmarked = all_nodes

	# visiting = [] - skip, don't expect 1000s of nodes, |E|/|V| is small

	while unmarked:
		stack.insert(0,unmarked[0]) # push first unmarked

		while (stack):
			n = stack[0]
			add = True
			try:
				for m in g[n]:
					if (m in unmarked):
					    add = False
					    stack.insert(0,m)
			except KeyError:
				pass
			if (add):
				if (n in steps and n not in order):
					order.append(n)
				item = stack.pop(0)
				try:
					unmarked.remove(item)
				except ValueError:
					pass

	noorder = list(set(steps) - set(order))
	return order + noorder

def main():
	graph_file=open('xos.deps').read()
	g = json.loads(graph_file)
	print toposort(g)

if (__name__=='__main__'):
	main()

#print toposort({'a':'b','b':'c','c':'d','d':'c'},['d','c','b','a'])
