import { useEffect } from "react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";

function IncomeTypeChart() {

    const [data, setData] = useState<any[]>([]);
    const {incomes} = useSelector((state:any) => state.transaction);
    

    useEffect( () => {

        const initial = ["Type", "Value"];

        if(incomes.length === 0)
        {
            return;
        }

        const dataIncome = incomes.map( (x: any) => {
            return [
                    x.income_type.description+"", 
                    +x.value
            ];
        });

        let d = [];
        d.push([...dataIncome[0]]);
        for(let i=1; i<dataIncome.length; i++) {
            const dIncome = dataIncome[i];
            const find = d.find(x => x[0] === dIncome[0]);

            if(find){
                find[1] += dIncome[1];
                continue;
            }

            d.push([...dIncome]);
        }
        
        setData([initial,...d]);
    }
    ,[incomes]);

    const options = {
        title: "Income Type",
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

export default IncomeTypeChart;