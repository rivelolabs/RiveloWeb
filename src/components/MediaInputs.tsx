"use client";
import {useState} from 'react';
import {ImageIcon} from 'lucide-react';
const ok=(v:string)=>/^https:\/\/[^\s]+$/i.test(v.trim());
/** Optional logo + banner image links with a live preview. Only the URLs are saved. */
export default function MediaInputs({name,logoUrl,bannerUrl,onLogo,onBanner}:{name:string;logoUrl:string;bannerUrl:string;onLogo:(v:string)=>void;onBanner:(v:string)=>void}){
  const [logoBroken,setLogoBroken]=useState(false),[bannerBroken,setBannerBroken]=useState(false);
  const showLogo=ok(logoUrl)&&!logoBroken,showBanner=ok(bannerUrl)&&!bannerBroken;
  return <div className="rc-media">
    <div className="rc-media-head"><ImageIcon size={19}/><div><h2>Logo & banner <small>Optional</small></h2><p>Paste public https image links. Leave empty to use our default artwork.</p></div></div>
    <div className="rc-media-preview" aria-hidden="true">
      <div className="rc-media-banner">{showBanner?/* eslint-disable-next-line @next/next/no-img-element */<img src={bannerUrl} alt="" referrerPolicy="no-referrer" onError={()=>setBannerBroken(true)}/>:<span>Default banner</span>}</div>
      <div className="rc-media-logo">{showLogo?/* eslint-disable-next-line @next/next/no-img-element */<img src={logoUrl} alt="" referrerPolicy="no-referrer" onError={()=>setLogoBroken(true)}/>:<span>{(name||'?').slice(0,1).toUpperCase()}</span>}</div>
    </div>
    <div className="rd-form-row">
      <label>Logo image link<input type="url" inputMode="url" value={logoUrl} onChange={e=>{setLogoBroken(false);onLogo(e.target.value);}} maxLength={500} placeholder="https://your-site.com/logo.png" pattern="https://.+"/>{logoBroken&&<small className="rc-media-warn">This image didn’t load. Check the link.</small>}<small>Square, at least 256×256.</small></label>
      <label>Banner image link<input type="url" inputMode="url" value={bannerUrl} onChange={e=>{setBannerBroken(false);onBanner(e.target.value);}} maxLength={500} placeholder="https://your-site.com/banner.jpg" pattern="https://.+"/>{bannerBroken&&<small className="rc-media-warn">This image didn’t load. Check the link.</small>}<small>Wide, about 1600×700.</small></label>
    </div>
  </div>;
}
