# YA 
Шаблонизатор html

### Описание
Объявление шаблонов:

    var block = {
      tag: 'div',
      class: ['blockname', 'blockname_mix'],
      attrs: {
        style: {
          background: '#000000',
          color: '#ffffff',
          padding: '50px'
        }
      },
      events: {
        'click': function (e) {
          console.log(e);
        }
      }
    }

Шаблон описывает блок div.blockname.blockname_mix с инлайн стилями и событием на click 

    var link = {
      tag: 'a',
      class: ['blockname__link'],
      content: 'Ссылка',
      attrs: {
        href: 'http://site.com'
      }
    }

Шаблон описывает ссылку a.blockname__link с текстом "Ссылка" внутри и атрибутом href


Инициализация шаблонов:

    new YA.Document({
      parent: document.body,
      content: [
        YA.__(block, {}, [
          YA.__(link, {})
        ]),
        YA.__(block, { attrs: { style: { background: 'red' } } }),
        YA.__(block, {}, [
          YA.__(link, { attrs: { href: 'http://newsite.com' } })
        ])
      ]
    })
	
Выведет:	

	<div class="blockname blockname_mix" style="color: rgb(255, 255, 255); padding: 50px; background: rgb(0, 0, 0);">
		<a href="http://site.com" class="blockname__link">Ссылка</a>
	</div>
	<div class="blockname blockname_mix" style="color: rgb(255, 255, 255); padding: 50px; background: red;"></div>
	<div class="blockname blockname_mix" style="color: rgb(255, 255, 255); padding: 50px; background: rgb(0, 0, 0);">
		<a href="http://newsite.com" class="blockname__link">Ссылка</a>
	</div>
    
Элементы доступны в массиве YA.__elems а вся конструкция в массиве YA.__block. Все события доступны в YA.__events

Аргументы: 

    new YA.Document(proto, mix, inner, callback);
    
**proto** {object} прототип

**mix** {object} параметры которые нужно заменить для экземпляра

**inner** {array} массив для элементов которые нужно положить в дерево

**callback** {function} в качестве аргумента получает ссылку на созданный объект 

### Схема элемента

    {
      namespace : < {string} пространство имен, по умолчанию 'http://www.w3.org/1999/xhtml', для SVG 'http://www.w3.org/2000/svg'>, 
      tag : < {string} название тега, по умолчанию 'div'>,
      id : < {string} идентификатор для поиска в массиве YA.__elems и YA.__blocks>,
      parent : < {object} родитель элемента>, 
      class : < {array} список класов>,
      attrs : { < {object} список атрибутов элемента>
        id : < {string} >,
        href : < {string} >,
        style : { < {object} >
          background : < {string} >,
          font : < {string} >,
          color : < {string} >,
        },
        ...   
      },
      events : { < {object} список событий элемента>
        click : < {function} >,
        ...
      },
      content : < {string} содержимое элемента>
      
    }
