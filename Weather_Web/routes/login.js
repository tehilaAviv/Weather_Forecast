var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const db = require('../models');
var data={};
//-------------------------------------------------------------------------------
//ראוטר זה בודק אם המשתמש מחובר, אם כן יעבור לדף הבית, אם לא יעבור לדף התחברות
router.get('/', function(req, res, next) {
    if(req.session.views)
        res.render('index',{msg:''});
    else{
        res.render('login',{msg:''})
    }
});
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור SUBMIT של התחברות,נגיע לראוטר זה שבו השרת יטפל בבדיקת המייל והסיסמא אם קיימים במסד
router.post('/checkLogin', function(req, res, next) {
    db.User.findOne({where:{email:req.body.email_l,password:req.body.password_l}})//בדיקה לפי מייל וסיסמא אם המשתמש קיים במסד
        .then(response=> {
            {
                if (response != null) {//אם קיים משתמש כזה נפעיל סשן ונעבור לדף הבית
                    req.session.views = true;
                    data.id = response.id;
                    res.render('index',{msg: 'hello ' + response.firstName + " " + response.lastName });//שליחת המשתמש לדף הבית והצגת שמו בראש הדף
                } else {//אם לא קיים משתמש שהוזן תשלח הודעת שגיאה
                    req.session.views = false;
                    res.render('login', {msg: 'user name or password are invalid'})

                }
            }
        });
});
//-------------------------------------------------------------------------------
router.get('/checkLogin', function(req, res, next) {
    if(req.session.views)
        res.render('index',{msg:''});
    else{
        res.render('login',{msg:''})
    }
});
//-------------------------------------------------------------------------------
//ראוטר זה שולח את ה-ID של המשתמש הנוכחי
router.post('/get_id', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send({id:data.id})

});
//-------------------------------------------------------------------------------
router.get('/get_id', function(req, res, next) {
if(req.session.views)
    res.render('index',{msg:''});
else{
    res.render('login',{msg:''})
}
});
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור LOGOUT נשלח את המשתמש לדדף התחברות ונסיר את הסשן
router.post('/logOut', function(req, res, next) {
        req.session.views = false;
    res.render('login',{msg:''})
});
//-------------------------------------------------------------------------------
router.get('/logOut', function(req, res, next) {
    if(req.session.views)
        res.render('index',{msg:''});
    else{
        res.render('login',{msg:''})
    }
});


module.exports = router;
