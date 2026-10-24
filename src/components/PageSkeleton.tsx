import CommunityShell from './CommunityShell';
import '@/app/directory.css';
/** Instant placeholder shown while a page loads, so a tap on the top nav responds straight away. */
export default function PageSkeleton({active,rows=6}:{active:string;rows?:number}){
  return <CommunityShell active={active}><main className="rc-content rl-skel" aria-busy="true" aria-label="Loading">
    <span className="rl-skel-line" style={{width:120,height:12}}/>
    <span className="rl-skel-line" style={{width:'min(420px,80%)',height:34,marginTop:18}}/>
    <span className="rl-skel-line" style={{width:'min(560px,95%)',height:14,marginTop:16}}/>
    <span className="rl-skel-line" style={{width:'min(480px,85%)',height:14,marginTop:10}}/>
    <div className="rl-skel-list">{Array.from({length:rows},(_,i)=><div key={i} className="rl-skel-row"><span className="rl-skel-line" style={{width:48,height:48,borderRadius:12,flexShrink:0}}/><div style={{flex:1}}><span className="rl-skel-line" style={{width:'45%',height:15}}/><span className="rl-skel-line" style={{width:'80%',height:12,marginTop:9}}/></div></div>)}</div>
  </main></CommunityShell>;
}
