$(function() {

    ajax_href();

    loyalty_form();
    loyalty_form_v2();
    subscribe_form();

    init_blog();

    www_pop_state();

    add_to_cart();

});

var showPercent;
var currentPercent;
var pageResult;
var loading = false;

(function($) {
    $(document).ready(function() {
        // ce_money_replace();
        // change_lbl_currency();
        $('.js-lc-btn').click(function(e) {
            e.preventDefault();
            var lc_lang = $('.lc-modal__lang.this-selected').attr('data-key');
            var lc_currency = $('.lc-modal__currency.this-selected').attr('data-key');

            var this_url = window.location.href;
            if (lc_lang != lang) {
                this_url = this_url.replace('/' + lang + '/', '/' + lc_lang + '/');
            }
            if (lc_currency) {
                // $.cookie('br_ce_language', lc_currency, { path: '/', domain: document.domain });
                console.log(lc_currency);
                $.cookie('aelia_cs_selected_currency', lc_currency, {
                    path: '/',
                    domain: document.domain
                });
            }
            window.location = this_url;
        });
    });

})(jQuery);
//
// function change_lbl_currency() {
// 	if(the_ce_js_data.visual_only && the_ce_js_data.current != 'none') {
// 		$('.lbl_currency').html(the_ce_js_data.current+' '+the_ce_js_data.symbol);
//
// 		$('.lc-modal__currency.this-selected').removeClass('this-selected');
// 		$('.lc-modal__currency[data-key="'+the_ce_js_data.current+'"]').addClass('this-selected');
// 	}
// }

function ajax_href() {
    $('.js-herf').unbind('click');
    $('.js-herf').click(function(e) {
        hrefClick = true;
        e.preventDefault();
        var url = $(this).attr('href');
        if ($(this).hasClass('www_direct')) {
            window.location.assign(url);
        } else {
            get_page_content(url);
        }
    });
}

function get_page_content(url, pushState = true) {
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            'cmd': 'getContent'
        },
        beforeSend: function() {
            $('.nav-wrapper').removeClass('this-active');
            $('.nav-logo').removeClass('this-active');
            if (ww < 992) {
                $('.nav-logo').css({
                    'transform': 'translateX(-50%)'
                });
            } else {

            }
            $('.nav-hover').removeClass('this-active');
            $('.page').fadeOut(400);
            $('.footer').fadeOut(400);

            clearLogoInterval();
            clearInterval(subscribeTo);
            $('.nav-wrapper').css({
                'pointer-events': 'none'
            });
            currentPercent = 0;
            pageResult = false;
            setTimeout(function() {
                if (pageResult == false) {
                    $('.nav-logo').addClass('loading');
                    $('.loading-wrapper').css({
                        'animation-play-state': 'running'
                    });
                    showPercent = window.setInterval(function() {
                        if (currentPercent < 100) {
                            currentPercent += 1;
                        } else {
                            currentPercent = 0;
                        }
                    }, 18);
                }
            }, 2000);
            // $('.nav-logo').addClass('loading');
        }
    }).done(function(results) {
        var results = JSON.parse(results);
        pageResult = true;
        if (results.code == 200) {

            if (results.headerTitle) {
                www_update_header_title(results.headerTitle);
            }

            if (pushState) {
                www_push_state(url);
            } else {
                www_update_state(url);
            }



            // nav style
            $('body').removeClass('ecommerce');
            $('.page').removeClass('ecommerce');
            $('.nav-hover').removeClass('d-none');
            if (results.navSytle) {
                switch (results.navSytle) {
                    case 'nav-to-left':
                        $('body').addClass('nav-to-left');
                        break;
                    default:
                        break;
                }
            } else {
                $('body').removeClass('nav-to-left');
            }

            // footer style
            $('.footer').removeClass('this-hide');
            if (results.footerSytle) {
                switch (results.footerSytle) {
                    case 'blog':
                        $('.footer').addClass('blog');
                        break;
                    default:
                        break;
                }
            } else {
                $('.footer').removeClass('blog');
            }

            // change nav item
            if (results.parentUrl) {
                $('.nav__item.this-active').removeClass('this-active');
                $('.nav__item[href="' + results.parentUrl + '"]').addClass('this-active');
            }

            // font end animate
            var checkLogoAnime = setInterval(function() {
                if (currentPercent == 100) {
                    clearInterval(showPercent);
                    clearInterval(checkLogoAnime);
                    $('.loading-wrapper').css({
                        'animation-play-state': 'paused'
                    });
                    $('.nav-logo').removeClass('loading');
                }
            }, 18);

            setTimeout(function() {
                checkLogoAnime = setInterval(function() {
                    if (currentPercent == 100) {
                        clearInterval(showPercent);
                        clearInterval(checkLogoAnime);
                        $('.loading-wrapper').css({
                            'animation-play-state': 'paused'
                        });
                        $('.nav-logo').removeClass('loading');
                    }
                }, 18);
            }, 2000);

            $('.nav-wrapper').css({
                'pointer-events': 'auto'
            });
            clearLogoInterval();
            setupLogoInterval();
            $('html, body').animate({
                scrollTop: 0
            }, 0);
            $('.page').fadeIn(600);
            $('.footer').fadeIn(600);
            hrefClick = false;
            changeCurrentSection($('.page-section[data-href="' + results.scrollTo + '"]'));



            $('div.page').html(results.res);

            // re init js function
            setTimeout(function() {
                $(window).off("scroll");
                refresh();
                ajax_href();
                // ce_money_replace();
                loyalty_form();
                loyalty_form_v2();
                subscribe_form();
                init_blog();
                add_to_cart();
                if (!googleMapConnected) {
                    googleMapDisconnect();
                } else {
                    initMap();
                }
            }, 200);

            // extra
            switch (results.extra) {
                case 'removeFooter':
                    $('.footer').addClass('this-hide');
                    break;
                default:
                    $('.footer').removeClass('this-hide');
                    // $('.footer').css({display: 'flex'});
                    break;

            }

        } else {

        }
    });
}

