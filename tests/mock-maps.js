// Minimal mock af Google Maps JS API til test (ingen netværk).
(function () {
  const log = (window.__mapsLog = []);
  class LatLngBounds { constructor(){this.pts=[];} extend(p){this.pts.push(p);} }
  class Map {
    constructor(el, opts){ this.el=el; this.opts=opts; el.style.background='#BFDFF0'; el.innerHTML='<div data-mock-map style="position:relative;width:100%;height:100%"></div>'; log.push(['map', !!opts.styles, opts.mapId||null]); }
    fitBounds(b){ log.push(['fit', b.pts.length]); } setCenter(p){ log.push(['center', p.lat]); } setOptions(o){ log.push(['opts', Object.keys(o).join()]); } panTo(p){ log.push(['pan', p.lat]); } setZoom(z){ log.push(['zoom', z]); }
  }
  class Marker {
    constructor(o){ this.o=o; this.visible=true; this.listeners={}; const b=document.createElement('button'); b.type='button'; b.title=o.title; b.dataset.mockMarker=o.title; b.style.cssText='position:absolute;left:'+((o.position.lng-8)*55)+'%;top:'+((57.6-o.position.lat)*45)+'%;width:36px;height:46px;border:0;background:url("'+(o.icon.url||'')+'") no-repeat'; b.onclick=()=>this.listeners.click&&this.listeners.click(); o.map.el.querySelector('[data-mock-map]').append(b); this.b=b; }
    addListener(n,f){ this.listeners[n]=f; } setPosition(p){ this.o.position=p; } setMap(m){ if(!m) this.b.remove(); } setIcon(i){ if(!i.url){ return; }  this.b.style.backgroundImage='url("'+i.url+'")'; this.b.dataset.selected=i.url.includes('%23164B70%22%20stroke')?'1':'0'; }
    setZIndex(){} setVisible(v){ this.visible=v; this.b.style.display=v?'':'none'; }
  }
  window.google = { maps: { Map, Marker, LatLngBounds, SymbolPath: { CIRCLE: 0 }, Size: class{constructor(w,h){}}, Point: class{constructor(x,y){}} } };
  const cb = new URL(document.currentScript.src).searchParams.get('callback');
  if (new URL(document.currentScript.src).searchParams.get('key') === 'BAD') { setTimeout(() => window.gm_authFailure && window.gm_authFailure(), 50); }
  setTimeout(() => window[cb](), 30);
})();
