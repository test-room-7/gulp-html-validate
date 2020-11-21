# gulp-html-validate

Validate files with `html-validate`.

## Installation

```sh
> npm install --save-dev gulp-html-validate
```

## Usage

```js
const gulp = require('gulp');
const htmlvalidate = require('gulp-html-validate');

exports.default = () => {
	return (
		gulp
			.src('index.html')
			/*
			 * Aaply the `html-validate` report to each file object, so these
			 * reports can be used by other modules.
			 */
			.pipe(htmlvalidate())
			/*
			 * Output `html-validate` results to the console.
			 */
			.pipe(htmlvalidate.format())
			/*
			 * Make gulp to exit with an error code if any error(s) occurred.
			 */
			.pipe(htmlvalidate.failAfterError())
	);
};
```

## API

### htmlvalidate()

Apply html-validate report to each file.

### format(formatter)

Print a report where all errors/warnings are listed. This function should be used in the stream after piping through `htmlvalidate` function; otherwise, it will find no `html-validate` results to format.

The `formatter` parameter is a string, which defined the formatter name to use.

Any formatter supported by `html-validate` can be used. The `stylish` formatter is used by default.

### failAfterError()

Throw an error if `html-validate` found an error in any file. All files will be processed before throwing an error.

## License

Licensed under the [MIT License](./LICENSE).
