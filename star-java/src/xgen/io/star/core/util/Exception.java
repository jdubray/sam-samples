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

package xgen.io.star.core.util;

import xgen.io.star.core.Property;

public class Exception extends java.lang.Exception {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7067140721605137477L;
	String _exception ;
	String _source ;
	Object _context ;
	
	public Exception() {
		super();
	}
	
	public Exception(String message) {
		super(message);
	}
	
	public Exception(String e, String s) {
		this();
		_exception = e ;
		_source = s ;
		Property p = new Property("exception::"+_exception,_source) ;
		Trace.traceDefault(p) ;	
	}
	
	public String exception() {
		return _exception ;
	}

	public String source() {
		return _source ;
	}
	
	public void setContext(Object c) {
		_context = c ;
	}
	
	public Object context() {
		return _context ;
	}

}
