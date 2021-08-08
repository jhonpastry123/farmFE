//--------------------[Ajax url 정의 및 변수선언]-------------------------------------------------
const chatloginAjaxURL 		= "http://localhost:8050/login";
const chatStartAjaxURL		= "http://localhost:8050/api/v1";
const docManagerAjaxURL		= "http://localhost:3200/";
const chunkAjaxURL		    = "http://localhost:3200/uploadchunk";
const logoutThumbDelete     = "http://localhost:3200/deleteThumbnil"  //로그아웃시  thumbnil 폴더 삭제
const sharedURL				= "http://localhost/";					  //메일공유시 보내어질 URL 의 Prifix문자열
var	  isGov					= true; 		// 관공서용에서 필요없는 버튼을 숨기기위한 패리티
//---------------------[./ End. ]---------------------------------------------------
var preUploadCount 			= 0; 			// 드레그드롭된  파일의 갯수를 저장하기위한변수
var uploadedCount 			= 0; 			// 업로드가 실행된 파일의 갯수를 저장하기위한 변수
var totUploadedSize 		= 0; 			// 업로드가 실행된 파일들의 총 바이트를 적산하여  크기를 저장
var isFileDialog 			= false; 		// 파일업로드 팝업창 띄우는 조건변수 - 파일다이얼로그방식인경우
var qntyOfUploadFiles		= 0;			// 업로드할 파일의 총갯수 저장변수
var sizeOfUploadFiles		= 0;			// 업로드할 파일의 총크기 저장변수
var uploadAfterCount		= 0; 			// 업로드되고난후의 남은 파일의 갯수 저장변수
var errorUploadfile         = new Array();  // 업로드 실패 횟수
var errorUploadCount        = 0;			// 실패한업로드 1번이상 안되도록 하기위한 카운터





