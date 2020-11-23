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

public abstract class Relation extends Element {
	Type _source ;
	Type _target ;
	Type _properties ;
	boolean _isUnidirectional ;
	
	public Relation(Type s, Type t) {
		_isUnidirectional = false ;
		_source = s ;
		_target = t ;
		_properties = null ;
	}
	
	public Relation setProperties(Type t) {
		_properties = t ;
		return this ;
	}
}
