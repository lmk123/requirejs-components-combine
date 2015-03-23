var fs         = require( 'fs' ) ,
    path       = require( 'path' ) ,

    textRegExp = /(['"])text!.+?\1/g ,
    bodyRegExp = /<body[^>]*>(\s*([\s\S]+)\s*)<\/body>/im;

module.exports = Main;

function Main( config ) {
    if ( !(this instanceof Main) ) {
        return new Main( config );
    }

    var that = this;
    this.options = {
        workDir : config.workDir || './' ,
        onOutput : config.onOutput || function () { } ,
        mainScript : config.mainScript || [ 'index.js' , 'main.js' ]
    };
    fs.readdir( this.options.workDir , function ( err , names ) {
        names.forEach( function ( name ) {
            var filePath = path.resolve( that.options.workDir , name );
            fs.stat( filePath , function ( err , statObj ) {
                if ( statObj.isDirectory() ) { // 如果是文件夹
                    that.handle( filePath );
                }
            } );
        } );
    } );

    // 测试 findFilename 函数
    //[
    //    '"text!path/to/filename.html!strip"' ,
    //    '"text!path/to/test.css"' ,
    //    '"text!no-path.html"'
    //].forEach( function ( v ) {
    //        console.log( findFilename( v ) );
    //    } );
}

Main.prototype.handle = function ( cptDirPath ) {
    var options = this.options ,
        mainScript = options.mainScript ,
        pickup;

    mainScript.some( function ( mainName ) {
        try {
            fs.statSync( cptDirPath + '/' + mainName );
            pickup = mainName;
            return true;
        }
        catch ( e ) {
            return false;
        }
    } );

    if ( !pickup ) {
        return;
    }

    fs.readFile( cptDirPath + '/' + pickup , function ( err , fileBuff ) {
        var fileContent = fileBuff.toString() ,
            depNames = fileContent.match( textRegExp ) ,
            depFileName;

        if ( depNames ) {

            depFileName = depNames.map( function ( fileDepName ) {
                return findFilename( fileDepName );
            } );

            depFileName.forEach( function ( filename , index ) {
                var depFileContent = fs.readFileSync( cptDirPath + '/' + filename ).toString() ,
                    depName = depNames[ index ];

                if ( hasStrip( depName ) ) {
                    depFileContent = depFileContent.match( bodyRegExp )[ 1 ];
                }
                fileContent = wrapDefine( depName , depFileContent ) + fileContent.replace( depName , transformDepName( depName ) );

            } );

            var outputPath = cptDirPath + '.js';
            if ( false !== options.onOutput( outputPath , fileContent ) ) {
                fs.writeFile( outputPath , fileContent );
            }
        }
    } );
};

/**
 * 从 dep 里面找到文件名
 * @param {string} depStr "text!path/to/filename.html!strip"
 * @returns {string}
 */
function findFilename( depStr ) {
    var depStr = depStr.slice( 6 ) ,
        lastX = depStr.lastIndexOf( '/' ) ,
        isStrip = hasStrip( depStr );

    //if ( -1 === lastX ) {
    //    lastX = 0;
    //}

    return depStr.slice( lastX + 1 , isStrip ? -7 : -1 );
}

function wrapDefine( depName , fileContent ) {
    return 'define(' + transformDepName( depName ) + ',function(){return\'' + fileContent.trim().replace( /'/g , "\\'" ) + '\'});';
}

function hasStrip( depName ) {
    return depName.indexOf( '!strip' ) > 0;
}

/**
 * 将 "text!path/to/file.css!strip" 转换成 _path/to/file.css!strip
 * @param {string} depName
 * @returns {string}
 */
function transformDepName( depName ) {
    var isStrip = hasStrip( depName );
    //    result = '_' + depName.slice( 6 , -1 );
    //if ( isStrip ) {
    //    result += '!strip';
    //}
    //return result; // 去掉开头的 "text! 与结尾的 "，并加前缀_，然后用双引号包裹
    return '"_' + depName.slice( 6 , isStrip ? -7 : -1 ) + '"';
}

//function async( functionsArray ) {
//    var ready = 0 ,
//        functions = Array.isArray( functionsArray ) ? functionsArray : Array.prototype.slice( 0 , -1 ) ,
//        count = functions.length ,
//        cb = arguments[ count - 1 ];
//
//    functions.forEach( function ( func ) {
//        func( allReady );
//    } );
//
//    function allReady() {
//        ready += 1;
//        if ( ready === count ) {
//            cb();
//        }
//    }
//}




