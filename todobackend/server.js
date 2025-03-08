const express = require('express');
const mongoose=require('mongoose');
const cors=require('cors')
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors())
//connecting mo
mongoose.connect('mongodb://127.0.0.1:27017/todoDB').then(()=>{
    console.log('Db connected')  
}) 
.catch((err)=>{
    console.log(err)
})
const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },description:{
        required:true,
        type:String
    }
})
const todoModel=mongoose.model('Todo',todoSchema);

// POST route to add a new todo
app.post('/todos',async (req, res) => {
    const{title,description}=req.body;
    try{
   const newTodo=new todoModel({
    title,description
    });
   await newTodo.save();
   res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500).json();
    }
});


// GET route to fetch all todos
app.get('/todos', async(req, res) => {
    try {
         const todos=await todoModel.find();
         res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
});
app.put('/todos/:id',async (req,res)=>{
    try {
        const{title,description}=req.body;
    const id= req.params.id;
    const updatedTodo=await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {
            new:true
        }
    )
    if(!updatedTodo){
        return res.status(404).json({message:"Todo not found"})
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message}); 
    }
    app.delete('/todos/:id',async(req,res)=>{
        try{
        const id=req.params.id;
        const deletedTodo=await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message}); 
    }   
    })
})

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log('Server is listening to port ' + port);
});

