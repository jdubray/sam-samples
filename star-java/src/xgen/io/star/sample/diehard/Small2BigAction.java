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
import xgen.io.star.core.Type;

public class Small2BigAction extends Action {

	public Small2BigAction(Type t) {
		super() ;
		this.setType(t);
	}

	public Map<String,Object> eval(Map<String,Object> input) {
		_returns = new HashMap<String,Object>() ;
		
		Integer big = (Integer)input.get("big") ;
		Integer small = (Integer)input.get("small") ;
		
		Integer bigp = Math.min(JugType.bigSize,big+small) ;
		Integer smallp = small - (bigp - big);
		_returns.put("big", bigp) ;
		_returns.put("small", smallp) ;
		return _returns ;
	}

}
