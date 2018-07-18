routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/pengantar/',
    url: './pages/pengantar.html',
  },
  {
    path: '/bab/:index/:title',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      var bab = routeTo.params.index;
      var judul = routeTo.params.title;
      // console.log(bab)

      // Show Preloader
      app.preloader.show();
      
      var db = app.data.db;
      
      var sloka = [];
      
      // sloka.push(    {
            // bab: 1,
            // ayat: 1,
            // indo: 'Anaknda Janamejaya, segala ajaran tentang Catur Warga (Dharma=kebajikan, Artha=kekayaan, Kama=kesenangan dan Moksa=kebebasan) baikpun sumber, maupun uraian tafsirnya ada di sini; segala yang terdapat di sini akan terdapat dalam sastra lain; yang tidak terdapat di sini juga tidak akan terdapat pada sastra lain.',
            // favorit: 0
          // });
      // sloka.push(    {
            // bab: 1,
            // ayat: 2,
            // indo: 'Manusia adalah satu-satunya mahluk yang dapat melakukan kebajikan pun kejahatan. Terlahir menjadi manusia bertujuan untuk melebur perbuatan-perbuatan jahat ke dalam perbuatan-perbuatan bajik, hingga tidak ada lagi perbuatan-perbuatan jahat yang masih tersisa dalam diri, inilah hakekat menjadi manusia. Hanya dengan menjadi manusia kejahatan itu dapat dilebur dalam kebajikan.',
            // favorit: 1
          // });

        // var data = {
        // title: judul,
        // sloka: [
          // {
            // bab: 1,
            // ayat: 1,
            // indo: 'Anaknda Janamejaya, segala ajaran tentang Catur Warga (Dharma=kebajikan, Artha=kekayaan, Kama=kesenangan dan Moksa=kebebasan) baikpun sumber, maupun uraian tafsirnya ada di sini; segala yang terdapat di sini akan terdapat dalam sastra lain; yang tidak terdapat di sini juga tidak akan terdapat pada sastra lain.',
            // favorit: 0
          // },
          // {
            // bab: 1,
            // ayat: 2,
            // indo: 'Manusia adalah satu-satunya mahluk yang dapat melakukan kebajikan pun kejahatan. Terlahir menjadi manusia bertujuan untuk melebur perbuatan-perbuatan jahat ke dalam perbuatan-perbuatan bajik, hingga tidak ada lagi perbuatan-perbuatan jahat yang masih tersisa dalam diri, inilah hakekat menjadi manusia. Hanya dengan menjadi manusia kejahatan itu dapat dilebur dalam kebajikan.',
            // favorit: 1
          // },
        // ]
      // };

      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select bab, ayat, sloka, indo, favorit from book where bab = ? order by ayat;', [bab], function(ignored, res) {
            // sloka = JSON.parse(res.rows);
            sloka = res.rows;
            // app.dialog.alert('res.rows.length: ' + res.rows.length);
          });
        }, function(error) {
          app.dialog.alert('insert error: ' + error.message);
        });      
      }
      
      var data = {
        title: judul, sloka: sloka
      }
      
      resolve(
        { componentUrl: './pages/bab.html' },
        { context: { data: data } }
      );
      app.preloader.hide();
    },
    
    on: {
      pageInit: function (event, page) {

        var db = app.data.db;
        if (!db) {
          app.dialog.alert('Db not defined!');
        }
      
        // to do
        $$('i.material-icons.fav').on('click', function (e) {//Changing color icons onclick
          
          $$(this).toggleClass('color-change');
          
          var db = app.data.db;
          if (db) {
            
            var card = $$(this).parents(".card");
            var bab = card.find('.bab').val();
            var ayat = card.find('.ayat').val();
            var value = ($$(this).hasClass('color-change') ? 1 : 0);
            
            db.transaction(function(tx) {
              tx.executeSql('UPDATE book SET favorit ? WHERE bab = ? and ayat = ?', [value, bab, ayat]);
            }, function(error) {
              app.dialog.alert('UPDATE error: ' + error.message);
            }, function() {
              // console.log('Sukses!.');
            });
          }
        });
        
        $$('i.material-icons.share').on('click', function (e) {//Changing color icons onclick
          //$$(this).toggleClass('color-change');
          var card = $$(this).parents(".card");
          var teks = card.find('.intro').text();
          // var bab = card.find('.bab').val();
          var ayat = card.find('.ayat').val();
          // app.dialog.alert(teks + '<br><br>Bab ' + bab + ' Sloka ' + ayat);

          var ac_share = app.actions.create({
            buttons: [
              {
                text: '<div class="list"><ul><li><div class="item-content">'+
                '<div class="item-media"><img class="material-icons" src="img/whatsapp.png" /></div>'+
                '<div class="item-inner">'+
                  '<div class="item-title-row">'+
                    '<div class="item-title">Whatsapp</div>'+
                  '</div>'+
                  '<div class="item-text"></div>'+
                '</div>'+
              '</div></li></ul></div>',
                onClick: function () {
                  var msg = teks + '\n\nSloka ' + ayat;
                  window.plugins.socialsharing.shareViaWhatsApp(msg, null, null, null, function(e){
                    app.dialog.alert('Sharing failed with message: ' + e, 'Sarasamuscaya');
                  })
                }
              },
              {
                text: '<div class="list"><ul><li><div class="item-content">'+
                '<div class="item-media"><img class="material-icons" src="img/telegram.png" /></div>'+
                '<div class="item-inner">'+
                  '<div class="item-title-row">'+
                    '<div class="item-title">Telegram</div>'+
                  '</div>'+
                  '<div class="item-text"></div>'+
                '</div>'+
              '</div></li></ul></div>',
                onClick: function () {
                  var msg = teks + '<br><br>Sloka ' + ayat;
                  window.plugins.socialsharing.shareVia('org.telegram.messenger', msg, null, null, null, null, function(e){
                    app.dialog.alert('Sharing failed with message: ' + e, 'Sarasamuscaya');
                  })
                }
              },
              {
                text: '<div class="list"><ul><li><div class="item-content">'+
                '<div class="item-media"><img class="material-icons" src="img/facebook.png" /></div>'+
                '<div class="item-inner">'+
                  '<div class="item-title-row">'+
                    '<div class="item-title">Facebook</div>'+
                  '</div>'+
                  '<div class="item-text"></div>'+
                '</div>'+
              '</div></li></ul></div>',
                onClick: function () {
                  var msg = teks + '<br><br>Sloka ' + ayat;
                  window.plugins.socialsharing.shareViaFacebook(msg, null, null, null, function(e){
                    app.dialog.alert('Sharing failed with message: ' + e, 'Sarasamuscaya');
                  })
                }
              },
              {
                text: '<div class="list"><ul><li><div class="item-content">'+
                '<div class="item-media"></div>'+
                '<div class="item-inner">'+
                  '<div class="item-title-row">'+
                    '<div class="item-title">Cancel</div>'+
                  '</div>'+
                  '<div class="item-text"></div>'+
                '</div>'+
              '</div></li></ul></div>',
                color: 'red',
              },
            ]
          });
          
          ac_share.open();
        });

      },
    }
  },
  {
    path: '/favorite/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      
      var db = app.data.db;
      var data = [];

      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select ayat, sloka, indo from book where favorit = "Y" order by bab, ayat;', [], function(ignored, res) {
            data = JSON.parse(res.rows);
          });
        }, function(error) {
          app.dialog.alert('insert error: ' + error.message);
        });      
      }
      
      resolve(
        { componentUrl: './pages/favorite.html' },
        { context: { data: data } }
      );
      app.preloader.hide();
    },
    
    on: {
      pageInit: function (event, page) {
        // to do
      },
    }
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
    on: {
      pageInit: function (event, page) {
        // to do
      },
      pageBeforeOut: function (event, page) {
        // to do
      },
    }
  },
  {
    path: '/contact-us/',
    url: './pages/contact-us.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
