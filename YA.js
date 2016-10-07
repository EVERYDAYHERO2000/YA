"use strict";

var YA = window.YA || {};
YA.__elems = [];
YA.__events = [];
YA.__blocks = [];

/**
 * Создает Элемент. Если задан options.parent добавляет объект в массив YA.__elems и создаёт DOM элемент в родителе.
 * @param   {object}   options  Объект, прототип элемента
 * @param   {function} callback В качестве аргумента получает созданный объект
 * @returns {object} Возвращает объект
 */
YA.Element = function (options, callback) {
  options.namespace = options.namespace || 'http://www.w3.org/1999/xhtml';
  options.tag = options.tag || 'div';

  this.__proto = options;
  
  var _this = this;

  /**
   * Возвращает пространство имён
   * @returns {string} 
   */
  this.namespace = function () {
    return options.namespace;
  };

  /**
   * Возвращает DOM элемент
   * @returns {object}
   */
  this.elem = function () {
    return options.elem;
  };

  /**
   * Возвращает DOM элемент родителя
   * @returns {object}
   */
  this.parent = function () {
    return options.parent;
  };

  /**
   * Возвращает tag элемента
   * @returns {string}
   */
  this.tag = function () {
    return options.tag;
  };

  /**
   * С аргументов устанавливает содержимое элемента, без аргумента возвращает содержимое элемента.
   * @param   {string} value строка, может содержать html символы. 
   * @returns {string} Содержимое элемента 
   */
  this.content = function (value) {
    return (value) ? options.elem.innerHTML = options.content = value : options.elem.innerHTML;
  }

  /**
   * Удаляет контент, содержимое элемента
   * @returns {string} возвращает пустую строку
   */
  this.removeContent = function () {
    return options.elem.innerHTML = options.content = '';
  }

  this.class = function (val) {
    if (val) {
      var newClasses = []
      if (YA.f.ifExist(val, 'object') && YA.f.ifExist(val[0])) {

        for (var _class = 0; _class < val.length; _class++) {
          if (!YA.f.ifExist(val[_class])) continue;
          options.elem.classList.add(val[_class]);
          newClasses.push(val[_class]);
        }
      } else {
        if (val.length > 0) {
          options.elem.classList.add(val);
          newClasses.push(val);
        }
      }

      options.class = (YA.f.ifExist(options.class, 'string')) ? [options.class] : options.class;

      if (!options.class) options.class = [];
      options.class = function (arr) {
        var obj = {};

        for (var i = 0; i < arr.length; i++) {
          obj[arr[i]] = true;
        }

        return Object.keys(obj);
      }(options.class.concat(newClasses));
    }

    return options.class;
  };

  /**
   * Удаляет css класс
   * @param {string} value Название класса
   */
  this.removeClass = function (value) {
    options.elem.classList.remove(value);
    for (var i = 0; i < options.class.length; i++) {
      if (value === options.class[i]) options.class.splice(i, 1);
    }
  }

  /**
   * Если задан атрибут value создает новый атрибут для элемента. Если задан только key возвращает значение атрибута.
   * @param   {string} key Имя атрибута
   * @param   {object} value Объект или строка со значением атрибута. Объект в случии атрибута style
   * @returns {object} возвращает список всех атрибутов элемента
   */
  this.attrs = function (key, value) {

    if (value) {
      switch (key) {

      case 'style':
        if (YA.f.ifExist(value, 'object')) {
          for (var _style in value) {
            if (YA.f.ifExist(value[_style])) {
              options.elem.style[_style] = value[_style];
              options.attrs[key][_style] = value[_style];
            }
          }
        } else {
          options.elem.setAttribute('style', value);
          options.attrs[key] = value;
        }
        break;

      default:
        if (YA.f.ifExist(value)) {
          options.elem.setAttribute(key, value);
          options.attrs[key] = value;
        }
        break;
      }
    }

    return options.attrs;
  };
  
  /**
   * Удаляет атрибут по имени.
   * @param   {string}   key имя атрибута
   * @returns {object} Возвращает объект с атрибутами элемента
   */
  this.removeAttr = function(key){
    options.elem.removeAttribute(key);
    delete options.attrs[key];
    return options.attrs;
  }

  this.events = function (e, f) {
    if (f) {
      options.elem.addEventListener(e, f);
    }
  };

  /**
   * Удаляет элемент из массива YA.__elems и из DOM. 
   */
  this.remove = function () {
    for (var i = 0; i < YA.__elems.length; i++) {
      if (YA.__elems[i].elem() !== _this.elem()) continue;
      YA.__elems[i].elem().parentNode.removeChild(YA.__elems[i].elem());
      YA.__elems.splice(i, 1);
    }
  }

  /**
   * Создаёт элемент. Не доступна из конструктора. 
   */
  function create() {

    if (YA.f.ifMatch(options.tag, 'text')) {
      options.elem = document.createTextNode(options.content || '');
    } else {
      options.elem = document.createElementNS ? document.createElementNS(options.namespace, options.tag) : document.createElement(options.tag);
      _this.content(options.content || '');

      for (var _attr in options.attrs) {
        _this.attrs(_attr, options.attrs[_attr]);

      }

      _this.class(options.class);

      for (var _event in options.events) {
        _this.events(_event, options.events[_event])
      }
    }

    if (YA.f.ifHtml(options.parent)) {
      options.parent = (YA.f.ifMatch(options.parent.nodeName, '#text')) ? options.parent.parentNode : options.parent;
      options.parent.appendChild(options.elem);
      YA.__elems.push(_this);
    }
  }

  create();
  if (callback) callback(this);
  return this;
}

/**
 * Создает Блок, набор элементов. Если задан options.parent добавляет объект в массив YA.__blocks и создаёт DOM элементы в родителе.
 * @param   {object}   obj      Конструкия описывающая блок из набора элементов.
 * @param   {object} callback Функция в качестве аргумента получает объект с корневым DOM элементом
 * @returns {object} возвращает объект
 */
YA.Block = function (obj, callback) {
  var _this = this;
  this.__proto = obj;
  this.elem = null;

  /**
   * Создаёт блок. Не доступна из конструктора. 
   * @param {object} ссылка на родителя
   * @param {object} obj    Объект с описанием свойств элемента
   */
  function create(parent, obj) {

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

      obj[_elem].elem = element.elem();
      if (!_this.elem) _this.elem = element.elem;
      
      if (_ifNode) create(element.elem(), obj[_elem].content);
    }

  }
  
  /**
   * Удаляет блок из массива YA.__blocks и из DOM, удаляет все вложенные элементы из YA.__elems 
   */
  this.remove = function(){
    var tempTree;
    for (var i = 0; i < YA.__blocks.length; i++) {
      if (YA.__blocks[i].elem() !== _this.elem()) continue;
      tempTree = YA.__blocks[i].__proto;
      YA.__blocks.splice(i, 1);
    }
    
    function removeTree(obj){
      for (var _elem = 0; _elem < obj.length; _elem++) {
        var _ifNode = YA.f.ifExist(obj[_elem].content, 'object');
        for (var i = 0; i < YA.__elems.length; i++) {
          if (obj[_elem].elem !== YA.__elems[i].elem() ) continue;
          YA.__elems[i].remove();
        }
        if (_ifNode) removeTree(obj[_elem].content);
      }
    } 
    removeTree(tempTree.content);
  }
  
  create(obj.parent, obj.content);
  YA.__blocks.push(this);
  if (callback) callback(this);
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