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
import java.util.List;

import xgen.io.star.core.util.Exception;

public class State extends Element {
	protected List<Action> _actions ;
	protected Behavior _behavior ;
	protected Action _automaticAction ;

	public State() {
		super() ;
		this.setUid() ;
	}

	public State(String id) {
		this();
		this.setId(id);
	}
	
	public State(Action m) {
		this() ;
		this.add(m) ;
	}

	public State(Action m, boolean automatic) {
		this() ;
		this.add(m,automatic) ;
	}

	@Override
	public Element setId(String id) {
		_id = id ;
		return this ;
	}
	
	public boolean add(Action a, boolean automatic) {
		if (_actions == null) _actions = new ArrayList<Action>() ;
		if (automatic) {
			_automaticAction = a ;
		}
		return _actions.add(a) ;
	}

	public boolean add(Action a) {
		if (_actions == null) _actions = new ArrayList<Action>() ;
		return _actions.add(a) ;
	}
	
	public List<Action> getActions() {
		return _actions ;
	}

	public Action getActionForId(String id) {
		for (Action a : _actions) {
			if (a.getId().equals(id)) {
				return a ;
			}
		}
		return null ;
	}
	
	public boolean allows(Action a) {
		for (Action _a : _actions) {
			if (_a.equals(a)) return true ;
		}
		return false;
	}
	
	public void setBehavior(Behavior b) {
		_behavior = b ;
	}
	
	public synchronized State isCurrentState() throws Exception {
		if (hasTrace()) addTrace(this);
		
		if (_automaticAction != null) {
			_behavior.act(_automaticAction, null);
		}
		return this;
	}
	
	@Override 
	public String toString() {
		return getId() ;
	}

	@Override 
	public String toActivity() {
		return "|State|\n#CCCCCC:"+_id+";";
	}

	@Override 
	public String toState() {
		return _id;
	}

	public Type getType() throws Exception {
		if ((_actions == null) || (_actions.size()<1)) {
			throw new Exception("NoActionException","Type::getType") ;
		}
		return _actions.get(0).getType() ;
	}
}
