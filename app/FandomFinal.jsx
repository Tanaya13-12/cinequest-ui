"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import FandomTitle from "./components/FandomTitle";
import GlassHUD from "./components/GlassHUD";
import SecondSection from "./components/SecondSection";

/* ===== SCROLL SECTION STYLES ===== */

const sectionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "100px 10%",
  minHeight: "100vh",
};

const contentBox = {
  width: "40%",
  background: "rgba(255,0,50,0.1)",
  padding: "30px",
  borderRadius: "15px",
  color: "white",
  backdropFilter: "blur(10px)",
};

const leftEmpty = {
  width: "40%",
};

/* ─────────────────────────────────────────────────────────────
   GENRE PALETTE  (neon tints at varying opacity)
───────────────────────────────────────────────────────────── */
const G = {
  romance:  { c:"rgba(255,100,150,0.78)", glow:"#ff5090", gc:"#ff3070" },
  action:   { c:"rgba(255,48,48,0.80)",   glow:"#ff1818", gc:"#ee0000" },
  drama:    { c:"rgba(255,168,45,0.76)",  glow:"#ffaa18", gc:"#ee8800" },
  epic:     { c:"rgba(205,162,65,0.74)",  glow:"#cc9920", gc:"#bb8800" },
  thriller: { c:"rgba(42,148,255,0.78)",  glow:"#1a80ff", gc:"#0055ee" },
  social:   { c:"rgba(58,210,148,0.74)",  glow:"#18cc80", gc:"#00aa60" },
  crime:    { c:"rgba(170,42,218,0.72)",  glow:"#aa18dd", gc:"#8800cc" },
  horror:   { c:"rgba(68,232,95,0.66)",   glow:"#28dd44", gc:"#00cc22" },
  comedy:   { c:"rgba(252,212,45,0.72)",  glow:"#ffcc00", gc:"#ddaa00" },
  biopic:   { c:"rgba(112,190,252,0.70)", glow:"#55aaff", gc:"#3388ee" },
};

/* ─────────────────────────────────────────────────────────────
   MOVIE DATA  (63 entries for 7×9 grid)
───────────────────────────────────────────────────────────── */
const MOVIES = [
  ["SHOLAY","action"],      ["DEVDAS","romance"],     ["LAGAAN","epic"],
  ["DDLJ","romance"],       ["MUGHAL-E-AZAM","epic"], ["KABHI KHUSHI","romance"],
  ["3 IDIOTS","comedy"],    ["PAKEEZAH","drama"],      ["GUIDE","drama"],
  ["DEEWAR","action"],      ["MOTHER INDIA","social"], ["AWAARA","drama"],
  ["AGNEEPATH","action"],   ["ZANJEER","action"],      ["SILSILA","romance"],
  ["PYAASA","drama"],       ["TRISHUL","action"],      ["DON","thriller"],
  ["ARADHANA","romance"],   ["ANAND","drama"],         ["BANDINI","drama"],
  ["UMRAO JAAN","drama"],   ["ABHIMAAN","drama"],      ["NASEEB","action"],
  ["SUJATA","social"],      ["PARAKH","social"],       ["HAQEEQAT","epic"],
  ["RANG DE BASANTI","social"], ["GANGS OF WAS.","crime"], ["BRAHMASTRA","epic"],
  ["PATHAAN","action"],     ["DILWALE","romance"],     ["RAM LAKHAN","action"],
  ["KHALNAYAK","action"],   ["TEZAAB","action"],       ["BAAZIGAR","thriller"],
  ["KAL HO NA HO","romance"], ["JODHAA AKBAR","epic"], ["BAJRANGI BH.","social"],
  ["PK","comedy"],          ["DANGAL","biopic"],       ["ARTICLE 15","social"],
  ["ANDHADHUN","thriller"], ["DRISHYAM","thriller"],   ["URI","biopic"],
  ["RAAZI","thriller"],     ["GULLY BOY","biopic"],    ["SWADES","social"],
  ["TAARE ZAMEEN","social"],["ROCK ON","drama"],       ["LOOTERA","romance"],
  ["HAIDER","crime"],       ["TALVAR","thriller"],     ["PINK","social"],
  ["QUEEN","drama"],        ["HIGHWAY","drama"],       ["THAPPAD","social"],
  ["SHERSHAAH","biopic"],   ["BHOOL BHULAIYAA","horror"], ["JAWAN","action"],
  ["DUNKI","social"],       ["ANIMAL","crime"],        ["KALKI","epic"],
];
const COLS = 7, ROWS = 9;