function get_product_by_cat(cat_slug) {
    $.ajax({
        type: 'POST',
        url: window.location.href,
        data: {
            'cmd': 'filterCat',
            'filter_slug': cat_slug
        },
        beforeSend: function() {

        }
    }).done(function(results) {
        var results = JSON.parse(results);
        if (results.code == 200) {
            $('.page-section').remove();
            $('div.page').append(results.res);
            refresh();
            // ce_money_replace();
        } else {

        }
    });
}

function add_to_cart() {
    $('.js-addToCart').unbind('click');
    $('.js-addToCart').click(function(e) {
        var cmdCode = 'addToCart';
        var product_id = $(this).attr('data-productid');
        var quantity = $(this).parent().find('.qty-wrapper .qty-wrapper__input').val();
        var data = {
            'product_id': product_id,
            'quantity': quantity
        };

        if ($('.form-item input[name=cust_name]').length &&
            $('select[name=cust_origins]').length &&
            $('select[name=cust_personality]').length) {

            $('.custom-form .notice').removeClass('show');
            data.cust_name = $('.form-item input[name=cust_name]').val();
            data.cust_origins = $('select[name=cust_origins]').val();
            data.cust_personality = $('select[name=cust_personality]').val();

            if (data.cust_personality == '') {
                cmdCode = '';
                $('.custom-form .notice').addClass('show');
            } else {
                cmdCode = 'addToCart_cust';
            }
        }
        if (cmdCode) {
            var _this = $(this);
            $.ajax({
                type: 'GET',
                url: root + 'api',
                data: {
                    'cmd': cmdCode,
                    'data': data
                },
                beforeSend: function() {
                    _this.find('.underline-a__lbl, .btn__lbl').addClass('d-none');
                    _this.find('.lds-ellipsis').removeClass('d-none');
                }
            }).done(function(results) {
                _this.find('.underline-a__lbl, .btn__lbl').removeClass('d-none');
                _this.find('.lds-ellipsis').addClass('d-none');

                var results = JSON.parse(results);
                if (results.code == 200) {
                    var cart_count = results.cart_count;
                    console.log(results.test);
                    $('.cart-count').html(cart_count);

                    $('.shop-alert').fadeIn(500);
                    setTimeout(function() {
                        $('.shop-alert').fadeOut(500);
                    }, 5000);
                } else {

                }
            });
        }
    });

}

function init_blog() {
    blog_cate();
    blog_sort();
    blog_sr_loadmore();
    blog_page();
    blog_search();
}

function blog_cate() {
    $('.js-blog-cate-item').unbind('click');
    $('.js-m-blog-cate-item').unbind();
    if ($('.blog-func__cate').length > 0) {
        $('.js-blog-cate-item').click(function(e) {
            e.preventDefault();
            var _this = $(this);

            $('.js-blog-cate-item.this-active').removeClass('this-active');
            _this.addClass('this-active');

            $('.js-m-blog-cate-item').val(_this.attr('data-id'));

            blog_filterCat();
        });

        $('.js-m-blog-cate-item').change(function(e) {
            e.preventDefault();
            var _this = $(this);
            $('.js-blog-cate-item.this-active').removeClass('this-active');
            $('.js-blog-cate-item[data-id="' + _this.val() + '"]').addClass('this-active');

            blog_filterCat();
        });
    }
}

