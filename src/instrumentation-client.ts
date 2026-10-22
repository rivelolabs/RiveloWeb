// PostHog web analytics only: pageviews, page leaves, referrers, UTM and web vitals.
// No session replay, no autocapture, no heatmaps, no surveys, no feature flags.
// Loaded after the page is idle so it never slows first paint or hurts SEO / Lighthouse.
const key=process.env.NEXT_PUBLIC_POSTHOG_KEY;

function start(){
  import('posthog-js').then(({default:posthog})=>{
    posthog.init(key!,{
      api_host:'/ingest',
      ui_host:'https://us.posthog.com',
      defaults:'2025-05-24',
      capture_pageview:'history_change',
      capture_pageleave:true,
      person_profiles:'identified_only',
      autocapture:false,
      disable_session_recording:true,
      enable_recording_console_log:false,
      enable_heatmaps:false,
      capture_dead_clicks:false,
      rageclick:false,
      disable_surveys:true,
      advanced_disable_feature_flags:true,
      disable_external_dependency_loading:true,
      capture_performance:{web_vitals:true,network_timing:false},
      respect_dnt:true,
    });
  }).catch(()=>{});
}

if(key&&typeof window!=='undefined'&&!/bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent)){
  const idle=(window as Window&{requestIdleCallback?:(cb:()=>void,o?:{timeout:number})=>number}).requestIdleCallback;
  if(document.readyState==='complete')(idle?idle(start,{timeout:3000}):setTimeout(start,1500));
  else window.addEventListener('load',()=>(idle?idle(start,{timeout:3000}):setTimeout(start,1500)),{once:true});
}