/* ─────────────────────────────────────────────────────────────
   PAPARAZZI ENGINE
───────────────────────────────────────────────────────────── */
function PaparazziEngine({ onFlash }) {
  useEffect(() => {
    let t;
    const fire = () => {
      window.dispatchEvent(new Event("ff"));
      onFlash?.();
      t = setTimeout(fire, 1800 + Math.random() * 5500);
    };
    t = setTimeout(fire, 2200);
    return () => clearTimeout(t);
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────
   LEGEND WALL CELL — larger, clearly readable
───────────────────────────────────────────────────────────── */
function LegendCell({ title, genre, idx }) {
  const [glitch, setGlitch] = useState(false);
  const [lit,    setLit]    = useState(false);
  const g   = G[genre] || G.drama;
  const ref = useRef(null);

  useEffect(() => {
    const s = () => {
      ref.current = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => { setGlitch(false); s(); }, 140 + Math.random()*190);
      }, 4000 + Math.random()*13000 + idx*22);
    };
    s();
    return () => clearTimeout(ref.current);
  }, [idx]);

  useEffect(() => {
    const h = () => {
      if (Math.random() > 0.52) return;
      setLit(true);
      setTimeout(() => setLit(false), 80 + Math.random()*120);
    };
    window.addEventListener("ff", h);
    return () => window.removeEventListener("ff", h);
  }, []);

  const base = {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "clamp(11px, 1.55vw, 20px)",   /* ← larger for readability */
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{
      padding: "10px 14px",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {lit && <div style={{
        position:"absolute", inset:"-3px",
        background:`${g.glow}1a`, borderRadius:"3px",
        pointerEvents:"none",
      }}/>}

      {glitch ? (
        <div style={{ position:"relative" }}>
          <div style={{ ...base, position:"absolute", top:0, left:0, color:`${g.gc}77`,
            transform:"translate(-3px,1px) skewX(-5deg)", clipPath:"inset(38% 0 35% 0)",
            pointerEvents:"none" }}>{title}</div>
          <div style={{ ...base, position:"absolute", top:0, left:0, color:"rgba(0,255,220,0.25)",
            transform:"translate(3px,-1px)", clipPath:"inset(8% 0 58% 0)",
            pointerEvents:"none" }}>{title}</div>
          <motion.div
            animate={{ textShadow:[`0 0 16px ${g.gc},0 0 36px ${g.gc}88`,`0 0 6px ${g.gc}`,`0 0 20px ${g.gc}`] }}
            transition={{ duration:0.14, repeat:2 }}
            style={{ ...base, color:g.gc }}
          >{title}</motion.div>
        </div>
      ) : (
        <motion.div
          animate={{ textShadow:[`0 0 6px ${g.glow}44`,`0 0 12px ${g.glow}77`,`0 0 6px ${g.glow}44`] }}
          transition={{ duration:2.8+(idx%4)*0.4, repeat:Infinity, ease:"easeInOut" }}
          style={{ ...base, color:g.c }}
        >{title}</motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VOLUMETRIC BEAMS — warm gold, narrow, top-down
───────────────────────────────────────────────────────────── */
function VolumetricBeams() {
  const BEAMS = [
    { pct:36, w:68,  coreW:1.5, coneOp:0.13, coreOp:[0.45,0.85,0.45], rot:["-7deg","1deg","-7deg"], dur:10, del:0   },
    { pct:50, w:100, coreW:2.2, coneOp:0.20, coreOp:[0.65,1.00,0.65], rot:["0deg","0deg","0deg"],   dur:0,  del:0   },
    { pct:64, w:68,  coreW:1.5, coneOp:0.13, coreOp:[0.45,0.85,0.45], rot:["7deg","-1deg","7deg"],  dur:13, del:2   },
  ];

  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,height:"100vh",zIndex:4,pointerEvents:"none",overflow:"hidden" }}>
      {BEAMS.map((b,i) => (
        <motion.div key={i}
          animate={b.dur > 0 ? { rotate:b.rot } : {}}
          transition={{ duration:b.dur, repeat:b.dur>0?Infinity:0, ease:"easeInOut", delay:b.del }}
          style={{ position:"absolute",top:0,left:`calc(${b.pct}% - ${b.w/2}px)`,width:`${b.w}px`,height:"70vh",transformOrigin:"top center" }}
        >
          {/* soft gold cone */}
          <div style={{
            position:"absolute",inset:0,
            background:`linear-gradient(to bottom,rgba(255,205,100,${b.coneOp}) 0%,rgba(255,185,60,${b.coneOp*0.35}) 65%,transparent 100%)`,
            clipPath:"polygon(26% 0%,74% 0%,100% 100%,0% 100%)",
            filter:"blur(14px)",
          }}/>
          {/* core needle */}
          <motion.div
            animate={{ opacity:b.coreOp }}
            transition={{ duration:3.5+i,repeat:Infinity,ease:"easeInOut" }}
            style={{
              position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
              width:`${b.coreW}px`,height:"70vh",
              background:"linear-gradient(to bottom,rgba(255,240,170,1) 0%,rgba(255,210,120,0.5) 60%,transparent 100%)",
              filter:"blur(0.3px)",
            }}
          />
          {/* dust motes */}
          {Array.from({length:5},(_,mi) => (
            <motion.div key={mi}
              animate={{ y:["15vh","67vh"], opacity:[0,0.7,0], x:[0,(mi%2?9:-9),0] }}
              transition={{ duration:4+mi*0.7, delay:mi*0.65+b.del, repeat:Infinity, ease:"linear" }}
              style={{
                position:"absolute",left:`${24+mi*12}%`,top:0,
                width:"1.8px",height:"1.8px",borderRadius:"50%",
                background:"rgba(255,235,160,0.9)",
                boxShadow:"0 0 5px 2px rgba(255,210,100,0.5)",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* title statue halo */}
      <motion.div
        animate={{ opacity:[0.18,0.48,0.18], scale:[0.88,1.06,0.88] }}
        transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut" }}
        style={{
          position:"absolute",top:"42%",left:"50%",transform:"translate(-50%,-50%)",
          width:"420px",height:"240px",
          background:"radial-gradient(ellipse,rgba(255,210,100,0.14) 0%,rgba(255,165,40,0.05) 52%,transparent 74%)",
          filter:"blur(26px)",borderRadius:"50%",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RED CARPET FLOOR
───────────────────────────────────────────────────────────── */
function RedCarpet() {
  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,height:"20vh",zIndex:6,pointerEvents:"none",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,
        background:"linear-gradient(to bottom,transparent 0%,rgba(32,1,1,0.72) 38%,rgba(12,0,0,0.98) 100%)" }}/>
      {[0,1,2,3,4,5].map(i=>(
        <motion.div key={i}
          animate={{ x:[`${-4+i*2}%`,`${7+i}%`,`${-3+i}%`], opacity:[0.1+i*0.012,0.2+i*0.014,0.1+i*0.012] }}
          transition={{ duration:14+i*3,delay:i*2.1,repeat:Infinity,ease:"easeInOut" }}
          style={{
            position:"absolute",bottom:0,left:`${i*18-4}%`,width:`${26+i*4}%`,height:"52%",
            background:"radial-gradient(ellipse 50% 100% at 50% 100%,rgba(30,2,2,0.55) 0%,transparent 100%)",
            filter:"blur(18px)",borderRadius:"50%",
          }}
        />
      ))}
      <motion.div
        animate={{ opacity:[0.06,0.32,0.06],scaleX:[0.4,1.1,0.4] }}
        transition={{ duration:4.5,repeat:Infinity,ease:"easeInOut" }}
        style={{ position:"absolute",bottom:"28%",left:"15%",right:"15%",height:"0.5px",
          background:"linear-gradient(to right,transparent,rgba(255,255,255,0.42),transparent)",transformOrigin:"center" }}
      />
      {[{l:"12%",del:0},{r:"12%",del:2.5}].map((p,i)=>(
        <motion.div key={i}
          animate={{ x:[i===0?"-5vw":"5vw",i===0?"5vw":"-5vw",i===0?"-5vw":"5vw"], opacity:[0.07,0.2,0.07] }}
          transition={{ duration:10+i*3,repeat:Infinity,ease:"easeInOut",delay:p.del }}
          style={{
            position:"absolute",bottom:"-4%",...(p.l?{left:p.l}:{right:p.r}),
            width:"16vw",height:"8vh",
            background:"radial-gradient(ellipse,rgba(255,255,255,0.2) 0%,transparent 70%)",
            filter:"blur(8px)",borderRadius:"50%",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARTICLES  (embers + ash)
───────────────────────────────────────────────────────────── */
function Particles() {
  const P = useRef(Array.from({length:40},(_,i)=>({
    id:i, left:Math.random()*100, sz:0.9+Math.random()*2.5,
    dur:10+Math.random()*14, del:Math.random()*18,
    drift:(Math.random()-.5)*115, ash:Math.random()>.52,
  })));
  return (
    <div style={{ position:"fixed",inset:0,zIndex:5,pointerEvents:"none",overflow:"hidden" }}>
      {P.current.map(p=>(
        <motion.div key={p.id}
          style={{
            position:"absolute",bottom:"-8px",left:`${p.left}%`,
            width:p.ash?p.sz*2.1+"px":p.sz+"px",height:p.ash?p.sz*.6+"px":p.sz+"px",
            borderRadius:"50%",
            background:p.ash?"rgba(148,138,126,0.42)":`radial-gradient(circle,#ff7030 0%,#cc2200 55%,transparent 100%)`,
            boxShadow:p.ash?"none":`0 0 ${p.sz*4}px ${p.sz}px rgba(200,65,0,0.5)`,
            filter:p.ash?"blur(0.6px)":"none",
          }}
          animate={{ y:[0,-1000],x:[0,p.drift],opacity:[0,p.ash?.4:.82,p.ash?.18:.5,0] }}
          transition={{ duration:p.dur,delay:p.del,repeat:Infinity,ease:"linear" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FILM GRAIN
───────────────────────────────────────────────────────────── */
const FilmGrain = () => (
  <div style={{
    position:"fixed",inset:0,zIndex:8,pointerEvents:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.07'/%3E%3C/svg%3E")`,
    opacity:0.4,mixBlendMode:"overlay",
  }}/>
);

/* ─────────────────────────────────────────────────────────────
   CORNER VINE SVG
───────────────────────────────────────────────────────────── */
const VineSVG = () => {
  const lp = d=>({ initial:{pathLength:0,opacity:0},animate:{pathLength:1,opacity:1},transition:{delay:d,duration:1.9,ease:"easeOut"} });
  return (
    <svg style={{ position:"fixed",inset:0,width:"100%",height:"100%",zIndex:14,pointerEvents:"none" }} preserveAspectRatio="none">
      <defs>
        <filter id="vg"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="h1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(135,18,18,0.92)"/><stop offset="100%" stopColor="rgba(135,18,18,0)"/></linearGradient>
        <linearGradient id="v1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(135,18,18,0.92)"/><stop offset="100%" stopColor="rgba(135,18,18,0)"/></linearGradient>
        <linearGradient id="h2" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="rgba(135,18,18,0.92)"/><stop offset="100%" stopColor="rgba(135,18,18,0)"/></linearGradient>
        <linearGradient id="bv" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="rgba(135,18,18,0.82)"/><stop offset="100%" stopColor="rgba(135,18,18,0)"/></linearGradient>
      </defs>
      {/* TL */}
      <motion.line x1="0" y1="1" x2="20%" y2="1" stroke="url(#h1)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.4)}/>
      <motion.line x1="1" y1="0" x2="1" y2="36%" stroke="url(#v1)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.5)}/>
      <motion.path d="M0 0 Q5% 8%,11% 6%" fill="none" stroke="rgba(125,16,16,0.32)" strokeWidth="0.38" {...lp(2.9)}/>
      <motion.circle cx="11%" cy="6%" r="1.4" fill="rgba(195,32,32,0.62)" animate={{opacity:[0.28,.88,.28],r:[0.9,1.9,0.9]}} transition={{duration:2.8,repeat:Infinity,delay:0.3}}/>
      {/* TR */}
      <motion.line x1="100%" y1="1" x2="80%" y2="1" stroke="url(#h2)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.4)}/>
      <motion.line x1="99.8%" y1="0" x2="99.8%" y2="36%" stroke="url(#v1)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.5)}/>
      <motion.path d="M100% 0 Q95% 8%,89% 6%" fill="none" stroke="rgba(125,16,16,0.32)" strokeWidth="0.38" {...lp(2.9)}/>
      <motion.circle cx="89%" cy="6%" r="1.4" fill="rgba(195,32,32,0.62)" animate={{opacity:[0.28,.88,.28],r:[0.9,1.9,0.9]}} transition={{duration:2.8,repeat:Infinity,delay:0.7}}/>
      {/* BL */}
      <motion.line x1="0" y1="99.8%" x2="16%" y2="99.8%" stroke="url(#h1)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.6)}/>
      <motion.line x1="1" y1="100%" x2="1" y2="68%" stroke="url(#bv)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.7)}/>
      <motion.circle cx="0.8%" cy="68%" r="1.2" fill="rgba(175,28,28,0.5)" animate={{opacity:[0.2,.62,.2]}} transition={{duration:3.4,repeat:Infinity,delay:1.1}}/>
      {/* BR */}
      <motion.line x1="100%" y1="99.8%" x2="84%" y2="99.8%" stroke="url(#h2)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.6)}/>
      <motion.line x1="99.8%" y1="100%" x2="99.8%" y2="68%" stroke="url(#bv)" strokeWidth="0.55" filter="url(#vg)" {...lp(2.7)}/>
      <motion.circle cx="99.2%" cy="68%" r="1.2" fill="rgba(175,28,28,0.5)" animate={{opacity:[0.2,.62,.2]}} transition={{duration:3.4,repeat:Infinity,delay:1.5}}/>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   METALLIC FANDOM TITLE  (medium-large, rock-solid)
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   CIRCUIT PATTERN  (inside HUD — SVG decorative lines)
───────────────────────────────────────────────────────────── */
function CircuitPattern({ color = "rgba(255,255,255,0.06)" }) {
  return (
    <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"hidden" }}
      preserveAspectRatio="none">
      {/* horizontal traces */}
      <line x1="0" y1="30%" x2="12%" y2="30%" stroke={color} strokeWidth="0.5"/>
      <line x1="0" y1="70%" x2="8%" y2="70%" stroke={color} strokeWidth="0.5"/>
      <line x1="88%" y1="30%" x2="100%" y2="30%" stroke={color} strokeWidth="0.5"/>
      <line x1="92%" y1="70%" x2="100%" y2="70%" stroke={color} strokeWidth="0.5"/>
      {/* vertical traces */}
      <line x1="8%" y1="70%" x2="8%" y2="100%" stroke={color} strokeWidth="0.5"/>
      <line x1="12%" y1="30%" x2="12%" y2="0%" stroke={color} strokeWidth="0.5"/>
      <line x1="88%" y1="30%" x2="88%" y2="0%" stroke={color} strokeWidth="0.5"/>
      <line x1="92%" y1="70%" x2="92%" y2="100%" stroke={color} strokeWidth="0.5"/>
      {/* via dots */}
      {[[12,30],[8,70],[88,30],[92,70]].map(([x,y],i)=>(
        <circle key={i} cx={`${x}%`} cy={`${y}%`} r="2" fill={color} stroke={color} strokeWidth="0.5"/>
      ))}
      {/* center trace fragments */}
      <line x1="35%" y1="0%" x2="35%" y2="22%" stroke={color} strokeWidth="0.5"/>
      <line x1="65%" y1="0%" x2="65%" y2="22%" stroke={color} strokeWidth="0.5"/>
      <line x1="35%" y1="78%" x2="35%" y2="100%" stroke={color} strokeWidth="0.5"/>
      <line x1="65%" y1="78%" x2="65%" y2="100%" stroke={color} strokeWidth="0.5"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   HUD STAT ICONS (inline SVG)
───────────────────────────────────────────────────────────── */
const TrophyIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 9.5C5 9.5 3.5 8 3.5 6V2.5H10.5V6C10.5 8 9 9.5 7 9.5Z" stroke={color} strokeWidth="0.75" fill="none"/>
    <line x1="4.5" y1="12" x2="9.5" y2="12" stroke={color} strokeWidth="0.75"/>
    <line x1="7" y1="9.5" x2="7" y2="12" stroke={color} strokeWidth="0.75"/>
    <path d="M3.5 4L1.8 4C1.8 5.8 2.6 7.2 3.8 7.8" stroke={color} strokeWidth="0.7" fill="none"/>
    <path d="M10.5 4L12.2 4C12.2 5.8 11.4 7.2 10.2 7.8" stroke={color} strokeWidth="0.7" fill="none"/>
  </svg>
);
const HashIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <line x1="4.5" y1="1.5" x2="3" y2="12.5" stroke={color} strokeWidth="0.75"/>
    <line x1="9.5" y1="1.5" x2="8" y2="12.5" stroke={color} strokeWidth="0.75"/>
    <line x1="1.5" y1="5" x2="12.5" y2="5" stroke={color} strokeWidth="0.75"/>
    <line x1="1.5" y1="9" x2="12.5" y2="9" stroke={color} strokeWidth="0.75"/>
  </svg>
);
const CalIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="2.5" width="11" height="10" rx="1.2" stroke={color} strokeWidth="0.75"/>
    <line x1="1.5" y1="5.8" x2="12.5" y2="5.8" stroke={color} strokeWidth="0.75"/>
    <line x1="4.5" y1="1.2" x2="4.5" y2="4" stroke={color} strokeWidth="0.75"/>
    <line x1="9.5" y1="1.2" x2="9.5" y2="4" stroke={color} strokeWidth="0.75"/>
    <rect x="5" y="7.5" width="1.8" height="1.8" rx="0.3" fill={color}/>
    <rect x="7.8" y="7.5" width="1.8" height="1.8" rx="0.3" fill={color}/>
  </svg>
);
const PinIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5C4.8 1.5 3 3.3 3 5.5C3 8.5 7 12.5 7 12.5C7 12.5 11 8.5 11 5.5C11 3.3 9.2 1.5 7 1.5Z" stroke={color} strokeWidth="0.75" fill="none"/>
    <circle cx="7" cy="5.5" r="1.4" stroke={color} strokeWidth="0.65"/>
  </svg>
);
const StarIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5L8.5 5.2H12.5L9.5 7.6L10.7 11.5L7 9.2L3.3 11.5L4.5 7.6L1.5 5.2H5.5Z" stroke={color} strokeWidth="0.7" fill="none"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   HUD DATA
───────────────────────────────────────────────────────────── */
const HUD_DATA = [
  { label:"PRIZE POOL", val:"₹50K",   Icon:TrophyIcon, color:"#ff2828", glow:"rgba(255,35,35,0.7)",  gd:0   },
  { label:"ROUNDS",     val:"09",     Icon:HashIcon,   color:"#2288ff", glow:"rgba(25,130,255,0.7)", gd:0.4 },
  { label:"DATE",       val:"APR 19", Icon:CalIcon,    color:"#ff9500", glow:"rgba(255,145,0,0.65)", gd:0.8 },
  { label:"VENUE",      val:"PVRL",   Icon:PinIcon,    color:"#aa2ff0", glow:"rgba(155,40,240,0.65)",gd:1.1 },
  { label:"EDITION",    val:"IV",     Icon:StarIcon,   color:"#18cc88", glow:"rgba(22,195,125,0.65)",gd:1.4 },
];

/* ─────────────────────────────────────────────────────────────
   GLASSMORPHISM HUD  (capsule, circuit pattern, neon border)
───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   WAND CURSOR  +  GOLD DUST TRAIL
───────────────────────────────────────────────────────────── */
function GoldDust({ trail }) {
  return (
    <>
      {trail.map(p=>(
        <motion.div key={p.id}
          style={{ position:"fixed",left:p.x,top:p.y,zIndex:160,pointerEvents:"none",transform:"translate(-50%,-50%)" }}
          initial={{ opacity:0.88,scale:1,x:0,y:0 }}
          animate={{ opacity:0,scale:0.1,x:p.vx*30,y:p.vy*30+16 }}
          transition={{ duration:0.82+Math.random()*0.32,ease:"easeOut" }}
        >
          <div style={{
            width:p.s+"px",height:p.s+"px",borderRadius:"50%",
            background:p.flash?"white":`radial-gradient(circle,#ffe0a0 0%,#bb8800 60%,transparent 100%)`,
            boxShadow:p.flash?"0 0 10px 4px rgba(255,255,255,.8)":`0 0 ${p.s*3}px ${p.s}px rgba(185,125,8,.52)`,
          }}/>
        </motion.div>
      ))}
    </>
  );
}

const WandCursor = ({ x,y,hot }) => (
  <div style={{ position:"fixed",left:x,top:y,zIndex:200,pointerEvents:"none",transform:"translate(-50%,-50%)" }}>
    <motion.div
      animate={{ boxShadow: hot
        ?"0 0 14px 6px rgba(255,255,255,1),0 0 40px 16px rgba(255,210,80,.9),0 0 80px 28px rgba(255,140,0,.5)"
        :"0 0 6px 2px rgba(255,255,255,.95),0 0 16px 6px rgba(255,220,140,.52),0 0 32px 11px rgba(192,145,45,.24)" }}
      transition={{ duration:.2 }}
      style={{ width:"5px",height:"5px",borderRadius:"50%",background:"white" }}
    />
    <div style={{
      position:"absolute",top:"calc(50% + 3px)",left:"50%",transform:"translateX(-50%)",
      width:"1px",height:"21px",
      background:"linear-gradient(to bottom,rgba(255,240,175,.86) 0%,transparent 100%)",
    }}/>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ROOT  APP
───────────────────────────────────────────────────────────── */
export default function FandomFinal() {
  const [mouse,  setMouse]  = useState({ x:-300,y:-300 });
  const [btnHot, setBtnHot] = useState(false);
  const [flash,  setFlash]  = useState(false);
  const [dust,   setDust]   = useState([]);


  const dustId  = useRef(0);
  const lastD   = useRef(0);

  /* cursor + dust */
  useEffect(()=>{
    const mv = e => {
      setMouse({ x:e.clientX,y:e.clientY });
      const now=Date.now();
      if(now-lastD.current<36) return;
      lastD.current=now;
      const n=2+Math.floor(Math.random()*2);
      setDust(d=>[...d.slice(-70),...Array.from({length:n},()=>({
        id:dustId.current++,
        x:e.clientX+(Math.random()-.5)*7,y:e.clientY+(Math.random()-.5)*7,
        s:1.1+Math.random()*2.4,vx:(Math.random()-.5)*1.7,vy:-(0.3+Math.random()*.85),
        flash:Math.random()>.88,
      }))]);
    };
    window.addEventListener("mousemove",mv);
    return ()=>window.removeEventListener("mousemove",mv);
  },[]);
  /* scroll tracking */


  const onFlash = useCallback(()=>{ setFlash(true); setTimeout(()=>setFlash(false),88); },[]);

  /* build 7×9 grid */
  const cells = useMemo(()=>{
    const arr=[];
    for(let i=0;i<COLS*ROWS;i++){
      const [title,genre]=MOVIES[i%MOVIES.length];
      arr.push(<LegendCell key={i} idx={i} title={title} genre={genre}/>);
    }
    return arr;
  },[]);

  return (
    <div style={{
  position:"relative",
  inset:0,
  overflowY:"auto",
  background:"#040209",
  cursor:"none"
}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
      `}</style>

      <PaparazziEngine onFlash={onFlash}/>

      {/* global paparazzi flash */}
      <AnimatePresence>
        {flash && (
          <motion.div key="pf"
            initial={{opacity:0}} animate={{opacity:[0,.52,.10,.40,0]}} exit={{opacity:0}}
            transition={{duration:.34,times:[0,.07,.16,.26,1]}}
            style={{
              position:"fixed",inset:0,zIndex:55,pointerEvents:"none",
              background:"radial-gradient(ellipse at 50% 38%,rgba(255,255,255,.58) 0%,rgba(255,248,228,.18) 42%,transparent 68%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── LEGEND WALL  (65% opacity, larger text) ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:1,opacity:0.65,
        display:"grid",
        gridTemplateColumns:`repeat(${COLS},1fr)`,
        gridTemplateRows:`repeat(${ROWS},1fr)`,
        alignItems:"center",justifyItems:"center",
      }}>{cells}</div>

      <FilmGrain/>

      {/* ── VIGNETTE  (heavy edges → central focus) ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:3,pointerEvents:"none",
        background:[
          "radial-gradient(ellipse 62% 60% at 50% 43%,rgba(4,2,9,0) 0%,rgba(4,2,9,0.58) 54%,rgba(4,2,9,0.96) 100%)",
          "linear-gradient(to bottom,rgba(4,2,9,0.68) 0%,transparent 17%,transparent 72%,rgba(4,2,9,0.84) 100%)",
          "linear-gradient(to right,rgba(4,2,9,0.50) 0%,transparent 13%,transparent 87%,rgba(4,2,9,0.50) 100%)",
        ].join(","),
      }}/>

      {/* ── ATMOSPHERE ── */}
      <Particles/>
      <VolumetricBeams/>
      <RedCarpet/>
      <VineSVG/>

      {/* ── HERO CENTER ── */}
      <div style={{
        position:"relative",inset:0,zIndex:30,height: "100vh",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        pointerEvents:"none",paddingBottom:"9vh",


       
      }}>
        {/* eyebrow */}
        <motion.div
          initial={{opacity:0,letterSpacing:"0.1em"}} animate={{opacity:1,letterSpacing:"0.52em"}}
          transition={{delay:.6,duration:1.9}}
          style={{
            fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(9px,1vw,12px)",
            fontStyle:"italic",fontWeight:300,color:"rgba(198,180,148,.50)",marginBottom:"16px",
          }}
        >THE ULTIMATE CINEPHILE CHALLENGE</motion.div>

        {/* top hairline */}
        <motion.div
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{delay:1.2,duration:1.7,ease:"easeInOut"}}
          style={{
            width:"200px",height:"0.5px",marginBottom:"20px",
            background:"linear-gradient(to right,transparent,rgba(255,195,75,.72),transparent)",
          }}
        />

        {/* ═══ TITLE ═══ */}
        <FandomTitle/>

        {/* bottom hairline */}
        <motion.div
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{delay:1.5,duration:1.7,ease:"easeInOut"}}
          style={{
            width:"200px",height:"0.5px",marginTop:"20px",marginBottom:"9px",
            background:"linear-gradient(to right,transparent,rgba(255,185,55,.68),transparent)",
          }}
        />

        <motion.div
          initial={{opacity:0}} animate={{opacity:1}}
          transition={{delay:1.9,duration:1.3}}
          style={{
            fontFamily:"'Courier New',monospace",fontSize:"clamp(6px,.65vw,8px)",
            letterSpacing:"0.82em",color:"rgba(158,142,108,.36)",marginBottom:"28px",
          }}
        >POP CULTURE QUIZ EVENT · 2026</motion.div>

        {/* ═══ GLASS HUD + CTA ═══ */}
        <div style={{ pointerEvents:"all",width:"min(680px,88vw)" }}>
          <GlassHUD/>

          <motion.div
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:3.0,duration:1.0}}
            style={{ display:"flex",justifyContent:"center" }}
          >
            <motion.button
              onMouseEnter={()=>setBtnHot(true)}
              onMouseLeave={()=>setBtnHot(false)}
              whileHover={{ scale:1.05 }}
              whileTap={{ scale:0.96 }}
              style={{
                background:"transparent",
                border:`0.5px solid ${btnHot?"rgba(255,195,75,0.9)":"rgba(195,175,135,.38)"}`,
                color:btnHot?"rgba(255,230,135,.98)":"rgba(195,175,135,.62)",
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(10px,.92vw,12px)",letterSpacing:"0.48em",
                padding:"13px 50px",cursor:"none",
                position:"relative",overflow:"hidden",
                transition:"color .22s,border-color .22s,box-shadow .22s",
                boxShadow:btnHot?"0 0 25px rgba(255,185,50,.28),0 0 55px rgba(255,140,0,.12),inset 0 0 25px rgba(255,160,25,.05)":"none",
              }}
            >
              <span style={{ position:"relative",zIndex:1 }}>REGISTER NOW</span>
              <motion.div
                initial={{x:"-110%"}} whileHover={{x:"110%"}}
                transition={{duration:.52}}
                style={{
                  position:"absolute",inset:0,
                  background:"linear-gradient(90deg,transparent,rgba(255,195,75,.11),transparent)",
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* tagline */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}}
        transition={{delay:3.5,duration:1.4}}
        style={{
          position:"fixed",bottom:"2.6vh",left:"50%",transform:"translateX(-50%)",
          zIndex:22,whiteSpace:"nowrap",
          fontFamily:"'Courier New',monospace",fontSize:"clamp(5px,.58vw,7px)",
          letterSpacing:"0.52em",color:"rgba(115,102,75,.32)",
        }}
      >WHERE EVERY FRAME TELLS A STORY</motion.div>
       <SecondSection />

</div>  
  );
}