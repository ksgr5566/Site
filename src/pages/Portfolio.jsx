import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getToken, getPids } from "../utils/backendCalls";

const Portfolio = () => {

    const [pid, setPid] = useState(null);
    const params = useParams()

    useEffect(() => {
        const getPortfolio = async () => {
            const token = await getToken();
            if (token?.accessToken !== undefined) {
                const { pid_1, pid_2 } = await getPids();
                if (params.id === "a") {
                    setPid(pid_1);
                } else if (params.id === "b") {
                    setPid(pid_2);
                }
            } else {
                alert("You must be logged in to view this page")
                window.location.href = "/"
            }
        }
        getPortfolio()
    })

    return pid ? (
        <>
        <h1 className=' mx-24  m-8 mb-6 text-3xl font-serif'>
            Portfolio: {pid}
        </h1>

        
<div class=" w-5/6 mx-24 p-12 text-center bg-white border rounded-lg shadow-md sm:p-8">
            <div className='flex grid-rows-4'>
                <div className='mx-20 row-span-1 '> 
                    <h1 className='text-2xl font-bold text-gray-900'>Invested amount</h1>
                    <p className='mt-2 text-sm text-gray-600'>100000</p>
                </div>
                <div className='mx-20 row-span-2'>
                    <h1 className='text-2xl font-bold text-gray-900'>Present value</h1>
                    <p className='mt-2 text-sm text-gray-600'>200000</p>
                </div>
                <div className='mx-20 row-span-3'>
                    <h1 className='text-2xl font-bold text-gray-900'>Nifty LTP</h1>
                    <p className='mt-2 text-sm text-gray-600'>190000</p>
                </div>
                 <div className='mx-20 row-span-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Unrealised  P&L</h1>
                    <p className='mt-2 text-sm text-gray-600'>300000</p>      
                </div>
            </div>
</div>

<div className="mx-24 mt-10 flex ">
<button className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Add</button>
 <button className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Edit</button>

</div>

<div className='mx-24'>
    <h1 className='mt-6 text-2xl font-sans'>Holdings</h1>

    <div className='flex flex-col mt-4'>
        <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-sans'>Company</h1>
            <h1 className='text-xl font-sans'>Quantity</h1>
            <h1 className='text-xl font-sans'>Avg. Price</h1>
            <h1 className='text-xl font-sans'>LTP</h1>
            <h1 className='text-xl font-sans'>Unrealised P&L</h1>
        </div>
        <div className='flex flex-row justify-between mt-2'>
            <p className='text-lg font-sans'>Company 1</p>
            <p className='text-lg font-sans'>100</p>
            <p className='text-lg font-sans'>1000</p>
            <p className='text-lg font-sans'>2000</p>
            <p className='text-lg font-sans'>100000</p>
            </div>
        <div className='flex flex-row justify-between mt-2'>
            <p className='text-lg font-sans'>Company 2</p>
            <p className='text-lg font-sans'>100</p>
            <p className='text-lg font-sans'>1000</p>
            <p className='text-lg font-sans'>2000</p>
            <p className='text-lg font-sans'>100000</p>
            </div>
        </div>

</div>

 
       
        </>
    ) : (<></>)
}

export default Portfolio