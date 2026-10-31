window.__ModuleLoader__.load({id:"@aero123421/dsh-search-providers",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var ie=Object.defineProperty;var rt=Object.getOwnPropertyDescriptor;var nt=Object.getOwnPropertyNames;var st=Object.prototype.hasOwnProperty;var it=(e,t)=>{for(var o in t)ie(e,o,{get:t[o],enumerable:!0})},at=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of nt(t))!st.call(e,r)&&r!==o&&ie(e,r,{get:()=>t[r],enumerable:!(n=rt(t,r))||n.enumerable});return e};var dt=e=>at(ie({},"__esModule",{value:!0}),e);var Zt={};it(Zt,{SearchSettings:()=>et,apply:()=>Ut,inject:()=>Bt});module.exports=dt(Zt);var v=require("react");var Me=require("react");function Pe(e){var t,o,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var r=e.length;for(t=0;t<r;t++)e[t]&&(o=Pe(e[t]))&&(n&&(n+=" "),n+=o)}else for(o in e)e[o]&&(n&&(n+=" "),n+=o);return n}function lt(){for(var e,t,o=0,n="",r=arguments.length;o<r;o++)(e=arguments[o])&&(t=Pe(e))&&(n&&(n+=" "),n+=t);return n}var k=lt;var D={button:"dshsearch_477ea280_button",md:"dshsearch_477ea280_md",sm:"dshsearch_477ea280_sm",primary:"dshsearch_477ea280_primary",ghost:"dshsearch_477ea280_ghost",outline:"dshsearch_477ea280_outline",toolbar:"dshsearch_477ea280_toolbar",icon:"dshsearch_477ea280_icon"};var q=require("react/jsx-runtime"),b=(0,Me.forwardRef)(function({variant:t="ghost",size:o="md",icon:n,className:r,children:i,...d},a){return(0,q.jsxs)("button",{ref:a,type:"button",className:k(D.button,D[t],D[o],r),...d,children:[n!=null&&(0,q.jsx)("span",{className:D.icon,children:n}),i]})});var Le=require("react");var $={wrap:"dshsearch_6f543173_wrap",icon:"dshsearch_6f543173_icon",input:"dshsearch_6f543173_input"};var V=require("react/jsx-runtime"),K=(0,Le.forwardRef)(function({icon:t,className:o,...n},r){return(0,V.jsxs)("span",{className:k($.wrap,o),children:[t!=null&&(0,V.jsx)("span",{className:$.icon,children:t}),(0,V.jsx)("input",{ref:r,className:$.input,...n})]})});var ae={switch:"dshsearch_2ce6c3a9_switch",thumb:"dshsearch_2ce6c3a9_thumb"};var de=require("react/jsx-runtime");function G({checked:e,onChange:t,label:o,disabled:n=!1,title:r,className:i}){return(0,de.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":o,title:r,disabled:n,className:k(ae.switch,i),onClick:()=>{t(!e)},children:(0,de.jsx)("span",{className:ae.thumb})})}var Q=require("react"),vt=require("react-dom");var ct=require("react");var Se=require("react/jsx-runtime");var I=require("react/jsx-runtime");var le=1;var pt=({size:e=16,className:t,strokeWidth:o})=>(0,I.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,I.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,I.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),ce=e=>(0,I.jsx)(pt,{...e,strokeWidth:le});var ht=({size:e=16,className:t,strokeWidth:o})=>(0,I.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,I.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),pe=e=>(0,I.jsx)(ht,{...e,strokeWidth:le});var ut=({size:e=16,className:t,strokeWidth:o})=>(0,I.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,I.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,I.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),We=e=>(0,I.jsx)(ut,{...e,strokeWidth:le});var he=require("react");var X=require("react");function ue(e){let t=!1,o=!1,n=()=>{t=!0},r=()=>{t=!1,o=!0},i=()=>{o=!1},d=()=>{t=!1,o=!1};return e.addEventListener("compositionstart",n,!0),e.addEventListener("compositionend",r,!0),e.addEventListener("keyup",i,!0),e.defaultView?.addEventListener("blur",d),{guards:a=>{let c=t||o||a.isComposing||a.keyCode===229;return o=!1,c},dispose:()=>{e.removeEventListener("compositionstart",n,!0),e.removeEventListener("compositionend",r,!0),e.removeEventListener("keyup",i,!0),e.defaultView?.removeEventListener("blur",d)}}}var ge=new WeakMap,gt=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function J(e,t){ge.get(e)?.();let o=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",o),e.removeEventListener("keydown",n,!0),ge.delete(e)},n=r=>{!r.isComposing&&!r.ctrlKey&&!r.altKey&&!r.metaKey&&gt.has(r.key)&&o()};ge.set(e,o),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",o),e.addEventListener("keydown",n,!0),e.focus(t),e.matches(":focus")||o()}var fe=new WeakMap;var Ae='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function Oe(e,t,o){let n=(0,X.useRef)(o);n.current=o,(0,X.useLayoutEffect)(()=>{let r=e.current;if(!t||r===null)return;let i=r.ownerDocument,d=ue(i),a=i.activeElement,c=fe.get(i)??[];fe.set(i,c);let p={element:r,close:()=>{n.current()}};c.push(p);let w=r.querySelector("[data-modal-autofocus]")??r.querySelector(Ae)??r;r.contains(i.activeElement)||J(w);let g=f=>{let h=d.guards(f);if(c.at(-1)!==p||f.defaultPrevented||h||f.ctrlKey||f.altKey||f.metaKey||(f.key==="Escape"&&!f.shiftKey&&(f.preventDefault(),f.repeat||n.current()),f.key!=="Tab")||i.activeElement?.closest('[role="menu"]'))return;let y=[...r.querySelectorAll(Ae)].filter(T=>!T.closest("[inert], [hidden]")),l=y[0]??r,_=y.at(-1)??r,M=f.shiftKey?i.activeElement===l:i.activeElement===_;(i.activeElement===r||!r.contains(i.activeElement)||M)&&(f.preventDefault(),(f.shiftKey?_:l).focus())};return i.addEventListener("keydown",g),()=>{d.dispose();let f=c.at(-1)===p;if(c.splice(c.indexOf(p),1),i.removeEventListener("keydown",g),c.length===0&&fe.delete(i),f){let h=a instanceof HTMLElement&&a.isConnected?a:c.at(-1)?.element;h!==void 0&&J(h)}}},[e,t])}var ft=require("react/jsx-runtime");var H=require("react"),He=require("react-dom");var E={surface:"dshsearch_2b80f452_surface",backing:"dshsearch_2b80f452_backing",compact:"dshsearch_2b80f452_compact",material:"dshsearch_2b80f452_material"};var O=require("react/jsx-runtime"),mt=(0,H.forwardRef)(function({compact:t=!1,className:o,style:n,children:r,...i},d){let a=(0,H.useId)(),c=(0,H.useRef)(null);(0,H.useLayoutEffect)(()=>{document.body.appendChild(c.current)},[]);let p={"--dsh-menu-anchor":`--dsh-menu-${a.replaceAll(":","")}`};return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)("div",{...i,ref:d,"data-menu-material":"translucent",className:k(E.surface,t&&E.compact,o),style:{...n,...p},children:[(0,O.jsx)("div",{"aria-hidden":"true",className:E.material}),r]}),(0,He.createPortal)((0,O.jsx)("div",{ref:c,"aria-hidden":"true","data-menu-backing":"",className:k(E.backing,t&&E.compact),style:{...p,visibility:n?.visibility}}),document.body)]})});var Re=require("react/jsx-runtime");var Ne=require("react"),Be=require("react-dom");var P={root:"dshsearch_7a8ab0b3_root",mask:"dshsearch_7a8ab0b3_mask",dialog:"dshsearch_7a8ab0b3_dialog",content:"dshsearch_7a8ab0b3_content",header:"dshsearch_7a8ab0b3_header",title:"dshsearch_7a8ab0b3_title",close:"dshsearch_7a8ab0b3_close",description:"dshsearch_7a8ab0b3_description",body:"dshsearch_7a8ab0b3_body",footer:"dshsearch_7a8ab0b3_footer"};var x=require("react/jsx-runtime");function F({open:e,onClose:t,title:o,closeLabel:n,description:r,children:i,footer:d,className:a,contentClassName:c,onKeyDownCapture:p,headless:w=!1,backdropBlur:g=!0,shortcutModal:f}){let h=(0,Ne.useRef)(null);return Oe(h,e,t),e?(0,Be.createPortal)((0,x.jsxs)("div",{className:P.root,role:"presentation",onKeyDownCapture:p,children:[(0,x.jsx)("div",{className:P.mask,style:g?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:t}),(0,x.jsx)("div",{ref:h,tabIndex:-1,"data-shortcut-modal":f,className:k(P.dialog,a),role:"dialog","aria-modal":"true","aria-label":o,children:w?i:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("div",{className:k(P.content,c),children:[(0,x.jsxs)("div",{className:P.header,children:[(0,x.jsx)("h2",{className:P.title,children:o}),(0,x.jsx)("button",{type:"button",className:P.close,"aria-label":n,onClick:t,children:(0,x.jsx)(We,{size:14})})]}),r!==void 0&&r!==""&&(0,x.jsx)("p",{className:P.description,children:r}),i!==void 0&&(0,x.jsx)("div",{className:P.body,children:i})]}),d!==void 0&&(0,x.jsx)("div",{className:P.footer,children:d})]})})]}),document.body):null}var N={dot:"dshsearch_f9714c72_dot",spinner:"dshsearch_f9714c72_spinner",spinnerMotion:"dshsearch_f9714c72_spinnerMotion",spinnerTrack:"dshsearch_f9714c72_spinnerTrack",spinnerArc:"dshsearch_f9714c72_spinnerArc",step:"dshsearch_f9714c72_step"};var R=require("react/jsx-runtime");function wt(e){e!==null&&(Ee(e),e.addEventListener("animationstart",()=>{Ee(e)}))}function Ee(e){let t=e;for(let o of t.getAnimations?.({subtree:!0})??[])o.startTime=0}function z({state:e,size:t,className:o,appearance:n="dot"}){let r=t??(e==="ongoing"?14:10);return e==="ongoing"?(0,R.jsx)("svg",{ref:wt,className:k(N.spinner,o),"data-state":"ongoing",width:r,height:r,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,R.jsxs)("g",{className:N.spinnerMotion,children:[(0,R.jsx)("circle",{className:N.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,R.jsx)("circle",{className:N.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,R.jsx)("span",{className:k(n==="step"?N.step:N.dot,o),"data-state":e,style:{width:r,height:r},"aria-hidden":"true",children:n==="step"&&e==="done"&&(0,R.jsx)(pe,{size:r-2})})}var Te="0.4.1";function Ct(e){if(typeof e!="string"||e.length>8192||/[\\\u0000-\u001f\u007f]/.test(e))throw new C("invalid-request","Invalid URL");let t;try{t=new URL(e)}catch{throw new C("invalid-request","Invalid URL")}if(!["https:","http:"].includes(t.protocol)||t.username||t.password)throw new C("invalid-request","Expected an HTTP URL without credentials");return t.href}var bt=[".local",".localhost",".internal",".lan",".home",".home.arpa",".localdomain",".localtest.me",".lvh.me"],kt=new Set(["localhost","localtest.me","lvh.me","home.arpa","localdomain"]);function De(e){return/^(?:0|10|127)\./.test(e)||/^169\.254\./.test(e)||/^192\.168\./.test(e)||/^172\.(?:1[6-9]|2\d|3[01])\./.test(e)||/^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(e)||/^198\.(?:18|19)\./.test(e)||/^(?:22[4-9]|23\d|24\d|25[0-5])\./.test(e)}function me(e){return e.length!==4||e.some(t=>!/^\d{1,3}$/.test(t)||Number(t)>255)?!1:e.some(t=>t.length>1&&t.startsWith("0"))?!0:De(e.map(t=>String(Number(t))).join("."))}function xt(e){if(!e.includes("--")||e.split("--").length!==2||!/^[0-9a-f-]+$/i.test(e))return!1;let t=e.replace("--","\0").replaceAll("-",":").replaceAll("\0","::"),o;try{let d=new URL(`http://[${t}]`).hostname;if(!d.startsWith("[")||!d.endsWith("]"))return!1;o=d.slice(1,-1).toLowerCase()}catch{return!1}if(o==="::"||o==="::1")return!0;let n=/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(o);if(n){let d=Number.parseInt(n[1]??"",16),a=Number.parseInt(n[2]??"",16);return De(`${d>>8}.${d&255}.${a>>8}.${a&255}`)}let r=o.split(":")[0];if(!r)return!1;let i=Number.parseInt(r,16);return Number.isFinite(i)?(i&65472)===65152||(i&65024)===64512||(i&65472)===65216||(i&65280)===65280:!1}function yt(e){let t=e.split(".");for(let o=0;o+3<t.length;o++)if(me(t.slice(o,o+4)))return!0;for(let o of t){if(xt(o))return!0;for(let n of o.matchAll(/(?:^|-)(\d{1,3})-(\d{1,3})-(\d{1,3})-(\d{1,3})(?=-|$)/g))if(me([n[1]??"",n[2]??"",n[3]??"",n[4]??""]))return!0}return!1}function Ve(e){let t=new URL(Ct(e)),o=t.hostname.toLowerCase();if(o.includes("..")||o.startsWith("."))throw new C("blocked-url","Expected a public web URL");if(o=o.replace(/\.$/,""),!o.includes(".")||kt.has(o)||bt.some(n=>o.endsWith(n))||o.includes(":")||me(o.split("."))||yt(o))throw new C("blocked-url","Expected a public web URL");return t.href}var vr=2*1024*1024;var ve={keenable:["pro","realtime"],nimble:["lite","standard"],parallel:["turbo","fast","basic","advanced"],exa:["auto","instant","fast"],perplexity:["web","fast"]},ee={keenable:["mode","includeDomains","publishedAfter","publishedBefore","acquiredAfter","acquiredBefore","queryTime"],nimble:["country","language","mode","includeDomains","excludeDomains","publishedAfter","publishedBefore","recency"],tinyfish:["country","language","includeDomains","excludeDomains","publishedAfter","publishedBefore","recencyMinutes","yearMin","yearMax","purpose"],parallel:["country","mode","includeDomains","excludeDomains","publishedAfter"],exa:["country","mode","includeDomains","excludeDomains","publishedAfter","publishedBefore"],brave:["country","language","uiLanguage","safeSearch","freshness","goggles"],perplexity:["country","language","mode","includeDomains","excludeDomains","publishedAfter","publishedBefore","updatedAfter","updatedBefore","recency"],fxtwitter:[]},It=new Set("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ")),_t=new Set("aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu".split(" ")),Pt=new Set("AR AU AT BE BR CA CL DK FI FR DE HK IN ID IT JP KR MY MX NL NZ NO CN PL PT PH RU SA ZA ES SE CH TW TR GB US".split(" ")),Mt=new Set("AR AU AT BE BR CA CL CN DK FI FR DE GR HK IN ID IT JP MY MX NL NZ NO PH PL PT RU SA ZA KR ES SE CH TW TR GB US".split(" ")),Lt=new Set("ar eu bn bg ca zh-hans zh-hant hr cs da nl en en-gb et fi fr gl de gu he hi hu is it jp kn ko lv lt ms ml mr nb pl pt-br pt-pt pa ro ru sr sk sl es sv ta te th tr uk vi".split(" ")),St=new Set("es-AR en-AU de-AT nl-BE fr-BE pt-BR en-CA fr-CA es-CL da-DK fi-FI fr-FR de-DE zh-HK en-IN en-ID it-IT ja-JP ko-KR en-MY es-MX nl-NL en-NZ no-NO zh-CN pl-PL en-PH ru-RU en-ZA es-ES sv-SE fr-CH de-CH zh-TW tr-TR en-GB en-US".split(" "));function m(e){throw new C("invalid-request",e)}function Ke(e){return typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e)&&Number.isFinite(Date.parse(e))&&new Date(e).toISOString().slice(0,10)===e}function Wt(e){return(!Array.isArray(e)||!e.length||e.length>20)&&m("Use 1 to 20 plain domains"),e.map(t=>((typeof t!="string"||t.length>253||!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(t))&&m("Use plain domain names without paths, schemes or wildcards"),t.toLowerCase()))}function U(e,t,o){(!t||typeof t!="object"||Array.isArray(t))&&m("Search options must be an object");let n=t,r={};for(let[d,a]of Object.entries(n)){if(ee[e].includes(d)||m(`Unsupported ${e} search option: ${d}`),d==="includeDomains"||d==="excludeDomains"){r[d]=Wt(a);continue}if(d==="goggles"){(!Array.isArray(a)||!a.length||a.length>3||a.some(p=>typeof p!="string"||p.length>2e3))&&m("Use 1 to 3 public HTTPS Goggle URLs");let c=[];for(let p of a){let w;try{w=Ve(p)}catch{m("Use public HTTPS Goggle URLs")}new URL(w).protocol!=="https:"&&m("Use public HTTPS Goggle URLs"),c.push(w)}r[d]=c;continue}if(d==="yearMin"||d==="yearMax"||d==="recencyMinutes"){let c=d==="recencyMinutes"?5256e3:9999,p=d==="recencyMinutes"?1:0;(!Number.isSafeInteger(a)||a<p||a>c)&&m(`Invalid ${d}`),r[d]=a;continue}if((typeof a!="string"||!a.length||a.length>(d==="purpose"?2e3:100))&&m(`Invalid ${d}`),d==="country"){let c=a.toUpperCase();(e==="brave"?Pt:e==="parallel"?Mt:It).has(c)||m(`Unsupported ${e} country code`),r[d]=c}else if(d==="language")(e==="brave"?Lt:_t).has(a)||m(`Unsupported ${e} language code`),r[d]=a;else if(d==="uiLanguage")St.has(a)||m("Unsupported Brave UI language"),r[d]=a;else if(d==="mode")ve[e]?.includes(a)||m(`Unsupported ${e} mode`),r[d]=a;else if(["publishedAfter","publishedBefore","updatedAfter","updatedBefore","acquiredAfter","acquiredBefore","queryTime"].includes(d))Ke(a)||m(`${d} must be a real YYYY-MM-DD calendar date`),r[d]=a;else if(d==="recency")["hour","day","week","month","year"].includes(a)||m("Invalid recency"),r[d]=a;else if(d==="safeSearch")["off","moderate","strict"].includes(a)||m("Invalid safe search"),r[d]=a;else if(d==="freshness"){let c=a.split("to");!["pd","pw","pm","py"].includes(a)&&!(c.length===2&&c.every(Ke)&&c[0]<=c[1])&&m("Invalid Brave freshness range"),r[d]=a}else r[d]=a}let i=r;for(let[d,a]of[["publishedAfter","publishedBefore"],["updatedAfter","updatedBefore"],["acquiredAfter","acquiredBefore"],["yearMin","yearMax"]])i[d]!==void 0&&i[a]!==void 0&&i[d]>i[a]&&m(`Invalid ${d}/${a} range`);return(i.recency||i.recencyMinutes!==void 0)&&(i.publishedAfter||i.publishedBefore)&&m("Relative recency and publication dates cannot be combined"),i.includeDomains&&i.excludeDomains&&["parallel","perplexity"].includes(e)&&m(`${e} cannot combine include and exclude domains`),e==="keenable"&&(i.includeDomains?.length??0)>1&&m("Keenable supports one included site"),e==="tinyfish"&&o==="papers"&&(i.recencyMinutes!==void 0||i.publishedAfter||i.publishedBefore)&&m("TinyFish papers require publication years instead of dates/recency"),e==="tinyfish"&&o!==void 0&&o!=="papers"&&(i.yearMin!==void 0||i.yearMax!==void 0)&&m("Publication years require paper search"),e==="nimble"&&i.mode==="standard"&&o&&o!=="web"&&m("Nimble specialized focus requires lite mode"),e==="exa"&&(o==="people"||o==="companies")&&(i.publishedAfter||i.publishedBefore)&&m("Exa people/company do not support publication dates"),e==="exa"&&o==="people"&&i.excludeDomains&&m("Exa people do not support excluded domains"),e==="brave"&&o==="images"&&(i.freshness||i.goggles||i.uiLanguage||i.safeSearch==="moderate")&&m("Brave images support only country/language and off/strict safe search"),e==="brave"&&o&&o!=="web"&&o!=="news"&&i.goggles&&m("Goggles are supported only for Brave web/news search"),i}var Z="dsh-search-providers",we=["web","news","papers","code","people","companies","images","videos","extract","batchExtract","map","x"],Ce=[{id:"keenable",label:"Keenable",env:"KEENABLE_API_KEY",keyOptional:!0,capabilities:["web","extract"]},{id:"nimble",label:"Nimble",env:"NIMBLE_API_KEY",capabilities:["web","news","papers","code","extract","map"]},{id:"tinyfish",label:"TinyFish",env:"TINYFISH_API_KEY",capabilities:["web","news","papers","extract","batchExtract"]},{id:"parallel",label:"Parallel",env:"PARALLEL_API_KEY",capabilities:["web","extract","batchExtract"]},{id:"exa",label:"Exa",env:"EXA_API_KEY",capabilities:["web","news","papers","people","companies","extract","batchExtract"]},{id:"brave",label:"Brave",env:"BRAVE_API_KEY",capabilities:["web","news","images","videos"]},{id:"perplexity",label:"Perplexity",env:"PERPLEXITY_API_KEY",capabilities:["web","people"]},{id:"fxtwitter",label:"FxTwitter",keyOptional:!0,webSearch:!1,capabilities:["x"]}];function be(e){let t=Ce.find(o=>o.id===e);if(!t)throw new C("invalid-request","Unknown search provider");return t}var te=e=>`${Z}-${e}`;function Fe(e){let t=we.find(o=>o===e);if(!t)throw new C("invalid-request","Unknown search capability");return t}var C=class extends Error{code;status;constructor(t,o,n){super(o),this.code=t,this.status=n}};function B(e){if(!e||typeof e!="object"||Array.isArray(e))throw new C("invalid-response","Expected an object");return e}var Ue=["unknown-provider","unknown-capability","unsupported-capability","invalid-search","invalid-state","malformed"];var Ze=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,At=["idle","available","current","unavailable","incompatible","checking","installing","unknown","restart-required","applied","overridden","failed","cancelled"];function Ot(e){if(!e||typeof e!="object"||!("status"in e)||!At.includes(String(e.status))||!("running"in e)||typeof e.running!="string")throw new Error("invalid-response");let t=e;if(t.profileKey!==null&&!/^[0-9a-f]{64}$/.test(t.profileKey||"")||t.operation&&!Ze.test(t.operation))throw new Error("invalid-response");if(t.candidate&&(typeof t.candidate.id!="string"||typeof t.candidate.version!="string"||typeof t.candidate.url!="string"||!t.candidate.url.startsWith("https://github.com/Aero123421/dsh-search-providers/releases/tag/v")||typeof t.candidate.notes!="string"||typeof t.candidate.runtime!="string"))throw new Error("invalid-response");return t}var oe=class{view={status:"idle",running:Te,profileKey:null};listeners=new Set;generation=0;closed=!1;busy=!1;operation;profileKey=null;connection;storage;constructor(t,o){this.connection=t;try{this.storage=o??globalThis.localStorage}catch{this.storage=void 0}}storageKey(){return`dsh.searchProviders.update.${this.profileKey}.operation`}remember(t){if(this.operation=t,!!this.profileKey)try{t?this.storage?.setItem(this.storageKey(),t):this.storage?.removeItem(this.storageKey())}catch{}}subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});getSnapshot=()=>this.view;publish(t){if(!this.closed){this.view=t;for(let o of this.listeners)o()}}async call(t,o={}){let n=++this.generation;try{let r=await this.connection.rpc.call("/api",`${Z}/update-${t}`,o);if(!r.ok){if(t==="install"&&["busy","profile-changed"].some(i=>r.error.code.endsWith("/"+i))&&n===this.generation){this.remember(),this.publish({...this.view,status:"failed",reason:r.error.code.endsWith("/profile-changed")?"profile-changed":"busy"});return}throw new Error(r.error.code)}if(n===this.generation){let i=Ot(r.value);if(i.profileKey!==this.profileKey){let d=this.profileKey!==null;if(this.profileKey=i.profileKey,this.operation=void 0,this.profileKey)try{let a=this.storage?.getItem(this.storageKey());a&&Ze.test(a)&&(this.operation=a)}catch{}if(d&&o.operationId)return await this.status()}if(i.operation)this.remember(i.operation);else{if(t==="status"&&!o.operationId&&this.operation&&i.status!=="unavailable")return await this.call("status",{operationId:this.operation});t==="install"&&i.status==="failed"&&this.remember()}this.publish(i)}}catch{n===this.generation&&this.publish({...this.view,status:t==="install"||this.view.operation?"unknown":"failed",reason:"connection"})}}status=()=>this.call("status");async check(){if(!(this.busy||!this.profileKey)){this.busy=!0,this.publish({...this.view,status:"checking"});try{await this.call("check")}finally{this.busy=!1}}}async install(){if(this.busy||!this.profileKey||this.view.status!=="available"||!this.view.candidate)return;this.busy=!0;let t={profileKey:this.profileKey,candidateId:this.view.candidate.id,operationId:crypto.randomUUID()};this.remember(t.operationId),this.publish({...this.view,status:"installing",operation:t.operationId});try{await this.call("install",t)}finally{this.busy=!1}}reset(){++this.generation,this.busy=!1,this.status()}dispose(){this.closed=!0,++this.generation,this.listeners.clear()}};function re(e){if(typeof e!="string"||e.length>300)throw new C("invalid-response","Invalid settings value");return e}function ne(e){if(typeof e!="boolean")throw new C("invalid-response","Invalid settings state");return e}function Ye(e){let t=B(e);if(!Number.isSafeInteger(t.revision)||!Array.isArray(t.entries)||t.entries.length!==Ce.length)throw new C("invalid-response","Invalid settings snapshot");let o=new Set,n=t.entries.map(d=>{let a=B(d),c=be(a.id);if(o.has(c.id))throw new C("invalid-response","Duplicate search provider");return o.add(c.id),{...c,search:U(c.id,a.search??{}),enabled:ne(a.enabled),configured:ne(a.configured),writable:ne(a.writable),keyOptional:!!c.keyOptional,supportsKeys:!!c.env,webSearch:c.webSearch!==!1,...a.source===void 0?{}:{source:re(a.source)}}}),r={};for(let[d,a]of Object.entries(B(t.tools))){let c=Fe(d),p=B(a),w=be(p.provider);if(!w.capabilities.includes(c))throw new C("invalid-response","Unsupported search capability");r[c]={provider:w.id,enabled:ne(p.enabled)}}let i=t.problems===void 0?[]:Ht(t.problems);return{entries:n,tools:r,problems:i,revision:t.revision,searchProvider:re(t.searchProvider),searchRevision:re(t.searchRevision),nativeSearchProvider:re(t.nativeSearchProvider)}}function Ht(e){if(!Array.isArray(e)||e.length>100)throw new C("invalid-response","Invalid settings snapshot");return e.map(t=>{let o=B(t),n=o.scope==="providers"||o.scope==="tools"?o.scope:void 0,r=Ue.find(i=>i===o.reason);if(!n||!r||typeof o.id!="string"||o.id.length>300)throw new C("invalid-response","Invalid settings snapshot");return{scope:n,id:o.id,reason:r}})}var se=class{state={status:"idle"};listeners=new Set;pending;closed=!1;connection;constructor(t){this.connection=t}getSnapshot=()=>this.state;subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});publish(t){if(!this.closed){this.state=t;for(let o of this.listeners)o()}}async call(t,o={},n){let r=await this.connection.rpc.call("/api",`${Z}/${t}`,o,n);if(!r.ok)throw new Error(r.error.code);return r.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let t={abort:new AbortController,promise:Promise.resolve()};return this.pending=t,this.publish({...this.state,status:this.state.snapshot?"ready":"loading"}),t.promise=this.call("list",{},t.abort.signal).then(o=>{this.pending===t&&this.publish({status:"ready",snapshot:Ye(o)})}).catch(()=>{this.pending===t&&this.publish({...this.state,status:"ready",error:"loadFailed"})}).finally(()=>{this.pending===t&&(this.pending=void 0)}),t.promise}refresh(){return this.pending?.abort.abort(),this.pending=void 0,this.load()}refreshIfLoaded(){this.state.status!=="idle"&&this.refresh()}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear()}};function ke(e){return e.reason==="invalid-search"?"ignoredSearch":e.reason==="invalid-state"?"ignoredState":e.id?e.reason==="malformed"?e.scope==="tools"?"ignoredToolValue":"ignoredProviderValue":e.scope==="tools"?"ignoredTool":"ignoredProvider":"ignoredSection"}function je(e,t,o){return e.scope==="providers"&&t&&(e.reason==="invalid-search"||e.reason==="invalid-state"||e.reason==="malformed")?t:e.id?e.scope==="tools"&&o?o:e.id.length>80?`${e.id.slice(0,79)}\u2026`:e.id:""}var xe={updateRunning:"Running version",updateInstalled:"Installed version",updateCheck:"Check for updates",updateInstall:"Update",updateReconcile:"Check result",updateReleases:"Releases / manual update",updateChecked:"Last checked",updateReason:"Reason",updateStage:"Step",updatePin:"Updating changes your explicit pin to the selected release tag and preserves the current distribution route.",update_idle:"Ready to check.",update_available:"Update available.",update_current:"No newer stable release.",update_unavailable:"Automatic updating is unavailable.",update_incompatible:"This release does not support your DSH version.",update_checking:"Checking releases\u2026",update_installing:"Installing\u2026",update_unknown:"The result is unknown. Check the result; do not repeat installation.","update_restart-required":"Restart DSH to use the installed version.",update_applied:"The running version has been verified.",update_overridden:"A higher priority setting overrode this update.",update_failed:"The update failed.",update_cancelled:"Installation was cancelled.","updateReason_management-required":"The plugin manager or writable profile is unavailable.",updateReason_unaddressable:"The bundle is read-only.","updateReason_source-unsupported":"This installation route requires manual updating.",updateReason_incompatible:"The DSH version is incompatible.",updateReason_checksum:"The checksum did not match.",updateReason_connection:"The connection was interrupted.","updateReason_profile-changed":"The connection target changed. Check for updates again.","updateReason_already-installed":"DSH refused to install over the package that is already installed, and it was not removed.",updateReason_restored:"The new version failed to install. The previous source was installed again with its previous enabled state. Restart DSH if the running version is still the old one.","updateReason_restore-failed":"The new version failed to install, and installing the previous version again failed. The package is uninstalled. Install it again from Releases or the plugin manager.",updateReason_other:"Metadata, download, or installation failed. See Releases or the plugin manager for details.",searchSettings:"Search settings",cancel:"Cancel",saving:"Saving\u2026",resetSearchOptions:"Reset and save defaults",optionsDefaultNote:"Blank fields are omitted. Omission uses the API default or this plugin\u2019s legacy behavior; it does not guarantee automatic country or language detection. Saving replaces all search settings for this provider.",optionsBillingNote:"Modes can change speed, quality, credit use and extra billing. Check provider pricing. Any saved or per-call search options disable cross-provider fallback. Some settings apply only to specific features.",optionsConflictNote:"The latest settings were requested. Your edits are retained; review them before saving again.",optionsSaveFailed:"Saving could not be confirmed. Your edits are retained. Close and reopen to inspect saved settings, or save again to replace them.",optionsRefreshFailed:"The latest saved settings could not be loaded. Retry loading before saving again.",invalidOptions:"Check the values and ranges. Dates must be real YYYY-MM-DD dates; relative recency cannot be combined with publication dates. Parallel and Perplexity cannot combine included and excluded domains.",optionUnspecified:"Unspecified (API / legacy default)",option_country:"Country / region",option_language:"Search language",option_uiLanguage:"Interface language",option_mode:"Search mode",option_includeDomains:"Include domains",option_excludeDomains:"Exclude domains",option_goggles:"Goggles",option_publishedAfter:"Published after",option_publishedBefore:"Published before",option_updatedAfter:"Updated after",option_updatedBefore:"Updated before",option_acquiredAfter:"Acquired after",option_acquiredBefore:"Acquired before",option_queryTime:"Query date",option_recency:"Recency",option_recencyMinutes:"Recency in minutes",option_yearMin:"Earliest publication year",option_yearMax:"Latest publication year",option_purpose:"Search purpose",option_safeSearch:"Safe search",option_freshness:"Freshness",optionHint_country:"Use a supported two-letter API country code, e.g. JP (Japan), US or GB. Supported countries vary by provider.",optionLanguageHint:"Use an API language code, e.g. ja (Japanese), en or zh. This is a search preference, not a result-language guarantee.",optionBraveLanguageHint:"Brave uses jp for Japanese (not ja); other examples: en, zh-hans, zh-hant.",optionHint_uiLanguage:"Brave API locale, e.g. ja-JP for Japanese or en-US. This does not change the DSH interface.",optionHint_mode:"Values are this provider\u2019s API mode names. Leaving this blank preserves the existing default.",optionDomainsHint:"Plain domains without URLs, paths or wildcards; separate with commas or newlines. Up to 20 domains.",optionSingleDomainHint:"One plain domain only, without a URL, path or wildcard.",optionHint_goggles:"Up to 3 public HTTPS Goggle URLs, separated by commas or newlines. Brave web search only.",optionDateHint:"A real calendar date in YYYY-MM-DD format. Start must not be after end.",optionHint_recency:"Relative publication window. Leave publication dates blank when using recency.",optionHint_recencyMinutes:"Whole minutes from 1 to 5,256,000. Not for paper search; do not combine with publication dates.",optionYearHint:"Whole year from 0 to 9999. TinyFish paper search only; other searches do not support years.",optionHint_purpose:"Optional API search purpose, up to 2,000 characters.",optionHint_safeSearch:"Use the provider\u2019s content filter, or leave unspecified to preserve its default.",optionHint_freshness:"Brave: pd (day), pw (week), pm (month), py (year), or YYYY-MM-DDtoYYYY-MM-DD. Not for image search.",optionValue_hour:"Past hour",optionValue_day:"Past day",optionValue_week:"Past week",optionValue_month:"Past month",optionValue_year:"Past year",optionValue_off:"Off",optionValue_moderate:"Moderate",optionValue_strict:"Strict",web:"Advanced web search",webHint:"Search the web with this provider\u2019s options and supported pagination.",batchExtract:"Multiple page texts",batchExtractHint:"Extract text from multiple public URLs through this service.",pricingNote:"Prices change. As of 2026-10-15, Brave Search API has no standalone free plan; each plan includes $5 of monthly credit (about 1,000 Search queries) and needs a card.",bravePricing:"Brave plan description",fallbackNote:"If the selected provider returns HTTP 429, other enabled providers that support the same search are tried once each, in list order. That provider is not retried. Authentication failures, disabled providers, and unsupported searches stay on the selected provider. Page text, site maps, and X search do not switch. Any saved or per-call search options disable cross-provider fallback.",lifecycleNote:"Turning this plugin off, or uninstalling it, restores the previous web search provider. Uninstalling keeps saved API keys because the credentials store is shared by all profiles in DSH_HOME. To delete a key, use \u201CDelete saved key\u201D; this affects all profiles. Updating also keeps saved keys.",nav:"Web search provider",title:"Web search provider",native:"DSH default",default:"Default",setDefault:"Use for web search",enable:"Use this provider",saveKey:"Save API key",editKey:"Change API key",deleteKey:"Delete saved key",key:"API key",keySaved:"Key saved",keyMissing:"No API key",keyOptional:"Available without a key",source:"Source",selectTools:"Choose features",close:"Close",save:"Save",retry:"Retry",searchFeatures:"Search features",noFeatures:"No matching features",loadFailed:"Could not load settings.",saveFailed:"Could not save. Try again.",ignoredProvider:"This saved provider is not recognized, so it is not used.",ignoredProviderValue:"Saved settings for this provider could not be read, so they are not used.",ignoredTool:"This saved feature is not recognized or is not supported here, so it is not used.",ignoredToolValue:"Saved settings for this feature could not be read, so they are not used.",ignoredSearch:"Saved search settings could not be read, so they are not applied.",ignoredState:"The saved on/off value could not be read, so it is not applied.",ignoredSection:"This saved section could not be read, so its entries are not applied.",removeIgnored:"Remove saved entry",conflict:"Settings changed in another window. Try again.",missingKey:"Save an API key first.",disabled:"Enable the provider first.",keyHint:"The saved key is used before the environment variable.",nativeHint:"Use the search provider configured before this plugin.",defaultDisabled:"The default provider is disabled. Enable it or choose another provider.",providedBy:"Selected provider",feature:"Use feature",news:"News search",newsHint:"Find news articles.",papers:"Paper search",papersHint:"Find scholarly publications.",code:"Code search",codeHint:"Find public code examples and documentation.",people:"People search",peopleHint:"Find public professional profiles.",companies:"Company search",companiesHint:"Find company pages and public information.",images:"Image search",imagesHint:"Find images and their source pages.",videos:"Video search",videosHint:"Find videos and their descriptions.",extract:"Page text",extractHint:"Extract text from a public URL through this service.",map:"Website links",mapHint:"Find pages within a website.",x:"X search",xHint:"Search X posts or read a post URL. Keyword search may be unavailable."},qe={updateRunning:"\u5B9F\u884C\u7248",updateInstalled:"\u5C0E\u5165\u7248",updateCheck:"\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u66F4\u65B0\u3059\u308B",updateReconcile:"\u7D50\u679C\u3092\u78BA\u8A8D",updateReleases:"Release\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u65E5\u6642",updateReason:"\u7406\u7531",updateStage:"\u6BB5\u968E",updatePin:"\u7248\u56FA\u5B9A\u3092\u9078\u629E\u3057\u305FRelease\u30BF\u30B0\u306B\u5909\u66F4\u3057\u3001\u73FE\u5728\u306E\u914D\u5E03\u7D4C\u8DEF\u3092\u7DAD\u6301\u3057\u307E\u3059\u3002",update_idle:"\u66F4\u65B0\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002",update_available:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002",update_current:"\u65B0\u3057\u3044\u6B63\u5F0FRelease\u306F\u3042\u308A\u307E\u305B\u3093\u3002",update_unavailable:"\u3053\u306E\u69CB\u6210\u3067\u306F\u81EA\u52D5\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",update_incompatible:"\u3053\u306ERelease\u306F\u4F7F\u7528\u4E2D\u306EDSH\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",update_checking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",update_installing:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",update_unknown:"\u7D50\u679C\u304C\u4E0D\u660E\u3067\u3059\u3002\u5C0E\u5165\u3092\u7E70\u308A\u8FD4\u3055\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","update_restart-required":"\u5C0E\u5165\u7248\u3092\u4F7F\u3046\u306B\u306FDSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002",update_applied:"\u5B9F\u884C\u7248\u306E\u53CD\u6620\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",update_overridden:"\u4E0A\u4F4D\u306E\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u304C\u53CD\u6620\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002",update_failed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",update_cancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u306F\u53D6\u308A\u6D88\u3055\u308C\u307E\u3057\u305F\u3002","updateReason_management-required":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002",updateReason_unaddressable:"\u3053\u306Ebundle\u306F\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u3067\u3059\u3002","updateReason_source-unsupported":"\u73FE\u5728\u306E\u5C0E\u5165\u7D4C\u8DEF\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002",updateReason_incompatible:"DSH\u306E\u7248\u306B\u4E92\u63DB\u6027\u304C\u3042\u308A\u307E\u305B\u3093\u3002",updateReason_checksum:"\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",updateReason_connection:"\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F\u3002","updateReason_profile-changed":"\u63A5\u7D9A\u5148\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u66F4\u65B0\u3092\u518D\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_already-installed":"\u5C0E\u5165\u6E08\u307F\u30D1\u30C3\u30B1\u30FC\u30B8\u3078\u306E\u4E0A\u66F8\u304D\u3092DSH\u304C\u62D2\u5426\u3057\u3001\u30D1\u30C3\u30B1\u30FC\u30B8\u306F\u5916\u308C\u3066\u3044\u307E\u305B\u3093\u3002",updateReason_restored:"\u65B0\u3057\u3044\u7248\u306E\u5C0E\u5165\u306B\u5931\u6557\u3057\u305F\u305F\u3081\u3001\u4EE5\u524D\u306E\u5C0E\u5165\u5143\u3068\u6709\u52B9\u72B6\u614B\u3067\u5165\u308C\u76F4\u3057\u307E\u3057\u305F\u3002\u5B9F\u884C\u7248\u304C\u53E4\u3044\u307E\u307E\u306A\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_restore-failed":"\u65B0\u3057\u3044\u7248\u306E\u5C0E\u5165\u306B\u5931\u6557\u3057\u3001\u4EE5\u524D\u306E\u7248\u306E\u518D\u5C0E\u5165\u306B\u3082\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30D1\u30C3\u30B1\u30FC\u30B8\u306F\u5916\u308C\u305F\u307E\u307E\u3067\u3059\u3002Release\u304Bplugin manager\u304B\u3089\u5165\u308C\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_other:"metadata\u306E\u78BA\u8A8D\u30FB\u53D6\u5F97\u30FB\u5C0E\u5165\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Release\u307E\u305F\u306Fplugin manager\u3067\u8A73\u7D30\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",searchSettings:"\u691C\u7D22\u6761\u4EF6",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",saving:"\u4FDD\u5B58\u4E2D\u2026",resetSearchOptions:"\u65E2\u5B9A\u5024\u306B\u623B\u3057\u3066\u4FDD\u5B58",optionsDefaultNote:"\u7A7A\u6B04\u306E\u9805\u76EE\u306F\u9001\u4FE1\u3057\u307E\u305B\u3093\u3002\u7701\u7565\u6642\u306FAPI\u306E\u65E2\u5B9A\u5024\u307E\u305F\u306F\u5F93\u6765\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u52D5\u4F5C\u3092\u4F7F\u3044\u3001\u56FD\u3084\u8A00\u8A9E\u306E\u81EA\u52D5\u5224\u5B9A\u3092\u4FDD\u8A3C\u3059\u308B\u3082\u306E\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u4FDD\u5B58\u3059\u308B\u3068\u3001\u3053\u306E\u63D0\u4F9B\u5143\u306E\u691C\u7D22\u6761\u4EF6\u3092\u3059\u3079\u3066\u7F6E\u304D\u63DB\u3048\u307E\u3059\u3002",optionsBillingNote:"\u30E2\u30FC\u30C9\u306B\u3088\u308A\u901F\u5EA6\u30FB\u54C1\u8CEA\u30FB\u30AF\u30EC\u30B8\u30C3\u30C8\u6D88\u8CBB\u30FB\u8FFD\u52A0\u6599\u91D1\u304C\u5909\u308F\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002\u63D0\u4F9B\u5143\u306E\u6599\u91D1\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\u4FDD\u5B58\u6E08\u307F\u307E\u305F\u306F\u547C\u3073\u51FA\u3057\u6642\u306E\u691C\u7D22\u6761\u4EF6\u304C1\u3064\u3067\u3082\u3042\u308B\u3068\u3001\u5225\u306E\u63D0\u4F9B\u5143\u3078\u306E\u81EA\u52D5\u5207\u308A\u66FF\u3048\u306F\u884C\u3044\u307E\u305B\u3093\u3002\u7279\u5B9A\u306E\u6A5F\u80FD\u3060\u3051\u306B\u4F7F\u3048\u308B\u6761\u4EF6\u3082\u3042\u308A\u307E\u3059\u3002",optionsConflictNote:"\u6700\u65B0\u306E\u8A2D\u5B9A\u306E\u518D\u53D6\u5F97\u3092\u8A66\u307F\u307E\u3057\u305F\u3002\u5165\u529B\u5185\u5BB9\u306F\u6B8B\u3057\u3066\u3044\u307E\u3059\u3002\u78BA\u8A8D\u3057\u3066\u304B\u3089\u518D\u5EA6\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",optionsSaveFailed:"\u4FDD\u5B58\u7D50\u679C\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5165\u529B\u5185\u5BB9\u306F\u6B8B\u3057\u3066\u3044\u307E\u3059\u3002\u9589\u3058\u3066\u958B\u304D\u76F4\u3059\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u6761\u4EF6\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002\u518D\u5EA6\u4FDD\u5B58\u3059\u308B\u3068\u6761\u4EF6\u3092\u7F6E\u304D\u63DB\u3048\u307E\u3059\u3002",optionsRefreshFailed:"\u6700\u65B0\u306E\u4FDD\u5B58\u6E08\u307F\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u53D6\u5F97\u3057\u3066\u304B\u3089\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",invalidOptions:"\u5024\u3068\u7BC4\u56F2\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u65E5\u4ED8\u306F\u5B9F\u5728\u3059\u308BYYYY-MM-DD\u5F62\u5F0F\u3068\u3057\u3001\u76F8\u5BFE\u671F\u9593\u3068\u516C\u958B\u65E5\u3092\u4F75\u7528\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002Parallel\u30FBPerplexity\u3067\u306F\u5BFE\u8C61\u30C9\u30E1\u30A4\u30F3\u3068\u9664\u5916\u30C9\u30E1\u30A4\u30F3\u3092\u4F75\u7528\u3067\u304D\u307E\u305B\u3093\u3002",optionUnspecified:"\u672A\u6307\u5B9A\uFF08API\u30FB\u5F93\u6765\u306E\u65E2\u5B9A\u5024\uFF09",option_country:"\u56FD\u30FB\u5730\u57DF",option_language:"\u691C\u7D22\u8A00\u8A9E",option_uiLanguage:"\u8868\u793A\u8A00\u8A9E",option_mode:"\u691C\u7D22\u30E2\u30FC\u30C9",option_includeDomains:"\u5BFE\u8C61\u30C9\u30E1\u30A4\u30F3",option_excludeDomains:"\u9664\u5916\u30C9\u30E1\u30A4\u30F3",option_goggles:"Goggles",option_publishedAfter:"\u516C\u958B\u65E5\u306E\u4E0B\u9650",option_publishedBefore:"\u516C\u958B\u65E5\u306E\u4E0A\u9650",option_updatedAfter:"\u66F4\u65B0\u65E5\u306E\u4E0B\u9650",option_updatedBefore:"\u66F4\u65B0\u65E5\u306E\u4E0A\u9650",option_acquiredAfter:"\u53CE\u96C6\u65E5\u306E\u4E0B\u9650",option_acquiredBefore:"\u53CE\u96C6\u65E5\u306E\u4E0A\u9650",option_queryTime:"\u691C\u7D22\u57FA\u6E96\u65E5",option_recency:"\u76F4\u8FD1\u306E\u671F\u9593",option_recencyMinutes:"\u76F4\u8FD1\u306E\u5206\u6570",option_yearMin:"\u516C\u958B\u5E74\u306E\u4E0B\u9650",option_yearMax:"\u516C\u958B\u5E74\u306E\u4E0A\u9650",option_purpose:"\u691C\u7D22\u306E\u76EE\u7684",option_safeSearch:"\u30BB\u30FC\u30D5\u30B5\u30FC\u30C1",option_freshness:"\u9BAE\u5EA6",optionHint_country:"API\u304C\u5BFE\u5FDC\u3059\u308B2\u6587\u5B57\u306E\u56FD\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u307E\u3059\u3002\u4F8B\uFF1AJP\uFF08\u65E5\u672C\uFF09\u3001US\u3001GB\u3002\u5BFE\u5FDC\u3059\u308B\u56FD\u306F\u63D0\u4F9B\u5143\u3054\u3068\u306B\u7570\u306A\u308A\u307E\u3059\u3002",optionLanguageHint:"API\u306E\u8A00\u8A9E\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u307E\u3059\u3002\u4F8B\uFF1Aja\uFF08\u65E5\u672C\u8A9E\uFF09\u3001en\u3001zh\u3002\u691C\u7D22\u306E\u512A\u5148\u6307\u5B9A\u3067\u3042\u308A\u3001\u7D50\u679C\u306E\u8A00\u8A9E\u3092\u4FDD\u8A3C\u3059\u308B\u3082\u306E\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002",optionBraveLanguageHint:"Brave\u306E\u65E5\u672C\u8A9E\u306Fjp\u3067\u3059\uFF08ja\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF09\u3002\u307B\u304B\u306E\u4F8B\uFF1Aen\u3001zh-hans\u3001zh-hant\u3002",optionHint_uiLanguage:"Brave API\u306E\u5730\u57DF\u4ED8\u304D\u8A00\u8A9E\u30B3\u30FC\u30C9\u3002\u4F8B\uFF1A\u65E5\u672C\u8A9E\u306Fja-JP\u3001\u82F1\u8A9E\u306Fen-US\u3002DSH\u306E\u8868\u793A\u8A00\u8A9E\u306F\u5909\u308F\u308A\u307E\u305B\u3093\u3002",optionHint_mode:"\u3053\u306E\u63D0\u4F9B\u5143\u306EAPI\u306E\u30E2\u30FC\u30C9\u540D\u3067\u3059\u3002\u7A7A\u6B04\u306A\u3089\u5F93\u6765\u306E\u65E2\u5B9A\u5024\u3092\u7DAD\u6301\u3057\u307E\u3059\u3002",optionDomainsHint:"URL\u30FB\u30D1\u30B9\u30FB\u30EF\u30A4\u30EB\u30C9\u30AB\u30FC\u30C9\u3092\u9664\u3044\u305F\u30C9\u30E1\u30A4\u30F3\u3092\u3001\u30AB\u30F3\u30DE\u307E\u305F\u306F\u6539\u884C\u3067\u533A\u5207\u308A\u307E\u3059\u3002\u6700\u592720\u4EF6\u3067\u3059\u3002",optionSingleDomainHint:"URL\u30FB\u30D1\u30B9\u30FB\u30EF\u30A4\u30EB\u30C9\u30AB\u30FC\u30C9\u3092\u9664\u3044\u305F\u30C9\u30E1\u30A4\u30F3\u30921\u4EF6\u3060\u3051\u6307\u5B9A\u3067\u304D\u307E\u3059\u3002",optionHint_goggles:"\u516C\u958BHTTPS Goggle URL\u3092\u30AB\u30F3\u30DE\u307E\u305F\u306F\u6539\u884C\u3067\u533A\u5207\u308A\u307E\u3059\u3002\u6700\u59273\u4EF6\u3001Brave\u306E\u901A\u5E38\u691C\u7D22\u306E\u307F\u3067\u3059\u3002",optionDateHint:"\u5B9F\u5728\u3059\u308B\u65E5\u4ED8\u3092YYYY-MM-DD\u5F62\u5F0F\u3067\u6307\u5B9A\u3057\u307E\u3059\u3002\u4E0B\u9650\u306F\u4E0A\u9650\u4EE5\u524D\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",optionHint_recency:"\u516C\u958B\u65E5\u6642\u304B\u3089\u306E\u76F8\u5BFE\u671F\u9593\u3067\u3059\u3002\u4F7F\u7528\u3059\u308B\u3068\u304D\u306F\u516C\u958B\u65E5\u306E\u6761\u4EF6\u3092\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",optionHint_recencyMinutes:"1\u301C5,256,000\u306E\u6574\u6570\u306E\u5206\u6570\u3067\u3059\u3002\u8AD6\u6587\u691C\u7D22\u3067\u306F\u4F7F\u3048\u307E\u305B\u3093\u3002\u516C\u958B\u65E5\u3068\u306F\u4F75\u7528\u3067\u304D\u307E\u305B\u3093\u3002",optionYearHint:"0\u301C9999\u306E\u6574\u6570\u3002TinyFish\u306E\u8AD6\u6587\u691C\u7D22\u5C02\u7528\u3067\u3001\u307B\u304B\u306E\u691C\u7D22\u3067\u306F\u4F7F\u3048\u307E\u305B\u3093\u3002",optionHint_purpose:"API\u306B\u6E21\u3059\u691C\u7D22\u306E\u76EE\u7684\u3067\u3059\u3002\u4EFB\u610F\u3001\u6700\u59272,000\u6587\u5B57\u3002",optionHint_safeSearch:"\u63D0\u4F9B\u5143\u306E\u30B3\u30F3\u30C6\u30F3\u30C4\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002\u672A\u6307\u5B9A\u306A\u3089\u5F93\u6765\u306E\u65E2\u5B9A\u5024\u3092\u7DAD\u6301\u3057\u307E\u3059\u3002",optionHint_freshness:"Brave\uFF1Apd\uFF081\u65E5\uFF09\u3001pw\uFF081\u9031\u9593\uFF09\u3001pm\uFF081\u304B\u6708\uFF09\u3001py\uFF081\u5E74\uFF09\u3001\u307E\u305F\u306FYYYY-MM-DDtoYYYY-MM-DD\u3002\u753B\u50CF\u691C\u7D22\u3067\u306F\u4F7F\u3048\u307E\u305B\u3093\u3002",optionValue_hour:"\u76F4\u8FD11\u6642\u9593",optionValue_day:"\u76F4\u8FD11\u65E5",optionValue_week:"\u76F4\u8FD11\u9031\u9593",optionValue_month:"\u76F4\u8FD11\u304B\u6708",optionValue_year:"\u76F4\u8FD11\u5E74",optionValue_off:"\u7121\u52B9",optionValue_moderate:"\u6A19\u6E96",optionValue_strict:"\u53B3\u683C",web:"\u8A73\u7D30\u306A\u30A6\u30A7\u30D6\u691C\u7D22",webHint:"\u63D0\u4F9B\u5143\u306E\u691C\u7D22\u6761\u4EF6\u3068\u5BFE\u5FDC\u3059\u308B\u30DA\u30FC\u30B8\u9001\u308A\u3092\u4F7F\u3063\u3066\u30A6\u30A7\u30D6\u3092\u691C\u7D22\u3057\u307E\u3059\u3002",batchExtract:"\u8907\u6570\u30DA\u30FC\u30B8\u306E\u672C\u6587\u53D6\u5F97",batchExtractHint:"\u3053\u306E\u30B5\u30FC\u30D3\u30B9\u3067\u8907\u6570\u306E\u516C\u958BURL\u306E\u672C\u6587\u3092\u53D6\u308A\u51FA\u3057\u307E\u3059\u3002",pricingNote:"\u6599\u91D1\u306F\u5909\u308F\u308A\u307E\u3059\u30022026-10-15 \u6642\u70B9\u306E Brave Search API \u306B\u5358\u72EC\u306E\u7121\u6599\u30D7\u30E9\u30F3\u306F\u306A\u304F\u3001\u5404\u30D7\u30E9\u30F3\u306F\u6708 $5 \u306E\u30AF\u30EC\u30B8\u30C3\u30C8\uFF08Search \u3067\u306F\u7D04 1,000 \u30AF\u30A8\u30EA\uFF09\u3067\u3001\u52A0\u5165\u306B\u306F\u30AB\u30FC\u30C9\u304C\u5FC5\u8981\u3067\u3059\u3002",bravePricing:"Brave \u306E\u30D7\u30E9\u30F3\u8AAC\u660E",fallbackNote:"\u9078\u629E\u3057\u305F\u63D0\u4F9B\u5143\u304C HTTP 429 \u3092\u8FD4\u3057\u305F\u3068\u304D\u3060\u3051\u3001\u540C\u3058\u691C\u7D22\u306B\u4F7F\u3048\u308B\u6709\u52B9\u306A\u5225\u306E\u63D0\u4F9B\u5143\u3092\u4E00\u89A7\u306E\u9806\u306B 1 \u56DE\u305A\u3064\u8A66\u3057\u307E\u3059\u3002\u540C\u3058\u63D0\u4F9B\u5143\u3078\u306F\u518D\u9001\u3057\u307E\u305B\u3093\u3002\u8A8D\u8A3C\u5931\u6557\u3001\u7121\u52B9\u3001\u672A\u5BFE\u5FDC\u306E\u691C\u7D22\u3067\u306F\u5207\u308A\u66FF\u3048\u307E\u305B\u3093\u3002\u672C\u6587\u53D6\u5F97\u3001\u30B5\u30A4\u30C8\u4E00\u89A7\u3001X\u691C\u7D22\u3082\u5207\u308A\u66FF\u3048\u307E\u305B\u3093\u3002\u4FDD\u5B58\u6E08\u307F\u307E\u305F\u306F\u547C\u3073\u51FA\u3057\u6642\u306E\u691C\u7D22\u6761\u4EF6\u304C1\u3064\u3067\u3082\u3042\u308B\u5834\u5408\u3082\u5207\u308A\u66FF\u3048\u307E\u305B\u3093\u3002",lifecycleNote:"\u3053\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3092\u7121\u52B9\u306B\u3059\u308B\u304B\u524A\u9664\u3059\u308B\u3068\u3001\u901A\u5E38\u691C\u7D22\u306E\u691C\u7D22\u5148\u306F\u5909\u66F4\u524D\u306E\u5024\u306B\u623B\u3057\u307E\u3059\u3002\u4FDD\u5B58\u3057\u305FAPI\u30AD\u30FC\u306FDSH_HOME\u5185\u306E\u5168profile\u3067\u5171\u6709\u3055\u308C\u308B\u305F\u3081\u3001\u30A2\u30F3\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u5F8C\u3082\u6B8B\u308A\u307E\u3059\u3002\u30AD\u30FC\u3092\u6D88\u3059\u5834\u5408\u306F\u300C\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u524A\u9664\u300D\u3092\u4F7F\u3044\u307E\u3059\u3002\u3053\u306E\u64CD\u4F5C\u306F\u5168profile\u306B\u5F71\u97FF\u3057\u307E\u3059\u3002\u66F4\u65B0\u3067\u3082\u30AD\u30FC\u306F\u6B8B\u308A\u307E\u3059\u3002",nav:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",title:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",native:"DSH\u6A19\u6E96",default:"\u65E2\u5B9A",setDefault:"\u901A\u5E38\u691C\u7D22\u306B\u4F7F\u3046",enable:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",saveKey:"API\u30AD\u30FC\u3092\u4FDD\u5B58",editKey:"API\u30AD\u30FC\u3092\u5909\u66F4",deleteKey:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u524A\u9664",key:"API\u30AD\u30FC",keySaved:"\u30AD\u30FC\u4FDD\u5B58\u6E08\u307F",keyMissing:"API\u30AD\u30FC\u672A\u8A2D\u5B9A",keyOptional:"\u30AD\u30FC\u306A\u3057\u3067\u5229\u7528\u53EF\u80FD",source:"\u53D6\u5F97\u5143",selectTools:"\u4F7F\u3046\u6A5F\u80FD\u3092\u9078\u3076",close:"\u9589\u3058\u308B",save:"\u4FDD\u5B58",retry:"\u518D\u8A66\u884C",searchFeatures:"\u6A5F\u80FD\u3092\u691C\u7D22",noFeatures:"\u8A72\u5F53\u3059\u308B\u6A5F\u80FD\u306F\u3042\u308A\u307E\u305B\u3093",loadFailed:"\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",ignoredProvider:"\u4FDD\u5B58\u3055\u308C\u305F\u63D0\u4F9B\u5143\u306F\u8A8D\u8B58\u3067\u304D\u306A\u3044\u305F\u3081\u3001\u4F7F\u3044\u307E\u305B\u3093\u3002",ignoredProviderValue:"\u3053\u306E\u63D0\u4F9B\u5143\u306E\u4FDD\u5B58\u3055\u308C\u305F\u8A2D\u5B9A\u3092\u8AAD\u3081\u306A\u3044\u305F\u3081\u3001\u4F7F\u3044\u307E\u305B\u3093\u3002",ignoredTool:"\u4FDD\u5B58\u3055\u308C\u305F\u6A5F\u80FD\u306F\u8A8D\u8B58\u3067\u304D\u306A\u3044\u304B\u3001\u3053\u3053\u3067\u306F\u4F7F\u3048\u306A\u3044\u305F\u3081\u3001\u4F7F\u3044\u307E\u305B\u3093\u3002",ignoredToolValue:"\u3053\u306E\u6A5F\u80FD\u306E\u4FDD\u5B58\u3055\u308C\u305F\u8A2D\u5B9A\u3092\u8AAD\u3081\u306A\u3044\u305F\u3081\u3001\u4F7F\u3044\u307E\u305B\u3093\u3002",ignoredSearch:"\u4FDD\u5B58\u3055\u308C\u305F\u691C\u7D22\u8A2D\u5B9A\u3092\u8AAD\u3081\u306A\u3044\u305F\u3081\u3001\u9069\u7528\u3057\u307E\u305B\u3093\u3002",ignoredState:"\u4FDD\u5B58\u3055\u308C\u305F\u30AA\u30F3\uFF0F\u30AA\u30D5\u306E\u5024\u3092\u8AAD\u3081\u306A\u3044\u305F\u3081\u3001\u9069\u7528\u3057\u307E\u305B\u3093\u3002",ignoredSection:"\u4FDD\u5B58\u3055\u308C\u305F\u9805\u76EE\u3092\u8AAD\u3081\u306A\u3044\u305F\u3081\u3001\u305D\u306E\u5185\u5BB9\u306F\u9069\u7528\u3057\u307E\u305B\u3093\u3002",removeIgnored:"\u4FDD\u5B58\u9805\u76EE\u3092\u524A\u9664",conflict:"\u5225\u306E\u753B\u9762\u3067\u8A2D\u5B9A\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",missingKey:"\u5148\u306BAPI\u30AD\u30FC\u3092\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",disabled:"\u5148\u306B\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",keyHint:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u74B0\u5883\u5909\u6570\u3088\u308A\u512A\u5148\u3057\u3066\u4F7F\u3044\u307E\u3059\u3002",nativeHint:"\u3053\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3067\u5909\u66F4\u3059\u308B\u524D\u306E\u691C\u7D22\u5148\u3092\u4F7F\u3044\u307E\u3059\u3002",defaultDisabled:"\u65E2\u5B9A\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u7121\u52B9\u3067\u3059\u3002\u6709\u52B9\u306B\u3059\u308B\u304B\u3001\u5225\u306E\u691C\u7D22\u5148\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",providedBy:"\u9078\u629E\u4E2D\u306E\u63D0\u4F9B\u5143",feature:"\u6A5F\u80FD\u3092\u4F7F\u3046",news:"\u30CB\u30E5\u30FC\u30B9\u691C\u7D22",newsHint:"\u30CB\u30E5\u30FC\u30B9\u8A18\u4E8B\u3092\u63A2\u3057\u307E\u3059\u3002",papers:"\u8AD6\u6587\u691C\u7D22",papersHint:"\u5B66\u8853\u8AD6\u6587\u3092\u63A2\u3057\u307E\u3059\u3002",code:"\u30B3\u30FC\u30C9\u691C\u7D22",codeHint:"\u516C\u958B\u3055\u308C\u305F\u30B3\u30FC\u30C9\u4F8B\u3084\u6280\u8853\u6587\u66F8\u3092\u63A2\u3057\u307E\u3059\u3002",people:"\u4EBA\u7269\u691C\u7D22",peopleHint:"\u516C\u958B\u3055\u308C\u305F\u8077\u696D\u30FB\u6240\u5C5E\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",companies:"\u4F01\u696D\u691C\u7D22",companiesHint:"\u4F01\u696D\u306E\u30DA\u30FC\u30B8\u3084\u516C\u958B\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",images:"\u753B\u50CF\u691C\u7D22",imagesHint:"\u753B\u50CF\u3068\u63B2\u8F09\u30DA\u30FC\u30B8\u3092\u63A2\u3057\u307E\u3059\u3002",videos:"\u52D5\u753B\u691C\u7D22",videosHint:"\u52D5\u753B\u3068\u305D\u306E\u8AAC\u660E\u3092\u63A2\u3057\u307E\u3059\u3002",extract:"\u30DA\u30FC\u30B8\u672C\u6587\u53D6\u5F97",extractHint:"\u3053\u306E\u30B5\u30FC\u30D3\u30B9\u3067\u516C\u958BURL\u306E\u672C\u6587\u3092\u53D6\u308A\u51FA\u3057\u307E\u3059\u3002",map:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8\u4E00\u89A7",mapHint:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8URL\u3092\u63A2\u3057\u307E\u3059\u3002",x:"X\u691C\u7D22",xHint:"\u6295\u7A3F\u3092\u691C\u7D22\u3059\u308B\u304B\u3001\u6295\u7A3FURL\u304B\u3089\u672C\u6587\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u30AD\u30FC\u30EF\u30FC\u30C9\u691C\u7D22\u306F\u5229\u7528\u3067\u304D\u306A\u3044\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002"},$e={updateRunning:"\u8FD0\u884C\u7248\u672C",updateInstalled:"\u5B89\u88C5\u7248\u672C",updateCheck:"\u68C0\u67E5\u66F4\u65B0",updateInstall:"\u66F4\u65B0",updateReconcile:"\u68C0\u67E5\u7ED3\u679C",updateReleases:"Release / \u624B\u52A8\u66F4\u65B0",updateChecked:"\u68C0\u67E5\u65F6\u95F4",updateReason:"\u539F\u56E0",updateStage:"\u9636\u6BB5",updatePin:"\u5C06\u56FA\u5B9A\u7248\u672C\u6539\u4E3A\u6240\u9009 Release \u6807\u7B7E\uFF0C\u5E76\u4FDD\u6301\u5F53\u524D\u5206\u53D1\u65B9\u5F0F\u3002",update_idle:"\u5C1A\u672A\u68C0\u67E5\u66F4\u65B0\u3002",update_available:"\u6709\u53EF\u7528\u66F4\u65B0\u3002",update_current:"\u6CA1\u6709\u66F4\u65B0\u7684\u6B63\u5F0F Release\u3002",update_unavailable:"\u6B64\u914D\u7F6E\u65E0\u6CD5\u81EA\u52A8\u66F4\u65B0\u3002",update_incompatible:"\u6B64 Release \u4E0D\u652F\u6301\u5F53\u524D DSH \u7248\u672C\u3002",update_checking:"\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026",update_installing:"\u6B63\u5728\u5B89\u88C5\u2026",update_unknown:"\u7ED3\u679C\u672A\u77E5\u3002\u8BF7\u68C0\u67E5\u7ED3\u679C\uFF0C\u4E0D\u8981\u91CD\u590D\u5B89\u88C5\u3002","update_restart-required":"\u8BF7\u91CD\u542F DSH \u4EE5\u4F7F\u7528\u5DF2\u5B89\u88C5\u7248\u672C\u3002",update_applied:"\u5DF2\u786E\u8BA4\u8FD0\u884C\u7248\u672C\u3002",update_overridden:"\u66F4\u9AD8\u4F18\u5148\u7EA7\u7684\u8BBE\u7F6E\u8986\u76D6\u4E86\u66F4\u65B0\u3002",update_failed:"\u66F4\u65B0\u5931\u8D25\u3002",update_cancelled:"\u5B89\u88C5\u5DF2\u53D6\u6D88\u3002","updateReason_management-required":"\u6CA1\u6709 plugin manager \u6216\u53EF\u5199\u5165\u7684 profile\u3002",updateReason_unaddressable:"\u6B64 bundle \u4E3A\u53EA\u8BFB\u3002","updateReason_source-unsupported":"\u5F53\u524D\u5B89\u88C5\u65B9\u5F0F\u9700\u8981\u624B\u52A8\u66F4\u65B0\u3002",updateReason_incompatible:"DSH \u7248\u672C\u4E0D\u517C\u5BB9\u3002",updateReason_checksum:"\u6821\u9A8C\u548C\u4E0D\u5339\u914D\u3002",updateReason_connection:"\u8FDE\u63A5\u5DF2\u4E2D\u65AD\u3002","updateReason_profile-changed":"\u8FDE\u63A5\u76EE\u6807\u5DF2\u66F4\u6539\u3002\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002","updateReason_already-installed":"DSH \u62D2\u7EDD\u8986\u76D6\u5DF2\u5B89\u88C5\u7684\u5305\uFF0C\u4E14\u8BE5\u5305\u672A\u88AB\u79FB\u9664\u3002",updateReason_restored:"\u65B0\u7248\u672C\u5B89\u88C5\u5931\u8D25\uFF0C\u5DF2\u6309\u539F\u6765\u7684\u5B89\u88C5\u6765\u6E90\u548C\u542F\u7528\u72B6\u6001\u91CD\u65B0\u5B89\u88C5\u65E7\u7248\u672C\u3002\u5982\u679C\u8FD0\u884C\u7248\u672C\u4ECD\u662F\u65E7\u7248\u672C\uFF0C\u8BF7\u91CD\u542F DSH\u3002","updateReason_restore-failed":"\u65B0\u7248\u672C\u5B89\u88C5\u5931\u8D25\uFF0C\u91CD\u65B0\u5B89\u88C5\u65E7\u7248\u672C\u4E5F\u5931\u8D25\u4E86\u3002\u5305\u4ECD\u5904\u4E8E\u5DF2\u5378\u8F7D\u72B6\u6001\u3002\u8BF7\u4ECE Release \u6216 plugin manager \u518D\u6B21\u5B89\u88C5\u3002",updateReason_other:"\u5143\u6570\u636E\u3001\u4E0B\u8F7D\u6216\u5B89\u88C5\u5931\u8D25\u3002\u8BF7\u5728 Release \u6216 plugin manager \u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",searchSettings:"\u641C\u7D22\u6761\u4EF6",cancel:"\u53D6\u6D88",saving:"\u6B63\u5728\u4FDD\u5B58\u2026",resetSearchOptions:"\u91CD\u7F6E\u5E76\u4FDD\u5B58\u9ED8\u8BA4\u503C",optionsDefaultNote:"\u7A7A\u767D\u5B57\u6BB5\u4E0D\u4F1A\u63D0\u4EA4\u3002\u7701\u7565\u65F6\u4F7F\u7528API\u9ED8\u8BA4\u503C\u6216\u63D2\u4EF6\u7684\u539F\u6709\u884C\u4E3A\uFF0C\u5E76\u4E0D\u4FDD\u8BC1\u81EA\u52A8\u5224\u65AD\u56FD\u5BB6\u6216\u8BED\u8A00\u3002\u4FDD\u5B58\u4F1A\u66FF\u6362\u6B64\u63D0\u4F9B\u5546\u7684\u6240\u6709\u641C\u7D22\u6761\u4EF6\u3002",optionsBillingNote:"\u6A21\u5F0F\u53EF\u80FD\u5F71\u54CD\u901F\u5EA6\u3001\u8D28\u91CF\u3001\u989D\u5EA6\u6D88\u8017\u548C\u989D\u5916\u8D39\u7528\uFF0C\u8BF7\u67E5\u770B\u63D0\u4F9B\u5546\u5B9A\u4EF7\u3002\u53EA\u8981\u5B58\u5728\u5DF2\u4FDD\u5B58\u6216\u8C03\u7528\u65F6\u7684\u641C\u7D22\u6761\u4EF6\uFF0C\u5C31\u4E0D\u4F1A\u81EA\u52A8\u5207\u6362\u5230\u5176\u4ED6\u63D0\u4F9B\u5546\u3002\u90E8\u5206\u6761\u4EF6\u4EC5\u9002\u7528\u4E8E\u7279\u5B9A\u529F\u80FD\u3002",optionsConflictNote:"\u5DF2\u8BF7\u6C42\u6700\u65B0\u8BBE\u7F6E\u3002\u60A8\u7684\u8F93\u5165\u4ECD\u7136\u4FDD\u7559\uFF0C\u8BF7\u68C0\u67E5\u540E\u518D\u6B21\u4FDD\u5B58\u3002",optionsSaveFailed:"\u65E0\u6CD5\u786E\u8BA4\u4FDD\u5B58\u7ED3\u679C\uFF0C\u60A8\u7684\u8F93\u5165\u4ECD\u7136\u4FDD\u7559\u3002\u5173\u95ED\u540E\u91CD\u65B0\u6253\u5F00\u53EF\u67E5\u770B\u5DF2\u4FDD\u5B58\u8BBE\u7F6E\uFF1B\u518D\u6B21\u4FDD\u5B58\u5C06\u66FF\u6362\u641C\u7D22\u6761\u4EF6\u3002",optionsRefreshFailed:"\u65E0\u6CD5\u52A0\u8F7D\u6700\u65B0\u7684\u5DF2\u4FDD\u5B58\u8BBE\u7F6E\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u540E\u518D\u4FDD\u5B58\u3002",invalidOptions:"\u8BF7\u68C0\u67E5\u503C\u548C\u8303\u56F4\u3002\u65E5\u671F\u5FC5\u987B\u662F\u771F\u5B9E\u7684YYYY-MM-DD\u65E5\u671F\uFF1B\u76F8\u5BF9\u65F6\u95F4\u4E0D\u80FD\u4E0E\u53D1\u5E03\u65E5\u671F\u540C\u65F6\u4F7F\u7528\u3002Parallel\u548CPerplexity\u4E0D\u80FD\u540C\u65F6\u6307\u5B9A\u5305\u542B\u548C\u6392\u9664\u57DF\u540D\u3002",optionUnspecified:"\u672A\u6307\u5B9A\uFF08API / \u539F\u6709\u9ED8\u8BA4\u503C\uFF09",option_country:"\u56FD\u5BB6 / \u5730\u533A",option_language:"\u641C\u7D22\u8BED\u8A00",option_uiLanguage:"\u754C\u9762\u8BED\u8A00",option_mode:"\u641C\u7D22\u6A21\u5F0F",option_includeDomains:"\u5305\u542B\u57DF\u540D",option_excludeDomains:"\u6392\u9664\u57DF\u540D",option_goggles:"Goggles",option_publishedAfter:"\u53D1\u5E03\u65E5\u671F\u4E0B\u9650",option_publishedBefore:"\u53D1\u5E03\u65E5\u671F\u4E0A\u9650",option_updatedAfter:"\u66F4\u65B0\u65E5\u671F\u4E0B\u9650",option_updatedBefore:"\u66F4\u65B0\u65E5\u671F\u4E0A\u9650",option_acquiredAfter:"\u6536\u5F55\u65E5\u671F\u4E0B\u9650",option_acquiredBefore:"\u6536\u5F55\u65E5\u671F\u4E0A\u9650",option_queryTime:"\u67E5\u8BE2\u57FA\u51C6\u65E5\u671F",option_recency:"\u6700\u8FD1\u65F6\u95F4\u6BB5",option_recencyMinutes:"\u6700\u8FD1\u5206\u949F\u6570",option_yearMin:"\u6700\u65E9\u53D1\u8868\u5E74\u4EFD",option_yearMax:"\u6700\u665A\u53D1\u8868\u5E74\u4EFD",option_purpose:"\u641C\u7D22\u76EE\u7684",option_safeSearch:"\u5B89\u5168\u641C\u7D22",option_freshness:"\u65F6\u6548\u6027",optionHint_country:"\u8BF7\u8F93\u5165API\u652F\u6301\u7684\u4E24\u4F4D\u56FD\u5BB6\u4EE3\u7801\uFF0C\u4F8B\u5982JP\uFF08\u65E5\u672C\uFF09\u3001US\u6216GB\u3002\u5404\u63D0\u4F9B\u5546\u652F\u6301\u7684\u56FD\u5BB6\u4E0D\u540C\u3002",optionLanguageHint:"\u4F7F\u7528API\u8BED\u8A00\u4EE3\u7801\uFF0C\u4F8B\u5982ja\uFF08\u65E5\u8BED\uFF09\u3001en\u6216zh\u3002\u8FD9\u662F\u641C\u7D22\u504F\u597D\uFF0C\u4E0D\u4FDD\u8BC1\u7ED3\u679C\u7684\u8BED\u8A00\u3002",optionBraveLanguageHint:"Brave\u7684\u65E5\u8BED\u4EE3\u7801\u662Fjp\uFF08\u4E0D\u662Fja\uFF09\u3002\u5176\u4ED6\u793A\u4F8B\uFF1Aen\u3001zh-hans\u3001zh-hant\u3002",optionHint_uiLanguage:"Brave API\u533A\u57DF\u8BED\u8A00\u4EE3\u7801\uFF0C\u4F8B\u5982\u65E5\u8BEDja-JP\u6216\u82F1\u8BEDen-US\u3002\u4E0D\u4F1A\u66F4\u6539DSH\u754C\u9762\u8BED\u8A00\u3002",optionHint_mode:"\u6B64\u63D0\u4F9B\u5546\u7684API\u6A21\u5F0F\u540D\u79F0\u3002\u7559\u7A7A\u53EF\u4FDD\u7559\u539F\u6709\u9ED8\u8BA4\u503C\u3002",optionDomainsHint:"\u4EC5\u57DF\u540D\uFF0C\u4E0D\u542BURL\u3001\u8DEF\u5F84\u6216\u901A\u914D\u7B26\uFF1B\u4EE5\u9017\u53F7\u6216\u6362\u884C\u5206\u9694\uFF0C\u6700\u591A20\u9879\u3002",optionSingleDomainHint:"\u4EC5\u652F\u6301\u4E00\u4E2A\u57DF\u540D\uFF0C\u4E0D\u542BURL\u3001\u8DEF\u5F84\u6216\u901A\u914D\u7B26\u3002",optionHint_goggles:"\u6700\u591A3\u4E2A\u516C\u5F00\u7684HTTPS Goggle\u7F51\u5740\uFF0C\u4EE5\u9017\u53F7\u6216\u6362\u884C\u5206\u9694\u3002\u4EC5\u9002\u7528\u4E8EBrave\u7F51\u9875\u641C\u7D22\u3002",optionDateHint:"\u4F7F\u7528YYYY-MM-DD\u683C\u5F0F\u7684\u771F\u5B9E\u65E5\u671F\uFF0C\u5F00\u59CB\u65E5\u671F\u4E0D\u80FD\u665A\u4E8E\u7ED3\u675F\u65E5\u671F\u3002",optionHint_recency:"\u76F8\u5BF9\u53D1\u5E03\u65F6\u95F4\u8303\u56F4\uFF0C\u4F7F\u7528\u65F6\u8BF7\u5C06\u53D1\u5E03\u65E5\u671F\u5B57\u6BB5\u7559\u7A7A\u3002",optionHint_recencyMinutes:"1\u81F35,256,000\u7684\u6574\u6570\u5206\u949F\u6570\u3002\u4E0D\u9002\u7528\u4E8E\u8BBA\u6587\u641C\u7D22\uFF0C\u4E0D\u80FD\u4E0E\u53D1\u5E03\u65E5\u671F\u540C\u65F6\u4F7F\u7528\u3002",optionYearHint:"0\u81F39999\u7684\u6574\u6570\u3002\u4EC5\u9002\u7528\u4E8ETinyFish\u8BBA\u6587\u641C\u7D22\uFF0C\u5176\u4ED6\u641C\u7D22\u4E0D\u652F\u6301\u5E74\u4EFD\u3002",optionHint_purpose:"\u53EF\u9009\u7684API\u641C\u7D22\u76EE\u7684\uFF0C\u6700\u591A2,000\u5B57\u7B26\u3002",optionHint_safeSearch:"\u9009\u62E9\u63D0\u4F9B\u5546\u7684\u5185\u5BB9\u8FC7\u6EE4\u7EA7\u522B\uFF0C\u672A\u6307\u5B9A\u5219\u4FDD\u7559\u539F\u6709\u9ED8\u8BA4\u503C\u3002",optionHint_freshness:"Brave\uFF1Apd\uFF08\u5929\uFF09\u3001pw\uFF08\u5468\uFF09\u3001pm\uFF08\u6708\uFF09\u3001py\uFF08\u5E74\uFF09\u6216YYYY-MM-DDtoYYYY-MM-DD\u3002\u4E0D\u9002\u7528\u4E8E\u56FE\u7247\u641C\u7D22\u3002",optionValue_hour:"\u6700\u8FD1\u4E00\u5C0F\u65F6",optionValue_day:"\u6700\u8FD1\u4E00\u5929",optionValue_week:"\u6700\u8FD1\u4E00\u5468",optionValue_month:"\u6700\u8FD1\u4E00\u6708",optionValue_year:"\u6700\u8FD1\u4E00\u5E74",optionValue_off:"\u5173\u95ED",optionValue_moderate:"\u9002\u4E2D",optionValue_strict:"\u4E25\u683C",web:"\u9AD8\u7EA7\u7F51\u9875\u641C\u7D22",webHint:"\u4F7F\u7528\u6B64\u63D0\u4F9B\u5546\u7684\u641C\u7D22\u6761\u4EF6\u548C\u652F\u6301\u7684\u5206\u9875\u529F\u80FD\u641C\u7D22\u7F51\u9875\u3002",batchExtract:"\u591A\u7F51\u9875\u6B63\u6587",batchExtractHint:"\u901A\u8FC7\u6B64\u670D\u52A1\u63D0\u53D6\u591A\u4E2A\u516C\u5F00\u7F51\u5740\u7684\u6B63\u6587\u3002",pricingNote:"\u4EF7\u683C\u4F1A\u53D8\u5316\u3002\u622A\u81F3 2026-10-15\uFF0CBrave Search API \u6CA1\u6709\u5355\u72EC\u7684\u514D\u8D39\u8BA1\u5212\uFF1B\u6BCF\u4E2A\u8BA1\u5212\u6BCF\u6708\u542B $5 \u62B5\u7528\u989D\uFF08Search \u7EA6 1,000 \u6B21\u67E5\u8BE2\uFF09\uFF0C\u5F00\u901A\u9700\u8981\u94F6\u884C\u5361\u3002",bravePricing:"Brave \u7684\u8BA1\u5212\u8BF4\u660E",fallbackNote:"\u4EC5\u5F53\u6240\u9009\u63D0\u4F9B\u5546\u8FD4\u56DE HTTP 429 \u65F6\uFF0C\u624D\u4F1A\u6309\u5217\u8868\u987A\u5E8F\u5404\u5C1D\u8BD5\u4E00\u6B21\u5176\u4ED6\u5DF2\u542F\u7528\u4E14\u652F\u6301\u540C\u4E00\u641C\u7D22\u7684\u63D0\u4F9B\u5546\u3002\u4E0D\u4F1A\u5411\u540C\u4E00\u63D0\u4F9B\u5546\u81EA\u52A8\u91CD\u8BD5\u3002\u8BA4\u8BC1\u5931\u8D25\u3001\u5DF2\u7981\u7528\u6216\u4E0D\u652F\u6301\u7684\u641C\u7D22\u4E0D\u4F1A\u5207\u6362\u3002\u6B63\u6587\u63D0\u53D6\u3001\u7AD9\u5185\u94FE\u63A5\u548C X \u641C\u7D22\u4E5F\u4E0D\u4F1A\u5207\u6362\u3002\u5B58\u5728\u4EFB\u4F55\u5DF2\u4FDD\u5B58\u6216\u8C03\u7528\u65F6\u7684\u641C\u7D22\u6761\u4EF6\u65F6\uFF0C\u4E5F\u4E0D\u4F1A\u5207\u6362\u63D0\u4F9B\u5546\u3002",lifecycleNote:"\u5173\u95ED\u6216\u5378\u8F7D\u6B64\u63D2\u4EF6\u65F6\uFF0C\u4F1A\u628A\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546\u6062\u590D\u4E3A\u4E4B\u524D\u7684\u503C\u3002\u5DF2\u4FDD\u5B58\u7684 API \u5BC6\u94A5\u7531 DSH_HOME \u4E0B\u7684\u6240\u6709 profile \u5171\u7528\uFF0C\u56E0\u6B64\u5378\u8F7D\u540E\u4ECD\u4F1A\u4FDD\u7559\u3002\u8981\u5220\u9664\u5BC6\u94A5\uFF0C\u8BF7\u4F7F\u7528\u300C\u5220\u9664\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\u300D\uFF1B\u6B64\u64CD\u4F5C\u4F1A\u5F71\u54CD\u6240\u6709 profile\u3002\u66F4\u65B0\u4E5F\u4F1A\u4FDD\u7559\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\u3002",nav:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",title:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",native:"DSH \u9ED8\u8BA4",default:"\u9ED8\u8BA4",setDefault:"\u7528\u4E8E\u7F51\u9875\u641C\u7D22",enable:"\u4F7F\u7528\u6B64\u63D0\u4F9B\u5546",saveKey:"\u4FDD\u5B58 API \u5BC6\u94A5",editKey:"\u66F4\u6539 API \u5BC6\u94A5",deleteKey:"\u5220\u9664\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5",key:"API \u5BC6\u94A5",keySaved:"\u5DF2\u4FDD\u5B58\u5BC6\u94A5",keyMissing:"\u672A\u8BBE\u7F6E API \u5BC6\u94A5",keyOptional:"\u65E0\u9700\u5BC6\u94A5\u5373\u53EF\u4F7F\u7528",source:"\u6765\u6E90",selectTools:"\u9009\u62E9\u529F\u80FD",close:"\u5173\u95ED",save:"\u4FDD\u5B58",retry:"\u91CD\u8BD5",searchFeatures:"\u641C\u7D22\u529F\u80FD",noFeatures:"\u6CA1\u6709\u5339\u914D\u7684\u529F\u80FD",loadFailed:"\u65E0\u6CD5\u52A0\u8F7D\u8BBE\u7F6E\u3002",saveFailed:"\u65E0\u6CD5\u4FDD\u5B58\uFF0C\u8BF7\u91CD\u8BD5\u3002",ignoredProvider:"\u65E0\u6CD5\u8BC6\u522B\u5DF2\u4FDD\u5B58\u7684\u63D0\u4F9B\u5546\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u4F7F\u7528\u3002",ignoredProviderValue:"\u65E0\u6CD5\u8BFB\u53D6\u6B64\u63D0\u4F9B\u5546\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u4F7F\u7528\u3002",ignoredTool:"\u65E0\u6CD5\u8BC6\u522B\u5DF2\u4FDD\u5B58\u7684\u529F\u80FD\uFF0C\u6216\u8FD9\u91CC\u4E0D\u652F\u6301\u5B83\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u4F7F\u7528\u3002",ignoredToolValue:"\u65E0\u6CD5\u8BFB\u53D6\u6B64\u529F\u80FD\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u4F7F\u7528\u3002",ignoredSearch:"\u65E0\u6CD5\u8BFB\u53D6\u5DF2\u4FDD\u5B58\u7684\u641C\u7D22\u6761\u4EF6\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u5E94\u7528\u3002",ignoredState:"\u65E0\u6CD5\u8BFB\u53D6\u5DF2\u4FDD\u5B58\u7684\u5F00\u5173\u503C\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u5E94\u7528\u3002",ignoredSection:"\u65E0\u6CD5\u8BFB\u53D6\u5DF2\u4FDD\u5B58\u7684\u9879\u76EE\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u5E94\u7528\u5176\u5185\u5BB9\u3002",removeIgnored:"\u5220\u9664\u5DF2\u4FDD\u5B58\u9879",conflict:"\u8BBE\u7F6E\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u66F4\u6539\uFF0C\u8BF7\u91CD\u8BD5\u3002",missingKey:"\u8BF7\u5148\u4FDD\u5B58 API \u5BC6\u94A5\u3002",disabled:"\u8BF7\u5148\u542F\u7528\u63D0\u4F9B\u5546\u3002",keyHint:"\u4F18\u5148\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\uFF0C\u518D\u4F7F\u7528\u73AF\u5883\u53D8\u91CF\u3002",nativeHint:"\u4F7F\u7528\u5B89\u88C5\u6B64\u63D2\u4EF6\u524D\u914D\u7F6E\u7684\u641C\u7D22\u63D0\u4F9B\u5546\u3002",defaultDisabled:"\u9ED8\u8BA4\u63D0\u4F9B\u5546\u5DF2\u7981\u7528\uFF0C\u8BF7\u542F\u7528\u5B83\u6216\u9009\u62E9\u5176\u4ED6\u63D0\u4F9B\u5546\u3002",providedBy:"\u5DF2\u9009\u63D0\u4F9B\u5546",feature:"\u4F7F\u7528\u529F\u80FD",news:"\u65B0\u95FB\u641C\u7D22",newsHint:"\u67E5\u627E\u65B0\u95FB\u6587\u7AE0\u3002",papers:"\u8BBA\u6587\u641C\u7D22",papersHint:"\u67E5\u627E\u5B66\u672F\u8BBA\u6587\u3002",code:"\u4EE3\u7801\u641C\u7D22",codeHint:"\u67E5\u627E\u516C\u5F00\u4EE3\u7801\u793A\u4F8B\u548C\u6280\u672F\u6587\u6863\u3002",people:"\u4EBA\u7269\u641C\u7D22",peopleHint:"\u67E5\u627E\u516C\u5F00\u7684\u804C\u4E1A\u548C\u4EFB\u804C\u4FE1\u606F\u3002",companies:"\u4F01\u4E1A\u641C\u7D22",companiesHint:"\u67E5\u627E\u4F01\u4E1A\u7F51\u9875\u548C\u516C\u5F00\u4FE1\u606F\u3002",images:"\u56FE\u7247\u641C\u7D22",imagesHint:"\u67E5\u627E\u56FE\u7247\u53CA\u5176\u6765\u6E90\u7F51\u9875\u3002",videos:"\u89C6\u9891\u641C\u7D22",videosHint:"\u67E5\u627E\u89C6\u9891\u53CA\u5176\u8BF4\u660E\u3002",extract:"\u7F51\u9875\u6B63\u6587",extractHint:"\u901A\u8FC7\u6B64\u670D\u52A1\u63D0\u53D6\u516C\u5F00\u7F51\u5740\u7684\u6B63\u6587\u3002",map:"\u7F51\u7AD9\u9875\u9762\u5217\u8868",mapHint:"\u67E5\u627E\u7F51\u7AD9\u5185\u7684\u9875\u9762\u7F51\u5740\u3002",x:"X \u641C\u7D22",xHint:"\u641C\u7D22 X \u5E16\u5B50\u6216\u8BFB\u53D6\u5E16\u5B50\u7F51\u5740\u3002\u5173\u952E\u8BCD\u641C\u7D22\u53EF\u80FD\u4E0D\u53EF\u7528\u3002"};var Ge=`.dsh-search-settings { display: flex; flex-direction: column; gap: 12px; width: 100%; min-width: 0; max-width: 720px; box-sizing: border-box; container-type: inline-size; overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); }
.dsh-search-settings h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 500; }
.dsh-search-providers { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.dsh-search-provider { display: flex; flex-direction: column; gap: 12px; padding: 12px 14px; background: var(--dsw-alias-settings-card-fill); border: .5px solid var(--dsw-alias-settings-card-stroke); border-radius: var(--dsw-radius-xl); }
.dsh-search-provider-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; min-width: 0; }
.dsh-search-identity { display: flex; align-items: center; flex-wrap: wrap; flex: 1 1 120px; gap: 8px; min-width: 0; }
.dsh-search-provider-head > [role="switch"] { flex-shrink: 0; }
.dsh-search-provider, .dsh-search-providers, .dsh-search-actions, .dsh-search-status { min-width: 0; }
.dsh-search-provider-head > button:not([role="switch"]), .dsh-search-actions > button { min-width: 0; max-width: 100%; height: auto; min-height: 28px; padding-top: 4px; padding-bottom: 4px; white-space: normal; overflow-wrap: anywhere; }
.dsh-search-name { font-size: 14px; line-height: 22px; font-weight: 500; }
.dsh-search-tag { padding: 1px 6px; border: .5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-sm); font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dsh-search-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); flex-wrap: wrap; }
.dsh-search-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dsh-search-muted { margin: 4px 0 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
.dsh-search-note { margin: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.dsh-search-note a { color: inherit; }
.dsh-search-error { margin: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-state-error-primary); }
.dsh-search-loading { display: grid; place-items: center; min-height: 120px; }
.dsh-search-dialog { width: min(520px, 100%); max-height: 100%; min-height: 0; min-width: 0; overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2); }
.dsh-search-dialog-content { flex: 1 1 auto; overflow-y: auto; min-height: 0; }
.dsh-search-dialog-footer { display: flex; flex-direction: column; align-items: stretch; gap: 8px; width: 100%; min-width: 0; }
.dsh-search-dialog-footer .dsh-search-actions { justify-content: flex-end; }
.dsh-search-dialog-footer .dsh-search-muted, .dsh-search-dialog-footer .dsh-search-error { margin: 0; }
.dsh-search-options-form { display: flex; flex-direction: column; gap: 16px; min-width: 0; font-size: 14px; }
.dsh-search-options-form > .dsh-search-muted { margin: 0; }
.dsh-search-option { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dsh-search-option label { font-weight: 500; }
.dsh-search-option .dsh-search-muted { margin: 0; }
.dsh-search-select, .dsh-search-textarea { box-sizing: border-box; width: 100%; min-width: 0; padding: 6px 8px; border: .5px solid var(--dsw-alias-border-l4); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; line-height: 22px; }
.dsh-search-select:focus-visible, .dsh-search-textarea:focus-visible { outline: 1px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }
.dsh-search-textarea { resize: vertical; }
.dsh-search-select:disabled, .dsh-search-textarea:disabled { opacity: .4; }
.dsh-search-dialog .dsh-search-actions > button { min-height: 36px; }
@container (max-width: 240px) { .dsh-search-provider { padding: 10px; } .dsh-search-provider-head, .dsh-search-identity, .dsh-search-actions { gap: 6px; } .dsh-search-provider-head > button:not([role="switch"]), .dsh-search-actions > button { padding-left: 6px; padding-right: 6px; } }
.dsh-search-key-form { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.dsh-search-feature-list { display: flex; flex-direction: column; max-height: 360px; overflow-y: auto; padding: 2px 4px 2px 0; margin-top: 12px; }
.dsh-search-feature { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: .5px solid var(--dsw-alias-border-l3); font-size: 14px; }
.dsh-search-feature:last-child { border-bottom: 0; }
@media (max-width: 480px) { .dsh-search-provider { padding: 12px; } .dsh-search-actions { gap: 6px; } }

.dsh-search-settings .dsh-search-update { border-bottom: 1px solid var(--dsw-alias-border-l3); padding-bottom: 16px; margin-bottom: 16px; overflow-wrap: anywhere; }
.dsh-search-settings .dsh-search-update-notes { white-space: pre-wrap; max-height: 160px; overflow: auto; }
`;var Je=`/* Button sizes share the global control-radius scale. */
.dshsearch_477ea280_button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  border-radius: var(--dsw-radius-md);
  cursor: pointer;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  padding: 0 14px;
}

.dshsearch_477ea280_button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.dshsearch_477ea280_md {
  height: 36px;
}

/* Compact controls retain their dimensions across filled and outlined variants. */
.dshsearch_477ea280_sm {
  height: 28px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
  border-radius: var(--dsw-radius-sm);
}

.dshsearch_477ea280_primary {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
}

.dshsearch_477ea280_primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}

