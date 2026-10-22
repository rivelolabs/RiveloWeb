export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';
export const themeStorageKey = 'rivelo-theme-preference';
export function normalizeThemePreference(value:unknown):ThemePreference {
  // New visitors start in light mode; dark and system are opt-in from the theme switch.
  return value==='dark'||value==='system'?value:'light';
}
export function resolveTheme(prefersDark:boolean, preference:ThemePreference='system'):Theme {
  return preference==='system'?(prefersDark?'dark':'light'):preference;
}
// Read the preference before hydration; unavailable storage falls back to the device.
export const themeBootstrap=`(function(){var p='light';try{var v=localStorage.getItem('${themeStorageKey}');if(v==='dark'||v==='system')p=v}catch(e){}var d=p==='dark'||(p==='system'&&typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';if(r.style)r.style.colorScheme=d?'dark':'light'})()`;
