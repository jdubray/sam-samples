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

import java.util.Map;

import xgen.io.star.core.Range;

public class Interval extends Range {

	String _property ;
	Number _min ;
	Number _max ;
	boolean _equals ;
	
	public Interval(String property, Number min, Number max, boolean equals) {
		_property = property ;
		_min = min ;
		_max = max ;
		_equals = equals ;
	}
	
	public boolean eval(Map<String, Object> _instance) {
		return compare((Number)_instance.get(_property));
	}
	
	private boolean compare(Number input) {
		if (_equals) {
			if ((input.floatValue() >= _min.floatValue()) && (input.floatValue() <= _max.floatValue())) return true ;
		} else {
			if ((input.floatValue() >  _min.floatValue()) && (input.floatValue() <  _max.floatValue())) return true ;
		}
		return false ;
	}

	
}
