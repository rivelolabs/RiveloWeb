"use client";
import {Moon,Sun} from 'lucide-react';
import {useTheme} from './ThemeProvider';
export default function ThemeToggle(){const {preference,setPreference}=useTheme();
  // Older visitors may still have "system" saved; highlight whichever theme it resolves to.
  const active=preference==='system'?(typeof document!=='undefined'&&document.documentElement.dataset.theme==='dark'?'dark':'light'):preference;
  return <div className="ra-theme-switch" role="group" aria-label="Color theme">{([{value:'light',label:'Light theme',Icon:Sun},{value:'dark',label:'Dark theme',Icon:Moon}] as const).map(({value,label,Icon})=><button type="button" key={value} aria-label={label} title={label} aria-pressed={active===value} onClick={()=>setPreference(value)}><Icon size={16}/></button>)}</div>;}
