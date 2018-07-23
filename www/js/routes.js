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
    componentUrl: './pages/favorit.html',
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
