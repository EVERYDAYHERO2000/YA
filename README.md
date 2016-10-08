# YA 
Шаблонизатор html

### Описание
Объявление шаблонов:

    var block = {
        tag : 'div',
        class : ['blockname','blockname_mix'],
        attrs : {
            style : {
                background : '#000000',
                color : '#ffffff',
                padding : '50px' 
            }
        },
        events : {
            'click' : function(e){}
        }
    }
    
    var link = {
      tag : 'a',
      class : ['blockname__link'],
      attrs : {
          href : 'http://site.com'
      }
    }


Инициализация шаблонов:

    new YA.Document({
        parent: document.body,
        content:[
            YA.__(block,{}, [
                YA.__(link,{})
            ]),
            YA.__(block, {}),
            YA.__(block,{}, [
                YA.__(link,{attrs: { href : 'http://newsite.com' } })
            ])
        ]
    })

