const router= require("express").Router();
const Task= require("../models/task")
const User = require("../models/user");
const { authenticateToken } =require("./auth")

//create task
router.post("/create-task", authenticateToken, async (req,res)=>{
    try{
        const {title, desc}=req.body;
        const {id}=req.headers;

        // Check if a task with the same title already exists
        const existingTask = await Task.findOne({ title: title });
        if (existingTask) {
            return res.status(400).json({ message: "Task title already exists" });
        }

        const newTask= new Task({title: title, desc: desc});
        const saveTask= await newTask.save();
        const taskId= saveTask._id;
        await User.findByIdAndUpdate(id, { $push: {tasks:taskId._id} });
        res.status(200).json({message:"Task Created"})
    }catch(error){
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
});

router.get("/get-all-tasks", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData= await User.findById(id).populate({
            path: "tasks", options:{ sort: {createdAt: -1}}
        });
        res.status(200).json({data: userData})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})

//delete task
router.delete("/delete-task/:id", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.params;
        const userId=req.headers.id
        await Task.findByIdAndDelete(id)
        await User.findByIdAndUpdate(userId, {$pull:{tasks: id}});
        res.status(200).json({message:"Task deleted"})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})
//update task
router.put("/update-task/:id", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.params;
        const {title, desc}= req.body;
        await Task.findByIdAndUpdate(id, {title: title, desc: desc}) 
        res.status(200).json({message:"Task updated"})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})
//update imp task
router.put("/update-imp-task/:id", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.params;
        const TaskData= await Task.findById(id);
        const ImpTask =TaskData.important
        await Task.findByIdAndUpdate(id, {important: !ImpTask}) 
        res.status(200).json({message:"Task updated"})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})
//update complete task
router.put("/update-complete-task/:id", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.params;
        const TaskData= await Task.findById(id);
        const CompleteTask =TaskData.complete
        await Task.findByIdAndUpdate(id, {complete: !CompleteTask}) 
        res.status(200).json({message:"Task updated"})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})

router.get("/get-imp-tasks", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const Data= await User.findById(id).populate({
            path: "tasks", 
            match: {important:true},
            options:{ sort: {createdAt: -1}}
        });
        const ImpTaskData=Data.tasks;
        res.status(200).json({data: ImpTaskData})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})

router.get("/get-complete-tasks", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const Data= await User.findById(id).populate({
            path: "tasks", 
            match: {complete:true},
            options:{ sort: {createdAt: -1}}
        });
        const CompleteTaskData=Data.tasks;
        res.status(200).json({data: CompleteTaskData})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})

router.get("/get-incomplete-tasks", authenticateToken, async(req,res)=>{
    try{
        const {id}=req.headers;
        const Data= await User.findById(id).populate({
            path: "tasks", 
            match: {complete:false},
            options:{ sort: {createdAt: -1}}
        });
        const InCompleteTaskData=Data.tasks;
        res.status(200).json({data: InCompleteTaskData})
    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal Server Error"});
    }
})
module.exports=router;