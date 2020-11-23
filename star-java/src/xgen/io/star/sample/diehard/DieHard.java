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

package xgen.io.star.sample.diehard;

import java.util.HashMap;
import java.util.Map;

import xgen.io.star.core.Action;
import xgen.io.star.core.Component;
import xgen.io.star.core.DesiredState;
import xgen.io.star.core.ForbiddenState;
import xgen.io.star.core.State;
import xgen.io.star.core.util.Exception;
import xgen.io.star.core.util.Trace;

public class DieHard extends Component {

	JugType jugs ;
	JugBehavior behavior ;
	FillBigAction fillBig ;
	FillSmallAction fillSmall ;
	EmptyBigAction emptyBig ;
	EmptySmallAction emptySmall ;
	Big2SmallAction big2Small ;
	Small2BigAction small2Big ;
	InitializeAction initialize ;
	
	State emptyBigEmptySmall ;
	State fullBigFullSmall ;
	State fullBigEmptySmall ;
	State emptyBigFullSmall ;
	State partialBigEmptySmall ;
	State partialBigFullSmall ;
	State fullBigPartialSmall ;
	State emptyBigPartialSmall ;
	State partialBigPartialSmall ;

	ForbiddenState forbidden;
	DesiredState desired ;
	Trace trace ;
	
	public DieHard(JugBehavior behavior) {
		super() ;
		this.add(behavior) ;
	}
	
