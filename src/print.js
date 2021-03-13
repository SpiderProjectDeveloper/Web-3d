import { _settings } from './settings.js';
import { _globals, _data } from './globals.js';

export function print() {
	let header = document.getElementById('header');
	let headerDisplayStyle = header.style.display;
	header.style.display = 'none';

	let headerHeight = _globals.htmlStyles.getPropertyValue('--header-height');
	document.documentElement.style.setProperty('--header-height', '2px');

	window.print(); 

	document.documentElement.style.setProperty( '--header-height', headerHeight );

	header.style.display = headerDisplayStyle;
}