.dshsearch_477ea280_ghost:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dshsearch_477ea280_ghost:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}

/* Outlined actions use the same neutral stroke as settings links. */
.dshsearch_477ea280_outline {
  border: 0.5px solid var(--dsw-alias-border-l3);
  background: transparent;
}

.dshsearch_477ea280_outline:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dshsearch_477ea280_toolbar {
  background: var(--dsw-alias-button-tool-bar-fill);
}

.dshsearch_477ea280_toolbar:hover:not(:disabled) {
  background: var(--dsw-alias-button-tool-bar-hover);
}

.dshsearch_477ea280_icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

.dshsearch_6f543173_wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.dshsearch_6f543173_wrap:focus-within {
  border-color: var(--dsw-alias-state-business-primary);
}

.dshsearch_6f543173_icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-tertiary);
}

.dshsearch_6f543173_input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.dshsearch_6f543173_input::placeholder {
  color: var(--dsw-alias-label-dimmed);
}

.dshsearch_573a4530_root {
  position: relative;
  display: inline-flex;
}

/* Compact translucent dropdown card shared by feature menus. */
.dshsearch_573a4530_list,
.dshsearch_573a4530_submenu {
  /* min-widths below are the design's outer card widths \u2014 include the pad. */
  box-sizing: border-box;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 0;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  box-shadow: var(--dsw-elevation-prominent);
  /* Elevated surface: the scrollbar thumb takes the l2 elevation tokens. The
     declaration sits on the card rather than on \`.dshsearch_573a4530_scrollable .dshsearch_573a4530_viewport\`
     because the elevation is a property of this surface, and the custom
     properties inherit down to whichever descendant actually scrolls (see
     ui-theme styles/scrollbar.dshsearch_573a4530_css for the rebinding contract). */
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}

