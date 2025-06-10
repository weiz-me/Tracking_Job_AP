import React, {useState} from 'react';
import styles from '../styles';
import { useNavigate } from 'react-router-dom';
// const API_End = "http://weizproject.ddns.net:5000"
const API_End = "http://localhost:5000";
console.log(API_End)

function Register() {

  const navigate = useNavigate();
  const [name,setname] = useState(null);
  const [email,setemail] = useState(null);
  const [pass,setpass] = useState(null);
  const [reg,setreg] = useState("");
  const handleClick = () => {
    const requestOptions = {
      method:'POST',
      headers:{ 'Content-Type':'application/json'},
      body: JSON.stringify([{"email": `${email}`,"name":`${name}`,"password":`${pass}`}]),
    }
    console.log(requestOptions)
    console.log(`${API_End}/register`)
    fetch(`${API_End}/register`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setreg(data.message)
        });


  }

  return (
    <div className={`${styles.paddingY} flex w-full`}>
      <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
        <div className="background-white lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>
            {/* Username Input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                onChange={(e)=> setname(e.target.value)}
              />
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
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              >
                Register
              </button>
            </div>
            {reg && reg}
            {reg && <div className="mb-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              >
                goto login page
              </button> </div>}

            

  
        </div>
      </div>
    </div>
  );
}

export default Register;
