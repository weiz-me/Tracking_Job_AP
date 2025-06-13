import React, {useState, useEffect} from 'react';
import styles from '../styles';
import { useNavigate } from 'react-router-dom';
// const API_End = "http://weizproject.ddns.net:5000"
const API_End = "http://localhost:5000";
let count = 1;

function Login() {

  const [email,setemail] = useState(null);
  const [pass,setpass] = useState(null);
  const [reg,setreg] = useState("");
  const navigate = useNavigate();
  const [login,setlogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('track_job_token');

    if (token) {
      const requestOptions = {
        method:'POST',
        headers:{ 'Content-Type':'application/json'},
        body: JSON.stringify({"token": `${token}`}),
      }

      fetch(`${API_End}/token`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message) {
              setlogin(true)
            }else{
              setlogin(false)
            }
          });
    } else {
      setlogin(false); // no token → user is not logged in
    }
  }, []);

  const handleClick = () => {
    const requestOptions = {
      method:'POST',
      headers:{ 'Content-Type':'application/json'},
      body: JSON.stringify({"email": `${email}`,"password":`${pass}`}),
    }
    console.log(requestOptions)
    console.log(`${API_End}/login`)
    fetch(`${API_End}/login`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.refreshToken) {
            localStorage.setItem('track_job_token', data.refreshToken);
            localStorage.setItem('track_job_email', email);
            localStorage.setItem('track_job_user_id', data.user_id);
            console.log("user_id",data.user_id)
            setreg('log in succuessful')
            navigate('/')
          }else{
            setreg(`try again x${count}`)
            count +=1;
          }
        });


  }

  return (
    <div className={`${styles.paddingY} flex w-full`}>
      <div className="bg-gray-100 flex justify-center items-center h-screen w-full">

        <div className="background-white lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
          {!login && (
            <>

            <h1 className="text-2xl font-semibold mb-4">Account</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                onChange={(e)=> setemail(e.target.value)}
              />
              <label htmlFor="password" className="block text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                onChange={(e)=> setpass(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              >
                Log in
              </button>
            </div>
            {reg && reg}

            <hr className="my-6 border-black" />

            

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            onClick={() => navigate('/register')}
          >
            Register New Email
          </button>
          </>
          )
          }
          {login && (
            <>
            <h1 className="text-2xl font-semibold mb-4">You Already Login</h1>
            <button
            type="submit"
            className="bg-blue-500 hover:bg-red-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            onClick={() => navigate('/')}
          >
            Go to Home Page
          </button>
            </>
          )}
  
        </div>
      </div>
    </div>
  );
}

export default Login;
