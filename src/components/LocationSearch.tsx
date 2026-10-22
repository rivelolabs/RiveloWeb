"use client";
import {useEffect,useId,useRef,useState} from 'react';
import {LoaderCircle,LocateFixed,MapPin,Search} from 'lucide-react';
type Place={label:string;detail:string;city:string;lat:number;lng:number;kind:string};
/** City / address search with suggestions, plus "Use my current location". */
export default function LocationSearch({value,onChange,onPlace}:{value:string;onChange:(v:string)=>void;onPlace:(p:{lat:number;lng:number;city:string;zoom:number})=>void}){
  const [results,setResults]=useState<Place[]>([]),[open,setOpen]=useState(false),[active,setActive]=useState(-1),[loading,setLoading]=useState(false),[locating,setLocating]=useState(false),[message,setMessage]=useState('');
  const typed=useRef(false),box=useRef<HTMLDivElement>(null),list=useId();
  useEffect(()=>{
    if(!typed.current)return;const q=value.trim();if(q.length<2){setResults([]);return;}
    const ctrl=new AbortController();const t=setTimeout(async()=>{setLoading(true);
      try{const r=await fetch(`/api/geocode?q=${encodeURIComponent(q)}`,{signal:ctrl.signal});const d=await r.json();if(!r.ok)throw Error(d.error);setResults(d.places||[]);setOpen(true);setActive(-1);setMessage(d.places?.length?'':'No matches. Try a nearby city, or click the map.');}
      catch(e){if((e as Error).name!=='AbortError'){setResults([]);setMessage(e instanceof Error?e.message:'Search failed.');}}
      finally{setLoading(false);}},350);
    return()=>{clearTimeout(t);ctrl.abort();};
  },[value]);
  useEffect(()=>{const close=(e:MouseEvent)=>{if(!box.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close);},[]);
  function choose(p:Place){typed.current=false;onChange(p.city||p.label);onPlace({lat:p.lat,lng:p.lng,city:p.city,zoom:['city','town','state','county','district'].includes(p.kind)?11:15});setOpen(false);setResults([]);setMessage('');}
  function locate(){
    if(!('geolocation' in navigator)){setMessage('Your browser can’t share location. Search for your city instead.');return;}
    setLocating(true);setMessage('');
    navigator.geolocation.getCurrentPosition(async pos=>{
      // Rounded to ~100 m: precise enough for an office, not a doorstep.
      const lat=Number(pos.coords.latitude.toFixed(3)),lng=Number(pos.coords.longitude.toFixed(3));
      let city='';try{const r=await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);const d=await r.json();city=d.places?.[0]?.city||'';}catch{}
      typed.current=false;if(city)onChange(city);onPlace({lat,lng,city,zoom:14});setLocating(false);
      setMessage(city?`Pinned near ${city}. Drag the map or click to fine-tune.`:'Pinned to your location. Add your city above.');
    },err=>{setLocating(false);setMessage(err.code===err.PERMISSION_DENIED?'Location permission was blocked. Allow it in your browser, or search for your city.':'Couldn’t get your location. Search for your city instead.');},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  }
  return <div className="rc-locsearch" ref={box}>
    <label htmlFor={`${list}-input`}>City, area or office address</label>
    <div className="rc-locsearch-row">
      <div className="rc-locsearch-field">
        <Search size={17} aria-hidden="true"/>
        <input id={`${list}-input`} name="city" required maxLength={100} autoComplete="off" placeholder="Search a city or address — e.g. Lucknow, India" value={value}
          role="combobox" aria-expanded={open&&results.length>0} aria-controls={list} aria-autocomplete="list" aria-activedescendant={active>=0?`${list}-${active}`:undefined}
          onChange={e=>{typed.current=true;onChange(e.target.value);}} onFocus={()=>results.length&&setOpen(true)}
          onKeyDown={e=>{if(!open||!results.length)return;if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>(a+1)%results.length);}else if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>(a-1+results.length)%results.length);}else if(e.key==='Enter'&&active>=0){e.preventDefault();choose(results[active]);}else if(e.key==='Escape')setOpen(false);}}/>
        {loading&&<LoaderCircle className="rd-spin" size={16} aria-label="Searching"/>}
      </div>
      <button type="button" className="rd-button rd-outline rc-locate" onClick={locate} disabled={locating}>{locating?<LoaderCircle className="rd-spin" size={16}/>:<LocateFixed size={16}/>} Use my location</button>
    </div>
    {open&&results.length>0&&<ul className="rc-locsearch-list" id={list} role="listbox">{results.map((p,i)=><li key={`${p.lat},${p.lng},${i}`} id={`${list}-${i}`} role="option" aria-selected={i===active} className={i===active?'rc-active':''} onMouseDown={e=>{e.preventDefault();choose(p);}} onMouseEnter={()=>setActive(i)}><MapPin size={15}/><span><b>{p.label}</b>{p.detail&&<small>{p.detail}</small>}</span></li>)}</ul>}
    {message&&<p className="rd-fine-print rc-locsearch-msg" role="status">{message}</p>}
  </div>;
}
