import React, { useEffect, useState} from 'react';
import styles from '../styles';
import DataTable from '../components/Table';
import EditableTable from '../components/EditableTable';

// const API_End = "http://weizproject.ddns.net:5000"
const API_End = "";

function Jobs() {
  const [userData, setUserData] = useState(null);
  const [jobData,setJobData] = useState(null);
  const [sqlquery,setsqlquery] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const [content,setcontent] = useState("");

  const [date,setdate] = useState(today);
  const [login,setlogin] = useState(false);

useEffect(() => {
  async function validateAndFetch() {
    const token = localStorage.getItem('track_job_token');
    const user_id = localStorage.getItem('track_job_user_id');
    console.log("userid",user_id)
    if (!token) {
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
      const usersRes = await fetch(`${API_End}/user/info`, {
        method: 'POST', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify({
          user_id: user_id, // replace with actual data you want to send
        })
      });

      const data2 = await usersRes.json();
      // if (!usersRes.ok) throw new Error('User fetch failed');
      // const users = JSON.parse(usersText);
      setUserData(data2);

      // const jobsRes = await fetch(`${API_End}/admin/jobs`);
      const jobsRes = await fetch(`${API_End}/user/jobs`, {
        method: 'POST', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify({
          user_id: user_id, // replace with actual data you want to send
        })
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
  
  
  const handleWebsite = async () => {
    const token = localStorage.getItem('track_job_token');
    const user_id = localStorage.getItem('track_job_user_id');

    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify([{"web": `${sqlquery}`,"date":`${date}`,"user_id":user_id}])
    };
    console.log("sqlquery: ", sqlquery)
    await fetch(`${API_End}/user/insert/web`, requestOptions);
    
    const jobsRes = await fetch(`${API_End}/user/jobs`, {
        method: 'POST', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify({
          user_id: user_id, // replace with actual data you want to send
        })
      });

    const jobsText = await jobsRes.text();
    if (!jobsRes.ok) throw new Error('Job fetch failed');
    const jobs = JSON.parse(jobsText);
    setJobData(jobs);
      
    console.log("data refrsh", jobData);

  };

  
  const handleContent = async () => {
    const token = localStorage.getItem('track_job_token');
    const user_id = localStorage.getItem('track_job_user_id');
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify([{"web": `${sqlquery}`,"content":`${content}`,"date":`${date}`,"user_id":user_id}])
    };

    console.log("sqlquery: ", sqlquery)
    await fetch(`${API_End}/user/insert/content`, requestOptions);
    const jobsRes = await fetch(`${API_End}/user/jobs`, {
        method: 'POST', // or 'PUT', depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // optional, if you use auth
        },
        body: JSON.stringify({
          user_id: user_id, // replace with actual data you want to send
        })
      });

      const jobsText = await jobsRes.text();
      if (!jobsRes.ok) throw new Error('Job fetch failed');
      const jobs = JSON.parse(jobsText);
      setJobData(jobs);

  };

  const handleDate = (e) => {
    setdate(e.target.value);
  }
  // const changeContent = (e) => {
  //   setcontent(e.target.value);
  // }

  return (
    <div className={`${styles.paddingX} ${styles.paddingY}`}>
      {login && (<>
      <div className={`${styles.sectionHeadText}`}>Userinfo</div>
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {userData ? <DataTable data={userData} /> : "Loading..."}
        </pre>

      <div className={`${styles.sectionHeadText}`}>Job Application</div>
      <div className='mb-5'>
        <div className="mb-5">
          <p>Website: </p>
          <textarea rows= {1} value={sqlquery} onChange={(e)=> setsqlquery(e.target.value)}
          className = "border border-gray-300 rounded-lg p-2 w-full mb-2" />
        </div>
        <div className="mb-5">
          <p>Content: </p>
          <textarea rows= {3} value={content} onChange={(e)=> setcontent(e.target.value)}
          className = "border border-gray-300 rounded-lg p-2 w-full mb-2" />
        </div>

        <div className='mb-5'>
        <input type='date' value={date} onChange={handleDate} />
        </div>
        <button onClick = {handleWebsite} className="bg-black text-white px-4 py-2 rounded-full hover:bg-blue-500">
          Add Job through Website
        </button>    
        <button onClick = {handleContent} className="bg-black text-white px-4 py-2 rounded-full hover:bg-blue-500">
          Add Job through Content
        </button>    
        {jobData ? <EditableTable data={jobData} /> : "Loading..."}
        {/* {<pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {jobData ? <DataTable data={jobData} /> : "Loading..."}
        </pre>} */}

      </div>
      </>)}
      {!login && (
      <div className={`${styles.sectionHeadText}`}>you are not log in</div>

      )}
    </div>
  );
};

export default Jobs;
