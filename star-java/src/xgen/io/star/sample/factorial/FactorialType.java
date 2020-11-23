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


import xgen.io.star.core.Type;
import xgen.io.star.core.util.Exception;

public class FactorialType extends Type {
	Integer _f ;
	Integer _i ;
	
	public FactorialType(Integer i0) {
		super() ;
		_f = 1 ;
		_i = i0 ;
		_instance.put("f", _f) ;
		_instance.put("i", _i) ;
	}
	
	public FactorialType(FactorialType t) {
		super(t) ;
		_f = t._f ; 
		_i = t._i ;
		_instance.put("f", _f) ;
		_instance.put("i", _i) ;
	}

	@Override
	public Type duplicate() throws Exception {
		return new FactorialType(this) ;
	}
	
	@Override
	protected boolean sync() {
		_f = (Integer)_instance.get("f") ;
		_i = (Integer)_instance.get("i") ;
		return true;
	}

	@Override
	protected boolean persist() {
		return true;
	}

	@Override
	public String display(String s) {
		System.out.println(s) ;
		return s;
	}

}
