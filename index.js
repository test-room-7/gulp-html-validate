const through = require('through2');
const PluginError = require('plugin-error');

const { HtmlValidate } = require('html-validate');
const { getFormatter } = require('html-validate/build/cli/formatter');

const pluginName = 'gulp-html-validate';
const defaultOptions = {
	format: 'stylish',
};

module.exports = (options) => {
	const pluginOptions = options || defaultOptions;

	const htmlvalidate = new HtmlValidate();
	const formatter = getFormatter(pluginOptions.format);

	return through.obj(function(file, encoding, callback) {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new PluginError(pluginName, 'Streaming not supported'));
			return;
		}

		const result = htmlvalidate.validateFile(file.path);

		if (!result.valid) {
			const resultOutput = formatter(result);

			this.emit(
				'error',
				new PluginError(pluginName, resultOutput, {
					fileName: file.path,
					showStack: false,
				})
			);
		}

		callback(null, file);
	});
};
