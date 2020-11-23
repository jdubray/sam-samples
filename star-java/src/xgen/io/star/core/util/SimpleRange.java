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

public class SimpleRange extends Range {

	String _property ;
	Operator _op ;
	Number _value ;
	
	public SimpleRange(String property, Operator op, Number value) {
		_property = property ;
		_op = op ;
		_value = value ;
	}
	
	public boolean eval(Map<String, Object> _instance) {
		return compare((Number)_instance.get(_property));
	}
	
	private boolean compare(Number input) {
		if (_op.equals(Operator.equals)) return input.floatValue() == _value.floatValue() ;
		if (_op.equals(Operator.notEquals)) return input.floatValue() != _value.floatValue() ;
		if (_op.equals(Operator.greaterThan)) return input.floatValue() > _value.floatValue() ;
		if (_op.equals(Operator.lessThan)) return input.floatValue() < _value.floatValue() ;
		if (_op.equals(Operator.greaterThanOrEqual)) return input.floatValue() >= _value.floatValue() ;
		if (_op.equals(Operator.lessThanOrEqual)) return input.floatValue() <= _value.floatValue() ;
		return false ;
	}

}
