(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const a of u.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function l(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerPolicy&&(u.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?u.credentials="include":s.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(s){if(s.ep)return;s.ep=!0;const u=l(s);fetch(s.href,u)}})();var Ps={exports:{}},ll={},bs={exports:{}},we={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ju;function Pd(){if(ju)return we;ju=1;var c=Symbol.for("react.element"),r=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),a=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),y=Symbol.for("react.memo"),$=Symbol.for("react.lazy"),g=Symbol.iterator;function m(L){return L===null||typeof L!="object"?null:(L=g&&L[g]||L["@@iterator"],typeof L=="function"?L:null)}var v={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,x={};function w(L,B,ce){this.props=L,this.context=B,this.refs=x,this.updater=ce||v}w.prototype.isReactComponent={},w.prototype.setState=function(L,B){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,B,"setState")},w.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function _(){}_.prototype=w.prototype;function z(L,B,ce){this.props=L,this.context=B,this.refs=x,this.updater=ce||v}var T=z.prototype=new _;T.constructor=z,M(T,w.prototype),T.isPureReactComponent=!0;var N=Array.isArray,U=Object.prototype.hasOwnProperty,K={current:null},V={key:!0,ref:!0,__self:!0,__source:!0};function I(L,B,ce){var ue,he={},$e=null,G=null;if(B!=null)for(ue in B.ref!==void 0&&(G=B.ref),B.key!==void 0&&($e=""+B.key),B)U.call(B,ue)&&!V.hasOwnProperty(ue)&&(he[ue]=B[ue]);var le=arguments.length-2;if(le===1)he.children=ce;else if(1<le){for(var fe=Array(le),Ce=0;Ce<le;Ce++)fe[Ce]=arguments[Ce+2];he.children=fe}if(L&&L.defaultProps)for(ue in le=L.defaultProps,le)he[ue]===void 0&&(he[ue]=le[ue]);return{$$typeof:c,type:L,key:$e,ref:G,props:he,_owner:K.current}}function F(L,B){return{$$typeof:c,type:L.type,key:B,ref:L.ref,props:L.props,_owner:L._owner}}function j(L){return typeof L=="object"&&L!==null&&L.$$typeof===c}function Y(L){var B={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(ce){return B[ce]})}var re=/\/+/g;function ie(L,B){return typeof L=="object"&&L!==null&&L.key!=null?Y(""+L.key):B.toString(36)}function ye(L,B,ce,ue,he){var $e=typeof L;($e==="undefined"||$e==="boolean")&&(L=null);var G=!1;if(L===null)G=!0;else switch($e){case"string":case"number":G=!0;break;case"object":switch(L.$$typeof){case c:case r:G=!0}}if(G)return G=L,he=he(G),L=ue===""?"."+ie(G,0):ue,N(he)?(ce="",L!=null&&(ce=L.replace(re,"$&/")+"/"),ye(he,B,ce,"",function(Ce){return Ce})):he!=null&&(j(he)&&(he=F(he,ce+(!he.key||G&&G.key===he.key?"":(""+he.key).replace(re,"$&/")+"/")+L)),B.push(he)),1;if(G=0,ue=ue===""?".":ue+":",N(L))for(var le=0;le<L.length;le++){$e=L[le];var fe=ue+ie($e,le);G+=ye($e,B,ce,fe,he)}else if(fe=m(L),typeof fe=="function")for(L=fe.call(L),le=0;!($e=L.next()).done;)$e=$e.value,fe=ue+ie($e,le++),G+=ye($e,B,ce,fe,he);else if($e==="object")throw B=String(L),Error("Objects are not valid as a React child (found: "+(B==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":B)+"). If you meant to render a collection of children, use an array instead.");return G}function ge(L,B,ce){if(L==null)return L;var ue=[],he=0;return ye(L,ue,"","",function($e){return B.call(ce,$e,he++)}),ue}function me(L){if(L._status===-1){var B=L._result;B=B(),B.then(function(ce){(L._status===0||L._status===-1)&&(L._status=1,L._result=ce)},function(ce){(L._status===0||L._status===-1)&&(L._status=2,L._result=ce)}),L._status===-1&&(L._status=0,L._result=B)}if(L._status===1)return L._result.default;throw L._result}var xe={current:null},q={transition:null},te={ReactCurrentDispatcher:xe,ReactCurrentBatchConfig:q,ReactCurrentOwner:K};function J(){throw Error("act(...) is not supported in production builds of React.")}return we.Children={map:ge,forEach:function(L,B,ce){ge(L,function(){B.apply(this,arguments)},ce)},count:function(L){var B=0;return ge(L,function(){B++}),B},toArray:function(L){return ge(L,function(B){return B})||[]},only:function(L){if(!j(L))throw Error("React.Children.only expected to receive a single React element child.");return L}},we.Component=w,we.Fragment=l,we.Profiler=s,we.PureComponent=z,we.StrictMode=o,we.Suspense=p,we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=te,we.act=J,we.cloneElement=function(L,B,ce){if(L==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+L+".");var ue=M({},L.props),he=L.key,$e=L.ref,G=L._owner;if(B!=null){if(B.ref!==void 0&&($e=B.ref,G=K.current),B.key!==void 0&&(he=""+B.key),L.type&&L.type.defaultProps)var le=L.type.defaultProps;for(fe in B)U.call(B,fe)&&!V.hasOwnProperty(fe)&&(ue[fe]=B[fe]===void 0&&le!==void 0?le[fe]:B[fe])}var fe=arguments.length-2;if(fe===1)ue.children=ce;else if(1<fe){le=Array(fe);for(var Ce=0;Ce<fe;Ce++)le[Ce]=arguments[Ce+2];ue.children=le}return{$$typeof:c,type:L.type,key:he,ref:$e,props:ue,_owner:G}},we.createContext=function(L){return L={$$typeof:a,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},L.Provider={$$typeof:u,_context:L},L.Consumer=L},we.createElement=I,we.createFactory=function(L){var B=I.bind(null,L);return B.type=L,B},we.createRef=function(){return{current:null}},we.forwardRef=function(L){return{$$typeof:f,render:L}},we.isValidElement=j,we.lazy=function(L){return{$$typeof:$,_payload:{_status:-1,_result:L},_init:me}},we.memo=function(L,B){return{$$typeof:y,type:L,compare:B===void 0?null:B}},we.startTransition=function(L){var B=q.transition;q.transition={};try{L()}finally{q.transition=B}},we.unstable_act=J,we.useCallback=function(L,B){return xe.current.useCallback(L,B)},we.useContext=function(L){return xe.current.useContext(L)},we.useDebugValue=function(){},we.useDeferredValue=function(L){return xe.current.useDeferredValue(L)},we.useEffect=function(L,B){return xe.current.useEffect(L,B)},we.useId=function(){return xe.current.useId()},we.useImperativeHandle=function(L,B,ce){return xe.current.useImperativeHandle(L,B,ce)},we.useInsertionEffect=function(L,B){return xe.current.useInsertionEffect(L,B)},we.useLayoutEffect=function(L,B){return xe.current.useLayoutEffect(L,B)},we.useMemo=function(L,B){return xe.current.useMemo(L,B)},we.useReducer=function(L,B,ce){return xe.current.useReducer(L,B,ce)},we.useRef=function(L){return xe.current.useRef(L)},we.useState=function(L){return xe.current.useState(L)},we.useSyncExternalStore=function(L,B,ce){return xe.current.useSyncExternalStore(L,B,ce)},we.useTransition=function(){return xe.current.useTransition()},we.version="18.3.1",we}var zu;function Us(){return zu||(zu=1,bs.exports=Pd()),bs.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ru;function bd(){if(Ru)return ll;Ru=1;var c=Us(),r=Symbol.for("react.element"),l=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,s=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function a(f,p,y){var $,g={},m=null,v=null;y!==void 0&&(m=""+y),p.key!==void 0&&(m=""+p.key),p.ref!==void 0&&(v=p.ref);for($ in p)o.call(p,$)&&!u.hasOwnProperty($)&&(g[$]=p[$]);if(f&&f.defaultProps)for($ in p=f.defaultProps,p)g[$]===void 0&&(g[$]=p[$]);return{$$typeof:r,type:f,key:m,ref:v,props:g,_owner:s.current}}return ll.Fragment=l,ll.jsx=a,ll.jsxs=a,ll}var Ou;function Ad(){return Ou||(Ou=1,Ps.exports=bd()),Ps.exports}var O=Ad(),Me=Us(),So={},As={exports:{}},nt={},Ns={exports:{}},Is={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Uu;function Nd(){return Uu||(Uu=1,(function(c){function r(q,te){var J=q.length;q.push(te);e:for(;0<J;){var L=J-1>>>1,B=q[L];if(0<s(B,te))q[L]=te,q[J]=B,J=L;else break e}}function l(q){return q.length===0?null:q[0]}function o(q){if(q.length===0)return null;var te=q[0],J=q.pop();if(J!==te){q[0]=J;e:for(var L=0,B=q.length,ce=B>>>1;L<ce;){var ue=2*(L+1)-1,he=q[ue],$e=ue+1,G=q[$e];if(0>s(he,J))$e<B&&0>s(G,he)?(q[L]=G,q[$e]=J,L=$e):(q[L]=he,q[ue]=J,L=ue);else if($e<B&&0>s(G,J))q[L]=G,q[$e]=J,L=$e;else break e}}return te}function s(q,te){var J=q.sortIndex-te.sortIndex;return J!==0?J:q.id-te.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;c.unstable_now=function(){return u.now()}}else{var a=Date,f=a.now();c.unstable_now=function(){return a.now()-f}}var p=[],y=[],$=1,g=null,m=3,v=!1,M=!1,x=!1,w=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,z=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function T(q){for(var te=l(y);te!==null;){if(te.callback===null)o(y);else if(te.startTime<=q)o(y),te.sortIndex=te.expirationTime,r(p,te);else break;te=l(y)}}function N(q){if(x=!1,T(q),!M)if(l(p)!==null)M=!0,me(U);else{var te=l(y);te!==null&&xe(N,te.startTime-q)}}function U(q,te){M=!1,x&&(x=!1,_(I),I=-1),v=!0;var J=m;try{for(T(te),g=l(p);g!==null&&(!(g.expirationTime>te)||q&&!Y());){var L=g.callback;if(typeof L=="function"){g.callback=null,m=g.priorityLevel;var B=L(g.expirationTime<=te);te=c.unstable_now(),typeof B=="function"?g.callback=B:g===l(p)&&o(p),T(te)}else o(p);g=l(p)}if(g!==null)var ce=!0;else{var ue=l(y);ue!==null&&xe(N,ue.startTime-te),ce=!1}return ce}finally{g=null,m=J,v=!1}}var K=!1,V=null,I=-1,F=5,j=-1;function Y(){return!(c.unstable_now()-j<F)}function re(){if(V!==null){var q=c.unstable_now();j=q;var te=!0;try{te=V(!0,q)}finally{te?ie():(K=!1,V=null)}}else K=!1}var ie;if(typeof z=="function")ie=function(){z(re)};else if(typeof MessageChannel<"u"){var ye=new MessageChannel,ge=ye.port2;ye.port1.onmessage=re,ie=function(){ge.postMessage(null)}}else ie=function(){w(re,0)};function me(q){V=q,K||(K=!0,ie())}function xe(q,te){I=w(function(){q(c.unstable_now())},te)}c.unstable_IdlePriority=5,c.unstable_ImmediatePriority=1,c.unstable_LowPriority=4,c.unstable_NormalPriority=3,c.unstable_Profiling=null,c.unstable_UserBlockingPriority=2,c.unstable_cancelCallback=function(q){q.callback=null},c.unstable_continueExecution=function(){M||v||(M=!0,me(U))},c.unstable_forceFrameRate=function(q){0>q||125<q?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):F=0<q?Math.floor(1e3/q):5},c.unstable_getCurrentPriorityLevel=function(){return m},c.unstable_getFirstCallbackNode=function(){return l(p)},c.unstable_next=function(q){switch(m){case 1:case 2:case 3:var te=3;break;default:te=m}var J=m;m=te;try{return q()}finally{m=J}},c.unstable_pauseExecution=function(){},c.unstable_requestPaint=function(){},c.unstable_runWithPriority=function(q,te){switch(q){case 1:case 2:case 3:case 4:case 5:break;default:q=3}var J=m;m=q;try{return te()}finally{m=J}},c.unstable_scheduleCallback=function(q,te,J){var L=c.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?L+J:L):J=L,q){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=J+B,q={id:$++,callback:te,priorityLevel:q,startTime:J,expirationTime:B,sortIndex:-1},J>L?(q.sortIndex=J,r(y,q),l(p)===null&&q===l(y)&&(x?(_(I),I=-1):x=!0,xe(N,J-L))):(q.sortIndex=B,r(p,q),M||v||(M=!0,me(U))),q},c.unstable_shouldYield=Y,c.unstable_wrapCallback=function(q){var te=m;return function(){var J=m;m=te;try{return q.apply(this,arguments)}finally{m=J}}}})(Is)),Is}var Vu;function Id(){return Vu||(Vu=1,Ns.exports=Nd()),Ns.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Hu;function Td(){if(Hu)return nt;Hu=1;var c=Us(),r=Id();function l(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var o=new Set,s={};function u(e,t){a(e,t),a(e+"Capture",t)}function a(e,t){for(s[e]=t,e=0;e<t.length;e++)o.add(t[e])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,y=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,$={},g={};function m(e){return p.call(g,e)?!0:p.call($,e)?!1:y.test(e)?g[e]=!0:($[e]=!0,!1)}function v(e,t,n,i){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function M(e,t,n,i){if(t===null||typeof t>"u"||v(e,t,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function x(e,t,n,i,d,h,k){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=i,this.attributeNamespace=d,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=h,this.removeEmptyString=k}var w={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){w[e]=new x(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];w[t]=new x(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){w[e]=new x(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){w[e]=new x(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){w[e]=new x(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){w[e]=new x(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){w[e]=new x(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){w[e]=new x(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){w[e]=new x(e,5,!1,e.toLowerCase(),null,!1,!1)});var _=/[\-:]([a-z])/g;function z(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(_,z);w[t]=new x(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(_,z);w[t]=new x(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(_,z);w[t]=new x(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){w[e]=new x(e,1,!1,e.toLowerCase(),null,!1,!1)}),w.xlinkHref=new x("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){w[e]=new x(e,1,!1,e.toLowerCase(),null,!0,!0)});function T(e,t,n,i){var d=w.hasOwnProperty(t)?w[t]:null;(d!==null?d.type!==0:i||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(M(t,n,d,i)&&(n=null),i||d===null?m(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):d.mustUseProperty?e[d.propertyName]=n===null?d.type===3?!1:"":n:(t=d.attributeName,i=d.attributeNamespace,n===null?e.removeAttribute(t):(d=d.type,n=d===3||d===4&&n===!0?"":""+n,i?e.setAttributeNS(i,t,n):e.setAttribute(t,n))))}var N=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,U=Symbol.for("react.element"),K=Symbol.for("react.portal"),V=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),F=Symbol.for("react.profiler"),j=Symbol.for("react.provider"),Y=Symbol.for("react.context"),re=Symbol.for("react.forward_ref"),ie=Symbol.for("react.suspense"),ye=Symbol.for("react.suspense_list"),ge=Symbol.for("react.memo"),me=Symbol.for("react.lazy"),xe=Symbol.for("react.offscreen"),q=Symbol.iterator;function te(e){return e===null||typeof e!="object"?null:(e=q&&e[q]||e["@@iterator"],typeof e=="function"?e:null)}var J=Object.assign,L;function B(e){if(L===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);L=t&&t[1]||""}return`
`+L+e}var ce=!1;function ue(e,t){if(!e||ce)return"";ce=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(A){var i=A}Reflect.construct(e,[],t)}else{try{t.call()}catch(A){i=A}e.call(t.prototype)}else{try{throw Error()}catch(A){i=A}e()}}catch(A){if(A&&i&&typeof A.stack=="string"){for(var d=A.stack.split(`
`),h=i.stack.split(`
`),k=d.length-1,C=h.length-1;1<=k&&0<=C&&d[k]!==h[C];)C--;for(;1<=k&&0<=C;k--,C--)if(d[k]!==h[C]){if(k!==1||C!==1)do if(k--,C--,0>C||d[k]!==h[C]){var E=`
`+d[k].replace(" at new "," at ");return e.displayName&&E.includes("<anonymous>")&&(E=E.replace("<anonymous>",e.displayName)),E}while(1<=k&&0<=C);break}}}finally{ce=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?B(e):""}function he(e){switch(e.tag){case 5:return B(e.type);case 16:return B("Lazy");case 13:return B("Suspense");case 19:return B("SuspenseList");case 0:case 2:case 15:return e=ue(e.type,!1),e;case 11:return e=ue(e.type.render,!1),e;case 1:return e=ue(e.type,!0),e;default:return""}}function $e(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case V:return"Fragment";case K:return"Portal";case F:return"Profiler";case I:return"StrictMode";case ie:return"Suspense";case ye:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Y:return(e.displayName||"Context")+".Consumer";case j:return(e._context.displayName||"Context")+".Provider";case re:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ge:return t=e.displayName||null,t!==null?t:$e(e.type)||"Memo";case me:t=e._payload,e=e._init;try{return $e(e(t))}catch{}}return null}function G(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return $e(t);case 8:return t===I?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function le(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function fe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ce(e){var t=fe(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),i=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var d=n.get,h=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return d.call(this)},set:function(k){i=""+k,h.call(this,k)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(k){i=""+k},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ne(e){e._valueTracker||(e._valueTracker=Ce(e))}function Xe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=fe(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function yl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Bo(e,t){var n=t.checked;return J({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Zs(e,t){var n=t.defaultValue==null?"":t.defaultValue,i=t.checked!=null?t.checked:t.defaultChecked;n=le(t.value!=null?t.value:n),e._wrapperState={initialChecked:i,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Ws(e,t){t=t.checked,t!=null&&T(e,"checked",t,!1)}function jo(e,t){Ws(e,t);var n=le(t.value),i=t.type;if(n!=null)i==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(i==="submit"||i==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?zo(e,t.type,n):t.hasOwnProperty("defaultValue")&&zo(e,t.type,le(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function qs(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var i=t.type;if(!(i!=="submit"&&i!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function zo(e,t,n){(t!=="number"||yl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var gn=Array.isArray;function Or(e,t,n,i){if(e=e.options,t){t={};for(var d=0;d<n.length;d++)t["$"+n[d]]=!0;for(n=0;n<e.length;n++)d=t.hasOwnProperty("$"+e[n].value),e[n].selected!==d&&(e[n].selected=d),d&&i&&(e[n].defaultSelected=!0)}else{for(n=""+le(n),t=null,d=0;d<e.length;d++){if(e[d].value===n){e[d].selected=!0,i&&(e[d].defaultSelected=!0);return}t!==null||e[d].disabled||(t=e[d])}t!==null&&(t.selected=!0)}}function Ro(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(l(91));return J({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ys(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(l(92));if(gn(n)){if(1<n.length)throw Error(l(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:le(n)}}function Gs(e,t){var n=le(t.value),i=le(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),i!=null&&(e.defaultValue=""+i)}function Xs(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ks(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Oo(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ks(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var $l,Js=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,i,d){MSApp.execUnsafeLocalFunction(function(){return e(t,n,i,d)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for($l=$l||document.createElement("div"),$l.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=$l.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function mn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var wn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},N0=["Webkit","ms","Moz","O"];Object.keys(wn).forEach(function(e){N0.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),wn[t]=wn[e]})});function ec(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||wn.hasOwnProperty(e)&&wn[e]?(""+t).trim():t+"px"}function tc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var i=n.indexOf("--")===0,d=ec(n,t[n],i);n==="float"&&(n="cssFloat"),i?e.setProperty(n,d):e[n]=d}}var I0=J({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Uo(e,t){if(t){if(I0[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(l(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(l(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(l(61))}if(t.style!=null&&typeof t.style!="object")throw Error(l(62))}}function Vo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ho=null;function Zo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wo=null,Ur=null,Vr=null;function rc(e){if(e=Un(e)){if(typeof Wo!="function")throw Error(l(280));var t=e.stateNode;t&&(t=jl(t),Wo(e.stateNode,e.type,t))}}function nc(e){Ur?Vr?Vr.push(e):Vr=[e]:Ur=e}function lc(){if(Ur){var e=Ur,t=Vr;if(Vr=Ur=null,rc(e),t)for(e=0;e<t.length;e++)rc(t[e])}}function oc(e,t){return e(t)}function ic(){}var qo=!1;function sc(e,t,n){if(qo)return e(t,n);qo=!0;try{return oc(e,t,n)}finally{qo=!1,(Ur!==null||Vr!==null)&&(ic(),lc())}}function vn(e,t){var n=e.stateNode;if(n===null)return null;var i=jl(n);if(i===null)return null;n=i[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(l(231,t,typeof n));return n}var Yo=!1;if(f)try{var Mn={};Object.defineProperty(Mn,"passive",{get:function(){Yo=!0}}),window.addEventListener("test",Mn,Mn),window.removeEventListener("test",Mn,Mn)}catch{Yo=!1}function T0(e,t,n,i,d,h,k,C,E){var A=Array.prototype.slice.call(arguments,3);try{t.apply(n,A)}catch(Z){this.onError(Z)}}var Cn=!1,kl=null,xl=!1,Go=null,D0={onError:function(e){Cn=!0,kl=e}};function B0(e,t,n,i,d,h,k,C,E){Cn=!1,kl=null,T0.apply(D0,arguments)}function j0(e,t,n,i,d,h,k,C,E){if(B0.apply(this,arguments),Cn){if(Cn){var A=kl;Cn=!1,kl=null}else throw Error(l(198));xl||(xl=!0,Go=A)}}function Er(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function cc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ac(e){if(Er(e)!==e)throw Error(l(188))}function z0(e){var t=e.alternate;if(!t){if(t=Er(e),t===null)throw Error(l(188));return t!==e?null:e}for(var n=e,i=t;;){var d=n.return;if(d===null)break;var h=d.alternate;if(h===null){if(i=d.return,i!==null){n=i;continue}break}if(d.child===h.child){for(h=d.child;h;){if(h===n)return ac(d),e;if(h===i)return ac(d),t;h=h.sibling}throw Error(l(188))}if(n.return!==i.return)n=d,i=h;else{for(var k=!1,C=d.child;C;){if(C===n){k=!0,n=d,i=h;break}if(C===i){k=!0,i=d,n=h;break}C=C.sibling}if(!k){for(C=h.child;C;){if(C===n){k=!0,n=h,i=d;break}if(C===i){k=!0,i=h,n=d;break}C=C.sibling}if(!k)throw Error(l(189))}}if(n.alternate!==i)throw Error(l(190))}if(n.tag!==3)throw Error(l(188));return n.stateNode.current===n?e:t}function uc(e){return e=z0(e),e!==null?fc(e):null}function fc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=fc(e);if(t!==null)return t;e=e.sibling}return null}var dc=r.unstable_scheduleCallback,pc=r.unstable_cancelCallback,R0=r.unstable_shouldYield,O0=r.unstable_requestPaint,Ie=r.unstable_now,U0=r.unstable_getCurrentPriorityLevel,Xo=r.unstable_ImmediatePriority,hc=r.unstable_UserBlockingPriority,gl=r.unstable_NormalPriority,V0=r.unstable_LowPriority,yc=r.unstable_IdlePriority,ml=null,St=null;function H0(e){if(St&&typeof St.onCommitFiberRoot=="function")try{St.onCommitFiberRoot(ml,e,void 0,(e.current.flags&128)===128)}catch{}}var $t=Math.clz32?Math.clz32:q0,Z0=Math.log,W0=Math.LN2;function q0(e){return e>>>=0,e===0?32:31-(Z0(e)/W0|0)|0}var wl=64,vl=4194304;function Sn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ml(e,t){var n=e.pendingLanes;if(n===0)return 0;var i=0,d=e.suspendedLanes,h=e.pingedLanes,k=n&268435455;if(k!==0){var C=k&~d;C!==0?i=Sn(C):(h&=k,h!==0&&(i=Sn(h)))}else k=n&~d,k!==0?i=Sn(k):h!==0&&(i=Sn(h));if(i===0)return 0;if(t!==0&&t!==i&&(t&d)===0&&(d=i&-i,h=t&-t,d>=h||d===16&&(h&4194240)!==0))return t;if((i&4)!==0&&(i|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=i;0<t;)n=31-$t(t),d=1<<n,i|=e[n],t&=~d;return i}function Y0(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function G0(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,d=e.expirationTimes,h=e.pendingLanes;0<h;){var k=31-$t(h),C=1<<k,E=d[k];E===-1?((C&n)===0||(C&i)!==0)&&(d[k]=Y0(C,t)):E<=t&&(e.expiredLanes|=C),h&=~C}}function Ko(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function $c(){var e=wl;return wl<<=1,(wl&4194240)===0&&(wl=64),e}function Jo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function En(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-$t(t),e[t]=n}function X0(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var i=e.eventTimes;for(e=e.expirationTimes;0<n;){var d=31-$t(n),h=1<<d;t[d]=0,i[d]=-1,e[d]=-1,n&=~h}}function ei(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-$t(n),d=1<<i;d&t|e[i]&t&&(e[i]|=t),n&=~d}}var Ee=0;function kc(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var xc,ti,gc,mc,wc,ri=!1,Cl=[],ir=null,sr=null,cr=null,Qn=new Map,Fn=new Map,ar=[],K0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function vc(e,t){switch(e){case"focusin":case"focusout":ir=null;break;case"dragenter":case"dragleave":sr=null;break;case"mouseover":case"mouseout":cr=null;break;case"pointerover":case"pointerout":Qn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Fn.delete(t.pointerId)}}function Ln(e,t,n,i,d,h){return e===null||e.nativeEvent!==h?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:h,targetContainers:[d]},t!==null&&(t=Un(t),t!==null&&ti(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,d!==null&&t.indexOf(d)===-1&&t.push(d),e)}function J0(e,t,n,i,d){switch(t){case"focusin":return ir=Ln(ir,e,t,n,i,d),!0;case"dragenter":return sr=Ln(sr,e,t,n,i,d),!0;case"mouseover":return cr=Ln(cr,e,t,n,i,d),!0;case"pointerover":var h=d.pointerId;return Qn.set(h,Ln(Qn.get(h)||null,e,t,n,i,d)),!0;case"gotpointercapture":return h=d.pointerId,Fn.set(h,Ln(Fn.get(h)||null,e,t,n,i,d)),!0}return!1}function Mc(e){var t=Qr(e.target);if(t!==null){var n=Er(t);if(n!==null){if(t=n.tag,t===13){if(t=cc(n),t!==null){e.blockedOn=t,wc(e.priority,function(){gc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=li(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);Ho=i,n.target.dispatchEvent(i),Ho=null}else return t=Un(n),t!==null&&ti(t),e.blockedOn=n,!1;t.shift()}return!0}function Cc(e,t,n){Sl(e)&&n.delete(t)}function ef(){ri=!1,ir!==null&&Sl(ir)&&(ir=null),sr!==null&&Sl(sr)&&(sr=null),cr!==null&&Sl(cr)&&(cr=null),Qn.forEach(Cc),Fn.forEach(Cc)}function _n(e,t){e.blockedOn===t&&(e.blockedOn=null,ri||(ri=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,ef)))}function Pn(e){function t(d){return _n(d,e)}if(0<Cl.length){_n(Cl[0],e);for(var n=1;n<Cl.length;n++){var i=Cl[n];i.blockedOn===e&&(i.blockedOn=null)}}for(ir!==null&&_n(ir,e),sr!==null&&_n(sr,e),cr!==null&&_n(cr,e),Qn.forEach(t),Fn.forEach(t),n=0;n<ar.length;n++)i=ar[n],i.blockedOn===e&&(i.blockedOn=null);for(;0<ar.length&&(n=ar[0],n.blockedOn===null);)Mc(n),n.blockedOn===null&&ar.shift()}var Hr=N.ReactCurrentBatchConfig,El=!0;function tf(e,t,n,i){var d=Ee,h=Hr.transition;Hr.transition=null;try{Ee=1,ni(e,t,n,i)}finally{Ee=d,Hr.transition=h}}function rf(e,t,n,i){var d=Ee,h=Hr.transition;Hr.transition=null;try{Ee=4,ni(e,t,n,i)}finally{Ee=d,Hr.transition=h}}function ni(e,t,n,i){if(El){var d=li(e,t,n,i);if(d===null)wi(e,t,i,Ql,n),vc(e,i);else if(J0(d,e,t,n,i))i.stopPropagation();else if(vc(e,i),t&4&&-1<K0.indexOf(e)){for(;d!==null;){var h=Un(d);if(h!==null&&xc(h),h=li(e,t,n,i),h===null&&wi(e,t,i,Ql,n),h===d)break;d=h}d!==null&&i.stopPropagation()}else wi(e,t,i,null,n)}}var Ql=null;function li(e,t,n,i){if(Ql=null,e=Zo(i),e=Qr(e),e!==null)if(t=Er(e),t===null)e=null;else if(n=t.tag,n===13){if(e=cc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ql=e,null}function Sc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(U0()){case Xo:return 1;case hc:return 4;case gl:case V0:return 16;case yc:return 536870912;default:return 16}default:return 16}}var ur=null,oi=null,Fl=null;function Ec(){if(Fl)return Fl;var e,t=oi,n=t.length,i,d="value"in ur?ur.value:ur.textContent,h=d.length;for(e=0;e<n&&t[e]===d[e];e++);var k=n-e;for(i=1;i<=k&&t[n-i]===d[h-i];i++);return Fl=d.slice(e,1<i?1-i:void 0)}function Ll(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function _l(){return!0}function Qc(){return!1}function ot(e){function t(n,i,d,h,k){this._reactName=n,this._targetInst=d,this.type=i,this.nativeEvent=h,this.target=k,this.currentTarget=null;for(var C in e)e.hasOwnProperty(C)&&(n=e[C],this[C]=n?n(h):h[C]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?_l:Qc,this.isPropagationStopped=Qc,this}return J(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=_l)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=_l)},persist:function(){},isPersistent:_l}),t}var Zr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ii=ot(Zr),bn=J({},Zr,{view:0,detail:0}),nf=ot(bn),si,ci,An,Pl=J({},bn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ui,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==An&&(An&&e.type==="mousemove"?(si=e.screenX-An.screenX,ci=e.screenY-An.screenY):ci=si=0,An=e),si)},movementY:function(e){return"movementY"in e?e.movementY:ci}}),Fc=ot(Pl),lf=J({},Pl,{dataTransfer:0}),of=ot(lf),sf=J({},bn,{relatedTarget:0}),ai=ot(sf),cf=J({},Zr,{animationName:0,elapsedTime:0,pseudoElement:0}),af=ot(cf),uf=J({},Zr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ff=ot(uf),df=J({},Zr,{data:0}),Lc=ot(df),pf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},yf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function $f(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=yf[e])?!!t[e]:!1}function ui(){return $f}var kf=J({},bn,{key:function(e){if(e.key){var t=pf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ll(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ui,charCode:function(e){return e.type==="keypress"?Ll(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ll(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),xf=ot(kf),gf=J({},Pl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),_c=ot(gf),mf=J({},bn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ui}),wf=ot(mf),vf=J({},Zr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Mf=ot(vf),Cf=J({},Pl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Sf=ot(Cf),Ef=[9,13,27,32],fi=f&&"CompositionEvent"in window,Nn=null;f&&"documentMode"in document&&(Nn=document.documentMode);var Qf=f&&"TextEvent"in window&&!Nn,Pc=f&&(!fi||Nn&&8<Nn&&11>=Nn),bc=" ",Ac=!1;function Nc(e,t){switch(e){case"keyup":return Ef.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ic(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Wr=!1;function Ff(e,t){switch(e){case"compositionend":return Ic(t);case"keypress":return t.which!==32?null:(Ac=!0,bc);case"textInput":return e=t.data,e===bc&&Ac?null:e;default:return null}}function Lf(e,t){if(Wr)return e==="compositionend"||!fi&&Nc(e,t)?(e=Ec(),Fl=oi=ur=null,Wr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pc&&t.locale!=="ko"?null:t.data;default:return null}}var _f={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Tc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!_f[e.type]:t==="textarea"}function Dc(e,t,n,i){nc(i),t=Tl(t,"onChange"),0<t.length&&(n=new ii("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var In=null,Tn=null;function Pf(e){ta(e,0)}function bl(e){var t=Kr(e);if(Xe(t))return e}function bf(e,t){if(e==="change")return t}var Bc=!1;if(f){var di;if(f){var pi="oninput"in document;if(!pi){var jc=document.createElement("div");jc.setAttribute("oninput","return;"),pi=typeof jc.oninput=="function"}di=pi}else di=!1;Bc=di&&(!document.documentMode||9<document.documentMode)}function zc(){In&&(In.detachEvent("onpropertychange",Rc),Tn=In=null)}function Rc(e){if(e.propertyName==="value"&&bl(Tn)){var t=[];Dc(t,Tn,e,Zo(e)),sc(Pf,t)}}function Af(e,t,n){e==="focusin"?(zc(),In=t,Tn=n,In.attachEvent("onpropertychange",Rc)):e==="focusout"&&zc()}function Nf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return bl(Tn)}function If(e,t){if(e==="click")return bl(t)}function Tf(e,t){if(e==="input"||e==="change")return bl(t)}function Df(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var kt=typeof Object.is=="function"?Object.is:Df;function Dn(e,t){if(kt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var d=n[i];if(!p.call(t,d)||!kt(e[d],t[d]))return!1}return!0}function Oc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Uc(e,t){var n=Oc(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Oc(n)}}function Vc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Vc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Hc(){for(var e=window,t=yl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=yl(e.document)}return t}function hi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Bf(e){var t=Hc(),n=e.focusedElem,i=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Vc(n.ownerDocument.documentElement,n)){if(i!==null&&hi(n)){if(t=i.start,e=i.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var d=n.textContent.length,h=Math.min(i.start,d);i=i.end===void 0?h:Math.min(i.end,d),!e.extend&&h>i&&(d=i,i=h,h=d),d=Uc(n,h);var k=Uc(n,i);d&&k&&(e.rangeCount!==1||e.anchorNode!==d.node||e.anchorOffset!==d.offset||e.focusNode!==k.node||e.focusOffset!==k.offset)&&(t=t.createRange(),t.setStart(d.node,d.offset),e.removeAllRanges(),h>i?(e.addRange(t),e.extend(k.node,k.offset)):(t.setEnd(k.node,k.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var jf=f&&"documentMode"in document&&11>=document.documentMode,qr=null,yi=null,Bn=null,$i=!1;function Zc(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;$i||qr==null||qr!==yl(i)||(i=qr,"selectionStart"in i&&hi(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Bn&&Dn(Bn,i)||(Bn=i,i=Tl(yi,"onSelect"),0<i.length&&(t=new ii("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=qr)))}function Al(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Yr={animationend:Al("Animation","AnimationEnd"),animationiteration:Al("Animation","AnimationIteration"),animationstart:Al("Animation","AnimationStart"),transitionend:Al("Transition","TransitionEnd")},ki={},Wc={};f&&(Wc=document.createElement("div").style,"AnimationEvent"in window||(delete Yr.animationend.animation,delete Yr.animationiteration.animation,delete Yr.animationstart.animation),"TransitionEvent"in window||delete Yr.transitionend.transition);function Nl(e){if(ki[e])return ki[e];if(!Yr[e])return e;var t=Yr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Wc)return ki[e]=t[n];return e}var qc=Nl("animationend"),Yc=Nl("animationiteration"),Gc=Nl("animationstart"),Xc=Nl("transitionend"),Kc=new Map,Jc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function fr(e,t){Kc.set(e,t),u(t,[e])}for(var xi=0;xi<Jc.length;xi++){var gi=Jc[xi],zf=gi.toLowerCase(),Rf=gi[0].toUpperCase()+gi.slice(1);fr(zf,"on"+Rf)}fr(qc,"onAnimationEnd"),fr(Yc,"onAnimationIteration"),fr(Gc,"onAnimationStart"),fr("dblclick","onDoubleClick"),fr("focusin","onFocus"),fr("focusout","onBlur"),fr(Xc,"onTransitionEnd"),a("onMouseEnter",["mouseout","mouseover"]),a("onMouseLeave",["mouseout","mouseover"]),a("onPointerEnter",["pointerout","pointerover"]),a("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var jn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Of=new Set("cancel close invalid load scroll toggle".split(" ").concat(jn));function ea(e,t,n){var i=e.type||"unknown-event";e.currentTarget=n,j0(i,t,void 0,e),e.currentTarget=null}function ta(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],d=i.event;i=i.listeners;e:{var h=void 0;if(t)for(var k=i.length-1;0<=k;k--){var C=i[k],E=C.instance,A=C.currentTarget;if(C=C.listener,E!==h&&d.isPropagationStopped())break e;ea(d,C,A),h=E}else for(k=0;k<i.length;k++){if(C=i[k],E=C.instance,A=C.currentTarget,C=C.listener,E!==h&&d.isPropagationStopped())break e;ea(d,C,A),h=E}}}if(xl)throw e=Go,xl=!1,Go=null,e}function Fe(e,t){var n=t[Qi];n===void 0&&(n=t[Qi]=new Set);var i=e+"__bubble";n.has(i)||(ra(t,e,2,!1),n.add(i))}function mi(e,t,n){var i=0;t&&(i|=4),ra(n,e,i,t)}var Il="_reactListening"+Math.random().toString(36).slice(2);function zn(e){if(!e[Il]){e[Il]=!0,o.forEach(function(n){n!=="selectionchange"&&(Of.has(n)||mi(n,!1,e),mi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Il]||(t[Il]=!0,mi("selectionchange",!1,t))}}function ra(e,t,n,i){switch(Sc(t)){case 1:var d=tf;break;case 4:d=rf;break;default:d=ni}n=d.bind(null,t,n,e),d=void 0,!Yo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(d=!0),i?d!==void 0?e.addEventListener(t,n,{capture:!0,passive:d}):e.addEventListener(t,n,!0):d!==void 0?e.addEventListener(t,n,{passive:d}):e.addEventListener(t,n,!1)}function wi(e,t,n,i,d){var h=i;if((t&1)===0&&(t&2)===0&&i!==null)e:for(;;){if(i===null)return;var k=i.tag;if(k===3||k===4){var C=i.stateNode.containerInfo;if(C===d||C.nodeType===8&&C.parentNode===d)break;if(k===4)for(k=i.return;k!==null;){var E=k.tag;if((E===3||E===4)&&(E=k.stateNode.containerInfo,E===d||E.nodeType===8&&E.parentNode===d))return;k=k.return}for(;C!==null;){if(k=Qr(C),k===null)return;if(E=k.tag,E===5||E===6){i=h=k;continue e}C=C.parentNode}}i=i.return}sc(function(){var A=h,Z=Zo(n),W=[];e:{var H=Kc.get(e);if(H!==void 0){var ee=ii,oe=e;switch(e){case"keypress":if(Ll(n)===0)break e;case"keydown":case"keyup":ee=xf;break;case"focusin":oe="focus",ee=ai;break;case"focusout":oe="blur",ee=ai;break;case"beforeblur":case"afterblur":ee=ai;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ee=Fc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ee=of;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ee=wf;break;case qc:case Yc:case Gc:ee=af;break;case Xc:ee=Mf;break;case"scroll":ee=nf;break;case"wheel":ee=Sf;break;case"copy":case"cut":case"paste":ee=ff;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ee=_c}var se=(t&4)!==0,Te=!se&&e==="scroll",P=se?H!==null?H+"Capture":null:H;se=[];for(var Q=A,b;Q!==null;){b=Q;var X=b.stateNode;if(b.tag===5&&X!==null&&(b=X,P!==null&&(X=vn(Q,P),X!=null&&se.push(Rn(Q,X,b)))),Te)break;Q=Q.return}0<se.length&&(H=new ee(H,oe,null,n,Z),W.push({event:H,listeners:se}))}}if((t&7)===0){e:{if(H=e==="mouseover"||e==="pointerover",ee=e==="mouseout"||e==="pointerout",H&&n!==Ho&&(oe=n.relatedTarget||n.fromElement)&&(Qr(oe)||oe[Xt]))break e;if((ee||H)&&(H=Z.window===Z?Z:(H=Z.ownerDocument)?H.defaultView||H.parentWindow:window,ee?(oe=n.relatedTarget||n.toElement,ee=A,oe=oe?Qr(oe):null,oe!==null&&(Te=Er(oe),oe!==Te||oe.tag!==5&&oe.tag!==6)&&(oe=null)):(ee=null,oe=A),ee!==oe)){if(se=Fc,X="onMouseLeave",P="onMouseEnter",Q="mouse",(e==="pointerout"||e==="pointerover")&&(se=_c,X="onPointerLeave",P="onPointerEnter",Q="pointer"),Te=ee==null?H:Kr(ee),b=oe==null?H:Kr(oe),H=new se(X,Q+"leave",ee,n,Z),H.target=Te,H.relatedTarget=b,X=null,Qr(Z)===A&&(se=new se(P,Q+"enter",oe,n,Z),se.target=b,se.relatedTarget=Te,X=se),Te=X,ee&&oe)t:{for(se=ee,P=oe,Q=0,b=se;b;b=Gr(b))Q++;for(b=0,X=P;X;X=Gr(X))b++;for(;0<Q-b;)se=Gr(se),Q--;for(;0<b-Q;)P=Gr(P),b--;for(;Q--;){if(se===P||P!==null&&se===P.alternate)break t;se=Gr(se),P=Gr(P)}se=null}else se=null;ee!==null&&na(W,H,ee,se,!1),oe!==null&&Te!==null&&na(W,Te,oe,se,!0)}}e:{if(H=A?Kr(A):window,ee=H.nodeName&&H.nodeName.toLowerCase(),ee==="select"||ee==="input"&&H.type==="file")var ae=bf;else if(Tc(H))if(Bc)ae=Tf;else{ae=Nf;var de=Af}else(ee=H.nodeName)&&ee.toLowerCase()==="input"&&(H.type==="checkbox"||H.type==="radio")&&(ae=If);if(ae&&(ae=ae(e,A))){Dc(W,ae,n,Z);break e}de&&de(e,H,A),e==="focusout"&&(de=H._wrapperState)&&de.controlled&&H.type==="number"&&zo(H,"number",H.value)}switch(de=A?Kr(A):window,e){case"focusin":(Tc(de)||de.contentEditable==="true")&&(qr=de,yi=A,Bn=null);break;case"focusout":Bn=yi=qr=null;break;case"mousedown":$i=!0;break;case"contextmenu":case"mouseup":case"dragend":$i=!1,Zc(W,n,Z);break;case"selectionchange":if(jf)break;case"keydown":case"keyup":Zc(W,n,Z)}var pe;if(fi)e:{switch(e){case"compositionstart":var ke="onCompositionStart";break e;case"compositionend":ke="onCompositionEnd";break e;case"compositionupdate":ke="onCompositionUpdate";break e}ke=void 0}else Wr?Nc(e,n)&&(ke="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(ke="onCompositionStart");ke&&(Pc&&n.locale!=="ko"&&(Wr||ke!=="onCompositionStart"?ke==="onCompositionEnd"&&Wr&&(pe=Ec()):(ur=Z,oi="value"in ur?ur.value:ur.textContent,Wr=!0)),de=Tl(A,ke),0<de.length&&(ke=new Lc(ke,e,null,n,Z),W.push({event:ke,listeners:de}),pe?ke.data=pe:(pe=Ic(n),pe!==null&&(ke.data=pe)))),(pe=Qf?Ff(e,n):Lf(e,n))&&(A=Tl(A,"onBeforeInput"),0<A.length&&(Z=new Lc("onBeforeInput","beforeinput",null,n,Z),W.push({event:Z,listeners:A}),Z.data=pe))}ta(W,t)})}function Rn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Tl(e,t){for(var n=t+"Capture",i=[];e!==null;){var d=e,h=d.stateNode;d.tag===5&&h!==null&&(d=h,h=vn(e,n),h!=null&&i.unshift(Rn(e,h,d)),h=vn(e,t),h!=null&&i.push(Rn(e,h,d))),e=e.return}return i}function Gr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function na(e,t,n,i,d){for(var h=t._reactName,k=[];n!==null&&n!==i;){var C=n,E=C.alternate,A=C.stateNode;if(E!==null&&E===i)break;C.tag===5&&A!==null&&(C=A,d?(E=vn(n,h),E!=null&&k.unshift(Rn(n,E,C))):d||(E=vn(n,h),E!=null&&k.push(Rn(n,E,C)))),n=n.return}k.length!==0&&e.push({event:t,listeners:k})}var Uf=/\r\n?/g,Vf=/\u0000|\uFFFD/g;function la(e){return(typeof e=="string"?e:""+e).replace(Uf,`
`).replace(Vf,"")}function Dl(e,t,n){if(t=la(t),la(e)!==t&&n)throw Error(l(425))}function Bl(){}var vi=null,Mi=null;function Ci(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Si=typeof setTimeout=="function"?setTimeout:void 0,Hf=typeof clearTimeout=="function"?clearTimeout:void 0,oa=typeof Promise=="function"?Promise:void 0,Zf=typeof queueMicrotask=="function"?queueMicrotask:typeof oa<"u"?function(e){return oa.resolve(null).then(e).catch(Wf)}:Si;function Wf(e){setTimeout(function(){throw e})}function Ei(e,t){var n=t,i=0;do{var d=n.nextSibling;if(e.removeChild(n),d&&d.nodeType===8)if(n=d.data,n==="/$"){if(i===0){e.removeChild(d),Pn(t);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=d}while(n);Pn(t)}function dr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ia(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Xr=Math.random().toString(36).slice(2),Et="__reactFiber$"+Xr,On="__reactProps$"+Xr,Xt="__reactContainer$"+Xr,Qi="__reactEvents$"+Xr,qf="__reactListeners$"+Xr,Yf="__reactHandles$"+Xr;function Qr(e){var t=e[Et];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Xt]||n[Et]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ia(e);e!==null;){if(n=e[Et])return n;e=ia(e)}return t}e=n,n=e.parentNode}return null}function Un(e){return e=e[Et]||e[Xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Kr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(l(33))}function jl(e){return e[On]||null}var Fi=[],Jr=-1;function pr(e){return{current:e}}function Le(e){0>Jr||(e.current=Fi[Jr],Fi[Jr]=null,Jr--)}function Qe(e,t){Jr++,Fi[Jr]=e.current,e.current=t}var hr={},He=pr(hr),Ke=pr(!1),Fr=hr;function en(e,t){var n=e.type.contextTypes;if(!n)return hr;var i=e.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===t)return i.__reactInternalMemoizedMaskedChildContext;var d={},h;for(h in n)d[h]=t[h];return i&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=d),d}function Je(e){return e=e.childContextTypes,e!=null}function zl(){Le(Ke),Le(He)}function sa(e,t,n){if(He.current!==hr)throw Error(l(168));Qe(He,t),Qe(Ke,n)}function ca(e,t,n){var i=e.stateNode;if(t=t.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var d in i)if(!(d in t))throw Error(l(108,G(e)||"Unknown",d));return J({},n,i)}function Rl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||hr,Fr=He.current,Qe(He,e),Qe(Ke,Ke.current),!0}function aa(e,t,n){var i=e.stateNode;if(!i)throw Error(l(169));n?(e=ca(e,t,Fr),i.__reactInternalMemoizedMergedChildContext=e,Le(Ke),Le(He),Qe(He,e)):Le(Ke),Qe(Ke,n)}var Kt=null,Ol=!1,Li=!1;function ua(e){Kt===null?Kt=[e]:Kt.push(e)}function Gf(e){Ol=!0,ua(e)}function yr(){if(!Li&&Kt!==null){Li=!0;var e=0,t=Ee;try{var n=Kt;for(Ee=1;e<n.length;e++){var i=n[e];do i=i(!0);while(i!==null)}Kt=null,Ol=!1}catch(d){throw Kt!==null&&(Kt=Kt.slice(e+1)),dc(Xo,yr),d}finally{Ee=t,Li=!1}}return null}var tn=[],rn=0,Ul=null,Vl=0,ut=[],ft=0,Lr=null,Jt=1,er="";function _r(e,t){tn[rn++]=Vl,tn[rn++]=Ul,Ul=e,Vl=t}function fa(e,t,n){ut[ft++]=Jt,ut[ft++]=er,ut[ft++]=Lr,Lr=e;var i=Jt;e=er;var d=32-$t(i)-1;i&=~(1<<d),n+=1;var h=32-$t(t)+d;if(30<h){var k=d-d%5;h=(i&(1<<k)-1).toString(32),i>>=k,d-=k,Jt=1<<32-$t(t)+d|n<<d|i,er=h+e}else Jt=1<<h|n<<d|i,er=e}function _i(e){e.return!==null&&(_r(e,1),fa(e,1,0))}function Pi(e){for(;e===Ul;)Ul=tn[--rn],tn[rn]=null,Vl=tn[--rn],tn[rn]=null;for(;e===Lr;)Lr=ut[--ft],ut[ft]=null,er=ut[--ft],ut[ft]=null,Jt=ut[--ft],ut[ft]=null}var it=null,st=null,_e=!1,xt=null;function da(e,t){var n=yt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function pa(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,it=e,st=dr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,it=e,st=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Lr!==null?{id:Jt,overflow:er}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=yt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,it=e,st=null,!0):!1;default:return!1}}function bi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ai(e){if(_e){var t=st;if(t){var n=t;if(!pa(e,t)){if(bi(e))throw Error(l(418));t=dr(n.nextSibling);var i=it;t&&pa(e,t)?da(i,n):(e.flags=e.flags&-4097|2,_e=!1,it=e)}}else{if(bi(e))throw Error(l(418));e.flags=e.flags&-4097|2,_e=!1,it=e}}}function ha(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;it=e}function Hl(e){if(e!==it)return!1;if(!_e)return ha(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ci(e.type,e.memoizedProps)),t&&(t=st)){if(bi(e))throw ya(),Error(l(418));for(;t;)da(e,t),t=dr(t.nextSibling)}if(ha(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){st=dr(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}st=null}}else st=it?dr(e.stateNode.nextSibling):null;return!0}function ya(){for(var e=st;e;)e=dr(e.nextSibling)}function nn(){st=it=null,_e=!1}function Ni(e){xt===null?xt=[e]:xt.push(e)}var Xf=N.ReactCurrentBatchConfig;function Vn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(l(309));var i=n.stateNode}if(!i)throw Error(l(147,e));var d=i,h=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===h?t.ref:(t=function(k){var C=d.refs;k===null?delete C[h]:C[h]=k},t._stringRef=h,t)}if(typeof e!="string")throw Error(l(284));if(!n._owner)throw Error(l(290,e))}return e}function Zl(e,t){throw e=Object.prototype.toString.call(t),Error(l(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function $a(e){var t=e._init;return t(e._payload)}function ka(e){function t(P,Q){if(e){var b=P.deletions;b===null?(P.deletions=[Q],P.flags|=16):b.push(Q)}}function n(P,Q){if(!e)return null;for(;Q!==null;)t(P,Q),Q=Q.sibling;return null}function i(P,Q){for(P=new Map;Q!==null;)Q.key!==null?P.set(Q.key,Q):P.set(Q.index,Q),Q=Q.sibling;return P}function d(P,Q){return P=Mr(P,Q),P.index=0,P.sibling=null,P}function h(P,Q,b){return P.index=b,e?(b=P.alternate,b!==null?(b=b.index,b<Q?(P.flags|=2,Q):b):(P.flags|=2,Q)):(P.flags|=1048576,Q)}function k(P){return e&&P.alternate===null&&(P.flags|=2),P}function C(P,Q,b,X){return Q===null||Q.tag!==6?(Q=Ss(b,P.mode,X),Q.return=P,Q):(Q=d(Q,b),Q.return=P,Q)}function E(P,Q,b,X){var ae=b.type;return ae===V?Z(P,Q,b.props.children,X,b.key):Q!==null&&(Q.elementType===ae||typeof ae=="object"&&ae!==null&&ae.$$typeof===me&&$a(ae)===Q.type)?(X=d(Q,b.props),X.ref=Vn(P,Q,b),X.return=P,X):(X=ko(b.type,b.key,b.props,null,P.mode,X),X.ref=Vn(P,Q,b),X.return=P,X)}function A(P,Q,b,X){return Q===null||Q.tag!==4||Q.stateNode.containerInfo!==b.containerInfo||Q.stateNode.implementation!==b.implementation?(Q=Es(b,P.mode,X),Q.return=P,Q):(Q=d(Q,b.children||[]),Q.return=P,Q)}function Z(P,Q,b,X,ae){return Q===null||Q.tag!==7?(Q=Br(b,P.mode,X,ae),Q.return=P,Q):(Q=d(Q,b),Q.return=P,Q)}function W(P,Q,b){if(typeof Q=="string"&&Q!==""||typeof Q=="number")return Q=Ss(""+Q,P.mode,b),Q.return=P,Q;if(typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case U:return b=ko(Q.type,Q.key,Q.props,null,P.mode,b),b.ref=Vn(P,null,Q),b.return=P,b;case K:return Q=Es(Q,P.mode,b),Q.return=P,Q;case me:var X=Q._init;return W(P,X(Q._payload),b)}if(gn(Q)||te(Q))return Q=Br(Q,P.mode,b,null),Q.return=P,Q;Zl(P,Q)}return null}function H(P,Q,b,X){var ae=Q!==null?Q.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return ae!==null?null:C(P,Q,""+b,X);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case U:return b.key===ae?E(P,Q,b,X):null;case K:return b.key===ae?A(P,Q,b,X):null;case me:return ae=b._init,H(P,Q,ae(b._payload),X)}if(gn(b)||te(b))return ae!==null?null:Z(P,Q,b,X,null);Zl(P,b)}return null}function ee(P,Q,b,X,ae){if(typeof X=="string"&&X!==""||typeof X=="number")return P=P.get(b)||null,C(Q,P,""+X,ae);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case U:return P=P.get(X.key===null?b:X.key)||null,E(Q,P,X,ae);case K:return P=P.get(X.key===null?b:X.key)||null,A(Q,P,X,ae);case me:var de=X._init;return ee(P,Q,b,de(X._payload),ae)}if(gn(X)||te(X))return P=P.get(b)||null,Z(Q,P,X,ae,null);Zl(Q,X)}return null}function oe(P,Q,b,X){for(var ae=null,de=null,pe=Q,ke=Q=0,Oe=null;pe!==null&&ke<b.length;ke++){pe.index>ke?(Oe=pe,pe=null):Oe=pe.sibling;var Se=H(P,pe,b[ke],X);if(Se===null){pe===null&&(pe=Oe);break}e&&pe&&Se.alternate===null&&t(P,pe),Q=h(Se,Q,ke),de===null?ae=Se:de.sibling=Se,de=Se,pe=Oe}if(ke===b.length)return n(P,pe),_e&&_r(P,ke),ae;if(pe===null){for(;ke<b.length;ke++)pe=W(P,b[ke],X),pe!==null&&(Q=h(pe,Q,ke),de===null?ae=pe:de.sibling=pe,de=pe);return _e&&_r(P,ke),ae}for(pe=i(P,pe);ke<b.length;ke++)Oe=ee(pe,P,ke,b[ke],X),Oe!==null&&(e&&Oe.alternate!==null&&pe.delete(Oe.key===null?ke:Oe.key),Q=h(Oe,Q,ke),de===null?ae=Oe:de.sibling=Oe,de=Oe);return e&&pe.forEach(function(Cr){return t(P,Cr)}),_e&&_r(P,ke),ae}function se(P,Q,b,X){var ae=te(b);if(typeof ae!="function")throw Error(l(150));if(b=ae.call(b),b==null)throw Error(l(151));for(var de=ae=null,pe=Q,ke=Q=0,Oe=null,Se=b.next();pe!==null&&!Se.done;ke++,Se=b.next()){pe.index>ke?(Oe=pe,pe=null):Oe=pe.sibling;var Cr=H(P,pe,Se.value,X);if(Cr===null){pe===null&&(pe=Oe);break}e&&pe&&Cr.alternate===null&&t(P,pe),Q=h(Cr,Q,ke),de===null?ae=Cr:de.sibling=Cr,de=Cr,pe=Oe}if(Se.done)return n(P,pe),_e&&_r(P,ke),ae;if(pe===null){for(;!Se.done;ke++,Se=b.next())Se=W(P,Se.value,X),Se!==null&&(Q=h(Se,Q,ke),de===null?ae=Se:de.sibling=Se,de=Se);return _e&&_r(P,ke),ae}for(pe=i(P,pe);!Se.done;ke++,Se=b.next())Se=ee(pe,P,ke,Se.value,X),Se!==null&&(e&&Se.alternate!==null&&pe.delete(Se.key===null?ke:Se.key),Q=h(Se,Q,ke),de===null?ae=Se:de.sibling=Se,de=Se);return e&&pe.forEach(function(_d){return t(P,_d)}),_e&&_r(P,ke),ae}function Te(P,Q,b,X){if(typeof b=="object"&&b!==null&&b.type===V&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case U:e:{for(var ae=b.key,de=Q;de!==null;){if(de.key===ae){if(ae=b.type,ae===V){if(de.tag===7){n(P,de.sibling),Q=d(de,b.props.children),Q.return=P,P=Q;break e}}else if(de.elementType===ae||typeof ae=="object"&&ae!==null&&ae.$$typeof===me&&$a(ae)===de.type){n(P,de.sibling),Q=d(de,b.props),Q.ref=Vn(P,de,b),Q.return=P,P=Q;break e}n(P,de);break}else t(P,de);de=de.sibling}b.type===V?(Q=Br(b.props.children,P.mode,X,b.key),Q.return=P,P=Q):(X=ko(b.type,b.key,b.props,null,P.mode,X),X.ref=Vn(P,Q,b),X.return=P,P=X)}return k(P);case K:e:{for(de=b.key;Q!==null;){if(Q.key===de)if(Q.tag===4&&Q.stateNode.containerInfo===b.containerInfo&&Q.stateNode.implementation===b.implementation){n(P,Q.sibling),Q=d(Q,b.children||[]),Q.return=P,P=Q;break e}else{n(P,Q);break}else t(P,Q);Q=Q.sibling}Q=Es(b,P.mode,X),Q.return=P,P=Q}return k(P);case me:return de=b._init,Te(P,Q,de(b._payload),X)}if(gn(b))return oe(P,Q,b,X);if(te(b))return se(P,Q,b,X);Zl(P,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,Q!==null&&Q.tag===6?(n(P,Q.sibling),Q=d(Q,b),Q.return=P,P=Q):(n(P,Q),Q=Ss(b,P.mode,X),Q.return=P,P=Q),k(P)):n(P,Q)}return Te}var ln=ka(!0),xa=ka(!1),Wl=pr(null),ql=null,on=null,Ii=null;function Ti(){Ii=on=ql=null}function Di(e){var t=Wl.current;Le(Wl),e._currentValue=t}function Bi(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function sn(e,t){ql=e,Ii=on=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(et=!0),e.firstContext=null)}function dt(e){var t=e._currentValue;if(Ii!==e)if(e={context:e,memoizedValue:t,next:null},on===null){if(ql===null)throw Error(l(308));on=e,ql.dependencies={lanes:0,firstContext:e}}else on=on.next=e;return t}var Pr=null;function ji(e){Pr===null?Pr=[e]:Pr.push(e)}function ga(e,t,n,i){var d=t.interleaved;return d===null?(n.next=n,ji(t)):(n.next=d.next,d.next=n),t.interleaved=n,tr(e,i)}function tr(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var $r=!1;function zi(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ma(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function rr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function kr(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(ve&2)!==0){var d=i.pending;return d===null?t.next=t:(t.next=d.next,d.next=t),i.pending=t,tr(e,n)}return d=i.interleaved,d===null?(t.next=t,ji(i)):(t.next=d.next,d.next=t),i.interleaved=t,tr(e,n)}function Yl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,ei(e,n)}}function wa(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var d=null,h=null;if(n=n.firstBaseUpdate,n!==null){do{var k={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};h===null?d=h=k:h=h.next=k,n=n.next}while(n!==null);h===null?d=h=t:h=h.next=t}else d=h=t;n={baseState:i.baseState,firstBaseUpdate:d,lastBaseUpdate:h,shared:i.shared,effects:i.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Gl(e,t,n,i){var d=e.updateQueue;$r=!1;var h=d.firstBaseUpdate,k=d.lastBaseUpdate,C=d.shared.pending;if(C!==null){d.shared.pending=null;var E=C,A=E.next;E.next=null,k===null?h=A:k.next=A,k=E;var Z=e.alternate;Z!==null&&(Z=Z.updateQueue,C=Z.lastBaseUpdate,C!==k&&(C===null?Z.firstBaseUpdate=A:C.next=A,Z.lastBaseUpdate=E))}if(h!==null){var W=d.baseState;k=0,Z=A=E=null,C=h;do{var H=C.lane,ee=C.eventTime;if((i&H)===H){Z!==null&&(Z=Z.next={eventTime:ee,lane:0,tag:C.tag,payload:C.payload,callback:C.callback,next:null});e:{var oe=e,se=C;switch(H=t,ee=n,se.tag){case 1:if(oe=se.payload,typeof oe=="function"){W=oe.call(ee,W,H);break e}W=oe;break e;case 3:oe.flags=oe.flags&-65537|128;case 0:if(oe=se.payload,H=typeof oe=="function"?oe.call(ee,W,H):oe,H==null)break e;W=J({},W,H);break e;case 2:$r=!0}}C.callback!==null&&C.lane!==0&&(e.flags|=64,H=d.effects,H===null?d.effects=[C]:H.push(C))}else ee={eventTime:ee,lane:H,tag:C.tag,payload:C.payload,callback:C.callback,next:null},Z===null?(A=Z=ee,E=W):Z=Z.next=ee,k|=H;if(C=C.next,C===null){if(C=d.shared.pending,C===null)break;H=C,C=H.next,H.next=null,d.lastBaseUpdate=H,d.shared.pending=null}}while(!0);if(Z===null&&(E=W),d.baseState=E,d.firstBaseUpdate=A,d.lastBaseUpdate=Z,t=d.shared.interleaved,t!==null){d=t;do k|=d.lane,d=d.next;while(d!==t)}else h===null&&(d.shared.lanes=0);Nr|=k,e.lanes=k,e.memoizedState=W}}function va(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var i=e[t],d=i.callback;if(d!==null){if(i.callback=null,i=n,typeof d!="function")throw Error(l(191,d));d.call(i)}}}var Hn={},Qt=pr(Hn),Zn=pr(Hn),Wn=pr(Hn);function br(e){if(e===Hn)throw Error(l(174));return e}function Ri(e,t){switch(Qe(Wn,t),Qe(Zn,e),Qe(Qt,Hn),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Oo(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Oo(t,e)}Le(Qt),Qe(Qt,t)}function cn(){Le(Qt),Le(Zn),Le(Wn)}function Ma(e){br(Wn.current);var t=br(Qt.current),n=Oo(t,e.type);t!==n&&(Qe(Zn,e),Qe(Qt,n))}function Oi(e){Zn.current===e&&(Le(Qt),Le(Zn))}var Pe=pr(0);function Xl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ui=[];function Vi(){for(var e=0;e<Ui.length;e++)Ui[e]._workInProgressVersionPrimary=null;Ui.length=0}var Kl=N.ReactCurrentDispatcher,Hi=N.ReactCurrentBatchConfig,Ar=0,be=null,Be=null,ze=null,Jl=!1,qn=!1,Yn=0,Kf=0;function Ze(){throw Error(l(321))}function Zi(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!kt(e[n],t[n]))return!1;return!0}function Wi(e,t,n,i,d,h){if(Ar=h,be=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Kl.current=e===null||e.memoizedState===null?rd:nd,e=n(i,d),qn){h=0;do{if(qn=!1,Yn=0,25<=h)throw Error(l(301));h+=1,ze=Be=null,t.updateQueue=null,Kl.current=ld,e=n(i,d)}while(qn)}if(Kl.current=ro,t=Be!==null&&Be.next!==null,Ar=0,ze=Be=be=null,Jl=!1,t)throw Error(l(300));return e}function qi(){var e=Yn!==0;return Yn=0,e}function Ft(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ze===null?be.memoizedState=ze=e:ze=ze.next=e,ze}function pt(){if(Be===null){var e=be.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=ze===null?be.memoizedState:ze.next;if(t!==null)ze=t,Be=e;else{if(e===null)throw Error(l(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},ze===null?be.memoizedState=ze=e:ze=ze.next=e}return ze}function Gn(e,t){return typeof t=="function"?t(e):t}function Yi(e){var t=pt(),n=t.queue;if(n===null)throw Error(l(311));n.lastRenderedReducer=e;var i=Be,d=i.baseQueue,h=n.pending;if(h!==null){if(d!==null){var k=d.next;d.next=h.next,h.next=k}i.baseQueue=d=h,n.pending=null}if(d!==null){h=d.next,i=i.baseState;var C=k=null,E=null,A=h;do{var Z=A.lane;if((Ar&Z)===Z)E!==null&&(E=E.next={lane:0,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),i=A.hasEagerState?A.eagerState:e(i,A.action);else{var W={lane:Z,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null};E===null?(C=E=W,k=i):E=E.next=W,be.lanes|=Z,Nr|=Z}A=A.next}while(A!==null&&A!==h);E===null?k=i:E.next=C,kt(i,t.memoizedState)||(et=!0),t.memoizedState=i,t.baseState=k,t.baseQueue=E,n.lastRenderedState=i}if(e=n.interleaved,e!==null){d=e;do h=d.lane,be.lanes|=h,Nr|=h,d=d.next;while(d!==e)}else d===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Gi(e){var t=pt(),n=t.queue;if(n===null)throw Error(l(311));n.lastRenderedReducer=e;var i=n.dispatch,d=n.pending,h=t.memoizedState;if(d!==null){n.pending=null;var k=d=d.next;do h=e(h,k.action),k=k.next;while(k!==d);kt(h,t.memoizedState)||(et=!0),t.memoizedState=h,t.baseQueue===null&&(t.baseState=h),n.lastRenderedState=h}return[h,i]}function Ca(){}function Sa(e,t){var n=be,i=pt(),d=t(),h=!kt(i.memoizedState,d);if(h&&(i.memoizedState=d,et=!0),i=i.queue,Xi(Fa.bind(null,n,i,e),[e]),i.getSnapshot!==t||h||ze!==null&&ze.memoizedState.tag&1){if(n.flags|=2048,Xn(9,Qa.bind(null,n,i,d,t),void 0,null),Re===null)throw Error(l(349));(Ar&30)!==0||Ea(n,t,d)}return d}function Ea(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=be.updateQueue,t===null?(t={lastEffect:null,stores:null},be.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Qa(e,t,n,i){t.value=n,t.getSnapshot=i,La(t)&&_a(e)}function Fa(e,t,n){return n(function(){La(t)&&_a(e)})}function La(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!kt(e,n)}catch{return!0}}function _a(e){var t=tr(e,1);t!==null&&vt(t,e,1,-1)}function Pa(e){var t=Ft();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Gn,lastRenderedState:e},t.queue=e,e=e.dispatch=td.bind(null,be,e),[t.memoizedState,e]}function Xn(e,t,n,i){return e={tag:e,create:t,destroy:n,deps:i,next:null},t=be.updateQueue,t===null?(t={lastEffect:null,stores:null},be.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e)),e}function ba(){return pt().memoizedState}function eo(e,t,n,i){var d=Ft();be.flags|=e,d.memoizedState=Xn(1|t,n,void 0,i===void 0?null:i)}function to(e,t,n,i){var d=pt();i=i===void 0?null:i;var h=void 0;if(Be!==null){var k=Be.memoizedState;if(h=k.destroy,i!==null&&Zi(i,k.deps)){d.memoizedState=Xn(t,n,h,i);return}}be.flags|=e,d.memoizedState=Xn(1|t,n,h,i)}function Aa(e,t){return eo(8390656,8,e,t)}function Xi(e,t){return to(2048,8,e,t)}function Na(e,t){return to(4,2,e,t)}function Ia(e,t){return to(4,4,e,t)}function Ta(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Da(e,t,n){return n=n!=null?n.concat([e]):null,to(4,4,Ta.bind(null,t,e),n)}function Ki(){}function Ba(e,t){var n=pt();t=t===void 0?null:t;var i=n.memoizedState;return i!==null&&t!==null&&Zi(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function ja(e,t){var n=pt();t=t===void 0?null:t;var i=n.memoizedState;return i!==null&&t!==null&&Zi(t,i[1])?i[0]:(e=e(),n.memoizedState=[e,t],e)}function za(e,t,n){return(Ar&21)===0?(e.baseState&&(e.baseState=!1,et=!0),e.memoizedState=n):(kt(n,t)||(n=$c(),be.lanes|=n,Nr|=n,e.baseState=!0),t)}function Jf(e,t){var n=Ee;Ee=n!==0&&4>n?n:4,e(!0);var i=Hi.transition;Hi.transition={};try{e(!1),t()}finally{Ee=n,Hi.transition=i}}function Ra(){return pt().memoizedState}function ed(e,t,n){var i=wr(e);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Oa(e))Ua(t,n);else if(n=ga(e,t,n,i),n!==null){var d=Ge();vt(n,e,i,d),Va(n,t,i)}}function td(e,t,n){var i=wr(e),d={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Oa(e))Ua(t,d);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=t.lastRenderedReducer,h!==null))try{var k=t.lastRenderedState,C=h(k,n);if(d.hasEagerState=!0,d.eagerState=C,kt(C,k)){var E=t.interleaved;E===null?(d.next=d,ji(t)):(d.next=E.next,E.next=d),t.interleaved=d;return}}catch{}finally{}n=ga(e,t,d,i),n!==null&&(d=Ge(),vt(n,e,i,d),Va(n,t,i))}}function Oa(e){var t=e.alternate;return e===be||t!==null&&t===be}function Ua(e,t){qn=Jl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Va(e,t,n){if((n&4194240)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,ei(e,n)}}var ro={readContext:dt,useCallback:Ze,useContext:Ze,useEffect:Ze,useImperativeHandle:Ze,useInsertionEffect:Ze,useLayoutEffect:Ze,useMemo:Ze,useReducer:Ze,useRef:Ze,useState:Ze,useDebugValue:Ze,useDeferredValue:Ze,useTransition:Ze,useMutableSource:Ze,useSyncExternalStore:Ze,useId:Ze,unstable_isNewReconciler:!1},rd={readContext:dt,useCallback:function(e,t){return Ft().memoizedState=[e,t===void 0?null:t],e},useContext:dt,useEffect:Aa,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,eo(4194308,4,Ta.bind(null,t,e),n)},useLayoutEffect:function(e,t){return eo(4194308,4,e,t)},useInsertionEffect:function(e,t){return eo(4,2,e,t)},useMemo:function(e,t){var n=Ft();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var i=Ft();return t=n!==void 0?n(t):t,i.memoizedState=i.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},i.queue=e,e=e.dispatch=ed.bind(null,be,e),[i.memoizedState,e]},useRef:function(e){var t=Ft();return e={current:e},t.memoizedState=e},useState:Pa,useDebugValue:Ki,useDeferredValue:function(e){return Ft().memoizedState=e},useTransition:function(){var e=Pa(!1),t=e[0];return e=Jf.bind(null,e[1]),Ft().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var i=be,d=Ft();if(_e){if(n===void 0)throw Error(l(407));n=n()}else{if(n=t(),Re===null)throw Error(l(349));(Ar&30)!==0||Ea(i,t,n)}d.memoizedState=n;var h={value:n,getSnapshot:t};return d.queue=h,Aa(Fa.bind(null,i,h,e),[e]),i.flags|=2048,Xn(9,Qa.bind(null,i,h,n,t),void 0,null),n},useId:function(){var e=Ft(),t=Re.identifierPrefix;if(_e){var n=er,i=Jt;n=(i&~(1<<32-$t(i)-1)).toString(32)+n,t=":"+t+"R"+n,n=Yn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Kf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},nd={readContext:dt,useCallback:Ba,useContext:dt,useEffect:Xi,useImperativeHandle:Da,useInsertionEffect:Na,useLayoutEffect:Ia,useMemo:ja,useReducer:Yi,useRef:ba,useState:function(){return Yi(Gn)},useDebugValue:Ki,useDeferredValue:function(e){var t=pt();return za(t,Be.memoizedState,e)},useTransition:function(){var e=Yi(Gn)[0],t=pt().memoizedState;return[e,t]},useMutableSource:Ca,useSyncExternalStore:Sa,useId:Ra,unstable_isNewReconciler:!1},ld={readContext:dt,useCallback:Ba,useContext:dt,useEffect:Xi,useImperativeHandle:Da,useInsertionEffect:Na,useLayoutEffect:Ia,useMemo:ja,useReducer:Gi,useRef:ba,useState:function(){return Gi(Gn)},useDebugValue:Ki,useDeferredValue:function(e){var t=pt();return Be===null?t.memoizedState=e:za(t,Be.memoizedState,e)},useTransition:function(){var e=Gi(Gn)[0],t=pt().memoizedState;return[e,t]},useMutableSource:Ca,useSyncExternalStore:Sa,useId:Ra,unstable_isNewReconciler:!1};function gt(e,t){if(e&&e.defaultProps){t=J({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ji(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:J({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var no={isMounted:function(e){return(e=e._reactInternals)?Er(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var i=Ge(),d=wr(e),h=rr(i,d);h.payload=t,n!=null&&(h.callback=n),t=kr(e,h,d),t!==null&&(vt(t,e,d,i),Yl(t,e,d))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=Ge(),d=wr(e),h=rr(i,d);h.tag=1,h.payload=t,n!=null&&(h.callback=n),t=kr(e,h,d),t!==null&&(vt(t,e,d,i),Yl(t,e,d))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ge(),i=wr(e),d=rr(n,i);d.tag=2,t!=null&&(d.callback=t),t=kr(e,d,i),t!==null&&(vt(t,e,i,n),Yl(t,e,i))}};function Ha(e,t,n,i,d,h,k){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,h,k):t.prototype&&t.prototype.isPureReactComponent?!Dn(n,i)||!Dn(d,h):!0}function Za(e,t,n){var i=!1,d=hr,h=t.contextType;return typeof h=="object"&&h!==null?h=dt(h):(d=Je(t)?Fr:He.current,i=t.contextTypes,h=(i=i!=null)?en(e,d):hr),t=new t(n,h),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=no,e.stateNode=t,t._reactInternals=e,i&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=d,e.__reactInternalMemoizedMaskedChildContext=h),t}function Wa(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&no.enqueueReplaceState(t,t.state,null)}function es(e,t,n,i){var d=e.stateNode;d.props=n,d.state=e.memoizedState,d.refs={},zi(e);var h=t.contextType;typeof h=="object"&&h!==null?d.context=dt(h):(h=Je(t)?Fr:He.current,d.context=en(e,h)),d.state=e.memoizedState,h=t.getDerivedStateFromProps,typeof h=="function"&&(Ji(e,t,h,n),d.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(t=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),t!==d.state&&no.enqueueReplaceState(d,d.state,null),Gl(e,n,d,i),d.state=e.memoizedState),typeof d.componentDidMount=="function"&&(e.flags|=4194308)}function an(e,t){try{var n="",i=t;do n+=he(i),i=i.return;while(i);var d=n}catch(h){d=`
Error generating stack: `+h.message+`
`+h.stack}return{value:e,source:t,stack:d,digest:null}}function ts(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function rs(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var od=typeof WeakMap=="function"?WeakMap:Map;function qa(e,t,n){n=rr(-1,n),n.tag=3,n.payload={element:null};var i=t.value;return n.callback=function(){uo||(uo=!0,ks=i),rs(e,t)},n}function Ya(e,t,n){n=rr(-1,n),n.tag=3;var i=e.type.getDerivedStateFromError;if(typeof i=="function"){var d=t.value;n.payload=function(){return i(d)},n.callback=function(){rs(e,t)}}var h=e.stateNode;return h!==null&&typeof h.componentDidCatch=="function"&&(n.callback=function(){rs(e,t),typeof i!="function"&&(gr===null?gr=new Set([this]):gr.add(this));var k=t.stack;this.componentDidCatch(t.value,{componentStack:k!==null?k:""})}),n}function Ga(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new od;var d=new Set;i.set(t,d)}else d=i.get(t),d===void 0&&(d=new Set,i.set(t,d));d.has(n)||(d.add(n),e=gd.bind(null,e,t,n),t.then(e,e))}function Xa(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ka(e,t,n,i,d){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=rr(-1,1),t.tag=2,kr(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=d,e)}var id=N.ReactCurrentOwner,et=!1;function Ye(e,t,n,i){t.child=e===null?xa(t,null,n,i):ln(t,e.child,n,i)}function Ja(e,t,n,i,d){n=n.render;var h=t.ref;return sn(t,d),i=Wi(e,t,n,i,h,d),n=qi(),e!==null&&!et?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~d,nr(e,t,d)):(_e&&n&&_i(t),t.flags|=1,Ye(e,t,i,d),t.child)}function eu(e,t,n,i,d){if(e===null){var h=n.type;return typeof h=="function"&&!Cs(h)&&h.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=h,tu(e,t,h,i,d)):(e=ko(n.type,null,i,t,t.mode,d),e.ref=t.ref,e.return=t,t.child=e)}if(h=e.child,(e.lanes&d)===0){var k=h.memoizedProps;if(n=n.compare,n=n!==null?n:Dn,n(k,i)&&e.ref===t.ref)return nr(e,t,d)}return t.flags|=1,e=Mr(h,i),e.ref=t.ref,e.return=t,t.child=e}function tu(e,t,n,i,d){if(e!==null){var h=e.memoizedProps;if(Dn(h,i)&&e.ref===t.ref)if(et=!1,t.pendingProps=i=h,(e.lanes&d)!==0)(e.flags&131072)!==0&&(et=!0);else return t.lanes=e.lanes,nr(e,t,d)}return ns(e,t,n,i,d)}function ru(e,t,n){var i=t.pendingProps,d=i.children,h=e!==null?e.memoizedState:null;if(i.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Qe(fn,ct),ct|=n;else{if((n&1073741824)===0)return e=h!==null?h.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Qe(fn,ct),ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=h!==null?h.baseLanes:n,Qe(fn,ct),ct|=i}else h!==null?(i=h.baseLanes|n,t.memoizedState=null):i=n,Qe(fn,ct),ct|=i;return Ye(e,t,d,n),t.child}function nu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ns(e,t,n,i,d){var h=Je(n)?Fr:He.current;return h=en(t,h),sn(t,d),n=Wi(e,t,n,i,h,d),i=qi(),e!==null&&!et?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~d,nr(e,t,d)):(_e&&i&&_i(t),t.flags|=1,Ye(e,t,n,d),t.child)}function lu(e,t,n,i,d){if(Je(n)){var h=!0;Rl(t)}else h=!1;if(sn(t,d),t.stateNode===null)oo(e,t),Za(t,n,i),es(t,n,i,d),i=!0;else if(e===null){var k=t.stateNode,C=t.memoizedProps;k.props=C;var E=k.context,A=n.contextType;typeof A=="object"&&A!==null?A=dt(A):(A=Je(n)?Fr:He.current,A=en(t,A));var Z=n.getDerivedStateFromProps,W=typeof Z=="function"||typeof k.getSnapshotBeforeUpdate=="function";W||typeof k.UNSAFE_componentWillReceiveProps!="function"&&typeof k.componentWillReceiveProps!="function"||(C!==i||E!==A)&&Wa(t,k,i,A),$r=!1;var H=t.memoizedState;k.state=H,Gl(t,i,k,d),E=t.memoizedState,C!==i||H!==E||Ke.current||$r?(typeof Z=="function"&&(Ji(t,n,Z,i),E=t.memoizedState),(C=$r||Ha(t,n,C,i,H,E,A))?(W||typeof k.UNSAFE_componentWillMount!="function"&&typeof k.componentWillMount!="function"||(typeof k.componentWillMount=="function"&&k.componentWillMount(),typeof k.UNSAFE_componentWillMount=="function"&&k.UNSAFE_componentWillMount()),typeof k.componentDidMount=="function"&&(t.flags|=4194308)):(typeof k.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=E),k.props=i,k.state=E,k.context=A,i=C):(typeof k.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{k=t.stateNode,ma(e,t),C=t.memoizedProps,A=t.type===t.elementType?C:gt(t.type,C),k.props=A,W=t.pendingProps,H=k.context,E=n.contextType,typeof E=="object"&&E!==null?E=dt(E):(E=Je(n)?Fr:He.current,E=en(t,E));var ee=n.getDerivedStateFromProps;(Z=typeof ee=="function"||typeof k.getSnapshotBeforeUpdate=="function")||typeof k.UNSAFE_componentWillReceiveProps!="function"&&typeof k.componentWillReceiveProps!="function"||(C!==W||H!==E)&&Wa(t,k,i,E),$r=!1,H=t.memoizedState,k.state=H,Gl(t,i,k,d);var oe=t.memoizedState;C!==W||H!==oe||Ke.current||$r?(typeof ee=="function"&&(Ji(t,n,ee,i),oe=t.memoizedState),(A=$r||Ha(t,n,A,i,H,oe,E)||!1)?(Z||typeof k.UNSAFE_componentWillUpdate!="function"&&typeof k.componentWillUpdate!="function"||(typeof k.componentWillUpdate=="function"&&k.componentWillUpdate(i,oe,E),typeof k.UNSAFE_componentWillUpdate=="function"&&k.UNSAFE_componentWillUpdate(i,oe,E)),typeof k.componentDidUpdate=="function"&&(t.flags|=4),typeof k.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof k.componentDidUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof k.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=oe),k.props=i,k.state=oe,k.context=E,i=A):(typeof k.componentDidUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof k.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),i=!1)}return ls(e,t,n,i,h,d)}function ls(e,t,n,i,d,h){nu(e,t);var k=(t.flags&128)!==0;if(!i&&!k)return d&&aa(t,n,!1),nr(e,t,h);i=t.stateNode,id.current=t;var C=k&&typeof n.getDerivedStateFromError!="function"?null:i.render();return t.flags|=1,e!==null&&k?(t.child=ln(t,e.child,null,h),t.child=ln(t,null,C,h)):Ye(e,t,C,h),t.memoizedState=i.state,d&&aa(t,n,!0),t.child}function ou(e){var t=e.stateNode;t.pendingContext?sa(e,t.pendingContext,t.pendingContext!==t.context):t.context&&sa(e,t.context,!1),Ri(e,t.containerInfo)}function iu(e,t,n,i,d){return nn(),Ni(d),t.flags|=256,Ye(e,t,n,i),t.child}var os={dehydrated:null,treeContext:null,retryLane:0};function is(e){return{baseLanes:e,cachePool:null,transitions:null}}function su(e,t,n){var i=t.pendingProps,d=Pe.current,h=!1,k=(t.flags&128)!==0,C;if((C=k)||(C=e!==null&&e.memoizedState===null?!1:(d&2)!==0),C?(h=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(d|=1),Qe(Pe,d&1),e===null)return Ai(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(k=i.children,e=i.fallback,h?(i=t.mode,h=t.child,k={mode:"hidden",children:k},(i&1)===0&&h!==null?(h.childLanes=0,h.pendingProps=k):h=xo(k,i,0,null),e=Br(e,i,n,null),h.return=t,e.return=t,h.sibling=e,t.child=h,t.child.memoizedState=is(n),t.memoizedState=os,e):ss(t,k));if(d=e.memoizedState,d!==null&&(C=d.dehydrated,C!==null))return sd(e,t,k,i,C,d,n);if(h){h=i.fallback,k=t.mode,d=e.child,C=d.sibling;var E={mode:"hidden",children:i.children};return(k&1)===0&&t.child!==d?(i=t.child,i.childLanes=0,i.pendingProps=E,t.deletions=null):(i=Mr(d,E),i.subtreeFlags=d.subtreeFlags&14680064),C!==null?h=Mr(C,h):(h=Br(h,k,n,null),h.flags|=2),h.return=t,i.return=t,i.sibling=h,t.child=i,i=h,h=t.child,k=e.child.memoizedState,k=k===null?is(n):{baseLanes:k.baseLanes|n,cachePool:null,transitions:k.transitions},h.memoizedState=k,h.childLanes=e.childLanes&~n,t.memoizedState=os,i}return h=e.child,e=h.sibling,i=Mr(h,{mode:"visible",children:i.children}),(t.mode&1)===0&&(i.lanes=n),i.return=t,i.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=i,t.memoizedState=null,i}function ss(e,t){return t=xo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function lo(e,t,n,i){return i!==null&&Ni(i),ln(t,e.child,null,n),e=ss(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function sd(e,t,n,i,d,h,k){if(n)return t.flags&256?(t.flags&=-257,i=ts(Error(l(422))),lo(e,t,k,i)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(h=i.fallback,d=t.mode,i=xo({mode:"visible",children:i.children},d,0,null),h=Br(h,d,k,null),h.flags|=2,i.return=t,h.return=t,i.sibling=h,t.child=i,(t.mode&1)!==0&&ln(t,e.child,null,k),t.child.memoizedState=is(k),t.memoizedState=os,h);if((t.mode&1)===0)return lo(e,t,k,null);if(d.data==="$!"){if(i=d.nextSibling&&d.nextSibling.dataset,i)var C=i.dgst;return i=C,h=Error(l(419)),i=ts(h,i,void 0),lo(e,t,k,i)}if(C=(k&e.childLanes)!==0,et||C){if(i=Re,i!==null){switch(k&-k){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(i.suspendedLanes|k))!==0?0:d,d!==0&&d!==h.retryLane&&(h.retryLane=d,tr(e,d),vt(i,e,d,-1))}return Ms(),i=ts(Error(l(421))),lo(e,t,k,i)}return d.data==="$?"?(t.flags|=128,t.child=e.child,t=md.bind(null,e),d._reactRetry=t,null):(e=h.treeContext,st=dr(d.nextSibling),it=t,_e=!0,xt=null,e!==null&&(ut[ft++]=Jt,ut[ft++]=er,ut[ft++]=Lr,Jt=e.id,er=e.overflow,Lr=t),t=ss(t,i.children),t.flags|=4096,t)}function cu(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),Bi(e.return,t,n)}function cs(e,t,n,i,d){var h=e.memoizedState;h===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:d}:(h.isBackwards=t,h.rendering=null,h.renderingStartTime=0,h.last=i,h.tail=n,h.tailMode=d)}function au(e,t,n){var i=t.pendingProps,d=i.revealOrder,h=i.tail;if(Ye(e,t,i.children,n),i=Pe.current,(i&2)!==0)i=i&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&cu(e,n,t);else if(e.tag===19)cu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}i&=1}if(Qe(Pe,i),(t.mode&1)===0)t.memoizedState=null;else switch(d){case"forwards":for(n=t.child,d=null;n!==null;)e=n.alternate,e!==null&&Xl(e)===null&&(d=n),n=n.sibling;n=d,n===null?(d=t.child,t.child=null):(d=n.sibling,n.sibling=null),cs(t,!1,d,n,h);break;case"backwards":for(n=null,d=t.child,t.child=null;d!==null;){if(e=d.alternate,e!==null&&Xl(e)===null){t.child=d;break}e=d.sibling,d.sibling=n,n=d,d=e}cs(t,!0,n,null,h);break;case"together":cs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function oo(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function nr(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Nr|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(l(153));if(t.child!==null){for(e=t.child,n=Mr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Mr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function cd(e,t,n){switch(t.tag){case 3:ou(t),nn();break;case 5:Ma(t);break;case 1:Je(t.type)&&Rl(t);break;case 4:Ri(t,t.stateNode.containerInfo);break;case 10:var i=t.type._context,d=t.memoizedProps.value;Qe(Wl,i._currentValue),i._currentValue=d;break;case 13:if(i=t.memoizedState,i!==null)return i.dehydrated!==null?(Qe(Pe,Pe.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?su(e,t,n):(Qe(Pe,Pe.current&1),e=nr(e,t,n),e!==null?e.sibling:null);Qe(Pe,Pe.current&1);break;case 19:if(i=(n&t.childLanes)!==0,(e.flags&128)!==0){if(i)return au(e,t,n);t.flags|=128}if(d=t.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Qe(Pe,Pe.current),i)break;return null;case 22:case 23:return t.lanes=0,ru(e,t,n)}return nr(e,t,n)}var uu,as,fu,du;uu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},as=function(){},fu=function(e,t,n,i){var d=e.memoizedProps;if(d!==i){e=t.stateNode,br(Qt.current);var h=null;switch(n){case"input":d=Bo(e,d),i=Bo(e,i),h=[];break;case"select":d=J({},d,{value:void 0}),i=J({},i,{value:void 0}),h=[];break;case"textarea":d=Ro(e,d),i=Ro(e,i),h=[];break;default:typeof d.onClick!="function"&&typeof i.onClick=="function"&&(e.onclick=Bl)}Uo(n,i);var k;n=null;for(A in d)if(!i.hasOwnProperty(A)&&d.hasOwnProperty(A)&&d[A]!=null)if(A==="style"){var C=d[A];for(k in C)C.hasOwnProperty(k)&&(n||(n={}),n[k]="")}else A!=="dangerouslySetInnerHTML"&&A!=="children"&&A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&A!=="autoFocus"&&(s.hasOwnProperty(A)?h||(h=[]):(h=h||[]).push(A,null));for(A in i){var E=i[A];if(C=d!=null?d[A]:void 0,i.hasOwnProperty(A)&&E!==C&&(E!=null||C!=null))if(A==="style")if(C){for(k in C)!C.hasOwnProperty(k)||E&&E.hasOwnProperty(k)||(n||(n={}),n[k]="");for(k in E)E.hasOwnProperty(k)&&C[k]!==E[k]&&(n||(n={}),n[k]=E[k])}else n||(h||(h=[]),h.push(A,n)),n=E;else A==="dangerouslySetInnerHTML"?(E=E?E.__html:void 0,C=C?C.__html:void 0,E!=null&&C!==E&&(h=h||[]).push(A,E)):A==="children"?typeof E!="string"&&typeof E!="number"||(h=h||[]).push(A,""+E):A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&(s.hasOwnProperty(A)?(E!=null&&A==="onScroll"&&Fe("scroll",e),h||C===E||(h=[])):(h=h||[]).push(A,E))}n&&(h=h||[]).push("style",n);var A=h;(t.updateQueue=A)&&(t.flags|=4)}},du=function(e,t,n,i){n!==i&&(t.flags|=4)};function Kn(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function We(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var d=e.child;d!==null;)n|=d.lanes|d.childLanes,i|=d.subtreeFlags&14680064,i|=d.flags&14680064,d.return=e,d=d.sibling;else for(d=e.child;d!==null;)n|=d.lanes|d.childLanes,i|=d.subtreeFlags,i|=d.flags,d.return=e,d=d.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function ad(e,t,n){var i=t.pendingProps;switch(Pi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(t),null;case 1:return Je(t.type)&&zl(),We(t),null;case 3:return i=t.stateNode,cn(),Le(Ke),Le(He),Vi(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(e===null||e.child===null)&&(Hl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,xt!==null&&(ms(xt),xt=null))),as(e,t),We(t),null;case 5:Oi(t);var d=br(Wn.current);if(n=t.type,e!==null&&t.stateNode!=null)fu(e,t,n,i,d),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!i){if(t.stateNode===null)throw Error(l(166));return We(t),null}if(e=br(Qt.current),Hl(t)){i=t.stateNode,n=t.type;var h=t.memoizedProps;switch(i[Et]=t,i[On]=h,e=(t.mode&1)!==0,n){case"dialog":Fe("cancel",i),Fe("close",i);break;case"iframe":case"object":case"embed":Fe("load",i);break;case"video":case"audio":for(d=0;d<jn.length;d++)Fe(jn[d],i);break;case"source":Fe("error",i);break;case"img":case"image":case"link":Fe("error",i),Fe("load",i);break;case"details":Fe("toggle",i);break;case"input":Zs(i,h),Fe("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!h.multiple},Fe("invalid",i);break;case"textarea":Ys(i,h),Fe("invalid",i)}Uo(n,h),d=null;for(var k in h)if(h.hasOwnProperty(k)){var C=h[k];k==="children"?typeof C=="string"?i.textContent!==C&&(h.suppressHydrationWarning!==!0&&Dl(i.textContent,C,e),d=["children",C]):typeof C=="number"&&i.textContent!==""+C&&(h.suppressHydrationWarning!==!0&&Dl(i.textContent,C,e),d=["children",""+C]):s.hasOwnProperty(k)&&C!=null&&k==="onScroll"&&Fe("scroll",i)}switch(n){case"input":Ne(i),qs(i,h,!0);break;case"textarea":Ne(i),Xs(i);break;case"select":case"option":break;default:typeof h.onClick=="function"&&(i.onclick=Bl)}i=d,t.updateQueue=i,i!==null&&(t.flags|=4)}else{k=d.nodeType===9?d:d.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ks(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=k.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof i.is=="string"?e=k.createElement(n,{is:i.is}):(e=k.createElement(n),n==="select"&&(k=e,i.multiple?k.multiple=!0:i.size&&(k.size=i.size))):e=k.createElementNS(e,n),e[Et]=t,e[On]=i,uu(e,t,!1,!1),t.stateNode=e;e:{switch(k=Vo(n,i),n){case"dialog":Fe("cancel",e),Fe("close",e),d=i;break;case"iframe":case"object":case"embed":Fe("load",e),d=i;break;case"video":case"audio":for(d=0;d<jn.length;d++)Fe(jn[d],e);d=i;break;case"source":Fe("error",e),d=i;break;case"img":case"image":case"link":Fe("error",e),Fe("load",e),d=i;break;case"details":Fe("toggle",e),d=i;break;case"input":Zs(e,i),d=Bo(e,i),Fe("invalid",e);break;case"option":d=i;break;case"select":e._wrapperState={wasMultiple:!!i.multiple},d=J({},i,{value:void 0}),Fe("invalid",e);break;case"textarea":Ys(e,i),d=Ro(e,i),Fe("invalid",e);break;default:d=i}Uo(n,d),C=d;for(h in C)if(C.hasOwnProperty(h)){var E=C[h];h==="style"?tc(e,E):h==="dangerouslySetInnerHTML"?(E=E?E.__html:void 0,E!=null&&Js(e,E)):h==="children"?typeof E=="string"?(n!=="textarea"||E!=="")&&mn(e,E):typeof E=="number"&&mn(e,""+E):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(s.hasOwnProperty(h)?E!=null&&h==="onScroll"&&Fe("scroll",e):E!=null&&T(e,h,E,k))}switch(n){case"input":Ne(e),qs(e,i,!1);break;case"textarea":Ne(e),Xs(e);break;case"option":i.value!=null&&e.setAttribute("value",""+le(i.value));break;case"select":e.multiple=!!i.multiple,h=i.value,h!=null?Or(e,!!i.multiple,h,!1):i.defaultValue!=null&&Or(e,!!i.multiple,i.defaultValue,!0);break;default:typeof d.onClick=="function"&&(e.onclick=Bl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return We(t),null;case 6:if(e&&t.stateNode!=null)du(e,t,e.memoizedProps,i);else{if(typeof i!="string"&&t.stateNode===null)throw Error(l(166));if(n=br(Wn.current),br(Qt.current),Hl(t)){if(i=t.stateNode,n=t.memoizedProps,i[Et]=t,(h=i.nodeValue!==n)&&(e=it,e!==null))switch(e.tag){case 3:Dl(i.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Dl(i.nodeValue,n,(e.mode&1)!==0)}h&&(t.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Et]=t,t.stateNode=i}return We(t),null;case 13:if(Le(Pe),i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&st!==null&&(t.mode&1)!==0&&(t.flags&128)===0)ya(),nn(),t.flags|=98560,h=!1;else if(h=Hl(t),i!==null&&i.dehydrated!==null){if(e===null){if(!h)throw Error(l(318));if(h=t.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(l(317));h[Et]=t}else nn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;We(t),h=!1}else xt!==null&&(ms(xt),xt=null),h=!0;if(!h)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(i=i!==null,i!==(e!==null&&e.memoizedState!==null)&&i&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Pe.current&1)!==0?je===0&&(je=3):Ms())),t.updateQueue!==null&&(t.flags|=4),We(t),null);case 4:return cn(),as(e,t),e===null&&zn(t.stateNode.containerInfo),We(t),null;case 10:return Di(t.type._context),We(t),null;case 17:return Je(t.type)&&zl(),We(t),null;case 19:if(Le(Pe),h=t.memoizedState,h===null)return We(t),null;if(i=(t.flags&128)!==0,k=h.rendering,k===null)if(i)Kn(h,!1);else{if(je!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(k=Xl(e),k!==null){for(t.flags|=128,Kn(h,!1),i=k.updateQueue,i!==null&&(t.updateQueue=i,t.flags|=4),t.subtreeFlags=0,i=n,n=t.child;n!==null;)h=n,e=i,h.flags&=14680066,k=h.alternate,k===null?(h.childLanes=0,h.lanes=e,h.child=null,h.subtreeFlags=0,h.memoizedProps=null,h.memoizedState=null,h.updateQueue=null,h.dependencies=null,h.stateNode=null):(h.childLanes=k.childLanes,h.lanes=k.lanes,h.child=k.child,h.subtreeFlags=0,h.deletions=null,h.memoizedProps=k.memoizedProps,h.memoizedState=k.memoizedState,h.updateQueue=k.updateQueue,h.type=k.type,e=k.dependencies,h.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Qe(Pe,Pe.current&1|2),t.child}e=e.sibling}h.tail!==null&&Ie()>dn&&(t.flags|=128,i=!0,Kn(h,!1),t.lanes=4194304)}else{if(!i)if(e=Xl(k),e!==null){if(t.flags|=128,i=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Kn(h,!0),h.tail===null&&h.tailMode==="hidden"&&!k.alternate&&!_e)return We(t),null}else 2*Ie()-h.renderingStartTime>dn&&n!==1073741824&&(t.flags|=128,i=!0,Kn(h,!1),t.lanes=4194304);h.isBackwards?(k.sibling=t.child,t.child=k):(n=h.last,n!==null?n.sibling=k:t.child=k,h.last=k)}return h.tail!==null?(t=h.tail,h.rendering=t,h.tail=t.sibling,h.renderingStartTime=Ie(),t.sibling=null,n=Pe.current,Qe(Pe,i?n&1|2:n&1),t):(We(t),null);case 22:case 23:return vs(),i=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==i&&(t.flags|=8192),i&&(t.mode&1)!==0?(ct&1073741824)!==0&&(We(t),t.subtreeFlags&6&&(t.flags|=8192)):We(t),null;case 24:return null;case 25:return null}throw Error(l(156,t.tag))}function ud(e,t){switch(Pi(t),t.tag){case 1:return Je(t.type)&&zl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return cn(),Le(Ke),Le(He),Vi(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Oi(t),null;case 13:if(Le(Pe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(l(340));nn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Le(Pe),null;case 4:return cn(),null;case 10:return Di(t.type._context),null;case 22:case 23:return vs(),null;case 24:return null;default:return null}}var io=!1,qe=!1,fd=typeof WeakSet=="function"?WeakSet:Set,ne=null;function un(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Ae(e,t,i)}else n.current=null}function us(e,t,n){try{n()}catch(i){Ae(e,t,i)}}var pu=!1;function dd(e,t){if(vi=El,e=Hc(),hi(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var d=i.anchorOffset,h=i.focusNode;i=i.focusOffset;try{n.nodeType,h.nodeType}catch{n=null;break e}var k=0,C=-1,E=-1,A=0,Z=0,W=e,H=null;t:for(;;){for(var ee;W!==n||d!==0&&W.nodeType!==3||(C=k+d),W!==h||i!==0&&W.nodeType!==3||(E=k+i),W.nodeType===3&&(k+=W.nodeValue.length),(ee=W.firstChild)!==null;)H=W,W=ee;for(;;){if(W===e)break t;if(H===n&&++A===d&&(C=k),H===h&&++Z===i&&(E=k),(ee=W.nextSibling)!==null)break;W=H,H=W.parentNode}W=ee}n=C===-1||E===-1?null:{start:C,end:E}}else n=null}n=n||{start:0,end:0}}else n=null;for(Mi={focusedElem:e,selectionRange:n},El=!1,ne=t;ne!==null;)if(t=ne,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ne=e;else for(;ne!==null;){t=ne;try{var oe=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(oe!==null){var se=oe.memoizedProps,Te=oe.memoizedState,P=t.stateNode,Q=P.getSnapshotBeforeUpdate(t.elementType===t.type?se:gt(t.type,se),Te);P.__reactInternalSnapshotBeforeUpdate=Q}break;case 3:var b=t.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(l(163))}}catch(X){Ae(t,t.return,X)}if(e=t.sibling,e!==null){e.return=t.return,ne=e;break}ne=t.return}return oe=pu,pu=!1,oe}function Jn(e,t,n){var i=t.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var d=i=i.next;do{if((d.tag&e)===e){var h=d.destroy;d.destroy=void 0,h!==void 0&&us(t,n,h)}d=d.next}while(d!==i)}}function so(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var i=n.create;n.destroy=i()}n=n.next}while(n!==t)}}function fs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function hu(e){var t=e.alternate;t!==null&&(e.alternate=null,hu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Et],delete t[On],delete t[Qi],delete t[qf],delete t[Yf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function yu(e){return e.tag===5||e.tag===3||e.tag===4}function $u(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||yu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ds(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Bl));else if(i!==4&&(e=e.child,e!==null))for(ds(e,t,n),e=e.sibling;e!==null;)ds(e,t,n),e=e.sibling}function ps(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(e=e.child,e!==null))for(ps(e,t,n),e=e.sibling;e!==null;)ps(e,t,n),e=e.sibling}var Ue=null,mt=!1;function xr(e,t,n){for(n=n.child;n!==null;)ku(e,t,n),n=n.sibling}function ku(e,t,n){if(St&&typeof St.onCommitFiberUnmount=="function")try{St.onCommitFiberUnmount(ml,n)}catch{}switch(n.tag){case 5:qe||un(n,t);case 6:var i=Ue,d=mt;Ue=null,xr(e,t,n),Ue=i,mt=d,Ue!==null&&(mt?(e=Ue,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ue.removeChild(n.stateNode));break;case 18:Ue!==null&&(mt?(e=Ue,n=n.stateNode,e.nodeType===8?Ei(e.parentNode,n):e.nodeType===1&&Ei(e,n),Pn(e)):Ei(Ue,n.stateNode));break;case 4:i=Ue,d=mt,Ue=n.stateNode.containerInfo,mt=!0,xr(e,t,n),Ue=i,mt=d;break;case 0:case 11:case 14:case 15:if(!qe&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){d=i=i.next;do{var h=d,k=h.destroy;h=h.tag,k!==void 0&&((h&2)!==0||(h&4)!==0)&&us(n,t,k),d=d.next}while(d!==i)}xr(e,t,n);break;case 1:if(!qe&&(un(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(C){Ae(n,t,C)}xr(e,t,n);break;case 21:xr(e,t,n);break;case 22:n.mode&1?(qe=(i=qe)||n.memoizedState!==null,xr(e,t,n),qe=i):xr(e,t,n);break;default:xr(e,t,n)}}function xu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new fd),t.forEach(function(i){var d=wd.bind(null,e,i);n.has(i)||(n.add(i),i.then(d,d))})}}function wt(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var d=n[i];try{var h=e,k=t,C=k;e:for(;C!==null;){switch(C.tag){case 5:Ue=C.stateNode,mt=!1;break e;case 3:Ue=C.stateNode.containerInfo,mt=!0;break e;case 4:Ue=C.stateNode.containerInfo,mt=!0;break e}C=C.return}if(Ue===null)throw Error(l(160));ku(h,k,d),Ue=null,mt=!1;var E=d.alternate;E!==null&&(E.return=null),d.return=null}catch(A){Ae(d,t,A)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)gu(t,e),t=t.sibling}function gu(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(wt(t,e),Lt(e),i&4){try{Jn(3,e,e.return),so(3,e)}catch(se){Ae(e,e.return,se)}try{Jn(5,e,e.return)}catch(se){Ae(e,e.return,se)}}break;case 1:wt(t,e),Lt(e),i&512&&n!==null&&un(n,n.return);break;case 5:if(wt(t,e),Lt(e),i&512&&n!==null&&un(n,n.return),e.flags&32){var d=e.stateNode;try{mn(d,"")}catch(se){Ae(e,e.return,se)}}if(i&4&&(d=e.stateNode,d!=null)){var h=e.memoizedProps,k=n!==null?n.memoizedProps:h,C=e.type,E=e.updateQueue;if(e.updateQueue=null,E!==null)try{C==="input"&&h.type==="radio"&&h.name!=null&&Ws(d,h),Vo(C,k);var A=Vo(C,h);for(k=0;k<E.length;k+=2){var Z=E[k],W=E[k+1];Z==="style"?tc(d,W):Z==="dangerouslySetInnerHTML"?Js(d,W):Z==="children"?mn(d,W):T(d,Z,W,A)}switch(C){case"input":jo(d,h);break;case"textarea":Gs(d,h);break;case"select":var H=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!h.multiple;var ee=h.value;ee!=null?Or(d,!!h.multiple,ee,!1):H!==!!h.multiple&&(h.defaultValue!=null?Or(d,!!h.multiple,h.defaultValue,!0):Or(d,!!h.multiple,h.multiple?[]:"",!1))}d[On]=h}catch(se){Ae(e,e.return,se)}}break;case 6:if(wt(t,e),Lt(e),i&4){if(e.stateNode===null)throw Error(l(162));d=e.stateNode,h=e.memoizedProps;try{d.nodeValue=h}catch(se){Ae(e,e.return,se)}}break;case 3:if(wt(t,e),Lt(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Pn(t.containerInfo)}catch(se){Ae(e,e.return,se)}break;case 4:wt(t,e),Lt(e);break;case 13:wt(t,e),Lt(e),d=e.child,d.flags&8192&&(h=d.memoizedState!==null,d.stateNode.isHidden=h,!h||d.alternate!==null&&d.alternate.memoizedState!==null||($s=Ie())),i&4&&xu(e);break;case 22:if(Z=n!==null&&n.memoizedState!==null,e.mode&1?(qe=(A=qe)||Z,wt(t,e),qe=A):wt(t,e),Lt(e),i&8192){if(A=e.memoizedState!==null,(e.stateNode.isHidden=A)&&!Z&&(e.mode&1)!==0)for(ne=e,Z=e.child;Z!==null;){for(W=ne=Z;ne!==null;){switch(H=ne,ee=H.child,H.tag){case 0:case 11:case 14:case 15:Jn(4,H,H.return);break;case 1:un(H,H.return);var oe=H.stateNode;if(typeof oe.componentWillUnmount=="function"){i=H,n=H.return;try{t=i,oe.props=t.memoizedProps,oe.state=t.memoizedState,oe.componentWillUnmount()}catch(se){Ae(i,n,se)}}break;case 5:un(H,H.return);break;case 22:if(H.memoizedState!==null){vu(W);continue}}ee!==null?(ee.return=H,ne=ee):vu(W)}Z=Z.sibling}e:for(Z=null,W=e;;){if(W.tag===5){if(Z===null){Z=W;try{d=W.stateNode,A?(h=d.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none"):(C=W.stateNode,E=W.memoizedProps.style,k=E!=null&&E.hasOwnProperty("display")?E.display:null,C.style.display=ec("display",k))}catch(se){Ae(e,e.return,se)}}}else if(W.tag===6){if(Z===null)try{W.stateNode.nodeValue=A?"":W.memoizedProps}catch(se){Ae(e,e.return,se)}}else if((W.tag!==22&&W.tag!==23||W.memoizedState===null||W===e)&&W.child!==null){W.child.return=W,W=W.child;continue}if(W===e)break e;for(;W.sibling===null;){if(W.return===null||W.return===e)break e;Z===W&&(Z=null),W=W.return}Z===W&&(Z=null),W.sibling.return=W.return,W=W.sibling}}break;case 19:wt(t,e),Lt(e),i&4&&xu(e);break;case 21:break;default:wt(t,e),Lt(e)}}function Lt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(yu(n)){var i=n;break e}n=n.return}throw Error(l(160))}switch(i.tag){case 5:var d=i.stateNode;i.flags&32&&(mn(d,""),i.flags&=-33);var h=$u(e);ps(e,h,d);break;case 3:case 4:var k=i.stateNode.containerInfo,C=$u(e);ds(e,C,k);break;default:throw Error(l(161))}}catch(E){Ae(e,e.return,E)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function pd(e,t,n){ne=e,mu(e)}function mu(e,t,n){for(var i=(e.mode&1)!==0;ne!==null;){var d=ne,h=d.child;if(d.tag===22&&i){var k=d.memoizedState!==null||io;if(!k){var C=d.alternate,E=C!==null&&C.memoizedState!==null||qe;C=io;var A=qe;if(io=k,(qe=E)&&!A)for(ne=d;ne!==null;)k=ne,E=k.child,k.tag===22&&k.memoizedState!==null?Mu(d):E!==null?(E.return=k,ne=E):Mu(d);for(;h!==null;)ne=h,mu(h),h=h.sibling;ne=d,io=C,qe=A}wu(e)}else(d.subtreeFlags&8772)!==0&&h!==null?(h.return=d,ne=h):wu(e)}}function wu(e){for(;ne!==null;){var t=ne;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:qe||so(5,t);break;case 1:var i=t.stateNode;if(t.flags&4&&!qe)if(n===null)i.componentDidMount();else{var d=t.elementType===t.type?n.memoizedProps:gt(t.type,n.memoizedProps);i.componentDidUpdate(d,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var h=t.updateQueue;h!==null&&va(t,h,i);break;case 3:var k=t.updateQueue;if(k!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}va(t,k,n)}break;case 5:var C=t.stateNode;if(n===null&&t.flags&4){n=C;var E=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":E.autoFocus&&n.focus();break;case"img":E.src&&(n.src=E.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var A=t.alternate;if(A!==null){var Z=A.memoizedState;if(Z!==null){var W=Z.dehydrated;W!==null&&Pn(W)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(l(163))}qe||t.flags&512&&fs(t)}catch(H){Ae(t,t.return,H)}}if(t===e){ne=null;break}if(n=t.sibling,n!==null){n.return=t.return,ne=n;break}ne=t.return}}function vu(e){for(;ne!==null;){var t=ne;if(t===e){ne=null;break}var n=t.sibling;if(n!==null){n.return=t.return,ne=n;break}ne=t.return}}function Mu(e){for(;ne!==null;){var t=ne;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{so(4,t)}catch(E){Ae(t,n,E)}break;case 1:var i=t.stateNode;if(typeof i.componentDidMount=="function"){var d=t.return;try{i.componentDidMount()}catch(E){Ae(t,d,E)}}var h=t.return;try{fs(t)}catch(E){Ae(t,h,E)}break;case 5:var k=t.return;try{fs(t)}catch(E){Ae(t,k,E)}}}catch(E){Ae(t,t.return,E)}if(t===e){ne=null;break}var C=t.sibling;if(C!==null){C.return=t.return,ne=C;break}ne=t.return}}var hd=Math.ceil,co=N.ReactCurrentDispatcher,hs=N.ReactCurrentOwner,ht=N.ReactCurrentBatchConfig,ve=0,Re=null,De=null,Ve=0,ct=0,fn=pr(0),je=0,el=null,Nr=0,ao=0,ys=0,tl=null,tt=null,$s=0,dn=1/0,lr=null,uo=!1,ks=null,gr=null,fo=!1,mr=null,po=0,rl=0,xs=null,ho=-1,yo=0;function Ge(){return(ve&6)!==0?Ie():ho!==-1?ho:ho=Ie()}function wr(e){return(e.mode&1)===0?1:(ve&2)!==0&&Ve!==0?Ve&-Ve:Xf.transition!==null?(yo===0&&(yo=$c()),yo):(e=Ee,e!==0||(e=window.event,e=e===void 0?16:Sc(e.type)),e)}function vt(e,t,n,i){if(50<rl)throw rl=0,xs=null,Error(l(185));En(e,n,i),((ve&2)===0||e!==Re)&&(e===Re&&((ve&2)===0&&(ao|=n),je===4&&vr(e,Ve)),rt(e,i),n===1&&ve===0&&(t.mode&1)===0&&(dn=Ie()+500,Ol&&yr()))}function rt(e,t){var n=e.callbackNode;G0(e,t);var i=Ml(e,e===Re?Ve:0);if(i===0)n!==null&&pc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=i&-i,e.callbackPriority!==t){if(n!=null&&pc(n),t===1)e.tag===0?Gf(Su.bind(null,e)):ua(Su.bind(null,e)),Zf(function(){(ve&6)===0&&yr()}),n=null;else{switch(kc(i)){case 1:n=Xo;break;case 4:n=hc;break;case 16:n=gl;break;case 536870912:n=yc;break;default:n=gl}n=Au(n,Cu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Cu(e,t){if(ho=-1,yo=0,(ve&6)!==0)throw Error(l(327));var n=e.callbackNode;if(pn()&&e.callbackNode!==n)return null;var i=Ml(e,e===Re?Ve:0);if(i===0)return null;if((i&30)!==0||(i&e.expiredLanes)!==0||t)t=$o(e,i);else{t=i;var d=ve;ve|=2;var h=Qu();(Re!==e||Ve!==t)&&(lr=null,dn=Ie()+500,Tr(e,t));do try{kd();break}catch(C){Eu(e,C)}while(!0);Ti(),co.current=h,ve=d,De!==null?t=0:(Re=null,Ve=0,t=je)}if(t!==0){if(t===2&&(d=Ko(e),d!==0&&(i=d,t=gs(e,d))),t===1)throw n=el,Tr(e,0),vr(e,i),rt(e,Ie()),n;if(t===6)vr(e,i);else{if(d=e.current.alternate,(i&30)===0&&!yd(d)&&(t=$o(e,i),t===2&&(h=Ko(e),h!==0&&(i=h,t=gs(e,h))),t===1))throw n=el,Tr(e,0),vr(e,i),rt(e,Ie()),n;switch(e.finishedWork=d,e.finishedLanes=i,t){case 0:case 1:throw Error(l(345));case 2:Dr(e,tt,lr);break;case 3:if(vr(e,i),(i&130023424)===i&&(t=$s+500-Ie(),10<t)){if(Ml(e,0)!==0)break;if(d=e.suspendedLanes,(d&i)!==i){Ge(),e.pingedLanes|=e.suspendedLanes&d;break}e.timeoutHandle=Si(Dr.bind(null,e,tt,lr),t);break}Dr(e,tt,lr);break;case 4:if(vr(e,i),(i&4194240)===i)break;for(t=e.eventTimes,d=-1;0<i;){var k=31-$t(i);h=1<<k,k=t[k],k>d&&(d=k),i&=~h}if(i=d,i=Ie()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*hd(i/1960))-i,10<i){e.timeoutHandle=Si(Dr.bind(null,e,tt,lr),i);break}Dr(e,tt,lr);break;case 5:Dr(e,tt,lr);break;default:throw Error(l(329))}}}return rt(e,Ie()),e.callbackNode===n?Cu.bind(null,e):null}function gs(e,t){var n=tl;return e.current.memoizedState.isDehydrated&&(Tr(e,t).flags|=256),e=$o(e,t),e!==2&&(t=tt,tt=n,t!==null&&ms(t)),e}function ms(e){tt===null?tt=e:tt.push.apply(tt,e)}function yd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var d=n[i],h=d.getSnapshot;d=d.value;try{if(!kt(h(),d))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function vr(e,t){for(t&=~ys,t&=~ao,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-$t(t),i=1<<n;e[n]=-1,t&=~i}}function Su(e){if((ve&6)!==0)throw Error(l(327));pn();var t=Ml(e,0);if((t&1)===0)return rt(e,Ie()),null;var n=$o(e,t);if(e.tag!==0&&n===2){var i=Ko(e);i!==0&&(t=i,n=gs(e,i))}if(n===1)throw n=el,Tr(e,0),vr(e,t),rt(e,Ie()),n;if(n===6)throw Error(l(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Dr(e,tt,lr),rt(e,Ie()),null}function ws(e,t){var n=ve;ve|=1;try{return e(t)}finally{ve=n,ve===0&&(dn=Ie()+500,Ol&&yr())}}function Ir(e){mr!==null&&mr.tag===0&&(ve&6)===0&&pn();var t=ve;ve|=1;var n=ht.transition,i=Ee;try{if(ht.transition=null,Ee=1,e)return e()}finally{Ee=i,ht.transition=n,ve=t,(ve&6)===0&&yr()}}function vs(){ct=fn.current,Le(fn)}function Tr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Hf(n)),De!==null)for(n=De.return;n!==null;){var i=n;switch(Pi(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&zl();break;case 3:cn(),Le(Ke),Le(He),Vi();break;case 5:Oi(i);break;case 4:cn();break;case 13:Le(Pe);break;case 19:Le(Pe);break;case 10:Di(i.type._context);break;case 22:case 23:vs()}n=n.return}if(Re=e,De=e=Mr(e.current,null),Ve=ct=t,je=0,el=null,ys=ao=Nr=0,tt=tl=null,Pr!==null){for(t=0;t<Pr.length;t++)if(n=Pr[t],i=n.interleaved,i!==null){n.interleaved=null;var d=i.next,h=n.pending;if(h!==null){var k=h.next;h.next=d,i.next=k}n.pending=i}Pr=null}return e}function Eu(e,t){do{var n=De;try{if(Ti(),Kl.current=ro,Jl){for(var i=be.memoizedState;i!==null;){var d=i.queue;d!==null&&(d.pending=null),i=i.next}Jl=!1}if(Ar=0,ze=Be=be=null,qn=!1,Yn=0,hs.current=null,n===null||n.return===null){je=1,el=t,De=null;break}e:{var h=e,k=n.return,C=n,E=t;if(t=Ve,C.flags|=32768,E!==null&&typeof E=="object"&&typeof E.then=="function"){var A=E,Z=C,W=Z.tag;if((Z.mode&1)===0&&(W===0||W===11||W===15)){var H=Z.alternate;H?(Z.updateQueue=H.updateQueue,Z.memoizedState=H.memoizedState,Z.lanes=H.lanes):(Z.updateQueue=null,Z.memoizedState=null)}var ee=Xa(k);if(ee!==null){ee.flags&=-257,Ka(ee,k,C,h,t),ee.mode&1&&Ga(h,A,t),t=ee,E=A;var oe=t.updateQueue;if(oe===null){var se=new Set;se.add(E),t.updateQueue=se}else oe.add(E);break e}else{if((t&1)===0){Ga(h,A,t),Ms();break e}E=Error(l(426))}}else if(_e&&C.mode&1){var Te=Xa(k);if(Te!==null){(Te.flags&65536)===0&&(Te.flags|=256),Ka(Te,k,C,h,t),Ni(an(E,C));break e}}h=E=an(E,C),je!==4&&(je=2),tl===null?tl=[h]:tl.push(h),h=k;do{switch(h.tag){case 3:h.flags|=65536,t&=-t,h.lanes|=t;var P=qa(h,E,t);wa(h,P);break e;case 1:C=E;var Q=h.type,b=h.stateNode;if((h.flags&128)===0&&(typeof Q.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(gr===null||!gr.has(b)))){h.flags|=65536,t&=-t,h.lanes|=t;var X=Ya(h,C,t);wa(h,X);break e}}h=h.return}while(h!==null)}Lu(n)}catch(ae){t=ae,De===n&&n!==null&&(De=n=n.return);continue}break}while(!0)}function Qu(){var e=co.current;return co.current=ro,e===null?ro:e}function Ms(){(je===0||je===3||je===2)&&(je=4),Re===null||(Nr&268435455)===0&&(ao&268435455)===0||vr(Re,Ve)}function $o(e,t){var n=ve;ve|=2;var i=Qu();(Re!==e||Ve!==t)&&(lr=null,Tr(e,t));do try{$d();break}catch(d){Eu(e,d)}while(!0);if(Ti(),ve=n,co.current=i,De!==null)throw Error(l(261));return Re=null,Ve=0,je}function $d(){for(;De!==null;)Fu(De)}function kd(){for(;De!==null&&!R0();)Fu(De)}function Fu(e){var t=bu(e.alternate,e,ct);e.memoizedProps=e.pendingProps,t===null?Lu(e):De=t,hs.current=null}function Lu(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=ad(n,t,ct),n!==null){De=n;return}}else{if(n=ud(n,t),n!==null){n.flags&=32767,De=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{je=6,De=null;return}}if(t=t.sibling,t!==null){De=t;return}De=t=e}while(t!==null);je===0&&(je=5)}function Dr(e,t,n){var i=Ee,d=ht.transition;try{ht.transition=null,Ee=1,xd(e,t,n,i)}finally{ht.transition=d,Ee=i}return null}function xd(e,t,n,i){do pn();while(mr!==null);if((ve&6)!==0)throw Error(l(327));n=e.finishedWork;var d=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(l(177));e.callbackNode=null,e.callbackPriority=0;var h=n.lanes|n.childLanes;if(X0(e,h),e===Re&&(De=Re=null,Ve=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||fo||(fo=!0,Au(gl,function(){return pn(),null})),h=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||h){h=ht.transition,ht.transition=null;var k=Ee;Ee=1;var C=ve;ve|=4,hs.current=null,dd(e,n),gu(n,e),Bf(Mi),El=!!vi,Mi=vi=null,e.current=n,pd(n),O0(),ve=C,Ee=k,ht.transition=h}else e.current=n;if(fo&&(fo=!1,mr=e,po=d),h=e.pendingLanes,h===0&&(gr=null),H0(n.stateNode),rt(e,Ie()),t!==null)for(i=e.onRecoverableError,n=0;n<t.length;n++)d=t[n],i(d.value,{componentStack:d.stack,digest:d.digest});if(uo)throw uo=!1,e=ks,ks=null,e;return(po&1)!==0&&e.tag!==0&&pn(),h=e.pendingLanes,(h&1)!==0?e===xs?rl++:(rl=0,xs=e):rl=0,yr(),null}function pn(){if(mr!==null){var e=kc(po),t=ht.transition,n=Ee;try{if(ht.transition=null,Ee=16>e?16:e,mr===null)var i=!1;else{if(e=mr,mr=null,po=0,(ve&6)!==0)throw Error(l(331));var d=ve;for(ve|=4,ne=e.current;ne!==null;){var h=ne,k=h.child;if((ne.flags&16)!==0){var C=h.deletions;if(C!==null){for(var E=0;E<C.length;E++){var A=C[E];for(ne=A;ne!==null;){var Z=ne;switch(Z.tag){case 0:case 11:case 15:Jn(8,Z,h)}var W=Z.child;if(W!==null)W.return=Z,ne=W;else for(;ne!==null;){Z=ne;var H=Z.sibling,ee=Z.return;if(hu(Z),Z===A){ne=null;break}if(H!==null){H.return=ee,ne=H;break}ne=ee}}}var oe=h.alternate;if(oe!==null){var se=oe.child;if(se!==null){oe.child=null;do{var Te=se.sibling;se.sibling=null,se=Te}while(se!==null)}}ne=h}}if((h.subtreeFlags&2064)!==0&&k!==null)k.return=h,ne=k;else e:for(;ne!==null;){if(h=ne,(h.flags&2048)!==0)switch(h.tag){case 0:case 11:case 15:Jn(9,h,h.return)}var P=h.sibling;if(P!==null){P.return=h.return,ne=P;break e}ne=h.return}}var Q=e.current;for(ne=Q;ne!==null;){k=ne;var b=k.child;if((k.subtreeFlags&2064)!==0&&b!==null)b.return=k,ne=b;else e:for(k=Q;ne!==null;){if(C=ne,(C.flags&2048)!==0)try{switch(C.tag){case 0:case 11:case 15:so(9,C)}}catch(ae){Ae(C,C.return,ae)}if(C===k){ne=null;break e}var X=C.sibling;if(X!==null){X.return=C.return,ne=X;break e}ne=C.return}}if(ve=d,yr(),St&&typeof St.onPostCommitFiberRoot=="function")try{St.onPostCommitFiberRoot(ml,e)}catch{}i=!0}return i}finally{Ee=n,ht.transition=t}}return!1}function _u(e,t,n){t=an(n,t),t=qa(e,t,1),e=kr(e,t,1),t=Ge(),e!==null&&(En(e,1,t),rt(e,t))}function Ae(e,t,n){if(e.tag===3)_u(e,e,n);else for(;t!==null;){if(t.tag===3){_u(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(gr===null||!gr.has(i))){e=an(n,e),e=Ya(t,e,1),t=kr(t,e,1),e=Ge(),t!==null&&(En(t,1,e),rt(t,e));break}}t=t.return}}function gd(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),t=Ge(),e.pingedLanes|=e.suspendedLanes&n,Re===e&&(Ve&n)===n&&(je===4||je===3&&(Ve&130023424)===Ve&&500>Ie()-$s?Tr(e,0):ys|=n),rt(e,t)}function Pu(e,t){t===0&&((e.mode&1)===0?t=1:(t=vl,vl<<=1,(vl&130023424)===0&&(vl=4194304)));var n=Ge();e=tr(e,t),e!==null&&(En(e,t,n),rt(e,n))}function md(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Pu(e,n)}function wd(e,t){var n=0;switch(e.tag){case 13:var i=e.stateNode,d=e.memoizedState;d!==null&&(n=d.retryLane);break;case 19:i=e.stateNode;break;default:throw Error(l(314))}i!==null&&i.delete(t),Pu(e,n)}var bu;bu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ke.current)et=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return et=!1,cd(e,t,n);et=(e.flags&131072)!==0}else et=!1,_e&&(t.flags&1048576)!==0&&fa(t,Vl,t.index);switch(t.lanes=0,t.tag){case 2:var i=t.type;oo(e,t),e=t.pendingProps;var d=en(t,He.current);sn(t,n),d=Wi(null,t,i,e,d,n);var h=qi();return t.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Je(i)?(h=!0,Rl(t)):h=!1,t.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,zi(t),d.updater=no,t.stateNode=d,d._reactInternals=t,es(t,i,e,n),t=ls(null,t,i,!0,h,n)):(t.tag=0,_e&&h&&_i(t),Ye(null,t,d,n),t=t.child),t;case 16:i=t.elementType;e:{switch(oo(e,t),e=t.pendingProps,d=i._init,i=d(i._payload),t.type=i,d=t.tag=Md(i),e=gt(i,e),d){case 0:t=ns(null,t,i,e,n);break e;case 1:t=lu(null,t,i,e,n);break e;case 11:t=Ja(null,t,i,e,n);break e;case 14:t=eu(null,t,i,gt(i.type,e),n);break e}throw Error(l(306,i,""))}return t;case 0:return i=t.type,d=t.pendingProps,d=t.elementType===i?d:gt(i,d),ns(e,t,i,d,n);case 1:return i=t.type,d=t.pendingProps,d=t.elementType===i?d:gt(i,d),lu(e,t,i,d,n);case 3:e:{if(ou(t),e===null)throw Error(l(387));i=t.pendingProps,h=t.memoizedState,d=h.element,ma(e,t),Gl(t,i,null,n);var k=t.memoizedState;if(i=k.element,h.isDehydrated)if(h={element:i,isDehydrated:!1,cache:k.cache,pendingSuspenseBoundaries:k.pendingSuspenseBoundaries,transitions:k.transitions},t.updateQueue.baseState=h,t.memoizedState=h,t.flags&256){d=an(Error(l(423)),t),t=iu(e,t,i,n,d);break e}else if(i!==d){d=an(Error(l(424)),t),t=iu(e,t,i,n,d);break e}else for(st=dr(t.stateNode.containerInfo.firstChild),it=t,_e=!0,xt=null,n=xa(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(nn(),i===d){t=nr(e,t,n);break e}Ye(e,t,i,n)}t=t.child}return t;case 5:return Ma(t),e===null&&Ai(t),i=t.type,d=t.pendingProps,h=e!==null?e.memoizedProps:null,k=d.children,Ci(i,d)?k=null:h!==null&&Ci(i,h)&&(t.flags|=32),nu(e,t),Ye(e,t,k,n),t.child;case 6:return e===null&&Ai(t),null;case 13:return su(e,t,n);case 4:return Ri(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=ln(t,null,i,n):Ye(e,t,i,n),t.child;case 11:return i=t.type,d=t.pendingProps,d=t.elementType===i?d:gt(i,d),Ja(e,t,i,d,n);case 7:return Ye(e,t,t.pendingProps,n),t.child;case 8:return Ye(e,t,t.pendingProps.children,n),t.child;case 12:return Ye(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(i=t.type._context,d=t.pendingProps,h=t.memoizedProps,k=d.value,Qe(Wl,i._currentValue),i._currentValue=k,h!==null)if(kt(h.value,k)){if(h.children===d.children&&!Ke.current){t=nr(e,t,n);break e}}else for(h=t.child,h!==null&&(h.return=t);h!==null;){var C=h.dependencies;if(C!==null){k=h.child;for(var E=C.firstContext;E!==null;){if(E.context===i){if(h.tag===1){E=rr(-1,n&-n),E.tag=2;var A=h.updateQueue;if(A!==null){A=A.shared;var Z=A.pending;Z===null?E.next=E:(E.next=Z.next,Z.next=E),A.pending=E}}h.lanes|=n,E=h.alternate,E!==null&&(E.lanes|=n),Bi(h.return,n,t),C.lanes|=n;break}E=E.next}}else if(h.tag===10)k=h.type===t.type?null:h.child;else if(h.tag===18){if(k=h.return,k===null)throw Error(l(341));k.lanes|=n,C=k.alternate,C!==null&&(C.lanes|=n),Bi(k,n,t),k=h.sibling}else k=h.child;if(k!==null)k.return=h;else for(k=h;k!==null;){if(k===t){k=null;break}if(h=k.sibling,h!==null){h.return=k.return,k=h;break}k=k.return}h=k}Ye(e,t,d.children,n),t=t.child}return t;case 9:return d=t.type,i=t.pendingProps.children,sn(t,n),d=dt(d),i=i(d),t.flags|=1,Ye(e,t,i,n),t.child;case 14:return i=t.type,d=gt(i,t.pendingProps),d=gt(i.type,d),eu(e,t,i,d,n);case 15:return tu(e,t,t.type,t.pendingProps,n);case 17:return i=t.type,d=t.pendingProps,d=t.elementType===i?d:gt(i,d),oo(e,t),t.tag=1,Je(i)?(e=!0,Rl(t)):e=!1,sn(t,n),Za(t,i,d),es(t,i,d,n),ls(null,t,i,!0,e,n);case 19:return au(e,t,n);case 22:return ru(e,t,n)}throw Error(l(156,t.tag))};function Au(e,t){return dc(e,t)}function vd(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,n,i){return new vd(e,t,n,i)}function Cs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Md(e){if(typeof e=="function")return Cs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===re)return 11;if(e===ge)return 14}return 2}function Mr(e,t){var n=e.alternate;return n===null?(n=yt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ko(e,t,n,i,d,h){var k=2;if(i=e,typeof e=="function")Cs(e)&&(k=1);else if(typeof e=="string")k=5;else e:switch(e){case V:return Br(n.children,d,h,t);case I:k=8,d|=8;break;case F:return e=yt(12,n,t,d|2),e.elementType=F,e.lanes=h,e;case ie:return e=yt(13,n,t,d),e.elementType=ie,e.lanes=h,e;case ye:return e=yt(19,n,t,d),e.elementType=ye,e.lanes=h,e;case xe:return xo(n,d,h,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case j:k=10;break e;case Y:k=9;break e;case re:k=11;break e;case ge:k=14;break e;case me:k=16,i=null;break e}throw Error(l(130,e==null?e:typeof e,""))}return t=yt(k,n,t,d),t.elementType=e,t.type=i,t.lanes=h,t}function Br(e,t,n,i){return e=yt(7,e,i,t),e.lanes=n,e}function xo(e,t,n,i){return e=yt(22,e,i,t),e.elementType=xe,e.lanes=n,e.stateNode={isHidden:!1},e}function Ss(e,t,n){return e=yt(6,e,null,t),e.lanes=n,e}function Es(e,t,n){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Cd(e,t,n,i,d){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Jo(0),this.expirationTimes=Jo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Jo(0),this.identifierPrefix=i,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Qs(e,t,n,i,d,h,k,C,E){return e=new Cd(e,t,n,C,E),t===1?(t=1,h===!0&&(t|=8)):t=0,h=yt(3,null,null,t),e.current=h,h.stateNode=e,h.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},zi(h),e}function Sd(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:K,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}function Nu(e){if(!e)return hr;e=e._reactInternals;e:{if(Er(e)!==e||e.tag!==1)throw Error(l(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Je(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(l(171))}if(e.tag===1){var n=e.type;if(Je(n))return ca(e,n,t)}return t}function Iu(e,t,n,i,d,h,k,C,E){return e=Qs(n,i,!0,e,d,h,k,C,E),e.context=Nu(null),n=e.current,i=Ge(),d=wr(n),h=rr(i,d),h.callback=t??null,kr(n,h,d),e.current.lanes=d,En(e,d,i),rt(e,i),e}function go(e,t,n,i){var d=t.current,h=Ge(),k=wr(d);return n=Nu(n),t.context===null?t.context=n:t.pendingContext=n,t=rr(h,k),t.payload={element:e},i=i===void 0?null:i,i!==null&&(t.callback=i),e=kr(d,t,k),e!==null&&(vt(e,d,k,h),Yl(e,d,k)),k}function mo(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Tu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Fs(e,t){Tu(e,t),(e=e.alternate)&&Tu(e,t)}function Ed(){return null}var Du=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ls(e){this._internalRoot=e}wo.prototype.render=Ls.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(l(409));go(e,t,null,null)},wo.prototype.unmount=Ls.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ir(function(){go(null,e,null,null)}),t[Xt]=null}};function wo(e){this._internalRoot=e}wo.prototype.unstable_scheduleHydration=function(e){if(e){var t=mc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ar.length&&t!==0&&t<ar[n].priority;n++);ar.splice(n,0,e),n===0&&Mc(e)}};function _s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function vo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Bu(){}function Qd(e,t,n,i,d){if(d){if(typeof i=="function"){var h=i;i=function(){var A=mo(k);h.call(A)}}var k=Iu(t,i,e,0,null,!1,!1,"",Bu);return e._reactRootContainer=k,e[Xt]=k.current,zn(e.nodeType===8?e.parentNode:e),Ir(),k}for(;d=e.lastChild;)e.removeChild(d);if(typeof i=="function"){var C=i;i=function(){var A=mo(E);C.call(A)}}var E=Qs(e,0,!1,null,null,!1,!1,"",Bu);return e._reactRootContainer=E,e[Xt]=E.current,zn(e.nodeType===8?e.parentNode:e),Ir(function(){go(t,E,n,i)}),E}function Mo(e,t,n,i,d){var h=n._reactRootContainer;if(h){var k=h;if(typeof d=="function"){var C=d;d=function(){var E=mo(k);C.call(E)}}go(t,k,e,d)}else k=Qd(n,t,e,d,i);return mo(k)}xc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Sn(t.pendingLanes);n!==0&&(ei(t,n|1),rt(t,Ie()),(ve&6)===0&&(dn=Ie()+500,yr()))}break;case 13:Ir(function(){var i=tr(e,1);if(i!==null){var d=Ge();vt(i,e,1,d)}}),Fs(e,1)}},ti=function(e){if(e.tag===13){var t=tr(e,134217728);if(t!==null){var n=Ge();vt(t,e,134217728,n)}Fs(e,134217728)}},gc=function(e){if(e.tag===13){var t=wr(e),n=tr(e,t);if(n!==null){var i=Ge();vt(n,e,t,i)}Fs(e,t)}},mc=function(){return Ee},wc=function(e,t){var n=Ee;try{return Ee=e,t()}finally{Ee=n}},Wo=function(e,t,n){switch(t){case"input":if(jo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var d=jl(i);if(!d)throw Error(l(90));Xe(i),jo(i,d)}}}break;case"textarea":Gs(e,n);break;case"select":t=n.value,t!=null&&Or(e,!!n.multiple,t,!1)}},oc=ws,ic=Ir;var Fd={usingClientEntryPoint:!1,Events:[Un,Kr,jl,nc,lc,ws]},nl={findFiberByHostInstance:Qr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ld={bundleType:nl.bundleType,version:nl.version,rendererPackageName:nl.rendererPackageName,rendererConfig:nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:N.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=uc(e),e===null?null:e.stateNode},findFiberByHostInstance:nl.findFiberByHostInstance||Ed,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Co=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Co.isDisabled&&Co.supportsFiber)try{ml=Co.inject(Ld),St=Co}catch{}}return nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Fd,nt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!_s(t))throw Error(l(200));return Sd(e,t,null,n)},nt.createRoot=function(e,t){if(!_s(e))throw Error(l(299));var n=!1,i="",d=Du;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onRecoverableError!==void 0&&(d=t.onRecoverableError)),t=Qs(e,1,!1,null,null,n,!1,i,d),e[Xt]=t.current,zn(e.nodeType===8?e.parentNode:e),new Ls(t)},nt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(l(188)):(e=Object.keys(e).join(","),Error(l(268,e)));return e=uc(t),e=e===null?null:e.stateNode,e},nt.flushSync=function(e){return Ir(e)},nt.hydrate=function(e,t,n){if(!vo(t))throw Error(l(200));return Mo(null,e,t,!0,n)},nt.hydrateRoot=function(e,t,n){if(!_s(e))throw Error(l(405));var i=n!=null&&n.hydratedSources||null,d=!1,h="",k=Du;if(n!=null&&(n.unstable_strictMode===!0&&(d=!0),n.identifierPrefix!==void 0&&(h=n.identifierPrefix),n.onRecoverableError!==void 0&&(k=n.onRecoverableError)),t=Iu(t,null,e,1,n??null,d,!1,h,k),e[Xt]=t.current,zn(e),i)for(e=0;e<i.length;e++)n=i[e],d=n._getVersion,d=d(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,d]:t.mutableSourceEagerHydrationData.push(n,d);return new wo(t)},nt.render=function(e,t,n){if(!vo(t))throw Error(l(200));return Mo(null,e,t,!1,n)},nt.unmountComponentAtNode=function(e){if(!vo(e))throw Error(l(40));return e._reactRootContainer?(Ir(function(){Mo(null,null,e,!1,function(){e._reactRootContainer=null,e[Xt]=null})}),!0):!1},nt.unstable_batchedUpdates=ws,nt.unstable_renderSubtreeIntoContainer=function(e,t,n,i){if(!vo(n))throw Error(l(200));if(e==null||e._reactInternals===void 0)throw Error(l(38));return Mo(e,t,n,!1,i)},nt.version="18.3.1-next-f1338f8080-20240426",nt}var Zu;function Dd(){if(Zu)return As.exports;Zu=1;function c(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c)}catch(r){console.error(r)}}return c(),As.exports=Td(),As.exports}var Wu;function Bd(){if(Wu)return So;Wu=1;var c=Dd();return So.createRoot=c.createRoot,So.hydrateRoot=c.hydrateRoot,So}var jd=Bd(),Ts={},Ds={},qu;function zr(){return qu||(qu=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.AssumptionError=c.AssumptionId=void 0,c.checkValidity=l,c.checkPositivity=o,c.log=s,c.AssumptionId={VALIDITY:"validity",DOMAIN:"domain",POSITIVITY:"positivity",SPARITY:"sparity"};class r extends Error{constructor(a){const f=`${a.id}(${a.subject})`;super(f),this.name="AssumptionError",this.violation=a}static validity(a){return new r({id:c.AssumptionId.VALIDITY,subject:a})}static positivity(a){return new r({id:c.AssumptionId.POSITIVITY,subject:a})}static sparity(a){return new r({id:c.AssumptionId.SPARITY,subject:a})}static domain(a){return new r({id:c.AssumptionId.DOMAIN,subject:a})}}c.AssumptionError=r;function l(u,a){if(u.length===0||!u.every(f=>Number.isFinite(f)))throw r.validity(a)}function o(u,a){if(u.some(f=>f<=0))throw r.positivity(a)}function s(u,a){const f=new Array(u.length);for(let p=0;p<u.length;p++){if(u[p]<=0)throw r.positivity(a);f[p]=Math.log(u[p])}return f}})(Ds)),Ds}var Bs={},Eo={},ol={},hn={},Yu;function zd(){if(Yu)return hn;Yu=1,Object.defineProperty(hn,"__esModule",{value:!0}),hn.Xoshiro256PlusPlus=void 0,hn.fnv1aHash=a;const c=0xffffffffffffffffn;function r(f,p){return(f<<p|f>>64n-p)&c}class l{constructor(p){this.state=p&c}next(){this.state=this.state+0x9e3779b97f4a7c15n&c;let p=this.state;return p=(p^p>>30n)*0xbf58476d1ce4e5b9n&c,p=(p^p>>27n)*0x94d049bb133111ebn&c,(p^p>>31n)&c}}class o{constructor(p){const y=new l(p);this.state=[y.next(),y.next(),y.next(),y.next()]}nextU64(){const p=this.state,y=r(p[0]+p[3]&c,23n)+p[0]&c,$=p[1]<<17n&c;return p[2]^=p[0],p[3]^=p[1],p[1]^=p[2],p[0]^=p[3],p[2]^=$,p[3]=r(p[3],45n),y}uniformFloat(){const p=this.nextU64();return Number(p>>11n)*(1/Number(1n<<53n))}uniformFloatRange(p,y){return p>=y?p:p+(y-p)*this.uniformFloat()}uniformInt(p,y){if(p>=y)return p;const $=y-p;if($>0xffffffffffffffffn)throw new RangeError("uniform_int: range overflow (max - min exceeds u64)");return p+this.nextU64()%$}uniformBool(){return this.uniformFloat()<.5}}hn.Xoshiro256PlusPlus=o;const s=0xcbf29ce484222325n,u=0x00000100000001b3n;function a(f){let p=s;const $=new TextEncoder().encode(f);for(const g of $)p^=BigInt(g),p=p*u&c;return p}return hn}var Gu;function Ao(){if(Gu)return ol;Gu=1,Object.defineProperty(ol,"__esModule",{value:!0}),ol.Rng=void 0;const c=zd();class r{constructor(o){let s;o===void 0?s=BigInt(Date.now()):typeof o=="string"?s=(0,c.fnv1aHash)(o):typeof o=="bigint"?s=BigInt.asIntN(64,o):s=BigInt.asIntN(64,BigInt(o)),this.inner=new c.Xoshiro256PlusPlus(s)}uniformFloat(){return this.inner.uniformFloat()}uniformFloatRange(o,s){return this.inner.uniformFloatRange(o,s)}uniformInt(o,s){const u=this.inner.uniformInt(BigInt(o),BigInt(s));return Number(u)}uniformBigInt(o,s){return this.inner.uniformInt(o,s)}uniformBool(){return this.inner.uniformBool()}sample(o,s){if(s<=0)throw new Error("sample: k must be positive");if(o.length===0)throw new Error("sample: cannot sample from empty array");const u=o.length;if(s>=u)return[...o];const a=[];let f=s;for(let p=0;p<u&&f>0;p++){const y=u-p;this.uniformFloat()*y<f&&(a.push(o[p]),f--)}return a}resample(o,s){if(s<=0)throw new Error("resample: k must be positive");const u=o.length;if(u===0)throw new Error("resample: cannot resample from empty array");const a=[];for(let f=0;f<s;f++){const p=this.uniformInt(0,u);a.push(o[p])}return a}shuffle(o){if(o.length===0)throw new Error("shuffle: cannot shuffle empty array");const s=[...o],u=s.length;for(let a=u-1;a>0;a--){const f=this.uniformInt(0,a+1);[s[a],s[f]]=[s[f],s[a]]}return s}}return ol.Rng=r,ol}var Xu;function Rd(){if(Xu)return Eo;Xu=1,Object.defineProperty(Eo,"__esModule",{value:!0}),Eo.fastCenter=a;const c=Ao(),r=0xcbf29ce484222325n,l=0x00000100000001b3n,o=(1n<<64n)-1n;function s(f){const p=new ArrayBuffer(8);new Float64Array(p)[0]=f;const y=new DataView(p);return BigInt(y.getUint32(4,!0))<<32n|BigInt(y.getUint32(0,!0))}function u(f){let p=r;for(const y of f){const $=s(y);for(let g=0;g<8;g++)p^=$>>BigInt(g*8)&0xffn,p=p*l&o}return BigInt.asIntN(64,p)}function a(f){const p=f.length;if(p===0)throw new Error("Input array cannot be empty");if(p===1)return f[0];if(p===2)return(f[0]+f[1])/2;const y=new c.Rng(u(f)),$=[...f].sort((T,N)=>T-N),g=Number(BigInt(p)*BigInt(p+1)/2n),m=Math.floor((g+1)/2),v=Math.floor((g+2)/2),M=Array.from({length:p},(T,N)=>N+1),x=Array(p).fill(p);let w=$[Math.floor((p-1)/2)]+$[Math.floor(p/2)],_=g,z=0;for(;;){let T=0,N=p;const U=[];for(let V=1;V<=p;V++){for(;N>=V&&$[V-1]+$[N-1]>=w;)N--;const I=N>=V?N-V+1:0;U.push(I),T+=I}if(T===z){let V=1/0,I=-1/0;for(let F=0;F<p;F++){if(M[F]>x[F])continue;const j=$[F],Y=$[M[F]-1]+j,re=$[x[F]-1]+j;V=Math.min(V,Y),I=Math.max(I,re)}if(w=(V+I)/2,(w<=V||w>I)&&(w=I),V===I||_<=2)return w/2;continue}if(T===m||T===v-1){let V=-1/0,I=1/0;for(let F=0;F<p;F++){const j=U[F],Y=$[F],re=p-F;if(j>0){const ie=F+j,ye=Y+$[ie-1];V=Math.max(V,ye)}if(j<re){const ie=F+j+1,ye=Y+$[ie-1];I=Math.min(I,ye)}}return m<v?(I+V)/4:(T===m?V:I)/2}if(T<m)for(let V=0;V<p;V++)M[V]=V+U[V]+1;else for(let V=0;V<p;V++)x[V]=V+U[V];z=T,_=0;for(let V=0;V<p;V++){const I=x[V]-M[V]+1;I>0&&(_+=I)}if(_>2){const V=y.uniformInt(0,_);let I=0,F=0;for(let Y=0;Y<p;Y++){const re=x[Y]-M[Y]+1;if(re>0){if(V<I+re){F=Y;break}I+=re}}const j=Math.floor((M[F]+x[F])/2);w=$[F]+$[j-1]}else{let V=1/0,I=-1/0;for(let F=0;F<p;F++){if(M[F]>x[F])continue;const j=$[F],Y=$[M[F]-1]+j,re=$[x[F]-1]+j;V=Math.min(V,Y),I=Math.max(I,re)}if(w=(V+I)/2,(w<=V||w>I)&&(w=I),V===I)return w/2}}}return Eo}var Qo={},Ku;function Od(){if(Ku)return Qo;Ku=1,Object.defineProperty(Qo,"__esModule",{value:!0}),Qo.fastSpread=a;const c=Ao(),r=0xcbf29ce484222325n,l=0x00000100000001b3n,o=(1n<<64n)-1n;function s(f){const p=new ArrayBuffer(8);new Float64Array(p)[0]=f;const y=new DataView(p);return BigInt(y.getUint32(4,!0))<<32n|BigInt(y.getUint32(0,!0))}function u(f){let p=r;for(const y of f){const $=s(y);for(let g=0;g<8;g++)p^=$>>BigInt(g*8)&0xffn,p=p*l&o}return BigInt.asIntN(64,p)}function a(f){const p=f.length;if(p===0)throw new Error("Input array cannot be empty");if(p===1)return 0;if(p===2)return Math.abs(f[1]-f[0]);const y=new c.Rng(u(f)),$=[...f].sort((T,N)=>T-N),g=Number(BigInt(p)*BigInt(p-1)/2n),m=Math.floor((g+1)/2),v=Math.floor((g+2)/2),M=Array.from({length:p},(T,N)=>Math.min(N+1,p)),x=Array(p).fill(p-1);for(let T=0;T<p;T++)M[T]>x[T]&&(M[T]=1,x[T]=0);const w=Array(p).fill(0);let _=$[Math.floor(p/2)]-$[Math.floor((p-1)/2)],z=-1;for(;;){let T=0,N=-1/0,U=1/0,K=1;for(let F=0;F<p-1;F++){for(K<F+1&&(K=F+1);K<p&&$[K]-$[F]<_;)K++;const j=Math.max(0,K-(F+1));if(w[F]=j,T+=j,j>0){const Y=$[K-1]-$[F];N=Math.max(N,Y)}if(K<p){const Y=$[K]-$[F];U=Math.min(U,Y)}}if(T===m||T===v-1)return m<v?.5*(N+U):T===m?N:U;if(T===z){let F=1/0,j=-1/0,Y=0;for(let ie=0;ie<p-1;ie++){const ye=M[ie],ge=x[ie];if(ye>ge)continue;const me=$[ye]-$[ie],xe=$[ge]-$[ie];F=Math.min(F,me),j=Math.max(j,xe),Y+=ge-ye+1}if(Y<=0)return m<v?.5*(N+U):T>=m?N:U;if(j<=F)return F;const re=.5*(F+j);_=re>F&&re<=j?re:j,z=T;continue}if(T<m)for(let F=0;F<p-1;F++){const j=F+1+w[F];j>M[F]&&(M[F]=j),M[F]>x[F]&&(M[F]=1,x[F]=0)}else for(let F=0;F<p-1;F++){const j=F+w[F];j<x[F]&&(x[F]=j),x[F]<F+1&&(M[F]=1,x[F]=0)}z=T;let I=0;for(let F=0;F<p-1;F++)M[F]<=x[F]&&(I+=x[F]-M[F]+1);if(I<=2){let F=1/0,j=-1/0;for(let Y=0;Y<p-1;Y++){if(M[Y]>x[Y])continue;const re=$[M[Y]]-$[Y],ie=$[x[Y]]-$[Y];F=Math.min(F,re),j=Math.max(j,ie)}return I<=0?m<v?.5*(N+U):T>=m?N:U:m<v?.5*(F+j):Math.abs(m-1-T)<=Math.abs(T-m)?F:j}else{const F=y.uniformInt(0,I);let j=0,Y=0;for(Y=0;Y<p-1;Y++){if(M[Y]>x[Y])continue;const ie=x[Y]-M[Y]+1;if(F<j+ie)break;j+=ie}const re=Math.floor((M[Y]+x[Y])/2);_=$[re]-$[Y]}}}return Qo}var il={},Ju;function Ud(){if(Ju)return il;Ju=1,Object.defineProperty(il,"__esModule",{value:!0}),il.fastShift=r,il.fastRatio=u;const c=zr();function r(a,f,p,y=!1){if(!a||!f||!p)throw new Error("All inputs must be non-null");if(a.length===0||f.length===0)throw new Error("x and y must be non-empty");for(const N of p)if(isNaN(N)||N<0||N>1)throw new Error("Probabilities must be within [0, 1]");const $=y?a:[...a].sort((N,U)=>N-U),g=y?f:[...f].sort((N,U)=>N-U);for(const N of $)if(isNaN(N))throw new Error("NaN values found in x");for(const N of g)if(isNaN(N))throw new Error("NaN values found in y");const m=$.length,v=g.length,M=BigInt(m)*BigInt(v),x=new Set,w=[],_=Number(M);for(let N=0;N<p.length;N++){const U=1+Number(M-1n)*p[N];let K=Math.floor(U),V=Math.ceil(U);const I=U-K;K<1&&(K=1),V>_&&(V=_),w.push({lowerRank:K,upperRank:V,weight:I}),x.add(K),x.add(V)}const z=new Map;for(const N of Array.from(x).sort((U,K)=>U-K))z.set(N,l($,g,N));const T=[];for(const{lowerRank:N,upperRank:U,weight:K}of w){const V=z.get(N),I=z.get(U);T.push(K===0?V:(1-K)*V+K*I)}return T}function l(a,f,p){const y=a.length,$=f.length,g=Number(BigInt(y)*BigInt($));if(p<1||p>g)throw new Error(`k must be between 1 and ${g}`);let m=a[0]-f[$-1],v=a[y-1]-f[0];if(isNaN(m)||isNaN(v))throw new Error("NaN in input values");const M=128;let x=-1/0,w=1/0;for(let _=0;_<M&&m!==v;_++){const z=s(m,v),{countLessOrEqual:T,closestBelow:N,closestAbove:U}=o(a,f,z);if(N===U)return N;if(m===x&&v===w)return T>=p?N:U;x=m,w=v,T>=p?v=N:m=U}if(m!==v)throw new Error("Convergence failure (pathological input)");return m}function o(a,f,p){const y=a.length,$=f.length;let g=0,m=-1/0,v=1/0,M=0;for(let x=0;x<y;x++){for(;M<$&&a[x]-f[M]>p;)M++;if(g+=$-M,M<$){const w=a[x]-f[M];w>m&&(m=w)}if(M>0){const w=a[x]-f[M-1];w<v&&(v=w)}}return isFinite(m)||(m=a[0]-f[$-1]),isFinite(v)||(v=a[y-1]-f[0]),{countLessOrEqual:g,closestBelow:m,closestAbove:v}}function s(a,f){return a+(f-a)*.5}function u(a,f,p,y=!1){if(!a||!f||!p)throw new Error("All inputs must be non-null");if(a.length===0||f.length===0)throw new Error("x and y must be non-empty");const $=(0,c.log)(a,"x"),g=(0,c.log)(f,"y");return r($,g,p,y).map(v=>Math.exp(v))}return il}var Fo={},Lo={},e0;function L0(){if(e0)return Lo;e0=1,Object.defineProperty(Lo,"__esModule",{value:!0}),Lo.gaussCdf=c;function c(r){let l;if(Math.abs(r)<1e-9)l=0;else{let o=Math.abs(r)/2;if(o>=3)l=1;else if(o<1){const s=o*o;l=((((((((.000124818987*s-.001075204047)*s+.005198775019)*s-.019198292004)*s+.059054035642)*s-.151968751364)*s+.319152932694)*s-.5319230073)*s+.797884560593)*o*2}else o=o-2,l=(((((((((((((-45255659e-12*o+.00015252929)*o-19538132e-12)*o-.000676904986)*o+.001390604284)*o-.00079462082)*o-.002034254874)*o+.006549791214)*o-.010557625006)*o+.011630447319)*o-.009279453341)*o+.005353579108)*o-.002141268741)*o+.000535310849)*o+.999936657524}return r>0?(l+1)/2:(1-l)/2}return Lo}var sl={},t0;function No(){if(t0)return sl;t0=1,Object.defineProperty(sl,"__esModule",{value:!0}),sl.minAchievableMisrateOneSample=r,sl.minAchievableMisrateTwoSample=l;const c=zr();function r(s){if(s<=0)throw c.AssumptionError.domain("x");return Math.pow(2,1-s)}function l(s,u){if(s<=0)throw c.AssumptionError.domain("x");if(u<=0)throw c.AssumptionError.domain("y");return 2/o(s+u,s)}function o(s,u){if(u>s)return 0;if(u===0||u===s)return 1;u=Math.min(u,s-u);let a=1;for(let f=0;f<u;f++)a=a*(s-f)/(f+1);return a}return sl}var r0;function Vd(){if(r0)return Fo;r0=1,Object.defineProperty(Fo,"__esModule",{value:!0}),Fo.pairwiseMargin=u;const c=zr(),r=L0(),l=No(),o=400,s=65;function u(x,w,_){if(x<=0)throw c.AssumptionError.domain("x");if(w<=0)throw c.AssumptionError.domain("y");if(_<0||_>1||Number.isNaN(_))throw c.AssumptionError.domain("misrate");const z=(0,l.minAchievableMisrateTwoSample)(x,w);if(_<z)throw c.AssumptionError.domain("misrate");return x+w<=o?a(x,w,_):f(x,w,_)}function a(x,w,_){return p(x,w,_/2)*2}function f(x,w,_){return y(x,w,_/2)*2}function p(x,w,_){const z=x+w<s?g(x+w,w):m(x+w,w),T=[1],N=[0];let U=0,K=1/z;if(K>=_)return 0;for(;;){if(U++,N.length<=U){let I=0;for(let F=1;F<=x;F++)U%F===0&&U>=F&&(I+=F);for(let F=w+1;F<=w+x;F++)U%F===0&&U>=F&&(I-=F);N.push(I)}let V=0;for(let I=0;I<U;I++)V+=T[I]*N[U-I];if(V/=U,T.push(V),K+=V/z,K>=_)return U;if(V===0)break}return T.length-1}function y(x,w,_){let z=0,T=x*w;for(;z<T-1;){const N=Math.floor((z+T)/2);$(x,w,N)<_?z=N:T=N}return $(x,w,T)<_?T:z}function $(x,w,_){const z=x*w/2,T=Math.sqrt(x*w*(x+w+1)/12),N=(_-z-.5)/T,U=Math.exp(-N*N/2)/Math.sqrt(2*Math.PI),K=(0,r.gaussCdf)(N),V=x*x,I=V*x,F=V*V,j=w*w,Y=j*w,re=j*j,ie=x*w*(x+w+1)/12,ye=x*w*(x+w+1)*(5*w*x*(w+x)-2*(j+V)+3*w*x-2*(x+w))/240,ge=x*w*(x+w+1)*(35*j*V*(j+V)+70*Y*I-42*w*x*(Y+I)-14*j*V*(x+w)+16*(F+re)-52*x*w*(V+j)-43*V*j+32*(Y+I)+14*w*x*(x+w)+8*(V+j)+16*x*w-8*(x+w))/4032,me=ie*ie,xe=me*ie,q=ye/me,te=(q-3)/24,J=(ge/xe-15*q+30)/720,L=35*(q-3)*(q-3)/40320,B=N*N,ce=B*N,ue=ce*B,he=ue*B,$e=-U*(ce-3*N),G=-U*(ue-10*ce+15*N),le=-U*(he-21*ue+105*ce-105*N),fe=K+te*$e+J*G+L*le;return Math.max(0,Math.min(1,fe))}function g(x,w){if(w>x)return 0;if(w===0||w===x)return 1;w=Math.min(w,x-w);let _=1;for(let z=0;z<w;z++)_=_*(x-z)/(z+1);return _}function m(x,w){if(w>x)return 0;if(w===0||w===x)return 1;w=Math.min(w,x-w);const _=v(x)-v(w)-v(x-w);return Math.exp(_)}function v(x){if(x===0||x===1)return 0;const w=x+1;return w<1e-5?0:w<1?M(w+3)-Math.log(w*(w+1)*(w+2)):w<2?M(w+2)-Math.log(w*(w+1)):w<3?M(w+1)-Math.log(w):M(w)}function M(x){let w=x*Math.log(x)-x+Math.log(2*Math.PI/x)/2;const _=1/6,z=-1/30,T=1/42,N=-1/30,U=5/66,K=x*x,V=K*x,I=V*K,F=I*K,j=F*K;return w+=_/(2*x)+z/(12*V)+T/(30*I)+N/(56*F)+U/(90*j),w}return Fo}var _o={},n0;function Hd(){if(n0)return _o;n0=1,Object.defineProperty(_o,"__esModule",{value:!0}),_o.signedRankMargin=s;const c=L0(),r=No(),l=zr(),o=63;function s($,g){if($<=0)throw l.AssumptionError.domain("x");if(isNaN(g)||g<0||g>1)throw l.AssumptionError.domain("misrate");const m=(0,r.minAchievableMisrateOneSample)($);if(g<m)throw l.AssumptionError.domain("misrate");return $<=o?u($,g):f($,g)}function u($,g){return a($,g/2)*2}function a($,g){const m=BigInt(1)<<BigInt($),v=Math.floor($*($+1)/2),M=new Array(v+1).fill(BigInt(0));M[0]=BigInt(1);for(let _=1;_<=$;_++){const z=Math.min(Math.floor(_*(_+1)/2),v);for(let T=z;T>=_;T--)M[T]=M[T]+M[T-_]}const x=BigInt(10)**BigInt(18);let w=BigInt(0);for(let _=0;_<=v;_++)if(w=w+M[_],Number(w*x/m)/Number(x)>=g)return _;return v}function f($,g){return p($,g/2)*2}function p($,g){const m=Math.floor($*($+1)/2);let v=0,M=m;for(;v<M-1;){const x=Math.floor((v+M)/2);y($,x)<g?v=x:M=x}return y($,M)<g?M:v}function y($,g){const m=$*($+1)/4,v=$*($+1)*(2*$+1)/24,M=Math.sqrt(v),x=(g-m+.5)/M,w=Math.exp(-x*x/2)/Math.sqrt(2*Math.PI),_=(0,c.gaussCdf)(x),T=-$*($+1)*(2*$+1)*(3*$*$+3*$-1)/240/(24*v*v),U=x*x*x,K=-w*(U-3*x),V=_+T*K;return Math.max(0,Math.min(1,V))}return _o}var Po={},l0;function Zd(){if(l0)return Po;l0=1,Object.defineProperty(Po,"__esModule",{value:!0}),Po.signMarginRandomized=l;const c=No(),r=zr();function l(a,f,p){if(a<=0)throw r.AssumptionError.domain("x");if(isNaN(f)||f<0||f>1)throw r.AssumptionError.domain("misrate");const y=(0,c.minAchievableMisrateOneSample)(a);if(f<y)throw r.AssumptionError.domain("misrate");const $=f/2;if($<=0)return 0;if($>=1)return a*2;const[g,m,v]=o(a,$),M=Math.log($),x=M>m?u(M,m):-1/0;let w=isFinite(v)&&isFinite(x)?Math.exp(x-v):0;return w=Math.max(0,Math.min(1,w)),(p.uniformFloat()<w?g+1:g)*2}function o(a,f){const p=Math.log(f);let y=-a*Math.LN2,$=y,g=0;if($>p)return[0,$,y];for(let m=1;m<=a;m++){const v=y+Math.log(a-m+1)-Math.log(m),M=s($,v);if(M>p)return[g,$,v];g=m,y=v,$=M}return[g,$,-1/0]}function s(a,f){if(a===-1/0)return f;if(f===-1/0)return a;const p=Math.max(a,f);return p+Math.log(Math.exp(a-p)+Math.exp(f-p))}function u(a,f){if(f===-1/0)return a;const p=Math.exp(f-a);return p>=1?-1/0:a+Math.log(1-p)}return Po}var bo={},o0;function Wd(){if(o0)return bo;o0=1,Object.defineProperty(bo,"__esModule",{value:!0}),bo.fastCenterQuantileBounds=o;const c=1e-14;function r(s,u){const a=s.length;let f=0,p=a-1;for(let y=0;y<a;y++){const $=2*u-s[y];for(;p>=0&&s[p]>$;)p--;p>=y&&(f+=p-y+1)}return f}function l(s,u){const a=s.length,f=a*(a+1)/2;if(a===1||u===1)return s[0];if(u===f)return s[a-1];const p=s[0],y=s[a-1];let $=p,g=y;for(;g-$>c*Math.max(1,Math.abs($),Math.abs(g));){const M=($+g)/2;r(s,M)<u?$=M:g=M}const m=($+g)/2,v=[];for(let M=0;M<a;M++){const x=2*m-s[M];let w=M,_=a;for(;w<_;){const z=Math.floor((w+_)/2);s[z]<x-c?w=z+1:_=z}if(w<a&&w>=M&&Math.abs(s[w]-x)<c*Math.max(1,Math.abs(x))&&v.push((s[M]+s[w])/2),w>M){const z=(s[M]+s[w-1])/2;z<=m+c&&v.push(z)}}if(v.length===0)return m;v.sort((M,x)=>M-x);for(const M of v)if(r(s,M)>=u)return M;return m}function o(s,u,a){const f=s.length,p=f*(f+1)/2,y=Math.max(1,Math.min(u,p)),$=Math.max(1,Math.min(a,p)),g=l(s,y),m=l(s,$);return g>m?[m,g]:[g,m]}return bo}var i0;function qd(){return i0||(i0=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.DEFAULT_MISRATE=void 0,c.center=g,c.spread=m,c.relSpread=v,c.shift=M,c.ratio=x,c.disparity=_,c.shiftBounds=z,c.ratioBounds=T,c.centerBounds=N,c.spreadBounds=U,c.disparityBounds=V,c._avgSpread=w,c._avgSpreadBounds=K;const r=Rd(),l=Od(),o=Ud(),s=Vd(),u=Hd(),a=Zd(),f=Wd(),p=No(),y=zr(),$=Ao();function g(I){return(0,y.checkValidity)(I,"x"),(0,r.fastCenter)(I)}function m(I){(0,y.checkValidity)(I,"x");const F=(0,l.fastSpread)(I);if(F<=0)throw y.AssumptionError.sparity("x");return F}function v(I){(0,y.checkValidity)(I,"x"),(0,y.checkPositivity)(I,"x");const F=(0,r.fastCenter)(I);return(0,l.fastSpread)(I)/Math.abs(F)}function M(I,F){return(0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y"),(0,o.fastShift)(I,F,[.5],!1)[0]}function x(I,F){return(0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y"),(0,y.checkPositivity)(I,"x"),(0,y.checkPositivity)(F,"y"),(0,o.fastRatio)(I,F,[.5],!1)[0]}function w(I,F){(0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y");const j=I.length,Y=F.length,re=(0,l.fastSpread)(I);if(re<=0)throw y.AssumptionError.sparity("x");const ie=(0,l.fastSpread)(F);if(ie<=0)throw y.AssumptionError.sparity("y");return(j*re+Y*ie)/(j+Y)}function _(I,F){(0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y");const j=I.length,Y=F.length,re=(0,l.fastSpread)(I);if(re<=0)throw y.AssumptionError.sparity("x");const ie=(0,l.fastSpread)(F);if(ie<=0)throw y.AssumptionError.sparity("y");const ye=(0,o.fastShift)(I,F,[.5],!1)[0],ge=(j*re+Y*ie)/(j+Y);return ye/ge}c.DEFAULT_MISRATE=.001;function z(I,F,j=c.DEFAULT_MISRATE){(0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y");const Y=I.length,re=F.length;if(isNaN(j)||j<0||j>1)throw y.AssumptionError.domain("misrate");const ie=(0,p.minAchievableMisrateTwoSample)(Y,re);if(j<ie)throw y.AssumptionError.domain("misrate");const ye=[...I].sort((fe,Ce)=>fe-Ce),ge=[...F].sort((fe,Ce)=>fe-Ce),me=BigInt(Y)*BigInt(re);if(me===1n){const fe=ye[0]-ge[0];return{lower:fe,upper:fe}}const xe=BigInt((0,s.pairwiseMargin)(Y,re,j)),q=(me-1n)/2n;let te=xe/2n;te>q&&(te=q);const J=te,L=me-1n-te,B=Number(me-1n)||1,ce=Number(J)/B,ue=Number(L)/B,[he,$e]=(0,o.fastShift)(ye,ge,[ce,ue],!0),G=Math.min(he,$e),le=Math.max(he,$e);return{lower:G,upper:le}}function T(I,F,j=c.DEFAULT_MISRATE){if((0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y"),isNaN(j)||j<0||j>1)throw y.AssumptionError.domain("misrate");const Y=(0,p.minAchievableMisrateTwoSample)(I.length,F.length);if(j<Y)throw y.AssumptionError.domain("misrate");const re=(0,y.log)(I,"x"),ie=(0,y.log)(F,"y"),ye=z(re,ie,j);return{lower:Math.exp(ye.lower),upper:Math.exp(ye.upper)}}function N(I,F=c.DEFAULT_MISRATE){if((0,y.checkValidity)(I,"x"),isNaN(F)||F<0||F>1)throw y.AssumptionError.domain("misrate");const j=I.length;if(j<2)throw y.AssumptionError.domain("x");const Y=(0,p.minAchievableMisrateOneSample)(j);if(F<Y)throw y.AssumptionError.domain("misrate");const re=BigInt(j)*BigInt(j+1)/2n,ie=BigInt((0,u.signedRankMargin)(j,F)),ye=(re-1n)/2n;let ge=ie/2n;ge>ye&&(ge=ye);const me=Number(ge+1n),xe=Number(re-ge),q=[...I].sort((L,B)=>L-B),[te,J]=(0,f.fastCenterQuantileBounds)(q,me,xe);return{lower:te,upper:J}}function U(I,F=c.DEFAULT_MISRATE,j){if((0,y.checkValidity)(I,"x"),isNaN(F)||F<0||F>1)throw y.AssumptionError.domain("misrate");const Y=I.length,re=Math.floor(Y/2),ie=(0,p.minAchievableMisrateOneSample)(re);if(F<ie)throw y.AssumptionError.domain("misrate");if(I.length<2||(0,l.fastSpread)(I)<=0)throw y.AssumptionError.sparity("x");const ye=j!==void 0?new $.Rng(j):new $.Rng,ge=(0,a.signMarginRandomized)(re,F,ye);let me=Math.floor(ge/2);const xe=Math.floor((re-1)/2);me>xe&&(me=xe);const q=me+1,te=re-me,J=Array.from({length:Y},(ce,ue)=>ue),L=ye.shuffle(J),B=[];for(let ce=0;ce<re;ce++){const ue=L[2*ce],he=L[2*ce+1];B.push(Math.abs(I[ue]-I[he]))}return B.sort((ce,ue)=>ce-ue),{lower:B[q-1],upper:B[te-1]}}function K(I,F,j=c.DEFAULT_MISRATE,Y){if((0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y"),isNaN(j)||j<0||j>1)throw y.AssumptionError.domain("misrate");const re=I.length,ie=F.length;if(re<2)throw y.AssumptionError.domain("x");if(ie<2)throw y.AssumptionError.domain("y");const ye=j/2,ge=(0,p.minAchievableMisrateOneSample)(Math.floor(re/2)),me=(0,p.minAchievableMisrateOneSample)(Math.floor(ie/2));if(ye<ge||ye<me)throw y.AssumptionError.domain("misrate");if((0,l.fastSpread)(I)<=0)throw y.AssumptionError.sparity("x");if((0,l.fastSpread)(F)<=0)throw y.AssumptionError.sparity("y");const xe=U(I,ye,Y),q=U(F,ye,Y),te=re/(re+ie),J=ie/(re+ie);return{lower:te*xe.lower+J*q.lower,upper:te*xe.upper+J*q.upper}}function V(I,F,j=c.DEFAULT_MISRATE,Y){if((0,y.checkValidity)(I,"x"),(0,y.checkValidity)(F,"y"),isNaN(j)||j<0||j>1)throw y.AssumptionError.domain("misrate");const re=I.length,ie=F.length;if(re<2)throw y.AssumptionError.domain("x");if(ie<2)throw y.AssumptionError.domain("y");const ye=(0,p.minAchievableMisrateTwoSample)(re,ie),ge=(0,p.minAchievableMisrateOneSample)(Math.floor(re/2)),me=(0,p.minAchievableMisrateOneSample)(Math.floor(ie/2)),xe=2*Math.max(ge,me);if(j<ye+xe)throw y.AssumptionError.domain("misrate");const q=j-(ye+xe),te=ye+q/2,J=xe+q/2;if((0,l.fastSpread)(I)<=0)throw y.AssumptionError.sparity("x");if((0,l.fastSpread)(F)<=0)throw y.AssumptionError.sparity("y");const L=z(I,F,te),B=K(I,F,J,Y),ce=B.lower,ue=B.upper,he=L.lower,$e=L.upper;if(ce>0){const G=he/ce,le=he/ue,fe=$e/ce,Ce=$e/ue,Ne=Math.min(G,le,fe,Ce),Xe=Math.max(G,le,fe,Ce);return{lower:Ne,upper:Xe}}return ue<=0?he===0&&$e===0?{lower:0,upper:0}:he>=0?{lower:0,upper:1/0}:$e<=0?{lower:-1/0,upper:0}:{lower:-1/0,upper:1/0}:he>0?{lower:he/ue,upper:1/0}:$e<0?{lower:-1/0,upper:$e/ue}:he===0&&$e===0?{lower:0,upper:0}:he===0&&$e>0?{lower:0,upper:1/0}:he<0&&$e===0?{lower:-1/0,upper:0}:{lower:-1/0,upper:1/0}}})(Bs)),Bs}var js={},cl={},s0;function Yd(){if(s0)return cl;s0=1,Object.defineProperty(cl,"__esModule",{value:!0}),cl.Uniform=void 0;class c{constructor(l,o){if(l>=o)throw new Error("min must be less than max");this.min=l,this.max=o}sample(l){return this.min+l.uniformFloat()*(this.max-this.min)}samples(l,o){return Array.from({length:o},()=>this.sample(l))}}return cl.Uniform=c,cl}var al={},jr={},c0;function Vs(){return c0||(c0=1,Object.defineProperty(jr,"__esModule",{value:!0}),jr.SMALLEST_POSITIVE_SUBNORMAL=jr.MACHINE_EPSILON=void 0,jr.MACHINE_EPSILON=2220446049250313e-31,jr.SMALLEST_POSITIVE_SUBNORMAL=5e-324),jr}var a0;function _0(){if(a0)return al;a0=1,Object.defineProperty(al,"__esModule",{value:!0}),al.Additive=void 0;const c=Vs();class r{constructor(o,s){if(s<=0)throw new Error("stdDev must be positive");this.mean=o,this.stdDev=s}sample(o){let s=o.uniformFloat();const u=o.uniformFloat();s===0&&(s=c.SMALLEST_POSITIVE_SUBNORMAL);const a=Math.sqrt(-2*Math.log(s)),f=2*Math.PI*u,p=a*Math.cos(f);return this.mean+p*this.stdDev}samples(o,s){return Array.from({length:s},()=>this.sample(o))}}return al.Additive=r,al}var ul={},u0;function Gd(){if(u0)return ul;u0=1,Object.defineProperty(ul,"__esModule",{value:!0}),ul.Multiplic=void 0;const c=_0();class r{constructor(o,s){if(s<=0)throw new Error("logStdDev must be positive");this.additive=new c.Additive(o,s)}sample(o){return Math.exp(this.additive.sample(o))}samples(o,s){return Array.from({length:s},()=>this.sample(o))}}return ul.Multiplic=r,ul}var fl={},f0;function Xd(){if(f0)return fl;f0=1,Object.defineProperty(fl,"__esModule",{value:!0}),fl.Exp=void 0;const c=Vs();class r{constructor(o){if(o<=0)throw new Error("rate must be positive");this.rate=o}sample(o){let s=o.uniformFloat();return s===1&&(s=1-c.MACHINE_EPSILON),-Math.log(1-s)/this.rate}samples(o,s){return Array.from({length:s},()=>this.sample(o))}}return fl.Exp=r,fl}var dl={},d0;function Kd(){if(d0)return dl;d0=1,Object.defineProperty(dl,"__esModule",{value:!0}),dl.Power=void 0;const c=Vs();class r{constructor(o,s){if(o<=0)throw new Error("min must be positive");if(s<=0)throw new Error("shape must be positive");this.min=o,this.shape=s}sample(o){let s=o.uniformFloat();return s===1&&(s=1-c.MACHINE_EPSILON),this.min/Math.pow(1-s,1/this.shape)}samples(o,s){return Array.from({length:s},()=>this.sample(o))}}return dl.Power=r,dl}var p0;function Jd(){return p0||(p0=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.Power=c.Exp=c.Multiplic=c.Additive=c.Uniform=void 0;var r=Yd();Object.defineProperty(c,"Uniform",{enumerable:!0,get:function(){return r.Uniform}});var l=_0();Object.defineProperty(c,"Additive",{enumerable:!0,get:function(){return l.Additive}});var o=Gd();Object.defineProperty(c,"Multiplic",{enumerable:!0,get:function(){return o.Multiplic}});var s=Xd();Object.defineProperty(c,"Exp",{enumerable:!0,get:function(){return s.Exp}});var u=Kd();Object.defineProperty(c,"Power",{enumerable:!0,get:function(){return u.Power}})})(js)),js}var h0;function ep(){return h0||(h0=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.Power=c.Exp=c.Multiplic=c.Additive=c.Uniform=c.Rng=c.disparityBounds=c.spreadBounds=c.centerBounds=c.ratioBounds=c.shiftBounds=c.disparity=c.ratio=c.shift=c.relSpread=c.spread=c.center=c.DEFAULT_MISRATE=c.AssumptionError=c.AssumptionId=void 0;var r=zr();Object.defineProperty(c,"AssumptionId",{enumerable:!0,get:function(){return r.AssumptionId}}),Object.defineProperty(c,"AssumptionError",{enumerable:!0,get:function(){return r.AssumptionError}});var l=qd();Object.defineProperty(c,"DEFAULT_MISRATE",{enumerable:!0,get:function(){return l.DEFAULT_MISRATE}}),Object.defineProperty(c,"center",{enumerable:!0,get:function(){return l.center}}),Object.defineProperty(c,"spread",{enumerable:!0,get:function(){return l.spread}}),Object.defineProperty(c,"relSpread",{enumerable:!0,get:function(){return l.relSpread}}),Object.defineProperty(c,"shift",{enumerable:!0,get:function(){return l.shift}}),Object.defineProperty(c,"ratio",{enumerable:!0,get:function(){return l.ratio}}),Object.defineProperty(c,"disparity",{enumerable:!0,get:function(){return l.disparity}}),Object.defineProperty(c,"shiftBounds",{enumerable:!0,get:function(){return l.shiftBounds}}),Object.defineProperty(c,"ratioBounds",{enumerable:!0,get:function(){return l.ratioBounds}}),Object.defineProperty(c,"centerBounds",{enumerable:!0,get:function(){return l.centerBounds}}),Object.defineProperty(c,"spreadBounds",{enumerable:!0,get:function(){return l.spreadBounds}}),Object.defineProperty(c,"disparityBounds",{enumerable:!0,get:function(){return l.disparityBounds}});var o=Ao();Object.defineProperty(c,"Rng",{enumerable:!0,get:function(){return o.Rng}});var s=Jd();Object.defineProperty(c,"Uniform",{enumerable:!0,get:function(){return s.Uniform}}),Object.defineProperty(c,"Additive",{enumerable:!0,get:function(){return s.Additive}}),Object.defineProperty(c,"Multiplic",{enumerable:!0,get:function(){return s.Multiplic}}),Object.defineProperty(c,"Exp",{enumerable:!0,get:function(){return s.Exp}}),Object.defineProperty(c,"Power",{enumerable:!0,get:function(){return s.Power}})})(Ts)),Ts}var tp=ep();function P0(c){return new tp.Rng(c)}function b0(c,r,l){r/=100,l/=100;const o=(1-Math.abs(2*l-1))*r,s=o*(1-Math.abs(c/60%2-1)),u=l-o/2;let a=0,f=0,p=0;0<=c&&c<60?(a=o,f=s,p=0):60<=c&&c<120?(a=s,f=o,p=0):120<=c&&c<180?(a=0,f=o,p=s):180<=c&&c<240?(a=0,f=s,p=o):240<=c&&c<300?(a=s,f=0,p=o):300<=c&&c<360&&(a=o,f=0,p=s);const y=$=>{const g=Math.round(($+u)*255).toString(16);return g.length===1?"0"+g:g};return`#${y(a)}${y(f)}${y(p)}`}function Mt(c){const r=c.uniformInt(0,360),l=c.uniformInt(50,90),o=c.uniformInt(40,70);return b0(r,l,o)}function S(c,r=20){const l=parseInt(c.slice(1),16),o=Math.max(0,(l>>16)-r),s=Math.max(0,(l>>8&255)-r),u=Math.max(0,(l&255)-r);return`#${(o<<16|s<<8|u).toString(16).padStart(6,"0")}`}function R(c,r=20){const l=parseInt(c.slice(1),16),o=Math.min(255,(l>>16)+r),s=Math.min(255,(l>>8&255)+r),u=Math.min(255,(l&255)+r);return`#${(o<<16|s<<8|u).toString(16).padStart(6,"0")}`}function D(c,r){return c[r.uniformInt(0,c.length)]}function A0(c,r,l){return l.uniformInt(c,r+1)}function rp(c){let r=5381;for(let l=0;l<c.length;l++)r=(r<<5)+r^c.charCodeAt(l);return(r>>>0).toString(16)}function np(c,r,l){const o=rp(`${c}:${r}:${l}`);return`clip-${c}-${o}`}function lp(c,r,l=100,o=""){const s=np(c,r,o);let u,a;switch(c){case"circle":u=`<circle cx="${l/2}" cy="${l/2}" r="${l/2}" fill="${r}"/>`,a=`<clipPath id="${s}"><circle cx="${l/2}" cy="${l/2}" r="${l/2}"/></clipPath>`;break;case"rounded":u=`<rect width="${l}" height="${l}" rx="15" fill="${r}"/>`,a=`<clipPath id="${s}"><rect width="${l}" height="${l}" rx="15"/></clipPath>`;break;case"square":default:u=`<rect width="${l}" height="${l}" fill="${r}"/>`,a=`<clipPath id="${s}"><rect width="${l}" height="${l}"/></clipPath>`;break}return{background:u,clipPath:a,clipId:s}}function lt(c,r,l,o=100){const{background:s}=lp(r,l,o,c);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o} ${o}" width="${o}" height="${o}">
    ${s}
    <g>${c}</g>
  </svg>`}var op={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},skinColor:{type:"color",default:"#f5d0c5"},hairColor:{type:"color",default:"#5d4e37"},eyeColor:{type:"color",default:"#3498db"},backgroundColor:{type:"color",default:"#ecf0f1"},hairStyle:{type:"select",default:"bob",options:["bob","long","curly","bald","mohawk","ponytail"]},accessory:{type:"select",default:"none",options:["none","glasses","sunglasses","earrings"]},expression:{type:"select",default:"happy",options:["happy","neutral","sad","surprised"]}};function ip(c){const{skinColor:r}=c,l=S(r,20);return`
    <ellipse cx="50" cy="55" rx="32" ry="38" fill="${r}"/>
    <ellipse cx="50" cy="58" rx="28" ry="32" fill="${l}" opacity="0.1"/>
  `}function y0(c){const{hairColor:r,hairStyle:l}=c,o=S(r,30);switch(l){case"bob":return`
        <path d="M14,38 C12,14 28,-2 50,-2 C72,-2 88,14 86,38 L86,72 C86,78 80,80 70,76 L70,40 C64,28 56,22 50,20 C44,22 36,28 30,40 L30,76 C20,80 14,78 14,72 Z" fill="${r}"/>
        <path d="M20,40 C20,26 32,14 50,14 C68,14 80,26 80,40 C72,36 62,40 50,37 C38,40 28,36 20,40 Z" fill="${r}"/>
      `;case"long":return`
        <path d="M14,36 C12,12 28,-2 50,-2 C72,-2 88,12 86,36 L86,80 C86,94 78,98 72,90 C68,84 66,56 64,40 C60,28 56,22 50,20 C44,22 40,28 36,40 C34,56 32,84 28,90 C22,98 14,94 14,80 Z" fill="${r}"/>
      `;case"curly":return`
        <path d="M14,44 C10,32 14,20 26,14 C34,6 42,2 50,2 C58,2 66,6 74,14 C86,20 90,32 86,44 C82,36 68,34 50,34 C32,34 18,36 14,44 Z" fill="${r}"/>
        <circle cx="14" cy="36" r="10" fill="${r}"/>
        <circle cx="86" cy="36" r="10" fill="${r}"/>
        <circle cx="22" cy="18" r="10" fill="${r}"/>
        <circle cx="78" cy="18" r="10" fill="${r}"/>
        <circle cx="36" cy="8" r="10" fill="${r}"/>
        <circle cx="64" cy="8" r="10" fill="${r}"/>
        <circle cx="50" cy="4" r="10" fill="${r}"/>
      `;case"bald":return`
        <circle cx="44" cy="21" r="1.5" fill="${r}" opacity="0.3"/>
        <circle cx="50" cy="19" r="1.5" fill="${r}" opacity="0.35"/>
        <circle cx="56" cy="21" r="1.5" fill="${r}" opacity="0.3"/>
        <circle cx="35" cy="27" r="1.5" fill="${r}" opacity="0.25"/>
        <circle cx="43" cy="25" r="1.5" fill="${r}" opacity="0.3"/>
        <circle cx="57" cy="25" r="1.5" fill="${r}" opacity="0.3"/>
        <circle cx="65" cy="27" r="1.5" fill="${r}" opacity="0.25"/>
        <circle cx="32" cy="33" r="1.5" fill="${r}" opacity="0.2"/>
        <circle cx="41" cy="31" r="1.5" fill="${r}" opacity="0.25"/>
        <circle cx="59" cy="31" r="1.5" fill="${r}" opacity="0.25"/>
        <circle cx="68" cy="33" r="1.5" fill="${r}" opacity="0.2"/>
      `;case"mohawk":return`
        <path d="M40,36 L40,18 L38,4 L44,14 L50,-2 L56,14 L62,4 L60,18 L60,36 Z" fill="${r}"/>
        <path d="M44,36 L44,20 L50,4 L56,20 L56,36 Z" fill="${o}"/>
      `;case"ponytail":return`
        <path d="M24,36 C24,20 36,10 50,10 C64,10 76,20 76,36 C68,28 60,26 50,26 C40,26 32,28 24,36 Z" fill="${r}"/>
        <ellipse cx="50" cy="6" rx="9" ry="10" fill="${r}"/>
        <circle cx="50" cy="14" r="3.5" fill="${o}"/>
      `;default:return""}}function sp(c){const{eyeColor:r,expression:l,hairColor:o}=c,s=S(o,35);let u="";switch(l){case"happy":u=`
        <ellipse cx="38" cy="50" rx="6" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="6" ry="6" fill="white"/>
        <circle cx="38" cy="51" r="3.2" fill="${r}"/>
        <circle cx="62" cy="51" r="3.2" fill="${r}"/>
        <circle cx="38" cy="51" r="1.6" fill="#2c3e50"/>
        <circle cx="62" cy="51" r="1.6" fill="#2c3e50"/>
        <path d="M32,47 Q38,45 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,45 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;break;case"neutral":u=`
        <ellipse cx="38" cy="50" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="50" r="2.8" fill="${r}"/>
        <circle cx="62" cy="50" r="2.8" fill="${r}"/>
        <circle cx="38" cy="50" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="50" r="1.4" fill="#2c3e50"/>
      `;break;case"sad":u=`
        <ellipse cx="38" cy="52" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="52" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="53" r="2.8" fill="${r}"/>
        <circle cx="62" cy="53" r="2.8" fill="${r}"/>
        <circle cx="38" cy="53" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="53" r="1.4" fill="#2c3e50"/>
        <path d="M32,47 Q38,48 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,48 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;break;case"surprised":u=`
        <ellipse cx="38" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <ellipse cx="62" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <circle cx="38" cy="48" r="3.5" fill="${r}"/>
        <circle cx="62" cy="48" r="3.5" fill="${r}"/>
        <circle cx="38" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="62" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="36.5" cy="46.5" r="1.4" fill="white"/>
        <circle cx="60.5" cy="46.5" r="1.4" fill="white"/>
      `;break}const a=l==="sad"?`
      <path d="M30,44 Q38,41 46,44" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,41 54,44" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `:l==="surprised"?`
      <path d="M30,40 Q38,36 46,40" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,40 Q62,36 54,40" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `:`
      <path d="M30,44 Q38,42 46,44" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,42 54,44" stroke="${s}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `;return u+a}function cp(c){const{skinColor:r,expression:l}=c,o=S(r,30),s=S(r,25),u=`<path d="M50,55 L47,68 Q50,70 53,68 L50,55" stroke="${o}" stroke-width="1.4" fill="none"/>`;let a="";switch(l){case"happy":a=`<path d="M42,78 Q50,82 58,78" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"neutral":a=`<path d="M42,80 Q50,80 58,80" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"sad":a=`<path d="M42,82 Q50,79 58,82" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"surprised":a=`<ellipse cx="50" cy="80" rx="4" ry="5.5" fill="none" stroke="${s}" stroke-width="2"/>`;break}return u+a}function ap(c){const{accessory:r}=c;switch(r){case"glasses":return`
        <circle cx="38" cy="50" r="10" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <circle cx="62" cy="50" r="10" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <line x1="48" y1="50" x2="52" y2="50" stroke="#2c3e50" stroke-width="2"/>
        <line x1="28" y1="48" x2="20" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="48" x2="80" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;case"sunglasses":return`
        <rect x="26" y="44" width="22" height="14" rx="3" fill="#2c3e50"/>
        <rect x="52" y="44" width="22" height="14" rx="3" fill="#2c3e50"/>
        <line x1="48" y1="50" x2="52" y2="50" stroke="#2c3e50" stroke-width="2"/>
        <line x1="26" y1="48" x2="18" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="74" y1="48" x2="82" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;case"earrings":return`
        <circle cx="18" cy="58" r="3" fill="#f1c40f"/>
        <circle cx="82" cy="58" r="3" fill="#f1c40f"/>
      `;default:return""}}function up(c){const{skinColor:r}=c,l=S(r,15);return`
    <ellipse cx="18" cy="55" rx="5" ry="8" fill="${r}"/>
    <ellipse cx="18" cy="55" rx="3" ry="5" fill="${l}" opacity="0.3"/>
    <ellipse cx="82" cy="55" rx="5" ry="8" fill="${r}"/>
    <ellipse cx="82" cy="55" rx="3" ry="5" fill="${l}" opacity="0.3"/>
  `}var fp=.85;function dp(c){const{backgroundShape:r,backgroundColor:l,hairStyle:o}=c,s=o==="long",u=`
    ${s?y0(c):""}
    ${up(c)}
    ${ip(c)}
    ${s?"":y0(c)}
    ${sp(c)}
    ${cp(c)}
    ${ap(c)}
  `,a=`
    <g transform="translate(50, 50) scale(${fp}) translate(-50, -50)">
      ${u}
    </g>
  `;return lt(a,r,l)}function pp(c){const r=["circle","rounded","square"],l=["bob","long","curly","bald","mohawk","ponytail"],o=["none","glasses","sunglasses","earrings"],s=["happy","neutral","sad","surprised"],u=["#f5d0c5","#e8beac","#d4a574","#c68642","#8d5524","#6b4423","#4a3728","#f9d5b8"],a=["#2c1810","#5d4e37","#8b4513","#d2691e","#ffd700","#ff6347","#4a0080","#1a1a2e"];return{backgroundShape:D(r,c),skinColor:D(u,c),hairColor:D(a,c),eyeColor:Mt(c),backgroundColor:Mt(c),hairStyle:D(l,c),accessory:D(o,c),expression:D(s,c)}}var hp={name:"People",schema:op,shapeParam:"hairStyle",generate:dp,randomize:pp},yp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},animalType:{type:"select",default:"cat",options:["cat","dog","bear","bunny","fox","panda","owl","koala","penguin","lion"]},primaryColor:{type:"color",default:"#e67e22"},secondaryColor:{type:"color",default:"#ffffff"},eyeColor:{type:"color",default:"#2ecc71"},backgroundColor:{type:"color",default:"#ecf0f1"},expression:{type:"select",default:"happy",options:["happy","sleepy","surprised","grumpy"]}};function $0(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,30),a=`
    <polygon points="18,39 25,9 40,34" fill="${r}"/>
    <polygon points="22,36 27,16 37,34" fill="${R(r,40)}"/>
    <polygon points="82,39 75,9 60,34" fill="${r}"/>
    <polygon points="78,36 73,16 63,34" fill="${R(r,40)}"/>
  `,f=`
    <ellipse cx="50" cy="55" rx="38" ry="35" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="25" ry="22" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <ellipse cx="35" cy="50" rx="8" ry="9" fill="${o}"/>
        <ellipse cx="65" cy="50" rx="8" ry="9" fill="${o}"/>
        <ellipse cx="35" cy="51" rx="4" ry="6" fill="#2c3e50"/>
        <ellipse cx="65" cy="51" rx="4" ry="6" fill="#2c3e50"/>
        <circle cx="33" cy="48" r="2" fill="white"/>
        <circle cx="63" cy="48" r="2" fill="white"/>
      `;break;case"sleepy":p=`
        <ellipse cx="35" cy="50" rx="6" ry="3" fill="${o}"/>
        <ellipse cx="65" cy="50" rx="6" ry="3" fill="${o}"/>
        <path d="M27,50 Q35,45 43,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,50 Q65,45 73,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="35" cy="48" r="10" fill="${o}"/>
        <circle cx="65" cy="48" r="10" fill="${o}"/>
        <circle cx="35" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;break;case"grumpy":p=`
        <ellipse cx="35" cy="50" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="65" cy="50" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="35" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="65" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <line x1="27" y1="43" x2="43" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="43" x2="57" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;break}const y=`
    <ellipse cx="50" cy="65" rx="5" ry="4" fill="${u}"/>
    <path d="M50,69 L50,74" stroke="${u}" stroke-width="2"/>
    <path d="M45,76 Q50,80 55,76" stroke="${u}" stroke-width="2" fill="none"/>
  `,$=`
    <line x1="10" y1="60" x2="30" y2="65" stroke="${u}" stroke-width="1.5"/>
    <line x1="10" y1="70" x2="30" y2="70" stroke="${u}" stroke-width="1.5"/>
    <line x1="10" y1="80" x2="30" y2="75" stroke="${u}" stroke-width="1.5"/>
    <line x1="90" y1="60" x2="70" y2="65" stroke="${u}" stroke-width="1.5"/>
    <line x1="90" y1="70" x2="70" y2="70" stroke="${u}" stroke-width="1.5"/>
    <line x1="90" y1="80" x2="70" y2="75" stroke="${u}" stroke-width="1.5"/>
  `;return a+f+p+y+$}function $p(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,30),a=`
    <ellipse cx="20" cy="45" rx="15" ry="25" fill="${u}"/>
    <ellipse cx="80" cy="45" rx="15" ry="25" fill="${u}"/>
  `,f=`
    <circle cx="50" cy="50" r="35" fill="${r}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <circle cx="36" cy="46" r="5" fill="${o}"/>
        <circle cx="66" cy="46" r="5" fill="${o}"/>
        <circle cx="36" cy="46" r="2" fill="#2c3e50"/>
        <circle cx="66" cy="46" r="2" fill="#2c3e50"/>
      `;break;case"sleepy":p=`
        <ellipse cx="35" cy="45" rx="5" ry="3" fill="${o}"/>
        <ellipse cx="65" cy="45" rx="5" ry="3" fill="${o}"/>
        <path d="M27,45 Q35,40 43,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,45 Q65,40 73,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="35" cy="43" r="10" fill="white"/>
        <circle cx="65" cy="43" r="10" fill="white"/>
        <circle cx="35" cy="43" r="6" fill="${o}"/>
        <circle cx="65" cy="43" r="6" fill="${o}"/>
        <circle cx="35" cy="43" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="43" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":p=`
        <circle cx="35" cy="45" r="7" fill="white"/>
        <circle cx="65" cy="45" r="7" fill="white"/>
        <circle cx="35" cy="45" r="4.5" fill="${o}"/>
        <circle cx="65" cy="45" r="4.5" fill="${o}"/>
        <circle cx="35" cy="46" r="2.5" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="2.5" fill="#2c3e50"/>
        <line x1="27" y1="38" x2="43" y2="41" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="38" x2="57" y2="41" stroke="#2c3e50" stroke-width="2"/>
      `;break}const y=`
    <ellipse cx="50" cy="62" rx="8" ry="6" fill="#2c3e50"/>
    <ellipse cx="48" cy="60" rx="2" ry="1.5" fill="#555"/>
    <path d="M50,68 L50,72" stroke="#2c3e50" stroke-width="2"/>
    <path d="M40,75 Q50,82 60,75" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `,$=s==="happy"?'<ellipse cx="50" cy="82" rx="6" ry="8" fill="#e74c3c"/>':"";return a+f+p+y+$}function kp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,30),a=`
    <circle cx="20" cy="25" r="15" fill="${r}"/>
    <circle cx="20" cy="25" r="8" fill="${u}"/>
    <circle cx="80" cy="25" r="15" fill="${r}"/>
    <circle cx="80" cy="25" r="8" fill="${u}"/>
  `,f=`
    <circle cx="50" cy="55" r="40" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="18" ry="15" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <circle cx="35" cy="48" r="7" fill="white"/>
        <circle cx="65" cy="48" r="7" fill="white"/>
        <circle cx="35" cy="48" r="4" fill="${o}"/>
        <circle cx="65" cy="48" r="4" fill="${o}"/>
        <circle cx="35" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;break;case"sleepy":p=`
        <ellipse cx="35" cy="48" rx="5" ry="2.5" fill="${o}"/>
        <ellipse cx="65" cy="48" rx="5" ry="2.5" fill="${o}"/>
        <path d="M29,48 Q35,43 41,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M59,48 Q65,43 71,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="35" cy="46" r="8" fill="white"/>
        <circle cx="65" cy="46" r="8" fill="white"/>
        <circle cx="35" cy="46" r="5" fill="${o}"/>
        <circle cx="65" cy="46" r="5" fill="${o}"/>
        <circle cx="35" cy="46" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":p=`
        <circle cx="35" cy="48" r="5" fill="${o}"/>
        <circle cx="65" cy="48" r="5" fill="${o}"/>
        <circle cx="35" cy="48" r="2.5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2.5" fill="#2c3e50"/>
        <line x1="27" y1="42" x2="43" y2="45" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="42" x2="57" y2="45" stroke="#2c3e50" stroke-width="2"/>
      `;break}return a+f+p+`
    <ellipse cx="50" cy="68" rx="7" ry="5" fill="#2c3e50"/>
    <path d="M50,73 L50,77" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,80 Q50,85 58,80" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function xp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=R(r,40),a=`
    <ellipse cx="30" cy="20" rx="10" ry="25" fill="${r}"/>
    <ellipse cx="30" cy="20" rx="5" ry="18" fill="${u}"/>
    <ellipse cx="70" cy="20" rx="10" ry="25" fill="${r}"/>
    <ellipse cx="70" cy="20" rx="5" ry="18" fill="${u}"/>
  `,f=`
    <circle cx="50" cy="60" r="35" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="15" ry="12" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <circle cx="35" cy="52" r="8" fill="${o}"/>
        <circle cx="65" cy="52" r="8" fill="${o}"/>
        <circle cx="36" cy="53" r="4" fill="#2c3e50"/>
        <circle cx="66" cy="53" r="4" fill="#2c3e50"/>
        <circle cx="34" cy="51" r="2" fill="white"/>
        <circle cx="64" cy="51" r="2" fill="white"/>
      `;break;case"sleepy":p=`
        <ellipse cx="35" cy="52" rx="5" ry="3" fill="${o}"/>
        <ellipse cx="65" cy="52" rx="5" ry="3" fill="${o}"/>
        <path d="M27,52 Q35,47 43,52" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,52 Q65,47 73,52" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="35" cy="50" r="10" fill="${o}"/>
        <circle cx="65" cy="50" r="10" fill="${o}"/>
        <circle cx="35" cy="50" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="50" r="5" fill="#2c3e50"/>
      `;break;case"grumpy":p=`
        <circle cx="35" cy="52" r="7" fill="${o}"/>
        <circle cx="65" cy="52" r="7" fill="${o}"/>
        <circle cx="35" cy="53" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="53" r="3" fill="#2c3e50"/>
        <line x1="27" y1="46" x2="43" y2="49" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="46" x2="57" y2="49" stroke="#2c3e50" stroke-width="2"/>
      `;break}return a+f+p+`
    <ellipse cx="50" cy="68" rx="5" ry="4" fill="#ffb6c1"/>
    <path d="M50,72 L45,78 M50,72 L55,78" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>
  `+`
    <circle cx="25" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
    <circle cx="75" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
  `}function gp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,25),a=`
    <polygon points="18,52 32,10 46,50" fill="${r}"/>
    <polygon points="24,50 32,22 42,48" fill="${l}"/>
    <polygon points="82,52 68,10 54,50" fill="${r}"/>
    <polygon points="76,50 68,22 58,48" fill="${l}"/>
  `,f=`
    <path d="M20 62 C22 36 38 22 50 22 C62 22 78 36 80 62 L50 92 Z" fill="${r}"/>
    <path d="M50 88 Q30 74 28 60 Q50 48 72 60 Q70 74 50 88 Z" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <ellipse cx="36" cy="50" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="64" cy="50" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="36" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="64" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <circle cx="34" cy="48" r="1.5" fill="white"/>
        <circle cx="62" cy="48" r="1.5" fill="white"/>
      `;break;case"sleepy":p=`
        <ellipse cx="36" cy="50" rx="5" ry="3" fill="${o}"/>
        <ellipse cx="64" cy="50" rx="5" ry="3" fill="${o}"/>
        <path d="M29,50 Q36,45 43,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,50 Q64,45 71,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="36" cy="48" r="9" fill="${o}"/>
        <circle cx="64" cy="48" r="9" fill="${o}"/>
        <circle cx="36" cy="48" r="5" fill="#2c3e50"/>
        <circle cx="64" cy="48" r="5" fill="#2c3e50"/>
      `;break;case"grumpy":p=`
        <ellipse cx="36" cy="50" rx="6" ry="7" fill="${o}"/>
        <ellipse cx="64" cy="50" rx="6" ry="7" fill="${o}"/>
        <ellipse cx="36" cy="51" rx="2" ry="4" fill="#2c3e50"/>
        <ellipse cx="64" cy="51" rx="2" ry="4" fill="#2c3e50"/>
        <line x1="28" y1="44" x2="44" y2="47" stroke="${u}" stroke-width="2"/>
        <line x1="72" y1="44" x2="56" y2="47" stroke="${u}" stroke-width="2"/>
      `;break}return a+f+p+`
    <polygon points="50,66 46,72 54,72" fill="#2c3e50"/>
    <path d="M50,72 L50,76" stroke="#2c3e50" stroke-width="2"/>
    <path d="M44,78 Q50,82 56,78" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function mp(c){const{expression:r,eyeColor:l}=c,o="#ffffff",s="#1a1a2e",u=`
    <circle cx="20" cy="25" r="15" fill="${s}"/>
    <circle cx="80" cy="25" r="15" fill="${s}"/>
  `,a=`
    <circle cx="50" cy="55" r="40" fill="${o}"/>
  `;let f="";switch(r){case"happy":f=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${s}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${s}"/>
        <circle cx="32" cy="50" r="6" fill="white"/>
        <circle cx="68" cy="50" r="6" fill="white"/>
        <circle cx="32" cy="50" r="4" fill="${l}"/>
        <circle cx="68" cy="50" r="4" fill="${l}"/>
        <circle cx="33" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="69" cy="51" r="2" fill="#2c3e50"/>
      `;break;case"sleepy":f=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${s}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${s}"/>
        <ellipse cx="32" cy="50" rx="5" ry="3" fill="${l}"/>
        <ellipse cx="68" cy="50" rx="5" ry="3" fill="${l}"/>
        <path d="M24,50 Q32,45 40,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M60,50 Q68,45 76,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":f=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${s}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${s}"/>
        <circle cx="32" cy="48" r="8" fill="white"/>
        <circle cx="68" cy="48" r="8" fill="white"/>
        <circle cx="32" cy="48" r="5" fill="${l}"/>
        <circle cx="68" cy="48" r="5" fill="${l}"/>
        <circle cx="32" cy="48" r="3" fill="#2c3e50"/>
        <circle cx="68" cy="48" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":f=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${s}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${s}"/>
        <circle cx="32" cy="50" r="5" fill="white"/>
        <circle cx="68" cy="50" r="5" fill="white"/>
        <circle cx="32" cy="50" r="3" fill="${l}"/>
        <circle cx="68" cy="50" r="3" fill="${l}"/>
        <circle cx="32" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="68" cy="51" r="2" fill="#2c3e50"/>
        <line x1="22" y1="38" x2="42" y2="42" stroke="${s}" stroke-width="3"/>
        <line x1="78" y1="38" x2="58" y2="42" stroke="${s}" stroke-width="3"/>
      `;break}const p=`
    <ellipse cx="50" cy="70" rx="8" ry="5" fill="${s}"/>
    <path d="M50,75 L50,80" stroke="${s}" stroke-width="2"/>
    <path d="M42,83 Q50,88 58,83" stroke="${s}" stroke-width="2" fill="none"/>
  `;return u+a+f+p}function wp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,30),a=`
    <polygon points="20,35 30,10 40,35" fill="${r}"/>
    <polygon points="25,35 30,18 35,35" fill="${u}"/>
    <polygon points="80,35 70,10 60,35" fill="${r}"/>
    <polygon points="75,35 70,18 65,35" fill="${u}"/>
  `,f=`
    <ellipse cx="50" cy="55" rx="38" ry="40" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="30" ry="32" fill="${l}"/>
  `;let p="";switch(s){case"happy":p=`
        <circle cx="35" cy="48" r="15" fill="${o}"/>
        <circle cx="65" cy="48" r="15" fill="${o}"/>
        <circle cx="35" cy="48" r="8" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="8" fill="#2c3e50"/>
        <circle cx="32" cy="45" r="4" fill="white"/>
        <circle cx="62" cy="45" r="4" fill="white"/>
      `;break;case"sleepy":p=`
        <circle cx="35" cy="48" r="15" fill="${o}"/>
        <circle cx="65" cy="48" r="15" fill="${o}"/>
        <path d="M25,48 Q35,42 45,48" stroke="#2c3e50" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M55,48 Q65,42 75,48" stroke="#2c3e50" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":p=`
        <circle cx="35" cy="48" r="17" fill="${o}"/>
        <circle cx="65" cy="48" r="17" fill="${o}"/>
        <circle cx="35" cy="48" r="10" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="10" fill="#2c3e50"/>
        <circle cx="32" cy="45" r="5" fill="white"/>
        <circle cx="62" cy="45" r="5" fill="white"/>
      `;break;case"grumpy":p=`
        <circle cx="35" cy="48" r="14" fill="${o}"/>
        <circle cx="65" cy="48" r="14" fill="${o}"/>
        <circle cx="35" cy="50" r="7" fill="#2c3e50"/>
        <circle cx="65" cy="50" r="7" fill="#2c3e50"/>
        <line x1="22" y1="35" x2="48" y2="40" stroke="${u}" stroke-width="3"/>
        <line x1="78" y1="35" x2="52" y2="40" stroke="${u}" stroke-width="3"/>
      `;break}return a+f+p+`
    <polygon points="50,60 42,72 50,82 58,72" fill="#f39c12"/>
  `}function vp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=`
    <circle cx="15" cy="35" r="20" fill="${r}"/>
    <circle cx="15" cy="35" r="12" fill="${l}"/>
    <circle cx="85" cy="35" r="20" fill="${r}"/>
    <circle cx="85" cy="35" r="12" fill="${l}"/>
  `,a=`
    <ellipse cx="50" cy="55" rx="35" ry="38" fill="${r}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${l}"/>
  `;let f="";switch(s){case"happy":f=`
        <circle cx="35" cy="48" r="7" fill="white"/>
        <circle cx="65" cy="48" r="7" fill="white"/>
        <circle cx="35" cy="48" r="4" fill="${o}"/>
        <circle cx="65" cy="48" r="4" fill="${o}"/>
        <circle cx="35" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;break;case"sleepy":f=`
        <ellipse cx="35" cy="48" rx="4.5" ry="2.5" fill="${o}"/>
        <ellipse cx="65" cy="48" rx="4.5" ry="2.5" fill="${o}"/>
        <path d="M29,48 Q35,43 41,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M59,48 Q65,43 71,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":f=`
        <circle cx="35" cy="46" r="8" fill="white"/>
        <circle cx="65" cy="46" r="8" fill="white"/>
        <circle cx="35" cy="46" r="5" fill="${o}"/>
        <circle cx="65" cy="46" r="5" fill="${o}"/>
        <circle cx="35" cy="46" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":f=`
        <circle cx="35" cy="48" r="5" fill="${o}"/>
        <circle cx="65" cy="48" r="5" fill="${o}"/>
        <circle cx="35" cy="48" r="2.5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2.5" fill="#2c3e50"/>
        <line x1="28" y1="42" x2="42" y2="45" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="42" x2="58" y2="45" stroke="#2c3e50" stroke-width="2"/>
      `;break}return u+a+f+`
    <ellipse cx="50" cy="65" rx="12" ry="10" fill="#2c3e50"/>
    <ellipse cx="48" cy="63" rx="3" ry="2" fill="#555"/>
    <path d="M50,76 L50,79" stroke="#2c3e50" stroke-width="2"/>
    <path d="M43,79 Q50,82 57,79" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function Mp(c){const{secondaryColor:r,eyeColor:l,expression:o}=c,s="#1a1a2e",u=`
    <ellipse cx="50" cy="55" rx="38" ry="42" fill="${s}"/>
    <ellipse cx="50" cy="60" rx="25" ry="32" fill="${r}"/>
  `;let a="";switch(o){case"happy":a=`
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <circle cx="36" cy="46" r="4" fill="${l}"/>
        <circle cx="66" cy="46" r="4" fill="${l}"/>
        <circle cx="36" cy="46" r="2" fill="#2c3e50"/>
        <circle cx="66" cy="46" r="2" fill="#2c3e50"/>
      `;break;case"sleepy":a=`
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <circle cx="36" cy="46" r="3.5" fill="${l}"/>
        <circle cx="66" cy="46" r="3.5" fill="${l}"/>
        <path d="M28,45 Q35,40 42,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M58,45 Q65,40 72,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":a=`
        <circle cx="35" cy="43" r="10" fill="white"/>
        <circle cx="65" cy="43" r="10" fill="white"/>
        <circle cx="35" cy="43" r="6" fill="${l}"/>
        <circle cx="65" cy="43" r="6" fill="${l}"/>
        <circle cx="35" cy="43" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="43" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":a=`
        <circle cx="35" cy="45" r="7" fill="white"/>
        <circle cx="65" cy="45" r="7" fill="white"/>
        <circle cx="35" cy="45" r="4" fill="${l}"/>
        <circle cx="65" cy="45" r="4" fill="${l}"/>
        <circle cx="35" cy="46" r="2" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="2" fill="#2c3e50"/>
        <line x1="27" y1="38" x2="43" y2="41" stroke="${s}" stroke-width="2"/>
        <line x1="73" y1="38" x2="57" y2="41" stroke="${s}" stroke-width="2"/>
      `;break}return u+a+`
    <polygon points="50,55 40,65 50,72 60,65" fill="#f39c12"/>
  `+`
    <circle cx="25" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
    <circle cx="75" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
  `}function Cp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,30),a=S(r,35),f=`
    <circle cx="50" cy="50" r="45" fill="${a}"/>
    <circle cx="25" cy="30" r="15" fill="${a}"/>
    <circle cx="75" cy="30" r="15" fill="${a}"/>
    <circle cx="15" cy="50" r="15" fill="${a}"/>
    <circle cx="85" cy="50" r="15" fill="${a}"/>
    <circle cx="25" cy="70" r="15" fill="${a}"/>
    <circle cx="75" cy="70" r="15" fill="${a}"/>
  `,p=`
    <circle cx="50" cy="55" r="32" fill="${r}"/>
    <ellipse cx="50" cy="68" rx="18" ry="14" fill="${l}"/>
  `;let y="";switch(s){case"happy":y=`
        <ellipse cx="38" cy="48" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="62" cy="48" rx="7" ry="8" fill="${o}"/>
        <ellipse cx="38" cy="49" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="62" cy="49" rx="3" ry="5" fill="#2c3e50"/>
        <circle cx="36" cy="47" r="2" fill="white"/>
        <circle cx="60" cy="47" r="2" fill="white"/>
      `;break;case"sleepy":y=`
        <ellipse cx="38" cy="48" rx="5" ry="3" fill="${o}"/>
        <ellipse cx="62" cy="48" rx="5" ry="3" fill="${o}"/>
        <path d="M31,48 Q38,43 45,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M55,48 Q62,43 69,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":y=`
        <circle cx="38" cy="46" r="9" fill="${o}"/>
        <circle cx="62" cy="46" r="9" fill="${o}"/>
        <circle cx="38" cy="46" r="5" fill="#2c3e50"/>
        <circle cx="62" cy="46" r="5" fill="#2c3e50"/>
      `;break;case"grumpy":y=`
        <ellipse cx="38" cy="48" rx="6" ry="7" fill="${o}"/>
        <ellipse cx="62" cy="48" rx="6" ry="7" fill="${o}"/>
        <ellipse cx="38" cy="49" rx="2" ry="4" fill="#2c3e50"/>
        <ellipse cx="62" cy="49" rx="2" ry="4" fill="#2c3e50"/>
        <line x1="30" y1="42" x2="46" y2="45" stroke="${u}" stroke-width="2"/>
        <line x1="70" y1="42" x2="54" y2="45" stroke="${u}" stroke-width="2"/>
      `;break}return f+p+y+`
    <ellipse cx="50" cy="65" rx="6" ry="5" fill="#2c3e50"/>
    <path d="M50,70 L50,74" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,77 Q50,82 58,77" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}var Sp={bunny:.8,koala:.78,bear:.82,panda:.82,lion:.8,cat:.85,fox:.85,owl:.85,dog:.85,penguin:.88};function Ep(c){const{backgroundShape:r,animalType:l,backgroundColor:o}=c;let s;switch(l){case"cat":s=$0(c);break;case"dog":s=$p(c);break;case"bear":s=kp(c);break;case"bunny":s=xp(c);break;case"fox":s=gp(c);break;case"panda":s=mp(c);break;case"owl":s=wp(c);break;case"koala":s=vp(c);break;case"penguin":s=Mp(c);break;case"lion":s=Cp(c);break;default:s=$0(c)}const a=`<g transform="translate(50, 50) scale(${Sp[l]??.85}) translate(-50, -50)">${s}</g>`;return lt(a,r,o)}function Qp(c){const r=["circle","rounded","square"],l=["cat","dog","bear","bunny","fox","panda","owl","koala","penguin","lion"],o=["happy","sleepy","surprised","grumpy"];return{backgroundShape:D(r,c),animalType:D(l,c),primaryColor:Mt(c),secondaryColor:"#ffffff",eyeColor:Mt(c),backgroundColor:Mt(c),expression:D(o,c)}}var Fp={name:"Animals",schema:yp,shapeParam:"animalType",generate:Ep,randomize:Qp},Lp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},backgroundColor:{type:"color",default:"#e8f4f8"},bodyColor:{type:"color",default:"#9b59b6"},eyeColor:{type:"color",default:"#ffffff"},mouthColor:{type:"color",default:"#c0392b"},bodyShape:{type:"select",default:"round",options:["round","square","blob","tall"]},eyeCount:{type:"number",default:2,min:1,max:5},hasHorns:{type:"select",default:"spikes",options:["no","spikes","curved","antlers"]},hasTeeth:{type:"select",default:"yes",options:["yes","no"]},expression:{type:"select",default:"happy",options:["happy","angry","surprised","silly"]}};function _p(c){const{bodyColor:r,bodyShape:l}=c,o=S(r,30);switch(l){case"round":return`
        <ellipse cx="50" cy="55" rx="35" ry="38" fill="${r}"/>
        <ellipse cx="50" cy="58" rx="30" ry="32" fill="${o}" opacity="0.3"/>
      `;case"square":return`
        <rect x="15" y="20" width="70" height="70" rx="10" fill="${r}"/>
        <rect x="20" y="25" width="60" height="60" rx="8" fill="${o}" opacity="0.3"/>
      `;case"blob":return`
        <path d="M20,50 Q10,30 30,20 Q50,10 70,20 Q90,30 80,50 Q90,70 70,80 Q50,95 30,80 Q10,70 20,50" fill="${r}"/>
        <path d="M25,50 Q15,32 32,23 Q50,15 68,23 Q85,32 77,50 Q85,68 68,77 Q50,88 32,77 Q15,68 25,50" fill="${o}" opacity="0.3"/>
      `;case"tall":return`
        <ellipse cx="50" cy="50" rx="25" ry="42" fill="${r}"/>
        <ellipse cx="50" cy="52" rx="20" ry="36" fill="${o}" opacity="0.3"/>
      `;default:return`<circle cx="50" cy="55" r="35" fill="${r}"/>`}}function Pp(c){const{eyeColor:r,eyeCount:l,expression:o,bodyShape:s}=c,u=[],a=s==="tall"?35:40,f=60/(l+1),p=Math.max(6,12-l);for(let y=0;y<l;y++){const $=20+f*(y+1),g=a+y%2*5;u.push(`<ellipse cx="${$}" cy="${g}" rx="${p}" ry="${p+2}" fill="${r}"/>`);let m=0,v=0;switch(o){case"angry":m=2;break;case"surprised":m=-1;break;case"silly":v=y%2===0?2:-2,m=y%2===0?2:-2;break}if(u.push(`<circle cx="${$+v}" cy="${g+m}" r="${p/2}" fill="#2c3e50"/>`),u.push(`<circle cx="${$+v-1}" cy="${g+m-1}" r="${p/5}" fill="#ffffff"/>`),o==="angry"){const M=g-p-3,x=y<l/2?3:-3;u.push(`<line x1="${$-p}" y1="${M+x}" x2="${$+p}" y2="${M-x}" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>`)}}return u.join("")}function bp(c){const{mouthColor:r,expression:l,hasTeeth:o,bodyShape:s}=c,u=s==="tall"?65:70;let a="";switch(l){case"happy":a=`<path d="M30,${u} Q50,${u+15} 70,${u}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`
          <rect x="38" y="${u-2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="48" y="${u-2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="58" y="${u-2}" width="6" height="8" fill="white" rx="1"/>
        `);break;case"angry":a=`<path d="M30,${u+5} Q50,${u-5} 70,${u+5}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`
          <polygon points="35,${u+3} 38,${u+10} 41,${u+3}" fill="white"/>
          <polygon points="47,${u+1} 50,${u+8} 53,${u+1}" fill="white"/>
          <polygon points="59,${u+3} 62,${u+10} 65,${u+3}" fill="white"/>
        `);break;case"surprised":a=`<ellipse cx="50" cy="${u+5}" rx="10" ry="12" fill="${r}"/>`;break;case"silly":a=`<path d="M30,${u} Q40,${u+10} 50,${u} Q60,${u-10} 70,${u}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`<rect x="45" y="${u-8}" width="10" height="12" fill="white" rx="2"/>`);break}return a}function Ap(c){const{bodyColor:r,hasHorns:l,bodyShape:o}=c;if(l==="no")return"";const s=S(r,45),u=R(r,12),a=o==="tall",p=(o==="tall"?8:o==="square"?20:o==="round"?17:10)+4,y=a?10:16,$=50-y,g=50+y;switch(l){case"spikes":{const m=a?13:15,v=a?10:12,M=2,x=p+6+M,w=p-m+M,_=v/2,z=v/4;return`
        <polygon points="${$-_},${x} ${$},${w} ${$+_},${x}" fill="${s}"/>
        <polygon points="${$-z},${x-1} ${$},${w+3} ${$+z},${x-1}" fill="${u}" opacity="0.7"/>
        <polygon points="${g-_},${x} ${g},${w} ${g+_},${x}" fill="${s}"/>
        <polygon points="${g-z},${x-1} ${g},${w+3} ${g+z},${x-1}" fill="${u}" opacity="0.7"/>
      `}case"curved":{const m=a?9:11,v=a?8:10,M=a?4:6,x=p+5,w=a?5:6,_=w-2,z=`M ${$-2},${x} C ${$-v},${p+2} ${$-v},${p-m} ${$+M},${p-m+2}`,T=`M ${g+2},${x} C ${g+v},${p+2} ${g+v},${p-m} ${g-M},${p-m+2}`;return`
        <path d="${z}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${T}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${z}" fill="none" stroke="${u}" stroke-width="${_}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${T}" fill="none" stroke="${u}" stroke-width="${_}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `}case"antlers":{const m=a?8:10,v=a?8:10,M=a?5:6,x=a?3:4,w=x-1,_=[`M ${$},${p+6} L ${$-4},${p-4} L ${$-v},${p-m}`,`M ${$-4},${p-2} L ${$-4-M},${p-2}`,`M ${$-6},${p-6} L ${$-6-M},${p-6}`].join(" "),z=[`M ${g},${p+6} L ${g+4},${p-4} L ${g+v},${p-m}`,`M ${g+4},${p-2} L ${g+4+M},${p-2}`,`M ${g+6},${p-6} L ${g+6+M},${p-6}`].join(" ");return`
        <path d="${_}" fill="none" stroke="${s}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${z}" fill="none" stroke="${s}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${_}" fill="none" stroke="${u}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${z}" fill="none" stroke="${u}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `}default:return""}}var Np=.88;function Ip(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${Ap(c)}
    ${_p(c)}
    ${Pp(c)}
    ${bp(c)}
  `,s=`<g transform="translate(50, 50) scale(${Np}) translate(-50, -50)">${o}</g>`;return lt(s,r,l)}function Tp(c){const r=["circle","rounded","square"],l=["round","square","blob","tall"],o=["happy","angry","surprised","silly"],s=["no","spikes","curved","antlers"],u=["yes","no"];return{backgroundShape:D(r,c),backgroundColor:Mt(c),bodyColor:Mt(c),eyeColor:"#ffffff",mouthColor:Mt(c),bodyShape:D(l,c),eyeCount:A0(1,5,c),hasHorns:D(s,c),hasTeeth:D(u,c),expression:D(o,c)}}var Dp={name:"Monsters",schema:Lp,shapeParam:"bodyShape",generate:Ip,randomize:Tp},Bp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},bodyColor:{type:"color",default:"#95a5a6"},accentColor:{type:"color",default:"#3498db"},eyeColor:{type:"color",default:"#e74c3c"},backgroundColor:{type:"color",default:"#2c3e50"},headShape:{type:"select",default:"square",options:["square","round","tall","wide","hexagon","dome"]},antennaStyle:{type:"select",default:"single",options:["single","double","none","dish","bunny","lightning"]},eyeStyle:{type:"select",default:"round",options:["round","visor","led","camera","cyclops","angry","happy"]},mouthStyle:{type:"select",default:"grille",options:["grille","speaker","smile","none","zigzag","dots","rectangle"]},hasPanel:{type:"select",default:"no",options:["yes","no"]},panelLights:{type:"number",default:3,min:1,max:5}};function jp(c){const{accentColor:r,antennaStyle:l,headShape:o}=c,s=S(r,30),u=R(r,40),a=o==="tall"?8:o==="round"||o==="dome"?15:o==="hexagon"?12:18;switch(l){case"single":return`
        <line x1="50" y1="${a}" x2="50" y2="${a-12}" stroke="${r}" stroke-width="3"/>
        <circle cx="50" cy="${a-14}" r="4" fill="${r}"/>
        <circle cx="50" cy="${a-14}" r="2" fill="${u}"/>
      `;case"double":return`
        <line x1="35" y1="${a}" x2="35" y2="${a-10}" stroke="${r}" stroke-width="2"/>
        <circle cx="35" cy="${a-12}" r="3" fill="${r}"/>
        <line x1="65" y1="${a}" x2="65" y2="${a-10}" stroke="${r}" stroke-width="2"/>
        <circle cx="65" cy="${a-12}" r="3" fill="${r}"/>
      `;case"dish":return`
        <line x1="50" y1="${a}" x2="50" y2="${a-8}" stroke="${r}" stroke-width="3"/>
        <ellipse cx="50" cy="${a-10}" rx="12" ry="5" fill="${r}"/>
        <ellipse cx="50" cy="${a-11}" rx="8" ry="3" fill="${s}"/>
      `;case"bunny":return`
        <ellipse cx="38" cy="${a-4}" rx="4" ry="9" fill="${r}"/>
        <ellipse cx="38" cy="${a-4}" rx="2.5" ry="6" fill="${u}" opacity="0.5"/>
        <ellipse cx="62" cy="${a-4}" rx="4" ry="9" fill="${r}"/>
        <ellipse cx="62" cy="${a-4}" rx="2.5" ry="6" fill="${u}" opacity="0.5"/>
      `;case"lightning":return`
        <path d="M45,${a-15} L50,${a-8} L45,${a-8} L50,${a}" fill="${r}"/>
        <path d="M55,${a-15} L50,${a-8} L55,${a-8} L50,${a}" fill="${r}" transform="scale(-1,1) translate(-100,0)"/>
      `;default:return""}}function zp(c){const{bodyColor:r,headShape:l}=c,o=S(r,25),s=R(r,30);switch(l){case"square":return`
        <rect x="18" y="18" width="64" height="64" rx="8" fill="${r}"/>
        <rect x="22" y="22" width="56" height="56" rx="6" fill="${o}" opacity="0.3"/>
        <rect x="22" y="22" width="56" height="8" fill="${s}" opacity="0.5"/>
      `;case"round":return`
        <circle cx="50" cy="50" r="38" fill="${r}"/>
        <circle cx="50" cy="50" r="32" fill="${o}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="25" ry="10" fill="${s}" opacity="0.5"/>
      `;case"tall":return`
        <rect x="22" y="8" width="56" height="80" rx="10" fill="${r}"/>
        <rect x="26" y="12" width="48" height="72" rx="8" fill="${o}" opacity="0.3"/>
        <rect x="26" y="12" width="48" height="10" fill="${s}" opacity="0.5"/>
      `;case"wide":return`
        <rect x="8" y="28" width="84" height="52" rx="8" fill="${r}"/>
        <rect x="12" y="32" width="76" height="44" rx="6" fill="${o}" opacity="0.3"/>
        <rect x="12" y="32" width="76" height="8" fill="${s}" opacity="0.5"/>
      `;case"hexagon":return`
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="${r}"/>
        <polygon points="50,15 80,33 80,67 50,85 20,67 20,33" fill="${o}" opacity="0.3"/>
        <polygon points="50,15 80,33 80,40 50,25 20,40 20,33" fill="${s}" opacity="0.5"/>
      `;case"dome":return`
        <path d="M15,60 L15,45 Q15,10 50,10 Q85,10 85,45 L85,60 Q85,85 50,85 Q15,85 15,60" fill="${r}"/>
        <path d="M20,58 L20,45 Q20,18 50,18 Q80,18 80,45 L80,58 Q80,78 50,78 Q20,78 20,58" fill="${o}" opacity="0.3"/>
        <ellipse cx="50" cy="30" rx="25" ry="12" fill="${s}" opacity="0.5"/>
      `;default:return""}}function Rp(c){const{eyeColor:r,eyeStyle:l,headShape:o}=c,s=R(r,40),u=o==="tall"?35:o==="wide"?48:o==="hexagon"?45:o==="dome"?40:42;switch(l){case"round":return`
        <circle cx="35" cy="${u}" r="10" fill="#1a1a2e"/>
        <circle cx="65" cy="${u}" r="10" fill="#1a1a2e"/>
        <circle cx="35" cy="${u}" r="6" fill="${r}"/>
        <circle cx="65" cy="${u}" r="6" fill="${r}"/>
        <circle cx="33" cy="${u-2}" r="2" fill="${s}"/>
        <circle cx="63" cy="${u-2}" r="2" fill="${s}"/>
      `;case"visor":return`
        <rect x="22" y="${u-8}" width="56" height="16" rx="4" fill="#1a1a2e"/>
        <rect x="25" y="${u-5}" width="50" height="10" rx="2" fill="${r}" opacity="0.8"/>
        <rect x="25" y="${u-5}" width="50" height="3" fill="${s}" opacity="0.5"/>
      `;case"led":return`
        <rect x="28" y="${u-6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="60" y="${u-6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="30" y="${u-4}" width="8" height="8" fill="${r}"/>
        <rect x="62" y="${u-4}" width="8" height="8" fill="${r}"/>
        <rect x="30" y="${u-4}" width="8" height="2" fill="${s}"/>
        <rect x="62" y="${u-4}" width="8" height="2" fill="${s}"/>
      `;case"camera":return`
        <circle cx="35" cy="${u}" r="12" fill="#1a1a2e"/>
        <circle cx="65" cy="${u}" r="12" fill="#1a1a2e"/>
        <circle cx="35" cy="${u}" r="8" fill="#2c3e50"/>
        <circle cx="65" cy="${u}" r="8" fill="#2c3e50"/>
        <circle cx="35" cy="${u}" r="4" fill="${r}"/>
        <circle cx="65" cy="${u}" r="4" fill="${r}"/>
        <circle cx="33" cy="${u-2}" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="63" cy="${u-2}" r="1.5" fill="white" opacity="0.8"/>
      `;case"cyclops":return`
        <circle cx="50" cy="${u}" r="15" fill="#1a1a2e"/>
        <circle cx="50" cy="${u}" r="10" fill="${r}"/>
        <circle cx="50" cy="${u}" r="5" fill="#1a1a2e"/>
        <circle cx="47" cy="${u-3}" r="3" fill="${s}"/>
      `;case"angry":return`
        <polygon points="25,${u-5} 45,${u-10} 45,${u+5} 25,${u+5}" fill="#1a1a2e"/>
        <polygon points="75,${u-5} 55,${u-10} 55,${u+5} 75,${u+5}" fill="#1a1a2e"/>
        <circle cx="35" cy="${u}" r="5" fill="${r}"/>
        <circle cx="65" cy="${u}" r="5" fill="${r}"/>
      `;case"happy":return`
        <path d="M25,${u} Q35,${u-12} 45,${u}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M55,${u} Q65,${u-12} 75,${u}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="35" cy="${u-3}" r="3" fill="${r}"/>
        <circle cx="65" cy="${u-3}" r="3" fill="${r}"/>
      `;default:return""}}function Op(c){const{accentColor:r,mouthStyle:l,headShape:o}=c,s=S(r,20),u=o==="tall"||o==="wide"?65:o==="hexagon"?68:o==="dome"?62:65;switch(l){case"grille":return`
        <rect x="32" y="${u}" width="36" height="12" rx="2" fill="#1a1a2e"/>
        <line x1="35" y1="${u+2}" x2="35" y2="${u+10}" stroke="${r}" stroke-width="2"/>
        <line x1="42" y1="${u+2}" x2="42" y2="${u+10}" stroke="${r}" stroke-width="2"/>
        <line x1="50" y1="${u+2}" x2="50" y2="${u+10}" stroke="${r}" stroke-width="2"/>
        <line x1="58" y1="${u+2}" x2="58" y2="${u+10}" stroke="${r}" stroke-width="2"/>
        <line x1="65" y1="${u+2}" x2="65" y2="${u+10}" stroke="${r}" stroke-width="2"/>
      `;case"speaker":return`
        <circle cx="50" cy="${u+6}" r="10" fill="#1a1a2e"/>
        <circle cx="50" cy="${u+6}" r="7" fill="${s}"/>
        <circle cx="50" cy="${u+6}" r="3" fill="${r}"/>
      `;case"smile":return`
        <path d="M35,${u+2} Q50,${u+15} 65,${u+2}" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;case"zigzag":return`
        <path d="M30,${u+5} L38,${u} L46,${u+10} L54,${u} L62,${u+10} L70,${u+5}" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      `;case"dots":return`
        <circle cx="35" cy="${u+6}" r="4" fill="${r}"/>
        <circle cx="50" cy="${u+6}" r="4" fill="${r}"/>
        <circle cx="65" cy="${u+6}" r="4" fill="${r}"/>
      `;case"rectangle":return`
        <rect x="35" y="${u}" width="30" height="10" rx="2" fill="#1a1a2e"/>
        <rect x="38" y="${u+2}" width="24" height="6" fill="${r}"/>
      `;default:return""}}function Up(c){const{bodyColor:r,accentColor:l,headShape:o,hasPanel:s,panelLights:u}=c,a=S(r,30),f=R(l,30);let p="";o==="square"?p=`
      <circle cx="25" cy="25" r="3" fill="${a}"/>
      <circle cx="75" cy="25" r="3" fill="${a}"/>
      <circle cx="25" cy="75" r="3" fill="${a}"/>
      <circle cx="75" cy="75" r="3" fill="${a}"/>
    `:o==="tall"?p=`
      <circle cx="30" cy="15" r="3" fill="${a}"/>
      <circle cx="70" cy="15" r="3" fill="${a}"/>
      <circle cx="30" cy="80" r="3" fill="${a}"/>
      <circle cx="70" cy="80" r="3" fill="${a}"/>
    `:o==="wide"?p=`
      <circle cx="15" cy="35" r="3" fill="${a}"/>
      <circle cx="85" cy="35" r="3" fill="${a}"/>
      <circle cx="15" cy="70" r="3" fill="${a}"/>
      <circle cx="85" cy="70" r="3" fill="${a}"/>
    `:(o==="hexagon"||o==="dome")&&(p=`
      <circle cx="30" cy="35" r="3" fill="${a}"/>
      <circle cx="70" cy="35" r="3" fill="${a}"/>
    `);let y="";if(s==="yes"){const $=o==="tall"?75:o==="dome"?68:78;y=`<rect x="30" y="${$}" width="40" height="8" rx="2" fill="${a}"/>`;const g=36/(u+1);for(let m=1;m<=u;m++){const v=32+g*m,M=[l,f,"#2ecc71","#e74c3c","#f39c12"];y+=`<circle cx="${v}" cy="${$+4}" r="2" fill="${M[(m-1)%M.length]}"/>`}}return p+y}function Vp(c){const{bodyColor:r,accentColor:l,headShape:o}=c,s=S(r,30);if(o==="wide"||o==="hexagon")return"";const u=o==="tall"?40:o==="round"||o==="dome"?48:45;return`
    <rect x="5" y="${u-8}" width="10" height="16" rx="2" fill="${r}"/>
    <rect x="85" y="${u-8}" width="10" height="16" rx="2" fill="${r}"/>
    <rect x="7" y="${u-6}" width="6" height="12" rx="1" fill="${s}" opacity="0.5"/>
    <rect x="87" y="${u-6}" width="6" height="12" rx="1" fill="${s}" opacity="0.5"/>
    <circle cx="10" cy="${u}" r="2" fill="${l}"/>
    <circle cx="90" cy="${u}" r="2" fill="${l}"/>
  `}var Hp=.85;function Zp(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${jp(c)}
    ${Vp(c)}
    ${zp(c)}
    ${Rp(c)}
    ${Op(c)}
    ${Up(c)}
  `,s=`
    <g transform="translate(50, 50) scale(${Hp}) translate(-50, -50)">
      ${o}
    </g>
  `;return lt(s,r,l)}function Wp(c){const r=["circle","rounded","square"],l=["square","round","tall","wide","hexagon","dome"],o=["single","double","none","dish","bunny","lightning"],s=["round","visor","led","camera","cyclops","angry","happy"],u=["grille","speaker","smile","none","zigzag","dots","rectangle"],a=["yes","no"],f=["#95a5a6","#7f8c8d","#bdc3c7","#34495e","#5d6d7e","#aab7b8","#839192","#616a6b","#2c3e50","#1abc9c","#e74c3c","#9b59b6","#f39c12","#d35400","#c0392b","#8e44ad"];return{backgroundShape:D(r,c),bodyColor:D(f,c),accentColor:Mt(c),eyeColor:Mt(c),backgroundColor:Mt(c),headShape:D(l,c),antennaStyle:D(o,c),eyeStyle:D(s,c),mouthStyle:D(u,c),hasPanel:D(a,c),panelLights:A0(1,5,c)}}var qp={name:"Robots",schema:Bp,shapeParam:"headShape",generate:Zp,randomize:Wp},Yp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},skinColor:{type:"color",default:"#7ed321"},eyeColor:{type:"color",default:"#1a1a2e"},backgroundColor:{type:"color",default:"#0a0a23"},headShape:{type:"select",default:"classic",options:["classic","bulbous","elongated","triangular","squid"]},eyeStyle:{type:"select",default:"large",options:["large","wrap","compound","multiple","glowing"]},antennae:{type:"select",default:"none",options:["none","straight","curved","bulbs","feelers"]},mouthStyle:{type:"select",default:"slit",options:["slit","none","small","tentacles","beak"]},markings:{type:"select",default:"none",options:["none","spots","stripes","glow","scales"]}};function Gp(c){const{skinColor:r,headShape:l}=c,o=S(r,20),s=R(r,20);switch(l){case"classic":return`
        <ellipse cx="50" cy="45" rx="28" ry="32" fill="${r}"/>
        <ellipse cx="50" cy="70" rx="12" ry="16" fill="${r}"/>
        <ellipse cx="50" cy="42" rx="24" ry="26" fill="${s}" opacity="0.3"/>
      `;case"bulbous":return`
        <ellipse cx="50" cy="50" rx="32" ry="34" fill="${r}"/>
        <ellipse cx="38" cy="38" rx="12" ry="14" fill="${s}" opacity="0.3"/>
        <ellipse cx="62" cy="38" rx="12" ry="14" fill="${s}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="16" ry="12" fill="${s}" opacity="0.2"/>
      `;case"elongated":return`
        <ellipse cx="50" cy="52" rx="20" ry="36" fill="${r}"/>
        <ellipse cx="50" cy="45" rx="16" ry="28" fill="${s}" opacity="0.2"/>
        <path d="M35,62 Q50,90 65,62" fill="${o}" opacity="0.2"/>
      `;case"triangular":return`
        <path d="M50,18 L78,70 Q50,88 22,70 Z" fill="${r}"/>
        <path d="M50,24 L70,62 Q50,75 30,62 Z" fill="${s}" opacity="0.2"/>
      `;case"squid":return`
        <ellipse cx="50" cy="40" rx="28" ry="24" fill="${r}"/>
        <ellipse cx="50" cy="36" rx="22" ry="18" fill="${s}" opacity="0.2"/>
        <path d="M28,52 Q24,70 28,80" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M40,56 Q37,74 40,84" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M50,58 Q50,76 50,86" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M60,56 Q63,74 60,84" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M72,52 Q76,70 72,80" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Xp(c){const{eyeColor:r,eyeStyle:l}=c,o=R(r,40);switch(l){case"large":return`
        <ellipse cx="38" cy="48" rx="10" ry="14" fill="${r}"/>
        <ellipse cx="62" cy="48" rx="10" ry="14" fill="${r}"/>
        <ellipse cx="36" cy="44" rx="3" ry="5" fill="${o}" opacity="0.6"/>
        <ellipse cx="60" cy="44" rx="3" ry="5" fill="${o}" opacity="0.6"/>
      `;case"wrap":return`
        <path d="M22,48 Q50,40 78,48 Q50,60 22,48" fill="${r}"/>
        <path d="M26,48 Q50,42 74,48" stroke="${o}" stroke-width="2" fill="none" opacity="0.5"/>
      `;case"compound":return`
        <ellipse cx="38" cy="48" rx="12" ry="14" fill="${r}"/>
        <ellipse cx="62" cy="48" rx="12" ry="14" fill="${r}"/>
        <circle cx="34" cy="44" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="38" cy="42" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="42" cy="44" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="35" cy="48" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="41" cy="48" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="58" cy="44" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="62" cy="42" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="66" cy="44" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="59" cy="48" r="2.5" fill="${o}" opacity="0.4"/>
        <circle cx="65" cy="48" r="2.5" fill="${o}" opacity="0.4"/>
      `;case"multiple":return`
        <ellipse cx="34" cy="50" rx="7" ry="10" fill="${r}"/>
        <ellipse cx="50" cy="44" rx="8" ry="11" fill="${r}"/>
        <ellipse cx="66" cy="50" rx="7" ry="10" fill="${r}"/>
        <ellipse cx="32" cy="47" rx="2" ry="3" fill="${o}" opacity="0.6"/>
        <ellipse cx="48" cy="41" rx="2" ry="3" fill="${o}" opacity="0.6"/>
        <ellipse cx="64" cy="47" rx="2" ry="3" fill="${o}" opacity="0.6"/>
      `;case"glowing":return`
        <ellipse cx="38" cy="48" rx="8" ry="11" fill="${r}"/>
        <ellipse cx="62" cy="48" rx="8" ry="11" fill="${r}"/>
        <ellipse cx="38" cy="48" rx="5" ry="7" fill="${o}"/>
        <ellipse cx="62" cy="48" rx="5" ry="7" fill="${o}"/>
        <ellipse cx="38" cy="48" rx="2" ry="4" fill="white" opacity="0.8"/>
        <ellipse cx="62" cy="48" rx="2" ry="4" fill="white" opacity="0.8"/>
      `;default:return""}}function Kp(c){const{skinColor:r,antennae:l}=c,o=R(r,30);switch(l){case"straight":return`
        <line x1="38" y1="22" x2="32" y2="8" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
        <line x1="62" y1="22" x2="68" y2="8" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
      `;case"curved":return`
        <path d="M38,22 Q28,12 22,14" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M62,22 Q72,12 78,14" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;case"bulbs":return`
        <line x1="38" y1="22" x2="30" y2="10" stroke="${r}" stroke-width="2"/>
        <line x1="62" y1="22" x2="70" y2="10" stroke="${r}" stroke-width="2"/>
        <circle cx="30" cy="10" r="4" fill="${o}"/>
        <circle cx="70" cy="10" r="4" fill="${o}"/>
        <circle cx="30" cy="10" r="1.5" fill="white" opacity="0.6"/>
        <circle cx="70" cy="10" r="1.5" fill="white" opacity="0.6"/>
      `;case"feelers":return`
        <path d="M40,20 Q32,10 24,12" stroke="${r}" stroke-width="2" fill="none"/>
        <path d="M38,22 Q26,14 18,18" stroke="${r}" stroke-width="2" fill="none"/>
        <path d="M60,20 Q68,10 76,12" stroke="${r}" stroke-width="2" fill="none"/>
        <path d="M62,22 Q74,14 82,18" stroke="${r}" stroke-width="2" fill="none"/>
      `;default:return""}}function Jp(c){const{skinColor:r,mouthStyle:l}=c,o=S(r,40);switch(l){case"slit":return`<line x1="44" y1="68" x2="56" y2="68" stroke="${o}" stroke-width="2" stroke-linecap="round"/>`;case"small":return`<ellipse cx="50" cy="68" rx="3" ry="2.5" fill="${o}"/>`;case"tentacles":return`
        <path d="M42,66 Q40,74 38,78" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M47,68 Q46,76 44,82" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M53,68 Q54,76 56,82" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M58,66 Q60,74 62,78" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      `;case"beak":return`
        <path d="M46,64 L50,76 L54,64 Z" fill="${o}"/>
      `;default:return""}}function e2(c){const{skinColor:r,markings:l}=c,o=S(r,25),s=R(r,40);switch(l){case"spots":return`
        <circle cx="28" cy="40" r="3" fill="${o}" opacity="0.5"/>
        <circle cx="72" cy="40" r="3" fill="${o}" opacity="0.5"/>
        <circle cx="32" cy="56" r="2.5" fill="${o}" opacity="0.5"/>
        <circle cx="68" cy="56" r="2.5" fill="${o}" opacity="0.5"/>
        <circle cx="25" cy="52" r="2" fill="${o}" opacity="0.5"/>
        <circle cx="75" cy="52" r="2" fill="${o}" opacity="0.5"/>
      `;case"stripes":return`
        <path d="M30,36 Q50,32 70,36" stroke="${o}" stroke-width="2.5" fill="none" opacity="0.4"/>
        <path d="M26,48 Q50,44 74,48" stroke="${o}" stroke-width="2.5" fill="none" opacity="0.4"/>
        <path d="M30,60 Q50,56 70,60" stroke="${o}" stroke-width="2.5" fill="none" opacity="0.4"/>
      `;case"glow":return`
        <ellipse cx="50" cy="50" rx="20" ry="16" fill="${s}" opacity="0.3"/>
        <ellipse cx="50" cy="50" rx="12" ry="10" fill="${s}" opacity="0.3"/>
      `;case"scales":return`
        <pattern id="scales" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${o}" opacity="0.2"/>
        </pattern>
        <ellipse cx="50" cy="50" rx="24" ry="28" fill="url(#scales)"/>
      `;default:return""}}function t2(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${Kp(c)}
    ${Gp(c)}
    ${e2(c)}
    ${Xp(c)}
    ${Jp(c)}
  `;return lt(o,r,l)}function r2(c){const r=["circle","rounded","square"],l=["classic","bulbous","elongated","triangular","squid"],o=["large","wrap","compound","multiple","glowing"],s=["none","straight","curved","bulbs","feelers"],u=["slit","none","small","tentacles","beak"],a=["none","spots","stripes","glow","scales"],f=["#7ed321","#4a9c2d","#2ecc71","#1abc9c","#3498db","#9b59b6","#8e44ad","#6c5ce7","#a0a0a0","#7f8c8d","#95a5a6","#bdc3c7","#e74c3c","#f39c12","#00cec9"],p=["#1a1a2e","#0f0f1a","#2c3e50","#000000","#e74c3c","#f1c40f","#9b59b6","#00ff00"],y=["#0a0a23","#1a1a2e","#16213e","#0f3460","#1b1b2f","#2c2c54","#40407a","#000000","#1e272e","#2f3640"];return{backgroundShape:D(r,c),skinColor:D(f,c),eyeColor:D(p,c),backgroundColor:D(y,c),headShape:D(l,c),eyeStyle:D(o,c),antennae:D(s,c),mouthStyle:D(u,c),markings:D(a,c)}}var n2={name:"Aliens",schema:Yp,shapeParam:"headShape",generate:t2,randomize:r2},l2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},creatureType:{type:"select",default:"octopus",options:["octopus","fish","jellyfish","crab","whale","seahorse","pufferfish","turtle","shark","starfish"]},primaryColor:{type:"color",default:"#3498db"},secondaryColor:{type:"color",default:"#ecf0f1"},eyeColor:{type:"color",default:"#2c3e50"},backgroundColor:{type:"color",default:"#1a5276"},expression:{type:"select",default:"happy",options:["happy","neutral","surprised","grumpy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","scales"]},hasBubbles:{type:"select",default:"yes",options:["yes","no"]}};function kn(c,r,l,o,s,u,a){const f=a,p=f*.5,y=f*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"neutral":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p}" fill="${r}"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"grumpy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <line x1="${l-f}" y1="${o-f}" x2="${l+f}" y2="${o-f*.5}" stroke="${r}" stroke-width="2"/>
        <line x1="${s+f}" y1="${u-f}" x2="${s-f}" y2="${u-f*.5}" stroke="${r}" stroke-width="2"/>
      `;default:return""}}function _t(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"neutral":return`<line x1="${l-5}" y1="${o}" x2="${l+5}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"grumpy":return`<path d="M${l-6},${o+3} Q${l},${o-3} ${l+6},${o+3}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;default:return""}}function or(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-s*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+s*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+s*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+s*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-s*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.3} Q${r},${l-s*.4} ${r+o*.7},${l-s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-s*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"scales":{const f=`ocean-scales-${r}-${l}`;return`
        <defs>
          <pattern id="${f}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${s*.85}" fill="url(#${f})"/>
      `}default:return""}}function o2(){return`
    <circle cx="75" cy="18" r="3" fill="white" opacity="0.25"/>
    <circle cx="80" cy="12" r="2" fill="white" opacity="0.2"/>
    <circle cx="72" cy="8" r="2.5" fill="white" opacity="0.3"/>
    <circle cx="82" cy="22" r="1.5" fill="white" opacity="0.2"/>
  `}function k0(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="38" rx="24" ry="22" fill="${r}"/>
    <ellipse cx="50" cy="42" rx="16" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <path d="M30,50 Q22,65 18,80 Q16,88 22,85" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M36,52 Q30,70 28,85 Q26,92 32,90" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M44,54 Q42,72 40,88 Q39,94 44,92" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M56,54 Q58,72 60,88 Q61,94 56,92" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M64,52 Q70,70 72,85 Q74,92 68,90" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M70,50 Q78,65 82,80 Q84,88 78,85" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,y=`
    <circle cx="22" cy="70" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="20" cy="78" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="30" cy="74" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="29" cy="82" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="70" cy="74" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="71" cy="82" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="78" cy="70" r="1.5" fill="${a}" opacity="0.5"/>
    <circle cx="80" cy="78" r="1.5" fill="${a}" opacity="0.5"/>
  `,$=kn(s,o,40,36,60,36,5),g=_t(s,a,50,48),m=or(r,50,38,24,22,u);return p+y+f+m+$+g}function i2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <path d="M15,50 L5,38 L5,62 Z" fill="${a}"/>
  `,p=`
    <ellipse cx="45" cy="50" rx="30" ry="18" fill="${r}"/>
    <ellipse cx="45" cy="55" rx="22" ry="10" fill="${l}" opacity="0.4"/>
  `,y=`
    <path d="M35,32 Q45,22 55,32" fill="${a}"/>
  `,$=`
    <path d="M38,55 Q32,65 28,68 Q36,62 40,58" fill="${a}" opacity="0.7"/>
  `,g=`
    <circle cx="58" cy="46" r="5" fill="white"/>
    <circle cx="58" cy="${s==="happy"?47:46}" r="${s==="surprised"?2:3}" fill="${o}"/>
    ${s==="happy"?'<circle cx="57" cy="45" r="1.3" fill="white"/>':""}
    ${s==="grumpy"?`<line x1="54" y1="41" x2="62" y2="43" stroke="${o}" stroke-width="1.5"/>`:""}
  `,m=_t(s,a,68,52),v=or(r,45,50,30,18,u);return f+p+y+$+v+g+m}function s2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=R(r,30),f=`
    <path d="M20,48 Q20,20 50,18 Q80,20 80,48 Z" fill="${r}" opacity="0.7"/>
    <path d="M25,46 Q25,26 50,24 Q75,26 75,46 Z" fill="${a}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="35" rx="14" ry="10" fill="${l}" opacity="0.2"/>
  `,y=`
    <path d="M28,48 Q26,58 30,68 Q34,78 30,88" stroke="${r}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M38,48 Q35,60 38,72 Q41,82 37,92" stroke="${r}" stroke-width="2.5" fill="none" opacity="0.5" stroke-linecap="round"/>
    <path d="M50,48 Q48,62 50,74 Q52,84 50,94" stroke="${r}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M62,48 Q65,60 62,72 Q59,82 63,92" stroke="${r}" stroke-width="2.5" fill="none" opacity="0.5" stroke-linecap="round"/>
    <path d="M72,48 Q74,58 70,68 Q66,78 70,88" stroke="${r}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
  `,$=`
    <path d="M20,48 Q25,52 30,48 Q35,44 40,48 Q45,52 50,48 Q55,44 60,48 Q65,52 70,48 Q75,44 80,48" stroke="${r}" stroke-width="2" fill="none" opacity="0.8"/>
  `,g=kn(s,o,42,36,58,36,4),m=_t(s,S(r,25),50,44),v=or(r,50,34,22,16,u);return y+f+p+$+v+g+m}function c2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="55" rx="28" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="58" rx="18" ry="10" fill="${l}" opacity="0.3"/>
  `,p=`
    <path d="M22,55 L12,42 L8,48 Q6,44 10,40 Q16,36 18,42 L22,48" fill="${r}" stroke="${a}" stroke-width="1"/>
    <path d="M78,55 L88,42 L92,48 Q94,44 90,40 Q84,36 82,42 L78,48" fill="${r}" stroke="${a}" stroke-width="1"/>
  `,y=`
    <line x1="28" y1="62" x2="16" y2="72" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="34" y1="66" x2="24" y2="78" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="68" x2="32" y2="82" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="72" y1="62" x2="84" y2="72" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="66" y1="66" x2="76" y2="78" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="68" x2="68" y2="82" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
  `,$=`
    <line x1="38" y1="42" x2="34" y2="30" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <line x1="62" y1="42" x2="66" y2="30" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
  `,g=kn(s,o,34,28,66,28,4),m=_t(s,a,50,60),v=or(r,50,55,28,18,u);return y+f+v+p+$+g+m}function a2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="52" rx="36" ry="26" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="28" ry="16" fill="${l}" opacity="0.5"/>
  `,p=`
    <path d="M14,52 Q6,40 4,32 Q10,38 14,42" fill="${a}"/>
    <path d="M14,52 Q6,64 4,72 Q10,66 14,62" fill="${a}"/>
  `,y=`
    <path d="M42,65 Q36,75 30,78 Q38,72 42,68" fill="${a}" opacity="0.6"/>
  `,$=s==="happy"?`
      <path d="M62,26 Q60,18 56,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M62,26 Q64,18 68,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <circle cx="54" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
      <circle cx="70" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
    `:"",g=`
    <circle cx="68" cy="48" r="5" fill="white"/>
    <circle cx="68" cy="${s==="happy"?49:48}" r="${s==="surprised"?2:3}" fill="${o}"/>
    ${s==="happy"?'<circle cx="67" cy="47" r="1.3" fill="white"/>':""}
    ${s==="grumpy"?`<line x1="64" y1="43" x2="72" y2="45" stroke="${o}" stroke-width="1.5"/>`:""}
  `,m=_t(s,a,74,56),v=or(r,50,50,36,26,u);return p+f+y+v+g+m+$}function u2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <path d="M50,16 Q62,16 62,28 Q62,40 50,44 Q38,48 38,60 Q38,72 50,76 Q54,78 52,84 Q48,90 44,88 Q38,84 40,78" fill="${r}" stroke="${a}" stroke-width="1"/>
  `,y=`
    <path d="M52,20 Q58,20 58,30 Q58,38 50,42 Q44,46 44,56 Q44,66 50,70" fill="${l}" opacity="0.3" stroke="none"/>
  `,$=`
    <path d="M50,16 Q50,12 56,10 Q60,10 60,14" fill="${r}" stroke="${a}" stroke-width="1"/>
  `,g=`
    <path d="M62,28 Q68,32 66,38 Q64,42 58,42" fill="${f}" opacity="0.6" stroke="${a}" stroke-width="0.5"/>
  `,m=`
    <line x1="48" y1="16" x2="46" y2="10" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="52" y1="14" x2="52" y2="8" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="56" y1="16" x2="58" y2="10" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,v=`
    <circle cx="56" cy="24" r="4" fill="white"/>
    <circle cx="56" cy="${s==="happy"?25:24}" r="${s==="surprised"?1.5:2.2}" fill="${o}"/>
    ${s==="happy"?'<circle cx="55" cy="23" r="1" fill="white"/>':""}
    ${s==="grumpy"?`<line x1="53" y1="20" x2="59" y2="22" stroke="${o}" stroke-width="1.2"/>`:""}
  `,M=_t(s,a,58,12),x=or(r,50,44,14,28,u);return p+y+$+g+m+x+v+M}function f2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <circle cx="50" cy="50" r="28" fill="${r}"/>
    <circle cx="50" cy="56" r="18" fill="${l}" opacity="0.3"/>
  `;let p="";for(let M=0;M<16;M++){const x=M*Math.PI*2/16,w=50+Math.cos(x)*28,_=50+Math.sin(x)*28,z=50+Math.cos(x)*34,T=50+Math.sin(x)*34;p+=`<line x1="${w.toFixed(1)}" y1="${_.toFixed(1)}" x2="${z.toFixed(1)}" y2="${T.toFixed(1)}" stroke="${a}" stroke-width="2" stroke-linecap="round"/>`}const y=`
    <path d="M22,50 L12,42 L14,50 L12,58 Z" fill="${a}" opacity="0.7"/>
  `,$=`
    <ellipse cx="38" cy="62" rx="5" ry="3" fill="${a}" opacity="0.5" transform="rotate(-20, 38, 62)"/>
    <ellipse cx="62" cy="62" rx="5" ry="3" fill="${a}" opacity="0.5" transform="rotate(20, 62, 62)"/>
  `,g=kn(s,o,40,44,60,44,5.5),m=_t(s,a,50,58),v=or(r,50,50,28,28,u);return p+y+f+$+v+g+m}function d2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s}=c,u=S(r,15),a=`
    <ellipse cx="50" cy="52" rx="30" ry="24" fill="${r}"/>
  `,f=`
    <path d="M50,32 L65,40 L65,56 L50,64 L35,56 L35,40 Z" fill="none" stroke="${u}" stroke-width="1.5"/>
    <line x1="50" y1="32" x2="50" y2="28" stroke="${u}" stroke-width="1.5"/>
    <line x1="65" y1="40" x2="74" y2="36" stroke="${u}" stroke-width="1.5"/>
    <line x1="65" y1="56" x2="74" y2="60" stroke="${u}" stroke-width="1.5"/>
    <line x1="50" y1="64" x2="50" y2="70" stroke="${u}" stroke-width="1.5"/>
    <line x1="35" y1="56" x2="26" y2="60" stroke="${u}" stroke-width="1.5"/>
    <line x1="35" y1="40" x2="26" y2="36" stroke="${u}" stroke-width="1.5"/>
  `,p=`
    <ellipse cx="50" cy="28" rx="10" ry="8" fill="${l}"/>
  `,y=`
    <ellipse cx="26" cy="46" rx="6" ry="4" fill="${l}" transform="rotate(-30, 26, 46)"/>
    <ellipse cx="74" cy="46" rx="6" ry="4" fill="${l}" transform="rotate(30, 74, 46)"/>
    <ellipse cx="28" cy="64" rx="6" ry="4" fill="${l}" transform="rotate(20, 28, 64)"/>
    <ellipse cx="72" cy="64" rx="6" ry="4" fill="${l}" transform="rotate(-20, 72, 64)"/>
  `,$=`
    <path d="M50,76 L50,82 L48,80" fill="${l}"/>
  `,g=kn(s,o,46,26,54,26,3),m=_t(s,S(l,40),50,33);return y+$+a+f+p+g+m}function p2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <path d="M15,50 Q10,44 20,40 Q35,32 60,34 Q80,36 88,50 Q80,64 60,66 Q35,68 20,60 Q10,56 15,50 Z" fill="${r}"/>
  `,p=`
    <path d="M20,54 Q35,62 60,62 Q78,60 85,52 Q78,58 60,60 Q35,60 20,54 Z" fill="${l}" opacity="0.5"/>
  `,y=`
    <path d="M45,34 L50,14 L58,34" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,$=`
    <path d="M15,50 L4,36 L10,48 L4,62 Z" fill="${a}"/>
  `,g=`
    <path d="M40,58 Q34,68 28,72 Q36,66 40,60" fill="${a}" opacity="0.6"/>
  `,m=s==="grumpy"||s==="happy"?`
      <path d="M78,52 L80,54 L82,52 L84,54 L86,52" stroke="white" stroke-width="1" fill="none"/>
    `:"",v=`
    <line x1="65" y1="44" x2="65" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
    <line x1="68" y1="44" x2="68" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
    <line x1="71" y1="44" x2="71" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
  `,M=`
    <circle cx="76" cy="44" r="4" fill="white"/>
    <circle cx="76" cy="${s==="happy"?45:44}" r="${s==="surprised"?1.5:2.5}" fill="${o}"/>
    ${s==="happy"?'<circle cx="75" cy="43" r="1" fill="white"/>':""}
    ${s==="grumpy"?`<line x1="73" y1="40" x2="79" y2="41" stroke="${o}" stroke-width="1.5"/>`:""}
  `,x=_t(s,a,82,52),w=or(r,48,48,32,16,u);return $+f+p+y+g+v+w+M+m+x}function h2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,20),f=50,p=50,y=32,$=14;let g="M";for(let z=0;z<5;z++){const T=(z*72-90)*(Math.PI/180),N=f+Math.cos(T)*y,U=p+Math.sin(T)*y,K=(z*72+36-90)*(Math.PI/180),V=f+Math.cos(K)*$,I=p+Math.sin(K)*$,F=(z*72-36-90)*(Math.PI/180),j=f+Math.cos(F)*$,Y=p+Math.sin(F)*$;z===0&&(g+=`${j.toFixed(1)},${Y.toFixed(1)} `),g+=`Q${N.toFixed(1)},${U.toFixed(1)} ${V.toFixed(1)},${I.toFixed(1)} `}g+="Z";const m=`<path d="${g}" fill="${r}"/>`,v=`
    <circle cx="${f}" cy="${p}" r="10" fill="${l}" opacity="0.3"/>
  `,M=`
    <circle cx="50" cy="22" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="50" cy="26" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="76" cy="42" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="73" cy="44" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="66" cy="72" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="63" cy="70" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="34" cy="72" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="37" cy="70" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="24" cy="42" r="1.5" fill="${a}" opacity="0.4"/>
    <circle cx="27" cy="44" r="1.5" fill="${a}" opacity="0.4"/>
  `,x=kn(s,o,46,46,54,46,3.5),w=_t(s,a,50,54),_=or(r,f,p,20,20,u);return m+v+M+_+x+w}var y2={octopus:.78,fish:.82,jellyfish:.75,crab:.72,whale:.76,seahorse:.8,pufferfish:.72,turtle:.8,shark:.78,starfish:.78};function $2(c){const{backgroundShape:r,creatureType:l,backgroundColor:o,hasBubbles:s}=c;let u;switch(l){case"octopus":u=k0(c);break;case"fish":u=i2(c);break;case"jellyfish":u=s2(c);break;case"crab":u=c2(c);break;case"whale":u=a2(c);break;case"seahorse":u=u2(c);break;case"pufferfish":u=f2(c);break;case"turtle":u=d2(c);break;case"shark":u=p2(c);break;case"starfish":u=h2(c);break;default:u=k0(c)}const f=`<g transform="translate(50, 50) scale(${y2[l]??.78}) translate(-50, -50)">${u}</g>`,p=s==="yes"?o2():"";return lt(f+p,r,o)}function k2(c){const r=["circle","rounded","square"],l=["octopus","fish","jellyfish","crab","whale","seahorse","pufferfish","turtle","shark","starfish"],o=["happy","neutral","surprised","grumpy"],s=["none","spots","stripes","scales"],u=["yes","no"],a=["#3498db","#2980b9","#1abc9c","#16a085","#e74c3c","#e67e22","#f39c12","#9b59b6","#2ecc71","#27ae60","#00bcd4","#0097a7","#ff7043","#ff5252","#7e57c2","#26c6da"],f=["#ecf0f1","#ffffff","#fdf2e9","#fef9e7","#eaf2f8","#e8f8f5","#f5eef8","#fdebd0"],p=["#1a5276","#154360","#0e3d5c","#1b4f72","#0b3d6e","#163a5f","#0a2e4d","#1c3f60","#0d4f6e","#103d55","#0c2d48","#12394f"],y=["#2c3e50","#ffffff","#f1c40f","#27ae60","#1a3c6e"];return{backgroundShape:D(r,c),creatureType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),eyeColor:D(y,c),backgroundColor:D(p,c),expression:D(o,c),pattern:D(s,c),hasBubbles:D(u,c)}}var x2={name:"Ocean",schema:l2,shapeParam:"creatureType",generate:$2,randomize:k2},g2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},dinosaurType:{type:"select",default:"trex",options:["trex","triceratops","stegosaurus","brachiosaurus","pterodactyl","ankylosaurus","velociraptor","parasaurolophus","spinosaurus","pachycephalosaurus"]},primaryColor:{type:"color",default:"#6b8e23"},secondaryColor:{type:"color",default:"#f5e6c8"},eyeColor:{type:"color",default:"#2c3e50"},backgroundColor:{type:"color",default:"#8b7355"},expression:{type:"select",default:"happy",options:["happy","fierce","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","plates"]},hasPlants:{type:"select",default:"yes",options:["yes","no"]}};function xn(c,r,l,o,s,u,a){const f=a,p=f*.5,y=f*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"fierce":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <line x1="${l-f}" y1="${o-f}" x2="${l+f}" y2="${o-f*.4}" stroke="${r}" stroke-width="2"/>
        <line x1="${s+f}" y1="${u-f}" x2="${s-f}" y2="${u-f*.4}" stroke="${r}" stroke-width="2"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Io(c,r,l,o,s){const u=s,a=u*.5,f=u*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${f}" fill="white"/>
      `;case"fierce":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <line x1="${l-u}" y1="${o-u}" x2="${l+u}" y2="${o-u*.4}" stroke="${r}" stroke-width="1.5"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${f}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Pt(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"fierce":return`
        <path d="M${l-7},${o} Q${l},${o+4} ${l+7},${o}" fill="${r}"/>
        <polygon points="${l-4},${o} ${l-3},${o+3} ${l-2},${o}" fill="white"/>
        <polygon points="${l-1},${o} ${l},${o+3} ${l+1},${o}" fill="white"/>
        <polygon points="${l+2},${o} ${l+3},${o+3} ${l+4},${o}" fill="white"/>
      `;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"sleepy":return`<line x1="${l-4}" y1="${o}" x2="${l+4}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;default:return""}}function bt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-s*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+s*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+s*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+s*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-s*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.3} Q${r},${l-s*.4} ${r+o*.7},${l-s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-s*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"plates":{const f=`dino-plates-${r}-${l}`;return`
        <defs>
          <pattern id="${f}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,8 L4,2 L8,8" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${s*.85}" fill="url(#${f})"/>
      `}default:return""}}function m2(){return`
    <g opacity="0.3">
      <path d="M8,92 Q10,82 6,75" stroke="#2d5016" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="5" cy="76" rx="3" ry="2" fill="#4a7c28" transform="rotate(-30, 5, 76)"/>
      <ellipse cx="8" cy="80" rx="3" ry="2" fill="#4a7c28" transform="rotate(20, 8, 80)"/>
      <ellipse cx="6" cy="84" rx="2.5" ry="1.8" fill="#3d6b22" transform="rotate(-15, 6, 84)"/>
      <path d="M92,92 Q90,82 94,75" stroke="#2d5016" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="95" cy="76" rx="3" ry="2" fill="#4a7c28" transform="rotate(30, 95, 76)"/>
      <ellipse cx="92" cy="80" rx="3" ry="2" fill="#4a7c28" transform="rotate(-20, 92, 80)"/>
      <ellipse cx="94" cy="84" rx="2.5" ry="1.8" fill="#3d6b22" transform="rotate(15, 94, 84)"/>
      <ellipse cx="85" cy="12" rx="4" ry="2" fill="#4a7c28" opacity="0.7" transform="rotate(-40, 85, 12)"/>
    </g>
  `}function x0(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="20" ry="17" fill="${r}"/>
    <ellipse cx="50" cy="30" rx="16" ry="10" fill="${R(r,15)}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="42" rx="14" ry="6" fill="${a}" opacity="0.15"/>
  `,$=`
    <path d="M38,56 Q34,58 33,62" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,56 Q66,58 67,62" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,g=`
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${a}"/>
  `,m=`
    <path d="M50,78 Q36,82 28,76 Q24,73 26,70" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `,v=`
    <circle cx="45" cy="40" r="1" fill="${a}"/>
    <circle cx="55" cy="40" r="1" fill="${a}"/>
  `,M=xn(s,o,42,30,58,30,5),x=Pt(s,a,50,46),w=bt(r,50,34,20,17,u);return m+g+f+$+p+y+w+v+M+x}function w2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <path d="M14,38 Q12,22 24,14 Q34,8 50,6 Q66,8 76,14 Q88,22 86,38 Z" fill="${f}" stroke="${a}" stroke-width="1.5"/>
    <circle cx="26" cy="20" r="3" fill="${a}" opacity="0.2"/>
    <circle cx="50" cy="14" r="3" fill="${a}" opacity="0.2"/>
    <circle cx="74" cy="20" r="3" fill="${a}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="46" rx="22" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="14" ry="10" fill="${l}" opacity="0.3"/>
  `,$=`
    <polygon points="38,34 36,18 40,32" fill="${f}" stroke="${a}" stroke-width="0.5"/>
    <polygon points="62,34 64,18 60,32" fill="${f}" stroke="${a}" stroke-width="0.5"/>
    <polygon points="50,54 50,48 52,53" fill="${f}" stroke="${a}" stroke-width="0.5"/>
  `,g=`
    <ellipse cx="50" cy="72" rx="18" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="76" rx="12" ry="8" fill="${l}" opacity="0.3"/>
  `,m=`
    <rect x="34" y="80" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="58" y="80" width="8" height="10" rx="3" fill="${a}"/>
  `,v=`
    <path d="M42,58 Q50,64 58,58" fill="${a}" opacity="0.15"/>
  `,M=xn(s,o,40,40,60,40,5),x=Pt(s,a,50,60),w=bt(r,50,46,22,20,u);return m+g+p+y+v+w+$+M+x}function v2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,25),p=`
    <ellipse cx="48" cy="58" rx="30" ry="16" fill="${r}"/>
    <ellipse cx="48" cy="64" rx="22" ry="8" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="82" cy="56" rx="10" ry="8" fill="${r}"/>
    <ellipse cx="85" cy="58" rx="5" ry="4" fill="${l}" opacity="0.3"/>
  `,$=`
    <path d="M72,52 Q78,50 82,52" fill="${r}" stroke="${r}" stroke-width="10"/>
  `,g=`
    <polygon points="30,42 34,28 38,42" fill="${f}" stroke="${a}" stroke-width="1"/>
    <polygon points="38,42 43,24 48,42" fill="${f}" stroke="${a}" stroke-width="1"/>
    <polygon points="46,42 52,26 58,42" fill="${f}" stroke="${a}" stroke-width="1"/>
    <polygon points="54,42 59,30 64,42" fill="${f}" stroke="${a}" stroke-width="1"/>
    <polygon points="62,44 66,34 70,44" fill="${f}" stroke="${a}" stroke-width="1"/>
  `,m=`
    <path d="M18,58 Q8,56 4,52" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <line x1="6" y1="52" x2="2" y2="44" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="8" y1="54" x2="2" y2="50" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
  `,v=`
    <rect x="32" y="70" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="42" y="70" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="58" y="70" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="68" y="70" width="7" height="10" rx="3" fill="${a}"/>
  `,M=Io(s,o,85,54,3.5),x=Pt(s,a,90,60),w=bt(r,48,58,30,16,u);return m+v+p+$+y+g+w+M+x}function M2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="52" cy="72" rx="24" ry="18" fill="${r}"/>
    <ellipse cx="52" cy="78" rx="16" ry="10" fill="${l}" opacity="0.3"/>
  `,p=`
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${r}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${R(r,10)}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
  `,y=`
    <ellipse cx="46" cy="12" rx="10" ry="7" fill="${r}"/>
    <ellipse cx="44" cy="14" rx="6" ry="4" fill="${l}" opacity="0.3"/>
  `,$=`
    <circle cx="42" cy="8" r="1.2" fill="${a}"/>
    <circle cx="48" cy="8" r="1.2" fill="${a}"/>
  `,g=`
    <rect x="34" y="84" width="9" height="14" rx="4" fill="${a}"/>
    <rect x="48" y="84" width="9" height="14" rx="4" fill="${a}"/>
    <rect x="62" y="84" width="9" height="14" rx="4" fill="${a}"/>
  `,m=`
    <path d="M30,68 Q20,64 14,68" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,v=xn(s,o,42,11,52,11,3),M=Pt(s,a,46,17),x=bt(r,52,72,24,18,u);return m+g+f+p+y+x+$+v+M}function C2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <path d="M50,44 L8,30 L12,48 L26,46 L38,48 Z" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M50,44 L92,30 L88,48 L74,46 L62,48 Z" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M50,44 L8,30 L12,48" fill="${f}" opacity="0.2"/>
    <path d="M50,44 L92,30 L88,48" fill="${f}" opacity="0.2"/>
  `,y=`
    <line x1="50" y1="44" x2="16" y2="36" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="24" y2="40" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="84" y2="36" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="76" y2="40" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
  `,$=`
    <ellipse cx="50" cy="52" rx="10" ry="12" fill="${r}"/>
    <ellipse cx="50" cy="56" rx="6" ry="6" fill="${l}" opacity="0.3"/>
  `,g=`
    <ellipse cx="50" cy="32" rx="8" ry="7" fill="${r}"/>
  `,m=`
    <path d="M52,26 Q58,20 66,18 Q60,24 54,28" fill="${f}" stroke="${a}" stroke-width="0.5"/>
  `,v=`
    <polygon points="50,36 46,39 50,38 54,39" fill="${a}"/>
  `,M=`
    <path d="M46,64 L44,72 L42,71 L44,72 L46,71" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M54,64 L56,72 L58,71 L56,72 L54,71" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=xn(s,o,46,30,54,30,3.5),w=Pt(s,a,50,38),_=bt(r,50,52,10,12,u);return p+y+M+$+g+m+v+_+x+w}function S2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="52" rx="32" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="22" ry="8" fill="${l}" opacity="0.3"/>
  `,p=`
    <circle cx="34" cy="40" r="3" fill="${a}" opacity="0.3"/>
    <circle cx="44" cy="38" r="3.5" fill="${a}" opacity="0.3"/>
    <circle cx="55" cy="38" r="3.5" fill="${a}" opacity="0.3"/>
    <circle cx="65" cy="40" r="3" fill="${a}" opacity="0.3"/>
    <circle cx="38" cy="48" r="2.5" fill="${a}" opacity="0.25"/>
    <circle cx="50" cy="46" r="3" fill="${a}" opacity="0.25"/>
    <circle cx="62" cy="48" r="2.5" fill="${a}" opacity="0.25"/>
  `,y=`
    <ellipse cx="84" cy="52" rx="10" ry="9" fill="${r}"/>
    <circle cx="86" cy="50" r="2" fill="${a}" opacity="0.15"/>
    <circle cx="90" cy="52" r="2" fill="${a}" opacity="0.15"/>
  `,$=`
    <circle cx="80" cy="44" r="2" fill="${a}" opacity="0.4"/>
    <circle cx="88" cy="44" r="2" fill="${a}" opacity="0.4"/>
  `,g=`
    <path d="M18,52 Q10,52 6,50" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="4" cy="50" rx="5" ry="4" fill="${a}"/>
  `,m=`
    <rect x="30" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="44" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="58" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="70" y="66" width="9" height="10" rx="3" fill="${a}"/>
  `,v=Io(s,o,88,50,3.5),M=Pt(s,a,92,56),x=bt(r,50,52,32,18,u);return g+m+f+p+x+y+$+v+M}function E2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <ellipse cx="46" cy="52" rx="20" ry="14" fill="${r}"/>
    <ellipse cx="46" cy="58" rx="12" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="74" cy="38" rx="12" ry="9" fill="${r}"/>
    <ellipse cx="78" cy="40" rx="6" ry="5" fill="${l}" opacity="0.2"/>
  `,$=`
    <path d="M62,46 Q68,42 72,40" stroke="${r}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `,g=`
    <circle cx="82" cy="36" r="1" fill="${a}"/>
  `,m=`
    <path d="M56,48 Q60,52 58,56" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L56,56 L60,56 L58,54" fill="${f}" opacity="0.6"/>
  `,v=`
    <path d="M40,62 L36,72 L32,80" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32,80 L28,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36,72 L33,68" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52,62 L50,72 L46,80" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M46,80 L42,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,72 L47,68" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M26,52 Q14,48 6,44 Q2,42 4,40" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,x=`
    <path d="M4,40 L2,36 L6,38 L4,34 L8,38" fill="${f}" opacity="0.5"/>
  `,w=Io(s,o,78,36,4),_=Pt(s,a,84,42),z=bt(r,46,52,20,14,u);return M+x+v+p+m+$+y+g+z+w+_}function Q2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,15),p=`
    <ellipse cx="50" cy="66" rx="18" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="12" ry="12" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${r}"/>
  `,$=`
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${f}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${a}" stroke-width="1" fill="none" opacity="0.3"/>
  `,g=`
    <ellipse cx="50" cy="48" rx="12" ry="5" fill="${f}" opacity="0.3"/>
  `,m=`
    <rect x="38" y="82" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="82" width="8" height="12" rx="3" fill="${a}"/>
  `,v=`
    <path d="M36,72 Q28,76 22,74" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M34,60 Q30,64 28,68" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,60 Q70,64 72,68" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,x=xn(s,o,43,34,57,34,4.5),w=Pt(s,a,50,50),_=bt(r,50,38,16,14,u);return v+m+p+M+y+$+g+_+x+w}function F2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,25),p=`
    <ellipse cx="48" cy="58" rx="28" ry="14" fill="${r}"/>
    <ellipse cx="48" cy="64" rx="20" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <path d="M28,44 Q32,16 42,12 Q50,10 58,14 Q66,18 70,44" fill="${f}" stroke="${a}" stroke-width="1"/>
    <line x1="36" y1="18" x2="38" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="12" x2="50" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="62" y1="20" x2="60" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
  `,$=`
    <ellipse cx="82" cy="52" rx="14" ry="8" fill="${r}"/>
    <ellipse cx="90" cy="54" rx="6" ry="4" fill="${a}" opacity="0.1"/>
  `,g=`
    <path d="M72,52 Q76,50 80,50" stroke="${r}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `,m=`
    <circle cx="92" cy="50" r="1" fill="${a}"/>
  `,v=`
    <rect x="32" y="68" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="44" y="68" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="56" y="68" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="66" y="68" width="7" height="10" rx="3" fill="${a}"/>
  `,M=`
    <path d="M20,58 Q10,56 4,54" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,x=Io(s,o,86,50,3.5),w=Pt(s,a,94,56),_=bt(r,48,58,28,14,u);return M+v+p+y+g+$+_+m+x+w}function L2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),p=`
    <ellipse cx="50" cy="24" rx="18" ry="14" fill="${R(r,20)}"/>
    <ellipse cx="50" cy="22" rx="14" ry="10" fill="${R(r,35)}" opacity="0.3"/>
  `,y=`
    <circle cx="34" cy="30" r="2" fill="${a}" opacity="0.3"/>
    <circle cx="38" cy="26" r="2" fill="${a}" opacity="0.3"/>
    <circle cx="44" cy="24" r="1.5" fill="${a}" opacity="0.3"/>
    <circle cx="56" cy="24" r="1.5" fill="${a}" opacity="0.3"/>
    <circle cx="62" cy="26" r="2" fill="${a}" opacity="0.3"/>
    <circle cx="66" cy="30" r="2" fill="${a}" opacity="0.3"/>
  `,$=`
    <ellipse cx="50" cy="40" rx="14" ry="10" fill="${r}"/>
  `,g=`
    <ellipse cx="50" cy="62" rx="16" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${l}" opacity="0.3"/>
  `,m=`
    <path d="M36,56 Q32,60 30,64" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,56 Q68,60 70,64" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,v=`
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${a}"/>
  `,M=`
    <path d="M42,74 Q32,80 24,78 Q20,76 22,72" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,x=xn(s,o,44,38,56,38,4),w=Pt(s,a,50,48),_=bt(r,50,62,16,18,u);return M+v+g+m+$+p+y+_+x+w}var _2={trex:.82,triceratops:.75,stegosaurus:.78,brachiosaurus:.72,pterodactyl:.7,ankylosaurus:.75,velociraptor:.78,parasaurolophus:.76,spinosaurus:.74,pachycephalosaurus:.8};function P2(c){const{backgroundShape:r,dinosaurType:l,backgroundColor:o,hasPlants:s}=c;let u;switch(l){case"trex":u=x0(c);break;case"triceratops":u=w2(c);break;case"stegosaurus":u=v2(c);break;case"brachiosaurus":u=M2(c);break;case"pterodactyl":u=C2(c);break;case"ankylosaurus":u=S2(c);break;case"velociraptor":u=E2(c);break;case"parasaurolophus":u=Q2(c);break;case"spinosaurus":u=F2(c);break;case"pachycephalosaurus":u=L2(c);break;default:u=x0(c)}const f=`<g transform="translate(50, 50) scale(${_2[l]??.78}) translate(-50, -50)">${u}</g>`,p=s==="yes"?m2():"";return lt(f+p,r,o)}function b2(c){const r=["circle","rounded","square"],l=["trex","triceratops","stegosaurus","brachiosaurus","pterodactyl","ankylosaurus","velociraptor","parasaurolophus","spinosaurus","pachycephalosaurus"],o=["happy","fierce","surprised","sleepy"],s=["none","spots","stripes","plates"],u=["yes","no"],a=["#6b8e23","#556b2f","#8fbc8f","#228b22","#cd853f","#8b6914","#a0522d","#b8860b","#708090","#4682b4","#6a5acd","#9370db","#c75b39","#d4a574","#7b6843","#9caf88"],f=["#f5e6c8","#fdf2e9","#fef9e7","#e8f5e9","#fff8e1","#ffffff","#f0e68c","#ffe4c4"],p=["#8b7355","#6b4226","#556b2f","#2e4a1e","#8b4513","#a0785a","#5c4033","#3e6b48","#7a6652","#4a6741","#9e8c6c","#6e5c3b"],y=["#2c3e50","#f1c40f","#e67e22","#27ae60","#c0392b"];return{backgroundShape:D(r,c),dinosaurType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),eyeColor:D(y,c),backgroundColor:D(p,c),expression:D(o,c),pattern:D(s,c),hasPlants:D(u,c)}}var A2={name:"Dinosaurs",schema:g2,shapeParam:"dinosaurType",generate:P2,randomize:b2},N2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},creatureType:{type:"select",default:"dragon",options:["dragon","unicorn","phoenix","griffin","yeti","cerberus","kitsune","minotaur","fairy","hydra"]},primaryColor:{type:"color",default:"#7b2d8e"},secondaryColor:{type:"color",default:"#f0e6ff"},eyeColor:{type:"color",default:"#ffd700"},backgroundColor:{type:"color",default:"#1a0a2e"},expression:{type:"select",default:"happy",options:["happy","majestic","surprised","mysterious"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","scales"]},magic:{type:"select",default:"none",options:["none","sparkles","runes","orbs"]}};function at(c,r,l,o,s,u,a){const f=a,p=f*.5,y=f*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"majestic":return`
        <ellipse cx="${l}" cy="${o}" rx="${f}" ry="${f*.75}" fill="white"/>
        <ellipse cx="${s}" cy="${u}" rx="${f}" ry="${f*.75}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p}" fill="${r}"/>
        <line x1="${l-f}" y1="${o-f*.9}" x2="${l+f}" y2="${o-f*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
        <line x1="${s+f}" y1="${u-f*.9}" x2="${s-f}" y2="${u-f*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"mysterious":return`
        <ellipse cx="${l}" cy="${o}" rx="${f}" ry="${f*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${s}" cy="${u}" rx="${f}" ry="${f*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${l}" cy="${o}" rx="${p}" ry="${p*.6}" fill="${r}"/>
        <ellipse cx="${s}" cy="${u}" rx="${p}" ry="${p*.6}" fill="${r}"/>
      `;default:return""}}function I2(c,r,l,o,s){const u=s,a=u*.5,f=u*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${f}" fill="white"/>
      `;case"majestic":return`
        <ellipse cx="${l}" cy="${o}" rx="${u}" ry="${u*.75}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a}" fill="${r}"/>
        <line x1="${l-u}" y1="${o-u*.9}" x2="${l+u}" y2="${o-u*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${f}" fill="white"/>
      `;case"mysterious":return`
        <ellipse cx="${l}" cy="${o}" rx="${u}" ry="${u*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${l}" cy="${o}" rx="${a}" ry="${a*.6}" fill="${r}"/>
      `;default:return""}}function Ct(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"majestic":return`<path d="M${l-4},${o} Q${l},${o+2} ${l+4},${o-1}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"mysterious":return`<line x1="${l-5}" y1="${o}" x2="${l+5}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;default:return""}}function At(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-s*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+s*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+s*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+s*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-s*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.3} Q${r},${l-s*.4} ${r+o*.7},${l-s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-s*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"scales":{const f=`myth-scales-${r}-${l}`;return`
        <defs>
          <pattern id="${f}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${s*.85}" fill="url(#${f})"/>
      `}default:return""}}function T2(c,r){switch(c){case"sparkles":return`
        <g opacity="0.7">
          <polygon points="82,14 83,17 86,17 84,19 85,22 82,20 79,22 80,19 78,17 81,17" fill="white"/>
          <polygon points="16,22 17,24 19,24 17.5,25.5 18,28 16,26.5 14,28 14.5,25.5 13,24 15,24" fill="${r}" opacity="0.8"/>
          <polygon points="76,78 77,80 79,80 77.5,81.5 78,84 76,82.5 74,84 74.5,81.5 73,80 75,80" fill="white" opacity="0.6"/>
          <polygon points="20,72 21,74 23,74 21.5,75 22,77 20,76 18,77 18.5,75 17,74 19,74" fill="${r}" opacity="0.5"/>
          <polygon points="88,50 89,52 91,52 89.5,53 90,55 88,54 86,55 86.5,53 85,52 87,52" fill="white" opacity="0.6"/>
        </g>
      `;case"runes":return`
        <g opacity="0.3" stroke="${r}" stroke-width="1" fill="none">
          <circle cx="12" cy="14" r="3"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
          <polygon points="86,80 89,86 83,86"/>
          <path d="M14,82 L16,78 L18,82 L14,82 M16,78 L16,74"/>
          <path d="M82,16 L84,12 L86,16 L84,12 L82,14 L86,14"/>
        </g>
      `;case"orbs":return`
        <g>
          <circle cx="14" cy="18" r="5" fill="${r}" opacity="0.15"/>
          <circle cx="14" cy="18" r="3" fill="${r}" opacity="0.25"/>
          <circle cx="14" cy="18" r="1.5" fill="white" opacity="0.3"/>
          <circle cx="84" cy="78" r="4" fill="${r}" opacity="0.15"/>
          <circle cx="84" cy="78" r="2.5" fill="${r}" opacity="0.25"/>
          <circle cx="84" cy="78" r="1" fill="white" opacity="0.3"/>
          <circle cx="86" cy="22" r="3" fill="${r}" opacity="0.12"/>
          <circle cx="86" cy="22" r="2" fill="${r}" opacity="0.2"/>
          <circle cx="86" cy="22" r="0.8" fill="white" opacity="0.3"/>
          <circle cx="18" cy="80" r="3.5" fill="${r}" opacity="0.12"/>
          <circle cx="18" cy="80" r="2" fill="${r}" opacity="0.2"/>
          <circle cx="18" cy="80" r="0.8" fill="white" opacity="0.3"/>
        </g>
      `;default:return""}}function g0(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="18" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="30" rx="14" ry="10" fill="${R(r,15)}" opacity="0.2"/>
  `,y=`
    <path d="M38,24 Q34,14 30,10" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,24 Q66,14 70,10" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,$=`
    <path d="M34,50 L10,32 L16,42 L8,38 L18,48 L14,44 L26,52" fill="${r}" stroke="${a}" stroke-width="0.5" opacity="0.8"/>
    <path d="M66,50 L90,32 L84,42 L92,38 L82,48 L86,44 L74,52" fill="${r}" stroke="${a}" stroke-width="0.5" opacity="0.8"/>
  `,g=`
    <rect x="38" y="76" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="10" rx="3" fill="${a}"/>
  `,m=`
    <path d="M50,78 Q36,84 26,80 Q20,76 18,72" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M18,72 L14,68 L20,72 L16,74" fill="${a}"/>
  `,v=`
    <circle cx="45" cy="40" r="1" fill="${a}"/>
    <circle cx="55" cy="40" r="1" fill="${a}"/>
  `,M=s==="majestic"?'<path d="M56,44 Q60,40 58,36 Q62,40 60,44" fill="#ff6b35" opacity="0.6"/>':"",x=at(s,o,42,30,58,30,5),w=Ct(s,a,50,44),_=At(r,50,34,18,16,u);return m+g+f+$+p+y+_+v+x+w+M}function D2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <ellipse cx="50" cy="66" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="36" rx="12" ry="8" fill="${f}" opacity="0.2"/>
  `,$=`
    <path d="M50,24 L48,8 L52,8 Z" fill="#ffd700"/>
    <path d="M49,22 Q50,18 51,14 Q50,16 49,18" stroke="#e6c200" stroke-width="0.5" fill="none"/>
    <path d="M49,16 Q50,12 51,10" stroke="#e6c200" stroke-width="0.5" fill="none"/>
  `,g=`
    <path d="M36,28 Q30,34 28,44 Q26,52 30,58" stroke="#ff69b4" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M38,26 Q34,32 32,40 Q30,48 34,56" stroke="#9b59b6" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M64,28 Q70,34 72,44 Q74,52 70,58" stroke="#3498db" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M62,26 Q66,32 68,40 Q70,48 66,56" stroke="#2ecc71" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,m=`
    <path d="M38,26 Q36,18 40,22" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M62,26 Q64,18 60,22" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,v=`
    <rect x="38" y="80" width="7" height="12" rx="3" fill="${a}"/>
    <rect x="55" y="80" width="7" height="12" rx="3" fill="${a}"/>
  `,M=`
    <path d="M42,82 Q32,88 26,84" stroke="#ff69b4" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M42,82 Q34,90 28,88" stroke="#9b59b6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,x=at(s,o,43,36,57,36,4.5),w=Ct(s,a,50,46),_=At(r,50,38,16,14,u);return M+v+p+g+y+m+$+_+x+w}function B2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,30),p=`
    <ellipse cx="50" cy="52" rx="12" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="56" rx="8" ry="8" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="30" rx="10" ry="9" fill="${r}"/>
  `,$=`
    <path d="M46,22 Q44,12 48,8 Q50,14 52,8 Q56,12 54,22" fill="#ff6b35" opacity="0.8"/>
    <path d="M48,20 Q49,14 50,10 Q51,14 52,20" fill="#ffd700" opacity="0.6"/>
  `,g=`
    <path d="M38,44 L8,28 L14,38 L4,32 L16,42 L10,40 L28,48" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M62,44 L92,28 L86,38 L96,32 L84,42 L90,40 L72,48" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M38,44 L8,28 L14,38" fill="${f}" opacity="0.3"/>
    <path d="M62,44 L92,28 L86,38" fill="${f}" opacity="0.3"/>
  `,m=`
    <path d="M46,66 Q38,78 30,90 Q28,94 32,92" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50,68 Q50,80 50,92 Q50,96 52,94" stroke="#ff6b35" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M54,66 Q62,78 70,90 Q72,94 68,92" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M12,32 L6,28 L10,36" fill="#ffd700" opacity="0.4"/>
    <path d="M88,32 L94,28 L90,36" fill="#ffd700" opacity="0.4"/>
  `,M=`
    <polygon points="50,36 47,39 50,38 53,39" fill="${a}"/>
  `,x=at(s,o,46,28,54,28,3.5),w=Ct(s,a,50,38),_=At(r,50,52,12,16,u);return m+v+p+g+y+$+M+_+x+w}function j2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <ellipse cx="44" cy="56" rx="24" ry="16" fill="${r}"/>
    <ellipse cx="44" cy="62" rx="16" ry="8" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="76" cy="38" rx="12" ry="10" fill="${f}"/>
  `,$=`
    <path d="M62,48 Q70,42 74,40" stroke="${r}" stroke-width="12" fill="none" stroke-linecap="round"/>
  `,g=`
    <polygon points="86,38 92,40 86,42" fill="#e6a800"/>
  `,m=`
    <path d="M72,30 Q70,22 74,18" stroke="${f}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M76,28 Q76,20 78,16" stroke="${f}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M32,42 Q28,32 34,24 Q42,20 50,28 Q54,34 50,44" fill="${f}" stroke="${a}" stroke-width="0.5" opacity="0.7"/>
    <line x1="36" y1="28" x2="42" y2="40" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="42" y1="26" x2="46" y2="38" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
  `,M=`
    <path d="M20,56 Q10,52 6,48" stroke="${r}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="46" rx="4" ry="3" fill="${a}" transform="rotate(-20, 5, 46)"/>
  `,x=`
    <path d="M60,68 L62,78 L58,78 L60,78 L64,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,68 L54,78 L50,78 L54,78 L56,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="28" y="68" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="38" y="68" width="8" height="10" rx="3" fill="${a}"/>
  `,w=I2(s,o,80,36,4),_=Ct(s,a,88,42),z=At(r,44,56,24,16,u);return M+x+p+v+$+y+m+g+z+w+_}function z2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,20),f=R(r,25),p=`
    <ellipse cx="50" cy="58" rx="26" ry="28" fill="${r}"/>
    <ellipse cx="42" cy="50" rx="14" ry="12" fill="${f}" opacity="0.3"/>
    <ellipse cx="58" cy="50" rx="14" ry="12" fill="${f}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="16" ry="10" fill="${f}" opacity="0.25"/>
    <ellipse cx="44" cy="62" rx="12" ry="10" fill="${f}" opacity="0.2"/>
    <ellipse cx="56" cy="62" rx="12" ry="10" fill="${f}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="64" rx="14" ry="12" fill="${l}" opacity="0.3"/>
  `,$=`
    <ellipse cx="50" cy="38" rx="12" ry="10" fill="${S(r,10)}"/>
  `,g=`
    <path d="M28,52 Q22,56 20,62" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M72,52 Q78,56 80,62" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `,m=`
    <rect x="34" y="80" width="10" height="10" rx="4" fill="${a}"/>
    <rect x="56" y="80" width="10" height="10" rx="4" fill="${a}"/>
  `,v=`
    <ellipse cx="30" cy="44" rx="5" ry="4" fill="${f}" opacity="0.4" transform="rotate(-20, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="5" ry="4" fill="${f}" opacity="0.4" transform="rotate(20, 70, 44)"/>
    <ellipse cx="50" cy="28" rx="6" ry="3" fill="${f}" opacity="0.4"/>
  `,M=at(s,o,44,36,56,36,4),x=Ct(s,a,50,44),w=At(r,50,58,26,28,u);return m+p+y+v+g+$+w+M+x}function R2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="68" rx="20" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="14" ry="10" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="14" ry="12" fill="${r}"/>
  `,y=`
    <ellipse cx="26" cy="38" rx="11" ry="10" fill="${r}" transform="rotate(-10, 26, 38)"/>
  `,$=`
    <ellipse cx="74" cy="38" rx="11" ry="10" fill="${r}" transform="rotate(10, 74, 38)"/>
  `,g=`
    <path d="M50,46 L50,52" stroke="${r}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M30,46 Q36,52 40,56" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M70,46 Q64,52 60,56" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `,m=`
    <path d="M42,24 Q40,16 44,20" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M58,24 Q60,16 56,20" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M18,30 Q16,22 20,26" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M34,30 Q36,22 32,26" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M66,30 Q64,22 68,26" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M82,30 Q84,22 80,26" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,v=`
    <ellipse cx="50" cy="38" rx="3" ry="2" fill="${a}"/>
    <ellipse cx="26" cy="42" rx="2.5" ry="1.8" fill="${a}"/>
    <ellipse cx="74" cy="42" rx="2.5" ry="1.8" fill="${a}"/>
  `,M=`
    <rect x="34" y="80" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="58" y="80" width="8" height="10" rx="3" fill="${a}"/>
  `,x=`
    <path d="M50,82 Q42,90 36,88 Q32,86 34,82" stroke="${r}" stroke-width="4" fill="none" stroke-linecap="round"/>
  `,w=at(s,o,44,32,56,32,4),_=at(s,o,21,36,31,36,3),z=at(s,o,69,36,79,36,3),T=Ct(s,a,50,42),N=Ct(s,a,26,46),U=Ct(s,a,74,46),K=At(r,50,68,20,18,u);return x+M+f+g+y+$+p+m+v+K+w+_+z+T+N+U}function O2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,20),p=`
    <ellipse cx="50" cy="62" rx="16" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="36" rx="16" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="40" rx="10" ry="7" fill="${l}" opacity="0.4"/>
  `,$=`
    <path d="M36,28 L28,10 L40,24" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M64,28 L72,10 L60,24" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M36,26 L30,14 L39,24" fill="${f}" opacity="0.4"/>
    <path d="M64,26 L70,14 L61,24" fill="${f}" opacity="0.4"/>
  `,g=`
    <ellipse cx="50" cy="42" rx="3" ry="2" fill="${a}"/>
  `,m=`
    <path d="M42,76 Q28,80 20,74 Q14,68 18,62" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q48,88 42,92 Q36,94 34,90" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q72,80 80,74 Q86,68 82,62" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="17" cy="60" r="3" fill="white" opacity="0.4"/>
    <circle cx="33" cy="89" r="3" fill="white" opacity="0.4"/>
    <circle cx="83" cy="60" r="3" fill="white" opacity="0.4"/>
  `,v=`
    <rect x="38" y="76" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="55" y="76" width="7" height="10" rx="3" fill="${a}"/>
  `,M=at(s,o,42,34,58,34,4.5),x=Ct(s,a,50,46),w=At(r,50,36,16,14,u);return m+v+p+y+$+g+w+M+x}function U2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="64" rx="18" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="68" rx="12" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="16" ry="14" fill="${r}"/>
  `,y=`
    <path d="M36,26 Q28,18 24,24 Q22,28 26,30" stroke="${S("#d4a017",20)}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M64,26 Q72,18 76,24 Q78,28 74,30" stroke="${S("#d4a017",20)}" stroke-width="4" fill="none" stroke-linecap="round"/>
  `,$=`
    <ellipse cx="50" cy="40" rx="8" ry="5" fill="${S(r,10)}" opacity="0.5"/>
    <circle cx="46" cy="41" r="1.5" fill="${a}"/>
    <circle cx="54" cy="41" r="1.5" fill="${a}"/>
    <path d="M46,44 Q50,48 54,44" stroke="#c0a030" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,g=`
    <ellipse cx="34" cy="54" rx="8" ry="6" fill="${r}" opacity="0.6"/>
    <ellipse cx="66" cy="54" rx="8" ry="6" fill="${r}" opacity="0.6"/>
  `,m=`
    <path d="M32,56 Q26,62 24,70" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M68,56 Q74,62 76,70" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,v=`
    <rect x="36" y="80" width="9" height="12" rx="4" fill="${a}"/>
    <rect x="55" y="80" width="9" height="12" rx="4" fill="${a}"/>
  `,M=`
    <ellipse cx="34" cy="30" rx="5" ry="3" fill="${r}" transform="rotate(-20, 34, 30)"/>
    <ellipse cx="66" cy="30" rx="5" ry="3" fill="${r}" transform="rotate(20, 66, 30)"/>
  `,x=at(s,o,42,32,58,32,4.5),w=Ct(s,a,50,46),_=At(r,50,64,18,20,u);return v+f+g+m+p+M+y+$+_+x+w}function V2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,30),p=`
    <ellipse cx="50" cy="58" rx="8" ry="12" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="5" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="38" r="12" fill="${R(r,40)}"/>
  `,$=`
    <path d="M42,48 Q20,28 16,40 Q12,52 38,56" fill="${r}" opacity="0.4" stroke="${f}" stroke-width="0.5"/>
    <path d="M42,52 Q18,58 16,68 Q14,78 40,62" fill="${r}" opacity="0.35" stroke="${f}" stroke-width="0.5"/>
    <path d="M58,48 Q80,28 84,40 Q88,52 62,56" fill="${r}" opacity="0.4" stroke="${f}" stroke-width="0.5"/>
    <path d="M58,52 Q82,58 84,68 Q86,78 60,62" fill="${r}" opacity="0.35" stroke="${f}" stroke-width="0.5"/>
  `,g=`
    <path d="M42,48 Q28,36 22,42" stroke="${f}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M42,52 Q26,60 24,68" stroke="${f}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,48 Q72,36 78,42" stroke="${f}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,52 Q74,60 76,68" stroke="${f}" stroke-width="0.5" fill="none" opacity="0.5"/>
  `,m=`
    <path d="M40,30 Q38,22 42,28" fill="${a}" opacity="0.4"/>
    <path d="M60,30 Q62,22 58,28" fill="${a}" opacity="0.4"/>
    <path d="M44,28 Q44,20 48,26" fill="${a}" opacity="0.3"/>
    <path d="M56,28 Q56,20 52,26" fill="${a}" opacity="0.3"/>
  `,v=`
    <line x1="46" y1="68" x2="44" y2="76" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <line x1="54" y1="68" x2="56" y2="76" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
  `,M=at(s,o,45,36,55,36,3.5),x=Ct(s,a,50,44),w=At(r,50,58,8,12,u);return v+$+g+p+y+m+w+M+x}function H2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=`
    <ellipse cx="50" cy="70" rx="18" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="74" rx="12" ry="10" fill="${l}" opacity="0.3"/>
  `,f=`
    <ellipse cx="50" cy="28" rx="10" ry="8" fill="${r}"/>
  `,p=`
    <ellipse cx="24" cy="32" rx="9" ry="7" fill="${r}" transform="rotate(-15, 24, 32)"/>
  `,y=`
    <ellipse cx="76" cy="32" rx="9" ry="7" fill="${r}" transform="rotate(15, 76, 32)"/>
  `,$=`
    <path d="M50,36 Q50,46 50,56" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M28,38 Q32,48 40,56" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M72,38 Q68,48 60,56" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,g=`
    <path d="M50,36 L50,39 L48,41 M50,39 L52,41" stroke="#ff4444" stroke-width="0.8" fill="none"/>
    <path d="M24,40 L23,43 L21,45 M23,43 L25,45" stroke="#ff4444" stroke-width="0.8" fill="none"/>
    <path d="M76,40 L77,43 L75,45 M77,43 L79,45" stroke="#ff4444" stroke-width="0.8" fill="none"/>
  `,m=at(s,o,45,26,55,26,3.5),v=at(s,o,20,30,28,30,2.8),M=at(s,o,72,30,80,30,2.8),x=`
    <path d="M44,82 Q36,90 28,88 Q22,86 20,80" stroke="${r}" stroke-width="5" fill="none" stroke-linecap="round"/>
  `,w=At(r,50,70,18,16,u);return x+a+$+p+y+f+g+w+m+v+M}var Z2={dragon:.75,unicorn:.78,phoenix:.72,griffin:.76,yeti:.8,cerberus:.72,kitsune:.76,minotaur:.8,fairy:.75,hydra:.72};function W2(c){const{backgroundShape:r,creatureType:l,backgroundColor:o,eyeColor:s,magic:u}=c;let a;switch(l){case"dragon":a=g0(c);break;case"unicorn":a=D2(c);break;case"phoenix":a=B2(c);break;case"griffin":a=j2(c);break;case"yeti":a=z2(c);break;case"cerberus":a=R2(c);break;case"kitsune":a=O2(c);break;case"minotaur":a=U2(c);break;case"fairy":a=V2(c);break;case"hydra":a=H2(c);break;default:a=g0(c)}const p=`<g transform="translate(50, 50) scale(${Z2[l]??.76}) translate(-50, -50)">${a}</g>`,y=T2(u,s);return lt(p+y,r,o)}function q2(c){const r=["circle","rounded","square"],l=["dragon","unicorn","phoenix","griffin","yeti","cerberus","kitsune","minotaur","fairy","hydra"],o=["happy","majestic","surprised","mysterious"],s=["none","spots","stripes","scales"],u=["none","sparkles","runes","orbs"],a=["#7b2d8e","#5b1d6e","#4a0e6e","#8e44ad","#c0392b","#e74c3c","#1a6b3c","#2ecc71","#2c3e80","#3498db","#c79c2a","#d4a017","#708090","#4a4a4a","#8b1a1a","#2d5016"],f=["#f0e6ff","#ffe6f0","#e6fff0","#fff8e1","#e6f0ff","#ffffff","#fce4ec","#f3e5f5"],p=["#1a0a2e","#0d1b2a","#1b0a2e","#2a0a1b","#0a1e2e","#1e0a2e","#0a2e1a","#2e1a0a","#161625","#1a1a2e","#0f0f23","#1e1025"],y=["#ffd700","#ff6b6b","#00ffaa","#6bb5ff","#ff69b4"];return{backgroundShape:D(r,c),creatureType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),eyeColor:D(y,c),backgroundColor:D(p,c),expression:D(o,c),pattern:D(s,c),magic:D(u,c)}}var Y2={name:"Mythical",schema:N2,shapeParam:"creatureType",generate:W2,randomize:q2},G2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},insectType:{type:"select",default:"butterfly",options:["butterfly","bee","ladybug","ant","beetle","dragonfly","caterpillar","firefly","mantis","spider"]},primaryColor:{type:"color",default:"#4CAF50"},secondaryColor:{type:"color",default:"#FFC107"},wingColor:{type:"color",default:"#81D4FA"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#E8F5E9"},expression:{type:"select",default:"happy",options:["happy","curious","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","gradient"]},decoration:{type:"select",default:"none",options:["none","leaves","flowers","dewdrops"]}};function Nt(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"curious":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.15}" fill="white"/>
        <circle cx="${l+1}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${s+1}" cy="${u}" r="${p*1.1}" fill="${r}"/>
        <circle cx="${l}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function It(c,r,l,o){switch(c){case"happy":return`<path d="M${l-4},${o} Q${l},${o+4} ${l+4},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;case"curious":return`<ellipse cx="${l+2}" cy="${o}" rx="2" ry="2.5" fill="${r}"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="2.5" ry="3.5" fill="${r}"/>`;case"sleepy":return`<line x1="${l-3}" y1="${o}" x2="${l+3}" y2="${o}" stroke="${r}" stroke-width="1.2" stroke-linecap="round"/>`;default:return""}}function To(c,r,l,o,s,u){return`
    <path d="M${r},${l} Q${r-6},${l-u} ${r-10},${l-u-4}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${r-10}" cy="${l-u-4}" r="2" fill="${c}"/>
    <path d="M${o},${s} Q${o+6},${s-u} ${o+10},${s-u-4}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${o+10}" cy="${s-u-4}" r="2" fill="${c}"/>
  `}function Tt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.35}" cy="${l-s*.15}" r="${o*.06}" fill="${a}" opacity="0.35"/>
        <circle cx="${r-o*.1}" cy="${l+s*.25}" r="${o*.07}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.4}" cy="${l+s*.2}" r="${o*.05}" fill="${a}" opacity="0.35"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.25} Q${r},${l-s*.35} ${r+o*.7},${l-s*.25}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.8},${l+s*.05} Q${r},${l-s*.05} ${r+o*.8},${l+s*.05}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
      `;case"gradient":{const f=`insect-grad-${r}-${l}`;return`
        <defs>
          <radialGradient id="${f}" cx="40%" cy="40%">
            <stop offset="0%" stop-color="${R(c,20)}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${a}" stop-opacity="0.15"/>
          </radialGradient>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${s*.85}" fill="url(#${f})"/>
      `}default:return""}}function X2(c){switch(c){case"leaves":return`
        <g opacity="0.3">
          <path d="M10,90 Q8,82 12,76" stroke="#2d6b16" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="13" cy="77" rx="4" ry="2" fill="#4a8c28" transform="rotate(25, 13, 77)"/>
          <ellipse cx="10" cy="81" rx="3.5" ry="1.8" fill="#3d7b22" transform="rotate(-20, 10, 81)"/>
          <ellipse cx="12" cy="85" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(10, 12, 85)"/>
          <path d="M88,92 Q90,84 86,78" stroke="#2d6b16" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="85" cy="79" rx="4" ry="2" fill="#4a8c28" transform="rotate(-30, 85, 79)"/>
          <ellipse cx="88" cy="83" rx="3.5" ry="1.8" fill="#3d7b22" transform="rotate(15, 88, 83)"/>
          <path d="M6,16 Q8,12 12,14" stroke="#2d6b16" stroke-width="1" fill="none" stroke-linecap="round"/>
          <ellipse cx="12" cy="13" rx="3" ry="1.5" fill="#4a8c28" opacity="0.7" transform="rotate(-10, 12, 13)"/>
        </g>
      `;case"flowers":return`
        <g opacity="0.4">
          <circle cx="12" cy="84" r="3" fill="#e91e63"/>
          <circle cx="9" cy="84" r="2" fill="#f48fb1"/>
          <circle cx="15" cy="84" r="2" fill="#f48fb1"/>
          <circle cx="12" cy="81" r="2" fill="#f48fb1"/>
          <circle cx="12" cy="87" r="2" fill="#f48fb1"/>
          <circle cx="12" cy="84" r="1.5" fill="#ffeb3b"/>
          <path d="M12,88 Q12,92 10,96" stroke="#2d6b16" stroke-width="1" fill="none" stroke-linecap="round"/>
          <circle cx="86" cy="14" r="2.5" fill="#9c27b0"/>
          <circle cx="84" cy="14" r="1.5" fill="#ce93d8"/>
          <circle cx="88" cy="14" r="1.5" fill="#ce93d8"/>
          <circle cx="86" cy="12" r="1.5" fill="#ce93d8"/>
          <circle cx="86" cy="16" r="1.5" fill="#ce93d8"/>
          <circle cx="86" cy="14" r="1" fill="#ffeb3b"/>
          <circle cx="88" cy="86" r="2" fill="#ff7043"/>
          <circle cx="86" cy="86" r="1.2" fill="#ffab91"/>
          <circle cx="90" cy="86" r="1.2" fill="#ffab91"/>
          <circle cx="88" cy="84" r="1.2" fill="#ffab91"/>
          <circle cx="88" cy="88" r="1.2" fill="#ffab91"/>
          <circle cx="88" cy="86" r="0.8" fill="#ffeb3b"/>
        </g>
      `;case"dewdrops":return`
        <g>
          <ellipse cx="12" cy="82" rx="2.5" ry="3" fill="white" opacity="0.25"/>
          <ellipse cx="12" cy="81" rx="1.5" ry="1.8" fill="white" opacity="0.35"/>
          <circle cx="11" cy="80" r="0.6" fill="white" opacity="0.5"/>
          <ellipse cx="86" cy="16" rx="2" ry="2.5" fill="white" opacity="0.2"/>
          <ellipse cx="86" cy="15" rx="1.2" ry="1.5" fill="white" opacity="0.3"/>
          <circle cx="85.5" cy="14.5" r="0.5" fill="white" opacity="0.5"/>
          <ellipse cx="14" cy="18" rx="1.5" ry="2" fill="white" opacity="0.2"/>
          <ellipse cx="14" cy="17.5" rx="0.8" ry="1" fill="white" opacity="0.35"/>
          <ellipse cx="88" cy="80" rx="2" ry="2.5" fill="white" opacity="0.22"/>
          <ellipse cx="88" cy="79" rx="1.2" ry="1.5" fill="white" opacity="0.32"/>
          <circle cx="87.5" cy="78.5" r="0.5" fill="white" opacity="0.5"/>
          <ellipse cx="50" cy="92" rx="1.8" ry="2.2" fill="white" opacity="0.18"/>
          <ellipse cx="50" cy="91.5" rx="1" ry="1.2" fill="white" opacity="0.28"/>
        </g>
      `;default:return""}}function m0(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <path d="M50,42 Q22,20 14,34 Q8,46 24,52 Q34,56 50,48" fill="${o}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,42 Q78,20 86,34 Q92,46 76,52 Q66,56 50,48" fill="${o}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,52 Q28,58 20,68 Q16,76 30,74 Q40,72 50,60" fill="${R(o,15)}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,52 Q72,58 80,68 Q84,76 70,74 Q60,72 50,60" fill="${R(o,15)}" stroke="${S(o,20)}" stroke-width="0.8"/>
  `,y=`
    <circle cx="30" cy="36" r="5" fill="${l}" opacity="0.6"/>
    <circle cx="70" cy="36" r="5" fill="${l}" opacity="0.6"/>
    <circle cx="28" cy="66" r="3.5" fill="${l}" opacity="0.5"/>
    <circle cx="72" cy="66" r="3.5" fill="${l}" opacity="0.5"/>
  `,$=`
    <ellipse cx="50" cy="50" rx="4" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="50" rx="2.5" ry="14" fill="${l}" opacity="0.3"/>
  `,g=`
    <path d="M48,36 Q42,22 36,16" stroke="${f}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="16" r="2" fill="${f}"/>
    <path d="M52,36 Q58,22 64,16" stroke="${f}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="64" cy="16" r="2" fill="${f}"/>
  `,m=Nt(u,s,46,40,54,40,3.5),v=It(u,f,50,48),M=Tt(r,50,50,4,16,a);return p+y+$+M+g+m+v}function K2(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="54" rx="18" ry="20" fill="${r}"/>
  `,y=`
    <path d="M34,46 Q50,42 66,46" stroke="${l}" stroke-width="4" fill="none"/>
    <path d="M32,54 Q50,50 68,54" stroke="${l}" stroke-width="4" fill="none"/>
    <path d="M34,62 Q50,58 66,62" stroke="${l}" stroke-width="4" fill="none"/>
  `,$=`
    <ellipse cx="34" cy="38" rx="10" ry="6" fill="${o}" opacity="0.6" transform="rotate(-20, 34, 38)"/>
    <ellipse cx="66" cy="38" rx="10" ry="6" fill="${o}" opacity="0.6" transform="rotate(20, 66, 38)"/>
  `,g=`
    <circle cx="50" cy="32" r="12" fill="${r}"/>
    <circle cx="50" cy="30" r="8" fill="${R(r,15)}" opacity="0.2"/>
  `,m=`
    <polygon points="50,74 48,78 52,78" fill="${f}"/>
  `,v=`
    <line x1="40" y1="66" x2="34" y2="74" stroke="${f}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="50" y1="68" x2="50" y2="76" stroke="${f}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="60" y1="66" x2="66" y2="74" stroke="${f}" stroke-width="1.5" stroke-linecap="round"/>
  `,M=To(f,44,22,56,22,10),x=Nt(u,s,44,30,56,30,4.5),w=It(u,f,50,38),_=Tt(r,50,54,18,20,a);return $+v+m+p+y+_+g+M+x+w}function J2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="56" rx="24" ry="22" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="20" ry="16" fill="${R(r,10)}" opacity="0.15"/>
  `,p=`
    <line x1="50" y1="36" x2="50" y2="78" stroke="${a}" stroke-width="1.5"/>
  `,y=`
    <circle cx="40" cy="48" r="3.5" fill="${a}"/>
    <circle cx="60" cy="48" r="3.5" fill="${a}"/>
    <circle cx="36" cy="60" r="3" fill="${a}"/>
    <circle cx="64" cy="60" r="3" fill="${a}"/>
    <circle cx="42" cy="70" r="2.5" fill="${a}"/>
    <circle cx="58" cy="70" r="2.5" fill="${a}"/>
  `,$=`
    <circle cx="50" cy="34" r="10" fill="${a}"/>
    <circle cx="50" cy="32" r="6" fill="${R(a,15)}" opacity="0.15"/>
  `,g=`
    <line x1="30" y1="50" x2="22" y2="56" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="60" x2="20" y2="64" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="30" y1="70" x2="24" y2="76" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="50" x2="78" y2="56" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="72" y1="60" x2="80" y2="64" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="76" y2="76" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,m=To(a,44,26,56,26,8),v=Nt(s,o,45,32,55,32,3.5),M=It(s,l,50,39),x=Tt(r,50,56,24,22,u);return g+f+p+y+x+$+m+v+M}function e5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <circle cx="50" cy="28" r="14" fill="${r}"/>
    <circle cx="50" cy="26" r="9" fill="${R(r,12)}" opacity="0.15"/>
  `,p=`
    <ellipse cx="50" cy="50" rx="10" ry="8" fill="${r}"/>
  `,y=`
    <ellipse cx="50" cy="70" rx="14" ry="12" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="9" ry="8" fill="${l}" opacity="0.2"/>
  `,$=`
    <rect x="47" y="40" width="6" height="6" rx="2" fill="${a}" opacity="0.3"/>
  `,g=`
    <rect x="47" y="56" width="6" height="6" rx="2" fill="${a}" opacity="0.3"/>
  `,m=`
    <path d="M42,38 Q38,42 36,40" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,38 Q62,42 64,40" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M42,46 L28,40 L22,46" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,46 L72,40 L78,46" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,50 L26,52 L22,58" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,50 L74,52 L78,58" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,54 L28,60 L24,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L72,60 L76,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,M=To(a,42,18,58,18,12),x=Nt(s,o,44,26,56,26,4),w=It(s,a,50,36),_=Tt(r,50,70,14,12,u);return v+y+g+p+$+f+m+_+M+x+w}function t5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,15),p=`
    <ellipse cx="50" cy="58" rx="22" ry="24" fill="${r}"/>
    <ellipse cx="50" cy="54" rx="18" ry="18" fill="${f}" opacity="0.12"/>
  `,y=`
    <line x1="50" y1="36" x2="50" y2="82" stroke="${a}" stroke-width="1.2"/>
  `,$=`
    <circle cx="50" cy="34" r="12" fill="${a}"/>
    <circle cx="50" cy="32" r="7" fill="${R(a,12)}" opacity="0.15"/>
  `,g=`
    <path d="M50,22 Q52,14 50,8" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,m=`
    <path d="M42,40 Q38,44 34,42" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,40 Q62,44 66,42" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M32,50 L22,44 L18,50" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M68,50 L78,44 L82,50" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30,60 L18,60 L14,66" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M70,60 L82,60 L86,66" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32,72 L22,76 L20,82" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M68,72 L78,76 L80,82" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <ellipse cx="42" cy="50" rx="4" ry="8" fill="white" opacity="0.1" transform="rotate(-15, 42, 50)"/>
  `,x=Nt(s,o,44,32,56,32,3.5),w=It(s,l,50,40),_=Tt(r,50,58,22,24,u);return v+p+y+M+_+$+g+m+x+w}function r5(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="30" cy="36" rx="18" ry="5" fill="${o}" opacity="0.45" transform="rotate(-15, 30, 36)"/>
    <ellipse cx="70" cy="36" rx="18" ry="5" fill="${o}" opacity="0.45" transform="rotate(15, 70, 36)"/>
    <ellipse cx="32" cy="44" rx="16" ry="4.5" fill="${o}" opacity="0.35" transform="rotate(10, 32, 44)"/>
    <ellipse cx="68" cy="44" rx="16" ry="4.5" fill="${o}" opacity="0.35" transform="rotate(-10, 68, 44)"/>
  `,y=`
    <line x1="20" y1="36" x2="42" y2="34" stroke="${S(o,20)}" stroke-width="0.4" opacity="0.5"/>
    <line x1="58" y1="34" x2="80" y2="36" stroke="${S(o,20)}" stroke-width="0.4" opacity="0.5"/>
  `,$=`
    <circle cx="50" cy="26" r="12" fill="${r}"/>
  `,g=`
    <ellipse cx="50" cy="42" rx="8" ry="6" fill="${r}"/>
  `,m=`
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${r}"/>
    <rect x="48" y="50" width="4" height="32" rx="2" fill="${l}" opacity="0.2"/>
  `,v=`
    <line x1="47" y1="56" x2="53" y2="56" stroke="${f}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="62" x2="53" y2="62" stroke="${f}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="68" x2="53" y2="68" stroke="${f}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="74" x2="53" y2="74" stroke="${f}" stroke-width="0.8" opacity="0.3"/>
  `,M=`
    <line x1="44" y1="42" x2="38" y2="50" stroke="${f}" stroke-width="1" stroke-linecap="round"/>
    <line x1="56" y1="42" x2="62" y2="50" stroke="${f}" stroke-width="1" stroke-linecap="round"/>
  `,x=Nt(u,s,43,24,57,24,5),w=It(u,f,50,32),_=Tt(r,50,42,8,6,a);return p+y+M+m+v+g+_+$+x+w}function n5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,15),p=`
    <circle cx="18" cy="62" r="8" fill="${r}"/>
    <circle cx="30" cy="58" r="9" fill="${f}"/>
    <circle cx="43" cy="56" r="9.5" fill="${r}"/>
    <circle cx="56" cy="58" r="9" fill="${f}"/>
    <circle cx="68" cy="62" r="8.5" fill="${r}"/>
  `,y=`
    <circle cx="80" cy="56" r="12" fill="${r}"/>
    <circle cx="80" cy="54" r="8" fill="${R(r,12)}" opacity="0.15"/>
  `,$=`
    <circle cx="18" cy="64" r="4" fill="${l}" opacity="0.3"/>
    <circle cx="30" cy="60" r="5" fill="${l}" opacity="0.25"/>
    <circle cx="43" cy="58" r="5" fill="${l}" opacity="0.3"/>
    <circle cx="56" cy="60" r="5" fill="${l}" opacity="0.25"/>
    <circle cx="68" cy="64" r="4.5" fill="${l}" opacity="0.3"/>
  `,g=`
    <line x1="14" y1="68" x2="12" y2="74" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="22" y1="68" x2="24" y2="74" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="65" x2="24" y2="72" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="34" y1="65" x2="36" y2="72" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="39" y1="64" x2="37" y2="70" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="47" y1="64" x2="49" y2="70" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="52" y1="65" x2="50" y2="72" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="60" y1="65" x2="62" y2="72" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="64" y1="68" x2="62" y2="74" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="72" y1="68" x2="74" y2="74" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,m=`
    <path d="M76,46 Q72,38 68,34" stroke="${a}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="68" cy="34" r="1.5" fill="${a}"/>
    <path d="M84,46 Q88,38 92,34" stroke="${a}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="92" cy="34" r="1.5" fill="${a}"/>
  `,v=Nt(s,o,76,54,86,54,3.5),M=It(s,a,80,62),x=Tt(r,43,56,9.5,9.5,u);return g+p+$+x+y+m+v+M}function l5(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p="firefly-glow",y=`
    <defs>
      <radialGradient id="${p}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${l}" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="${l}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${l}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="70" r="16" fill="url(#${p})"/>
    <ellipse cx="50" cy="68" rx="10" ry="12" fill="${l}" opacity="0.7"/>
    <ellipse cx="50" cy="66" rx="6" ry="7" fill="${R(l,25)}" opacity="0.5"/>
  `,$=`
    <ellipse cx="50" cy="48" rx="10" ry="10" fill="${r}"/>
  `,g=`
    <circle cx="50" cy="32" r="10" fill="${r}"/>
    <circle cx="50" cy="30" r="6" fill="${R(r,12)}" opacity="0.15"/>
  `,m=`
    <ellipse cx="34" cy="42" rx="12" ry="5" fill="${o}" opacity="0.4" transform="rotate(-25, 34, 42)"/>
    <ellipse cx="66" cy="42" rx="12" ry="5" fill="${o}" opacity="0.4" transform="rotate(25, 66, 42)"/>
  `,v=`
    <line x1="42" y1="52" x2="36" y2="60" stroke="${f}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="58" y1="52" x2="64" y2="60" stroke="${f}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="44" y1="56" x2="38" y2="64" stroke="${f}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="56" y1="56" x2="62" y2="64" stroke="${f}" stroke-width="1.2" stroke-linecap="round"/>
  `,M=To(f,44,24,56,24,10),x=Nt(u,s,45,30,55,30,3.5),w=It(u,f,50,38),_=Tt(r,50,48,10,10,a);return m+v+y+$+_+g+M+x+w}function o5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <path d="M38,24 L50,14 L62,24 Q54,32 50,34 Q46,32 38,24 Z" fill="${r}"/>
    <path d="M42,22 L50,16 L58,22 Q52,28 50,30 Q48,28 42,22 Z" fill="${R(r,10)}" opacity="0.15"/>
  `,p=`
    <rect x="47" y="32" width="6" height="8" rx="2" fill="${r}"/>
  `,y=`
    <ellipse cx="50" cy="48" rx="8" ry="10" fill="${r}"/>
  `,$=`
    <ellipse cx="50" cy="70" rx="10" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="6" ry="10" fill="${l}" opacity="0.2"/>
  `,g=`
    <path d="M42,42 L30,34 L28,44 L38,46" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58,42 L70,34 L72,44 L62,46" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28,44 L24,42" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M72,44 L76,42" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,m=`
    <path d="M42,54 L30,58 L26,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L70,58 L74,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,62 L32,68 L28,78" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,62 L68,68 L72,78" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M44,16 Q38,8 32,4" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M56,16 Q62,8 68,4" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
  `,M=Nt(s,o,44,22,56,22,4),x=It(s,a,50,30),w=Tt(r,50,70,10,14,u);return m+$+y+p+f+g+w+v+M+x}function i5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <circle cx="50" cy="54" r="18" fill="${r}"/>
    <circle cx="50" cy="56" r="12" fill="${l}" opacity="0.2"/>
  `,p=`
    <circle cx="50" cy="34" r="12" fill="${r}"/>
    <circle cx="50" cy="32" r="7" fill="${R(r,12)}" opacity="0.15"/>
  `,y=`
    <path d="M40,38 L24,24 L16,30" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60,38 L76,24 L84,30" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,42 L20,38 L12,44" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,42 L80,38 L88,44" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36,54 L18,56 L10,62" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64,54 L82,56 L90,62" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,64 L24,72 L18,80" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,64 L76,72 L82,80" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `,$=(()=>{const M=Nt(s,o,45,32,55,32,4),x=`
      <circle cx="42" cy="28" r="1.5" fill="white"/>
      <circle cx="42" cy="28" r="0.8" fill="${o}"/>
      <circle cx="58" cy="28" r="1.5" fill="white"/>
      <circle cx="58" cy="28" r="0.8" fill="${o}"/>
    `;return M+x})(),g=`
    <line x1="46" y1="42" x2="44" y2="47" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="42" x2="56" y2="47" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,m=It(s,a,50,40),v=Tt(r,50,54,18,18,u);return y+f+v+p+$+g+m}var s5={butterfly:.8,bee:.82,ladybug:.8,ant:.76,beetle:.78,dragonfly:.74,caterpillar:.72,firefly:.8,mantis:.74,spider:.76};function c5(c){const{backgroundShape:r,insectType:l,backgroundColor:o,decoration:s}=c;let u;switch(l){case"butterfly":u=m0(c);break;case"bee":u=K2(c);break;case"ladybug":u=J2(c);break;case"ant":u=e5(c);break;case"beetle":u=t5(c);break;case"dragonfly":u=r5(c);break;case"caterpillar":u=n5(c);break;case"firefly":u=l5(c);break;case"mantis":u=o5(c);break;case"spider":u=i5(c);break;default:u=m0(c)}const f=`<g transform="translate(50, 50) scale(${s5[l]??.78}) translate(-50, -50)">${u}</g>`,p=X2(s);return lt(f+p,r,o)}function a5(c){const r=["circle","rounded","square"],l=["butterfly","bee","ladybug","ant","beetle","dragonfly","caterpillar","firefly","mantis","spider"],o=["happy","curious","surprised","sleepy"],s=["none","spots","stripes","gradient"],u=["none","leaves","flowers","dewdrops"],a=["#4CAF50","#388E3C","#2E7D32","#1B5E20","#5D4037","#3E2723","#212121","#37474F","#D32F2F","#E53935","#1565C0","#1976D2","#F57F17","#E65100","#4E342E","#33691E"],f=["#FFC107","#FFEB3B","#FFE0B2","#FFF9C4","#FFFFFF","#F5F5F5","#FFD54F","#FFCC80"],p=["#81D4FA","#CE93D8","#FFAB91","#80CBC4","#B39DDB","#EF9A9A","#A5D6A7","#FFF59D"],y=["#E8F5E9","#C8E6C9","#DCEDC8","#F1F8E9","#FFF8E1","#FFF3E0","#E0F2F1","#F3E5F5","#E8EAF6","#FCE4EC","#F9FBE7","#FFFDE7"],$=["#1a1a1a","#8B0000","#DAA520","#2E7D32","#FF8F00"];return{backgroundShape:D(r,c),insectType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),wingColor:D(p,c),eyeColor:D($,c),backgroundColor:D(y,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var u5={name:"Insects",schema:G2,shapeParam:"insectType",generate:c5,randomize:a5},f5={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},birdType:{type:"select",default:"parrot",options:["parrot","owl","penguin","flamingo","eagle","toucan","peacock","hummingbird","robin","crow"]},primaryColor:{type:"color",default:"#43A047"},secondaryColor:{type:"color",default:"#FFF9C4"},crestColor:{type:"color",default:"#F44336"},eyeColor:{type:"color",default:"#212121"},backgroundColor:{type:"color",default:"#E3F2FD"},expression:{type:"select",default:"happy",options:["happy","proud","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","feathers"]},decoration:{type:"select",default:"none",options:["none","branches","clouds","feathers"]}};function Dt(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"proud":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.6} L${l+f},${o-f*.2}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${s-f},${u-f*.2} L${s+f},${u-f*.6}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function hl(c,r,l,o){const s=S(r,20);switch(c){case"happy":return`
        <path d="M${l-4},${o} L${l},${o+5} L${l+4},${o}" fill="${r}" stroke="${s}" stroke-width="0.6"/>
      `;case"proud":return`
        <path d="M${l-4},${o} L${l},${o+4} L${l+4},${o}" fill="${r}" stroke="${s}" stroke-width="0.6"/>
      `;case"surprised":return`
        <path d="M${l-5},${o} L${l},${o+7} L${l+5},${o}" fill="${r}" stroke="${s}" stroke-width="0.6"/>
      `;case"sleepy":return`
        <path d="M${l-3},${o} L${l},${o+3} L${l+3},${o}" fill="${r}" stroke="${s}" stroke-width="0.6"/>
      `;default:return""}}function Bt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.35}" cy="${l-s*.15}" r="${o*.06}" fill="${a}" opacity="0.35"/>
        <circle cx="${r-o*.1}" cy="${l+s*.25}" r="${o*.07}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.4}" cy="${l+s*.2}" r="${o*.05}" fill="${a}" opacity="0.35"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.25} Q${r},${l-s*.35} ${r+o*.7},${l-s*.25}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.8},${l+s*.05} Q${r},${l-s*.05} ${r+o*.8},${l+s*.05}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
      `;case"feathers":{const f=R(c,15);return`
        <path d="M${r-o*.4},${l-s*.3} Q${r-o*.2},${l-s*.4} ${r},${l-s*.3}" stroke="${f}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r},${l-s*.2} Q${r+o*.2},${l-s*.3} ${r+o*.4},${l-s*.2}" stroke="${f}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r-o*.35},${l+s*.1} Q${r-o*.15},${l} ${r+o*.05},${l+s*.1}" stroke="${f}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r+o*.05},${l+s*.2} Q${r+o*.25},${l+s*.1} ${r+o*.4},${l+s*.2}" stroke="${f}" stroke-width="1" fill="none" opacity="0.4"/>
      `}default:return""}}function d5(c){switch(c){case"branches":return`
        <g opacity="0.3">
          <path d="M8,88 Q10,78 14,72" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M14,72 Q18,68 22,70" stroke="#5D4037" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M12,76 Q8,74 6,70" stroke="#5D4037" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <ellipse cx="23" cy="69" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(-10, 23, 69)"/>
          <ellipse cx="5" cy="69" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(20, 5, 69)"/>
          <path d="M86,92 Q88,82 84,76" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M84,76 Q80,72 76,74" stroke="#5D4037" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="75" cy="73" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(15, 75, 73)"/>
          <path d="M88,12 Q90,8 94,6" stroke="#5D4037" stroke-width="1" fill="none" stroke-linecap="round"/>
          <ellipse cx="94" cy="5" rx="2.5" ry="1.2" fill="#4a8c28" transform="rotate(-20, 94, 5)"/>
        </g>
      `;case"clouds":return`
        <g opacity="0.2">
          <ellipse cx="14" cy="14" rx="8" ry="4" fill="white"/>
          <ellipse cx="10" cy="13" rx="5" ry="3" fill="white"/>
          <ellipse cx="18" cy="13" rx="5" ry="3" fill="white"/>
          <ellipse cx="82" cy="10" rx="6" ry="3" fill="white"/>
          <ellipse cx="78" cy="9" rx="4" ry="2.5" fill="white"/>
          <ellipse cx="86" cy="9" rx="4" ry="2.5" fill="white"/>
          <ellipse cx="88" cy="88" rx="7" ry="3.5" fill="white"/>
          <ellipse cx="84" cy="87" rx="4.5" ry="2.5" fill="white"/>
          <ellipse cx="92" cy="87" rx="4.5" ry="2.5" fill="white"/>
        </g>
      `;case"feathers":return`
        <g opacity="0.25">
          <path d="M10,84 Q12,78 16,76 Q12,80 14,86 Q10,82 10,84 Z" fill="#8D6E63"/>
          <path d="M10,84 L13,80" stroke="#6D4C41" stroke-width="0.5" fill="none"/>
          <path d="M86,12 Q88,6 92,4 Q88,8 90,14 Q86,10 86,12 Z" fill="#78909C"/>
          <path d="M86,12 L89,8" stroke="#546E7A" stroke-width="0.5" fill="none"/>
          <path d="M84,90 Q86,84 90,82 Q86,86 88,92 Q84,88 84,90 Z" fill="#A1887F"/>
          <path d="M84,90 L87,86" stroke="#6D4C41" stroke-width="0.5" fill="none"/>
          <path d="M12,16 Q14,10 18,8 Q14,12 16,18 Q12,14 12,16 Z" fill="#90A4AE"/>
          <path d="M12,16 L15,12" stroke="#607D8B" stroke-width="0.5" fill="none"/>
        </g>
      `;default:return""}}function w0(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${l}" opacity="0.4"/>
  `,y=`
    <circle cx="50" cy="32" r="14" fill="${r}"/>
    <circle cx="50" cy="30" r="9" fill="${R(r,12)}" opacity="0.15"/>
  `,$=`
    <path d="M44,20 Q40,8 36,4" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,18 Q50,6 52,2" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,20 Q60,8 64,4" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="4" r="2" fill="${o}"/>
    <circle cx="52" cy="2" r="2" fill="${o}"/>
    <circle cx="64" cy="4" r="2" fill="${o}"/>
  `,g=hl(u,"#FF8F00",50,42),m=`
    <path d="M34,48 Q22,42 18,52 Q16,60 28,62" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
    <path d="M66,48 Q78,42 82,52 Q84,60 72,62" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
  `,v=`
    <path d="M44,76 Q38,88 34,96" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,90 50,98" stroke="${S(r,10)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q62,88 66,96" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=Dt(u,s,44,30,56,30,4),w=Bt(r,50,58,16,20,a);return v+m+p+w+y+$+g+M+x}function p5(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="60" rx="18" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="64" rx="14" ry="14" fill="${l}" opacity="0.4"/>
  `,y=`
    <circle cx="50" cy="34" r="18" fill="${r}"/>
  `,$=`
    <path d="M34,22 Q30,10 28,4" stroke="${o}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,22 Q70,10 72,4" stroke="${o}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,g=`
    <circle cx="42" cy="32" r="9" fill="${R(r,20)}" opacity="0.3"/>
    <circle cx="58" cy="32" r="9" fill="${R(r,20)}" opacity="0.3"/>
  `,m=Dt(u,s,42,32,58,32,5.5),v=hl(u,"#FF8F00",50,42),M=`
    <path d="M32,50 Q20,48 18,58 Q16,66 26,66" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
    <path d="M68,50 Q80,48 82,58 Q84,66 74,66" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
  `,x=`
    <path d="M42,78 L38,84 M42,78 L42,84 M42,78 L46,84" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,78 L54,84 M58,78 L58,84 M58,78 L62,84" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,w=Bt(r,50,60,18,20,a);return M+p+w+y+$+g+m+v+x}function h5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="54" rx="18" ry="24" fill="${r}"/>
  `,p=`
    <ellipse cx="50" cy="58" rx="12" ry="18" fill="${l}"/>
  `,y=`
    <circle cx="50" cy="28" r="14" fill="${r}"/>
  `,$=`
    <circle cx="50" cy="30" r="9" fill="${l}" opacity="0.6"/>
  `,g=`
    <path d="M32,46 Q22,50 20,60 Q20,66 26,64" fill="${r}" stroke="${a}" stroke-width="0.6"/>
    <path d="M68,46 Q78,50 80,60 Q80,66 74,64" fill="${r}" stroke="${a}" stroke-width="0.6"/>
  `,m=hl(s,"#FF6F00",50,38),v=`
    <path d="M40,76 L34,82 L44,82 Z" fill="#FF6F00"/>
    <path d="M60,76 L56,82 L66,82 Z" fill="#FF6F00"/>
  `,M=Dt(s,o,44,28,56,28,3.5),x=Bt(r,50,54,18,24,u);return g+f+p+x+y+$+M+m+v}function y5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <path d="M50,40 Q42,28 44,18 Q46,10 50,8 Q54,10 56,18 Q58,28 50,40" fill="${r}" stroke="${a}" stroke-width="0.6"/>
  `,p=`
    <ellipse cx="50" cy="52" rx="18" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="${R(r,10)}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="10" r="8" fill="${r}"/>
  `,$=`
    <path d="M46,14 L42,18 Q44,20 48,18 Z" fill="#212121" stroke="${S("#212121",20)}" stroke-width="0.4"/>
    <path d="M54,14 L58,18 Q56,20 52,18 Z" fill="#212121" stroke="${S("#212121",20)}" stroke-width="0.4"/>
  `,g=`
    <path d="M34,46 Q26,40 22,48 Q20,54 30,56" fill="${S(r,12)}" stroke="${a}" stroke-width="0.6"/>
    <path d="M66,46 Q74,40 78,48 Q80,54 70,56" fill="${S(r,12)}" stroke="${a}" stroke-width="0.6"/>
  `,m=`
    <line x1="44" y1="64" x2="40" y2="86" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <line x1="56" y1="64" x2="60" y2="86" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <path d="M36,86 L40,86 L44,86" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,86 L60,86 L64,86" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M50,64 Q44,70 40,68" stroke="${l}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M50,64 Q56,70 60,68" stroke="${l}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,M=Dt(s,o,46,8,54,8,2.5),x=Bt(r,50,52,18,14,u);return m+v+g+p+x+f+y+M+$}function $5(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="56" rx="20" ry="22" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="14" ry="14" fill="${l}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="30" r="14" fill="${o}"/>
    <circle cx="50" cy="28" r="9" fill="${R(o,10)}" opacity="0.15"/>
  `,$=`
    <path d="M38,24 L44,26" stroke="${S(o,30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M62,24 L56,26" stroke="${S(o,30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,g=`
    <path d="M47,36 L50,44 L53,36" fill="#FFB300" stroke="${S("#FFB300",20)}" stroke-width="0.6"/>
    <path d="M49,40 Q50,42 51,40" stroke="${S("#FFB300",30)}" stroke-width="0.4" fill="none"/>
  `,m=`
    <path d="M30,46 Q14,36 10,44 Q8,52 22,56" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
    <path d="M70,46 Q86,36 90,44 Q92,52 78,56" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
  `,v=`
    <path d="M40,76 L36,82 M40,76 L40,84 M40,76 L44,82" stroke="${f}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M60,76 L56,82 M60,76 L60,84 M60,76 L64,82" stroke="${f}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,76 Q38,84 34,88" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,86 50,90" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q62,84 66,88" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,x=Dt(u,s,44,28,56,28,4),w=Bt(r,50,56,20,22,a);return M+m+p+w+y+$+x+g+v}function k5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=`
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${l}" opacity="0.35"/>
  `,p=`
    <circle cx="50" cy="32" r="13" fill="${r}"/>
    <circle cx="50" cy="30" r="8" fill="${R(r,12)}" opacity="0.15"/>
  `,y=`
    <path d="M56,30 Q74,28 78,34 Q80,38 74,40 Q68,42 56,38 Z" fill="#FF6F00" stroke="${S("#FF6F00",20)}" stroke-width="0.8"/>
    <path d="M62,32 Q72,30 76,34" fill="none" stroke="#FFCA28" stroke-width="1.5" opacity="0.5"/>
    <path d="M74,38 Q72,40 66,40" fill="none" stroke="#E65100" stroke-width="1" opacity="0.4"/>
    <circle cx="76" cy="34" r="1" fill="#212121"/>
  `,$=`
    <path d="M34,50 Q24,46 20,54 Q18,60 28,60" fill="${S(r,15)}" stroke="${a}" stroke-width="0.6"/>
    <path d="M66,50 Q76,46 80,54 Q82,60 72,60" fill="${S(r,15)}" stroke="${a}" stroke-width="0.6"/>
  `,g=`
    <path d="M46,76 Q42,86 40,92" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,76 Q58,86 60,92" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,m=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=Dt(s,o,46,30,52,30,3),M=Bt(r,50,58,16,20,u);return g+$+f+M+p+y+v+m}function x5(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <path d="M50,50 Q20,10 10,20" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q16,18 12,30" stroke="${R(r,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q14,26 14,40" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q80,10 90,20" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q84,18 88,30" stroke="${R(r,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q86,26 86,40" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q50,6 50,14" stroke="${R(r,15)}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,y=`
    <circle cx="12" cy="22" r="4" fill="${l}"/>
    <circle cx="12" cy="22" r="2" fill="${r}"/>
    <circle cx="14" cy="32" r="3.5" fill="${l}"/>
    <circle cx="14" cy="32" r="1.8" fill="${r}"/>
    <circle cx="16" cy="42" r="3" fill="${l}"/>
    <circle cx="16" cy="42" r="1.5" fill="${r}"/>
    <circle cx="88" cy="22" r="4" fill="${l}"/>
    <circle cx="88" cy="22" r="2" fill="${r}"/>
    <circle cx="86" cy="32" r="3.5" fill="${l}"/>
    <circle cx="86" cy="32" r="1.8" fill="${r}"/>
    <circle cx="84" cy="42" r="3" fill="${l}"/>
    <circle cx="84" cy="42" r="1.5" fill="${r}"/>
    <circle cx="50" cy="16" r="3.5" fill="${l}"/>
    <circle cx="50" cy="16" r="1.8" fill="${r}"/>
  `,$=`
    <ellipse cx="50" cy="64" rx="14" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${l}" opacity="0.3"/>
  `,g=`
    <rect x="47" y="44" width="6" height="10" rx="3" fill="${r}"/>
  `,m=`
    <circle cx="50" cy="42" r="10" fill="${r}"/>
  `,v=`
    <path d="M48,34 Q46,26 44,22" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="22" r="1.5" fill="${o}"/>
    <path d="M50,33 Q50,25 50,20" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="20" r="1.5" fill="${o}"/>
    <path d="M52,34 Q54,26 56,22" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="22" r="1.5" fill="${o}"/>
  `,M=hl(u,"#FF8F00",50,48),x=`
    <path d="M44,78 L40,86 M44,78 L44,86 M44,78 L48,86" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,78 L52,86 M56,78 L56,86 M56,78 L60,86" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,w=Dt(u,s,45,40,55,40,3.5),_=Bt(r,50,64,14,16,a);return p+y+$+_+g+m+v+w+M+x}function g5(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="50" rx="10" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="7" ry="9" fill="${l}" opacity="0.35"/>
  `,y=`
    <circle cx="50" cy="32" r="10" fill="${r}"/>
    <circle cx="50" cy="30" r="6" fill="${o}" opacity="0.4"/>
  `,$=`
    <line x1="50" y1="38" x2="50" y2="52" stroke="#424242" stroke-width="1.5" stroke-linecap="round" opacity="0"/>
    <path d="M50,38 L48,50 L50,52 L52,50 Z" fill="#616161" stroke="${S("#616161",20)}" stroke-width="0.4"/>
  `,g="hbird-wing-grad",m=`
    <defs>
      <linearGradient id="${g}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${R(r,20)}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${R(r,20)}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="28" cy="40" rx="16" ry="6" fill="url(#${g})" transform="rotate(-20, 28, 40)"/>
    <ellipse cx="72" cy="40" rx="16" ry="6" fill="url(#${g})" transform="rotate(20, 72, 40)"/>
    <ellipse cx="30" cy="44" rx="14" ry="4" fill="${R(r,15)}" opacity="0.25" transform="rotate(10, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="14" ry="4" fill="${R(r,15)}" opacity="0.25" transform="rotate(-10, 70, 44)"/>
  `,v=`
    <path d="M46,62 Q40,70 36,74" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,62 Q60,70 64,74" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <line x1="46" y1="62" x2="44" y2="68" stroke="${f}" stroke-width="1" stroke-linecap="round"/>
    <line x1="54" y1="62" x2="56" y2="68" stroke="${f}" stroke-width="1" stroke-linecap="round"/>
  `,x=Dt(u,s,46,30,54,30,3),w=Bt(r,50,50,10,14,a);return v+m+p+w+y+x+$+M}function m5(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,25),p=`
    <ellipse cx="50" cy="56" rx="18" ry="20" fill="${r}"/>
  `,y=`
    <ellipse cx="50" cy="58" rx="12" ry="14" fill="${o}" opacity="0.7"/>
    <ellipse cx="50" cy="60" rx="8" ry="10" fill="${R(o,15)}" opacity="0.3"/>
  `,$=`
    <circle cx="50" cy="32" r="13" fill="${r}"/>
    <circle cx="50" cy="30" r="8" fill="${R(r,12)}" opacity="0.15"/>
  `,g=hl(u,"#FF8F00",50,42),m=`
    <path d="M32,48 Q22,44 18,52 Q16,58 26,58" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
    <path d="M68,48 Q78,44 82,52 Q84,58 74,58" fill="${S(r,15)}" stroke="${f}" stroke-width="0.6"/>
  `,v=`
    <path d="M44,74 Q40,82 38,86" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M56,74 Q60,82 62,86" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,74 L38,80 M42,74 L42,80 M42,74 L46,80" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,74 L54,80 M58,74 L58,80 M58,74 L62,80" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=`
    <ellipse cx="50" cy="68" rx="10" ry="6" fill="${l}" opacity="0.4"/>
  `,w=Dt(u,s,44,30,56,30,3.5),_=Bt(r,50,56,18,20,a);return v+m+p+y+x+_+$+w+g+M}function w5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,25),f=R(r,18),p=`
    <ellipse cx="50" cy="56" rx="16" ry="22" fill="${r}"/>
  `,y=`
    <ellipse cx="44" cy="50" rx="5" ry="10" fill="${f}" opacity="0.12" transform="rotate(-10, 44, 50)"/>
  `,$=`
    <circle cx="50" cy="30" r="13" fill="${r}"/>
    <circle cx="50" cy="28" r="8" fill="${f}" opacity="0.1"/>
  `,g=`
    <path d="M50,38 L46,46 L50,48 L54,46 Z" fill="#37474F" stroke="${S("#37474F",20)}" stroke-width="0.6"/>
  `,m=`
    <path d="M34,46 Q18,40 14,50 Q12,58 24,60" fill="${S(r,10)}" stroke="${a}" stroke-width="0.6"/>
    <path d="M66,46 Q82,40 86,50 Q88,58 76,60" fill="${S(r,10)}" stroke="${a}" stroke-width="0.6"/>
  `,v=`
    <path d="M14,50 L18,54 L22,52" stroke="${a}" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M86,50 L82,54 L78,52" stroke="${a}" stroke-width="0.8" fill="none" opacity="0.4"/>
  `,M=`
    <path d="M44,76 Q40,86 36,90" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,88 50,92" stroke="${S(r,8)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q60,86 64,90" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `,x=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,w=`
    <circle cx="44" cy="27" r="1" fill="${l}" opacity="0.3"/>
    <circle cx="56" cy="27" r="1" fill="${l}" opacity="0.3"/>
  `,_=Dt(s,o,44,28,56,28,3.5),z=Bt(r,50,56,16,22,u);return M+m+v+p+y+z+$+_+w+g+x}var v5={parrot:.78,owl:.78,penguin:.78,flamingo:.74,eagle:.76,toucan:.78,peacock:.72,hummingbird:.82,robin:.8,crow:.76};function M5(c){const{backgroundShape:r,birdType:l,backgroundColor:o,decoration:s}=c;let u;switch(l){case"parrot":u=w0(c);break;case"owl":u=p5(c);break;case"penguin":u=h5(c);break;case"flamingo":u=y5(c);break;case"eagle":u=$5(c);break;case"toucan":u=k5(c);break;case"peacock":u=x5(c);break;case"hummingbird":u=g5(c);break;case"robin":u=m5(c);break;case"crow":u=w5(c);break;default:u=w0(c)}const f=`<g transform="translate(50, 50) scale(${v5[l]??.78}) translate(-50, -50)">${u}</g>`,p=d5(s);return lt(f+p,r,o)}function C5(c){const r=["circle","rounded","square"],l=["parrot","owl","penguin","flamingo","eagle","toucan","peacock","hummingbird","robin","crow"],o=["happy","proud","surprised","sleepy"],s=["none","spots","stripes","feathers"],u=["none","branches","clouds","feathers"],a=["#43A047","#388E3C","#2E7D32","#1B5E20","#5D4037","#3E2723","#212121","#37474F","#D32F2F","#E53935","#1565C0","#1976D2","#F57F17","#E65100","#4E342E","#EC407A"],f=["#FFF9C4","#FFFFFF","#F5F5F5","#FFE0B2","#FFECB3","#E0F7FA","#FFF3E0","#FFCC80"],p=["#F44336","#FF5722","#FF9800","#FFC107","#2196F3","#E91E63","#FF6F00","#FFAB00"],y=["#E3F2FD","#BBDEFB","#B3E5FC","#E0F7FA","#E8F5E9","#C8E6C9","#FFF8E1","#FFF3E0","#FCE4EC","#F3E5F5","#FFFDE7","#FBE9E7"],$=["#212121","#3E2723","#DAA520","#FF8F00","#E65100"];return{backgroundShape:D(r,c),birdType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),crestColor:D(p,c),eyeColor:D($,c),backgroundColor:D(y,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var S5={name:"Birds",schema:f5,shapeParam:"birdType",generate:M5,randomize:C5},E5={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},plantType:{type:"select",default:"cactus",options:["cactus","sunflower","rose","tulip","venus-flytrap","bonsai","mushroom","fern","bamboo","succulent"]},primaryColor:{type:"color",default:"#4CAF50"},secondaryColor:{type:"color",default:"#81C784"},potColor:{type:"color",default:"#8D6E63"},bloomColor:{type:"color",default:"#E91E63"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#F1F8E9"},expression:{type:"select",default:"happy",options:["happy","shy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","thorns"]},decoration:{type:"select",default:"none",options:["none","soil","butterflies","dewdrops"]}};function jt(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"shy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l-1}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s-1}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1.5}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1.5}" cy="${u-1}" r="${y}" fill="white"/>
        <ellipse cx="${l+f*1.2}" cy="${o+f*.6}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${s-f*1.2}" cy="${u+f*.6}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function zt(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"shy":return`
        <path d="M${r-2},${l+1} Q${r},${l+3} ${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Rt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-s*.2}" r="${o*.08}" fill="${a}" opacity="0.3"/>
        <circle cx="${r+o*.35}" cy="${l-s*.15}" r="${o*.06}" fill="${a}" opacity="0.3"/>
        <circle cx="${r-o*.1}" cy="${l+s*.25}" r="${o*.07}" fill="${a}" opacity="0.3"/>
        <circle cx="${r+o*.4}" cy="${l+s*.2}" r="${o*.05}" fill="${a}" opacity="0.3"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-s*.25} Q${r},${l-s*.35} ${r+o*.7},${l-s*.25}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${r-o*.8},${l+s*.05} Q${r},${l-s*.05} ${r+o*.8},${l+s*.05}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${r-o*.7},${l+s*.3} Q${r},${l+s*.2} ${r+o*.7},${l+s*.3}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
      `;case"thorns":{const f=R(c,15);return`
        <path d="M${r-o*.6},${l-s*.1} L${r-o*.8},${l-s*.2}" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r+o*.6},${l-s*.15} L${r+o*.8},${l-s*.25}" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r-o*.5},${l+s*.2} L${r-o*.7},${l+s*.15}" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r+o*.5},${l+s*.25} L${r+o*.7},${l+s*.2}" stroke="${f}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
      `}default:return""}}function Q5(c){switch(c){case"soil":return`
        <g opacity="0.3">
          <ellipse cx="20" cy="90" rx="6" ry="2" fill="#5D4037"/>
          <ellipse cx="80" cy="88" rx="5" ry="1.5" fill="#5D4037"/>
          <ellipse cx="12" cy="86" rx="3" ry="1" fill="#795548"/>
          <ellipse cx="88" cy="92" rx="4" ry="1.2" fill="#795548"/>
          <circle cx="16" cy="88" r="1.5" fill="#6D4C41"/>
          <circle cx="84" cy="90" r="1" fill="#6D4C41"/>
        </g>
      `;case"butterflies":return`
        <g opacity="0.35">
          <path d="M12,16 Q8,10 12,8 Q16,10 12,16 Q8,18 4,14 Q8,18 12,16 Z" fill="#E91E63"/>
          <path d="M12,16 Q16,18 20,14 Q16,18 12,16 Z" fill="#EC407A"/>
          <line x1="12" y1="14" x2="10" y2="10" stroke="#5D4037" stroke-width="0.4"/>
          <line x1="12" y1="14" x2="14" y2="10" stroke="#5D4037" stroke-width="0.4"/>
          <path d="M86,20 Q82,14 86,12 Q90,14 86,20 Q82,22 78,18 Q82,22 86,20 Z" fill="#7C4DFF"/>
          <path d="M86,20 Q90,22 94,18 Q90,22 86,20 Z" fill="#9575CD"/>
          <line x1="86" y1="18" x2="84" y2="14" stroke="#5D4037" stroke-width="0.4"/>
          <line x1="86" y1="18" x2="88" y2="14" stroke="#5D4037" stroke-width="0.4"/>
        </g>
      `;case"dewdrops":return`
        <g opacity="0.3">
          <ellipse cx="14" cy="22" rx="2" ry="2.5" fill="white"/>
          <ellipse cx="13.5" cy="21" rx="0.8" ry="1" fill="white" opacity="0.6"/>
          <ellipse cx="86" cy="18" rx="1.5" ry="2" fill="white"/>
          <ellipse cx="85.5" cy="17" rx="0.6" ry="0.8" fill="white" opacity="0.6"/>
          <ellipse cx="10" cy="78" rx="2" ry="2.5" fill="white"/>
          <ellipse cx="9.5" cy="77" rx="0.8" ry="1" fill="white" opacity="0.6"/>
          <ellipse cx="88" cy="82" rx="1.8" ry="2.2" fill="white"/>
          <ellipse cx="87.5" cy="81" rx="0.7" ry="0.9" fill="white" opacity="0.6"/>
        </g>
      `;default:return""}}function Rr(c,r,l,o,s){const u=S(c,20),a=R(c,12),f=s*.18,p=o/2,y=p*.75;return`
    <rect x="${r-p-2}" y="${l}" width="${o+4}" height="${f}" rx="2" fill="${u}"/>
    <path d="M${r-p},${l+f} L${r-y},${l+s} L${r+y},${l+s} L${r+p},${l+f} Z" fill="${c}"/>
    <path d="M${r-p+2},${l+f+2} L${r-p+2},${l+s*.6}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `}function v0(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Rr(o,50,68,28,18),$=`
    <ellipse cx="50" cy="50" rx="12" ry="22" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="18" fill="${l}" opacity="0.15"/>
  `,g=`
    <path d="M38,48 Q28,48 28,38 Q28,30 32,30" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <path d="M62,44 Q72,44 72,34 Q72,26 68,26" fill="${r}" stroke="${p}" stroke-width="0.6"/>
  `,m=`
    <g stroke="${S(r,35)}" stroke-width="0.6" stroke-linecap="round" opacity="0.5">
      <line x1="44" y1="34" x2="40" y2="32"/>
      <line x1="56" y1="36" x2="60" y2="34"/>
      <line x1="43" y1="46" x2="39" y2="46"/>
      <line x1="57" y1="50" x2="61" y2="50"/>
      <line x1="44" y1="58" x2="40" y2="60"/>
      <line x1="56" y1="56" x2="60" y2="58"/>
    </g>
  `,v=`
    <circle cx="50" cy="28" r="4" fill="${s}"/>
    <circle cx="46" cy="27" r="2.5" fill="${s}" opacity="0.8"/>
    <circle cx="54" cy="27" r="2.5" fill="${s}" opacity="0.8"/>
    <circle cx="50" cy="25" r="2.5" fill="${s}" opacity="0.8"/>
    <circle cx="50" cy="28" r="1.5" fill="${R(s,25)}"/>
  `,M=jt(a,u,45,44,55,44,3),x=zt(a,50,50),w=Rt(r,50,50,12,22,f);return y+$+g+m+w+v+M+x}function F5(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Rr(o,50,76,24,14),$=`
    <rect x="47" y="42" width="6" height="36" rx="3" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,g=`
    <path d="M47,58 Q36,52 32,56 Q36,60 47,58 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M53,64 Q64,58 68,62 Q64,66 53,64 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,m=s,v=S(s,15),M=`
    <g>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(45, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(90, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(135, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(180, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(225, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(270, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${m}" stroke="${v}" stroke-width="0.3" transform="rotate(315, 50, 30)"/>
    </g>
  `,x=`
    <circle cx="50" cy="30" r="10" fill="${S(r,10)}"/>
    <circle cx="50" cy="30" r="8" fill="${r}"/>
  `,w=jt(a,u,46,28,54,28,2.5),_=zt(a,50,33),z=Rt(r,50,30,8,8,f);return y+$+g+M+x+z+w+_}function L5(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=S(s,15),$=R(s,15),g=Rr(o,50,76,24,14),m=`
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <path d="M48,54 L45,52" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M52,60 L55,58" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M48,66 L45,64" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
  `,v=`
    <path d="M48,56 Q38,50 34,54 Q38,58 48,56 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M52,68 Q62,62 66,66 Q62,70 52,68 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,M=`
    <circle cx="50" cy="28" r="14" fill="${s}"/>
    <path d="M40,24 Q44,16 50,18 Q56,16 60,24 Q58,20 50,22 Q42,20 40,24 Z" fill="${y}" opacity="0.5"/>
    <path d="M42,32 Q46,38 50,36 Q54,38 58,32 Q56,34 50,33 Q44,34 42,32 Z" fill="${y}" opacity="0.4"/>
    <path d="M38,28 Q40,22 44,24 Q42,28 38,28 Z" fill="${$}" opacity="0.5"/>
    <path d="M62,28 Q60,22 56,24 Q58,28 62,28 Z" fill="${$}" opacity="0.5"/>
  `,x=jt(a,u,45,26,55,26,2.5),w=zt(a,50,32),_=Rt(s,50,28,14,14,f);return g+m+v+M+_+x+w}function _5(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=S(s,15),$=Rr(o,50,76,26,14),g=`
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,m=`
    <path d="M48,60 Q34,50 30,58 Q34,64 48,60 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M52,66 Q66,56 70,64 Q66,70 52,66 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,v=`
    <path d="M36,32 Q38,14 50,12 Q62,14 64,32 Q58,36 50,38 Q42,36 36,32 Z" fill="${s}" stroke="${y}" stroke-width="0.5"/>
    <path d="M40,30 Q42,18 50,16" stroke="${R(s,18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M60,30 Q58,18 50,16" stroke="${R(s,18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M42,32 Q50,38 58,32" fill="${S(s,10)}" opacity="0.3"/>
  `,M=jt(a,u,45,24,55,24,2.5),x=zt(a,50,30),w=Rt(s,50,24,14,12,f);return $+g+m+v+w+M+x}function P5(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Rr(o,50,72,28,16),$=`
    <path d="M44,72 Q40,56 38,44" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50,72 Q50,52 50,38" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <path d="M56,72 Q60,56 62,44" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
  `,g=`
    <path d="M36,38 Q50,28 64,38" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <path d="M36,38 Q50,48 64,38" fill="${l}" stroke="${p}" stroke-width="0.6"/>
  `,m=`
    <g fill="white" stroke="${p}" stroke-width="0.3">
      <path d="M38,38 L40,34 L42,38"/>
      <path d="M44,38 L46,33 L48,38"/>
      <path d="M50,38 L52,32 L54,38"/>
      <path d="M56,38 L58,33 L60,38"/>
      <path d="M38,38 L40,42 L42,38"/>
      <path d="M44,38 L46,43 L48,38"/>
      <path d="M50,38 L52,44 L54,38"/>
      <path d="M56,38 L58,43 L60,38"/>
    </g>
  `,v=`
    <ellipse cx="50" cy="34" rx="10" ry="3" fill="${s}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="10" ry="3" fill="${s}" opacity="0.3"/>
  `,M=`
    <path d="M30,44 Q38,38 38,44 Q38,50 30,44 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <path d="M70,44 Q62,38 62,44 Q62,50 70,44 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,x=jt(a,u,45,34,55,34,2.5),w=zt(a,50,39),_=Rt(r,50,38,14,8,f);return y+$+M+g+v+m+_+x+w}function b5(c){const{primaryColor:r,secondaryColor:l,potColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p="#6D4C41",y=S(p,20),$=Rr(o,50,72,34,14),g=`
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${p}" stroke-width="6" stroke-linecap="round"/>
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${y}" stroke-width="6" stroke-linecap="round" opacity="0.15"/>
  `,m=`
    <path d="M44,50 Q36,46 32,48" fill="none" stroke="${p}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46,42 Q54,38 58,40" fill="none" stroke="${p}" stroke-width="2.5" stroke-linecap="round"/>
  `,v=`
    <g>
      <ellipse cx="50" cy="26" rx="16" ry="10" fill="${r}" stroke="${f}" stroke-width="0.5"/>
      <ellipse cx="42" cy="28" rx="10" ry="8" fill="${r}"/>
      <ellipse cx="58" cy="28" rx="10" ry="8" fill="${r}"/>
      <ellipse cx="50" cy="22" rx="12" ry="7" fill="${l}" opacity="0.2"/>
      <ellipse cx="32" cy="44" rx="10" ry="7" fill="${r}" stroke="${f}" stroke-width="0.5"/>
      <ellipse cx="58" cy="36" rx="10" ry="7" fill="${r}" stroke="${f}" stroke-width="0.5"/>
    </g>
  `,M=jt(u,s,45,24,55,24,3),x=zt(u,50,30),w=Rt(r,50,26,16,10,a);return $+g+m+v+w+M+x}function A5(c){const{primaryColor:r,secondaryColor:l,bloomColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <ellipse cx="50" cy="82" rx="20" ry="4" fill="#5D4037" opacity="0.4"/>
    <ellipse cx="50" cy="82" rx="16" ry="3" fill="#795548" opacity="0.3"/>
  `,y=`
    <rect x="43" y="52" width="14" height="30" rx="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <rect x="45" y="54" width="4" height="26" rx="2" fill="white" opacity="0.15"/>
  `,$=`
    <path d="M22,52 Q22,20 50,16 Q78,20 78,52 Z" fill="${r}" stroke="${f}" stroke-width="0.6"/>
    <path d="M26,50 Q26,24 50,20 Q74,24 74,50" fill="${R(r,8)}" opacity="0.15"/>
  `,g=`
    <circle cx="38" cy="32" r="4" fill="${o}" opacity="0.6"/>
    <circle cx="56" cy="28" r="5" fill="${o}" opacity="0.6"/>
    <circle cx="46" cy="22" r="3" fill="${o}" opacity="0.6"/>
    <circle cx="64" cy="38" r="3.5" fill="${o}" opacity="0.6"/>
    <circle cx="34" cy="44" r="3" fill="${o}" opacity="0.6"/>
    <circle cx="60" cy="46" r="2.5" fill="${o}" opacity="0.6"/>
  `,m=`
    <path d="M30,52 Q50,58 70,52" fill="${S(l,10)}" opacity="0.3"/>
  `,v=jt(u,s,44,38,56,38,3.5),M=zt(u,50,46),x=Rt(r,50,36,22,18,a);return p+y+m+$+g+x+v+M}function N5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,20),f=`
    <ellipse cx="50" cy="82" rx="18" ry="4" fill="#5D4037" opacity="0.4"/>
    <ellipse cx="50" cy="82" rx="14" ry="3" fill="#795548" opacity="0.3"/>
  `,p=`
    <path d="M50,80 Q50,60 50,44 Q50,34 54,28 Q58,24 56,20 Q52,18 48,22" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="48" cy="22" r="6" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="48" cy="22" r="4" fill="${l}" opacity="0.2"/>
  `,y=`
    <g>
      <path d="M50,70 Q34,62 26,66" fill="none" stroke="${r}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M26,66 Q28,62 32,64" fill="none" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M30,65 Q28,60 24,62" fill="none" stroke="${r}" stroke-width="1" stroke-linecap="round"/>

      <path d="M50,64 Q66,56 74,60" fill="none" stroke="${r}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M74,60 Q72,56 68,58" fill="none" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M70,59 Q72,54 76,56" fill="none" stroke="${r}" stroke-width="1" stroke-linecap="round"/>

      <path d="M50,56 Q38,48 30,52" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round"/>
      <path d="M30,52 Q32,48 36,50" fill="none" stroke="${l}" stroke-width="1.2" stroke-linecap="round"/>

      <path d="M50,50 Q62,42 70,46" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round"/>
      <path d="M70,46 Q68,42 64,44" fill="none" stroke="${l}" stroke-width="1.2" stroke-linecap="round"/>
    </g>
  `,$=`
    <g opacity="0.5">
      <ellipse cx="28" cy="65" rx="3" ry="1.5" fill="${r}" transform="rotate(-20, 28, 65)"/>
      <ellipse cx="72" cy="59" rx="3" ry="1.5" fill="${r}" transform="rotate(20, 72, 59)"/>
      <ellipse cx="32" cy="51" rx="2.5" ry="1.2" fill="${l}" transform="rotate(-15, 32, 51)"/>
      <ellipse cx="68" cy="45" rx="2.5" ry="1.2" fill="${l}" transform="rotate(15, 68, 45)"/>
    </g>
  `,g=jt(s,o,44,20,52,20,2),m=zt(s,48,25),v=Rt(r,48,22,6,6,u);return f+y+$+p+v+g+m}function I5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,20),f=`
    <ellipse cx="50" cy="84" rx="18" ry="4" fill="#5D4037" opacity="0.4"/>
    <ellipse cx="50" cy="84" rx="14" ry="3" fill="#795548" opacity="0.3"/>
  `,p=`
    <rect x="46" y="14" width="8" height="70" rx="4" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,y=`
    <g>
      <rect x="44" y="26" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="42" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="58" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="72" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
    </g>
  `,$=`
    <g>
      <path d="M46,28 Q34,22 28,24 Q34,28 46,28 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
      <path d="M46,24 Q36,16 30,18 Q36,22 46,24 Z" fill="${r}" stroke="${a}" stroke-width="0.3"/>
      <path d="M54,44 Q66,38 72,40 Q66,44 54,44 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
      <path d="M54,40 Q64,32 70,34 Q64,38 54,40 Z" fill="${r}" stroke="${a}" stroke-width="0.3"/>
      <path d="M46,60 Q34,54 28,56 Q34,60 46,60 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
    </g>
  `,g=`
    <rect x="36" y="56" width="4" height="28" rx="2" fill="${R(r,10)}" stroke="${a}" stroke-width="0.3" opacity="0.6"/>
    <rect x="60" y="40" width="4" height="28" rx="2" fill="${R(r,10)}" stroke="${a}" stroke-width="0.3" opacity="0.6"/>
  `,m=`
    <ellipse cx="50" cy="36" rx="6" ry="5" fill="${R(r,12)}" opacity="0.3"/>
  `,v=jt(s,o,47,34,53,34,2),M=zt(s,50,39),x=Rt(r,50,50,4,30,u);return f+g+p+y+$+m+x+v+M}function T5(c){const{primaryColor:r,secondaryColor:l,potColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=R(r,12),y=Rr(o,50,64,26,16),$=`
    <g>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${f}" stroke-width="0.5" transform="rotate(0, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${f}" stroke-width="0.5" transform="rotate(60, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${f}" stroke-width="0.5" transform="rotate(120, 50, 50)"/>
    </g>
  `,g=`
    <g>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(30, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(90, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(150, 50, 48)"/>
    </g>
  `,m=`
    <circle cx="50" cy="46" r="10" fill="${p}"/>
    <circle cx="50" cy="46" r="8" fill="${r}" opacity="0.3"/>
  `,v=`
    <g opacity="0.3">
      <circle cx="32" cy="50" r="2" fill="${R(r,20)}"/>
      <circle cx="68" cy="50" r="2" fill="${R(r,20)}"/>
      <circle cx="50" cy="34" r="2" fill="${R(r,20)}"/>
      <circle cx="38" cy="60" r="1.5" fill="${R(l,15)}"/>
      <circle cx="62" cy="60" r="1.5" fill="${R(l,15)}"/>
    </g>
  `,M=jt(u,s,46,44,54,44,2.5),x=zt(u,50,50),w=Rt(r,50,46,10,10,a);return y+$+g+m+v+w+M+x}var D5={cactus:.78,sunflower:.74,rose:.76,tulip:.76,"venus-flytrap":.78,bonsai:.76,mushroom:.76,fern:.78,bamboo:.72,succulent:.8};function B5(c){const{backgroundShape:r,plantType:l,backgroundColor:o,decoration:s}=c;let u;switch(l){case"cactus":u=v0(c);break;case"sunflower":u=F5(c);break;case"rose":u=L5(c);break;case"tulip":u=_5(c);break;case"venus-flytrap":u=P5(c);break;case"bonsai":u=b5(c);break;case"mushroom":u=A5(c);break;case"fern":u=N5(c);break;case"bamboo":u=I5(c);break;case"succulent":u=T5(c);break;default:u=v0(c)}const f=`<g transform="translate(50, 50) scale(${D5[l]??.78}) translate(-50, -50)">${u}</g>`,p=Q5(s);return lt(f+p,r,o)}function j5(c){const r=["circle","rounded","square"],l=["cactus","sunflower","rose","tulip","venus-flytrap","bonsai","mushroom","fern","bamboo","succulent"],o=["happy","shy","surprised","sleepy"],s=["none","spots","stripes","thorns"],u=["none","soil","butterflies","dewdrops"],a=["#4CAF50","#388E3C","#2E7D32","#1B5E20","#43A047","#66BB6A","#558B2F","#33691E","#00695C","#00796B","#2E7D32","#1B5E20","#689F38","#7CB342","#8BC34A","#9CCC65"],f=["#81C784","#A5D6A7","#C8E6C9","#DCEDC8","#B2DFDB","#AED581","#E6EE9C","#C5E1A5"],p=["#8D6E63","#795548","#6D4C41","#A1887F","#BCAAA4","#5D4037","#757575","#D7CCC8"],y=["#E91E63","#F44336","#FF5722","#FF9800","#FFC107","#9C27B0","#E040FB","#FF6F00"],$=["#F1F8E9","#E8F5E9","#C8E6C9","#DCEDC8","#FFF8E1","#FFF3E0","#EFEBE9","#F5F5F5","#E0F2F1","#E8EAF6","#FBE9E7","#F9FBE7"],g=["#1a1a1a","#3E2723","#1B5E20","#212121","#33691E"];return{backgroundShape:D(r,c),plantType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),potColor:D(p,c),bloomColor:D(y,c),eyeColor:D(g,c),backgroundColor:D($,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var z5={name:"Plants",schema:E5,shapeParam:"plantType",generate:B5,randomize:j5},R5={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},foodType:{type:"select",default:"sushi",options:["sushi","pizza","cupcake","ice-cream","donut","burger","taco","ramen","cookie","watermelon"]},primaryColor:{type:"color",default:"#FF8A65"},secondaryColor:{type:"color",default:"#FFCC80"},toppingColor:{type:"color",default:"#E53935"},plateColor:{type:"color",default:"#ECEFF1"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#FFF8E1"},expression:{type:"select",default:"happy",options:["happy","yummy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","sprinkles","sesame","drizzle"]},decoration:{type:"select",default:"none",options:["none","steam","crumbs","sparkles"]}};function Ot(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"yummy":return`
        <path d="M${l-f},${o} Q${l},${o-f*1.2} ${l+f},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${s-f},${u} Q${s},${u-f*1.2} ${s+f},${u}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${l+f*1.2}" cy="${o+f*.4}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${s-f*1.2}" cy="${u+f*.4}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Ut(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"yummy":return`
        <path d="M${r-3},${l} Q${r},${l+5} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${r}" cy="${l+3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Vt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"sprinkles":return`
        <g opacity="0.5">
          <rect x="${r-o*.4}" y="${l-s*.3}" width="2" height="4" rx="1" fill="#E91E63" transform="rotate(30, ${r-o*.4}, ${l-s*.3})"/>
          <rect x="${r+o*.3}" y="${l-s*.2}" width="2" height="4" rx="1" fill="#2196F3" transform="rotate(-20, ${r+o*.3}, ${l-s*.2})"/>
          <rect x="${r-o*.1}" y="${l+s*.2}" width="2" height="4" rx="1" fill="#4CAF50" transform="rotate(50, ${r-o*.1}, ${l+s*.2})"/>
          <rect x="${r+o*.35}" y="${l+s*.15}" width="2" height="4" rx="1" fill="#FF9800" transform="rotate(-40, ${r+o*.35}, ${l+s*.15})"/>
        </g>
      `;case"sesame":return`
        <g opacity="0.4">
          <ellipse cx="${r-o*.3}" cy="${l-s*.2}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(15, ${r-o*.3}, ${l-s*.2})"/>
          <ellipse cx="${r+o*.25}" cy="${l-s*.1}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-10, ${r+o*.25}, ${l-s*.1})"/>
          <ellipse cx="${r}" cy="${l+s*.15}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(25, ${r}, ${l+s*.15})"/>
          <ellipse cx="${r+o*.4}" cy="${l+s*.2}" rx="1" ry="0.7" fill="#212121" transform="rotate(-5, ${r+o*.4}, ${l+s*.2})"/>
        </g>
      `;case"drizzle":return`
        <g opacity="0.3">
          <path d="M${r-o*.5},${l-s*.2} Q${r-o*.25},${l-s*.35} ${r},${l-s*.2} Q${r+o*.25},${l-s*.05} ${r+o*.5},${l-s*.2}" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M${r-o*.4},${l+s*.1} Q${r-o*.15},${l-s*.05} ${r+o*.1},${l+s*.1} Q${r+o*.3},${l+s*.25} ${r+o*.5},${l+s*.1}" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;default:return""}}function O5(c){switch(c){case"steam":return`
        <g opacity="0.25">
          <path d="M38,18 Q36,12 38,6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M50,16 Q48,10 50,4" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M62,18 Q64,12 62,6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
      `;case"crumbs":return`
        <g opacity="0.35">
          <circle cx="16" cy="82" r="1.5" fill="#D7CCC8"/>
          <circle cx="22" cy="86" r="1" fill="#BCAAA4"/>
          <circle cx="78" cy="84" r="1.2" fill="#D7CCC8"/>
          <circle cx="84" cy="80" r="0.8" fill="#BCAAA4"/>
          <circle cx="18" cy="78" r="0.7" fill="#D7CCC8"/>
          <circle cx="82" cy="88" r="1.1" fill="#BCAAA4"/>
        </g>
      `;case"sparkles":return`
        <g opacity="0.35">
          <path d="M14,16 L15,12 L16,16 L20,15 L16,16 L15,20 L14,16 L10,15 Z" fill="#FFD54F"/>
          <path d="M82,14 L83,11 L84,14 L87,13 L84,14 L83,17 L82,14 L79,13 Z" fill="#FFD54F"/>
          <path d="M12,76 L13,73 L14,76 L17,75 L14,76 L13,79 L12,76 L9,75 Z" fill="#FFD54F"/>
          <path d="M86,78 L87,75 L88,78 L91,77 L88,78 L87,81 L86,78 L83,77 Z" fill="#FFD54F"/>
        </g>
      `;default:return""}}function Do(c,r,l,o,s){const u=S(c,15),a=R(c,8);return`
    <ellipse cx="${r}" cy="${l}" rx="${o+3}" ry="${s+1.5}" fill="${u}" opacity="0.3"/>
    <ellipse cx="${r}" cy="${l}" rx="${o}" ry="${s}" fill="${c}"/>
    <ellipse cx="${r}" cy="${l}" rx="${o-3}" ry="${s-1}" fill="${a}" opacity="0.2"/>
  `}function M0(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:s,eyeColor:u,expression:a,pattern:f}=c,p=Do(s,50,72,24,6),y=`
    <ellipse cx="50" cy="56" rx="16" ry="12" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="white" opacity="0.15"/>
  `,$=`
    <path d="M34,48 Q42,38 50,40 Q58,38 66,48 Q58,52 50,50 Q42,52 34,48 Z" fill="${o}" stroke="${S(o,15)}" stroke-width="0.5"/>
    <path d="M38,46 Q50,40 62,46" stroke="${R(o,15)}" stroke-width="0.8" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,g=`
    <rect x="42" y="52" width="16" height="10" rx="1" fill="#2E3B2E" opacity="0.85"/>
    <rect x="44" y="54" width="12" height="6" rx="0.5" fill="#3E4F3E" opacity="0.2"/>
  `,m=Ot(a,u,45,44,55,44,2.5),v=Ut(a,50,49),M=Vt(r,50,48,14,10,f);return p+y+g+$+M+m+v}function U5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Do(s,50,78,22,5),$=`
    <path d="M50,22 L26,76 L74,76 Z" fill="${r}" stroke="${p}" stroke-width="0.6"/>
  `,g=`
    <path d="M50,26 L28,74 L72,74 Z" fill="${l}"/>
    <path d="M72,74 Q68,68 74,76" fill="${l}" stroke="${p}" stroke-width="0.3" opacity="0.6"/>
    <path d="M28,74 Q32,68 26,76" fill="${l}" stroke="${p}" stroke-width="0.3" opacity="0.6"/>
  `,m=`
    <path d="M26,76 Q50,82 74,76" fill="${S(r,10)}" stroke="${p}" stroke-width="0.5"/>
  `,v=`
    <circle cx="44" cy="58" r="4" fill="${o}" opacity="0.8"/>
    <circle cx="56" cy="54" r="3.5" fill="${o}" opacity="0.8"/>
    <circle cx="50" cy="66" r="4" fill="${o}" opacity="0.8"/>
    <circle cx="38" cy="68" r="3" fill="${S(o,10)}" opacity="0.7"/>
    <circle cx="60" cy="66" r="3" fill="${S(o,10)}" opacity="0.7"/>
  `,M=Ot(a,u,44,44,56,44,3),x=Ut(a,50,52),w=Vt(r,50,50,16,20,f);return y+$+g+m+v+w+M+x}function V5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M32,58 Q34,56 36,58 Q38,56 40,58 Q42,56 44,58 Q46,56 48,58 Q50,56 52,58 Q54,56 56,58 Q58,56 60,58 Q62,56 64,58 Q66,56 68,58 L66,82 Q50,86 34,82 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <path d="M38,62 L36,78" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M50,60 L50,80" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M62,62 L64,78" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
  `,y=`
    <path d="M30,58 Q30,32 50,28 Q70,32 70,58 Z" fill="${r}" stroke="${f}" stroke-width="0.5"/>
    <path d="M36,56 Q36,36 50,32 Q64,36 64,56" fill="${R(r,10)}" opacity="0.2"/>
    <path d="M40,54 Q44,44 50,42 Q56,44 60,54" stroke="${R(r,15)}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,$=`
    <circle cx="50" cy="26" r="5" fill="${o}"/>
    <circle cx="48" cy="24" r="1.5" fill="white" opacity="0.4"/>
    <path d="M50,22 Q52,18 54,16" stroke="#4E342E" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  `,g=Ot(u,s,44,44,56,44,3),m=Ut(u,50,51),v=Vt(r,50,44,16,14,a);return p+y+v+$+g+m}function H5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M36,52 L50,88 L64,52 Z" fill="#D4A056" stroke="${S("#D4A056",15)}" stroke-width="0.5"/>
    <g opacity="0.3" stroke="#8D6E63" stroke-width="0.5">
      <line x1="38" y1="56" x2="62" y2="56"/>
      <line x1="40" y1="62" x2="60" y2="62"/>
      <line x1="42" y1="68" x2="58" y2="68"/>
      <line x1="40" y1="54" x2="54" y2="70"/>
      <line x1="60" y1="54" x2="46" y2="70"/>
    </g>
  `,y=`
    <circle cx="50" cy="42" r="14" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
  `,$=`
    <circle cx="50" cy="28" r="12" fill="${r}" stroke="${f}" stroke-width="0.5"/>
    <circle cx="46" cy="24" r="3" fill="${R(r,15)}" opacity="0.2"/>
  `,g=`
    <path d="M38,44 Q36,50 38,54" fill="${l}" stroke="none"/>
    <path d="M62,42 Q64,48 62,52" fill="${r}" stroke="none"/>
  `,m=`
    <path d="M40,24 Q50,20 60,24" stroke="${o}" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M42,28 Q50,32 58,28" stroke="${o}" stroke-width="1" fill="none" opacity="0.4" stroke-linecap="round"/>
  `,v=Ot(u,s,45,26,55,26,2.5),M=Ut(u,50,32),x=Vt(r,50,28,12,12,a);return p+y+$+g+m+x+v+M}function Z5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Do(s,50,74,24,5),$=`
    <ellipse cx="50" cy="50" rx="22" ry="20" fill="${l}" stroke="${S(l,15)}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${R(l,30)}"/>
  `,g=`
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${s}"/>
  `,m=`
    <path d="M28,48 Q30,36 38,30 Q50,24 62,30 Q70,36 72,48 Q68,52 62,50 Q56,54 50,50 Q44,54 38,50 Q32,52 28,48 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <ellipse cx="50" cy="40" rx="8" ry="6" fill="${r}"/>
  `,v=`
    <g opacity="0.7">
      <rect x="36" y="34" width="2" height="4" rx="1" fill="${o}" transform="rotate(20, 36, 34)"/>
      <rect x="48" y="30" width="2" height="4" rx="1" fill="${R(o,20)}" transform="rotate(-15, 48, 30)"/>
      <rect x="60" y="36" width="2" height="4" rx="1" fill="${o}" transform="rotate(35, 60, 36)"/>
      <rect x="42" y="38" width="2" height="4" rx="1" fill="${R(o,10)}" transform="rotate(-30, 42, 38)"/>
      <rect x="56" y="32" width="2" height="4" rx="1" fill="${o}" transform="rotate(10, 56, 32)"/>
    </g>
  `,M=Ot(a,u,42,40,58,40,2.5),x=Ut(a,50,46),w=Vt(r,50,38,18,12,f);return y+$+g+m+v+w+M+x}function W5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=r,y=f,$=`
    <path d="M28,62 Q28,68 50,68 Q72,68 72,62 L28,62 Z" fill="${p}" stroke="${y}" stroke-width="0.5"/>
  `,g=`
    <rect x="26" y="54" width="48" height="8" rx="4" fill="#5D4037" stroke="${S("#5D4037",15)}" stroke-width="0.4"/>
  `,m=`
    <path d="M26,54 L74,54 L72,50 Q68,52 60,50 Q50,48 40,50 Q32,52 28,50 Z" fill="${l}" stroke="${S(l,10)}" stroke-width="0.3"/>
    <path d="M26,54 Q24,58 26,56" fill="${l}" stroke="none"/>
    <path d="M74,54 Q76,58 74,56" fill="${l}" stroke="none"/>
  `,v=`
    <path d="M26,50 Q32,46 38,50 Q44,46 50,50 Q56,46 62,50 Q68,46 74,50" fill="#66BB6A" stroke="${S("#66BB6A",15)}" stroke-width="0.4"/>
  `,M=`
    <path d="M28,50 Q28,28 50,26 Q72,28 72,50 Z" fill="${p}" stroke="${y}" stroke-width="0.5"/>
    <ellipse cx="50" cy="36" rx="16" ry="8" fill="${R(p,10)}" opacity="0.15"/>
  `,x=`
    <g opacity="0.5">
      <ellipse cx="42" cy="32" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(10, 42, 32)"/>
      <ellipse cx="52" cy="30" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(-15, 52, 30)"/>
      <ellipse cx="58" cy="34" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(20, 58, 34)"/>
      <ellipse cx="46" cy="36" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-5, 46, 36)"/>
    </g>
  `,w=`
    <path d="M72,50 Q74,54 72,58" fill="${o}" stroke="none" opacity="0.7"/>
  `,_=Ot(u,s,43,40,57,40,3),z=Ut(u,50,47),T=Vt(p,50,38,20,12,a);return $+g+m+v+w+M+x+T+_+z}function q5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M20,56 Q20,30 50,26 Q80,30 80,56" fill="${r}" stroke="${f}" stroke-width="0.6"/>
    <path d="M24,54 Q24,34 50,30 Q76,34 76,54" fill="${R(r,8)}" opacity="0.15"/>
  `,y=`
    <path d="M28,44 Q34,38 40,42 Q46,36 52,42 Q58,36 64,42 Q70,38 72,44" fill="#66BB6A" stroke="${S("#66BB6A",10)}" stroke-width="0.4"/>
  `,$=`
    <path d="M30,48 Q40,42 50,46 Q60,42 70,48" fill="#8D6E63" stroke="${S("#8D6E63",15)}" stroke-width="0.4"/>
  `,g=`
    <g opacity="0.7">
      <path d="M34,44 L32,40" stroke="${l}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M44,42 L42,38" stroke="${l}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M56,42 L58,38" stroke="${l}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M66,44 L68,40" stroke="${l}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  `,m=`
    <circle cx="38" cy="46" r="2" fill="${o}" opacity="0.6"/>
    <circle cx="50" cy="44" r="1.5" fill="${o}" opacity="0.6"/>
    <circle cx="62" cy="46" r="2" fill="${o}" opacity="0.6"/>
  `,v=Ot(u,s,42,48,58,48,3),M=Ut(u,50,54),x=Vt(r,50,44,22,14,a);return p+$+y+g+m+x+v+M}function Y5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:s,eyeColor:u,expression:a,pattern:f}=c,p=`
    <path d="M18,46 Q18,78 50,80 Q82,78 82,46 Z" fill="${s}" stroke="${S(s,15)}" stroke-width="0.6"/>
    <path d="M22,48 Q22,74 50,76 Q78,74 78,48" fill="${R(s,8)}" opacity="0.15"/>
  `,y=`
    <ellipse cx="50" cy="46" rx="32" ry="8" fill="${S(s,10)}" stroke="${S(s,20)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="46" rx="30" ry="7" fill="${s}"/>
  `,$=`
    <ellipse cx="50" cy="48" rx="28" ry="6" fill="${r}" opacity="0.4"/>
  `,g=`
    <g stroke="${l}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7">
      <path d="M30,56 Q38,52 46,56 Q54,60 62,56 Q68,52 72,56"/>
      <path d="M28,62 Q36,58 44,62 Q52,66 60,62 Q66,58 70,62"/>
      <path d="M32,68 Q40,64 48,68 Q56,72 64,68"/>
    </g>
  `,m=`
    <ellipse cx="64" cy="50" rx="6" ry="5" fill="white" stroke="#E0E0E0" stroke-width="0.4"/>
    <ellipse cx="64" cy="50" rx="3" ry="2.5" fill="#FFC107"/>
  `,v=`
    <rect x="28" y="48" width="8" height="12" rx="1" fill="#2E3B2E" opacity="0.8"/>
    <rect x="29" y="50" width="6" height="8" rx="0.5" fill="#3E4F3E" opacity="0.15"/>
  `,M=`
    <circle cx="50" cy="52" r="4" fill="white" stroke="#E0E0E0" stroke-width="0.3"/>
    <path d="M48,52 Q50,48 52,52 Q50,56 48,52" fill="${o}" opacity="0.6"/>
  `,x=Ot(a,u,42,52,54,50,2.5),w=Ut(a,48,56),_=Vt(r,50,56,24,12,f);return p+y+$+g+m+v+M+_+x+w}function G5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=Do(s,50,72,22,5),$=`
    <circle cx="50" cy="50" r="22" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <circle cx="50" cy="50" r="20" fill="${R(r,5)}" opacity="0.15"/>
  `,g=`
    <g opacity="0.3">
      <circle cx="30" cy="44" r="2" fill="${p}"/>
      <circle cx="70" cy="46" r="1.8" fill="${p}"/>
      <circle cx="34" cy="66" r="1.5" fill="${p}"/>
      <circle cx="66" cy="64" r="2" fill="${p}"/>
      <circle cx="28" cy="54" r="1.2" fill="${p}"/>
      <circle cx="72" cy="56" r="1.5" fill="${p}"/>
    </g>
  `,m=`
    <g>
      <ellipse cx="40" cy="38" rx="3" ry="2.5" fill="${o}" opacity="0.8" transform="rotate(10, 40, 38)"/>
      <ellipse cx="58" cy="40" rx="2.5" ry="2" fill="${o}" opacity="0.8" transform="rotate(-15, 58, 40)"/>
      <ellipse cx="44" cy="58" rx="3" ry="2.5" fill="${o}" opacity="0.8" transform="rotate(25, 44, 58)"/>
      <ellipse cx="60" cy="56" rx="2.5" ry="2" fill="${S(o,10)}" opacity="0.7" transform="rotate(-20, 60, 56)"/>
      <ellipse cx="36" cy="50" rx="2" ry="1.8" fill="${o}" opacity="0.7" transform="rotate(5, 36, 50)"/>
      <ellipse cx="54" cy="62" rx="2.5" ry="2" fill="${S(o,10)}" opacity="0.7" transform="rotate(30, 54, 62)"/>
    </g>
  `,v=`
    <g stroke="${l}" stroke-width="0.6" fill="none" opacity="0.2" stroke-linecap="round">
      <path d="M42,46 Q46,44 48,48"/>
      <path d="M54,48 Q56,52 60,50"/>
    </g>
  `,M=Ot(a,u,44,46,56,46,3),x=Ut(a,50,54),w=Vt(r,50,50,20,20,f);return y+$+g+v+m+w+M+x}function X5(c){const{primaryColor:r,toppingColor:l,eyeColor:o,expression:s,pattern:u}=c,a="#4CAF50",f=S(a,15),p=`
    <path d="M18,58 Q50,14 82,58 Q50,64 18,58 Z" fill="${a}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <path d="M22,56 Q50,20 78,56 Q50,60 22,56 Z" fill="${R(a,30)}"/>
  `,$=`
    <path d="M24,54 Q50,22 76,54 Q50,58 24,54 Z" fill="${l}" stroke="${S(l,10)}" stroke-width="0.3"/>
    <path d="M30,52 Q50,26 70,52" fill="${R(l,10)}" opacity="0.15"/>
  `,g=`
    <g fill="${r}">
      <ellipse cx="38" cy="46" rx="1.5" ry="2" transform="rotate(15, 38, 46)"/>
      <ellipse cx="50" cy="40" rx="1.5" ry="2" transform="rotate(0, 50, 40)"/>
      <ellipse cx="62" cy="46" rx="1.5" ry="2" transform="rotate(-15, 62, 46)"/>
      <ellipse cx="44" cy="50" rx="1.2" ry="1.8" transform="rotate(10, 44, 50)"/>
      <ellipse cx="56" cy="50" rx="1.2" ry="1.8" transform="rotate(-10, 56, 50)"/>
    </g>
  `,m=`
    <path d="M50,58 Q50,64 48,68" stroke="${R(l,10)}" stroke-width="1" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,v=Ot(s,o,44,42,56,42,2.5),M=Ut(s,50,48),x=Vt(l,50,44,22,14,u);return p+y+$+g+m+x+v+M}var K5={sushi:.78,pizza:.74,cupcake:.76,"ice-cream":.76,donut:.78,burger:.76,taco:.78,ramen:.74,cookie:.78,watermelon:.76};function J5(c){const{backgroundShape:r,foodType:l,backgroundColor:o,decoration:s}=c;let u;switch(l){case"sushi":u=M0(c);break;case"pizza":u=U5(c);break;case"cupcake":u=V5(c);break;case"ice-cream":u=H5(c);break;case"donut":u=Z5(c);break;case"burger":u=W5(c);break;case"taco":u=q5(c);break;case"ramen":u=Y5(c);break;case"cookie":u=G5(c);break;case"watermelon":u=X5(c);break;default:u=M0(c)}const f=`<g transform="translate(50, 50) scale(${K5[l]??.78}) translate(-50, -50)">${u}</g>`,p=O5(s);return lt(f+p,r,o)}function eh(c){const r=["circle","rounded","square"],l=["sushi","pizza","cupcake","ice-cream","donut","burger","taco","ramen","cookie","watermelon"],o=["happy","yummy","surprised","sleepy"],s=["none","sprinkles","sesame","drizzle"],u=["none","steam","crumbs","sparkles"],a=["#FF8A65","#FF7043","#E64A19","#BF360C","#FFAB91","#D4A056","#A1887F","#8D6E63","#FFB74D","#FFA726","#FB8C00","#F57C00","#FFCC80","#D7CCC8","#BCAAA4","#795548"],f=["#FFCC80","#FFE0B2","#FFF8E1","#FFFDE7","#FFF9C4","#FFF3E0","#FFECB3","#FAFAFA"],p=["#E53935","#D32F2F","#C62828","#FF6F00","#F9A825","#2E7D32","#E91E63","#FF5722"],y=["#ECEFF1","#F5F5F5","#FAFAFA","#E0E0E0","#D7CCC8","#EFEBE9","#CFD8DC","#BDBDBD"],$=["#FFF8E1","#FFF3E0","#FFECB3","#FFE0B2","#E8F5E9","#F3E5F5","#E1F5FE","#FCE4EC","#FFFDE7","#FBE9E7","#EFEBE9","#F1F8E9"],g=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:D(r,c),foodType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),toppingColor:D(p,c),plateColor:D(y,c),eyeColor:D(g,c),backgroundColor:D($,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var th={name:"Food",schema:R5,shapeParam:"foodType",generate:J5,randomize:eh},rh={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},weatherType:{type:"select",default:"sun",options:["sun","cloud","raindrop","snowflake","lightning","tornado","rainbow","moon","star","comet"]},primaryColor:{type:"color",default:"#FFD54F"},secondaryColor:{type:"color",default:"#FFF9C4"},glowColor:{type:"color",default:"#FF8F00"},precipitationColor:{type:"color",default:"#90CAF9"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#E3F2FD"},expression:{type:"select",default:"happy",options:["happy","breezy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","swirls","dots","stripes"]},decoration:{type:"select",default:"none",options:["none","raindrops","snowflakes","windlines"]}};function Ht(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"breezy":return`
        <path d="M${l-f},${o} Q${l},${o-f*1.2} ${l+f},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${s-f},${u} Q${s},${u-f*1.2} ${s+f},${u}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${l+f*1.2}" cy="${o+f*.4}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${s-f*1.2}" cy="${u+f*.4}" rx="${f*.6}" ry="${f*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Zt(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"breezy":return`
        <ellipse cx="${r+4}" cy="${l+1}" rx="2.5" ry="2" fill="#5D4037" opacity="0.6"/>
        <path d="M${r+6},${l} Q${r+10},${l+1} ${r+12},${l-1}" stroke="#90CAF9" stroke-width="0.8" fill="none" opacity="0.4" stroke-linecap="round"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Wt(c,r,l,o,s,u){const a=S(c,30);switch(u){case"swirls":return`
        <g opacity="0.2">
          <path d="M${r-o*.3},${l-s*.2} Q${r-o*.1},${l-s*.4} ${r+o*.1},${l-s*.2} Q${r+o*.2},${l} ${r},${l+s*.1}" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M${r+o*.2},${l+s*.1} Q${r+o*.4},${l-s*.1} ${r+o*.3},${l+s*.3}" stroke="${a}" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        </g>
      `;case"dots":return`
        <g opacity="0.2">
          <circle cx="${r-o*.3}" cy="${l-s*.2}" r="1.2" fill="${a}"/>
          <circle cx="${r+o*.25}" cy="${l-s*.15}" r="1" fill="${a}"/>
          <circle cx="${r-o*.1}" cy="${l+s*.2}" r="1.3" fill="${a}"/>
          <circle cx="${r+o*.35}" cy="${l+s*.1}" r="0.9" fill="${a}"/>
        </g>
      `;case"stripes":return`
        <g opacity="0.15" stroke="${a}" stroke-width="1" stroke-linecap="round">
          <line x1="${r-o*.4}" y1="${l-s*.25}" x2="${r+o*.4}" y2="${l-s*.25}"/>
          <line x1="${r-o*.35}" y1="${l}" x2="${r+o*.35}" y2="${l}"/>
          <line x1="${r-o*.3}" y1="${l+s*.25}" x2="${r+o*.3}" y2="${l+s*.25}"/>
        </g>
      `;default:return""}}function nh(c){switch(c){case"raindrops":return`
        <g opacity="0.3">
          <path d="M16,20 Q15,16 16,14 Q17,16 16,20 Z" fill="#90CAF9"/>
          <path d="M84,24 Q83,20 84,18 Q85,20 84,24 Z" fill="#90CAF9"/>
          <path d="M20,78 Q19,74 20,72 Q21,74 20,78 Z" fill="#90CAF9"/>
          <path d="M80,82 Q79,78 80,76 Q81,78 80,82 Z" fill="#90CAF9"/>
          <path d="M14,50 Q13,46 14,44 Q15,46 14,50 Z" fill="#90CAF9"/>
          <path d="M86,54 Q85,50 86,48 Q87,50 86,54 Z" fill="#90CAF9"/>
        </g>
      `;case"snowflakes":return`
        <g opacity="0.3" stroke="white" stroke-width="0.8" stroke-linecap="round">
          <g transform="translate(14,18)">
            <line x1="0" y1="-3" x2="0" y2="3"/>
            <line x1="-2.6" y1="-1.5" x2="2.6" y2="1.5"/>
            <line x1="-2.6" y1="1.5" x2="2.6" y2="-1.5"/>
          </g>
          <g transform="translate(86,22)">
            <line x1="0" y1="-2.5" x2="0" y2="2.5"/>
            <line x1="-2.2" y1="-1.3" x2="2.2" y2="1.3"/>
            <line x1="-2.2" y1="1.3" x2="2.2" y2="-1.3"/>
          </g>
          <g transform="translate(12,80)">
            <line x1="0" y1="-2" x2="0" y2="2"/>
            <line x1="-1.7" y1="-1" x2="1.7" y2="1"/>
            <line x1="-1.7" y1="1" x2="1.7" y2="-1"/>
          </g>
          <g transform="translate(88,78)">
            <line x1="0" y1="-2.5" x2="0" y2="2.5"/>
            <line x1="-2.2" y1="-1.3" x2="2.2" y2="1.3"/>
            <line x1="-2.2" y1="1.3" x2="2.2" y2="-1.3"/>
          </g>
        </g>
      `;case"windlines":return`
        <g opacity="0.2" stroke="#78909C" stroke-width="1.2" fill="none" stroke-linecap="round">
          <path d="M8,30 Q16,28 24,30 Q28,32 32,30"/>
          <path d="M68,22 Q76,20 84,22 Q88,24 92,22"/>
          <path d="M6,70 Q14,68 22,70 Q26,72 30,70"/>
          <path d="M70,76 Q78,74 86,76 Q90,78 94,76"/>
        </g>
      `;default:return""}}function C0(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <circle cx="50" cy="50" r="28" fill="${o}" opacity="0.15"/>
  `,y=`
    <g fill="${l}" opacity="0.6">
      <polygon points="50,10 46,22 54,22"/>
      <polygon points="50,90 46,78 54,78"/>
      <polygon points="10,50 22,46 22,54"/>
      <polygon points="90,50 78,46 78,54"/>
      <polygon points="22,22 30,28 28,30"/>
      <polygon points="78,22 72,28 70,30"/>
      <polygon points="22,78 28,70 30,72"/>
      <polygon points="78,78 70,72 72,70"/>
    </g>
  `,$=`
    <circle cx="50" cy="50" r="18" fill="${r}" stroke="${f}" stroke-width="0.6"/>
    <circle cx="46" cy="44" r="5" fill="${R(r,15)}" opacity="0.2"/>
  `,g=Ht(u,s,44,48,56,48,2.5),m=Zt(u,50,54),v=Wt(r,50,50,16,16,a);return p+y+$+v+g+m}function lh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,15),f=`
    <rect x="26" y="52" width="48" height="14" rx="7" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="36" cy="46" r="14" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="54" cy="42" r="16" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="66" cy="50" r="12" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <rect x="26" y="50" width="48" height="16" fill="${r}"/>
  `,p=`
    <circle cx="38" cy="42" r="4" fill="${R(l,10)}" opacity="0.2"/>
    <circle cx="56" cy="38" r="5" fill="${R(l,10)}" opacity="0.15"/>
  `,y=Ht(s,o,42,52,58,52,2.5),$=Zt(s,50,58),g=Wt(r,50,50,22,14,u);return f+p+g+y+$}function oh(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M50,18 Q38,40 38,56 Q38,72 50,72 Q62,72 62,56 Q62,40 50,18 Z" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <path d="M44,36 Q42,48 44,58 Q46,64 50,66" fill="${R(l,10)}" opacity="0.2" stroke="none"/>
  `,$=`
    <ellipse cx="50" cy="62" rx="8" ry="4" fill="${o}" opacity="0.1"/>
  `,g=Ht(u,s,45,50,55,50,2.5),m=Zt(u,50,56),v=Wt(r,50,50,10,18,a);return $+p+y+v+g+m}function ih(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <circle cx="50" cy="50" r="26" fill="${o}" opacity="0.08"/>
  `,y=`
    <g stroke="${r}" stroke-width="2" stroke-linecap="round" fill="none">
      <line x1="50" y1="24" x2="50" y2="76"/>
      <line x1="27.5" y1="37" x2="72.5" y2="63"/>
      <line x1="27.5" y1="63" x2="72.5" y2="37"/>
    </g>
    <g stroke="${l}" stroke-width="1.2" stroke-linecap="round" fill="none">
      <line x1="50" y1="30" x2="44" y2="34"/>
      <line x1="50" y1="30" x2="56" y2="34"/>
      <line x1="50" y1="70" x2="44" y2="66"/>
      <line x1="50" y1="70" x2="56" y2="66"/>
      <line x1="33" y1="40" x2="33" y2="46"/>
      <line x1="33" y1="40" x2="39" y2="38"/>
      <line x1="67" y1="60" x2="67" y2="54"/>
      <line x1="67" y1="60" x2="61" y2="62"/>
      <line x1="33" y1="60" x2="39" y2="62"/>
      <line x1="33" y1="60" x2="33" y2="54"/>
      <line x1="67" y1="40" x2="61" y2="38"/>
      <line x1="67" y1="40" x2="67" y2="46"/>
    </g>
  `,$=`
    <circle cx="50" cy="50" r="10" fill="${r}" stroke="${f}" stroke-width="0.6"/>
    <circle cx="48" cy="47" r="3" fill="${R(r,15)}" opacity="0.2"/>
  `,g=Ht(u,s,46,48,54,48,2),m=Zt(u,50,53),v=Wt(r,50,50,8,8,a);return p+y+$+v+g+m}function sh(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=`
    <circle cx="42" cy="26" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="54" cy="24" r="10" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="62" cy="28" r="7" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="36" y="28" width="30" height="8" fill="${l}"/>
  `,p=`
    <path d="M54,34 L44,52 L52,52 L42,74" stroke="${o}" stroke-width="6" fill="none" opacity="0.15" stroke-linecap="round" stroke-linejoin="round"/>
  `,y=`
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${R(r,20)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,$=`
    <g fill="${r}" opacity="0.5">
      <circle cx="38" cy="60" r="1" />
      <circle cx="56" cy="44" r="1.2" />
      <circle cx="36" cy="70" r="0.8" />
    </g>
  `,g=Ht(u,s,44,56,54,56,2.5),m=Zt(u,49,62),v=Wt(r,48,54,10,16,a);return f+p+y+$+v+g+m}function ch(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M28,28 Q50,24 72,28 Q68,36 62,38 Q50,34 38,38 Q32,36 28,28 Z" fill="${r}" stroke="${f}" stroke-width="0.5"/>
    <path d="M34,38 Q50,34 66,38 Q62,46 58,48 Q50,44 42,48 Q38,46 34,38 Z" fill="${S(r,8)}" stroke="${f}" stroke-width="0.4"/>
    <path d="M38,48 Q50,44 62,48 Q58,56 56,58 Q50,54 44,58 Q40,56 38,48 Z" fill="${S(r,16)}" stroke="${f}" stroke-width="0.4"/>
    <path d="M42,58 Q50,54 58,58 Q56,66 54,68 Q50,64 46,68 Q44,66 42,58 Z" fill="${S(r,24)}" stroke="${f}" stroke-width="0.3"/>
    <path d="M44,68 Q50,64 56,68 Q54,76 52,78 Q50,74 48,78 Q46,76 44,68 Z" fill="${S(r,32)}" stroke="${f}" stroke-width="0.3"/>
  `,y=`
    <g opacity="0.15">
      <path d="M32,30 Q50,26 68,30" stroke="${R(l,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M38,40 Q50,36 62,40" stroke="${R(l,10)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </g>
  `,$=`
    <g fill="${o}" opacity="0.3">
      <circle cx="30" cy="32" r="1.5"/>
      <circle cx="70" cy="34" r="1"/>
      <circle cx="36" cy="46" r="1.2"/>
      <circle cx="64" cy="42" r="0.8"/>
      <circle cx="46" cy="72" r="1"/>
    </g>
  `,g=Ht(u,s,44,34,56,34,2.5),m=Zt(u,50,40),v=Wt(r,50,36,18,8,a);return p+y+$+v+g+m}function ah(c){const{primaryColor:r,secondaryColor:l,precipitationColor:o,eyeColor:s,expression:u,pattern:a}=c,f=`
    <circle cx="20" cy="62" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="28" cy="60" r="6" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="16" y="62" width="16" height="6" fill="${l}"/>
  `,p=`
    <circle cx="80" cy="62" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="72" cy="60" r="6" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="68" y="62" width="16" height="6" fill="${l}"/>
  `,y=["#EF5350","#FF9800","#FFEB3B","#66BB6A","#42A5F5","#AB47BC"];let $="";for(let w=0;w<y.length;w++){const _=34-w*3;$+=`<path d="M${50-_},64 A${_},${_} 0 0,1 ${50+_},64" stroke="${y[w]}" stroke-width="3" fill="none" opacity="0.7"/>`}const g=`
    <path d="M18,64 A32,32 0 0,1 82,64" stroke="${r}" stroke-width="1.5" fill="none" opacity="0.2"/>
  `,m=`
    <g fill="${o}" opacity="0.3">
      <circle cx="34" cy="40" r="1"/>
      <circle cx="50" cy="32" r="1.2"/>
      <circle cx="66" cy="40" r="1"/>
    </g>
  `,v=Ht(u,s,44,48,56,48,2.5),M=Zt(u,50,54),x=Wt(r,50,46,20,14,a);return f+p+$+g+m+x+v+M}function uh(c){const{primaryColor:r,glowColor:l,eyeColor:o,expression:s,pattern:u}=c,a=S(r,15),f=`
    <circle cx="50" cy="50" r="26" fill="${l}" opacity="0.1"/>
  `,p=`
    <defs>
      <clipPath id="moon-clip">
        <circle cx="50" cy="50" r="22"/>
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="22" fill="${r}" stroke="${a}" stroke-width="0.6"/>
    <g clip-path="url(#moon-clip)">
      <circle cx="62" cy="40" r="18" fill="${S(r,10)}" opacity="0.3"/>
    </g>
  `,y=`
    <g opacity="0.15">
      <circle cx="42" cy="46" r="3" fill="${a}"/>
      <circle cx="48" cy="58" r="2.5" fill="${a}"/>
      <circle cx="38" cy="56" r="1.8" fill="${a}"/>
    </g>
  `,$=`
    <circle cx="44" cy="42" r="4" fill="${R(r,15)}" opacity="0.15"/>
  `,g=Ht(s,o,42,50,52,50,2.5),m=Zt(s,47,56),v=Wt(r,46,52,14,14,u);return f+p+y+$+v+g+m}function fh(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <circle cx="50" cy="50" r="28" fill="${o}" opacity="0.1"/>
  `,y=[];for(let w=0;w<5;w++){const _=(w*72-90)*(Math.PI/180),z=(w*72+36-90)*(Math.PI/180),T=50+24*Math.cos(_),N=50+24*Math.sin(_),U=50+10*Math.cos(z),K=50+10*Math.sin(z);y.push(`${T},${N}`,`${U},${K}`)}const $=`
    <polygon points="${y.join(" ")}" fill="${r}" stroke="${f}" stroke-width="0.6" stroke-linejoin="round"/>
  `,g=`
    <circle cx="48" cy="46" r="5" fill="${R(l,10)}" opacity="0.15"/>
  `,m=`
    <g fill="white" opacity="0.4">
      <circle cx="50" cy="26" r="1.5"/>
      <circle cx="73" cy="41" r="1.2"/>
      <circle cx="26" cy="41" r="1"/>
    </g>
  `,v=Ht(u,s,45,48,55,48,2.5),M=Zt(u,50,54),x=Wt(r,50,50,10,10,a);return p+$+g+m+x+v+M}function dh(c){const{primaryColor:r,secondaryColor:l,glowColor:o,precipitationColor:s,eyeColor:u,expression:a,pattern:f}=c,p=S(r,20),y=`
    <g opacity="0.4">
      <path d="M50,50 Q30,42 10,36" stroke="${l}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
      <path d="M50,50 Q32,44 14,40" stroke="${s}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
      <path d="M50,50 Q34,46 18,44" stroke="${R(l,15)}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    </g>
  `,$=`
    <g stroke="${l}" stroke-width="0.8" opacity="0.2" stroke-linecap="round">
      <line x1="40" y1="36" x2="24" y2="30"/>
      <line x1="38" y1="54" x2="22" y2="52"/>
      <line x1="42" y1="62" x2="28" y2="60"/>
    </g>
  `,g=`
    <g fill="${o}" opacity="0.3">
      <circle cx="30" cy="44" r="1.5"/>
      <circle cx="22" cy="40" r="1"/>
      <circle cx="36" cy="46" r="1.2"/>
      <circle cx="16" cy="38" r="0.8"/>
    </g>
  `,m=`
    <circle cx="54" cy="50" r="18" fill="${o}" opacity="0.12"/>
  `,v=`
    <circle cx="54" cy="50" r="14" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <circle cx="50" cy="46" r="4" fill="${R(r,15)}" opacity="0.2"/>
  `,M=Ht(a,u,50,48,58,48,2.5),x=Zt(a,54,54),w=Wt(r,54,50,12,12,f);return y+$+g+m+v+w+M+x}var ph={sun:.76,cloud:.78,raindrop:.76,snowflake:.74,lightning:.76,tornado:.76,rainbow:.78,moon:.78,star:.76,comet:.76};function hh(c){const{backgroundShape:r,weatherType:l,backgroundColor:o,decoration:s}=c;let u;switch(l){case"sun":u=C0(c);break;case"cloud":u=lh(c);break;case"raindrop":u=oh(c);break;case"snowflake":u=ih(c);break;case"lightning":u=sh(c);break;case"tornado":u=ch(c);break;case"rainbow":u=ah(c);break;case"moon":u=uh(c);break;case"star":u=fh(c);break;case"comet":u=dh(c);break;default:u=C0(c)}const f=`<g transform="translate(50, 50) scale(${ph[l]??.76}) translate(-50, -50)">${u}</g>`,p=nh(s);return lt(f+p,r,o)}function yh(c){const r=["circle","rounded","square"],l=["sun","cloud","raindrop","snowflake","lightning","tornado","rainbow","moon","star","comet"],o=["happy","breezy","surprised","sleepy"],s=["none","swirls","dots","stripes"],u=["none","raindrops","snowflakes","windlines"],a=["#FFD54F","#FFC107","#FFB300","#FF8F00","#90CAF9","#64B5F6","#42A5F5","#BBDEFB","#B0BEC5","#CFD8DC","#ECEFF1","#FFFFFF","#CE93D8","#B39DDB","#81D4FA","#A5D6A7"],f=["#FFF9C4","#FFFDE7","#E3F2FD","#E8EAF6","#F3E5F5","#FFFFFF","#FFF8E1","#E0F7FA"],p=["#FF8F00","#FFD54F","#2979FF","#B0BEC5","#FFF9C4","#FF6F00","#448AFF","#E0E0E0"],y=["#90CAF9","#64B5F6","#BBDEFB","#E3F2FD","#FFFFFF","#B0BEC5","#FFF9C4","#CFD8DC"],$=["#E3F2FD","#BBDEFB","#E1F5FE","#E8EAF6","#FCE4EC","#FFF8E1","#E0F7FA","#F3E5F5","#1A237E","#263238","#37474F","#ECEFF1"],g=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:D(r,c),weatherType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),glowColor:D(p,c),precipitationColor:D(y,c),eyeColor:D(g,c),backgroundColor:D($,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var $h={name:"Weather",schema:rh,shapeParam:"weatherType",generate:hh,randomize:yh},kh={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},gemType:{type:"select",default:"diamond",options:["diamond","ruby","emerald","sapphire","amethyst","opal","topaz","pearl","crystal","geode"]},primaryColor:{type:"color",default:"#B3E5FC"},secondaryColor:{type:"color",default:"#E1F5FE"},facetColor:{type:"color",default:"#FFFFFF"},sparkleColor:{type:"color",default:"#FFF9C4"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#1A237E"},expression:{type:"select",default:"happy",options:["happy","dazzled","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","facets","inclusions","shimmer"]},decoration:{type:"select",default:"none",options:["none","sparkles","stardust","glowring"]}};function qt(c,r,l,o,s,u,a){const f=a,p=f*.45,y=f*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"dazzled":return`
        <g fill="${r}">
          <path d="M${l},${o-f} L${l+f*.35},${o-f*.35} L${l+f},${o} L${l+f*.35},${o+f*.35} L${l},${o+f} L${l-f*.35},${o+f*.35} L${l-f},${o} L${l-f*.35},${o-f*.35} Z"/>
          <path d="M${s},${u-f} L${s+f*.35},${u-f*.35} L${s+f},${u} L${s+f*.35},${u+f*.35} L${s},${u+f} L${s-f*.35},${u+f*.35} L${s-f},${u} L${s-f*.35},${u-f*.35} Z"/>
        </g>
        <circle cx="${l}" cy="${o}" r="${y}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${s}" cy="${u}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${s-1}" cy="${u-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${s}" cy="${u}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${s}" cy="${u+1}" r="${p}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
        <path d="M${s-f},${u-f*.3} Q${s},${u-f*.8} ${s+f},${u-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Yt(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"dazzled":return`
        <path d="M${r-3},${l} Q${r},${l+5} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${r}" cy="${l+3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Gt(c,r,l,o,s,u){switch(u){case"facets":return`
        <g opacity="0.2" stroke="${c}" stroke-width="0.8" fill="none" stroke-linecap="round">
          <line x1="${r}" y1="${l-s*.4}" x2="${r-o*.3}" y2="${l+s*.2}"/>
          <line x1="${r}" y1="${l-s*.4}" x2="${r+o*.3}" y2="${l+s*.2}"/>
          <line x1="${r-o*.3}" y1="${l+s*.2}" x2="${r+o*.3}" y2="${l+s*.2}"/>
          <line x1="${r-o*.5}" y1="${l-s*.1}" x2="${r+o*.5}" y2="${l-s*.1}"/>
        </g>
      `;case"inclusions":return`
        <g opacity="0.15">
          <circle cx="${r-o*.2}" cy="${l-s*.15}" r="1.5" fill="${c}"/>
          <circle cx="${r+o*.25}" cy="${l+s*.1}" r="1" fill="${c}"/>
          <ellipse cx="${r+o*.1}" cy="${l-s*.25}" rx="2" ry="0.8" fill="${c}" transform="rotate(30, ${r+o*.1}, ${l-s*.25})"/>
          <circle cx="${r-o*.3}" cy="${l+s*.2}" r="0.8" fill="${c}"/>
        </g>
      `;case"shimmer":return`
        <g opacity="0.12">
          <path d="M${r-o*.4},${l-s*.3} Q${r-o*.2},${l-s*.1} ${r},${l-s*.3} Q${r+o*.2},${l-s*.5} ${r+o*.4},${l-s*.3}" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M${r-o*.3},${l+s*.1} Q${r},${l-s*.05} ${r+o*.3},${l+s*.1}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;default:return""}}function xh(c,r){switch(c){case"sparkles":return`
        <g opacity="0.45">
          <path d="M14,16 L15,12 L16,16 L20,15 L16,16 L15,20 L14,16 L10,15 Z" fill="${r}"/>
          <path d="M82,14 L83,11 L84,14 L87,13 L84,14 L83,17 L82,14 L79,13 Z" fill="${r}"/>
          <path d="M12,76 L13,73 L14,76 L17,75 L14,76 L13,79 L12,76 L9,75 Z" fill="${r}"/>
          <path d="M86,78 L87,75 L88,78 L91,77 L88,78 L87,81 L86,78 L83,77 Z" fill="${r}"/>
          <path d="M10,46 L11,43 L12,46 L15,45 L12,46 L11,49 L10,46 L7,45 Z" fill="${r}"/>
          <path d="M88,50 L89,47 L90,50 L93,49 L90,50 L89,53 L88,50 L85,49 Z" fill="${r}"/>
        </g>
      `;case"stardust":return`
        <g opacity="0.3">
          <circle cx="14" cy="18" r="1" fill="${r}"/>
          <circle cx="86" cy="16" r="0.8" fill="${r}"/>
          <circle cx="10" cy="50" r="1.2" fill="${r}"/>
          <circle cx="90" cy="48" r="0.9" fill="${r}"/>
          <circle cx="12" cy="80" r="1" fill="${r}"/>
          <circle cx="88" cy="82" r="0.7" fill="${r}"/>
          <circle cx="20" cy="34" r="0.6" fill="${r}"/>
          <circle cx="80" cy="32" r="1.1" fill="${r}"/>
          <circle cx="18" cy="66" r="0.8" fill="${r}"/>
          <circle cx="82" cy="68" r="0.9" fill="${r}"/>
        </g>
      `;case"glowring":return`
        <circle cx="50" cy="50" r="42" stroke="${r}" stroke-width="2" fill="none" opacity="0.12"/>
        <circle cx="50" cy="50" r="46" stroke="${r}" stroke-width="1" fill="none" opacity="0.06"/>
      `;default:return""}}function S0(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <polygon points="38,38 62,38 72,52 28,52" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <polygon points="42,38 58,38 54,44 46,44" fill="${R(r,15)}" opacity="0.4"/>
  `,$=`
    <polygon points="28,52 72,52 50,76" fill="${S(r,10)}" stroke="${f}" stroke-width="0.6"/>
  `,g=`
    <g stroke="${o}" stroke-width="0.5" opacity="0.3">
      <line x1="46" y1="44" x2="28" y2="52"/>
      <line x1="54" y1="44" x2="72" y2="52"/>
      <line x1="50" y1="38" x2="50" y2="44"/>
    </g>
  `,m=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.2">
      <line x1="38" y1="52" x2="50" y2="76"/>
      <line x1="62" y1="52" x2="50" y2="76"/>
      <line x1="50" y1="52" x2="50" y2="76"/>
    </g>
  `,v=`
    <polygon points="42,40 48,40 46,46 40,46" fill="${l}" opacity="0.2"/>
  `,M=qt(u,s,44,48,56,48,2.5),x=Yt(u,50,54),w=Gt(o,50,50,20,16,a);return p+y+$+g+m+v+w+M+x}function gh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <ellipse cx="50" cy="50" rx="20" ry="18" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <ellipse cx="50" cy="50" rx="16" ry="14" fill="${R(r,10)}" opacity="0.15"/>
    <ellipse cx="44" cy="44" rx="8" ry="6" fill="${l}" opacity="0.15"/>
  `,$=`
    <g stroke="${o}" stroke-width="0.6" opacity="0.2" stroke-linecap="round">
      <line x1="50" y1="36" x2="50" y2="64"/>
      <line x1="36" y1="44" x2="64" y2="56"/>
      <line x1="36" y1="56" x2="64" y2="44"/>
    </g>
  `,g=qt(u,s,44,48,56,48,2.5),m=Yt(u,50,54),v=Gt(o,50,50,18,16,a);return p+y+$+v+g+m}function mh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <polygon points="36,34 64,34 70,40 70,60 64,66 36,66 30,60 30,40" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <g stroke="${o}" stroke-width="0.5" opacity="0.2">
      <line x1="34" y1="40" x2="66" y2="40"/>
      <line x1="32" y1="46" x2="68" y2="46"/>
      <line x1="32" y1="54" x2="68" y2="54"/>
      <line x1="34" y1="60" x2="66" y2="60"/>
    </g>
  `,$=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.15">
      <line x1="36" y1="34" x2="30" y2="40"/>
      <line x1="64" y1="34" x2="70" y2="40"/>
      <line x1="36" y1="66" x2="30" y2="60"/>
      <line x1="64" y1="66" x2="70" y2="60"/>
    </g>
  `,g=`
    <rect x="34" y="36" width="12" height="8" rx="1" fill="${l}" opacity="0.12"/>
  `,m=qt(u,s,44,48,56,48,2.5),v=Yt(u,50,54),M=Gt(o,50,50,18,14,a);return p+y+$+g+M+m+v}function wh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <path d="M50,26 Q68,36 68,56 Q68,72 50,74 Q32,72 32,56 Q32,36 50,26 Z" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <path d="M42,36 Q48,32 50,38 Q52,32 58,36" fill="${o}" opacity="0.15"/>
    <ellipse cx="44" cy="46" rx="5" ry="8" fill="${l}" opacity="0.1"/>
  `,$=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.2" stroke-linecap="round">
      <line x1="50" y1="28" x2="42" y2="50"/>
      <line x1="50" y1="28" x2="58" y2="50"/>
      <line x1="42" y1="50" x2="50" y2="72"/>
      <line x1="58" y1="50" x2="50" y2="72"/>
    </g>
  `,g=qt(u,s,44,48,56,48,2.5),m=Yt(u,50,56),v=Gt(o,50,50,16,20,a);return p+y+$+v+g+m}function vh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <polygon points="40,74 34,74 28,54 34,30 40,30 46,54" fill="${S(r,12)}" stroke="${f}" stroke-width="0.5"/>
    <polygon points="54,74 48,74 42,48 48,24 54,24 60,48" fill="${r}" stroke="${f}" stroke-width="0.5"/>
    <polygon points="66,74 60,74 54,52 60,32 66,32 72,52" fill="${S(r,6)}" stroke="${f}" stroke-width="0.5"/>
  `,y=`
    <polygon points="34,30 40,30 37,22" fill="${R(r,10)}" stroke="${f}" stroke-width="0.4"/>
    <polygon points="48,24 54,24 51,16" fill="${R(r,15)}" stroke="${f}" stroke-width="0.4"/>
    <polygon points="60,32 66,32 63,24" fill="${R(r,8)}" stroke="${f}" stroke-width="0.4"/>
  `,$=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.2">
      <line x1="37" y1="30" x2="37" y2="74"/>
      <line x1="51" y1="24" x2="51" y2="74"/>
      <line x1="63" y1="32" x2="63" y2="74"/>
    </g>
  `,g=`
    <polygon points="48,28 52,28 54,40 48,40" fill="${l}" opacity="0.12"/>
  `,m=qt(u,s,44,52,56,52,2.5),v=Yt(u,50,58),M=Gt(o,50,50,18,20,a);return p+y+$+g+M+m+v}function Mh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,15),p=`
    <ellipse cx="50" cy="52" rx="22" ry="18" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <g opacity="0.2">
      <ellipse cx="40" cy="46" rx="6" ry="4" fill="#81D4FA" transform="rotate(-15, 40, 46)"/>
      <ellipse cx="56" cy="44" rx="5" ry="3.5" fill="#CE93D8" transform="rotate(20, 56, 44)"/>
      <ellipse cx="46" cy="56" rx="7" ry="4" fill="#A5D6A7" transform="rotate(10, 46, 56)"/>
      <ellipse cx="58" cy="56" rx="5" ry="3" fill="#FFE082" transform="rotate(-10, 58, 56)"/>
      <ellipse cx="42" cy="50" rx="4" ry="3" fill="#F48FB1" transform="rotate(5, 42, 50)"/>
    </g>
  `,$=`
    <ellipse cx="44" cy="44" rx="10" ry="6" fill="${l}" opacity="0.15"/>
    <ellipse cx="42" cy="42" rx="4" ry="2.5" fill="${o}" opacity="0.15"/>
  `,g=qt(u,s,44,50,56,50,2.5),m=Yt(u,50,56),v=Gt(o,50,52,20,16,a);return p+y+$+v+g+m}function Ch(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <polygon points="42,28 58,28 68,36 68,64 58,72 42,72 32,64 32,36" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <g stroke="${o}" stroke-width="0.5" opacity="0.2">
      <line x1="50" y1="28" x2="50" y2="72"/>
      <line x1="32" y1="50" x2="68" y2="50"/>
      <line x1="42" y1="28" x2="32" y2="36"/>
      <line x1="58" y1="28" x2="68" y2="36"/>
      <line x1="42" y1="72" x2="32" y2="64"/>
      <line x1="58" y1="72" x2="68" y2="64"/>
    </g>
  `,$=`
    <polygon points="44,32 56,32 62,38 62,48 56,52 44,52 38,48 38,38" fill="${l}" opacity="0.12"/>
    <ellipse cx="46" cy="40" rx="5" ry="4" fill="${o}" opacity="0.1"/>
  `,g=qt(u,s,44,48,56,48,2.5),m=Yt(u,50,54),v=Gt(o,50,50,16,20,a);return p+y+$+v+g+m}function Sh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,12),p=`
    <path d="M24,68 Q26,58 36,54 Q50,50 64,54 Q74,58 76,68 Q50,76 24,68 Z" fill="#D7CCC8" stroke="${S("#D7CCC8",15)}" stroke-width="0.5"/>
    <g stroke="#BCAAA4" stroke-width="0.4" opacity="0.3" fill="none" stroke-linecap="round">
      <path d="M30,66 Q50,56 70,66"/>
      <path d="M32,64 Q50,58 68,64"/>
      <path d="M36,60 Q50,56 64,60"/>
    </g>
  `,y=`
    <circle cx="50" cy="42" r="20" fill="${r}" stroke="${f}" stroke-width="0.5"/>
  `,$=`
    <ellipse cx="44" cy="34" rx="10" ry="8" fill="${l}" opacity="0.2"/>
    <circle cx="42" cy="32" r="4" fill="${o}" opacity="0.25"/>
    <circle cx="40" cy="30" r="1.5" fill="white" opacity="0.4"/>
  `,g=`
    <ellipse cx="50" cy="50" rx="18" ry="4" fill="${f}" opacity="0.06"/>
  `,m=qt(u,s,44,40,56,40,2.5),v=Yt(u,50,48),M=Gt(o,50,42,18,18,a);return p+y+$+g+M+m+v}function Eh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p=`
    <polygon points="40,72 32,68 32,36 40,32 50,32 58,36 58,68 50,72" fill="${r}" stroke="${f}" stroke-width="0.6"/>
  `,y=`
    <polygon points="50,72 58,68 58,36 50,32" fill="${S(r,15)}" stroke="${f}" stroke-width="0.4"/>
  `,$=`
    <polygon points="40,32 50,32 50,20 45,18 40,20" fill="${R(r,12)}" stroke="${f}" stroke-width="0.5"/>
    <polygon points="50,32 58,36 56,22 50,20" fill="${r}" stroke="${f}" stroke-width="0.4"/>
  `,g=`
    <line x1="45" y1="20" x2="45" y2="72" stroke="${l}" stroke-width="1.5" opacity="0.12"/>
    <polygon points="34" y1="38" width="6" height="12" fill="${o}" opacity="0.08"/>
  `,m=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.15">
      <line x1="36" y1="40" x2="36" y2="66"/>
      <line x1="54" y1="38" x2="54" y2="68"/>
    </g>
  `,v=qt(u,s,40,48,52,48,2.5),M=Yt(u,46,54),x=Gt(o,45,50,12,18,a);return p+y+$+g+m+x+v+M}function Qh(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:s,expression:u,pattern:a}=c,f=S(r,20),p="#78909C",y=S(p,20),$=`
    <path d="M22,30 Q18,40 20,56 Q22,72 30,76 Q42,78 50,74 L50,26 Q40,24 30,26 Z" fill="${p}" stroke="${y}" stroke-width="0.6"/>
    <path d="M78,30 Q82,40 80,56 Q78,72 70,76 Q58,78 50,74 L50,26 Q60,24 70,26 Z" fill="${S(p,8)}" stroke="${y}" stroke-width="0.6"/>
  `,g=`
    <g opacity="0.2">
      <circle cx="28" cy="40" r="2" fill="${y}"/>
      <circle cx="24" cy="56" r="1.5" fill="${y}"/>
      <circle cx="32" cy="68" r="1.8" fill="${y}"/>
      <circle cx="72" cy="42" r="1.8" fill="${y}"/>
      <circle cx="76" cy="58" r="1.5" fill="${y}"/>
      <circle cx="68" cy="70" r="2" fill="${y}"/>
    </g>
  `,m=`
    <path d="M38,32 Q50,28 62,32 L62,68 Q50,72 38,68 Z" fill="${r}" opacity="0.6"/>
  `,v=`
    <g>
      <polygon points="42,66 44,66 44,48 42,50" fill="${r}" stroke="${f}" stroke-width="0.3"/>
      <polygon points="48,68 50,68 50,42 48,44" fill="${R(r,10)}" stroke="${f}" stroke-width="0.3"/>
      <polygon points="54,66 56,66 56,46 54,48" fill="${r}" stroke="${f}" stroke-width="0.3"/>
      <polygon points="46,64 48,64 48,52 46,54" fill="${S(r,8)}" stroke="${f}" stroke-width="0.3"/>
      <polygon points="52,66 54,66 54,50 52,52" fill="${R(r,6)}" stroke="${f}" stroke-width="0.3"/>
    </g>
  `,M=`
    <g fill="${l}" opacity="0.3">
      <circle cx="43" cy="48" r="1"/>
      <circle cx="49" cy="42" r="1.2"/>
      <circle cx="55" cy="46" r="1"/>
    </g>
  `,x=qt(u,s,44,54,56,54,2.5),w=Yt(u,50,60),_=Gt(o,50,54,12,14,a);return $+g+m+v+M+_+x+w}var Fh={diamond:.76,ruby:.78,emerald:.76,sapphire:.76,amethyst:.74,opal:.78,topaz:.76,pearl:.76,crystal:.76,geode:.74};function Lh(c){const{backgroundShape:r,gemType:l,backgroundColor:o,decoration:s,sparkleColor:u}=c;let a;switch(l){case"diamond":a=S0(c);break;case"ruby":a=gh(c);break;case"emerald":a=mh(c);break;case"sapphire":a=wh(c);break;case"amethyst":a=vh(c);break;case"opal":a=Mh(c);break;case"topaz":a=Ch(c);break;case"pearl":a=Sh(c);break;case"crystal":a=Eh(c);break;case"geode":a=Qh(c);break;default:a=S0(c)}const p=`<g transform="translate(50, 50) scale(${Fh[l]??.76}) translate(-50, -50)">${a}</g>`,y=xh(s,u);return lt(p+y,r,o)}function _h(c){const r=["circle","rounded","square"],l=["diamond","ruby","emerald","sapphire","amethyst","opal","topaz","pearl","crystal","geode"],o=["happy","dazzled","surprised","sleepy"],s=["none","facets","inclusions","shimmer"],u=["none","sparkles","stardust","glowring"],a=["#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#EF5350","#E53935","#C62828","#B71C1C","#66BB6A","#43A047","#2E7D32","#1B5E20","#42A5F5","#1E88E5","#1565C0","#0D47A1"],f=["#E1F5FE","#FFCDD2","#C8E6C9","#BBDEFB","#F3E5F5","#FFF9C4","#B2EBF2","#F5F5F5"],p=["#FFFFFF","#E0E0E0","#B3E5FC","#F8BBD0","#FFE082","#C5CAE9","#B0BEC5","#F5F5F5"],y=["#FFF9C4","#FFFFFF","#E0E0E0","#FFE082","#B3E5FC","#FFD54F","#C5CAE9","#F5F5F5"],$=["#1A237E","#263238","#311B92","#004D40","#880E4F","#3E2723","#F3E5F5","#E8EAF6","#E1F5FE","#FFF8E1","#FCE4EC","#ECEFF1"],g=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:D(r,c),gemType:D(l,c),primaryColor:D(a,c),secondaryColor:D(f,c),facetColor:D(p,c),sparkleColor:D(y,c),eyeColor:D(g,c),backgroundColor:D($,c),expression:D(o,c),pattern:D(s,c),decoration:D(u,c)}}var Ph={name:"Gems",schema:kh,shapeParam:"gemType",generate:Lh,randomize:_h},Sr={people:hp,animals:Fp,monsters:Dp,robots:qp,aliens:n2,ocean:x2,dinosaurs:A2,mythical:Y2,insects:u5,birds:S5,plants:z5,food:th,weather:$h,gems:Ph};function $n(c,r){const l=Sr[c];if(!l)throw new Error(`Unknown theme: ${c}`);return l.generate(r)}function zs(c,r){const l=Sr[c];if(!l)throw new Error(`Unknown theme: ${c}`);const o=P0(r);return l.randomize(o)}function Hs(){return Object.keys(Sr)}function pl(c){const r=Sr[c];if(!r)throw new Error(`Unknown theme: ${c}`);return{name:r.name,schema:r.schema}}function bh(c,r,l){if(c<=0)return[];const o=P0(r),s=new Map;function u(T){return T==="none"||T==="no"}function a(T,N){if(u(N))return;let U=s.get(T);U||(U=new Set,s.set(T,U)),U.add(N)}function f(T,N){var U;return u(N)?!1:((U=s.get(T))==null?void 0:U.has(N))??!1}function p(T,N){const U=N.filter(K=>!f(T,K));return U.length>0?U[o.uniformInt(0,U.length)]:N[o.uniformInt(0,N.length)]}function y(T,N,U,K){const V=[];for(let F=N;F<=U;F+=K)V.push(F);const I=V.filter(F=>!f(T,F));return I.length>0?I[o.uniformInt(0,I.length)]:V[o.uniformInt(0,V.length)]}function $(T,N){if(!f(T,N))return N;const U=parseInt(N.slice(1),16);for(let F=0;F<10;F++){const j=o.uniformInt(5,41),Y=o.uniformBool()?1:-1,re=Math.max(0,Math.min(255,(U>>16)+Y*j)),ie=Math.max(0,Math.min(255,(U>>8&255)+Y*j)),ye=Math.max(0,Math.min(255,(U&255)+Y*j)),ge=`#${(re<<16|ie<<8|ye).toString(16).padStart(6,"0")}`;if(!f(T,ge))return ge}const K=o.uniformInt(0,256),V=o.uniformInt(0,256),I=o.uniformInt(0,256);return`#${(K<<16|V<<8|I).toString(16).padStart(6,"0")}`}function g(T,N){const U=Sr[T],K=U.schema,V=U.shapeParam,I=U.randomize(o);I[V]=N,a(V,N);for(const[F,j]of Object.entries(K))F!==V&&(j.type==="select"&&j.options?I[F]=p(F,j.options):j.type==="color"?I[F]=$(F,I[F]):j.type==="number"&&(I[F]=y(F,j.min??0,j.max??10,j.step??1)),a(F,I[F]));return I}const m=Hs(),v=o.shuffle(m.filter(T=>T!=="people")),M=new Map;for(const T of v){const N=Sr[T],U=N.shapeParam,K=N.schema[U];(K==null?void 0:K.type)==="select"&&K.options&&M.set(T,o.shuffle([...K.options]))}const x=[],w=c-1;let _=!0;for(;x.length<w&&_;){_=!1;for(const T of v){if(x.length>=w)break;const N=M.get(T);!N||N.length===0||(x.push({theme:T,shapeValue:N.pop()}),_=!0)}}for(;x.length<w;){const T=v[o.uniformInt(0,v.length)],N=Sr[T],U=N.schema[N.shapeParam];U!=null&&U.options&&x.push({theme:T,shapeValue:U.options[o.uniformInt(0,U.options.length)]})}const z=[];if(m.includes("people")){const T=Sr.people,N=T.schema[T.shapeParam],U=N!=null&&N.options?N.options[o.uniformInt(0,N.options.length)]:"bob",K=g("people",U);E0(K,l),z.push({theme:"people",params:K,svg:$n("people",K)})}for(const T of x){const N=g(T.theme,T.shapeValue);E0(N,l),z.push({theme:T.theme,params:N,svg:$n(T.theme,N)})}return o.shuffle(z)}function E0(c,r){r!=null&&r.backgroundShape&&(c.backgroundShape=r.backgroundShape),r!=null&&r.transparentBackground&&(c.backgroundColor="none")}function Ah(c,r){if(typeof document>"u")throw new Error("svgToPng requires a browser environment (Canvas API). This function cannot be used in Node.js.");const{size:l=256}=r??{};return new Promise((o,s)=>{const u=document.createElement("canvas"),a=u.getContext("2d");if(!a){s(new Error("Failed to get canvas 2D context"));return}const f=new Image;u.width=l,u.height=l,f.onload=()=>{a.drawImage(f,0,0,l,l),u.toBlob(y=>{y?o(y):s(new Error("Failed to convert canvas to PNG blob"))},"image/png")},f.onerror=()=>{s(new Error("Failed to load SVG into image"))};const p=new Blob([c],{type:"image/svg+xml;charset=utf-8"});f.src=URL.createObjectURL(p)})}function Rs(){return O.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[O.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),O.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}function Os(){return O.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[O.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),O.jsx("path",{d:"M7 11V7a5 5 0 0 1 9.9-1"})]})}function Nh(){return O.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[O.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"3",ry:"3"}),O.jsx("circle",{cx:"8",cy:"8",r:"1.5",fill:"currentColor",stroke:"none"}),O.jsx("circle",{cx:"16",cy:"8",r:"1.5",fill:"currentColor",stroke:"none"}),O.jsx("circle",{cx:"8",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"}),O.jsx("circle",{cx:"16",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"}),O.jsx("circle",{cx:"12",cy:"12",r:"1.5",fill:"currentColor",stroke:"none"})]})}function yn(c){return c.replace(/([A-Z])/g," $1").replace(/^./,r=>r.toUpperCase()).trim()}function Ih({defaultTheme:c="people",className:r,style:l,onParamsChange:o,gridSize:s=5,gridWidth:u,gridHeight:a,backgroundColor:f,accentColor:p,layout:y="default",alwaysTransparentBackground:$=!1,onSaveSvg:g,onSavePng:m}){const v=u??s,x=v*(a??s),w=Hs(),[_,z]=Me.useState(c),[T,N]=Me.useState(()=>({...zs(c),backgroundShape:"circle"})),[U,K]=Me.useState("editor"),[V,I]=Me.useState(0),[F,j]=Me.useState(!1),[Y,re]=Me.useState(new Set),ie=Me.useCallback(G=>{re(le=>{const fe=new Set(le);return fe.has(G)?fe.delete(G):fe.add(G),fe})},[]),ye=Me.useMemo(()=>pl(_),[_]);Me.useEffect(()=>{o==null||o(_,T)},[]);const ge=Me.useMemo(()=>$?{...T,backgroundColor:"none"}:T,[T,$]),me=Me.useMemo(()=>$n(_,ge),[_,ge]),xe=Me.useCallback(G=>{z(G),re(new Set);const le={...zs(G),backgroundShape:"circle"};N(le),o==null||o(G,le)},[o]),q=Me.useCallback((G,le)=>{N(fe=>{const Ce={...fe,[G]:le};return o==null||o(_,Ce),Ce})},[_,o]),te=Me.useCallback(()=>{const le=Y.has("theme")?_:w[Math.floor(Math.random()*w.length)],fe={...zs(le),backgroundShape:"circle"},Ce=pl(le);for(const Ne of Y)Ne in Ce.schema&&Ne in T&&(fe[Ne]=T[Ne]);z(le),N(fe),o==null||o(le,fe)},[w,o,Y,T,_]),J=Me.useMemo(()=>{const G=new Set(["backgroundShape"]);$&&G.add("backgroundColor");const le=Object.entries(ye.schema).filter(([Ne])=>!G.has(Ne)),fe=le.filter(([,Ne])=>Ne.type==="color"),Ce=le.filter(([,Ne])=>Ne.type!=="color");return[...fe,...Ce]},[ye.schema,$]),L=Me.useMemo(()=>{const G=`gallery-v${V}-${Date.now()}`;return bh(x,G,{backgroundShape:"circle",transparentBackground:$})},[x,V,$]),B=Me.useCallback(G=>{z(G.theme),N(G.params),K("editor"),o==null||o(G.theme,G.params)},[o]),ce=Me.useCallback(()=>{I(G=>G+1)},[]),ue=(G,le)=>{const fe=T[G]??le.default,Ce=Y.has(G),Ne=O.jsx("button",{className:`avatarka-lock-btn ${Ce?"locked":""}`,onClick:()=>ie(G),title:Ce?"Unlock":"Lock","aria-label":Ce?`Unlock ${yn(G)}`:`Lock ${yn(G)}`,children:Ce?O.jsx(Rs,{}):O.jsx(Os,{})});switch(le.type){case"color":return O.jsxs("div",{className:"avatarka-control-group",children:[O.jsx("label",{children:yn(G)}),O.jsxs("div",{className:"avatarka-control-row",children:[O.jsx("input",{type:"color",value:String(fe),onChange:Xe=>q(G,Xe.target.value)}),Ne]})]},G);case"number":return O.jsxs("div",{className:"avatarka-control-group",children:[O.jsxs("label",{children:[yn(G),": ",fe]}),O.jsxs("div",{className:"avatarka-control-row",children:[O.jsx("input",{type:"range",min:le.min,max:le.max,step:le.step??1,value:Number(fe),onChange:Xe=>q(G,Number(Xe.target.value))}),Ne]})]},G);case"select":return O.jsxs("div",{className:"avatarka-control-group",children:[O.jsx("label",{children:yn(G)}),O.jsxs("div",{className:"avatarka-control-row",children:[O.jsx("select",{value:String(fe),onChange:Xe=>q(G,Xe.target.value),children:le.options.map(Xe=>O.jsx("option",{value:Xe,children:yn(Xe)},Xe))}),Ne]})]},G);default:return null}},he={...l,...f&&{"--avatarka-bg":f},...p&&{"--avatarka-accent":p},"--avatarka-grid-width":v},$e=y==="compact"?"avatarka-picker--compact":"";return O.jsxs("div",{className:`avatarka-picker ${$e} ${r||""}`.trim(),style:he,children:[O.jsxs("div",{className:"avatarka-tabs",children:[O.jsx("button",{className:`avatarka-tab ${U==="editor"?"active":""}`,onClick:()=>K("editor"),children:"Editor"}),O.jsx("button",{className:`avatarka-tab ${U==="gallery"?"active":""}`,onClick:()=>K("gallery"),children:"Gallery"}),O.jsxs("div",{className:"avatarka-tabs-actions",children:[g&&O.jsx("button",{className:"avatarka-action-btn",onClick:g,title:"Save as SVG",children:"SVG"}),m&&O.jsx("button",{className:"avatarka-action-btn",onClick:m,title:"Save as PNG",children:"PNG"}),O.jsx("button",{className:`avatarka-dice-btn ${F?"spinning":""}`,onClick:()=>{j(!0),(U==="editor"?te:ce)()},onAnimationEnd:()=>j(!1),title:"Randomize","aria-label":"Randomize",children:O.jsx(Nh,{})})]})]}),U==="editor"?O.jsx("div",{className:"avatarka-editor",children:y==="compact"?O.jsxs(O.Fragment,{children:[O.jsx("div",{className:"avatarka-editor-left",children:O.jsx("div",{className:"avatarka-preview",dangerouslySetInnerHTML:{__html:me}})}),O.jsxs("div",{className:"avatarka-editor-right",children:[O.jsxs("div",{className:"avatarka-control-row",children:[O.jsx("select",{className:"avatarka-theme-dropdown",value:_,onChange:G=>xe(G.target.value),children:w.map(G=>O.jsx("option",{value:G,children:pl(G).name},G))}),O.jsx("button",{className:`avatarka-lock-btn ${Y.has("theme")?"locked":""}`,onClick:()=>ie("theme"),title:Y.has("theme")?"Unlock":"Lock","aria-label":Y.has("theme")?"Unlock Theme":"Lock Theme",children:Y.has("theme")?O.jsx(Rs,{}):O.jsx(Os,{})})]}),O.jsx("div",{className:"avatarka-controls-grid",children:J.map(([G,le])=>ue(G,le))})]})]}):O.jsxs(O.Fragment,{children:[O.jsxs("div",{className:"avatarka-control-row",children:[O.jsx("select",{className:"avatarka-theme-dropdown",value:_,onChange:G=>xe(G.target.value),children:w.map(G=>O.jsx("option",{value:G,children:pl(G).name},G))}),O.jsx("button",{className:`avatarka-lock-btn ${Y.has("theme")?"locked":""}`,onClick:()=>ie("theme"),title:Y.has("theme")?"Unlock":"Lock","aria-label":Y.has("theme")?"Unlock Theme":"Lock Theme",children:Y.has("theme")?O.jsx(Rs,{}):O.jsx(Os,{})})]}),O.jsx("div",{className:"avatarka-preview",dangerouslySetInnerHTML:{__html:me}}),O.jsx("div",{className:"avatarka-controls-grid",children:J.map(([G,le])=>ue(G,le))})]})}):O.jsx("div",{className:"avatarka-gallery",children:O.jsx("div",{className:"avatarka-gallery-grid",children:L.map((G,le)=>O.jsx("div",{className:"avatarka-gallery-item",dangerouslySetInnerHTML:{__html:G.svg},onClick:()=>B(G),title:`${pl(G.theme).name} - Click to edit`},le))})})]})}const Q0=Hs(),F0=Q0[Math.floor(Math.random()*Q0.length)],Th=["primaryColor","bodyColor","skinColor"];function Dh(c){const r=parseInt(c.slice(1),16),l=(r>>16)/255,o=(r>>8&255)/255,s=(r&255)/255,u=Math.max(l,o,s),a=Math.min(l,o,s),f=(u+a)/2;if(u===a)return[0,0,f*100];const p=u-a,y=f>.5?p/(2-u-a):p/(u+a);let $=0;return u===l?$=((o-s)/p+(o<s?6:0))/6:u===o?$=((s-l)/p+2)/6:$=((l-o)/p+4)/6,[$*360,y*100,f*100]}function Bh(c){const[r]=Dh(c);return b0((r+180)%360,55,82)}function jh(){const[c,r]=Me.useState(()=>localStorage.getItem("avatarka-color-mode")||"system"),[l,o]=Me.useState(()=>localStorage.getItem("avatarka-layout")||"default"),[s,u]=Me.useState(()=>localStorage.getItem("avatarka-transparent-bg")==="true"),[a,f]=Me.useState(F0),[p,y]=Me.useState(null),$=Me.useCallback((x,w)=>{f(x),y(w)},[]),g=Me.useCallback(()=>{if(!p)return null;const x=s?{...p,backgroundColor:"none"}:p;return $n(a,x)},[a,p,s]),m=Me.useCallback(()=>{const x=g();if(!x)return;const w=new Blob([x],{type:"image/svg+xml"}),_=URL.createObjectURL(w),z=document.createElement("a");z.href=_,z.download=`avatar-${a}.svg`,document.body.appendChild(z),z.click(),document.body.removeChild(z),URL.revokeObjectURL(_)},[g,a]),v=Me.useCallback(async()=>{const x=g();if(!x)return;const w=await Ah(x,{size:512}),_=URL.createObjectURL(w),z=document.createElement("a");z.href=_,z.download=`avatar-${a}.png`,document.body.appendChild(z),z.click(),document.body.removeChild(z),URL.revokeObjectURL(_)},[g,a]);Me.useEffect(()=>{const x=z=>{const T=document.documentElement;if(z==="system"){const N=window.matchMedia("(prefers-color-scheme: dark)").matches;T.setAttribute("data-theme",N?"dark":"light")}else T.setAttribute("data-theme",z)};x(c),localStorage.setItem("avatarka-color-mode",c);const w=window.matchMedia("(prefers-color-scheme: dark)"),_=()=>{c==="system"&&x("system")};return w.addEventListener("change",_),()=>w.removeEventListener("change",_)},[c]),Me.useEffect(()=>{localStorage.setItem("avatarka-layout",l)},[l]),Me.useEffect(()=>{localStorage.setItem("avatarka-transparent-bg",String(s))},[s]);const M=Me.useCallback(()=>{if(!p)return null;if(!s)return $n(a,p);const x=Th.find(_=>typeof p[_]=="string"),w=x?Bh(p[x]):"#e0e0e0";return $n(a,{...p,backgroundColor:w})},[a,p,s]);return Me.useEffect(()=>{const x=M();if(!x)return;const w=`data:image/svg+xml,${encodeURIComponent(x)}`;let _=document.querySelector('link[rel="icon"]');_||(_=document.createElement("link"),_.rel="icon",document.head.appendChild(_)),_.type="image/svg+xml",_.href=w},[M]),O.jsxs("div",{className:"app",children:[O.jsx("header",{className:"header",children:O.jsxs("div",{className:"header-top",children:[O.jsxs("div",{className:"layout-switcher",children:[O.jsx("button",{className:`layout-btn ${l==="default"?"active":""}`,onClick:()=>o("default"),title:"Default Layout",children:O.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:O.jsx("path",{d:"M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z"})})}),O.jsx("button",{className:`layout-btn ${l==="compact"?"active":""}`,onClick:()=>o("compact"),title:"Compact Layout",children:O.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:O.jsx("path",{d:"M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"})})}),O.jsx("button",{className:`layout-btn ${s?"active":""}`,onClick:()=>u(x=>!x),title:"Transparent Background",children:O.jsxs("svg",{viewBox:"0 0 18 18",width:"18",height:"18",fill:"currentColor",children:[O.jsx("rect",{x:"1",y:"1",width:"4",height:"4"}),O.jsx("rect",{x:"9",y:"1",width:"4",height:"4"}),O.jsx("rect",{x:"5",y:"5",width:"4",height:"4"}),O.jsx("rect",{x:"13",y:"5",width:"4",height:"4"}),O.jsx("rect",{x:"1",y:"9",width:"4",height:"4"}),O.jsx("rect",{x:"9",y:"9",width:"4",height:"4"}),O.jsx("rect",{x:"5",y:"13",width:"4",height:"4"}),O.jsx("rect",{x:"13",y:"13",width:"4",height:"4"})]})})]}),O.jsx("div",{className:"header-title",children:O.jsx("h1",{children:"Avatarka"})}),O.jsxs("div",{className:"color-mode-switcher",children:[O.jsx("button",{className:`color-mode-btn ${c==="system"?"active":""}`,onClick:()=>r("system"),title:"System",children:O.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:O.jsx("path",{d:"M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z"})})}),O.jsx("button",{className:`color-mode-btn ${c==="light"?"active":""}`,onClick:()=>r("light"),title:"Light",children:O.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:O.jsx("path",{d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"})})}),O.jsx("button",{className:`color-mode-btn ${c==="dark"?"active":""}`,onClick:()=>r("dark"),title:"Dark",children:O.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:O.jsx("path",{d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"})})})]})]})}),O.jsx("main",{className:"main-card",children:O.jsx(Ih,{defaultTheme:F0,layout:l,alwaysTransparentBackground:s,onParamsChange:$,onSaveSvg:m,onSavePng:v})}),O.jsxs("footer",{className:"footer-links",children:[O.jsxs("a",{href:"https://github.com/AndreyAkinshin/avatarka",target:"_blank",rel:"noopener noreferrer",children:[O.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:O.jsx("path",{d:"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"})}),"GitHub"]}),O.jsxs("a",{href:"https://www.npmjs.com/package/avatarka",target:"_blank",rel:"noopener noreferrer",children:[O.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:O.jsx("path",{d:"M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"})}),"avatarka"]}),O.jsxs("a",{href:"https://www.npmjs.com/package/avatarka-react",target:"_blank",rel:"noopener noreferrer",children:[O.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:O.jsx("path",{d:"M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"})}),"avatarka-react"]})]})]})}jd.createRoot(document.getElementById("root")).render(O.jsx(Me.StrictMode,{children:O.jsx(jh,{})}));
