/** Five fixed yacht spots in open ocean on the world map. */
export const YACHTS=[
  {index:1,sea:'North Atlantic',lat:31,lng:-46},
  {index:2,sea:'Indian Ocean',lat:-14,lng:80},
  {index:3,sea:'North Pacific',lat:34,lng:-165},
  {index:4,sea:'South Atlantic',lat:-27,lng:-24},
  {index:5,sea:'South Pacific',lat:-36,lng:-118},
] as const;
/** Yacht price shown on the map; must match the weekly yacht product in your payment provider. */
export const YACHT_PRICE='$20';
export const YACHT_PER='a week';
export type YachtSpot={index:number;sea:string;lat:number;lng:number;product?:{id:string;name:string;url:string;logo?:string|null}};
