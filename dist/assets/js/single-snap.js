'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // 変数定義  =================================================================
  var slideWrap = '.oneScrollBox_wrap',
      $slideMoveSection = $('.oneScrollBox'),
      $slideNode = $('.oneScrollBox_node'),
      slideItemLength = $slideNode.length,
      slideItemHeight = 0,
      $normalSlide = $('.normalSection'),
      $normalSlideScroll = $('.customScrollBox'),
      normalIndex = slideItemLength + 1,
      slideSpeed = 500,
      slideEasing = 'ease',
      scrollAmount = 0,
      setHash = '#section',
      moveFlag = true,
      orginalScroll,
      acPageNum = 1,
      $snapSlider,
      sliderFlag = false;

  // コンストラクタ  =================================================================
  function init() {
    resizeEvent();
    scrollEvent();
    fullPageInit();
    $('.oneScrollBox')[0] && initSlider();

    TML.common.countImgLoaded().done(function () {
      imgLoadCallback();
    }).fail(function () {
      imgLoadCallback();
    });

    TML.data.$window.on(TML.data.eventHandler['resize'], function () {
      resizeEvent();
    });
    TML.data.$window.on(TML.data.eventHandler['scroll'], function () {
      scrollEvent();
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
    slideResize();
  }

  /*
  *  scrollEvent
  *
  */
  function scrollEvent() {
    fullpageBack();
  }

  /*
  *  MouseWheelEvent
  *
  */
  var callback = function callback() {};
  var isFired = false;
  var sleep = 210;
  var delta, timeStamp, uintDelta, timer;

  // キャッシュ
  callback.delta = 0;
  callback.timeStamp = 0;

  var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  TML.data.$document.on(mousewheelevent + '.page', $('.snap_content'), function (e) {
    if (TML.data.$MQ !== 'PC') return;
    if (orginalScroll) {
      e.preventDefault();
      delta = e.originalEvent.deltaY ? -e.originalEvent.deltaY : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;

      if (!delta) return;
      uintDelta = Math.abs(delta);

      // 慣性スクロール対応
      if (uintDelta - callback.delta > 1) {
        timeStamp = e.timeStamp;
        if (!isFired && timeStamp - callback.timeStamp > sleep) {
          isFired = true;
          oneScrollCallback();
        }
        callback.timeStamp = timeStamp;
      } else {
        isFired = false;
      }

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        callback.delta = 0;
        isFired = false;
      }, 100);

      callback.delta = uintDelta;
    }
  });

  /*
  *  KeyEvent
  *
  */
  $('html').on('keydown', function (e) {
    if ($slideMoveSection.is(':animated')) {
      e.preventDefault();
    } else {
      switch (e.which) {
        case 38:
          // Key[↑]
          e.preventDefault();
          motionUp();
          break;

        case 40:
          // Key[↓]
          e.preventDefault();
          motionDown();
          break;
      }
    }
  });

  // ★ FlickEvent
  var saveY = 0;
  $slideMoveSection.on({ 'touchstart mousedown': function touchstartMousedown(e) {
      if (this.touched) return;
      if (acPageNum == normalIndex) return;
      if ($slideMoveSection.is(':animated')) {
        e.preventDefault();
      } else {
        this.pageY = TML.data.ua.Touch ? event.changedTouches[0].pageY : e.pageY;
        saveY = TML.data.ua.Touch ? event.changedTouches[0].pageY : e.pageY;
        this.touched = true;
      }
    },
    'touchmove mousemove': function touchmoveMousemove(e) {
      if (!this.touched) return;
      e.preventDefault();
      this.pageY = TML.data.ua.Touch ? event.changedTouches[0].pageY : e.pageY;
    },
    'touchend mouseup': function touchendMouseup(e) {
      var _this = this;
      if (!this.touched) {
        return;
      }

      if (saveY - _this.pageY < -30) {
        motionUp();
      } else if (saveY - _this.pageY > 30) {
        motionDown();
      }
      this.touched = false;
    }
  });

  // ★ click event
  $('.scrollMotion').on('click', function () {
    var targetNum = $(this).attr('href');
    targetNum = targetNum.replace(setHash, '');
    if (TML.data.$MQ == 'PC') {
      if (targetNum > 0) {
        motionDefine(false, targetNum);
      }
    } else {
      $snapSlider.slick('slickGoTo', targetNum - 1);
    }
    return false;
  });

  // functions  =================================================================


  // スライダー初期化
  function initSlider() {
    sliderAction();
    TML.data.$window.on('onBreakpointChange', sliderAction);
  }

  function sliderAction() {
    var sliderOption = {
      arrows: true
    };

    if (TML.data.$MQ == 'PC') {
      if (sliderFlag) {
        $snapSlider.slick('unslick');
        sliderFlag = false;
      }
    } else {
      if (!sliderFlag) {
        $('.oneScrollBox').css({ 'top': '' });
        $(slideWrap).css({ 'height': '' });
        $slideNode.css({ 'height': '', 'width': '' });
        $snapSlider = $('.oneScrollBox').slick(sliderOption);
        $('.oneScroll_info_node').eq(0).addClass('select');
      }
      sliderFlag = true;
    }

    if ($snapSlider) {
      $snapSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        $('.oneScroll_info_node').removeClass('select');
        $('.oneScroll_info_node').eq(nextSlide).addClass('select');
      });
    }
  }

  // fullpage 初期化
  function fullPageInit() {
    $('body, html').scrollTop(0);
    orginalScroll = true;
    acPageNum = 1;
  }

  var normalScroll = 0;
  var saveScroll = 0;
  function fullpageBack() {
    if (orginalScroll || acPageNum != normalIndex) return;
    if (TML.data.scrollTop < saveScroll) {
      if (TML.data.scrollTop < slideItemHeight + 5) {
        motionDefine(false, slideItemLength);
      }
    }
    saveScroll = TML.data.scrollTop;
  }

  // resize adjust for section
  function slideResize() {
    if (TML.data.$MQ == 'PC') {
      slideItemHeight = TML.data.winH - 60;
      $(slideWrap).css({ 'height': slideItemHeight });
      $slideNode.css({ 'height': slideItemHeight, 'width': TML.data.winW / 2 });
      motionDefine(false, acPageNum);
    } else {
      $('.oneScrollBox').css({ 'top': '' });
      $(slideWrap).css({ 'height': '' });
      $slideNode.css({ 'height': '', 'width': '' });
    }
  }

  function oneScrollCallback() {
    if (!moveFlag) return;
    if (delta <= -1) {
      motionDown();
    } else if (delta >= 1) {
      motionUp();
    }
  }

  // ScrollUpEvent
  function motionUp() {
    if (acPageNum > 1) {
      motionDefine('up');
    }
  }

  // ScrollDownEvent
  function motionDown() {
    if (acPageNum < slideItemLength) {
      motionDefine('down');
    } else if (acPageNum >= slideItemLength) {
      defaultScroll();
    }
  }

  function motionDefine(direction, targetNum) {
    if (TML.data.$MQ !== 'PC') return;

    orginalScroll = true;
    moveFlag = false;
    if (!acPageNum) {
      acPageNum = 0;
    }

    if (targetNum) {
      acPageNum = targetNum;
    }
    fullPageIndexChange(direction);

    $slideMoveSection.stop(true, false).velocity({
      top: scrollAmount
    }, {
      duration: slideSpeed,
      easing: slideEasing,
      complete: function complete() {
        moveFlag = true;
      }
    });
    if (TML.data.scrollTop > 0) {
      $('body, html').velocity("scroll", { offset: 0, duration: 500, easing: "ease-in-out" });
    }

    fullPageAfterSlide();
  }

  function fullPageIndexChange(direction) {
    acPageNum = direction == 'down' ? parseInt(acPageNum) + 1 : direction == 'up' ? parseInt(acPageNum) - 1 : acPageNum;
    $('body').attr('data-section', acPageNum);
    scrollAmount = -slideItemHeight * (acPageNum - 1);
    fullPageNav();
  }

  function defaultScroll() {
    orginalScroll = false;
    $('body, html').velocity('scroll', {
      offset: slideItemHeight,
      duration: 500,
      easing: "ease-in-out",
      complete: function complete() {
        fullPageIndexChange('down');
      }
    });
  }

  /*
  *  fullPageAfterSlide
  *
  */
  function fullPageAfterSlide() {
    if (acPageNum == normalIndex) {
      // ScrollTop:0だと前に戻れないため
      $normalSlideScroll.scrollTop(1);
      $('body').addClass('underNormalScroll');
    } else {
      $('body').removeClass('underNormalScroll');
    }
  }

  /*
  *  fullpageNav
  *
  */
  function fullPageNav() {
    var current = acPageNum - 1;
    if (current < 10) {
      current = '0' + current;
    }
    $('.oneScroll_info_current').html(current);

    // カレントスライドにアクティブなクラスを
    $slideNode.removeClass('active');
    $slideNode.eq(current).addClass('active');
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);