const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Venta = sequelize.define('Venta', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombreUsuario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        precioTotal: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'ventas',
        timestamps: false
    });

    return Venta;
};