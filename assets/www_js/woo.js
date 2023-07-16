var update_cart_timeout;

jQuery(function($) {
    $('.woocommerce').on('change', 'input.qty', function() {
        if (update_cart_timeout !== undefined) {
            clearTimeout(update_cart_timeout);
        }

        update_cart_timeout = setTimeout(function() {
            $("[name='update_cart']").trigger("click");
        }, 1000);
    });

    $(document.body).on('updated_cart_totals', function() {

        update_cart_count();
    });

    $(document.body).on('updated_wc_div', function() {

        handle_mouse_hover();
        handle_quantity_add_sub();

    });

    function update_cart_count() {
        $.ajax({
            type: 'GET',
            url: root + 'api',
            data: {
                'cmd': 'updateCartCount'
            },
            beforeSend: function() {

            }
        }).done(function(results) {
            var results = JSON.parse(results);
            if (results.code == 200) {
                $('.cart-count').html(results.res);
            } else {

            }
        });
    }

    if ($('#shipping_country').length) {
        woo_change_country($('#shipping_country').val());
        $(document.body).on('change', '#shipping_country', function(e) {
            const val = e.target.value
            woo_change_country(val);
        });

        $('#sf_method_select input[name="sf_method"]').on('change', function(e) {
            const val = e.target.value
            if (val == 'sf_delivery') {
                if ($('#shipping_address_1').val().includes('(SF LOCKER:')) {
                    $('#shipping_address_1').val('');
                }

                if ($('#shipping_postcode').val().includes('SFLOCKER')) {
                    $('#shipping_postcode').val('');
                }

                woo_handle_hk_fields(true);
            } else {
                woo_handle_hk_fields(false);
            }
        });

        $('#sfLockerModal').on('shown.bs.modal', function(event) {
            $('#mouse').removeClass('cross');
        })

        $('#sfLockerModal table tbody tr[data-code]').click(function(e) {
            const code = e.currentTarget.dataset.code;
            const addr = e.currentTarget.dataset.address;
            const region = e.currentTarget.dataset.region.toUpperCase();

            // if ($('#shipping_postcode').val()) {
            //   $('#shipping_postcode').val($('#shipping_postcode').val() + ' || SF Locker: ' + code);
            // } else {
            //   $('#shipping_postcode').val('SF Locker: ' + code);
            // }


            $('#shipping_state').val(region);
            $('#shipping_state').change();

            $('#shipping_address_1').val('(SF LOCKER: ' + code + ') ' + addr);
            $('#shipping_city').val('Hong Kong');
            $('#shipping_postcode').val('SFLOCKER' + code);

            $('#sfLocker_address').val(code);

            $('#sfLockerModal').modal('hide')
        });
    }
});

function woo_change_country(country) {
    if (country == 'HK') {
        $('#sf_method_select').removeClass('d-none');

        if ($('#shipping_postcode').val().includes('SFLOCKER')) {
            $('#sf_method_select input[name="sf_method"][value="sf_locker"]').prop('checked', true);
            $('#sfLocker_address').val($('#shipping_postcode').val().replace('SFLOCKER', ''));
        } else {
            $('#sf_method_select input[name="sf_method"][value="sf_delivery"]').prop('checked', true);
        }

        woo_handle_hk_fields(false, country);
    } else {
        $('#sf_method_select').addClass('d-none');
        woo_handle_hk_fields(true, country);
    }
}

function woo_handle_hk_fields(show, country = 'HK') {
    if (show) {
        if ($('#sf_method_select input[name="sf_method"]:checked').val() == 'sf_locker' && country == 'HK') {
            $('#sf_locker_input').removeClass('d-none');

            $('#shipping_address_1_field').addClass('d-none');
            $('#shipping_address_2_field').addClass('d-none');
            $('#shipping_city_field').addClass('d-none');
            $('#shipping_state_field').addClass('d-none');
            $('#shipping_postcode_field').addClass('d-none');
        } else {
            $('#sf_locker_input').addClass('d-none');

            $('#shipping_address_1_field').removeClass('d-none');
            $('#shipping_address_2_field').removeClass('d-none');
            $('#shipping_city_field').removeClass('d-none');
            $('#shipping_state_field').removeClass('d-none');
            $('#shipping_postcode_field').removeClass('d-none');
        }

    } else {
        if ($('#sf_method_select input[name="sf_method"]:checked').val() == 'sf_locker' && country == 'HK') {
            $('#sf_locker_input').removeClass('d-none');
        } else {
            $('#sf_locker_input').addClass('d-none');
        }

        if ($('#sf_method_select input[name="sf_method"]:checked').val() == 'sf_delivery' && country == 'HK') {
            $('#shipping_address_1_field').removeClass('d-none');
            $('#shipping_address_2_field').removeClass('d-none');
            $('#shipping_city_field').removeClass('d-none');
            $('#shipping_state_field').removeClass('d-none');
            $('#shipping_postcode_field').removeClass('d-none');
        } else {
            $('#shipping_address_1_field').addClass('d-none');
            $('#shipping_address_2_field').addClass('d-none');
            $('#shipping_city_field').addClass('d-none');
            $('#shipping_state_field').addClass('d-none');
            $('#shipping_postcode_field').addClass('d-none');
        }

    }
}