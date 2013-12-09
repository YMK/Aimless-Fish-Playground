define([], function () {
  var fixes = window.fixes || {};

  fixes.firefoxFix = function () {

    if (/firefox/.test(window.navigator.userAgent.toLowerCase())) {
      var tds = document.getElementsByTagName('td'),
        style = '<style>'
          + 'td { padding: 0 !important; }'
          + 'td:hover::before, td:hover::after { background-color: transparent !important; }'
          + '</style>',
        index;

      for (index = 0; index < tds.length; index++) {
        tds[index].innerHTML = '<div class="ff-fix">' + tds[index].innerHTML + '</div>';
      }

      document.head.insertAdjacentHTML('beforeEnd', style);
    }
  };

  return fixes;
});