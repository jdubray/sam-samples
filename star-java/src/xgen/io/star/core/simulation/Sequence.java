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
import java.util.Iterator;
import java.util.List;

import xgen.io.star.core.Element;
import xgen.io.star.core.Type;

public class Sequence<T extends Type> extends Element {

	protected List<Step<T>> _sequence ;
	boolean _isRepeating ;
	boolean _strict ;
	boolean _reached ;
	
	public Sequence() {
		super() ;
		_sequence = new ArrayList<Step<T>>() ;
		_isRepeating = false ;
		_strict = false ;
	}

	public Sequence(boolean repeating, boolean strict) {
		this() ;
		_isRepeating = repeating ;
		_strict = strict ;
	}

	public Sequence<T> addStep(Step<T> s) {
		_sequence.add(s) ;
		return this ;
	}
	
	public Sequence<T> reset() {
		_sequence = new ArrayList<Step<T>>() ;
		return this ;
	}
	
	public boolean matchWalk(Walk<T> w) {
		List<Step<T>> path = w._walk ;
		Iterator<Step<T>> i = _sequence.iterator() ;
		Iterator<Step<T>> j = path.iterator() ;
		_reached = true ;
		int lastIndex = 0 ;
		int index = 0 ;
		while (i.hasNext()) {
			Step<T> s0 = i.next() ;
			boolean cont = false ;
			while (j.hasNext()) {
				Step<T> sp = j.next() ;
				index++;
				if (sp.equals(s0)) {
					if (lastIndex < index) {
						if (_strict) {
							if ((index - lastIndex) == 1) {
								lastIndex = index ;
								cont = true ;
							} else {
								cont = false ;
							}
						} else {
							lastIndex = index ;
							cont = true ;
						}
						break ;
					}
				}
			}
			if (!cont) {
				_reached = false ;
				break ;
			}
		}
		return _reached ;
	}
}
