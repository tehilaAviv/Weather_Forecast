
//-------------------------------------------------------------------
(function () {//controller
    let result="";//מערך המשמש להצגת הנתונים בhtml
    let list=[];//מערך המכיל את רשימת פרטי הערים שהוזנו
    let locationData={};//מערך המשמש לשמירת פרטי המיקום
    let dataId;// משתנה שישמור את ה-ID של המשתמש
    let flag3=false;//משתנה בוליאני שיבדוק אם יש ערים כפולות ברשימה
//--------------------------------------------------------------------
    let  validation = (function () {//טיפול בעניין תקינות השדות
        let validationBlankFields = function(name,type){ //בדיקה שהשדות לא ריקים
            if(name===type)//אם השדה ריק נציג שגיאה למשתמש
                return true;
            else
            return false;
        };
     //---------------------------------------------------------------------
        let validationIsNotNum = function(name,type) {//בדיקה שהוכנס שם ולא מספר
            if(!isNaN(name)&&(name!==type))//אם הוכנס מספר נציג שגיאה למשתמש
                return true;
            else
                return false;
        };
        //-------------------------------------------------------------------
        let validationIsNotLetters = function(name,type) {//בדיקה שהוכנס מספר ולא אותיות
            if(isNaN(name)&&name!==type)//אם הוכנסו אותיות נציג שגיאה למשתמש
                return true;
            else
                return false;
        };

        //-------------------------------------------------------------------------------
        let validationRange  = function(num,value) {//בדיקה שהטווח של המספר שהוכנס עומד בדרישות
             if(num<=-value||num>=value)// !((num%1)===0)במקרה שהמספר לא תקין כלומר גם לא בטווח וגם לא עשרוני נציג הודעת שגיאה
                return true;
            else
                return false;
        };

        return {
            blankField: validationBlankFields,
            isNotNum: validationIsNotNum,
            isNotRange: validationRange,
            isNotLetter: validationIsNotLetters
        }

    })();
//------------------------------------------------------------------------
    let display = (function () {// ה-NAMESPACE הזה מטפל בכל הקשור לתצוגה והדפסה של הנתונים על המסך
        let displayErrors = function(error) {//פונקציה שמדפיסה למשתמש את השגיאות בהזנת הנתונים
            document.getElementById("error1").style.display="block";
            result = "<ul>";
            for(let i of error){
                if(i!==undefined)
                 result += "<li>" + i;
            }
            result += "</ol>";
            document.getElementById("list2").innerHTML = result;

        };
//------------------------------------------------------------------------

        function saveCities(){//פונקציה שמטפלת בהוספת עיר לרשימת הערים עבור כל משתמש
            validationFields();//קריאה לפונקציה שבודקת את תקינות השדות של פרטי העיר
            let arr=[];
            if(flag3==true){//אם הדגל שווה אמת, כלומר לא קיימת כבר עיר שהמשתמש בחר כעת ברשימה, אז תתבצע הוספת העיר לרשימת הערים
            getId().then(dataId=>{//קבלת ה-ID של המשתמש הנוכחי
            fetch("/cities/saveCity",{//שליחה לשרת
                method:'POST',
               body:JSON.stringify({city:locationData[0],lat:locationData[1],long:locationData[2],userId:dataId}),//שליחת הנתונים: שם העיר שהוכנסה, האורך והרוחב והID של המשתמש לשרת
                headers:{'Content-Type': 'application/json'}
            })
                .then(response=>{
                    return response.json();
                })
                .then(response=>{//אם העיר לא קיימת כבר ברשימה , נוסיף אותה לרשימת הערים ונציג את הרשימה
                    if(response.msg === "success"){
                        displayListUser();
                    }
                    else if(response.msg === "failed"){//אחרת, נוציא הודעת שגיאה שהעיר כבר קיימת
                        arr=['such a city already exists on the list,please enter different city'];
                        display.display_errors(arr);

                    }
                })
            })}
            flag3=false;
        }
        //------------------------------------------------------------------------

        let getId = async function(){//פונקציה זו אחראית לקבל את ה-ID של המשתמש, מתוך טבלת המשתמשים
            const result = await fetch("/get_id",{
                method:'POST',
                headers:{'Content-Type': 'application/json'}
            })
                const temp = await result.json()
                    return temp.id;

        };
        //-------------------------------------------------------------
        let displayListUser= function(){//פונקציה שמטפלת בהוצגת רשימת הערים של המשתמש
            getId().then(dataId =>{
            fetch("/cities/getCities",{//שליחה לשרת שיחזיר את רשימת הערים
                method:'POST',
                body: JSON.stringify({userId:dataId}),
                headers:{'Content-Type': 'application/json'}
            })
                .then(response=>{
                    return response.json();
                })
                .then(response=>{
                   list = response.list;
                   displayList(response.list)//קריאה לפונקצית שמציגה את רשימת הערים
                })
            })
        };
        //-------------------------------------------------------------

        let deleteCity_= function(list__){//פונקציה שמטפלת במחיקת העיר שנבחר מרשימת הערים של המשתמש
            getId().then(dataId =>{
                fetch("/cities/deleteCity",{
                method:'POST',
                body: JSON.stringify({userId:dataId,name1:list__ }),//שליחת ה-ID של המשתמש ושם העיר שרוצה למחוק, לשרת שיטפל בכך
                headers:{'Content-Type': 'application/json'}
            })
            })
        };
        //-------------------------------------------------------------

        let resetAllCities= function(){//פונקציה שמטפלת באיפוס רשימת הערים עבור כל משתמש
            getId().then(dataId => {
                fetch("/cities/resetList", {
                    method: 'POST',
                    body: JSON.stringify({userId: dataId}),//שליחת ה-ID של המשתמש לשרת שיאפס את רשימת הערים של המשתמש
                    headers: {'Content-Type': 'application/json'}
                })
            })
        };

        //----------------------------------------------------------------------
        let deleteError =  function() {//איפוס השגיאות
            document.querySelectorAll("#error1").reset();
        };
        //----------------------------------------------------------------------
        function getChosenPlace() {//פונקציה שמחזירה את העיר שנבחרה מתוך רשימת הערים
            let element = document.getElementsByName("CityChoice");
            for(let i = 0; i < element.length; i++) {
                if(element[i].checked) {
                    return element[i].value;
                }
            }
        }
       //-----------------------------------------------------------------------
        function loadImage(url){//פונקציה שמטפלת בטעינת תמונת התחזית
            return new Promise(function(resolve, reject) {
                 let img = new Image();
                img.src = url;
                img.onload = function() { resolve(img) }
                img.onerror = function(e) { reject(e) }
            });
        }

        //-----------------------------------------------------------------------------
        let displayWeather = function()  {// טיפול בהצגת תחזית מזג האוייר על המסך
            document.getElementById("imageLoad").style.display="block";
            let city = getChosenPlace();//קבלת שם העיר שהמשתמש בחר מתוך הרשימה
            for(let i=0;i<list.length;i++)//מעבר בלולאה על רשימת הערים והבאת נתוני מזג האוייר של העיר שנבחרה
            {
                if(list[i].name===city)
                {
                    let url= "http://www.7timer.info/bin/api.pl?lon="+list[i].long+"&lat="+list[i].lat+"&product=civillight&output=json"//בניית הURL המתאים של העיר שנבחרה על ידי שרשור האורך והרוחב שלה
                    handleWeatherForecast.load_Weather(url);//שליחה לפונקציה שטוענת את הנתונים אודות מזג האויר ומציגה אותם על המסך
                    let image2= document.getElementById("image_forecast");
                    let urlImg="http://www.7timer.info/bin/astro.php?%20lon="+list[i].long+"&lat="+list[i].lat+"&ac=0&lang=en&unit=metric&output=internal&tzshift=0"//בניית הURL שיציג את תמונת התחזית של העיר שנבחרה
                    image2.src=urlImg;
                    //

                    document.getElementById("show_img").style.display="block";

                    let imgPromise = loadImage(urlImg);//טעינת התמונה למסך
                    imgPromise.then(function(img){
                        let img1= document.getElementById("image_forecast");
                        if(img1.hasChildNodes())//אם יש כבר תמונת תחזית על המסך מעיר שנבחרה מפעם קודמת נסיר אותה ואז נוסיף את תמונת התחזית של העיר העדכנית
                            img1.removeChild(img1.lastChild);
                        img1.appendChild(img);
                    }).catch(function(e){//טיפול בשגיאות בעת טעינת תמונת התחזית
                       let img_err = document.getElementById("imageError")
                        img_err.classList.toggle("d-none");//אם השרת מחזיר error עבור התמונה, נציג תמונה דפולטיבית
                        console.log(e);
                    });


                }
            }
        };
        //----------------------------------------------------------------------------
        let displayList = function(list_) {//הצגת הרשימה עם הערים שהמשתמש הוסיף
            let html = "";
            let index = 0;
            for (var i of list_) {// בניית הHTML של הכפתור בחירה ברשימה ולידו שם העיר
                html += "<div class=" + "custom-control" + ">"
                    + "<input class=" + "custom-control-input" + " type=" + "radio" + " id=" + "defaultCheck" + index + " value=" + i.name + " name=" + "CityChoice" + ">"
                    + " <label class=" + "custom-control-label" + " for= " + "defaultCheck" + index + ">"
                    + i.name +
                    "</label" + ">"
                    + "</div" + ">";
                index++;
            }
            document.getElementById("list1").innerHTML = html;
        };


        return {
            display_errors: displayErrors,
            delete_error: deleteError,
            display_Weather: displayWeather,
            Chosen_Place: getChosenPlace,
            display_List:displayList,
            save_Cities:saveCities,
            get_Id:getId,
            display_ListUser: displayListUser,
            delete_City_:deleteCity_,
            reset_All_Cities:resetAllCities

        }

    })();
//-------------------------------------------------------------------------
    let handleList = (function () {//כאן מתבצע כל הטיפול ברשימת הערים

        let buildHtmlList = function(locationData) {//פונקציה שאחראית על בניית הרשימה והצגתה
            document.getElementById("error1").style.display="none";
            let flag1 = false;
            for (let i=0;i<list.length;i++){//בדיקה אם הוכנסה עיר שכבר קיימת ברשימה
                if(list[i][0]===locationData[0])
                    flag1=true;
            }

            if(flag1===false){//אם העיר אינה כבר ברשימה נוסיף אותה לרשימה
            list.push(locationData);//הכנסת פרטי המקום למערך שיכיל את כל הערים שיתווספו לרשימה
                flag3=true;//דגל אישור הוספת הערים אם אין עיר כזאת כבר במסד הנתונים
            }
        };
        //------------------------------------------------------------------------
        let removeCity = function() {//פונקציה שמטפלת במחיקת עיר מהרשימה
            let city1=display.Chosen_Place();//קבלת העיר שהמשתמש בחר
            let isFound=false;
            let wantedIndex;
            let listName;
                for (let i in list)//מעבר בלולאה על הרשימה ומציאת העיר שנבחרה לשם מחיקתה
                    if (list[i].name===city1) {
                        isFound = true;
                        wantedIndex = i;
                        listName=list[i].name;
                        break
                    }
                if (isFound)//מחיקת העיר הרצויה
                    display.delete_City_(listName);
            //}
            display.display_ListUser();//הצגת הרשימה לאחר המחיקה
        };
        let resetList = function() {//פונקציה שמטפלת במחיקת עיר מהרשימה
            display.reset_All_Cities();
            display.display_ListUser();//הצגת הרשימה לאחר המחיקה
        };

        return {
            buildList: buildHtmlList,
            remove_city:removeCity,
            reset_list:resetList
        }

    })();
//---------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function(){//טיפול באירועים
        document.getElementById("imageLoad").style.display="none";//הסתרת תמונת טעינה
        document.getElementById("show_img").style.display="none"//הסתרת התמונה
        document.getElementById("error1").style.display="none";//הסתרת השגיאות
        document.getElementById("weather_").style.display="none";//הסתרת ה HTML של המזג האוויר
        document.getElementById("remove").addEventListener('click', handleList.remove_city);//בעת לחיצה על כפתור הסרה תופעל הפונקציה שאחראית למחוק מהרשימה
        document.getElementById("reset").addEventListener('click', handleList.reset_list);//בעת לחיצה על כפתור איפוס תופעל הפונקציה שאחראית לאפס את הרשימה
        document.getElementById("display").addEventListener("click",display.display_Weather);//בעת לחיצה על כפתור הצגת מז האוויר תופעל הפונקציה שאחראית לטעון את התחזית
        document.querySelector("button").addEventListener("click", display.save_Cities);// בעת לחיצה על כפתור הוספה תופעל הפונקציה שבודקת ולידציה וכשהכל תקין  העיר תווסף לרשימה
         display.get_Id();
         display.display_ListUser();

    }, false);

