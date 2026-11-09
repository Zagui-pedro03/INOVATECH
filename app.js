const express = require("express")
const path = require("path")

const app = express();

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);
app.use(express.static("public"));


app.use(express.urlencoded({ extended: true }))

app.use(express.json());

// ROTAS 

const cadastroRouter = require("./routes/cadastroRoutes")

app.use("/cadastros", cadastroRouter)

const loginRouter = require("./routes/loginRoutes")

app.use("/login", loginRouter);

const homeRouter = require("./routes/homeRoutes")

app.use("/home", homeRouter)

const eventoRouter = require("./routes/eventoRoutes")

app.use("/eventos", eventoRouter)

const salaRouter = require("./routes/salaRoutes")

app.use("/salas", salaRouter)

const usuariosRoutes = require("./routes/usuariosRoutes");

app.use("/usuarios", usuariosRoutes);

// FIM ROTAS

app.get("/", (req, res) => {
    res.render("index/index");
})

app.get("/index", (req, res) => {
    res.render("index", {
        primeiraLetra: null
    });
});


app.listen(3000, () => {


    console.log(
        "Servidor rodando em http://localhost:3000"
    );

});
