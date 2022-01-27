

export class IncomeModel {
    value: number;
    observations: string;
    income_type: number;
    date?: Date;
    active: boolean = true;

    constructor( value: number, observations: string, income_type: number, date?: Date) {
       
        this.value = value;
        this.observations = observations;
        this.income_type = income_type;
        this.date = date;
    }
}

export class ExpenseModel {
    value: number;
    observations: string;
    expense_type: number;
    date?: Date;
    active: boolean = true;

    constructor( value: number, observations: string, expense_type: number, date?: Date) {
       
        this.value = value;
        this.observations = observations;
        this.expense_type = expense_type;
        this.date = date;
    }
}