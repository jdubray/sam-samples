/*
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org/>
 *//////////////////////////////////////////////////////////////////////////

package xgen.io.star.sample.factorial;

import java.util.HashMap;
import java.util.Map;

import xgen.io.star.core.Action;
import xgen.io.star.core.Behavior;
import xgen.io.star.core.Component;
import xgen.io.star.core.DesiredState;
import xgen.io.star.core.Element;
import xgen.io.star.core.ForbiddenState;
import xgen.io.star.core.State;
import xgen.io.star.core.Type;
import xgen.io.star.core.simulation.Walk;
import xgen.io.star.core.util.Exception;
import xgen.io.star.core.util.Trace;

public class Factorial extends Component {

	FactorialType fact ;
	FactorialBehavior behavior ;
	MultiplyAction multiply ;
	InitializeAction initialize ;
	State mult ;
	State def ;
	ForbiddenState forbidden;
	DesiredState desired ;
	Trace trace ;
	
	public Factorial(FactorialBehavior behavior) {
		super() ;
		this.add(behavior) ;
	}
	
	public Factorial(int i) throws Exception {
		
		trace = new Trace("fact_trace") ;
		
		fact = new FactorialType(i) ;
		EqualsOneRange defaultRange = new EqualsOneRange() ;
		GreaterThanOneRange multRange = new GreaterThanOneRange() ;
		LessThanOneRange fRange = new LessThanOneRange() ;
		EqualsTwoRange desiredRange = new EqualsTwoRange() ;
		
		multiply = new MultiplyAction(fact) ;
		initialize = new InitializeAction(fact) ;
		multiply.setTrace(trace);
		initialize.setTrace(trace);
		multiply.setId("multiply");
		initialize.setId("initialize");

		mult = new State(multiply,true) ;
		def = new State(initialize) ;
		mult.setId("mult");
		def.setId("default");
		forbidden = new ForbiddenState() ;
		desired = new DesiredState() ;
		forbidden.setId("f1");
		desired.setId("d1");
		mult.setTrace(trace);
		def.setTrace(trace);
		forbidden.setTrace(trace);
		desired.setTrace(trace);
		
		fact.addRange(mult, multRange) ;
		fact.addRange(def,defaultRange) ;
		fact.addRange(forbidden, fRange) ;
		fact.addRange(desired, desiredRange) ;

		behavior = new FactorialBehavior(fact) ;
		behavior.add(mult) ;
		behavior.add(def) ;
		this.add(behavior) ;
		Element.setWarnOnErrroneousAction(true);
		
		State s = fact.currentState() ;
		
		if (hasTrace()) _trace.addTrace(s) ;
	}
	
	public void start() throws Exception {
		behavior.act(multiply, null);
	}

	public void start(Map<String,Object> inputs) throws Exception {
		behavior.act(initialize,inputs) ;
		//start() ;
	}
	
	public void display() {
		fact.display(); 
		trace.dump("activity",System.out) ;
		trace.dump("state",System.out) ;
		trace.clear();
	}
	
	public void act(Action a) throws Exception {
		behavior.act(a, null);
	}
	
	public boolean defaultState() throws Exception {
		return (fact.currentState() != def) ;
	}
	
	public static void main(String[] args)  {

		try {

			Factorial comp = new Factorial(10) ;
		
			//automatic transition
			comp.start();
			//system triggered transition
			//while(!comp.defaultState()) {
			//	  comp.act(multiply) ;
			//}
			comp.display();
			
			Map<String,Object> inputs = new HashMap<String,Object>() ;
			inputs.put("f", 1) ;
			inputs.put("i",5) ;

			comp.start(inputs) ;		
			comp.display();
			
			Factorial walkComp = new Factorial(4) ;
			walkComp.walk(10) ;
			walkComp.displayWalk() ;

			//Create an individual walk (relies on Component choosing which Type to walk)
			//Walk<FactorialType> walkThe = new Walk<FactorialType>(walkComp.fact) ;
			//walkThe.walk() ;

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	protected void displayWalk() {
		Map<Behavior,Walk<Type>> walks = this.getWalks() ;
		walks.get(behavior).display("activity",System.out) ;
	}

	@Override
	public String tick(String key) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

}