function blog_sort() {
    $('.js-blog-sort-item').unbind('click');
    $('.js-m-blog-sort-item').unbind();
    if ($('.blog-func__sort').length > 0) {
        $('.js-blog-sort-item').click(function(e) {
            e.preventDefault();
            var _this = $(this);

            $('.js-blog-sort-item.this-active').removeClass('this-active');
            _this.addClass('this-active');

            $('.js-m-blog-sort-item').val(_this.attr('data-sort'));

            blog_filterCat();
        });

        $('.js-m-blog-sort-item').change(function(e) {
            e.preventDefault();
            var _this = $(this);
            $('.js-blog-sort-item.this-active').removeClass('this-active');
            $('.js-blog-sort-item[data-sort="' + _this.val() + '"]').addClass('this-active');

            blog_filterCat();
        });
    }
}

function blog_filterCat() {
    var cat_slug = $('.page-filter__item.this-active').attr('data-id');
    var sort = $('.js-blog-sort-item.this-active').attr('data-sort');
    if (!loading) {
        loading = true;
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                'cmd': 'filterCat',
                'filter_slug': cat_slug,
                'filter_sort': sort
            },
            beforeSend: function() {
                // $('.blog-list').fadeOut(400);
                $('.blog-list').css({
                    opacity: '0'
                });
            }
        }).done(function(results) {
            loading = false;
            var results = JSON.parse(results);
            if (results.code == 200) {
                $('.blog-item').remove();
                $('div.blog-list').append(results.res);

                $('.blog-page-no .btm-page-no').remove();
                $('div.blog-page-no').append(results.page_no);
                init_blog();
                // $('.blog-list').fadeIn(400);
                $('.blog-list').css({
                    opacity: '1'
                });
                isInViewport();
                handle_mouse_hover();
                animateBtnSVG();
                ajax_href();
            } else {

            }
        });
    }

}

function blog_sr_loadmore() {
    $('.js-blog-sr-more').unbind('click');
    if ($('.blog-sr').length > 0) {
        $('.js-blog-sr-more').click(function(e) {
            e.preventDefault();
            $(this).parent().find('.blog-s-item').addClass('this-active');
            $(this).remove();
        });
    }
}

function blog_page() {
    $('.btm-page-no__item').unbind('click');
    if ($('.btm-page-no').length > 0) {
        $('.btm-page-no__item:not(.this-active)').click(function(e) {

            e.preventDefault();
            var _this = $(this);

            $('.btm-page-no__item.this-active').removeClass('this-active');
            _this.addClass('this-active');

            var page_no = _this.attr('data-page');
            var cat_slug = $('.page-filter__item.this-active').attr('data-id');
            var sort = $('.js-blog-sort-item.this-active').attr('data-sort');
            if (!loading) {
                loading = true;
                $.ajax({
                    type: 'POST',
                    url: window.location.href,
                    data: {
                        'cmd': 'filterPageNo',
                        'filter_slug': cat_slug,
                        'filter_sort': sort,
                        'page_no': page_no
                    },
                    beforeSend: function() {
                        $('.blog-list').fadeOut(400);
                        $('html, body').animate({
                            scrollTop: 0
                        }, 600);
                    }
                }).done(function(results) {
                    loading = false;
                    var results = JSON.parse(results);
                    if (results.code == 200) {
                        $('.blog-item').remove();
                        $('div.blog-list').append(results.res);
                        init_blog();
                        $('.blog-list').fadeIn(600);
                        isInViewport();
                        handle_mouse_hover();
                        animateBtnSVG();
                        ajax_href();
                    } else {

                    }
                });
            }

        });
    }
}

