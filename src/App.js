import React, { useState, useEffect, useRef } from "react";
import { supabase } from './supabaseClient';
// ── LUCIDE-STYLE SVG ICONS ─────────────────────────────────────────────────────
const Icon = ({ d, size=20, color="currentColor", strokeWidth=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Icons = {
  mask: ({size=24,color="currentColor"})=>(
    <svg width={size} height={size} viewBox="0 0 130 105" fill={color}>
      <path d="M65 5 C35 5 10 22 10 46 C10 63 22 77 40 83 C38 91 30 99 20 103 C33 100 48 93 57 85 C59 86 62 86 65 86 C95 86 120 68 120 46 C120 22 95 5 65 5 Z"/>
      <ellipse cx="44" cy="44" rx="10" ry="11" fill="white"/><ellipse cx="86" cy="44" rx="10" ry="11" fill="white"/>
      <path d="M38 64 Q65 82 92 64" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  inbox:    ({s=20,c="currentColor"})=><Icon size={s} color={c} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>,
  stats:    ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
  wallet:   ({s=20,c="currentColor"})=><Icon size={s} color={c} d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-10 9H3V9h8v4zm10 0h-8V9h8v4z"/>,
  games:    ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M6 12h4","M8 10v4","M15 11h.01","M18 11h.01","M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"]}/>,
  settings: ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]}/>,
  back:     ({s=20,c="currentColor"})=><Icon size={s} color={c} d="M19 12H5M12 5l-7 7 7 7"/>,
  copy:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z","M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"]}/>,
  share:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8","M16 6l-4-4-4 4","M12 2v13"]}/>,
  react:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  reply:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-5 9l-4-4 4-4m-4 4h12"/>,
  flag:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z","M4 22v-7"]}/>,
  lock:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  unlock:   ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 9.9-1"]}/>,
  check:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M20 6L9 17l-5-5"/>,
  eye:      ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]}/>,
  mail:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]}/>,
  phone:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
  bank:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M3 22h18","M6 18v-7","M10 18v-7","M14 18v-7","M18 18v-7","M12 2L2 7h20L12 2z"]}/>,
  card:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z","M1 10h22"]}/>,
  withdraw: ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 5v14","M19 12l-7 7-7-7"]}/>,
  deposit:  ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 19V5","M5 12l7-7 7 7"]}/>,
  receipt:  ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  user:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]}/>,
  shield:   ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  bell:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]}/>,
  help:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3","M12 17h.01","M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"]}/>,
  chat:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  doc:      ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  sun:      ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42"]}/>,
  palette:  ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z"/>,
  photo:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z","M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]}/>,
  logout:   ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"]}/>,
  trophy:   ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M6 9H3.5a2.5 2.5 0 0 1 0-5H6","M18 9h2.5a2.5 2.5 0 0 0 0-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","M18 2H6v7a6 6 0 0 0 12 0V2z"]}/>,
  timer:    ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"]}/>,
  warning:  ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]}/>,
  globe:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]}/>,
  search:   ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M11 17.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5z","M16 16l4.5 4.5"]}/>,
  close:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M18 6L6 18M6 6l12 12"/>,
  plus:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M12 5v14M5 12h14"/>,
  chevron:  ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M9 18l6-6-6-6"/>,
  info:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 16v-4","M12 8h.01"]}/>,
  star:     ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  money:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]}/>,
  dice:     ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"]}/>,
  heart:    ({s=18,c="currentColor"})=><Icon size={s} color={c} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  heartOff: ({s=18,c="currentColor"})=><Icon size={s} color={c} d={["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"]}/>,
  medal:    ({s=20,c="currentColor"})=><Icon size={s} color={c} d={["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M8.21 13.89 7 23l5-3 5 3-1.21-9.12"]}/>,
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Sans',sans-serif;}
    body{overflow-x:hidden;background:#fafaf8;}
    .syne{font-family:'Syne',sans-serif!important;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
    @keyframes float{0%,100%{transform:translateY(0) rotate(-4deg);}50%{transform:translateY(-18px) rotate(4deg);}}
    @keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
    @keyframes popIn{from{transform:scale(0.85);opacity:0;}to{transform:scale(1);opacity:1;}}
    .fadeUp{animation:fadeUp 0.55s ease both;}
    .fadeUp1{animation:fadeUp 0.55s 0.1s ease both;}
    .fadeUp2{animation:fadeUp 0.55s 0.2s ease both;}
    .fadeUp3{animation:fadeUp 0.55s 0.35s ease both;}
    .slideUp{animation:slideUp 0.4s ease both;}
    .popIn{animation:popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;}
    .float1{animation:float 7s ease-in-out infinite;}
    .float2{animation:float 9s 2s ease-in-out infinite;}
    .btn-p:hover{background:#ff5c3a!important;transform:translateY(-2px)!important;box-shadow:0 12px 30px rgba(255,92,58,0.3)!important;}
    .btn-o:hover{background:#f0efec!important;}
    .msg-row:hover{background:#f7f6f3!important;}
    .hint-hover:hover{border-color:rgba(255,255,255,0.4)!important;transform:translateY(-3px)!important;}
    .tab-btn:hover{background:rgba(0,0,0,0.06)!important;}
    .game-card:hover{transform:translateY(-4px)!important;box-shadow:0 16px 40px rgba(0,0,0,0.1)!important;}
    .srow:hover{background:#f7f6f3!important;}
    .topic-btn:hover{border-color:#0e0e0e!important;}
    input:focus,textarea:focus,select:focus{outline:none!important;border-color:#0e0e0e!important;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px;}
    @media(max-width:768px){nav{padding:14px 16px!important;}}
    @media(max-width:480px){h1{font-size:clamp(2rem,8vw,3rem)!important;}}
  `}</style>
);
// ── SHARED UI ──────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, style={}, disabled, outline }) => (
  <button onClick={onClick} disabled={disabled} className={outline?"btn-o":"btn-p"} style={{
    padding:"13px 28px",borderRadius:50,border:outline?"1.5px solid rgba(0,0,0,0.2)":"none",
    background:outline?"transparent":disabled?"#ccc":"#0e0e0e",
    color:outline?"#0e0e0e":"white",fontSize:"0.92rem",fontWeight:600,
    cursor:disabled?"not-allowed":"pointer",transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:8,...style
  }}>{children}</button>
);
const Inp = ({ placeholder, type="text", value, onChange, style={} }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
    width:"100%",padding:"14px 18px",borderRadius:14,
    border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",
    fontSize:"0.95rem",transition:"border-color 0.2s",...style
  }}/>
);
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,transition:"background 0.15s"}} className="tab-btn">
    <Icons.back s={20} c="#555"/>
  </button>
);
const Modal = ({ children, onClose }) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
    <div className="slideUp" style={{background:"white",borderRadius:"24px 24px 0 0",padding:"32px 28px",width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,borderRadius:2,background:"#e0e0e0",margin:"0 auto 24px"}}/>
      {children}
    </div>
  </div>
);
const Tog = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{width:44,height:24,borderRadius:50,background:on?"#0e0e0e":"#ddd",position:"relative",cursor:"pointer",flexShrink:0,transition:"background 0.2s"}}>
    <div style={{width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:on?23:3,transition:"left 0.2s"}}/>
  </div>
);
const Tag = ({ text }) => <p style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#ff5c3a",marginBottom:14}}>{text}</p>;

const Avatar = ({ size=36, bg="#0e0e0e", iconColor="white", iconSize }) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    <Icons.user s={iconSize||Math.round(size*0.5)} c={iconColor}/>
  </div>
);

const AppNav = ({ goTo, active }) => (
  <nav style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",background:"rgba(250,250,248,0.94)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>goTo("inbox")}>
      <Icons.mask size={24}/><span className="syne" style={{fontWeight:800,fontSize:"1.05rem"}}>unmaskr</span>
    </div>
    <div style={{display:"flex",gap:4}}>
      {[
        {k:"inbox",I:Icons.inbox,label:"Inbox"},
        {k:"stats",I:Icons.stats,label:"Stats"},
        {k:"wallet",I:Icons.wallet,label:"Wallet"},
        {k:"games",I:Icons.games,label:"Games"},
        {k:"settings",I:Icons.settings,label:"Settings"},
      ].map(({k,I,label})=>(
        <button key={k} className="tab-btn" onClick={()=>goTo(k)} title={label} style={{padding:"8px",borderRadius:10,border:"none",background:active===k?"#0e0e0e":"transparent",color:active===k?"white":"#555",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I s={20} c={active===k?"white":"#555"}/>
        </button>
      ))}
    </div>
  </nav>
);

// ── DATA ───────────────────────────────────────────────────────────────────────
// Pricing rule (per Raph): named "good economy" countries get their own/USD tier.
// Every other country defaults to the Nigerian rate (same tier + currency as NG).
const CURRENCIES = {
  NG:{code:"NGN",symbol:"₦",hints:[100,150,200],stakeMin:200,stakeMax:1000000},
  US:{code:"USD",symbol:"$",hints:[0.4,0.8,1.2],stakeMin:1,stakeMax:1000},
  GB:{code:"GBP",symbol:"£",hints:[0.3,0.6,1.0],stakeMin:1,stakeMax:800},
};
const GOOD_ECONOMY_USD = ["CA","AU","DE","FR"]; // ride the USD tier alongside the US
const getCurrency = (countryCode) => {
  if(countryCode==="NG") return CURRENCIES.NG;
  if(countryCode==="US") return CURRENCIES.US;
  if(countryCode==="GB") return CURRENCIES.GB;
  if(GOOD_ECONOMY_USD.includes(countryCode)) return CURRENCIES.US;
  return CURRENCIES.NG; // Ghana, Kenya, South Africa, Other, and any unlisted country
};
const COUNTRIES = [
  {name:"Nigeria",code:"NG",flag:"🇳🇬",phone:"+234"},
  {name:"United States",code:"US",flag:"🇺🇸",phone:"+1"},
  {name:"United Kingdom",code:"GB",flag:"🇬🇧",phone:"+44"},
  {name:"Ghana",code:"GH",flag:"🇬🇭",phone:"+233"},
  {name:"Kenya",code:"KE",flag:"🇰🇪",phone:"+254"},
  {name:"South Africa",code:"ZA",flag:"🇿🇦",phone:"+27"},
  {name:"Canada",code:"CA",flag:"🇨🇦",phone:"+1"},
  {name:"Australia",code:"AU",flag:"🇦🇺",phone:"+61"},
  {name:"Germany",code:"DE",flag:"🇩🇪",phone:"+49"},
  {name:"France",code:"FR",flag:"🇫🇷",phone:"+33"},
  {name:"Other",code:"OTHER",flag:"🌍",phone:""},
];

const ALL_HINTS = [
  {key:"gender",label:"Gender Hint",result:g=>`This sender may identify as ${g||"male"}.`},
  {key:"birth",label:"Birth Period Hint",result:m=>`This person may be born around ${m||"March–July"}.`},
  {key:"relationship",label:"Relationship Hint",result:()=>"This person may be someone you know personally."},
  {key:"circle",label:"Circle Hint",result:()=>"This person may be in your close circle."},
  {key:"age",label:"Age Hint",result:a=>`This person may be around ${a||"20"} years old.`},
  {key:"location",label:"Location Hint",result:()=>"This person may live close to you."},
  {key:"frequency",label:"Frequency Hint",result:()=>"This person may have messaged you before."},
];
const getRandHints = (u=[]) => [...ALL_HINTS.filter(h=>!u.includes(h.key))].sort(()=>Math.random()-0.5).slice(0,3);

const TERMS = `TERMS AND CONDITIONS — UNMASKR\nLast updated: June 2025\n\n1. ACCEPTANCE\nBy using Unmaskr, you agree to these Terms.\n\n2. ELIGIBILITY\nYou must be at least 16 years old to use Unmaskr.\n\n3. ANONYMOUS MESSAGING\nUnmaskr allows anonymous messages. We may disclose sender info to law enforcement if messages contain threats or illegal content.\n\n4. HINT SYSTEM\nHints are based on general profile data voluntarily shared by senders. For entertainment only. When a hint is purchased, 50% goes to the message recipient's wallet. 50% is retained by Unmaskr.\n\n5. PAYMENTS & REFUNDS\nAll hint payments are processed via Paystack. If a withdrawal or deposit fails due to a technical issue on our end, the full amount is automatically returned to your Unmaskr wallet within 10 minutes. Users are responsible for providing correct bank/airtime details.\n\n6. CONTENT MODERATION\nProfanity and offensive language is automatically filtered. Users who attempt to bypass filters using alternate spellings or abbreviations do so at their own risk and remain fully liable for their content. Unmaskr reserves the right to suspend accounts found violating these terms.\n\n7. SEXUAL CONTENT\nSexual language is strictly blocked for users under 18 years of age. This applies to all messages sent and received.\n\n8. PROHIBITED CONDUCT\nNo threatening, harassing, defamatory or illegal content. Violations may result in permanent account suspension.\n\n9. SAFETY\nReport harmful messages using the report button. Unmaskr reviews all reports promptly.\n\n10. PRIVACY\nWe collect only data necessary to operate the platform. We do not sell your data. Wallets never expire. Even if a wallet is unclaimed or abandoned for 5 years or more, the balance remains yours and can be claimed at any time.\n\n11. GAMES — STAKE & WIN\nThe 18+ staking game involves real money. You must be 18+ based on your registered date of birth. Winners receive 85% of the total pot. Maximum stake: equivalent of ₦1,000,000 in your local currency. Minimum 2, maximum 10 players. In the event of a dispute, an Unmaskr admin may review account activity to assist resolution.\n\n12. CHANGES\nWe may update these terms at any time.\n\n13. CONTACT\nsupport@unmaskr.com`;

// ── PROFANITY FILTER ───────────────────────────────────────────────────────────
const PROFANITY = ["fuck","shit","bitch","damn","ass","crap","bastard","idiot","stupid"];
const SEXUAL_WORDS = ["sex","nude","naked","porn","xxx","dick","pussy","cock","boobs","vagina","penis","horny"];
const filterText = (text, isMinor=false) => {
  let result = text;
  const words = isMinor ? [...PROFANITY, ...SEXUAL_WORDS] : PROFANITY;
  words.forEach(w => {
    const regex = new RegExp(w.replace(/[aeiou]/gi, '[aeiou*@0-9]?'), 'gi');
    result = result.replace(regex, match => match.replace(/[aeiou]/gi, '*'));
  });
  return result;
};

// ── TRIVIA DATA BY TOPIC & DIFFICULTY ─────────────────────────────────────────
const TRIVIA_TOPICS = [
  {key:"tech",label:"Tech & Science",icon:()=><Icons.globe s={16} c="#3b82f6"/>},
  {key:"med",label:"Medical Science",icon:()=><Icons.help s={16} c="#ef4444"/>},
  {key:"politics",label:"Politics",icon:()=><Icons.shield s={16} c="#6366f1"/>},
  {key:"economics",label:"Economics",icon:()=><Icons.money s={16} c="#f59e0b"/>},
  {key:"social",label:"Social Life",icon:()=><Icons.chat s={16} c="#ec4899"/>},
  {key:"education",label:"Education",icon:()=><Icons.doc s={16} c="#8b5cf6"/>},
  {key:"entertainment",label:"Entertainment",icon:()=><Icons.star s={16} c="#f97316"/>},
  {key:"history",label:"History & General",icon:()=><Icons.info s={16} c="#14b8a6"/>},
  {key:"sports",label:"Sports",icon:()=><Icons.trophy s={16} c="#22c55e"/>},
  {key:"music",label:"Music",icon:()=><Icons.bell s={16} c="#a855f7"/>},
  {key:"food",label:"Food & Culture",icon:()=><Icons.star s={16} c="#f59e0b"/>},
  {key:"humanrights",label:"Human Rights",icon:()=><Icons.user s={16} c="#6366f1"/>},
  {key:"geography",label:"Geography",icon:()=><Icons.globe s={16} c="#0ea5e9"/>},
  {key:"popculture",label:"Pop Culture",icon:()=><Icons.star s={16} c="#f43f5e"/>},
  {key:"relationships",label:"Relationships",icon:()=><Icons.react s={16} c="#ec4899"/>},
];

const ALL_QUESTIONS = {
  tech:{
    easy:[
      {q:"The internet was invented in the 1990s",a:false,f:"The internet's foundations were laid in the 1960s with ARPANET."},
      {q:"A byte consists of 8 bits",a:true,f:"Yes — 8 bits make one byte."},
      {q:"HTML is a programming language",a:false,f:"HTML is a markup language, not a programming language."},
    ],
    medium:[
      {q:"The first iPhone was released in 2007",a:true,f:"Apple launched the original iPhone on June 29, 2007."},
      {q:"Python is primarily a compiled language",a:false,f:"Python is an interpreted language."},
      {q:"WiFi stands for Wireless Fidelity",a:false,f:"WiFi is a brand name — it doesn't actually stand for anything officially."},
    ],
    hard:[
      {q:"Quantum computers use qubits instead of classical bits",a:true,f:"Qubits can exist in superposition, unlike classical 0/1 bits."},
      {q:"The first computer virus was created in 1986",a:true,f:"The Brain virus was created in 1986 by two Pakistani brothers."},
      {q:"5G operates exclusively on millimeter wave frequencies",a:false,f:"5G uses a range of frequencies including sub-6GHz bands."},
    ],
  },
  med:{
    easy:[
      {q:"The heart is on the left side of the body",a:false,f:"The heart is roughly in the center, slightly left of the sternum."},
      {q:"Adults have 206 bones",a:true,f:"The adult human body has 206 bones."},
      {q:"Antibiotics work against viruses",a:false,f:"Antibiotics only work against bacteria, not viruses."},
    ],
    medium:[
      {q:"Blood type O- is the universal donor",a:true,f:"O negative can be given to patients of any blood type in emergencies."},
      {q:"The liver is the largest internal organ",a:true,f:"The liver is the largest internal organ, weighing about 1.5kg."},
      {q:"Humans have 5 senses",a:false,f:"Humans have more than 5 — including balance, proprioception, and others."},
    ],
    hard:[
      {q:"DNA stands for Deoxyribonucleic Acid",a:true,f:"DNA is the molecule carrying genetic instructions in living organisms."},
      {q:"The appendix has no known function",a:false,f:"Research suggests the appendix may play a role in gut immunity."},
      {q:"Mitochondria is the powerhouse of the cell",a:true,f:"Mitochondria produce ATP, the cell's primary energy source."},
    ],
  },
  politics:{
    easy:[
      {q:"The United Nations was founded in 1945",a:true,f:"The UN was founded on October 24, 1945 after World War II."},
      {q:"Nigeria is a monarchy",a:false,f:"Nigeria is a federal republic."},
      {q:"The US president serves a 4-year term",a:true,f:"US presidents serve 4-year terms and can serve a maximum of two terms."},
    ],
    medium:[
      {q:"The Cold War was a direct military conflict between the US and USSR",a:false,f:"The Cold War was a geopolitical rivalry without direct large-scale combat."},
      {q:"South Africa had its first democratic election in 1994",a:true,f:"Nelson Mandela won the first post-apartheid election in 1994."},
      {q:"The European Union has 27 member states as of 2024",a:true,f:"After Brexit in 2020, the EU has 27 member states."},
    ],
    hard:[
      {q:"The Rwandan genocide occurred in 1994",a:true,f:"An estimated 500,000–800,000 Tutsis were killed in just 100 days."},
      {q:"The G7 includes China",a:false,f:"The G7 is Canada, France, Germany, Italy, Japan, the UK, and the US."},
      {q:"The ICC is part of the United Nations system",a:false,f:"The ICC is independent of the UN, though they cooperate."},
    ],
  },
  economics:{
    easy:[
      {q:"Inflation means prices are rising",a:true,f:"Inflation is the rate at which the general price level rises over time."},
      {q:"GDP stands for Gross Domestic Product",a:true,f:"GDP measures the total value of goods and services produced in a country."},
      {q:"A recession means the economy is growing",a:false,f:"A recession is defined as two consecutive quarters of negative GDP growth."},
    ],
    medium:[
      {q:"The stock market always goes up in the long run",a:true,f:"Historically, major indices have trended upward over long periods."},
      {q:"Deflation is always good for an economy",a:false,f:"Deflation can cause consumers to delay spending, harming economic growth."},
      {q:"The World Bank and IMF are the same organization",a:false,f:"Both were founded in 1944 but have different mandates."},
    ],
    hard:[
      {q:"Nigeria's economy is the largest in Africa by GDP",a:true,f:"Nigeria has the largest GDP in Africa, though South Africa leads in per capita income."},
      {q:"Quantitative easing reduces money supply",a:false,f:"Quantitative easing increases money supply by buying assets."},
      {q:"The Bretton Woods system ended in 1971",a:true,f:"Nixon ended dollar-gold convertibility in 1971, effectively ending Bretton Woods."},
    ],
  },
  social:{
    easy:[
      {q:"Social media can affect mental health",a:true,f:"Studies consistently link heavy social media use to anxiety and depression."},
      {q:"Humans are naturally social creatures",a:true,f:"Humans evolved in social groups and depend on community for survival."},
      {q:"Peer pressure only affects teenagers",a:false,f:"Peer pressure affects people of all ages."},
    ],
    medium:[
      {q:"Introversion means you dislike people",a:false,f:"Introversion means you recharge through solitude, not that you dislike others."},
      {q:"Body language accounts for most of human communication",a:true,f:"Non-verbal cues account for a significant portion of how we communicate."},
      {q:"Ghosting is a modern term with no psychological impact",a:false,f:"Ghosting can cause real psychological harm to those on the receiving end."},
    ],
    hard:[
      {q:"The Dunbar number suggests humans can maintain ~150 stable relationships",a:true,f:"Robin Dunbar proposed that 150 is the cognitive limit for stable social relationships."},
      {q:"Social isolation has no physical health effects",a:false,f:"Chronic loneliness is linked to higher risks of heart disease and early death."},
      {q:"Cultural norms are universal across all societies",a:false,f:"Cultural norms vary widely — what is acceptable in one culture may be taboo in another."},
    ],
  },
  education:{
    easy:[
      {q:"Primary school is typically the first stage of formal education",a:true,f:"Primary (elementary) school usually follows early childhood education and precedes secondary school."},
      {q:"A university degree is required to be considered educated",a:false,f:"Education includes formal, informal, and vocational learning — a degree is one path among many."},
      {q:"Literacy means being able to read and write",a:true,f:"Literacy is the ability to read and write with understanding."},
    ],
    medium:[
      {q:"Finland is often cited for having one of the world's strongest education systems",a:true,f:"Finland is frequently ranked highly for its equitable, teacher-focused education model."},
      {q:"Homeschooling is illegal in most countries",a:false,f:"Homeschooling is legal, with varying levels of regulation, in most countries."},
      {q:"UNESCO promotes education access worldwide",a:true,f:"UNESCO's mandate includes promoting universal access to quality education."},
    ],
    hard:[
      {q:"The world's literacy rate is above 85%",a:true,f:"Global adult literacy is estimated at over 86%, though it varies widely by region."},
      {q:"Malala Yousafzai won the Nobel Peace Prize for her advocacy of girls' education",a:true,f:"Malala Yousafzai became the youngest Nobel laureate in 2014 for her education advocacy."},
      {q:"Standardized testing was first introduced in the 20th century",a:false,f:"Formal standardized testing dates back to imperial China's civil service exams over a thousand years ago."},
    ],
  },
  entertainment:{
    easy:[
      {q:"Netflix started as a DVD rental service",a:true,f:"Netflix began in 1997 as a DVD-by-mail service before streaming."},
      {q:"Marvel is owned by Disney",a:true,f:"Disney acquired Marvel Entertainment in 2009 for $4 billion."},
      {q:"The Oscars are awarded by the Grammy Academy",a:false,f:"The Oscars are awarded by the Academy of Motion Picture Arts and Sciences."},
    ],
    medium:[
      {q:"Squid Game is a Korean production",a:true,f:"Squid Game was produced by Netflix Korea and directed by Hwang Dong-hyuk."},
      {q:"The Beatles were from London",a:false,f:"The Beatles were from Liverpool, England."},
      {q:"Fortnite was released in 2017",a:true,f:"Fortnite Battle Royale launched in September 2017."},
    ],
    hard:[
      {q:"The highest-grossing film of all time is Avengers Endgame",a:false,f:"Avatar (2009) reclaimed the top spot after its 2022 re-release."},
      {q:"Rihanna is from Barbados",a:true,f:"Robyn Rihanna Fenty was born in Saint Michael, Barbados."},
      {q:"The first video game ever made was Pong",a:false,f:"Tennis for Two (1958) predates Pong by over a decade."},
    ],
  },
  history:{
    easy:[
      {q:"World War II ended in 1945",a:true,f:"WWII ended in Europe on May 8 and in the Pacific on September 2, 1945."},
      {q:"Christopher Columbus discovered America in 1492",a:true,f:"Columbus reached the Americas on October 12, 1492."},
      {q:"The Great Wall of China was built in one dynasty",a:false,f:"The Great Wall was built over many centuries by multiple dynasties."},
    ],
    medium:[
      {q:"Cleopatra was Egyptian by ethnicity",a:false,f:"Cleopatra was of Macedonian Greek descent from the Ptolemaic dynasty."},
      {q:"The Berlin Wall fell in 1989",a:true,f:"The Berlin Wall fell on November 9, 1989."},
      {q:"Nikola Tesla and Thomas Edison were close friends",a:false,f:"Tesla and Edison were famous rivals, not friends."},
    ],
    hard:[
      {q:"The Roman Empire fell in 476 AD",a:true,f:"The Western Roman Empire fell in 476 AD when Romulus Augustulus was deposed."},
      {q:"The Magna Carta was signed in 1215",a:true,f:"King John signed the Magna Carta at Runnymede on June 15, 1215."},
      {q:"The first atomic bomb was dropped on Hiroshima",a:true,f:"Little Boy was dropped on Hiroshima on August 6, 1945."},
    ],
  },
  sports:{
    easy:[
      {q:"A football match lasts 90 minutes",a:true,f:"Standard football/soccer matches are 90 minutes plus injury time."},
      {q:"The Olympics are held every 4 years",a:true,f:"The Summer and Winter Olympics each occur every 4 years."},
      {q:"Basketball was invented in the USA",a:true,f:"Dr. James Naismith invented basketball in Springfield, Massachusetts in 1891."},
    ],
    medium:[
      {q:"Usain Bolt is from Jamaica",a:true,f:"Usain Bolt was born in Sherwood Content, Trelawny, Jamaica."},
      {q:"The FIFA World Cup is held every 2 years",a:false,f:"The FIFA World Cup is held every 4 years."},
      {q:"LeBron James has won 4 NBA championships",a:true,f:"LeBron has won titles with Miami (2012,2013), Cleveland (2016), and LA Lakers (2020)."},
    ],
    hard:[
      {q:"The first modern Olympics was held in Athens in 1896",a:true,f:"The first modern Olympic Games took place in Athens, Greece in 1896."},
      {q:"Roger Federer has won more Grand Slams than Novak Djokovic",a:false,f:"Djokovic leads with 24 Grand Slam titles as of 2024."},
      {q:"Nigeria has won an Olympic gold medal in football",a:true,f:"Nigeria won gold at the 1996 Atlanta Olympics, defeating Argentina 3-2 in the final."},
    ],
  },
  music:{
    easy:[
      {q:"Michael Jackson is called the King of Pop",a:true,f:"Michael Jackson earned the title 'King of Pop' for his global influence."},
      {q:"A DJ mixes and plays recorded music",a:true,f:"DJs select and mix recorded music for audiences."},
      {q:"Beethoven was born in Italy",a:false,f:"Ludwig van Beethoven was born in Bonn, Germany."},
    ],
    medium:[
      {q:"Afrobeats originated in Nigeria",a:true,f:"Afrobeats/Afropop emerged from Nigeria and has spread globally."},
      {q:"Grammy Awards are given for achievement in the music industry",a:true,f:"The Recording Academy's Grammy Awards honor excellence in the music industry."},
      {q:"Taylor Swift started her career as a country artist",a:true,f:"Swift debuted with country music before transitioning to pop."},
    ],
    hard:[
      {q:"Fela Kuti created Afrobeat",a:true,f:"Nigerian musician Fela Kuti created Afrobeat, blending jazz, funk, and traditional music."},
      {q:"Beyoncé has won more Grammys than any other artist",a:true,f:"As of 2024, Beyoncé holds the record with 32 Grammy wins."},
      {q:"The violin has 6 strings",a:false,f:"A standard violin has 4 strings."},
    ],
  },
  food:{
    easy:[
      {q:"Jollof rice is a popular West African dish",a:true,f:"Jollof rice is beloved across West Africa, with Nigeria and Ghana famously competing for the best version."},
      {q:"Sushi originated in China",a:false,f:"Sushi originated in Japan."},
      {q:"Vegans do not eat meat or dairy",a:true,f:"Vegans avoid all animal products including meat, dairy, and eggs."},
    ],
    medium:[
      {q:"Chocolate comes from cocoa beans",a:true,f:"Chocolate is made from cacao beans from the Theobroma cacao tree."},
      {q:"The hottest chili pepper in the world is the jalapeño",a:false,f:"The Carolina Reaper and Pepper X are among the hottest, far beyond the jalapeño."},
      {q:"Tomatoes are technically a fruit",a:true,f:"Botanically, tomatoes are fruits since they develop from flowers and contain seeds."},
    ],
    hard:[
      {q:"France has the most Michelin-starred restaurants in the world",a:false,f:"Japan actually has the most Michelin-starred restaurants globally."},
      {q:"The word 'salary' comes from the Latin word for salt",a:true,f:"Roman soldiers were sometimes paid in salt — 'salarium' — giving us the word salary."},
      {q:"Suya is a dish from Northern Nigeria",a:true,f:"Suya is a spicy grilled meat skewer originating from the Hausa people of Northern Nigeria."},
    ],
  },
  humanrights:{
    easy:[
      {q:"Human rights apply to all people regardless of nationality",a:true,f:"Human rights are universal — they apply to every person by virtue of being human."},
      {q:"Slavery has been abolished worldwide",a:false,f:"Modern slavery and human trafficking still affect millions globally."},
      {q:"Education is considered a human right",a:true,f:"Article 26 of the Universal Declaration of Human Rights declares education a right."},
    ],
    medium:[
      {q:"The Universal Declaration of Human Rights was adopted in 1948",a:true,f:"The UDHR was adopted by the UN General Assembly on December 10, 1948."},
      {q:"Freedom of speech is an absolute right with no limits",a:false,f:"Free speech has legal limits — incitement to violence and defamation are examples."},
      {q:"Children have specific rights under international law",a:true,f:"The UN Convention on the Rights of the Child (1989) protects children's rights specifically."},
    ],
    hard:[
      {q:"The International Criminal Court can prosecute individuals for genocide",a:true,f:"The ICC has jurisdiction over genocide, war crimes, and crimes against humanity."},
      {q:"All UN member states have ratified the Convention Against Torture",a:false,f:"Several countries have not ratified the CAT."},
      {q:"Nelson Mandela spent 27 years in prison",a:true,f:"Mandela was imprisoned from 1964 to 1990, primarily on Robben Island."},
    ],
  },
  geography:{
    easy:[
      {q:"Australia is both a country and a continent",a:true,f:"Australia is the world's smallest continent and a sovereign country."},
      {q:"The Sahara is the world's largest desert",a:false,f:"Antarctica is technically the world's largest desert by area."},
      {q:"The Amazon River is in South America",a:true,f:"The Amazon flows through Brazil and several other South American countries."},
    ],
    medium:[
      {q:"Nigeria is located in West Africa",a:true,f:"Nigeria is in West Africa, bordered by Benin, Niger, Chad, and Cameroon."},
      {q:"Mount Everest is located in China",a:false,f:"Everest sits on the border of Nepal and Tibet (China)."},
      {q:"The Nile River flows northward",a:true,f:"The Nile flows northward from its source in East Africa to the Mediterranean Sea."},
    ],
    hard:[
      {q:"Vatican City is the smallest country in the world",a:true,f:"Vatican City covers 44 hectares, making it the world's smallest country."},
      {q:"Indonesia has more islands than the Philippines",a:true,f:"Indonesia has around 17,000 islands, more than the Philippines' approximately 7,600."},
      {q:"The deepest point on Earth is in the Pacific Ocean",a:true,f:"The Mariana Trench's Challenger Deep, in the Pacific, is the deepest known point at ~11km."},
    ],
  },
  popculture:{
    easy:[
      {q:"TikTok is a social media platform",a:true,f:"TikTok is a short-video sharing platform owned by ByteDance."},
      {q:"Harry Potter was written by J.K. Rowling",a:true,f:"Joanne Rowling published the first Harry Potter book in 1997."},
      {q:"Pokémon originated in Japan",a:true,f:"Pokémon was created by Satoshi Tajiri and Ken Sugimori in Japan."},
    ],
    medium:[
      {q:"The phrase 'going viral' has existed since the internet began",a:false,f:"'Going viral' became common internet slang only in the early 2000s."},
      {q:"Stranger Things is a Netflix original series",a:true,f:"Stranger Things premiered on Netflix in July 2016."},
      {q:"Snapchat was the first platform to introduce stories",a:true,f:"Snapchat introduced the Stories format in 2013; Instagram copied it in 2016."},
    ],
    hard:[
      {q:"The term 'meme' was coined by Richard Dawkins",a:true,f:"Richard Dawkins coined 'meme' in his 1976 book The Selfish Gene."},
      {q:"K-pop originated in South Korea in the 1990s",a:true,f:"K-pop's modern era began in the 1990s with groups like H.O.T. and S.E.S."},
      {q:"Instagram was acquired by Facebook for $1 billion",a:true,f:"Facebook acquired Instagram in 2012 for approximately $1 billion."},
    ],
  },
  relationships:{
    easy:[
      {q:"Communication is important in a relationship",a:true,f:"Studies consistently show communication is one of the top factors in healthy relationships."},
      {q:"Jealousy is always a sign of love",a:false,f:"Excessive jealousy is often linked to insecurity, not love."},
      {q:"Friendships are a type of relationship",a:true,f:"Relationships include romantic, platonic, familial, and professional bonds."},
    ],
    medium:[
      {q:"Long-distance relationships never work",a:false,f:"Many long-distance relationships succeed with communication and trust."},
      {q:"Attachment styles are formed in childhood",a:true,f:"Attachment theory (Bowlby) shows early bonds shape adult relationship patterns."},
      {q:"Love languages is a concept created by Gary Chapman",a:true,f:"Gary Chapman introduced the 5 Love Languages in his 1992 book."},
    ],
    hard:[
      {q:"Research shows that couples who argue never have healthy relationships",a:false,f:"Gottman's research shows it's not whether couples argue but how they resolve conflict that matters."},
      {q:"Oxytocin is known as the 'bonding hormone'",a:true,f:"Oxytocin is released during physical touch and social bonding, earning its nickname."},
      {q:"The divorce rate has been consistently rising since the 1970s in most Western countries",a:false,f:"Divorce rates in many Western countries have actually declined since the 1980s."},
    ],
  },
};

const getQuestions = (topics, difficulty, count) => {
  const topicKeys = topics.length > 0 ? topics : Object.keys(ALL_QUESTIONS);
  let pool = [];
  topicKeys.forEach(t => {
    if(ALL_QUESTIONS[t]) {
      const diffs = difficulty === "mix" ? ["easy","medium","hard"] : [difficulty];
      diffs.forEach(d => { if(ALL_QUESTIONS[t][d]) pool = [...pool, ...ALL_QUESTIONS[t][d]]; });
    }
  });
  return [...pool].sort(()=>Math.random()-0.5).slice(0, Math.min(count, pool.length));
};

const THEMES = [
  {key:"classic",label:"Classic",bg:"#fafaf8",card:"#ffffff",accent:"#0e0e0e"},
  {key:"night",label:"Night",bg:"#0e0e0e",card:"#1a1a1a",accent:"#ff5c3a"},
  {key:"sunset",label:"Sunset",bg:"#fff5f0",card:"#ffffff",accent:"#ff5c3a"},
  {key:"mint",label:"Mint",bg:"#f0fdf8",card:"#ffffff",accent:"#059669"},
  {key:"lavender",label:"Lavender",bg:"#f5f3ff",card:"#ffffff",accent:"#7c3aed"},
  {key:"gold",label:"Gold",bg:"#fffbeb",card:"#ffffff",accent:"#d97706"},
];

const EMOJIS = ["❤️","🔥","😂","😭","🙌","✨","💯","👏","😍","🫶"];
// ── RECEIPT MODAL ──────────────────────────────────────────────────────────────
const ReceiptModal = ({ title, items, onClose }) => {
  const date = new Date().toLocaleString();
  return (
    <Modal onClose={onClose}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:"#f0fff4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
          <Icons.receipt s={24} c="#16a34a"/>
        </div>
        <p className="syne" style={{fontWeight:800,fontSize:"1.1rem",marginBottom:4}}>{title||"Payment Receipt"}</p>
        <p style={{fontSize:"0.8rem",color:"#aaa"}}>Unmaskr · {date}</p>
      </div>
      <div style={{background:"#f8f8f6",borderRadius:14,padding:"20px",marginBottom:20}}>
        {items.map(([k,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<items.length-1?"1px solid rgba(0,0,0,0.06)":"none",fontSize:"0.88rem"}}>
            <span style={{color:"#888"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 14px",background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,marginBottom:16,fontSize:"0.78rem",color:"#0369a1",lineHeight:1.6,display:"flex",gap:8,alignItems:"flex-start"}}>
        <Icons.info s={14} c="#0369a1"/> <span>Funds typically arrive within 10 minutes. If not received, please contact support with your reference number.</span>
      </div>
      <p style={{fontSize:"0.75rem",color:"#aaa",textAlign:"center",marginBottom:16}}>Save a screenshot for your records.</p>
      <Btn onClick={onClose} style={{width:"100%"}}>Done</Btn>
    </Modal>
  );
};

// ── SHARE MODAL ────────────────────────────────────────────────────────────────
const ShareModal = ({ message, ownerName, onClose }) => {
  const [copied,setCopied] = useState(false);
  const shareText = `"${message}"\n\nSend me an anonymous message on Unmaskr 👉 ${window.location.origin}/${ownerName||"yourname"}`;
  const toWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`,"_blank");
  const toTW = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,"_blank");
  const copyTxt = () => {navigator.clipboard?.writeText(shareText);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return (
    <Modal onClose={onClose}>
      <p className="syne" style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>Share this message</p>
      <p style={{fontSize:"0.83rem",color:"#888",marginBottom:20,fontWeight:300}}>Share as a card on your socials</p>
      <div style={{background:"#0e0e0e",borderRadius:16,padding:"28px 24px",marginBottom:20,textAlign:"center"}}>
        <Icons.mask size={28} color="white"/>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.72rem",margin:"10px 0 6px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Anonymous message</p>
        <p style={{color:"white",fontSize:"1rem",lineHeight:1.7,fontStyle:"italic"}}>"{message}"</p>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"0.72rem",marginTop:16}}>{window.location.host}/{ownerName||"yourname"}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={toWA} style={{padding:"13px",borderRadius:12,border:"none",background:"#25D366",color:"white",fontWeight:600,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icons.share s={16} c="white"/> Share to WhatsApp
        </button>
        <button onClick={toTW} style={{padding:"13px",borderRadius:12,border:"none",background:"#1DA1F2",color:"white",fontWeight:600,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icons.share s={16} c="white"/> Share to Twitter / X
        </button>
        <button onClick={copyTxt} style={{padding:"13px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"white",fontWeight:500,cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icons.copy s={16} c="#555"/> {copied?"Copied!":"Copy text"}
        </button>
      </div>
      <p style={{textAlign:"center",marginTop:14,fontSize:"0.75rem",color:"#ccc"}}>Screenshot and share to Instagram Stories too!</p>
    </Modal>
  );
};

// ── EMOJI PICKER ───────────────────────────────────────────────────────────────
const EmojiPicker = ({ onPick, onClose }) => (
  <div style={{position:"absolute",bottom:"100%",left:0,background:"white",borderRadius:14,padding:"12px",boxShadow:"0 8px 30px rgba(0,0,0,0.15)",display:"flex",gap:8,flexWrap:"wrap",width:240,zIndex:50,marginBottom:8}}>
    {EMOJIS.map(e=>(<button key={e} onClick={()=>{onPick(e);onClose();}} style={{fontSize:"1.4rem",background:"none",border:"none",cursor:"pointer",padding:"4px",borderRadius:8,transition:"transform 0.15s"}}>{e}</button>))}
  </div>
);

// ── LANDING ────────────────────────────────────────────────────────────────────
const Landing = ({ goTo }) => {
  const [vis,setVis] = useState(0);
  const msgs = [{t:"You always make people feel seen",tm:"just now"},{t:"Honestly you inspire me more than you know",tm:"2m ago"},{t:"I wish I had your energy",tm:"5m ago"}];
  useEffect(()=>{const tm=setInterval(()=>setVis(v=>Math.min(v+1,msgs.length)),700);return()=>clearInterval(tm);},[]);
  return (
    <div style={{background:"#fafaf8",color:"#0e0e0e"}}>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 30px",background:"rgba(250,250,248,0.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><Icons.mask size={26}/><span className="syne" style={{fontWeight:800,fontSize:"1.2rem"}}>unmaskr</span></div>
        <div style={{display:"flex",gap:10}}>
          <Btn outline onClick={()=>goTo("login")}>Log in</Btn>
          <Btn onClick={()=>goTo("signup")}>Get started</Btn>
        </div>
      </nav>
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"130px 24px 90px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 55% 45% at 15% 25%,rgba(255,92,58,0.09) 0%,transparent 70%),radial-gradient(ellipse 45% 40% at 85% 70%,rgba(255,205,60,0.11) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:"8%",left:"4%",opacity:0.05}} className="float1"><Icons.mask size={120}/></div>
        <div style={{position:"absolute",top:"55%",right:"5%",opacity:0.04}} className="float2"><Icons.mask size={130}/></div>
        <div style={{position:"relative",zIndex:1}}>
          <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f0efec",border:"1px solid rgba(0,0,0,0.1)",borderRadius:100,padding:"6px 16px",fontSize:"0.78rem",fontWeight:500,color:"#888",marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#ff5c3a",display:"inline-block"}}/>Anonymous messages, reimagined
          </div>
          <h1 className="syne fadeUp1" style={{fontSize:"clamp(2.6rem,7vw,5rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.03em",maxWidth:740}}>
            What do people <span style={{position:"relative",display:"inline-block"}}>really<span style={{position:"absolute",bottom:4,left:0,right:0,height:7,background:"#ffcd3c",borderRadius:3,zIndex:-1}}/></span><br/>think about you?
          </h1>
          <p className="fadeUp2" style={{fontSize:"1.05rem",color:"#666",lineHeight:1.75,maxWidth:440,margin:"24px auto 0",fontWeight:300}}>Share your Unmaskr link, receive honest anonymous messages, and play fun games with friends.</p>
          <div className="fadeUp3" style={{display:"flex",gap:12,justifyContent:"center",marginTop:40,flexWrap:"wrap"}}>
            <Btn onClick={()=>goTo("signup")} style={{padding:"15px 34px",fontSize:"0.95rem"}}>Create your link — it's free</Btn>
            <Btn outline onClick={()=>goTo("send",{username:"demo"})} style={{padding:"15px 34px",fontSize:"0.95rem"}}>See how it works</Btn>
          </div>
          <div style={{marginTop:44,display:"flex",flexDirection:"column",gap:10,maxWidth:400,margin:"44px auto 0"}}>
            {msgs.slice(0,vis).map((m,i)=>(
              <div key={i} style={{background:"white",borderRadius:14,padding:"14px 18px",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",display:"flex",gap:12,alignItems:"center",textAlign:"left",animation:"fadeUp 0.4s ease both"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icons.mask size={18}/></div>
                <div><p style={{fontSize:"0.88rem",color:"#0e0e0e",fontWeight:500}}>{m.t}</p><p style={{fontSize:"0.72rem",color:"#aaa",marginTop:2}}>{m.tm}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap",padding:"56px 24px",borderTop:"1px solid rgba(0,0,0,0.07)",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        {[["100K+","Messages sent"],["50K+","Active users"],["100%","Anonymous"],["Free","To get started"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center"}}><div className="syne" style={{fontSize:"2.3rem",fontWeight:800}}>{n}</div><div style={{fontSize:"0.83rem",color:"#888",marginTop:4}}>{l}</div></div>
        ))}
      </div>
      <div style={{padding:"90px 32px",maxWidth:1080,margin:"0 auto"}}>
        <Tag text="How it works"/>
        <h2 className="syne" style={{fontSize:"clamp(1.9rem,4vw,2.9rem)",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.1,maxWidth:420}}>Three simple steps</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:20,marginTop:56}}>
          {[{n:"01",icon:<Icons.copy s={22} c="white"/>,t:"Create your link",d:"Sign up and get your unique Unmaskr link in seconds."},{n:"02",icon:<Icons.share s={22} c="white"/>,t:"Share it everywhere",d:"Post on Instagram, WhatsApp, Twitter — let people send you honest messages."},{n:"03",icon:<Icons.chat s={22} c="white"/>,t:"Receive & explore",d:"Read messages, react, reply, buy hints and play games with friends."}].map(s=>(
            <div key={s.n} style={{background:"#f3f2ef",borderRadius:18,padding:"32px 28px",position:"relative",overflow:"hidden"}}>
              <div className="syne" style={{position:"absolute",top:14,right:18,fontSize:"3.8rem",fontWeight:800,color:"rgba(0,0,0,0.06)",lineHeight:1}}>{s.n}</div>
              <div style={{width:46,height:46,borderRadius:13,background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>{s.icon}</div>
              <h3 className="syne" style={{fontSize:"1.05rem",fontWeight:700,marginBottom:10}}>{s.t}</h3>
              <p style={{fontSize:"0.88rem",color:"#666",lineHeight:1.65,fontWeight:300}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"90px 32px",background:"#0e0e0e",color:"white"}}>
        <div style={{maxWidth:1080,margin:"0 auto"}}>
          <p style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#ffcd3c",marginBottom:14}}>The hint system</p>
          <h2 className="syne" style={{fontSize:"clamp(1.9rem,4vw,2.9rem)",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.1,maxWidth:500}}>Curious who sent it?<br/>Get a <span style={{color:"#ffcd3c"}}>hint.</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginTop:48}}>
            {ALL_HINTS.slice(0,4).map((h,i)=>(
              <div key={h.key} className="hint-hover" style={{border:`1px solid ${i===1?"#ffcd3c":"rgba(255,255,255,0.1)"}`,background:i===1?"rgba(255,205,60,0.05)":"transparent",borderRadius:16,padding:"24px 20px",transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <Icons.lock s={16} c="#ffcd3c"/>
                  <span style={{fontSize:"0.75rem",fontWeight:700,color:"#ffcd3c",textTransform:"uppercase",letterSpacing:"0.06em"}}>Hint</span>
                </div>
                <h3 className="syne" style={{fontSize:"0.95rem",fontWeight:700,marginBottom:8,color:"white"}}>{h.label}</h3>
                <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",fontStyle:"italic"}}>"{h.result("...")}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"90px 32px",maxWidth:1080,margin:"0 auto"}}>
        <Tag text="Games"/>
        <h2 className="syne" style={{fontSize:"clamp(1.9rem,4vw,2.9rem)",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.1,maxWidth:500}}>Play with friends</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20,marginTop:48}}>
          {[{icon:<Icons.mask size={32}/>,t:"Mystery Lobby",d:"Host shares a link. Players pick preferences. Guess what others picked or get eliminated!",b:"For everyone",bc:"#0e0e0e",c:"#f0efec"},{icon:<Icons.money size={32} color="white"/>,t:"Stake & Win",d:"Bet real money on trivia questions. Select topics and difficulty. Winner takes home 85% of the pot.",b:"18+ only",bc:"#ff5c3a",c:"#0e0e0e"}].map(g=>(
            <div key={g.t} className="game-card" style={{background:g.c,borderRadius:20,padding:"32px 28px",transition:"all 0.2s",cursor:"pointer",border:g.c==="#0e0e0e"?"none":"1px solid rgba(0,0,0,0.06)"}} onClick={()=>goTo("signup")}>
              <div style={{width:56,height:56,borderRadius:16,background:g.bc==="#0e0e0e"?"#0e0e0e":"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{g.icon}</div>
              <div style={{display:"inline-block",background:g.bc,color:"white",fontSize:"0.7rem",fontWeight:700,padding:"4px 12px",borderRadius:50,marginBottom:14}}>{g.b}</div>
              <h3 className="syne" style={{fontSize:"1.2rem",fontWeight:800,marginBottom:10,color:g.c==="#0e0e0e"?"white":"#0e0e0e"}}>{g.t}</h3>
              <p style={{fontSize:"0.88rem",color:g.c==="#0e0e0e"?"rgba(255,255,255,0.55)":"#666",lineHeight:1.65,fontWeight:300}}>{g.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"90px 32px",textAlign:"center",background:"#f3f2ef"}}>
        <h2 className="syne" style={{fontSize:"clamp(2rem,5vw,3.6rem)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.1,maxWidth:560,margin:"0 auto"}}>Ready to find out what people really think?</h2>
        <p style={{margin:"20px auto 0",maxWidth:380,color:"#666",fontSize:"0.98rem",fontWeight:300,lineHeight:1.7}}>Join thousands already using Unmaskr.</p>
        <Btn onClick={()=>goTo("signup")} style={{marginTop:36,padding:"16px 38px",fontSize:"1rem"}}>Create your free link</Btn>
      </div>
      <footer style={{padding:"32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,borderTop:"1px solid rgba(0,0,0,0.08)",fontSize:"0.83rem",color:"#888"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Icons.mask size={20}/><span className="syne" style={{fontWeight:800,color:"#0e0e0e"}}>unmaskr</span></div>
        <div style={{display:"flex",gap:22}}>{["Privacy","Terms","Safety","Contact"].map(l=><span key={l} style={{cursor:"pointer"}} onClick={()=>goTo("terms")}>{l}</span>)}</div>
        <span>© 2025 Unmaskr. All rights reserved.</span>
      </footer>
    </div>
  );
};

// ── SIGNUP ─────────────────────────────────────────────────────────────────────
const Signup = ({ goTo, onSignupComplete }) => {
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({name:"",username:"",email:"",password:"",dob:"",gender:"",ageGroup:"",country:"NG",dobConfirmed:false});
  const [pwErr,setPwErr] = useState("");
  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const ageGroups = ["16–18","19–21","22–26","27–30","31 and above"];
  const validatePw = pw => {
    if(pw.length < 8) return "Password must be at least 8 characters";
    if(!/[0-9!@#$%^&*]/.test(pw)) return "Must include at least one number or symbol";
    return "";
  };
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setSignupError("");
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setSignupError(error.message);
      setLoading(false);
      return;
    }
    const userId = data.user.id;
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        name: form.name,
        username: form.username,
        country: form.country,
        dob: form.dob,
        gender: form.gender,
        age_group: form.ageGroup,
        email: form.email,
      });

    if (profileError) {
      setSignupError("Couldn't save your profile: " + profileError.message);
      setLoading(false);
      return;
    }

    await supabase.from("wallets").insert({
      user_id: userId,
      balance: 0,
    });
    setLoading(false);
    onSignupComplete && onSignupComplete(form);

    if (data.session) {
      // Email confirmation not required on this project — already signed in
      goTo("inbox");
    } else {
      // Real Supabase Auth session doesn't exist yet until the code is verified
      setNeedsConfirmation(true);
    }
  };

  const verifyCode = async () => {
    if (!otpCode.trim()) return;
    setVerifying(true);
    setOtpError("");
    const { error } = await supabase.auth.verifyOtp({ email: form.email, token: otpCode.trim(), type: "signup" });
    if (error) {
      setOtpError(error.message);
      setVerifying(false);
      return;
    }
    setVerifying(false);
    goTo("inbox");
  };

  const resendCode = async () => {
    setResendMsg("");
    const { error } = await supabase.auth.resend({ type: "signup", email: form.email });
    setResendMsg(error ? "Couldn't resend — try again shortly." : "New code sent!");
  };

  if (needsConfirmation) return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div className="popIn" style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icons.mail s={24} c="#0e0e0e"/></div>
        <h2 className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:8}}>Check your email</h2>
        <p style={{color:"#888",fontSize:"0.9rem",marginBottom:28,fontWeight:300}}>We sent a 6-digit code to <strong>{form.email}</strong></p>
        <Inp placeholder="Enter 6-digit code" value={otpCode} onChange={e=>setOtpCode(e.target.value)}/>
        {otpError && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:10}}>{otpError}</p>}
        <Btn onClick={verifyCode} style={{width:"100%",marginTop:16}} disabled={!otpCode.trim()||verifying}>{verifying?"Verifying...":"Verify & continue"}</Btn>
        <p style={{textAlign:"center",marginTop:14,fontSize:"0.85rem",color:"#aaa"}}>Didn't get it? <span style={{color:"#ff5c3a",cursor:"pointer"}} onClick={resendCode}>Resend</span></p>
        {resendMsg && <p style={{fontSize:"0.78rem",color:"#888",marginTop:6}}>{resendMsg}</p>}
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>goTo("landing")}><Icons.mask size={24}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>unmaskr</span></div>
        <span style={{fontSize:"0.85rem",color:"#888"}}>Have an account? <span style={{color:"#0e0e0e",fontWeight:500,cursor:"pointer",textDecoration:"underline"}} onClick={()=>goTo("login")}>Log in</span></span>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
        <div className="popIn" style={{width:"100%",maxWidth:440}}>
          <div style={{display:"flex",gap:6,marginBottom:36}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:4,borderRadius:2,background:step>=n?"#0e0e0e":"#e0e0e0",transition:"background 0.3s"}}/>)}</div>

          {step===1 && <>
            <h1 className="syne" style={{fontSize:"1.9rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:8}}>Create your account</h1>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:20,fontWeight:300}}>Get your anonymous message link in seconds.</p>
            <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:12,padding:"14px 16px",marginBottom:20,fontSize:"0.82rem",color:"#0369a1",lineHeight:1.7,display:"flex",gap:10,alignItems:"flex-start"}}>
              <Icons.info s={16} c="#0369a1" style={{flexShrink:0,marginTop:2}}/>
              <span><strong>How we use your data:</strong> Your name and email are used only for your account. Gender, birth month, and age group generate anonymous hints only. We never sell your data and your wallet balance never expires.</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Inp placeholder="Your full name" value={form.name} onChange={upd("name")}/>
              <Inp placeholder="Email address" type="email" value={form.email} onChange={upd("email")}/>
              <div>
                <Inp placeholder="Password" type="password" value={form.password} onChange={e=>{upd("password")(e);setPwErr(validatePw(e.target.value));}}/>
                <p style={{fontSize:"0.78rem",color:pwErr?"#ef4444":"#aaa",marginTop:6}}>
                  {pwErr || "Min. 8 characters, include at least one number or symbol"}
                </p>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:10}}>Your country</label>
                <select value={form.country} onChange={upd("country")} style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.95rem",cursor:"pointer"}}>
                  {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>
            </div>
            <Btn onClick={()=>setStep(2)} style={{width:"100%",marginTop:20,padding:"15px"}} disabled={!form.name||!form.email||!form.password||!!validatePw(form.password)}>Continue</Btn>
          </>}

          {step===2 && <>
            <h1 className="syne" style={{fontSize:"1.9rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:8}}>A little about you</h1>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:28,fontWeight:300}}>Only general info is ever shown in hints — never your identity.</p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:10}}>Your gender</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Male","Female","Non-binary","Prefer not to say"].map(g=>(
                    <button key={g} onClick={()=>setForm(f=>({...f,gender:g}))} style={{padding:"9px 14px",borderRadius:50,fontSize:"0.8rem",border:`1.5px solid ${form.gender===g?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:form.gender===g?"#0e0e0e":"white",color:form.gender===g?"white":"#555",cursor:"pointer",transition:"all 0.2s"}}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:10}}>Age group</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {ageGroups.map(a=>(
                    <button key={a} onClick={()=>setForm(f=>({...f,ageGroup:a}))} style={{padding:"9px 14px",borderRadius:50,fontSize:"0.8rem",border:`1.5px solid ${form.ageGroup===a?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:form.ageGroup===a?"#0e0e0e":"white",color:form.ageGroup===a?"white":"#555",cursor:"pointer",transition:"all 0.2s"}}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:10}}>Date of birth</label>
                <Inp type="date" value={form.dob} onChange={upd("dob")}/>
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:"#f8f8f6",borderRadius:10}}>
                <input type="checkbox" checked={form.dobConfirmed} onChange={e=>setForm(f=>({...f,dobConfirmed:e.target.checked}))} style={{marginTop:2,width:16,height:16,flexShrink:0}}/>
                <span style={{fontSize:"0.82rem",color:"#666",lineHeight:1.6}}>I confirm my date of birth is correct and I am at least 16 years old.</span>
              </label>
            </div>
            <Btn onClick={()=>setStep(3)} style={{width:"100%",marginTop:24,padding:"15px"}} disabled={!form.gender||!form.dob||!form.ageGroup||!form.dobConfirmed}>Continue</Btn>
            <div style={{textAlign:"center",marginTop:14}}><span style={{fontSize:"0.85rem",color:"#aaa",cursor:"pointer"}} onClick={()=>setStep(1)}>← Back</span></div>
          </>}

          {step===3 && <>
            <h1 className="syne" style={{fontSize:"1.9rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:8}}>Pick your username</h1>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:32,fontWeight:300}}>This becomes your unique Unmaskr link.</p>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:"0.9rem",color:"#aaa",pointerEvents:"none"}}>unmaskr.com/</div>
              <Inp placeholder="yourname" value={form.username} onChange={upd("username")} style={{paddingLeft:130}}/>
            </div>
            {form.username && <div style={{marginTop:10,padding:"10px 14px",background:"#f0fff4",border:"1px solid #86efac",borderRadius:10,fontSize:"0.83rem",color:"#166534",display:"flex",alignItems:"center",gap:8}}><Icons.check s={14} c="#16a34a"/> unmaskr.com/{form.username} is available!</div>}
            <Btn onClick={handleSignup} style={{width:"100%",marginTop:20,padding:"15px"}} disabled={!form.username||loading}>{loading?"Creating your account...":"Create my link"}</Btn>
{signupError && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:10,textAlign:"center"}}>{signupError}</p>}
            <div style={{textAlign:"center",marginTop:14}}><span style={{fontSize:"0.85rem",color:"#aaa",cursor:"pointer"}} onClick={()=>setStep(2)}>← Back</span></div>
          </>}

          <p style={{textAlign:"center",marginTop:24,fontSize:"0.78rem",color:"#bbb",lineHeight:1.6}}>By signing up you agree to our <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>goTo("terms")}>Terms of Service</span></p>
        </div>
      </div>
    </div>
  );
};

// ── LOGIN ──────────────────────────────────────────────────────────────────────
const Login = ({ goTo, onLoginComplete }) => {
  const [form,setForm] = useState({email:"",password:""});
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);
  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const tryLogin = async () => {
    if(!form.email||!form.password) return;
    setLoading(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) {
      setErr(error.message==="Invalid login credentials" ? "Wrong email or password, please try again." : error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    onLoginComplete && onLoginComplete();
    goTo("inbox");
  };
  return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>goTo("landing")}><Icons.mask size={24}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>unmaskr</span></div>
        <span style={{fontSize:"0.85rem",color:"#888"}}>No account? <span style={{color:"#0e0e0e",fontWeight:500,cursor:"pointer",textDecoration:"underline"}} onClick={()=>goTo("signup")}>Sign up free</span></span>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
        <div className="popIn" style={{width:"100%",maxWidth:400}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <Icons.mask size={44}/>
            <h1 className="syne" style={{fontSize:"1.9rem",fontWeight:800,letterSpacing:"-0.02em",marginTop:16,marginBottom:8}}>Welcome back</h1>
            <p style={{color:"#888",fontSize:"0.9rem",fontWeight:300}}>Log in to see your anonymous messages</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp placeholder="Email address" type="email" value={form.email} onChange={upd("email")}/>
            <Inp placeholder="Password" type="password" value={form.password} onChange={e=>{upd("password")(e);setErr("");}}/>
          </div>
          {err && <div style={{marginTop:10,padding:"10px 14px",background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:10,fontSize:"0.83rem",color:"#ef4444",display:"flex",alignItems:"center",gap:8}}><Icons.warning s={14} c="#ef4444"/>{err}</div>}
          <Btn onClick={tryLogin} style={{width:"100%",marginTop:20,padding:"15px"}} disabled={!form.email||!form.password||loading}>{loading?"Logging in...":"Log in"}</Btn>
          <p style={{textAlign:"center",marginTop:16,fontSize:"0.85rem",color:"#ff5c3a",cursor:"pointer",fontWeight:500}} onClick={()=>goTo("forgot")}>Forgot password?</p>
        </div>
      </div>
    </div>
  );
};

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────────
const ForgotPassword = ({ goTo }) => {
  const [step,setStep] = useState(1);
  const [email,setEmail] = useState("");
  const [code,setCode] = useState("");
  const [newPass,setNewPass] = useState("");
  const [confirmPass,setConfirmPass] = useState("");
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);

  const sendReset = async () => {
    setLoading(true); setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setStep(2);
  };

  const verifyCode = async () => {
    setLoading(true); setErr("");
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setStep(3);
  };

  const resetPassword = async () => {
    if (newPass !== confirmPass) { setErr("Passwords don't match."); return; }
    setLoading(true); setErr("");
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    goTo("login");
  };

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)"}}><BackBtn onClick={()=>goTo("login")}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Reset password</span></div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
        <div className="popIn" style={{width:"100%",maxWidth:400}}>
          {step===1 && <><div style={{width:52,height:52,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><Icons.lock s={24} c="#0e0e0e"/></div>
            <h2 className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:8}}>Forgot your password?</h2>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:28,fontWeight:300}}>Enter your email and we'll send a reset code.</p>
            <Inp placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            {err && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:10}}>{err}</p>}
            <Btn onClick={sendReset} style={{width:"100%",marginTop:16,padding:"15px"}} disabled={!email||loading}>{loading?"Sending...":"Send reset code"}</Btn></>}
          {step===2 && <><div style={{width:52,height:52,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><Icons.mail s={24} c="#0e0e0e"/></div>
            <h2 className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:8}}>Check your email</h2>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:28,fontWeight:300}}>We sent a 6-digit code to <strong>{email}</strong></p>
            <Inp placeholder="Enter 6-digit code" value={code} onChange={e=>setCode(e.target.value)}/>
            {err && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:10}}>{err}</p>}
            <Btn onClick={verifyCode} style={{width:"100%",marginTop:16,padding:"15px"}} disabled={code.length<4||loading}>{loading?"Verifying...":"Verify code"}</Btn>
            <p style={{textAlign:"center",marginTop:14,fontSize:"0.85rem",color:"#aaa"}}>Didn't get it? <span style={{color:"#ff5c3a",cursor:"pointer"}} onClick={sendReset}>Resend</span></p></>}
          {step===3 && <><div style={{width:52,height:52,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><Icons.unlock s={24} c="#0e0e0e"/></div>
            <h2 className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:8}}>New password</h2>
            <p style={{color:"#888",fontSize:"0.9rem",marginBottom:28,fontWeight:300}}>Choose a strong new password.</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Inp placeholder="New password (min 8 chars + number/symbol)" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}/>
              <Inp placeholder="Confirm new password" type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)}/>
            </div>
            {err && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:10}}>{err}</p>}
            <Btn onClick={resetPassword} style={{width:"100%",marginTop:16,padding:"15px"}} disabled={!newPass||newPass.length<8||loading}>{loading?"Saving...":"Reset password"}</Btn></>}
        </div>
      </div>
    </div>
  );
};

// ── TERMS ──────────────────────────────────────────────────────────────────────
const Terms = ({ goTo, fromSend, onAccept }) => (
  <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"20px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)",position:"sticky",top:0,background:"#fafaf8",zIndex:10}}>
      <BackBtn onClick={()=>fromSend?onAccept(false):goTo("landing")}/>
      <span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Terms & Conditions</span>
    </div>
    <div style={{flex:1,maxWidth:680,margin:"0 auto",padding:"40px 28px",width:"100%"}}>
      <div style={{background:"white",borderRadius:20,padding:"32px 28px",border:"1px solid rgba(0,0,0,0.08)",whiteSpace:"pre-wrap",fontSize:"0.88rem",lineHeight:1.9,color:"#444"}}>{TERMS}</div>
      {fromSend && <div style={{display:"flex",gap:12,marginTop:24}}><Btn outline onClick={()=>onAccept(false)} style={{flex:1}}>Decline</Btn><Btn onClick={()=>onAccept(true)} style={{flex:1}}>I Accept</Btn></div>}
    </div>
  </div>
);

// ── INBOX ──────────────────────────────────────────────────────────────────────
const Inbox = ({ goTo, currency, isMinor=false, userId, username="yourname" }) => {
  const cur = currency || CURRENCIES.NG;
  const [messages,setMessages] = useState([]);
  const [loadingMsgs,setLoadingMsgs] = useState(true);

  const fetchMessages = () => {
    if (!userId) { setLoadingMsgs(false); return; }
    setLoadingMsgs(true);
    supabase.from("messages").select("*, message_replies(*)").eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setMessages(data.map(m => ({
          id: m.id,
          text: m.text,
          time: new Date(m.created_at).toLocaleString(),
          read: m.read,
          hints: m.hints_unlocked || [],
          reactions: m.reactions || [],
          replies: (m.message_replies||[]).map(r=>r.text),
          sd: { gender: m.sender_gender, birth: m.sender_birth_period, age: m.sender_age },
          senderEmail: m.sender_email || "",
        })));
        setLoadingMsgs(false);
      });
  };

  useEffect(() => { fetchMessages(); }, [userId]);
  const [activeMsg,setActiveMsg] = useState(null);
  const [copied,setCopied] = useState(false);
  const [activeHints,setActiveHints] = useState([]);
  const [showHints,setShowHints] = useState(false);
  const [showEmoji,setShowEmoji] = useState(false);
  const [replyText,setReplyText] = useState("");
  const [shareMsg,setShareMsg] = useState(null);
  const [receipt,setReceipt] = useState(null);
  const [unlocking,setUnlocking] = useState(false);
  const unread = messages.filter(m=>!m.read).length;

  const openMsg = async msg => {
    if (!msg.read) {
      await supabase.from("messages").update({ read: true }).eq("id", msg.id);
    }
    setMessages(ms=>ms.map(m=>m.id===msg.id?{...m,read:true}:m));
    setActiveMsg({...msg,read:true});
    setActiveHints(getRandHints(msg.hints));
    setShowHints(msg.hints.length>0);
    setReplyText("");
  };

  const unlockHint = async (h, idx) => {
    if (unlocking || !userId) return;
    setUnlocking(true);
    const price = cur.hints[idx] || cur.hints[1];
    const updated = [...activeMsg.hints,h.key];

    // 1. Debit the unlocking user's wallet
    const { data: myWallet } = await supabase.from("wallets").select("balance").eq("user_id", userId).single();
    if (myWallet) {
      await supabase.from("wallets").update({ balance: Number(myWallet.balance) - price, updated_at: new Date().toISOString() }).eq("user_id", userId);
    }

    // 2. Credit the message sender's wallet with their 50% share, if they have an
    // Unmaskr account tied to the email they sent from
    if (activeMsg.senderEmail) {
      const { data: senderProfile } = await supabase.from("profiles").select("id").eq("email", activeMsg.senderEmail).maybeSingle();
      if (senderProfile) {
        const { data: senderWallet } = await supabase.from("wallets").select("balance").eq("user_id", senderProfile.id).single();
        if (senderWallet) {
          await supabase.from("wallets").update({ balance: Number(senderWallet.balance) + price*0.5, updated_at: new Date().toISOString() }).eq("user_id", senderProfile.id);
        }
      }
    }

    // 3. Record the transaction
    await supabase.from("transactions").insert({
      user_id: userId, type: "hint_purchase", amount: price, currency: cur.code, status: "completed",
    });

    // 4. Mark the hint unlocked on the message
    await supabase.from("messages").update({ hints_unlocked: updated }).eq("id", activeMsg.id);

    setActiveMsg(m=>({...m,hints:updated}));
    setMessages(ms=>ms.map(m=>m.id===activeMsg.id?{...m,hints:updated}:m));
    setActiveHints(getRandHints(updated));
    setReceipt({label:h.label, price:`${cur.symbol}${price}`, senderShare:`${cur.symbol}${(price*0.5).toFixed(2)}`, platformFee:`${cur.symbol}${(price*0.5).toFixed(2)}`});
    setUnlocking(false);
  };

  const addReaction = async emoji => {
    const updated = [...activeMsg.reactions,emoji];
    await supabase.from("messages").update({ reactions: updated }).eq("id", activeMsg.id);
    setActiveMsg(m=>({...m,reactions:updated}));
    setMessages(ms=>ms.map(m=>m.id===activeMsg.id?{...m,reactions:updated}:m));
  };

  const sendReply = async () => {
    if(!replyText.trim()) return;
    const filtered = filterText(replyText.trim(), isMinor);
    await supabase.from("message_replies").insert({ message_id: activeMsg.id, text: filtered });
    const updated = [...activeMsg.replies, filtered];
    setActiveMsg(m=>({...m,replies:updated}));
    setMessages(ms=>ms.map(m=>m.id===activeMsg.id?{...m,replies:updated}:m));
    setReplyText("");
  };

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",flexDirection:"column"}}>
      <AppNav goTo={goTo} active="inbox"/>
      <div style={{maxWidth:700,margin:"0 auto",width:"100%",padding:"32px 20px"}}>
        <div className="fadeUp" style={{background:"#0e0e0e",borderRadius:18,padding:"22px 26px",marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div><p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.78rem",fontWeight:500,marginBottom:4}}>YOUR LINK</p><p style={{color:"white",fontSize:"0.95rem",fontWeight:500}}>{window.location.host}/{username}</p></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{navigator.clipboard?.writeText(`${window.location.origin}/${username}`);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{padding:"10px 16px",borderRadius:50,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"white",fontSize:"0.83rem",fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Icons.copy s={14} c="white"/>{copied?"Copied!":"Copy link"}
            </button>
            <button onClick={()=>goTo("send",{username})} style={{padding:"10px 16px",borderRadius:50,border:"none",background:"#ff5c3a",color:"white",fontSize:"0.83rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Icons.eye s={14} c="white"/>Preview
            </button>
          </div>
        </div>
        <div className="fadeUp1" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div><h2 className="syne" style={{fontSize:"1.5rem",fontWeight:800}}>Your Messages</h2>{unread>0&&<p style={{fontSize:"0.83rem",color:"#ff5c3a",marginTop:2}}>{unread} unread</p>}</div>
          <span style={{fontSize:"0.83rem",color:"#aaa"}}>{messages.length} total</span>
        </div>
        {loadingMsgs && <p style={{textAlign:"center",color:"#aaa",padding:"40px 0"}}>Loading messages...</p>}
        {!loadingMsgs && messages.length===0 && (
          <div style={{textAlign:"center",padding:"60px 24px"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Icons.inbox s={28} c="#aaa"/></div>
            <p className="syne" style={{fontWeight:700,fontSize:"1.1rem",marginBottom:8}}>No messages yet</p>
            <p style={{color:"#888",fontSize:"0.9rem",fontWeight:300,marginBottom:24}}>Share your link to start receiving anonymous messages!</p>
            <Btn onClick={()=>{navigator.clipboard?.writeText(`${window.location.origin}/${username}`);setCopied(true);setTimeout(()=>setCopied(false),2000);}}><Icons.copy s={16} c="white"/>{copied?"Copied!":"Copy your link"}</Btn>
          </div>
        )}
        <div className="fadeUp2" style={{display:"flex",flexDirection:"column",gap:10}}>
          {messages.map(msg=>(
            <div key={msg.id} className="msg-row" onClick={()=>openMsg(msg)} style={{background:"white",borderRadius:16,padding:"18px 20px",border:`1px solid ${!msg.read?"rgba(255,92,58,0.25)":"rgba(0,0,0,0.07)"}`,cursor:"pointer",transition:"all 0.18s",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icons.mask size={18}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa"}}>Anonymous</span><span style={{fontSize:"0.75rem",color:"#ccc"}}>{msg.time}</span></div>
                <p style={{fontSize:"0.92rem",color:msg.read?"#555":"#0e0e0e",fontWeight:msg.read?300:500,lineHeight:1.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{msg.text}</p>
                <div style={{display:"flex",gap:10,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>
                  {msg.hints.length>0&&<span style={{fontSize:"0.72rem",color:"#ff5c3a",display:"flex",alignItems:"center",gap:3}}><Icons.unlock s={12} c="#ff5c3a"/>{msg.hints.length} hint{msg.hints.length>1?"s":""}</span>}
                  {msg.reactions.length>0&&<span style={{fontSize:"0.72rem",color:"#888"}}>{msg.reactions.slice(0,3).join(" ")}</span>}
                  {msg.replies.length>0&&<span style={{fontSize:"0.72rem",color:"#888",display:"flex",alignItems:"center",gap:3}}><Icons.reply s={12} c="#888"/>{msg.replies.length} repl{msg.replies.length>1?"ies":"y"}</span>}
                </div>
              </div>
              {!msg.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#ff5c3a",flexShrink:0,marginTop:6}}/>}
            </div>
          ))}
        </div>
      </div>

      {shareMsg&&<ShareModal message={shareMsg} ownerName={username} onClose={()=>setShareMsg(null)}/>}
      {receipt&&<ReceiptModal title="Hint Purchase Receipt" items={[["Item",receipt.label],["Amount",receipt.price],["Status","Paid"],["Sender's share",receipt.senderShare],["Platform fee",receipt.platformFee]]} onClose={()=>setReceipt(null)}/>}

      {activeMsg&&!shareMsg&&!receipt&&(
        <Modal onClose={()=>{setActiveMsg(null);setShowHints(false);setShowEmoji(false);}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Icons.mask size={24}/></div>
          <p style={{textAlign:"center",fontSize:"0.8rem",color:"#aaa",marginBottom:16}}>Anonymous · {activeMsg.time}</p>
          <p style={{fontSize:"1.05rem",lineHeight:1.75,textAlign:"center",color:"#0e0e0e",marginBottom:16}}>{activeMsg.text}</p>
          {activeMsg.reactions.length>0&&<div style={{textAlign:"center",marginBottom:12,fontSize:"1.2rem"}}>{activeMsg.reactions.join(" ")}</div>}

          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:20,position:"relative"}}>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowEmoji(p=>!p)} style={{padding:"8px 14px",borderRadius:50,border:"1.5px solid rgba(0,0,0,0.1)",background:"white",cursor:"pointer",fontSize:"0.85rem",fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
                <Icons.react s={14} c="#555"/>React
              </button>
              {showEmoji&&<EmojiPicker onPick={addReaction} onClose={()=>setShowEmoji(false)}/>}
            </div>
            <button onClick={()=>setShareMsg(activeMsg.text)} style={{padding:"8px 14px",borderRadius:50,border:"1.5px solid rgba(0,0,0,0.1)",background:"white",cursor:"pointer",fontSize:"0.85rem",fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
              <Icons.share s={14} c="#555"/>Share
            </button>
            <button style={{padding:"8px 14px",borderRadius:50,border:"none",background:"transparent",cursor:"pointer",fontSize:"0.85rem",color:"#ff5c3a",fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
              <Icons.flag s={14} c="#ff5c3a"/>Report
            </button>
          </div>

          {activeMsg.replies.length>0&&(
            <div style={{marginBottom:16}}>
              {activeMsg.replies.map((r,i)=>(
                <div key={i} style={{background:"#f0efec",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icons.mask size={14} color="white"/></div>
                  <div><p style={{fontSize:"0.78rem",fontWeight:600,color:"#0e0e0e",marginBottom:3}}>{username} replied:</p><p style={{fontSize:"0.88rem",color:"#444",lineHeight:1.6}}>{r}</p></div>
                </div>
              ))}
            </div>
          )}
          <div style={{marginBottom:20}}>
            <p style={{fontSize:"0.78rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Icons.reply s={14} c="#aaa"/>Reply as {username}</p>
            <div style={{display:"flex",gap:8}}>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your reply..." rows={2} style={{flex:1,padding:"10px 14px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.1)",background:"#fafaf8",fontSize:"0.88rem",resize:"none",lineHeight:1.5}}/>
              <button onClick={sendReply} disabled={!replyText.trim()} style={{padding:"10px 16px",borderRadius:12,border:"none",background:replyText.trim()?"#0e0e0e":"#e0e0e0",color:"white",fontWeight:600,cursor:replyText.trim()?"pointer":"not-allowed",fontSize:"0.83rem"}}>Send</button>
            </div>
          </div>

          {activeMsg.hints.length>0&&(
            <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
              {activeHints.filter(h=>activeMsg.hints.includes(h.key)).map(h=>(
                <div key={h.key} style={{padding:"12px 16px",borderRadius:12,background:"#f0efec",fontSize:"0.88rem",color:"#555",display:"flex",gap:10,alignItems:"center"}}><Icons.unlock s={14} c="#ff5c3a"/>{h.result(activeMsg.sd[h.key]||"")}</div>
              ))}
            </div>
          )}

          <div style={{borderTop:"1px solid rgba(0,0,0,0.07)",paddingTop:20}}>
            {!showHints?(
              <div style={{textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Icons.lock s={22} c="#0e0e0e"/></div>
                <p className="syne" style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>Curious who sent this?</p>
                <p style={{fontSize:"0.85rem",color:"#888",marginBottom:20,fontWeight:300,lineHeight:1.6}}>Unlock a hint to get a general clue about the sender.</p>
                <button onClick={()=>setShowHints(true)} style={{padding:"12px 28px",borderRadius:50,border:"1.5px solid #0e0e0e",background:"white",fontSize:"0.9rem",fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}}>
                  <Icons.unlock s={16} c="#0e0e0e"/>Unlock a hint
                </button>
              </div>
            ):(
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <p className="syne" style={{fontWeight:700,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:6}}><Icons.unlock s={16} c="#0e0e0e"/>Choose a hint</p>
                  <button onClick={()=>setShowHints(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center"}}><Icons.close s={16} c="#aaa"/></button>
                </div>
                <div style={{padding:"12px 14px",background:"#f8f8f6",borderRadius:10,marginBottom:14,fontSize:"0.78rem",color:"#888",lineHeight:1.6,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <Icons.info s={14} c="#aaa"/>Hints show general info only — never the sender's identity. For entertainment only.
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {activeHints.length===0
                    ?<div style={{padding:"16px",background:"#f0efec",borderRadius:12,textAlign:"center",fontSize:"0.88rem",color:"#888",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icons.check s={16} c="#16a34a"/>All available hints unlocked!</div>
                    :activeHints.map((h,idx)=>{
                      const unlocked = activeMsg.hints.includes(h.key);
                      const price = cur.hints[Math.min(idx,cur.hints.length-1)];
                      return (<div key={h.key}>
                        {unlocked
                          ?<div style={{padding:"14px 18px",borderRadius:12,background:"#f0efec",fontSize:"0.88rem",color:"#555",display:"flex",gap:10,alignItems:"center"}}><Icons.unlock s={14} c="#ff5c3a"/>{h.result(activeMsg.sd[h.key]||"")}</div>
                          :<button onClick={()=>unlockHint(h,idx)} disabled={unlocking} style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"white",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:unlocking?"default":"pointer",fontSize:"0.88rem",transition:"all 0.2s",opacity:unlocking?0.6:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <Icons.lock s={16} c="#aaa"/>
                              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}}><span style={{fontWeight:500}}>{h.label}</span><span style={{fontSize:"0.74rem",color:"#aaa"}}>General clue · anonymous</span></div>
                            </div>
                            <span style={{fontWeight:700,color:"#0e0e0e"}}>{unlocking?"...":`${cur.symbol}${price}`}</span>
                          </button>}
                      </div>);
                    })}
                </div>
              </>
            )}
          </div>
          <button onClick={()=>{setActiveMsg(null);setShowHints(false);setShowEmoji(false);}} style={{width:"100%",marginTop:20,padding:"14px",borderRadius:12,border:"none",background:"#f0efec",cursor:"pointer",fontSize:"0.88rem",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icons.close s={16} c="#555"/>Close
          </button>
        </Modal>
      )}
    </div>
  );
};

// ── SEND PAGE ──────────────────────────────────────────────────────────────────
const SendPage = ({ goTo, params, customization, receiverCurrency }) => {
  const username = params?.username||"yourname";
  const theme = THEMES.find(t=>t.key===(customization?.theme||"classic"))||THEMES[0];
  const bgColor = customization?.bgColor||theme.bg;
  const cur = receiverCurrency || CURRENCIES.NG;
  const [msg,setMsg] = useState("");
  const [gender,setGender] = useState("");
  const [birthMonth,setBirthMonth] = useState("");
  const [senderEmail,setSenderEmail] = useState("");
  const [sent,setSent] = useState(false);
  const [termsAccepted,setTermsAccepted] = useState(false);
  const [showTermsRead,setShowTermsRead] = useState(false);
  const MAX = 300;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const isMinor = false;

  const handleSend = async () => {
    const filtered = filterText(msg.trim(), isMinor);
    const { data: recipient } = await supabase.from("public_profiles").select("id").eq("username", username).single();
    if (recipient) {
      await supabase.from("messages").insert({
        recipient_id: recipient.id,
        text: filtered,
        sender_email: senderEmail || null,
        sender_gender: gender || null,
        sender_birth_period: birthMonth || null,
      });
    }
    setSent(true);
  };

  if(showTermsRead) return <Terms goTo={goTo} fromSend onAccept={v=>{setTermsAccepted(v);setShowTermsRead(false);}}/>;
  if(sent) return (
    <div style={{minHeight:"100vh",background:bgColor,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
      <div className="popIn" style={{maxWidth:380}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:theme.accent,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icons.check s={32} c="white"/></div>
        <h2 className="syne" style={{fontSize:"2rem",fontWeight:800,marginBottom:12}}>Message sent!</h2>
        <p style={{color:"#888",fontSize:"0.95rem",lineHeight:1.7,marginBottom:32,fontWeight:300}}>Your anonymous message has been delivered. They'll never know it was you.</p>
        {senderEmail&&<p style={{fontSize:"0.83rem",color:"#888",marginBottom:16,padding:"12px 14px",background:"rgba(0,0,0,0.04)",borderRadius:10}}>We'll email <strong>{senderEmail}</strong> if {username} replies.</p>}
        <Btn onClick={()=>goTo("signup")} style={{width:"100%",padding:"15px",background:theme.accent}}>Create your own Unmaskr link</Btn>
        <p style={{marginTop:16,fontSize:"0.85rem",color:"#aaa",cursor:"pointer"}} onClick={()=>setSent(false)}>Send another</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:bgColor}}>
      <div style={{padding:"18px 28px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:9}}>
        <Icons.mask size={22} color={theme.accent}/><span className="syne" style={{fontWeight:800,fontSize:"1.05rem"}}>unmaskr</span>
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"48px 24px"}}>
        <div className="fadeUp" style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:theme.accent,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Icons.mask size={36} color="white"/></div>
          <h2 className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:6}}>@{username}</h2>
          <p style={{color:"#888",fontSize:"0.9rem",fontWeight:300}}>Send an anonymous message. They won't know it's you.</p>
        </div>
        <div className="fadeUp1" style={{background:theme.card,borderRadius:20,padding:"28px 24px",border:"1px solid rgba(0,0,0,0.08)"}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",display:"block",marginBottom:10}}>Your message</label>
          <textarea placeholder={`Say something honest to @${username}...`} value={msg} onChange={e=>e.target.value.length<=MAX&&setMsg(e.target.value)} rows={4} style={{width:"100%",padding:"14px 16px",borderRadius:14,border:"1.5px solid rgba(0,0,0,0.1)",background:"#fafaf8",fontSize:"0.95rem",resize:"none",lineHeight:1.6}}/>
          <div style={{textAlign:"right",fontSize:"0.75rem",color:msg.length>MAX*0.85?"#ff5c3a":"#ccc",marginTop:4}}>{msg.length}/{MAX}</div>

          <div style={{marginTop:16}}>
            <label style={{fontSize:"0.8rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",display:"block",marginBottom:10}}>Your gender <span style={{fontWeight:300,textTransform:"none",letterSpacing:0}}>(optional)</span></label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Male","Female","Non-binary","Prefer not to say"].map(g=>(
                <button key={g} onClick={()=>setGender(gender===g?"":g)} style={{padding:"8px 14px",borderRadius:50,fontSize:"0.8rem",border:`1.5px solid ${gender===g?theme.accent:"rgba(0,0,0,0.1)"}`,background:gender===g?theme.accent:"white",color:gender===g?"white":"#555",cursor:"pointer",transition:"all 0.2s"}}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{marginTop:16}}>
            <label style={{fontSize:"0.8rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",display:"block",marginBottom:10}}>Birth month <span style={{fontWeight:300,textTransform:"none",letterSpacing:0}}>(optional)</span></label>
            <select value={birthMonth} onChange={e=>setBirthMonth(e.target.value)} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.1)",background:"white",fontSize:"0.9rem",cursor:"pointer"}}>
              <option value="">Select birth month</option>{months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div style={{marginTop:16}}>
            <label style={{fontSize:"0.8rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#aaa",display:"block",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><Icons.mail s={14} c="#aaa"/>Your email <span style={{fontWeight:300,textTransform:"none",letterSpacing:0}}>(optional — get notified if they reply)</span></div>
            </label>
            <Inp placeholder="your@email.com" type="email" value={senderEmail} onChange={e=>setSenderEmail(e.target.value)}/>
            <p style={{fontSize:"0.73rem",color:"#aaa",marginTop:5,display:"flex",alignItems:"center",gap:4}}><Icons.info s={12} c="#aaa"/>Unmaskr will email you if {username} replies. Your email stays private.</p>
          </div>

          <div style={{marginTop:20,padding:"14px 16px",background:"#f8f8f6",borderRadius:12,display:"flex",alignItems:"flex-start",gap:12}}>
            <input type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} style={{marginTop:2,cursor:"pointer",width:16,height:16,flexShrink:0}}/>
            <p style={{fontSize:"0.83rem",color:"#666",lineHeight:1.6}}>I accept the <span style={{color:theme.accent,textDecoration:"underline",cursor:"pointer",fontWeight:500}} onClick={()=>setShowTermsRead(true)}>Terms & Conditions</span>. My message is anonymous.</p>
          </div>

          <Btn onClick={handleSend} style={{width:"100%",marginTop:16,padding:"15px",background:theme.accent}} disabled={!msg.trim()||!termsAccepted}>
            <Icons.share s={16} c="white"/>Send anonymously
          </Btn>
          <p style={{textAlign:"center",marginTop:12,fontSize:"0.78rem",color:"#ccc",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icons.lock s={12} c="#ccc"/>100% anonymous · Your identity is never revealed</p>
        </div>
        <div className="fadeUp2" style={{marginTop:28,textAlign:"center"}}>
          <p style={{fontSize:"0.85rem",color:"#888",marginBottom:14}}>Want your own anonymous message link?</p>
          <Btn outline onClick={()=>goTo("signup")} style={{fontSize:"0.85rem",padding:"10px 22px"}}>Create yours free</Btn>
        </div>
      </div>
    </div>
  );
};

// ── STATS ──────────────────────────────────────────────────────────────────────
const Stats = ({ goTo, userId }) => {
  const [loading,setLoading] = useState(true);
  const [totalMessages,setTotalMessages] = useState(0);
  const [hintsUnlocked,setHintsUnlocked] = useState(0);
  const [walletEarned,setWalletEarned] = useState(0);
  const [weekData,setWeekData] = useState([{d:"Mon",m:0},{d:"Tue",m:0},{d:"Wed",m:0},{d:"Thu",m:0},{d:"Fri",m:0},{d:"Sat",m:0},{d:"Sun",m:0}]);
  const [topMessage,setTopMessage] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetchStats = async () => {
      setLoading(true);
      const { data: msgs } = await supabase.from("messages").select("id, text, hints_unlocked, reactions, created_at").eq("recipient_id", userId);
      const { data: earnings } = await supabase.from("transactions").select("amount").eq("user_id", userId).eq("type","hint_earning").eq("status","completed");

      const all = msgs || [];
      setTotalMessages(all.length);
      setHintsUnlocked(all.reduce((s,m)=>s+(m.hints_unlocked?.length||0),0));
      setWalletEarned((earnings||[]).reduce((s,t)=>s+Number(t.amount),0));

      const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
      const buckets = [...Array(7)].map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d; });
      setWeekData(buckets.map((d,i)=>({ d: days[i], m: all.filter(m=>new Date(m.created_at).toDateString()===d.toDateString()).length })));

      const mostLoved = [...all].sort((a,b)=>(b.reactions?.length||0)+(b.hints_unlocked?.length||0)-((a.reactions?.length||0)+(a.hints_unlocked?.length||0)))[0];
      setTopMessage(mostLoved || null);
      setLoading(false);
    };
    fetchStats();
  }, [userId]);

  const maxM = Math.max(1, ...weekData.map(x=>x.m));
  const stats = [
    {l:"Total Messages",v:String(totalMessages),s:"All time",icon:<Icons.chat s={22} c="#0e0e0e"/>,c:"#f0efec"},
    {l:"Hints Unlocked",v:String(hintsUnlocked),s:"On your messages",icon:<Icons.unlock s={22} c="#f97316"/>,c:"#fff8f0"},
    {l:"Wallet Earned",v:`₦${walletEarned.toLocaleString()}`,s:"From hint purchases",icon:<Icons.money s={22} c="#16a34a"/>,c:"#f0fff4"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <AppNav goTo={goTo} active="stats"/>
      <div style={{maxWidth:700,margin:"0 auto",padding:"32px 20px"}}>
        <div className="fadeUp"><Tag text="Your activity"/><h2 className="syne" style={{fontSize:"1.8rem",fontWeight:800,marginBottom:28}}>Stats & Insights</h2></div>
        {loading && <p style={{textAlign:"center",color:"#aaa",padding:"20px 0"}}>Loading...</p>}
        <div className="fadeUp1" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:28}}>
          {stats.map(s=>(
            <div key={s.l} style={{background:s.c,borderRadius:16,padding:"20px 18px",border:"1px solid rgba(0,0,0,0.06)"}}>
              <div style={{marginBottom:10}}>{s.icon}</div>
              <div className="syne" style={{fontSize:"1.6rem",fontWeight:800,marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:"0.8rem",fontWeight:600,marginBottom:2}}>{s.l}</div>
              <div style={{fontSize:"0.72rem",color:"#888"}}>{s.s}</div>
            </div>
          ))}
        </div>
        <div className="fadeUp2" style={{background:"white",borderRadius:20,padding:"24px",border:"1px solid rgba(0,0,0,0.07)",marginBottom:20}}>
          <p className="syne" style={{fontWeight:700,fontSize:"0.9rem",marginBottom:20,display:"flex",alignItems:"center",gap:6}}><Icons.stats s={16} c="#0e0e0e"/>Messages this week</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:120}}>
            {weekData.map(d=>(
              <div key={d.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{width:"100%",background:d.m===maxM&&d.m>0?"#0e0e0e":"#f0efec",borderRadius:6,height:`${(d.m/maxM)*100}px`,transition:"height 0.4s ease",minHeight:8}}/>
                <span style={{fontSize:"0.72rem",color:"#aaa"}}>{d.d}</span>
              </div>
            ))}
          </div>
        </div>
        {topMessage && (
          <div className="fadeUp3" style={{background:"#0e0e0e",borderRadius:20,padding:"24px",color:"white"}}>
            <p style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Icons.star s={12} c="rgba(255,255,255,0.4)"/>Most loved message</p>
            <p style={{fontSize:"1.05rem",lineHeight:1.7,color:"rgba(255,255,255,0.85)"}}>"{topMessage.text}"</p>
            <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.3)",marginTop:10}}>{timeAgoLite(topMessage.created_at)} · {topMessage.hints_unlocked?.length||0} hints unlocked</p>
          </div>
        )}
      </div>
    </div>
  );
};
const timeAgoLite = (iso) => {
  if (!iso) return "";
  const mins = Math.floor((Date.now()-new Date(iso).getTime())/60000);
  if (mins<1) return "Just now";
  if (mins<60) return `${mins}m ago`;
  const hrs = Math.floor(mins/60);
  if (hrs<24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
};

// ── WALLET ─────────────────────────────────────────────────────────────────────
const Wallet = ({ goTo, currency, userId, userName }) => {
  const cur = currency || CURRENCIES.NG;
  const [tab,setTab] = useState("overview");
  const [amount,setAmount] = useState("");
  const [wMethod,setWMethod] = useState("");
  const [tMethod,setTMethod] = useState("");
  const [phone,setPhone] = useState("");
  const [acct,setAcct] = useState("");
  const [bankName,setBankName] = useState("");
  const [acctName,setAcctName] = useState("");
  const [transferRef,setTransferRef] = useState("");
  const [done,setDone] = useState(false);
  const [receipt,setReceipt] = useState(null);
  const [filter,setFilter] = useState("all");
  const [submitting,setSubmitting] = useState(false);
  const [balance,setBalance] = useState(0);
  const [txns,setTxns] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchWallet = async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", userId).single();
    setBalance(wallet ? Number(wallet.balance) : 0);
    const { data: tx } = await supabase.from("transactions").select("id, type, amount, status, created_at").eq("user_id", userId).order("created_at",{ascending:false});
    setTxns((tx||[]).map(t => ({
      type: (t.type==="hint_purchase"||t.type==="withdrawal") ? "debit" : "credit",
      label: t.type==="hint_purchase"?"Hint unlocked":t.type==="hint_earning"?"Hint purchased on your message":t.type==="withdrawal"?"Withdrawal":t.type==="deposit"?"Wallet top-up":t.type,
      amount: Number(t.amount),
      time: timeAgoLite(t.created_at),
      cat: t.type==="withdrawal"?"withdrawal":(t.type==="hint_purchase"||t.type==="hint_earning")?"hint":"other",
      status: t.status,
    })));
    setLoading(false);
  };
  useEffect(() => { fetchWallet(); }, [userId]);

  const filtered = filter==="all"?txns:txns.filter(t=>t.cat===filter);
  const makeRef = () => "UNM-"+(Math.random()*9999|0).toString().padStart(4,"0");

  const finishWithdraw = async () => {
    if (!userId || submitting) return;
    setSubmitting(true);
    const ref = makeRef();
    await supabase.from("transactions").insert({
      user_id: userId, type: "withdrawal", amount: Number(amount), currency: cur.code,
      status: "pending", reference: ref,
      bank_name: wMethod==="bank" ? bankName : "Airtime", account_number: wMethod==="bank" ? acct : phone, account_name: acctName,
    });
    setSubmitting(false);
    setDone(true);
    setReceipt({
      title:"Withdrawal Receipt",
      items:[
        ["Amount",`${cur.symbol}${amount}`],
        ["Method",wMethod==="airtime"?"Airtime":"Bank Transfer"],
        ["Status","Pending admin approval"],
        ["Reference",ref],
        ["Note","Your admin reviews and approves withdrawals — you'll be emailed once it's paid."],
      ]
    });
  };

  const finishTopup = async () => {
    if (!userId || submitting) return;
    setSubmitting(true);
    const ref = transferRef || makeRef();
    await supabase.from("transactions").insert({
      user_id: userId, type: "deposit", amount: Number(amount)||0, currency: cur.code,
      status: "pending", reference: ref,
    });
    setSubmitting(false);
    setDone(true);
    setReceipt({
      title:"Top-up Receipt",
      items:[
        ["Amount",`${cur.symbol}${amount||"—"}`],
        ["Method",tMethod==="airtime"?"Airtime":tMethod==="card"?"Card":"Bank Transfer"],
        ["Status","Pending confirmation"],
        ["Reference",ref],
        ["Note","We'll confirm your transfer and credit your wallet shortly — you'll get an email once it's done."],
      ]
    });
  };

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <AppNav goTo={goTo} active="wallet"/>
      {receipt&&<ReceiptModal title={receipt.title} items={receipt.items} onClose={()=>{setReceipt(null);fetchWallet();}}/>}
      <div style={{maxWidth:680,margin:"0 auto",padding:"32px 20px"}}>
        <div className="fadeUp" style={{background:"#0e0e0e",borderRadius:24,padding:"32px 28px",marginBottom:24,color:"white"}}>
          <p style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <Icons.wallet s={14} c="rgba(255,255,255,0.4)"/>Available balance
          </p>
          <div className="syne" style={{fontSize:"2.8rem",fontWeight:800,marginBottom:4}}>{loading?"...":`${cur.symbol}${balance.toLocaleString()}`}</div>
          <p style={{fontSize:"0.83rem",color:"rgba(255,255,255,0.4)"}}>50% of all hint purchases on your messages go here. Balance never expires — even unclaimed funds remain yours to withdraw years from now.</p>
          <div style={{display:"flex",gap:10,marginTop:24}}>
            <button onClick={()=>{setTab("withdraw");setDone(false);}} style={{flex:1,padding:"12px",borderRadius:50,border:"none",background:"#ff5c3a",color:"white",fontWeight:600,cursor:"pointer",fontSize:"0.88rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Icons.withdraw s={16} c="white"/>Withdraw
            </button>
            <button onClick={()=>{setTab("topup");setDone(false);}} style={{flex:1,padding:"12px",borderRadius:50,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"white",fontWeight:500,cursor:"pointer",fontSize:"0.88rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Icons.deposit s={16} c="white"/>Top up
            </button>
          </div>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {["overview","withdraw","topup"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setDone(false);}} style={{padding:"8px 16px",borderRadius:50,border:`1px solid ${tab===t?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:tab===t?"#0e0e0e":"transparent",color:tab===t?"white":"#555",cursor:"pointer",fontSize:"0.83rem",fontWeight:500}}>
              {t==="topup"?"Top up":t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {tab==="overview"&&(
          <div className="fadeUp">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <p className="syne" style={{fontWeight:700,display:"flex",alignItems:"center",gap:6}}><Icons.receipt s={16} c="#0e0e0e"/>Transaction history</p>
              <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"6px 12px",borderRadius:50,border:"1px solid rgba(0,0,0,0.1)",background:"white",fontSize:"0.8rem",cursor:"pointer"}}>
                <option value="all">All</option>
                <option value="hint">Hints</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="other">Top-ups</option>
              </select>
            </div>
            {loading && <p style={{textAlign:"center",color:"#aaa",padding:"20px 0"}}>Loading...</p>}
            {!loading && filtered.length===0 && <p style={{textAlign:"center",color:"#aaa",padding:"20px 0"}}>No transactions yet.</p>}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtered.map((t,i)=>(
                <div key={i} style={{background:"white",borderRadius:14,padding:"16px 18px",border:"1px solid rgba(0,0,0,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:t.type==="credit"?"#f0fff4":"#fff5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {t.type==="credit"?<Icons.deposit s={16} c="#16a34a"/>:<Icons.withdraw s={16} c="#ef4444"/>}
                    </div>
                    <div>
                      <p style={{fontSize:"0.88rem",fontWeight:500,marginBottom:2}}>{t.label} {t.status==="pending"&&<span style={{color:"#f59e0b",fontSize:"0.75rem"}}>(pending)</span>}</p>
                      <p style={{fontSize:"0.75rem",color:"#aaa"}}>{t.time}</p>
                    </div>
                  </div>
                  <span style={{fontWeight:700,fontSize:"0.92rem",color:t.type==="credit"?"#166534":"#991b1b"}}>
                    {t.type==="credit"?"+":"-"}{cur.symbol}{Math.abs(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="withdraw"&&(
          <div className="fadeUp">
            {done?(
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"#f0fff4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <Icons.check s={28} c="#16a34a"/>
                </div>
                <h3 className="syne" style={{fontSize:"1.4rem",fontWeight:800,marginBottom:8}}>Withdrawal requested!</h3>
                <p style={{color:"#888",fontWeight:300,marginBottom:8}}>Your request has been sent for approval.</p>
                <p style={{fontSize:"0.83rem",color:"#aaa",marginBottom:20}}>You'll receive an email once it's paid.</p>
                <Btn onClick={()=>setReceipt(receipt)}><Icons.receipt s={16} c="white"/>View Receipt</Btn>
              </div>
            ):<>
              <h3 className="syne" style={{fontSize:"1.2rem",fontWeight:800,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                <Icons.withdraw s={20} c="#0e0e0e"/>Withdraw funds
              </h3>
              <p style={{fontSize:"0.85rem",color:"#888",marginBottom:20,fontWeight:300}}>Minimum: {cur.symbol}100 · Reviewed and approved by an admin before payout.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {[{k:"bank",l:"Bank Transfer",d:"To your bank account",i:<Icons.bank s={16}/>},{k:"airtime",l:"Airtime",d:"To your phone",i:<Icons.phone s={16}/>}].map(m=>(
                  <button key={m.k} onClick={()=>setWMethod(m.k)} style={{padding:"14px 18px",borderRadius:14,border:`1.5px solid ${wMethod===m.k?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:wMethod===m.k?"#0e0e0e":"white",color:wMethod===m.k?"white":"#0e0e0e",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12}}>
                    <span style={{opacity:wMethod===m.k?1:0.5}}>{m.i}</span>
                    <div>
                      <p style={{fontWeight:600,fontSize:"0.92rem",marginBottom:2}}>{m.l}</p>
                      <p style={{fontSize:"0.78rem",color:wMethod===m.k?"rgba(255,255,255,0.55)":"#aaa"}}>{m.d}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Amount</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>{cur.symbol}</span>
                  <Inp placeholder="100" value={amount} onChange={e=>setAmount(e.target.value)} style={{paddingLeft:36}}/>
                </div>
                <p style={{fontSize:"0.78rem",color:"#aaa",marginTop:6}}>Min: {cur.symbol}100 · Available: {cur.symbol}{balance.toLocaleString()}</p>
              </div>
              {wMethod==="bank"&&(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Inp placeholder="Account number" value={acct} onChange={e=>setAcct(e.target.value)}/>
                  <Inp placeholder="Bank name" value={bankName} onChange={e=>setBankName(e.target.value)}/>
                  <Inp placeholder="Account holder name" value={acctName} onChange={e=>setAcctName(e.target.value)}/>
                </div>
              )}
              {wMethod==="airtime"&&(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <select style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.95rem",cursor:"pointer"}}>
                    {COUNTRIES.map(c=><option key={c.code}>{c.flag} {c.name} ({c.phone})</option>)}
                  </select>
                  <Inp placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)}/>
                  <div style={{padding:"12px 14px",background:"#f0efec",borderRadius:10,fontSize:"0.78rem",color:"#666",lineHeight:1.6,display:"flex",gap:8}}>
                    <Icons.info s={14} c="#888"/>Airtime withdrawals powered by our airtime partner. A small conversion fee may apply.
                  </div>
                </div>
              )}
              <Btn onClick={finishWithdraw} style={{width:"100%",marginTop:20,padding:"15px"}} disabled={!amount||Number(amount)<100||Number(amount)>balance||!wMethod||(wMethod==="bank"&&(!acct||!bankName))||(wMethod==="airtime"&&!phone)||submitting}>
                <Icons.withdraw s={16} c="white"/>{submitting?"Submitting...":(wMethod==="airtime"?"Withdraw as airtime":"Request withdrawal")}
              </Btn>
            </>}
          </div>
        )}

        {tab==="topup"&&(
          <div className="fadeUp">
            {done?(
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"#f0fff4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <Icons.check s={28} c="#16a34a"/>
                </div>
                <h3 className="syne" style={{fontSize:"1.4rem",fontWeight:800,marginBottom:8}}>Top-up submitted!</h3>
                <p style={{color:"#888",fontWeight:300,marginBottom:8}}>We'll confirm your transfer and credit your wallet shortly.</p>
                <p style={{fontSize:"0.83rem",color:"#aaa",marginBottom:20}}>Not credited within a day? Contact support with your reference number.</p>
                <Btn onClick={()=>setReceipt(receipt)}><Icons.receipt s={16} c="white"/>View Receipt</Btn>
              </div>
            ):<>
              <h3 className="syne" style={{fontSize:"1.2rem",fontWeight:800,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
                <Icons.deposit s={20} c="#0e0e0e"/>Top up your wallet
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
                {[{k:"transfer",l:"Bank Transfer",d:"Transfer to Unmaskr account, confirmed by our team",i:<Icons.bank s={16}/>},{k:"airtime",l:"Airtime",d:"Deducted from your phone (coming soon)",i:<Icons.phone s={16}/>},{k:"card",l:"Card",d:"Debit or credit card (coming soon)",i:<Icons.card s={16}/>}].map(m=>(
                  <button key={m.k} onClick={()=>setTMethod(m.k)} style={{padding:"14px 18px",borderRadius:14,border:`1.5px solid ${tMethod===m.k?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:tMethod===m.k?"#0e0e0e":"white",color:tMethod===m.k?"white":"#0e0e0e",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12}}>
                    <span style={{opacity:tMethod===m.k?1:0.5}}>{m.i}</span>
                    <div>
                      <p style={{fontWeight:600,fontSize:"0.92rem",marginBottom:2}}>{m.l}</p>
                      <p style={{fontSize:"0.78rem",color:tMethod===m.k?"rgba(255,255,255,0.6)":"#aaa"}}>{m.d}</p>
                    </div>
                  </button>
                ))}
              </div>
              {tMethod&&tMethod!=="transfer"&&(
                <div style={{padding:"14px",background:"#fff8f0",border:"1px solid rgba(255,92,58,0.2)",borderRadius:12,fontSize:"0.83rem",color:"#888",display:"flex",gap:8}}>
                  <Icons.warning s={14} c="#f97316"/>This payment method isn't connected to a real payment processor yet — use Bank Transfer for now.
                </div>
              )}
              {tMethod==="transfer"&&(
                <div>
                  <div style={{padding:"16px",background:"#f0efec",borderRadius:12,marginBottom:12}}>
                    <p style={{fontWeight:600,fontSize:"0.88rem",marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Icons.bank s={14} c="#0e0e0e"/>Transfer details:</p>
                    <p style={{fontSize:"0.85rem",color:"#555",marginBottom:4}}>Bank: <strong>[Your business bank name]</strong></p>
                    <p style={{fontSize:"0.85rem",color:"#555",marginBottom:4}}>Account: <strong>[Your business account number]</strong></p>
                    <p style={{fontSize:"0.85rem",color:"#555"}}>Name: <strong>[Your business account name]</strong></p>
                    <p style={{fontSize:"0.72rem",color:"#aaa",marginTop:8}}>⚠️ Placeholder — replace with your real business account details before launch.</p>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Amount you sent</label>
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>{cur.symbol}</span>
                      <Inp placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} style={{paddingLeft:36}}/>
                    </div>
                  </div>
                  <Inp placeholder="Your transfer reference" value={transferRef} onChange={e=>setTransferRef(e.target.value)}/>
                  <Btn onClick={finishTopup} style={{width:"100%",marginTop:12,padding:"15px"}} disabled={!amount||submitting}>
                    <Icons.check s={16} c="white"/>{submitting?"Submitting...":"I've made the transfer"}
                  </Btn>
                </div>
              )}
            </>}
          </div>
        )}
      </div>
    </div>
  );
};

// ── GAMES ──────────────────────────────────────────────────────────────────────
// NOTE: Mystery Lobby and Stake & Win below are still fully simulated — no real
// multiplayer backend exists yet (no games/sessions table). Left as-is per the
// agreed plan; revisit once that backend design is scoped out.
const Games = ({ goTo }) => (
  <div style={{minHeight:"100vh",background:"#fafaf8"}}>
    <AppNav goTo={goTo} active="games"/>
    <div style={{maxWidth:700,margin:"0 auto",padding:"40px 24px"}}>
      <div className="fadeUp">
        <Tag text="Games"/>
        <h2 className="syne" style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:8}}>Play with friends</h2>
        <p style={{color:"#666",fontSize:"0.9rem",marginBottom:36,fontWeight:300}}>Fun games for picnics, hangouts and sleepovers.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div className="game-card fadeUp1" onClick={()=>goTo("game-lobby")} style={{background:"white",borderRadius:20,padding:"28px 24px",border:"1px solid rgba(0,0,0,0.08)",cursor:"pointer",transition:"all 0.2s",display:"flex",gap:20,alignItems:"center"}}>
          <div style={{width:64,height:64,borderRadius:18,background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icons.mask size={32}/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <h3 className="syne" style={{fontSize:"1.1rem",fontWeight:800}}>Mystery Lobby</h3>
              <span style={{background:"#0e0e0e",color:"white",fontSize:"0.68rem",fontWeight:700,padding:"3px 10px",borderRadius:50}}>For everyone</span>
            </div>
            <p style={{fontSize:"0.88rem",color:"#666",lineHeight:1.6,fontWeight:300}}>Host shares a link. Players pick preferences. Guess what others picked or get eliminated!</p>
          </div>
          <Icons.chevron s={20} c="#ccc"/>
        </div>
        <div className="game-card fadeUp2" onClick={()=>goTo("game-stake")} style={{background:"#0e0e0e",borderRadius:20,padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",display:"flex",gap:20,alignItems:"center"}}>
          <div style={{width:64,height:64,borderRadius:18,background:"rgba(255,205,60,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icons.trophy s={32} c="#ffcd3c"/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <h3 className="syne" style={{fontSize:"1.1rem",fontWeight:800,color:"white"}}>Stake & Win</h3>
              <span style={{background:"#ff5c3a",color:"white",fontSize:"0.68rem",fontWeight:700,padding:"3px 10px",borderRadius:50}}>18+ only</span>
            </div>
            <p style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6,fontWeight:300}}>Pick topics, difficulty and question count. Bet real money. Winner takes 85%.</p>
          </div>
          <Icons.chevron s={20} c="rgba(255,255,255,0.3)"/>
        </div>
      </div>
    </div>
  </div>
);

// ── MYSTERY LOBBY (still simulated) ────────────────────────────────────────────
const AVATAR_COLORS = ["#0e0e0e","#ff5c3a","#6366f1","#059669","#d97706","#ec4899"];
const GameLobby = ({ goTo }) => {
  const [phase,setPhase] = useState("setup");
  const [players] = useState([
    {id:1,name:"You (Host)",prefs:["Pizza","Dogs","Netflix"],ready:true},
    {id:2,name:"Temi",prefs:["Sushi","Cats","Spotify"],ready:true},
    {id:3,name:"Kolade",prefs:["Burger","Dogs","Netflix"],ready:false},
    {id:4,name:"Sade",prefs:["Pizza","Cats","YouTube"],ready:true},
  ]);
  const [round,setRound] = useState(0);
  const [guess,setGuess] = useState("");
  const [lives,setLives] = useState(3);
  const [copied,setCopied] = useState(false);
  const [timeLeft,setTimeLeft] = useState(30);
  const [answered,setAnswered] = useState(false);
  const timerRef = useRef(null);
  const lobbyCode = "UNMSK-4829";
  const categories = [
    {q:"Favourite food?",opts:["Pizza","Sushi","Burger","Jollof Rice","Pasta"]},
    {q:"Favourite pet?",opts:["Dogs","Cats","Birds","Fish","None"]},
    {q:"Favourite streaming?",opts:["Netflix","Spotify","YouTube","Apple TV","None"]},
  ];

  useEffect(()=>{
    if(phase!=="playing"||answered) return;
    setTimeLeft(30);
    timerRef.current = setInterval(()=>setTimeLeft(t=>{
      if(t<=1){clearInterval(timerRef.current);setLives(l=>l-1);setAnswered(true);return 0;}
      return t-1;
    }),1000);
    return ()=>clearInterval(timerRef.current);
  },[phase,round,answered]);

  const nextRound = () => {
    clearInterval(timerRef.current);
    if(lives<=0){setPhase("result");return;}
    setRound(r=>r+1);setGuess("");setAnswered(false);
  };

  if(phase==="setup") return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <div style={{padding:"20px 28px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <BackBtn onClick={()=>goTo("games")}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Mystery Lobby</span>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"40px 24px"}}>
        <div className="fadeUp" style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Icons.mask size={32}/></div>
          <h2 className="syne" style={{fontSize:"1.8rem",fontWeight:800,marginBottom:8}}>Create a Lobby</h2>
          <p style={{color:"#888",fontSize:"0.9rem",fontWeight:300}}>Share the lobby code with friends. Game starts when everyone is ready!</p>
        </div>
        <div style={{background:"white",borderRadius:20,padding:"28px 24px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:20}}>
          <p style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Lobby Code</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span className="syne" style={{fontSize:"1.6rem",fontWeight:800,letterSpacing:"0.1em"}}>{lobbyCode}</span>
            <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{padding:"8px 14px",borderRadius:50,border:"1px solid rgba(0,0,0,0.12)",background:"transparent",cursor:"pointer",fontSize:"0.83rem",display:"flex",alignItems:"center",gap:6}}>
              <Icons.copy s={14} c="#555"/>{copied?"Copied!":"Copy"}
            </button>
          </div>
        </div>
        <div style={{background:"white",borderRadius:20,padding:"24px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:20}}>
          <p style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:16}}>Players ({players.length}/8)</p>
          {players.map((p,i)=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <Avatar size={30} bg={AVATAR_COLORS[i%AVATAR_COLORS.length]} iconSize={16}/>
              <span style={{flex:1,fontSize:"0.92rem",fontWeight:500}}>{p.name}</span>
              <span style={{fontSize:"0.78rem",color:p.ready?"#16a34a":"#aaa",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                {p.ready?<><Icons.check s={12} c="#16a34a"/>Ready</>:"Picking..."}
              </span>
            </div>
          ))}
        </div>
        <Btn onClick={()=>setPhase("playing")} style={{width:"100%",padding:"15px"}}>
          <Icons.games s={18} c="white"/>Start Game
        </Btn>
      </div>
    </div>
  );

  if(phase==="playing") {
    const cat = categories[round%categories.length];
    const targetIdx = (round%(players.length-1))+1;
    const target = players[targetIdx];
    const targetColor = AVATAR_COLORS[targetIdx%AVATAR_COLORS.length];
    const tc = timeLeft>15?"#22c55e":timeLeft>7?"#f59e0b":"#ef4444";
    return (
      <div style={{minHeight:"100vh",background:"#fafaf8"}}>
        <div style={{padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
          <span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Round {round+1}</span>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:timeLeft<=7?"#fff5f5":"#f0efec",padding:"6px 12px",borderRadius:50}}>
              <Icons.timer s={16} c={tc}/>
              <span className="syne" style={{fontWeight:800,fontSize:"1rem",color:tc}}>{timeLeft}s</span>
            </div>
            <div style={{display:"flex",gap:4}}>{[...Array(3)].map((_,i)=><Icons.heart key={i} s={18} c={i<lives?"#ff5c3a":"#e5e5e5"}/>)}</div>
          </div>
        </div>
        <div style={{height:4,background:"#f0efec"}}><div style={{height:"100%",width:`${(timeLeft/30)*100}%`,background:tc,transition:"width 1s linear,background 0.3s"}}/></div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"32px 24px"}}>
          <div className="fadeUp" style={{background:"#0e0e0e",borderRadius:20,padding:"24px",marginBottom:24,textAlign:"center"}}>
            <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Avatar size={48} bg={targetColor} iconSize={24}/></div>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",marginBottom:4}}>Guess about</p>
            <p style={{color:"white",fontSize:"1.1rem",fontWeight:700}}>{target.name}</p>
          </div>
          <div className="fadeUp1" style={{background:"white",borderRadius:20,padding:"24px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:20}}>
            <h3 className="syne" style={{fontSize:"1.1rem",fontWeight:800,marginBottom:18}}>{cat.q}</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {cat.opts.map(opt=>(
                <button key={opt} onClick={()=>!answered&&setGuess(opt)} style={{padding:"14px 18px",borderRadius:12,border:`1.5px solid ${guess===opt?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:answered&&target.prefs.includes(opt)?"#f0fff4":guess===opt?"#0e0e0e":"white",color:guess===opt?"white":"#0e0e0e",cursor:answered?"default":"pointer",fontSize:"0.92rem",fontWeight:500,textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  {opt}{answered&&target.prefs.includes(opt)&&<Icons.check s={16} c="#16a34a"/>}
                </button>
              ))}
            </div>
          </div>
          {!answered
            ?<Btn onClick={()=>{clearInterval(timerRef.current);if(!target.prefs.includes(guess))setLives(l=>l-1);setAnswered(true);}} style={{width:"100%",padding:"15px"}} disabled={!guess}>Submit Guess</Btn>
            :<div className="popIn">
              <div style={{padding:"20px",background:target.prefs.includes(guess)?"#f0fff4":"#fff5f5",border:`1px solid ${target.prefs.includes(guess)?"#86efac":"#fca5a5"}`,borderRadius:12,marginBottom:16,textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                  {timeLeft===0?<Icons.timer s={22} c="#f59e0b"/>:target.prefs.includes(guess)?<Icons.check s={22} c="#16a34a"/>:<Icons.close s={22} c="#ef4444"/>}
                </div>
                <p style={{fontWeight:700,fontSize:"1rem",marginBottom:4}}>{timeLeft===0?"Time's up!":(target.prefs.includes(guess)?"Correct!":"Wrong!")}</p>
                <p style={{fontSize:"0.85rem",color:"#555"}}>Answer: {target.prefs[0]}</p>
              </div>
              <Btn onClick={nextRound} style={{width:"100%",padding:"15px"}}>{lives<=0?"See results":"Next round"}</Btn>
            </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
      <div className="popIn">
        <div style={{width:80,height:80,borderRadius:"50%",background:lives>0?"#f0fff4":"#fff5f5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          {lives>0?<Icons.trophy s={36} c="#16a34a"/>:<Icons.close s={36} c="#ef4444"/>}
        </div>
        <h2 className="syne" style={{fontSize:"2rem",fontWeight:800,marginBottom:12}}>{lives>0?"You survived!":"Eliminated!"}</h2>
        <p style={{color:"#888",marginBottom:32,fontWeight:300}}>{lives>0?"You made it through all the rounds!":"You ran out of guesses."}</p>
        <Btn onClick={()=>{setPhase("setup");setLives(3);setRound(0);setGuess("");setAnswered(false);}} style={{marginBottom:12}}>Play again</Btn><br/>
        <Btn outline onClick={()=>goTo("games")} style={{marginTop:10}}>Back to games</Btn>
      </div>
    </div>
  );
};

// ── STAKE & WIN (still simulated) ──────────────────────────────────────────────
const GameStake = ({ goTo, currency, is18Plus }) => {
  const cur = currency || CURRENCIES.NG;
  const [selfAttested,setSelfAttested] = useState(false);
  const ageKnownAdult = is18Plus===true || selfAttested;

  const [phase,setPhase] = useState("setup");
  const [selectedTopics,setSelectedTopics] = useState([]);
  const [difficulty,setDifficulty] = useState("medium");
  const [questionCount,setQuestionCount] = useState(10);
  const [stakeAmount,setStakeAmount] = useState("");
  const [paymentMethod,setPaymentMethod] = useState("");
  const [phone,setPhone] = useState("");
  const [termsAccepted,setTermsAccepted] = useState(false);
  const [questions,setQuestions] = useState([]);
  const [qIndex,setQIndex] = useState(0);
  const [myScore,setMyScore] = useState(0);
  const [answered,setAnswered] = useState(null);
  const [showAnswer,setShowAnswer] = useState(false);
  const [tieChoice,setTieChoice] = useState(null);
  const [lobbyCopied,setLobbyCopied] = useState(false);
  const [expectedPlayers,setExpectedPlayers] = useState(3);
  const [players,setPlayers] = useState([]);
  const [simulatedScores,setSimulatedScores] = useState([]);
  const lobbyCode = "STAKE-"+Math.floor(1000+Math.random()*9000);

  const toggleTopic = key => setSelectedTopics(t=>t.includes(key)?t.filter(k=>k!==key):[...t,key]);

  const enterLobby = () => {
    const joined = [{id:1,name:"You (Host)"}];
    for(let i=2;i<=expectedPlayers;i++) joined.push({id:i,name:`Player ${i}`});
    setPlayers(joined);
    setPhase("lobby");
  };

  const startGame = (playerPool) => {
    const pool = playerPool || players;
    const qs = getQuestions(selectedTopics,difficulty,questionCount);
    setQuestions(qs);
    setQIndex(0);
    setMyScore(0);
    setAnswered(null);
    setShowAnswer(false);
    setTieChoice(null);
    const simulated = pool.filter(p=>p.name!=="You (Host)"&&p.name!=="You").map(p=>({
      ...p,
      finalScore: Math.max(0,Math.min(qs.length, Math.round(qs.length*(0.4+Math.random()*0.6))))
    }));
    setPlayers(pool);
    setSimulatedScores(simulated);
    setPhase("playing");
  };

  if(!ageKnownAdult && is18Plus===false) return (
    <div style={{minHeight:"100vh",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div className="popIn" style={{maxWidth:400,textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,92,58,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icons.lock s={28} c="#ff5c3a"/></div>
        <h2 className="syne" style={{fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:12}}>18+ Only</h2>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.9rem",lineHeight:1.7,marginBottom:12,fontWeight:300}}>Stake & Win involves real money and is only available once you turn 18.</p>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.82rem",lineHeight:1.6,marginBottom:32,fontWeight:300}}>This is based on the date of birth on your account. It'll unlock automatically on your 18th birthday.</p>
        <Btn onClick={()=>goTo("games")} style={{width:"100%",background:"#ff5c3a"}}>Back to games</Btn>
      </div>
    </div>
  );

  if(!ageKnownAdult) return (
    <div style={{minHeight:"100vh",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div className="popIn" style={{maxWidth:400,textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,92,58,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icons.lock s={28} c="#ff5c3a"/></div>
        <h2 className="syne" style={{fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:12}}>18+ Only</h2>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.9rem",lineHeight:1.7,marginBottom:32,fontWeight:300}}>Stake & Win involves real money. Highest score wins 85% of the total pot. Max stake: {cur.symbol}{cur.stakeMax.toLocaleString()}.</p>
        <div style={{display:"flex",gap:12}}>
          <Btn outline onClick={()=>goTo("games")} style={{flex:1,color:"white",borderColor:"rgba(255,255,255,0.2)"}}>Go back</Btn>
          <Btn onClick={()=>setSelfAttested(true)} style={{flex:1,background:"#ff5c3a"}}><Icons.check s={16} c="white"/>I am 18+</Btn>
        </div>
      </div>
    </div>
  );

  if(phase==="setup") return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <div style={{padding:"20px 28px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <BackBtn onClick={()=>goTo("games")}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Stake & Win</span>
        <span style={{background:"#ff5c3a",color:"white",fontSize:"0.68rem",fontWeight:700,padding:"3px 10px",borderRadius:50}}>18+</span>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"32px 24px"}}>
        <div style={{padding:"12px 16px",background:"#fff8f0",border:"1px solid rgba(255,92,58,0.2)",borderRadius:12,marginBottom:24,display:"flex",gap:10,alignItems:"flex-start"}}>
          <Icons.warning s={16} c="#f97316"/>
          <p style={{fontSize:"0.83rem",color:"#666",lineHeight:1.6}}>Everyone plays on their own phone. Answer on your own — no outside help, no searching answers.</p>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>How many players?</label>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <button onClick={()=>setExpectedPlayers(n=>Math.max(2,n-1))} disabled={expectedPlayers<=2} style={{width:40,height:40,borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"white",cursor:expectedPlayers<=2?"not-allowed":"pointer",opacity:expectedPlayers<=2?0.4:1,display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.close s={16} c="#555"/></button>
            <span className="syne" style={{fontSize:"1.5rem",fontWeight:800,minWidth:30,textAlign:"center"}}>{expectedPlayers}</span>
            <button onClick={()=>setExpectedPlayers(n=>Math.min(10,n+1))} disabled={expectedPlayers>=10} style={{width:40,height:40,borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"white",cursor:expectedPlayers>=10?"not-allowed":"pointer",opacity:expectedPlayers>=10?0.4:1,display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.plus s={16} c="#555"/></button>
            <span style={{fontSize:"0.83rem",color:"#aaa"}}>including you · min 2, max 10</span>
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Select topics (pick any combination)</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {TRIVIA_TOPICS.map(t=>{
              const sel = selectedTopics.includes(t.key);
              return (
                <button key={t.key} onClick={()=>toggleTopic(t.key)} className="topic-btn" style={{padding:"8px 14px",borderRadius:50,fontSize:"0.8rem",border:`1.5px solid ${sel?"#0e0e0e":"rgba(0,0,0,0.12)"}`,background:sel?"#0e0e0e":"white",color:sel?"white":"#555",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6}}>
                  <t.icon/>{t.label}
                </button>
              );
            })}
          </div>
          {selectedTopics.length===0&&<p style={{fontSize:"0.78rem",color:"#aaa",marginTop:8,display:"flex",alignItems:"center",gap:4}}><Icons.info s={12} c="#aaa"/>No topics selected = mix of all topics</p>}
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Difficulty</label>
          <div style={{display:"flex",gap:8}}>
            {[{k:"easy",l:"Easy"},{k:"medium",l:"Medium"},{k:"hard",l:"Hard"},{k:"mix",l:"Mix"}].map(d=>(
              <button key={d.k} onClick={()=>setDifficulty(d.k)} style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${difficulty===d.k?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:difficulty===d.k?"#0e0e0e":"white",color:difficulty===d.k?"white":"#555",cursor:"pointer",fontSize:"0.83rem",fontWeight:600,transition:"all 0.2s"}}>{d.l}</button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Number of questions</label>
          <div style={{display:"flex",gap:8}}>
            {[5,10,15,20].map(n=>(
              <button key={n} onClick={()=>setQuestionCount(n)} style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${questionCount===n?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:questionCount===n?"#0e0e0e":"white",color:questionCount===n?"white":"#555",cursor:"pointer",fontSize:"0.9rem",fontWeight:700,transition:"all 0.2s"}}>{n}</button>
            ))}
          </div>
        </div>

        <div style={{background:"white",borderRadius:16,padding:"20px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:16}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:10}}>Stake per player</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"#aaa",fontWeight:600}}>{cur.symbol}</span>
            <input type="number" placeholder={`Min ${cur.stakeMin}`} value={stakeAmount} onChange={e=>setStakeAmount(Math.min(Number(e.target.value),cur.stakeMax))} style={{width:"100%",padding:"14px 18px 14px 42px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"1.1rem",fontWeight:700}}/>
          </div>
          <p style={{fontSize:"0.75rem",color:"#aaa",marginTop:6}}>Min: {cur.symbol}{cur.stakeMin} · Max: {cur.symbol}{cur.stakeMax.toLocaleString()} · Everyone agrees on this amount before joining</p>
          {stakeAmount>0&&<div style={{marginTop:12,padding:"10px 14px",background:"#f0efec",borderRadius:10,fontSize:"0.83rem",color:"#555",display:"flex",alignItems:"center",gap:6}}>
            <Icons.trophy s={14} c="#0e0e0e"/>Winner receives: <strong>{cur.symbol}{Math.round(Number(stakeAmount)*expectedPlayers*0.85).toLocaleString()}</strong>
          </div>}
        </div>

        <div style={{background:"white",borderRadius:16,padding:"20px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:16}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Your payment method</label>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{k:"airtime",l:"Airtime",i:<Icons.phone s={16}/>},{k:"card",l:"Card",i:<Icons.card s={16}/>},{k:"transfer",l:"Bank Transfer",i:<Icons.bank s={16}/>}].map(m=>(
              <button key={m.k} onClick={()=>setPaymentMethod(m.k)} style={{padding:"12px 16px",borderRadius:12,border:`1.5px solid ${paymentMethod===m.k?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:paymentMethod===m.k?"#0e0e0e":"white",color:paymentMethod===m.k?"white":"#0e0e0e",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",gap:10}}>
                <span style={{opacity:paymentMethod===m.k?1:0.5}}>{m.i}</span>
                <span style={{fontWeight:600,fontSize:"0.92rem"}}>{m.l}</span>
              </button>
            ))}
          </div>
          {paymentMethod==="airtime"&&(
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
              <select style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.92rem",cursor:"pointer"}}>
                {COUNTRIES.map(c=><option key={c.code}>{c.flag} {c.name} ({c.phone})</option>)}
              </select>
              <input placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.92rem"}}/>
            </div>
          )}
          {paymentMethod==="card"&&(
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Card number" style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.92rem"}}/>
              <div style={{display:"flex",gap:10}}>
                <input placeholder="MM/YY" style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.92rem"}}/>
                <input placeholder="CVV" style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.92rem"}}/>
              </div>
            </div>
          )}
          {paymentMethod==="transfer"&&(
            <div style={{marginTop:12,padding:"14px",background:"#f0efec",borderRadius:12}}>
              <p style={{fontSize:"0.85rem",color:"#555",marginBottom:4}}>Bank: <strong>[Your business bank name]</strong></p>
              <p style={{fontSize:"0.85rem",color:"#555",marginBottom:4}}>Account: <strong>[Your business account number]</strong></p>
              <p style={{fontSize:"0.85rem",color:"#555"}}>Name: <strong>[Your business account name]</strong></p>
            </div>
          )}
        </div>

        <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"14px 16px",background:"#f8f8f6",borderRadius:12,marginBottom:20}}>
          <input type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} style={{marginTop:2,width:16,height:16,flexShrink:0}}/>
          <span style={{fontSize:"0.83rem",color:"#666",lineHeight:1.6}}>I confirm all players are 18+ and accept the rules. Winner takes 85%. Max stake is {cur.symbol}{cur.stakeMax.toLocaleString()}.</span>
        </label>
        <Btn onClick={enterLobby} style={{width:"100%",padding:"15px"}} disabled={!stakeAmount||!paymentMethod||!termsAccepted}>
          <Icons.share s={18} c="white"/>Create Lobby & Invite
        </Btn>
      </div>
    </div>
  );

  if(phase==="lobby") {
    const joinedCount = players.length;
    const allJoined = joinedCount>=expectedPlayers;
    return (
      <div style={{minHeight:"100vh",background:"#fafaf8"}}>
        <div style={{padding:"20px 28px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
          <BackBtn onClick={()=>setPhase("setup")}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Lobby</span>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"36px 24px"}}>
          <div className="fadeUp" style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icons.trophy s={26}/></div>
            <h2 className="syne" style={{fontSize:"1.5rem",fontWeight:800,marginBottom:6}}>Invite your friends</h2>
            <p style={{color:"#888",fontSize:"0.88rem",fontWeight:300}}>Share this code — they'll join from their own phone and stake {cur.symbol}{stakeAmount}.</p>
          </div>
          <div style={{background:"white",borderRadius:20,padding:"24px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:20}}>
            <p style={{fontSize:"0.78rem",fontWeight:600,color:"#aaa",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Lobby Code</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span className="syne" style={{fontSize:"1.6rem",fontWeight:800,letterSpacing:"0.08em"}}>{lobbyCode}</span>
              <button onClick={()=>{navigator.clipboard?.writeText(`unmaskr.com/join/${lobbyCode}`);setLobbyCopied(true);setTimeout(()=>setLobbyCopied(false),2000);}} style={{padding:"8px 14px",borderRadius:50,border:"1px solid rgba(0,0,0,0.12)",background:"transparent",cursor:"pointer",fontSize:"0.83rem",display:"flex",alignItems:"center",gap:6}}>
                <Icons.copy s={14} c="#555"/>{lobbyCopied?"Copied!":"Copy link"}
              </button>
            </div>
          </div>
          <div style={{background:"white",borderRadius:20,padding:"24px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:24}}>
            <p style={{fontSize:"0.78rem",fontWeight:600,color:"#aaa",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:16}}>Players ({joinedCount}/{expectedPlayers})</p>
            {players.map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <Avatar size={30} bg={AVATAR_COLORS[i%AVATAR_COLORS.length]} iconSize={16}/>
                <span style={{flex:1,fontSize:"0.92rem",fontWeight:500}}>{p.name}</span>
                <span style={{fontSize:"0.78rem",color:"#16a34a",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Icons.check s={12} c="#16a34a"/>Staked</span>
              </div>
            ))}
          </div>
          <Btn onClick={()=>startGame()} style={{width:"100%",padding:"15px"}} disabled={!allJoined}>
            <Icons.trophy s={18} c="white"/>Start Game
          </Btn>
        </div>
      </div>
    );
  }

  const currentQ = questions[qIndex];
  if(phase==="playing"&&currentQ) return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span className="syne" style={{fontWeight:800,fontSize:"1.05rem"}}>Question {qIndex+1}/{questions.length}</span>
        <span style={{background:"#0e0e0e",color:"white",padding:"6px 14px",borderRadius:50,fontSize:"0.83rem",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Icons.star s={14} c="white"/>Score: {myScore}</span>
      </div>
      <div style={{height:4,background:"#f0efec"}}><div style={{height:"100%",width:`${(qIndex/questions.length)*100}%`,background:"#ff5c3a",transition:"width 0.3s"}}/></div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"32px 24px"}}>
        <div className="fadeUp" style={{background:"#0e0e0e",borderRadius:20,padding:"28px",marginBottom:24,textAlign:"center"}}>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.78rem",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>True or False?</p>
          <h3 className="syne" style={{fontSize:"1.15rem",fontWeight:800,color:"white",lineHeight:1.5}}>{currentQ.q}</h3>
        </div>
        {!showAnswer?(
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>{setAnswered(true);setShowAnswer(true);if(currentQ.a===true)setMyScore(s=>s+1);}} style={{flex:1,padding:"20px",borderRadius:16,border:"none",background:"#22c55e",color:"white",fontSize:"1rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icons.check s={18} c="white"/>TRUE</button>
            <button onClick={()=>{setAnswered(false);setShowAnswer(true);if(currentQ.a===false)setMyScore(s=>s+1);}} style={{flex:1,padding:"20px",borderRadius:16,border:"none",background:"#ef4444",color:"white",fontSize:"1rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icons.close s={18} c="white"/>FALSE</button>
          </div>
        ):(
          <div className="popIn">
            <div style={{padding:"20px",background:answered===currentQ.a?"#f0fff4":"#fff5f5",border:`1px solid ${answered===currentQ.a?"#86efac":"#fca5a5"}`,borderRadius:16,marginBottom:20,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>{answered===currentQ.a?<Icons.check s={26} c="#16a34a"/>:<Icons.close s={26} c="#ef4444"/>}</div>
              <p style={{fontWeight:700,marginBottom:6}}>{answered===currentQ.a?"Correct! +1 point":"Wrong!"}</p>
              <p style={{fontSize:"0.83rem",color:"#555",lineHeight:1.6}}>{currentQ.f}</p>
            </div>
            <Btn onClick={()=>{if(qIndex===questions.length-1)setPhase("result");else{setQIndex(i=>i+1);setShowAnswer(false);setAnswered(null);}}} style={{width:"100%",padding:"15px"}}>
              {qIndex===questions.length-1?"See results":"Next question"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );

  if(phase==="result") {
    const allScores = [{id:1,name:players.find(p=>p.name.startsWith("You"))?.name||"You",score:myScore}, ...simulatedScores.map(p=>({id:p.id,name:p.name,score:p.finalScore}))];
    const sorted = [...allScores].sort((a,b)=>b.score-a.score);
    const top = sorted[0]?.score||0;
    const tied = sorted.filter(p=>p.score===top);
    const isTie = tied.length>1;
    const winner = !isTie ? sorted[0] : null;
    const prize = Math.round(Number(stakeAmount)*players.length*0.85);
    const rankColors = ["#d4af37","#a8a8a8","#b08d57"];
    return (
      <div style={{minHeight:"100vh",background:"#fafaf8"}}>
        <div style={{padding:"20px 28px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:8}}>
          <Icons.trophy s={20} c="#0e0e0e"/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Results</span>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"40px 24px"}}>
          <div className="popIn" style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:isTie?"#f0f4ff":"#f0fff4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              {isTie?<Icons.info s={32} c="#6366f1"/>:<Icons.trophy s={32} c="#16a34a"/>}
            </div>
            <h2 className="syne" style={{fontSize:"1.8rem",fontWeight:800,marginBottom:8}}>{isTie?"It's a tie!":"We have a winner!"}</h2>
            {winner&&(
              <div style={{marginTop:8}}>
                <p style={{color:"#0e0e0e",fontWeight:700,fontSize:"1.05rem",marginBottom:4}}>
                  {winner.name.startsWith("You")?"🎉 Congratulations, you've won this round!":`🎉 Congratulations, ${winner.name}!`}
                </p>
                <p style={{color:"#888",fontWeight:300,fontSize:"0.9rem"}}>
                  {winner.name.startsWith("You")
                    ?<>You've received <strong style={{color:"#16a34a"}}>{cur.symbol}{prize.toLocaleString()}</strong> in your wallet.</>
                    :<>{winner.name} has received <strong style={{color:"#16a34a"}}>{cur.symbol}{prize.toLocaleString()}</strong> in their wallet.</>}
                </p>
              </div>
            )}
          </div>
          <div style={{background:"white",borderRadius:20,padding:"20px",border:"1px solid rgba(0,0,0,0.08)",marginBottom:20}}>
            {sorted.map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<sorted.length-1?"1px solid rgba(0,0,0,0.06)":"none"}}>
                {i<3?<Icons.medal s={20} c={rankColors[i]}/>:<span style={{width:20,textAlign:"center",fontSize:"0.8rem",color:"#aaa",fontWeight:700}}>{i+1}</span>}
                <Avatar size={30} bg={AVATAR_COLORS[i%AVATAR_COLORS.length]} iconSize={16}/>
                <span style={{flex:1,fontWeight:500}}>{p.name}</span>
                <span className="syne" style={{fontWeight:800}}>{p.score}/{questions.length}</span>
              </div>
            ))}
          </div>
          {isTie&&!tieChoice&&(
            <div style={{background:"#f0f4ff",border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:"20px",marginBottom:20}}>
              <p style={{fontWeight:700,marginBottom:4,fontSize:"0.95rem"}}>Tied at {top}/{questions.length}!</p>
              <p style={{fontSize:"0.85rem",color:"#888",marginBottom:12,fontWeight:300,lineHeight:1.6}}>
                Tied: {tied.map(p=>p.name).join(", ")}. Agree on a decision, then select below.
              </p>
              <div style={{padding:"12px 14px",background:"rgba(99,102,241,0.08)",borderRadius:10,marginBottom:16,fontSize:"0.8rem",color:"#6366f1",lineHeight:1.6,display:"flex",gap:8,alignItems:"flex-start"}}>
                <Icons.info s={14} c="#6366f1"/>A notification will be sent to tied players: "Player wants to end the game and split the pot — do you agree?"
              </div>
              <div style={{display:"flex",gap:10}}>
                <Btn outline onClick={()=>setTieChoice("split")} style={{flex:1,fontSize:"0.85rem"}}>Split pot equally</Btn>
                <Btn onClick={()=>{const tiedPool=tied.map(({id,name})=>({id,name}));setTieChoice("replay");startGame(tiedPool);}} style={{flex:1,fontSize:"0.85rem"}}>Replay — tied only</Btn>
              </div>
            </div>
          )}
          {tieChoice==="split"&&(
            <div style={{padding:"16px",background:"#f0fff4",border:"1px solid #86efac",borderRadius:12,marginBottom:16,textAlign:"center"}}>
              <Icons.check s={20} c="#16a34a"/>
              <p style={{fontWeight:600,marginTop:8}}>Each tied player receives {cur.symbol}{Math.round(prize/tied.length).toLocaleString()} — split has been credited to each wallet.</p>
            </div>
          )}
          <div style={{display:"flex",gap:12}}>
            <Btn outline onClick={()=>{setPhase("setup");setTieChoice(null);}} style={{flex:1}}>New game</Btn>
            <Btn onClick={()=>goTo("games")} style={{flex:1}}>Exit</Btn>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ── CUSTOMIZATION ──────────────────────────────────────────────────────────────
const Customization = ({ goTo, customization, setCustomization }) => {
  const [local,setLocal] = useState(customization);
  const theme = THEMES.find(t=>t.key===local.theme)||THEMES[0];
  return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <div style={{padding:"20px 28px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
        <BackBtn onClick={()=>goTo("settings")}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>Customize your page</span>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"32px 24px"}}>
        <div style={{marginBottom:28}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Choose a theme</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {THEMES.map(t=>(
              <button key={t.key} onClick={()=>setLocal(l=>({...l,theme:t.key}))} style={{padding:"14px 10px",borderRadius:14,border:`2px solid ${local.theme===t.key?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:t.bg,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:t.accent,margin:"0 auto 6px"}}/>
                <p style={{fontSize:"0.78rem",fontWeight:600}}>{t.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:28}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Icons.palette s={14} c="#aaa"/>Custom background color</label>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <input type="color" value={local.bgColor||theme.bg} onChange={e=>setLocal(l=>({...l,bgColor:e.target.value}))} style={{width:52,height:52,borderRadius:12,border:"1.5px solid rgba(0,0,0,0.12)",cursor:"pointer",padding:2}}/>
            <div>
              <p style={{fontWeight:500,fontSize:"0.92rem"}}>Pick any color</p>
              <p style={{fontSize:"0.78rem",color:"#aaa",marginTop:2}}>Overrides the theme background</p>
            </div>
          </div>
        </div>
        <div style={{marginBottom:28}}>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:14}}>Preview</label>
          <div style={{background:local.bgColor||theme.bg,borderRadius:16,padding:"24px",border:"1px solid rgba(0,0,0,0.08)",textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:theme.accent,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Icons.mask size={24} color="white"/></div>
            <p className="syne" style={{fontWeight:800,fontSize:"1rem"}}>@yourname</p>
            <p style={{fontSize:"0.8rem",color:"#888",marginTop:4}}>Send me an anonymous message</p>
          </div>
        </div>
        <Btn onClick={()=>{setCustomization(local);goTo("settings");}} style={{width:"100%",padding:"15px"}}>
          <Icons.check s={16} c="white"/>Save changes
        </Btn>
      </div>
    </div>
  );
};

// ── SETTINGS ───────────────────────────────────────────────────────────────────
const Settings = ({ goTo, customization, setCustomization, currency, profile, userId, onLogout }) => {
  const cur = currency || CURRENCIES.NG;
  const [sec,setSec] = useState(null);
  const [name,setName] = useState(profile?.name||"");
  const [username,setUsername] = useState(profile?.username||"");
  const [gender,setGender] = useState(profile?.gender||"");
  const [email,setEmail] = useState(profile?.email||"");
  const [pw,setPw] = useState({current:"",newPass:"",confirm:""});
  const [pwErr,setPwErr] = useState("");
  const [saved,setSaved] = useState(false);
  const [saving,setSaving] = useState(false);
  const [balance,setBalance] = useState(0);
  const [toggles,setToggles] = useState({messages:true,discover:true,filter:true,emailNotif:false,newMsg:true,gameInvite:true,hintNotif:false,updates:false});
  const [darkMode,setDarkMode] = useState("auto");

  useEffect(() => {
    setName(profile?.name||""); setUsername(profile?.username||""); setGender(profile?.gender||""); setEmail(profile?.email||"");
  }, [profile]);

  useEffect(() => {
    if (!userId) return;
    supabase.from("wallets").select("balance").eq("user_id", userId).single().then(({data})=>{ if(data) setBalance(Number(data.balance)); });
  }, [userId]);

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ name, username, gender }).eq("id", userId);
    setSaving(false);
    setSaved(true);
    setTimeout(()=>{setSaved(false);setSec(null);},1500);
  };

  const saveEmail = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email });
    if (!error) await supabase.from("profiles").update({ email }).eq("id", userId);
    setSaving(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  const savePassword = async () => {
    if (pw.newPass !== pw.confirm) { setPwErr("Passwords don't match."); return; }
    setSaving(true); setPwErr("");
    const { error } = await supabase.auth.updateUser({ password: pw.newPass });
    setSaving(false);
    if (error) { setPwErr(error.message); return; }
    setSaved(true);
    setTimeout(()=>{setSaved(false);setSec(null);setPw({current:"",newPass:"",confirm:""});},1500);
  };

  const sections = [
    {key:"help",icon:<Icons.help s={18} c="#555"/>,label:"Help & FAQ",desc:"Common questions answered"},
    {key:"contact",icon:<Icons.chat s={18} c="#555"/>,label:"Contact Support",desc:"Get help from our team"},
    {key:"notifications",icon:<Icons.bell s={18} c="#555"/>,label:"Notifications",desc:"Manage alerts and emails"},
    {key:"privacy",icon:<Icons.shield s={18} c="#555"/>,label:"Privacy & Safety",desc:"Block users, message filters"},
    {key:"terms",icon:<Icons.doc s={18} c="#555"/>,label:"Terms & Privacy",desc:"Read our policies"},
    {key:"appearance",icon:<Icons.sun s={18} c="#555"/>,label:"Appearance",desc:"Light or dark mode"},
    {key:"account",icon:<Icons.mail s={18} c="#555"/>,label:"Account Details",desc:"Change email address"},
    {key:"password",icon:<Icons.lock s={18} c="#555"/>,label:"Change Password",desc:"Update your password"},
    {key:"photo",icon:<Icons.photo s={18} c="#555"/>,label:"Profile Picture",desc:"Upload or change your photo"},
    {key:"profile",icon:<Icons.user s={18} c="#555"/>,label:"Edit Profile",desc:"Name, username, gender"},
  ];

  const SubPage = ({title,children}) => (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <div style={{padding:"20px 28px",display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid rgba(0,0,0,0.07)",position:"sticky",top:0,background:"#fafaf8",zIndex:10}}>
        <BackBtn onClick={()=>setSec(null)}/><span className="syne" style={{fontWeight:800,fontSize:"1.1rem"}}>{title}</span>
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"32px 24px"}}>{children}</div>
    </div>
  );

  if(sec==="profile") return (
    <SubPage title="Edit Profile">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Full name</label>
          <Inp value={name} onChange={e=>setName(e.target.value)}/>
        </div>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Username</label>
          <Inp value={username} onChange={e=>setUsername(e.target.value)}/>
        </div>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:10}}>Gender</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Male","Female","Non-binary","Prefer not to say"].map(g=>(
              <button key={g} onClick={()=>setGender(g)} style={{padding:"9px 16px",borderRadius:50,fontSize:"0.83rem",border:`1.5px solid ${gender===g?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:gender===g?"#0e0e0e":"white",color:gender===g?"white":"#555",cursor:"pointer",transition:"all 0.2s"}}>{g}</button>
            ))}
          </div>
        </div>
        <div style={{padding:"12px 16px",background:"#fff8f0",border:"1px solid rgba(255,92,58,0.15)",borderRadius:12,fontSize:"0.82rem",color:"#888",lineHeight:1.6,display:"flex",gap:8}}>
          <Icons.warning s={14} c="#f97316"/>Gender details may be used to generate hints. Changes apply to new messages only.
        </div>
      </div>
      <Btn onClick={saveProfile} style={{width:"100%",marginTop:28,padding:"15px"}} disabled={saving}><Icons.check s={16} c="white"/>{saving?"Saving...":"Save changes"}</Btn>
      {saved&&<p style={{textAlign:"center",marginTop:12,color:"#16a34a",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icons.check s={14} c="#16a34a"/>Saved!</p>}
    </SubPage>
  );

  if(sec==="account") return (
    <SubPage title="Account Details">
      <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Email address</label>
      <Inp type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <p style={{marginTop:10,fontSize:"0.82rem",color:"#aaa",display:"flex",alignItems:"center",gap:6}}><Icons.info s={12} c="#aaa"/>A verification email will be sent to your new address.</p>
      <Btn onClick={saveEmail} style={{width:"100%",marginTop:24,padding:"15px"}} disabled={saving}><Icons.check s={16} c="white"/>{saving?"Updating...":"Update email"}</Btn>
      {saved&&<p style={{textAlign:"center",marginTop:12,color:"#16a34a",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icons.check s={14} c="#16a34a"/>Verification sent!</p>}
    </SubPage>
  );

  if(sec==="password") return (
    <SubPage title="Change Password">
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>New password</label>
          <Inp type="password" value={pw.newPass} onChange={e=>setPw(p=>({...p,newPass:e.target.value}))}/>
        </div>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Confirm new password</label>
          <Inp type="password" value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))}/>
        </div>
      </div>
      <p style={{fontSize:"0.78rem",color:"#aaa",marginTop:10,display:"flex",alignItems:"center",gap:6}}><Icons.info s={12} c="#aaa"/>Min. 8 characters, at least one number or symbol.</p>
      {pwErr && <p style={{color:"#ef4444",fontSize:"0.82rem",marginTop:6}}>{pwErr}</p>}
      <Btn onClick={savePassword} style={{width:"100%",marginTop:24,padding:"15px"}} disabled={pw.newPass.length<8||pw.newPass!==pw.confirm||saving}>
        <Icons.check s={16} c="white"/>{saving?"Updating...":"Update password"}
      </Btn>
      {saved&&<p style={{textAlign:"center",marginTop:12,color:"#16a34a",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icons.check s={14} c="#16a34a"/>Password updated!</p>}
    </SubPage>
  );

  if(sec==="photo") return (
    <SubPage title="Profile Picture">
      <div style={{width:100,height:100,borderRadius:"50%",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><Icons.mask size={50} color="white"/></div>
      <div style={{background:"#f3f2ef",borderRadius:16,padding:"24px",marginBottom:16,cursor:"pointer",border:"2px dashed #ccc",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Icons.photo s={32} c="#aaa"/></div>
        <p style={{fontWeight:600,marginBottom:4}}>Upload a photo</p>
        <p style={{fontSize:"0.83rem",color:"#aaa"}}>JPG, PNG or GIF. Max 5MB.</p>
        <p style={{fontSize:"0.72rem",color:"#ccc",marginTop:8}}>Not connected to storage yet — uploads won't save until this is wired to Supabase Storage.</p>
      </div>
      <Btn outline onClick={()=>setSec(null)} style={{width:"100%"}}>Cancel</Btn>
    </SubPage>
  );

  if(sec==="help") return (
    <SubPage title="Help & FAQ">
      {[
        {q:"Is Unmaskr really anonymous?",a:"Yes. Senders are completely anonymous. Hints are based on general data they voluntarily share — never their exact identity."},
        {q:"How do I earn from hints?",a:"When someone pays to see a hint on your message, 50% goes to your wallet automatically. Withdraw anytime — balances never expire."},
        {q:"What if a withdrawal fails?",a:"If a withdrawal fails for any technical reason, the full amount is automatically returned to your wallet within 10 minutes."},
        {q:"How does Stake & Win work?",a:"All players stake the same amount. Answer trivia questions based on your chosen topics and difficulty. Highest score wins 85% of the total pot."},
        {q:"What happens in a tie in Stake & Win?",a:"Tied players can agree to split the pot equally, or replay the game among just the tied players until there is a winner."},
        {q:"How do I contact support?",a:"Go to Settings → Contact Support. We typically reply within 24 hours at support@unmaskr.com."},
      ].map((item,i)=>(
        <div key={i} style={{background:"white",borderRadius:16,padding:"20px",marginBottom:12,border:"1px solid rgba(0,0,0,0.07)"}}>
          <p style={{fontWeight:600,marginBottom:8,fontSize:"0.95rem"}}>{item.q}</p>
          <p style={{color:"#666",fontSize:"0.88rem",lineHeight:1.7,fontWeight:300}}>{item.a}</p>
        </div>
      ))}
    </SubPage>
  );

  if(sec==="contact") return (
    <SubPage title="Contact Support">
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"#f0efec",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Icons.chat s={24} c="#0e0e0e"/></div>
        <h2 className="syne" style={{fontSize:"1.5rem",fontWeight:800,marginBottom:8}}>We're here to help</h2>
        <p style={{color:"#888",fontSize:"0.9rem",fontWeight:300}}>Usually reply within 24 hours.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Subject</label>
          <select style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.95rem",cursor:"pointer"}}>
            <option>Payment issue</option>
            <option>Account problem</option>
            <option>Report a bug</option>
            <option>Safety concern</option>
            <option>Withdrawal not received</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label style={{fontSize:"0.8rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Message</label>
          <textarea placeholder="Describe your issue..." rows={5} style={{width:"100%",padding:"14px 16px",borderRadius:14,border:"1.5px solid rgba(0,0,0,0.12)",background:"#fafaf8",fontSize:"0.95rem",resize:"none",lineHeight:1.6}}/>
        </div>
      </div>
      <p style={{marginTop:20,fontSize:"0.78rem",color:"#ccc",textAlign:"center"}}>Not wired to send yet — insert a complaint into the `complaints` table here to connect this to your admin dashboard.</p>
      <div style={{marginTop:24,padding:"14px",background:"#f3f2ef",borderRadius:12,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icons.mail s={14} c="#666"/><p style={{fontSize:"0.83rem",color:"#666"}}>Or email: <strong>support@unmaskr.com</strong></p>
      </div>
    </SubPage>
  );

  if(sec==="privacy") return (
    <SubPage title="Privacy & Safety">
      {[
        {k:"messages",l:"Allow anonymous messages",d:"Turn off to stop new messages"},
        {k:"discover",l:"Show in discover",d:"Let others find your profile"},
        {k:"filter",l:"Filter offensive messages",d:"Auto-hide harmful messages"},
        {k:"emailNotif",l:"Email notifications",d:"Get notified by email"},
      ].map(item=>(
        <div key={item.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
          <div><p style={{fontWeight:500,marginBottom:4,fontSize:"0.92rem"}}>{item.l}</p><p style={{fontSize:"0.8rem",color:"#aaa"}}>{item.d}</p></div>
          <Tog on={toggles[item.k]} onToggle={()=>setToggles(t=>({...t,[item.k]:!t[item.k]}))}/>
        </div>
      ))}
      <div onClick={onLogout} style={{marginTop:32,padding:"14px 16px",borderRadius:12,border:"1px solid rgba(239,68,68,0.2)",background:"#fff5f5",cursor:"pointer",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icons.logout s={16} c="#ef4444"/><p style={{color:"#ef4444",fontWeight:600,fontSize:"0.9rem"}}>Delete my account</p>
      </div>
      <p style={{fontSize:"0.72rem",color:"#ccc",textAlign:"center",marginTop:8}}>Not wired to actually delete the account yet — currently logs you out.</p>
    </SubPage>
  );

  if(sec==="notifications") return (
    <SubPage title="Notifications">
      {[
        {k:"newMsg",l:"New messages",d:"When someone sends you a message"},
        {k:"gameInvite",l:"Game invites",d:"When a friend invites you to a game"},
        {k:"hintNotif",l:"Hint purchased",d:"When someone buys a hint on your message"},
        {k:"updates",l:"Platform updates",d:"News and announcements"},
      ].map(item=>(
        <div key={item.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
          <div><p style={{fontWeight:500,marginBottom:4,fontSize:"0.92rem"}}>{item.l}</p><p style={{fontSize:"0.8rem",color:"#aaa"}}>{item.d}</p></div>
          <Tog on={toggles[item.k]} onToggle={()=>setToggles(t=>({...t,[item.k]:!t[item.k]}))}/>
        </div>
      ))}
    </SubPage>
  );

  if(sec==="appearance") return (
    <SubPage title="Appearance">
      <p style={{fontSize:"0.88rem",color:"#888",marginBottom:24,fontWeight:300}}>Choose how Unmaskr looks. Automatic follows your device.</p>
      {[{k:"auto",l:"Automatic",d:"Follows your device setting"},{k:"light",l:"Light",d:"Always light mode"},{k:"dark",l:"Dark",d:"Always dark mode"}].map(m=>(
        <button key={m.k} onClick={()=>setDarkMode(m.k)} style={{width:"100%",padding:"16px 18px",borderRadius:14,border:`1.5px solid ${darkMode===m.k?"#0e0e0e":"rgba(0,0,0,0.1)"}`,background:darkMode===m.k?"#0e0e0e":"white",color:darkMode===m.k?"white":"#0e0e0e",cursor:"pointer",textAlign:"left",marginBottom:10,transition:"all 0.2s",display:"flex",alignItems:"center",gap:12}}>
          <Icons.sun s={18} c={darkMode===m.k?"white":"#555"}/>
          <div><p style={{fontWeight:600,marginBottom:2}}>{m.l}</p><p style={{fontSize:"0.78rem",opacity:0.6}}>{m.d}</p></div>
        </button>
      ))}
    </SubPage>
  );

  if(sec==="terms") return <Terms goTo={goTo} fromSend={false}/>;

  return (
    <div style={{minHeight:"100vh",background:"#fafaf8"}}>
      <AppNav goTo={goTo} active="settings"/>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 20px"}}>
        <div className="fadeUp" style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.mask size={32} color="white"/></div>
          <div><h2 className="syne" style={{fontSize:"1.3rem",fontWeight:800}}>{profile?.name||"Your Name"}</h2><p style={{color:"#888",fontSize:"0.88rem"}}>{window.location.host}/{profile?.username||"yourname"}</p></div>
        </div>

        <div className="fadeUp" style={{background:"#f3f2ef",borderRadius:16,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",border:"1px solid rgba(0,0,0,0.06)"}} onClick={()=>goTo("wallet")}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"#0e0e0e",display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.wallet s={18} c="white"/></div>
            <div>
              <p style={{fontSize:"0.72rem",fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Wallet balance</p>
              <p className="syne" style={{fontWeight:800,fontSize:"1.2rem"}}>{cur.symbol}{balance.toLocaleString()}</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:"0.8rem",color:"#888"}}>View wallet</span><Icons.chevron s={16} c="#ccc"/></div>
        </div>

        <div className="fadeUp" style={{background:"#f0f4ff",borderRadius:16,padding:"16px 18px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",border:"1px solid rgba(0,0,0,0.06)"}} onClick={()=>goTo("customization")}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.palette s={18} c="white"/></div>
            <div>
              <p style={{fontWeight:500,fontSize:"0.92rem",marginBottom:2}}>Customize your send page</p>
              <p style={{fontSize:"0.78rem",color:"#aaa"}}>Change theme and background color</p>
            </div>
          </div>
          <Icons.chevron s={16} c="#ccc"/>
        </div>

        <div className="fadeUp1" style={{display:"flex",flexDirection:"column",gap:8}}>
          {sections.map(s=>(
            <button key={s.key} className="srow" onClick={()=>setSec(s.key)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:14,border:"1px solid rgba(0,0,0,0.07)",background:"white",cursor:"pointer",textAlign:"left",transition:"background 0.15s",width:"100%"}}>
              <span style={{width:28,display:"flex",justifyContent:"center"}}>{s.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontWeight:500,fontSize:"0.92rem",marginBottom:2}}>{s.label}</p>
                <p style={{fontSize:"0.78rem",color:"#aaa"}}>{s.desc}</p>
              </div>
              <Icons.chevron s={16} c="#ccc"/>
            </button>
          ))}
        </div>

        <div className="fadeUp2" onClick={onLogout} style={{marginTop:24,padding:"16px 18px",borderRadius:14,border:"1px solid rgba(239,68,68,0.2)",background:"#fff5f5",cursor:"pointer",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icons.logout s={16} c="#ef4444"/><p style={{color:"#ef4444",fontWeight:600,fontSize:"0.9rem"}}>Log out</p>
        </div>
      </div>
    </div>
  );
};

// ── APP ROUTER ─────────────────────────────────────────────────────────────────
const calcAge = (dobStr) => {
  if(!dobStr) return null;
  const dob = new Date(dobStr);
  if(isNaN(dob)) return null;
  const today = new Date();
  let age = today.getFullYear()-dob.getFullYear();
  const m = today.getMonth()-dob.getMonth();
  if(m<0||(m===0&&today.getDate()<dob.getDate())) age--;
  return age;
};

// Screens that are NOT usernames — anything else in the URL path is treated
// as someone's username and routes straight to the send-message page.
const RESERVED_PATHS = ["landing","signup","login","forgot","terms","inbox","send","stats","wallet","games","game-lobby","game-stake","settings","customization"];

const getInitialRouteFromURL = () => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, ""); // strip leading/trailing slashes
  if (!path) return { screen: "landing", params: {} };
  const segment = path.split("/")[0];
  if (RESERVED_PATHS.includes(segment)) return { screen: segment, params: {} };
  // Anything else (e.g. "/temi") is treated as a username send-link
  return { screen: "send", params: { username: segment } };
};

export default function App() {
  const initialRoute = getInitialRouteFromURL();
  const [screen,setScreen] = useState(initialRoute.screen);
  const [params,setParams] = useState(initialRoute.params);
  const [customization,setCustomization] = useState({theme:"classic",bgColor:""});
  const [checkingSession,setCheckingSession] = useState(true);
  const [session,setSession] = useState(null);
  const [profile,setProfile] = useState(null);

  const userCountry = profile?.country || "NG";
  const userDOB = profile?.dob || "";
  const currency = getCurrency(userCountry);
  const age = calcAge(userDOB);
  const isMinor = age!==null && age<18;
  const is18Plus = age===null ? null : age>=18;

  const goTo = (s,p={}) => {
    setScreen(s);
    setParams(p);
    window.scrollTo(0,0);
    // Keep the address bar in sync so links stay shareable/refreshable
    const path = s==="landing" ? "/" : s==="send" && p.username ? `/${p.username}` : `/${s}`;
    window.history.pushState({}, "", path);
  };

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
        // Only redirect to inbox if we're not already on a direct send-link —
        // someone with an account clicking a friend's link should still see it.
        setScreen(s => (s==="landing") ? "inbox" : s);
      }
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Applies immediately after signup so currency/age-gating don't wait on the
  // profile re-fetch — real profile data arrives right after via onAuthStateChange.
  const onSignupComplete = (form) => {
    setProfile(p => ({ ...(p||{}), country: form.country, dob: form.dob, name: form.name, username: form.username, gender: form.gender, email: form.email }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    goTo("landing");
  };

  if (checkingSession) return (
    <>
      <GlobalStyles/>
      <div style={{minHeight:"100vh",background:"#fafaf8",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icons.mask size={40} color="#ccc"/>
      </div>
    </>
  );

  const screens = {
    landing:       <Landing goTo={goTo}/>,
    signup:        <Signup goTo={goTo} onSignupComplete={onSignupComplete}/>,
    login:         <Login goTo={goTo}/>,
    forgot:        <ForgotPassword goTo={goTo}/>,
    terms:         <Terms goTo={goTo} fromSend={false}/>,
    inbox:         <Inbox goTo={goTo} currency={currency} isMinor={isMinor} userId={session?.user?.id} username={profile?.username||"yourname"}/>,
    send:          <SendPage goTo={goTo} params={params} customization={customization} receiverCurrency={currency}/>,
    stats:         <Stats goTo={goTo} userId={session?.user?.id}/>,
    wallet:        <Wallet goTo={goTo} currency={currency} userId={session?.user?.id} userName={profile?.name}/>,
    games:         <Games goTo={goTo}/>,
    "game-lobby":  <GameLobby goTo={goTo}/>,
    "game-stake":  <GameStake goTo={goTo} currency={currency} is18Plus={is18Plus}/>,
    settings:      <Settings goTo={goTo} customization={customization} setCustomization={setCustomization} currency={currency} profile={profile} userId={session?.user?.id} onLogout={handleLogout}/>,
    customization: <Customization goTo={goTo} customization={customization} setCustomization={setCustomization}/>,
  };

  return (<><GlobalStyles/>{screens[screen]||screens.landing}</>);
}