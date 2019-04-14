'use strict';

jQuery(function () {
  if (jQuery('body').is('.post-type-calendar')) {

    var selectSrc = '\n                  <div class="item_shop_buttonList">\n                    <button class="item_shop_allSelect button-secondary">\u5168\u9078\u629E</button>\n                    <button class="item_shop_allRemove button-secondary">\u5168\u89E3\u9664</button>\n                  </div>';

    $('.acf-field-relationship[data-name="item_shop"]').prepend(selectSrc);

    $(document).on('click', '.item_shop_allSelect', function (e) {
      $('.acf-field-relationship[data-name="item_shop"] .acf-rel-item').click();
      return false;
    });

    $(document).on('click', '.item_shop_allRemove', function (e) {
      $('.acf-field-relationship[data-name="item_shop"] a[data-name="remove_item"]').click();
      return false;
    });
  }

  if (jQuery('body').is('.post-type-features') || jQuery('body').is('.post-type-news')) {
    var shortcodeChange = function shortcodeChange() {
      var $field = $('#acf-group_5b571dc925fb6 .acf-field[data-name="photo_slider_sub"]');
      $field.each(function (i) {
        $(this).find('.acf-field-shortcode_input').val('[slider id=' + (i + 1) + ']');
      });
    };

    acf.add_action('ready', function ($el) {
      var $field = $el.find('#acf-group_5b571dc925fb6 .acf-field[data-name="photo_slider_sub"]');
      $field.each(function (i) {
        $(this).prepend('<div class="acf-field-shortcode">ショートコード： <input class="acf-field-shortcode_input" type="text" value="[slider id=' + (i + 1) + ']"></div>');
      });
    });

    acf.add_action('append', function ($el) {
      shortcodeChange();
    });

    acf.add_action('remove', function ($el) {
      setTimeout(function () {
        shortcodeChange();
      }, 1000);
    });

    acf.add_action('sortstop', function ($el) {
      shortcodeChange();
    });
  }
});