'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    $('.c-categorySelect')[0] && initSelectCategory();
    $('.snapTagList')[0] && initShowTag();
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
  *  カテゴリーセレクト
  *
  */
  function initSelectCategory() {
    $('.c-categorySelect').on('change', selectCategory);
  }

  function selectCategory(e) {
    var _this = $(e.currentTarget);
    var url = _this.val(),
        title = document.title,
        state = location.href;

    history.pushState(state, title, url);
    TML.common.initPushState(url);
  }

  /*
  *  タグ一覧を展開
  *
  */
  function initShowTag() {
    $('.snapTagList_more').on('click', showTag);
  }

  function showTag(e) {
    $('.snapTagList').addClass('show');
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