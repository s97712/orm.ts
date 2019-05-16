import { StringDataTypeConstructor, NumberDataTypeConstructor, Model, ModelAttributeColumnOptions, DataTypes, Sequelize, ModelAttributeColumnReferencesOptions } from "sequelize";

class WideUserId {
    constructor(public value?: number) {}
    private identity() {}
}
class UserId extends WideUserId {
    constructor(public value: number) {
        super(value)
    }
}


const BasicModal = class extends Model {}

type ModelInfo<M> = {
    [P in keyof M]-?: M[P] extends BaseModel? ModelRefenerce: ModelColumn<M[P]>
} 

type MapToDefine<T> = T extends number ? NumberDataTypeConstructor 
    : T extends string ? StringDataTypeConstructor
    : T extends boolean ? typeof DataTypes.BOOLEAN
    : T extends Date ? typeof DataTypes.TIME
    : T extends ArrayBuffer ? typeof DataTypes.BLOB
    : any


type ModelRefenerce = void | ModelAttributeColumnReferencesOptions
type ModelAttributes<T> = ModelAttributeColumnOptions & {
    type: MapToDefine<Exclude<T, undefined>>
}
type ModelColumn<T> = Extract<T, undefined> extends never
    ? (ModelAttributes<T> & { allowNull?: false }) | MapToDefine<T>
    : ModelAttributes<T> & { allowNull: true }

type CreateValues<M> = {
    [P in keyof M]: M[P]
}
export class Utils<M> {
    constructor(
        protected model: typeof BasicModal,
        public alias: string,
    ) {}
    create(user: WideUserId, values: CreateValues<M>) {
        this.model.create(values)
    }
} 

export class BaseModel {
    private identify(){}
}

export const CreateDbApi = <M extends BaseModel>(model: { new(): M }
) => (
    alias: string,
    attrs: ModelInfo<M>,
    setup?: (model: typeof BasicModal, relations?: any) => void,
) => <R>(
    apiCreater: (utils: Utils<M>)=>R,
) => (sequelize: Sequelize, rename?: string) => {
    alias = rename || alias;

    const model = sequelize.define(alias, attrs as any) as typeof BasicModal;
    const api = apiCreater(new Utils<M>(model, alias));

    return { api, model, setup };
}

class Task extends BaseModel {
}

class User extends BaseModel {
    id!: number
    b!: boolean
    test?: number
    task!: Task
}


CreateDbApi(User)("user", {
    id: DataTypes.INTEGER,
    b: DataTypes.BOOLEAN,
    test: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    task: {},
})
