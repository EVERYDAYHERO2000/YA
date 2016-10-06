"use strict";

var YA = window.YA || {};
YA.__elems = [];


/**
 * Создаёт DOM элемент. 
 * @param   {object} settings 
 *                   {object} parent : родитель(по умолчанию body), если не задан родитель функция вернет DOM элемент без добавления в html 
 *                   {string} tag : html tag(по умолчанию div) или text для createTextNode(), по умолчанию div
 *                   {string} content : содержимое, строка,
 *                   {object} attrs : объект с атрибутами {название атрибута : значение} 
 * @returns {object} Возвращает DOM элемент
 */
YA.Element = function (options) {
  var _this = this;

  this.namespace = options.namespace || 'http://www.w3.org/1999/xhtml';
  this.elem = null;
  this.parent = options.parent || null;
  this.tag = options.tag || 'div';
  this.content = options.content || '';
  this.class = options.class || [];
  this.attrs = options.attrs || {};
  this.events = options.events || {};

  this.setClass = function (val) {
    var newClasses = []
    if (YA.f.ifExist(val, 'object') && YA.f.ifExist(val[0])) {

      for (var _class = 0; _class < val.length; _class++) {
        if (!YA.f.ifExist(val[_class])) continue;
        _this.elem.classList.add(val[_class]);
        newClasses.push(val[_class]);
      }
    } else {
      if (val.length > 0) {
        _this.elem.classList.add(val);
        newClasses.push(val); 
      }
    }

    function unique(arr) {
      var obj = {};

      for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
      }

      return Object.keys(obj);
    }

    _this.class = (YA.f.ifExist(_this.class, 'string')) ? [_this.class] : _this.class;
    _this.class = unique(_this.class.concat(newClasses));
  }

  this.getClass = function () {
    return _this.class;
  }

  this.removeClass = function(c) {
    _this.elem.classList.remove(c);
    for (var i=0; i < _this.class.length; i++){
      if (c === _this.class[i]) _this.class.splice(i,1);
    }
  }
  
  this.setAttr = function (key, val) {
    switch (key) {

    case 'class':
      _this.setClass(val);
      break;

    case 'style':
      if (YA.f.ifExist(val, 'object')) {
        for (var _style in val) {
          if (YA.f.ifExist(val[_style])) {
            _this.elem.style[_style] = val[_style];
            _this.attrs[key][_style] = val[_style];
          }
        }
      } else {
        _this.elem.setAttribute('style', val);
        _this.attrs[key] = val;
      }
      break;

    default:
      if (YA.f.ifExist(val)) {
        _this.elem.setAttribute(key, val);
        _this.attrs[key] = val;

      }
      break;
    }
  }

  this.getAttr = function (attr) {
    return _this.elem.getAttribute(attr);
  }

  this.removeAttr = function (attr) {
    _this.elem.removeAttribute(attr);
    delete _this.attrs[attr];
  }


  function create() {

    if (YA.f.ifMatch(_this.tag, 'text')) {
      _this.elem = document.createTextNode(_this.content);
    } else {
      _this.elem = document.createElementNS ? document.createElementNS(_this.namespace, _this.tag) : document.createElement(_this.tag);
      _this.elem.innerHTML = _this.content;

      for (var _attr in _this.attrs) {
        _this.setAttr(_attr, _this.attrs[_attr]);

      }

      _this.setClass(_this.class);

      for (var _event in _this.events) {
        _this.elem.addEventListener(_event, _this.events[_event]);
      }
    }


    if (YA.f.ifHtml(options.parent)) {
      options.parent = (YA.f.ifMatch(options.parent.nodeName, '#text')) ? options.parent.parentNode : options.parent;

      options.parent.appendChild(_this.elem);
    }
  }

  this.remove = function () {
    for (var i = 0; i < YA.__elems.length; i++) {
      if (YA.__elems[i].elem !== _this.elem) continue;
      YA.__elems[i].elem.parentNode.removeChild(YA.__elems[i].elem);
      YA.__elems.slice(i, 1);
    }
  }

  create();
  YA.__elems.push(this);
  return this;
}

YA.Block = function (obj) {
  var _this = this,
    _hidden = {};
  this.tree = obj;
  this.elem = null;

  _hidden.create = function (parent, obj) {

    for (var _elem = 0; _elem < obj.length; _elem++) {

      var _ifNode = YA.f.ifExist(obj[_elem].content, 'object');

      var element = new YA.Element({
        namespace: obj[_elem].namespace || null,
        parent: parent || null,
        tag: obj[_elem].tag || null,
        attrs: obj[_elem].attrs || null,
        events: obj[_elem].events || null,
        content: _ifNode ? null : obj[_elem].content
      });

      if (!_this.elem) _this.elem = element.elem;

      if (_ifNode) _hidden.create(element.elem, obj[_elem].content);
    }

  }
  _hidden.create(obj.parent, obj.content);
  return this;

}

YA.f = {};

/**
 * Удаляет символы !?()., -$ $ из строки
 * @param   {string} str [[Description]]
 * @returns {string} [[Description]]
 */
YA.f.replace = function (str) {
  return (YA.f.ifExist(str, 'string')) ?
    str.replace(/\-?\$+/gi, '')
    .replace(/\(+/gi, '')
    .replace(/\)+/gi, '')
    .replace(/\.+/gi, '')
    .replace(/\,+/gi, '') : '';
}

YA.f.ifHtml = function (obj) {
  return (typeof Node === "object" ? obj instanceof Node : obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string");
};
/**
 * Производит сравнение двух строк не учитывая регистр символов в строке и удалив лишнии символы.
 * Яндекс = яндекс = ЯНДЕКС
 * @param   {string}  a первая строка
 * @param   {string}  b вторая строка
 * @returns {boolean} Возвращает true если есть совпадение и false если нет.
 */
YA.f.ifMatch = function (a, b) {
  return (YA.f.replace(a).toLowerCase().trim() === YA.f.replace(b).toLowerCase().trim());
};
/**
 * Проверяет существует ли переменная и ее тип
 * @param   {function} str  элемент (строка, массив, объект, число)
 * @param   {string} type тип на который нужно проверить
 * @returns {boolean}  true - если существует, false - если нет.
 */
YA.f.ifExist = function (str, type) {

  return (str === undefined || str === null) ? false : ((type !== undefined) ? (typeof str === type) : true);
};