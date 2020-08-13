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

exports.default = () => gulp.src('index.html').pipe(htmlvalidate());
```

You can also pass options to the `htmlvalidate` function:

```js
exports.default = () =>
	gulp.src('index.html').pipe(
		htmlvalidate({
			/* Your options here */
		})
	);
```

### Options

#### format

Any formatter supported by `html-validate` (`stylish` by default).

Type: `string`.

## License

Licensed under the [MIT License](./LICENSE).
