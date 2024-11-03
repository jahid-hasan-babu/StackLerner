const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const shortid = require("shortid");
const fs = require("fs/promises");//প্রমিয ব্যবহার করার কারনে async use koraci
const path = require("path");



app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


const dbLocation = path.resolve("src","data.json")



app.get("/:id", async(req, res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    const student = students.find((item)=> item.id == id);
    if(!student){
        return res.status(404).json({message: "student not found"})
    }
    res.status(200).json(student);

});

app.patch("/:id", async(req,res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    const student = students.find((item) => item.id == id);
    if(!student){
       return res.status(404).json({message: "Student not found"})
    }
    student.name = req.body.name || student.name;
    student.roll = req.body.roll || student.roll;
    student.dept = req.body.dept || student.dept;

    await fs.writeFile(dbLocation, JSON.stringify(students));
    res.status(201).json(student)


});

app.put("/:id", async(req,res) =>{
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    let student = students.find((item) => item.id == id);
    if(!student){
        student = {
            ...req.body,
            id: shortid.generate(),
        }
        students.push(student)
    }else{
        student.name = req.body.name 
        student.roll = req.body.roll 
        student.dept = req.body.dept 
    }
    await fs.writeFile(dbLocation, JSON.stringify(students));
    res.status(200).json(student)
});

app.delete("/:id", async(req,res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    const student = students.find((item) => item.id == id);
    if(!student){
        return res.status(404).json({ message: "Student not found"});
    }


    const newStudents = students.filter(item => item.id !== id);
    await fs.writeFile(dbLocation,JSON.stringify(newStudents));
    res.status(203).send()

})

app.post("/", async(req, res) =>{
    const student={
        ...req.body,
        id: shortid.generate(),
    };
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    students.push(student);
    fs.writeFile(dbLocation,JSON.stringify(students));
    res.status(201).json(student);
   
});

app.get("/", async(req, res) =>{
    const data = await fs.readFile(dbLocation);
    const students = JSON.parse(data);
    res.status(200).json(students)
});

app.listen(8000, () => {
    console.log('server is running at 8000 port');
})