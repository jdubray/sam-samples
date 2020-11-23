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

import xgen.io.star.core.Action;
import xgen.io.star.core.State;
import xgen.io.star.core.Type;
import xgen.io.star.core.util.Exception;

public class ForbiddenStep<T extends Type> extends Step<T> {

	protected boolean _reached ;
	
	public ForbiddenStep(State from, Action action, State to, T results)
			throws Exception {
		super(from, action, to, results);
		
	}

	public ForbiddenStep(String id, State from, Action action, State to, T results)
			throws Exception {
		this(from, action, to, results);
		setId(id) ;
	}

	public boolean setReached() {
		if (hasTrace()) addTrace(this) ;
		_reached = true ;
		return _reached ;
	}
	
	public boolean isReached() {
		return _reached ;
	}

	public boolean isForbidden(Step<T> s) {
		if ((this._from.equals(s._from)) && (this._to.equals(s._to))) {
			boolean strict = (this._action != null) ;
			if (strict) {
				if (this._action.equals(s._action)) {
					boolean strictest = (this._targetView != null) ;
					if (strictest) {
						if (this._targetView.viewEquals(s._targetView)) return setReached() ;
					} else return setReached() ;
				}
			} else {
				return setReached() ;
			}
		}
		return false ;
	}

	@Override 
	public String toActivity() {
		return "note left \nforbidden step ["+getId()+"]\nend note";
	}

	
}
