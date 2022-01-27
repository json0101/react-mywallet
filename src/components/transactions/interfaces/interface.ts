import { IExpenseType, IIncomeType } from "../../catalogues/interfaces/interfaces";

export interface IIncome {
    readonly id: number;
    readonly value: number;
    readonly date: Date;
    readonly observations: string;
    readonly income_type: IIncomeType;
    readonly creation_date: Date;
    readonly modification_date:Date;
    readonly description: string;
    readonly user_creates:number;
    readonly user_modifies:number;
    readonly active: boolean;
}

export interface IExpense {
    readonly id: number;
    readonly value: number;
    readonly date: Date;
    readonly observations: string;
    readonly expense_type: IExpenseType;
    readonly creation_date: Date;
    readonly modification_date:Date;
    readonly description: string;
    readonly user_creates:number;
    readonly user_modifies:number;
    readonly active: boolean;
}

