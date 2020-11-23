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

import java.util.Map;

import xgen.io.star.core.util.Exception;

public abstract class Action extends Element {
	protected Map<String,Object> _returns ;
	protected Type _target ;
	protected Guard _guard ;

		
	@Override
	public Element setId(String id) {
		_id = id ;
		return this ;
	}

	public Map<String,Object> returns() {
		return _returns ;
	}
	
	public Object set(String key, Object value) {
		return _returns.put(key, value) ;
	}
	
	public Object get(String key) {
		return _returns.get(key) ;
	}
	
	public void setType(Type t) {
		_target = t ;
	}
	
	public Type getType() {
		return _target ;
	}
	
	public void setGuard(Guard g) {
		_guard = g ;
	}
	
	public Guard getGuard() {
		return _guard ;
	}
	
	public Map<String,Object> eval(Map<String,Object> input) throws Exception {
		if (_guard != null) {
			if (_guard.eval(input)) {
				if (_warnOnFailedGuard) {
					_trace.addTrace( new Property("GuardFailureException","Action::eval("+this.getId()+")")) ;
				} else {
					throw new Exception("GuardException","Action::eval") ;					
				}
			}
		}
		for (String key : input.keySet()) {
			_returns.put(key, input.get(key)) ;
		}
		
		return _returns ;
	}
	
	protected void present() throws Exception {
		if (_target != null) {
			if (hasTrace()) addTrace(this) ;
			_target.present(_returns) ;
		}
	}

	@Override 
	public String toString() {
		return getId() ;
	}

	@Override 
	public String toActivity() {
		return "|Action|\n:"+_id+";";
	}

	@Override 
	public String toState() {
		return _id;
	}

	
}
