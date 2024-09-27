// Declare dependecies / variables

const express = require('express');
const app = express();
const mysql = require ('mysql2');
const dotenv = require ('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// connect to database

const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

// Check if connection works
db.connect((err) => {
    // No Connection
    if(err) return console.log("Error connecting to the database")

    // Yes Connection
    console.log("Connected to mysql successfully as id: ", db.threadId)

    //The Code

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views')

    //QUESTION 1
    app.get('/data', (req,res) => {
        // Retrieve data from database
        db.query('SELECT * FROM patients', (err, results )=>{
            if (err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else {
                res.render('data', {results:results});
            }
        });
    });

    //QUESTION2
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views')

    app.get('/data2', (req,res) => {
        // Retrieve data from database
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results )=>{
            if (err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else {
                res.render('data2', {results:results});
            }
        });
    });

    // QUESTION 3

    app.get('/patients/:first_name', (req, res) => {
        const firstName = req.params.first_name;
        const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
        // Use the existing MySQL connection
        db.query(query, [firstName], (error, results) => {
       if (error) {
        return res.status(500).send(error);
        }
        // Render the 'data3.ejs' file and pass the retrieved patients as data
        res.render('data3', { patients: results });
        });
        });

        // QUESTION 4
        app.get('/providers/:specialty', (req, res) => {
            const specialty = req.params.specialty;
            const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
            // Use the existing MySQL connection
            db.query(query, [specialty], (error, results) => {
           if (error) {
            return res.status(500).send(error);
            }
            // Render the 'data4.ejs' file and pass the retrieved patients as data
            res.render('data4', { providers: results });
            });
            });


    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Send a message to the browser
        console.log('Sending message to browser...');
        app.get('/', (req,res) => {
            res.send('Server started successfully')
        })
    });
});