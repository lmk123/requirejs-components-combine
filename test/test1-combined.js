define("_test1/test.html",function(){return'<div class="test-1">测试组件1加载完成</div>'});define("_test1/test.css",function(){return'.test-1 { background-color: red; color: #fff; }'});define( [
    "_test1/test.css" ,
    "_test1/test.html"
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
