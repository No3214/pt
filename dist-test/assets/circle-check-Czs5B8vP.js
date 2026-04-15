import{r as c}from"./vendor-Br48x6BR.js";/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=(...t)=>t.filter((e,o,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===o).join(" ").trim();/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,o,r)=>r?r.toUpperCase():o.toLowerCase());/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=t=>{const e=b(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},W=c.createContext({}),v=()=>c.useContext(W),S=c.forwardRef(({color:t,size:e,strokeWidth:o,absoluteStrokeWidth:r,className:a="",children:s,iconNode:m,...l},p)=>{const{size:n=24,strokeWidth:h=2,absoluteStrokeWidth:k=!1,color:x="currentColor",className:w=""}=v()??{},f=r??k?Number(o??h)*24/Number(e??n):o??h;return c.createElement("svg",{ref:p,...i,width:e??n??i.width,height:e??n??i.height,stroke:t??x,strokeWidth:f,className:u("lucide",w,a),...!s&&!L(l)&&{"aria-hidden":"true"},...l},[...m.map(([g,y])=>c.createElement(g,y)),...Array.isArray(s)?s:[s]])});/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(t,e)=>{const o=c.forwardRef(({className:r,...a},s)=>c.createElement(S,{ref:s,iconNode:e,className:u(`lucide-${A(d(t))}`,`lucide-${t}`,r),...a}));return o.displayName=d(t),o};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],N=C("chevron-right",_);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],R=C("circle-check",$);export{R as C,N as a,C as c};