/* Primary cards grow with their content between compact and readable bounds. */
.dshsearch_573a4530_list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 144px;
  max-width: 360px;
}

/* Portal mode: fixed in the viewport, coordinates supplied inline from the
 * anchor rect (side/align resolved in JS, the in-place offset rules above
 * don't apply). Portaled lists must layer above modal overlays (z 1000) \u2014
 * an anchor inside a dialog still expects its menu on top. */
.dshsearch_573a4530_portal {
  position: fixed;
  top: auto;
  left: auto;
  z-index: 1100;
}

/* Open above the anchor (empty-state workspace chip: figma 122:9481). */
.dshsearch_573a4530_sideTop {
  top: auto;
  bottom: calc(100% + 4px);
}

.dshsearch_573a4530_alignEnd {
  left: auto;
  right: 0;
}

/* Viewport fit: the card stops 12px short of the viewport's top/bottom edges
 * (the portal MARGIN in Menu.dshsearch_573a4530_tsx; the top side widens to the frame's published
 * overlay inset) and taller content scrolls inside
 * .dshsearch_573a4530_viewport, so a pinned .dshsearch_573a4530_footer stays visible. Menus with submenu rows skip
 * this class \u2014 the overflow clip would crop the side card, so they rely on
 * staying short. */
.dshsearch_573a4530_scrollable {
  max-height: calc(100vh - 12px - max(12px, var(--dsh-frame-overlay-top, 12px)));
}

