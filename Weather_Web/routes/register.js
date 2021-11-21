var express = require('express');
var router = express.Router();
var Cookies = require('cookies');
var cookieParser = require('cookie-parser');
var Sequelize = require('sequelize');
const db = require('../models');
var data={};
//-------------------------------------------------------------------------------
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.views)
  res.render('index',{msg:''});
  else{
    res.render('login',{msg:''})
  }
});
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור REGISTERING נגיע לראוטר זה והשרת ישלח את המשתמש לדף הרשמה
router.get('/urlRegister', function(req, res, next) {
     res.render('register',{title:'Registering',Errors:''});

  });
//-------------------------------------------------------------------------------
//בעת לחיצה על כפתור SUBMIT של דף הרשמה נגיע לראוטר זה והשרת יטפל בהרשמת המשתמש
router.post('/validation', function(req, res, next) {
      data = req.body;
      db.User.findOne({where: {email: data.email_}})//בדיקה אם המייל שהוזן כבר קיים
          .then(response => {
              if (response == null) {//אם לא קיים מייל כזה המשתמש יעבור לראוטר טיפול בסיסמה
                  res.redirect('/auth');
              } else {//אם קיים כבר מייל כזה תשלח הודעת שגיאה
                  res.render('register', {
                      title: 'Registering',
                      Errors: 'this email is already in use, please choose another one\n'
                  })
              }
              console.log(response);
          })
          .catch(() => {
          })

});
//-------------------------------------------------------------------------------
router.get('/validation', function(req, res, next) {
    if(req.session.views)
        res.render('index',{msg:''});
    else{
        res.render('login',{msg:''})
    }
});
//-------------------------------------------------------------------------------
//  בעת הגעה לראוטר זה, יתחיל לפעול COOKIE למשך דקה והמשתמש יעבור לדף הזנת הסיסמאות
  router.get('/auth', function(req, res, next) {
   res.cookie('timer', 'start', {
     expires: new Date(Date.now() + (10000*6))
    })
    res.render('authentication',{ title: '', Errors:''})
  });
//-------------------------------------------------------------------------------
router.get('/checkData', function(req, res, next) {
    if(req.session.views)
        res.render('index',{msg:''});
    else{
        res.render('login',{msg:''})
    }
});
//-------------------------------------------------------------------------------
// בעת לחיצה על כפתור הגשת הסיסמאות נגיע לראוטר הזה
router.post('/checkData',function(req, res, next) {

  let cookies_ = req.cookies.timer;//קבלת הCOOKIE שיצרנו
  if (cookies_ == null) {//אם חלפה יותר מדקה מאז שהמשתמש הגיע לדף הסיסמאות
    res.render('register',{title:'Ex4',Errors:'the time over'})//המשתמש יעבור לדף הרשמה ויוצג לו הודעת שגיאה שעבר הזמן
  }
  else {//אם לא חלפה יותר מדקה נכניס את נתוני המשתמש לטבלת המשתמשים במסד
      let data1 = req.body
      db.User.create({email:data.email_, firstName : data.fname, lastName: data.lname,password: data1.password_})
    res.render('login',{msg:''})//המשתמש יעבור לדף התחברות ויכניס שוב את המייל והסיסמא שבחר בתהליך הרישום
  }
});

module.exports = router;

