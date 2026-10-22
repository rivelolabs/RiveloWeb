"use client";
import {useEffect,useRef,useState} from 'react';
import 'leaflet/dist/leaflet.css';
import type {YachtSpot} from '@/lib/yachts';
import {YACHT_PRICE} from '@/lib/yachts';

const YACHT_SVG=`<svg viewBox="0 0 120 56" aria-hidden="true"><defs><linearGradient id="ryHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe5ee"/></linearGradient><linearGradient id="ryGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8862b"/><stop offset=".5" stop-color="#f3d27a"/><stop offset="1" stop-color="#b8862b"/></linearGradient><linearGradient id="ryGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f1b30"/><stop offset=".6" stop-color="#26406a"/><stop offset="1" stop-color="#0f1b30"/></linearGradient></defs><ellipse cx="62" cy="47" rx="54" ry="4.5" fill="#0b2a4a" opacity=".28"/><path d="M2 44c10-3 18-3 26 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8" stroke-linecap="round"/><path d="M4 40h96l16-10H20C11 30 7 34 4 40z" fill="url(#ryHull)" stroke="#c9d2de" stroke-width=".6"/><path d="M5.5 40h94.5l4-2.6V40l-3.6 3.2H10z" fill="#13233f"/><path d="M13 33.5h97" stroke="url(#ryGold)" stroke-width="1.4" stroke-linecap="round"/><circle cx="30" cy="36.6" r=".9" fill="#13233f"/><circle cx="36" cy="36.6" r=".9" fill="#13233f"/><circle cx="42" cy="36.6" r=".9" fill="#13233f"/><path d="M22 30v-7.5h66l11 7.5z" fill="#f6f8fb" stroke="#cfd7e2" stroke-width=".5"/><rect x="26" y="24.6" width="60" height="3.2" rx="1.6" fill="url(#ryGlass)"/><path d="M34 22.5v-6.5h40l9 6.5z" fill="#fff" stroke="#cfd7e2" stroke-width=".5"/><rect x="38" y="17.8" width="36" height="2.6" rx="1.3" fill="url(#ryGlass)"/><path d="M44 16v-4.5h22l5 4.5z" fill="#eef2f7" stroke="#cfd7e2" stroke-width=".5"/><path d="M55 11.5V4" stroke="#8a96a8" stroke-width="1.1" stroke-linecap="round"/><path d="M50.5 6.5h9" stroke="#8a96a8" stroke-width="1.1" stroke-linecap="round"/><circle cx="55" cy="3.6" r="1.4" fill="url(#ryGold)"/><path d="M88 30l8-3" stroke="url(#ryGold)" stroke-width="1" stroke-linecap="round"/></svg>`;
function yachtPopup(y:YachtSpot){
  const box=document.createElement('div');box.className='ra-yacht-pop';
  const tag=document.createElement('span');tag.className='ra-yacht-tag';tag.textContent=y.product?`Sponsored · Premium yacht ${y.index}`:`Premium yacht ${y.index} · ${y.sea}`;
  const h=document.createElement('strong');const p=document.createElement('p');const a=document.createElement('a');a.className='ra-yacht-cta';
  if(y.product){h.textContent=y.product.name;p.textContent=`Sailing the ${y.sea}.`;a.href=y.product.url;a.target='_blank';a.rel='sponsored noopener noreferrer';a.textContent=`Visit ${y.product.name} ↗`;}
  else{h.textContent='This premium yacht is available';p.textContent=`Put your product on it. Every map visitor sees it. ${YACHT_PRICE}/month, cancel anytime.`;a.href=`/premium?yacht=${y.index}#rc-plans-title`;a.textContent='Book this yacht →';}
  box.append(tag,h,p,a);return box;
}
export type PublicPin={id:string;productId:string;name:string;city:string;lat:number;lng:number;genre:string;pending?:boolean;href?:string;avatar?:string|null};
const emptyPins:PublicPin[]=[];
export default function BusinessMap({pins=emptyPins,selected,onSelect,pick,onPick,world=false,resetKey=0,focus,yachts}:{yachts?:YachtSpot[];focus?:{lat:number;lng:number;zoom:number;key:number};pins?:PublicPin[];selected?:string;onSelect?:(id:string)=>void;pick?:{lat:number;lng:number};onPick?:(point:{lat:number;lng:number})=>void;world?:boolean;resetKey?:number}){
  const [ready,setReady]=useState(false);
  const container=useRef<HTMLDivElement>(null),map=useRef<import('leaflet').Map|null>(null),yachtLayer=useRef<import('leaflet').LayerGroup|null>(null),layer=useRef<import('leaflet').LayerGroup|null>(null);
  const callbacks=useRef({onSelect,onPick});
  useEffect(()=>{callbacks.current={onSelect,onPick};},[onSelect,onPick]);
  useEffect(()=>{
    let disposed=false,instance:import('leaflet').Map|undefined,observer:ResizeObserver|undefined;
    import('leaflet').then(L=>{
      if(disposed||!container.current)return;
      instance=L.map(container.current,{scrollWheelZoom:false,worldCopyJump:true,minZoom:2,maxZoom:18,zoomControl:false,maxBounds:L.latLngBounds([-85,-1e5],[85,1e5]),maxBoundsViscosity:1,bounceAtZoomLimits:false}).setView(world?[24,28]:[21,77],world?2:4);
      map.current=instance;
      L.control.zoom({position:'bottomright'}).addTo(instance);
      L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL||'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:process.env.NEXT_PUBLIC_MAP_ATTRIBUTION||'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
      layer.current=L.layerGroup().addTo(instance);
      yachtLayer.current=L.layerGroup().addTo(instance);
      instance.on('click',event=>callbacks.current.onPick?.({lat:Number(event.latlng.lat.toFixed(5)),lng:Number((((event.latlng.lng+180)%360+360)%360-180).toFixed(5))}));
      // Never let the world map be dragged or zoomed out past the poles (no empty grey bands).
      const fit=()=>{if(!instance||!container.current)return;const h=container.current.clientHeight||1;const z=Math.max(2,Math.ceil(Math.log2(h/256)));instance.setMinZoom(z);if(instance.getZoom()<z)instance.setZoom(z,{animate:false});instance.panInsideBounds(L.latLngBounds([-85,-1e5],[85,1e5]),{animate:false});};
      fit();
      observer=new ResizeObserver(()=>{instance?.invalidateSize();fit();});observer.observe(container.current);
      setReady(true);
    });
    return()=>{disposed=true;observer?.disconnect();instance?.remove();map.current=null;layer.current=null;};
  },[world]);
  useEffect(()=>{
    if(!ready)return;
    let disposed=false;
    let draw:()=>void;
    import('leaflet').then(L=>{
      if(disposed||!map.current||!layer.current)return;
      const instance=map.current;
      draw=()=>{
        if(!layer.current)return;
        layer.current.clearLayers();
        const cells=new Map<string,PublicPin[]>();
        for(const pin of pins){const pixel=instance.project([pin.lat,pin.lng]);const key=instance.getZoom()<10&&pin.id!==selected&&!pin.pending?`${Math.floor(pixel.x/72)}:${Math.floor(pixel.y/72)}`:pin.id;cells.set(key,[...(cells.get(key)||[]),pin]);}
        for(const group of cells.values()){
          const pin=group[0],cluster=group.length>1;
          const point=cluster?L.latLng(group.reduce((sum,item)=>sum+item.lat,0)/group.length,group.reduce((sum,item)=>sum+item.lng,0)/group.length):L.latLng(pin.lat,pin.lng);
          const face=document.createElement('span');face.className=`ra-pin-face${cluster?' ra-pin-cluster':''}${pin.id===selected?' ra-pin-selected':''}${!cluster&&pin.pending?' ra-pin-pending':''}`;
          if(!cluster&&pin.avatar){const img=document.createElement('img');img.src=pin.avatar;img.alt='';img.referrerPolicy='no-referrer';img.className='ra-pin-photo';img.onerror=()=>{img.remove();face.prepend(document.createTextNode(pin.name.slice(0,2).toUpperCase()));face.classList.remove('ra-pin-has-photo');};face.append(img);face.classList.add('ra-pin-has-photo');}else face.textContent=cluster?String(group.length):pin.name.slice(0,2).toUpperCase();
          const dot=document.createElement('i');face.append(dot);
          const marker=L.marker(point,{icon:L.divIcon({className:'ra-product-pin',html:face,iconSize:[48,48],iconAnchor:[24,46]}),title:cluster?`${group.length} registered products`:pin.name,keyboard:true,zIndexOffset:pin.id===selected?1000:0}).addTo(layer.current);
          const label=document.createElement('div'),strong=document.createElement('strong');strong.textContent=cluster?`${group.length} products nearby`:pin.name;label.append(strong,document.createElement('br'),document.createTextNode(cluster?'Zoom in to explore':pin.pending?`${pin.city} · Pending review (only you see this)`:pin.city));marker.bindTooltip(label,{direction:'top',offset:[0,-40]});
          marker.on('click',()=>{if(cluster)instance.fitBounds(L.latLngBounds(group.map(item=>[item.lat,item.lng] as [number,number])),{padding:[90,90],maxZoom:Math.max(10,instance.getZoom()+2)});else callbacks.current.onSelect?.(pin.id);});
        }
        if(pick&&Number.isFinite(pick.lat)&&Number.isFinite(pick.lng))L.circleMarker([pick.lat,pick.lng],{radius:11,color:'#fff',weight:3,fillColor:'#e65023',fillOpacity:1}).addTo(layer.current);
      };
      draw();instance.on('zoomend moveend',draw);
      const target=pins.find(pin=>pin.id===selected);
      if(target)instance.flyTo([target.lat,target.lng],Math.max(instance.getZoom(),6),{duration:.7,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
      else if(pick&&!instance.getBounds().contains([pick.lat,pick.lng]))instance.panTo([pick.lat,pick.lng],{animate:false});
    });
    return()=>{disposed=true;if(draw)map.current?.off('zoomend moveend',draw);};
  },[pins,selected,pick,ready]);
  useEffect(()=>{if(ready&&resetKey)map.current?.setView(world?[24,28]:[21,77],world?2:4,{animate:false});},[resetKey,ready,world]);
  useEffect(()=>{if(ready&&focus&&map.current)map.current.flyTo([focus.lat,focus.lng],focus.zoom,{duration:.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});},[focus,ready]);
  useEffect(()=>{
    if(!ready||!yachts?.length)return;let disposed=false;
    import('leaflet').then(L=>{
      if(disposed||!yachtLayer.current)return;yachtLayer.current.clearLayers();
      for(const y of yachts){
        const face=document.createElement('span');face.className=`ra-yacht${y.product?' ra-yacht-booked':''}`;face.innerHTML=YACHT_SVG;
        if(y.product){const badge=document.createElement('b');if(y.product.logo){const img=document.createElement('img');img.src=y.product.logo;img.alt='';img.referrerPolicy='no-referrer';badge.append(img);}else badge.textContent=y.product.name.slice(0,2).toUpperCase();face.append(badge);}
        else{const free=document.createElement('i');free.innerHTML='<svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M3 18h18l-1.5-9-4.5 4-3-7-3 7-4.5-4z" fill="currentColor"/></svg> Premium · Book';face.append(free);}
        const glow=document.createElement('s');face.prepend(glow);
        L.marker([y.lat,y.lng],{icon:L.divIcon({className:'ra-yacht-pin',html:face,iconSize:[104,58],iconAnchor:[52,48]}),title:y.product?`${y.product.name} (sponsored)`:`Yacht ${y.index}: available to book`,keyboard:true,zIndexOffset:500}).addTo(yachtLayer.current).bindPopup(yachtPopup(y),{offset:[0,-36],className:'ra-yacht-popup',autoPanPaddingTopLeft:[window.innerWidth>900?400:20,90],autoPanPaddingBottomRight:[30,90]});
      }
    });
    return()=>{disposed=true;};
  },[yachts,ready]);
  return <div ref={container} className={`rc-map${world?' ra-world-map':''}`} aria-label={onPick?'Choose a public business location, or use the coordinate fields below.':'Interactive map of registered product locations'}/>;
}
