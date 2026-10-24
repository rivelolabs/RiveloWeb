/** How a product / builder is funded. Optional everywhere; shown as a chip and usable as a filter. */
export const FUNDING=[
  {id:'side-project',label:'Side project'},
  {id:'bootstrapped',label:'Bootstrapped'},
  {id:'pre-seed',label:'Pre-seed'},
  {id:'seed',label:'Seed funded'},
  {id:'series-a-plus',label:'Series A+'},
] as const;
export type Funding=typeof FUNDING[number]['id'];
export const isFunding=(v:unknown):v is Funding=>FUNDING.some(f=>f.id===v);
export const fundingLabel=(v?:string|null)=>FUNDING.find(f=>f.id===v)?.label||'';
