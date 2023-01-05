//DEPENDENCIES
////////////////////
require("dotenv").config()
const { DATABASE_URL, PORT } = process.env

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors')
const morgan = require('morgan')

////////////////////////////
//DATABASE CONNECTION
//////////////////////////
//Establish connect
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//DB connection events
mongoose.connection
                    .on("open", ()=>console.log("You are connected to mongoose"))
                    .on("close", ()=>console.log("You are disconnected from mongoose"))
                    .on("error", (err)=> console.log(error))


////////////////////
///MODELS
////////////////////

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)


/////////////////////
//MIDDLEWARE////
/////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

////////////
//ROUTES////
///////////

///test route
app.get("/", (req, res)=>{
    res.send("hello world")
})

//PEOPLE INDEX ROUTE:
app.get('/people', async (req, res)=>{
    try{
        //send all people
        res.json(await People.find({}))
    } catch(error){
        // send error
        res.status(400).json(error)
    }

})

//create route
app.post("/people", async (req, res)=>{
    try {
        res.json(await People.create(req.body))
    } catch(error) {
        res.status(400).json(error)
    }
})

//Update route
app.put('/people/:id', async (req, res)=>{
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
               
    }
    catch (error){
        res.status(400).json(error)
    }
})

//delete route
app.delete('/people/:id', async (req, res)=>{
    try{
        res.json (await People.findByIdAndRemove(req.params.id))
    } catch (error){
        res.status(400).json(error)
    }
    
})

//show page
app.get('/people/:id', async(req, res)=>{
    try{
        res.json(await People.findById(req.params.id))
    }
    catch(error){
        res.status(400).json(error)
    }
})

//////////
//LISTENER
///////////
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`))