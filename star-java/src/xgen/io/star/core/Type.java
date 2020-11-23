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

import java.util.HashMap;
import java.util.Map;

import xgen.io.star.core.util.Exception;

public abstract class Type extends Element {
	
	protected Map<String,Object> _instance ;  
	protected Map<String,Object> _instanceCopy ;  
	protected Map<State,Range> _stateMap ;
	protected Map<Relation,Type> _relations ;
	
	public Type() {
		super() ;
		_instance = new HashMap<String,Object>() ;
		_relations = new HashMap<Relation,Type>() ;
	}
	
	public Type(Type t) {
		super() ;
		if (t._instance != null) _instance = new HashMap<String,Object>(t._instance) ;
		if (t._instanceCopy != null) _instanceCopy = new HashMap<String,Object>(t._instanceCopy) ;
		if (t._stateMap != null) this._stateMap = new HashMap<State,Range>(t._stateMap) ;
	    this._id = t.getId() ;
		this._trace = t._trace ;
	}

	public Type duplicate() throws Exception {
		throw new Exception("AbstractTypeDuplicationException","This method should not be called") ;
	}

	public void setInstance(Map<String,Object> i) {
		_instance = i ;
	}
	
	public Map<String,Object> getInstance() {
		return _instance ;
	}
	
	public synchronized boolean present(Map<String,Object> request) throws Exception {
		boolean ret = true ;
		if (_instance == null)  {
			_instance = request ;
		} else {
			copy() ;
			for (String key : request.keySet()) {
				if (!this.present(key, request.get(key)))  ret = false ;
			}
			if (!ret) {
				rollback() ;
				throw new Exception("RollBackException","Type::present") ;
			} else {
				if (sync()) {
					persist() ;
				}
			}
		}
		return ret ;
	}
	
	protected abstract boolean persist() ;

	protected abstract boolean sync() ;

	private synchronized void rollback() throws Exception {
		if (_instanceCopy != null) { 
			_instance = null ;
			_instance = new HashMap<String,Object>(_instanceCopy) ;
		} else { 
			throw new Exception("NoDataException","Type::rollback") ;
		}
	}

	private synchronized void copy() {
		_instanceCopy = null ;
		if (_instance != null) _instanceCopy = new HashMap<String,Object>(_instance) ;
	}

	public State currentState() throws Exception {
		State currentState = null ;
		boolean found = false ;
		for(State s : _stateMap.keySet()) {
			if (isInRange(_stateMap.get(s))) {
				if (s instanceof DesiredState) {
					((DesiredState) s).setReached();
				} else {
					if (!found) {
						found = true ;
						currentState = s;
						if (hasTrace()) addTrace(s) ;
						if (s instanceof ForbiddenState) {
							((ForbiddenState) s).setReached();
							throw new Exception("ForbiddenStateException","Type::currentState") ;
						}
					} else {
						//notUnique 
						throw new Exception("DualStateException","Type::currentState") ;
					}
				}
				
			}
		}
		return currentState ;
	}

	protected boolean isInRange(Range r) {
		return r.eval(_instance) ;
	}
	
	public Range addRange(State s, Range r) {
		if (_stateMap == null) _stateMap = new HashMap<State,Range>() ;
		
		return _stateMap.put(s, r) ;
	}
	
	public boolean present(String key, Object value) {
		if (this.validate(key, value)) { 
			_instance.put(key, value) ;
			return true ;
		}
		return false ;
	}
	
	protected boolean validate(String key, Object value) {
		return true ;
	}
	
	public void display() {
		for(String prop: _instance.keySet()) {
			display(prop+"\t = "+_instance.get(prop).toString()) ;
		}
	}
	
	public abstract String display(String s) ;

	public boolean viewEquals(Type view) {
		boolean equals = true ;
		
		for(String key : _instance.keySet()) {
			Object o1 = _instance.get(key) ;
			Object o2 = view._instance.get(key) ;
			if (!o1.equals(o2)) {
				equals = false ;
			}
		}
		return equals;
	}
	
	public void add(Relation r, Type toType) {
		_relations.put(r, toType) ;
	}
	
	public Map<Relation,Type> getRelations() {
		return _relations ;
	}
	
	public void setRanges(Map<State,Range> stateMap) {
		for (State s : stateMap.keySet( )) {
			this.addRange(s, stateMap.get(s)) ;
		}
	}
}
