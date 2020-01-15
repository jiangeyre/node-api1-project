// implement your API here

console.log("It's alive!");

// import express from 'express'; // ES2015 module syntax

const express = require('express'); // CommonJS modules

const db = require('./data/db.js'); // our database library

const server = express();

// middleware: teaches express new things
server.use(express.json()); // needed to parse JSON

// routes or endpoints

// GET to "/"
server.get("/", function(req, res) {
    res.send({ Hello:  'WEB25! GOOD AFTERNOON MEEK AND WEAK HUMANS >:(' });
});

// set a list of db
server.get('/api/users', (req, res) => {
    // read the data from the database
    db.find() // returns a promise
        .then(users => {
            console.log('Users', users);
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            // handle the error
            res.status(500).json({ 
                errorMessage: "Sorry, we ran into an error getting the list of users from DB."
            });
        });
});


// create an user
server.post('/api/users', (req, res) => {
    const userData = req.body;

    const { name, bio } = userData;
    if (!name || !bio ) {
        res
            .status(400).json({ errorMessage: 'Request is empty; we need a name and bio.'})
    } else if ( name && bio ) {
        db.insert(req.body)
            .then(user => {
                db.findById(user.id)
                    .then(foundUser => {
                        res.status(200).json(foundUser);
                    })
                    .catch(() => {
                        json
                            .status(500).json({ message: 'There was an error retrieving the user.' });
                    });
            })
            .catch(() => {
                res.status(500).json({ error: 'There was an error while saving the user to the db. '});
            });
    };
});

// retrieve info on an user
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(400).json({ message: "The user with the specified ID does not exist. SORRY!" });
            };
        })
        .catch(err => {
            res
                .status(500).json({ error: "The user info could not be retrieved. APOLOGIES." });
        });
});

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params

    db.findById(id)
        .then(user => {
        if (!user) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.'
            })
        } else {
                res.status(200).json(user)
            }
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: 'The user information could not be retrieved.' })
        })
});

// delete an user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    db.remove(id)
        .then(userToDelete => {
        if (userToDelete) {
            res.status(204).end();
        } else {
            res
            .status(500)
            .json({ message: 'The user with the specified ID does not exist.' });
        }
        })
        .catch(() => {
        res.status(500).json({ error: 'The user could not be removed' });
        });
});


// update a Hub
server.put('/api/users/:id', (req, res) => {    
    const { id } = req.params;    
    const user = req.body;
    const { name, bio } = user;
    if (!name || !bio) {
        res
            .status(400)
            .json({ errorMessage: 'Please provide name and bio for the user.' });
      }
      db.update(id, user)
        .then(updatedUser => {        
            if (!updatedUser) {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.' });
            } else {
                res
                    .status(200)
                    .json({ message: 'The user information was updated successfully' });
            }
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: 'The user information could not be modified.' });
        });
});

const port = 5000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));

// fork > clone > type: "npm i" to get all the dependencies
// type: "npm i express" to install the express library
// add the index.js file with code the root folder
// to run the server type: "npm run server"
// make a GET request to localhost:8000 using Postman or Insomnia

// to solve the sqLite3 error just do the "npm i sqlite3"