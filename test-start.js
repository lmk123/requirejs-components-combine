var combine = require( './src/combine.js' );

combine( {
    workDir : './test' ,
    onOutput : function ( outPutPath , combinedString ) {
        require( 'fs' ).writeFile( outPutPath.slice( 0 , -3 ) + '-combined.js' , combinedString );
        return false;
    }
} );

console.log( '完成' );
