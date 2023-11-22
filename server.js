const express = require('express')
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

const app = express();
const fs = require('fs');
const path = require('path');

app.use("/css", express.static("resources/css"))
app.use("/js", express.static("resources/js"))
app.use("/images", express.static("resources/images"))

const port = 4131
let contacts = [];
let next_id = 0;
let sale_text = '';
let sale_active = false;
let error_message = ""

let requestLogger = (req, res, next) => {
    // requested method and URL
    console.log(`Request: ${req.method} ${req.url}`);
  
    // basic server info (number of contacts and sale status)
    console.log(`Number of apppointments: ${contacts.length}`);
    console.log(`Sale status: ${sale_active ? 'Active' : 'Inactive'}`);
    console.log(``)

    next();
};

app.use(requestLogger);

// auth middleware
const auth = basicAuth({
    users: { 'admin': 'password' },
    challenge: true, // sends WWW-Authenticate header
    unauthorizedResponse: unauthUser
});

function unauthUser(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : '401: Page Forbidden'
}


// idk if needed but was mentioned: middleware to parse request body
app.use(bodyParser.text({ type: 'text/*' }));

app.set("views", "templates");
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true })) // middleware
app.use(bodyParser.json());
app.use(express.json()) // turn on json handling

app.get('/', (req , res) => {
    res.render("mainpage.pug")
});

app.get('/main', (req , res) => {
    res.render("mainpage.pug")
});

app.get('/contact', (req , res) => {
    res.render("contactform.pug", {contacts})
});

app.get('/testimonies', (req , res) => {
    res.render("testimonies.pug")
});

app.get('/admin/contactlog', auth, (req , res) => {
    res.render("contactlog.pug", {contacts});
});


app.post('/contact', (req, res) => {
    try {
        const {name, email, date} = req.body;

        // checks if required data is provided
        if (!name || !email || !date) {
            return res.status(400).render('formFailed.pug');
        } else {
            let appointment = {
                id: (++next_id).toString(),
                name: req.body.name,
                email: req.body.email,
                scholarship: req.body.scholarship,
                date: req.body.date,
                subscribe: req.body.subscribe,
            };

            for (const key in appointment) {
                if (appointment[key] === '' || appointment[key] === '0') {
                    return res.status(400).render('formFailed.pug');
                }
            }

            contacts.push(appointment);
            return res.status(201).render('formDataPassed.pug');
        }
        
    } catch (error) {
        // ret a 400 Bad Request if the data cannot be parsed
        return res.status(400).send('bad request: invalid data in the request body');
    }
});

app.get('/api/sale', (req, res) => {
    let sale_info = {}
    if (sale_active){
        sale_info["active"] = sale_active
        sale_info["message"] = sale_text
    }
    return res.status(200).json(sale_info);
});
app.post('/api/sale', auth, (req, res) => {
    try {
        const {message} = req.body;

        if (!message) {
            return res.status(400).send("missing message in the request data");
        }
        sale_text = message;
        sale_active = true;

        return res.status(201).send("sale created or updated successfully");
    } catch (error) {
        return res.status(400).send("invalid JSON in the request body");
    }
});

app.delete('/api/contact', auth, (req, res) => {
    if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json") {
        return res.status(400).send("body not json");
    } else {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).send("missing 'id' in the request data");
            } else {
                const index = contacts.findIndex((appt) => appt.id === id);
                if (index !== -1) {
                    contacts.splice(index, 1);
                    return res.status(200).send("contact deleted successfully");
                } else {
                    return res.status(404).send("contact not found");
                }
            }
        } catch (error) {
            return res.status(400).send("error processing the request");
        }
    }
});

app.delete('/api/sale', auth, (req, res) => {
    sale_active = false
    sale_text = ""
    return res.status(200).send("sale deleted successfully!");
});

app.use((req,res,next) => {
    res.status(404).render('404.pug')
})
app.listen (port , () => {
    console.log(`Example app listening on port ${port}`)
  })