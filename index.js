const fancyLog = require('fancy-log');
const through = require('through2');
const PluginError = require('plugin-error');

const { Reporter, CLI } = require('html-validate');

const pluginName = 'gulp-html-validate';
const defaultFormatter = 'stylish';

const htmlValidateCli = new CLI();

module.exports = gulpHtmlValidate;

/**
 * Apply html-validate report to each file.
 *
 * @return {Object} Stream object
 */
function gulpHtmlValidate() {
	const htmlvalidate = htmlValidateCli.getValidator();

	return through.obj(async (file, encoding, callback) => {
		try {
			if (file.isNull() || file.isStream()) {
				throw new PluginError(pluginName, 'File is null or Streaming not supported');
			}

			const result = await htmlvalidate.validateString(file.contents.toString(), file.path);
			file.htmlValidateResult = result;
		} catch (err) {
			callback(err);
			return;
		}
		callback(null, file);
	});
}


/**
 * Print a report where all errors/warnings are listed.
 *
 * @param {String} formatterName Formatter supported by html-validate
 *
 * @return {Object} Stream object
 */
gulpHtmlValidate.format = (formatterName = defaultFormatter) => {
	const formatter = htmlValidateCli.getFormatter(formatterName);

	return processHtmlValidateResults((results) => {
		const { errorCount, warningCount } = results;
		if (errorCount === 0 && warningCount === 0) {
			return;
		}

		const formatterOutput = formatter(results);
		fancyLog(formatterOutput);
	});
};

/**
 * Fail when the stream ends if any error(s) occurred.
 *
 * @return {Object} Stream object
 */
gulpHtmlValidate.failAfterError = () => {
	return processHtmlValidateResults((results) => {
		const { errorCount } = results;

		if (errorCount > 0) {
			throw new PluginError(pluginName, {
				message: `Failed with ${errorCount} ${
					errorCount === 1 ? 'error' : 'errors'
				}`,
			});
		}
	});
};

/**
 * Process html-validate reports with the given function.
 *
 * @param  {Function} action Callback which receives a list of results
 *
 * @return {Object} Stream object
 */
function processHtmlValidateResults(action) {
	if (typeof action !== 'function') {
		throw new TypeError(
			`Invalid action: expected a function, got a ${typeof action}`
		);
	}

	const results = [];

	function onFile(file, encoding, callback) {
		if (file.htmlValidateResult) {
			const result = file.htmlValidateResult;
			if (result) {
				results.push(result);
			}
		}

		callback(null, file);
	}

	function onStreamEnd(callback) {
		const mergedResults = Reporter.merge(results);

		tryResultAction(action, mergedResults, callback);
	}

	return through.obj(onFile, onStreamEnd);
}

function tryResultAction(action, result, done) {
	try {
		const isAsyncAction = action.length > 1;

		if (isAsyncAction) {
			action.call(this, result, done);
		} else {
			action.call(this, result);
			done();
		}
	} catch (err) {
		done(err || new Error('Unknown Error'));
	}
}
