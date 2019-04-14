'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    resizeEvent();

    $('.mainvisual_list')[0] && initSlider();

    initInstagram();

    TML.data.$window.on(TML.data.eventHandler['resize'], resizeEvent);

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
  *  resizeEvent
  *
  */
  function resizeEvent() {
    $('.mainvisual_img').height(TML.data.winH);
  }

  /*
  *  スライダー初期化
  *
  */

  function initSlider() {
    sliderAction();
    slider_colorChange();
    slider_change();
    TML.data.$window.on(TML.data.eventHandler['breakpointChange'], sliderAction);
  }

  var $thumbnailSlider;
  var sliderFlag = false;
  function sliderAction() {
    var sliderOption = {
      fade: true,
      speed: 1200,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      dots: true,
      pauseOnHover: false
    };

    if (sliderFlag) {
      $thumbnailSlider.slick('slickPlay');
    } else {
      $thumbnailSlider = $('.mainvisual_list').slick(sliderOption);
      sliderFlag = true;
    }
  }

  function slider_colorChange() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var getColor = $('.mainvisual_list_node').eq(index).data('color');
    $('body').attr('data-color', getColor);
  }

  function slider_change() {
    $thumbnailSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      slider_colorChange(nextSlide);
    });
  }

  /*
  *  インスタグラム
  *
  */

  function initInstagram() {
    var itemLength = 10,
        igId = '17841401850625870',
        token = "EAAGHiEvTHkEBALOIQGpSaneFup5rfCr8TEKaaZBpDTCT3Sun7fISQfGltlZBGSl6KE54o3lWF8Hs7IZCZCuAIL9mNVugMU6fBfz6WWSb0r5FxSFCbx7M0fNDZB3O9P1Qaa9ffxWwLopZBWnTakP2UllJiFBYsMwMFsoRw5W8zUAgZDZD",
        api = 'https://graph.facebook.com/v3.1/' + igId + '?fields=name%2Cmedia.limit(' + itemLength + ')%7Bcaption%2Clike_count%2Cmedia_url%2Cpermalink%2Ctimestamp%2Cusername%7D',
        instaHtml = '';
    $.ajax({
      url: api,
      data: { access_token: token },
      dataType: "jsonp",
      error: function error(jqXHR, textStatus, errorThrown) {
        $('.instagramSection').hide();
      },
      success: function success(data, textStatus, jqXHR) {
        if (data.media.data) {
          for (var i = 0; i < data.media.data.length; i++) {
            var d = data.media.data[i];
            var image = d.media_url;
            instaHtml += '<div class="getInstagram_node ' + i + '"><a href="' + d.permalink + '" target="_blank">\
                          <div class="getInstagram_img"><img src="' + image + '" alt="instagram"></div>\
                          <div class="getInstagram_likes"><i class="getInstagram_likes_icon"><svg><use xlink:href="#heart"></use></svg>' + d.like_count + '</i></div>\
                        </a></div>';
          }
          $('.getInstagram').append(instaHtml);
          initInstagramSlider();
        } else {
          $('.instagramSection').hide();
        }
      }
    });
  }

  var $instaSlider;
  var instaSliderFlag = false;
  function initInstagramSlider() {
    instagramSlider();
    TML.data.$window.on(TML.data.eventHandler['breakpointChange'], instagramSlider);
  }
  function instagramSlider() {
    var sliderOption = {
      arrows: false,
      dots: false,
      autoplay: false,
      autoplaySpeed: 0,
      centerMode: true,
      centerPadding: '0px',
      touchThreshold: 30,
      cssEase: 'linear',
      speed: 100,
      slidesToShow: 6,
      slidesToScroll: 1
    };

    if (TML.data.$MQ == 'SP') {
      if (instaSliderFlag) {
        $instaSlider.slick('unslick');
        instaSliderFlag = false;
      }
    } else {
      if (!instaSliderFlag) {
        $instaSlider = $('.getInstagram').slick(sliderOption);
      }
      instaSliderFlag = true;
    }
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);