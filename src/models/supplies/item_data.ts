import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { sequelize } from "./index";

export class ItemData extends Model<
    InferAttributes<ItemData>,
    InferCreationAttributes<ItemData>
> {
    declare id: CreationOptional<number>;
    declare item_id: number;
    declare coverage_group: CreationOptional<string | null>;
    declare price: CreationOptional<number>;
    declare reimburse: CreationOptional<number>;
    declare noreimburse: CreationOptional<number>;
    declare stockcode: CreationOptional<string | null>;
    declare opd: CreationOptional<string | null>;
    declare ipd: CreationOptional<string | null>;
    declare hm: CreationOptional<string | null>;


    // สำหรับกำหนดความสัมพันธ์ (Associations) กับโมเดลอื่น
    static associate(models: any) {

    }
}

ItemData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        coverage_group: {
            type: DataTypes.STRING(5),
            allowNull: true,
            defaultValue: null,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        reimburse: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        noreimburse: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        stockcode: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: null,
        },
        opd: {
            type: DataTypes.STRING(1),
            allowNull: true,
            defaultValue: "N",
        },
        ipd: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            defaultValue: "N",
        },
        hm: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            defaultValue: "N",
        },
    },
    {
        sequelize,
        tableName: "item_data",
        timestamps: false,
    },
);

export default ItemData;