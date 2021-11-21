
let result="";
        function checkPasswords () {//פונקציה שבודקת אם הסיסמאות שהוכנסו אותו דבר
         let arr=[];
                let pass1 = document.getElementById("password_").value;
                let pass2 = document.getElementById("rePassword").value;
                    if(pass1!==pass2) {//במקרה שהסיסמאות אינן שוות תשלח הודעת שגיאה
                        arr=['the password and the rePassword ara not same']
                        displayErrors(arr);
                        return false;

                    }
                }


//----------------------------------------------------------------------------------
 function displayErrors(error) {//פונקציה שמדפיסה למשתמש את השגיאות בהזנת הסיסמאות
    document.getElementById("error1").style.display="block"
    result = "<ul>";
    for(let i of error){
        if(i!==undefined)
            result += "<li>" + i;
    }
    result += "</ol>";
    document.getElementById("list2").innerHTML = result;

}
//---------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function(){//טיפול באירועים
       document.getElementById("error1").style.display="none";//הסתרת השגיאות
       }, false);

