import { getCookie } from './utils.js';
import { _settings } from './settings.js';

export var _data = null;

export var _globals = { 
	lang: 'en',
	page3d: null, pageHelp: null,
	htmlStyles: null, innerWidth: window.innerWidth, innerHeight: window.innerHeight,
	headerHeight: 40
};


export function initGlobals( appContainer, user ) {
	_globals.page3d = document.getElementById('page3d');
	_globals.pageHelp = document.getElementById('pageHelp');

	_globals.htmlStyles = window.getComputedStyle(document.querySelector("html"));	
	_globals.headerHeight = _globals.htmlStyles.getPropertyValue('--header-height');

	if( appContainer ) {
		let bbox = appContainer.getBoundingClientRect();
        _globals.innerWidth = Math.floor(bbox.width); // - bbox.x;
		_globals.innerHeight = Math.floor(bbox.height); // - bbox.y;
	} else {
		_globals.innerWidth = window.innerWidth;
		_globals.innerHeight = window.innerHeight;
	}

    if( user === null ) {
		let cookieUser = getCookie( 'user' );
		if( cookieUser !== null ) {
			user = cookieUser;
		}
	}
	if( !user ) { user = 'NoName'; }
	_globals.user = user;
}


export function initGlobalsWithData(jsondata) {
	_data = JSON.parse(jsondata);
    if( 'parameters' in _data ) { 
        if( typeof(_data.parameters.dateDelim) === 'string' ) 
            _globals.dateDelim = _data.parameters.dateDelim;
        if( typeof(_data.parameters.timeDelim) === 'string' )
            _globals.timeDelim = _data.parameters.timeDelim;
        if( typeof(_data.parameters.language) === 'string' )
            _globals.lang = _data.parameters.language;
        if( typeof(_data.parameters.user) === 'string' ) 
            _globals.user = _data.parameters.user;

        let patternMDY = new RegExp( '([mM]+)([dD]+)([yY]+)' ); // Determining date format: DMY or MDY
        if( patternMDY.test(_data.parameters.dateFormat) ) {               
            _globals.dateDMY = false;
        } else {
            _globals.dateDMY = true;
        }
    } 
}

export function setGlobal( key, value ) {
	_globals[key] = value;
}
