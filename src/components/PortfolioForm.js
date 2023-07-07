import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, forwardRef, useRef, } from "react";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stockInfo } from "../utils/stocks.js";
export const PortfolioForm = ({ setFormData }) => {
    const [queryresults, setQueryResults] = useState(null);
    const [addStock, setAddstock] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [suggestedValues, setSuggestedValues] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const calendarRef = useRef(null);
    const [dataobj, setDataobj] = useState({
        balance: 0,
        start: "",
        finish: "",
        allocation: [],
    });
    // looks for suggested stock options
    const handleTicker = async (event) => {
        const value = event.target.value;
        setInputValue(value);
        const data = filterStocks(value);
        setSuggestedValues(data);
    };
    // toggle add more stocks input
    const addStockButton = () => {
        setAddstock(!addStock);
    };
    const filterStocks = (input) => {
        if (input.toLowerCase() !== "") {
            let filteredStocks = stockInfo.filter((stock) => {
                if (stock.symbol.toLowerCase().includes(input) ||
                    stock.name.toLowerCase().includes(input)) {
                    return true;
                }
                else {
                    return false;
                }
            });
            return filteredStocks;
        }
        else {
            return [];
        }
    };
    // adds and remove stock from the list
    const handleOptionToggle = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        }
        else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    const CustomStartInput = forwardRef(({ value, onClick }, ref) => (_jsx("button", { type: "button", id: "datepick", className: "buttons", onClick: onClick, ref: ref, children: value ? value : "Select a start date" })));
    const CustomFinishInput = forwardRef(({ value, onClick }, ref) => (_jsx("button", { type: "button", id: "datepick", className: "buttons", onClick: onClick, ref: ref, children: value ? value : "Select a finish date" })));
    const getStartDate = () => {
        const today = new Date();
        return today.setDate(today.getDate() - 1);
    };
    const getFinishDate = () => {
        const today = new Date();
        return today.setDate(today.getDate());
    };
    const submitfunc = (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        toast.success("Checking history and calculating portfolio.", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored",
        });
        setFormData({
            ...dataobj,
            start: new Date(dataobj.start).toISOString().substring(0, 10),
            finish: new Date(dataobj.finish).toISOString().substring(0, 10),
        });
    };
    const validateForm = () => {
        if (dataobj.balance === 0 || dataobj.balance === undefined) {
            toast.error("Please enter an initial balance.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        if (dataobj.start === "") {
            toast.error("Please enter a start date.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        if (dataobj.finish === "") {
            toast.error("Please enter an end date.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        if (dataobj.allocation.length === 0) {
            toast.error("Please enter at least one stock for the portfolio and its weight.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        if (dataobj.allocation.length > 5) {
            toast.error("Please enter at less than 5 stocks for the portfolio.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        const sumValues = dataobj.allocation.reduce((a, b) => parseInt(a) + parseInt(b.weight), 0);
        if (sumValues !== 100) {
            toast.error("Weights in your allocations do not add up to 100%", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }
        return true;
    };
    return (_jsxs("form", { id: "portfolioform", className: "flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg py-12 bg-teal-400 shadow-xl  ", onSubmit: (e) => submitfunc(e), children: [_jsx("input", { className: "my-3 w-96 text-center px-4 py-2 rounded-lg text-teal-700", type: "number", name: "", id: "", required: true, placeholder: "Enter your starting balance", value: dataobj.balance != 0 ? dataobj.balance : "", onChange: (event) => setDataobj({
                    ...dataobj,
                    balance: parseFloat(event.target.value),
                }) }), _jsx("ul", { children: selectedOptions.map((stock) => (_jsxs("li", { className: "flex justify-between font-medium  items-center max-h-96 w-80 my-3", children: [_jsx("input", { type: "checkbox", className: "w-7 h-7", checked: selectedOptions.includes(stock), onChange: () => handleOptionToggle(stock), htmlFor: stock }), _jsx("label", { htmlFor: stock, className: " ", children: stock }), _jsx("input", { type: "number", className: "  text-center px-4 py-2 rounded-lg text-teal-700 ", htmlFor: stock, max: "100", min: "0", placeholder: "Allocation", onChange: (event) => {
                                const newAllocation = dataobj.allocation.filter((item) => item.symbol !== stock);
                                setDataobj({
                                    ...dataobj,
                                    allocation: [
                                        ...newAllocation,
                                        { symbol: stock, weight: parseFloat(event.target.value) },
                                    ],
                                });
                            } })] }, stock))) }), !addStock && (_jsx("input", { type: "text", className: "my-3 w-96 text-center px-4 py-2 rounded-lg text-teal-700", value: inputValue, placeholder: "Enter your favorite Stonks", onChange: handleTicker })), inputValue.length !== 0 &&
                _jsx("ul", { className: "max-h-96 w-80\toverflow-y-scroll drop-shadow-md rounded-m p-2", children: suggestedValues.map((value, index) => (_jsx("li", { className: " bg-blue-50 text-m m-2 text-left p-1 rounded-md ", children: _jsxs("label", { className: "flex justify-between font-medium items-center gradientText", children: [value.symbol, _jsx("input", { type: "checkbox", className: " w-7 h-7", checked: selectedOptions.includes(value.symbol), onChange: () => {
                                        handleOptionToggle(value.symbol);
                                        addStockButton();
                                        setInputValue("");
                                    } })] }) }, index))) }), _jsxs("div", { className: ' text-md flex justify-between w-80 items-center p-2', children: [_jsxs("span", { id: "addstocks", children: ["Add stocks ", selectedOptions.length, "/5 "] }), _jsx("span", { onClick: addStockButton, id: 'plusbutton', children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-9 h-9", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }) })] }), _jsx(ReactDatePicker, { className: "w-10 ", selected: dataobj.start, onChange: (date) => setDataobj({ ...dataobj, start: date }), customInput: _jsx(CustomStartInput, {}), popperPlacement: "bottom", maxDate: getStartDate(), peekNextMonth: true, showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select" }), _jsx(ReactDatePicker, { className: "w-10 ", selected: dataobj.finish, onChange: (date) => setDataobj({ ...dataobj, finish: date }), customInput: _jsx(CustomFinishInput, {}), popperPlacement: "bottom", maxDate: getFinishDate(), peekNextMonth: true, showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select" }), _jsx("input", { type: "submit", value: "Check History", className: "buttons bg-white py-2 px-4 rounded-lg text-teal-700 font-bold text-lg mt-4" })] }));
};