//--------------------[Ajax url 정의 끝]-------------------------------------------------
//chunk upload 를 위한 각 chunk 를 보내기위한  url 파라미터 생성
function getURL(config) {
    const urlData = config.urlData || {};
    //let url = config.upload || "";
    let url = chunkAjaxURL || "";
    let urlParams = ""
    let paramsArr = [];
    for (var key in urlData)
        paramsArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(urlData[key]));
    if (paramsArr.length)
        url += ((url.indexOf("?") == -1) ? "?" : "&") + paramsArr.join("&");
    return url;
};
//대량파일 보낼경우 resource error 방지을 위한 일정수량만큼의 파일 그룹핑후 업로드시 사용
function delay(t, v) {
return new Promise(function (resolve) {
setTimeout(resolve.bind(null, v), t)
});
}
//업로드실행함수
function NewUploader(uploadGubun) {
const uploader = $$("myupload");		// 업로드 initiation
var uploadLimit = 500;                	// 한번에 업로드하는 파일의 갯수
var uploadLimitSize = 1024 * 3000000;   // 파일크기가 3GB 이상이면 정크로 업로드
var chunkLimitSize = 1024 * 1000;       // 각 정크파일의 크기 100KB
var allCount = 0;                       // 업로드 대상 파일의 총갯수 변수
var largeFile = new Array();			// 정크방식 업로드할 파일들의 Id를 적재할 배열변수
var uploadIdArry = new Array();         // 업로드 리스트 File ID
var delayCnt = 1;    					// uploadLimit 리미트 단위별로 for문이 실행될때 1씩 증가됨 수량이 을수록 쌓이는 데이턱 많아서 딜레이를 길게줌
// 업로드실패한 파일들의 재시도를 위한 설정
// uploadGubun 구분 값에 따라 정상 업로드 일경우 uploader.files.data.order id 만 업로드
//			                 오류 업로드 일경우 errorUploadfile 등록된 id 만 업로드함
if(uploadGubun == "normal"){						//업로드가 성공한경우
uploadIdArry = uploader.files.data.order;
allCount = uploader.files.count()
}else{
for(i = 0; i <= errorUploadfile.length-1; i++){ //업로드가 실패한경우
    uploadIdArry.push(errorUploadfile[i].id);
};						
allCount = errorUploadfile.length
};

//업로드 진행 모달창 셋팅하기
//원인 : 개별 파일 일경우 업로드 완료 이벤트가 빠르게 발생하여 창이 나타나면서 리스트 및 카운터가 진행되지만
//       정크 같은경우 정크를 전부 보내고 리스트가 나타나기 때문에 시작점에서 공백이 생김
var file = uploader.files.getItem(uploadIdArry[0]);
$$("uploadingFilesItems").setValues({ items: file.name }); 						//작은화면용
$$("uploadingFilesInfo").setValues({ counter: allCount, totalQnty: allCount }); //작은화면용
$$("uploadingFilesStatus2").setValues({ ing: "" });								//작은화면용
//$$("uploadingFilesStatus1").setValues({ transferedPer: "0 %"});				//작은화면용

//업로드실행함수호출- 일반파일과 large 파일을 구분하여 함수호출
uploadfunc(0);
//업로드실행중 LargeFile 를 만난경우 largeFile 변수에 적재되고 해당파일을 정크로 업로드하기위한 함수호출
if(largeFile.length != 0){
largeUpload();
};

//일반크기파일의 업로드처리-재귀함수
function uploadfunc(cnt) {
//모든파일이 업로드된경우
if (allCount == cnt) {
    return;
};

//1. 파일수량이 uploadLimit 이하
if (cnt <= uploadLimit) {
    uploadSendandLargeFileCollect(cnt);
    cnt++;
    uploadfunc(cnt);
//2. 파일수량이 uploadLimit 이상- delay time 을 처리하기위하여 두가지경우로 나눔	
} else {
    //2-1. 잔여파일수량이 uploadLimit 이하 - 남은갯수많큼 루프돌려 send한다
    if ((allCount - cnt) <= uploadLimit) {
        var last = cnt
        delay(delayCnt * 5000).then(function() {
            for (i=0; i <= (allCount - last)-1; i++ ){
                uploadSendandLargeFileCollect(cnt);
                cnt++;
            };
            delayCnt ++;
            uploadfunc(cnt);
        });
    //잔여파일수량이 여전히 uploadLimit 보다 많은경우 - uploadLimit 많큼 루프돌려 send 한다
    } else{
        delay(delayCnt * 5000).then(function() {
            //	console.log("큰분류");
            for (i=0; i <= uploadLimit-1; i++ ){
                uploadSendandLargeFileCollect(cnt);
                cnt++; 
            };
            delayCnt ++
            uploadfunc(cnt);
        });
    };
}
}//function uploadfunc(cnt)
//대상파일의 크기에따라 업로드전송또는 Large 파일에 적재한다->추후정크로 업로드하기위함
function uploadSendandLargeFileCollect(cnt){
var file = uploader.files.getItem(uploadIdArry[cnt]);
if (file.size <= uploadLimitSize){
    uploader.send(uploadIdArry[cnt]);
} else {
    largeFile.push(uploadIdArry[cnt]);
};
}
//대용량 파일 정크를 해야 하는 부분
//참조 => https://forum.webix.com/discussion/4879/spinner-loader-waiting-ajax-request-to-be-finished
function largeUpload() {
//업로드가될 대상폴더위치 
var uploadLocation = $$("cTree").getSelectedId();
//chunk 업로드를 위한 url 파라미터값 결정
var url = getURL(uploader);
//재귀함수호출
fileChk(0);
// [-------------- I. Large 각파일업로드 함수 - 재귀호출 -------------]
function fileChk(fileNum) {
    //모든 large 파일이 업로드되면 return
    if (fileNum == largeFile.length) {
        return;
    };
    //대상파일 추출
    var file = uploader.files.getItem(largeFile[fileNum]);
    var id = largeFile[fileNum];
    //console.log("chunks id", id);

    //Large파일배열중 인덱스번호 0일경우 업로드 모달창에 출력되는 값셋팅
    // if (fileNum == 0) {
    // 	$$("uploadingFilesItems").setValues({ items: file.name }); //작은화면용
    // 	$$("uploadingFilesInfo").setValues({ counter:  largeFile.length, totalQnty: allCount});//작은화면용	
    // }

    //대용량 파일의 정크파일 만들기
    // 1. 정크의 크기
    const chunkSize = chunkLimitSize;
    // 2. 정크파일 갯수계산	 
    const chunksQuantity = Math.ceil(file.size / chunkSize);
    // 3. 정크파일을 순서대로보내기위한 정크파일 인덱스를 역순으로 한 배열맵 처리
    const chunksQueue = new Array(chunksQuantity).fill().map((_, index) => index).reverse(); //배열순서변경 desc
    // 4. 정크파일로 쪼개기위하여 파일을 바이너리로 저장한다
    var filedata = file.file;
    // 5. 업로드가 된 정크파일의 누적바이트
    var progressSize = 0;
    //console.log(file);
    //console.log("showProgress", file.name);

    //다음파일을 정크업로드 함수로 업로드할 파일의 인덱스번호를 보낸다
    sendNext(fileNum);
    // 6. 정크파일 업로드처리 - 재귀호출

    // [-------------- II. 선택된 Large 파일의  각정크를 업로드하는 함수 - 재귀호출 --]
    function sendNext(fileNum) {
        //해당파일의 모든 chunk 가 업로드 완료된경우 - 해당파일의 업도드완성을리턴하고 프로그레스를 종료한후 다음파일을 다시 시작한다
        if (!chunksQueue.length) {
            $$("uploadingFilesStatus2").setValues({ ing: "" });//작은화면용
            uploader._file_complete(id);
            fileNum++;
            fileChk(fileNum);
            return;
        };
        //var repatchkCount = 0;
        //chunksQueue 를 reverse 했으므로 pop 하면 0번부터 빠진다
        // 1. 정크파일 인덱스값을 끄집어낸다(맨뒤에서부터-맵팽에서 역순으로 했으므로 가장 낮은 인덱스값임)
        const chunkId = chunksQueue.pop();
        // 2. 정크파일을 추출하기위한 slice 시작위치값 계산
        const begin = chunkId * chunkSize;
        // 3. 정크바이너리을 추출한다.
        const chunk = filedata.slice(begin, begin + chunkSize);
        //console.log("chunksQueue", chunksQueue.length);
        //console.log("ChunkId", chunkId);
        // 4. 추출된 정크파일 업로드 실행후 결과에따른 콜백처리
        chunkupload().then((restext) => {
            // if (resText=="OK") {
            // 	//정크하나 보내고 리시브 값 받아들여서 뿌리는 곳
            // };
            progressSize = progressSize + chunk.size;					           // 업로드된 누계바이트
            var progressValue = Math.round((progressSize/file.size) * 100)         // 위에서 계산된 누계를 백뷴율로 계산 하여 
            $$("uploadingFilesStatus2").setValues({ ing: progressValue + " %" });  // uploadingFilesStatus2	업데이트 실시
            $$("uploadingFilesprogressbar").setValues({ status: "transfer", percent : progressValue});  // uploadingFilesStatus2	업데이트 실시

            file.percent = progressValue;
            sendNext(fileNum);

        }).catch((error) => {
            //** 해당정크업로드가 에러나면 chunkId 를 다시 push 한다.
                chunksQueue.push(chunkId);
            // //한개의 정크가 에러나면 해당파일을 에러처리한다 즉 위의코드처럼 에러정크를 다시전송하지않는다
            file.status = "error";
            delete file.percent;
            uploader.files.updateItem(id);
            //업로드에러처리이벤크를 호출하여 에러파일을 저장하도록한다
            uploader.callEvent("onFileUploadError", [file, null]);
                    
            fileNum++;
            fileChk(fileNum);
            return ;
        });
        // 5. 정크파일 업로드실행 함수
        function chunkupload() {
            return new Promise((resolve, reject) => {
                //var item = uploader.files.getItem(id);
                // 1. 인스턴스 생성
                const xhr = webix.ajax().getXHR();
                const formData = new FormData();
                // 2. formData 작성
                formData.append("userid",sessionStorage.getItem("userid"));
                formData.append("target", uploadLocation);
                formData.append("chunksQuantity", chunksQuantity);
                formData.append("chunk_id", chunkId);

                formData.append("file_id", file.id);
                formData.append("file_size", file.size);
                formData.append("chunk_size", chunk.size);
                formData.append("file_name", file.name);
                formData.append("chunk", chunk);

                // ???
                //xhr.addEventListener('progress', handleEvent);
                // 3.
                //타임아웃 여부를 저장한다.
                //var timedout = false;
                //타이머를 시작하며, 지정된 시간을 넘길 경우 요청을 중단한다.
                // var timer = setTimeout(function() {    //타이머를 시작한다. 타임아웃되면,
                // 	//플래그를 설정한 다음,
                // 	timedout = true;
                // 	//요청을 중단시킨다.
                // 	request.abort();
                // 	}, timeout);

                //기존 webix 루틴 =========================================================================
                // xhr.upload.addEventListener("progress", bind(function (e) {
                // 	this.$updateProgress(id, e.loaded / e.total * 100);
                // }, this), false);

                // $updateProgress: function (id, percent) {
                // 	var item = this.files.getItem(id);
                // 	item.percent = Math.round(percent);
                // 	this.files.updateItem(id);
                // },
                //기존 webix 루틴 =========================================================================
                
                // progress 를 통해서 업로드 할때 주기적으로 확인하여 file.percent에 저장함
                // 기존에 방식은 리스트를 뿌리고 개별 파일의 file status = transfer || server 일때 file.percent 를 나타냄
                // 현재는 완료된 파일을 개별로 뿌리기 때문에 위와같은 방식을 사용할수 없음

                // 4.퀘스트 요청방식과 url 정의, 비동기(동기)방식
                xhr.open("POST", url, true);
                // 4. 헤더 셋팅(예시임)
                // 	   request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                // 6. 파일 전송 요청 응답에 대한 처리	
                xhr.onreadystatechange = () => {
                        //성공했을때 resolve
                        //실패했을때 reject
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            file.xhr = xhr;
                            resolve(xhr.responseText);
                        } else  if (xhr.readyState === 4 && xhr.status === 600) {
                            reject(xhr.responseText);
                        };
                };
                xhr.onerror = reject;
                xhr.send(formData);
            });//return new Promise
        };//function chunkupload()
    };//function sendNext(fileNum)
};//function fileChk(fileNum)
};//function largeUpload()
};//function NewUploader(uploadGubun)
//각 변수값 초기화 처리함수 
function initialize() {
var id = $$("myupload").files.getFirstId();
while (id) {
$$("myupload").stopUpload(id);
id = $$("myupload").files.getNextId(id);
}
//console.log("취소시작");
preUploadCount = 0; 		// 드레그드롭된  파일의 갯수를 저장하기위한변수
uploadedCount = 0; 		    // 업로드가 실행된 파일의 갯수를 저장하기위한 변수
totUploadedSize = 0; 		// 업로드가 실행된 파일들의 총 바이트를 적산하여  크기를 저장
isFileDialog = false; 	    // 파일업로드 팝업창 띄우는 조건변수 - 파일다이얼로그방식인경우
qntyOfUploadFiles = 0;		// 업로드할 파일의 총갯수 저장변수
sizeOfUploadFiles = 0;		// 업로드할 파일의 총크기 저장변수
uploadAfterCount = 0; 		// 업로드되고난후의 남은 파일의 갯수 저장변수
//chk = false;              // 중복폴더 체크용 임시 변수
errorUploadfile = new Array();
errorUploadCount = 0;             // 에러업
$$("uploadingFilesItems").setValues({ items: "" }); //작은화면용
$$("uploadingFilesInfo").setValues({ counter: 0, totalQnty: preUploadCount });//작은화면용
$$("uploadingFilesStatus2").setValues({ ing: "" });//작은화면용
$$("myupload").files.data.clearAll();	
};//function initialize()
//재업로드 확인버튼
function errorUploadConfirm(){
initialize();
uploadErrorMessageBox.hide();
};
//재업로드 재실행 버튼
function errorUploadRetry(){
uploadErrorMessageBox.hide();
uploadMessageBox.show();
NewUploader("errorUpload");
errorUploadfile = new Array();
errorUploadCount = 1;
};
//드래그 드롭한 모든파일(100개이상의 폴더나 파일)을 적산하기위한 함수
async function getFilesFromDataTransferItems(dataTransferItems, options = { raw: false }) {
const checkErr = (err) => {
if (getFilesFromDataTransferItems.didShowInfo) return;
if (err.name !== 'EncodingError') return;
getFilesFromDataTransferItems.didShowInfo = true;
const infoMsg = `${err.name} occured within datatransfer-files-promise module\n` + `Error message: "${err.message}"\n` + 'Try serving html over http if currently you are running it from the filesystem.';
console.warn(infoMsg);
};

const readFile = (entry, path = '') => {
return new Promise((resolve, reject) => {
    entry.file(file => {
        if (!options.raw) {
            file.filepath = path + file.name;  // save full path

        };
        resolve(file);
    }, (err) => {
        checkErr(err);
        reject(err);
    });
});
};

const dirReadEntries = (dirReader, path) => {
return new Promise((resolve, reject) => {
    dirReader.readEntries(async entries => {
        let files = [];
        for (let entry of entries) {
            const itemFiles = await getFilesFromEntry(entry, path);
            files = files.concat(itemFiles);
        };
        resolve(files);
    }, (err) => {
        checkErr(err);
        reject(err);
    });
});
};

const readDir = async (entry, path) => {
const dirReader = entry.createReader();
const newPath = path + entry.name + '/';
let files = [];
let newFiles;
do {
    newFiles = await dirReadEntries(dirReader, newPath);
    files = files.concat(newFiles);
} while (newFiles.length > 0);
return files;
};

const getFilesFromEntry = async (entry, path = '') => {
if (entry.isFile) {
    const file = await readFile(entry, path);
    return [file];
};
if (entry.isDirectory) {
    const files = await readDir(entry, path);
    return files;
};
// throw new Error('Entry not isFile and not isDirectory - unable to get files')
};

let files = [];
let entries = [];

// Pull out all entries before reading them
for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
entries.push(dataTransferItems[i].webkitGetAsEntry());
};

