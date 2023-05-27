const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const path = require("path");
const userRoutes = require("./routes/user");
const adminroutes = require("./routes/admin");




app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin",adminroutes);
app.use(userRoutes);

app.listen(3000, function() {
    console.log("3000 numaralı port üzerinde dinleniyor...");
});





