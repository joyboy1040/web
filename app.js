import express from 'express';
import bodyParser from 'body-parser';
import {signup,login,getstocks,addstock,addrel,getcuststocks,getuq,putuq,deletestok} from './database.js';

const app = express();
const PORT = 3000;

let usersest=""; //changethis

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static files from the "assets" directory
app.use(express.static('assets'));

app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/login-page",(req,res)=>{
    res.render("login-page")
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [user] = await login(username, password);
    console.log(user);
    if(user[0]==undefined)
        {
            return res.redirect('/login-page')
        }
    if (user[0].password==password) {
        usersest = username;
        res.redirect("/portfolio");
    } else {
        res.render("login-page", { error: "Invalid username or password" });
    }
});


app.post("/signup",(req,res)=>{
    const {username,password,email,name}=req.body;

    signup(username,password,email,name);

    putuq(username)

    usersest=username;

    res.redirect("/portfolio")
})

app.get("/add-stock",(req,res)=>{
    res.render("add-stock")
})

app.post("/add-stock",async (req,res)=>{
    const {stockName,price,IAmount}=req.body;

    addstock(usersest,stockName,price,IAmount);

    res.redirect("/portfolio")
})

app.get("/portfolio",async (req,res)=>{

    let [stocks]= await getstocks(usersest);
    let uq= await getuq(usersest);
    // console.log(stocks);
    res.render("portfolio",{stocks:stocks,uq:uq})
})
app.post("/add-portfolio",async (req,res)=>{

    let [stocks]= await getstocks(usersest);
    let uq= await getuq(usersest);
    // console.log(stocks);
    res.render("portfolio",{stocks:stocks,uq:uq})
})

app.get("/mp",async (req,res)=>{
    req.body
    let stocks= await getcuststocks(usersest);
    
    res.render("Manage",{stocks:stocks})
})

app.post("/add-manager",async (req,res)=>{

    const {custname,uniq} = req.body;

    if (custname==usersest){
        return res.status(200).json({"done":"nodone"})
    }

    const uq= await getuq(custname);

    if(!uq){
        return res.status(200).json({"done":"nodone"})
    }

    if(uniq==uq){
        const result = await addrel(usersest,custname)
        return res.status(200).json({"done":"done"})
    }
    else{
        return res.status(200).json({"done":"nodone"})
    }

})

app.post("/delete",async (req,res)=>{

    const stock = req.body.but;

    await deletestok(usersest,stock)

    res.redirect("/portfolio")
})

app.post("/delete-admin",async (req,res)=>{

    console.log(req.body);

    const stock = req.body.but;
    const usern = req.body.username;

    await deletestok(usern,stock)

    res.redirect("/mp")
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});