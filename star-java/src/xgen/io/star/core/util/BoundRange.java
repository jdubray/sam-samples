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

public class BoundRange extends Range {
	SimpleRange boundedRange ;
	String _boundProperty ;
	
	public BoundRange(SimpleRange range, String property) {
		boundedRange = range ;
		_boundProperty = property ;
	}
	
	public boolean eval(Map<String, Object> _instance) {
		if (_boundProperty != null) boundedRange._value = Float.valueOf((String)_instance.get(_boundProperty)) ;
		return boundedRange.eval(_instance);
	}

}
