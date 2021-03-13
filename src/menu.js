import { _globals } from './globals.js'
import { _settings } from './settings.js'
import { _texts } from './texts.js'
import { print } from './print.js'

let _dbox = null;
let _tbox = null;

export function initMenu() {
    let el;
    el = document.getElementById('dropdownButton');
    el.onclick = function(e) { onDropdownButtonClick(); }

    el = document.getElementById('menuModel');
    el.onclick = function(e) { menuOptionChosen("m"); };
    el = document.getElementById('menuHelp');
    el.onclick = function(e) { menuOptionChosen("h"); };
    el= document.getElementById('menuPrint');
    el.onclick = function(e) { menuOptionChosen('p'); };
    //el= document.getElementById('menuUser');
    //el.onclick = function(e) { logout(); };

    el = document.getElementById('dropdownContent');
    el.addEventListener('mouseover', 
        function(e) { 
            if( !_dbox ) { 
                _dbox = this.getBoundingClientRect();
            }
        }, true);
    el.addEventListener('mouseout', 
        function(e) { 
            if( _dbox ) {
                if( e.x < _dbox.x || e.x >= _dbox.x+_dbox.width-1 || e.y < _dbox.y || e.y >= _dbox.y+_dbox.height-1 ) {
                    hideContent('dropdownContent'); 
                    _dbox = null; 
                }
            } 
        }, false );

	el = document.getElementById('menuUserName');
    el.innerHTML = _globals.user;
    //el.innerHTML = `${_texts[_globals.lang].menuLogout} (${_globals.user})`;
	//el = document.getElementById('menuUserLogout');
    //el.innerHTML = '[&rarr;]'; // ➜ ➡ ➝ ➲ ➠ ➞ ➩ ➯ →
	//el.onclick = logout;
    
    document.getElementById('helpTitle').innerText = _texts[_globals.lang].helpTitle; // Initializing help text	
	document.getElementById('helpText').innerHTML = _texts[_globals.lang].helpText; // Initializing help text	
	
	document.getElementById('menuModelTitle').innerText = _texts[_globals.lang].menuModelTitle;
	document.getElementById('menuHelpTitle').innerText = _texts[_globals.lang].menuHelpTitle;
	document.getElementById('menuPrintTitle').innerText = _texts[_globals.lang].menuPrintTitle;
}

function onDropdownButtonClick() {
    let el=document.getElementById('dropdownContent'); 
    el.style.display=(el.style.display==='block')?'none':'block';
}

function menuOptionChosen( option ) {    
    document.getElementById('dropdownContent').style.display='none';
    let pageModel = document.getElementById('pageModel');
    let pageHelp = document.getElementById('pageHelp');
    if( option === 'm' ) {
            pageModel.style.display = 'block';
            pageHelp.style.display = 'none';
    } else if( option === 'h' ) {
            pageModel.style.display = 'none';
            pageHelp.style.display = 'block';
    } else {
        print();        
    }
}

function hideContent( id ) {
    let el = document.getElementById(id);
    if( !el ) {
        return;
    } 
    if( el.style.display !== 'none' ) {
        el.style.display = 'none';
    }
}


function logout() {
	if( document.location.host ) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		    if (this.readyState == 4 ) {
		    	if( this.status == 401 ) {
		    		window.location.replace('http://www.spiderproject.com/');
				}
		    }
		};
		xmlhttp.open("GET", _settings.urlLogout, true);
		xmlhttp.setRequestHeader("Cache-Control", "no-cache");
		xmlhttp.send();
	} 
}
