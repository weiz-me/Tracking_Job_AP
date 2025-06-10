const fs = require('fs');
const pool = require('./db');  // Import DB connection

// Function to insert PDF into database
async function pdf_to_database(job_id) {
    const res = await pool.query(
        'select file_location from job_applications where id = $1',
        [job_id]
    )
    console.log("res",res.rows);
    console.log("res.rows[0].file_location",res.rows[0].file_location);
    const file_location=res.rows[0].file_location;

    const rawData = fs.readFileSync(file_location);

    pool.query('UPDATE job_applications SET pdf = $1 WHERE id = $2 RETURNING id',
        [rawData,job_id]
    ).then(res => {
        console.log('Job_id ' + res.rows[0].id + ' inserted');
    }).catch(err => {
        console.error('Error inserting file:', err.stack);
    });
}

// Function to retrieve PDF from database and write it to a file
function database_to_pdf(job_id) {
    pool.query(
        'SELECT pdf FROM job_applications WHERE id = $1',
        [job_id]
    ).then(res => {
        if (res.rows.length > 0) {
            fs.writeFileSync(output_path, res.rows[0].pdf);
            console.log('PDF written to', output_path);
        } else {
            console.log('No PDF found for job_id', job_id);
        }
    }).catch(err => {
        console.error('Error reading PDF from database:', err.stack);
    });
}

async function pdf_to_database_user(user_id) {
    const res = await pool.query(
        'select id from job_applications where user_id = $1',
        [user_id]
    )
    console.log("res",res.rows);
    for(const row of res.rows) {
        if ([24, 25, 54, 58, 63,95].includes(row.id) || (row.id >= 64 && row.id <= 74)) continue;
        await pdf_to_database(row.id);
    }
}
// instead of write to local file return pdf 
//   fs.readFile(file_path, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error reading PDF file');
//     }
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="jobs.pdf"');
//     res.send(data);


// Testing 
// pdf_to_database(5);
// database_to_pdf(5,"./testing/job_5.pdf")
pdf_to_database_user(1)


// http.createServer(function (req, res) {
//   const chunks = [];

//   if (req.url === '/' && req.method.toLowerCase() === 'post') {
//       const form = new IncomingForm({ multiples: true });
//       form.parse(req, (err, fields, files) => {
//         if (files.userfile.type == "application/pdf") {
//           var rawData = fs.readFileSync(files.userfile.path) ;
//           dbc
//             .query(
//               'insert into files(name,type,size,data) values ($1,$2,$3,$4)'
//               + ' returning name',
//               [ files.userfile.name, files.userfile.type, files.userfile.size,
//                 rawData ]
//             ).then(res => {
//                 var insMessage = 'file ' + res.rows[0].name + ' inserted' ;
//                 console.log( insMessage );
//             }).catch(err => {
//                 var insMessage = 'Error inserting file ' + files.userfile.name ;
//                 console.error( insMessage );
//                 console.error( err.stack );
//             });
//         }
//       });
//   }
//   req.on('data', chunk => chunks.push(chunk));
//   req.on('end', () => {
//     res.writeHead(200, [['Content-Type', 'text/html'],
//                       ['Cache-Control', 'maxage=120, s-maxage=60, public'],
//                       ['X-Accel-Expires', '86400'],
//                       ['X-BEVar', req.url] ]);
//     res.write('Hello ' + req.headers['user-agent'] + '!<br>');
//     res.write('<br>I\'m the one listening on port ' + port + '!<br>');
//     res.write("  <FORM ACTION='");
//     res.write(req.url);
//     res.write("' METHOD='post' enctype='multipart/form-data'> \
//                   <input type='hidden' name='MAX_FILE_SIZE' value='128000000'> \
//                   <input name='userfile' type='file' size='50'> \
//                   <input type='submit' value='Send File'> \
//                  </FORM>");
//     res.end('Do you know it\'s already ' + Date() + '?');
//   })
// }).listen(port,"192.168.1.3");