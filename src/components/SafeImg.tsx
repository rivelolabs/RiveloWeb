"use client";
import {useEffect,useRef,useState} from 'react';
/** Product picture that falls back to a letter tile when the link is broken (no "?" box on iPhone). */
export default function SafeImg({src,letter,size=48,radius=12}:{src:string|null;letter:string;size?:number;radius?:number}){
  const [broken,setBroken]=useState(false);const ref=useRef<HTMLImageElement>(null);
  // An image can fail before React hydrates and attaches onError, so check once after mount too.
  useEffect(()=>{const img=ref.current;if(img&&img.complete&&img.naturalWidth===0)setBroken(true);},[src]);
  const box={width:size,height:size,borderRadius:radius};
  if(!src||broken)return <span className="rd-launch-ph" style={box}>{letter.slice(0,1).toUpperCase()}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" width={size} height={size} loading="lazy" referrerPolicy="no-referrer" onError={()=>setBroken(true)} style={{...box,objectFit:'cover',background:'var(--rd-soft)'}}/>;
}
