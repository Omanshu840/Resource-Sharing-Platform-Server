const resourcesRouter = require('express').Router()
const mongoose = require('mongoose')

const Course = require('../models/course')
const Resource = require('../models/resource')
const auth = require('../utils/auth');
const multer = require("multer");
var AWS = require("aws-sdk");
const { AWS_FILE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME } = require('../utils/config');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


resourcesRouter.get('/resources', (request, response) => {
    Resource.find()
        .then(resources=>{
            response.json({resources:resources});
        })
        .catch(err=>{
            console.log(err);
        })
})


resourcesRouter.get('/courses', (request, response) => {
    Course.find()
        .then((courses) => {
            response.json({courses: courses})
        })
        .catch((err) => {
            console.log(err)
        })
})


resourcesRouter.get('/course/:code', (request, response) => {
    Course.findOne({code: request.params.code})
        .then((course) => {
            response.json({course: course})
        })
        .catch((err) => {
            console.log(err)
        })
})


resourcesRouter.post('/courses', auth, (request, response) => {
    const {code, name, description, branch} = request.body

    if(!code || !name || !description) {
        return response.status(422).json({error: "please add all the fields"})
    }

    const course = new Course({
        code,
        name,
        description,
        branch
    })

    course.save()
        .then((course) => {
            return response.json({message: "Course Saved Successfully"})
        })
        .catch((err) => {
            console.log(err)
        })
})


resourcesRouter.get('/courses/:branch_id', (request, response) => {
    Course.find({branch: request.params.branch_id})
        .then((courses) => {
            response.json({courses: courses})
        })
        .catch((err) => {
            console.log(err)
        })
})


resourcesRouter.get('/resources/:course_id', (request, response) => {
    Resource.find({course:mongoose.Types.ObjectId(request.params.course_id)})
    .then(resources=>{
        return response.json({resources:resources})
    }).catch(err=>{
        console.log(err)
    })
})


resourcesRouter.post("/resources/:course_id", upload.single("file"), function(req, res) {
    console.log(req)
    const file = req.file;
    const s3FileURL = AWS_FILE_URL;
  
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  
    var params = {
        Bucket: AWS_STORAGE_BUCKET_NAME,
        Key: `resources/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };
  
    s3bucket.upload(params, function(err, data) {
        if (err) {
            return res.status(500).json({ error: err});
        } else {
            let newResource = new Resource({
                title: req.body.title,
                link: s3FileURL + file.originalname,
                description: req.body.description,
                course: mongoose.Types.ObjectId(req.params.course_id),
            });

            newResource.save().then(r=>{
                return res.json({message:"Resource added successfully"});
            }).catch(err=>{
                return res.status(500).json({ error: err});
            })
        }
    });
});


resourcesRouter.post('/resources/:course_id', auth, async (req,res)=>{

    let newResource = new Resource({
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        course: mongoose.Types.ObjectId(req.params.course_id),
    });
    
    newResource.save().then(r=>{
        return res.json({message:"Resource added successfully"});
    }).catch(err=>{
        return res.json({error: err})
    })

})


resourcesRouter.delete('/resource/:resource_id',async (req,res)=>{
    const resource = await Resource.findByIdAndDelete(req.params.resource_id)
    let files = resource.files
    files.forEach(async f=>{
        await deleteFile(f)

    })
    res.send("Resource successfully deleted");

});

module.exports = resourcesRouter