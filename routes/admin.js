const express = require("express");
const router = express.Router();
const db = require("../data/data");
const path = require("path");
const fs = require("fs");
const imageUpload = require("../helpers/image-upload");


router.get("/blog/delete/:blogid", async function(req, res){
    const blogid = req.params.blogid;

    try {
        const [blogs,] = await db.execute("select * from anılar where id=?", [blogid]);
        const blog = blogs[0];

        res.render("admin/blog-delete", {
            title: "delete blog",
            blog: blog
        });
    }
    catch(err) {
        console.log(err); 
    }
});

router.post("/blog/delete/:blogid", async function(req, res) {

    const blogid = req.body.blogid;
    try {
        await db.execute("delete from anılar where id=?", [blogid]);
        res.redirect("/admin/blogs?action=delete");
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/category/delete/:categoryid", async function(req, res){
    const categoryid = req.params.categoryid;

    try {
        const [categories,] = await db.execute("select * from anilarkategori where id=?", [categoryid]);
        const category = categories[0];

        res.render("admin/categori-delete", {
            title: "delete category",
            category: category
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.post("/category/delete/:categoryid", async function(req, res) {
    const categoryid = req.body.categoryid;
    try {
        await db.execute("delete from anilarkategori where id=?", [categoryid]);
        res.redirect("/admin/categories?action=delete");
    }
    catch(err) {
        console.log(err);
    }
});


router.get("/categori/create", async function (req, res) {

    const [anilarkategori,] = await db.execute("select * from anilarkategori")

    try {
        res.render("admin/categori-create", {

            categories: anilarkategori,

        })
    }
    catch (err) {
        console.log(err);
    }
}
);

router.post("/categori/create", async function(req, res) {
    const name = req.body.name;
    console.log("assdads")
    try {
        await db.execute("INSERT INTO anilarkategori(name) VALUES (?)", [name]);    
        //res.redirect("/admin/categories?action=create");
        res.redirect("/admin/blogs");
    }
    
    catch(err) {
        console.log(err);
    }
});


router.get("/blogs/create", async function (req, res) {

    const [anilarkategori,] = await db.execute("select * from anilarkategori")

    try {
        res.render("admin/blog-create", {

            categories: anilarkategori,

        })
    }
    catch (err) {
        console.log(err);
    }
}
);

router.post("/blogs/create",imageUpload.upload.single("resim"), async function(req, res) {

   const baslik=req.body.baslik;
   const aciklama=req.body.aciklama;
   const altbaslik=req.body.altbaslik;
   const resim = req.file.filename;
   const kategori=req.body.kategori;


   try {

    await db.execute("INSERT INTO anılar(name,aciklama,altbaslik,resim,kategoriid) VALUES (?,?,?,?,?)", [baslik,aciklama,altbaslik,resim,kategori]);
    res.redirect('/admin/blogs?action=create')
    
   } catch (err) {
    
   }

 
});


router.get("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid;

    try {
        const [blogs,] = await db.execute("select * from anılar where id=?",[blogid]);
        const [anilarkategori,] = await db.execute("select * from anilarkategori")
        const blog = blogs[0];

        if(blog) {
            return res.render("admin/blog-edit", {
                title:blog.name,
                blog: blog,
                categories: anilarkategori
            });
        }

        res.redirect("admin/blogs");
    }
    catch(err) {
        console.log(err);
    }
});

router.post("/blogs/:blogid", imageUpload.upload.single("resim"), async function(req, res) {
    const blogid = req.body.blogid;
    const name = req.body.baslik;
    const acıklama = req.body.aciklama;
    const altbaslik = req.body.altbaslik;
    let resim=req.body.resim;
    if(req.file) {
        resim = req.file.filename;

        fs.unlink("./public/images/" + req.body.resim, err => {
            console.log(err);
        });
    }
    const kategori = req.body.kategori;
  
    try {
        await db.execute("UPDATE anılar SET name=?,aciklama=?,altbaslik=?,resim=?,kategoriid=? WHERE id=?", [name,acıklama,altbaslik,resim,kategori,blogid]);
        res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;

    try {
        const [categories, ] = await db.execute("select * from anilarkategori where id=?", [categoryid]);
        const category = categories[0];

        if(category) {
            return res.render("admin/categori-edit", {
                title: category.name,
                category: category
            });
        }

        res.redirect("admin/categories");
    }
    catch(err) {
        console.log(err);
    }
});

router.post("/categories/:categoryid", async function(req, res) {
    const categoryid = req.body.categoryid;
    const name = req.body.name;


    try {
        await db.execute("UPDATE anilarkategori SET name=? where id=?", [name, categoryid]);
        res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    }
    catch(err) {
        console.log(err);
    }
});


router.get("/blogs", async function (req, res) {
    try {
        const [blogs,] = await db.execute("select * from anılar");
        res.render("admin/blog-list", {
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
            // action: req.query.action,
            // blogid: req.query.blogid
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/categories", async function(req, res) {
    try {
        const [categories,] = await db.execute("select * from anilarkategori");
        res.render("admin/categori-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;