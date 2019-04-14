'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    $('.singleContent_photoSlider')[0] && initSlider();

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
  *  スライダー初期化
  *
  */

  function initSlider() {
    $('.singleContent_photoSlider_node').on('click', slidePopup);
    $('.singleContent_popupSlider_pager').on('click', slidePopupChange);
    $('.singleContent_popupSlider').on('click', slidePopupClose);
    sliderAction();
  }

  var $thumbnailSlider;
  var sliderFlag = false;
  function sliderAction() {
    $('.singleContent_photoBox').each(function () {
      $(this).find('.singleContent_photoSlider_thumbnail_node').eq(0).addClass('select');

      var slideLength = $(this).find('.singleContent_photoSlider_thumbnail_node').length;
      $(this).find('.singleContent_photoSlider_pager .total').html(slideLength);
    });

    $('.singleContent_photoSlider').on('init', function (slick) {
      slideJudge(slick['currentTarget']);
    });

    $thumbnailSlider = $('.singleContent_photoSlider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      lazyLoad: 'progressive',
      arrows: true,
      dots: false,
      centerMode: true,
      centerPadding: '0px',
      responsive: [{
        breakpoint: 768,
        settings: {
          centerMode: true,
          slidesToShow: 1
        }
      }]
    });

    $thumbnailSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      var sliderID = slick['$slider'].data('photosliderid');
      slideJudge(slick['$slider'][0]);

      $('.singleContent_photoBox[data-photosliderid="' + sliderID + '"]').find('.singleContent_photoSlider_thumbnail_node').removeClass('select');
      $('.singleContent_photoBox[data-photosliderid="' + sliderID + '"]').find('.singleContent_photoSlider_thumbnail_node').eq(nextSlide).addClass('select');

      $('.singleContent_photoBox[data-photosliderid="' + sliderID + '"]').find('.singleContent_photoSlider_pager .current').html(nextSlide + 1);
    });

    $('.singleContent_photoSlider_thumbnail_node').on('click', function () {
      var _parent = $(this).closest('.singleContent_photoBox');
      var index = _parent.find('.singleContent_photoSlider_thumbnail_node').index(this);

      _parent.find('.singleContent_photoSlider').slick('slickGoTo', index);
    });
  }

  function slideJudge(target) {
    if (target['childNodes'].length < 3) {
      $(target).closest('.singleContent_photoBox').addClass('notSlide');
    } else {
      $(target).closest('.singleContent_photoBox').removeClass('notSlide');
    }
  }

  var activePopupNum = 0;
  function slidePopup(e) {
    var _this = $(e.currentTarget);
    var _parent = _this.closest('.singleContent_photoBox');
    var _popup = _parent.next();
    activePopupNum = _this.data('slick-index');
    slidePopupSelect(_popup);
    _popup.addClass('active');
    TML.common.screenLock();
  }

  function slidePopupChange(e) {
    var _this = $(e.currentTarget);
    var _parent = _this.closest('.singleContent_popupSlider');
    var _slideLength = _parent.find('.singleContent_popupSlider_node').length;
    var index = _this.is('.prev') ? activePopupNum - 1 : activePopupNum + 1;
    activePopupNum = index >= _slideLength ? 0 : index < 0 ? _slideLength - 1 : index;
    slidePopupSelect(_parent);
    return false;
  }

  function slidePopupSelect(_popup) {
    _popup.find('.singleContent_popupSlider_node').removeClass('selected');
    _popup.find('.singleContent_popupSlider_node').eq(activePopupNum).addClass('selected');
  }

  function slidePopupClose(e) {
    var _this = $(e.target);
    if (!_this.is('.singleContent_popupSlider_img')) {
      $('.singleContent_popupSlider').removeClass('active');
      $('.singleContent_popupSlider_node').removeClass('selected');
      TML.common.screenUnlock();
    }
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);