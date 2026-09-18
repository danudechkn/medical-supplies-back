import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index";

class AppConfig extends Model<
  InferAttributes<AppConfig>,
  InferCreationAttributes<AppConfig>
> {
  declare windowname: string;
  declare configname: string;
  declare configvalue: CreationOptional<string | null>;
  declare note: CreationOptional<string | null>;
  declare active: CreationOptional<string | null>;

  static associate(models: any) {
    // กำหนดความสัมพันธ์กับตารางอื่นๆ (ถ้ามี)
  }
}

AppConfig.init(
  {
    windowname: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false,
    },
    configname: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    configvalue: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    active: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "app_config",
    timestamps: false,
  }
);

export default AppConfig;
