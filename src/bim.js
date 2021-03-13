import { _settings } from './settings.js';
import { Viewer, State, ViewType, Grid } from '@xbim/viewer';
import { displayMessageBox, hideMessageBox } from './boxes.js';
import { _globals, _data } from './globals.js';
import { _texts } from './texts.js';
import { initTimeScale } from './bimtimescale.js';

var _bim = null;
var _grid = null;

var _pickStyleCode = 10;
var _pickStyle = [255,100,100,255];
var _pickedElements = Array();
var _pickTime = 0;

var _lightBackgroundColor = [255,255,255,255];
var _darkBackgroundColor = [0,0,0,255];

var _highlightingColor = [255,0,0,100];

var _clippingIsOn=false;

var _bimProduct = null;
var _bimHideByPickMode = null;
var _bimHideByPickReset = null;
var _bimDarkBackgroundMode = null;

export function displayBimFile() {
	let check = Viewer.check();
	if (!check.noErrors) {
		let msg = '';
		for (let i in check.errors) {
			msg += check.errors[i] + "<br/>";
		}
		displayMessageBox(msg);	
		return;
	}	

	_bimProduct = document.getElementById('bimProduct');

	document.getElementById("bimClip").onclick = function(e) { clip(); };
	document.getElementById("bimUnclip").onclick = function(e) { unclip(); } 
	
	_bimHideByPickMode = document.getElementById("bimHideByPickMode");
	_bimHideByPickMode.onchange = function(e) { return; };

	_bimHideByPickReset = document.getElementById("bimHideByPickReset");
	_bimHideByPickReset.className = 'disabled';
	_bimHideByPickReset.onclick= function(e) { 
		_bim.resetState();
		_pickedElements.length = 0;
		formatPickedText();
		_bimHideByPickReset.className = 'disabled';
	};
	
	_bimDarkBackgroundMode = document.getElementById("bimDarkBackgroundMode");
	_bimDarkBackgroundMode.onchange = function(e) { setDarkBackground(); };

	_bim = new Viewer('bimCanvas');

	setDarkBackground(true); 		// Setting the background color
	_bim.highlightingColour = _highlightingColor;

	_grid = new Grid();
	_grid.colour = [ 0.5, 0.5, 0.5, 0.5 ];
	_grid.zFactor = 20;
	_bim.addPlugin(_grid);

	//_bim.renderingMode = 1; // GRAYSCALE

	// Defining styles...		
	_bim.defineStyle( _pickStyleCode, _pickStyle );
	for( let i = 0 ; i < _settings.undoneStyleCodes.length ; i++ ) {
		_bim.defineStyle( _settings.undoneStyleCodes[i], _settings.undoneStyles[i] );			
	}
	
	_bim.on('loaded', function (model) {
		initTimeScale(_bim);

		hideMessageBox();		

		_bim.start();
		_bim.show(ViewType.DEFAULT, undefined, undefined, false);
	});

	_bim.on('error', function (arg) {
		//displayMessageBox( arg.message );
		displayMessageBox(_texts.errorWexbimNotFound);
	});

	_bim.on('pick', function (args) {
		// If the "Hide-By-Pick" mode is on...
		if( _bimHideByPickMode.checked ) {
			_bim.setState(State.HIDDEN, [args.id]);
			_bimHideByPickReset.className = 'enabled';
			return;
		}

		if (!_bimProduct) {
			return;
		}
		
		//console.log(`_pickProductId=${_pickProductId}, args.id=${args.id}, args=${args}`);
		if( _pickedElements.length > 0 ) {
			// To check if a picked element was re-picked...
			for( let is = 0 ; is < _pickedElements.length ; is++ ) {
				if( _pickedElements[is] == args.id ) {
					_bim.setState(State.UNDEFINED, [args.id]);
					_pickedElements.splice(is,1);
					formatPickedText();
					return; 			// ... leaving the function then.
				}
			}

			let multipleChoice = document.getElementById('bimMultipleChoiceMode').checked;
			// If the "Multiple-Choice" mode is off - resetting the chosen one...
			if( !multipleChoice ) {
				//_bim.setStyle(State.UNSTYLED, [_pickProductId]);
				//_bim.setState(State.UNDEFINED, [_pickProductId]);
				_bim.setState(State.UNDEFINED, [ _pickedElements[0] ]);
				_pickedElements.length = 0;
				formatPickedText();
			}
		}

		if( args.id === null ) {
			return;
		}

		// Enabling the "Reset" button
		_bimHideByPickReset.className = 'enabled';

		_bim.setState( State.HIGHLIGHTED, [args.id] );
		_pickedElements.push( args.id );

		formatPickedText();

		let time = (new Date()).getTime();
		if (time - _pickTime < 200) {
			_bim.zoomTo( args.id );
		}
		_pickTime = time;					 
	});

	_bim.on('mouseDown', function (args) {
		_bim.setCameraTarget(args.id);
	});

	_bim.on('clipped', function (args) {
		_clippingIsOn = false;
		document.getElementById('bimClip').disabled=true;
		document.getElementById('bimUnclip').disabled=false;
	});

	_bim.on('unclipped', function (args) {
		document.getElementById('bimClip').disabled=false;
		document.getElementById('bimUnclip').disabled=true;
	});
		
	let requestUrl = _settings.urlWexbim + ((window.location.search.length > 0) ? (window.location.search) : '');         
	_bim.load(requestUrl); 		// _bim.load('test.wexbim');
}


