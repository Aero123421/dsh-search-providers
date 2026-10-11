window.__ModuleLoader__.load({id:"@aero123421/dsh-search-providers",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var q=Object.defineProperty;var We=Object.getOwnPropertyDescriptor;var Oe=Object.getOwnPropertyNames;var He=Object.prototype.hasOwnProperty;var Ne=(e,t)=>{for(var o in t)q(e,o,{get:t[o],enumerable:!0})},Ae=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Oe(t))!He.call(e,s)&&s!==o&&q(e,s,{get:()=>t[s],enumerable:!(r=We(t,s))||r.enumerable});return e};var Re=e=>Ae(q({},"__esModule",{value:!0}),e);var ze={};Ne(ze,{SearchSettings:()=>Le,apply:()=>Je,inject:()=>qe});module.exports=Re(ze);var m=require("react");var de=require("react");function ce(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(t=0;t<s;t++)e[t]&&(o=ce(e[t]))&&(r&&(r+=" "),r+=o)}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function Se(){for(var e,t,o=0,r="",s=arguments.length;o<s;o++)(e=arguments[o])&&(t=ce(e))&&(r&&(r+=" "),r+=t);return r}var C=Se;var H={button:"dshsearch_477ea280_button",md:"dshsearch_477ea280_md",sm:"dshsearch_477ea280_sm",primary:"dshsearch_477ea280_primary",ghost:"dshsearch_477ea280_ghost",outline:"dshsearch_477ea280_outline",toolbar:"dshsearch_477ea280_toolbar",icon:"dshsearch_477ea280_icon"};var R=require("react/jsx-runtime"),I=(0,de.forwardRef)(function({variant:t="ghost",size:o="md",icon:r,className:s,children:i,...l},d){return(0,R.jsxs)("button",{ref:d,type:"button",className:C(H.button,H[t],H[o],s),...l,children:[r!=null&&(0,R.jsx)("span",{className:H.icon,children:r}),i]})});var he=require("react");var S={wrap:"dshsearch_6f543173_wrap",icon:"dshsearch_6f543173_icon",input:"dshsearch_6f543173_input"};var N=require("react/jsx-runtime"),E=(0,he.forwardRef)(function({icon:t,className:o,...r},s){return(0,N.jsxs)("span",{className:C(S.wrap,o),children:[t!=null&&(0,N.jsx)("span",{className:S.icon,children:t}),(0,N.jsx)("input",{ref:s,className:S.input,...r})]})});var Y={switch:"dshsearch_2ce6c3a9_switch",thumb:"dshsearch_2ce6c3a9_thumb"};var Q=require("react/jsx-runtime");function V({checked:e,onChange:t,label:o,disabled:r=!1,title:s,className:i}){return(0,Q.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":o,title:s,disabled:r,className:C(Y.switch,i),onClick:()=>{t(!e)},children:(0,Q.jsx)("span",{className:Y.thumb})})}var Z=require("react"),Ke=require("react-dom");var Ee=require("react");var pe=require("react/jsx-runtime");var k=require("react/jsx-runtime");var X=1;var Ve=({size:e=16,className:t,strokeWidth:o})=>(0,k.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,k.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,k.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),J=e=>(0,k.jsx)(Ve,{...e,strokeWidth:X});var Be=({size:e=16,className:t,strokeWidth:o})=>(0,k.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:(0,k.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),z=e=>(0,k.jsx)(Be,{...e,strokeWidth:X});var Te=({size:e=16,className:t,strokeWidth:o})=>(0,k.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:o,children:[(0,k.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,k.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),ue=e=>(0,k.jsx)(Te,{...e,strokeWidth:X});var ee=require("react");var T=require("react");function te(e){let t=!1,o=!1,r=()=>{t=!0},s=()=>{t=!1,o=!0},i=()=>{o=!1},l=()=>{t=!1,o=!1};return e.addEventListener("compositionstart",r,!0),e.addEventListener("compositionend",s,!0),e.addEventListener("keyup",i,!0),e.defaultView?.addEventListener("blur",l),{guards:d=>{let h=t||o||d.isComposing||d.keyCode===229;return o=!1,h},dispose:()=>{e.removeEventListener("compositionstart",r,!0),e.removeEventListener("compositionend",s,!0),e.removeEventListener("keyup",i,!0),e.defaultView?.removeEventListener("blur",l)}}}var oe=new WeakMap,Ze=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function B(e,t){oe.get(e)?.();let o=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",o),e.removeEventListener("keydown",r,!0),oe.delete(e)},r=s=>{!s.isComposing&&!s.ctrlKey&&!s.altKey&&!s.metaKey&&Ze.has(s.key)&&o()};oe.set(e,o),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",o),e.addEventListener("keydown",r,!0),e.focus(t),e.matches(":focus")||o()}var re=new WeakMap;var ge='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function Ce(e,t,o){let r=(0,T.useRef)(o);r.current=o,(0,T.useLayoutEffect)(()=>{let s=e.current;if(!t||s===null)return;let i=s.ownerDocument,l=te(i),d=i.activeElement,h=re.get(i)??[];re.set(i,h);let g={element:s,close:()=>{r.current()}};h.push(g);let u=s.querySelector("[data-modal-autofocus]")??s.querySelector(ge)??s;s.contains(i.activeElement)||B(u);let f=p=>{let c=l.guards(p);if(h.at(-1)!==g||p.defaultPrevented||c||p.ctrlKey||p.altKey||p.metaKey||(p.key==="Escape"&&!p.shiftKey&&(p.preventDefault(),p.repeat||r.current()),p.key!=="Tab")||i.activeElement?.closest('[role="menu"]'))return;let a=[...s.querySelectorAll(ge)].filter(le=>!le.closest("[inert], [hidden]")),v=a[0]??s,_=a.at(-1)??s,O=p.shiftKey?i.activeElement===v:i.activeElement===_;(i.activeElement===s||!s.contains(i.activeElement)||O)&&(p.preventDefault(),(p.shiftKey?_:v).focus())};return i.addEventListener("keydown",f),()=>{l.dispose();let p=h.at(-1)===g;if(h.splice(h.indexOf(g),1),i.removeEventListener("keydown",f),h.length===0&&re.delete(i),p){let c=d instanceof HTMLElement&&d.isConnected?d:h.at(-1)?.element;c!==void 0&&B(c)}}},[e,t])}var De=require("react/jsx-runtime");var P=require("react"),me=require("react-dom");var W={surface:"dshsearch_2b80f452_surface",backing:"dshsearch_2b80f452_backing",compact:"dshsearch_2b80f452_compact",material:"dshsearch_2b80f452_material"};var y=require("react/jsx-runtime"),Fe=(0,P.forwardRef)(function({compact:t=!1,className:o,style:r,children:s,...i},l){let d=(0,P.useId)(),h=(0,P.useRef)(null);(0,P.useLayoutEffect)(()=>{document.body.appendChild(h.current)},[]);let g={"--dsh-menu-anchor":`--dsh-menu-${d.replaceAll(":","")}`};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)("div",{...i,ref:l,"data-menu-material":"translucent",className:C(W.surface,t&&W.compact,o),style:{...r,...g},children:[(0,y.jsx)("div",{"aria-hidden":"true",className:W.material}),s]}),(0,me.createPortal)((0,y.jsx)("div",{ref:h,"aria-hidden":"true","data-menu-backing":"",className:C(W.backing,t&&W.compact),style:{...g,visibility:r?.visibility}}),document.body)]})});var we=require("react/jsx-runtime");var fe=require("react"),ve=require("react-dom");var x={root:"dshsearch_7a8ab0b3_root",mask:"dshsearch_7a8ab0b3_mask",dialog:"dshsearch_7a8ab0b3_dialog",content:"dshsearch_7a8ab0b3_content",header:"dshsearch_7a8ab0b3_header",title:"dshsearch_7a8ab0b3_title",close:"dshsearch_7a8ab0b3_close",description:"dshsearch_7a8ab0b3_description",body:"dshsearch_7a8ab0b3_body",footer:"dshsearch_7a8ab0b3_footer"};var w=require("react/jsx-runtime");function D({open:e,onClose:t,title:o,closeLabel:r,description:s,children:i,footer:l,className:d,contentClassName:h,onKeyDownCapture:g,headless:u=!1,backdropBlur:f=!0,shortcutModal:p}){let c=(0,fe.useRef)(null);return Ce(c,e,t),e?(0,ve.createPortal)((0,w.jsxs)("div",{className:x.root,role:"presentation",onKeyDownCapture:g,children:[(0,w.jsx)("div",{className:x.mask,style:f?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:t}),(0,w.jsx)("div",{ref:c,tabIndex:-1,"data-shortcut-modal":p,className:C(x.dialog,d),role:"dialog","aria-modal":"true","aria-label":o,children:u?i:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsxs)("div",{className:C(x.content,h),children:[(0,w.jsxs)("div",{className:x.header,children:[(0,w.jsx)("h2",{className:x.title,children:o}),(0,w.jsx)("button",{type:"button",className:x.close,"aria-label":r,onClick:t,children:(0,w.jsx)(ue,{size:14})})]}),s!==void 0&&s!==""&&(0,w.jsx)("p",{className:x.description,children:s}),i!==void 0&&(0,w.jsx)("div",{className:x.body,children:i})]}),l!==void 0&&(0,w.jsx)("div",{className:x.footer,children:l})]})})]}),document.body):null}var L={dot:"dshsearch_f9714c72_dot",spinner:"dshsearch_f9714c72_spinner",spinnerMotion:"dshsearch_f9714c72_spinnerMotion",spinnerTrack:"dshsearch_f9714c72_spinnerTrack",spinnerArc:"dshsearch_f9714c72_spinnerArc",step:"dshsearch_f9714c72_step"};var M=require("react/jsx-runtime");function je(e){e!==null&&(ke(e),e.addEventListener("animationstart",()=>{ke(e)}))}function ke(e){let t=e;for(let o of t.getAnimations?.({subtree:!0})??[])o.startTime=0}function F({state:e,size:t,className:o,appearance:r="dot"}){let s=t??(e==="ongoing"?14:10);return e==="ongoing"?(0,M.jsx)("svg",{ref:je,className:C(L.spinner,o),"data-state":"ongoing",width:s,height:s,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,M.jsxs)("g",{className:L.spinnerMotion,children:[(0,M.jsx)("circle",{className:L.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,M.jsx)("circle",{className:L.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,M.jsx)("span",{className:C(r==="step"?L.step:L.dot,o),"data-state":e,style:{width:s,height:s},"aria-hidden":"true",children:r==="step"&&e==="done"&&(0,M.jsx)(z,{size:s-2})})}var se="dsh-search-providers",Ue=["news","papers","code","people","companies","images","videos","extract","map"],ne=[{id:"keenable",label:"Keenable",env:"KEENABLE_API_KEY",keyOptional:!0,capabilities:["extract"]},{id:"nimble",label:"Nimble",env:"NIMBLE_API_KEY",capabilities:["news","papers","code","extract","map"]},{id:"tinyfish",label:"TinyFish",env:"TINYFISH_API_KEY",capabilities:["news","papers","extract"]},{id:"parallel",label:"Parallel",env:"PARALLEL_API_KEY",capabilities:["extract"]},{id:"exa",label:"Exa",env:"EXA_API_KEY",capabilities:["news","papers","people","companies","extract"]},{id:"brave",label:"Brave",env:"BRAVE_API_KEY",capabilities:["news","images","videos"]},{id:"perplexity",label:"Perplexity",env:"PERPLEXITY_API_KEY",capabilities:["people"]}];function ie(e){let t=ne.find(o=>o.id===e);if(!t)throw new b("invalid-request","Unknown search provider");return t}var K=e=>`${se}-${e}`;function xe(e){let t=Ue.find(o=>o===e);if(!t)throw new b("invalid-request","Unknown search capability");return t}var b=class extends Error{code;status;constructor(t,o,r){super(o),this.code=t,this.status=r}};function A(e){if(!e||typeof e!="object"||Array.isArray(e))throw new b("invalid-response","Expected an object");return e}function j(e){if(typeof e!="string"||e.length>300)throw new b("invalid-response","Invalid settings value");return e}function U(e){if(typeof e!="boolean")throw new b("invalid-response","Invalid settings state");return e}function be(e){let t=A(e);if(!Number.isSafeInteger(t.revision)||!Array.isArray(t.entries)||t.entries.length!==ne.length)throw new b("invalid-response","Invalid settings snapshot");let o=new Set,r=t.entries.map(i=>{let l=A(i),d=ie(l.id);if(o.has(d.id))throw new b("invalid-response","Duplicate search provider");return o.add(d.id),{...d,enabled:U(l.enabled),configured:U(l.configured),writable:U(l.writable),keyOptional:!!d.keyOptional,...l.source===void 0?{}:{source:j(l.source)}}}),s={};for(let[i,l]of Object.entries(A(t.tools))){let d=xe(i),h=A(l),g=ie(h.provider);if(!g.capabilities.includes(d))throw new b("invalid-response","Unsupported search capability");s[d]={provider:g.id,enabled:U(h.enabled)}}return{entries:r,tools:s,revision:t.revision,searchProvider:j(t.searchProvider),searchRevision:j(t.searchRevision),nativeSearchProvider:j(t.nativeSearchProvider)}}var G=class{state={status:"idle"};listeners=new Set;pending;closed=!1;connection;constructor(t){this.connection=t}getSnapshot=()=>this.state;subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});publish(t){if(!this.closed){this.state=t;for(let o of this.listeners)o()}}async call(t,o={},r){let s=await this.connection.rpc.call("/api",`${se}/${t}`,o,r);if(!s.ok)throw new Error(s.error.code);return s.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let t={abort:new AbortController,promise:Promise.resolve()};return this.pending=t,this.publish({...this.state,status:this.state.snapshot?"ready":"loading"}),t.promise=this.call("list",{},t.abort.signal).then(o=>{this.pending===t&&this.publish({status:"ready",snapshot:be(o)})}).catch(()=>{this.pending===t&&this.publish({...this.state,status:"ready",error:"loadFailed"})}).finally(()=>{this.pending===t&&(this.pending=void 0)}),t.promise}refresh(){return this.pending?.abort.abort(),this.pending=void 0,this.load()}refreshIfLoaded(){this.state.status!=="idle"&&this.refresh()}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear()}};var Ie={nav:"Web search provider",title:"Web search provider",native:"DSH default",default:"Default",setDefault:"Use for web search",enable:"Use this provider",saveKey:"Save API key",editKey:"Change API key",deleteKey:"Delete saved key",key:"API key",keySaved:"Key saved",keyMissing:"No API key",keyOptional:"Available without a key",source:"Source",selectTools:"Choose features",close:"Close",save:"Save",retry:"Retry",searchFeatures:"Search features",noFeatures:"No matching features",loadFailed:"Could not load settings.",saveFailed:"Could not save. Try again.",conflict:"Settings changed in another window. Try again.",missingKey:"Save an API key first.",disabled:"Enable the provider first.",keyHint:"The saved key is used before the environment variable.",nativeHint:"Use the search provider configured before this plugin.",defaultDisabled:"The default provider is disabled. Enable it or choose another provider.",providedBy:"Selected provider",feature:"Use feature",news:"News search",newsHint:"Find news articles.",papers:"Paper search",papersHint:"Find scholarly publications.",code:"Code search",codeHint:"Find public code examples and documentation.",people:"People search",peopleHint:"Find public professional profiles.",companies:"Company search",companiesHint:"Find company pages and public information.",images:"Image search",imagesHint:"Find images and their source pages.",videos:"Video search",videosHint:"Find videos and their descriptions.",extract:"Page text",extractHint:"Extract text from a public URL through this service.",map:"Website links",mapHint:"Find pages within a website."},ye={nav:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",title:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",native:"DSH\u6A19\u6E96",default:"\u65E2\u5B9A",setDefault:"\u901A\u5E38\u691C\u7D22\u306B\u4F7F\u3046",enable:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",saveKey:"API\u30AD\u30FC\u3092\u4FDD\u5B58",editKey:"API\u30AD\u30FC\u3092\u5909\u66F4",deleteKey:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u524A\u9664",key:"API\u30AD\u30FC",keySaved:"\u30AD\u30FC\u4FDD\u5B58\u6E08\u307F",keyMissing:"API\u30AD\u30FC\u672A\u8A2D\u5B9A",keyOptional:"\u30AD\u30FC\u306A\u3057\u3067\u5229\u7528\u53EF\u80FD",source:"\u53D6\u5F97\u5143",selectTools:"\u4F7F\u3046\u6A5F\u80FD\u3092\u9078\u3076",close:"\u9589\u3058\u308B",save:"\u4FDD\u5B58",retry:"\u518D\u8A66\u884C",searchFeatures:"\u6A5F\u80FD\u3092\u691C\u7D22",noFeatures:"\u8A72\u5F53\u3059\u308B\u6A5F\u80FD\u306F\u3042\u308A\u307E\u305B\u3093",loadFailed:"\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",conflict:"\u5225\u306E\u753B\u9762\u3067\u8A2D\u5B9A\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",missingKey:"\u5148\u306BAPI\u30AD\u30FC\u3092\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",disabled:"\u5148\u306B\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",keyHint:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u74B0\u5883\u5909\u6570\u3088\u308A\u512A\u5148\u3057\u3066\u4F7F\u3044\u307E\u3059\u3002",nativeHint:"\u3053\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3067\u5909\u66F4\u3059\u308B\u524D\u306E\u691C\u7D22\u5148\u3092\u4F7F\u3044\u307E\u3059\u3002",defaultDisabled:"\u65E2\u5B9A\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u7121\u52B9\u3067\u3059\u3002\u6709\u52B9\u306B\u3059\u308B\u304B\u3001\u5225\u306E\u691C\u7D22\u5148\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",providedBy:"\u9078\u629E\u4E2D\u306E\u63D0\u4F9B\u5143",feature:"\u6A5F\u80FD\u3092\u4F7F\u3046",news:"\u30CB\u30E5\u30FC\u30B9\u691C\u7D22",newsHint:"\u30CB\u30E5\u30FC\u30B9\u8A18\u4E8B\u3092\u63A2\u3057\u307E\u3059\u3002",papers:"\u8AD6\u6587\u691C\u7D22",papersHint:"\u5B66\u8853\u8AD6\u6587\u3092\u63A2\u3057\u307E\u3059\u3002",code:"\u30B3\u30FC\u30C9\u691C\u7D22",codeHint:"\u516C\u958B\u3055\u308C\u305F\u30B3\u30FC\u30C9\u4F8B\u3084\u6280\u8853\u6587\u66F8\u3092\u63A2\u3057\u307E\u3059\u3002",people:"\u4EBA\u7269\u691C\u7D22",peopleHint:"\u516C\u958B\u3055\u308C\u305F\u8077\u696D\u30FB\u6240\u5C5E\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",companies:"\u4F01\u696D\u691C\u7D22",companiesHint:"\u4F01\u696D\u306E\u30DA\u30FC\u30B8\u3084\u516C\u958B\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",images:"\u753B\u50CF\u691C\u7D22",imagesHint:"\u753B\u50CF\u3068\u63B2\u8F09\u30DA\u30FC\u30B8\u3092\u63A2\u3057\u307E\u3059\u3002",videos:"\u52D5\u753B\u691C\u7D22",videosHint:"\u52D5\u753B\u3068\u305D\u306E\u8AAC\u660E\u3092\u63A2\u3057\u307E\u3059\u3002",extract:"\u30DA\u30FC\u30B8\u672C\u6587\u53D6\u5F97",extractHint:"\u3053\u306E\u30B5\u30FC\u30D3\u30B9\u3067\u516C\u958BURL\u306E\u672C\u6587\u3092\u53D6\u308A\u51FA\u3057\u307E\u3059\u3002",map:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8\u4E00\u89A7",mapHint:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8URL\u3092\u63A2\u3057\u307E\u3059\u3002"},Pe={nav:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",title:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",native:"DSH \u9ED8\u8BA4",default:"\u9ED8\u8BA4",setDefault:"\u7528\u4E8E\u7F51\u9875\u641C\u7D22",enable:"\u4F7F\u7528\u6B64\u63D0\u4F9B\u5546",saveKey:"\u4FDD\u5B58 API \u5BC6\u94A5",editKey:"\u66F4\u6539 API \u5BC6\u94A5",deleteKey:"\u5220\u9664\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5",key:"API \u5BC6\u94A5",keySaved:"\u5DF2\u4FDD\u5B58\u5BC6\u94A5",keyMissing:"\u672A\u8BBE\u7F6E API \u5BC6\u94A5",keyOptional:"\u65E0\u9700\u5BC6\u94A5\u5373\u53EF\u4F7F\u7528",source:"\u6765\u6E90",selectTools:"\u9009\u62E9\u529F\u80FD",close:"\u5173\u95ED",save:"\u4FDD\u5B58",retry:"\u91CD\u8BD5",searchFeatures:"\u641C\u7D22\u529F\u80FD",noFeatures:"\u6CA1\u6709\u5339\u914D\u7684\u529F\u80FD",loadFailed:"\u65E0\u6CD5\u52A0\u8F7D\u8BBE\u7F6E\u3002",saveFailed:"\u65E0\u6CD5\u4FDD\u5B58\uFF0C\u8BF7\u91CD\u8BD5\u3002",conflict:"\u8BBE\u7F6E\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u66F4\u6539\uFF0C\u8BF7\u91CD\u8BD5\u3002",missingKey:"\u8BF7\u5148\u4FDD\u5B58 API \u5BC6\u94A5\u3002",disabled:"\u8BF7\u5148\u542F\u7528\u63D0\u4F9B\u5546\u3002",keyHint:"\u4F18\u5148\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\uFF0C\u518D\u4F7F\u7528\u73AF\u5883\u53D8\u91CF\u3002",nativeHint:"\u4F7F\u7528\u5B89\u88C5\u6B64\u63D2\u4EF6\u524D\u914D\u7F6E\u7684\u641C\u7D22\u63D0\u4F9B\u5546\u3002",defaultDisabled:"\u9ED8\u8BA4\u63D0\u4F9B\u5546\u5DF2\u7981\u7528\uFF0C\u8BF7\u542F\u7528\u5B83\u6216\u9009\u62E9\u5176\u4ED6\u63D0\u4F9B\u5546\u3002",providedBy:"\u5DF2\u9009\u63D0\u4F9B\u5546",feature:"\u4F7F\u7528\u529F\u80FD",news:"\u65B0\u95FB\u641C\u7D22",newsHint:"\u67E5\u627E\u65B0\u95FB\u6587\u7AE0\u3002",papers:"\u8BBA\u6587\u641C\u7D22",papersHint:"\u67E5\u627E\u5B66\u672F\u8BBA\u6587\u3002",code:"\u4EE3\u7801\u641C\u7D22",codeHint:"\u67E5\u627E\u516C\u5F00\u4EE3\u7801\u793A\u4F8B\u548C\u6280\u672F\u6587\u6863\u3002",people:"\u4EBA\u7269\u641C\u7D22",peopleHint:"\u67E5\u627E\u516C\u5F00\u7684\u804C\u4E1A\u548C\u4EFB\u804C\u4FE1\u606F\u3002",companies:"\u4F01\u4E1A\u641C\u7D22",companiesHint:"\u67E5\u627E\u4F01\u4E1A\u7F51\u9875\u548C\u516C\u5F00\u4FE1\u606F\u3002",images:"\u56FE\u7247\u641C\u7D22",imagesHint:"\u67E5\u627E\u56FE\u7247\u53CA\u5176\u6765\u6E90\u7F51\u9875\u3002",videos:"\u89C6\u9891\u641C\u7D22",videosHint:"\u67E5\u627E\u89C6\u9891\u53CA\u5176\u8BF4\u660E\u3002",extract:"\u7F51\u9875\u6B63\u6587",extractHint:"\u901A\u8FC7\u6B64\u670D\u52A1\u63D0\u53D6\u516C\u5F00\u7F51\u5740\u7684\u6B63\u6587\u3002",map:"\u7F51\u7AD9\u9875\u9762\u5217\u8868",mapHint:"\u67E5\u627E\u7F51\u7AD9\u5185\u7684\u9875\u9762\u7F51\u5740\u3002"};var Me=`.dsh-search-settings { display: flex; flex-direction: column; gap: 12px; max-width: 720px; color: var(--dsw-alias-label-primary); }
.dsh-search-settings h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 500; }
.dsh-search-providers { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.dsh-search-provider { display: flex; flex-direction: column; gap: 12px; padding: 12px 14px; background: var(--dsw-alias-settings-card-fill); border: .5px solid var(--dsw-alias-settings-card-stroke); border-radius: var(--dsw-radius-xl); }
.dsh-search-provider-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dsh-search-identity { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsh-search-name { font-size: 14px; line-height: 22px; font-weight: 500; }
.dsh-search-tag { padding: 1px 6px; border: .5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-sm); font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dsh-search-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); flex-wrap: wrap; }
.dsh-search-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dsh-search-muted { margin: 4px 0 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
.dsh-search-error { margin: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-state-error-primary); }
.dsh-search-loading { display: grid; place-items: center; min-height: 120px; }
.dsh-search-dialog { width: min(520px, 100%); color: var(--dsw-alias-label-primary); --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2); }
.dsh-search-key-form { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.dsh-search-feature-list { display: flex; flex-direction: column; max-height: 360px; overflow-y: auto; padding: 2px 4px 2px 0; margin-top: 12px; }
.dsh-search-feature { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: .5px solid var(--dsw-alias-border-l3); font-size: 14px; }
.dsh-search-feature:last-child { border-bottom: 0; }
@media (max-width: 480px) { .dsh-search-provider { padding: 12px; } .dsh-search-actions { gap: 6px; } }
`;var _e=`/* Button sizes share the global control-radius scale. */
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
`;var n=require("react/jsx-runtime"),ae="dsh.searchProviders",qe=["slots","locale","connection","remote"];function Ye(e){return(0,m.useSyncExternalStore)(t=>e.subscribe(t),()=>e.getSnapshot().revision),e.bind(ae)}function $(e){let t=e instanceof Error?e.message:"";return t.endsWith("/settings-changed")?"conflict":t.endsWith("/missing-key")?"missingKey":t.endsWith("/provider-disabled")?"disabled":"saveFailed"}function Qe({entry:e,controller:t,t:o,onClose:r}){let[s,i]=(0,m.useState)(""),[l,d]=(0,m.useState)(!1),[h,g]=(0,m.useState)(),u=(0,m.useId)();async function f(c){c.preventDefault(),d(!0),g(void 0);let a=s;i("");try{await t.call("save-key",{provider:e.id,key:a}),await t.refresh(),r()}catch(v){g($(v))}finally{d(!1)}}async function p(){d(!0),i(""),g(void 0);try{await t.call("delete-key",{provider:e.id}),await t.refresh(),r()}catch(c){g($(c))}finally{d(!1)}}return(0,n.jsx)(D,{open:!0,title:`${e.label} \xB7 ${o("key")}`,closeLabel:o("close"),onClose:r,className:"dsh-search-dialog",children:(0,n.jsxs)("form",{onSubmit:c=>{f(c)},className:"dsh-search-key-form",children:[(0,n.jsx)("label",{htmlFor:u,children:o("key")}),(0,n.jsx)(E,{id:u,type:"password",autoComplete:"off",value:s,onChange:c=>i(c.target.value),disabled:l||!e.writable,"data-modal-autofocus":!0}),(0,n.jsx)("p",{className:"dsh-search-muted",children:o("keyHint")}),h&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:o(h)}),(0,n.jsxs)("div",{className:"dsh-search-actions",children:[(0,n.jsx)(I,{type:"submit",variant:"primary",disabled:l||!s.trim()||!e.writable,children:o("save")}),e.source==="saved"&&(0,n.jsx)(I,{variant:"outline",disabled:l||!e.writable,onClick:()=>{p()},children:o("deleteKey")})]})]})})}function Xe({entry:e,snapshot:t,controller:o,t:r,onClose:s}){let[i,l]=(0,m.useState)(""),[d,h]=(0,m.useState)(!1),[g,u]=(0,m.useState)(),f=e.capabilities.filter(c=>`${r(c)} ${r(`${c}Hint`)}`.toLowerCase().includes(i.toLowerCase()));async function p(c,a){h(!0),u(void 0);try{await o.call("tool",{provider:e.id,capability:c,enabled:a,revision:t.revision}),await o.refresh()}catch(v){u($(v)),await o.refresh()}finally{h(!1)}}return(0,n.jsxs)(D,{open:!0,title:`${e.label} \xB7 ${r("selectTools")}`,closeLabel:r("close"),onClose:s,className:"dsh-search-dialog",children:[(0,n.jsx)(E,{"aria-label":r("searchFeatures"),placeholder:r("searchFeatures"),value:i,onChange:c=>l(c.target.value),"data-modal-autofocus":!0}),g&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:r(g)}),(0,n.jsxs)("div",{className:"dsh-search-feature-list",children:[f.map(c=>{let a=t.tools[c],v=a?.enabled===!0&&a.provider===e.id,_=a?.enabled&&!v?t.entries.find(O=>O.id===a.provider):void 0;return(0,n.jsxs)("div",{className:"dsh-search-feature",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{children:r(c)}),(0,n.jsx)("p",{className:"dsh-search-muted",children:r(`${c}Hint`)}),_&&(0,n.jsxs)("p",{className:"dsh-search-muted",children:[r("providedBy"),": ",_.label]})]}),(0,n.jsx)(V,{label:`${r("feature")}: ${r(c)}`,checked:v,disabled:d||!e.enabled,onChange:O=>{p(c,O)}})]},c)}),f.length===0&&(0,n.jsx)("p",{className:"dsh-search-muted",children:r("noFeatures")})]})]})}function Le({controller:e,locale:t}){let o=(0,m.useSyncExternalStore)(e.subscribe,e.getSnapshot),r=Ye(t),[s,i]=(0,m.useState)(),[l,d]=(0,m.useState)(!1),[h,g]=(0,m.useState)();(0,m.useEffect)(()=>{e.load()},[e]);let u=o.snapshot,f=u?.entries.find(a=>a.id===s?.provider);async function p(a,v){if(u){d(!0),g(void 0);try{await e.call(a,{...v,revision:u.revision,searchRevision:u.searchRevision}),await e.refresh()}catch(_){g($(_)),await e.refresh()}finally{d(!1)}}}let c=u?.entries.some(a=>u.searchProvider===K(a.id)&&!a.enabled);return(0,n.jsxs)("section",{className:"dsh-search-settings",children:[(0,n.jsx)("h2",{children:r("title")}),o.error&&(0,n.jsxs)("p",{role:"alert",className:"dsh-search-error",children:[r("loadFailed")," ",(0,n.jsx)(I,{size:"sm",onClick:()=>{e.refresh()},children:r("retry")})]}),h&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:r(h)}),o.status==="loading"&&!u&&(0,n.jsx)("div",{className:"dsh-search-loading",children:(0,n.jsx)(F,{state:"ongoing",size:20})}),c&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:r("defaultDisabled")}),u&&(0,n.jsxs)("div",{className:"dsh-search-providers",children:[(0,n.jsx)("article",{className:"dsh-search-provider",children:(0,n.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,n.jsx)("span",{className:"dsh-search-name",children:r("native")}),u.searchProvider.startsWith("dsh-search-providers-")?(0,n.jsx)(I,{variant:"outline",size:"sm",disabled:l,onClick:()=>{p("default",{provider:"native"})},children:r("setDefault")}):(0,n.jsx)("span",{className:"dsh-search-tag",children:r("default")})]})}),u.entries.map(a=>(0,n.jsxs)("article",{className:"dsh-search-provider",children:[(0,n.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,n.jsxs)("div",{className:"dsh-search-identity",children:[(0,n.jsx)("span",{className:"dsh-search-name",children:a.label}),u.searchProvider===K(a.id)&&(0,n.jsx)("span",{className:"dsh-search-tag",children:r("default")})]}),(0,n.jsx)(V,{label:`${r("enable")}: ${a.label}`,checked:a.enabled,disabled:l||!a.enabled&&!a.configured&&!a.keyOptional,onChange:v=>{p("provider",{provider:a.id,enabled:v})}})]}),(0,n.jsxs)("div",{className:"dsh-search-status",children:[(0,n.jsx)(F,{state:a.configured||a.keyOptional?"done":"pending",size:10}),(0,n.jsx)("span",{children:r(a.configured?"keySaved":a.keyOptional?"keyOptional":"keyMissing")}),a.source&&a.source!=="saved"&&(0,n.jsx)("span",{children:a.source})]}),(0,n.jsxs)("div",{className:"dsh-search-actions",children:[(0,n.jsx)(I,{variant:"outline",size:"sm",disabled:l||!a.writable,onClick:()=>i({kind:"key",provider:a.id}),children:r(a.configured?"editKey":"saveKey")}),u.searchProvider!==K(a.id)&&(0,n.jsx)(I,{variant:"outline",size:"sm",disabled:l||!a.enabled,onClick:()=>{p("default",{provider:a.id})},children:r("setDefault")}),(0,n.jsx)(I,{variant:"outline",size:"sm",disabled:l,onClick:()=>i({kind:"features",provider:a.id}),children:r("selectTools")})]})]},a.id))]}),s?.kind==="key"&&f&&(0,n.jsx)(Qe,{entry:f,controller:e,t:r,onClose:()=>i(void 0)}),s?.kind==="features"&&f&&u&&(0,n.jsx)(Xe,{entry:f,snapshot:u,controller:e,t:r,onClose:()=>i(void 0)})]})}function Je(e){let t=new G(e.connection);e.effect(()=>()=>t.dispose()),e.effect(()=>e.locale.register(ae,{en:Ie,ja:ye,zh:Pe})),e.effect(()=>{let o=document.createElement("style");return o.dataset.dshSearchProviders="",o.textContent=_e+Me,document.head.append(o),()=>o.remove()}),e.on("connection/reset",()=>t.refreshIfLoaded()),e.effect(()=>{let o=["settings/document-updated","credentials/record-updated","credentials/reference-updated"].map(r=>e.remote?.$on(r,()=>t.refreshIfLoaded()));return()=>{for(let r of o)r?.()}}),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:"web-search-provider",order:15,label:()=>e.locale.bind(ae)("nav"),icon:J,inject:()=>({controller:t,locale:e.locale})},Le))}

return module.exports;}});
