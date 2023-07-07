
const ProfitsBoard = ({ data }) => {
    return (
      <div className="grid bg-teal-50 p-8 md:col-span-2 col-span-full">
        {Object.entries(data).map(([key, value]) => {
          const tempnum = (Math.round(value.sharesondayone * value.data.slice(-1)[0].close * 100) / 100).toFixed(2);
          return (
            <div key={key}>
              <p className="text-4xl mb-2">Allocation: {key}</p>
              <p className="text-base">
                Initial balance: ${value.initialBalance}
              </p>
              <p className="text-base">
                Number of shares: {value.sharesondayone.toFixed(2)}
              </p>
              <p className="text-base">
                Today's Gain: <span style={{color: parseFloat(tempnum) >= parseFloat(value.initialBalance) ? 'green' : 'red'}}>${tempnum}</span>
              </p>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default ProfitsBoard;
  