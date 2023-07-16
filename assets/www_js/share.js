window.fbAsyncInit = function() {
    FB.init({
        appId: '778640762504810',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.9'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function() {
    // $('a.fb-share').click(function(e) {
    // 	e.preventDefault();
    // 	var shareURL = $(this).attr('href');
    // 	FB.ui(
    // 	 {
    // 	  method: 'share',
    // 	  href: shareURL
    // 	}, function(response){});
    //
    // });

    $('body').on({
        click: function(e) {
            e.preventDefault();
            var shareURL = $(this).attr('href');
            FB.ui({
                method: 'share',
                href: shareURL
            }, function(response) {});
        }
    }, 'a.fb-share');
});