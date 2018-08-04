const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000; //configured to run with heroku

let app = express();

hbs.registerPartials(__dirname + "/views/partials")
app.set("view engine", "hbs");

app.use((request, response, next) => {
  let now = new Date().toString();
  let log = (`${now}: ${request.method} ${request.url}`);

  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err){
      console.log("Unable to append to server.log");
    }
  });
  next();
})

//check if in maintenance mode. This will stop below middleware from running
// app.use((request, response, next) => {
//   response.render("maintenance.hbs")
// })

app.use(express.static(__dirname + "/public"));


hbs.registerHelper("getCurrenYear", ()=> {
  return new Date().getFullYear();
});

hbs.registerHelper("makeUpperCase", (text) => {
  return text.toUpperCase();
})

app.get("/", (request, response) => {
  response.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome to my website!!!",
    currentYear: new Date().getFullYear(),
  })
})

app.get("/about", (request, response) => {
  response.render("about.hbs", {
    pageTitle: "About Page",
    currentYear: new Date().getFullYear(),
  })
})

app.get("/projects", (request, response) => {
  response.render("projects.hbs", {
    pageTitle: "Projects"
  });
});

app.get("/about", (request, response) => {
  response.send("<h1>This is the about page!!!</h1>")
});

app.get("/bad", (request, response) => {
  response.send({
    errorMessage: "Unable to handle request",
  });
});

// app.listen(3000, () => {
  // console.log("server is up on port 3000")
// });

//For heroku to work:
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})
