import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";

export default function MonthChart(props) {
    return (
        <BarChart
            width={1100}
            height={300}
            data={props.data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis name="День" dataKey="daysString" fontFamily={'Roboto, sans-serif'}/>
            <YAxis allowDecimals={false} fontFamily={'Roboto, sans-serif'}/>
            <Legend wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }}/>
            <Tooltip wrapperStyle={{ fontFamily: 'Roboto, sans-serif' }}/>
            <Bar name="Количество заявок" dataKey="daysAmount" fill="#0088FE"/>
        </BarChart>
    );
}