$(document).ready(function() {

    var w= $( window ).width();
    if (w < 768)
    {
        $('body').addClass('page-sidebar-closed');
    }
    else
    {
        $('body').removeClass('page-sidebar-closed');
    }
});
