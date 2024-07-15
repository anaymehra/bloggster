import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";  // new
const app = express();
const PORT = 3000;

let blogs =[]

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.use(methodOverride("_method")); // new The method-override middleware is used in Express to override the HTTP method of a request. <form action="/blogs/123?_method=DELETE" method="POST"><button type="submit">Delete</button>The form sends a POST request to the /blogs/123 route, but the _method=DELETE query parameter tells method-override middleware to treat this request as a DELETE request.

app.get("/",(req,res)=>{
    res.render("index.ejs", ); 
})
app.get("/post",(req,res)=>{
    res.render("post.ejs");
})
app.get("/blogs",(req,res)=>{
    res.render("blogs.ejs",{blogs:blogs}); //new
})

app.get("/blogs/:id",(req,res)=>{
    const id = req.params.id;
    const blog = blogs.find(blog=>blog.id === Number(id)); //This line searches through the blogs array to find a blog post whose id matches the id extracted from the URL. The Array.prototype.find() method is used for this purpose. It returns the first element in the array that satisfies the provided testing function, or undefined if no such element is found.
    if(blog){
        res.render("blog-details.ejs",{blog: blog}); // blogs is the array of blogs , blog is the current blog 
    }
    else {
        res.status(404).send("Blog not found.");
    }
})

// app.get("/blogs/:id",(req,res)=>{ // new  - This line defines a route handler for GET requests to the path /blogs/:id. The :id part of the path indicates a route parameter, meaning that it can match any value in that position in the URL.
//     const id = req.params.id;
//     const blog = blogs.find(blog=>blog.id === Number(id)); //This line searches through the blogs array to find a blog post whose id matches the id extracted from the URL. The Array.prototype.find() method is used for this purpose. It returns the first element in the array that satisfies the provided testing function, or undefined if no such element is found.
//     if(blog){
//         res.render("blogs.ejs",{blogs: blogs}); // blogs is the array of blogs being
//     }
//     else {
//         res.status(404).send("Blog not found.");
//     }
// })
// this route handler above, dynamically handles requests for individual blog posts based on their unique identifiers (id). It retrieves the corresponding blog post from an array of blog posts, renders it using a template, and sends an appropriate response based on whether the blog post is found or not.


app.post("/post",(req,res)=>{
    
    let data = {
        name: req.body["name"],
        date: req.body["date"],
        topic: req.body["topic"],
        blogText: req.body["blogText"]
    }
    data.id = blogs.length + 1; // Assign a unique id (you can use a better way to generate ids)
    
    // res.render("blogs.ejs", {data:data}); // is this  even relevant when we are psuhing the blog data and redirecting the page as well?
    blogs.push(data); // imp
    res.redirect("blogs"); // imp

}); 

// Route to handle blog deletion new 
app.delete("/blogs/:id",(req,res)=>{ //  As before, :id represents a dynamic value that can be any string.
    const id = req.params.id;
    blogs = blogs.filter(blog => blog.id !== Number(id)); // new - This line removes the blog post with the specified id from the blogs array. It uses the Array.prototype.filter() method to create a new array containing only the blog posts whose id does not match the id extracted from the URL.
    res.redirect("/blogs");
})

app.get("/blogs/:id/edit",(req,res)=>{
    const id = req.params.id;
    const blog = blogs.find(blog => blog.id === Number(id));
    if (blog) {
        res.render("edit-blog.ejs", { blog: blog });
    } else {
        res.status(404).send("Blog not found.");
    }
});

// Update Route: POST request to handle form submission for updating a blog post - IMP - new
app.post("/blogs/:id", (req, res) => {
    const id = req.params.id;
    const blogIndex = blogs.findIndex(blog => blog.id === Number(id));
    if (blogIndex !== -1) {
        const updatedBlog = {
            ...blogs[blogIndex], // new - Create a copy of the existing blog object 
            name: req.body["name"],
            date: req.body["date"],
            topic: req.body["topic"],
            blogText: req.body["blogText"],
        };
        blogs[blogIndex] = updatedBlog; // Update the array with the modified copy
        res.redirect("/blogs");
    } else {
        res.status(404).send("Blog not found.");
    }
});



app.listen(PORT,()=>{
    console.log("Listening on port",PORT);
})






// Add an if else statement in blogs.ejs such that whenever user routes to any individual blog like blog/1 gets a different interface like just simple <h1>blog number 1<h1> something like that
// Style MY BLOGS - done
// Add example blogs on home
// Add update and delete using put/delete - partially done

// First mistakke - form me name se access hota hai data, name lagaya hi nhi tha
// Second mistake - not using global var/array or localStorage for storing the actual data (dumb)
// Third mistake - not having each blog its own path, did that by giving them a unique id whenever they are posted
// Fourth mistake - check gemini the update problem
// Fifth mistake - rendering th entire blogs array for details instead of single a blog

// In Express, while you can define multiple route handlers for the same route, it's generally not recommended because only the first matching handler will be executed.

// In your provided code, you indeed have two route handlers defined for the same route (/blogs/:id). However, only the first one will be effective, and the second one will not be reached or executed.

// So, in the context of your specific code, it won't cause any functional issue because the second route handler won't interfere with the first one. However, it's still a good practice to avoid defining multiple handlers for the same route to maintain clarity and prevent potential confusion for other developers reading your code.