const express = require("express");
const app = express();
const port = 3000;


const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");



var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/loginsubmit", (req, res) => {
    const Email = req.query.Email;
    const Password = req.query.Password;

    db.collection("users")
        .where("Email", "==", Email)
        .where("Password", "==", Password)
        .get()
        .then((docs) => {
            if (docs.size > 0) {
                res.render("home");
            }else {
                res.render("loginfail");
            }
        });
});

app.get("/registrationsubmit", (req, res) => {
    
    const Username = req.query.Username;
    const Email = req.query.Email;
    const Password = req.query.Password;


//Adding new data to collection
    db.collection("users")
        .add({
            
            Email: Email,
            Password: Password,
            
        })
        .then(()=>{
            res.render("home");
        });
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});