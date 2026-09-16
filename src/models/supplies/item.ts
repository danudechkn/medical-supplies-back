import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { sequelize } from "./index";

export class Item extends Model<
    InferAttributes<Item>,
    InferCreationAttributes<Item>
> {
    declare id: CreationOptional<number>;
    declare itemname: string;
    declare active: CreationOptional<string>;
    declare created_at: CreationOptional<Date | null>;
    declare updated_at: CreationOptional<Date | null>;
    declare created_by: CreationOptional<string | null>;
    declare updated_by: CreationOptional<string | null>;
    declare inv_code: CreationOptional<string | null>;

    // สำหรับกำหนดความสัมพันธ์ (Associations) กับโมเดลอื่น
    static associate(models: any) {

    }
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        itemname: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        active: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "Y",
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        created_by: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
        },
        updated_by: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
        },
        inv_code: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: "item",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
);

export default Item;
