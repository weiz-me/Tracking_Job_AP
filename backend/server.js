require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
pool = require('./db');  // Import DB connection
const {chat} = require("./openai");
const {pdfs, pdfs_content} = require('./pdf');
const { Pool } = require('pg');
const fs = require('fs');
// const puppeteer = require('puppeteer');
// Middleware
// app.use(cors());
app.use(cors());

app.use(express.json());
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
// Example route
// app.get('/', (req, res) => {
//   res.send('Hello from Express!');
// });
let refreshTokens = []

function initPool() {
  pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Or provide CA cert
  },

});

}

//////////////ADMIN///////////////////////
app.get('/admin/users',authenticateToken,async (req, res) => {
  await initPool();
  try {
    const result = await pool.query("select * from users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  await pool.end()
});

app.get('/admin/jobs',authenticateToken,async (req, res) => {
    await initPool();

    try {
      const result = await pool.query('select * from job_applications');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  
  });

app.post('/admin/querys', async (req, res) => {
  await initPool();

  try {

    const {querys}= req.body[0];
    if (!querys){
      return res.status(400).json({error: "Query is required!" })
    }
    const result = await pool.query(querys);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }

});

/////////////////log in//////////////
app.post('/register', async (req, res) => {
  await initPool();

  try {
    const { email, name, password } = req.body[0];

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (Email, Name, Password, Login_type, Created_at)
      VALUES ($1, $2, $3, 'email', NOW())
      RETURNING id, email, name;
    `;
    const values = [email, name, hashedPassword];
    const result = await pool.query(query, values);


    res.status(201).send({
      message: 'User created successfully',
      user: result.rows,
    });
  } catch (err) {
    // console.error('Error in /register:', err.message);
    res.status(500).send({ message: 'Failed to register user' });
  }

});

app.post('/token',(req,res)=>{
  const refreshToken = req.body.token;
  if (refreshToken==null) return res.sendStatus(401)
  if (refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if (err) return res.sendStatus(403)
    res.json({message:"signin"})
  })

})
app.post('/login',async (req,res) =>{
  await initPool();

  // Authenticate User
  // getting user row
  const {email,password}  = req.body;
  const query = "select * from users where Email=$1";
  try {
    const result = await pool.query(query,[email]);
    // console.log(result.rows)
    const hashedPassword = result.rows[0].password;
    const user_id = result.rows[0].id;
    // console.log(user_id)
    const match = await bcrypt.compare(password,hashedPassword);
    // console.log(match)
    if (match) {
      const user = {name:email};
      // const accessToken = generateAccessToken(user);
      // console.log(accessToken)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      res.status(200).json({
        message: "Login successful",
        user_id: user_id,
        refreshToken: refreshToken
      });
    } else {
      res.status(500).send({message:"wrong password"});
    }
  }catch(err){
    res.status(500).send(err.message);
  }


})

// function generateAccessToken(user) {
//   return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10d'})
// }

app.delete('/logout',authenticateToken,(req,res)=> {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  refreshTokens.push(req.body.token)
  res.sendStatus(204)
})

function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (token==null) return res.sendStatus(401)
  if (refreshTokens.includes(token)) return res.sendStatus(403)

  jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
    if (err) return res.status(403).send("not authorize")
    req.email = user
    next()
  })
}


////////////////////////////JOB APPLICATIONS///////////////

app.post('/user/info',authenticateToken,async (req, res) => {
  await initPool();
  try {
    // console.log(req.body)
    const result = await pool.query("select * from users where id = $1",[req.body.user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/user/jobs',authenticateToken, async (req, res) => {
  await initPool();

  try {
    // const result = await pool.query(`select * from job_applications where User_id = ${req.body.user_id}`);
    const result = await pool.query("SELECT Id, Company_name,Job_title,Location,Application_date,Status, Notes, Salary, Job_posting_url, File_location FROM job_applications Where user_id = $1 ORDER BY id DESC",[req.body.user_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

app.post('/user/insert/web', authenticateToken,async (req, res) => {
  await initPool();

  try {
    // console.log(req.body[0]);
    const {web,date,user_id}= req.body[0];
    if (!web){
      return res.status(400).json({error: "Web is required!" })
    }

    const counter = await pool.query("select count(*) from job_applications");

    if (!fs.existsSync(`user_${user_id}`)) {
      fs.mkdirSync(`user_${user_id}`);
    }
    const pdfPath = `./user_${user_id}/job_${+counter.rows[0].count+1}.pdf`;
    if (!date){
      date = "current date";
    }
    
    const insertSQL = await chat(user_id,web, pdfs(web,pdfPath), pdfPath, date);
    // console.log("\nGenerated SQL:\n", insertSQL);
    let cleaned = insertSQL.replace(/^```sql\s*|```$/g, "");
    // console.log("\nGenerated SQL:\n", cleaned);

    const result = await pool.query(cleaned);
    const table_res = await pool.query("SELECT * FROM job_applications WHERE User_id = $1 ORDER BY id DESC",[user_id]);
    res.json(table_res.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});


app.post('/user/insert/content',authenticateToken, async (req, res) => {
  await initPool();

  try {
    // console.log(req.body[0]);
    const {web,content,date,user_id}= req.body[0];

    const counter = await pool.query("select count(*) from job_applications");

    const pdfPath = `./user_${user_id}/job_${+counter.rows[0].count+1}.pdf`;
    if (!date){
      date = "current date";
    }
    
    if (!fs.existsSync(`user_${user_id}`)) {
      fs.mkdirSync(`user_${user_id}`);
    }
    
    const insertSQL = await chat(user_id,web, pdfs_content(content,pdfPath), pdfPath, date);
    // console.log("\nGenerated SQL:\n", insertSQL);
    let cleaned = insertSQL.replace(/^```sql\s*|```$/g, "");
    console.log("\nGenerated SQL:\n", cleaned);

    const result = await pool.query(cleaned);
    // const table_res = await pool.query("SELECT * FROM job_applications Where user_id = $1 ORDER BY id DESC",[user_id]);
    const table_res = await pool.query("SELECT Company_name,Job_title,Location,Application_date,Status, Notes, Salary, Job_posting_url, File_location FROM job_applications Where user_id = $1 ORDER BY id DESC",[user_id]);
    res.json(table_res.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

/////////////////pdf/////////////////////////

app.post('/user/pdf',authenticateToken,(req,res) => {
  const file_path = req.body.file_path;
  fs.readFile(file_path, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading PDF file');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="jobs.pdf"');
    res.send(data);
  });
});

app.post('/user/save',authenticateToken,async (req,res)=> {
    const editData = req.body.editData;

    // console.log("req: ",req)
    console.log("editData: ",editData)
    const setClauses = [];
    const values = [];

    let idx = 1;
    for (const [key, value] of Object.entries(editData)) {
      if(key !== "id"){
        setClauses.push(`"${key}" = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    // Add id as last parameter
    values.push(editData.id);
    const tableName = "job_applications"
    const query = `
      UPDATE ${tableName}
      SET ${setClauses.join(', ')}
      WHERE id = $${idx}
    `;

    const result = await pool.query(query,values);
    res.json(result.rows);

})
app.post('/test',async (req,res) =>{
  await initPool();

  const counter = await pool.query("select count(*) from job_applications");
  // console.log("counter",+counter.rows[0].count+1);
  res.json(counter.rows);


});


app.post('/test2',authenticateToken,async (req,res) =>{
  await initPool();

  
  res.status(200).send("good token")


});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
