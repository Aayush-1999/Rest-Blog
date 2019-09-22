const express         = require("express"),
    expressSanitizer  = require("express-sanitizer"),
    methodOverride    = require("method-override"),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    Blog              = require("./models/blog");
    app               = express();

mongoose.set('useFindAndModify', false)
mongoose.connect("mongodb://127.0.0.1/blogapp",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err)
            console.log(err);
        else
            res.render("index",{blogs});
    });
});

app.get("/blogs/new",(req, res)=> {
    res.render("new");
});

app.post("/blogs",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newblog)=>{
        if(err)
            res.render("new");
        else
        res.redirect("/blogs");
    });
});

app.get("/blogs/:id",(req, res)=> {
    Blog.findById(req.params.id,(err,blog)=>{
        if(err)
            res.redirect("/blogs");
        else
            res.render("show",{blog});
    });
});

app.get("/blogs/:id/edit",(req, res) =>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
      if(err)
        res.redirect("/blogs")
      else
        res.render("edit",{blog:foundBlog});
    })
})

app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+updatedBlog._id);
    })
})

app.delete("/blogs/:id",(req,res)=>{
   Blog.findByIdAndRemove(req.params.id,()=>{
     res.redirect("/blogs");  
   });
});

app.listen(3000)
{
    console.log("Server is running");
}