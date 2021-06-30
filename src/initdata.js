import { _settings } from './settings.js';
import { _globals, _data } from './globals.js';
import { displayMessageBox } from './boxes.js';
import { dateIntoSpiderDateString, decColorToString, digitsOnly } from './utils.js';

export function initData() {
	_data.project.curTimeInSeconds = _data.project.CurTime;
	_data.project.CurTime = dateIntoSpiderDateString( _data.project.CurTime );
	if( _data.activities.length == 0 ) {
		displayMessageBox( _texts[_globals.lang].errorParsingData );						
		return(-1);				
	}

	for( let i = 0 ; i < _data.performance.length ; i++ ) {
		let w = _data.performance[i];
		if( typeof(w.Start) !== 'undefined' && w.Start !== null ) {
			w.StartInSeconds = w.Start;
			w.Start = dateIntoSpiderDateString( w.StartInSeconds );
		} else {
			d.StartInSeconds = -1;
		}
		if( typeof(w.Fin) !== 'undefined' && w.Fin !== null ) {
			w.FinInSeconds = w.Fin;
			w.Fin = dateIntoSpiderDateString( w.FinInSeconds );
		} else {
			d.FinInSeconds = -1;
		}
	}
	
	for( let i = 0 ; i < _data.activities.length ; i++ ) {
		if( !('Code' in _data.activities[i]) ) { 	// If no "Code" in operation...
			return -1; 				// ... it's a critical error.
		}
		if (!(_settings.ifcProductIdKey in _data.activities[i])) { 	// If IFC product key not found...
			_data.activities[i][_settings.ifcProductIdKey] = _data.activities[i]['Code']; // ...make it a "Code"
		}

		_data.activities[i].progress = 100;
		if( _settings.workRemainedKey in _data.activities[i] ) {
			if( _data.activities[i][_settings.workRemainedKey] === null ) {
				_data.activities[i].progress = 100;
			} else if( _data.activities[i][_settings.workRemainedKey] == 0 ) {
				_data.activities[i].progress = 100;
			} else if( _settings.workDoneKey in _data.activities[i] ) {
				if( _data.activities[i][_settings.workDoneKey] !== null ) {
					let divisor = 
						_data.activities[i][_settings.workDoneKey] + _data.activities[i][_settings.workRemainedKey];
					if( divisor > 0 ) {
						_data.activities[i].progress = 
							parseInt(_data.activities[i][_settings.workDoneKey] *100.0 / divisor);
					} else {
						_data.activities[i].progress = 100;
					}
				} else {
					_data.activities[i].progress = 0;
				}
			}
		}

	}		

	_data.startMinInSeconds = -1;
	_data.finMaxInSeconds = -1;
	_data.startFinSeconds = -1

	for( let i = 0 ; i < _data.activities.length ; i++ ) {
		let d = _data.activities[i];
		if( typeof(d.AsapStart) !== 'undefined' && d.AsapStart !== null ) {
			d.AsapStartInSeconds = d.AsapStart;
			d.AsapStart = dateIntoSpiderDateString( d.AsapStartInSeconds );
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, d.AsapStartInSeconds, false );
		} else {
			d.AsapStartInSeconds = -1;
		}
		if( typeof(d.AsapFin) !== 'undefined' && d.AsapFin !== null) {
			d.AsapFinInSeconds = d.AsapFin;
			d.AsapFin = dateIntoSpiderDateString( d.AsapFinInSeconds );
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, d.AsapFinInSeconds, true );
		} else {
			d.AsapFinInSeconds = -1;
		}
		if( typeof(d.FactStart) !== 'undefined' && d.FactStart !== null ) {
			d.FactStartInSeconds = d.FactStart;
			d.FactStart = dateIntoSpiderDateString( d.FactStartInSeconds );
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, d.FactStartInSeconds, false );
		} else {
			d.FactStartInSeconds = -1;
		}
		if( typeof(d.FactFin) !== 'undefined' && d.FactFin !== null ) {
			d.FactFinInSeconds = d.FactFin;
			d.FactFin = dateIntoSpiderDateString( d.FactFinInSeconds );
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, d.FactFinInSeconds, true );
		} else {
			d.FactFinInSeconds = -1;
		}
		if( typeof(d.Start_COMP) !== 'undefined' && d.Start_COMP !== null ) {
			d.Start_COMPInSeconds = d.Start_COMP;
			d.Start_COMP = dateIntoSpiderDateString( d.Start_COMPInSeconds );
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, d.Start_COMPInSeconds, false );			
		} else {
			d.Start_COMPInSeconds = -1;
		}
		if( typeof(d.Fin_COMP) !== 'undefined' && d.Fin_COMP !== null ) {
			d.Fin_COMPInSeconds = d.Fin_COMP;
			d.Fin_COMP = dateIntoSpiderDateString( d.Fin_COMPInSeconds );
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, d.Fin_COMPInSeconds, true );			
		} else {
			d.Fin_COMPInSeconds = -1;
		}

		if( typeof(d.AlapStart) !== 'undefined' && d.AlapStart !== null ) {
			d.AlapStartInSeconds = d.AlapStart;
			d.AlapStart = dateIntoSpiderDateString( d.AlapStartInSeconds );
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, d.AlapStartInSeconds, false );			
		} else {
			d.AlapStartInSeconds = -1;
		}
		if( typeof(d.AlapFin) !== 'undefined' && d.AlapFin !== null ) {
			d.AlapFinInSeconds = d.AlapFin;
			d.AlapFin = dateIntoSpiderDateString( d.AlapFinInSeconds );
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, d.AlapFinInSeconds, true );			
		} else {
			d.AlapFinInSeconds = -1;
		}
		if( typeof(d.f_LastFin) !== 'undefined' && d.f_LastFin !== null ) {
			d.lastFinInSeconds = d.f_LastFin;
		} else {			
			d.lastFinInSeconds = d.AsapStartInSeconds; // To prevent error if for some reason unfinished operation has no valid f_LastFin. 
		}

		// Start and finish
		if( d.FactFin ) {
			d.status = 100; // finished
			d.displayStartInSeconds = d.FactStartInSeconds; 
			d.displayFinInSeconds = d.FactFinInSeconds;
			d.displayRestartInSeconds = null; 
		} else {
			if( !d.FactStart ) { // Has not been started yet
				d.status = 0; // not started 
				d.displayStartInSeconds = d.AsapStartInSeconds; 
				d.displayFinInSeconds = d.AsapFinInSeconds;
				d.displayRestartInSeconds = null;
			} else { // started but not finished
				let divisor = (d.AsapFinInSeconds - d.AsapStartInSeconds) + (d.lastFinInSeconds - d.FactStartInSeconds); 
				if( divisor > 0 ) {
					d.status = parseInt( (d.lastFinInSeconds - d.FactStartInSeconds) * 100.0 / divisor - 1.0); 
				} else {
					d.status = 50;
				}
				d.displayStartInSeconds = d.FactStartInSeconds; 
				d.displayFinInSeconds = d.AsapFinInSeconds;
				d.displayRestartInSeconds = d.AsapStartInSeconds;
			}
		}
		d.color = decColorToString( d.f_ColorCom, _settings.ganttOperation0Color );
		d.colorBack = decColorToString( d.f_ColorBack, "#ffffff" );
		d.colorFont = decColorToString( d.f_FontColor, _settings.tableContentStrokeColor );
		if( typeof( d.Level ) === 'string' ) {
			if( digitsOnly(d.Level) ) {
				d.Level = parseInt(d.Level);
			}
		}
	}
	if( _data.startMinInSeconds == -1 || _data.finMaxInSeconds == -1 ) {	// If time limits are not defined... 
		displayMessageBox( _texts[_lang].errorParsingData );				// ...exiting...
		return(-1);
	}

	_data.startFinSeconds = _data.finMaxInSeconds - _data.startMinInSeconds;
	_data.visibleMin = _data.startMinInSeconds; // - (_data.finMaxInSeconds-_data.startMinInSeconds)/20.0;
	_data.visibleMax = _data.finMaxInSeconds; // + (_data.finMaxInSeconds-_data.startMinInSeconds)/20.0;
	_data.visibleMaxWidth = _data.visibleMax - _data.visibleMin;	

	return(0);
}


function reassignBoundaryValue( knownBoundary, newBoundary, upperBoundary ) {
	if( knownBoundary == -1 ) {
		return newBoundary;
	} 
	if( newBoundary == -1 ) {
		return knownBoundary;
	}
	if( !upperBoundary ) { // Min.
		if( newBoundary < knownBoundary ) {
			return newBoundary;			
		} 
	} else { // Max.
		if( newBoundary > knownBoundary ) {
			return newBoundary;			
		} 		
	}
	return knownBoundary;
}


