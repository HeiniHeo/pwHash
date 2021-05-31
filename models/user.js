const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true,
            },
            userpw : {
                type : Sequelize.STRING(100),
                allowNull : false,
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            paranoid : false,
            modelName : 'User',
            tableName : 'user',
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }
}