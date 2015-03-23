define("_test2/test.html",function(){return'<div class="test-2">测试组件2加载完成，并且带单引号：\'</div>'});define("_test2/test.css",function(){return'.test-2 { background-color: black; color: #fff; }'});define( [
    "_test2/test.css" ,
    "_test2/test.html"
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
