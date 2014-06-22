/**
 * Session Model
 */
module.exports = function(options) {
	var table = options.table || 'Session';
	return {
		define: function(sequelize, DataTypes) {
			return sequelize.define(table, {
				sid: {
					type: DataTypes.STRING,
					primaryKey: true
				},
				data: DataTypes.TEXT
			});
		}
	}

};