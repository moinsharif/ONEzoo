/**
 * HTML5 Web SQL Database framework
 * Author: Stefano Storti
 * Licence: GNU General Public License version 3.0 or later <http://www.gnu.org/licenses/gpl-3.0.html>
 */

var db = new function Database() {
	
	this._db = null;
	
	/**
	 * Open database
	 */
	this.open = function(name, descr, ver, size) {
		if (ver == undefined)
			ver = "";
		
		this._db = window.openDatabase(name, ver, descr, size);
	}
	
	/**
	 * Database version
	 */
	this.version = function() {
		return this._db.version;
	}
	
	/**
	 * Execute an SQL command or an array of commands
	 */
	this.execute = function(sql, onSuccess, onError) {
		this._db.transaction(function(tx) {
			
			if (sql.constructor == Array) {
				for (i = 0; i < sql.length; i++)
					tx.executeSql(sql[i]);
			}
			else {
				tx.executeSql(sql);
			}
			
		}, onError, onSuccess);
	}
	
	/**
	 * Execute an SQL query
	 */
	this.query = function(sql, onSuccess, onError) {
		this._db.transaction(function(tx) {
			tx.executeSql(sql, [], onSuccess, onError);
		}, onError);
	}
	
	/**
	 * Upgrade to new version
	 * sqlVers = [{ver: "1", sql: "sql command 1"}, {ver: "2.0", sql: "sql command 2.0"}, {ver: "3.1", sql: "sql command 3.1"}, ...]
	 */
	this.upgrade = function(sqlVers, onSuccess, onError) {
		var currentVer = 0;
		if (this._db.version)
			currentVer = parseFloat(this._db.version);
		var sqlExec = new Array();
		
		for (i = 0; i < sqlVers.length; i++) {
			var ver = parseFloat(sqlVers[i].ver);
			var sql = sqlVers[i].sql;
			if (ver > currentVer) {
				sqlExec.push(sql);
			}
		}
		
		var currentVer = this._db.version;
		var lastVer = (sqlVers[sqlVers.length - 1]).ver;
		
		if (sqlExec.length > 0) {
			this.changeVersion(currentVer, lastVer, sqlExec, onSuccess, onError);
		}
	}
	
	/**
	 * Change database version
	 * sql = single SQL command or array of SQL commands
	 */
	this.changeVersion = function(oldVer, newVer, sql, onSuccess, onError) {
		this._db.changeVersion(oldVer, newVer, function (tx) {

			if (sql.constructor == Array) {
				for (i = 0; i < sql.length; i++)
					tx.executeSql(sql[i]);
			}
			else {
				tx.executeSql(sql);
			}
	      
	    }, onError, onSuccess);
	}
	
	/**
	 * Check if can use HTML5 SQLite web database
	 */
	this.webDbImplemented = function() {
		return (window.openDatabase != undefined);
	}
}