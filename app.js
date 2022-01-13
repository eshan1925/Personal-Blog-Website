//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const _env = require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connecting or creating of database to server
mongoose.connect("mongodb+srv://admin-eshan:Test123@cluster0.l312f.mongodb.net/BlogsDB", { useNewUrlParser: true });

// connecting or creating of database to local server
// mongoose.connect("mongodb://localhost:27017/BlogsDB");

var blogPostSchema = {
  title: String,
  content: String
};

var blogPost = mongoose.model("post", blogPostSchema);

app.get("/", function (req, res) {
  blogPost.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully found Items!!!");
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { startingContent: contactContent });
});


////////////////////Route to compose Blog Posts/////////////////////

app.route("/compose"+process.env.COMPOSE_PASSWORD)
.get(function (req, res) {
  res.render("compose",{password:"/compose"+process.env.COMPOSE_PASSWORD});
})
.post(function (req, res) {
  var blogPost1 = new blogPost({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  blogPost1.save(function (err) {
    if (!err) {
      console.log("Successfully added blog post to DB");
      res.redirect("/");
    }
  });
});


////////////////////Route to delete Blog Posts/////////////////////

app.route("/delete"+process.env.COMPOSE_PASSWORD)
.get(function (req, res) {
  res.render("delete",{password:"/delete"+process.env.COMPOSE_PASSWORD});
})
.post(function (req, res) {
  var requestedTitle = req.body.postTitle;
  blogPost.deleteOne({title:requestedTitle},function (err) {
    if(!err){
      console.log("Deleted item successfully!");
      res.redirect("/");
    }else{
      console.log("Error is as follows-:");
      console.log(err);
      res.redirect("/delete"+process.env.COMPOSE_PASSWORD);
    }
  });
});

////////////////////Route to read Blog Posts/////////////////////

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  blogPost.findOne({_id:requestedId}, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { title: foundPost.title, content: foundPost.content });
    }
  });
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully.");
});

