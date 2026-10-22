import {ImageResponse} from 'next/og';
import {WORLD_PNG,WORLD_W,WORLD_H} from '@/lib/og-world';

// Default share image for every page that doesn't define its own (home, map, community, launches…).
export const alt='Rivelo Labs — discover new apps and websites from independent builders';
export const size={width:1200,height:630};
export const contentType='image/png';

const CORAL='#c43e19',INK='#202428',MUTED='#67707c',BG='#f6f6f5';
const PINS=[[0.27,0.33],[0.53,0.27],[0.67,0.42],[0.94,0.8],[0.36,0.66]];

export default function Image(){
  const offset=(1200-WORLD_W)/2;
  return new ImageResponse(
    <div style={{width:1200,height:630,display:'flex',position:'relative',background:BG,fontFamily:'sans-serif',color:INK}}>
      <img src={WORLD_PNG} width={WORLD_W} height={WORLD_H} style={{position:'absolute',left:offset,top:0,width:WORLD_W,height:WORLD_H,opacity:0.8}} alt=""/>
      {PINS.map(([x,y],i)=><div key={i} style={{position:'absolute',left:x*1200-11,top:y*630-11,width:22,height:22,borderRadius:22,background:CORAL,border:'4px solid white',boxShadow:'0 0 0 10px rgba(196,62,25,0.16)',display:'flex'}}/>)}
      <div style={{position:'absolute',left:64,top:56,display:'flex',alignItems:'center',gap:12,fontSize:36,letterSpacing:-1}}>
        <div style={{width:15,height:15,borderRadius:15,background:CORAL,display:'flex'}}/>rivelolabs.
      </div>
      <div style={{position:'absolute',left:64,bottom:64,width:700,display:'flex',flexDirection:'column',padding:'36px 40px',borderRadius:30,background:'rgba(255,255,255,0.95)',border:'1px solid #e5e5e3',boxShadow:'0 20px 50px rgba(0,0,0,0.10)'}}>
        <div style={{fontSize:54,lineHeight:1.08,letterSpacing:-2,display:'flex',flexDirection:'column'}}>
          <span>Small teams.</span><span style={{color:CORAL}}>Wide horizons.</span>
        </div>
        <div style={{fontSize:26,color:MUTED,marginTop:18,display:'flex'}}>Discover new apps and websites from independent builders — and put yours on the map.</div>
      </div>
    </div>,
    {...size}
  );
}
