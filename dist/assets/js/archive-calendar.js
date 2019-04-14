'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    resizeEvent();
    scrollEvent();
    pjaxloadEndCallback();

    initSortEvent();
    pushStateEvent();

    TML.data.$window.on(TML.data.eventHandler['resize'], resizeEvent);
    TML.data.$window.on(TML.data.eventHandler['scroll'], scrollEvent);
  }

  // functions  =================================================================

  /*
  *  pjaxloadEndCallback
  *
  */
  function pjaxloadEndCallback() {
    $('.pjaxContents').on(TML.data.eventHandler['transitionEnd'], function () {
      resizeEvent();
    });
  }

  /*
  *  resizeEvent
  *
  */
  var rootPath = '/calendar/';
  var sortLine = 0;
  var sortFlag = false;
  var preSortFlag = '';
  var $sortBox = $('.functionBox_control');
  function resizeEvent() {
    if ($sortBox[0]) {
      sortLine = $sortBox.offset().top;
    }
  }

  /*
  *  scrollEvent
  *
  */
  function scrollEvent() {
    if (TML.data.$MQ !== 'PC') return;
    if (TML.data.scrollTop > sortLine) {
      sortFlag = true;
      if (preSortFlag == sortFlag) return;
      $sortBox.addClass('fixed');
    } else {
      sortFlag = false;
      if (preSortFlag == sortFlag) return;
      $sortBox.removeClass('fixed');
    }
    preSortFlag = sortFlag;
  }

  /*
  *  infiniteScrollEvent
  *
  */
  function infiniteScrollEvent() {
    var $infiniteBlock = $('.infiniteBlock');
    if (!$('.c-archivePager_button')[0]) return;
    $infiniteBlock.infiniteScroll({
      history: false,
      debug: false,
      path: '.c-archivePager_button',
      animate: true,
      status: '.infinite_status',
      append: '.c-itemlist_node',
      scrollThreshold: 0
    });

    $infiniteBlock.on('append.infiniteScroll', function (event, response, path, items) {
      TML.common.tracking(path);
      $(items).addClass('hide');
      var $hideElement = $('.c-itemlist_node.hide');
      // TML.common.countImgLoaded($hideElement).done(function () {
      $hideElement.removeClass('hide');
      // });
    });
  }

  /*
  * 絞り込み イベント
  */

  function initSortEvent() {
    sortChange();
    $('.sortOpen, .sortClose').on('click', sortBoxToggle);
    $('.sortBox_node_junre, .functionBox_bg, .sortBox_close').on('click', sortToggle);
    $('.orderSelect_list_node').on('click', sortOrderChange);
    $('.sortBox_node_value_input, .sortBox_node_radio_list_input').on('change', sortChange);
    $('.sortBox_button_node.reset').on('click', sortReset);
    $('.sortBox_button_node.submit').on('click', sortSubmit);
    $(document).on('click', '.choiceTag_list_node', sortRemove);

    $('.searchBox_form_submit').on('click', seachformSubmit);
  }

  /*
  * 絞り込み ー チェックリスト展開処理
  */
  function sortBoxToggle() {
    if ($('body').is('.sortBoxOpen')) {
      $('body').removeClass('sortBoxOpen');
      TML.common.screenUnlock();
    } else {
      $('body').addClass('sortBoxOpen');
      TML.common.screenLock();
    }
  }

  /*
  * 絞り込み ー チェックリスト展開処理
  */
  function sortToggle(e) {
    var _this = $(e.currentTarget);

    if (TML.data.$MQ != 'SP' && _this.closest('.sortBox_node').is('.notOpen')) return;

    if ($('body').is('.level2open')) {
      $('.sortBox_node').removeClass('selected');
      $('body').removeClass('level2open');
    } else {
      $('.sortBox_node').removeClass('selected');
      _this.closest('.sortBox_node').addClass('selected');
      $('body').addClass('level2open');
    }
  }

  /*
  * 絞り込み ー 並び替え方法を変更
  */
  function sortOrderChange(e) {
    var _this = $(e.currentTarget);
    $('.orderSelect_list_node').removeClass('selected');
    _this.addClass('selected');

    sortSubmit();
    return false;
  }

  /*
  * 絞り込み ー 部分解除 or 全解除
  */
  function sortReset(e) {
    var _this = $(e.currentTarget);
    var _parent = _this.closest('.sortBox_node');
    if (_parent[0]) {
      var _target = _parent.find('.sortBox_node_value_input');
      _target.prop('checked', false);
    } else {
      $('.sortBox_node_value_input').prop('checked', false);
    }
    sortChange();
    return false;
  }

  /*
  * 絞り込み ー 送信
  */
  var getArray = void 0,
      getLabelArray = void 0;
  function sortChange() {
    getArray = {};
    getLabelArray = {};
    $('.sortBox input:checked').each(function (i) {
      var _this = $(this);
      var keyName = _this.attr('name');
      var valName = _this.val();
      var labelName = _this.next('label').text();

      /* 選択タグ表示用 */
      getLabelArray[keyName] = getLabelArray[keyName] || [];
      getLabelArray[keyName].push(labelName);

      /* URL生成用 */
      if (valName) {
        getArray[keyName] = getArray[keyName] || [];
        getArray[keyName].push(valName);
      }
    });

    sortCloseSelectbox();
    sortMakeTag();
    return false;
  }

  function sortCloseSelectbox() {
    if ($('body').is('.level2open')) {
      $('.sortBox_node').removeClass('selected');
      $('body').removeClass('level2open');
    }
  }

  function sortMakeTag() {
    var makeTag = '';

    $('.sortBox_node_selected').remove();
    if (Object.keys(getLabelArray).length !== 0) {
      $.each(getLabelArray, function (key, val) {
        var _val = val[0];

        var cutFigure = '18';
        var afterTxt = '…';
        var textLength = _val.length;
        _val = cutFigure > textLength ? _val : _val.substr(0, cutFigure) + afterTxt;

        $('.sortBox_node[data-key="' + key + '"]').find('.sortBox_node_junre').append('<span class="sortBox_node_selected">' + _val + '</span>');
      });
    }
  }

  /*
  * 絞り込み ー タグによる条件解除
  */
  function sortRemove(e) {
    var _this = $(e.currentTarget);
    var target = $('.sortBox_node_value_label').filter(function (i, node) {
      return $(node).text() == _this.text();
    });
    target.prev('input').prop('checked', false);
    sortChange();
    sortSubmit();
    return false;
  }

  /*
  *  sortSubmit
  *
  */
  function sortSubmit() {
    var get_sortby = $('.orderSelect_list_node.selected').find('a').data('sort');
    get_sortby = get_sortby ? get_sortby : 'future';
    var makeURL = 'sort_by=' + get_sortby;

    $.each(getArray, function (key, val) {
      var formatVal = void 0;
      val.forEach(function (item) {
        formatVal = formatVal ? formatVal + '%2c' + item : item;
      });
      makeURL = makeURL + '&' + key + '=' + formatVal;
    });

    pushStateTask(rootPath + '?' + makeURL, get_sortby);
    return false;
  }

  /*
  *  検索まわり
  *
  */
  function getSearchForm() {
    var getWord = $('.searchBox_form_input').val();
    return getWord;
  }
  function seachformSubmit() {
    var getWord = getSearchForm();
    pushStateTask(rootPath + '?s=' + getWord, null, 'search');
    return false;
  }

  /*
  *  pushState
  *
  */
  var preUrl;
  var pushWrap = '.pjaxBox';

  function pushStateTask(url, sortType, searchType) {
    var title = document.title,
        state = location.href;

    $('.orderSelect_list_node').removeClass('selected');
    $('.orderSelect_list_link[data-sort="' + sortType + '"]').closest('.orderSelect_list_node').addClass('selected');

    history.pushState(state, title, url);
    initPushState(url, searchType);
  }

  function pushStateEvent() {
    if (window.history && window.history.pushState) {
      /* ページリロード時 */
      var state = location.href;
      history.pushState(state, '');
      pjaxloadEnd();

      $(document).on('click', 'a[data-pushstate]', function (e) {
        pushStateTask($(this)[0].href, $(this).data('sort'), $(this).data('pushstate'));
        return false;
      });

      $(window).on('popstate', function (e) {
        if (!e.originalEvent.state) return;
        var state = e.originalEvent.state;
        var url = location.href;
        var dir = url.split("/");
        var dir = dir[dir.length - 2];

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
    }, function (e) {
      return domGetError(data);
    });
  }

  function pushStatePreparation(url, status) {
    var defer = new $.Deferred();

    // 検索画面を閉じる
    if ($('body').is('.sortBoxOpen')) {
      $('body').removeClass('sortBoxOpen');
      TML.common.screenUnlock();
    }

    $('.sortBox_node').removeClass('selected');
    $('body').addClass('loading');

    // reset
    if (status == 'reset') {
      $('.choiceTag').html('');
    }

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
      error: function error(url) {
        defer.reject(url);
        alert('domget error');
      }
    });
    return defer.promise();
  }

  function domGetError(url) {
    location.href = url;
  }

  function domAppend(data, status, url) {
    var _this = this;
    var defer = new $.Deferred();

    var $src = $('<div>' + data + '</div>');
    ChangeSource($src, status, url);

    defer.resolve();
    return defer.promise();
  }

  // function tracking(url) {
  //   var delPath = location.protocol + '//' + location.host;
  //   var selfUrl = url.replace(delPath, '');
  //   if(ga){
  //     ga('gtm1.send', 'pageview', selfUrl);
  //   }
  // }

  function ChangeSource(data, status, url) {
    var promise = ChangeMeta(data);
    promise.then(function (data) {
      return ChangeContent(data, status);
    }).then(function (data) {
      return pjaxloadEnd(url);
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

    // 検索対応
    if (status == 'search') {
      var searchHTML = $('.search_title', data);
      $('.choiceTag').html(searchHTML);
      $('.searchBox_form_input').val('');
    } else {
      $('.choiceTag').html('');
    }

    defer.resolve(data);
    return defer.promise();
  }

  function pjaxloadEnd() {
    infiniteScrollEvent();
    $('body').removeClass('loading');
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);