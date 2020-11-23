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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import xgen.io.star.core.util.Exception;

public abstract class Behavior extends Element {

	protected List<State> _states ;
	protected State _currentState ;
	protected List<State> _endStates ;
	
	protected Component _component ;
	
	public Behavior() throws Exception {
		super() ;
		
		
		// This is not possible at this point this the 
		// behavior is not completely built
		
		//TODO validate that it's no problem to comment this line
		// this.setCurrentState(t.currentState()) ;
	}

	public boolean add(State s) {
		if (_states == null) _states = new ArrayList<State>() ;
		s.setBehavior(this);
		return _states.add(s) ;
	}

	public boolean addEndState(State s) {
		if (_endStates == null) _endStates = new ArrayList<State>() ;
		this.add(s) ;
		return _endStates.add(s) ;
	}

	
	public void setCurrentState(State s) {
		_currentState = s ;
	}
	
	public State getCurrentState() {
		return _currentState ;
	}
	
	public void setComponent(Component c) {
		this._component = c ;
	}

	public void act(Action a, Map<String,Object> input) throws Exception {
		if (_currentState != null) {
			if (_currentState.allows(a)) {
				Type t = a.getType() ;
				if (input == null) input = t.getInstance() ;
				a.eval(input) ;
				a.present();
				this.setCurrentState(t.currentState()) ;
				_currentState.isCurrentState() ;
				this.finalize(_currentState,t);
			} else {
				if (_warnOnErroneousAction) {
					if (hasTrace()) _trace.addTrace( new Property("ActionNotAllowedException()","Behavior::act("+a.getId()+")")) ;
					System.out.println("============= "+a.getId()+" is not allowed =================");
				} else {
					throw new Exception("ActionNotAllowedException()","Behavior::act("+a.getId()+")") ;
				}
			}
		}
	}

	public Behavior nextAction(String requestedAction, State s, Map<String,Object> inputs) throws Exception {
		
		if (s!= null) {
			if (hasTrace()) _trace.addTrace(s) ;
			// Check for automatic actions
			// there shouldn't be any
			this.setCurrentState(s);
			s.isCurrentState() ;	
			Action action = s.getActionForId(requestedAction) ;
			if (action != null) {
				this.act(action, inputs);
			}
		}
		
		return this ;
	}

	public boolean finalize(State currentState, Type type) throws Exception {
		if (_endStates != null) {
			if (_endStates.contains(currentState)) {
				System.out.println("Finalizing >>>>>>>>>> ");
				this._component.finalize(type.getInstance()) ;
				return true ;
			}
		}
		return false ;
	}
	
}