function clip() {
	if( _bim ) {
		_bim.clip();
		_clippingIsOn = true;
		document.getElementById('bimClip').disabled=true;
		document.getElementById('bimUnclip').disabled=false;
	}
}

function unclip() {
	if( _bim ) {
		if( _clippingIsOn ) {
			_bim.stopClipping();
			_clippingIsOn = false;
		} else {
			_bim.unclip();
		}
		document.getElementById('bimClip').disabled=false;
		document.getElementById('bimUnclip').disabled=true;
	}
}


function setStyle( styleCode, ids, style ) {
	_bim.defineStyle( styleCode, style );
	_bim.setStyle( styleCode, ids );
	return;
	// viewer._handles[0]._model.productMap
	let numHandles = _bim._handles.length
	for( let h = 0 ; h < numHandles ; h++ ) {
		for( let p in _bim._handles[h]._model.productMap ) {
			for( let i = 0 ; i < ids.length ; i++ ) {
				if( p == ids[i] ) {
					_bim.setStyle( 10, p );
					break;
				}
			}
		}
	}				
}


function formatPickedText() {
	// Creating a "Product Info" text
	let productInfo = "";
	for( let ip = 0 ; ip < _pickedElements.length ; ip++ ) {
		let picked = _pickedElements[ip];
		let found = false;
		for (let i = 0; i < _data.activities.length; i++) {
			if ( parseInt(picked) === parseInt(_data.activities[i].f_Model) ) {
				if( productInfo.length > 0 ) {
					productInfo += '</br></br>';	
				}
				productInfo += formatProductDetails(i);
				found = true;
				//productInfo += "Code: " + _data.activities[i].Code;
				//productInfo += "<br/>Name: " + _data.activities[i].Name;
				//productInfo += "<br/>Progress: " + _data.activities[i].progress + "%";
				//let text = formatProductDetails(i);
				//console.log(text);
				break;
			}
		}
		if( !found ) {
			if( productInfo.length > 0 ) {
				productInfo += '</br></br>';	
			}
			productInfo += `<span>[${picked}] ${_texts[_globals.lang].cantFindElementByProductId}</span>`;
		}
	}
	_bimProduct.innerHTML = productInfo;
}


function formatProductDetails(opNumber) {
	let op = _data.activities[opNumber];
	let text = "";
	for( let i = 0 ; i < _data.fields.length ; i++ ) {
		let code = _data.fields[i].Code;
		if( !(code in op) ) {
			continue;
		}
		if( text.length > 0 ) {
			text += '</br>';
		}
		text += `<span>${_data.fields[i].Name}:</span> ${op[code]}`;
	}
	return text;
}


function setDarkBackground( isDark ) {
	if( typeof(isDark) === 'undefined' || isDark === null ) {
		isDark = _bimDarkBackgroundMode.checked;
	} else {
		_bimDarkBackgroundMode.checked = (isDark) ? true : false;
	}
	_bim.background = (isDark) ? _darkBackgroundColor : _lightBackgroundColor;
}


