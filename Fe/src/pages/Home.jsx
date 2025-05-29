import React,{useState, useEffect} from 'react';
import styles from '../styles';
import { useNavigate } from 'react-router-dom';
const API_End = "http://weizproject.ddns.net:5000";

function Home() {
  const [login,setlogin] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('track_job_email');
  const token = localStorage.getItem('track_job_token');

  console.log("token: ",token)
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
  }, []); // run once when the component mounts
const handleLogout = () => {
  const token = localStorage.getItem('track_job_token');

  if (!token) {
    console.warn('No token found in localStorage.');
    return;
  }

  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ token }), // optional if backend needs it
  };

fetch(`${API_End}/logout`, requestOptions)
  .then(response => {
    if (!response.ok) {
      // Try to read plain text if not JSON
      return response.text().then(text => {
        throw new Error(`Logout failed: ${text}`);
      });
    }
    setlogin(false);
    
    localStorage.removeItem('track_job_token');
    localStorage.removeItem('track_job_email');
    navigate('/'); // optional

  });
};

  return (
    <div className={`${styles.paddingY} flex w-full`}>
      <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
        {/* Left: Image */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="../cover.jpg"
            alt="Placeholder"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right: Login Form */}
        <div className="background-white lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
          {!login && (
            <>
              <h1 className="text-2xl font-semibold mb-4">Login to continue</h1>

              <div className="mb-4">
                <button
                  onClick={() => navigate('/login')}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                >
                  Email Login
                </button>
              </div>

              <hr className="my-6 border-black" />

              <div className="mb-4">
                <button
                  onClick={() => navigate('/register')}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                >
                  Email Register
                </button>
              </div>
            </>
          )}
          {login && (
            <>
              <h1 className="text-2xl font-semibold mb-4">Hi, {email}</h1>
              <label htmlFor="username" className="block text-gray-600">You are logged in.</label>

              <div className="mb-4">
                <button
                  onClick={handleLogout}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

            

  
      </div>
    </div>
  );
}

export default Home;
