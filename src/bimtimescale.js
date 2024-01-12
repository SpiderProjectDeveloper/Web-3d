import { _data } from './globals.js';
import { dateIntoSpiderDateString } from './utils.js';
import { _settings } from './settings.js'
import { State } from '@xbim/viewer';

var _timeScaleRange = null;
var _timeScaleRangeMax = 100000.0;
var _bim = null;
var _timeScalePlay = null;
var _timeScalePause = null;
var _timeScalePlayHours = null;
var _timeScalePlaySeconds = null;
var _timeScalePlayOn = false;

export function initTimeScale( bim ) {
	_timeScaleRange = document.getElementById('bimTimeScaleRange');
	if( !_timeScaleRange ) {
		return;
	}
	_bim = bim;

	let positionAtScale = parseInt( _timeScaleRangeMax * (_data.project.curTimeInSeconds - _data.startMinInSeconds) / _data.startFinSeconds );
	if( positionAtScale > _timeScaleRangeMax ) { 
		positionAtScale = _timeScaleRangeMax; 
	} else if( positionAtScale < 0 ) {
		positionAtScale = 0;
	}
	_timeScaleRange.value = positionAtScale;

	let dateStart = new Date(_data.startMinInSeconds*1000);
	document.getElementById('bimTimeScaleStart').innerText = dateIntoSpiderDateString( dateStart, true );

	let dateEnd = new Date(_data.finMaxInSeconds*1000);
	document.getElementById('bimTimeScaleEnd').innerText = dateIntoSpiderDateString( dateEnd, true );

	_timeScaleRange.onchange = function(e) { onTimeScaleChange(e); };
	onTimeScaleChange(null);

	document.getElementById('bimTimeScaleToFinish').onclick = function(e) { timeScaleToFinish(); };

	_timeScaleRange.onmouseover = function(e) { onTimeScaleMouseOver(e, this); };
	_timeScaleRange.onmousemove = function(e) { onTimeScaleMouseMove(e, this); };
	_timeScaleRange.onmouseout = function(e) { onTimeScaleMouseOut(e, this); };

	_timeScalePlayHours = document.getElementById('bimTimeScalePlayHours');
	_timeScalePlaySeconds = document.getElementById('bimTimeScalePlaySeconds');

	_timeScalePlay = document.getElementById('bimTimeScalePlay');
	_timeScalePlay.onclick = function(e) {
		playTimeScale();
	}

	_timeScalePause = document.getElementById('bimTimeScalePause');
	_timeScalePause.onclick = function(e) {
		stopTimeScale();
	}
}


function timeScaleToFinish() {
	_timeScaleRange.value = _timeScaleRangeMax;
	onTimeScaleChange(null);
}

function onTimeScaleChange(e, tms=null) {
	let timeInSeconds = (tms) ? tms : timeScaleValueIntoSeconds( parseInt(_timeScaleRange.value) );
	let timeScaleToFinishId = document.getElementById('bimTimeScaleToFinish');
	timeScaleToFinishId.disabled = (_timeScaleRange.value < _timeScaleRangeMax) ? false : true;
	timeScaleToFinishId.style.cursor = (_timeScaleRange.value < _timeScaleRangeMax) ? 'pointer' : 'default';
	timeScaleProgress( timeInSeconds );	
	displayProgress(true);
	let d = new Date(timeInSeconds*1000);
	document.getElementById('bimTimeScalePosition').innerText = dateIntoSpiderDateString(d,true);
}


function onTimeScaleMouseOver(e, id) {
	let tooltipId = document.getElementById('bimTimeScaleTooltip');
	tooltipId.style.display = 'block';
}	


