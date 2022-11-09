import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from "../contexts/AuthContext";

import axios from 'axios';

const DropdownButton = () => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const [fname, setFname] = useState('')

  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    async function getDetails() {
        try {
            const res = await axios.get('/api/user/refresh', { withCredentials: true })
            const { accessToken } = res.data
            const response = await axios.get('/api/user', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            const fname = response.data[0].first_name
            setFname(fname)
        } catch (err) {
            console.log(err);
        }
    }
    getDetails()
  }, [fname])
  

  async function logout() {
    try {
        await axios.put('/api/user/logout', { withCredentials: true })
        setAuth({})
    } catch (err) {
        console.log(err);
    }
  }

  return (
    <>
      <div className="text-left">
          <button 
            type="button"
            onClick={() => setOpen(!open)}
            className="bg-primary hover:bg-blue-800 rounded-full text-center inline-flex items-center px-6 py-2"
          >
            {fname}
            <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        {open && 
          <div className="block md:fixed md:right-10 w-40 h-32 bg-white mt-2">
        <ul aria-labelledby="dropdownDefault" className="py-1 text-sm text-black rounded">
            <li className='block py-2 px-4 hover:bg-gray-600' onClick={() => navigate("/profile")}>Profile</li>
            <li className='block py-2 px-4 hover:bg-gray-600' onClick={() => navigate("/mytools")}>My Tools</li>
            <li className='block py-2 px-4 hover:bg-gray-600' onClick={logout}>Sign out</li>
        </ul>

        </div>
          }


</>

  )
}

export default DropdownButton