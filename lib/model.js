/**
 * Session Model
 */
module.exports = {
	define: function(db, options, modelName) {
		return db.import(modelName, function (sequelize, DataTypes) {
			return sequelize.define(modelName, {
				sid: {
					type: DataTypes.STRING,
					primaryKey: true
				},
				data: DataTypes.TEXT
			}, options);
		});
	}
};