.dshsearch_573a4530_viewport {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dshsearch_573a4530_scrollable .dshsearch_573a4530_viewport {
  overflow-y: auto;
}

/* Pinned rows below the scroll region; l2 hairline (l1 is near-invisible on
 * the menu surface) mirrors the .dshsearch_573a4530_separator spacing. */
.dshsearch_573a4530_footer {
  flex: none;
  display: flex;
  flex-direction: column;
  margin-top: 3px;
  padding-top: 3px;
  border-top: 0.5px solid var(--dsw-alias-border-l2);
}

.dshsearch_573a4530_itemWrap {
  position: relative;
}

/* Menu cell: compact text, icon, and selection spacing. */
.dshsearch_573a4530_item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 34px;
  padding: 6px 8px;
  border: none;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
  text-align: left;
}

.dshsearch_573a4530_item:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Arrow navigation moves real focus, so the row the keyboard is on carries the
   same fill the pointer gets: the fill is the row's focus indication, and the
   browser's default ring would double it. */
.dshsearch_573a4530_item:focus-visible:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  outline: none;
}

.dshsearch_573a4530_denseList .dshsearch_573a4530_item {
  min-height: 30px;
  padding-block: 4px;
}

.dshsearch_573a4530_denseList .dshsearch_573a4530_label {
  padding-block: 3px;
}

