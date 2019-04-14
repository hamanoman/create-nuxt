'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    $('#shopMap_canvas')[0] && initMap();
    $('.alphabetListBox')[0] && initShowBrand();

    TML.common.countImgLoaded().done(function () {
      imgLoadCallback();
    }).fail(function () {
      imgLoadCallback();
    });
  }

  // functions  =================================================================

  /*
  *  countImgLoadedの後に実行する関数
  *
  */
  function imgLoadCallback() {}

  /*
  *  Google map 読み込み
  *
  */
  function initMap() {
    mapLoad();
  }
  function mapLoad() {
    var mapStyle = [{
      "elementType": "geometry",
      "stylers": [{
        "saturation": -100
      }]
    }, {
      "elementType": "labels",
      "stylers": [{
        "saturation": -100
      }, {
        "visibility": "simplified"
      }]
    }, {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.government",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.highway",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "visibility": "simplified"
      }]
    }];

    var lat = $('.shopMap').data('maplat');
    var lng = $('.shopMap').data('maplng');
    var mapName = $('.shopList_title').text();

    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
      zoom: 15,
      styles: mapStyle,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("shopMap_canvas"), myOptions);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: mapName
    });
  }

  /*
  *  ブランドのイニシャルを展開
  *
  */
  function initShowBrand() {
    $(document).on('click', '.alphabetList_more', showbrand);
  }

  function showbrand(e) {
    $('.alphabetListBox').addClass('show');
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);