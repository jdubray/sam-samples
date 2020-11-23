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

import java.util.UUID;

import xgen.io.star.core.util.Trace;

public abstract class Element {
	
	protected static boolean _warnOnErroneousAction = false ;
	protected static boolean _warnOnFailedGuard = false ;

	protected String _id ;
	protected UUID _uid ;
	protected Trace _trace ;
	
	public static void setWarnOnErrroneousAction(boolean b) {
		_warnOnErroneousAction = b ;
	}

	public static void setWarnOnFailedGuard(boolean b) {
		_warnOnFailedGuard = b ;
	}

	public Element() {
		this.setUid() ;
	}
	
	public Element setId(String id) {
		this._id = id ;
		return this ;
	}
	
	public String getId() {
		return this._id ;
	}
	
	public Element setUid(UUID uid) {
		this._uid = uid ;
		return this;
	}
	
	public UUID getUid() {
		return this._uid ;
	}
	
	public Element setUid() {
		this.setUid(UUID.randomUUID());
		return this ;
	}
	
	@Override
	public boolean equals(Object other){
	    if (other == null) return false;
	    if (other == this) return true;
	    if (!(other instanceof Element))return false;
	    Element otherElement = (Element)other;
	    if ((this._uid != null) && (otherElement._uid != null)) {
	    	if (this._uid.equals(otherElement._uid)) return true ;
	    }
	    return false ;
	}

	public Element setTrace(Trace trace) {
		_trace = trace ;
		return this;
	}
	
	public Element addTrace(Element e) {
		if (hasTrace()) _trace.trace(e);
		return this ;
	}
	
	public boolean hasTrace() {
		return (_trace != null) ;
	}

	public String toActivity() {
		return "note left \n"+getId()+"\nend note";
	}

	public String toState() {
		return "note left \n"+getId()+"\nend note";
	}

}
