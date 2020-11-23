/*
 * Copyright 2015 Jean-Jacques Dubray jdubray@xgen.io
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 *////////////////////////////////////////////////////////////////////////////

package xgen.io.star.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import xgen.io.star.core.simulation.Walk;
import xgen.io.star.core.util.Exception;

public abstract class Component extends Element {
	protected List<Behavior> _behaviors ;
	protected Map<Behavior,Walk<Type>> _walks ;
	
	public boolean add(Behavior b) {
		if (_behaviors == null) _behaviors = new ArrayList<Behavior>() ;
		return _behaviors.add(b) ;
	}
	
	public abstract void start() throws Exception ;
	
	public abstract void start(Map<String,Object> inputs) throws Exception ;
	
	public abstract void act(Action a) throws Exception;
	
	public abstract boolean defaultState() throws Exception ;
	
	public abstract String tick(String key) throws Exception ;
	
	public Component walk(int depth) throws Exception {
		_walks = new HashMap<Behavior,Walk<Type>>() ;
		for (Behavior b : _behaviors) {
			List<Action> actions = b.getCurrentState().getActions() ;
			if (actions!=null) {
				if (actions.size()>0) {
					Action a = actions.get(0) ;
					if (a._target != null) {
						Walk<Type> walkThe = new Walk<Type>(a._target,depth) ;
						walkThe.walk() ;
						_walks.put(b, walkThe) ;
					}
				}
			}
		}
		return this ;
	}
	
	public Component walk() throws Exception {
		return walk(10) ;
	}
	
	public Map<Behavior,Walk<Type>> getWalks() {
		return _walks ;
	}

	public boolean finalize(Map<String, Object> inputs) throws Exception {
		return true;
	}

	public State rehydrate(String instanceId) throws Exception {
		return null;
	}
}
