const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');
const Professor = require('./models/professor');
const User = require('./models/users');

const { authenticateToken, generateToken } = require('./controllers/auth');

mongoose.connect('mongodb://127.0.0.1:27017/utnapi');
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: ['POST','GET','PUT','DELETE']
}));


app.post('/auth/token', generateToken);


// ==========================
// USERS ROUTES
// ==========================

app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })

    try {
        const userCreated = await user.save();
        //add header location to the response
        res.header('Location', `/users?id=${userCreated._id}`);
        res.status(201).json(userCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});


// ==========================
// PROFESSOR ROUTES
// ==========================

app.post('/professor', authenticateToken, async (req, res) => {
    const professor = new Professor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        idNumber: req.body.idNumber,
        age: req.body.age
    })

    try {
        const professorCreated = await professor.save();
        //add header location to the response
        res.header('Location', `/professor?id=${professorCreated._id}`);
        res.status(201).json(professorCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/professor',authenticateToken, async (req, res) => {
    try{
        //if id is passed as query param, return single course else return all courses
        if(!req.query.id){
            const data = await Professor.find();
            return res.status(200).json(data)
        }

        const data = await Professor.findById(req.query.id);
        
        if (!data) {
            return res.sendStatus(404);
        }

        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


app.put('/professor/:id',authenticateToken, async (req, res) => {
    try {

        const updatedProfessor = await Professor.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                idNumber: req.body.idNumber,
                age: req.body.age
            },
            { new: true, runValidators: true } 
            // Returns the updated document and performs validations
        );
     
        if (!updatedProfessor) {
            return res.sendStatus(404);
        }

        res.status(200).json(updatedProfessor);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/professor/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;

        const courses = await Course.find({ professorId: id });

        if (courses.length > 0) {
            return res.sendStatus(400); 
        }

        const deletedProfessor = await Professor.findByIdAndDelete(id);

        if (!deletedProfessor) {
            return res.sendStatus(404); 
        }

        return res.sendStatus(200); 

    } catch (error) {
        return res.sendStatus(500);
    }
});


// ==========================
// COURSE ROUTES
// ==========================

app.post('/course',authenticateToken, async (req, res) => {
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        professorId: req.body.professorId
    })

    try {
        const courseCreated = await course.save();
        //add header location to the response
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/course', authenticateToken, async (req, res) => {
    try{
        //if id is passed as query param, return single course else return all courses
        if(!req.query.id){
            const data = await Course.find();
            return res.status(200).json(data)
        }
        const data = await Course.findById(req.query.id);
        
        if (!data) {
            return res.sendStatus(404);
        }
        
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.put('/course/:id',authenticateToken, async (req, res) => {
    try {
        const courseId = req.params.id;

        // findByIdAndUpdate: actualiza y retorna el nuevo documento si ponemos { new: true }
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
                professorId: req.body.professorId
            },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.sendStatus(404);
        }

        res.status(200).json(updatedCourse);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/course/:id', authenticateToken, async (req, res) => {
    try {
        const courseId = req.params.id;

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.sendStatus(404);
        }

        res.status(200).json(deletedCourse);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





//start the app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`))
