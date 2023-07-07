import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, Label,ResponsiveContainer } from 'recharts';
import ProfitsBoard from "./ProfitsBoard";
// import "../assets/css/results.css";

export default function Results({filteredRange,balance}) {
 
  const givendata = filteredRange;
  const [data, setData] = useState([]);
  const [piechartdata, setPieChartData] = useState([]);
  const [totalprofit, setTotalProfit] = useState(0.00);
  // console.log("givendata: ", givendata);
    const Piecolors =['#f87171','#f97316','#06b6d4','#3b82f6',"#3b82f6","#a855f7"]
  useEffect(() => {
    const effectdata = [];
    for (const stockname in givendata) {
      if (Object.hasOwnProperty.call(givendata, stockname)) {
        const stockData = givendata[stockname].data.map((entry) => {
          const splitDate = entry.date.split("-");
          // if the date already exists in the data array, add the new stock's value to the existing date
          // else, add a new date to the data array
          const date = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;
          const existingIndex = effectdata.findIndex(
            (obj) => obj.date === date
          );
          if (existingIndex !== -1) {
            effectdata[existingIndex][stockname] = parseFloat(
              (
                Math.round(
                  givendata[stockname].sharesondayone * entry.close * 100
                ) / 100
              ).toFixed(2)
            );
            // console.log("data now at index: ", existingIndex, " is: ", effectdata[existingIndex])
            return;
          }
          // console.log("stockname is:", stockname, "and existingIndex is: ", existingIndex);
          return {
            // convert from YYYY-MM-DD to MM-DD-YYYY
            date: `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`,
            // round to 2 decimal places and include extra 0s if needed to represent cents
            [stockname]: parseFloat(
              (
                Math.round(
                  givendata[stockname].sharesondayone * entry.close * 100
                ) / 100
              ).toFixed(2)
            ),
          };
        });
        
        effectdata.push(...stockData.filter((val) => val !== undefined));
      }
    }
    // console.log("data: ", effectdata);
    
    // iterate through the effectdata, and if there is no value for any of the stocks at that date, just add the key as the stockname, and the value as 0
    for (let i = 0; i < effectdata.length; i++) {
      const element = effectdata[i];
      for (const stockname in givendata) {
        if (Object.hasOwnProperty.call(givendata, stockname)) {
          if (!element[stockname]) {
            element[stockname] = 0;
          }
        }
      }
    }
    // console.log("effectdata after push: ", effectdata)
    
    setTotalProfit(getTotalProfit());
    setPieChartData(getPieChartData());
    setData(effectdata);
    // console.log("pie chart data: ", getPieChartData());
  }, []);

  // useEffect(() => {
  //   console.log("data just set to: ", data);
  // }, [data]);

  const getPieChartData = () => {
    const chartdata = [];
    Object.entries(givendata).forEach(([key, val]) => {
      const obj = {
        name: key,
        value: val.weight,
      };
      chartdata.push(obj);
    });

    return chartdata;
  };

  const getTotalProfit = () => {
    let totalProfit = 0.0;
    Object.entries(givendata).forEach(([key, val]) => {
      // console.log(val.sharesondayone);
      totalProfit += (Math.round(val.sharesondayone * val.data.slice(-1)[0].close * 100) / 100);
    });
    
    return totalProfit.toFixed(2);
  };

  // math stuff for pie chart
  const RADIAN = Math.PI / 180;

  return (
    <div className="grid grid-cols-3 gap-4	" >
    
      
      {totalprofit !== 0.00 && 
        <h1 className="text-3xl mt-4 bg-teal-50 shadow-md col-span-full		rounded-lg px-6 pt-5 py-3">Total Profit: &nbsp;
          <span style={{color: parseFloat(totalprofit) >= parseFloat(balance) ? 'green' : 'red'}}>
          ${parseFloat(totalprofit).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          </span>
        </h1>
      }


        <ProfitsBoard data={givendata} />
        <div  className="bg-teal-50 shadow-md rounded-lg py-4 flex justify-center items-center md:row-span-1 md:col-start-3 md:col-end-4 col-span-3">
          {piechartdata.length > 0 && ( 
          
              <div className=" " >
                    <ResponsiveContainer width={200}height={200}>
                        <PieChart  >
                          <Pie
                            data={piechartdata}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            fill="#8884d8"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="value"
                            label={({
                              cx,
                              cy,
                              midAngle,
                              innerRadius,
                              outerRadius,
                              percent,
                            
                            }) => {
                              const radius =
                                innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="middle">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                              );
                            }}
                          >
                            {piechartdata.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={Piecolors[index]}
                              />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" height={36} />
                          <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
          )}
        </div>
  
      {Object.keys(data).length > 0 && (
        <div className="bg-teal-50 shadow-md rounded-lg col-span-full flex justify-center items-center">
            <LineChart
              width={700}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 50,
                left: 40,
                bottom: 5,
              }}
              
            >
              <XAxis dataKey="date" tick={{ fill: 'black' }} />
              <YAxis tick={{ fill: 'black' }}>
              <Label
                value="Prices"
                position="insideLeft"
                angle={0}
                style={{ textAnchor: 'middle', fill: 'black' }}
                offset={-10}
              />
              </YAxis>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend height={24} />
                {/* Render Line components for each stock dynamically */}
                {Object.keys(data[0])
                  .filter((key) => key !== 'date')
                  .map((entry, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={entry}
                      stroke={Piecolors[index]}
                      activeDot={{ r: 10 }}
                    />
                ))}
            </LineChart>
        </div>
      )}
    </div>
  );
}
