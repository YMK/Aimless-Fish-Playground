var tests = [],
  file;
for (file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  baseUrl: "/base/app/",

  paths: {
    "angular": "lib/angular/angular",
    "ngroute": "lib/angular-route/angular-route",
    "jquery": "lib/jquery/dist/jquery",
    "ngmocks": "lib/angular-mocks/angular-mocks",
    "kudoku": "lib/kudoku",
    "underscore": "lib/underscore/underscore-min"
  },

  shim: {
    "angular": {
      exports: "angular"
    },
    "ngroute": ['angular'],
    "ngmocks": {
      deps: ['angular'],
      exports: "mocks"
    },
    "underscore": {
      exports: "_"
    }
  },

  deps: tests,

  callback: window.__karma__.start
});
