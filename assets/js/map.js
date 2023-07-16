function initMap() {
    console.log('initMap');
    googleMapConnected = true;

    var locations = get_shops_center();

    var centers = get_location_center();

    if (centers.length > 0) {
        var map = new google.maps.Map(document.getElementById('locations-map'), {
            zoom: 13,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            center: centers[0].latlng,
            styles: [{
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": [{
                            "visibility": "on"
                        },
                        {
                            "color": "#d45959"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                            "saturation": 36
                        },
                        {
                            "color": "#333333"
                        },
                        {
                            "lightness": 40
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                            "visibility": "on"
                        },
                        {
                            "color": "#ffffff"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [{
                            "color": "#fefefe"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#fefefe"
                        },
                        {
                            "lightness": 17
                        },
                        {
                            "weight": 1.2
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#f5f5f5"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#f5f5f5"
                        },
                        {
                            "lightness": 21
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#dedede"
                        },
                        {
                            "lightness": 21
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{
                            "color": "#ffffff"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#ffffff"
                        },
                        {
                            "lightness": 29
                        },
                        {
                            "weight": 0.2
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#ffffff"
                        },
                        {
                            "lightness": 18
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#ffffff"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#f2f2f2"
                        },
                        {
                            "lightness": 19
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#e9e9e9"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                }
            ]
        });
        var mapPin = {
            url: root + 'assets/images/map_pin_box.svg',
            size: new google.maps.Size(50, 56),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(25, 28),
            scaledSize: new google.maps.Size(30, 33)
        }
        var markers = [];
        for (var i = 0; i < locations.length; i++) {

            mapPin.url = locations[i].icon ? locations[i].icon : root + 'assets/images/map_pin_box.svg'

            markers[i] = new google.maps.Marker({
                position: locations[i].latlng,
                icon: mapPin,
                map: map,
                locID: locations[i].locationID
            });
            markers[i].addListener('click', scroll_to_lctn);
            markers[i].addListener('click', function() {
                map.setZoom(18);
                map.panTo(this.position);
            });
        }

        //handle show all btn
        $('.map-btn').click(function() {
            $('.lctn-item, .map-img').removeClass('this-active');
            $('html, body').animate({
                scrollTop: 0
            }, 600);
            $('.map-btn').removeClass('this-show');
            var activeIndex = $('.loc-section.this-active').attr('data-id');
            var locPos = centers[activeIndex].latlng;
            map.setZoom(13);
            map.panTo(locPos);
        });

        $('.lctn-item:not(.china)').click(function() {
            var thisIndex = $(this).attr('data-id');
            var locPos = locations[thisIndex].latlng;
            map.setZoom(18);
            map.panTo(locPos);
        });
        $('.lctn-item').click(function() {
            if (ww > 768) {
                var scrollPos = $(this).offset().top - 100;
            } else {
                var scrollPos = 0;
            }
            $('.lctn-item').removeClass('this-active');
            $('.map-btn').addClass('this-show');
            $(this).addClass('this-active');
            $('html, body').animate({
                scrollTop: scrollPos
            }, 600);
        });

        //handle china loc item click
        $('.lctn-item.china').click(function() {
            var thisIndex = $(this).attr('data-id');
            deactivate_activate('map-img', thisIndex);
        });

        $('.loc-section.this-active').show();
        $('.loc-section:not(.this-active)').hide();

        //handle change tab
        $('.loc-tab').click(function() {
            $('.lctn-item, .map-img').removeClass('this-active');
            $('html, body').animate({
                scrollTop: 0
            }, 600);
            var thisIndex = $(this).attr('data-id');
            $('.map-btn').removeClass('this-show');
            $('.loc-section:not(.this-active)').find('.js-reveal').removeClass('reveal');
            deactivate_activate('loc-section', thisIndex);
            $('.loc-section:not(.this-active)').hide();
            $('.loc-section.this-active').show();
            setTimeout(function() {
                isInViewport();
            }, 200);
        });

        //handle click tab to change map
        $('.loc-tab:not(.china)').click(function() {
            $('.tab-img').removeClass('this-active');
            var thisIndex = $(this).attr('data-id');
            var locPos = centers[thisIndex].latlng;
            map.setZoom(13);
            map.panTo(locPos);
        });

        // handle click china tab
        $('.loc-tab.china').click(function() {
            $('.tab-img').addClass('this-active');
        });

        $('.m-loc-filter').on('change', function() {
            $('.lctn-item, .map-img, .tab-img').removeClass('this-active');
            $('.map-btn').removeClass('this-show');
            $('html, body').animate({
                scrollTop: 0
            }, 600);
            var thisIndex = $(this).val();

            $('.loc-section:not(.this-active)').find('.js-reveal').removeClass('reveal');
            deactivate_activate('loc-section', thisIndex);
            $('.loc-section:not(.this-active)').hide();
            $('.loc-section.this-active').show();
            setTimeout(function() {
                isInViewport();
            }, 200);

            var chinaIndex = 1;
            // if (thisIndex != chinaIndex) {
            var locPos = centers[thisIndex].latlng;
            map.setZoom(13);
            map.panTo(locPos);
            // } else {
            //   $('.tab-img').addClass('this-active');
            // }
        });
    }
}

function scroll_to_lctn() {
    var thisIndex = this.locID;
    var scrollPos = $('.lctn-item[data-id="' + thisIndex + '"]').offset().top - 100;
    $('.lctn-item').removeClass('this-active');
    $('.lctn-item[data-id="' + thisIndex + '"]').addClass('this-active');
    $('.map-btn').addClass('this-show');
    $('html, body').animate({
        scrollTop: scrollPos
    }, 600);
}

function get_location_center() {
    var centers = [];

    $('.loc-section').each(function() {
        centers.push({
            latlng: {
                lat: parseFloat($(this).attr('data-lat')),
                lng: parseFloat($(this).attr('data-lng'))
            },
            centerID: $(this).attr('data-id'),
            icon: $(this).attr('data-icon'),
        });
    });

    return centers;
}

function get_shops_center() {
    var locations = [];

    $('.loc-section .lctn-item').each(function() {
        locations.push({
            latlng: {
                lat: parseFloat($(this).attr('data-lat')),
                lng: parseFloat($(this).attr('data-lng'))
            },
            locationID: $(this).attr('data-id'),
            icon: $(this).attr('data-icon'),
        });
    });

    return locations;
}

function googleMapDisconnect() {
    if (!googleMapConnected) {
        $('#locations-map').remove();
        $('.lctn-item').click(function() {
            var thisIndex = $(this).attr('data-id');
            deactivate_activate('map-img', thisIndex);
        });

        $('.loc-section.this-active').show();
        $('.loc-section:not(.this-active)').hide();

        // handle click china tab
        $('.loc-tab').click(function() {
            $('.tab-img[data="' + $(this).attr('data-id') + '"]').addClass('this-active');
        });

        $('.m-loc-filter').on('change', function() {
            $('.lctn-item, .map-img, .tab-img').removeClass('this-active');
            $('html, body').animate({
                scrollTop: 0
            }, 600);
            var thisIndex = $(this).val();
            $('.loc-section:not(.this-active)').find('.js-reveal').removeClass('reveal');
            deactivate_activate('loc-section', thisIndex);
            $('.loc-section:not(.this-active)').hide();
            $('.loc-section.this-active').show();
            setTimeout(function() {
                isInViewport();
            }, 200);

            $('.tab-img[data="' + $(this).attr('data-id') + '"]').addClass('this-active');
        });
    }

}