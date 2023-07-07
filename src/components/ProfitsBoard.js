import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const ProfitsBoard = ({ data }) => {
    return (_jsx("div", { className: "grid bg-teal-50 p-8 md:col-span-2 col-span-full", children: Object.entries(data).map(([key, value]) => {
            const tempnum = (Math.round(value.sharesondayone * value.data.slice(-1)[0].close * 100) / 100).toFixed(2);
            return (_jsxs("div", { children: [_jsxs("p", { className: "text-4xl mb-2", children: ["Allocation: ", key] }), _jsxs("p", { className: "text-base", children: ["Initial balance: $", value.initialBalance] }), _jsxs("p", { className: "text-base", children: ["Number of shares: ", value.sharesondayone.toFixed(2)] }), _jsxs("p", { className: "text-base", children: ["Today's Gain: ", _jsxs("span", { style: { color: parseFloat(tempnum) >= parseFloat(value.initialBalance) ? 'green' : 'red' }, children: ["$", tempnum] })] })] }, key));
        }) }));
};
export default ProfitsBoard;
