/**
 * "Use my location" that works everywhere: tries the browser's GPS/Wi-Fi location first, and if that is
 * blocked, unavailable or slow (common on Macs with Location Services off, and in X/Instagram in-app
 * browsers), falls back to an approximate city from the visitor's network (Vercel IP geolocation).
 */
export type Found={lat:number;lng:number;approx:boolean;city?:string;denied?:boolean};
function browserPosition(timeout:number){
  return new Promise<GeolocationPosition>((resolve,reject)=>{
    if(typeof navigator==='undefined'||!('geolocation' in navigator)||!window.isSecureContext){reject({code:2});return;}
    navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout,maximumAge:600000});
  });
}
async function networkPosition():Promise<Found|null>{
  try{const r=await fetch('/api/geocode?ip=1',{cache:'no-store'});if(!r.ok)return null;const d=await r.json();
    return d.place&&Number.isFinite(d.place.lat)?{lat:d.place.lat,lng:d.place.lng,city:d.place.city||undefined,approx:true}:null;}catch{return null;}
}
export async function findMe(timeout=9000):Promise<Found>{
  try{const p=await browserPosition(timeout);return {lat:p.coords.latitude,lng:p.coords.longitude,approx:false};}
  catch(e){
    const denied=(e as GeolocationPositionError)?.code===1;
    const net=await networkPosition();
    if(net)return {...net,denied};
    throw Error(denied?'Location is blocked for this site. Allow it in your browser settings, or search for your city.':'Couldn’t find your location. Search for your city instead.');
  }
}
