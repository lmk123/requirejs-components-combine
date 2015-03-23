define( [
    'text!test1/test.css' ,
    'text!test1/test.html!strip'
] , function ( CSS , HTML ) {
    var css = document.createElement( 'style' ) ,
        html = document.createElement( 'div' ) ,
        append = function () {
            append = function () {
            };
            document.head.appendChild( css );
            document.body.appendChild( html.children[ 0 ] );
        };

    html.innerHTML = HTML;
    css.textContent = CSS;
    return function () {
        append();
    };
} );
