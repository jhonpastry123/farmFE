//--------------------[ Ajax url 정의 fileindex.html]---------------------------------------------------------------
const chatloginAjaxURL      = "http://localhost:8050/login";
const chatStartAjaxURL      = "http://localhost:8050/api/v1";
const docManagerAjaxURL     = "http://localhost:8030/";
const chunkAjaxURL          = "http://localhost:8030/uploadchunk";
const logoutThumbDelete     = "http://localhost:8030/deleteThumbnil"    // 로그아웃시  thumbnil 폴더 삭제
const sharedURL             = "http://www.intelresource.co.kr/";		   // 메일공유시 보내어질 URL 의 Prifix문자열
let isGov                   = false; 		                               // 관공서용에서 필요없는 버튼을 숨기기위한 패리티
var ShareedUserButtonAuth   = false;                                       // 로그인 접근자가 피공유자 일경우 일부 기능 제한
var userFSStats             = new Array;                                   // 사용량 배열 
var searchCarouselArray     = new Array();                                 // 케라서용 변수
var sheardPageArray         = new Array();                                 // 공유
var my_information          = new Array();                                 // 내정보보기 변수
//--------------------[ Ajax url 정의 login.html]-------------------------------------------------------------------- 
const usermanagerUrl        = "http://localhost:8040/";                 // 유저메니저 루트 url
const loginUrl              = "http://localhost:8040/login";            // 정상로그인 url
const sharedlogin           = "http://localhost:8040/sharedlogin";      // 메일을 통한 공유자 로그인 url
const orgnSaveUrl           = "http://localhost:8040/orgns";            // 회사등록 할때 임시 사용 현재 비활성화
const orgnNoChk             = "http://localhost:8040/orgnnochk";        // 회사등록 할때 임시 사용 현재 비활성화
const usrSaveUrl            = "http://localhost:8040/user";             // 개인사용자
var  userGubun              =  1;                                          // 1=> 개인사용자, 2=> 기업사용자, 3=>피공유자
const TEARABYTE             = 1000*1000*1000*1000;                         // 1TB 상수
//--------------------[ Ajax url 정의 usermanager.html]-------------------------------------------------------------------- 
var Orgnbtn = true;                                                       // 사업자 사용자 추가 임시
var allquota = 0;                                                         // 전체 할당량
var quota = 0;                                                            // 개인 할당량
//--------------------[ Ajax url 정의 schedulerindex.html]-------------------------------------------------------------------- 
const schedulerUrl          = "http://localhost:8060/";                       //유저메니저 루트 url