.dshsearch_573a4530_list.dshsearch_573a4530_compactList,
.dshsearch_573a4530_submenu.dshsearch_573a4530_compactList {
  min-width: 156px;
  padding: 4px;
}

.dshsearch_573a4530_compactList .dshsearch_573a4530_item {
  min-height: 24px;
  gap: 5px;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-sm);
  font-size: 11px;
  line-height: 17px;
}

.dshsearch_573a4530_compactList .dshsearch_573a4530_itemIcon {
  width: 12px;
  height: 12px;
}

.dshsearch_573a4530_compactList .dshsearch_573a4530_separator {
  margin: 2px;
}

.dshsearch_573a4530_compactList .dshsearch_573a4530_label {
  padding: 3px 6px;
  font-size: 10px;
  line-height: 15px;
}

.dshsearch_573a4530_item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dshsearch_573a4530_itemIcon {
  display: inline-flex;
  flex: none;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-menu-icon);
}

.dshsearch_573a4530_itemIcon svg,
.dshsearch_573a4530_check {
  width: 14px;
  height: 14px;
}

.dshsearch_573a4530_compactList .dshsearch_573a4530_itemIcon svg,
.dshsearch_573a4530_compactList .dshsearch_573a4530_check {
  width: 12px;
  height: 12px;
}

