'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    $('#shopMap_canvas')[0] && initMap();

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
    TML.data.$window.on('load', mapLoad);
  }
  function mapLoad() {
    var latlng = new google.maps.LatLng(35.681143, 139.767165);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("shopMap_canvas"), myOptions);
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);