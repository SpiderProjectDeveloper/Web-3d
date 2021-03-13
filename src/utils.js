import { _settings } from './settings.js';
import { _globals, _data } from './globals.js';
import { _texts, _icons } from './texts.js';

// Returns the number of week of the year
export function getWeekNumber(d) {
	d = new Date( Date.UTC( d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() ) );
	d.setUTCDate( d.getUTCDate() + 4 - (d.getUTCDay() || 7) );
	var startOfYear = new Date( Date.UTC( d.getUTCFullYear(), 0,1 ) );
	var weekNumber = Math.ceil( ( ( (d - startOfYear) / 86400000 ) + 1 ) / 7 );
	return weekNumber;
}


export function parseDate( dateString ) {
	if( typeof(dateString) === 'undefined' ) {
		return null;
	}
	if( dateString == null ) {
		return null;
	}
	let date = null;
	let y=null, m=null, d=null, hr=null, mn=null;
	let parsedFull = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)[ T]+([0-9]+)[\:\.\-\/]([0-9]+)/ );
	if( parsedFull !== null ) {
		if( parsedFull.length == 6 ) {
			y = parsedFull[3];
			if( y.length == 2 )		// If a 2-digit year format
				y = "20" + y;
			if( _globals.dateDMY ) {
				m = parsedFull[2];
				d = parsedFull[1];				
			} else {
				d = parsedFull[2];
				m = parsedFull[1];								
			}
			hr = parsedFull[4];
			mn = parsedFull[5];
			date = new Date(y, m-1, d, hr, mn, 0, 0);
		}
	} else {
		let parsedShort = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)/ );
		if( parsedShort !== null ) {
			if( parsedShort.length == 4 ) {
				y = parsedShort[3];
				if( y.length == 2 )		// If a 2-digit year format
					y = "20" + y;
				if( _globals.dateDMY ) {
					m = parsedShort[2];
					d = parsedShort[1];					
				} else {
					d = parsedShort[2];
					m = parsedShort[1];										
				}
				hr = 0;
				mn = 0;
				date = new Date(y, m-1, d, hr, mn, 0, 0, 0, 0);
			}
		}
	}
	if( date === null ) {
		return null;
	}
	let timeInSeconds = date.getTime();
	return( { 'date':date, 'timeInSeconds':timeInSeconds/1000 } ); 
}


export function parseJSDate( dateString ) {
	if( typeof(dateString) === 'undefined' ) {
		return null;
	}
	if( dateString == null ) {
		return null;
	}
	let date = null;
	let parsedFull = dateString.match( /([0-9]+)[\.\-\/\:]([0-9]+)[\.\-\/\:]([0-9]+)[ T]+([0-9]+)[\:\.\-\/]([0-9]+)/ );
	if( parsedFull !== null ) {
		if( parsedFull.length == 6 ) {
			date = new Date(parsedFull[1], parsedFull[2]-1, parsedFull[3], parsedFull[4], parsedFull[5], 0, 0);
		}
	} else {
		let parsedShort = dateString.match( /([0-9]+)[\.\-\/\:]([0-9]+)[\.\-\/\:]([0-9]+)/ );
		if( parsedShort !== null ) {
			if( parsedShort.length == 4 ) {
				date = new Date(parsedShort[1], parsedShort[2]-1, parsedShort[3], 0, 0, 0, 0);
			}
		}
	}
	if( date === null ) {
		return null;
	}
	let timeInSeconds = date.getTime();
	return( { 'date':date, 'timeInSeconds':timeInSeconds/1000 } ); 
}


export function dateIntoJSDateString( date ) {
	let year = date.getUTCFullYear(); 
	let month = (date.getUTCMonth()+1);
	if( month < 10 ) {
		month = "0" + month;
	}
	let day = date.getUTCDate();
	if( day < 10 ) {
		day = "0" + day;
	}
	let hours = date.getUTCHours();
	if( hours < 10 ) {
		hours = "0" + hours;
	}
	let minutes = date.getUTCMinutes();
	if( minutes < 10 ) {
		minutes = "0" + minutes;
	}
	return( year + "-" + month + "-" + day + "T" + hours + ":" +  minutes + ":00" ); 
}


export function dateIntoSpiderDateString( date, dateOnly=false ) {
	let spiderDateString = null;

	if( typeof(date) === 'undefined' || date === null || date === '' ) {
		return '';
	}

	if( typeof(date) !== 'object' ) { 	// Not 'object' implies seconds
		date = new Date( parseInt(date) * 1000 );
	}
	let year = date.getUTCFullYear(); 
	let month = (date.getUTCMonth()+1);
	if( month < 10 ) {
		month = "0" + month;
	}
	let day = date.getUTCDate();
	if( day < 10 ) {
		day = "0" + day;
	}
	if( _globals.dateDMY ) {
		spiderDateString = day + _globals.dateDelim + month + _globals.dateDelim + year; 
	} else {
		spiderDateString = month + _globals.dateDelim + day + _globals.dateDelim + year;		 
	}
	if( !dateOnly ) {
		let hours = date.getUTCHours();
		if( hours < 10 ) {
			hours = "0" + hours;
		}
		let minutes = date.getUTCMinutes();
		if( minutes < 10 ) {
			minutes = "0" + minutes;
		}
		spiderDateString += "  " + hours + _globals.timeDelim +  minutes;
	}
	return( spiderDateString ); 
}


