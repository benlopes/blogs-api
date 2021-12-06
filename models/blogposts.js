const BlogPosts = (sequelize, DataTypes) => {
  const Post = sequelize.define('BlogPosts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
  },
  {
    timestamps: false,
  });

  Post.associate = (models) => {
    Post.belongsTo(models.Users, {
      as: 'UserId', foreignKey: 'user',
    });
  };

  return Post;
};

module.exports = BlogPosts;
