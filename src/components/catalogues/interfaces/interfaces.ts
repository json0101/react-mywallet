export interface IExpenseType {
    readonly id: number;
    readonly creation_date: Date;
    readonly modification_date:Date;
    readonly description: string;
    readonly user_creates:number;
    readonly user_modifies:number;
    readonly active: boolean;
}

export interface IIncomeType {
    readonly id: number;
    readonly creation_date: Date;
    readonly modification_date:Date;
    readonly description: string;
    readonly user_creates:number;
    readonly user_modifies:number;
    readonly active: boolean;
}

export interface IExpenseType {
    readonly id: number
    readonly description: string;
    readonly active: boolean;
}

export interface IIncomeType {
    readonly id: number;
    readonly description: string;
    readonly active: boolean;
}
