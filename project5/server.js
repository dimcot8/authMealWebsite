
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");


const Sequelize = require('sequelize');

var sequelize = new Sequelize('d381nns5rq2j8k', 
'ayvuebiefujzzc', 
'aed707101ffaff51a807ba627e995dc76c10ff7f209c9eaaf57762b97e3703b8', {
    host: 'ec2-3-221-140-141.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public/"));



    var Registration = sequelize.define('Registration', {
        name: Sequelize.STRING,
        username: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      });

      var meal_package = sequelize.define('Meal_Package', {
        name: Sequelize.STRING,
        price: Sequelize.DOUBLE,
        description: Sequelize.TEXT,
        foodcategory: Sequelize.STRING,
        numOfMeals: Sequelize.INTEGER,
        picture: Sequelize.STRING
      });


    app.get("/addmeal", (req, res) => {
        res.render("home", { layout: false });
    
    });
    app.post('/add-meals', function(req,res){
        var name = req.body.name;
       var  price = req.body.price;
       var  description = req.body.description;
       var  foodcategory = req.body.foodcategory;
       var  numOfMeals = req.body.numOfMeals;


        if(name === "" || price === "" || description==="" || foodcategory==="" || numOfMeals<1) {
            return res.render("home", { errorMsg: "Missing meal package data", layout: false });
        }

        meal_package.create({
                  name: req.body.name,
                  price: req.body.price,
                  description: req.body.description,
                  foodcategory: req.body.foodcategory,
                  numOfMeals: req.body.numOfMeals,
                  picture: req.body.picture
              
        }).then(function(){
          meal_package.findAll({ 
          }).then(function(data){        
              for(var i=0;i<data.length;i++){
                  var name = data[i].name;
                  var price = data[i].price;
                 var description = data[i].description;
                var foodcategory = data[i].foodcategory;
                var numOfMeals = data[i].numOfMeals;
                var picture = data[i].picture;
    
                  res.render("meals", {data: data, name: name, price: price,
                    description: description, foodcategory: foodcategory,
                    numOfMeals: numOfMeals, picture: picture,
                    layout: false});
               
              }
          });
         })

       });











    app.get("/", (req, res) => {
        res.render("register", { layout: false });
    
    });
    app.post('/register-user', function(req,res){
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const email = req.body.email;

        if(username === "" || password === "") {
            return res.render("register", { errorMsg: "Missing credentials", layout: false });
        }

        Registration.create({
                  name: req.body.name,
                  username: req.body.username,
                  email: req.body.email,
                  password: req.body.password
              
        }).then(function(){
          res.redirect('/login-user');
         })
       });

       app.get("/login-user", (req, res) => {
        res.render("login", { layout: false });
    
    });

    app.post("/login-user", (req, res) => {
      const username = req.body.username;
      const password = req.body.password;

        if(username === "" || password === "") {
          return res.render("login", { errorMsg: "Missing credentials", layout: false });
        }
        
        Registration.findAll({ 
        }).then(function(data){        
            for(var i=0;i<data.length;i++){
              if(data[i].username==username && data[i].password==password){
                var actual_user = data[i].name;
                res.render("dashboard", {user: actual_user, layout: false});
              }
              else {
                res.render("login", { errorMsg: "Invalid username or password", layout: false});
              }
            }
        });
      });


    sequelize.sync().then(function () {
app.listen(HTTP_PORT);
});

