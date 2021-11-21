var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const db = require('../models');
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור הוספה , יגיע לראוטר זה
router.post('/saveCity', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    //בדיקה אם העיר שהזין קיים כבר ברשימת הערים שלו
    db.Cities.findOrCreate({where:{user_id:req.body.userId,name:req.body.city},defaults:{user_id:req.body.userId,name:req.body.city,long:req.body.long,lat:req.body.lat}})//  לעשות CREAT OR
        .then(response=>{
            if(response[1]){//אם העיר שההזין אינו קיים כבר ברשימה, נוסיף את העיר לטבלת הערים , ותשלח הודעת SUCCESS
                res.send({msg:"success",code:"success"})
            }
            else{//אם העיר שההזין קיים כבר ברשימה, תשלח הודעת FEILED
                res.send({msg:"failed"})
            }
        })
});
//-------------------------------------------------------------------------------
// ראוטר זה אחראי לחלץ מתוך טבלת הערים את רשימת הערים עבור המשתמש
router.post('/getCities', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    db.Cities.findAll({where:{user_id:req.body.userId}})//קבלת רשימת הערים של המשתמש
        .then(response=>{
            if(response[0] != 0){//אם רשימת הערים התקבלה נשלח את הרשימה
                res.send({list:response});
            }
            else{//אחרת נחזיר FAILED
                res.send({msg:"failed"})
            }
        })
});
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור מחיקה, יגיע לראוטר זה
router.post('/deleteCity', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    db.Cities.destroy({where:{user_id:req.body.userId,name:req.body.name1}})//מחיקת העיר שנבחר מטבלת הערים
});
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור איפוס, יגיע לראוטר זה
router.post('/resetList', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    db.Cities.destroy({where:{user_id:req.body.userId}})//מחיקת כל הערים של המשתמש הנוכחי מרשימת הערים
});

module.exports = router;
