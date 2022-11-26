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
        <h1>
            Portfolio: {pid}
        </h1>
    ) : (<></>)
}

export default Portfolio