function blog_search() {
    if ($('.blog-func__search').length > 0) {

        $('.blog-func__search').click(function() {
            $('.blog-func').addClass('search');
            setTimeout(function() {
                $('.blog-func__search-input').focus();
            }, 100);
        });
        $('.blog-func__search-close').click(function() {
            $('.blog-func__search-input').val('');
            $('.blog-func').removeClass('search');
            $('.blog-list').fadeIn(600);
            $('.blog-page-no').fadeIn(600);
            $('.blog-sr').fadeOut(400);

        });

        $('.blog-func__search-input').bind("enterKey", function(e) {
            var _this = $(this);
            $('.blog-sr').fadeOut(400);
            $('.blog-list').fadeOut(400);
            $('.blog-page-no').fadeOut(400);
            if (!loading) {
                loading = true;
                $.ajax({
                    type: 'POST',
                    url: window.location.href,
                    data: {
                        'cmd': 'seachResult',
                        'search_text': _this.val()
                    },
                    beforeSend: function() {

                    }
                }).done(function(results) {
                    $('.blog-sr').fadeIn(400);
                    loading = false;
                    var results = JSON.parse(results);
                    if (results.code == 200) {
                        $('.blog-sr section').remove();


                        $('div.blog-sr').append(results.res);
                        init_blog();
                        isInViewport();
                        handle_mouse_hover();
                        animateBtnSVG();
                    } else {

                    }
                });
            }


        });
        $('.blog-func__search-input').keyup(function(e) {
            if (e.keyCode == 13 && !loading) {
                var _this = $(this);
                _this.trigger("enterKey");
            }
        });
    }
}


function loyalty_form() {
    $('.js-loyalty-form-submit').unbind('click');
    if ($('#loyalty-form').length > 0) {
        $('.js-loyalty-form-submit').click(function(e) {
            e.preventDefault();

            // @todo: replace the value of cardId with your card-id
            var cardId = '3NflsdVO0Q9gDttbn4GbTz';

            // build JSON payload
            // @todo: you might want to add validation here
            var payload = {};
            payload.timeZoneOffset = -480;
            payload.dataConsentOptIn = $('#loyalty-form #dataConsent').is(':checked');

            // @todo: replace the below payload with your own field names as described in the blog post
            // 2018-11-22T00:00:00+08:00

            var birthday = $('#loyalty-form #birth_year').val() + '-' + $('#loyalty-form #birth_month').val() + '-' + $('#loyalty-form #birth_day').val() + 'T00:00:00+08:00';
            payload.customerData = {
                "First Name": $('#loyalty-form #firstname').val(),
                "Email Address": $('#loyalty-form #email').val(),
                "Birthday": birthday,
            }

            // Log the payload for debug

            // Execute ajax call with payload.
            // @todo: you might want to add in a loader whilst the ajax call runs
            //
            $.ajax({
                url: 'https://api.loopyloyalty.com/enrol/' + cardId,
                data: JSON.stringify(payload),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(data) {
                    // @todo: if needed replace this with your success logic (for now it redirects to the card)
                    // alert('Success, the pass URL is ' + data.url + '. Press OK to redirect to the card.');
                    window.location = data.url;
                },
                error: function(xhr) {
                    // @todo: replace this with your error logic
                    alert("Error, could not create card: " + xhr.responseJSON.error);
                }
            });
        });
    }
}
/* loyalty form V2 start */
function loyalty_form_v2() {
    $('.js-loyalty-form-submit-v2').unbind('click');
    if ($('#loyalty-form').length > 0) {
        $('.js-loyalty-form-submit-v2').click(function(e) {
            e.preventDefault();
            $('#loyalty-form #error-msg').text("");
            $('#loyalty-form input').removeClass('error');
            $('#loyalty-form #agreeTnC').parent().removeClass('error');
            // @todo: replace the value of cardId with your card-id
            // var cardId = '3NflsdVO0Q9gDttbn4GbTz';
            //window.location.href,
            // build JSON payload
            // @todo: you might want to add validation here
            var payload = {};
            payload.timeZoneOffset = -480;
            payload.dataConsentOptIn = $('#loyalty-form #dataConsent').is(':checked');

            // @todo: replace the below payload with your own field names as described in the blog post
            // 2018-11-22T00:00:00+08:00

            let compulsorylist = ['firstname', 'lastname', 'email', 'mobile'];
            let fieldCheck = true;
            $.each(compulsorylist, function(i, val) {
                if (!$('#loyalty-form #' + val).val()) {
                    fieldCheck = false;
                    $('#loyalty-form #' + val).addClass('error');
                } else if (val == "email") {
                    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                    if (!$('#loyalty-form #' + val).val().match(validRegex)) {
                        fieldCheck = false;
                        $('#loyalty-form #' + val).addClass('error');
                    }
                } else if (val == "mobile") {
                    let firstNumber = $('#loyalty-form #' + val).val().substring(0, 1);
                    if ($.inArray(firstNumber, ["5", "6", "9", "4", "7", "8"]) == -1) {
                        fieldCheck = false;
                        $('#loyalty-form #' + val).addClass('error');
                    } else if ($('#loyalty-form #' + val).val().length != 8) {
                        fieldCheck = false;
                        $('#loyalty-form #' + val).addClass('error');
                    } else if ($('#loyalty-form #' + val).val().substring(0, 3) == "999") {
                        fieldCheck = false;
                        $('#loyalty-form #' + val).addClass('error');
                    } else if ($('#loyalty-form #' + val).val().substring(0, 1) == "999") {
                        fieldCheck = false;
                        $('#loyalty-form #' + val).addClass('error');
                    }
                }
            });
            if (!$('#loyalty-form #agreeTnC').is(':checked')) {
                fieldCheck = false;
                $('#loyalty-form #agreeTnC').parent().addClass('error');
            }
            // var birthday = $('#loyalty-form #birth_year').val()+'-'+$('#loyalty-form #birth_month').val()+'-'+$('#loyalty-form #birth_day').val()+'T00:00:00+08:00';
            if (fieldCheck) {
                payload.customerData = {
                    "firstname": $('#loyalty-form #firstname').val(),
                    "lastname": $('#loyalty-form #lastname').val(),
                    "email": $('#loyalty-form #email').val(),
                    "birthday_y": $('#loyalty-form #birth_year').val(),
                    "birthday_m": $('#loyalty-form #birth_month').val(),
                    "birthday_d": $('#loyalty-form #birth_day').val(),
                    "mobile": $('#loyalty-form #mobile').val(),
                }
                if ($(".loading-overlay.form-submit").length == 0) {
                    $(".global-container").append("<div class='loading-overlay form-submit'></div>");
                } else {
                    $(".loading-overlay.form-submit").removeClass('loaded');
                }

                $('#loyalty-form input').prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: root + 'en/api/loyalty-card-api',
                    data: payload
                }).done(function(data) {
                    if (data.code == 200) {
                        window.location = data.url;
                    } else if (data.code == 400) {
                        if (data.msg.error) {
                            let tmpMSG = data.msg.error;
                            tmpMSG = tmpMSG.substring(tmpMSG.indexOf("msg:") + 5);
                            $('#loyalty-form #error-msg').text(tmpMSG);
                        }
                        $('#loyalty-form input').prop("disabled", false);
                        $(".loading-overlay.form-submit").addClass('loaded');
                    }
                });
            }

        });
    }
}
/* loyalty form V2 end */

