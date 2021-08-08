//복호화 함수(양방향)
function decryptize(reveiveData){
    const kluchi ="intelligenceResource";
    var bytes  = CryptoJS.AES.decrypt(reveiveData, kluchi);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    decryptedData = decryptedData.substring(1,decryptedData.length-1);
    //console.log("decryptedData =>>",decryptedData);
    return decryptedData;
}
//암호화 함수(양방향)
function encryptize(receiveData){ 
    //console.log("encryptize", receiveData);
    const kluchi ="intelligenceResource";
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(receiveData), kluchi).toString();
    return ciphertext;
}
//암화화 함수(단방향)
// function encrytPin(receiveData){
//     Crypto.randomBytes(64,(err,buf)=>{
//         Crypto.PBKDF2(receiveData, buf.toString('base64'), 102451, 64, 'sha512',(err,result) =>{
//             var encrptedPin = result.toString('base64');
//         });
//     });
//     return
// }
//공유받은자의 링크클릭으로 접근시 url 복호화후 json object 로만듬
//result 값의 반환형식 {fileId:  user:    auth:   owner: } 
function getUrlParms(_url){
    var url = _url;
    url = url.substring(url.indexOf('?') + 1);
    url = decryptize(url.substring(url.indexOf('?') + 1));
    var qs = url.split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}
//브라우져에서 뒤로가기 불능화
function notAllowBackButtonInBrowser(){
    history.pushState(null, document.title, location.href); 
    window.addEventListener('popstate', function (event) { 
        //console.log(location.href);
        history.pushState(null, document.title, location.href); 
    });
}
//백스페이스 키보드 불능화
function notAllowBackspaceKeyboardButton(){
    var killBackSpace = function (e) {
        e = e ? e : window.event;
        var t = e.target ? e.target : e.srcElement ? e.srcElement : null;
        if (t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() == 'textarea') {
            return true;
        }
        var k = e.keyCode ? e.keyCode : e.which ? e.which : null;
        if (k == 8) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        } 
        return true;
    };
    //실제 백스페이스 적용
    //keydown, onkeydown 발생되도록함
    if (typeof document.addEventListener != 'undefined') {
        document.addEventListener('keydown', killBackSpace, false);
    } else if (typeof document.attachEvent != 'undefined') {
        document.attachEvent('onkeydown', killBackSpace);
    } else {
        if (document.onkeydown != null) {
            var oldOnkeydown = document.onkeydown;
            document.onkeydown = function (e) {
                oldOnkeydown(e); killBackSpace(e);
            };
        } else {
            document.onkeydown = killBackSpace;
        }
    }
}
//사업자 형식확인- 조건추가할것(마스크형식)
function corporateRegistrationNumber(companyNo){
    if (companyNo.length != 10){
        webix.alert("형식에 맞지 않습니다. 확인해주세요")
        return false;
    };
};
//입력받은 비밀번호의 보안형식 부합여부검사
function fnCheckPassword(upw) {
    if(upw.length<6) {
        alert("비밀번호는 영문,숫자,특수문자(!@$%^&* 만 허용)를 사용하여 6~16자까지, 영문은 대소문자를 구분합니다.");
        return false;
    }
    if(!upw.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
        alert("비밀번호는 영문,숫자,특수문자(!@#$%^&* 만 허용)를 사용하여 6~16자까지, 영문은 대소문자를 구분합니다.");
        return false;
        }
        var SamePass_0 = 0; //동일문자 카운트
        var SamePass_1 = 0; //연속성(+) 카운드
        var SamePass_2 = 0; //연속성(-) 카운드
        for(var i=0; i < upw.length; i++) {
            var chr_pass_0 = upw.charAt(i);
            var chr_pass_1 = upw.charAt(i+1);
            //동일문자 카운트
            if(chr_pass_0 == chr_pass_1) {
                SamePass_0 = SamePass_0 + 1
            }
            var chr_pass_2 = upw.charAt(i+2);
            //연속성(+) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1) {
                SamePass_1 = SamePass_1 + 1
            }
            //연속성(-) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1) {
                SamePass_2 = SamePass_2 + 1
            }
        }
        if(SamePass_0 > 1) {
            alert("동일문자를 3번 이상 사용할 수 없습니다.");
            return false;
        }
        if(SamePass_1 > 1 || SamePass_2 > 1 ) {
            alert("연속된 문자열(123 또는 321, abc, cba 등)을\n 3자 이상 사용 할 수 없습니다.");
            return false;
        }
    return true;
} 

