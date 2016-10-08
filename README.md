# YA
шаблонизатор

<
new YA.Document({
      parent: document.body,
      content:[
        YA.__(blockname,{}, [
          YA.__(blockname,{})
        ]),
        YA.__(blockname,{}),
        YA.__(blockname,{}, [
          YA.__(blockname,{})
        ])
      ]
})
>

