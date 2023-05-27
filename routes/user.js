const express = require("express");
const router = express.Router();

const db = require("../data/data");
const path = require("path");



router.use('/blogs/category/:categoriid', async function (req, res) {
    const id=req.params.categoriid;
    
    const [blogs, ] = await db.execute("select * from anılar where kategoriid=?",[id])
    const [anıkategori,] = await db.execute("select * from anilarkategori where id=?",[id])
    categori=anıkategori[0]

    res.render("users/blogs", {

        blogs:blogs,
        kategori:categori,
        active:true,

    })

});



router.use("/", async function (req, res) {

    const [anılar,] = await db.execute("select * from anılar")
    const [anıkategori,] = await db.execute("select * from anilarkategori")
    res.render("users/index", {
        anılar: anılar,
        kategori: anıkategori,
        active:true,
    });
});

module.exports = router;





//1-npm init -y yazarak package json oluştur
//2-Express i yükle -midware e set et
//3-NodeMon ekle ve "start" scripti yazıp, package.json a ekle.
//4-Path modülünü indir -midware e set et
//5-Static dosyaları aç -midware e set et
//6-Ejs modülünü indir ve -midware e set et
//7-Oluşturulan express route larını middware e çağır ve kullan
//8-Sql bağlantısı için db klasörü oluştur
//9-Mysql kütüphanesini projeye yükle
//10-Config dosyasını ayrı olarak ana dizinde js dosyasına yazarız.
//11-db klasörü içerinde bağlantı oluşurularak, export edilir.
//12-Export edilen bağlantıyı kullanacağımız route a reqire ederiz.
//13-POST EDERKEN KULLANMAK İÇİN app.use(express.urlencoded({ extended: false })) İ MİDWARE E YAPIŞTIR.
//14-Resim dosyaları için "multer" kullan, form a encycpa eklemeyi unutma, form özelliğini file yap. req den resim verisini file.filaname ile al
//15-HTML editör de ejs kullanırken = yerine - kullan

