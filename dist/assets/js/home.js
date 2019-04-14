'use strict';

TML.pageScript = TML.pageScript || {
  init: {}
};

TML.pageScript = function () {

  // コンストラクタ  =================================================================
  function init() {
    infiniteScrollEvent();
  }

  // functions  =================================================================

  /*
  *  infiniteScrollEvent
  *
  */
  function infiniteScrollEvent() {
    var $infiniteBlock = $('.infiniteBlock');
    if (!$infiniteBlock[0]) return;
    $infiniteBlock.infiniteScroll({
      debug: false,
      path: '.c-archivePager_button',
      animate: true,
      status: '.infinite_status',
      append: '.c-itemlist_node',
      scrollThreshold: 0
    });

    $infiniteBlock.on('append.infiniteScroll', function (event, response, path, items) {
      $(items).addClass('hide');
      var $hideElement = $('.c-post_node.hide');
      TML.common.countImgLoaded($hideElement).done(function () {
        $hideElement.removeClass('hide');
      });
    });
  }

  return {
    init: init
  };
}();

TML.common.init(TML.pageScript.init);