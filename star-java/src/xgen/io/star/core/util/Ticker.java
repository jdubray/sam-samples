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

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import xgen.io.star.core.connectors.Connector;
import xgen.io.star.core.connectors.DatabaseException;
import xgen.io.star.core.connectors.Options;

//DB Table
/*----------------------------------------
DROP TABLE IF EXISTS TICKERS;
CREATE TABLE TICKERS (
    ID INT,
    INSTANCE_ID VARCHAR(36) PRIMARY KEY,
    ACTION_CLASS VARCHAR(64),
    TICK_COUNT INTEGER,
    TICK_MAX INTEGER,
    EXPIRES BIGINT,
	DONE BOOLEAN
);
*///----------------------------------------

public class Ticker<T> implements Runnable {

	Map<String,Class<T>> _tickers ;
	int _period = 5000 ;
	Connector _dbConnector ;
	Thread _thread ;
	
	private volatile boolean _running = true;

	
	public Ticker() {
		this._tickers = new HashMap<String,Class<T>>() ;
	}
	
	public Ticker(int period) {
		this() ;
		this._period = period ;
	}
	
	public Ticker(Connector c, int period) {
		this();
		this._dbConnector = c ;
		if (period>0) {this._period = period ;}
	}
	
	public void start() {
		_running = true ;
		_thread = new Thread (this, "ticker");
		_thread.start () ;
	}
	
	public void shutdown() {
		_running = false ;
	}
	
	public void execute() {
		Map<String,Class<T>> activeTickers = new HashMap<String,Class<T>>() ;
		List<Map<String,Object>> updatedRecords ;
		
		if (this._dbConnector != null) {
			// scan active tickers
			Options o = new Options() ;
			o.select = "DONE" ;
			o.value = "0" ;
			try {
				updatedRecords = this._dbConnector.scan(o) ;
				// update all ticks and
				// stop all expired tickers
				for (Map<String,Object> record : updatedRecords) {
					int ticks = Integer.valueOf(record.get("TICK_COUNT").toString()) ;
					int tickMax = Integer.valueOf(record.get("TICK_MAX").toString()) ;
					BigInteger expires = new BigInteger(record.get("EXPIRES").toString()) ;
					ticks++ ;
					if (ticks>=tickMax) {
						record.put("DONE", "1") ;
					} else {
						long now = System.currentTimeMillis() % 1000 ;
						if (expires.longValue() <= now) {
							record.put("DONE", "1") ;
						} else {
							// we can tick
							activeTickers.put(record.get("TICK_COUNT").toString(), _tickers.get(record.get("TICK_COUNT"))) ;
						}
					}
					record.put("TICK_COUNT", String.valueOf(ticks)) ;
					this.persist(record) ;
 				}
			} catch (DatabaseException e) {
				e.printStackTrace();
			}
		}
		// execute ticks for active tickers
		System.out.println("[Ticker] there are "+String.valueOf(activeTickers.size())+" instances ticking" ) ;
		for (String key : activeTickers.keySet()) {
			Class<T> c = activeTickers.get(key) ;
			try {
				if (c!=null) {
					System.out.println("[Ticker] class:"+activeTickers.get(key).toString()) ;
					T action = (T)c.newInstance() ;
					Method m;
					try {
						m = action.getClass().getMethod("tick",String.class);
						m.invoke(key) ;
					} catch (SecurityException e1) {
						e1.printStackTrace();
					} catch (NoSuchMethodException e1) {
						e1.printStackTrace();
					} catch (IllegalArgumentException e) {
						e.printStackTrace();
					} catch (InvocationTargetException e) {
						e.printStackTrace();
					}
				}
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		this._tickers = activeTickers ;
	}
	
	public boolean startTicker(String instance, Class<T> c, String tickMax, String expiration) {
		if (this._tickers.get(instance) != null) {
			// please stop the ticker first
			// before you start a new one
			System.out.println("[Ticker] warning, there is already a ticker running for instance:"+ instance) ;
			return false ;
		}
		
		System.out.println("[Ticker] registering ticker for instance:"+ instance) ;
		// create record in DB
		if (this._dbConnector != null) {
			String className = c.getCanonicalName() ;
			Map<String,Object> tickerInstance = new HashMap<String,Object>() ;
			tickerInstance.put("INSTANCE_ID",instance) ;
			tickerInstance.put("ACTION_CLASS",className) ;
			tickerInstance.put("TICK_COUNT","0") ;
			if (tickMax != null) { tickerInstance.put("TICK_MAX",tickMax) ; }
			else { 
				tickerInstance.put("TICK_MAX","0") ;
			}
			System.out.println("[Ticker] expiration: " + expiration) ;
			if (expiration != null) { tickerInstance.put("EXPIRES",expiration) ; }
			else {tickerInstance.put("EXPIRES","0") ; } 
			tickerInstance.put("DONE","0") ; 
			System.out.println("[Ticker] persisting:"+ instance) ;
			this.persist(tickerInstance) ;
		}
		
		// add ticker 
		this._tickers.put(instance, c) ; 
		return true ;
	}

	protected boolean persist(Map<String,Object> instance) {
		if (_dbConnector != null) {
			Options current = new Options() ;
			current.Item = instance ;
			
			try {
				_dbConnector.putItem(current);
				return true ;
			} catch (DatabaseException e) {
				System.out.println("[Ticker] persist exception");
				e.printStackTrace();
			} 
		}
		return false;
	}


	public boolean stopTicker(String instance) {
		if (this._tickers.get(instance) != null) {
			// update the database
			if (this._dbConnector != null) {
				String className = this._tickers.get(instance).getCanonicalName() ;
				Map<String,Object> tickerInstance = new HashMap<String,Object>() ;
				tickerInstance.put("INSTANCE_ID",instance) ;
				tickerInstance.put("ACTION_CLASS",className) ;
				tickerInstance.put("TICK_COUNT","0") ;
				tickerInstance.put("TICK_MAX","0") ;
				tickerInstance.put("EXPIRES","0") ; 
				tickerInstance.put("DONE","1") ; 
				this.persist(tickerInstance) ;
			}
			
			// remove ticker from list
			this._tickers.remove(instance) ;
		}
		
		return false ;
	}

	@Override
	public void run() {
		System.out.println("[Ticker] run");
		while(_running) {
			this.execute();
		}
	}

	
}
