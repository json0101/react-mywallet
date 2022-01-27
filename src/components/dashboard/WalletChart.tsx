import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { IExpense, IIncome } from "../transactions/interfaces/interface";

function WalletChart() {

    const {incomes, expenses} = useSelector((state:any) => state.transaction);

    const [dataWalletChart, setDataWalletChart] = useState<any[]>([]);

    // const dataWalletChart = [
    //     ["Day", "Balance",],
    //     ["1", 1000],
    //     ["2", 1170],
    //     ["3", 660 ],
    //     ["4", 1030 ],
    // ];

    const options = {
        title: "My Wallet",
        curveType: "function",
        legend: { position: "bottom" },
    };

    useEffect(()=> {

        const initValue:any  = ["Day","Balance"];
        let valuesIncomes:any = [];
        let valuesExpenses:any = [];

        if(incomes.length>0) {
            //const initValue:WalletChartData  = new WalletChartData("Day", "Balance");
            valuesIncomes = incomes.map((m: IIncome) => {
                const date = new Date(m.date);

                return [moment(date).format("yyyy-MM-DD"), +m.value];
            });

        }

        if(expenses.length > 0) {
            valuesExpenses = expenses.map((m: IExpense) => {
                const date = new Date(m.date);

                return [moment(date).format("yyyy-MM-DD"), (+m.value * -1)];
            });
        }

        const resume = [ ...valuesIncomes,...valuesExpenses];

        if(resume.length===0)
        return;
        
        
        let d = [];
        d.push([...resume[0]]);
        
        for(let i=1; i<resume.length; i++) {
            const dResume = resume[i];
            const find = d.find(x => x[0] === dResume[0]);

            if(find) {
                find[1] += dResume[1];
                continue;
            }

            d.push([...dResume]);
        }
        d = d.sort((a:any, b:any) => {
            return new Date(a[0]) > new Date(b[0])? 1: -1;
        });

        let valueAccumulate = d[0][1];
        let values = [];
        values.push(d[0]);

        for(let i=1; i<d.length; i++) {
            valueAccumulate += d[i][1];
            values.push([d[i][0], valueAccumulate]);
        }

        console.log("d", d);
        console.log("v", values);

        

        setDataWalletChart([initValue, ...values]);
    },[incomes, expenses]);

    useEffect(()=>{
        //console.log(dataWalletChart);
    }, [dataWalletChart]);

    
    return (
        <>
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={dataWalletChart}
                options={options}
            />
        </>
    );
}

export default WalletChart;