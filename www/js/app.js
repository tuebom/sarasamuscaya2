// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.sarasamuscaya', // App bundle ID
  name: 'Sarasamuscaya', // App name
  theme: 'auto', // Automatic theme detection
  init: true,
  initOnDeviceReady: true,
  
  touch: {
    disableContextMenu: false,
  },
  
  // App root data
  data: function () {
    return {
      db: null,
      totalSloka: 0,
      admobid: {}
    };
  },
  // App root methods
  methods: {

    // dummy: function() {
    // },
  },
  on: {
    init: function () {
    
      function copyDatabaseFile(dbName) {

        var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
        var targetDirName = cordova.file.dataDirectory;

        return Promise.all([
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
          }),
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(targetDirName, resolve, reject);
          })
        ]).then(function (files) {
          var sourceFile = files[0];
          var targetDir = files[1];
          return new Promise(function (resolve, reject) {
            targetDir.getFile(dbName, {}, resolve, reject);
          }).then(function () {
            console.log("file already copied");
          }).catch(function () {
            console.log("file doesn't exist, copying it");
            return new Promise(function (resolve, reject) {
              sourceFile.copyTo(targetDir, dbName, resolve, reject);
            }).then(function () {
              console.log("database file copied");
            });
          });
        });
      }

      copyDatabaseFile('srs.db').then(function () {
        // success! :)
        app.data.db = window.sqlitePlugin.openDatabase({name: 'srs.db'});
      }).catch(function (err) {
        // error! :(
        console.log(err);
      });
      
      //*
      //run admob
      if( /(android)/i.test(navigator.userAgent) ) {
        this.data.admobid = { // for Android
          banner: 'ca-app-pub-8720755312345684/2294562251',
          interstitial: 'ca-app-pub-8720755312345684/3086731912'
        };
      } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        this.data.admobid = { // for iOS
          banner: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo',
          interstitial: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo'
        };
      } else {
        this.data.admobid = { // for Windows Phone
          banner: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo',
          interstitial: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo'
        };
      }
     
      
      if ( AdMob ) {
     
        // this will create a banner on startup
        AdMob.createBanner( {
          adId: this.data.admobid.banner,
          adSize: 'SMART_BANNER',
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          isTesting: true, // TODO: remove this line when release
          //autoShow: false,
          overlap: false,
          // offsetTopBar: false,
          bgColor: 'white'
        } );
      }
      //*/
      
    },     
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

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
        var msg = 'Download aplikasi Sarasamuscaya di Playstore.\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.sarasamuscaya';
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
        var msg = 'Download aplikasi Sarasamuscaya di Playstore.\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.sarasamuscaya';
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
        var msg = 'Download aplikasi Sarasamuscaya di Playstore.';
        // 'https://play.google.com/store/apps/details?id=com.app.sarasamuscaya';
        // window.plugins.socialsharing.shareViaFacebook(msg, null, null, null, function(e){
        window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(msg, null, 'https://play.google.com/store/apps/details?id=com.app.sarasamuscaya', 'Paste pesan anda!', null, function(e){
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

$$('.ac-share').on('click', function () {
  ac_share.open();
});

$$(document).on('backbutton', function (e) {
  e.preventDefault();
  // for example, based on what and where view you have
  if (app.views.main.router.url == '/') {
    
    var isRated = localStorage.getItem('rated');
    
    if (isRated !== 'Y') {
      app.dialog.confirm('Jika anda menyukai aplikasi ini, mohon luangkan waktu anda untuk memberi rate aplikasi di Play Store.', function () {
        localStorage.setItem('rated', 'Y');
        //mainView.router.navigate('https://play.google.com/store/apps/details?id=com.app.sarasamuscaya');
        //window.open("https://play.google.com/store/apps/details?id=com.app.sarasamuscaya", '_system') //ios
        navigator.app.loadUrl("https://play.google.com/store/apps/details?id=com.app.sarasamuscaya", {openExternal : true}) //android
        // navigator.app.exitApp();
      },  function () {
        navigator.app.exitApp();
      });
    } else {
      navigator.app.exitApp();
    }
  } else {
    mainView.router.back();
  }
});

// app.on('pageInit', function (page) {

  // $$('input').on('focus', function () {
    
    // $$('.kb').css('height', '280px');
    // //var limit = $$(window).height() - 280;

    // if ($$(this).offset().top > 280) {
      // $$('.page-content').scrollTop($$(this).offset().top-168);
    // }
  // });

  // $$('input').on('blur', function () {
    // $$('.kb').css('height', '0px');
  // });
// });
