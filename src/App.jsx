import { useState,useEffect } from 'react'
import './App.css'
import {PortfolioForm} from "./components/PortfolioForm.jsx"
import {getHistoricalDataBySymbol} from "./utils/client.js"
import { toast } from "react-toastify";
import NoData from './components/NoData';
import Results from './components/Results.jsx';
function App() {
  const [formcomplete, setFormComplete] = useState(null);


   const [loading, setLoading] = useState(true);
  const [formdata, setFormData] = useState({});
  const [filteredRange, setFilteredRange] = useState(null);

 useEffect(() => {
    // if not an empty object, set formcomplete to true
    if (Object.keys(formdata).length !== 0) {
      // makeDoc();
      setFormComplete(true);
    }

    // async function makeDoc() {
    //   const userUid = user.uid;
    //   const parentDocRef = doc(db, "data", userUid);
    //   const questCollectionRef = collection(parentDocRef, "searches");
    //   await addDoc(questCollectionRef, {
    //     ...formdata,
    //     timestamp: serverTimestamp(),
    //   });
    // }
  }, [formdata]);
  useEffect(() => {
    if (formcomplete) {
      const startDate = new Date(formdata.start);
      const endDate = new Date(formdata.finish);
      let dataResults = {};

      const processData = async () => {
        await Promise.all(
          formdata.allocation.map(async (alloc, index) => {
            const allocBalance = formdata.balance * (alloc.weight / 100);
            const data = await getHistoricalDataBySymbol(alloc.symbol);
            // if data holds a key titled "Note", then there was an error, and alert to user "API is exhausted, please try again in a minute"
            if (data["Note"]) {
              toast.error("API is exhausted, please try again in a minute.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
              });
              return;
            } else {
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
                    sharesondayone:
                      (formdata.balance * (alloc.weight / 100)) /
                      result[0].close,
                  };
                }
              } else {
                toast.error("Something went wrong! Try again.", {
                  position: toast.POSITION.TOP_CENTER,
                  theme: "colored",
                });
              }
            }
          })
        );
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

  console.log(formdata)
  return (
    <div className='container mx-auto ' >
     <PortfolioForm setFormData={setFormData} />
     {loading?<NoData/>: <Results filteredRange={filteredRange} balance={formdata.balance}/>}
    </div>
  )
}

export default App