//비밀번호 형식 확인과 메세지 번환
function fnCheckPasswordMessage(upw) {
    if(upw.length<6) {
        return [false, "비밀번호는 영문,숫자,특수문자(!@$%^&* 만 허용)를 사용하여 6~16자까지, 영문은 대소문자를 구분합니다."];
    };
    if(!upw.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
        return [false, "비밀번호는 영문,숫자,특수문자(!@#$%^&* 만 허용)를 사용하여 6~16자까지, 영문은 대소문자를 구분합니다."];
    };
        var SamePass_0 = 0; //동일문자 카운트
        var SamePass_1 = 0; //연속성(+) 카운드
        var SamePass_2 = 0; //연속성(-) 카운드
        for(var i=0; i < upw.length; i++) {
            var chr_pass_0 = upw.charAt(i);
            var chr_pass_1 = upw.charAt(i+1);
            //동일문자 카운트
            if(chr_pass_0 == chr_pass_1) {
                SamePass_0 = SamePass_0 + 1
            }
            var chr_pass_2 = upw.charAt(i+2);
            //연속성(+) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1) {
                SamePass_1 = SamePass_1 + 1
            }
            //연속성(-) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1) {
                SamePass_2 = SamePass_2 + 1
            }
        };
        if(SamePass_0 > 1) {
            return [false, "동일문자를 3번 이상 사용할 수 없습니다."];
        };
        if(SamePass_1 > 1 || SamePass_2 > 1 ) {
            return [false, "연속된 문자열(123 또는 321, abc, cba 등)을\n 3자 이상 사용 할 수 없습니다."];
        };
    return [true, ""];
} 

//생년월일 검증하기
function isValidDate(dateStr) {
    var year = Number(dateStr.substr(0,4)); 
    var month = Number(dateStr.substr(4,2));
    var day = Number(dateStr.substr(6,2));
    var today = new Date(); // 날자 변수 선언
    var yearNow = today.getFullYear();
    var adultYear = yearNow-20;


    if (year < 1900 || year > adultYear){
        webix.alert("년도를 확인하세요. "+adultYear+"년생 이전 출생자만 등록 가능합니다.");
         return false;
    }
    if (month < 1 || month > 12) { 
        webix.alert("달은 1월부터 12월까지 입력 가능합니다.");
         return false;
    }
   if (day < 1 || day > 31) {
    webix.alert("일은 1일부터 31일까지 입력가능합니다.");
         return false;
    }
    if ((month==4 || month==6 || month==9 || month==11) && day==31) {
        webix.alert(month+"월은 31일이 존재하지 않습니다.");
         return false;
    }
    if (month == 2) {
         var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
         if (day>29 || (day==29 && !isleap)) {
            webix.alert(year + "년 2월은  " + day + "일이 없습니다.");
              return false;
         }
    }
    return true;
}

//access by Sharee -> open file URL
function sharedUserLogin(sharedlogin,result){
    //형식확인 -> result.ID , result.user, result.owner, result.filepath
    //console.log("result", result);              
    webix.ajax(sharedlogin + "?id=" + result.owner + "&shareduser=" + result.user)
         .then(function (a) { 
            userGubun = 3;
            var loginData = a.json();
            //console.log("result", loginData);               
            if (loginData.length == null){

            }else{
                sessionStorage.setItem("usergubun", userGubun);
                sessionStorage.setItem("shareduser", result.user);
                for (var i = 0; i < loginData.length; i++) {
                    sessionStorage.setItem(loginData[i].value, loginData[i].rulchk);
                }
                sessionStorage.setItem("AuthDownload", 1);
                
                //var userid = sessionStorage.getItem("userid");
                //file URL 로
                location.replace("file");
            }
    });
}
// set 쿠키  
function setCookie(name, value, expiredays) 
{
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires="
            + todayDate.toGMTString() + ";"
}
// call 쿠키  
function getCookie(Name) { 
    var search = Name + "=";
    if (document.cookie.length > 0) { // if there are any cookies
        offset = document.cookie.indexOf(search);
        if (offset != -1) { // if cookie exists
            offset += search.length; // set index of beginning of value
            end = document.cookie.indexOf(";", offset); // set index of end of cookie value
            if (end == -1)
                end = document.cookie.length;
            return unescape(document.cookie.substring(offset, end));
        }
    }
}

//add-leejs 20201203 세션의 권한을 받아서 boolen 으로 반환
function StrtoBol(cUserAuth) {
    var chk = sessionStorage.getItem(cUserAuth);
    //console.log("메뉴명, 권한 ",  cUserAuth + ", " + chk);
    if (chk == "0") {
        return false;
    } else {
        return true;
    }
}

function formatTemplate(size) {
    if (size >= 1099511627776)
    return (size / 1099511627776).toFixed(1) + " Tb";
    if (size >= 1073741824)
        return (size / 1073741824).toFixed(1) + " Gb";
    if (size >= 1048576)
        return (size / 1048576).toFixed(1) + " Mb";
    if (size >= 1024)
        return (size / 1024).toFixed(1) + " kb";
    return size + " b";
}

//문자열리 undefined, null, ""  boolen 반환한다
function isEmpty(str){
    if (typeof str == "undefined" || str == null || str == ""){
        return true;
    } else {
        return false ;
    };    
}

//날짜 포멧 변경
function FormatDate(date) {
    var dateMask = "%Y년 %m월 %d일, %H:%i:%s";
    var dateCommonFormat = webix.Date.dateToStr(dateMask);
    var dateFromISO = function (string) { return new Date(string); };

    if (date) {
        date = dateFromISO(date);
        date = dateCommonFormat(date);
    }
    return date || "";
};
