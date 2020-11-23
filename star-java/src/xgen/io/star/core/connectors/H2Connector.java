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

import java.sql.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class H2Connector implements Connector {

	static Connection _h2Connection ;
	static String _tableName ;
	static int _idCount ;
	static String _insert ;
	static String _select ;
	static String _instanceId = "instanceId" ;
	static List<String> _keys ;
	
	@Override
	public Connector connect(HashMap<String,String> connOptions) throws DatabaseException {
		try {
			Class.forName("org.h2.Driver");
		} catch (ClassNotFoundException e) {
			throw new DatabaseException() ;
		}
        try {
        	_idCount =  (int )(Math. random() * 1147483647 + 1) ;
        	System.out.println("[H2] db:"+connOptions.get("db")+"/") ;
        	//+connOptions.get("db")
        	// H2 database can be found in absolute directory /data/h2/
			Connection h2conn = DriverManager.getConnection("jdbc:h2:/data/h2/"+connOptions.get("db"), connOptions.get("user"), connOptions.get("password"));
			_h2Connection = h2conn ;
			if (connOptions.get("tableName") != null) {
				_tableName = connOptions.get("tableName") ; 
			}
			if (connOptions.get("insert") != null) {
				_insert = connOptions.get("insert") ; 
				_keys = Arrays.asList(_insert.replaceAll("\\s+","").split(","));
			}
			if (connOptions.get("select") != null) {
				_select = connOptions.get("select") ; 
			}
			if (connOptions.get("instanceId") != null) {
				_instanceId = connOptions.get("instanceId") ; 
			}
			if (connOptions.get("create_table") != null) {
				try {
					Statement cts = _h2Connection.createStatement();
					String ct = connOptions.get("create_table") ;
			        boolean res = cts.execute(ct);
				} catch (SQLException e) {
					System.out.println("[h2] exception?create_table "+e.toString()) ;
					throw new DatabaseException() ;
				}				
			}
	    } catch (SQLException e) {
	    	System.out.println("[H2] exception:"+e.getMessage()) ;
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
	    for(String key : _keys) {
	    	insert += ", "+key ;
	    	query += ", '"+item.get(key)+"'" ;
	    } 
	    query += ");";
	    query  = "INSERT INTO \""+_tableName+"\" ("+insert+") VALUES (" + query;
	    System.out.println("[H2Connector] insert string(v1): "+ query) ;
	    
	    try {
	        statement = _h2Connection.createStatement();
	        boolean res = statement.execute(query);
	        
	        System.out.println("result: "+String.valueOf(res)) ;
	      
	    } catch (SQLException e ) {
	        System.out.println("[H2] exception: "+e.toString()) ;
	        throw new DatabaseException() ;
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
	public Map<String,Object> getItem(Options params) throws DatabaseException {
		Statement statement = null;
		HashMap<String,Object> item = (HashMap<String,Object>)params.Item ;
	    String query  = "SELECT * FROM "+_tableName+" WHERE "+_select+" = "+item.get(_instanceId) ; 
	    	   // could look for a specific step too
	           query += " ;"  ; 
	    HashMap<String,Object> res = new HashMap<String,Object>() ;
	    try {
	        statement = _h2Connection.createStatement();
	        ResultSet rs = statement.executeQuery(query);
	        while (rs.next()) {
	        	for (String key : _keys) {
	        		res.put(key, rs.getString(key)) ;
	        	}
	        }
	    } catch (SQLException e ) {
	        throw new DatabaseException() ;
	    } 
	    return res ;
	}

	@Override
	public List<Map<String,Object>> query(Options params) throws DatabaseException {
		
		HashMap<String,Object> res = new HashMap<String,Object>() ;
	    // TODO To be implemented
		return null ;

	}

	@Override
	public List<Map<String,Object>> scan(Options params) throws DatabaseException {
		// TODO Auto-generated method stub
		return null ;
	}

	@Override
	public void close() throws DatabaseException {
		// TODO Auto-generated method stub
		
	}

}