.dshsearch_573a4530_itemLabel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dshsearch_573a4530_shortcut {
  flex: none;
  margin-inline-start: auto;
}

.dshsearch_573a4530_shortcut .dshsearch_573a4530_shortcutKeys {
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  line-height: 16px;
}

.dshsearch_573a4530_check {
  flex: none;
  color: var(--dsw-alias-label-primary);
}

/* Selected cell keeps the plain fill (marker is the trailing check); the
 * class remains as a hook for owner-side emphasis. */
.dshsearch_573a4530_selected {
  background: transparent;
}

/* Fill-mode selection: the row holds the hover fill instead of a check. */
.dshsearch_573a4530_selectedFill {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Destructive row: error text/icon, danger hover fill. */
.dshsearch_573a4530_danger {
  color: var(--dsw-alias-state-error-primary);
}

.dshsearch_573a4530_danger .dshsearch_573a4530_itemIcon {
  color: var(--dsw-alias-state-error-primary);
}

.dshsearch_573a4530_danger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
}

.dshsearch_573a4530_danger:focus-visible:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  outline: none;
}

/* Heading row: non-interactive small grey text, padding aligned with items. */
.dshsearch_573a4530_label {
  padding: 6px 8px;
  font-size: 11px;
  line-height: 15px;
  color: var(--dsw-alias-label-tertiary);
}