//-----------------------------------------------------------------------------
    function validationFields(){//פונקציה שבודקת ולידציה של השדות,מציגה שגיאות בעת הצורך וכשהכל תקין מוסיפה ערים לרשימה
        let name=document.getElementById("cname").value.trim();
        let lat=document.getElementById("lat").value.trim();
        let long=document.getElementById("long").value.trim();
        locationData=[name,lat,long];//שמירת נתוני המיקום שהמשמש הכניס במערך
        let namesFields=['city name','latitude','longitude']//מערך המכיל את שמות השדות
        let errors=[' :missing',' :not name',' :not in range',' :not decimal number',' :not number']//מערך המכיל את כל השגיאות שיכולות להיות
        let arr=[];//מערך לשמירת הדפסת השגיאה, כלומר- אליו יוכנס השדה השגוי וסוג השגיאה
        let flag=false;
        for (let i=0; i< locationData.length;i++) {
            if(validation.blankField(locationData[i],"")){//אם השדה ריק נדפיס את השגיאה המתאימה
                arr[i]=[namesFields[i]+errors[0]];
                display.display_errors(arr);
                flag=true;
              }
            else if(validation.isNotNum(locationData[0],"")&&i===0){//  אם בשדה של שם העיר הוכנסו מספרים נדפיס את השגיאה המתאימה
                arr=[];
                arr[i]=[namesFields[0]+errors[1]];
                display.display_errors(arr);
                flag=true;
            }

            else if(validation.isNotLetter(locationData[i],"")){//בדיקה בשדות של האורך או הרוחב שלא הוכנסו אותיות,אם הוכנסו אותיות ולא מספר נדפיס את השגיאה המתאימה
                if( i===1||i===2)
                {
                    arr[i]=[namesFields[i]+errors[4]];
                    display.display_errors(arr);
                    flag=true;
                }
            }

            else if(validation.isNotRange(locationData[1],90)){//נציג את השגיאה המתאימה אם הרוחב הוא לא מספר עשרוני בטווח:-90-90

                    arr[1]=[namesFields[1]+errors[2]];
                display.display_errors(arr);
                flag=true;

            }
            if(validation.isNotRange(locationData[2],180)){//נציג את השגיאה המתאימה אם הרוחב הוא לא מספר עשרוני בטווח:-180-180

                arr[2]=[namesFields[2]+errors[2]];
                display.display_errors(arr);
                flag=true;
            }


        }
        if(flag===false)  {//אם כל השדות תקינים נקראה לפונקציה שמוסיפה את העיר לרשימה ובונה אותה
            handleList.buildList(locationData);
        }
    }