	public DieHard(int big, int small) throws Exception {
		
		trace = new Trace("fact_trace") ;
		
		jugs = new JugType(big,small) ;
		EmptyBigEmptySmallRange emptyBigEmptySmallRange = new EmptyBigEmptySmallRange() ;
		FullBigFullSmallRange fullBigFullSmallRange = new FullBigFullSmallRange() ;
		FullBigEmptySmallRange fullBigEmptySmallRange = new FullBigEmptySmallRange() ;
		EmptyBigFullSmallRange emptyBigFullSmallRange = new EmptyBigFullSmallRange() ;
		PartialBigEmptySmallRange partialBigEmptySmallRange = new PartialBigEmptySmallRange() ;
		PartialBigFullSmallRange partialBigFullSmallRange = new PartialBigFullSmallRange() ;
		FullBigPartialSmallRange fullBigPartialSmallRange = new FullBigPartialSmallRange() ;
		EmptyBigPartialSmallRange emptyBigPartialSmallRange = new EmptyBigPartialSmallRange() ;
		PartialBigPartialSmallRange partialBigPartialSmallRange = new PartialBigPartialSmallRange() ;		
		
		fillBig = new FillBigAction(jugs);
		fillSmall = new FillSmallAction(jugs) ;
		emptyBig = new EmptyBigAction(jugs) ;
		emptySmall = new EmptySmallAction(jugs) ;
		big2Small = new Big2SmallAction(jugs) ;
		small2Big = new Small2BigAction(jugs) ;

		fillBig.setTrace(trace);
		fillSmall.setTrace(trace);
		emptyBig.setTrace(trace);
		emptySmall.setTrace(trace);
		big2Small.setTrace(trace);
		small2Big.setTrace(trace);

		fillBig.setId("fillBig");
		fillSmall.setId("fillSmall");
		emptyBig.setId("emptyBig");
		emptySmall.setId("emptySmall");
		big2Small.setId("big2Small");
		small2Big.setId("small2Big");

		emptyBigEmptySmall = new State(fillBig) ;
		fullBigFullSmall = new State(emptyBig) ;
		fullBigEmptySmall = new State(big2Small) ;
		emptyBigFullSmall = new State(small2Big) ;
		partialBigEmptySmall = new State(big2Small) ;
		partialBigFullSmall = new State(emptySmall) ;
		fullBigPartialSmall = new State(big2Small) ;
		emptyBigPartialSmall = new State(small2Big) ;
		partialBigPartialSmall = new State(big2Small) ;

		forbidden = new ForbiddenState() ;
		desired = new DesiredState() ;
		forbidden.setId("f1");
		desired.setId("d1");
		emptyBigEmptySmall.setTrace(trace).setId("emptyBigEmptySmall");
		emptyBigEmptySmall.add(fillSmall);
		fullBigFullSmall.setTrace(trace).setId("fullBigFullSmall");
		fullBigEmptySmall.setTrace(trace).setId("fullBigEmptySmall");
		fullBigEmptySmall.add(fillSmall);
		emptyBigFullSmall.setTrace(trace).setId("emptyBigFullSmall");
		emptyBigFullSmall.add(emptySmall);
		partialBigEmptySmall.setTrace(trace).setId("partialBigEmptySmall");
		partialBigEmptySmall.add(emptyBig) ;
		partialBigFullSmall.setTrace(trace).setId("partialBigFullSmall");
		partialBigFullSmall.add(emptyBig);
		fullBigPartialSmall.setTrace(trace).setId("fullBigPartialSmall");
		emptyBigPartialSmall.setTrace(trace).setId("emptyBigPartialSmall");
		emptyBigPartialSmall.add(fillBig);
		partialBigPartialSmall.setTrace(trace).setId("partialBigPartialSmall");
		forbidden.setTrace(trace);
		desired.setTrace(trace);
		
		jugs.addRange(emptyBigEmptySmall, emptyBigEmptySmallRange) ;
		jugs.addRange(fullBigFullSmall,fullBigFullSmallRange) ;
		jugs.addRange(fullBigEmptySmall,fullBigEmptySmallRange) ;
		jugs.addRange(emptyBigFullSmall,emptyBigFullSmallRange) ;
		jugs.addRange(partialBigEmptySmall,partialBigEmptySmallRange) ;
		jugs.addRange(partialBigFullSmall,partialBigFullSmallRange) ;
		jugs.addRange(fullBigPartialSmall,fullBigPartialSmallRange) ;
		jugs.addRange(emptyBigPartialSmall,emptyBigPartialSmallRange) ;
		jugs.addRange(partialBigPartialSmall,partialBigPartialSmallRange) ;
		DesiredRange desiredRange = new DesiredRange() ;
		jugs.addRange(desired, desiredRange) ;
		
		behavior = new JugBehavior(jugs) ;
		behavior.add(emptyBigEmptySmall) ;
		behavior.add(fullBigFullSmall) ;
		behavior.add(partialBigEmptySmall) ;
		behavior.add(partialBigFullSmall) ;
		behavior.add(fullBigPartialSmall) ;
		behavior.add(emptyBigPartialSmall) ;
		behavior.add(partialBigPartialSmall) ;
	}
	
	public void display() {
		jugs.display(); 
		trace.dump();
		trace.clear();
	}
	
	@Override
	public void start() throws Exception {
		behavior.act(fillBig, null);
	}

	@Override
	public void start(Map<String, Object> inputs) throws Exception {
		behavior.act(initialize,inputs) ;
		start() ;
	}

	@Override
	public void act(Action a) throws Exception {
		behavior.act(a, null);
	}

	@Override
	public boolean defaultState() throws Exception {
		return (jugs.currentState() == desired) ;
	}

	public static void main(String[] args) {

		try {

			DieHard comp = new DieHard(0,0) ;
		
			//automatic transition
			comp.start();
			//while (!comp.defaultState()) {
				comp.walk() ;
			//}
			//system triggered transition
			//while(!comp.defaultState()) {
			//	  comp.act(multiply) ;
			//}
			comp.display();
			
			Map<String,Object> inputs = new HashMap<String,Object>() ;
			inputs.put("big", 1) ;
			inputs.put("small",5) ;

			//comp.start(inputs) ;		
			//comp.display();
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public Component walk() throws Exception {
		this.act(big2Small);
		this.act(emptySmall);
		this.act(big2Small);
		this.act(fillBig);
		this.act(big2Small);
		return this ;
	}

	@Override
	public String tick(String key) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}


}
