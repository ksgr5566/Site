import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

import axios from 'axios';

import Button from './Button'

const DropdownButton = () => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const [fname, setFname] = useState('')

  const { setAuth } = useContext(AuthContext);

  const ref = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  

  async function logout() {
    try {
        await axios.put('/api/user/logout', { withCredentials: true })
        setAuth({})
        navigate("/")
    } catch (err) {
        console.log(err);
    }
  }

return (
  <div ref={ref}>
  <button
                href="#"
                className="bg-primary hover:bg-blue-800 rounded-full text-center inline-flex items-center px-6 py-2"
                onClick={() => setOpen(!open)}
              >
                {fname}
                <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {open && 
              <div
              className="right-0 p-2 mt-1 bg-white rounded-md shadow lg:absolute flex flex-col"
            >
              <ul className="space-y-2 lg:w-48">
                {/* <li>
                  <Link
                    to="#"
                    className="flex p-2 text-l font-sans text-gray-600 rounded-md  hover:bg-gray-100 hover:text-black"
                    >My Profile</Link>
                </li>
                <li>
                  <Link to="#"
                    className="flex p-2 text-l font-sans text-gray-600 rounded-md  hover:bg-gray-100 hover:text-black"
                    >Inventories</Link>
                </li> */}
                <li>
                  <Button text="Logout" onClick={logout} />
                </li>
              </ul>
            </div>
              }
              
  </div>
)
}

export default DropdownButton