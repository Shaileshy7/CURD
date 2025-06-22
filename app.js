const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./Models/user");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));


app.get("/", (req, res) => {
    res.redirect("/read");
});

app.get("/", (req, res) => {
    res.render("index");
});


// Create Page
app.get("/create", (req, res) => {
    res.render("create");
});
app.post("/create", async (req, res) => {
    await userModel.create(req.body);
    res.redirect("/read");
});

// Read
app.get("/read", async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});

// Edit
app.get("/edit/:id", async (req, res) => {
    let user = await userModel.findById(req.params.id);
    res.render("edit", { user });
});
app.post("/update/:id", async (req, res) => {
    await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/read");
});

// Delete
app.get("/delete/:id", async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect("/read");
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});