function onTimeScaleMouseMove(e, id) {
	let rect = id.getBoundingClientRect();

	let timeScaleValue = (e.x - rect.left) * _timeScaleRangeMax / rect.width;
	let timeInSeconds = timeScaleValueIntoSeconds( timeScaleValue );
	let d = new Date(timeInSeconds * 1000);
	let tooltipId = document.getElementById('bimTimeScaleTooltip');
	tooltipId.style.display = 'block';
	tooltipId.innerHTML = "&nbsp;&nbsp;" + dateIntoSpiderDateString(d,true) + "&nbsp;&nbsp;";

	let tooltipRect = tooltipId.getBoundingClientRect();
    tooltipId.style.top = (rect.top - 12) + 'px';
	if( e.clientX < rect.left + rect.width/2 ) { 
    	tooltipId.style.left = (e.clientX) + 'px';
	} else {
    	tooltipId.style.left = (e.clientX - tooltipRect.width) + 'px';
	}
}


function onTimeScaleMouseOut(e, id) {
	let tooltipId = document.getElementById('bimTimeScaleTooltip');
	tooltipId.style.display = 'none';
}	

function timeScaleValueIntoSeconds(timeScaleValue) {
	//console.log('startMinInSeconds=',_data.startMinInSeconds,', finMaxInSeconds=', _data.finMaxInSeconds);
	return _data.startMinInSeconds + timeScaleValue * (_data.finMaxInSeconds - _data.startMinInSeconds) / _timeScaleRangeMax;
}

function secondsIntoTimeScaleValue(seconds) {
	let timeScaleValue = _timeScaleRangeMax * (seconds - _data.startMinInSeconds) / (_data.finMaxInSeconds - _data.startMinInSeconds);
	if( timeScaleValue > _timeScaleRangeMax ) {
		timeScaleValue = _timeScaleRangeMax;
	}
	return timeScaleValue;
}

function playTimeScale() {
	_timeScalePlayOn = true;
	_timeScalePlay.style.display = 'none';
	_timeScalePause.style.display = 'inline-block';
	playTimeScaleStep( timeScaleValueIntoSeconds( parseInt(_timeScaleRange.value) ) );
}


function stopTimeScale() {
	_timeScalePlayOn = false;
	_timeScalePlay.style.display = 'inline-block';
	_timeScalePause.style.display = 'none';
}

function playTimeScaleStep( timeInSeconds ) {
	if(	!_timeScalePlayOn ) {
		stopTimeScale();
		return;
	}
	let hours=null;
	let seconds=null;
	try { 
		hours = parseFloat( _timeScalePlayHours.value );
		seconds = parseFloat( _timeScalePlaySeconds.value );
	} catch(e) { stopTimeScale(); return; }

	let nextTimeInSeconds = timeInSeconds + hours*60*60;
	if( nextTimeInSeconds > _data.finMaxInSeconds ) {
		nextTimeInSeconds = _data.finMaxInSeconds;
	}
	_timeScaleRange.value = secondsIntoTimeScaleValue(nextTimeInSeconds)
	onTimeScaleChange(null, nextTimeInSeconds);
	if( nextTimeInSeconds < _data.finMaxInSeconds ) {
		setTimeout( function() { playTimeScaleStep(nextTimeInSeconds) }, 1000*seconds );
	} else {
		stopTimeScale();
	}
}

