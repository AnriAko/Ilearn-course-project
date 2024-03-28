const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
	UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
	Username: { type: DataTypes.STRING(255), unique: true, allowNull: false },
	Password: { type: DataTypes.STRING(255), allowNull: false },
	LastAction: { type: DataTypes.DATE },
	Language: { type: DataTypes.ENUM('EN', 'GE'), defaultValue: 'EN' },
	Theme: { type: DataTypes.ENUM('Light', 'Dark'), defaultValue: 'Light' },
	Status: { type: DataTypes.ENUM('Active', 'Blocked'), defaultValue: 'Active' }
});

const Role = sequelize.define('Role', {
	RoleID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	RoleName: { type: DataTypes.STRING(50), allowNull: false }
}, { timestamps: false });

const UserRoles = sequelize.define('UserRoles', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	UserID: { type: DataTypes.INTEGER },
	RoleID: { type: DataTypes.INTEGER }
}, { timestamps: false });

const Collection = sequelize.define('Collection', {
	CollectionID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Title: { type: DataTypes.STRING(255), allowNull: false },
	Description: { type: DataTypes.TEXT },
	Theme: { type: DataTypes.ENUM('Toy Cars', 'Books', 'Coins'), allowNull: false },
	ImageURL: { type: DataTypes.STRING(255) },
});

const Item = sequelize.define('Item', {
	ItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Title: { type: DataTypes.STRING(255), allowNull: false },
	Hidden: { type: DataTypes.BOOLEAN, defaultValue: false },
	ImageURL: { type: DataTypes.STRING(255) }

});

const ItemField = sequelize.define('ItemField', {
	FieldID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	FieldName: { type: DataTypes.STRING(255), allowNull: false },
	FieldType: { type: DataTypes.ENUM('Integer', 'String', 'Text', 'Boolean', 'Date'), allowNull: false }
}, { timestamps: false });

const ItemFieldValue = sequelize.define('ItemFieldValue', {
	ValueID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Value: { type: DataTypes.JSON }
}, { timestamps: false });

const Comment = sequelize.define('Comment', {
	CommentID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Text: { type: DataTypes.TEXT, allowNull: false },
	UserID: { type: DataTypes.INTEGER, allowNull: false }
});

const Like = sequelize.define('Like', {
	LikeID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Tag = sequelize.define('Tag', {
	TagID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	TagName: { type: DataTypes.STRING(255), unique: true, allowNull: false }
});

const ItemTags = sequelize.define('ItemTags', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	ItemID: { type: DataTypes.INTEGER },
	TagID: { type: DataTypes.INTEGER }
}, { timestamps: false });

User.hasMany(Collection, { foreignKey: 'AuthorID', onDelete: 'CASCADE' });
Collection.belongsTo(User, { foreignKey: 'AuthorID', onDelete: 'CASCADE' });

User.hasMany(Comment, { foreignKey: 'UserID', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'UserID', onDelete: 'CASCADE' });

User.hasMany(Like, { foreignKey: 'UserID', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'UserID', onDelete: 'CASCADE' });

User.belongsToMany(Role, { through: UserRoles, onDelete: 'CASCADE' });
Role.belongsToMany(User, { through: UserRoles, onDelete: 'CASCADE' });

Collection.hasMany(Item, { foreignKey: 'CollectionID', onDelete: 'CASCADE' });
Item.belongsTo(Collection, { foreignKey: 'CollectionID', onDelete: 'CASCADE' });

Collection.hasMany(ItemField, { foreignKey: 'CollectionID', onDelete: 'CASCADE' });
ItemField.belongsTo(Collection, { foreignKey: 'CollectionID', onDelete: 'CASCADE' });

ItemField.hasMany(ItemFieldValue, { foreignKey: 'FieldID', onDelete: 'CASCADE' });
ItemFieldValue.belongsTo(ItemField, { foreignKey: 'FieldID', onDelete: 'CASCADE' });

Item.hasMany(ItemFieldValue, { foreignKey: 'ItemID', onDelete: 'CASCADE' });
ItemFieldValue.belongsTo(Item, { foreignKey: 'ItemID', onDelete: 'CASCADE' });

Item.hasMany(Comment, { foreignKey: 'ItemID', onDelete: 'CASCADE' });
Comment.belongsTo(Item, { foreignKey: 'ItemID', onDelete: 'CASCADE' });

Item.hasMany(Like, { foreignKey: 'ItemID', onDelete: 'CASCADE' });
Like.belongsTo(Item, { foreignKey: 'ItemID', onDelete: 'CASCADE' });

Item.belongsToMany(Tag, { through: ItemTags, foreignKey: 'ItemID', otherKey: 'TagID', onDelete: 'CASCADE' });
Tag.belongsToMany(Item, { through: ItemTags, foreignKey: 'TagID', otherKey: 'ItemID', onDelete: 'CASCADE' });

module.exports = {
	User,
	Role,
	Collection,
	Item,
	ItemField,
	ItemFieldValue,
	Comment,
	Like,
	Tag,
	UserRoles,
	ItemTags
};