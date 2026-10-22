"use client";
import {Monitor,Moon,Sun} from 'lucide-react';
import {useTheme} from './ThemeProvider';
export default function ThemeToggle(){const {preference,setPreference}=useTheme();return <div className="ra-theme-switch" role="group" aria-label="Color theme">{([{value:'light',label:'Light theme',Icon:Sun},{value:'dark',label:'Dark theme',Icon:Moon},{value:'system',label:'Use system theme',Icon:Monitor}] as const).map(({value,label,Icon})=><button type="button" key={value} aria-label={label} title={label} aria-pressed={preference===value} onClick={()=>setPreference(value)}><Icon size={16}/></button>)}</div>;}
