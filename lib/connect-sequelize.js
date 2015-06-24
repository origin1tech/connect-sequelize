/**
 * Sequelize based session store.
 *
 * Author: Michael Weibel <michael.weibel@gmail.com>
 * Fork Author: Origin1 Technologies <origin1tech@gmail.com>
 * License: MIT
 */
var util = require('util'),
	path = require('path'),
	model = require('./model'),
	debug = require('debug')('session:connect-sequelize'),
	Sequelize = require('sequelize');
function SequelizeStoreException(message) {
	this.name = 'SequelizeStoreException';
	this.message = message;
	Error.call(this);
}
util.inherits(SequelizeStoreException, Error);
module.exports = function SequelizeSessionInit(express) {
	var Store = express.Store || express.session.Store;
	function SequelizeStore(db, options, modelName) {
		// enable passing in modelName as second param.
		if(typeof options === 'string'){
			modelName = options;
			options = {};
		}
		options = options || {};
		modelName = modelName || options.modelName || 'Session';
		// try to create the connection if appropriate options are passed.
		if (!db && options.database && options.username)
			db = new Sequelize(options.database, options.username, options.password || null, options);
		if(!db)
			throw new SequelizeStoreException('Database connection is required. The options.db property must contain a valid Sequelize connection.');
		this.sessionModel = model.define.call(null, db, options, modelName);
		this.sessionModel.sync().then(function(err) {
			if (typeof options.callback === 'function') {
				options.callback(err);
			}
		});
		Store.call(this, options);
	}
	util.inherits(SequelizeStore, Store);
	SequelizeStore.prototype.get = function getSession(sid, fn) {
		debug('SELECT "%s"', sid);

		this.sessionModel.find({where: {'sid': sid}}).then(
			function sessionFind(session) {
				if(!session) {
					debug('The requested session could not be found %s', sid);
					return fn();
				}
				debug('Session id %s was found containing %s', session.sid, session.data);
				try {
					var data = JSON.parse(session.data);
					debug('Successfully found session %s', data);
					fn(null, data);
				} catch(e) {
					debug('Error parsing session data: %s', e);
					return fn(e);
				}
			}, function sessionFindError (error) {
				debug('Error finding session: %s', error);
				fn(error);
			});

	};
	SequelizeStore.prototype.set = function setSession(sid, data, fn) {
		debug('INSERT "%s"', sid);
		var stringData = JSON.stringify(data);

		this.sessionModel.findOrCreate({ where: {'sid': sid}, 'data': stringData}).spread(
			function sessionCreated(session, created) {

				if(session['data'] !== stringData) {
					session['data'] = JSON.stringify(data);
					console.log()
					session.save().then(
						function sessionUpdated(session) {
						if (fn) {
							fn(null, data);
						}
					}, function sessionUpdatedError(error) {
						debug('Error updating session: %s', error);
						if (fn) {
							fn(error);
						}
					});
				} else {
					fn(null, session);
				}
			}, function sessionCreatedError(error) {
				debug('Error creating session: %s', error);
				if (fn) {
					fn(error);
				}
			});

	};
	SequelizeStore.prototype.destroy = function destroySession(sid, fn) {
		debug('DESTROYING %s', sid);
		this.sessionModel.find({where: {'sid': sid}}).then(
			function findSession(session) {
				// If the session wasn't found, then consider it destroyed already.
				if (session === null) {
					debug('Session not found, assuming destroyed %s', sid);
					fn();
				}
				else {
					session.destroy().success(function destroyedSession() {
						debug('Destroyed %s', sid);
						fn();
					}).error(function errorDestroying(error) {
						debug('Error destroying session: %s', error);
						fn(error);
					});
				}
			}, function findSessionError(error) {
				debug('Error finding session: %s', error);
				fn(error);
			});

	};
	SequelizeStore.prototype.length = function calcLength(fn) {
		this.sessionModel.count().then(
			function sessionsCount(c) {
				fn(null, c);
			},function sessionsCountError(error) {
				fn(error);
			});
	};
	return SequelizeStore;
};