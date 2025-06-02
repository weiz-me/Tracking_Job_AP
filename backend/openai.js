require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey:process.env.OP_API,
});

const {pdfs} = require('./pdf');

async function chat(user_id,web,job_text,pdf_path,date =new Date().toISOString())  {
const prompt = `
Extract relevant fields from this job description and generate a PostgreSQL INSERT statement into the "job_applications" table. Use only info from the description below.

Inputs:
- Job Description: ${job_text}
- Website URL: ${web}
- PDF Path: ${pdf_path}
- Date: ${date}
- User ID: ${user_id}

Instructions:
- Extract "company_name", "job_title", "salary" and "location" from the Job Description.
- Use "${web}" for "job_posting_url" and "Website".
- Use "${pdf_path}" for "file_location".
- Use "${date}" for "application_date".
- Use ${user_id} for "user_id".
- Set "status" to "Applied".
- Summarize coding languages, key qualifications or requirements, into the "notes" field.
- Use NOW() for "created_at" and "updated_at".
- salary has type of numeric.
- all field must be not null.

Output only the SQL INSERT statement. No other text.`;

    const res = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages:[{role:"user",content:prompt }],
    })

    // console.log("AI:", res.choices[0].message.content);
    // console.log(res);
    return res.choices[0].message.content;
}


// (async () => {
//     const jobURL = "https://www.linkedin.com/jobs/view/4189005343/";
//     const pdfPath = "/Downloads/react/wei-app/backend/temp.pdf";
//     const jobText = pdfs(jobURL,pdfPath);
//     const applicationDate = "2025-05-02";
  
//     const insertSQL = await chat(jobURL, jobText, pdfPath, applicationDate);
//     console.log("\nGenerated SQL:\n", insertSQL);
//   })();
  
module.exports = {chat};

// chat();