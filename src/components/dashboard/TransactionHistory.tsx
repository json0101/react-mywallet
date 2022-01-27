import { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";

function TransactionHistory() {
    
    const {incomes, expenses} = useSelector((state:any) => state.transaction);

    const [transations, setTransations] = useState([]);


    useEffect(() => {

        let trans = [];

        if(incomes.length !== 0)
        {
            trans = incomes.map((i: any) => {
                return {
                    type: 'Income',
                    description: i.income_type.description,
                    value: +i.value,
                    date: i.date
                }
            });
        }

        if(expenses.length !== 0) {

            const expense = expenses.map((i: any) => {
                return {
                    type: 'Expense',
                    description: i.expense_type.description,
                    value: +i.value,
                    date: i.date
                }
            })
            trans = [...trans,...expense];
        }

        trans = trans.sort((a: any,b: any) => {
            return a.date < b.date ? 1: -1;
        });

        setTransations(trans);
    }, [incomes, expenses]);

    return (
        <>
            <Table >
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Value</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transations.map((t: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{t.type}</td>
                                    <td>{t.description}</td>
                                    <td>{t.value}</td>
                                    <td>{moment(t.date).format("yyyy/MM/DD")}</td>
                                </tr>
                            );
                        })
                    
                    }
                </tbody>
            </Table>
        </>
    )
}

export default TransactionHistory;