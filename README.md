# metalsmith-contenthash

[![npm](https://img.shields.io/npm/v/metalsmith-contenthash.svg)](https://www.npmjs.com/package/metalsmith-contenthash)
[![npm](https://img.shields.io/npm/dm/metalsmith-contenthash.svg)](https://www.npmjs.com/package/metalsmith-contenthash)
[![Dependency Status](https://david-dm.org/ElijahKaytor/metalsmith-contenthash.svg)](https://david-dm.org/ElijahKaytor/metalsmith-contenthash)


> based off of [``metalsmith-fingerprint-ignore``](https://github.com/superwolff/metalsmith-fingerprint-ignore), uses ``crypto.createHash`` instead of ``crypto.createHmac``


## Installation

```
npm install metalsmith-contenthash
```

## Example (serving assets)

```js
var Metalsmith = require('metalsmith');
var assets = require('metalsmith-assets');
var contenthash = require('metalsmith-contenthash');

var ms = Metalsmith(process.cwd());


ms.use(assets({
    source: './assets',
    destination: './assets',
}));


// no options are required, these are the defaults
//  i.e.  same as:  ms.use(contenthash())  or  ms.use(contenthash({}))
ms.use(contenthash({
    
    // don't keep orignal untagged file
    keep: false,
    
    // use sha256 for hashing
    algorithm: 'sha256',
    
    // match static files
    // only applies to basename
    // uses multimatch  https://www.npmjs.com/package/multimatch
    pattern: ['*.{js,scss,css,map,png,jpg}'],
    
    // function for determining new filename
    // default function uses only first 16 hexadecimal digits
    rename: function(filepath, digest) {
        
        // we split at the first period, instead of extname
        //  this is to handle .css.map
        var ext = filepath.indexOf('.');
        
        return [
            filepath.substring(0, ext),
            '.', digest.substr(0, 16),
            filepath.substring(ext),
        ].join('');
        
    },
    
}));


ms.build(function(error) {
    if (error) throw error;
    
    console.log('Built');
});

```
