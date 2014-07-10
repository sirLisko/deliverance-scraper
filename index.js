'use strict';

var request = require('request');
var parser = require('./parser');
var q = require('q');
var _ = require('lodash');

var domain = 'https://www.deliverance.co.uk';

function concatMenus(menus){
	return [].concat.apply([], menus);
}

function getMenues(name) {
	if (Array.isArray(name)) {
		return q.all(name.map(getMenues)).then(concatMenus);
	}

	var defer = q.defer();

	request(domain + '/menu/' + name, function(err, resp, html){
		if (err) {
			defer.reject(new Error('no menu'));
		} else {
			defer.resolve(parser.menu(html));
		}
	});

	return defer.promise;
}

function orderMenu(menu){
	menu = _.uniq(menu,function(item){
		var copy = _.clone(item, true);
		copy.menu = null;
		return JSON.stringify(copy);
	});
	menu = _.sortBy(menu, 'name');
	return menu;
}

function getMenuList() {
	var defer = q.defer();

	request(domain + '/menu', function(err, resp, html){
		if (err) {
			defer.reject(new Error('no menu list'));
		} else {
			defer.resolve(parser.menuList(html));
		}
	});

	return defer.promise;
}

function getMenu(name) {
	var defer = q.defer();

	var promise = (name)? getMenues(name) : getMenuList().then(getMenues);
	promise.then(orderMenu).then(defer.resolve);

	return defer.promise;
}

exports.getMenu = getMenu;
exports.getMenuList = getMenuList;
exports.exclude = parser.exclude;
