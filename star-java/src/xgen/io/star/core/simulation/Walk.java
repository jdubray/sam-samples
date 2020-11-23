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

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

import xgen.io.star.core.Action;
import xgen.io.star.core.Element;
import xgen.io.star.core.State;
import xgen.io.star.core.Type;
import xgen.io.star.core.util.Exception;

public class Walk<T extends Type> extends Element {
	List<Step<T>> _walk ;
	int _depth = 0 ;
	Step<T> _currentStep ;
	T _initialView ;
	int _level ;
	
	public Walk(T t, int depth) throws Exception {
		_depth = depth ;
		_level = 0 ;
		_walk = new ArrayList<Step<T>>() ;
		_currentStep = null ;
		_initialView = (T)t.duplicate() ;
	}
	
	public Walk(T t) throws Exception {
		this(t,10) ;
	}
	
	public State act(Action a, Type view) throws Exception {
		if (view == null) view = _initialView ;
		a.eval(view.getInstance()) ;
		if (view.present(a.returns())) {
			return view.currentState() ;
		}
		throw new Exception("InvalidValueException","Walk::act("+a.getId()+")") ;
	}
	
	public Step<T> step(Action a, State startState , T view) throws Exception {
		State newState = this.act(a, view) ;
		return new Step<T>(startState,a,newState,view) ;
	}
		
	public Walk<T> walk() throws Exception {
		if (_initialView == null) throw new Exception("NotInitializedException","Walk::walk") ;
		State startState = _initialView.currentState() ; 
		boolean first = true ;
		Step<T> firstStep = null;
		for(Action a: startState.getActions()) {
			T branch = _initialView ;
			if (!first) {
				branch = (T)branch.duplicate() ;
				Step<T> newStep = step(a,startState,branch) ;
				firstStep.addNextStep(newStep) ;
				//we need to create a new walk path
				Walk<T> newWalkPath = new Walk<T>(branch, _depth - _level) ; 
				newStep.setPath(newWalkPath) ;
			} else {
				firstStep = step(a,startState,branch) ;  
				this.add(firstStep) ;
				first = false ;
			}
		}
		if (!hasReachedSteadyState()) {
			this.nextLevel() ;
			if (this._level < this._depth) this.walk() ; //Continue Walking the "main path" on _initialView
		}
		return this ;
	}
	
	public Walk<T> walkFromState(State state, int depth) throws Exception {
		//TODO
		return this ;
	}
	
	public Walk<T> add(Step<T> s) {
		_walk.add(s) ;
		_currentStep = s ;
		return this ;
	}
	
	public Walk<T> nextLevel() {
		_level++ ;
		return this ;
	}
	
	public boolean hasReachedDepth() {
		return (_level>_depth) ;
	}
	
	public boolean hasReachedSteadyState() {
		boolean reached = false ;
		int l = _walk.size() ;
		if (l>=2) {
			Step<T> s0 = _walk.get(l-2) ;
			Step<T> s1 = _walk.get(l-1) ;
			if (s0.equals(s1)) {
				reached = true ;
			}
		}		
		return reached ;
	}
	
	public void display(String diagramType, PrintStream p) {
        int swimLanes = 0 ;
		if (diagramType.toLowerCase().equals("activity")) {
			p.println("@startuml\n\n|Action|\nstart");
			for(Step<T> s: _walk) {
				Action a = s._action ;
				State to = s._to ;
				//State from = s._from ;
				p.println(a.toActivity()) ;	
				p.println(to.toActivity()) ;
				if (s._newPath != null) {
					//TODO
				}
			}
			p.println("stop\n\n@enduml\n\n\n");
		}

	}
}