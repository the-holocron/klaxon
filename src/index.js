/* eslint-disable no-console, compat/compat */

let queue = [];
const TOKEN = {};
const RESET_INPUT = '%c ';
const RESET_CSS = '';

// Attach formatting utility method.
function alertFormatting (value) {
	queue.push({
		value,
		css: 'display: inline-block; background-color: #dc3545; color: #ffffff; font-weight: bold; padding: 3px 7px 3px 7px; border-radius: 3px 3px 3px 3px;',
	});

	return (TOKEN);
}

function infoFormatting (value) {
	queue.push({
		value,
		css: 'color: #0366d6; font-weight: bold;',
	});

	return (TOKEN);
}

function processFormatting (value) {
	queue.push({
		value: `${value}…`,
		css: 'color: #8c8c8c; font-style: italic;',
	});

	return (TOKEN);
}

function successFormatting (value) {
	queue.push({
		value,
		css: 'color: #289d45; font-weight: bold;',
	});

	return (TOKEN);
}

// Attach formatting utility method.
function warningFormatting (value) {
	queue.push({
		value,
		css: 'display: inline-block; background-color: #ffc107; color: black; font-weight: bold; padding: 3px 7px 3px 7px; border-radius: 3px 3px 3px 3px;',
	});

	return (TOKEN);
}

// I provide an echo-based proxy to the given Console Function. This uses an
// internal queue to aggregate values before calling the given Console
// Function with the desired formatting.
function using (consoleFunction) {
	function consoleFunctionProxy (...args) {
		// As we loop over the arguments, we're going to aggregate a set of
		// inputs and modifiers. The Inputs will ultimately be collapsed down
		// into a single string that acts as the first console.log parameter
		// while the modifiers are then SPREAD into console.log as 2...N.
		// --
		// NOTE: After each input/modifier pair, I'm adding a RESET pairing.
		// This implicitly resets the CSS after every formatted pairing.
		const inputs = [];
		const modifiers = [];
		args.forEach(arg => {
			// When the formatting utility methods are called, they return
			// a special token. This indicates that we should pull the
			// corresponding value out of the QUEUE instead of trying to
			// output the given argument directly.
			if (arg === TOKEN) {
				const item = queue.shift();

				inputs.push((`%c${item.value}`), RESET_INPUT);
				modifiers.push(item.css, RESET_CSS);

				// For every other argument type, output the value directly.
			} else {
				if ((typeof (arg) === 'object') || (typeof (arg) === 'function')) {
					inputs.push('%o', RESET_INPUT);
					modifiers.push(arg, RESET_CSS);
				} else {
					inputs.push((`%c${arg}`), RESET_INPUT);
					modifiers.push(RESET_CSS, RESET_CSS);
				}
			}
		});

		consoleFunction(inputs.join(''), ...modifiers);

		// Once we output the aggregated value, reset the queue. This should have
		// already been emptied by the .shift() calls; but the explicit reset
		// here acts as both a marker of intention as well as a fail-safe.
		queue = [];
	}

	return (consoleFunctionProxy);
}

export default {
	// Console(ish) functions.
	assert: using(console.assert),
	clear: using(console.clear),
	count: using(console.count),
	countReset: using(console.countReset),
	debug: using(console.debug),
	dir: using(console.dir),
	error: using(console.error),
	group: using(console.group),
	groupCollapsed: using(console.groupCollapsed),
	groupEnd: using(console.groupEnd),
	info: using(console.info),
	log: using(console.log),
	table: using(console.table),
	time: using(console.time),
	timeEnd: using(console.timeEnd),
	timeLog: using(console.timeLog),
	trace: using(console.trace),
	warn: using(console.warn),

	// Formatting functions.
	asAlert: alertFormatting,
	asInfo: infoFormatting,
	asProcess: processFormatting,
	asSuccess: successFormatting,
	asWarning: warningFormatting,
};
