import { ImageResponse } from "next/og";
export const alt = "Rivelo Labs — Discover apps, websites, and your next favorite thing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{width:"100%",height:"100%",background:"#0b0b0b",display:"flex",flexDirection:"column",padding:"64px 76px",color:"#f5f5f5",position:"relative"}}>
    <div style={{display:"flex",fontSize:32,letterSpacing:-1}}>rivelo<span style={{color:"#67adff"}}>labs.</span></div>
    <div style={{display:"flex",flexDirection:"column",marginTop:78,fontSize:83,lineHeight:1.05,letterSpacing:-4}}><span>Good products.</span><span style={{color:"#accfff"}}>Great possibilities.</span></div>
    <div style={{display:"flex",fontSize:23,color:"#bdbdbd",marginTop:33}}>Discover independent apps and websites.</div>
    <div style={{position:"absolute",right:65,top:67,width:68,height:68,borderRadius:40,background:"#67adff",display:"flex",justifyContent:"center",alignItems:"center",fontSize:40,color:"#0b0b0b"}}>↗</div>
    <div style={{display:"flex",fontSize:17,color:"#a3a3a3",marginTop:"auto"}}>rivelolabs.com</div>
  </div>,size);
}
