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
    path: '/bab/:anu/:title',
    componentUrl: './pages/bab.html',
  },
  {
    path: '/favorit/',
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