function subscribe_form() {
    $('.subscribe__btn').unbind('click');
    $('.subscribe__btn').click(function() {
        var _this = $(this);
        var email = _this.parent().find('.subscribe__input[name=email]').val();
        var fname = '';
        if (_this.parent().find('.subscribe__input[name=fname]').val()) {
            fname = _this.parent().find('.subscribe__input[name=fname]').val();
        }
        _this.parent().find('.subscribe__msg').removeClass('--active');
        if (!loading) {
            loading = true;
            $.ajax({
                type: 'GET',
                url: root + 'api',
                data: {
                    'cmd': 'mailchimpApi',
                    'data': {
                        'email': email,
                        'fname': fname
                    }
                },
                beforeSend: function() {

                }
            }).done(function(results) {
                loading = false;
                console.log(results);
                var results = JSON.parse(results);
                switch (results.code) {
                    case 200:
                        clearInterval(subscribeTo);
                        _this.parent().find('.subscribe__msg:not(.--error)').addClass('--active');
                        break;
                    case 300:
                        _this.parent().find('.subscribe__msg.--error').addClass('--active');
                        break;
                    default:
                        _this.parent().find('.subscribe__msg.--error').addClass('--active');
                        break;
                }
            });
        }
    });
}

function www_push_state(state) {
    window.history.pushState(null, '', state);
    gtag('config', 'GTM-MZ5L8NG', {
        'page_title': document.title,
        'page_path': window.location.pathname
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'Pageview',
        'pagePath': window.location.pathname,
        'pageTitle': document.title //some arbitrary name for the page/state
    });
    console.log('gtags push');
}

function www_update_state(state) {
    window.history.replaceState(null, '', state);
    gtag('config', 'GTM-MZ5L8NG', {
        'page_title': document.title,
        'page_path': window.location.pathname
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'Pageview',
        'pagePath': window.location.pathname,
        'pageTitle': document.title //some arbitrary name for the page/state
    });
}

function www_update_header_title(title) {
    document.title = title;
}

function www_pop_state() {
    $(window).on('popstate', function() {
        var home_url = root + lang + '/';
        if (window.location.href != home_url) {
            get_page_content(window.location.href, false);
        } else {
            window.location.href = window.location.href;
        }
    });
}