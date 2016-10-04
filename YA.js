"use strict";

var YA = window.YA || {};

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
  this.options = {
    namespace: options.namespace || 'http://www.w3.org/1999/xhtml',
    parent: options.parent || null,
    tag: options.tag || 'div',
    content: options.content || '',
    attrs: options.attrs || {},
    events: options.events || {}
  };

  function create() {
    var options = _this.options, elem;

    if (YA.f.ifMatch(options.tag, 'text')) {
      elem = document.createTextNode(options.content);
    } else {
      elem = document.createElementNS ? document.createElementNS(options.namespace, options.tag) : document.createElement(options.tag);
      elem.innerHTML = options.content;

      for (var _attr in options.attrs) {

        switch (_attr) {

        case 'class':
          if (YA.f.ifExist(options.attrs[_attr], 'object')) {
            for (var _class = 0; _class < options.attrs[_attr].length; _class++) {
              elem.classList.add(options.attrs[_attr][_class]);
            }
          } else {
            elem.classList.add(options.attrs[_attr]);
          }
          break;

        case 'style':
          if (YA.f.ifExist(options.attrs[_attr], 'object')) {
            for (var _style in options.attrs[_attr]) {
              if (YA.f.ifExist(options.attrs[_attr][_style])) elem.style[_style] = options.attrs[_attr][_style];
            }
          } else {
            elem.setAttribute('style', options.attrs[_attr]);
          }
          break;

        default:
          if (YA.f.ifExist(options.attrs[_attr])) elem.setAttribute(_attr, options.attrs[_attr]);
          break;
        }
      }

      for (var _event in options.events) {
        
        elem.addEventListener(_event, options.events[_event]);
      }
    }

    _this.elem = elem;

    if (YA.f.ifHtml(options.parent)) {
      options.parent = (YA.f.ifMatch(options.parent.nodeName, '#text')) ? options.parent.parentNode : options.parent;

      options.parent.appendChild(elem);
    }
  }

  this.remove = function () {
    _this.elem.parentNode.removeChild(_this.elem);
  }

  create();
  return this;
}

YA.Block = function (obj) {
  var _this = this, _hidden = {};
  this.tree = obj;
  this.elem = null;

  _hidden.create = function(parent, obj) {
    
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

