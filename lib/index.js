
var crypto = require('crypto');
var multimatch = require('multimatch');
var path = require('path');


module.exports = plugin;


function plugin(options) {
    
    // default options
    options = options || {};
    if (typeof options.keep !== "boolean") options.keep = false;
    options.algorithm = options.algorithm || 'sha256';
    options.pattern = options.pattern || ['*.{js,scss,css,map,png,jpg}'];
    options.rename = options.rename || function(filepath, digest) {
        
        // we split at the first period, isntead of extname
        var ext = filepath.indexOf('.');
        
        return [
            filepath.substring(0, ext),
            '.', digest.substr(0, 16),
            filepath.substring(ext),
        ].join('');
        
    };
    
    return function(files, ms, done) {
        
        var metadata = ms.metadata();
        metadata.hashes = metadata.hashes || {};
        
        Object.keys(files)
            .filter(function(filepath) {
                
                var basename = path.basename(filepath);
                return multimatch(basename, options.pattern).length > 0;
                
            })
            .forEach(function(filepath) {
                
                
                // this might error, that's Ok.
                var hash = crypto.createHash(options.algorithm);
                
                hash.update(files[filepath].contents);
                var digest = hash.digest('hex');
                
                var destination = options.rename(filepath, digest);
                
                files[destination] = files[filepath];
                if (!options.keep) delete files[filepath];
                
                metadata.hashes[filepath] = destination;
                
            });
        
        return process.nextTick(done);
        
    };
    
}
