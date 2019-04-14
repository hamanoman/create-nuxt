'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    $('.singleThumbnail_slider')[0] && initSlider();
    initTab();
    initShopMore();
    initFixedLayout();
    initJudgeSale();

    pjaxloadEndCallback();
  }

  // functions  =================================================================

  /*
  *  pjaxloadEndCallback
  *
  */
  function pjaxloadEndCallback() {
    $('.pjaxContents').on(TML.data.eventHandler['transitionEnd'], function () {
      fixedLayoutReize();
    });
  }

  /*
  *  スライダー初期化
  *
  */

  function initSlider() {
    sliderAction();
    TML.data.$window.on('onBreakpointChange', sliderAction);
  }

  var $thumbnailSlider;
  var sliderFlag = false;
  function sliderAction() {
    var sliderOption = {
      lazyLoad: 'progressive',
      arrows: false,
      dots: true
    };

    if (TML.data.$MQ == 'PC') {
      if (sliderFlag) {
        $thumbnailSlider.slick('unslick');
        sliderFlag = false;
      }
    } else {
      if (!sliderFlag) {
        $thumbnailSlider = $('.singleThumbnail_slider').slick(sliderOption);
      }
      sliderFlag = true;
    }
  }

  /*
  *  JudgeSale
  *
  */
  function initJudgeSale() {
    if ('wp_data' in window) {
      judgeSale().done(function (data) {
        judgeSaleResult(data);
      }).fail(function () {});
    }
  }

  function judgeSale() {
    var defer = new $.Deferred();
    $.ajax({
      type: 'POST',
      url: wp_data.ajax_url,
      dataType: 'text',
      data: {
        'security': wp_data.nonce,
        'action': 'tml_judge_sale',
        'id': wp_data.id
      }
    }).done(function (data) {
      defer.resolve(data);
    }).fail(function (data) {
      defer.reject();
    });
    return defer.promise();
  }

  function judgeSaleResult(data) {
    if (data == '[true]') {
      console.log('在庫あり');
    } else {
      console.log('在庫なし');
      $('.singleButton_node.online').hide();
    }
    fixedLayoutReize();
  }

  /*
  *  タブイベント
  *
  */
  var $targetTitle = $('.singleTab_title_node');
  var $targetContent = $('.singleTab_content_node');
  function initTab() {
    $targetTitle.on('click', tabAction);

    $targetTitle.eq(0).addClass('selected');
    $('.singleTab_content_node:gt(0)').hide();
  }
  function tabAction(e) {
    var _this = $(e.currentTarget);
    var i = $targetTitle.index($(this));
    if (!_this.is('.selected')) {
      $targetTitle.removeClass('selected');
      _this.addClass('selected');
      $targetContent.hide();
      $targetContent.eq(i).stop(true, true).fadeIn(200, function () {
        fixedLayoutReize();
      });
    }
  }

  /*
  *  タブイベント
  *
  */
  function initShopMore() {
    $('.singleTab_shop_more').on('click', shopMoreAction);
  }
  function shopMoreAction(e) {
    if ($('.singleTab_shop').attr('data-compact') == 'open') {
      $('.singleTab_shop').attr('data-compact', 'close');
    } else {
      $('.singleTab_shop').attr('data-compact', 'open');
    }
  }

  /*
  *  scroll fixed layout
  *
  */

  function initFixedLayout() {
    TML.data.$window.on(TML.data.eventHandler['resize'], fixedLayoutReize);
    TML.data.$window.on(TML.data.eventHandler['scroll'], fixedLayoutAction);
  }

  var leftH,
      rightH,
      cDiff,
      maxItem,
      startLine,
      getDirection = '',
      preDirection,
      liquidBox = rightH,
      baseBox = leftH,
      $liquidSection,
      $baseSection,
      layoutPattern,
      headerH = 60,
      preLayoutPattern;

  function fixedLayoutReize() {
    fixedLayoutGetPosition();
    fixedLayoutReset(); // 上で取得した値を、ここでセット
    fixedLayoutAction();
  }

  function fixedLayoutGetPosition() {
    if (TML.data.$MQ !== 'PC' || !$('.singleHead')[0]) return;
    startLine = $('.singleHead').offset().top - headerH;

    leftH = $('.singleImgAll_scroll_inner').innerHeight();
    rightH = $('.singleInfo_scroll_inner').innerHeight();
    cDiff = leftH - rightH;

    maxItem = Math.max(leftH, rightH);
  }

  function fixedLayoutChange() {
    if (cDiff > 0) {
      // right値が低い
      getDirection = 'right';
    } else {
      // right値が高い
      getDirection = 'left';
    }

    if (preDirection !== getDirection) {
      fixedLayoutReset();
      preDirection = getDirection;
    }
  }

  function fixedLayoutAction() {
    if (TML.data.$MQ !== 'PC' || !$('.singleHead')[0] || maxItem < TML.data.winH) return;
    fixedLayoutChange();

    /* LIQUIDがwondowHより高くて、LIQUIDが動きはじめるとき */
    if (liquidBox > TML.data.winH && TML.data.scrollTop > baseBox - TML.data.winH + startLine - (liquidBox - TML.data.winH)) {
      layoutPattern = 'A';
      if (preLayoutPattern == layoutPattern) return;
      $liquidSection.attr('data-pos', 'absolute-bottom');

      // 下のラインを揃えるための調整
      $liquidSection.find('.c-scrollBox').css('bottom', 0);

      // BASEが通り過ぎたら
    } else if (TML.data.scrollTop > baseBox - TML.data.winH + startLine) {
      layoutPattern = 'B';
      if (preLayoutPattern == layoutPattern) return;
      $liquidSection.attr('data-pos', 'absolute-bottom');

      // 下のラインを揃えるための調整
      $liquidSection.find('.c-scrollBox').css('bottom', TML.data.winH - liquidBox);

      // startLineを過ぎたら
    } else if (TML.data.scrollTop > startLine) {
      layoutPattern = 'C';
      if (preLayoutPattern == layoutPattern) return;
      $liquidSection.attr('data-pos', 'fixed');

      // 初期値
    } else {
      layoutPattern = 'D';
      if (preLayoutPattern == layoutPattern) return;
      $liquidSection.attr('data-pos', 'absolute-top');
    }

    preLayoutPattern = layoutPattern;
  }

  function fixedLayoutReset() {

    if (cDiff > 0) {
      // right値が低い
      liquidBox = rightH;
      baseBox = leftH;
      $liquidSection = $('.singleInfo');
      $baseSection = $('.singleImgAll');
    } else {
      // right値が高い
      liquidBox = leftH;
      baseBox = rightH;
      $liquidSection = $('.singleImgAll');
      $baseSection = $('.singleInfo');
    }

    $baseSection.attr('data-pos', '');
    preLayoutPattern = '';
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);