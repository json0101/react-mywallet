import { useEffect } from "react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";

function ExpenseTypeChart() {

    const [data, setData] = useState<any[]>([]);
    const {expenses} = useSelector((state:any) => state.transaction);
    

    useEffect( () => {

        const initial = ["Type", "Value"];

        if(expenses.length === 0)
        {
            return;
        }

        const dataExpense = expenses.map( (x: any) => {
            return [
                    x.expense_type.description+"", 
                    +x.value
            ];
        });

        let d = [];
        d.push([...dataExpense[0]]);
        for(let i=1; i<dataExpense.length; i++) {
            const dIncome = dataExpense[i];
            const find = d.find(x => x[0] === dIncome[0]);

            if(find){
                find[1] += dIncome[1];
                continue;
            }

            d.push([...dIncome]);
        }
        
        setData([initial,...d]);
    }
    ,[expenses]);

    const options = {
        title: "Expenses Type",
        pieHole: 0.4,
        is3D: false,
    };

    return (
        <>
            <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </>
    );
}

export default ExpenseTypeChart;