export function digitsOnly( str ) {
    let l = str.length;
    if( l == 0 ) {
        return false;
    }
    for( let i = 0 ; i < l ; i++ ) {
        if( str[i] === ' ' ) {
            continue;
        }
        if( (str[i] < '0' || str[i] > '9') ) {
            return false;
        }
    }
    return true;
}


export function setCookie( cname, cvalue, exdays=3650 ) {
	if( exdays == null ) {
		document.cookie = cname + "=" + cvalue + "; path=/";
	}
	else {
		let d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();		
		document.cookie = cname + "=" + cvalue + ";" + expires + "; path=" + window.location.pathname;
		//document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
		//document.cookie = cname + "=" + cvalue + ";" + expires;
	}
}


export function deleteCookie( cname ) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + window.location.pathname;
	//document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	//document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}


export function getCookie( cname, type='string' ) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for( let i = 0 ; i < ca.length ; i++ ) {
		let c = ca[i];
		while( c.charAt(0) == ' ' ) {
			c = c.substring(1);
		}
		if( c.indexOf(name) == 0 ) {
			let value = c.substring(name.length, c.length);
			if( type == 'string' ) {
				return value;
			}
			if( type == 'int' ) {
				let intValue = parseInt(value);
				if( !isNaN(intValue) ) {
					return intValue;
				}
			}
			if( type == 'float' ) {
				let floatValue = parseFloat(value);
				if( !isNaN(floatValue) ) {
					return floatValue;
				}
			}
			return null;
		}
	}
	return null;
}


export function decColorToString( decColor, defaultColor=null ) {
	if( typeof(decColor) !== 'undefined' ) {		
		if( decColor ) {
			if( digitsOnly(decColor) ) {
				decColor = Number(decColor);
				if( decColor > 0xFFFFFF ) {
					return defaultColor;
				}
				let c1 = (decColor & 0xFF0000) >> 16;
				let c1text = c1.toString(16);
				if( c1text.length == 1 ) {
					c1text = "0" + c1text;
				}
				let c2 = (decColor & 0x00FF00) >> 8;
				let c2text = c2.toString(16);
				if( c2text.length == 1 ) {
					c2text = "0" + c2text;
				}
				let c3 = (decColor & 0x0000FF);	  
				let c3text = c3.toString(16);
				if( c3text.length == 1 ) {
					c3text = "0" + c3text;
				}
				return '#' + c3text + c2text + c1text;
			}
		}
	}
	return defaultColor;
}


export function removeClassFromElement( element, className ) {
	let replace = '\\b' + className + '\\b';
	let re = new RegExp(replace,'g');
	element.className = element.className.replace(re, '');
}

export function addClassToElement( element, className ) {
	let classArray;
	classArray = element.className.split(' ');
	if( classArray.indexOf( className ) == -1 ) {
		element.className += " " + className;
	}
}


export function findPositionOfElementAtPage( el ) {
	if( typeof( el.offsetParent ) !== 'undefined' ) {
		let posX, posY;
		for( posX = 0, posY = 0; el ; el = el.offsetParent ) {
			posX += el.offsetLeft;
			posY += el.offsetTop;
		}
		return [ posX, posY ];
	} else {
		return [ el.x, el.y ];
	}
}


export function getCoordinatesOfClickOnImage( imgId, event ) {
	let posX = 0, posY = 0;
	let imgPos = findPositionOfElementAtPage( imgId );
	let e = ( event ) ? event : window.event;

	if( e.pageX || e.pageY ) {
		posX = e.pageX;
		posY = e.pageY;
	} else if( e.clientX || e.clientY ) {
		posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	posX = posX - imgPos[0];
	posY = posY - imgPos[1];

	let right = ( posX > parseInt( imgId.clientWidth/2 ) ) ? 1 : 0;
	let lower = ( posY > parseInt( imgId.clientHeight/2 ) ) ? 1 : 0;

	return [ posX, posY, right, lower ];
}


export function trimString( str ) {
  return str.replace(/^\s+|\s+$/gm,'');
}


export function csvIntoJSON(s) {
	
	let lines = s.split('\n');
	if( lines.length < 2 ) {
		return [];
	}
	let titles = lines[0].split('\t');
	if( titles < 3 ) {
		return [];
	}		
	titles[titles.length-1] = trimString( titles[titles.length-1] );

	let json = [];
	for( let i = 1 ; i < lines.length ; i++ ) {
		let jsonLine = {};
		let line = lines[i].replace( String.fromCharCode(1), '\n' );
		let values = line.split('\t');
		if( values.length != titles.length ) {
			break;
		}
		for( let t = 0 ; t < titles.length ; t++ ) {
			jsonLine[ titles[t] ] = values[t]; 
		}
		json.push(jsonLine);
	}
	return json;
}

export function getElementPosition(el) {
	let lx=0, ly=0
    for( ; el != null ; ) {
		lx += el.offsetLeft;
		ly += el.offsetTop;
		el = el.offsetParent;    	
    }
    return {x:lx, y:ly};
}

