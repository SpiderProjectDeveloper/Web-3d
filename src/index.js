import './index.css';
import mainHTML from './main.html';
import { displayMessageBox, hideMessageBox } from './boxes.js';
import { _texts, _icons } from './texts.js';
import { _settings } from './settings.js';
import { _globals, _data, initGlobals, initGlobalsWithData } from './globals.js';
import { dateIntoSpiderDateString } from './utils.js';
import { initMenu } from './menu.js';
import { initData } from './initdata.js';
import { displayBimFile } from './bim.js';

// Attaching to the html container element
let script = document.getElementById('bundle');
let appContainer = null;
let user = null;
if( script ) {	
    let appContainerName = script.getAttribute('data-appcontainer');
	if(appContainerName) { 
		appContainer = document.getElementById(appContainerName);
    }
    user = script.getAttribute('data-user');
}
if( appContainer ) {
	appContainer.innerHTML = mainHTML;
} else { 
	document.body.innerHTML = mainHTML;
}
initGlobals(appContainer, user);
initLayout();

window.addEventListener( "load", onWindowLoad );
window.addEventListener( "resize", onWindowResize );

function loadData() {
	if( document.location.host ) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		    if ( this.readyState == 4 ) { 
				// A debug code!
				/*
                let t = "{ \"project\": { \"Code\":\"sp\", \"Name\":\"Приобретение программы\",\"Version\":\"1\",\"CurTime\":1169010000,\"Notes\":\"Тестовый проект\" },\"parameters\": { \"language\":\"ru\", \"dateFormat\":\"\", \"dateDelim\":\".\", \"timeDelim\":\":\", \"secondsInPixel\":30000, \"expandToLevelAtStart\":3, \"uploadTime\":1603123121 },\"activities\": [{\"Level\":1,\"Code\":\"main\",\"N\":\"65408\",\"Name\":\"Приобретение программы\",\"Person\":null,\"Notes\":null,\"Start\":1168318800,\"AsapStart\":1169010000,\"AsapFin\":1176103800,\"FactStart\":1168318800,\"FactFin\":null,\"f_FontColor\":null,\"f_LastFin\":1168952400,\"f_ColorCom\":\"11534336\",\"f_ColorBack\":\"13233656\"},{\"Level\":2,\"Code\":\"Груша\",\"N\":\"65408\",\"Name\":\"Требования и рынок\",\"Person\":\"ivanov, petrov\",\"Notes\":null,\"Start\":1168318800,\"AsapStart\":1169010000,\"AsapFin\":1173801600,\"FactStart\":1168318800,\"FactFin\":null,\"f_FontColor\":\"255\",\"f_LastFin\":1168952400,\"f_ColorCom\":\"53760\",\"f_ColorBack\":\"13434828\"}],\"table\": [{\"name\":\"Уровень\",\"ref\":\"Level\",\"visible\":true,\"width\":2,\"type\":\"int\", \"format\":0},{\"name\":\"Код\",\"ref\":\"Code\",\"visible\":true,\"width\":17,\"type\":\"string\", \"format\":2},{\"name\":\"Пользовательское поле N\",\"ref\":\"N\",\"visible\":true,\"width\":17,\"type\":\"signal\", \"format\":1},{\"name\":\"Название\",\"ref\":\"Name\",\"visible\":true,\"width\":40,\"type\":\"string\", \"format\":0}, {\"name\":\"Менеджер\",\"ref\":\"Person\",\"visible\":true,\"width\":17,\"type\":\"string\", \"format\":0},{\"name\":\"Комментарии\",\"ref\":\"Notes\",\"visible\":true,\"width\":17,\"type\":\"text\", \"format\":0, \"editable\":true},{\"name\":\"Начало\",\"ref\":\"Start\",\"visible\":true,\"width\":17,\"type\":\"datetime\", \"format\":1}],\"links\": [ {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spamrd04\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd02\",\"SuccCode\":\"spamrd04\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd04\",\"SuccCode\":\"spammr03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa03\",\"SuccCode\":\"spscsa04\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa04\",\"SuccCode\":\"spscic01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa04\",\"SuccCode\":\"spscic02\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscnc01\",\"SuccCode\":\"spscnc02\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscnc02\",\"SuccCode\":\"spscnc03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spammr03\",\"SuccCode\":\"spscsa01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa01\",\"SuccCode\":\"spscsa02\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa01\",\"SuccCode\":\"spscsa03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscic02\",\"SuccCode\":\"spscnc01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscic01\",\"SuccCode\":\"spscnc01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd03\",\"SuccCode\":\"spamrd04\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spamrd03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd02\",\"SuccCode\":\"spamrd03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spammr01\",\"SuccCode\":\"spammr02\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spammr02\",\"SuccCode\":\"spammr03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa02\",\"SuccCode\":\"spscsa05\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscsa05\",\"SuccCode\":\"spscsa04\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"ww\",\"TypeSF2\":\"SS\"}, {\"PredCode\":\"spammr03\",\"SuccCode\":\"ww\",\"TypeSF2\":\"FF\"}, {\"PredCode\":\"spscsa01\",\"SuccCode\":\"spsc01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spscnc03\",\"SuccCode\":\"spsc01\",\"TypeSF2\":\"FF\"}, {\"PredCode\":\"spamrd02\",\"SuccCode\":\"ww\",\"TypeSF2\":\"SS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spscnc03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd02\",\"SuccCode\":\"spscnc03\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spammr01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spammr01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spammr01\",\"TypeSF2\":\"FF\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"spammr01\",\"TypeSF2\":\"FS\"}, {\"PredCode\":\"spamrd01\",\"SuccCode\":\"03\",\"TypeSF2\":\"SS\"}, {\"PredCode\":\"spammr03\",\"SuccCode\":\"03\",\"TypeSF2\":\"FF\"}, {\"PredCode\":\"spamrd02\",\"SuccCode\":\"03\",\"TypeSF2\":\"SS\"}],\"lang\":\"ru\"}";
                hideMessageBox();
				initGlobalsWithData( t );
				initData();
				displayHeaderAndFooterInfo();
				displayBimFile();
				return;
				*/				
		    	if( this.status == 200 ) {
			    	let errorParsingData = false;
			    	try {
				        initGlobalsWithData( this.responseText ); // TO UNCOMMENT!!!!
			    	} catch(e) {
			    		console.log('Error: ' + e.name + ":" + e.message + "\n" + e.stack + "\n" + e.cause);
			    		errorParsingData = true;
			    	}
			    	if( errorParsingData ) { // To ensure data are parsed ok... // alert(this.responseText);
						displayMessageBox( _texts[_globals.lang].errorParsingData ); 
						return;
			    	}
                    hideMessageBox();                    

			    	if( !('activities' in _data) || _data.activities.length == 0 ) {
							displayMessageBox( _texts[_globals.lang].errorParsingData ); 
							return;
            }
            if( initData() == 0 ) {
							displayHeaderAndFooterInfo();						
							displayBimFile();
            } else {
              displayMessageBox( _texts[_globals.lang].errorLoadingData ); 
            }                        
				} else {
					displayMessageBox( _texts[_globals.lang].errorLoadingData ); 
				}
		  }
    };
		let requestUrl = _settings.urlData + decodeURIComponent(window.location.search);         
		xmlhttp.open("GET", requestUrl, true); 		//xmlhttp.open("GET", 'test.json', true);
		xmlhttp.setRequestHeader("Cache-Control", "no-cache");
		xmlhttp.send();
		displayMessageBox( _texts[_globals.lang].waitDataText ); 
	} 
}

