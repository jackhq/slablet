//
// Automatically calls all functions in APP.init
//
jQuery(document).ready(function() {
	APP.go();
});

//
// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern/
//
var APP = (function($, window, undefined) {
	// Expose contents of APP.
	return {
		go: function() {
			for (var i in APP.init) {
				APP.init[i]();
			}
		},
		init: {
			full_input_size: function() {
				if (!$('textarea, .input_full').length) {
					return;
				}

				// This fixes width: 100% on <textarea> and class="input_full".
				// It ensures that form elements don't go wider than container.
				$('textarea, .input_full').wrap('<span class="input_full_wrap"></span>');
			},
			search: function() {
				if (!$('#q').length) {
					return;
				}

				var input = $('#q');
				var placeholder_supported = 'placeholder' in document.createElement('input');
				var text = input.attr('placeholder');

				// Check if HTML5 placeholder="..." supported.
				if (!placeholder_supported) {
					input.val(text);

					input.focus(function() {
						if (input.val() === text) {
							input.val('');
						}
					}).blur(function() {
						if (!input.val()) {
							input.val(text);
						}
					});
				}
			},
			rotation: function() {
				function adjust_angle() {
					var angle = window.orientation;
					var body = $('body');
					var body_width = body.outerWidth();
					var sidebar = $('#sidebar');

					if (angle === 0 || angle === 180 || body_width < 1024) {
						body.addClass('is_portrait');
						$('#button_navigation').removeClass('button_active');
						sidebar.hide();
					}
					else {
						body.removeClass('is_portrait');
						sidebar.show();
					}
				}

				adjust_angle();

				$(window).bind('resize orientationchange', function() {
					adjust_angle();
				});
			},
			navigation: function() {
				if (!$('#button_navigation').length) {
					return;
				}

				$('#button_navigation').click(function() {
					var sidebar = $('#sidebar');

					if (sidebar.is(':hidden')) {
						$(this).addClass('button_active');
						sidebar.show();
					}
					else {
						$(this).removeClass('button_active');
						sidebar.hide();
					}

					this.blur();
					return false;
				});
			},
			expand_menu: function() {
				if (!$('#sidebar_menu').length) {
					return;
				}

				$('#sidebar_menu li').each(function() {
					if ($(this).find('ul:first').length) {
						$(this).find('a:first').prepend('<span class="abs toggle_arrow"></span>');
					}
				});

				$('#sidebar_menu a').click(function() {
					var el = $(this);
					var li = $(this).parent('li');
					var ul = li.find('ul:first');

					if (ul.length) {
						if (ul.is(':hidden')) {
							li.addClass('expanded');

							li.siblings('li').each(function() {
								if ($(this).attr('id') !== 'sidebar_menu_home') {
									$(this).slideUp('fast');
								}
							});

							ul.slideDown('fast');
						}
						else {
							ul.slideUp('fast');
							li.removeClass('expanded').siblings('li').slideDown('fast');
							li.find('.expanded').removeClass('expanded').find('ul').slideUp().end().siblings('li').slideDown();
						}

						this.blur();
						return false;
					}
				});
			},
			scroll: function() {
				if (!$('#main_content_inner, #sidebar_content_inner').length) {
					return;
				}

				$(document).bind('touchmove', function() {
					return false;
				});

				if (typeof iScroll !== 'undefined') {
					var main_content_inner = new iScroll('main_content_inner');
				}
			},
			size_content_areas: function() {
				if (!$('#main_content, #sidebar_content').length) {
					return;
				}

				$('#main_content, #sidebar_content').each(function() {
					var el = $(this);

					// Pin the top.
					if (el.siblings('.header_upper').length) {
						if (el.siblings('.header_lower').length) {
							el.css({
								top: '92px'
							});
						}
						else {
							el.css({
								top: '46px'
							});
						}
					}
					else {
						el.css({
							top: '0'
						});
					}

					// Pin the bottom.
					if (el.siblings('.footer_lower').length) {
						if (el.siblings('.footer_upper').length) {
							el.css({
								bottom: '92px'
							});
						}
						else {
							el.css({
								bottom: '46px'
							});
						}
					}
					else {
						el.css({
							bottom: '0'
						});
					}
				});
			}
		}
	};
// Pass in jQuery ref.
})(jQuery, this);