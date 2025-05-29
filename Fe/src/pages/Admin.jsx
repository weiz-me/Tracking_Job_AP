import React, { useState, useEffect } from 'react';
import styles from '../styles';
import DataTable from '../components/Table';

const API_End = "http://weizproject.ddns.net:5000";

function Admin() {
  const [utoggle,setutoggle] = useState(false);
  const [jtoggle,setjtoggle] = useState(false);
  const [userData, setUserData] = useState(null);
  const [jobData,setJobData] = useState(null);
  const [sqlquery,setsqlquery] = useState("");
  const [sqldata,setsqldata] = useState("");
  const [sqltoggle,setsqltoggle] = useState(false);

  const [login,setlogin] = useState(false);
  
  const handleut = () => {
    setutoggle(!utoggle);
  };
  const handlejt = () => {
    setjtoggle(!jtoggle);
  };

useEffect(() => {
  async function validateAndFetch() {
    const token = localStorage.getItem('track_job_token');
    const user_id = localStorage.getItem('track_job_user_id');
    console.log("userid",user_id)
    if (!token) {
      setlogin(false);
      return;
    }
    if (user_id !== "1") {
      setlogin(false);
      return;
    }

    // Validate token
    try {
      const res = await fetch(`${API_End}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!data.message) {
        setlogin(false);
        return;
      }

      setlogin(true);

      // ✅ Token is valid, now fetch data
      // const usersRes = await fetch(`${API_End}/user/info`);
      const usersRes = await fetch(`${API_End}/admin/users`, {
        method: 'GET', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        }
      });

      const data2 = await usersRes.json();
      // if (!usersRes.ok) throw new Error('User fetch failed');
      // const users = JSON.parse(usersText);
      setUserData(data2);

      // const jobsRes = await fetch(`${API_End}/admin/jobs`);
      const jobsRes = await fetch(`${API_End}/admin/jobs`, {
        method: 'GET', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        }
      });

      const jobsText = await jobsRes.text();
      if (!jobsRes.ok) throw new Error('Job fetch failed');
      const jobs = JSON.parse(jobsText);
      setJobData(jobs);

    } catch (err) {
      console.error('Error during token validation or data fetch:', err);
      setlogin(false);
    }
  }

  validateAndFetch();
}, []);

  // useEffect(() => {
  //   async function fetchUsers() {
  //     try {
  //       const res = await fetch(`${API_End}/admin/users`);
  //       console.log('Response status:', res.status);
  //       const text = await res.text();
  //       console.log('Raw response:', text);
  //       if (!res.ok) throw new Error('GET request failed');
  //       const result = JSON.parse(text); // safer than res.json() if you're logging
  //       console.log(result);
  //       setUserData(result);
  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //     }
  //   }
  
  //   fetchUsers();
  // }, []);

  
  // useEffect(() => {
  //   async function fetchJobs() {
  //     try {
  //       const res = await fetch(`${API_End}/admin/jobs`);
  //       // console.log('Response status:', res.status);
  //       const text = await res.text();
  //       // console.log('Raw response:', text);
  //       if (!res.ok) throw new Error('GET request failed');
  //       const result = JSON.parse(text); // safer than res.json() if you're logging
  //       console.log(result);
  //       setJobData(result);
  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //     }
  //   }
  
  //   fetchJobs();
  // }, []);
  
  const handleClick = () => {
    setsqltoggle(true);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{"querys": `${sqlquery}`}])
    };
    console.log("sqlquery: ", sqlquery)
    fetch(`${API_End}/admin/querys`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setsqldata(data);
          console.log("sqldata", sqldata);
        });
    
    

    // try {
    //     const res = await fetch(`${API_End}/admin/querys`, {method:'POST', 
    //       headers :{'Content-type':'application/json',},
    //       body:JSON.stringify({
    //         'querys':`${sqldata}`,
    //       })});
    //     // console.log('Response status:', res.status);
    //     const text = await res.text();
    //     // console.log('Raw response:', text);
    //     if (!res.ok) throw new Error('POST request failed');
    //     const result = JSON.parse(text); // safer than res.json() if you're logging
    //     console.log(result);
    //     setsqldata(result);
    //   } catch (err) {
    //     console.error('Error posting request:', err);

  }
  return (
    <div className={`${styles.paddingX} ${styles.paddingY}`}>
      {login && (
        <>
        <div className={`${styles.sectionHeadText}`}>Admin</div>

      <div className='mb-5'>
        <textarea rows= {6} value={sqlquery} onChange={(e)=> setsqlquery(e.target.value)}
        className = "border border-gray-300 rounded-lg p-2 w-full mb-2" />
        <button onClick = {handleClick} className="bg-black text-white px-4 py-2 rounded-full hover:bg-blue-500">
          Run SQL Query
        </button>    
        {sqltoggle && <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {sqldata ? <DataTable data={sqldata} /> : "Loading..."}
        </pre>}

      </div>

      <div className='mb-5'>
        <button onClick={handleut} className="bg-black text-white px-4 py-2 rounded-full hover:bg-blue-500">
          Show Users Table
        </button>
        {utoggle &&
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {userData ? <DataTable data={userData} /> : "Loading..."}
        </pre>}
      </div>
      <div className='mb-5'>
        <button onClick={handlejt} className="bg-black text-white px-4 py-2 rounded-full hover:bg-blue-500">
          Show Job Table
        </button>
        {jtoggle &&
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {userData ? <DataTable data={jobData} /> : "Loading..."}
        </pre>}
      </div>
      </>
      )}

      {!login && (
        <>
        <div className={`${styles.sectionHeadText}`}>You are not Admin</div>
        </>
      )}

    </div>
  );
}

export default Admin;
