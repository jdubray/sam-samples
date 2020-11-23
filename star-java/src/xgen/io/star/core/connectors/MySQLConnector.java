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

package xgen.io.star.core.connectors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MySQLConnector implements Connector {

	Connection _MySQLConnection ;
	String _tableName ;
	int _idCount ;
	String _insert ;
	String _select ;
	String _instanceId = "INSTANCE_ID" ;
	List<String> _keys ;
	
	@Override
	public Connector connect(HashMap<String,String> connOptions) throws DatabaseException {
    	System.out.println("[MySQLConnector] Initializing connector") ; 

		try {
			 Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (ClassNotFoundException e) {
			throw new DatabaseException() ;
		} catch (InstantiationException e) {
			throw new DatabaseException() ;
		} catch (IllegalAccessException e) {
			throw new DatabaseException() ;
		}
        try {
        	_idCount =  (int )(Math. random() * 1147483647 + 1) ;
        	System.out.println("[MySQL] db:"+connOptions.get("db")+"/") ;
        	//+connOptions.get("db")
        	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/"+connOptions.get("db")+"?user="+connOptions.get("user")+"&password="+connOptions.get("password"));
			//Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/esi?user=root&password=rootdev");
			_MySQLConnection = conn ;
			if (connOptions.get("tableName") != null) {
				_tableName = connOptions.get("tableName") ; 
			}
			if (connOptions.get("insert") != null) {
				_insert = connOptions.get("insert") ; 
				_keys = Arrays.asList(_insert.replaceAll("\\s+","").split(","));
		    	System.out.println("[MySQLConnector] found keys:"+_keys.size()) ; 

			} else {
		    	System.out.println("[MySQLConnector] no insert statement:"+connOptions.get("insert")) ; 
			}
			if (connOptions.get("select") != null) {
				_select = connOptions.get("select") ; 
			}
			if (connOptions.get("instanceId") != null) {
				_instanceId = connOptions.get("instanceId") ; 
			}
			if (connOptions.get("create_table") != null) {
//				try {
//					Statement cts = _MySQLConnection.createStatement();
//					String ct = connOptions.get("create_table") ;
//			        boolean res = cts.execute(ct);
//				} catch (SQLException e) {
//					System.out.println("[MySQL] exception?create_table "+e.toString()) ;
//					throw new DatabaseException() ;
//				}				
			}
	    } catch (SQLException e) {
	    	System.out.println("[MySQL] exception:"+e.getMessage()) ;
	    	e.printStackTrace(); 
			throw new DatabaseException() ;
		}
        return this ;
	}

	protected String id() {
		return String.valueOf(_idCount++) ;
	}
	
	@Override
	public void putItem(Options params) throws DatabaseException {
		Statement statement = null;
		HashMap<String,Object> item = (HashMap<String,Object>)params.Item ;
		//Set<String> keys = item.keySet() ;
		String insert = "" ;
	    String query  = "'"+this.id()+"'" ; // ID
	    insert += "ID" ;
	    String update = "ID="+query  ;
	    if (_keys == null) {
	    	System.out.println("[MySQLConnector] keys is null") ;
	    }
	    for(String key : _keys) {
	    	insert += ", "+key ;
	    	query += ", '"+item.get(key)+"'" ;
	    	if (!key.equals(_instanceId)) { 
	    		if (!key.equals("STEP")) {
	    			if (!key.equals("TICK_COUNT")) {
		    			update += ", "+key+"='"+item.get(key)+"'" ; 
	    			} else {
	    				update += ", TICK_COUNT = TICK_COUNT + 1" ;
	    			}
	    		} else {
	    			update += ", STEP = STEP+1" ;
	    		}
	    	}
	    } 
	    query += ") ON DUPLICATE KEY UPDATE "+update+";";
	    query  = "INSERT INTO "+_tableName+" ("+insert+") VALUES (" + query;
	    //System.out.println("[MySQLConnector] insert string(v1): "+ query) ;
	    
	    try {
	        statement = _MySQLConnection.createStatement();
	        boolean res = statement.execute(query);
	        
	        //System.out.println("result: "+String.valueOf(res)) ;
	      
	    } catch (SQLException e ) {
	        System.out.println("[MySQLConnector] exception: "+e.toString()) ;
	        throw new DatabaseException() ;
	    } finally {
	    	try {
				statement.close() ;
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
        System.out.println("returning") ;

	}

	@Override
	public void updateItem(Options params) throws DatabaseException {
		// TODO Auto-generated method stub

	}

	@Override
	public void deleteItem(Options params) throws DatabaseException {
		// TODO Auto-generated method stub

	}

	@Override
	public HashMap<String,Object> getItem(Options params) throws DatabaseException {
		Statement statement = null;
		HashMap<String,Object> item = (HashMap<String,Object>)params.Item ;
		//System.out.println("[MySQLConnector] getItem:"+item.get(_instanceId));
		String query  = "SELECT * FROM "+_tableName+" WHERE "+_select+" = '"+item.get(_instanceId)+"'" ; 
	    	   // could look for a specific step too
	           query += " ;"  ; 
	    HashMap<String,Object> res = new HashMap<String,Object>() ;
	    try {
	        statement = _MySQLConnection.createStatement();
	        ResultSet rs = statement.executeQuery(query);
	        while (rs.next()) {
	        	for (String key : _keys) {
	        		//System.out.println("[MySQLConnector] getItem rs["+key+"]: "+rs.getString(key).toString() ) ;
	        		res.put(key, rs.getString(key)) ;
	        	}
	        }
	        rs.close() ;

	    } catch (SQLException e ) {
	    	System.out.println("[MySQLConnector] getItem exception: "+e.getMessage()) ;
	        throw new DatabaseException() ;
	    } finally {
	    	try {
				statement.close() ;
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
	    return res ;
	}

	@Override
	public List<Map<String,Object>> scan(Options params) throws DatabaseException {
		
	    List<Map<String,Object>> res = new ArrayList<Map<String,Object>>() ;

		Statement statement = null;
		String select = params.select ;
		String value = params.value ;
		if (select == null) { select = _select ; }
		if (value == null) { value = "null" ; }
		//System.out.println("[MySQLConnector] getItem:"+item.get(_instanceId));
		String query  = "SELECT * FROM "+_tableName+" WHERE "+select+" = '"+value+"'" ; 
	    	   // could look for a specific step too
	           query += " ;"  ; 
	    try {
	        statement = _MySQLConnection.createStatement();
	        ResultSet rs = statement.executeQuery(query);
	        while (rs.next()) {
	        	Map<String,Object> rec = new HashMap<String,Object>() ;
	        	for (String key : _keys) {
	        		//System.out.println("[MySQLConnector] getItem rs["+key+"]: "+rs.getString(key).toString() ) ;
	        		rec.put(key, rs.getString(key)) ;
	        	}
	        	res.add(rec) ;
	        }
	        rs.close() ;
	    } catch (SQLException e ) {
	    	System.out.println("[MySQLConnector] getItem exception: "+e.getMessage()) ;
	        throw new DatabaseException() ;
	    } finally {
	    	try {
				statement.close();
							} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
	    }
	    return res ;


	}

	@Override
	public List<Map<String,Object>> query(Options params) throws DatabaseException {
		// TODO Auto-generated method stub
		return null ;
	}

	@Override
	public void close() throws DatabaseException {
		try {
			_MySQLConnection.close() ;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new DatabaseException() ;
		}
		
	}


}
