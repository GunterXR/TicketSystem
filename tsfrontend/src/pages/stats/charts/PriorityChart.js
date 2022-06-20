import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
export default function PriorityChart(props) {
    let pieData = []
    if (props.data != undefined) {
        pieData = [
            {
                name: "Низкий",
                value: props.data.countLow
            },
            {
                name: "Средний",
                value: props.data.countMedium
            },
            {
                name: "Высокий",
                value: props.data.countHigh
            },
            {
                name: "Критический",
                value: props.data.countCritical
            }
        ];
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                console.log(payload),
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value}  (${payload[0].value / props.data.countTotal * 100}%)`}</label>
                </div>
            );
        }
        return null;
    };

    return (
        <PieChart width={550} height={200}>
            <Pie
                data={pieData}
                color="#000000"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
            >
                {pieData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }} />
            <Legend wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }}/>
        </PieChart>
    );
}