// Recursively read through all entries
for (let entry of entries) {
const newFiles = await getFilesFromEntry(entry);
files = files.concat(newFiles);
};

return files;
};
//add-leejs 20201203 Chat 관련 함수
function CustomBarChat() {
console.log("세션정보 로그인 아이디",sessionStorage.getItem("userid"));
Chatlogin().then( function (token){
    ChatStart(token);
});
}
function Chatlogin() {
return new Promise(function(res) {
var token = sessionStorage.getItem("login-token");
var userid = sessionStorage.getItem("userid"); 
var orgnid = sessionStorage.getItem("orgn"); 

if (token) {
    console.log("token true");
    res(token);
    return;
}
webix.ajax(chatloginAjaxURL + "?id=" + userid + "&orgn=" + orgnid).then(raw => {
    var token = raw.text();
    //console.log("token false");
    sessionStorage.setItem("login-token", token);
    res(token);
});

});
}
function ChatStart(token) {
    webix.ui({
        modal: true,
        view: "window",
        width: 400,
        height: 800,
        move: true,
        id: "archive_messenger",
        head: {
            view: "toolbar",
            elements: [
                { template: "Messenger" },
                {
                    view: "icon", icon: "wxi-close", click: function () {
                        $$("archive_messenger").hide();
                    }
                }
            ]
        },
        body: {
            rows: [
                {
                    type: "wide",
                    cols: [
                        {
                            view: "chat",
                            width: 400,
                            compact: true,
                            token,
                            url: chatStartAjaxURL,
                        },
                        { view: "resizer" },
                        {},
                    ],
                },
            ],
        },
    }).show();
}
//----------------------[ ./ 업로드 정크 및 파일 갯수 제한]---------------------------------
//케러서 로 이미지보기 처리함수
//var path = this.app.getService("backend").directLink(this.File.id);
//Carousel => 추가 info previewPane 버튼 추가
function viewCarouselImg(obj) {
    var  img_height = window.innerHeight - 46;
    return '<img src="' + obj.src + '" style="width: 100%; height: ' + img_height + 'px; display: block; margin-left:auto;margin-right:auto;object-fit: contain;" ondragstart="return false"/><div class="title">' + obj.title + '</div>'
}				
               
