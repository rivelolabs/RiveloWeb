/** Five fixed yacht spots in open ocean on the world map. */
export const YACHTS=[
  {index:1,sea:'North Atlantic',lat:33.5,lng:-42},
  {index:2,sea:'Arabian Sea',lat:13,lng:63.5},
  {index:3,sea:'North Pacific',lat:24,lng:-152},
  {index:4,sea:'South Atlantic',lat:-24,lng:-14},
  {index:5,sea:'Coral Sea',lat:-17,lng:156},
] as const;
/** Display price for the yacht plan; must match the Razorpay plan (RAZORPAY_PLAN_YACHT). */
export const YACHT_PRICE='$15';
export type YachtSpot={index:number;sea:string;lat:number;lng:number;product?:{id:string;name:string;url:string;logo?:string|null}};
