/* Olympic Entrepreneur — custom line icon set.
   Injected once per page so every <svg><use href="#i-name"/></svg> resolves,
   including when the site is opened straight from disk (file://). */
(function () {
  var s = function (id, body, vb) {
    return '<symbol id="i-' + id + '" viewBox="' + (vb || '0 0 24 24') + '">' + body + '</symbol>';
  };

  var sprite = [
    // Arrows & UI
    s('arrow-r', '<path d="M4.5 12h15"/><path d="M13.5 6l6 6-6 6"/>'),
    s('arrow-ur', '<path d="M7 17L17 7"/><path d="M8.5 7H17v8.5"/>'),
    s('arrow-d', '<path d="M12 4.5v15"/><path d="M6 13.5l6 6 6-6"/>'),
    s('arrow-up', '<path d="M12 19.5v-15"/><path d="M6 10.5l6-6 6 6"/>'),
    s('check', '<path d="M5 12.5l4.2 4.2L19 7"/>'),
    s('plus', '<path d="M12 5v14"/><path d="M5 12h14"/>'),
    s('close', '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
    s('minus', '<path d="M5 12h14"/>'),
    s('chev-d', '<path d="M6 9.5l6 6 6-6"/>'),

    // Core services
    s('web', '<rect x="2.75" y="4" width="18.5" height="16" rx="2"/><path d="M2.75 8.5h18.5"/><path d="M6.5 12.5h6.5"/><path d="M6.5 15.75h4"/><rect x="15" y="12" width="3" height="4.5" rx=".6"/><path d="M5.5 6.25h.01M7.5 6.25h.01"/>'),
    s('search-ads', '<circle cx="10.5" cy="10.5" r="6.75"/><path d="M15.5 15.5l5 5"/><path d="M7.25 12.25l2.1-2.1 1.6 1.6 2.8-3"/>'),
    s('social', '<rect x="4" y="2.75" width="16" height="18.5" rx="2.25"/><circle cx="8.25" cy="7" r="1.5"/><path d="M11.25 6.25h5.25M11.25 8h3"/><rect x="7" y="10.5" width="10" height="5.75" rx="1"/><path d="M7 19h2.5M12 19h.01"/>'),

    // Website services
    s('pen', '<path d="M12 2.75l5.75 7.5L12 21.25 6.25 10.25z"/><circle cx="12" cy="11.25" r="1.6"/><path d="M12 2.75v6.9"/>'),
    s('code', '<path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M14 4l-4 16"/>'),
    s('devices', '<rect x="2" y="4" width="14" height="10" rx="1.5"/><path d="M6 18h6M9 14v4"/><rect x="17.25" y="8.5" width="4.75" height="11" rx="1.2"/>'),
    s('uiux', '<rect x="2.75" y="3" width="14.5" height="12" rx="2"/><path d="M2.75 7h14.5"/><path d="M6 10.5h5"/><path d="M13.5 13.25l7.25 2.6-3.1 1.25-1.25 3.15z"/>'),
    s('gauge', '<path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17l4.25-5.25"/><circle cx="12" cy="17" r="1.25"/><path d="M6.2 11.2l1 .8M12 8.5v1.25M17.8 11.2l-1 .8"/>'),
    s('target', '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.75"/><circle cx="12" cy="12" r="1.25"/>'),

    // Process
    s('compass', '<circle cx="12" cy="12" r="9"/><path d="M15.75 8.25l-2.25 5.25-5.25 2.25 2.25-5.25z"/>'),
    s('route', '<circle cx="5.75" cy="18.25" r="2"/><circle cx="18.25" cy="5.75" r="2"/><path d="M7.75 18.25h6.5a3 3 0 0 0 0-6h-4.5a3 3 0 0 1 0-6h6.5"/>'),
    s('launch', '<path d="M12 2.75c3.1 2.1 4.6 5.7 4 9.8l-2 2.7h-4l-2-2.7c-.6-4.1.9-7.7 4-9.8z"/><circle cx="12" cy="9" r="1.6"/><path d="M9.75 18.25L9 21M14.25 18.25L15 21M12 18v3.25"/>'),
    s('trend', '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
    s('flask', '<path d="M9.5 3h5M10.25 3v6L4.8 18.4A1.75 1.75 0 0 0 6.35 21h11.3a1.75 1.75 0 0 0 1.55-2.6L13.75 9V3"/><path d="M7.5 14.5h9"/>'),
    s('diamond', '<path d="M6.5 3.5h11l3.5 5-9 12-9-12z"/><path d="M3 8.5h18"/><path d="M9.25 3.5L12 8.5l2.75-5"/><path d="M12 8.5v12"/>'),
    s('layers', '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/>'),

    // Google Ads services
    s('sliders', '<path d="M4 6h9.5M18.5 6H20M4 12h3.5M12.5 12H20M4 18h11.5M20 18h0"/><circle cx="16" cy="6" r="2.25"/><circle cx="10" cy="12" r="2.25"/><circle cx="18" cy="18" r="2.25"/>'),
    s('key', '<circle cx="7.75" cy="15.75" r="4.25"/><path d="M10.75 12.75L20 3.5"/><path d="M16.25 7.25l3 3"/><path d="M14 9.5l2 2"/>'),
    s('edit', '<path d="M16.25 3.75l4 4L8.75 19.25H4.75v-4z"/><path d="M13.75 6.25l4 4"/>'),
    s('tree', '<rect x="9" y="2.75" width="6" height="4.5" rx="1"/><rect x="2.75" y="16.75" width="6" height="4.5" rx="1"/><rect x="15.25" y="16.75" width="6" height="4.5" rx="1"/><path d="M12 7.25v4.5M5.75 16.75V13.5c0-.9.8-1.75 1.75-1.75h9c.95 0 1.75.85 1.75 1.75v3.25"/>'),
    s('users', '<circle cx="9" cy="8" r="3.25"/><path d="M3.25 19.5a5.75 5.75 0 0 1 11.5 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.75 14.1A4.6 4.6 0 0 1 20.75 18.5"/>'),
    s('crosshair', '<circle cx="12" cy="12" r="7"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5"/><circle cx="12" cy="12" r="1.4"/>'),
    s('wallet', '<rect x="3" y="6.5" width="18" height="13.5" rx="2"/><path d="M16 13.25h2.5"/><path d="M5.5 6.5l10-3.25 1 3.25"/>'),
    s('pulse', '<path d="M2.75 12.5h4l2.5-6.5 4 13 2.75-6.5h5.25"/>'),
    s('loop', '<path d="M4.5 11.5A7.75 7.75 0 0 1 17.8 6.2L20 8.5"/><path d="M20 3.75V8.5h-4.75"/><path d="M19.5 12.5a7.75 7.75 0 0 1-13.3 5.3L4 15.5"/><path d="M4 20.25V15.5h4.75"/>'),

    // Meta Ads services
    s('plus-square', '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M12 8v8M8 12h8"/>'),
    s('radar', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6.2-6.2"/><circle cx="12" cy="12" r="1.1"/>'),
    s('feed', '<rect x="3" y="3.5" width="18" height="17" rx="2.25"/><circle cx="7.25" cy="7.75" r="1.5"/><path d="M10.25 7.25h6.5M10.25 9h3.5"/><rect x="6.25" y="11.5" width="11.5" height="5.5" rx=".9"/>'),
    s('camera', '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.25 6.75h.01"/>'),
    s('spark', '<path d="M12 3c.75 4.6 4.4 8.25 9 9-4.6.75-8.25 4.4-9 9-.75-4.6-4.4-8.25-9-9 4.6-.75 8.25-4.4 9-9z"/>'),
    s('return', '<path d="M9 14.5L4 9.5l5-5"/><path d="M4 9.5h10.75a5.25 5.25 0 0 1 0 10.5H11"/>'),
    s('chart', '<path d="M3 20.5h18"/><path d="M6 20.5v-6.5M10.5 20.5V9M15 20.5v-4.5M19.5 20.5V5"/>'),
    s('grid', '<rect x="3" y="3" width="7.25" height="7.25" rx="1.5"/><rect x="13.75" y="3" width="7.25" height="7.25" rx="1.5"/><rect x="3" y="13.75" width="7.25" height="7.25" rx="1.5"/><rect x="13.75" y="13.75" width="7.25" height="7.25" rx="1.5"/>'),

    // Contact & social
    s('mail', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>'),
    s('phone', '<path d="M5 3.75h3.5l1.75 4.75-2.25 1.5a11.5 11.5 0 0 0 5.9 5.9l1.5-2.25 4.75 1.75V19a1.75 1.75 0 0 1-1.9 1.75A16.25 16.25 0 0 1 3.25 5.65 1.75 1.75 0 0 1 5 3.75z"/>'),
    s('message', '<path d="M4 4.75h16v11.5H9.25L4 20.25z"/><path d="M8 9h8M8 12.25h5"/>'),
    s('instagram', '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.25 6.75h.01"/>'),
    s('linkedin', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5v6.5M8 7.5v.01M12 17v-6.5M12 13.5a3 3 0 0 1 6 0V17"/>'),
    s('facebook', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M15.5 7.5h-1.75A2.25 2.25 0 0 0 11.5 9.75V21M9 13h6"/>'),
    s('shield', '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/><path d="M8.75 12l2.25 2.25 4.25-4.5"/>'),
    s('clock', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.25 2"/>'),
    s('euro', '<path d="M17.5 6.5A7 7 0 1 0 17.5 17.5"/><path d="M4 10.25h9M4 13.75h9"/>'),

    // Laurel — classical symbol of achievement (drawn as fine line-art)
    s('laurel',
      '<g id="i-laurel-branch">' +
        '<path d="M30 56Q8 44 14 10"/>' +
        '<path d="M24 51.9c-2.6-1.5-6.3-1.6-8.4-.3 2.3 1.6 6 1.8 8.4.3z"/>' +
        '<path d="M19.3 46.8c-2.2-2.1-5.8-2.8-8.1-2 2 2.1 5.6 2.9 8.1 2z"/>' +
        '<path d="M15.9 40.7c-1.7-2.5-5-3.9-7.4-3.6 1.5 2.5 4.8 4 7.4 3.6z"/>' +
        '<path d="M13.7 33.7c-1.2-2.8-4.1-4.8-6.5-4.9 1 2.7 3.9 4.8 6.5 4.9z"/>' +
        '<path d="M12.8 25.6c-.6-3-3.1-5.4-5.4-5.9.5 2.9 3 5.4 5.4 5.9z"/>' +
        '<path d="M13.1 16.6c-.1-3-2.1-5.8-4.3-6.7 0 3 2 5.8 4.3 6.7z"/>' +
        '<path d="M24 51.9c.2-3 2.2-5.7 4.4-6.6 0 3-2 5.7-4.4 6.6z"/>' +
        '<path d="M19.3 46.8c.8-2.9 3.3-5.1 5.7-5.5-.6 2.9-3.2 5.1-5.7 5.5z"/>' +
        '<path d="M15.9 40.7c1.1-2.8 4-4.7 6.4-4.8-1 2.8-3.9 4.7-6.4 4.8z"/>' +
        '<path d="M13.7 33.7c1.4-2.6 4.5-4.2 6.9-4-1.3 2.6-4.4 4.2-6.9 4z"/>' +
        '<path d="M12.8 25.6c1.6-2.5 4.8-3.8 7.1-3.3-1.5 2.5-4.7 3.8-7.1 3.3z"/>' +
        '<path d="M14 10c.4-2.9 2.6-5.3 4.9-5.8-.4 2.9-2.6 5.3-4.9 5.8z"/>' +
      '</g>' +
      '<g transform="translate(64 0) scale(-1 1)"><use href="#i-laurel-branch"/></g>',
      '0 0 64 64')
  ].join('');

  var holder = document.createElement('div');
  holder.setAttribute('aria-hidden', 'true');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" focusable="false">' + sprite + '</svg>';

  // Normalise every stroke so icons can "draw themselves" on hover (see .draw-on-hover in CSS).
  var shapes = holder.querySelectorAll('path, circle, rect, line, polyline, ellipse');
  for (var i = 0; i < shapes.length; i++) shapes[i].setAttribute('pathLength', '1');

  (document.body || document.documentElement).insertBefore(holder, (document.body || document.documentElement).firstChild);
})();
