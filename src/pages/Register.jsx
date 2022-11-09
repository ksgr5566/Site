import { useRef, useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../contexts/AuthContext";
import axios from 'axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/api/user/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const { auth } = useContext(AuthContext);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [lname, setLname] = useState('');
    const [fname, setFname] = useState('');

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
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username: user, password: pwd, firstname: fname, lastname: lname }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // TODO: remove console.logs before deployment
            // console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setFname('')
            setLname('')
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <main className="bg-gradient-to-r from-cyan-500 to-blue-800 min-h-screen flex flex-col justify-center items-center px-4 py-2 text-xl text-white">
            {success ? (
                <section className="w-full flex flex-col justify-start p-4 bg-black bg-opacity-60 max-w-md min-h-[400px]">
                    <h1>Success!</h1>
                    <p className="underline">
                        <Link to={{pathname: '/login'}}>Sign In</Link>
                        {/* <a href="#">Sign In</a> */}
                    </p>
                </section>
            ) : (
                <section className="w-full flex flex-col justify-start p-4 bg-black bg-opacity-40 max-w-md min-h-[400px]">
                    <p ref={errRef} className={errMsg ? "font-bold p-2 mb-2 text-red-500 bg-pink-400" : "absolute -left-[9999px]"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-evenly grow pb-4">

                        <label htmlFor="fname" className="mt-4">First Name:</label>
                        <input
                            type="text"
                            id="fname"
                            autoComplete="off"
                            onChange={(e) => setFname(e.target.value)}
                            value={fname}
                            required
                            className="rounded-lg p-1 text-black"
                        />

                        <label htmlFor="lname" className="mt-4">Last Name:</label>
                        <input
                            type="text"
                            id="lname"
                            autoComplete="off"
                            onChange={(e) => setLname(e.target.value)}
                            value={lname}
                            required
                            className="rounded-lg p-1 text-black"
                        />

                        <label htmlFor="username" className="mt-4">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "ml-1 text-green-500" : "hidden"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hidden" : "ml-1 text-red-500"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            className="rounded-lg p-1 text-black"
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "text-white text-xs bg-black rounded-lg relative -bottom-[10px] p-1" : "absolute -left-[9999px]"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="password" className="mt-4">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "ml-1 text-green-500" : "hidden"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hidden" : "ml-1 text-red-500"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            className="rounded-lg p-1 text-black"
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "text-white text-xs bg-black rounded-lg relative -bottom-[10px] p-1" : "absolute -left-[9999px]"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd" className="mt-4">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "ml-1 text-green-500" : "hidden"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hidden" : "ml-1 text-red-500"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            className="rounded-lg p-1 text-black"
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "text-white text-xs bg-black rounded-lg relative -bottom-[10px] p-1" : "absolute -left-[9999px]"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button className="p-2 mt-4 rounded-lg bg-white text-black" disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="inline-block underline">
                            {/*put router link here*/}
                            <Link to={{pathname: '/login'}}>Sign In</Link>
                            {/* <a href="#">Sign In</a> */}
                        </span>
                    </p>
                </section>
            )}
        </main>
    )
}

export default Register