/* Separator cell (figma 122:9481): py 4 / px 2 around the hairline. l2, not
 * l1, for the same reason as .dshsearch_573a4530_footer: l1 is near-invisible on this surface. */
.dshsearch_573a4530_separator {
  height: 0.5px;
  margin: 3px 2px;
  background: var(--dsw-alias-border-l2);
}

/* A data separator directly followed by a row that starts a group draws one
 * line, not two; a group start on the list's first row draws none. */
.dshsearch_573a4530_separator + .dshsearch_573a4530_separator,
.dshsearch_573a4530_separator + .dshsearch_573a4530_itemWrap > .dshsearch_573a4530_separator:first-child,
.dshsearch_573a4530_itemWrap:first-child > .dshsearch_573a4530_separator:first-child {
  display: none;
}

/* The submenu aligns with the parent's bottom edge. Its hit bridge covers
 * the menu inset and the 6px gap so pointer movement keeps it open. */
.dshsearch_573a4530_submenu {
  position: absolute;
  top: auto;
  bottom: -4px;
  left: calc(100% + 10px);
  z-index: 101;
  min-width: 163px;
}

.dshsearch_573a4530_submenu::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -10px;
  width: 10px;
}

.dshsearch_2b80f452_surface,
.dshsearch_2b80f452_backing {
  border-radius: var(--dsw-radius-lg);
}

.dshsearch_2b80f452_compact {
  border-radius: var(--dsw-radius-md);
}

:where(.dshsearch_2b80f452_surface) {
  position: relative;
}

.dshsearch_2b80f452_surface {
  anchor-name: var(--dsh-menu-anchor);
  isolation: isolate;
}

/* Filtering only the background keeps nested menus and fixed overlays free of
 * an ancestor backdrop root or a new fixed-position containing block. */
.dshsearch_2b80f452_material {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: var(--dsw-menu-surface-fill);
  backdrop-filter: var(--dsw-menu-backdrop-filter);
  pointer-events: none;
}

.dshsearch_2b80f452_backing {
  display: none;
}

/* Chromium needs opaque pixels behind the page content to blur it over native
 * vibrancy. Body isolation keeps this backing above the native window and below
 * the page; CSS anchors limit it to this menu without a layout observer. */
html[data-platform='darwin'] .dshsearch_2b80f452_backing {
  display: block;
  position: fixed;
  position-anchor: var(--dsh-menu-anchor);
  top: anchor(top);
  left: anchor(left);
  width: anchor-size(width, 0px);
  height: anchor-size(height, 0px);
  z-index: -1;
  background: var(--dsw-alias-bg-base);
  pointer-events: none;
}

/* Full-viewport layer (figma Mask + Dialog 451:18655): mask + centered card.
   24px of air on every side; the top/bottom widen to the frame's published
   overlay inset so a tall card stays clear of it.
   Cards size against this padding box: consumers cap growth with
   \`max-height: 100%\`, never their own viewport calc. */
.dshsearch_7a8ab0b3_root {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(24px, var(--dsh-frame-overlay-top, 24px)) 24px;
}

/* Only paint excludes the native caption; the root still blocks background clicks. */
.dshsearch_7a8ab0b3_mask {
  position: absolute;
  inset: var(--dsh-frame-chrome-top, 0px) 0 0;
  backdrop-filter: var(--dsw-mask-blur);
}

.dshsearch_7a8ab0b3_mask::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--dsw-alias-bg-mask-1);
  animation: modalEnter var(--ds-transition-duration) var(--ds-ease-in-out);
}

/* Dialogs use the prominent elevation on the secondary layer. */
.dshsearch_7a8ab0b3_dialog {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(380px, 100%);
  padding: 0 0 24px;
  overflow: hidden;
  border: 0;
  border-radius: var(--dsw-radius-panel);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-elevation-prominent);
  animation: modalEnter var(--ds-transition-duration) var(--ds-ease-in-out);
}

@keyframes modalEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .dshsearch_7a8ab0b3_mask::after, .dshsearch_7a8ab0b3_dialog { animation: none; }
}

.dshsearch_7a8ab0b3_dialog:focus {
  outline: none;
}

.dshsearch_7a8ab0b3_content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Header row (figma Title row): pad l24/t22/r14/b12, SPACE_BETWEEN \u2014
 * title left, close button right. */
.dshsearch_7a8ab0b3_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 22px 14px 12px 24px;
}

.dshsearch_7a8ab0b3_title {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500; /* figma wt510, rendered 500 */
  color: var(--dsw-alias-label-primary);
}

.dshsearch_7a8ab0b3_close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
}

.dshsearch_7a8ab0b3_close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* Description and body share the 332px content column (24px side pads). */
.dshsearch_7a8ab0b3_description {
  margin: 0;
  padding: 0 24px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: var(--dsw-alias-label-primary);
}

.dshsearch_7a8ab0b3_body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-top: 20px;
  padding: 0 24px;
}

.dshsearch_7a8ab0b3_footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px;
}

.dshsearch_763faf77_keys {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 3px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}

.dshsearch_763faf77_key {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
}

.dshsearch_763faf77_tooltip { color: inherit; font-size: 11px; line-height: 14px; gap: 2px; }
.dshsearch_763faf77_tooltip .dshsearch_763faf77_key {
  min-width: 16px;
  height: 16px;
  padding: 0 2px;
  border-radius: 4px;
  border: 0;
  background: var(--dsw-alias-tooltip-key-bg);
}

.dshsearch_763faf77_separator { font: inherit; }

.dshsearch_763faf77_joined { box-sizing: border-box; height: 16px; padding: 0 4px; border-radius: 4px; background: var(--dsw-alias-tooltip-key-bg); }
.dshsearch_763faf77_joined .dshsearch_763faf77_key { min-width: 0; height: auto; padding: 0; border: 0; background: transparent; }

/* Solid states keep the 10px layout slot but paint one 6px currentColor core. */
.dshsearch_f9714c72_dot {
  position: relative;
  display: inline-block;
  flex: none;
}

.dshsearch_f9714c72_dot::after {
  content: '';
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  corner-shape: round;
  background: currentColor;
}

.dshsearch_f9714c72_dot[data-state='done'] {
  color: var(--dsw-alias-state-success-primary);
}

.dshsearch_f9714c72_dot[data-state='warning'] {
  color: var(--dsw-alias-state-warn-primary);
}

.dshsearch_f9714c72_dot[data-state='error'] {
  color: var(--dsw-alias-state-error-primary);
}

/* Idle is the absence of activity and uses the theme's neutral state step. */
.dshsearch_f9714c72_dot[data-state='idle'] {
  color: var(--dsw-alias-state-idle-primary);
}

/* Ongoing is the sole non-dot state: a quiet full ring sits behind a centered
 * breathing arc while the complete glyph rotates continuously. Both animations
 * share one 1.5s period so pinning their start times aligns them together. */
.dshsearch_f9714c72_spinner {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
}

.dshsearch_f9714c72_spinnerMotion {
  transform-origin: center;
  animation: dsh-state-dot-spin 1.5s linear infinite;
}

.dshsearch_f9714c72_spinnerTrack,
.dshsearch_f9714c72_spinnerArc {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.dshsearch_f9714c72_spinnerTrack {
  opacity: 0.25;
}

.dshsearch_f9714c72_spinnerArc {
  stroke-dasharray: 12 150;
  animation: dsh-state-dot-dash 1.5s ease-in-out infinite;
}

@keyframes dsh-state-dot-spin {
  to { transform: rotate(360deg); }
}

@keyframes dsh-state-dot-dash {
  0% {
    stroke-dasharray: 12 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 24 150;
    stroke-dashoffset: -6;
  }

  100% {
    stroke-dasharray: 12 150;
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dshsearch_f9714c72_spinnerMotion,
  .dshsearch_f9714c72_spinnerArc {
    animation: none;
  }

  .dshsearch_f9714c72_spinnerArc {
    stroke-dasharray: 18 150;
    stroke-dashoffset: -3;
  }
}

.dshsearch_f9714c72_step { display: inline-flex; flex: none; align-items: center; justify-content: center; box-sizing: border-box; border-radius: 50%; corner-shape: round; border: 1.5px solid var(--dsw-alias-label-tertiary); color: var(--dsw-alias-label-primary-foreground); }
.dshsearch_f9714c72_step[data-state='done'] { border-color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-state-success-primary); }
.dshsearch_f9714c72_step[data-state='error'] { border-color: var(--dsw-alias-state-error-primary); background: var(--dsw-alias-state-error-primary); }
.dshsearch_f9714c72_step[data-state='warning'] { border-color: var(--dsw-alias-state-warn-primary); }

/* The on/off appearance keys off aria-checked rather than a parallel class, so
 * the visual state cannot disagree with the state assistive technology reads.
 *
 * The capsule track and circular thumb opt out of the global superellipse. */
.dshsearch_2ce6c3a9_switch {
  box-sizing: border-box;
  position: relative;
  flex: 0 0 auto;
  width: 36px;
  height: 20px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-border-l3);
  cursor: pointer;
}

.dshsearch_2ce6c3a9_switch[aria-checked='true'] {
  background: var(--dsw-alias-brand-primary);
}

.dshsearch_2ce6c3a9_switch:disabled {
  cursor: default;
  opacity: 0.5;
}

.dshsearch_2ce6c3a9_switch:focus-visible {
  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

.dshsearch_2ce6c3a9_thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-label-primary-foreground);
  transition: transform 120ms ease;
}

.dshsearch_2ce6c3a9_switch[aria-checked='false'] .dshsearch_2ce6c3a9_thumb {
  background: var(--dsw-alias-switch-thumb);
}

