import { useRef, useState, useEffect, useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { Link } from 'react-router-dom';

import axios from 'axios';
const LOGIN_URL = '/api/user/login';

const Login = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        console.log(auth)
        if (auth?.user) {
            setSuccess(true);
        } else {
            userRef.current.focus();
        }
    }, [auth])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(LOGIN_URL,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            setAuth({ user, pwd, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <main className="bg-gradient-to-r from-cyan-500 to-blue-800 min-h-screen flex flex-col justify-center items-center px-4 py-2 text-xl text-white">
            {success ? (
                <section className="w-full flex flex-col justify-start p-4 bg-black bg-opacity-40 max-w-md min-h-[400px]">
                    <h1>You are logged in!</h1>
                    <br />
                    <p className="underline">
                        <Link to={{pathname: '/'}}>Go to Home</Link>
                        {/* <a href="#">Go to Home</a> */}
                    </p>
                </section>
            ) : (
                <section className="w-full flex flex-col justify-start p-4 bg-black bg-opacity-40 max-w-md min-h-[400px]">
                    <p ref={errRef} className={errMsg ? "font-bold p-2 mb-2 text-red-500 bg-pink-400" : "absolute -left-[9999px]"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-evenly grow pb-4">
                        <label htmlFor="username" className="mt-4">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            className="rounded-lg p-1 text-black"
                        />

                        <label htmlFor="password" className="mt-4">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            className="rounded-lg p-1 text-black"
                        />

                        <button className="p-2 mt-4 rounded-lg bg-white text-black">Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="inline-block underline">
                            {/*put router link here*/}
                            <Link to={{pathname: '/register'}}>Sign Up</Link>
                            {/* <a href="#">Sign Up</a> */}
                        </span>
                    </p>
                </section>
            )}
        </main>
    )
}

export default Login