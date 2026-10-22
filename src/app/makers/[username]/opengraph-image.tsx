import {ImageResponse} from 'next/og';
import {dbEnabled} from '@/lib/db';
import {makerByUsername,type Maker} from '@/lib/db/makers';
import {WORLD_PNG,WORLD_W,WORLD_H,WORLD_SCALE,WORLD_TOP} from '@/lib/og-world';

export const runtime='nodejs';
export const alt='Maker on the Rivelo map';
export const size={width:1200,height:630};
export const contentType='image/png';

const CORAL='#c43e19',INK='#202428',MUTED='#67707c',BG='#f6f6f5';
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};

async function avatarData(url:string|null){
  if(!url)return null;
  try{
    const big=url.replace('_normal.','_400x400.');
    const r=await fetch(big,{signal:AbortSignal.timeout(2500)});
    if(!r.ok)return null;const type=r.headers.get('content-type')||'image/jpeg';
    if(!/^image\/(png|jpe?g|gif|webp)/.test(type))return null;
    return `data:${type};base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`;
  }catch{return null;}
}

export default async function Image({params}:{params:Promise<{username:string}>}){
  const {username}=await params;
  let m:Maker|null=null;
  if(dbEnabled()){const x=await makerByUsername(username).catch(()=>null);if(x&&(x.status==='published'||x.status==='claimed'))m=x;}
  const avatar=await avatarData(m?.avatar??null);
  const hasPin=m?.lat!=null&&m?.lng!=null;
  // Slide the world strip so the maker's pin sits at ~68% of the width.
  const px=hasPin?(m!.lng!+180)*WORLD_SCALE:WORLD_W/2,py=hasPin?(WORLD_TOP-m!.lat!)*WORLD_SCALE:WORLD_H/2;
  const offset=Math.max(1200-WORLD_W,Math.min(0,816-px));
  const pinX=px+offset,pinY=Math.max(60,Math.min(560,py));
  const name=m?.name||`@${username}`,product=m?.productName||(m?.productUrl?host(m.productUrl):null);
  const initial=(m?.name||username).slice(0,1).toUpperCase();

  const face=(d:number)=>avatar
    ?<img src={avatar} width={d} height={d} style={{width:d,height:d,borderRadius:d,objectFit:'cover'}} alt=""/>
    :<div style={{width:d,height:d,borderRadius:d,background:CORAL,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:d*0.45,fontWeight:700}}>{initial}</div>;

  return new ImageResponse(
    <div style={{width:1200,height:630,display:'flex',position:'relative',background:BG,fontFamily:'sans-serif',color:INK}}>
      <img src={WORLD_PNG} width={WORLD_W} height={WORLD_H} style={{position:'absolute',left:offset,top:0,width:WORLD_W,height:WORLD_H}} alt=""/>
      {hasPin&&<div style={{position:'absolute',left:pinX-90,top:pinY-90,width:180,height:180,borderRadius:180,background:'rgba(196,62,25,0.10)',display:'flex'}}/>}
      {hasPin&&<div style={{position:'absolute',left:pinX-50,top:pinY-50,width:100,height:100,borderRadius:100,background:'rgba(196,62,25,0.18)',display:'flex'}}/>}
      {hasPin&&<div style={{position:'absolute',left:pinX-38,top:pinY-96,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{display:'flex',padding:5,borderRadius:80,background:'white',border:`4px solid ${CORAL}`,boxShadow:'0 10px 24px rgba(0,0,0,0.18)'}}>{face(62)}</div>
        <div style={{width:18,height:18,background:CORAL,transform:'rotate(45deg)',marginTop:-12,display:'flex'}}/>
        <div style={{width:14,height:14,borderRadius:14,background:CORAL,marginTop:6,border:'3px solid white',display:'flex'}}/>
      </div>}
      <div style={{position:'absolute',left:56,top:48,display:'flex',alignItems:'center',gap:12,fontSize:34,fontWeight:700,letterSpacing:-1}}>
        <div style={{width:14,height:14,borderRadius:14,background:CORAL,display:'flex'}}/>rivelolabs.
      </div>
      <div style={{position:'absolute',left:56,bottom:56,width:560,display:'flex',flexDirection:'column',padding:'30px 34px',borderRadius:28,background:'rgba(255,255,255,0.94)',border:'1px solid #e5e5e3',boxShadow:'0 20px 50px rgba(0,0,0,0.10)'}}>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          {face(84)}
          <div style={{display:'flex',flexDirection:'column',minWidth:0}}>
            <div style={{fontSize:42,fontWeight:700,letterSpacing:-1,lineHeight:1.1,display:'flex'}}>{name.length>22?name.slice(0,21)+'…':name}</div>
            <div style={{fontSize:24,color:MUTED,marginTop:6,display:'flex'}}>{m?`@${m.username}${m.city?` · ${m.city.split(',')[0]}`:''}`:'Find makers on the Rivelo map'}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:20,borderTop:'1px solid #e5e5e3',fontSize:24}}>
          <div style={{display:'flex',color:INK}}>{product?`Building ${product.length>28?product.slice(0,27)+'…':product}`:'Maker on Rivelo'}</div>
          <div style={{display:'flex',color:'white',background:CORAL,padding:'8px 16px',borderRadius:30,fontSize:20,fontWeight:600}}>{hasPin?'On the map':'Rivelo maker'}</div>
        </div>
      </div>
    </div>,
    {...size,headers:{'cache-control':'public, max-age=3600, s-maxage=86400'}}
  );
}