function displayHeaderAndFooterInfo() {
	if( typeof(_data) === 'undefined' || !('project' in _data) )
		return;
	document.title = _data.project.Name;
	let projectName = document.getElementById('projectName');
	projectName.innerText = _data.project.Name + " (" + _data.project.Code + ")";
	let elProjectAndTimeVersion = document.getElementById('projectTimeAndVersion');
	
	let uploadTime = '';
	if( 'UploadTime' in _data.project ) {
		let uploadTime = dateIntoSpiderDateString( _data.parameters.uploadTime );
		uploadTime = " / " + _texts[_globals.lang].uploadTime + ": " + uploadTime;
	}
	if( !_globals.touchDevice ) {
		let timeAndVersion = _data.project.CurTime + uploadTime + " | " + _texts[_globals.lang].version + ": " + _data.project.Version;
		elProjectAndTimeVersion.innerText = timeAndVersion;
	} else {
		projectName.setAttribute('style','font-size:18px;');
		elProjectAndTimeVersion.setAttribute('style','display:none');
	}
	initMenu();
	initControls();
}


function onWindowLoad() {
	loadData();
}

function onWindowResize(e) { 
	initLayout();
}

function initLayout() {
	let div;
	div = document.getElementById('bimDiv');
	div.style.height = (_globals.innerHeight - parseInt(_globals.headerHeight)).toString() + 'px';
	div.style.width = parseInt( _globals.innerWidth * 0.75 ).toString() + 'px';
	div = document.getElementById('bimCanvas');
	div.style.height = (_globals.innerHeight - parseInt(_globals.headerHeight)).toString() + 'px';
	div.style.width = parseInt( _globals.innerWidth * 0.75 ).toString() + 'px';
}

function initControls() {
	let div;
	div = document.getElementById('bimDarkBackgroundModeLabel');
	div.innerHTML = _texts[_globals.lang].darkBackground;

	div = document.getElementById("bimHideByPickModeLabel")
	div.innerHTML = _texts[_globals.lang].hideByPick;
	div = document.getElementById("bimMultipleChoiceModeLabel")
	div.innerHTML = _texts[_globals.lang].multipleChoice;
	div = document.getElementById("bimHideByPickReset")
	div.innerHTML = _texts[_globals.lang].reset;
}

function onWindowContextMenu(e) { 
	e.preventDefault(); 
	return(false); 
}
