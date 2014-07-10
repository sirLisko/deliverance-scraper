'use strict';

var $ = require('cheerio');
var _ = require('lodash');

var ignorer;

function exclude(toIgnore){
	ignorer = toIgnore;
}

function specificMenu(html){
	var parsedHTML = $.load(html);
	var menu = [];

	parsedHTML('.dish').each(function(i, el) {
		var dish = {}, $el = $(el);

		var dishCode = $el.find('[data-code]').data('code');
		if (ignorer && ignorer.dishes && ignorer.dishes.indexOf(dishCode) !== -1) { return; }

		var name = $el.find('.name a');
		name.children().remove('span');
		name = name.text().trim().toLowerCase();

		dish.menu = parsedHTML('#menu-header-type').attr('alt').toLowerCase();

		if($el.find('[alt="Vegetarian"]').length) { dish.vegetarian = true; }
		if($el.find('[alt="A bit hot"]').length) { dish.hot = true; }
		if($el.find('[alt="Under 300 cals*"]').length) { dish.light = true; }
		if($el.find('[alt="New"]').length) { dish.new = true; }

		var extra = $el.find('.optional-extra');
		if(extra.length){
			dish.extra = [];
			extra.each(function(i, ex){
				dish.extra.push({
					'name': $(ex).find('label').text().toLowerCase(),
					'price': parseFloat($(ex).find('.price').text().substring(1))
				});
			});
		}

		var variants = $el.find('.variant');
		if(variants.length) {
			variants.each(function(i, ex){
				var variant = _.clone(dish, true);
				variant.name = name + ' - ' + $(ex).find('label').text().toLowerCase();
				variant.price = parseFloat($(ex).find('.price').text().substring(1));
				menu.push(variant);
			});
		} else {
			dish.name = name;
			dish.price = parseFloat($el.find('[itemprop=price]').text().trim().substring(1));
			menu.push(dish);
		}

	});

	return menu;
}

function menuList(html){
	var parsedHTML = $.load(html);
	var menus = [];

	parsedHTML('[role=main] a').each(function(i, link) {
		var menuName = $(link).attr('href').split('/Menu/')[1].toLowerCase();
		if (ignorer && ignorer.menus && ignorer.menus.indexOf(menuName) !== -1) {
			return;
		}
		menus.push(menuName);
	});

	return menus;
}

exports.menu = specificMenu;
exports.menuList = menuList;
exports.exclude = exclude;
