'use strict';

var TML = TML || {
  data: {
    load: false,
    url: '',
    $document: $(document),
    $body: $('body'),
    $window: $(window),
    $MQ: 'PC',
    scrollTop: 0,
    lockTop: 0,
    winW: '',
    winH: '',
    jqXHR: '',
    eventHandler: {
      'load': 'load.page',
      'scroll': 'scroll.page',
      'resize': 'resize.page',
      'hashchange': 'hashchange.page',
      'breakpointChange': 'onBreakpointChange.page',
      'transitionEnd': 'oTransitionEnd.page mozTransitionEnd.page webkitTransitionEnd.page transitionend.page'
    }
  },
  common: {
    init: {}
  }
};

TML.common = function (pageScript) {
  var oldMQ;

  // コンストラクタ  =================================================================
  function init(pageScript) {

    if (!TML.data.load) {
      setBrowser();
      setUtilityData();
      initAnchorLink();
      initHeaderOpen();
      initHeaderColor();
      initFooterOpen();

      initLayoutChange();
      initFavorite();

      pushStateEvent();
      TML.data.load = true;
    }

    pageScript && pageScript();
  }

  // public functions  ==========================================================

  /*
  *  UtilityDataの取得
  *   特定ページのみで使用するデータはページJSで取得すること。
  *
  */
  function setUtilityData() {
    TML.data.url = window.location.pathname;

    getScrollTop();
    TML.data.$window.on('scroll', getScrollTop);

    getWindowSize();
    TML.data.$window.on('resize', function () {
      getWindowSize();
    });
  }
  function getScrollTop() {
    TML.data.scrollTop = TML.data.$window.scrollTop();
    // pagetopButton();
  }
  function getWindowSize() {
    TML.data.winW = TML.data.$window.width();
    TML.data.winH = TML.data.$window.height();

    var mWidth = $('body').css('min-width');
    switch (mWidth) {
      case '2px':
        TML.data.$MQ = 'SP';
        break;
      case '768px':
        TML.data.$MQ = 'TABLET';
        break;
      default:
        TML.data.$MQ = 'PC';
    }

    if (TML.data.oldMQ && TML.data.oldMQ !== TML.data.$MQ) {
      TML.data.$window.trigger('onBreakpointChange');
    }

    TML.data.oldMQ = TML.data.$MQ;
  }

  /*
  *  画像読み込み数カウンタ
  *    @target - jQueryオブジェクトで指定。指定された要素ないのimgのロードを監視する。
  *    promiseを返すので、戻り値に対して.doneでコールバックを実装する。
  */
  function countImgLoaded(target, being) {
    var defer = new $.Deferred();

    var $img = target ? target.find('img') : $('img');
    var total = $img.length;
    var count = 0;
    if ($img.length > 0) {
      $img.each(function () {
        var myImg = new Image();
        myImg.src = $(this).attr('src');
        myImg.onload = function () {
          count++;
          var progress = count / total;
          // being( progress );
          if (count >= total) {
            defer.resolve();
          }
        };
        myImg.onerror = function () {
          defer.resolve();
        };
      });
    } else {
      defer.resolve();
    }

    return defer.promise();
  }

  /*
  * スクロールロック
  *
  */
  function screenLock() {
    $('html, body').addClass('scrollLock');
  };
  function screenUnlock() {
    $('html, body').removeClass('scrollLock');
  };

  // functions  =================================================================
  /*
  *  ブラウザ判定
  *
  */
  function setBrowser() {
    TML.data.ua = {
      Safari: typeof window.chrome == 'undefined' && 'WebkitAppearance' in document.documentElement.style,
      Firefox: 'MozAppearance' in document.documentElement.style,
      IE: window.navigator.userAgent.toLowerCase().indexOf('msie') !== -1 || window.navigator.userAgent.toLowerCase().indexOf('trident') !== -1,
      IE9: window.navigator.appVersion.toLowerCase().indexOf('msie 9.') !== -1,
      ltIE9: typeof window.addEventListener === 'undefined' && typeof document.getElementsByClassName === 'undefined',
      Touch: typeof document.ontouchstart !== 'undefined',
      Pointer: window.navigator.pointerEnabled,
      MSPoniter: window.navigator.msPointerEnabled,
      Windows: window.navigator.userAgent.toLowerCase().indexOf('win') !== -1,
      Mac: window.navigator.userAgent.toLowerCase().indexOf('mac') !== -1,
      Mobile: window.navigator.userAgent.toLowerCase().indexOf('iphone') > 0 || window.navigator.userAgent.toLowerCase().indexOf('ipod') > 0 || window.navigator.userAgent.toLowerCase().indexOf('android') > 0 && window.navigator.userAgent.toLowerCase().indexOf('mobile') > 0,
      Tablet: window.navigator.userAgent.toLowerCase().indexOf('ipad') > 0 || window.navigator.userAgent.toLowerCase().indexOf('android') > 0 && window.navigator.userAgent.toLowerCase().indexOf('mobile') == -1
    };
    if (TML.data.ua.Safari) {
      $('html').addClass('safari');
    }
    if (TML.data.ua.Firefox) {
      $('html').addClass('firefox');
    }
    if (TML.data.ua.IE) {
      $('html').addClass('ie');
    }
    if (TML.data.ua.IE9) {
      $('html').addClass('ie9');
    }
    if (TML.data.ua.ltIE9) {
      $('html').addClass('ie8');
    }

    /* Defining touch events */
    if (TML.data.ua.Tablet) {
      $('html').addClass('tablet');
      touchDeviceDirectionJudge();
      $(window).on('orientationchange', function () {
        touchDeviceDirectionJudge();
      });
    }
  }

  function touchDeviceDirectionJudge() {
    if (Math.abs(window.orientation) !== 90) {
      $('html').removeClass('landscape').addClass('portrait');
    } else {
      $('html').removeClass('portrait').addClass('landscape');
    }
  }

  /*
  *  アンカーリンク
  *
  */
  function initAnchorLink() {
    $(document).on('click', '.anchorLink', function () {
      var href = $(this).attr('href');
      var target = $(href == "#" || href == "" ? 'html' : href);

      var offset = TML.data.$MQ == 'SP' ? 50 : 60;
      if (target == $('html')) {
        var position = 0;
      } else {
        var position = target.offset().top - offset;
      }

      $('body, html').velocity("scroll", { offset: position, duration: 500, easing: "ease-in-out" });
      return false;
    });
  }

  /*
  *  ヘッダー展開
  *
  */
  var headerOpenFlag = false;
  function initHeaderOpen() {
    $('.header_main_menu').on('click', function () {
      if ($('body').is('.headerOpen')) {
        headerOpenFlag = false;
        $('body').removeClass('headerOpen');
        screenUnlock();
        headerColorChange();
      } else {
        headerOpenFlag = true;
        $('body').removeClass('searchOpen headerTransparent');
        $('body').addClass('headerOpen');
        screenLock();
      }
    });
  }

  function initHeaderColor() {
    headerColorChange();
    TML.data.$window.on('scroll', headerColorChange);
  }

  function headerColorChange() {
    if ($('body').attr('data-page') == 'home') {
      if (headerOpenFlag) return;
      if (TML.data.scrollTop > TML.data.winH) {
        $('body').removeClass('headerTransparent');
      } else {
        $('body').addClass('headerTransparent');
      }
    } else {
      $('body').removeClass('headerTransparent');
    }
  }

  /*
  *  フッター展開
  *
  */
  function initFooterOpen() {
    $('.footer_nav_title').on('click', function () {
      if ($(this).closest('.footer_nav_box').is('.open')) {
        $(this).closest('.footer_nav_box').removeClass('open');
        $(this).next('.footer_nav_content').stop(true, true).slideUp(300);
      } else {
        $(this).closest('.footer_nav_box').addClass('open');
        $(this).next('.footer_nav_content').stop(true, true).slideDown(300);
      }
    });
  }

  /*
  *  pagetopButton
  *
  */
  var saveScroll;
  function pagetopButton() {
    if (TML.data.scrollTop < 100) {
      $('.footerPagetop').addClass('hide');
    } else if (TML.data.scrollTop > saveScroll) {
      $('.footerPagetop').addClass('hide');
    } else {
      $('.footerPagetop').removeClass('hide');
    }
    saveScroll = TML.data.scrollTop;
  }

  /*
  * カテゴリートグル初期化
  */
  function initCategoryToggle() {
    $('.c-categoryToggle_select').on('change', changeToggle);
  }
  function changeToggle() {
    var $targetToggle = $(this).closest('.c-categoryToggle');
    var $current = $targetToggle.find('.c-categoryToggle_current');
    var selectedText = $(this).find('option:selected').text();
    var selectedLink = $(this).val();

    $current.text(selectedText);
    location.href = selectedLink;
  }

  /*
  * レイアウト変更
  */
  function initLayoutChange() {
    layoutSessionSave();
    $(document).on('click', '.layout_choice_node', layoutChange);
  }

  function layoutChange(e) {
    var _this = $(e.currentTarget);
    var layoutPattern = _this.attr('data-layout');
    layoutSessionSave(layoutPattern);
  }

  function layoutSessionSave(pattern) {
    if (window.sessionStorage) {
      var get_ssession = window.sessionStorage.getItem('layout_patten');
      if (pattern) {
        try {
          window.sessionStorage.setItem('layout_patten', pattern);
          $('body').attr('data-layout', pattern);
        } catch (err) {}
      } else if (get_ssession != null) {
        try {
          window.sessionStorage.setItem('layout_patten', get_ssession);
          $('body').attr('data-layout', get_ssession);
        } catch (err) {}
      } else {
        try {
          window.sessionStorage.setItem('layout_patten', 'm');
          $('body').attr('data-layout', 'm');
        } catch (err) {}
      }
    }
  }

  /*
  * お気に入り登録
  */

  var cookie_path = '/';

  var get_time = new Date();
  get_time = get_time.getTime();
  get_time = Math.floor(get_time / 1000);
  var cookie_expire = get_time + 10 * 365 * 24 * 60 * 60; // 10年

  function initFavorite() {
    $(document).on('click', '.c-favorite_icon, .c-favorite_button', favoriteAction);
  }

  function favoriteAction(e) {
    var _this = $(e.currentTarget);
    var action = _this.attr('data-action');
    var post_id = _this.data('id');
    var getCookie = $.cookie('tmlfav');

    if (action == 'add') {
      /*--- お気に入りに追加 ---*/
      if (getCookie) {
        var set_cookie = post_id + '%2c' + getCookie;
        set_cookie = set_cookie.split('%2c');
        favoriteArraySet(set_cookie);
      } else {
        $.cookie('tmlfav', post_id, { expires: cookie_expire, path: cookie_path });
      }
      _this.addClass('added');
      _this.attr('data-action', 'remove');
    } else if (action == 'remove') {
      /*--- お気に入りから削除 ---*/
      if (getCookie) {
        set_cookie = getCookie.split('%2c');

        set_cookie.forEach(function (value, i) {
          if (value == post_id) {
            set_cookie.splice(i, 1);
          }
        });
        favoriteArraySet(set_cookie);
        _this.removeClass('added');
        _this.attr('data-action', 'add');
      }
    }

    return false;
  }

  function favoriteArraySet(format_array) {
    var clear_data = format_array.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });

    var make_cookie_value = '';
    clear_data.forEach(function (item, i) {
      make_cookie_value = make_cookie_value ? make_cookie_value + '%2c' + item : item;
    });

    $.cookie('tmlfav', make_cookie_value, { expires: cookie_expire, path: cookie_path });
  }

  /*
  *  pushState
  *
  */
  var getSlug;
  var preUrl;
  var pushWrap = '.pjaxContents';

  function pushStateEvent() {
    if (window.history && window.history.pushState) {
      /* ページリロード時 */
      var state = location.href;
      history.pushState(state, '');
      pjaxloadEnd();

      $(document).on('click', 'a[data-commonpush]', function (e) {
        var url = $(this)[0].href,
            title = document.title,
            state = location.href;
        getSlug = $(this).attr('data-commonpush') ? $(this).attr('data-commonpush') : getSlug;

        history.pushState(state, title, url);
        initPushState(url);
        return false;
      });

      $(window).on('popstate', function (e) {
        if (!e.originalEvent.state) return;
        var state = e.originalEvent.state;
        var url = location.href;
        var dir = url.split("/");
        var dir = dir[dir.length - 2];
        getSlug = dir;
        if (getSlug == location.host) {
          getSlug = 'home';
        }
        console.log(getSlug);

        initPushState(url);
      });
    } else {
      initPushState(location.href);
    }
  }

  function initPushState(url, status) {
    var promise = pushStatePreparation(url, status);
    promise.then(function () {
      return domGet(url);
    }).then(function (data) {
      return domAppend(data, status, url);
    }).catch(function (url) {
      domGetError(url);
    });
  }

  function pushStatePreparation(url, status) {
    var defer = new $.Deferred();

    // 検索画面を閉じる
    if ($('body').is('.headerOpen')) {
      $('body').removeClass('headerOpen');
      TML.common.screenUnlock();
    }

    $('body').addClass('pjaxLoading');
    $('body').attr({
      'data-page': getSlug,
      'data-color': ''
    });

    defer.resolve(url);
    return defer.promise();
  }

  function domGet(url) {
    var defer = new $.Deferred();
    var _this = this;
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'html',
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('X-PJAX', 'true');
      },
      success: function success(data) {
        defer.resolve(data, url);
      },
      error: function error() {
        defer.reject(url);
      }
    });
    return defer.promise();
  }

  function domGetError(url) {
    location.href = url;
    console.log('domget error:' + url);
  }

  function domAppend(data, status, url) {
    var _this = this;
    var defer = new $.Deferred();

    var $src = $('<div>' + data + '</div>');
    ChangeSource($src, status, url);
    tracking(url);

    defer.resolve();
    return defer.promise();
  }

  function tracking(url) {
    var delPath = location.protocol + '//' + location.host;
    var selfUrl = url.replace(delPath, '');
    if (_gaq) {
      _gaq.push(['_trackPageview', selfUrl]);
    }
  }

  function ChangeSource(data, status, url) {
    var promise = ChangeMeta(data);
    promise.then(function (data) {
      return ChangeContent(data);
    }).then(function (data) {
      return ChangeStylesheet(data);
    }).then(function (data) {
      return ChangeJs(data, status, url);
    }).then(function (data) {
      return pjaxloadEnd(data);
    });
  }

  function ChangeMeta(data) {
    var defer = new $.Deferred();

    var metaTitle = $('title', data);
    metaTitle = $(metaTitle[0]).text();
    $('head title').html(metaTitle);
    defer.resolve(data);

    return defer.promise();
  }

  function ChangeContent(data, status) {
    var defer = new $.Deferred();
    var $newContent = $(pushWrap, data);
    $newContent = $newContent.html();
    $(pushWrap).html($newContent);

    defer.resolve(data);
    return defer.promise();
  }

  function ChangeStylesheet(data) {
    var defer = new $.Deferred();
    var newsrc = $('link[data-type="org"]', data);

    var elm = document.createElement('link');
    elm.setAttribute('rel', 'stylesheet');
    elm.setAttribute('type', 'text/css');
    elm.setAttribute('media', 'all');
    elm.setAttribute('href', newsrc.attr('href'));
    elm.setAttribute('data-type', 'org');

    $('link[data-type="org"]').remove();
    document.getElementsByTagName('head')[0].appendChild(elm);

    // Safari5, IE10まではlinkタグのonloadが取れないので
    // ダミー要素のエラー待ちで取得を行う。
    var dummy = document.createElement('img');
    dummy.src = newsrc.attr('href');
    dummy.onerror = function (e) {
      defer.resolve(data);
    };

    return defer.promise();
  }

  function ChangeJs(data, status, url) {
    var defer = new $.Deferred();

    ResetJs(status, url);
    $('script[data-type="org"]').remove();

    var newsrc = $('script[data-type="org"]', data);
    if (newsrc['length'] > 0) {
      var elm = document.createElement('script');
      elm.setAttribute('src', newsrc.attr('src'));
      elm.setAttribute('data-type', 'org');
      document.getElementsByTagName('body')[0].appendChild(elm);
      defer.resolve(data);
    } else {
      defer.resolve(data);
    }

    return defer.promise();
  }

  function ResetJs(status, url) {
    adjustPosition(status, url);

    var eventAll = void 0;
    for (var i in TML.data.eventHandler) {
      eventAll = eventAll ? eventAll + ' ' + TML.data.eventHandler[i] : TML.data.eventHandler[i];
    }

    TML.data.$window.off(eventAll);
    TML.data.$document.off('wheel.page mousewheel.page DOMMouseScroll.page');

    // 定義されているInfiniteScrollをDestroy
    var infScroll_1 = InfiniteScroll.data('.infiniteBlock');
    var infScroll_2 = InfiniteScroll.data('.infiniteList');
    if (infScroll_1 !== undefined) {
      $('.infiniteBlock').infiniteScroll('destroy');
    }
    if (infScroll_2 !== undefined) {
      $('.infiniteList').infiniteScroll('destroy');
    }
  }

  function adjustPosition(status, url) {
    if (url.indexOf('#') != -1) {
      // hashがある場合
      var hash = url.split('#')[1];
      anchorLink($('#' + hash));
    } else if (status !== 'road') {
      // ロード時以外
      $('html, body').scrollTop(0);
    }
  }

  function pjaxloadEnd(data) {
    c_infiniteScrollEvent();
    initHeaderColor();

    if (data) {
      TML.common.countImgLoaded(data).done(function () {
        $('body').delay(300).queue(function () {
          $(this).removeClass('pjaxLoading').dequeue();
        });
      });
    } else {
      $('body').removeClass('pjaxLoading');
    }
  }

  /*
  *  c_infiniteScrollEvent
  *
  */
  function c_infiniteScrollEvent() {
    var $infiniteBlock = $('.infiniteList');
    if (!$('.c-archivePager_button')[0]) return;
    $infiniteBlock.infiniteScroll({
      history: false,
      debug: false,
      path: '.c-archivePager_button',
      checkLastPage: true,
      animate: true,
      status: '.infinite_status',
      append: '.infiniteBlock_node',
      button: '.infiniteBlock_button',
      loadOnScroll: false,
      scrollThreshold: false
    });

    $infiniteBlock.on('append.infiniteScroll', function (event, response, path, items) {
      tracking(path);
      $(items).addClass('hide');
      var $hideElement = $('.infiniteBlock_node.hide');
      TML.common.countImgLoaded($hideElement).done(function () {
        $hideElement.removeClass('hide');
      });
    });
  }

  return {
    setUtilityData: setUtilityData,
    countImgLoaded: countImgLoaded,
    screenLock: screenLock,
    screenUnlock: screenUnlock,
    initPushState: initPushState,
    tracking: tracking,
    init: init
  };
}();