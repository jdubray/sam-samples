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

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import xgen.io.star.core.Action;
import xgen.io.star.core.DesiredState;
import xgen.io.star.core.Element;
import xgen.io.star.core.ForbiddenState;
import xgen.io.star.core.State;

public class Trace extends Element {
	List<Element> _trace ;
	protected static Trace _default ;
	protected Set<String> _outputs ;
	
	String _priorTrace ;
	String _updatedTrace ;
	
	public Trace() {
		super() ;
		_trace = new ArrayList<Element>() ;
		if (_default == null) _default = this ;
	}
	
	
	static public void setDefaultTrace(Trace t) {
		_default = t ;
	}
		
	public Trace(String id) {
		this() ;
		this.setId(id); ;
	}
	
	public Trace(String id, String priorTrace) {
		this(id) ;
		_priorTrace = priorTrace ;
	}


	
	public void trace(Element e) {
		_trace.add(e) ;
	}
	
	public static void traceDefault(Element e) {
		_default.trace(e);
	}
	
	public void dump() {
		dump(System.out) ;
	}
	
	public void dump(PrintStream p) {
		if (_priorTrace != null) p.println(_priorTrace) ;
		for(Element e: _trace) {
			p.println(e.toString()) ;
		}
	}
	
	public void dump(String diagramType, PrintStream p) {
		if (diagramType.toLowerCase().equals("activity")) {
			_updatedTrace = "" ;
			p.println("@startuml\n\n|Action|\nstart") ;
			if (_priorTrace != null) {
				p.println(_priorTrace) ;
			}
			Element moveForward = null ;
			for(Element e: _trace) {
				if (moveForward != null) {
					_updatedTrace += e.toActivity() ;
					p.println(e.toActivity()) ;
					_updatedTrace += moveForward.toActivity() ;
					p.println(moveForward.toActivity()) ;
					moveForward = null ;
				} else {
					if ((e instanceof DesiredState) || (e instanceof ForbiddenState)) {
						moveForward = e ;
					} 
					else { 
						_updatedTrace += e.toActivity() ;
						p.println(e.toActivity()) ;
					}
				}
			}
			p.println("stop\n\n@enduml\n\n\n");
		}
		
		if (diagramType.toLowerCase().equals("state")) {
			_outputs = new HashSet<String>() ;
			p.println("@startuml\n\n");
			boolean started = false ;
			State previousState = null ;
			Iterator<Element> i = _trace.iterator() ;
			while (i.hasNext()) {
				Element e = i.next() ;
				if (e instanceof Action) {
					Action a = (Action)e ;
					Element s = i.next() ;
					if (s instanceof State) {
						State st = (State)s ;
						if (!started) {
							p.println("[*]->"+s.getId()+":"+a.getId()) ; 
							started = true ;
						} else {
							if (previousState!=null) {
								String output = previousState.getId()+"->"+st.toState()+":"+a.toState() ;
								if (!_outputs.contains(output)) {
									p.println(output) ;
									_outputs.add(output) ;
								}
							}
						}
						previousState = st;
					}
				} else {
					e.toState() ;
				}
			}
			p.println(previousState.getId()+"->[*]\n\n@enduml\n");
			
		}

		if (diagramType.toLowerCase().equals("other")) {
			p.println("@startuml\n\n|Action|\nstart");
			p.println("stop\n\n@enduml\n\n\n");
			
		}

	}
	
	public String currentTrace() {
		return _priorTrace + _updatedTrace ;
	}
	
	public String currentActivityDiagram() {
		String diagram  = "@startuml\n\n|Action|\nstart" ;
			   diagram += _priorTrace + _updatedTrace ;
			   diagram += "stop\n\n@enduml\n\n\n" ;
		return diagram ;
	}

	public void clear() {
		_trace = new ArrayList<Element>() ;
	}
}
