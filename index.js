var fs = require('fs');
var crypto = require('crypto');

module.exports = doobloon;

function doobloon(rootPath) {

    traverse(rootPath);

    function sha1sum(filePath) {
        var fd = fs.createReadStream(filePath);
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');

        fd.on('end', function () {
            hash.end();
            console.log(hash.read(), ' - ', filePath);
        });

        fd.pipe(hash);
    }

    function traverse(path) {
        fs.readdir(path, function (err, files) {
            if (err) {
                console.error(err);
            } else {
                for (var i = 0; i < files.length; i++) {
                    if (files[i].charAt(0) === '.') {
                        console.log("ignoring file ", path + '/' + files[i]);
                    } else {
                        (function (file) {
                            try {
                                fs.lstat(file, function (err, stats) {
                                    if (stats.isFile()) {
                                        sha1sum(file);
                                    } else if (stats.isDirectory()) {
                                        traverse(file);
                                    }
                                });
                            } catch (err) {
                                console.error(err);
                            }
                        })(path + '/' + files[i]);
                    }
                }
            }
        });
    }
}