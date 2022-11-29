import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken, getPids, getItems, getSellQuantity, getBuyOrders } from "../utils/backendCalls";
import axios from "axios";
import Loading from "../components/Loading";

const Portfolio = () => {
  const [pid, setPid] = useState(null);
  const params = useParams();

  const [addpopup, setAddpopup] = useState(false);

  const [addticker, setAddticker] = useState("");
  const [addquantity, setAddquantity] = useState(1);

  const [items, setItems] = useState({});

  const [loading, setLoading] = useState(false);

  const [investedamount, setInvestedamount] = useState(0);
  const [niftyltp, setNiftyltp] = useState(0);
  const [presentvalue, setPresentvalue] = useState(0);

  const ITEM_URL = "/api/item";

  useEffect(() => {
    const getPortfolio = async () => {
      let token = await getToken();
      if (token?.accessToken !== undefined) {
        const { pid_1, pid_2 } = await getPids();
        if (params.id === "a") {
          setPid(pid_1);
        } else if (params.id === "b") {
          setPid(pid_2);
        } else {
          alert("Wrong URL!");
          window.location.href = "/";
        }
      } else {
        alert("You must be logged in to view this page");
        window.location.href = "/";
      }
    };
    getPortfolio();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (pid !== null) {
        let x = 0
        let y = 0
        setLoading(true);
        setInvestedamount(0)
        setPresentvalue(0)
        const response = await getItems(pid);
        const conversionData = await axios.get("/api/stock?ticker=INR=X");
        const niftyData = await axios.get("/api/stock?ticker=^NSEI");
        setNiftyltp(niftyData.data.price);
        const cr = conversionData.data.price;
        for (const key in response) {
          const tick = response[key].ticker;
          const tickerData = await axios.get(`/api/stock?ticker=${tick}`);
          let { price, currency } = tickerData.data;
          if (currency === "USD") {
            price = parseFloat(price) * parseFloat(cr);
          }
          response[key].ltp = price;
          x += response[key].value;
          y += response[key].quantity * price

          let sellquantity = await getSellQuantity(pid, tick)
          
          if (sellquantity == null) {
            sellquantity = 0
          }

          const buyorders = await getBuyOrders(pid, tick)
          console.log(buyorders)

          let buyval = 0
          let buyquan = 0
          for (const buykey in buyorders) {
            let quan = buyorders[buykey].quantity
            const val = buyorders[buykey].value
            const priceofBuy = val / quan
            console.log(quan, val)
            if (sellquantity + quan > 0) {
              let temp = quan
              quan = quan + sellquantity
              sellquantity = sellquantity + temp
              buyquan += quan
              buyval += quan*priceofBuy
            } else if (sellquantity == 0-quan) {
              sellquantity = 0
              continue
            } else if (sellquantity + quan < 0) {
              sellquantity += quan
              continue
            }
          }
          response[key].buyavg = buyval / buyquan

          console.log(response[key].buyavg)
          console.log(response[key].ltp)

          response[key].upl = response[key].quantity * (response[key].ltp - response[key].buyavg)
        }
        setInvestedamount(x);
        setPresentvalue(y);
        setItems(response);
      }
      setLoading(false);
    }
    loadData()
  }, [pid]);

  function setBack() {
    setAddticker("");
    setAddquantity(1);
    setAddpopup(false);
    setLoading(false);
  }

  function cancelAdd(e) {
    e.preventDefault();
    setBack();
  }

  async function addItem(e) {
    setLoading(true);
    e.preventDefault();

    const ticker = addticker;
    const quantity = addquantity;

    let maximum = 0
    for (const key in items) {
      if (items[key].ticker === ticker) {
        maximum = items[key].quantity
      }
    }

    if (Math.round(quantity) !== parseInt(quantity) || quantity < 0-maximum) {
      alert("Please enter a valid integral quantity!!");
      setBack();
      return;
    }

    let tickerData, conversionData;
    try {
      tickerData = await axios.get(`/api/stock?ticker=${ticker}`);
      conversionData = await axios.get(`/api/stock?ticker=INR=X`);
    } catch (e) {
      console.log(e);
      alert("Please enter a valid YahooFinance ticker!!");
      setBack();
      return;
    }

    try {
      const { price, currency } = tickerData.data;
      const cr = conversionData.data.price;
      const token = await getToken();
      const accessToken = token.accessToken;
      const response = await axios.post(
        ITEM_URL,
        JSON.stringify({
          ticker: ticker,
          quantity: quantity,
          value: price,
          currency: currency,
          conversionRate: cr,
          pid: pid,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      window.location.reload();
    } catch (e) {
      alert("Unable to save to server!! Try again.");
    }
    setBack();
  }

  return pid ? (
    <>
      {loading && <Loading />}
      {addpopup && !loading && (
        <div className="grid h-screen place-items-center bg-black">
          <form className="w-full max-w-sm">
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="ticker"
                >
                  Ticker
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  onChange={(e) => setAddticker(e.target.value)}
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="ticker"
                  type="text"
                  value={addticker}
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="quantity"
                >
                  Quantity
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  onChange={(e) => setAddquantity(e.target.value)}
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="quantity"
                  type="number"
                  step="1"
                  value={addquantity}
                />
              </div>
            </div>

            <div className="md:flex md:items-center">
              <div className="md:w-1/2 flex flex-col items-center">
                <button
                  onClick={addItem}
                  className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Submit
                </button>
              </div>
              <div className="md:w-1/2 flex flex-col items-center">
                <button
                  className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  onClick={cancelAdd}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!addpopup && !loading && (
        <>
          <div className="w-5/6 mx-auto p-12 text-center bg-white border rounded-lg shadow-md sm:p-8 mt-8">
            <div className="flex grid-rows-4 overflow-x-auto">
              <div className="mx-10 sm:mx-20 row-span-1 ">
                <h1 className="text-2xl font-bold text-gray-900">
                  Invested amount
                </h1>
                <p className="mt-2 text-sm text-gray-600">{Math.round(investedamount)}</p>
              </div>
              <div className="mx-10 sm:mx-20 row-span-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Present value
                </h1>
                <p className="mt-2 text-sm text-gray-600">{Math.round(presentvalue)}</p>
              </div>
              <div className="mx-10 sm:mx-20 row-span-3">
                <h1 className="text-2xl font-bold text-gray-900">Nifty LTP</h1>
                <p className="mt-2 text-sm text-gray-600">{niftyltp}</p>
              </div>
              <div className="mx-10 sm:mx-20 row-span-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Unrealised P&L
                </h1>
                <p
                  className={
                    "mt-2 text-sm text-gray-600" +
                      (presentvalue -
                      investedamount >
                    0)
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {Math.round(presentvalue - investedamount)}
                </p>
              </div>
            </div>
          </div>
          <div className="w-5/6 mx-auto mt-10 flex ">
            <button
              onClick={() => setAddpopup(true)}
              className="text-white w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            >
              Edit
            </button>
          </div>
          {Object.keys(items).length === 0 ? (
            <h1 className="text-center mt-6 text-xl font-bold">
              Nothing in your portfolio!!
            </h1>
          ) : (
            <div className="m-4 sm:m-10 border-2 p-4 w-auto select-none">
              <h1 className="mt-6 mb-2 text-2xl font-sans font-bold">Holdings</h1>

              <table className="block overflow-x-auto">
                
                <tr className="sm:grid sm:grid-cols-5 sm:justify-items-stretch sm:m-4 sm:min-w-fit"> 
                  <th className="text-xl font-sans text-center px-4 sm:px-0">Company</th> 
                  <th className="text-xl font-sans text-center px-4 sm:px-0">Quantity</th> 
                  <th className="text-xl font-sans text-center px-4 sm:px-0">Avg. Price</th> 
                  <th className="text-xl font-sans text-center px-4 sm:px-0">LTP</th> 
                  <th className="text-xl font-sans text-center px-4 sm:px-0">Unrealised P&L</th> 
                </tr>
              
                
                {Object.keys(items).map((item, index) => (
                  <tr
                    className="sm:grid sm:grid-cols-5 sm:justify-items-stretch sm:m-4 sm:min-w-fit" 
                    key={index}
                  > 
                    <td className="text-lg font-sans text-center px-4 sm:px-0">{items[item].ticker}</td>
                    <td className="text-lg font-sans text-center px-4 sm:px-0">{items[item].quantity}</td>
                    <td className="text-lg font-sans text-center px-4 sm:px-0">{items[item].buyavg.toFixed(2)}</td>
                    <td className="text-lg font-sans text-center px-4 sm:px-0">{items[item].ltp.toFixed(2)}</td>
                    <td className={"text-lg font-sans px-4 text-center sm:px-0"  /*+ items[item].upl > 0 ? "text-green-500" : "text-red-600"*/}>{items[item].upl.toFixed(2)}</td>
                  </tr>
                ))}
                
              </table>
            </div>
          )}
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default Portfolio;
