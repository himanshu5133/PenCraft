const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
// express app
const app = express();

// connect to database
const dbURL='mongodb+srv://himanshu5133:koliv5936@blogs.af44ddl.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURL)
    .then((result)=>{
        app.listen(3000);
    })
    .catch((err)=> console.log(err));
//registrer view engine
app.set('view engine','ejs');

// middlewares & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//routes
app.get('/', (req,res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about',{title:'About'});
});

//blog routes
app.get('/blogs/create',(req,res)=>{
    res.render('create');
})

app.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('index',{blogs:result,title:'All Blogs'});
        })
        .catch(err=>{
            console.log(err);
        });
});
//
app.post('/blogs',(req,res)=>{
    const blog = new Blog(req.body);
    blog.like=0;
    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.get('/blogs/:id',(req,res)=>{
    const id= req.params.id;
    Blog.findById(id)
        .then((result)=>{
            res.render('details',{blog:result,title:'Blog details'});
        })
        .catch(err=>{
            console.log(err);
        });
});

app.delete('/blogs/:id',(req,res)=>{
    const id= req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result)=>{
            res.json({redirect:'/blogs'});
        })
        .catch(err=>{
            console.log(err);
        });
});
// 404 page
app.use((req, res) => {
  res.status(404).render('404');
});