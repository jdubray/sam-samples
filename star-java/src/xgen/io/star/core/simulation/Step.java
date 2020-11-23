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

package xgen.io.star.core.simulation;

import java.util.ArrayList;
import java.util.List;

import xgen.io.star.core.Action;
import xgen.io.star.core.Element;
import xgen.io.star.core.State;
import xgen.io.star.core.Type;
import xgen.io.star.core.util.Exception;

public class Step<T extends Type> extends Element {
	protected State _from ;
	protected Action _action ;
	protected State _to ;
	protected Type _targetView ;
	protected List<Step<T>> _nextSteps ;
	protected Walk<T> _newPath ;
	
	public Step(State from, Action action, State to, T results) throws Exception {
		_from = from ;
		_action = action ;
		_to = to ;
		_targetView = (Type)results.duplicate() ;
		_newPath = null ;
	}
	
	public boolean equals(Step<T> p) {
		return (_to.equals(p._to) && this._targetView.viewEquals(p._targetView)) ;
	}
	

	public void snap() throws Exception {
		_targetView = _action.getType().duplicate() ;
	}
	
	public Step<T> addNextStep(Step<T> s) {
		if (_nextSteps == null) _nextSteps = new ArrayList<Step<T>>() ;		
		_nextSteps.add(s) ;
		return this ;
	}
	
	public Step<T> setPath(Walk<T> w) {
		_newPath = w ;
		return this ;
	}
}