.dshsearch_2ce6c3a9_switch[aria-checked='true'] .dshsearch_2ce6c3a9_thumb {
  transform: translateX(16px);
}
`;var s=require("react/jsx-runtime"),Ie="dsh.searchProviders",Bt=["slots","locale","connection","remote"];function Et(e){return(0,v.useSyncExternalStore)(t=>e.subscribe(t),()=>e.getSnapshot().revision),e.bind(Ie)}function Xe(e,t,o){let n=t.find(i=>i.id===e.id)?.label,r=e.scope==="tools"&&we.includes(e.id)?o(e.id):void 0;return je(e,n,r)}function Y(e){let t=e instanceof Error?e.message:"";return t.endsWith("/settings-changed")?"conflict":t.endsWith("/missing-key")?"missingKey":t.endsWith("/provider-disabled")?"disabled":"saveFailed"}function Tt({entry:e,controller:t,t:o,onClose:n}){let[r,i]=(0,v.useState)(""),[d,a]=(0,v.useState)(!1),[c,p]=(0,v.useState)(),w=(0,v.useId)();async function g(h){h.preventDefault(),a(!0),p(void 0);let y=r;try{await t.call("save-key",{provider:e.id,key:y}),i(""),await t.refresh(),n()}catch(l){p(Y(l))}finally{a(!1)}}async function f(){a(!0),i(""),p(void 0);try{await t.call("delete-key",{provider:e.id}),await t.refresh(),n()}catch(h){p(Y(h))}finally{a(!1)}}return(0,s.jsx)(F,{open:!0,title:`${e.label} \xB7 ${o("key")}`,closeLabel:o("close"),onClose:n,className:"dsh-search-dialog",children:(0,s.jsxs)("form",{onSubmit:h=>{g(h)},className:"dsh-search-key-form",children:[(0,s.jsx)("label",{htmlFor:w,children:o("key")}),(0,s.jsx)(K,{id:w,type:"password",autoComplete:"off",value:r,onChange:h=>i(h.target.value),disabled:d||!e.writable,"data-modal-autofocus":!0}),(0,s.jsx)("p",{className:"dsh-search-muted",children:o("keyHint")}),c&&(0,s.jsx)("p",{role:"alert",className:"dsh-search-error",children:o(c)}),(0,s.jsxs)("div",{className:"dsh-search-actions",children:[(0,s.jsx)(b,{type:"submit",variant:"primary",disabled:d||!r.trim()||!e.writable,children:o("save")}),e.source==="saved"&&(0,s.jsx)(b,{variant:"outline",disabled:d||!e.writable,onClick:()=>{f()},children:o("deleteKey")})]})]})})}function Dt({entry:e,snapshot:t,controller:o,t:n,onClose:r}){let[i,d]=(0,v.useState)(""),[a,c]=(0,v.useState)(!1),[p,w]=(0,v.useState)(),g=e.capabilities.filter(h=>`${n(h)} ${n(`${h}Hint`)}`.toLowerCase().includes(i.toLowerCase()));async function f(h,y){c(!0),w(void 0);try{await o.call("tool",{provider:e.id,capability:h,enabled:y,revision:t.revision}),await o.refresh()}catch(l){w(Y(l)),await o.refresh()}finally{c(!1)}}return(0,s.jsxs)(F,{open:!0,title:`${e.label} \xB7 ${n("selectTools")}`,closeLabel:n("close"),onClose:r,className:"dsh-search-dialog",children:[(0,s.jsx)(K,{"aria-label":n("searchFeatures"),placeholder:n("searchFeatures"),value:i,onChange:h=>d(h.target.value),"data-modal-autofocus":!0}),p&&(0,s.jsx)("p",{role:"alert",className:"dsh-search-error",children:n(p)}),(0,s.jsxs)("div",{className:"dsh-search-feature-list",children:[g.map(h=>{let y=t.tools[h],l=y?.enabled===!0&&y.provider===e.id,_=y?.enabled&&!l?t.entries.find(M=>M.id===y.provider):void 0;return(0,s.jsxs)("div",{className:"dsh-search-feature",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:n(h)}),(0,s.jsx)("p",{className:"dsh-search-muted",children:n(`${h}Hint`)}),_&&(0,s.jsxs)("p",{className:"dsh-search-muted",children:[n("providedBy"),": ",_.label]})]}),(0,s.jsx)(G,{label:`${n("feature")}: ${n(h)}`,checked:l,disabled:a||!e.enabled,onChange:M=>{f(h,M)}})]},h)}),g.length===0&&(0,s.jsx)("p",{className:"dsh-search-muted",children:n("noFeatures")})]})]})}var Qe=["includeDomains","excludeDomains","goggles"],ye=["recencyMinutes","yearMin","yearMax"],ze=["publishedAfter","publishedBefore","updatedAfter","updatedBefore","acquiredAfter","acquiredBefore","queryTime"];function Vt(e={}){return Object.fromEntries(Object.entries(e).map(([t,o])=>[t,Array.isArray(o)?o.join(`
`):String(o)]))}function Kt({entry:e,snapshot:t,controller:o,t:n,onClose:r}){let[i,d]=(0,v.useState)(()=>Vt(e.search)),[a,c]=(0,v.useState)(t.revision),[p,w]=(0,v.useState)(!1),[g,f]=(0,v.useState)(),[h,y]=(0,v.useState)(!1),l=(0,v.useId)(),_=`${l}-form`,M=ee[e.id];async function T(){await o.refresh();let u=o.getSnapshot();y(!!u.error||!u.snapshot),u.snapshot&&!u.error&&c(u.snapshot.revision)}async function _e(u=!1){if(p||h)return;let j;try{let L=Object.fromEntries(M.flatMap(S=>{let W=i[S]?.trim();return W?[[S,Qe.includes(S)?W.split(/[,\n]/).map(A=>A.trim()).filter(Boolean):ye.includes(S)?Number(W):W]]:[]}));j=U(e.id,u?{}:L)}catch{f("invalidOptions");return}w(!0),f(void 0);try{await o.call("search-options",{provider:e.id,options:j,revision:a}),await o.refresh(),r()}catch(L){let S=Y(L);f(L instanceof Error&&L.message.endsWith("/invalid-request")?"invalidOptions":S==="saveFailed"?"optionsSaveFailed":S),await T()}finally{w(!1)}}function tt(u){return u==="language"?e.id==="brave"?"optionBraveLanguageHint":"optionLanguageHint":ze.includes(u)?"optionDateHint":u==="includeDomains"||u==="excludeDomains"?e.id==="keenable"?"optionSingleDomainHint":"optionDomainsHint":u==="yearMin"||u==="yearMax"?"optionYearHint":`optionHint_${u}`}return(0,s.jsx)(F,{open:!0,title:`${e.label} \xB7 ${n("searchSettings")}`,closeLabel:n("close"),onClose:()=>{p||r()},className:"dsh-search-dialog dsh-search-options-dialog",contentClassName:"dsh-search-dialog-content",footer:(0,s.jsxs)("div",{className:"dsh-search-dialog-footer",children:[g&&(0,s.jsx)("p",{role:"alert",className:"dsh-search-error",children:n(g)}),g==="conflict"&&(0,s.jsx)("p",{className:"dsh-search-muted",children:n("optionsConflictNote")}),h&&(0,s.jsxs)("p",{role:"alert",className:"dsh-search-error",children:[n("optionsRefreshFailed")," ",(0,s.jsx)(b,{type:"button",size:"sm",disabled:p,onClick:()=>{w(!0),T().finally(()=>w(!1))},children:n("retry")})]}),p&&(0,s.jsx)("p",{role:"status",className:"dsh-search-muted",children:n("saving")}),(0,s.jsxs)("div",{className:"dsh-search-actions",children:[(0,s.jsx)(b,{type:"submit",form:_,variant:"primary",disabled:p||h,children:n("save")}),(0,s.jsx)(b,{type:"button",variant:"outline",disabled:p||h,onClick:()=>{_e(!0)},children:n("resetSearchOptions")}),(0,s.jsx)(b,{type:"button",variant:"outline",disabled:p,onClick:r,children:n("cancel")})]})]}),children:(0,s.jsxs)("form",{id:_,className:"dsh-search-options-form",noValidate:!0,"aria-busy":p,onSubmit:u=>{u.preventDefault(),_e()},children:[(0,s.jsx)("p",{className:"dsh-search-muted",children:n("optionsDefaultNote")}),(0,s.jsx)("p",{className:"dsh-search-muted",children:n("optionsBillingNote")}),M.map((u,j)=>{let L=`${l}-${u}`,S=u==="mode"?ve[e.id]:u==="recency"?["hour","day","week","month","year"]:u==="safeSearch"?["off","moderate","strict"]:void 0,W={id:L,value:i[u]??"",disabled:p,"aria-describedby":`${L}-hint`,"data-modal-autofocus":j===0?!0:void 0,onChange:A=>d(ot=>({...ot,[u]:A.target.value}))};return(0,s.jsxs)("div",{className:"dsh-search-option",children:[(0,s.jsx)("label",{htmlFor:L,children:n(`option_${u}`)}),S?(0,s.jsxs)("select",{...W,className:"dsh-search-select",children:[(0,s.jsx)("option",{value:"",children:n("optionUnspecified")}),S.map(A=>(0,s.jsx)("option",{value:A,children:u==="mode"?A:n(`optionValue_${A}`)},A))]}):Qe.includes(u)||u==="purpose"?(0,s.jsx)("textarea",{...W,className:"dsh-search-textarea",rows:u==="purpose"?2:3}):(0,s.jsx)(K,{...W,type:ye.includes(u)?"number":"text",min:u==="recencyMinutes"?1:0,max:u==="recencyMinutes"?5256e3:9999,step:ye.includes(u)?1:void 0,placeholder:ze.includes(u)?"YYYY-MM-DD":u==="country"?"JP":u==="language"?e.id==="brave"?"jp":"ja":u==="uiLanguage"?"ja-JP":void 0}),(0,s.jsx)("p",{id:`${L}-hint`,className:"dsh-search-muted",children:n(tt(u))})]},u)})]})})}function Ft({controller:e,t}){let o=(0,v.useSyncExternalStore)(e.subscribe,e.getSnapshot);(0,v.useEffect)(()=>{e.status()},[e]);let n=!o.profileKey||o.status==="checking"||o.status==="installing";return(0,s.jsxs)("div",{className:"dsh-search-update",children:[(0,s.jsxs)("p",{children:[t("updateRunning"),": ",o.running,o.installed&&o.installed!==o.running?` \xB7 ${t("updateInstalled")}: ${o.installed}`:""]}),(0,s.jsxs)("p",{role:"status",children:[t(`update_${o.status}`),o.reason&&(0,s.jsxs)("span",{children:[" \xB7 ",t("updateReason"),": ",t(`updateReason_${o.reason}`in xe?`updateReason_${o.reason}`:"updateReason_other")]}),o.requirements&&(0,s.jsxs)("span",{children:[" \xB7 ",Object.entries(o.requirements).map(([r,i])=>`${r} ${i}`).join(" \xB7 ")]}),o.stage&&(0,s.jsxs)("span",{children:[" \xB7 ",t("updateStage"),": ",o.stage]})]}),o.checkedAt&&(0,s.jsxs)("p",{className:"dsh-search-muted",children:[t("updateChecked"),": ",new Date(o.checkedAt).toLocaleString()]}),o.candidate&&o.status==="available"&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("p",{children:[o.running," \u2192 ",o.candidate.version," \xB7 DSH ",o.candidate.runtime]}),(0,s.jsx)("p",{className:"dsh-search-update-notes",children:o.candidate.notes}),(0,s.jsx)("p",{className:"dsh-search-muted",children:t("updatePin")})]}),(0,s.jsxs)("div",{className:"dsh-search-actions",children:[(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:n||o.status==="unavailable"||o.status==="unknown"||o.status==="restart-required",onClick:()=>{e.check()},children:t("updateCheck")}),o.status==="available"&&(0,s.jsx)(b,{variant:"primary",size:"sm",onClick:()=>{e.install()},children:t("updateInstall")}),o.status==="unknown"&&(0,s.jsx)(b,{variant:"outline",size:"sm",onClick:()=>{e.status()},children:t("updateReconcile")}),(0,s.jsx)("a",{href:"https://github.com/Aero123421/dsh-search-providers/releases",target:"_blank",rel:"noreferrer",children:t("updateReleases")})]})]})}function et({controller:e,locale:t,updates:o}){let n=(0,v.useSyncExternalStore)(e.subscribe,e.getSnapshot),r=Et(t),[i,d]=(0,v.useState)(),[a,c]=(0,v.useState)(!1),[p,w]=(0,v.useState)();(0,v.useEffect)(()=>{e.load()},[e]);let g=n.snapshot,f=g?.entries.find(l=>l.id===i?.provider);async function h(l,_){if(g){c(!0),w(void 0);try{await e.call(l,{..._,revision:g.revision,searchRevision:g.searchRevision}),await e.refresh()}catch(M){w(Y(M)),await e.refresh()}finally{c(!1)}}}let y=g?.entries.some(l=>g.searchProvider===te(l.id)&&!l.enabled);return(0,s.jsxs)("section",{className:"dsh-search-settings",children:[(0,s.jsx)("h2",{children:r("title")}),(0,s.jsxs)("p",{className:"dsh-search-note",children:[r("pricingNote")," ",(0,s.jsx)("a",{href:"https://api-dashboard.search.brave.com/documentation/resources/help-feedback",target:"_blank",rel:"noreferrer",children:r("bravePricing")})]}),(0,s.jsx)("p",{className:"dsh-search-note",children:r("fallbackNote")}),(0,s.jsx)("p",{className:"dsh-search-note",children:r("lifecycleNote")}),(0,s.jsx)(Ft,{controller:o,t:r}),n.error&&(0,s.jsxs)("p",{role:"alert",className:"dsh-search-error",children:[r("loadFailed")," ",(0,s.jsx)(b,{size:"sm",onClick:()=>{e.refresh()},children:r("retry")})]}),p&&(0,s.jsx)("p",{role:"alert",className:"dsh-search-error",children:r(p)}),n.status==="loading"&&!g&&(0,s.jsx)("div",{className:"dsh-search-loading",children:(0,s.jsx)(z,{state:"ongoing",size:20})}),y&&(0,s.jsx)("p",{role:"alert",className:"dsh-search-error",children:r("defaultDisabled")}),g&&(0,s.jsxs)("div",{className:"dsh-search-providers",children:[g.problems.map(l=>(0,s.jsxs)("article",{className:"dsh-search-provider",children:[(0,s.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,s.jsx)("span",{className:"dsh-search-name",children:Xe(l,g.entries,r)||r(ke(l))}),(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a,onClick:()=>{h("remove-ignored",{scope:l.scope,id:l.id,reason:l.reason})},children:r("removeIgnored")})]}),Xe(l,g.entries,r)&&(0,s.jsx)("p",{className:"dsh-search-muted",children:r(ke(l))})]},`${l.scope}:${l.reason}:${l.id}`)),(0,s.jsx)("article",{className:"dsh-search-provider",children:(0,s.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,s.jsx)("span",{className:"dsh-search-name",children:r("native")}),g.searchProvider.startsWith("dsh-search-providers-")?(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a,onClick:()=>{h("default",{provider:"native"})},children:r("setDefault")}):(0,s.jsx)("span",{className:"dsh-search-tag",children:r("default")})]})}),g.entries.map(l=>(0,s.jsxs)("article",{className:"dsh-search-provider",children:[(0,s.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,s.jsxs)("div",{className:"dsh-search-identity",children:[(0,s.jsx)("span",{className:"dsh-search-name",children:l.label}),g.searchProvider===te(l.id)&&(0,s.jsx)("span",{className:"dsh-search-tag",children:r("default")})]}),(0,s.jsx)(G,{label:`${r("enable")}: ${l.label}`,checked:l.enabled,disabled:a||!l.enabled&&!l.configured&&!l.keyOptional,onChange:_=>{h("provider",{provider:l.id,enabled:_})}})]}),(0,s.jsxs)("div",{className:"dsh-search-status",children:[(0,s.jsx)(z,{state:l.configured||l.keyOptional?"done":"pending",size:10}),(0,s.jsx)("span",{children:r(l.configured?"keySaved":l.keyOptional?"keyOptional":"keyMissing")}),l.source&&l.source!=="saved"&&(0,s.jsx)("span",{children:l.source})]}),(0,s.jsxs)("div",{className:"dsh-search-actions",children:[l.supportsKeys&&(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a||!l.writable,onClick:()=>d({kind:"key",provider:l.id}),children:r(l.configured?"editKey":"saveKey")}),l.webSearch&&g.searchProvider!==te(l.id)&&(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a||!l.enabled,onClick:()=>{h("default",{provider:l.id})},children:r("setDefault")}),(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a,onClick:()=>d({kind:"features",provider:l.id}),children:r("selectTools")}),ee[l.id].length>0&&(0,s.jsx)(b,{variant:"outline",size:"sm",disabled:a,onClick:()=>d({kind:"search",provider:l.id}),children:r("searchSettings")})]})]},l.id))]}),i?.kind==="key"&&f&&(0,s.jsx)(Tt,{entry:f,controller:e,t:r,onClose:()=>d(void 0)}),i?.kind==="features"&&f&&g&&(0,s.jsx)(Dt,{entry:f,snapshot:g,controller:e,t:r,onClose:()=>d(void 0)}),i?.kind==="search"&&f&&g&&(0,s.jsx)(Kt,{entry:f,snapshot:g,controller:e,t:r,onClose:()=>d(void 0)},f.id)]})}function Ut(e){let t=new se(e.connection),o=new oe(e.connection);e.effect(()=>()=>{t.dispose(),o.dispose()}),e.effect(()=>e.locale.register(Ie,{en:xe,ja:qe,zh:$e})),e.effect(()=>{let n=document.createElement("style");return n.dataset.dshSearchProviders="",n.textContent=Je+Ge,document.head.append(n),()=>n.remove()}),e.on("connection/reset",()=>{t.refreshIfLoaded(),o.reset()}),e.effect(()=>{let n=["settings/document-updated","credentials/record-updated","credentials/reference-updated"].map(r=>e.remote?.$on(r,()=>t.refreshIfLoaded()));return()=>{for(let r of n)r?.()}}),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:"web-search-provider",order:15,label:()=>e.locale.bind(Ie)("nav"),icon:ce,inject:()=>({controller:t,locale:e.locale,updates:o})},et))}

return module.exports;}});
