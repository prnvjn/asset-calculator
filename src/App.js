import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './App.css';
import { PortfolioForm } from "../src/components/PortfolioForm.tsx";
import { getHistoricalDataBySymbol } from "./utils/client.ts";
import { toast } from "react-toastify";
import NoData from './components/NoData.tsx';
import Results from './components/Results.tsx';
function App() {
    const [formcomplete, setFormComplete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formdata, setFormData] = useState({});
    const [filteredRange, setFilteredRange] = useState(null);
    useEffect(() => {
        // if not an empty object, set formcomplete to true
        if (Object.keys(formdata).length !== 0) {
     
            setFormComplete(true);
        }
     
    }, [formdata]);
    useEffect(() => {
        if (formcomplete) {
            const startDate = new Date(formdata.start);
            const endDate = new Date(formdata.finish);
            let dataResults = {};
            const processData = async () => {
                await Promise.all(formdata.allocation.map(async (alloc, index) => {
                    const allocBalance = formdata.balance * (alloc.weight / 100);
                    const data = await getHistoricalDataBySymbol(alloc.symbol);
                    if (data["Note"]) {
                        toast.error("API is exhausted, please try again in a minute.", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: "colored",
                        });
                        return;
                    }
                    else {
                        const filteredData = Object.entries(data)
                            .filter(([key, _]) => {
                            const keyasdate = new Date(key);
                            return keyasdate >= startDate && keyasdate <= endDate;
                        })
                            .reverse();
                        // each entry in filteredData is a new date
                        const result = filteredData.map((newdate) => {
                            return {
                                date: newdate[0],
                                close: parseFloat(newdate[1]["4. close"]),
                                adjusted_close: parseFloat(newdate[1]["5. adjusted close"]),
                            };
                        });
                        if (result) {
                            if (!dataResults[alloc.symbol]) {
                                dataResults[alloc.symbol] = {
                                    initialBalance: parseFloat(allocBalance.toFixed(2)),
                                    initialDate: startDate,
                                    weight: alloc.weight,
                                    data: result,
                                    sharesondayone: (formdata.balance * (alloc.weight / 100)) /
                                        result[0].close,
                                };
                            }
                        }
                        else {
                            toast.error("Something went wrong! Try again.", {
                                position: toast.POSITION.TOP_CENTER,
                                theme: "colored",
                            });
                        }
                    }
                }));
                return dataResults;
            };
            processData().then((result) => {
                if (result) {
                    setFilteredRange(result);
                }
            });
        }
    }, [formcomplete]);
    useEffect(() => {
        if (filteredRange) {
            setLoading(false);
            // navigate("/results", { state: { filteredRange } });
        }
    }, [filteredRange]);
    console.log(formdata);
    return (_jsxs("div", { className: 'container mx-auto ', children: [_jsx(PortfolioForm, { setFormData: setFormData }), loading ? _jsx(NoData, {}) : _jsx(Results, { filteredRange: filteredRange, balance: formdata.balance })] }));
}
export default App;
