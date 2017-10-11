# katex-screenshot [![Build status](https://travis-ci.org/StandardCyborg/katex-screenshot.svg?branch=master)](https://travis-ci.org/StandardCyborg/katex-screenshot)

Convert KaTeX to images via screenshots

This was built to make generating images for Medium posts easier

## Getting Started
To get started with our application, run the following:

```bash
# Install our package globally
npm install -g katex-screenshot

# Generate a .tex file to screenshot
cat "\\vec{hello} = \\vec{world}" > vector.tex

# Screenshot our .tex file
katex-screenshot vector.tex vector.tex.png
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Unlicense
As of Oct 10 2017, Standard Cyborg has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
