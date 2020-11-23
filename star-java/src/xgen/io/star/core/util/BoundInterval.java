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

public class BoundInterval extends Range {
	Interval boundedRange ;
	String _boundMin ;
	String _boundMax ;
	
	public BoundInterval(Interval range, String min, String max) {
		boundedRange = range ;
		_boundMin = min ;
		_boundMax = max ;
	}
	
	public boolean eval(Map<String, Object> _instance) {
		if (_boundMin != null) boundedRange._min = Float.valueOf((String)_instance.get(_boundMin)) ;
		if (_boundMax != null) boundedRange._max = Float.valueOf((String)_instance.get(_boundMax)) ;
		return boundedRange.eval(_instance);
	}

}