//---------------------------------------------------------------------------

    let handleWeatherForecast = (function () {//טיפול בתחזית מזג האוויר
        function status(response) {//בדיקת תקינות הסטטוס
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject("The page is not found!")
            }
        }

        function json(data) {
            return data.json()
        }
//--------------------------------------------------------------------------
        let loadWeather = function loadWeatherForecast (url) {//פונקציה שטוענת את תחזית מזג האויר
            fetch(url)
                .then(status)
                .then(json)
                .then(
                    function (response) {//פונקציה שמציגה  את נתוני מזג האוויר הרצויים מתוך התחזית המכילה את כל הפרטים
                        let html = "<h2> " + "forecast weather" + "</h2>";
                        for (let i in response.dataseries) {// המרת נתוני מזג האוויר והצגתם באופן מילולי וברור יותר כפי שנדרש בתרגיל
                            if(response.dataseries[i].weather==="pcloudy")
                            html += "<li>"+"weather: " + "partly cloudy" + ", "
                            else if(response.dataseries[i].weather==="vcloudy")
                                html += "<li>"+"weather: " + "very cloudy" + ", "
                            else if(response.dataseries[i].weather==="ishower")
                                html += "<li>"+"weather: " + "isolated showers" + ", "
                            else if(response.dataseries[i].weather==="lightrain ")
                                html += "<li>"+"weather: " + "light rain" + ", "
                            else if(response.dataseries[i].weather==="oshowers ")
                                html += "<li>"+"weather: " + "occasional showers" + ", "
                            else
                                html += "<li>"+"weather: " + response.dataseries[i].weather + ", "//כל שאר נתוני מזג האיור יודפסו כפי שהם מוצגים בקובץ JSON
                                +"temperature(max,min): "//חילוץ הטמפרטורה והדפסתה
                            for (j in response.dataseries[i].temp2m) {
                                html += response.dataseries[i].temp2m[j] + ", "
                            }
                            if(response.dataseries[i].wind10m_max!=1)//בדיקה אם מצב הרוח שווה ל-1,אם כן לא נדפיסו
                            html +=  "wind: "+ response.dataseries[i].wind10m_max;//חילוץ מצב הרוח והדפסתה
                            html += "</li>"
                        }
                        document.getElementById("imageLoad").style.display="none";
                        document.getElementById("weather_").style.display="block";//הצגת הHTML של נתוני התחזית
                        document.querySelector("#listWeather").innerHTML = html;//הדפסת כל נתוני מזג האוויר
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :', err);
                });
        };
        return {
            load_Weather: loadWeather

        }
    })();

})();













