window.__ModuleLoader__.load({id:"@aero123421/dsh-search-providers",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var Y=Object.defineProperty;var Re=Object.getOwnPropertyDescriptor;var Ne=Object.getOwnPropertyNames;var Ae=Object.prototype.hasOwnProperty;var Se=(e,t)=>{for(var r in t)Y(e,r,{get:t[r],enumerable:!0})},Ee=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ne(t))!Ae.call(e,o)&&o!==r&&Y(e,o,{get:()=>t[o],enumerable:!(s=Re(t,o))||s.enumerable});return e};var Be=e=>Ee(Y({},"__esModule",{value:!0}),e);var nt={};Se(nt,{SearchSettings:()=>He,apply:()=>st,inject:()=>ze});module.exports=Be(nt);var m=require("react");var pe=require("react");function he(e){var t,r,s="";if(typeof e=="string"||typeof e=="number")s+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(r=he(e[t]))&&(s&&(s+=" "),s+=r)}else for(r in e)e[r]&&(s&&(s+=" "),s+=r);return s}function Ve(){for(var e,t,r=0,s="",o=arguments.length;r<o;r++)(e=arguments[r])&&(t=he(e))&&(s&&(s+=" "),s+=t);return s}var C=Ve;var H={button:"dshsearch_477ea280_button",md:"dshsearch_477ea280_md",sm:"dshsearch_477ea280_sm",primary:"dshsearch_477ea280_primary",ghost:"dshsearch_477ea280_ghost",outline:"dshsearch_477ea280_outline",toolbar:"dshsearch_477ea280_toolbar",icon:"dshsearch_477ea280_icon"};var S=require("react/jsx-runtime"),b=(0,pe.forwardRef)(function({variant:t="ghost",size:r="md",icon:s,className:o,children:a,...d},l){return(0,S.jsxs)("button",{ref:l,type:"button",className:C(H.button,H[t],H[r],o),...d,children:[s!=null&&(0,S.jsx)("span",{className:H.icon,children:s}),a]})});var ue=require("react");var E={wrap:"dshsearch_6f543173_wrap",icon:"dshsearch_6f543173_icon",input:"dshsearch_6f543173_input"};var R=require("react/jsx-runtime"),B=(0,ue.forwardRef)(function({icon:t,className:r,...s},o){return(0,R.jsxs)("span",{className:C(E.wrap,r),children:[t!=null&&(0,R.jsx)("span",{className:E.icon,children:t}),(0,R.jsx)("input",{ref:o,className:E.input,...s})]})});var Q={switch:"dshsearch_2ce6c3a9_switch",thumb:"dshsearch_2ce6c3a9_thumb"};var J=require("react/jsx-runtime");function V({checked:e,onChange:t,label:r,disabled:s=!1,title:o,className:a}){return(0,J.jsx)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":r,title:o,disabled:s,className:C(Q.switch,a),onClick:()=>{t(!e)},children:(0,J.jsx)("span",{className:Q.thumb})})}var Z=require("react"),$e=require("react-dom");var Te=require("react");var ge=require("react/jsx-runtime");var w=require("react/jsx-runtime");var z=1;var De=({size:e=16,className:t,strokeWidth:r})=>(0,w.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:r,children:[(0,w.jsx)("path",{d:"M6.58727 11.8586C9.55061 11.8586 11.9529 9.45637 11.9529 6.49304C11.9529 3.5297 9.55061 1.12744 6.58727 1.12744C3.62394 1.12744 1.22168 3.5297 1.22168 6.49304C1.22168 9.45637 3.62394 11.8586 6.58727 11.8586Z",stroke:"currentColor"}),(0,w.jsx)("path",{d:"M10.2991 10.3933L14.7783 14.8725",stroke:"currentColor"})]}),ee=e=>(0,w.jsx)(De,{...e,strokeWidth:z});var Ze=({size:e=16,className:t,strokeWidth:r})=>(0,w.jsx)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:r,children:(0,w.jsx)("path",{d:"M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",stroke:"currentColor"})}),te=e=>(0,w.jsx)(Ze,{...e,strokeWidth:z});var Ke=({size:e=16,className:t,strokeWidth:r})=>(0,w.jsxs)("svg",{width:e,height:e,className:t,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",strokeWidth:r,children:[(0,w.jsx)("path",{d:"M2.5 2.5L13.5 13.5",stroke:"currentColor"}),(0,w.jsx)("path",{d:"M13.5 2.5L2.5 13.5",stroke:"currentColor"})]}),me=e=>(0,w.jsx)(Ke,{...e,strokeWidth:z});var re=require("react");var D=require("react");function oe(e){let t=!1,r=!1,s=()=>{t=!0},o=()=>{t=!1,r=!0},a=()=>{r=!1},d=()=>{t=!1,r=!1};return e.addEventListener("compositionstart",s,!0),e.addEventListener("compositionend",o,!0),e.addEventListener("keyup",a,!0),e.defaultView?.addEventListener("blur",d),{guards:l=>{let h=t||r||l.isComposing||l.keyCode===229;return r=!1,h},dispose:()=>{e.removeEventListener("compositionstart",s,!0),e.removeEventListener("compositionend",o,!0),e.removeEventListener("keyup",a,!0),e.defaultView?.removeEventListener("blur",d)}}}var se=new WeakMap,Fe=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"]);function T(e,t){se.get(e)?.();let r=()=>{e.removeAttribute("data-dsh-automatic-focus"),e.removeEventListener("blur",r),e.removeEventListener("keydown",s,!0),se.delete(e)},s=o=>{!o.isComposing&&!o.ctrlKey&&!o.altKey&&!o.metaKey&&Fe.has(o.key)&&r()};se.set(e,r),e.setAttribute("data-dsh-automatic-focus",""),e.addEventListener("blur",r),e.addEventListener("keydown",s,!0),e.focus(t),e.matches(":focus")||r()}var ne=new WeakMap;var Ce='button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';function fe(e,t,r){let s=(0,D.useRef)(r);s.current=r,(0,D.useLayoutEffect)(()=>{let o=e.current;if(!t||o===null)return;let a=o.ownerDocument,d=oe(a),l=a.activeElement,h=ne.get(a)??[];ne.set(a,h);let g={element:o,close:()=>{s.current()}};h.push(g);let k=o.querySelector("[data-modal-autofocus]")??o.querySelector(Ce)??o;o.contains(a.activeElement)||T(k);let u=p=>{let c=d.guards(p);if(h.at(-1)!==g||p.defaultPrevented||c||p.ctrlKey||p.altKey||p.metaKey||(p.key==="Escape"&&!p.shiftKey&&(p.preventDefault(),p.repeat||s.current()),p.key!=="Tab")||a.activeElement?.closest('[role="menu"]'))return;let v=[...o.querySelectorAll(Ce)].filter(ce=>!ce.closest("[inert], [hidden]")),i=v[0]??o,y=v.at(-1)??o,L=p.shiftKey?a.activeElement===i:a.activeElement===y;(a.activeElement===o||!o.contains(a.activeElement)||L)&&(p.preventDefault(),(p.shiftKey?y:i).focus())};return a.addEventListener("keydown",u),()=>{d.dispose();let p=h.at(-1)===g;if(h.splice(h.indexOf(g),1),a.removeEventListener("keydown",u),h.length===0&&ne.delete(a),p){let c=l instanceof HTMLElement&&l.isConnected?l:h.at(-1)?.element;c!==void 0&&T(c)}}},[e,t])}var Ue=require("react/jsx-runtime");var P=require("react"),ve=require("react-dom");var O={surface:"dshsearch_2b80f452_surface",backing:"dshsearch_2b80f452_backing",compact:"dshsearch_2b80f452_compact",material:"dshsearch_2b80f452_material"};var _=require("react/jsx-runtime"),je=(0,P.forwardRef)(function({compact:t=!1,className:r,style:s,children:o,...a},d){let l=(0,P.useId)(),h=(0,P.useRef)(null);(0,P.useLayoutEffect)(()=>{document.body.appendChild(h.current)},[]);let g={"--dsh-menu-anchor":`--dsh-menu-${l.replaceAll(":","")}`};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)("div",{...a,ref:d,"data-menu-material":"translucent",className:C(O.surface,t&&O.compact,r),style:{...s,...g},children:[(0,_.jsx)("div",{"aria-hidden":"true",className:O.material}),o]}),(0,ve.createPortal)((0,_.jsx)("div",{ref:h,"aria-hidden":"true","data-menu-backing":"",className:C(O.backing,t&&O.compact),style:{...g,visibility:s?.visibility}}),document.body)]})});var we=require("react/jsx-runtime");var ke=require("react"),be=require("react-dom");var x={root:"dshsearch_7a8ab0b3_root",mask:"dshsearch_7a8ab0b3_mask",dialog:"dshsearch_7a8ab0b3_dialog",content:"dshsearch_7a8ab0b3_content",header:"dshsearch_7a8ab0b3_header",title:"dshsearch_7a8ab0b3_title",close:"dshsearch_7a8ab0b3_close",description:"dshsearch_7a8ab0b3_description",body:"dshsearch_7a8ab0b3_body",footer:"dshsearch_7a8ab0b3_footer"};var f=require("react/jsx-runtime");function K({open:e,onClose:t,title:r,closeLabel:s,description:o,children:a,footer:d,className:l,contentClassName:h,onKeyDownCapture:g,headless:k=!1,backdropBlur:u=!0,shortcutModal:p}){let c=(0,ke.useRef)(null);return fe(c,e,t),e?(0,be.createPortal)((0,f.jsxs)("div",{className:x.root,role:"presentation",onKeyDownCapture:g,children:[(0,f.jsx)("div",{className:x.mask,style:u?void 0:{backdropFilter:"none"},"aria-hidden":"true",onClick:t}),(0,f.jsx)("div",{ref:c,tabIndex:-1,"data-shortcut-modal":p,className:C(x.dialog,l),role:"dialog","aria-modal":"true","aria-label":r,children:k?a:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("div",{className:C(x.content,h),children:[(0,f.jsxs)("div",{className:x.header,children:[(0,f.jsx)("h2",{className:x.title,children:r}),(0,f.jsx)("button",{type:"button",className:x.close,"aria-label":s,onClick:t,children:(0,f.jsx)(me,{size:14})})]}),o!==void 0&&o!==""&&(0,f.jsx)("p",{className:x.description,children:o}),a!==void 0&&(0,f.jsx)("div",{className:x.body,children:a})]}),d!==void 0&&(0,f.jsx)("div",{className:x.footer,children:d})]})})]}),document.body):null}var W={dot:"dshsearch_f9714c72_dot",spinner:"dshsearch_f9714c72_spinner",spinnerMotion:"dshsearch_f9714c72_spinnerMotion",spinnerTrack:"dshsearch_f9714c72_spinnerTrack",spinnerArc:"dshsearch_f9714c72_spinnerArc",step:"dshsearch_f9714c72_step"};var M=require("react/jsx-runtime");function qe(e){e!==null&&(xe(e),e.addEventListener("animationstart",()=>{xe(e)}))}function xe(e){let t=e;for(let r of t.getAnimations?.({subtree:!0})??[])r.startTime=0}function F({state:e,size:t,className:r,appearance:s="dot"}){let o=t??(e==="ongoing"?14:10);return e==="ongoing"?(0,M.jsx)("svg",{ref:qe,className:C(W.spinner,r),"data-state":"ongoing",width:o,height:o,viewBox:"0 0 24 24","aria-hidden":"true",children:(0,M.jsxs)("g",{className:W.spinnerMotion,children:[(0,M.jsx)("circle",{className:W.spinnerTrack,cx:"12",cy:"12",r:"9.5"}),(0,M.jsx)("circle",{className:W.spinnerArc,cx:"12",cy:"12",r:"9.5"})]})}):(0,M.jsx)("span",{className:C(s==="step"?W.step:W.dot,r),"data-state":e,style:{width:o,height:o},"aria-hidden":"true",children:s==="step"&&e==="done"&&(0,M.jsx)(te,{size:o-2})})}var Ie="0.3.2";var N="dsh-search-providers",Ge=["news","papers","code","people","companies","images","videos","extract","map","x"],ae=[{id:"keenable",label:"Keenable",env:"KEENABLE_API_KEY",keyOptional:!0,capabilities:["extract"]},{id:"nimble",label:"Nimble",env:"NIMBLE_API_KEY",capabilities:["news","papers","code","extract","map"]},{id:"tinyfish",label:"TinyFish",env:"TINYFISH_API_KEY",capabilities:["news","papers","extract"]},{id:"parallel",label:"Parallel",env:"PARALLEL_API_KEY",capabilities:["extract"]},{id:"exa",label:"Exa",env:"EXA_API_KEY",capabilities:["news","papers","people","companies","extract"]},{id:"brave",label:"Brave",env:"BRAVE_API_KEY",capabilities:["news","images","videos"]},{id:"perplexity",label:"Perplexity",env:"PERPLEXITY_API_KEY",capabilities:["people"]},{id:"fxtwitter",label:"FxTwitter",keyOptional:!0,webSearch:!1,capabilities:["x"]}];function ie(e){let t=ae.find(r=>r.id===e);if(!t)throw new I("invalid-request","Unknown search provider");return t}var U=e=>`${N}-${e}`;function ye(e){let t=Ge.find(r=>r===e);if(!t)throw new I("invalid-request","Unknown search capability");return t}var I=class extends Error{code;status;constructor(t,r,s){super(r),this.code=t,this.status=s}};function A(e){if(!e||typeof e!="object"||Array.isArray(e))throw new I("invalid-response","Expected an object");return e}var _e=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,Xe=["idle","available","current","unavailable","incompatible","checking","installing","unknown","restart-required","applied","overridden","failed","cancelled"];function Ye(e){if(!e||typeof e!="object"||!("status"in e)||!Xe.includes(String(e.status))||!("running"in e)||typeof e.running!="string")throw new Error("invalid-response");let t=e;if(t.profileKey!==null&&!/^[0-9a-f]{64}$/.test(t.profileKey||"")||t.operation&&!_e.test(t.operation))throw new Error("invalid-response");if(t.candidate&&(typeof t.candidate.id!="string"||typeof t.candidate.version!="string"||typeof t.candidate.url!="string"||!t.candidate.url.startsWith("https://github.com/Aero123421/dsh-search-providers/releases/tag/v")||typeof t.candidate.notes!="string"||typeof t.candidate.runtime!="string"))throw new Error("invalid-response");return t}var j=class{view={status:"idle",running:Ie,profileKey:null};listeners=new Set;generation=0;closed=!1;busy=!1;operation;profileKey=null;connection;storage;constructor(t,r){this.connection=t;try{this.storage=r??globalThis.localStorage}catch{this.storage=void 0}}storageKey(){return`dsh.searchProviders.update.${this.profileKey}.operation`}remember(t){if(this.operation=t,!!this.profileKey)try{t?this.storage?.setItem(this.storageKey(),t):this.storage?.removeItem(this.storageKey())}catch{}}subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});getSnapshot=()=>this.view;publish(t){if(!this.closed){this.view=t;for(let r of this.listeners)r()}}async call(t,r={}){let s=++this.generation;try{let o=await this.connection.rpc.call("/api",`${N}/update-${t}`,r);if(!o.ok){if(t==="install"&&["busy","profile-changed"].some(a=>o.error.code.endsWith("/"+a))&&s===this.generation){this.remember(),this.publish({...this.view,status:"failed",reason:o.error.code.endsWith("/profile-changed")?"profile-changed":"busy"});return}throw new Error(o.error.code)}if(s===this.generation){let a=Ye(o.value);if(a.profileKey!==this.profileKey){let d=this.profileKey!==null;if(this.profileKey=a.profileKey,this.operation=void 0,this.profileKey)try{let l=this.storage?.getItem(this.storageKey());l&&_e.test(l)&&(this.operation=l)}catch{}if(d&&r.operationId)return await this.status()}if(a.operation)this.remember(a.operation);else{if(t==="status"&&!r.operationId&&this.operation&&a.status!=="unavailable")return await this.call("status",{operationId:this.operation});t==="install"&&a.status==="failed"&&this.remember()}this.publish(a)}}catch{s===this.generation&&this.publish({...this.view,status:t==="install"||this.view.operation?"unknown":"failed",reason:"connection"})}}status=()=>this.call("status");async check(){if(!(this.busy||!this.profileKey)){this.busy=!0,this.publish({...this.view,status:"checking"});try{await this.call("check")}finally{this.busy=!1}}}async install(){if(this.busy||!this.profileKey||this.view.status!=="available"||!this.view.candidate)return;this.busy=!0;let t={profileKey:this.profileKey,candidateId:this.view.candidate.id,operationId:crypto.randomUUID()};this.remember(t.operationId),this.publish({...this.view,status:"installing",operation:t.operationId});try{await this.call("install",t)}finally{this.busy=!1}}reset(){++this.generation,this.busy=!1,this.status()}dispose(){this.closed=!0,++this.generation,this.listeners.clear()}};function $(e){if(typeof e!="string"||e.length>300)throw new I("invalid-response","Invalid settings value");return e}function q(e){if(typeof e!="boolean")throw new I("invalid-response","Invalid settings state");return e}function Pe(e){let t=A(e);if(!Number.isSafeInteger(t.revision)||!Array.isArray(t.entries)||t.entries.length!==ae.length)throw new I("invalid-response","Invalid settings snapshot");let r=new Set,s=t.entries.map(a=>{let d=A(a),l=ie(d.id);if(r.has(l.id))throw new I("invalid-response","Duplicate search provider");return r.add(l.id),{...l,enabled:q(d.enabled),configured:q(d.configured),writable:q(d.writable),keyOptional:!!l.keyOptional,supportsKeys:!!l.env,webSearch:l.webSearch!==!1,...d.source===void 0?{}:{source:$(d.source)}}}),o={};for(let[a,d]of Object.entries(A(t.tools))){let l=ye(a),h=A(d),g=ie(h.provider);if(!g.capabilities.includes(l))throw new I("invalid-response","Unsupported search capability");o[l]={provider:g.id,enabled:q(h.enabled)}}return{entries:s,tools:o,revision:t.revision,searchProvider:$(t.searchProvider),searchRevision:$(t.searchRevision),nativeSearchProvider:$(t.nativeSearchProvider)}}var G=class{state={status:"idle"};listeners=new Set;pending;closed=!1;connection;constructor(t){this.connection=t}getSnapshot=()=>this.state;subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});publish(t){if(!this.closed){this.state=t;for(let r of this.listeners)r()}}async call(t,r={},s){let o=await this.connection.rpc.call("/api",`${N}/${t}`,r,s);if(!o.ok)throw new Error(o.error.code);return o.value}load(){if(this.closed)return Promise.resolve();if(this.pending)return this.pending.promise;let t={abort:new AbortController,promise:Promise.resolve()};return this.pending=t,this.publish({...this.state,status:this.state.snapshot?"ready":"loading"}),t.promise=this.call("list",{},t.abort.signal).then(r=>{this.pending===t&&this.publish({status:"ready",snapshot:Pe(r)})}).catch(()=>{this.pending===t&&this.publish({...this.state,status:"ready",error:"loadFailed"})}).finally(()=>{this.pending===t&&(this.pending=void 0)}),t.promise}refresh(){return this.pending?.abort.abort(),this.pending=void 0,this.load()}refreshIfLoaded(){this.state.status!=="idle"&&this.refresh()}dispose(){this.closed=!0,this.pending?.abort.abort(),this.pending=void 0,this.listeners.clear()}};var le={updateRunning:"Running version",updateInstalled:"Installed version",updateCheck:"Check for updates",updateInstall:"Update",updateReconcile:"Check result",updateReleases:"Releases / manual update",updateChecked:"Last checked",updateReason:"Reason",updateStage:"Step",updatePin:"Updating changes your explicit pin to the selected release tag and preserves the current distribution route.",update_idle:"Ready to check.",update_available:"Update available.",update_current:"No newer stable release.",update_unavailable:"Automatic updating is unavailable.",update_incompatible:"This release does not support your DSH version.",update_checking:"Checking releases\u2026",update_installing:"Installing\u2026",update_unknown:"The result is unknown. Check the result; do not repeat installation.","update_restart-required":"Restart DSH to use the installed version.",update_applied:"The running version has been verified.",update_overridden:"A higher priority setting overrode this update.",update_failed:"The update failed.",update_cancelled:"Installation was cancelled.","updateReason_management-required":"The plugin manager or writable profile is unavailable.",updateReason_unaddressable:"The bundle is read-only.","updateReason_source-unsupported":"This installation route requires manual updating.",updateReason_incompatible:"The DSH version is incompatible.",updateReason_checksum:"The checksum did not match.",updateReason_connection:"The connection was interrupted.","updateReason_profile-changed":"The connection target changed. Check for updates again.","updateReason_already-installed":"DSH refused to install over the package that is already installed, and it was not removed.",updateReason_restored:"The new version failed to install. The previous source was installed again with its previous enabled state. Restart DSH if the running version is still the old one.","updateReason_restore-failed":"The new version failed to install, and installing the previous version again failed. The package is uninstalled. Install it again from Releases or the plugin manager.",updateReason_other:"Metadata, download, or installation failed. See Releases or the plugin manager for details.",pricingNote:"Prices change. As of 2026-10-15, Brave Search API has no standalone free plan; each plan includes $5 of monthly credit (about 1,000 Search queries) and needs a card.",bravePricing:"Brave plan description",fallbackNote:"If the selected provider returns HTTP 429, other enabled providers that support the same search are tried once each, in list order. That provider is not retried. Authentication failures, disabled providers, and unsupported searches stay on the selected provider. Page text, site maps, and X search do not switch.",nav:"Web search provider",title:"Web search provider",native:"DSH default",default:"Default",setDefault:"Use for web search",enable:"Use this provider",saveKey:"Save API key",editKey:"Change API key",deleteKey:"Delete saved key",key:"API key",keySaved:"Key saved",keyMissing:"No API key",keyOptional:"Available without a key",source:"Source",selectTools:"Choose features",close:"Close",save:"Save",retry:"Retry",searchFeatures:"Search features",noFeatures:"No matching features",loadFailed:"Could not load settings.",saveFailed:"Could not save. Try again.",conflict:"Settings changed in another window. Try again.",missingKey:"Save an API key first.",disabled:"Enable the provider first.",keyHint:"The saved key is used before the environment variable.",nativeHint:"Use the search provider configured before this plugin.",defaultDisabled:"The default provider is disabled. Enable it or choose another provider.",providedBy:"Selected provider",feature:"Use feature",news:"News search",newsHint:"Find news articles.",papers:"Paper search",papersHint:"Find scholarly publications.",code:"Code search",codeHint:"Find public code examples and documentation.",people:"People search",peopleHint:"Find public professional profiles.",companies:"Company search",companiesHint:"Find company pages and public information.",images:"Image search",imagesHint:"Find images and their source pages.",videos:"Video search",videosHint:"Find videos and their descriptions.",extract:"Page text",extractHint:"Extract text from a public URL through this service.",map:"Website links",mapHint:"Find pages within a website.",x:"X search",xHint:"Search X posts or read a post URL. Keyword search may be unavailable."},Me={updateRunning:"\u5B9F\u884C\u7248",updateInstalled:"\u5C0E\u5165\u7248",updateCheck:"\u66F4\u65B0\u3092\u78BA\u8A8D",updateInstall:"\u66F4\u65B0\u3059\u308B",updateReconcile:"\u7D50\u679C\u3092\u78BA\u8A8D",updateReleases:"Release\u30FB\u624B\u52D5\u66F4\u65B0",updateChecked:"\u78BA\u8A8D\u65E5\u6642",updateReason:"\u7406\u7531",updateStage:"\u6BB5\u968E",updatePin:"\u7248\u56FA\u5B9A\u3092\u9078\u629E\u3057\u305FRelease\u30BF\u30B0\u306B\u5909\u66F4\u3057\u3001\u73FE\u5728\u306E\u914D\u5E03\u7D4C\u8DEF\u3092\u7DAD\u6301\u3057\u307E\u3059\u3002",update_idle:"\u66F4\u65B0\u306F\u672A\u78BA\u8A8D\u3067\u3059\u3002",update_available:"\u66F4\u65B0\u304C\u3042\u308A\u307E\u3059\u3002",update_current:"\u65B0\u3057\u3044\u6B63\u5F0FRelease\u306F\u3042\u308A\u307E\u305B\u3093\u3002",update_unavailable:"\u3053\u306E\u69CB\u6210\u3067\u306F\u81EA\u52D5\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002",update_incompatible:"\u3053\u306ERelease\u306F\u4F7F\u7528\u4E2D\u306EDSH\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",update_checking:"\u66F4\u65B0\u3092\u78BA\u8A8D\u4E2D\u2026",update_installing:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u4E2D\u2026",update_unknown:"\u7D50\u679C\u304C\u4E0D\u660E\u3067\u3059\u3002\u5C0E\u5165\u3092\u7E70\u308A\u8FD4\u3055\u305A\u3001\u7D50\u679C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","update_restart-required":"\u5C0E\u5165\u7248\u3092\u4F7F\u3046\u306B\u306FDSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002",update_applied:"\u5B9F\u884C\u7248\u306E\u53CD\u6620\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",update_overridden:"\u4E0A\u4F4D\u306E\u8A2D\u5B9A\u306B\u3088\u308A\u66F4\u65B0\u304C\u53CD\u6620\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002",update_failed:"\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",update_cancelled:"\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u306F\u53D6\u308A\u6D88\u3055\u308C\u307E\u3057\u305F\u3002","updateReason_management-required":"plugin manager\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u53EF\u80FD\u306Aprofile\u304C\u3042\u308A\u307E\u305B\u3093\u3002",updateReason_unaddressable:"\u3053\u306Ebundle\u306F\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u3067\u3059\u3002","updateReason_source-unsupported":"\u73FE\u5728\u306E\u5C0E\u5165\u7D4C\u8DEF\u306F\u624B\u52D5\u66F4\u65B0\u304C\u5FC5\u8981\u3067\u3059\u3002",updateReason_incompatible:"DSH\u306E\u7248\u306B\u4E92\u63DB\u6027\u304C\u3042\u308A\u307E\u305B\u3093\u3002",updateReason_checksum:"\u30C1\u30A7\u30C3\u30AF\u30B5\u30E0\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",updateReason_connection:"\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F\u3002","updateReason_profile-changed":"\u63A5\u7D9A\u5148\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u66F4\u65B0\u3092\u518D\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_already-installed":"\u5C0E\u5165\u6E08\u307F\u30D1\u30C3\u30B1\u30FC\u30B8\u3078\u306E\u4E0A\u66F8\u304D\u3092DSH\u304C\u62D2\u5426\u3057\u3001\u30D1\u30C3\u30B1\u30FC\u30B8\u306F\u5916\u308C\u3066\u3044\u307E\u305B\u3093\u3002",updateReason_restored:"\u65B0\u3057\u3044\u7248\u306E\u5C0E\u5165\u306B\u5931\u6557\u3057\u305F\u305F\u3081\u3001\u4EE5\u524D\u306E\u5C0E\u5165\u5143\u3068\u6709\u52B9\u72B6\u614B\u3067\u5165\u308C\u76F4\u3057\u307E\u3057\u305F\u3002\u5B9F\u884C\u7248\u304C\u53E4\u3044\u307E\u307E\u306A\u3089DSH\u3092\u518D\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002","updateReason_restore-failed":"\u65B0\u3057\u3044\u7248\u306E\u5C0E\u5165\u306B\u5931\u6557\u3057\u3001\u4EE5\u524D\u306E\u7248\u306E\u518D\u5C0E\u5165\u306B\u3082\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30D1\u30C3\u30B1\u30FC\u30B8\u306F\u5916\u308C\u305F\u307E\u307E\u3067\u3059\u3002Release\u304Bplugin manager\u304B\u3089\u5165\u308C\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",updateReason_other:"metadata\u306E\u78BA\u8A8D\u30FB\u53D6\u5F97\u30FB\u5C0E\u5165\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Release\u307E\u305F\u306Fplugin manager\u3067\u8A73\u7D30\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",pricingNote:"\u6599\u91D1\u306F\u5909\u308F\u308A\u307E\u3059\u30022026-10-15 \u6642\u70B9\u306E Brave Search API \u306B\u5358\u72EC\u306E\u7121\u6599\u30D7\u30E9\u30F3\u306F\u306A\u304F\u3001\u5404\u30D7\u30E9\u30F3\u306F\u6708 $5 \u306E\u30AF\u30EC\u30B8\u30C3\u30C8\uFF08Search \u3067\u306F\u7D04 1,000 \u30AF\u30A8\u30EA\uFF09\u3067\u3001\u52A0\u5165\u306B\u306F\u30AB\u30FC\u30C9\u304C\u5FC5\u8981\u3067\u3059\u3002",bravePricing:"Brave \u306E\u30D7\u30E9\u30F3\u8AAC\u660E",fallbackNote:"\u9078\u629E\u3057\u305F\u63D0\u4F9B\u5143\u304C HTTP 429 \u3092\u8FD4\u3057\u305F\u3068\u304D\u3060\u3051\u3001\u540C\u3058\u691C\u7D22\u306B\u4F7F\u3048\u308B\u6709\u52B9\u306A\u5225\u306E\u63D0\u4F9B\u5143\u3092\u4E00\u89A7\u306E\u9806\u306B 1 \u56DE\u305A\u3064\u8A66\u3057\u307E\u3059\u3002\u540C\u3058\u63D0\u4F9B\u5143\u3078\u306F\u518D\u9001\u3057\u307E\u305B\u3093\u3002\u8A8D\u8A3C\u5931\u6557\u3001\u7121\u52B9\u3001\u672A\u5BFE\u5FDC\u306E\u691C\u7D22\u3067\u306F\u5207\u308A\u66FF\u3048\u307E\u305B\u3093\u3002\u672C\u6587\u53D6\u5F97\u3001\u30B5\u30A4\u30C8\u4E00\u89A7\u3001X\u691C\u7D22\u3082\u5207\u308A\u66FF\u3048\u307E\u305B\u3093\u3002",nav:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",title:"\u691C\u7D22\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",native:"DSH\u6A19\u6E96",default:"\u65E2\u5B9A",setDefault:"\u901A\u5E38\u691C\u7D22\u306B\u4F7F\u3046",enable:"\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u4F7F\u3046",saveKey:"API\u30AD\u30FC\u3092\u4FDD\u5B58",editKey:"API\u30AD\u30FC\u3092\u5909\u66F4",deleteKey:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u524A\u9664",key:"API\u30AD\u30FC",keySaved:"\u30AD\u30FC\u4FDD\u5B58\u6E08\u307F",keyMissing:"API\u30AD\u30FC\u672A\u8A2D\u5B9A",keyOptional:"\u30AD\u30FC\u306A\u3057\u3067\u5229\u7528\u53EF\u80FD",source:"\u53D6\u5F97\u5143",selectTools:"\u4F7F\u3046\u6A5F\u80FD\u3092\u9078\u3076",close:"\u9589\u3058\u308B",save:"\u4FDD\u5B58",retry:"\u518D\u8A66\u884C",searchFeatures:"\u6A5F\u80FD\u3092\u691C\u7D22",noFeatures:"\u8A72\u5F53\u3059\u308B\u6A5F\u80FD\u306F\u3042\u308A\u307E\u305B\u3093",loadFailed:"\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002",saveFailed:"\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",conflict:"\u5225\u306E\u753B\u9762\u3067\u8A2D\u5B9A\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",missingKey:"\u5148\u306BAPI\u30AD\u30FC\u3092\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",disabled:"\u5148\u306B\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",keyHint:"\u4FDD\u5B58\u3057\u305F\u30AD\u30FC\u3092\u74B0\u5883\u5909\u6570\u3088\u308A\u512A\u5148\u3057\u3066\u4F7F\u3044\u307E\u3059\u3002",nativeHint:"\u3053\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3067\u5909\u66F4\u3059\u308B\u524D\u306E\u691C\u7D22\u5148\u3092\u4F7F\u3044\u307E\u3059\u3002",defaultDisabled:"\u65E2\u5B9A\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u7121\u52B9\u3067\u3059\u3002\u6709\u52B9\u306B\u3059\u308B\u304B\u3001\u5225\u306E\u691C\u7D22\u5148\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",providedBy:"\u9078\u629E\u4E2D\u306E\u63D0\u4F9B\u5143",feature:"\u6A5F\u80FD\u3092\u4F7F\u3046",news:"\u30CB\u30E5\u30FC\u30B9\u691C\u7D22",newsHint:"\u30CB\u30E5\u30FC\u30B9\u8A18\u4E8B\u3092\u63A2\u3057\u307E\u3059\u3002",papers:"\u8AD6\u6587\u691C\u7D22",papersHint:"\u5B66\u8853\u8AD6\u6587\u3092\u63A2\u3057\u307E\u3059\u3002",code:"\u30B3\u30FC\u30C9\u691C\u7D22",codeHint:"\u516C\u958B\u3055\u308C\u305F\u30B3\u30FC\u30C9\u4F8B\u3084\u6280\u8853\u6587\u66F8\u3092\u63A2\u3057\u307E\u3059\u3002",people:"\u4EBA\u7269\u691C\u7D22",peopleHint:"\u516C\u958B\u3055\u308C\u305F\u8077\u696D\u30FB\u6240\u5C5E\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",companies:"\u4F01\u696D\u691C\u7D22",companiesHint:"\u4F01\u696D\u306E\u30DA\u30FC\u30B8\u3084\u516C\u958B\u60C5\u5831\u3092\u63A2\u3057\u307E\u3059\u3002",images:"\u753B\u50CF\u691C\u7D22",imagesHint:"\u753B\u50CF\u3068\u63B2\u8F09\u30DA\u30FC\u30B8\u3092\u63A2\u3057\u307E\u3059\u3002",videos:"\u52D5\u753B\u691C\u7D22",videosHint:"\u52D5\u753B\u3068\u305D\u306E\u8AAC\u660E\u3092\u63A2\u3057\u307E\u3059\u3002",extract:"\u30DA\u30FC\u30B8\u672C\u6587\u53D6\u5F97",extractHint:"\u3053\u306E\u30B5\u30FC\u30D3\u30B9\u3067\u516C\u958BURL\u306E\u672C\u6587\u3092\u53D6\u308A\u51FA\u3057\u307E\u3059\u3002",map:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8\u4E00\u89A7",mapHint:"\u30B5\u30A4\u30C8\u5185\u306E\u30DA\u30FC\u30B8URL\u3092\u63A2\u3057\u307E\u3059\u3002",x:"X\u691C\u7D22",xHint:"\u6295\u7A3F\u3092\u691C\u7D22\u3059\u308B\u304B\u3001\u6295\u7A3FURL\u304B\u3089\u672C\u6587\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\u30AD\u30FC\u30EF\u30FC\u30C9\u691C\u7D22\u306F\u5229\u7528\u3067\u304D\u306A\u3044\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002"},Le={updateRunning:"\u8FD0\u884C\u7248\u672C",updateInstalled:"\u5B89\u88C5\u7248\u672C",updateCheck:"\u68C0\u67E5\u66F4\u65B0",updateInstall:"\u66F4\u65B0",updateReconcile:"\u68C0\u67E5\u7ED3\u679C",updateReleases:"Release / \u624B\u52A8\u66F4\u65B0",updateChecked:"\u68C0\u67E5\u65F6\u95F4",updateReason:"\u539F\u56E0",updateStage:"\u9636\u6BB5",updatePin:"\u5C06\u56FA\u5B9A\u7248\u672C\u6539\u4E3A\u6240\u9009 Release \u6807\u7B7E\uFF0C\u5E76\u4FDD\u6301\u5F53\u524D\u5206\u53D1\u65B9\u5F0F\u3002",update_idle:"\u5C1A\u672A\u68C0\u67E5\u66F4\u65B0\u3002",update_available:"\u6709\u53EF\u7528\u66F4\u65B0\u3002",update_current:"\u6CA1\u6709\u66F4\u65B0\u7684\u6B63\u5F0F Release\u3002",update_unavailable:"\u6B64\u914D\u7F6E\u65E0\u6CD5\u81EA\u52A8\u66F4\u65B0\u3002",update_incompatible:"\u6B64 Release \u4E0D\u652F\u6301\u5F53\u524D DSH \u7248\u672C\u3002",update_checking:"\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026",update_installing:"\u6B63\u5728\u5B89\u88C5\u2026",update_unknown:"\u7ED3\u679C\u672A\u77E5\u3002\u8BF7\u68C0\u67E5\u7ED3\u679C\uFF0C\u4E0D\u8981\u91CD\u590D\u5B89\u88C5\u3002","update_restart-required":"\u8BF7\u91CD\u542F DSH \u4EE5\u4F7F\u7528\u5DF2\u5B89\u88C5\u7248\u672C\u3002",update_applied:"\u5DF2\u786E\u8BA4\u8FD0\u884C\u7248\u672C\u3002",update_overridden:"\u66F4\u9AD8\u4F18\u5148\u7EA7\u7684\u8BBE\u7F6E\u8986\u76D6\u4E86\u66F4\u65B0\u3002",update_failed:"\u66F4\u65B0\u5931\u8D25\u3002",update_cancelled:"\u5B89\u88C5\u5DF2\u53D6\u6D88\u3002","updateReason_management-required":"\u6CA1\u6709 plugin manager \u6216\u53EF\u5199\u5165\u7684 profile\u3002",updateReason_unaddressable:"\u6B64 bundle \u4E3A\u53EA\u8BFB\u3002","updateReason_source-unsupported":"\u5F53\u524D\u5B89\u88C5\u65B9\u5F0F\u9700\u8981\u624B\u52A8\u66F4\u65B0\u3002",updateReason_incompatible:"DSH \u7248\u672C\u4E0D\u517C\u5BB9\u3002",updateReason_checksum:"\u6821\u9A8C\u548C\u4E0D\u5339\u914D\u3002",updateReason_connection:"\u8FDE\u63A5\u5DF2\u4E2D\u65AD\u3002","updateReason_profile-changed":"\u8FDE\u63A5\u76EE\u6807\u5DF2\u66F4\u6539\u3002\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002","updateReason_already-installed":"DSH \u62D2\u7EDD\u8986\u76D6\u5DF2\u5B89\u88C5\u7684\u5305\uFF0C\u4E14\u8BE5\u5305\u672A\u88AB\u79FB\u9664\u3002",updateReason_restored:"\u65B0\u7248\u672C\u5B89\u88C5\u5931\u8D25\uFF0C\u5DF2\u6309\u539F\u6765\u7684\u5B89\u88C5\u6765\u6E90\u548C\u542F\u7528\u72B6\u6001\u91CD\u65B0\u5B89\u88C5\u65E7\u7248\u672C\u3002\u5982\u679C\u8FD0\u884C\u7248\u672C\u4ECD\u662F\u65E7\u7248\u672C\uFF0C\u8BF7\u91CD\u542F DSH\u3002","updateReason_restore-failed":"\u65B0\u7248\u672C\u5B89\u88C5\u5931\u8D25\uFF0C\u91CD\u65B0\u5B89\u88C5\u65E7\u7248\u672C\u4E5F\u5931\u8D25\u4E86\u3002\u5305\u4ECD\u5904\u4E8E\u5DF2\u5378\u8F7D\u72B6\u6001\u3002\u8BF7\u4ECE Release \u6216 plugin manager \u518D\u6B21\u5B89\u88C5\u3002",updateReason_other:"\u5143\u6570\u636E\u3001\u4E0B\u8F7D\u6216\u5B89\u88C5\u5931\u8D25\u3002\u8BF7\u5728 Release \u6216 plugin manager \u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",pricingNote:"\u4EF7\u683C\u4F1A\u53D8\u5316\u3002\u622A\u81F3 2026-10-15\uFF0CBrave Search API \u6CA1\u6709\u5355\u72EC\u7684\u514D\u8D39\u8BA1\u5212\uFF1B\u6BCF\u4E2A\u8BA1\u5212\u6BCF\u6708\u542B $5 \u62B5\u7528\u989D\uFF08Search \u7EA6 1,000 \u6B21\u67E5\u8BE2\uFF09\uFF0C\u5F00\u901A\u9700\u8981\u94F6\u884C\u5361\u3002",bravePricing:"Brave \u7684\u8BA1\u5212\u8BF4\u660E",fallbackNote:"\u4EC5\u5F53\u6240\u9009\u63D0\u4F9B\u5546\u8FD4\u56DE HTTP 429 \u65F6\uFF0C\u624D\u4F1A\u6309\u5217\u8868\u987A\u5E8F\u5404\u5C1D\u8BD5\u4E00\u6B21\u5176\u4ED6\u5DF2\u542F\u7528\u4E14\u652F\u6301\u540C\u4E00\u641C\u7D22\u7684\u63D0\u4F9B\u5546\u3002\u4E0D\u4F1A\u5411\u540C\u4E00\u63D0\u4F9B\u5546\u81EA\u52A8\u91CD\u8BD5\u3002\u8BA4\u8BC1\u5931\u8D25\u3001\u5DF2\u7981\u7528\u6216\u4E0D\u652F\u6301\u7684\u641C\u7D22\u4E0D\u4F1A\u5207\u6362\u3002\u6B63\u6587\u63D0\u53D6\u3001\u7AD9\u5185\u94FE\u63A5\u548C X \u641C\u7D22\u4E5F\u4E0D\u4F1A\u5207\u6362\u3002",nav:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",title:"\u7F51\u9875\u641C\u7D22\u63D0\u4F9B\u5546",native:"DSH \u9ED8\u8BA4",default:"\u9ED8\u8BA4",setDefault:"\u7528\u4E8E\u7F51\u9875\u641C\u7D22",enable:"\u4F7F\u7528\u6B64\u63D0\u4F9B\u5546",saveKey:"\u4FDD\u5B58 API \u5BC6\u94A5",editKey:"\u66F4\u6539 API \u5BC6\u94A5",deleteKey:"\u5220\u9664\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5",key:"API \u5BC6\u94A5",keySaved:"\u5DF2\u4FDD\u5B58\u5BC6\u94A5",keyMissing:"\u672A\u8BBE\u7F6E API \u5BC6\u94A5",keyOptional:"\u65E0\u9700\u5BC6\u94A5\u5373\u53EF\u4F7F\u7528",source:"\u6765\u6E90",selectTools:"\u9009\u62E9\u529F\u80FD",close:"\u5173\u95ED",save:"\u4FDD\u5B58",retry:"\u91CD\u8BD5",searchFeatures:"\u641C\u7D22\u529F\u80FD",noFeatures:"\u6CA1\u6709\u5339\u914D\u7684\u529F\u80FD",loadFailed:"\u65E0\u6CD5\u52A0\u8F7D\u8BBE\u7F6E\u3002",saveFailed:"\u65E0\u6CD5\u4FDD\u5B58\uFF0C\u8BF7\u91CD\u8BD5\u3002",conflict:"\u8BBE\u7F6E\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u66F4\u6539\uFF0C\u8BF7\u91CD\u8BD5\u3002",missingKey:"\u8BF7\u5148\u4FDD\u5B58 API \u5BC6\u94A5\u3002",disabled:"\u8BF7\u5148\u542F\u7528\u63D0\u4F9B\u5546\u3002",keyHint:"\u4F18\u5148\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\uFF0C\u518D\u4F7F\u7528\u73AF\u5883\u53D8\u91CF\u3002",nativeHint:"\u4F7F\u7528\u5B89\u88C5\u6B64\u63D2\u4EF6\u524D\u914D\u7F6E\u7684\u641C\u7D22\u63D0\u4F9B\u5546\u3002",defaultDisabled:"\u9ED8\u8BA4\u63D0\u4F9B\u5546\u5DF2\u7981\u7528\uFF0C\u8BF7\u542F\u7528\u5B83\u6216\u9009\u62E9\u5176\u4ED6\u63D0\u4F9B\u5546\u3002",providedBy:"\u5DF2\u9009\u63D0\u4F9B\u5546",feature:"\u4F7F\u7528\u529F\u80FD",news:"\u65B0\u95FB\u641C\u7D22",newsHint:"\u67E5\u627E\u65B0\u95FB\u6587\u7AE0\u3002",papers:"\u8BBA\u6587\u641C\u7D22",papersHint:"\u67E5\u627E\u5B66\u672F\u8BBA\u6587\u3002",code:"\u4EE3\u7801\u641C\u7D22",codeHint:"\u67E5\u627E\u516C\u5F00\u4EE3\u7801\u793A\u4F8B\u548C\u6280\u672F\u6587\u6863\u3002",people:"\u4EBA\u7269\u641C\u7D22",peopleHint:"\u67E5\u627E\u516C\u5F00\u7684\u804C\u4E1A\u548C\u4EFB\u804C\u4FE1\u606F\u3002",companies:"\u4F01\u4E1A\u641C\u7D22",companiesHint:"\u67E5\u627E\u4F01\u4E1A\u7F51\u9875\u548C\u516C\u5F00\u4FE1\u606F\u3002",images:"\u56FE\u7247\u641C\u7D22",imagesHint:"\u67E5\u627E\u56FE\u7247\u53CA\u5176\u6765\u6E90\u7F51\u9875\u3002",videos:"\u89C6\u9891\u641C\u7D22",videosHint:"\u67E5\u627E\u89C6\u9891\u53CA\u5176\u8BF4\u660E\u3002",extract:"\u7F51\u9875\u6B63\u6587",extractHint:"\u901A\u8FC7\u6B64\u670D\u52A1\u63D0\u53D6\u516C\u5F00\u7F51\u5740\u7684\u6B63\u6587\u3002",map:"\u7F51\u7AD9\u9875\u9762\u5217\u8868",mapHint:"\u67E5\u627E\u7F51\u7AD9\u5185\u7684\u9875\u9762\u7F51\u5740\u3002",x:"X \u641C\u7D22",xHint:"\u641C\u7D22 X \u5E16\u5B50\u6216\u8BFB\u53D6\u5E16\u5B50\u7F51\u5740\u3002\u5173\u952E\u8BCD\u641C\u7D22\u53EF\u80FD\u4E0D\u53EF\u7528\u3002"};var We=`.dsh-search-settings { display: flex; flex-direction: column; gap: 12px; max-width: 720px; color: var(--dsw-alias-label-primary); }
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
.dsh-search-note { margin: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.dsh-search-note a { color: inherit; }
.dsh-search-error { margin: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-state-error-primary); }
.dsh-search-loading { display: grid; place-items: center; min-height: 120px; }
.dsh-search-dialog { width: min(520px, 100%); color: var(--dsw-alias-label-primary); --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2); }
.dsh-search-key-form { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.dsh-search-feature-list { display: flex; flex-direction: column; max-height: 360px; overflow-y: auto; padding: 2px 4px 2px 0; margin-top: 12px; }
.dsh-search-feature { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: .5px solid var(--dsw-alias-border-l3); font-size: 14px; }
.dsh-search-feature:last-child { border-bottom: 0; }
@media (max-width: 480px) { .dsh-search-provider { padding: 12px; } .dsh-search-actions { gap: 6px; } }

.dsh-search-settings .dsh-search-update { border-bottom: 1px solid var(--dsw-alias-border-l3); padding-bottom: 16px; margin-bottom: 16px; overflow-wrap: anywhere; }
.dsh-search-settings .dsh-search-update-notes { white-space: pre-wrap; max-height: 160px; overflow: auto; }
`;var Oe=`/* Button sizes share the global control-radius scale. */
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
`;var n=require("react/jsx-runtime"),de="dsh.searchProviders",ze=["slots","locale","connection","remote"];function et(e){return(0,m.useSyncExternalStore)(t=>e.subscribe(t),()=>e.getSnapshot().revision),e.bind(de)}function X(e){let t=e instanceof Error?e.message:"";return t.endsWith("/settings-changed")?"conflict":t.endsWith("/missing-key")?"missingKey":t.endsWith("/provider-disabled")?"disabled":"saveFailed"}function tt({entry:e,controller:t,t:r,onClose:s}){let[o,a]=(0,m.useState)(""),[d,l]=(0,m.useState)(!1),[h,g]=(0,m.useState)(),k=(0,m.useId)();async function u(c){c.preventDefault(),l(!0),g(void 0);let v=o;a("");try{await t.call("save-key",{provider:e.id,key:v}),await t.refresh(),s()}catch(i){g(X(i))}finally{l(!1)}}async function p(){l(!0),a(""),g(void 0);try{await t.call("delete-key",{provider:e.id}),await t.refresh(),s()}catch(c){g(X(c))}finally{l(!1)}}return(0,n.jsx)(K,{open:!0,title:`${e.label} \xB7 ${r("key")}`,closeLabel:r("close"),onClose:s,className:"dsh-search-dialog",children:(0,n.jsxs)("form",{onSubmit:c=>{u(c)},className:"dsh-search-key-form",children:[(0,n.jsx)("label",{htmlFor:k,children:r("key")}),(0,n.jsx)(B,{id:k,type:"password",autoComplete:"off",value:o,onChange:c=>a(c.target.value),disabled:d||!e.writable,"data-modal-autofocus":!0}),(0,n.jsx)("p",{className:"dsh-search-muted",children:r("keyHint")}),h&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:r(h)}),(0,n.jsxs)("div",{className:"dsh-search-actions",children:[(0,n.jsx)(b,{type:"submit",variant:"primary",disabled:d||!o.trim()||!e.writable,children:r("save")}),e.source==="saved"&&(0,n.jsx)(b,{variant:"outline",disabled:d||!e.writable,onClick:()=>{p()},children:r("deleteKey")})]})]})})}function rt({entry:e,snapshot:t,controller:r,t:s,onClose:o}){let[a,d]=(0,m.useState)(""),[l,h]=(0,m.useState)(!1),[g,k]=(0,m.useState)(),u=e.capabilities.filter(c=>`${s(c)} ${s(`${c}Hint`)}`.toLowerCase().includes(a.toLowerCase()));async function p(c,v){h(!0),k(void 0);try{await r.call("tool",{provider:e.id,capability:c,enabled:v,revision:t.revision}),await r.refresh()}catch(i){k(X(i)),await r.refresh()}finally{h(!1)}}return(0,n.jsxs)(K,{open:!0,title:`${e.label} \xB7 ${s("selectTools")}`,closeLabel:s("close"),onClose:o,className:"dsh-search-dialog",children:[(0,n.jsx)(B,{"aria-label":s("searchFeatures"),placeholder:s("searchFeatures"),value:a,onChange:c=>d(c.target.value),"data-modal-autofocus":!0}),g&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:s(g)}),(0,n.jsxs)("div",{className:"dsh-search-feature-list",children:[u.map(c=>{let v=t.tools[c],i=v?.enabled===!0&&v.provider===e.id,y=v?.enabled&&!i?t.entries.find(L=>L.id===v.provider):void 0;return(0,n.jsxs)("div",{className:"dsh-search-feature",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{children:s(c)}),(0,n.jsx)("p",{className:"dsh-search-muted",children:s(`${c}Hint`)}),y&&(0,n.jsxs)("p",{className:"dsh-search-muted",children:[s("providedBy"),": ",y.label]})]}),(0,n.jsx)(V,{label:`${s("feature")}: ${s(c)}`,checked:i,disabled:l||!e.enabled,onChange:L=>{p(c,L)}})]},c)}),u.length===0&&(0,n.jsx)("p",{className:"dsh-search-muted",children:s("noFeatures")})]})]})}function ot({controller:e,t}){let r=(0,m.useSyncExternalStore)(e.subscribe,e.getSnapshot);(0,m.useEffect)(()=>{e.status()},[e]);let s=!r.profileKey||r.status==="checking"||r.status==="installing";return(0,n.jsxs)("div",{className:"dsh-search-update",children:[(0,n.jsxs)("p",{children:[t("updateRunning"),": ",r.running,r.installed&&r.installed!==r.running?` \xB7 ${t("updateInstalled")}: ${r.installed}`:""]}),(0,n.jsxs)("p",{role:"status",children:[t(`update_${r.status}`),r.reason&&(0,n.jsxs)("span",{children:[" \xB7 ",t("updateReason"),": ",t(`updateReason_${r.reason}`in le?`updateReason_${r.reason}`:"updateReason_other")]}),r.stage&&(0,n.jsxs)("span",{children:[" \xB7 ",t("updateStage"),": ",r.stage]})]}),r.checkedAt&&(0,n.jsxs)("p",{className:"dsh-search-muted",children:[t("updateChecked"),": ",new Date(r.checkedAt).toLocaleString()]}),r.candidate&&r.status==="available"&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("p",{children:[r.running," \u2192 ",r.candidate.version," \xB7 DSH ",r.candidate.runtime]}),(0,n.jsx)("p",{className:"dsh-search-update-notes",children:r.candidate.notes}),(0,n.jsx)("p",{className:"dsh-search-muted",children:t("updatePin")})]}),(0,n.jsxs)("div",{className:"dsh-search-actions",children:[(0,n.jsx)(b,{variant:"outline",size:"sm",disabled:s||r.status==="unavailable"||r.status==="unknown"||r.status==="restart-required",onClick:()=>{e.check()},children:t("updateCheck")}),r.status==="available"&&(0,n.jsx)(b,{variant:"primary",size:"sm",onClick:()=>{e.install()},children:t("updateInstall")}),r.status==="unknown"&&(0,n.jsx)(b,{variant:"outline",size:"sm",onClick:()=>{e.status()},children:t("updateReconcile")}),(0,n.jsx)("a",{href:"https://github.com/Aero123421/dsh-search-providers/releases",target:"_blank",rel:"noreferrer",children:t("updateReleases")})]})]})}function He({controller:e,locale:t,updates:r}){let s=(0,m.useSyncExternalStore)(e.subscribe,e.getSnapshot),o=et(t),[a,d]=(0,m.useState)(),[l,h]=(0,m.useState)(!1),[g,k]=(0,m.useState)();(0,m.useEffect)(()=>{e.load()},[e]);let u=s.snapshot,p=u?.entries.find(i=>i.id===a?.provider);async function c(i,y){if(u){h(!0),k(void 0);try{await e.call(i,{...y,revision:u.revision,searchRevision:u.searchRevision}),await e.refresh()}catch(L){k(X(L)),await e.refresh()}finally{h(!1)}}}let v=u?.entries.some(i=>u.searchProvider===U(i.id)&&!i.enabled);return(0,n.jsxs)("section",{className:"dsh-search-settings",children:[(0,n.jsx)("h2",{children:o("title")}),(0,n.jsxs)("p",{className:"dsh-search-note",children:[o("pricingNote")," ",(0,n.jsx)("a",{href:"https://api-dashboard.search.brave.com/documentation/resources/help-feedback",target:"_blank",rel:"noreferrer",children:o("bravePricing")})]}),(0,n.jsx)("p",{className:"dsh-search-note",children:o("fallbackNote")}),(0,n.jsx)(ot,{controller:r,t:o}),s.error&&(0,n.jsxs)("p",{role:"alert",className:"dsh-search-error",children:[o("loadFailed")," ",(0,n.jsx)(b,{size:"sm",onClick:()=>{e.refresh()},children:o("retry")})]}),g&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:o(g)}),s.status==="loading"&&!u&&(0,n.jsx)("div",{className:"dsh-search-loading",children:(0,n.jsx)(F,{state:"ongoing",size:20})}),v&&(0,n.jsx)("p",{role:"alert",className:"dsh-search-error",children:o("defaultDisabled")}),u&&(0,n.jsxs)("div",{className:"dsh-search-providers",children:[(0,n.jsx)("article",{className:"dsh-search-provider",children:(0,n.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,n.jsx)("span",{className:"dsh-search-name",children:o("native")}),u.searchProvider.startsWith("dsh-search-providers-")?(0,n.jsx)(b,{variant:"outline",size:"sm",disabled:l,onClick:()=>{c("default",{provider:"native"})},children:o("setDefault")}):(0,n.jsx)("span",{className:"dsh-search-tag",children:o("default")})]})}),u.entries.map(i=>(0,n.jsxs)("article",{className:"dsh-search-provider",children:[(0,n.jsxs)("div",{className:"dsh-search-provider-head",children:[(0,n.jsxs)("div",{className:"dsh-search-identity",children:[(0,n.jsx)("span",{className:"dsh-search-name",children:i.label}),u.searchProvider===U(i.id)&&(0,n.jsx)("span",{className:"dsh-search-tag",children:o("default")})]}),(0,n.jsx)(V,{label:`${o("enable")}: ${i.label}`,checked:i.enabled,disabled:l||!i.enabled&&!i.configured&&!i.keyOptional,onChange:y=>{c("provider",{provider:i.id,enabled:y})}})]}),(0,n.jsxs)("div",{className:"dsh-search-status",children:[(0,n.jsx)(F,{state:i.configured||i.keyOptional?"done":"pending",size:10}),(0,n.jsx)("span",{children:o(i.configured?"keySaved":i.keyOptional?"keyOptional":"keyMissing")}),i.source&&i.source!=="saved"&&(0,n.jsx)("span",{children:i.source})]}),(0,n.jsxs)("div",{className:"dsh-search-actions",children:[i.supportsKeys&&(0,n.jsx)(b,{variant:"outline",size:"sm",disabled:l||!i.writable,onClick:()=>d({kind:"key",provider:i.id}),children:o(i.configured?"editKey":"saveKey")}),i.webSearch&&u.searchProvider!==U(i.id)&&(0,n.jsx)(b,{variant:"outline",size:"sm",disabled:l||!i.enabled,onClick:()=>{c("default",{provider:i.id})},children:o("setDefault")}),(0,n.jsx)(b,{variant:"outline",size:"sm",disabled:l,onClick:()=>d({kind:"features",provider:i.id}),children:o("selectTools")})]})]},i.id))]}),a?.kind==="key"&&p&&(0,n.jsx)(tt,{entry:p,controller:e,t:o,onClose:()=>d(void 0)}),a?.kind==="features"&&p&&u&&(0,n.jsx)(rt,{entry:p,snapshot:u,controller:e,t:o,onClose:()=>d(void 0)})]})}function st(e){let t=new G(e.connection),r=new j(e.connection);e.effect(()=>()=>{t.dispose(),r.dispose()}),e.effect(()=>e.locale.register(de,{en:le,ja:Me,zh:Le})),e.effect(()=>{let s=document.createElement("style");return s.dataset.dshSearchProviders="",s.textContent=Oe+We,document.head.append(s),()=>s.remove()}),e.on("connection/reset",()=>{t.refreshIfLoaded(),r.reset()}),e.effect(()=>{let s=["settings/document-updated","credentials/record-updated","credentials/reference-updated"].map(o=>e.remote?.$on(o,()=>t.refreshIfLoaded()));return()=>{for(let o of s)o?.()}}),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:"web-search-provider",order:15,label:()=>e.locale.bind(de)("nav"),icon:ee,inject:()=>({controller:t,locale:e.locale,updates:r})},He))}

return module.exports;}});