function timeScaleProgress( timeInSeconds ) {
	//console.log(_data);
	for( let i = 0 ; i < _data.activities.length ; i++ ) {
		let o = _data.activities[i];

		let vol = 0;
		for( let wi = 0 ; wi < _data.performance.length ; wi++ ) {
			let w = _data.performance[wi];
			if( w.OperCode != o.Code ) {
				continue;
			}
			if( w.StartInSeconds > timeInSeconds ) {			
				continue; 
			}
			if( w.FinInSeconds < timeInSeconds ) {
				vol += w.Vol;
				continue;				
			}

			let timeSpan =  w.FinInSeconds - w.StartInSeconds;
			if( !(timeSpan > 0) ) {
				vol += w.Vol;
				continue;
			}
			let volShare = (timeInSeconds - w.StartInSeconds) * w.Vol / timeSpan;
			vol += volShare;
		}   	
		let plan = (typeof(o.VolPlan) === 'number') ? o.VolPlan : 0;
		let fact = (typeof(o.VolFact) === 'number') ? o.VolFact : 0;
		let volTotal = plan+fact;
		if( volTotal > 0 )
			o.__progressPct = parseInt( vol * 100 / volTotal );
		else 
			o.__progressPct = 0;

		if( o.__progressPct < 100 ) { 
			if( o.AsapStartInSeconds != -1 && o.AsapFinInSeconds != -1 ) {
				if( timeInSeconds >= o.AsapStartInSeconds ) {
					if( timeInSeconds >= o.AsapFinInSeconds ) {
						o.__progressPct = 100;
					} else {
						if( volTotal > 0 && 'VolPlan' in o && typeof(o.VolPlan) === 'number' ) {
							let volPart = (timeInSeconds - o.AsapStartInSeconds + 1) * o.VolPlan / (o.AsapFinInSeconds - o.AsapStartInSeconds + 1);
							o.__progressPct += parseInt( volPart * 100 / volTotal );
						} else {
							let volPart = (timeInSeconds - o.AsapStartInSeconds + 1) / (o.AsapFinInSeconds - o.AsapStartInSeconds + 1);
							o.__progressPct = parseInt(volPart*100);
						}
					}
				} 
			}
		}

		if( 'Start_COMPInSeconds' in o && 'Fin_COMPInSeconds' in o ) {
			if( o.Start_COMPInSeconds != -1 && o.Fin_COMPInSeconds != -1 ) {
				if( timeInSeconds < o.Start_COMPInSeconds ) {
					o.__progressComparePct = 0;
				} else if( timeInSeconds > o.Fin_COMPInSeconds ) {
					o.__progressComparePct = 100;
				} else {
					let compareTimeSpan = o.Fin_COMPInSeconds - o.Start_COMPInSeconds;
					if( !(compareTimeSpan > 0) ) {
						o.__progressComparePct = 100;
					} else {
						o.__progressComparePct = (timeInSeconds - o.Start_COMPInSeconds) / compareTimeSpan;
					}
				}
			}
		}
	}	
}


function displayProgress( on ) {
	if( on ) {
		let numHandles = _bim._handles.length;
		for( let h = 0 ; h < numHandles ; h++ ) {
			for( let productId in _bim._handles[h]._model.productMaps ) { 
				for (let i = 0; i < _data.activities.length; i++) {
					if( !('f_Model' in _data.activities[i]) ) {
						continue;
					}
					let operationProductId = parseInt(_data.activities[i].f_Model);
					if (productId != operationProductId) {
						continue;
					}
					if( _data.activities[i].__progressPct == 100 ) {
						_bim.setStyle( State.UNSTYLED, [productId] );
					} else if( _data.activities[i].__progressPct > 90 ) {
						_bim.setStyle( _settings.undoneStyleCodes[6], [productId] );
					} else if( _data.activities[i].__progressPct > 70 ) {
						_bim.setStyle( _settings.undoneStyleCodes[5], [productId] );
					} else if( _data.activities[i].__progressPct > 50 ) {
						_bim.setStyle( _settings.undoneStyleCodes[4], [productId] );
					} else if (_data.activities[i].__progressPct > 30 ) {
						_bim.setStyle( _settings.undoneStyleCodes[3], [productId] );
					} else if (_data.activities[i].__progressPct > 10 ) {
						_bim.setStyle( _settings.undoneStyleCodes[2], [productId] );
					} else if (_data.activities[i].__progressPct > 0 ) {
						_bim.setStyle( _settings.undoneStyleCodes[1], [productId] );
					} else {
						_bim.setStyle( _settings.undoneStyleCodes[0], [productId] );
					}
					break;
				}
			}
		}				
	} else {
		_bim.resetStyles();
	}
}
