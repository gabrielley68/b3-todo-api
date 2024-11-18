module.exports = {
    async up(queryInterface, Sequelize){
        await queryInterface.addColumn(
            'Users',
            'birth_date',
            {
                type: Sequelize.DataTypes.DATEONLY
            }
        )
    },
    async down(queryInterface, Sequelize){
        await queryInterface.removeColumn(
            'Users',
            'birth_date'
        )
    }
};