(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const f of i)if(f.type==="childList")for(const a of f.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function l(i){const f={};return i.integrity&&(f.integrity=i.integrity),i.referrerPolicy&&(f.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?f.credentials="include":i.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function o(i){if(i.ep)return;i.ep=!0;const f=l(i);fetch(i.href,f)}})();var Ts={exports:{}},sl={},js={exports:{}},ve={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yu;function Wd(){if(Yu)return ve;Yu=1;var c=Symbol.for("react.element"),r=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),i=Symbol.for("react.profiler"),f=Symbol.for("react.provider"),a=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),y=Symbol.for("react.memo"),$=Symbol.for("react.lazy"),g=Symbol.iterator;function w(F){return F===null||typeof F!="object"?null:(F=g&&F[g]||F["@@iterator"],typeof F=="function"?F:null)}var v={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,k={};function x(F,R,re){this.props=F,this.context=R,this.refs=k,this.updater=re||v}x.prototype.isReactComponent={},x.prototype.setState=function(F,R){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,R,"setState")},x.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function E(){}E.prototype=x.prototype;function b(F,R,re){this.props=F,this.context=R,this.refs=k,this.updater=re||v}var P=b.prototype=new E;P.constructor=b,M(P,x.prototype),P.isPureReactComponent=!0;var N=Array.isArray,B=Object.prototype.hasOwnProperty,J={current:null},V={key:!0,ref:!0,__self:!0,__source:!0};function j(F,R,re){var le,de={},he=null,Y=null;if(R!=null)for(le in R.ref!==void 0&&(Y=R.ref),R.key!==void 0&&(he=""+R.key),R)B.call(R,le)&&!V.hasOwnProperty(le)&&(de[le]=R[le]);var se=arguments.length-2;if(se===1)de.children=re;else if(1<se){for(var ae=Array(se),xe=0;xe<se;xe++)ae[xe]=arguments[xe+2];de.children=ae}if(F&&F.defaultProps)for(le in se=F.defaultProps,se)de[le]===void 0&&(de[le]=se[le]);return{$$typeof:c,type:F,key:he,ref:Y,props:de,_owner:J.current}}function _(F,R){return{$$typeof:c,type:F.type,key:R,ref:F.ref,props:F.props,_owner:F._owner}}function z(F){return typeof F=="object"&&F!==null&&F.$$typeof===c}function Z(F){var R={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(re){return R[re]})}var ne=/\/+/g;function ie(F,R){return typeof F=="object"&&F!==null&&F.key!=null?Z(""+F.key):R.toString(36)}function pe(F,R,re,le,de){var he=typeof F;(he==="undefined"||he==="boolean")&&(F=null);var Y=!1;if(F===null)Y=!0;else switch(he){case"string":case"number":Y=!0;break;case"object":switch(F.$$typeof){case c:case r:Y=!0}}if(Y)return Y=F,de=de(Y),F=le===""?"."+ie(Y,0):le,N(de)?(re="",F!=null&&(re=F.replace(ne,"$&/")+"/"),pe(de,R,re,"",function(xe){return xe})):de!=null&&(z(de)&&(de=_(de,re+(!de.key||Y&&Y.key===de.key?"":(""+de.key).replace(ne,"$&/")+"/")+F)),R.push(de)),1;if(Y=0,le=le===""?".":le+":",N(F))for(var se=0;se<F.length;se++){he=F[se];var ae=le+ie(he,se);Y+=pe(he,R,re,ae,de)}else if(ae=w(F),typeof ae=="function")for(F=ae.call(F),se=0;!(he=F.next()).done;)he=he.value,ae=le+ie(he,se++),Y+=pe(he,R,re,ae,de);else if(he==="object")throw R=String(F),Error("Objects are not valid as a React child (found: "+(R==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":R)+"). If you meant to render a collection of children, use an array instead.");return Y}function ge(F,R,re){if(F==null)return F;var le=[],de=0;return pe(F,le,"","",function(he){return R.call(re,he,de++)}),le}function we(F){if(F._status===-1){var R=F._result;R=R(),R.then(function(re){(F._status===0||F._status===-1)&&(F._status=1,F._result=re)},function(re){(F._status===0||F._status===-1)&&(F._status=2,F._result=re)}),F._status===-1&&(F._status=0,F._result=R)}if(F._status===1)return F._result.default;throw F._result}var me={current:null},q={transition:null},te={ReactCurrentDispatcher:me,ReactCurrentBatchConfig:q,ReactCurrentOwner:J};function K(){throw Error("act(...) is not supported in production builds of React.")}return ve.Children={map:ge,forEach:function(F,R,re){ge(F,function(){R.apply(this,arguments)},re)},count:function(F){var R=0;return ge(F,function(){R++}),R},toArray:function(F){return ge(F,function(R){return R})||[]},only:function(F){if(!z(F))throw Error("React.Children.only expected to receive a single React element child.");return F}},ve.Component=x,ve.Fragment=l,ve.Profiler=i,ve.PureComponent=b,ve.StrictMode=o,ve.Suspense=p,ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=te,ve.act=K,ve.cloneElement=function(F,R,re){if(F==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+F+".");var le=M({},F.props),de=F.key,he=F.ref,Y=F._owner;if(R!=null){if(R.ref!==void 0&&(he=R.ref,Y=J.current),R.key!==void 0&&(de=""+R.key),F.type&&F.type.defaultProps)var se=F.type.defaultProps;for(ae in R)B.call(R,ae)&&!V.hasOwnProperty(ae)&&(le[ae]=R[ae]===void 0&&se!==void 0?se[ae]:R[ae])}var ae=arguments.length-2;if(ae===1)le.children=re;else if(1<ae){se=Array(ae);for(var xe=0;xe<ae;xe++)se[xe]=arguments[xe+2];le.children=se}return{$$typeof:c,type:F.type,key:de,ref:he,props:le,_owner:Y}},ve.createContext=function(F){return F={$$typeof:a,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},F.Provider={$$typeof:f,_context:F},F.Consumer=F},ve.createElement=j,ve.createFactory=function(F){var R=j.bind(null,F);return R.type=F,R},ve.createRef=function(){return{current:null}},ve.forwardRef=function(F){return{$$typeof:u,render:F}},ve.isValidElement=z,ve.lazy=function(F){return{$$typeof:$,_payload:{_status:-1,_result:F},_init:we}},ve.memo=function(F,R){return{$$typeof:y,type:F,compare:R===void 0?null:R}},ve.startTransition=function(F){var R=q.transition;q.transition={};try{F()}finally{q.transition=R}},ve.unstable_act=K,ve.useCallback=function(F,R){return me.current.useCallback(F,R)},ve.useContext=function(F){return me.current.useContext(F)},ve.useDebugValue=function(){},ve.useDeferredValue=function(F){return me.current.useDeferredValue(F)},ve.useEffect=function(F,R){return me.current.useEffect(F,R)},ve.useId=function(){return me.current.useId()},ve.useImperativeHandle=function(F,R,re){return me.current.useImperativeHandle(F,R,re)},ve.useInsertionEffect=function(F,R){return me.current.useInsertionEffect(F,R)},ve.useLayoutEffect=function(F,R){return me.current.useLayoutEffect(F,R)},ve.useMemo=function(F,R){return me.current.useMemo(F,R)},ve.useReducer=function(F,R,re){return me.current.useReducer(F,R,re)},ve.useRef=function(F){return me.current.useRef(F)},ve.useState=function(F){return me.current.useState(F)},ve.useSyncExternalStore=function(F,R,re){return me.current.useSyncExternalStore(F,R,re)},ve.useTransition=function(){return me.current.useTransition()},ve.version="18.3.1",ve}var Gu;function Ks(){return Gu||(Gu=1,js.exports=Wd()),js.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xu;function qd(){if(Xu)return sl;Xu=1;var c=Ks(),r=Symbol.for("react.element"),l=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,i=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,f={key:!0,ref:!0,__self:!0,__source:!0};function a(u,p,y){var $,g={},w=null,v=null;y!==void 0&&(w=""+y),p.key!==void 0&&(w=""+p.key),p.ref!==void 0&&(v=p.ref);for($ in p)o.call(p,$)&&!f.hasOwnProperty($)&&(g[$]=p[$]);if(u&&u.defaultProps)for($ in p=u.defaultProps,p)g[$]===void 0&&(g[$]=p[$]);return{$$typeof:r,type:u,key:w,ref:v,props:g,_owner:i.current}}return sl.Fragment=l,sl.jsx=a,sl.jsxs=a,sl}var Ku;function Yd(){return Ku||(Ku=1,Ts.exports=qd()),Ts.exports}var U=Yd(),Ce=Ks(),Lo={},Rs={exports:{}},lt={},zs={exports:{}},Bs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ju;function Gd(){return Ju||(Ju=1,(function(c){function r(q,te){var K=q.length;q.push(te);e:for(;0<K;){var F=K-1>>>1,R=q[F];if(0<i(R,te))q[F]=te,q[K]=R,K=F;else break e}}function l(q){return q.length===0?null:q[0]}function o(q){if(q.length===0)return null;var te=q[0],K=q.pop();if(K!==te){q[0]=K;e:for(var F=0,R=q.length,re=R>>>1;F<re;){var le=2*(F+1)-1,de=q[le],he=le+1,Y=q[he];if(0>i(de,K))he<R&&0>i(Y,de)?(q[F]=Y,q[he]=K,F=he):(q[F]=de,q[le]=K,F=le);else if(he<R&&0>i(Y,K))q[F]=Y,q[he]=K,F=he;else break e}}return te}function i(q,te){var K=q.sortIndex-te.sortIndex;return K!==0?K:q.id-te.id}if(typeof performance=="object"&&typeof performance.now=="function"){var f=performance;c.unstable_now=function(){return f.now()}}else{var a=Date,u=a.now();c.unstable_now=function(){return a.now()-u}}var p=[],y=[],$=1,g=null,w=3,v=!1,M=!1,k=!1,x=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,b=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function P(q){for(var te=l(y);te!==null;){if(te.callback===null)o(y);else if(te.startTime<=q)o(y),te.sortIndex=te.expirationTime,r(p,te);else break;te=l(y)}}function N(q){if(k=!1,P(q),!M)if(l(p)!==null)M=!0,we(B);else{var te=l(y);te!==null&&me(N,te.startTime-q)}}function B(q,te){M=!1,k&&(k=!1,E(j),j=-1),v=!0;var K=w;try{for(P(te),g=l(p);g!==null&&(!(g.expirationTime>te)||q&&!Z());){var F=g.callback;if(typeof F=="function"){g.callback=null,w=g.priorityLevel;var R=F(g.expirationTime<=te);te=c.unstable_now(),typeof R=="function"?g.callback=R:g===l(p)&&o(p),P(te)}else o(p);g=l(p)}if(g!==null)var re=!0;else{var le=l(y);le!==null&&me(N,le.startTime-te),re=!1}return re}finally{g=null,w=K,v=!1}}var J=!1,V=null,j=-1,_=5,z=-1;function Z(){return!(c.unstable_now()-z<_)}function ne(){if(V!==null){var q=c.unstable_now();z=q;var te=!0;try{te=V(!0,q)}finally{te?ie():(J=!1,V=null)}}else J=!1}var ie;if(typeof b=="function")ie=function(){b(ne)};else if(typeof MessageChannel<"u"){var pe=new MessageChannel,ge=pe.port2;pe.port1.onmessage=ne,ie=function(){ge.postMessage(null)}}else ie=function(){x(ne,0)};function we(q){V=q,J||(J=!0,ie())}function me(q,te){j=x(function(){q(c.unstable_now())},te)}c.unstable_IdlePriority=5,c.unstable_ImmediatePriority=1,c.unstable_LowPriority=4,c.unstable_NormalPriority=3,c.unstable_Profiling=null,c.unstable_UserBlockingPriority=2,c.unstable_cancelCallback=function(q){q.callback=null},c.unstable_continueExecution=function(){M||v||(M=!0,we(B))},c.unstable_forceFrameRate=function(q){0>q||125<q?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_=0<q?Math.floor(1e3/q):5},c.unstable_getCurrentPriorityLevel=function(){return w},c.unstable_getFirstCallbackNode=function(){return l(p)},c.unstable_next=function(q){switch(w){case 1:case 2:case 3:var te=3;break;default:te=w}var K=w;w=te;try{return q()}finally{w=K}},c.unstable_pauseExecution=function(){},c.unstable_requestPaint=function(){},c.unstable_runWithPriority=function(q,te){switch(q){case 1:case 2:case 3:case 4:case 5:break;default:q=3}var K=w;w=q;try{return te()}finally{w=K}},c.unstable_scheduleCallback=function(q,te,K){var F=c.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?F+K:F):K=F,q){case 1:var R=-1;break;case 2:R=250;break;case 5:R=1073741823;break;case 4:R=1e4;break;default:R=5e3}return R=K+R,q={id:$++,callback:te,priorityLevel:q,startTime:K,expirationTime:R,sortIndex:-1},K>F?(q.sortIndex=K,r(y,q),l(p)===null&&q===l(y)&&(k?(E(j),j=-1):k=!0,me(N,K-F))):(q.sortIndex=R,r(p,q),M||v||(M=!0,we(B))),q},c.unstable_shouldYield=Z,c.unstable_wrapCallback=function(q){var te=w;return function(){var K=w;w=te;try{return q.apply(this,arguments)}finally{w=K}}}})(Bs)),Bs}var ef;function Xd(){return ef||(ef=1,zs.exports=Gd()),zs.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tf;function Kd(){if(tf)return lt;tf=1;var c=Ks(),r=Xd();function l(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var o=new Set,i={};function f(e,t){a(e,t),a(e+"Capture",t)}function a(e,t){for(i[e]=t,e=0;e<t.length;e++)o.add(t[e])}var u=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,y=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,$={},g={};function w(e){return p.call(g,e)?!0:p.call($,e)?!1:y.test(e)?g[e]=!0:($[e]=!0,!1)}function v(e,t,n,s){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return s?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function M(e,t,n,s){if(t===null||typeof t>"u"||v(e,t,n,s))return!0;if(s)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function k(e,t,n,s,d,h,m){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=s,this.attributeNamespace=d,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=h,this.removeEmptyString=m}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){x[e]=new k(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];x[t]=new k(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){x[e]=new k(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){x[e]=new k(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){x[e]=new k(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){x[e]=new k(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){x[e]=new k(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){x[e]=new k(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){x[e]=new k(e,5,!1,e.toLowerCase(),null,!1,!1)});var E=/[\-:]([a-z])/g;function b(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(E,b);x[t]=new k(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(E,b);x[t]=new k(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(E,b);x[t]=new k(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){x[e]=new k(e,1,!1,e.toLowerCase(),null,!1,!1)}),x.xlinkHref=new k("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){x[e]=new k(e,1,!1,e.toLowerCase(),null,!0,!0)});function P(e,t,n,s){var d=x.hasOwnProperty(t)?x[t]:null;(d!==null?d.type!==0:s||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(M(t,n,d,s)&&(n=null),s||d===null?w(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):d.mustUseProperty?e[d.propertyName]=n===null?d.type===3?!1:"":n:(t=d.attributeName,s=d.attributeNamespace,n===null?e.removeAttribute(t):(d=d.type,n=d===3||d===4&&n===!0?"":""+n,s?e.setAttributeNS(s,t,n):e.setAttribute(t,n))))}var N=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,B=Symbol.for("react.element"),J=Symbol.for("react.portal"),V=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),z=Symbol.for("react.provider"),Z=Symbol.for("react.context"),ne=Symbol.for("react.forward_ref"),ie=Symbol.for("react.suspense"),pe=Symbol.for("react.suspense_list"),ge=Symbol.for("react.memo"),we=Symbol.for("react.lazy"),me=Symbol.for("react.offscreen"),q=Symbol.iterator;function te(e){return e===null||typeof e!="object"?null:(e=q&&e[q]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,F;function R(e){if(F===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);F=t&&t[1]||""}return`
`+F+e}var re=!1;function le(e,t){if(!e||re)return"";re=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(T){var s=T}Reflect.construct(e,[],t)}else{try{t.call()}catch(T){s=T}e.call(t.prototype)}else{try{throw Error()}catch(T){s=T}e()}}catch(T){if(T&&s&&typeof T.stack=="string"){for(var d=T.stack.split(`
`),h=s.stack.split(`
`),m=d.length-1,C=h.length-1;1<=m&&0<=C&&d[m]!==h[C];)C--;for(;1<=m&&0<=C;m--,C--)if(d[m]!==h[C]){if(m!==1||C!==1)do if(m--,C--,0>C||d[m]!==h[C]){var Q=`
`+d[m].replace(" at new "," at ");return e.displayName&&Q.includes("<anonymous>")&&(Q=Q.replace("<anonymous>",e.displayName)),Q}while(1<=m&&0<=C);break}}}finally{re=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?R(e):""}function de(e){switch(e.tag){case 5:return R(e.type);case 16:return R("Lazy");case 13:return R("Suspense");case 19:return R("SuspenseList");case 0:case 2:case 15:return e=le(e.type,!1),e;case 11:return e=le(e.type.render,!1),e;case 1:return e=le(e.type,!0),e;default:return""}}function he(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case V:return"Fragment";case J:return"Portal";case _:return"Profiler";case j:return"StrictMode";case ie:return"Suspense";case pe:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Z:return(e.displayName||"Context")+".Consumer";case z:return(e._context.displayName||"Context")+".Provider";case ne:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ge:return t=e.displayName||null,t!==null?t:he(e.type)||"Memo";case we:t=e._payload,e=e._init;try{return he(e(t))}catch{}}return null}function Y(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return he(t);case 8:return t===j?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function se(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ae(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function xe(e){var t=ae(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),s=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var d=n.get,h=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return d.call(this)},set:function(m){s=""+m,h.call(this,m)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return s},setValue:function(m){s=""+m},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ie(e){e._valueTracker||(e._valueTracker=xe(e))}function Ke(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),s="";return e&&(s=ae(e)?e.checked?"true":"false":e.value),e=s,e!==n?(t.setValue(e),!0):!1}function xl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Uo(e,t){var n=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function rc(e,t){var n=t.defaultValue==null?"":t.defaultValue,s=t.checked!=null?t.checked:t.defaultChecked;n=se(t.value!=null?t.value:n),e._wrapperState={initialChecked:s,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function nc(e,t){t=t.checked,t!=null&&P(e,"checked",t,!1)}function Vo(e,t){nc(e,t);var n=se(t.value),s=t.type;if(n!=null)s==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(s==="submit"||s==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ho(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ho(e,t.type,se(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function lc(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var s=t.type;if(!(s!=="submit"&&s!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ho(e,t,n){(t!=="number"||xl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var vn=Array.isArray;function Hr(e,t,n,s){if(e=e.options,t){t={};for(var d=0;d<n.length;d++)t["$"+n[d]]=!0;for(n=0;n<e.length;n++)d=t.hasOwnProperty("$"+e[n].value),e[n].selected!==d&&(e[n].selected=d),d&&s&&(e[n].defaultSelected=!0)}else{for(n=""+se(n),t=null,d=0;d<e.length;d++){if(e[d].value===n){e[d].selected=!0,s&&(e[d].defaultSelected=!0);return}t!==null||e[d].disabled||(t=e[d])}t!==null&&(t.selected=!0)}}function Zo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(l(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function oc(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(l(92));if(vn(n)){if(1<n.length)throw Error(l(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:se(n)}}function ic(e,t){var n=se(t.value),s=se(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),s!=null&&(e.defaultValue=""+s)}function sc(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function cc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Wo(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?cc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var gl,ac=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,s,d){MSApp.execUnsafeLocalFunction(function(){return e(t,n,s,d)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(gl=gl||document.createElement("div"),gl.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=gl.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Mn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Cn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Xf=["Webkit","ms","Moz","O"];Object.keys(Cn).forEach(function(e){Xf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Cn[t]=Cn[e]})});function uc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Cn.hasOwnProperty(e)&&Cn[e]?(""+t).trim():t+"px"}function fc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var s=n.indexOf("--")===0,d=uc(n,t[n],s);n==="float"&&(n="cssFloat"),s?e.setProperty(n,d):e[n]=d}}var Kf=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qo(e,t){if(t){if(Kf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(l(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(l(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(l(61))}if(t.style!=null&&typeof t.style!="object")throw Error(l(62))}}function Yo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Go=null;function Xo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ko=null,Zr=null,Wr=null;function dc(e){if(e=Zn(e)){if(typeof Ko!="function")throw Error(l(280));var t=e.stateNode;t&&(t=Ul(t),Ko(e.stateNode,e.type,t))}}function pc(e){Zr?Wr?Wr.push(e):Wr=[e]:Zr=e}function hc(){if(Zr){var e=Zr,t=Wr;if(Wr=Zr=null,dc(e),t)for(e=0;e<t.length;e++)dc(t[e])}}function yc(e,t){return e(t)}function $c(){}var Jo=!1;function kc(e,t,n){if(Jo)return e(t,n);Jo=!0;try{return yc(e,t,n)}finally{Jo=!1,(Zr!==null||Wr!==null)&&($c(),hc())}}function Sn(e,t){var n=e.stateNode;if(n===null)return null;var s=Ul(n);if(s===null)return null;n=s[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(e=e.type,s=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!s;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(l(231,t,typeof n));return n}var ei=!1;if(u)try{var En={};Object.defineProperty(En,"passive",{get:function(){ei=!0}}),window.addEventListener("test",En,En),window.removeEventListener("test",En,En)}catch{ei=!1}function Jf(e,t,n,s,d,h,m,C,Q){var T=Array.prototype.slice.call(arguments,3);try{t.apply(n,T)}catch(W){this.onError(W)}}var Qn=!1,wl=null,vl=!1,ti=null,e0={onError:function(e){Qn=!0,wl=e}};function t0(e,t,n,s,d,h,m,C,Q){Qn=!1,wl=null,Jf.apply(e0,arguments)}function r0(e,t,n,s,d,h,m,C,Q){if(t0.apply(this,arguments),Qn){if(Qn){var T=wl;Qn=!1,wl=null}else throw Error(l(198));vl||(vl=!0,ti=T)}}function Fr(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function mc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function xc(e){if(Fr(e)!==e)throw Error(l(188))}function n0(e){var t=e.alternate;if(!t){if(t=Fr(e),t===null)throw Error(l(188));return t!==e?null:e}for(var n=e,s=t;;){var d=n.return;if(d===null)break;var h=d.alternate;if(h===null){if(s=d.return,s!==null){n=s;continue}break}if(d.child===h.child){for(h=d.child;h;){if(h===n)return xc(d),e;if(h===s)return xc(d),t;h=h.sibling}throw Error(l(188))}if(n.return!==s.return)n=d,s=h;else{for(var m=!1,C=d.child;C;){if(C===n){m=!0,n=d,s=h;break}if(C===s){m=!0,s=d,n=h;break}C=C.sibling}if(!m){for(C=h.child;C;){if(C===n){m=!0,n=h,s=d;break}if(C===s){m=!0,s=h,n=d;break}C=C.sibling}if(!m)throw Error(l(189))}}if(n.alternate!==s)throw Error(l(190))}if(n.tag!==3)throw Error(l(188));return n.stateNode.current===n?e:t}function gc(e){return e=n0(e),e!==null?wc(e):null}function wc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=wc(e);if(t!==null)return t;e=e.sibling}return null}var vc=r.unstable_scheduleCallback,Mc=r.unstable_cancelCallback,l0=r.unstable_shouldYield,o0=r.unstable_requestPaint,be=r.unstable_now,i0=r.unstable_getCurrentPriorityLevel,ri=r.unstable_ImmediatePriority,Cc=r.unstable_UserBlockingPriority,Ml=r.unstable_NormalPriority,s0=r.unstable_LowPriority,Sc=r.unstable_IdlePriority,Cl=null,Qt=null;function c0(e){if(Qt&&typeof Qt.onCommitFiberRoot=="function")try{Qt.onCommitFiberRoot(Cl,e,void 0,(e.current.flags&128)===128)}catch{}}var mt=Math.clz32?Math.clz32:f0,a0=Math.log,u0=Math.LN2;function f0(e){return e>>>=0,e===0?32:31-(a0(e)/u0|0)|0}var Sl=64,El=4194304;function Fn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ql(e,t){var n=e.pendingLanes;if(n===0)return 0;var s=0,d=e.suspendedLanes,h=e.pingedLanes,m=n&268435455;if(m!==0){var C=m&~d;C!==0?s=Fn(C):(h&=m,h!==0&&(s=Fn(h)))}else m=n&~d,m!==0?s=Fn(m):h!==0&&(s=Fn(h));if(s===0)return 0;if(t!==0&&t!==s&&(t&d)===0&&(d=s&-s,h=t&-t,d>=h||d===16&&(h&4194240)!==0))return t;if((s&4)!==0&&(s|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=s;0<t;)n=31-mt(t),d=1<<n,s|=e[n],t&=~d;return s}function d0(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function p0(e,t){for(var n=e.suspendedLanes,s=e.pingedLanes,d=e.expirationTimes,h=e.pendingLanes;0<h;){var m=31-mt(h),C=1<<m,Q=d[m];Q===-1?((C&n)===0||(C&s)!==0)&&(d[m]=d0(C,t)):Q<=t&&(e.expiredLanes|=C),h&=~C}}function ni(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ec(){var e=Sl;return Sl<<=1,(Sl&4194240)===0&&(Sl=64),e}function li(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ln(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-mt(t),e[t]=n}function h0(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var s=e.eventTimes;for(e=e.expirationTimes;0<n;){var d=31-mt(n),h=1<<d;t[d]=0,s[d]=-1,e[d]=-1,n&=~h}}function oi(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var s=31-mt(n),d=1<<s;d&t|e[s]&t&&(e[s]|=t),n&=~d}}var Ee=0;function Qc(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Fc,ii,Lc,_c,Pc,si=!1,Fl=[],cr=null,ar=null,ur=null,_n=new Map,Pn=new Map,fr=[],y0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ac(e,t){switch(e){case"focusin":case"focusout":cr=null;break;case"dragenter":case"dragleave":ar=null;break;case"mouseover":case"mouseout":ur=null;break;case"pointerover":case"pointerout":_n.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Pn.delete(t.pointerId)}}function An(e,t,n,s,d,h){return e===null||e.nativeEvent!==h?(e={blockedOn:t,domEventName:n,eventSystemFlags:s,nativeEvent:h,targetContainers:[d]},t!==null&&(t=Zn(t),t!==null&&ii(t)),e):(e.eventSystemFlags|=s,t=e.targetContainers,d!==null&&t.indexOf(d)===-1&&t.push(d),e)}function $0(e,t,n,s,d){switch(t){case"focusin":return cr=An(cr,e,t,n,s,d),!0;case"dragenter":return ar=An(ar,e,t,n,s,d),!0;case"mouseover":return ur=An(ur,e,t,n,s,d),!0;case"pointerover":var h=d.pointerId;return _n.set(h,An(_n.get(h)||null,e,t,n,s,d)),!0;case"gotpointercapture":return h=d.pointerId,Pn.set(h,An(Pn.get(h)||null,e,t,n,s,d)),!0}return!1}function Nc(e){var t=Lr(e.target);if(t!==null){var n=Fr(t);if(n!==null){if(t=n.tag,t===13){if(t=mc(n),t!==null){e.blockedOn=t,Pc(e.priority,function(){Lc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ll(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ai(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var s=new n.constructor(n.type,n);Go=s,n.target.dispatchEvent(s),Go=null}else return t=Zn(n),t!==null&&ii(t),e.blockedOn=n,!1;t.shift()}return!0}function Ic(e,t,n){Ll(e)&&n.delete(t)}function k0(){si=!1,cr!==null&&Ll(cr)&&(cr=null),ar!==null&&Ll(ar)&&(ar=null),ur!==null&&Ll(ur)&&(ur=null),_n.forEach(Ic),Pn.forEach(Ic)}function Nn(e,t){e.blockedOn===t&&(e.blockedOn=null,si||(si=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,k0)))}function In(e){function t(d){return Nn(d,e)}if(0<Fl.length){Nn(Fl[0],e);for(var n=1;n<Fl.length;n++){var s=Fl[n];s.blockedOn===e&&(s.blockedOn=null)}}for(cr!==null&&Nn(cr,e),ar!==null&&Nn(ar,e),ur!==null&&Nn(ur,e),_n.forEach(t),Pn.forEach(t),n=0;n<fr.length;n++)s=fr[n],s.blockedOn===e&&(s.blockedOn=null);for(;0<fr.length&&(n=fr[0],n.blockedOn===null);)Nc(n),n.blockedOn===null&&fr.shift()}var qr=N.ReactCurrentBatchConfig,_l=!0;function m0(e,t,n,s){var d=Ee,h=qr.transition;qr.transition=null;try{Ee=1,ci(e,t,n,s)}finally{Ee=d,qr.transition=h}}function x0(e,t,n,s){var d=Ee,h=qr.transition;qr.transition=null;try{Ee=4,ci(e,t,n,s)}finally{Ee=d,qr.transition=h}}function ci(e,t,n,s){if(_l){var d=ai(e,t,n,s);if(d===null)Ei(e,t,s,Pl,n),Ac(e,s);else if($0(d,e,t,n,s))s.stopPropagation();else if(Ac(e,s),t&4&&-1<y0.indexOf(e)){for(;d!==null;){var h=Zn(d);if(h!==null&&Fc(h),h=ai(e,t,n,s),h===null&&Ei(e,t,s,Pl,n),h===d)break;d=h}d!==null&&s.stopPropagation()}else Ei(e,t,s,null,n)}}var Pl=null;function ai(e,t,n,s){if(Pl=null,e=Xo(s),e=Lr(e),e!==null)if(t=Fr(e),t===null)e=null;else if(n=t.tag,n===13){if(e=mc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Pl=e,null}function bc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(i0()){case ri:return 1;case Cc:return 4;case Ml:case s0:return 16;case Sc:return 536870912;default:return 16}default:return 16}}var dr=null,ui=null,Al=null;function Tc(){if(Al)return Al;var e,t=ui,n=t.length,s,d="value"in dr?dr.value:dr.textContent,h=d.length;for(e=0;e<n&&t[e]===d[e];e++);var m=n-e;for(s=1;s<=m&&t[n-s]===d[h-s];s++);return Al=d.slice(e,1<s?1-s:void 0)}function Nl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Il(){return!0}function jc(){return!1}function st(e){function t(n,s,d,h,m){this._reactName=n,this._targetInst=d,this.type=s,this.nativeEvent=h,this.target=m,this.currentTarget=null;for(var C in e)e.hasOwnProperty(C)&&(n=e[C],this[C]=n?n(h):h[C]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?Il:jc,this.isPropagationStopped=jc,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Il)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Il)},persist:function(){},isPersistent:Il}),t}var Yr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},fi=st(Yr),bn=K({},Yr,{view:0,detail:0}),g0=st(bn),di,pi,Tn,bl=K({},bn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:yi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Tn&&(Tn&&e.type==="mousemove"?(di=e.screenX-Tn.screenX,pi=e.screenY-Tn.screenY):pi=di=0,Tn=e),di)},movementY:function(e){return"movementY"in e?e.movementY:pi}}),Rc=st(bl),w0=K({},bl,{dataTransfer:0}),v0=st(w0),M0=K({},bn,{relatedTarget:0}),hi=st(M0),C0=K({},Yr,{animationName:0,elapsedTime:0,pseudoElement:0}),S0=st(C0),E0=K({},Yr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Q0=st(E0),F0=K({},Yr,{data:0}),zc=st(F0),L0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},_0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},P0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function A0(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=P0[e])?!!t[e]:!1}function yi(){return A0}var N0=K({},bn,{key:function(e){if(e.key){var t=L0[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Nl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?_0[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:yi,charCode:function(e){return e.type==="keypress"?Nl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Nl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),I0=st(N0),b0=K({},bl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Bc=st(b0),T0=K({},bn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:yi}),j0=st(T0),R0=K({},Yr,{propertyName:0,elapsedTime:0,pseudoElement:0}),z0=st(R0),B0=K({},bl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),D0=st(B0),O0=[9,13,27,32],$i=u&&"CompositionEvent"in window,jn=null;u&&"documentMode"in document&&(jn=document.documentMode);var U0=u&&"TextEvent"in window&&!jn,Dc=u&&(!$i||jn&&8<jn&&11>=jn),Oc=" ",Uc=!1;function Vc(e,t){switch(e){case"keyup":return O0.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Gr=!1;function V0(e,t){switch(e){case"compositionend":return Hc(t);case"keypress":return t.which!==32?null:(Uc=!0,Oc);case"textInput":return e=t.data,e===Oc&&Uc?null:e;default:return null}}function H0(e,t){if(Gr)return e==="compositionend"||!$i&&Vc(e,t)?(e=Tc(),Al=ui=dr=null,Gr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Dc&&t.locale!=="ko"?null:t.data;default:return null}}var Z0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Z0[e.type]:t==="textarea"}function Wc(e,t,n,s){pc(s),t=Bl(t,"onChange"),0<t.length&&(n=new fi("onChange","change",null,n,s),e.push({event:n,listeners:t}))}var Rn=null,zn=null;function W0(e){fa(e,0)}function Tl(e){var t=tn(e);if(Ke(t))return e}function q0(e,t){if(e==="change")return t}var qc=!1;if(u){var ki;if(u){var mi="oninput"in document;if(!mi){var Yc=document.createElement("div");Yc.setAttribute("oninput","return;"),mi=typeof Yc.oninput=="function"}ki=mi}else ki=!1;qc=ki&&(!document.documentMode||9<document.documentMode)}function Gc(){Rn&&(Rn.detachEvent("onpropertychange",Xc),zn=Rn=null)}function Xc(e){if(e.propertyName==="value"&&Tl(zn)){var t=[];Wc(t,zn,e,Xo(e)),kc(W0,t)}}function Y0(e,t,n){e==="focusin"?(Gc(),Rn=t,zn=n,Rn.attachEvent("onpropertychange",Xc)):e==="focusout"&&Gc()}function G0(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Tl(zn)}function X0(e,t){if(e==="click")return Tl(t)}function K0(e,t){if(e==="input"||e==="change")return Tl(t)}function J0(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var xt=typeof Object.is=="function"?Object.is:J0;function Bn(e,t){if(xt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),s=Object.keys(t);if(n.length!==s.length)return!1;for(s=0;s<n.length;s++){var d=n[s];if(!p.call(t,d)||!xt(e[d],t[d]))return!1}return!0}function Kc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Jc(e,t){var n=Kc(e);e=0;for(var s;n;){if(n.nodeType===3){if(s=e+n.textContent.length,e<=t&&s>=t)return{node:n,offset:t-e};e=s}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Kc(n)}}function ea(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ea(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ta(){for(var e=window,t=xl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=xl(e.document)}return t}function xi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function ed(e){var t=ta(),n=e.focusedElem,s=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ea(n.ownerDocument.documentElement,n)){if(s!==null&&xi(n)){if(t=s.start,e=s.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var d=n.textContent.length,h=Math.min(s.start,d);s=s.end===void 0?h:Math.min(s.end,d),!e.extend&&h>s&&(d=s,s=h,h=d),d=Jc(n,h);var m=Jc(n,s);d&&m&&(e.rangeCount!==1||e.anchorNode!==d.node||e.anchorOffset!==d.offset||e.focusNode!==m.node||e.focusOffset!==m.offset)&&(t=t.createRange(),t.setStart(d.node,d.offset),e.removeAllRanges(),h>s?(e.addRange(t),e.extend(m.node,m.offset)):(t.setEnd(m.node,m.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var td=u&&"documentMode"in document&&11>=document.documentMode,Xr=null,gi=null,Dn=null,wi=!1;function ra(e,t,n){var s=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wi||Xr==null||Xr!==xl(s)||(s=Xr,"selectionStart"in s&&xi(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Dn&&Bn(Dn,s)||(Dn=s,s=Bl(gi,"onSelect"),0<s.length&&(t=new fi("onSelect","select",null,t,n),e.push({event:t,listeners:s}),t.target=Xr)))}function jl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Kr={animationend:jl("Animation","AnimationEnd"),animationiteration:jl("Animation","AnimationIteration"),animationstart:jl("Animation","AnimationStart"),transitionend:jl("Transition","TransitionEnd")},vi={},na={};u&&(na=document.createElement("div").style,"AnimationEvent"in window||(delete Kr.animationend.animation,delete Kr.animationiteration.animation,delete Kr.animationstart.animation),"TransitionEvent"in window||delete Kr.transitionend.transition);function Rl(e){if(vi[e])return vi[e];if(!Kr[e])return e;var t=Kr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in na)return vi[e]=t[n];return e}var la=Rl("animationend"),oa=Rl("animationiteration"),ia=Rl("animationstart"),sa=Rl("transitionend"),ca=new Map,aa="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pr(e,t){ca.set(e,t),f(t,[e])}for(var Mi=0;Mi<aa.length;Mi++){var Ci=aa[Mi],rd=Ci.toLowerCase(),nd=Ci[0].toUpperCase()+Ci.slice(1);pr(rd,"on"+nd)}pr(la,"onAnimationEnd"),pr(oa,"onAnimationIteration"),pr(ia,"onAnimationStart"),pr("dblclick","onDoubleClick"),pr("focusin","onFocus"),pr("focusout","onBlur"),pr(sa,"onTransitionEnd"),a("onMouseEnter",["mouseout","mouseover"]),a("onMouseLeave",["mouseout","mouseover"]),a("onPointerEnter",["pointerout","pointerover"]),a("onPointerLeave",["pointerout","pointerover"]),f("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),f("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),f("onBeforeInput",["compositionend","keypress","textInput","paste"]),f("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),f("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),f("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var On="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ld=new Set("cancel close invalid load scroll toggle".split(" ").concat(On));function ua(e,t,n){var s=e.type||"unknown-event";e.currentTarget=n,r0(s,t,void 0,e),e.currentTarget=null}function fa(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var s=e[n],d=s.event;s=s.listeners;e:{var h=void 0;if(t)for(var m=s.length-1;0<=m;m--){var C=s[m],Q=C.instance,T=C.currentTarget;if(C=C.listener,Q!==h&&d.isPropagationStopped())break e;ua(d,C,T),h=Q}else for(m=0;m<s.length;m++){if(C=s[m],Q=C.instance,T=C.currentTarget,C=C.listener,Q!==h&&d.isPropagationStopped())break e;ua(d,C,T),h=Q}}}if(vl)throw e=ti,vl=!1,ti=null,e}function Fe(e,t){var n=t[Ai];n===void 0&&(n=t[Ai]=new Set);var s=e+"__bubble";n.has(s)||(da(t,e,2,!1),n.add(s))}function Si(e,t,n){var s=0;t&&(s|=4),da(n,e,s,t)}var zl="_reactListening"+Math.random().toString(36).slice(2);function Un(e){if(!e[zl]){e[zl]=!0,o.forEach(function(n){n!=="selectionchange"&&(ld.has(n)||Si(n,!1,e),Si(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[zl]||(t[zl]=!0,Si("selectionchange",!1,t))}}function da(e,t,n,s){switch(bc(t)){case 1:var d=m0;break;case 4:d=x0;break;default:d=ci}n=d.bind(null,t,n,e),d=void 0,!ei||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(d=!0),s?d!==void 0?e.addEventListener(t,n,{capture:!0,passive:d}):e.addEventListener(t,n,!0):d!==void 0?e.addEventListener(t,n,{passive:d}):e.addEventListener(t,n,!1)}function Ei(e,t,n,s,d){var h=s;if((t&1)===0&&(t&2)===0&&s!==null)e:for(;;){if(s===null)return;var m=s.tag;if(m===3||m===4){var C=s.stateNode.containerInfo;if(C===d||C.nodeType===8&&C.parentNode===d)break;if(m===4)for(m=s.return;m!==null;){var Q=m.tag;if((Q===3||Q===4)&&(Q=m.stateNode.containerInfo,Q===d||Q.nodeType===8&&Q.parentNode===d))return;m=m.return}for(;C!==null;){if(m=Lr(C),m===null)return;if(Q=m.tag,Q===5||Q===6){s=h=m;continue e}C=C.parentNode}}s=s.return}kc(function(){var T=h,W=Xo(n),G=[];e:{var H=ca.get(e);if(H!==void 0){var ee=fi,ce=e;switch(e){case"keypress":if(Nl(n)===0)break e;case"keydown":case"keyup":ee=I0;break;case"focusin":ce="focus",ee=hi;break;case"focusout":ce="blur",ee=hi;break;case"beforeblur":case"afterblur":ee=hi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ee=Rc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ee=v0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ee=j0;break;case la:case oa:case ia:ee=S0;break;case sa:ee=z0;break;case"scroll":ee=g0;break;case"wheel":ee=D0;break;case"copy":case"cut":case"paste":ee=Q0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ee=Bc}var ue=(t&4)!==0,Te=!ue&&e==="scroll",A=ue?H!==null?H+"Capture":null:H;ue=[];for(var L=T,I;L!==null;){I=L;var X=I.stateNode;if(I.tag===5&&X!==null&&(I=X,A!==null&&(X=Sn(L,A),X!=null&&ue.push(Vn(L,X,I)))),Te)break;L=L.return}0<ue.length&&(H=new ee(H,ce,null,n,W),G.push({event:H,listeners:ue}))}}if((t&7)===0){e:{if(H=e==="mouseover"||e==="pointerover",ee=e==="mouseout"||e==="pointerout",H&&n!==Go&&(ce=n.relatedTarget||n.fromElement)&&(Lr(ce)||ce[Jt]))break e;if((ee||H)&&(H=W.window===W?W:(H=W.ownerDocument)?H.defaultView||H.parentWindow:window,ee?(ce=n.relatedTarget||n.toElement,ee=T,ce=ce?Lr(ce):null,ce!==null&&(Te=Fr(ce),ce!==Te||ce.tag!==5&&ce.tag!==6)&&(ce=null)):(ee=null,ce=T),ee!==ce)){if(ue=Rc,X="onMouseLeave",A="onMouseEnter",L="mouse",(e==="pointerout"||e==="pointerover")&&(ue=Bc,X="onPointerLeave",A="onPointerEnter",L="pointer"),Te=ee==null?H:tn(ee),I=ce==null?H:tn(ce),H=new ue(X,L+"leave",ee,n,W),H.target=Te,H.relatedTarget=I,X=null,Lr(W)===T&&(ue=new ue(A,L+"enter",ce,n,W),ue.target=I,ue.relatedTarget=Te,X=ue),Te=X,ee&&ce)t:{for(ue=ee,A=ce,L=0,I=ue;I;I=Jr(I))L++;for(I=0,X=A;X;X=Jr(X))I++;for(;0<L-I;)ue=Jr(ue),L--;for(;0<I-L;)A=Jr(A),I--;for(;L--;){if(ue===A||A!==null&&ue===A.alternate)break t;ue=Jr(ue),A=Jr(A)}ue=null}else ue=null;ee!==null&&pa(G,H,ee,ue,!1),ce!==null&&Te!==null&&pa(G,Te,ce,ue,!0)}}e:{if(H=T?tn(T):window,ee=H.nodeName&&H.nodeName.toLowerCase(),ee==="select"||ee==="input"&&H.type==="file")var fe=q0;else if(Zc(H))if(qc)fe=K0;else{fe=G0;var ye=Y0}else(ee=H.nodeName)&&ee.toLowerCase()==="input"&&(H.type==="checkbox"||H.type==="radio")&&(fe=X0);if(fe&&(fe=fe(e,T))){Wc(G,fe,n,W);break e}ye&&ye(e,H,T),e==="focusout"&&(ye=H._wrapperState)&&ye.controlled&&H.type==="number"&&Ho(H,"number",H.value)}switch(ye=T?tn(T):window,e){case"focusin":(Zc(ye)||ye.contentEditable==="true")&&(Xr=ye,gi=T,Dn=null);break;case"focusout":Dn=gi=Xr=null;break;case"mousedown":wi=!0;break;case"contextmenu":case"mouseup":case"dragend":wi=!1,ra(G,n,W);break;case"selectionchange":if(td)break;case"keydown":case"keyup":ra(G,n,W)}var $e;if($i)e:{switch(e){case"compositionstart":var ke="onCompositionStart";break e;case"compositionend":ke="onCompositionEnd";break e;case"compositionupdate":ke="onCompositionUpdate";break e}ke=void 0}else Gr?Vc(e,n)&&(ke="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(ke="onCompositionStart");ke&&(Dc&&n.locale!=="ko"&&(Gr||ke!=="onCompositionStart"?ke==="onCompositionEnd"&&Gr&&($e=Tc()):(dr=W,ui="value"in dr?dr.value:dr.textContent,Gr=!0)),ye=Bl(T,ke),0<ye.length&&(ke=new zc(ke,e,null,n,W),G.push({event:ke,listeners:ye}),$e?ke.data=$e:($e=Hc(n),$e!==null&&(ke.data=$e)))),($e=U0?V0(e,n):H0(e,n))&&(T=Bl(T,"onBeforeInput"),0<T.length&&(W=new zc("onBeforeInput","beforeinput",null,n,W),G.push({event:W,listeners:T}),W.data=$e))}fa(G,t)})}function Vn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Bl(e,t){for(var n=t+"Capture",s=[];e!==null;){var d=e,h=d.stateNode;d.tag===5&&h!==null&&(d=h,h=Sn(e,n),h!=null&&s.unshift(Vn(e,h,d)),h=Sn(e,t),h!=null&&s.push(Vn(e,h,d))),e=e.return}return s}function Jr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function pa(e,t,n,s,d){for(var h=t._reactName,m=[];n!==null&&n!==s;){var C=n,Q=C.alternate,T=C.stateNode;if(Q!==null&&Q===s)break;C.tag===5&&T!==null&&(C=T,d?(Q=Sn(n,h),Q!=null&&m.unshift(Vn(n,Q,C))):d||(Q=Sn(n,h),Q!=null&&m.push(Vn(n,Q,C)))),n=n.return}m.length!==0&&e.push({event:t,listeners:m})}var od=/\r\n?/g,id=/\u0000|\uFFFD/g;function ha(e){return(typeof e=="string"?e:""+e).replace(od,`
`).replace(id,"")}function Dl(e,t,n){if(t=ha(t),ha(e)!==t&&n)throw Error(l(425))}function Ol(){}var Qi=null,Fi=null;function Li(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var _i=typeof setTimeout=="function"?setTimeout:void 0,sd=typeof clearTimeout=="function"?clearTimeout:void 0,ya=typeof Promise=="function"?Promise:void 0,cd=typeof queueMicrotask=="function"?queueMicrotask:typeof ya<"u"?function(e){return ya.resolve(null).then(e).catch(ad)}:_i;function ad(e){setTimeout(function(){throw e})}function Pi(e,t){var n=t,s=0;do{var d=n.nextSibling;if(e.removeChild(n),d&&d.nodeType===8)if(n=d.data,n==="/$"){if(s===0){e.removeChild(d),In(t);return}s--}else n!=="$"&&n!=="$?"&&n!=="$!"||s++;n=d}while(n);In(t)}function hr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function $a(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var en=Math.random().toString(36).slice(2),Ft="__reactFiber$"+en,Hn="__reactProps$"+en,Jt="__reactContainer$"+en,Ai="__reactEvents$"+en,ud="__reactListeners$"+en,fd="__reactHandles$"+en;function Lr(e){var t=e[Ft];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Jt]||n[Ft]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=$a(e);e!==null;){if(n=e[Ft])return n;e=$a(e)}return t}e=n,n=e.parentNode}return null}function Zn(e){return e=e[Ft]||e[Jt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function tn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(l(33))}function Ul(e){return e[Hn]||null}var Ni=[],rn=-1;function yr(e){return{current:e}}function Le(e){0>rn||(e.current=Ni[rn],Ni[rn]=null,rn--)}function Qe(e,t){rn++,Ni[rn]=e.current,e.current=t}var $r={},He=yr($r),Je=yr(!1),_r=$r;function nn(e,t){var n=e.type.contextTypes;if(!n)return $r;var s=e.stateNode;if(s&&s.__reactInternalMemoizedUnmaskedChildContext===t)return s.__reactInternalMemoizedMaskedChildContext;var d={},h;for(h in n)d[h]=t[h];return s&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=d),d}function et(e){return e=e.childContextTypes,e!=null}function Vl(){Le(Je),Le(He)}function ka(e,t,n){if(He.current!==$r)throw Error(l(168));Qe(He,t),Qe(Je,n)}function ma(e,t,n){var s=e.stateNode;if(t=t.childContextTypes,typeof s.getChildContext!="function")return n;s=s.getChildContext();for(var d in s)if(!(d in t))throw Error(l(108,Y(e)||"Unknown",d));return K({},n,s)}function Hl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||$r,_r=He.current,Qe(He,e),Qe(Je,Je.current),!0}function xa(e,t,n){var s=e.stateNode;if(!s)throw Error(l(169));n?(e=ma(e,t,_r),s.__reactInternalMemoizedMergedChildContext=e,Le(Je),Le(He),Qe(He,e)):Le(Je),Qe(Je,n)}var er=null,Zl=!1,Ii=!1;function ga(e){er===null?er=[e]:er.push(e)}function dd(e){Zl=!0,ga(e)}function kr(){if(!Ii&&er!==null){Ii=!0;var e=0,t=Ee;try{var n=er;for(Ee=1;e<n.length;e++){var s=n[e];do s=s(!0);while(s!==null)}er=null,Zl=!1}catch(d){throw er!==null&&(er=er.slice(e+1)),vc(ri,kr),d}finally{Ee=t,Ii=!1}}return null}var ln=[],on=0,Wl=null,ql=0,dt=[],pt=0,Pr=null,tr=1,rr="";function Ar(e,t){ln[on++]=ql,ln[on++]=Wl,Wl=e,ql=t}function wa(e,t,n){dt[pt++]=tr,dt[pt++]=rr,dt[pt++]=Pr,Pr=e;var s=tr;e=rr;var d=32-mt(s)-1;s&=~(1<<d),n+=1;var h=32-mt(t)+d;if(30<h){var m=d-d%5;h=(s&(1<<m)-1).toString(32),s>>=m,d-=m,tr=1<<32-mt(t)+d|n<<d|s,rr=h+e}else tr=1<<h|n<<d|s,rr=e}function bi(e){e.return!==null&&(Ar(e,1),wa(e,1,0))}function Ti(e){for(;e===Wl;)Wl=ln[--on],ln[on]=null,ql=ln[--on],ln[on]=null;for(;e===Pr;)Pr=dt[--pt],dt[pt]=null,rr=dt[--pt],dt[pt]=null,tr=dt[--pt],dt[pt]=null}var ct=null,at=null,_e=!1,gt=null;function va(e,t){var n=kt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ma(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ct=e,at=hr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ct=e,at=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Pr!==null?{id:tr,overflow:rr}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=kt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ct=e,at=null,!0):!1;default:return!1}}function ji(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ri(e){if(_e){var t=at;if(t){var n=t;if(!Ma(e,t)){if(ji(e))throw Error(l(418));t=hr(n.nextSibling);var s=ct;t&&Ma(e,t)?va(s,n):(e.flags=e.flags&-4097|2,_e=!1,ct=e)}}else{if(ji(e))throw Error(l(418));e.flags=e.flags&-4097|2,_e=!1,ct=e}}}function Ca(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ct=e}function Yl(e){if(e!==ct)return!1;if(!_e)return Ca(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Li(e.type,e.memoizedProps)),t&&(t=at)){if(ji(e))throw Sa(),Error(l(418));for(;t;)va(e,t),t=hr(t.nextSibling)}if(Ca(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){at=hr(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}at=null}}else at=ct?hr(e.stateNode.nextSibling):null;return!0}function Sa(){for(var e=at;e;)e=hr(e.nextSibling)}function sn(){at=ct=null,_e=!1}function zi(e){gt===null?gt=[e]:gt.push(e)}var pd=N.ReactCurrentBatchConfig;function Wn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(l(309));var s=n.stateNode}if(!s)throw Error(l(147,e));var d=s,h=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===h?t.ref:(t=function(m){var C=d.refs;m===null?delete C[h]:C[h]=m},t._stringRef=h,t)}if(typeof e!="string")throw Error(l(284));if(!n._owner)throw Error(l(290,e))}return e}function Gl(e,t){throw e=Object.prototype.toString.call(t),Error(l(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ea(e){var t=e._init;return t(e._payload)}function Qa(e){function t(A,L){if(e){var I=A.deletions;I===null?(A.deletions=[L],A.flags|=16):I.push(L)}}function n(A,L){if(!e)return null;for(;L!==null;)t(A,L),L=L.sibling;return null}function s(A,L){for(A=new Map;L!==null;)L.key!==null?A.set(L.key,L):A.set(L.index,L),L=L.sibling;return A}function d(A,L){return A=Sr(A,L),A.index=0,A.sibling=null,A}function h(A,L,I){return A.index=I,e?(I=A.alternate,I!==null?(I=I.index,I<L?(A.flags|=2,L):I):(A.flags|=2,L)):(A.flags|=1048576,L)}function m(A){return e&&A.alternate===null&&(A.flags|=2),A}function C(A,L,I,X){return L===null||L.tag!==6?(L=_s(I,A.mode,X),L.return=A,L):(L=d(L,I),L.return=A,L)}function Q(A,L,I,X){var fe=I.type;return fe===V?W(A,L,I.props.children,X,I.key):L!==null&&(L.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===we&&Ea(fe)===L.type)?(X=d(L,I.props),X.ref=Wn(A,L,I),X.return=A,X):(X=wo(I.type,I.key,I.props,null,A.mode,X),X.ref=Wn(A,L,I),X.return=A,X)}function T(A,L,I,X){return L===null||L.tag!==4||L.stateNode.containerInfo!==I.containerInfo||L.stateNode.implementation!==I.implementation?(L=Ps(I,A.mode,X),L.return=A,L):(L=d(L,I.children||[]),L.return=A,L)}function W(A,L,I,X,fe){return L===null||L.tag!==7?(L=Br(I,A.mode,X,fe),L.return=A,L):(L=d(L,I),L.return=A,L)}function G(A,L,I){if(typeof L=="string"&&L!==""||typeof L=="number")return L=_s(""+L,A.mode,I),L.return=A,L;if(typeof L=="object"&&L!==null){switch(L.$$typeof){case B:return I=wo(L.type,L.key,L.props,null,A.mode,I),I.ref=Wn(A,null,L),I.return=A,I;case J:return L=Ps(L,A.mode,I),L.return=A,L;case we:var X=L._init;return G(A,X(L._payload),I)}if(vn(L)||te(L))return L=Br(L,A.mode,I,null),L.return=A,L;Gl(A,L)}return null}function H(A,L,I,X){var fe=L!==null?L.key:null;if(typeof I=="string"&&I!==""||typeof I=="number")return fe!==null?null:C(A,L,""+I,X);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case B:return I.key===fe?Q(A,L,I,X):null;case J:return I.key===fe?T(A,L,I,X):null;case we:return fe=I._init,H(A,L,fe(I._payload),X)}if(vn(I)||te(I))return fe!==null?null:W(A,L,I,X,null);Gl(A,I)}return null}function ee(A,L,I,X,fe){if(typeof X=="string"&&X!==""||typeof X=="number")return A=A.get(I)||null,C(L,A,""+X,fe);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case B:return A=A.get(X.key===null?I:X.key)||null,Q(L,A,X,fe);case J:return A=A.get(X.key===null?I:X.key)||null,T(L,A,X,fe);case we:var ye=X._init;return ee(A,L,I,ye(X._payload),fe)}if(vn(X)||te(X))return A=A.get(I)||null,W(L,A,X,fe,null);Gl(L,X)}return null}function ce(A,L,I,X){for(var fe=null,ye=null,$e=L,ke=L=0,Oe=null;$e!==null&&ke<I.length;ke++){$e.index>ke?(Oe=$e,$e=null):Oe=$e.sibling;var Se=H(A,$e,I[ke],X);if(Se===null){$e===null&&($e=Oe);break}e&&$e&&Se.alternate===null&&t(A,$e),L=h(Se,L,ke),ye===null?fe=Se:ye.sibling=Se,ye=Se,$e=Oe}if(ke===I.length)return n(A,$e),_e&&Ar(A,ke),fe;if($e===null){for(;ke<I.length;ke++)$e=G(A,I[ke],X),$e!==null&&(L=h($e,L,ke),ye===null?fe=$e:ye.sibling=$e,ye=$e);return _e&&Ar(A,ke),fe}for($e=s(A,$e);ke<I.length;ke++)Oe=ee($e,A,ke,I[ke],X),Oe!==null&&(e&&Oe.alternate!==null&&$e.delete(Oe.key===null?ke:Oe.key),L=h(Oe,L,ke),ye===null?fe=Oe:ye.sibling=Oe,ye=Oe);return e&&$e.forEach(function(Er){return t(A,Er)}),_e&&Ar(A,ke),fe}function ue(A,L,I,X){var fe=te(I);if(typeof fe!="function")throw Error(l(150));if(I=fe.call(I),I==null)throw Error(l(151));for(var ye=fe=null,$e=L,ke=L=0,Oe=null,Se=I.next();$e!==null&&!Se.done;ke++,Se=I.next()){$e.index>ke?(Oe=$e,$e=null):Oe=$e.sibling;var Er=H(A,$e,Se.value,X);if(Er===null){$e===null&&($e=Oe);break}e&&$e&&Er.alternate===null&&t(A,$e),L=h(Er,L,ke),ye===null?fe=Er:ye.sibling=Er,ye=Er,$e=Oe}if(Se.done)return n(A,$e),_e&&Ar(A,ke),fe;if($e===null){for(;!Se.done;ke++,Se=I.next())Se=G(A,Se.value,X),Se!==null&&(L=h(Se,L,ke),ye===null?fe=Se:ye.sibling=Se,ye=Se);return _e&&Ar(A,ke),fe}for($e=s(A,$e);!Se.done;ke++,Se=I.next())Se=ee($e,A,ke,Se.value,X),Se!==null&&(e&&Se.alternate!==null&&$e.delete(Se.key===null?ke:Se.key),L=h(Se,L,ke),ye===null?fe=Se:ye.sibling=Se,ye=Se);return e&&$e.forEach(function(Zd){return t(A,Zd)}),_e&&Ar(A,ke),fe}function Te(A,L,I,X){if(typeof I=="object"&&I!==null&&I.type===V&&I.key===null&&(I=I.props.children),typeof I=="object"&&I!==null){switch(I.$$typeof){case B:e:{for(var fe=I.key,ye=L;ye!==null;){if(ye.key===fe){if(fe=I.type,fe===V){if(ye.tag===7){n(A,ye.sibling),L=d(ye,I.props.children),L.return=A,A=L;break e}}else if(ye.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===we&&Ea(fe)===ye.type){n(A,ye.sibling),L=d(ye,I.props),L.ref=Wn(A,ye,I),L.return=A,A=L;break e}n(A,ye);break}else t(A,ye);ye=ye.sibling}I.type===V?(L=Br(I.props.children,A.mode,X,I.key),L.return=A,A=L):(X=wo(I.type,I.key,I.props,null,A.mode,X),X.ref=Wn(A,L,I),X.return=A,A=X)}return m(A);case J:e:{for(ye=I.key;L!==null;){if(L.key===ye)if(L.tag===4&&L.stateNode.containerInfo===I.containerInfo&&L.stateNode.implementation===I.implementation){n(A,L.sibling),L=d(L,I.children||[]),L.return=A,A=L;break e}else{n(A,L);break}else t(A,L);L=L.sibling}L=Ps(I,A.mode,X),L.return=A,A=L}return m(A);case we:return ye=I._init,Te(A,L,ye(I._payload),X)}if(vn(I))return ce(A,L,I,X);if(te(I))return ue(A,L,I,X);Gl(A,I)}return typeof I=="string"&&I!==""||typeof I=="number"?(I=""+I,L!==null&&L.tag===6?(n(A,L.sibling),L=d(L,I),L.return=A,A=L):(n(A,L),L=_s(I,A.mode,X),L.return=A,A=L),m(A)):n(A,L)}return Te}var cn=Qa(!0),Fa=Qa(!1),Xl=yr(null),Kl=null,an=null,Bi=null;function Di(){Bi=an=Kl=null}function Oi(e){var t=Xl.current;Le(Xl),e._currentValue=t}function Ui(e,t,n){for(;e!==null;){var s=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,s!==null&&(s.childLanes|=t)):s!==null&&(s.childLanes&t)!==t&&(s.childLanes|=t),e===n)break;e=e.return}}function un(e,t){Kl=e,Bi=an=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(tt=!0),e.firstContext=null)}function ht(e){var t=e._currentValue;if(Bi!==e)if(e={context:e,memoizedValue:t,next:null},an===null){if(Kl===null)throw Error(l(308));an=e,Kl.dependencies={lanes:0,firstContext:e}}else an=an.next=e;return t}var Nr=null;function Vi(e){Nr===null?Nr=[e]:Nr.push(e)}function La(e,t,n,s){var d=t.interleaved;return d===null?(n.next=n,Vi(t)):(n.next=d.next,d.next=n),t.interleaved=n,nr(e,s)}function nr(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var mr=!1;function Hi(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function _a(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function lr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xr(e,t,n){var s=e.updateQueue;if(s===null)return null;if(s=s.shared,(Me&2)!==0){var d=s.pending;return d===null?t.next=t:(t.next=d.next,d.next=t),s.pending=t,nr(e,n)}return d=s.interleaved,d===null?(t.next=t,Vi(s)):(t.next=d.next,d.next=t),s.interleaved=t,nr(e,n)}function Jl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var s=t.lanes;s&=e.pendingLanes,n|=s,t.lanes=n,oi(e,n)}}function Pa(e,t){var n=e.updateQueue,s=e.alternate;if(s!==null&&(s=s.updateQueue,n===s)){var d=null,h=null;if(n=n.firstBaseUpdate,n!==null){do{var m={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};h===null?d=h=m:h=h.next=m,n=n.next}while(n!==null);h===null?d=h=t:h=h.next=t}else d=h=t;n={baseState:s.baseState,firstBaseUpdate:d,lastBaseUpdate:h,shared:s.shared,effects:s.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function eo(e,t,n,s){var d=e.updateQueue;mr=!1;var h=d.firstBaseUpdate,m=d.lastBaseUpdate,C=d.shared.pending;if(C!==null){d.shared.pending=null;var Q=C,T=Q.next;Q.next=null,m===null?h=T:m.next=T,m=Q;var W=e.alternate;W!==null&&(W=W.updateQueue,C=W.lastBaseUpdate,C!==m&&(C===null?W.firstBaseUpdate=T:C.next=T,W.lastBaseUpdate=Q))}if(h!==null){var G=d.baseState;m=0,W=T=Q=null,C=h;do{var H=C.lane,ee=C.eventTime;if((s&H)===H){W!==null&&(W=W.next={eventTime:ee,lane:0,tag:C.tag,payload:C.payload,callback:C.callback,next:null});e:{var ce=e,ue=C;switch(H=t,ee=n,ue.tag){case 1:if(ce=ue.payload,typeof ce=="function"){G=ce.call(ee,G,H);break e}G=ce;break e;case 3:ce.flags=ce.flags&-65537|128;case 0:if(ce=ue.payload,H=typeof ce=="function"?ce.call(ee,G,H):ce,H==null)break e;G=K({},G,H);break e;case 2:mr=!0}}C.callback!==null&&C.lane!==0&&(e.flags|=64,H=d.effects,H===null?d.effects=[C]:H.push(C))}else ee={eventTime:ee,lane:H,tag:C.tag,payload:C.payload,callback:C.callback,next:null},W===null?(T=W=ee,Q=G):W=W.next=ee,m|=H;if(C=C.next,C===null){if(C=d.shared.pending,C===null)break;H=C,C=H.next,H.next=null,d.lastBaseUpdate=H,d.shared.pending=null}}while(!0);if(W===null&&(Q=G),d.baseState=Q,d.firstBaseUpdate=T,d.lastBaseUpdate=W,t=d.shared.interleaved,t!==null){d=t;do m|=d.lane,d=d.next;while(d!==t)}else h===null&&(d.shared.lanes=0);Tr|=m,e.lanes=m,e.memoizedState=G}}function Aa(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var s=e[t],d=s.callback;if(d!==null){if(s.callback=null,s=n,typeof d!="function")throw Error(l(191,d));d.call(s)}}}var qn={},Lt=yr(qn),Yn=yr(qn),Gn=yr(qn);function Ir(e){if(e===qn)throw Error(l(174));return e}function Zi(e,t){switch(Qe(Gn,t),Qe(Yn,e),Qe(Lt,qn),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Wo(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Wo(t,e)}Le(Lt),Qe(Lt,t)}function fn(){Le(Lt),Le(Yn),Le(Gn)}function Na(e){Ir(Gn.current);var t=Ir(Lt.current),n=Wo(t,e.type);t!==n&&(Qe(Yn,e),Qe(Lt,n))}function Wi(e){Yn.current===e&&(Le(Lt),Le(Yn))}var Pe=yr(0);function to(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var qi=[];function Yi(){for(var e=0;e<qi.length;e++)qi[e]._workInProgressVersionPrimary=null;qi.length=0}var ro=N.ReactCurrentDispatcher,Gi=N.ReactCurrentBatchConfig,br=0,Ae=null,Re=null,Be=null,no=!1,Xn=!1,Kn=0,hd=0;function Ze(){throw Error(l(321))}function Xi(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!xt(e[n],t[n]))return!1;return!0}function Ki(e,t,n,s,d,h){if(br=h,Ae=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ro.current=e===null||e.memoizedState===null?md:xd,e=n(s,d),Xn){h=0;do{if(Xn=!1,Kn=0,25<=h)throw Error(l(301));h+=1,Be=Re=null,t.updateQueue=null,ro.current=gd,e=n(s,d)}while(Xn)}if(ro.current=io,t=Re!==null&&Re.next!==null,br=0,Be=Re=Ae=null,no=!1,t)throw Error(l(300));return e}function Ji(){var e=Kn!==0;return Kn=0,e}function _t(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Be===null?Ae.memoizedState=Be=e:Be=Be.next=e,Be}function yt(){if(Re===null){var e=Ae.alternate;e=e!==null?e.memoizedState:null}else e=Re.next;var t=Be===null?Ae.memoizedState:Be.next;if(t!==null)Be=t,Re=e;else{if(e===null)throw Error(l(310));Re=e,e={memoizedState:Re.memoizedState,baseState:Re.baseState,baseQueue:Re.baseQueue,queue:Re.queue,next:null},Be===null?Ae.memoizedState=Be=e:Be=Be.next=e}return Be}function Jn(e,t){return typeof t=="function"?t(e):t}function es(e){var t=yt(),n=t.queue;if(n===null)throw Error(l(311));n.lastRenderedReducer=e;var s=Re,d=s.baseQueue,h=n.pending;if(h!==null){if(d!==null){var m=d.next;d.next=h.next,h.next=m}s.baseQueue=d=h,n.pending=null}if(d!==null){h=d.next,s=s.baseState;var C=m=null,Q=null,T=h;do{var W=T.lane;if((br&W)===W)Q!==null&&(Q=Q.next={lane:0,action:T.action,hasEagerState:T.hasEagerState,eagerState:T.eagerState,next:null}),s=T.hasEagerState?T.eagerState:e(s,T.action);else{var G={lane:W,action:T.action,hasEagerState:T.hasEagerState,eagerState:T.eagerState,next:null};Q===null?(C=Q=G,m=s):Q=Q.next=G,Ae.lanes|=W,Tr|=W}T=T.next}while(T!==null&&T!==h);Q===null?m=s:Q.next=C,xt(s,t.memoizedState)||(tt=!0),t.memoizedState=s,t.baseState=m,t.baseQueue=Q,n.lastRenderedState=s}if(e=n.interleaved,e!==null){d=e;do h=d.lane,Ae.lanes|=h,Tr|=h,d=d.next;while(d!==e)}else d===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ts(e){var t=yt(),n=t.queue;if(n===null)throw Error(l(311));n.lastRenderedReducer=e;var s=n.dispatch,d=n.pending,h=t.memoizedState;if(d!==null){n.pending=null;var m=d=d.next;do h=e(h,m.action),m=m.next;while(m!==d);xt(h,t.memoizedState)||(tt=!0),t.memoizedState=h,t.baseQueue===null&&(t.baseState=h),n.lastRenderedState=h}return[h,s]}function Ia(){}function ba(e,t){var n=Ae,s=yt(),d=t(),h=!xt(s.memoizedState,d);if(h&&(s.memoizedState=d,tt=!0),s=s.queue,rs(Ra.bind(null,n,s,e),[e]),s.getSnapshot!==t||h||Be!==null&&Be.memoizedState.tag&1){if(n.flags|=2048,el(9,ja.bind(null,n,s,d,t),void 0,null),De===null)throw Error(l(349));(br&30)!==0||Ta(n,t,d)}return d}function Ta(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ae.updateQueue,t===null?(t={lastEffect:null,stores:null},Ae.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ja(e,t,n,s){t.value=n,t.getSnapshot=s,za(t)&&Ba(e)}function Ra(e,t,n){return n(function(){za(t)&&Ba(e)})}function za(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!xt(e,n)}catch{return!0}}function Ba(e){var t=nr(e,1);t!==null&&Ct(t,e,1,-1)}function Da(e){var t=_t();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Jn,lastRenderedState:e},t.queue=e,e=e.dispatch=kd.bind(null,Ae,e),[t.memoizedState,e]}function el(e,t,n,s){return e={tag:e,create:t,destroy:n,deps:s,next:null},t=Ae.updateQueue,t===null?(t={lastEffect:null,stores:null},Ae.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(s=n.next,n.next=e,e.next=s,t.lastEffect=e)),e}function Oa(){return yt().memoizedState}function lo(e,t,n,s){var d=_t();Ae.flags|=e,d.memoizedState=el(1|t,n,void 0,s===void 0?null:s)}function oo(e,t,n,s){var d=yt();s=s===void 0?null:s;var h=void 0;if(Re!==null){var m=Re.memoizedState;if(h=m.destroy,s!==null&&Xi(s,m.deps)){d.memoizedState=el(t,n,h,s);return}}Ae.flags|=e,d.memoizedState=el(1|t,n,h,s)}function Ua(e,t){return lo(8390656,8,e,t)}function rs(e,t){return oo(2048,8,e,t)}function Va(e,t){return oo(4,2,e,t)}function Ha(e,t){return oo(4,4,e,t)}function Za(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Wa(e,t,n){return n=n!=null?n.concat([e]):null,oo(4,4,Za.bind(null,t,e),n)}function ns(){}function qa(e,t){var n=yt();t=t===void 0?null:t;var s=n.memoizedState;return s!==null&&t!==null&&Xi(t,s[1])?s[0]:(n.memoizedState=[e,t],e)}function Ya(e,t){var n=yt();t=t===void 0?null:t;var s=n.memoizedState;return s!==null&&t!==null&&Xi(t,s[1])?s[0]:(e=e(),n.memoizedState=[e,t],e)}function Ga(e,t,n){return(br&21)===0?(e.baseState&&(e.baseState=!1,tt=!0),e.memoizedState=n):(xt(n,t)||(n=Ec(),Ae.lanes|=n,Tr|=n,e.baseState=!0),t)}function yd(e,t){var n=Ee;Ee=n!==0&&4>n?n:4,e(!0);var s=Gi.transition;Gi.transition={};try{e(!1),t()}finally{Ee=n,Gi.transition=s}}function Xa(){return yt().memoizedState}function $d(e,t,n){var s=Mr(e);if(n={lane:s,action:n,hasEagerState:!1,eagerState:null,next:null},Ka(e))Ja(t,n);else if(n=La(e,t,n,s),n!==null){var d=Xe();Ct(n,e,s,d),eu(n,t,s)}}function kd(e,t,n){var s=Mr(e),d={lane:s,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ka(e))Ja(t,d);else{var h=e.alternate;if(e.lanes===0&&(h===null||h.lanes===0)&&(h=t.lastRenderedReducer,h!==null))try{var m=t.lastRenderedState,C=h(m,n);if(d.hasEagerState=!0,d.eagerState=C,xt(C,m)){var Q=t.interleaved;Q===null?(d.next=d,Vi(t)):(d.next=Q.next,Q.next=d),t.interleaved=d;return}}catch{}finally{}n=La(e,t,d,s),n!==null&&(d=Xe(),Ct(n,e,s,d),eu(n,t,s))}}function Ka(e){var t=e.alternate;return e===Ae||t!==null&&t===Ae}function Ja(e,t){Xn=no=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function eu(e,t,n){if((n&4194240)!==0){var s=t.lanes;s&=e.pendingLanes,n|=s,t.lanes=n,oi(e,n)}}var io={readContext:ht,useCallback:Ze,useContext:Ze,useEffect:Ze,useImperativeHandle:Ze,useInsertionEffect:Ze,useLayoutEffect:Ze,useMemo:Ze,useReducer:Ze,useRef:Ze,useState:Ze,useDebugValue:Ze,useDeferredValue:Ze,useTransition:Ze,useMutableSource:Ze,useSyncExternalStore:Ze,useId:Ze,unstable_isNewReconciler:!1},md={readContext:ht,useCallback:function(e,t){return _t().memoizedState=[e,t===void 0?null:t],e},useContext:ht,useEffect:Ua,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,lo(4194308,4,Za.bind(null,t,e),n)},useLayoutEffect:function(e,t){return lo(4194308,4,e,t)},useInsertionEffect:function(e,t){return lo(4,2,e,t)},useMemo:function(e,t){var n=_t();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var s=_t();return t=n!==void 0?n(t):t,s.memoizedState=s.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},s.queue=e,e=e.dispatch=$d.bind(null,Ae,e),[s.memoizedState,e]},useRef:function(e){var t=_t();return e={current:e},t.memoizedState=e},useState:Da,useDebugValue:ns,useDeferredValue:function(e){return _t().memoizedState=e},useTransition:function(){var e=Da(!1),t=e[0];return e=yd.bind(null,e[1]),_t().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var s=Ae,d=_t();if(_e){if(n===void 0)throw Error(l(407));n=n()}else{if(n=t(),De===null)throw Error(l(349));(br&30)!==0||Ta(s,t,n)}d.memoizedState=n;var h={value:n,getSnapshot:t};return d.queue=h,Ua(Ra.bind(null,s,h,e),[e]),s.flags|=2048,el(9,ja.bind(null,s,h,n,t),void 0,null),n},useId:function(){var e=_t(),t=De.identifierPrefix;if(_e){var n=rr,s=tr;n=(s&~(1<<32-mt(s)-1)).toString(32)+n,t=":"+t+"R"+n,n=Kn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=hd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},xd={readContext:ht,useCallback:qa,useContext:ht,useEffect:rs,useImperativeHandle:Wa,useInsertionEffect:Va,useLayoutEffect:Ha,useMemo:Ya,useReducer:es,useRef:Oa,useState:function(){return es(Jn)},useDebugValue:ns,useDeferredValue:function(e){var t=yt();return Ga(t,Re.memoizedState,e)},useTransition:function(){var e=es(Jn)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Ia,useSyncExternalStore:ba,useId:Xa,unstable_isNewReconciler:!1},gd={readContext:ht,useCallback:qa,useContext:ht,useEffect:rs,useImperativeHandle:Wa,useInsertionEffect:Va,useLayoutEffect:Ha,useMemo:Ya,useReducer:ts,useRef:Oa,useState:function(){return ts(Jn)},useDebugValue:ns,useDeferredValue:function(e){var t=yt();return Re===null?t.memoizedState=e:Ga(t,Re.memoizedState,e)},useTransition:function(){var e=ts(Jn)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Ia,useSyncExternalStore:ba,useId:Xa,unstable_isNewReconciler:!1};function wt(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ls(e,t,n,s){t=e.memoizedState,n=n(s,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var so={isMounted:function(e){return(e=e._reactInternals)?Fr(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var s=Xe(),d=Mr(e),h=lr(s,d);h.payload=t,n!=null&&(h.callback=n),t=xr(e,h,d),t!==null&&(Ct(t,e,d,s),Jl(t,e,d))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var s=Xe(),d=Mr(e),h=lr(s,d);h.tag=1,h.payload=t,n!=null&&(h.callback=n),t=xr(e,h,d),t!==null&&(Ct(t,e,d,s),Jl(t,e,d))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Xe(),s=Mr(e),d=lr(n,s);d.tag=2,t!=null&&(d.callback=t),t=xr(e,d,s),t!==null&&(Ct(t,e,s,n),Jl(t,e,s))}};function tu(e,t,n,s,d,h,m){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(s,h,m):t.prototype&&t.prototype.isPureReactComponent?!Bn(n,s)||!Bn(d,h):!0}function ru(e,t,n){var s=!1,d=$r,h=t.contextType;return typeof h=="object"&&h!==null?h=ht(h):(d=et(t)?_r:He.current,s=t.contextTypes,h=(s=s!=null)?nn(e,d):$r),t=new t(n,h),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=so,e.stateNode=t,t._reactInternals=e,s&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=d,e.__reactInternalMemoizedMaskedChildContext=h),t}function nu(e,t,n,s){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,s),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,s),t.state!==e&&so.enqueueReplaceState(t,t.state,null)}function os(e,t,n,s){var d=e.stateNode;d.props=n,d.state=e.memoizedState,d.refs={},Hi(e);var h=t.contextType;typeof h=="object"&&h!==null?d.context=ht(h):(h=et(t)?_r:He.current,d.context=nn(e,h)),d.state=e.memoizedState,h=t.getDerivedStateFromProps,typeof h=="function"&&(ls(e,t,h,n),d.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(t=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),t!==d.state&&so.enqueueReplaceState(d,d.state,null),eo(e,n,d,s),d.state=e.memoizedState),typeof d.componentDidMount=="function"&&(e.flags|=4194308)}function dn(e,t){try{var n="",s=t;do n+=de(s),s=s.return;while(s);var d=n}catch(h){d=`
Error generating stack: `+h.message+`
`+h.stack}return{value:e,source:t,stack:d,digest:null}}function is(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ss(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var wd=typeof WeakMap=="function"?WeakMap:Map;function lu(e,t,n){n=lr(-1,n),n.tag=3,n.payload={element:null};var s=t.value;return n.callback=function(){yo||(yo=!0,vs=s),ss(e,t)},n}function ou(e,t,n){n=lr(-1,n),n.tag=3;var s=e.type.getDerivedStateFromError;if(typeof s=="function"){var d=t.value;n.payload=function(){return s(d)},n.callback=function(){ss(e,t)}}var h=e.stateNode;return h!==null&&typeof h.componentDidCatch=="function"&&(n.callback=function(){ss(e,t),typeof s!="function"&&(wr===null?wr=new Set([this]):wr.add(this));var m=t.stack;this.componentDidCatch(t.value,{componentStack:m!==null?m:""})}),n}function iu(e,t,n){var s=e.pingCache;if(s===null){s=e.pingCache=new wd;var d=new Set;s.set(t,d)}else d=s.get(t),d===void 0&&(d=new Set,s.set(t,d));d.has(n)||(d.add(n),e=bd.bind(null,e,t,n),t.then(e,e))}function su(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function cu(e,t,n,s,d){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=lr(-1,1),t.tag=2,xr(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=d,e)}var vd=N.ReactCurrentOwner,tt=!1;function Ge(e,t,n,s){t.child=e===null?Fa(t,null,n,s):cn(t,e.child,n,s)}function au(e,t,n,s,d){n=n.render;var h=t.ref;return un(t,d),s=Ki(e,t,n,s,h,d),n=Ji(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~d,or(e,t,d)):(_e&&n&&bi(t),t.flags|=1,Ge(e,t,s,d),t.child)}function uu(e,t,n,s,d){if(e===null){var h=n.type;return typeof h=="function"&&!Ls(h)&&h.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=h,fu(e,t,h,s,d)):(e=wo(n.type,null,s,t,t.mode,d),e.ref=t.ref,e.return=t,t.child=e)}if(h=e.child,(e.lanes&d)===0){var m=h.memoizedProps;if(n=n.compare,n=n!==null?n:Bn,n(m,s)&&e.ref===t.ref)return or(e,t,d)}return t.flags|=1,e=Sr(h,s),e.ref=t.ref,e.return=t,t.child=e}function fu(e,t,n,s,d){if(e!==null){var h=e.memoizedProps;if(Bn(h,s)&&e.ref===t.ref)if(tt=!1,t.pendingProps=s=h,(e.lanes&d)!==0)(e.flags&131072)!==0&&(tt=!0);else return t.lanes=e.lanes,or(e,t,d)}return cs(e,t,n,s,d)}function du(e,t,n){var s=t.pendingProps,d=s.children,h=e!==null?e.memoizedState:null;if(s.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Qe(hn,ut),ut|=n;else{if((n&1073741824)===0)return e=h!==null?h.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Qe(hn,ut),ut|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},s=h!==null?h.baseLanes:n,Qe(hn,ut),ut|=s}else h!==null?(s=h.baseLanes|n,t.memoizedState=null):s=n,Qe(hn,ut),ut|=s;return Ge(e,t,d,n),t.child}function pu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function cs(e,t,n,s,d){var h=et(n)?_r:He.current;return h=nn(t,h),un(t,d),n=Ki(e,t,n,s,h,d),s=Ji(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~d,or(e,t,d)):(_e&&s&&bi(t),t.flags|=1,Ge(e,t,n,d),t.child)}function hu(e,t,n,s,d){if(et(n)){var h=!0;Hl(t)}else h=!1;if(un(t,d),t.stateNode===null)ao(e,t),ru(t,n,s),os(t,n,s,d),s=!0;else if(e===null){var m=t.stateNode,C=t.memoizedProps;m.props=C;var Q=m.context,T=n.contextType;typeof T=="object"&&T!==null?T=ht(T):(T=et(n)?_r:He.current,T=nn(t,T));var W=n.getDerivedStateFromProps,G=typeof W=="function"||typeof m.getSnapshotBeforeUpdate=="function";G||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(C!==s||Q!==T)&&nu(t,m,s,T),mr=!1;var H=t.memoizedState;m.state=H,eo(t,s,m,d),Q=t.memoizedState,C!==s||H!==Q||Je.current||mr?(typeof W=="function"&&(ls(t,n,W,s),Q=t.memoizedState),(C=mr||tu(t,n,C,s,H,Q,T))?(G||typeof m.UNSAFE_componentWillMount!="function"&&typeof m.componentWillMount!="function"||(typeof m.componentWillMount=="function"&&m.componentWillMount(),typeof m.UNSAFE_componentWillMount=="function"&&m.UNSAFE_componentWillMount()),typeof m.componentDidMount=="function"&&(t.flags|=4194308)):(typeof m.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=s,t.memoizedState=Q),m.props=s,m.state=Q,m.context=T,s=C):(typeof m.componentDidMount=="function"&&(t.flags|=4194308),s=!1)}else{m=t.stateNode,_a(e,t),C=t.memoizedProps,T=t.type===t.elementType?C:wt(t.type,C),m.props=T,G=t.pendingProps,H=m.context,Q=n.contextType,typeof Q=="object"&&Q!==null?Q=ht(Q):(Q=et(n)?_r:He.current,Q=nn(t,Q));var ee=n.getDerivedStateFromProps;(W=typeof ee=="function"||typeof m.getSnapshotBeforeUpdate=="function")||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(C!==G||H!==Q)&&nu(t,m,s,Q),mr=!1,H=t.memoizedState,m.state=H,eo(t,s,m,d);var ce=t.memoizedState;C!==G||H!==ce||Je.current||mr?(typeof ee=="function"&&(ls(t,n,ee,s),ce=t.memoizedState),(T=mr||tu(t,n,T,s,H,ce,Q)||!1)?(W||typeof m.UNSAFE_componentWillUpdate!="function"&&typeof m.componentWillUpdate!="function"||(typeof m.componentWillUpdate=="function"&&m.componentWillUpdate(s,ce,Q),typeof m.UNSAFE_componentWillUpdate=="function"&&m.UNSAFE_componentWillUpdate(s,ce,Q)),typeof m.componentDidUpdate=="function"&&(t.flags|=4),typeof m.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof m.componentDidUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),t.memoizedProps=s,t.memoizedState=ce),m.props=s,m.state=ce,m.context=Q,s=T):(typeof m.componentDidUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||C===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),s=!1)}return as(e,t,n,s,h,d)}function as(e,t,n,s,d,h){pu(e,t);var m=(t.flags&128)!==0;if(!s&&!m)return d&&xa(t,n,!1),or(e,t,h);s=t.stateNode,vd.current=t;var C=m&&typeof n.getDerivedStateFromError!="function"?null:s.render();return t.flags|=1,e!==null&&m?(t.child=cn(t,e.child,null,h),t.child=cn(t,null,C,h)):Ge(e,t,C,h),t.memoizedState=s.state,d&&xa(t,n,!0),t.child}function yu(e){var t=e.stateNode;t.pendingContext?ka(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ka(e,t.context,!1),Zi(e,t.containerInfo)}function $u(e,t,n,s,d){return sn(),zi(d),t.flags|=256,Ge(e,t,n,s),t.child}var us={dehydrated:null,treeContext:null,retryLane:0};function fs(e){return{baseLanes:e,cachePool:null,transitions:null}}function ku(e,t,n){var s=t.pendingProps,d=Pe.current,h=!1,m=(t.flags&128)!==0,C;if((C=m)||(C=e!==null&&e.memoizedState===null?!1:(d&2)!==0),C?(h=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(d|=1),Qe(Pe,d&1),e===null)return Ri(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(m=s.children,e=s.fallback,h?(s=t.mode,h=t.child,m={mode:"hidden",children:m},(s&1)===0&&h!==null?(h.childLanes=0,h.pendingProps=m):h=vo(m,s,0,null),e=Br(e,s,n,null),h.return=t,e.return=t,h.sibling=e,t.child=h,t.child.memoizedState=fs(n),t.memoizedState=us,e):ds(t,m));if(d=e.memoizedState,d!==null&&(C=d.dehydrated,C!==null))return Md(e,t,m,s,C,d,n);if(h){h=s.fallback,m=t.mode,d=e.child,C=d.sibling;var Q={mode:"hidden",children:s.children};return(m&1)===0&&t.child!==d?(s=t.child,s.childLanes=0,s.pendingProps=Q,t.deletions=null):(s=Sr(d,Q),s.subtreeFlags=d.subtreeFlags&14680064),C!==null?h=Sr(C,h):(h=Br(h,m,n,null),h.flags|=2),h.return=t,s.return=t,s.sibling=h,t.child=s,s=h,h=t.child,m=e.child.memoizedState,m=m===null?fs(n):{baseLanes:m.baseLanes|n,cachePool:null,transitions:m.transitions},h.memoizedState=m,h.childLanes=e.childLanes&~n,t.memoizedState=us,s}return h=e.child,e=h.sibling,s=Sr(h,{mode:"visible",children:s.children}),(t.mode&1)===0&&(s.lanes=n),s.return=t,s.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=s,t.memoizedState=null,s}function ds(e,t){return t=vo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function co(e,t,n,s){return s!==null&&zi(s),cn(t,e.child,null,n),e=ds(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Md(e,t,n,s,d,h,m){if(n)return t.flags&256?(t.flags&=-257,s=is(Error(l(422))),co(e,t,m,s)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(h=s.fallback,d=t.mode,s=vo({mode:"visible",children:s.children},d,0,null),h=Br(h,d,m,null),h.flags|=2,s.return=t,h.return=t,s.sibling=h,t.child=s,(t.mode&1)!==0&&cn(t,e.child,null,m),t.child.memoizedState=fs(m),t.memoizedState=us,h);if((t.mode&1)===0)return co(e,t,m,null);if(d.data==="$!"){if(s=d.nextSibling&&d.nextSibling.dataset,s)var C=s.dgst;return s=C,h=Error(l(419)),s=is(h,s,void 0),co(e,t,m,s)}if(C=(m&e.childLanes)!==0,tt||C){if(s=De,s!==null){switch(m&-m){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(s.suspendedLanes|m))!==0?0:d,d!==0&&d!==h.retryLane&&(h.retryLane=d,nr(e,d),Ct(s,e,d,-1))}return Fs(),s=is(Error(l(421))),co(e,t,m,s)}return d.data==="$?"?(t.flags|=128,t.child=e.child,t=Td.bind(null,e),d._reactRetry=t,null):(e=h.treeContext,at=hr(d.nextSibling),ct=t,_e=!0,gt=null,e!==null&&(dt[pt++]=tr,dt[pt++]=rr,dt[pt++]=Pr,tr=e.id,rr=e.overflow,Pr=t),t=ds(t,s.children),t.flags|=4096,t)}function mu(e,t,n){e.lanes|=t;var s=e.alternate;s!==null&&(s.lanes|=t),Ui(e.return,t,n)}function ps(e,t,n,s,d){var h=e.memoizedState;h===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:s,tail:n,tailMode:d}:(h.isBackwards=t,h.rendering=null,h.renderingStartTime=0,h.last=s,h.tail=n,h.tailMode=d)}function xu(e,t,n){var s=t.pendingProps,d=s.revealOrder,h=s.tail;if(Ge(e,t,s.children,n),s=Pe.current,(s&2)!==0)s=s&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&mu(e,n,t);else if(e.tag===19)mu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}s&=1}if(Qe(Pe,s),(t.mode&1)===0)t.memoizedState=null;else switch(d){case"forwards":for(n=t.child,d=null;n!==null;)e=n.alternate,e!==null&&to(e)===null&&(d=n),n=n.sibling;n=d,n===null?(d=t.child,t.child=null):(d=n.sibling,n.sibling=null),ps(t,!1,d,n,h);break;case"backwards":for(n=null,d=t.child,t.child=null;d!==null;){if(e=d.alternate,e!==null&&to(e)===null){t.child=d;break}e=d.sibling,d.sibling=n,n=d,d=e}ps(t,!0,n,null,h);break;case"together":ps(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ao(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function or(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Tr|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(l(153));if(t.child!==null){for(e=t.child,n=Sr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Sr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Cd(e,t,n){switch(t.tag){case 3:yu(t),sn();break;case 5:Na(t);break;case 1:et(t.type)&&Hl(t);break;case 4:Zi(t,t.stateNode.containerInfo);break;case 10:var s=t.type._context,d=t.memoizedProps.value;Qe(Xl,s._currentValue),s._currentValue=d;break;case 13:if(s=t.memoizedState,s!==null)return s.dehydrated!==null?(Qe(Pe,Pe.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?ku(e,t,n):(Qe(Pe,Pe.current&1),e=or(e,t,n),e!==null?e.sibling:null);Qe(Pe,Pe.current&1);break;case 19:if(s=(n&t.childLanes)!==0,(e.flags&128)!==0){if(s)return xu(e,t,n);t.flags|=128}if(d=t.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Qe(Pe,Pe.current),s)break;return null;case 22:case 23:return t.lanes=0,du(e,t,n)}return or(e,t,n)}var gu,hs,wu,vu;gu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},hs=function(){},wu=function(e,t,n,s){var d=e.memoizedProps;if(d!==s){e=t.stateNode,Ir(Lt.current);var h=null;switch(n){case"input":d=Uo(e,d),s=Uo(e,s),h=[];break;case"select":d=K({},d,{value:void 0}),s=K({},s,{value:void 0}),h=[];break;case"textarea":d=Zo(e,d),s=Zo(e,s),h=[];break;default:typeof d.onClick!="function"&&typeof s.onClick=="function"&&(e.onclick=Ol)}qo(n,s);var m;n=null;for(T in d)if(!s.hasOwnProperty(T)&&d.hasOwnProperty(T)&&d[T]!=null)if(T==="style"){var C=d[T];for(m in C)C.hasOwnProperty(m)&&(n||(n={}),n[m]="")}else T!=="dangerouslySetInnerHTML"&&T!=="children"&&T!=="suppressContentEditableWarning"&&T!=="suppressHydrationWarning"&&T!=="autoFocus"&&(i.hasOwnProperty(T)?h||(h=[]):(h=h||[]).push(T,null));for(T in s){var Q=s[T];if(C=d!=null?d[T]:void 0,s.hasOwnProperty(T)&&Q!==C&&(Q!=null||C!=null))if(T==="style")if(C){for(m in C)!C.hasOwnProperty(m)||Q&&Q.hasOwnProperty(m)||(n||(n={}),n[m]="");for(m in Q)Q.hasOwnProperty(m)&&C[m]!==Q[m]&&(n||(n={}),n[m]=Q[m])}else n||(h||(h=[]),h.push(T,n)),n=Q;else T==="dangerouslySetInnerHTML"?(Q=Q?Q.__html:void 0,C=C?C.__html:void 0,Q!=null&&C!==Q&&(h=h||[]).push(T,Q)):T==="children"?typeof Q!="string"&&typeof Q!="number"||(h=h||[]).push(T,""+Q):T!=="suppressContentEditableWarning"&&T!=="suppressHydrationWarning"&&(i.hasOwnProperty(T)?(Q!=null&&T==="onScroll"&&Fe("scroll",e),h||C===Q||(h=[])):(h=h||[]).push(T,Q))}n&&(h=h||[]).push("style",n);var T=h;(t.updateQueue=T)&&(t.flags|=4)}},vu=function(e,t,n,s){n!==s&&(t.flags|=4)};function tl(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var s=null;n!==null;)n.alternate!==null&&(s=n),n=n.sibling;s===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:s.sibling=null}}function We(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,s=0;if(t)for(var d=e.child;d!==null;)n|=d.lanes|d.childLanes,s|=d.subtreeFlags&14680064,s|=d.flags&14680064,d.return=e,d=d.sibling;else for(d=e.child;d!==null;)n|=d.lanes|d.childLanes,s|=d.subtreeFlags,s|=d.flags,d.return=e,d=d.sibling;return e.subtreeFlags|=s,e.childLanes=n,t}function Sd(e,t,n){var s=t.pendingProps;switch(Ti(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(t),null;case 1:return et(t.type)&&Vl(),We(t),null;case 3:return s=t.stateNode,fn(),Le(Je),Le(He),Yi(),s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),(e===null||e.child===null)&&(Yl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,gt!==null&&(Ss(gt),gt=null))),hs(e,t),We(t),null;case 5:Wi(t);var d=Ir(Gn.current);if(n=t.type,e!==null&&t.stateNode!=null)wu(e,t,n,s,d),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!s){if(t.stateNode===null)throw Error(l(166));return We(t),null}if(e=Ir(Lt.current),Yl(t)){s=t.stateNode,n=t.type;var h=t.memoizedProps;switch(s[Ft]=t,s[Hn]=h,e=(t.mode&1)!==0,n){case"dialog":Fe("cancel",s),Fe("close",s);break;case"iframe":case"object":case"embed":Fe("load",s);break;case"video":case"audio":for(d=0;d<On.length;d++)Fe(On[d],s);break;case"source":Fe("error",s);break;case"img":case"image":case"link":Fe("error",s),Fe("load",s);break;case"details":Fe("toggle",s);break;case"input":rc(s,h),Fe("invalid",s);break;case"select":s._wrapperState={wasMultiple:!!h.multiple},Fe("invalid",s);break;case"textarea":oc(s,h),Fe("invalid",s)}qo(n,h),d=null;for(var m in h)if(h.hasOwnProperty(m)){var C=h[m];m==="children"?typeof C=="string"?s.textContent!==C&&(h.suppressHydrationWarning!==!0&&Dl(s.textContent,C,e),d=["children",C]):typeof C=="number"&&s.textContent!==""+C&&(h.suppressHydrationWarning!==!0&&Dl(s.textContent,C,e),d=["children",""+C]):i.hasOwnProperty(m)&&C!=null&&m==="onScroll"&&Fe("scroll",s)}switch(n){case"input":Ie(s),lc(s,h,!0);break;case"textarea":Ie(s),sc(s);break;case"select":case"option":break;default:typeof h.onClick=="function"&&(s.onclick=Ol)}s=d,t.updateQueue=s,s!==null&&(t.flags|=4)}else{m=d.nodeType===9?d:d.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=cc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=m.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof s.is=="string"?e=m.createElement(n,{is:s.is}):(e=m.createElement(n),n==="select"&&(m=e,s.multiple?m.multiple=!0:s.size&&(m.size=s.size))):e=m.createElementNS(e,n),e[Ft]=t,e[Hn]=s,gu(e,t,!1,!1),t.stateNode=e;e:{switch(m=Yo(n,s),n){case"dialog":Fe("cancel",e),Fe("close",e),d=s;break;case"iframe":case"object":case"embed":Fe("load",e),d=s;break;case"video":case"audio":for(d=0;d<On.length;d++)Fe(On[d],e);d=s;break;case"source":Fe("error",e),d=s;break;case"img":case"image":case"link":Fe("error",e),Fe("load",e),d=s;break;case"details":Fe("toggle",e),d=s;break;case"input":rc(e,s),d=Uo(e,s),Fe("invalid",e);break;case"option":d=s;break;case"select":e._wrapperState={wasMultiple:!!s.multiple},d=K({},s,{value:void 0}),Fe("invalid",e);break;case"textarea":oc(e,s),d=Zo(e,s),Fe("invalid",e);break;default:d=s}qo(n,d),C=d;for(h in C)if(C.hasOwnProperty(h)){var Q=C[h];h==="style"?fc(e,Q):h==="dangerouslySetInnerHTML"?(Q=Q?Q.__html:void 0,Q!=null&&ac(e,Q)):h==="children"?typeof Q=="string"?(n!=="textarea"||Q!=="")&&Mn(e,Q):typeof Q=="number"&&Mn(e,""+Q):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(i.hasOwnProperty(h)?Q!=null&&h==="onScroll"&&Fe("scroll",e):Q!=null&&P(e,h,Q,m))}switch(n){case"input":Ie(e),lc(e,s,!1);break;case"textarea":Ie(e),sc(e);break;case"option":s.value!=null&&e.setAttribute("value",""+se(s.value));break;case"select":e.multiple=!!s.multiple,h=s.value,h!=null?Hr(e,!!s.multiple,h,!1):s.defaultValue!=null&&Hr(e,!!s.multiple,s.defaultValue,!0);break;default:typeof d.onClick=="function"&&(e.onclick=Ol)}switch(n){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break e;case"img":s=!0;break e;default:s=!1}}s&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return We(t),null;case 6:if(e&&t.stateNode!=null)vu(e,t,e.memoizedProps,s);else{if(typeof s!="string"&&t.stateNode===null)throw Error(l(166));if(n=Ir(Gn.current),Ir(Lt.current),Yl(t)){if(s=t.stateNode,n=t.memoizedProps,s[Ft]=t,(h=s.nodeValue!==n)&&(e=ct,e!==null))switch(e.tag){case 3:Dl(s.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Dl(s.nodeValue,n,(e.mode&1)!==0)}h&&(t.flags|=4)}else s=(n.nodeType===9?n:n.ownerDocument).createTextNode(s),s[Ft]=t,t.stateNode=s}return We(t),null;case 13:if(Le(Pe),s=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&at!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Sa(),sn(),t.flags|=98560,h=!1;else if(h=Yl(t),s!==null&&s.dehydrated!==null){if(e===null){if(!h)throw Error(l(318));if(h=t.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(l(317));h[Ft]=t}else sn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;We(t),h=!1}else gt!==null&&(Ss(gt),gt=null),h=!0;if(!h)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(s=s!==null,s!==(e!==null&&e.memoizedState!==null)&&s&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Pe.current&1)!==0?ze===0&&(ze=3):Fs())),t.updateQueue!==null&&(t.flags|=4),We(t),null);case 4:return fn(),hs(e,t),e===null&&Un(t.stateNode.containerInfo),We(t),null;case 10:return Oi(t.type._context),We(t),null;case 17:return et(t.type)&&Vl(),We(t),null;case 19:if(Le(Pe),h=t.memoizedState,h===null)return We(t),null;if(s=(t.flags&128)!==0,m=h.rendering,m===null)if(s)tl(h,!1);else{if(ze!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(m=to(e),m!==null){for(t.flags|=128,tl(h,!1),s=m.updateQueue,s!==null&&(t.updateQueue=s,t.flags|=4),t.subtreeFlags=0,s=n,n=t.child;n!==null;)h=n,e=s,h.flags&=14680066,m=h.alternate,m===null?(h.childLanes=0,h.lanes=e,h.child=null,h.subtreeFlags=0,h.memoizedProps=null,h.memoizedState=null,h.updateQueue=null,h.dependencies=null,h.stateNode=null):(h.childLanes=m.childLanes,h.lanes=m.lanes,h.child=m.child,h.subtreeFlags=0,h.deletions=null,h.memoizedProps=m.memoizedProps,h.memoizedState=m.memoizedState,h.updateQueue=m.updateQueue,h.type=m.type,e=m.dependencies,h.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Qe(Pe,Pe.current&1|2),t.child}e=e.sibling}h.tail!==null&&be()>yn&&(t.flags|=128,s=!0,tl(h,!1),t.lanes=4194304)}else{if(!s)if(e=to(m),e!==null){if(t.flags|=128,s=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),tl(h,!0),h.tail===null&&h.tailMode==="hidden"&&!m.alternate&&!_e)return We(t),null}else 2*be()-h.renderingStartTime>yn&&n!==1073741824&&(t.flags|=128,s=!0,tl(h,!1),t.lanes=4194304);h.isBackwards?(m.sibling=t.child,t.child=m):(n=h.last,n!==null?n.sibling=m:t.child=m,h.last=m)}return h.tail!==null?(t=h.tail,h.rendering=t,h.tail=t.sibling,h.renderingStartTime=be(),t.sibling=null,n=Pe.current,Qe(Pe,s?n&1|2:n&1),t):(We(t),null);case 22:case 23:return Qs(),s=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==s&&(t.flags|=8192),s&&(t.mode&1)!==0?(ut&1073741824)!==0&&(We(t),t.subtreeFlags&6&&(t.flags|=8192)):We(t),null;case 24:return null;case 25:return null}throw Error(l(156,t.tag))}function Ed(e,t){switch(Ti(t),t.tag){case 1:return et(t.type)&&Vl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return fn(),Le(Je),Le(He),Yi(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Wi(t),null;case 13:if(Le(Pe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(l(340));sn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Le(Pe),null;case 4:return fn(),null;case 10:return Oi(t.type._context),null;case 22:case 23:return Qs(),null;case 24:return null;default:return null}}var uo=!1,qe=!1,Qd=typeof WeakSet=="function"?WeakSet:Set,oe=null;function pn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(s){Ne(e,t,s)}else n.current=null}function ys(e,t,n){try{n()}catch(s){Ne(e,t,s)}}var Mu=!1;function Fd(e,t){if(Qi=_l,e=ta(),xi(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var s=n.getSelection&&n.getSelection();if(s&&s.rangeCount!==0){n=s.anchorNode;var d=s.anchorOffset,h=s.focusNode;s=s.focusOffset;try{n.nodeType,h.nodeType}catch{n=null;break e}var m=0,C=-1,Q=-1,T=0,W=0,G=e,H=null;t:for(;;){for(var ee;G!==n||d!==0&&G.nodeType!==3||(C=m+d),G!==h||s!==0&&G.nodeType!==3||(Q=m+s),G.nodeType===3&&(m+=G.nodeValue.length),(ee=G.firstChild)!==null;)H=G,G=ee;for(;;){if(G===e)break t;if(H===n&&++T===d&&(C=m),H===h&&++W===s&&(Q=m),(ee=G.nextSibling)!==null)break;G=H,H=G.parentNode}G=ee}n=C===-1||Q===-1?null:{start:C,end:Q}}else n=null}n=n||{start:0,end:0}}else n=null;for(Fi={focusedElem:e,selectionRange:n},_l=!1,oe=t;oe!==null;)if(t=oe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,oe=e;else for(;oe!==null;){t=oe;try{var ce=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ce!==null){var ue=ce.memoizedProps,Te=ce.memoizedState,A=t.stateNode,L=A.getSnapshotBeforeUpdate(t.elementType===t.type?ue:wt(t.type,ue),Te);A.__reactInternalSnapshotBeforeUpdate=L}break;case 3:var I=t.stateNode.containerInfo;I.nodeType===1?I.textContent="":I.nodeType===9&&I.documentElement&&I.removeChild(I.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(l(163))}}catch(X){Ne(t,t.return,X)}if(e=t.sibling,e!==null){e.return=t.return,oe=e;break}oe=t.return}return ce=Mu,Mu=!1,ce}function rl(e,t,n){var s=t.updateQueue;if(s=s!==null?s.lastEffect:null,s!==null){var d=s=s.next;do{if((d.tag&e)===e){var h=d.destroy;d.destroy=void 0,h!==void 0&&ys(t,n,h)}d=d.next}while(d!==s)}}function fo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var s=n.create;n.destroy=s()}n=n.next}while(n!==t)}}function $s(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Cu(e){var t=e.alternate;t!==null&&(e.alternate=null,Cu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ft],delete t[Hn],delete t[Ai],delete t[ud],delete t[fd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Su(e){return e.tag===5||e.tag===3||e.tag===4}function Eu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Su(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ks(e,t,n){var s=e.tag;if(s===5||s===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ol));else if(s!==4&&(e=e.child,e!==null))for(ks(e,t,n),e=e.sibling;e!==null;)ks(e,t,n),e=e.sibling}function ms(e,t,n){var s=e.tag;if(s===5||s===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(s!==4&&(e=e.child,e!==null))for(ms(e,t,n),e=e.sibling;e!==null;)ms(e,t,n),e=e.sibling}var Ue=null,vt=!1;function gr(e,t,n){for(n=n.child;n!==null;)Qu(e,t,n),n=n.sibling}function Qu(e,t,n){if(Qt&&typeof Qt.onCommitFiberUnmount=="function")try{Qt.onCommitFiberUnmount(Cl,n)}catch{}switch(n.tag){case 5:qe||pn(n,t);case 6:var s=Ue,d=vt;Ue=null,gr(e,t,n),Ue=s,vt=d,Ue!==null&&(vt?(e=Ue,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ue.removeChild(n.stateNode));break;case 18:Ue!==null&&(vt?(e=Ue,n=n.stateNode,e.nodeType===8?Pi(e.parentNode,n):e.nodeType===1&&Pi(e,n),In(e)):Pi(Ue,n.stateNode));break;case 4:s=Ue,d=vt,Ue=n.stateNode.containerInfo,vt=!0,gr(e,t,n),Ue=s,vt=d;break;case 0:case 11:case 14:case 15:if(!qe&&(s=n.updateQueue,s!==null&&(s=s.lastEffect,s!==null))){d=s=s.next;do{var h=d,m=h.destroy;h=h.tag,m!==void 0&&((h&2)!==0||(h&4)!==0)&&ys(n,t,m),d=d.next}while(d!==s)}gr(e,t,n);break;case 1:if(!qe&&(pn(n,t),s=n.stateNode,typeof s.componentWillUnmount=="function"))try{s.props=n.memoizedProps,s.state=n.memoizedState,s.componentWillUnmount()}catch(C){Ne(n,t,C)}gr(e,t,n);break;case 21:gr(e,t,n);break;case 22:n.mode&1?(qe=(s=qe)||n.memoizedState!==null,gr(e,t,n),qe=s):gr(e,t,n);break;default:gr(e,t,n)}}function Fu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Qd),t.forEach(function(s){var d=jd.bind(null,e,s);n.has(s)||(n.add(s),s.then(d,d))})}}function Mt(e,t){var n=t.deletions;if(n!==null)for(var s=0;s<n.length;s++){var d=n[s];try{var h=e,m=t,C=m;e:for(;C!==null;){switch(C.tag){case 5:Ue=C.stateNode,vt=!1;break e;case 3:Ue=C.stateNode.containerInfo,vt=!0;break e;case 4:Ue=C.stateNode.containerInfo,vt=!0;break e}C=C.return}if(Ue===null)throw Error(l(160));Qu(h,m,d),Ue=null,vt=!1;var Q=d.alternate;Q!==null&&(Q.return=null),d.return=null}catch(T){Ne(d,t,T)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Lu(t,e),t=t.sibling}function Lu(e,t){var n=e.alternate,s=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Mt(t,e),Pt(e),s&4){try{rl(3,e,e.return),fo(3,e)}catch(ue){Ne(e,e.return,ue)}try{rl(5,e,e.return)}catch(ue){Ne(e,e.return,ue)}}break;case 1:Mt(t,e),Pt(e),s&512&&n!==null&&pn(n,n.return);break;case 5:if(Mt(t,e),Pt(e),s&512&&n!==null&&pn(n,n.return),e.flags&32){var d=e.stateNode;try{Mn(d,"")}catch(ue){Ne(e,e.return,ue)}}if(s&4&&(d=e.stateNode,d!=null)){var h=e.memoizedProps,m=n!==null?n.memoizedProps:h,C=e.type,Q=e.updateQueue;if(e.updateQueue=null,Q!==null)try{C==="input"&&h.type==="radio"&&h.name!=null&&nc(d,h),Yo(C,m);var T=Yo(C,h);for(m=0;m<Q.length;m+=2){var W=Q[m],G=Q[m+1];W==="style"?fc(d,G):W==="dangerouslySetInnerHTML"?ac(d,G):W==="children"?Mn(d,G):P(d,W,G,T)}switch(C){case"input":Vo(d,h);break;case"textarea":ic(d,h);break;case"select":var H=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!h.multiple;var ee=h.value;ee!=null?Hr(d,!!h.multiple,ee,!1):H!==!!h.multiple&&(h.defaultValue!=null?Hr(d,!!h.multiple,h.defaultValue,!0):Hr(d,!!h.multiple,h.multiple?[]:"",!1))}d[Hn]=h}catch(ue){Ne(e,e.return,ue)}}break;case 6:if(Mt(t,e),Pt(e),s&4){if(e.stateNode===null)throw Error(l(162));d=e.stateNode,h=e.memoizedProps;try{d.nodeValue=h}catch(ue){Ne(e,e.return,ue)}}break;case 3:if(Mt(t,e),Pt(e),s&4&&n!==null&&n.memoizedState.isDehydrated)try{In(t.containerInfo)}catch(ue){Ne(e,e.return,ue)}break;case 4:Mt(t,e),Pt(e);break;case 13:Mt(t,e),Pt(e),d=e.child,d.flags&8192&&(h=d.memoizedState!==null,d.stateNode.isHidden=h,!h||d.alternate!==null&&d.alternate.memoizedState!==null||(ws=be())),s&4&&Fu(e);break;case 22:if(W=n!==null&&n.memoizedState!==null,e.mode&1?(qe=(T=qe)||W,Mt(t,e),qe=T):Mt(t,e),Pt(e),s&8192){if(T=e.memoizedState!==null,(e.stateNode.isHidden=T)&&!W&&(e.mode&1)!==0)for(oe=e,W=e.child;W!==null;){for(G=oe=W;oe!==null;){switch(H=oe,ee=H.child,H.tag){case 0:case 11:case 14:case 15:rl(4,H,H.return);break;case 1:pn(H,H.return);var ce=H.stateNode;if(typeof ce.componentWillUnmount=="function"){s=H,n=H.return;try{t=s,ce.props=t.memoizedProps,ce.state=t.memoizedState,ce.componentWillUnmount()}catch(ue){Ne(s,n,ue)}}break;case 5:pn(H,H.return);break;case 22:if(H.memoizedState!==null){Au(G);continue}}ee!==null?(ee.return=H,oe=ee):Au(G)}W=W.sibling}e:for(W=null,G=e;;){if(G.tag===5){if(W===null){W=G;try{d=G.stateNode,T?(h=d.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none"):(C=G.stateNode,Q=G.memoizedProps.style,m=Q!=null&&Q.hasOwnProperty("display")?Q.display:null,C.style.display=uc("display",m))}catch(ue){Ne(e,e.return,ue)}}}else if(G.tag===6){if(W===null)try{G.stateNode.nodeValue=T?"":G.memoizedProps}catch(ue){Ne(e,e.return,ue)}}else if((G.tag!==22&&G.tag!==23||G.memoizedState===null||G===e)&&G.child!==null){G.child.return=G,G=G.child;continue}if(G===e)break e;for(;G.sibling===null;){if(G.return===null||G.return===e)break e;W===G&&(W=null),G=G.return}W===G&&(W=null),G.sibling.return=G.return,G=G.sibling}}break;case 19:Mt(t,e),Pt(e),s&4&&Fu(e);break;case 21:break;default:Mt(t,e),Pt(e)}}function Pt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Su(n)){var s=n;break e}n=n.return}throw Error(l(160))}switch(s.tag){case 5:var d=s.stateNode;s.flags&32&&(Mn(d,""),s.flags&=-33);var h=Eu(e);ms(e,h,d);break;case 3:case 4:var m=s.stateNode.containerInfo,C=Eu(e);ks(e,C,m);break;default:throw Error(l(161))}}catch(Q){Ne(e,e.return,Q)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ld(e,t,n){oe=e,_u(e)}function _u(e,t,n){for(var s=(e.mode&1)!==0;oe!==null;){var d=oe,h=d.child;if(d.tag===22&&s){var m=d.memoizedState!==null||uo;if(!m){var C=d.alternate,Q=C!==null&&C.memoizedState!==null||qe;C=uo;var T=qe;if(uo=m,(qe=Q)&&!T)for(oe=d;oe!==null;)m=oe,Q=m.child,m.tag===22&&m.memoizedState!==null?Nu(d):Q!==null?(Q.return=m,oe=Q):Nu(d);for(;h!==null;)oe=h,_u(h),h=h.sibling;oe=d,uo=C,qe=T}Pu(e)}else(d.subtreeFlags&8772)!==0&&h!==null?(h.return=d,oe=h):Pu(e)}}function Pu(e){for(;oe!==null;){var t=oe;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:qe||fo(5,t);break;case 1:var s=t.stateNode;if(t.flags&4&&!qe)if(n===null)s.componentDidMount();else{var d=t.elementType===t.type?n.memoizedProps:wt(t.type,n.memoizedProps);s.componentDidUpdate(d,n.memoizedState,s.__reactInternalSnapshotBeforeUpdate)}var h=t.updateQueue;h!==null&&Aa(t,h,s);break;case 3:var m=t.updateQueue;if(m!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Aa(t,m,n)}break;case 5:var C=t.stateNode;if(n===null&&t.flags&4){n=C;var Q=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":Q.autoFocus&&n.focus();break;case"img":Q.src&&(n.src=Q.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var T=t.alternate;if(T!==null){var W=T.memoizedState;if(W!==null){var G=W.dehydrated;G!==null&&In(G)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(l(163))}qe||t.flags&512&&$s(t)}catch(H){Ne(t,t.return,H)}}if(t===e){oe=null;break}if(n=t.sibling,n!==null){n.return=t.return,oe=n;break}oe=t.return}}function Au(e){for(;oe!==null;){var t=oe;if(t===e){oe=null;break}var n=t.sibling;if(n!==null){n.return=t.return,oe=n;break}oe=t.return}}function Nu(e){for(;oe!==null;){var t=oe;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{fo(4,t)}catch(Q){Ne(t,n,Q)}break;case 1:var s=t.stateNode;if(typeof s.componentDidMount=="function"){var d=t.return;try{s.componentDidMount()}catch(Q){Ne(t,d,Q)}}var h=t.return;try{$s(t)}catch(Q){Ne(t,h,Q)}break;case 5:var m=t.return;try{$s(t)}catch(Q){Ne(t,m,Q)}}}catch(Q){Ne(t,t.return,Q)}if(t===e){oe=null;break}var C=t.sibling;if(C!==null){C.return=t.return,oe=C;break}oe=t.return}}var _d=Math.ceil,po=N.ReactCurrentDispatcher,xs=N.ReactCurrentOwner,$t=N.ReactCurrentBatchConfig,Me=0,De=null,je=null,Ve=0,ut=0,hn=yr(0),ze=0,nl=null,Tr=0,ho=0,gs=0,ll=null,rt=null,ws=0,yn=1/0,ir=null,yo=!1,vs=null,wr=null,$o=!1,vr=null,ko=0,ol=0,Ms=null,mo=-1,xo=0;function Xe(){return(Me&6)!==0?be():mo!==-1?mo:mo=be()}function Mr(e){return(e.mode&1)===0?1:(Me&2)!==0&&Ve!==0?Ve&-Ve:pd.transition!==null?(xo===0&&(xo=Ec()),xo):(e=Ee,e!==0||(e=window.event,e=e===void 0?16:bc(e.type)),e)}function Ct(e,t,n,s){if(50<ol)throw ol=0,Ms=null,Error(l(185));Ln(e,n,s),((Me&2)===0||e!==De)&&(e===De&&((Me&2)===0&&(ho|=n),ze===4&&Cr(e,Ve)),nt(e,s),n===1&&Me===0&&(t.mode&1)===0&&(yn=be()+500,Zl&&kr()))}function nt(e,t){var n=e.callbackNode;p0(e,t);var s=Ql(e,e===De?Ve:0);if(s===0)n!==null&&Mc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=s&-s,e.callbackPriority!==t){if(n!=null&&Mc(n),t===1)e.tag===0?dd(bu.bind(null,e)):ga(bu.bind(null,e)),cd(function(){(Me&6)===0&&kr()}),n=null;else{switch(Qc(s)){case 1:n=ri;break;case 4:n=Cc;break;case 16:n=Ml;break;case 536870912:n=Sc;break;default:n=Ml}n=Uu(n,Iu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Iu(e,t){if(mo=-1,xo=0,(Me&6)!==0)throw Error(l(327));var n=e.callbackNode;if($n()&&e.callbackNode!==n)return null;var s=Ql(e,e===De?Ve:0);if(s===0)return null;if((s&30)!==0||(s&e.expiredLanes)!==0||t)t=go(e,s);else{t=s;var d=Me;Me|=2;var h=ju();(De!==e||Ve!==t)&&(ir=null,yn=be()+500,Rr(e,t));do try{Nd();break}catch(C){Tu(e,C)}while(!0);Di(),po.current=h,Me=d,je!==null?t=0:(De=null,Ve=0,t=ze)}if(t!==0){if(t===2&&(d=ni(e),d!==0&&(s=d,t=Cs(e,d))),t===1)throw n=nl,Rr(e,0),Cr(e,s),nt(e,be()),n;if(t===6)Cr(e,s);else{if(d=e.current.alternate,(s&30)===0&&!Pd(d)&&(t=go(e,s),t===2&&(h=ni(e),h!==0&&(s=h,t=Cs(e,h))),t===1))throw n=nl,Rr(e,0),Cr(e,s),nt(e,be()),n;switch(e.finishedWork=d,e.finishedLanes=s,t){case 0:case 1:throw Error(l(345));case 2:zr(e,rt,ir);break;case 3:if(Cr(e,s),(s&130023424)===s&&(t=ws+500-be(),10<t)){if(Ql(e,0)!==0)break;if(d=e.suspendedLanes,(d&s)!==s){Xe(),e.pingedLanes|=e.suspendedLanes&d;break}e.timeoutHandle=_i(zr.bind(null,e,rt,ir),t);break}zr(e,rt,ir);break;case 4:if(Cr(e,s),(s&4194240)===s)break;for(t=e.eventTimes,d=-1;0<s;){var m=31-mt(s);h=1<<m,m=t[m],m>d&&(d=m),s&=~h}if(s=d,s=be()-s,s=(120>s?120:480>s?480:1080>s?1080:1920>s?1920:3e3>s?3e3:4320>s?4320:1960*_d(s/1960))-s,10<s){e.timeoutHandle=_i(zr.bind(null,e,rt,ir),s);break}zr(e,rt,ir);break;case 5:zr(e,rt,ir);break;default:throw Error(l(329))}}}return nt(e,be()),e.callbackNode===n?Iu.bind(null,e):null}function Cs(e,t){var n=ll;return e.current.memoizedState.isDehydrated&&(Rr(e,t).flags|=256),e=go(e,t),e!==2&&(t=rt,rt=n,t!==null&&Ss(t)),e}function Ss(e){rt===null?rt=e:rt.push.apply(rt,e)}function Pd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var s=0;s<n.length;s++){var d=n[s],h=d.getSnapshot;d=d.value;try{if(!xt(h(),d))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Cr(e,t){for(t&=~gs,t&=~ho,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-mt(t),s=1<<n;e[n]=-1,t&=~s}}function bu(e){if((Me&6)!==0)throw Error(l(327));$n();var t=Ql(e,0);if((t&1)===0)return nt(e,be()),null;var n=go(e,t);if(e.tag!==0&&n===2){var s=ni(e);s!==0&&(t=s,n=Cs(e,s))}if(n===1)throw n=nl,Rr(e,0),Cr(e,t),nt(e,be()),n;if(n===6)throw Error(l(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,zr(e,rt,ir),nt(e,be()),null}function Es(e,t){var n=Me;Me|=1;try{return e(t)}finally{Me=n,Me===0&&(yn=be()+500,Zl&&kr())}}function jr(e){vr!==null&&vr.tag===0&&(Me&6)===0&&$n();var t=Me;Me|=1;var n=$t.transition,s=Ee;try{if($t.transition=null,Ee=1,e)return e()}finally{Ee=s,$t.transition=n,Me=t,(Me&6)===0&&kr()}}function Qs(){ut=hn.current,Le(hn)}function Rr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,sd(n)),je!==null)for(n=je.return;n!==null;){var s=n;switch(Ti(s),s.tag){case 1:s=s.type.childContextTypes,s!=null&&Vl();break;case 3:fn(),Le(Je),Le(He),Yi();break;case 5:Wi(s);break;case 4:fn();break;case 13:Le(Pe);break;case 19:Le(Pe);break;case 10:Oi(s.type._context);break;case 22:case 23:Qs()}n=n.return}if(De=e,je=e=Sr(e.current,null),Ve=ut=t,ze=0,nl=null,gs=ho=Tr=0,rt=ll=null,Nr!==null){for(t=0;t<Nr.length;t++)if(n=Nr[t],s=n.interleaved,s!==null){n.interleaved=null;var d=s.next,h=n.pending;if(h!==null){var m=h.next;h.next=d,s.next=m}n.pending=s}Nr=null}return e}function Tu(e,t){do{var n=je;try{if(Di(),ro.current=io,no){for(var s=Ae.memoizedState;s!==null;){var d=s.queue;d!==null&&(d.pending=null),s=s.next}no=!1}if(br=0,Be=Re=Ae=null,Xn=!1,Kn=0,xs.current=null,n===null||n.return===null){ze=1,nl=t,je=null;break}e:{var h=e,m=n.return,C=n,Q=t;if(t=Ve,C.flags|=32768,Q!==null&&typeof Q=="object"&&typeof Q.then=="function"){var T=Q,W=C,G=W.tag;if((W.mode&1)===0&&(G===0||G===11||G===15)){var H=W.alternate;H?(W.updateQueue=H.updateQueue,W.memoizedState=H.memoizedState,W.lanes=H.lanes):(W.updateQueue=null,W.memoizedState=null)}var ee=su(m);if(ee!==null){ee.flags&=-257,cu(ee,m,C,h,t),ee.mode&1&&iu(h,T,t),t=ee,Q=T;var ce=t.updateQueue;if(ce===null){var ue=new Set;ue.add(Q),t.updateQueue=ue}else ce.add(Q);break e}else{if((t&1)===0){iu(h,T,t),Fs();break e}Q=Error(l(426))}}else if(_e&&C.mode&1){var Te=su(m);if(Te!==null){(Te.flags&65536)===0&&(Te.flags|=256),cu(Te,m,C,h,t),zi(dn(Q,C));break e}}h=Q=dn(Q,C),ze!==4&&(ze=2),ll===null?ll=[h]:ll.push(h),h=m;do{switch(h.tag){case 3:h.flags|=65536,t&=-t,h.lanes|=t;var A=lu(h,Q,t);Pa(h,A);break e;case 1:C=Q;var L=h.type,I=h.stateNode;if((h.flags&128)===0&&(typeof L.getDerivedStateFromError=="function"||I!==null&&typeof I.componentDidCatch=="function"&&(wr===null||!wr.has(I)))){h.flags|=65536,t&=-t,h.lanes|=t;var X=ou(h,C,t);Pa(h,X);break e}}h=h.return}while(h!==null)}zu(n)}catch(fe){t=fe,je===n&&n!==null&&(je=n=n.return);continue}break}while(!0)}function ju(){var e=po.current;return po.current=io,e===null?io:e}function Fs(){(ze===0||ze===3||ze===2)&&(ze=4),De===null||(Tr&268435455)===0&&(ho&268435455)===0||Cr(De,Ve)}function go(e,t){var n=Me;Me|=2;var s=ju();(De!==e||Ve!==t)&&(ir=null,Rr(e,t));do try{Ad();break}catch(d){Tu(e,d)}while(!0);if(Di(),Me=n,po.current=s,je!==null)throw Error(l(261));return De=null,Ve=0,ze}function Ad(){for(;je!==null;)Ru(je)}function Nd(){for(;je!==null&&!l0();)Ru(je)}function Ru(e){var t=Ou(e.alternate,e,ut);e.memoizedProps=e.pendingProps,t===null?zu(e):je=t,xs.current=null}function zu(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Sd(n,t,ut),n!==null){je=n;return}}else{if(n=Ed(n,t),n!==null){n.flags&=32767,je=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ze=6,je=null;return}}if(t=t.sibling,t!==null){je=t;return}je=t=e}while(t!==null);ze===0&&(ze=5)}function zr(e,t,n){var s=Ee,d=$t.transition;try{$t.transition=null,Ee=1,Id(e,t,n,s)}finally{$t.transition=d,Ee=s}return null}function Id(e,t,n,s){do $n();while(vr!==null);if((Me&6)!==0)throw Error(l(327));n=e.finishedWork;var d=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(l(177));e.callbackNode=null,e.callbackPriority=0;var h=n.lanes|n.childLanes;if(h0(e,h),e===De&&(je=De=null,Ve=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||$o||($o=!0,Uu(Ml,function(){return $n(),null})),h=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||h){h=$t.transition,$t.transition=null;var m=Ee;Ee=1;var C=Me;Me|=4,xs.current=null,Fd(e,n),Lu(n,e),ed(Fi),_l=!!Qi,Fi=Qi=null,e.current=n,Ld(n),o0(),Me=C,Ee=m,$t.transition=h}else e.current=n;if($o&&($o=!1,vr=e,ko=d),h=e.pendingLanes,h===0&&(wr=null),c0(n.stateNode),nt(e,be()),t!==null)for(s=e.onRecoverableError,n=0;n<t.length;n++)d=t[n],s(d.value,{componentStack:d.stack,digest:d.digest});if(yo)throw yo=!1,e=vs,vs=null,e;return(ko&1)!==0&&e.tag!==0&&$n(),h=e.pendingLanes,(h&1)!==0?e===Ms?ol++:(ol=0,Ms=e):ol=0,kr(),null}function $n(){if(vr!==null){var e=Qc(ko),t=$t.transition,n=Ee;try{if($t.transition=null,Ee=16>e?16:e,vr===null)var s=!1;else{if(e=vr,vr=null,ko=0,(Me&6)!==0)throw Error(l(331));var d=Me;for(Me|=4,oe=e.current;oe!==null;){var h=oe,m=h.child;if((oe.flags&16)!==0){var C=h.deletions;if(C!==null){for(var Q=0;Q<C.length;Q++){var T=C[Q];for(oe=T;oe!==null;){var W=oe;switch(W.tag){case 0:case 11:case 15:rl(8,W,h)}var G=W.child;if(G!==null)G.return=W,oe=G;else for(;oe!==null;){W=oe;var H=W.sibling,ee=W.return;if(Cu(W),W===T){oe=null;break}if(H!==null){H.return=ee,oe=H;break}oe=ee}}}var ce=h.alternate;if(ce!==null){var ue=ce.child;if(ue!==null){ce.child=null;do{var Te=ue.sibling;ue.sibling=null,ue=Te}while(ue!==null)}}oe=h}}if((h.subtreeFlags&2064)!==0&&m!==null)m.return=h,oe=m;else e:for(;oe!==null;){if(h=oe,(h.flags&2048)!==0)switch(h.tag){case 0:case 11:case 15:rl(9,h,h.return)}var A=h.sibling;if(A!==null){A.return=h.return,oe=A;break e}oe=h.return}}var L=e.current;for(oe=L;oe!==null;){m=oe;var I=m.child;if((m.subtreeFlags&2064)!==0&&I!==null)I.return=m,oe=I;else e:for(m=L;oe!==null;){if(C=oe,(C.flags&2048)!==0)try{switch(C.tag){case 0:case 11:case 15:fo(9,C)}}catch(fe){Ne(C,C.return,fe)}if(C===m){oe=null;break e}var X=C.sibling;if(X!==null){X.return=C.return,oe=X;break e}oe=C.return}}if(Me=d,kr(),Qt&&typeof Qt.onPostCommitFiberRoot=="function")try{Qt.onPostCommitFiberRoot(Cl,e)}catch{}s=!0}return s}finally{Ee=n,$t.transition=t}}return!1}function Bu(e,t,n){t=dn(n,t),t=lu(e,t,1),e=xr(e,t,1),t=Xe(),e!==null&&(Ln(e,1,t),nt(e,t))}function Ne(e,t,n){if(e.tag===3)Bu(e,e,n);else for(;t!==null;){if(t.tag===3){Bu(t,e,n);break}else if(t.tag===1){var s=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(wr===null||!wr.has(s))){e=dn(n,e),e=ou(t,e,1),t=xr(t,e,1),e=Xe(),t!==null&&(Ln(t,1,e),nt(t,e));break}}t=t.return}}function bd(e,t,n){var s=e.pingCache;s!==null&&s.delete(t),t=Xe(),e.pingedLanes|=e.suspendedLanes&n,De===e&&(Ve&n)===n&&(ze===4||ze===3&&(Ve&130023424)===Ve&&500>be()-ws?Rr(e,0):gs|=n),nt(e,t)}function Du(e,t){t===0&&((e.mode&1)===0?t=1:(t=El,El<<=1,(El&130023424)===0&&(El=4194304)));var n=Xe();e=nr(e,t),e!==null&&(Ln(e,t,n),nt(e,n))}function Td(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Du(e,n)}function jd(e,t){var n=0;switch(e.tag){case 13:var s=e.stateNode,d=e.memoizedState;d!==null&&(n=d.retryLane);break;case 19:s=e.stateNode;break;default:throw Error(l(314))}s!==null&&s.delete(t),Du(e,n)}var Ou;Ou=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Je.current)tt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return tt=!1,Cd(e,t,n);tt=(e.flags&131072)!==0}else tt=!1,_e&&(t.flags&1048576)!==0&&wa(t,ql,t.index);switch(t.lanes=0,t.tag){case 2:var s=t.type;ao(e,t),e=t.pendingProps;var d=nn(t,He.current);un(t,n),d=Ki(null,t,s,e,d,n);var h=Ji();return t.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,et(s)?(h=!0,Hl(t)):h=!1,t.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Hi(t),d.updater=so,t.stateNode=d,d._reactInternals=t,os(t,s,e,n),t=as(null,t,s,!0,h,n)):(t.tag=0,_e&&h&&bi(t),Ge(null,t,d,n),t=t.child),t;case 16:s=t.elementType;e:{switch(ao(e,t),e=t.pendingProps,d=s._init,s=d(s._payload),t.type=s,d=t.tag=zd(s),e=wt(s,e),d){case 0:t=cs(null,t,s,e,n);break e;case 1:t=hu(null,t,s,e,n);break e;case 11:t=au(null,t,s,e,n);break e;case 14:t=uu(null,t,s,wt(s.type,e),n);break e}throw Error(l(306,s,""))}return t;case 0:return s=t.type,d=t.pendingProps,d=t.elementType===s?d:wt(s,d),cs(e,t,s,d,n);case 1:return s=t.type,d=t.pendingProps,d=t.elementType===s?d:wt(s,d),hu(e,t,s,d,n);case 3:e:{if(yu(t),e===null)throw Error(l(387));s=t.pendingProps,h=t.memoizedState,d=h.element,_a(e,t),eo(t,s,null,n);var m=t.memoizedState;if(s=m.element,h.isDehydrated)if(h={element:s,isDehydrated:!1,cache:m.cache,pendingSuspenseBoundaries:m.pendingSuspenseBoundaries,transitions:m.transitions},t.updateQueue.baseState=h,t.memoizedState=h,t.flags&256){d=dn(Error(l(423)),t),t=$u(e,t,s,n,d);break e}else if(s!==d){d=dn(Error(l(424)),t),t=$u(e,t,s,n,d);break e}else for(at=hr(t.stateNode.containerInfo.firstChild),ct=t,_e=!0,gt=null,n=Fa(t,null,s,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(sn(),s===d){t=or(e,t,n);break e}Ge(e,t,s,n)}t=t.child}return t;case 5:return Na(t),e===null&&Ri(t),s=t.type,d=t.pendingProps,h=e!==null?e.memoizedProps:null,m=d.children,Li(s,d)?m=null:h!==null&&Li(s,h)&&(t.flags|=32),pu(e,t),Ge(e,t,m,n),t.child;case 6:return e===null&&Ri(t),null;case 13:return ku(e,t,n);case 4:return Zi(t,t.stateNode.containerInfo),s=t.pendingProps,e===null?t.child=cn(t,null,s,n):Ge(e,t,s,n),t.child;case 11:return s=t.type,d=t.pendingProps,d=t.elementType===s?d:wt(s,d),au(e,t,s,d,n);case 7:return Ge(e,t,t.pendingProps,n),t.child;case 8:return Ge(e,t,t.pendingProps.children,n),t.child;case 12:return Ge(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(s=t.type._context,d=t.pendingProps,h=t.memoizedProps,m=d.value,Qe(Xl,s._currentValue),s._currentValue=m,h!==null)if(xt(h.value,m)){if(h.children===d.children&&!Je.current){t=or(e,t,n);break e}}else for(h=t.child,h!==null&&(h.return=t);h!==null;){var C=h.dependencies;if(C!==null){m=h.child;for(var Q=C.firstContext;Q!==null;){if(Q.context===s){if(h.tag===1){Q=lr(-1,n&-n),Q.tag=2;var T=h.updateQueue;if(T!==null){T=T.shared;var W=T.pending;W===null?Q.next=Q:(Q.next=W.next,W.next=Q),T.pending=Q}}h.lanes|=n,Q=h.alternate,Q!==null&&(Q.lanes|=n),Ui(h.return,n,t),C.lanes|=n;break}Q=Q.next}}else if(h.tag===10)m=h.type===t.type?null:h.child;else if(h.tag===18){if(m=h.return,m===null)throw Error(l(341));m.lanes|=n,C=m.alternate,C!==null&&(C.lanes|=n),Ui(m,n,t),m=h.sibling}else m=h.child;if(m!==null)m.return=h;else for(m=h;m!==null;){if(m===t){m=null;break}if(h=m.sibling,h!==null){h.return=m.return,m=h;break}m=m.return}h=m}Ge(e,t,d.children,n),t=t.child}return t;case 9:return d=t.type,s=t.pendingProps.children,un(t,n),d=ht(d),s=s(d),t.flags|=1,Ge(e,t,s,n),t.child;case 14:return s=t.type,d=wt(s,t.pendingProps),d=wt(s.type,d),uu(e,t,s,d,n);case 15:return fu(e,t,t.type,t.pendingProps,n);case 17:return s=t.type,d=t.pendingProps,d=t.elementType===s?d:wt(s,d),ao(e,t),t.tag=1,et(s)?(e=!0,Hl(t)):e=!1,un(t,n),ru(t,s,d),os(t,s,d,n),as(null,t,s,!0,e,n);case 19:return xu(e,t,n);case 22:return du(e,t,n)}throw Error(l(156,t.tag))};function Uu(e,t){return vc(e,t)}function Rd(e,t,n,s){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,n,s){return new Rd(e,t,n,s)}function Ls(e){return e=e.prototype,!(!e||!e.isReactComponent)}function zd(e){if(typeof e=="function")return Ls(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ne)return 11;if(e===ge)return 14}return 2}function Sr(e,t){var n=e.alternate;return n===null?(n=kt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function wo(e,t,n,s,d,h){var m=2;if(s=e,typeof e=="function")Ls(e)&&(m=1);else if(typeof e=="string")m=5;else e:switch(e){case V:return Br(n.children,d,h,t);case j:m=8,d|=8;break;case _:return e=kt(12,n,t,d|2),e.elementType=_,e.lanes=h,e;case ie:return e=kt(13,n,t,d),e.elementType=ie,e.lanes=h,e;case pe:return e=kt(19,n,t,d),e.elementType=pe,e.lanes=h,e;case me:return vo(n,d,h,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case z:m=10;break e;case Z:m=9;break e;case ne:m=11;break e;case ge:m=14;break e;case we:m=16,s=null;break e}throw Error(l(130,e==null?e:typeof e,""))}return t=kt(m,n,t,d),t.elementType=e,t.type=s,t.lanes=h,t}function Br(e,t,n,s){return e=kt(7,e,s,t),e.lanes=n,e}function vo(e,t,n,s){return e=kt(22,e,s,t),e.elementType=me,e.lanes=n,e.stateNode={isHidden:!1},e}function _s(e,t,n){return e=kt(6,e,null,t),e.lanes=n,e}function Ps(e,t,n){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Bd(e,t,n,s,d){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=li(0),this.expirationTimes=li(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=li(0),this.identifierPrefix=s,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function As(e,t,n,s,d,h,m,C,Q){return e=new Bd(e,t,n,C,Q),t===1?(t=1,h===!0&&(t|=8)):t=0,h=kt(3,null,null,t),e.current=h,h.stateNode=e,h.memoizedState={element:s,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Hi(h),e}function Dd(e,t,n){var s=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:J,key:s==null?null:""+s,children:e,containerInfo:t,implementation:n}}function Vu(e){if(!e)return $r;e=e._reactInternals;e:{if(Fr(e)!==e||e.tag!==1)throw Error(l(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(et(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(l(171))}if(e.tag===1){var n=e.type;if(et(n))return ma(e,n,t)}return t}function Hu(e,t,n,s,d,h,m,C,Q){return e=As(n,s,!0,e,d,h,m,C,Q),e.context=Vu(null),n=e.current,s=Xe(),d=Mr(n),h=lr(s,d),h.callback=t??null,xr(n,h,d),e.current.lanes=d,Ln(e,d,s),nt(e,s),e}function Mo(e,t,n,s){var d=t.current,h=Xe(),m=Mr(d);return n=Vu(n),t.context===null?t.context=n:t.pendingContext=n,t=lr(h,m),t.payload={element:e},s=s===void 0?null:s,s!==null&&(t.callback=s),e=xr(d,t,m),e!==null&&(Ct(e,d,m,h),Jl(e,d,m)),m}function Co(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Zu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ns(e,t){Zu(e,t),(e=e.alternate)&&Zu(e,t)}function Od(){return null}var Wu=typeof reportError=="function"?reportError:function(e){console.error(e)};function Is(e){this._internalRoot=e}So.prototype.render=Is.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(l(409));Mo(e,t,null,null)},So.prototype.unmount=Is.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;jr(function(){Mo(null,e,null,null)}),t[Jt]=null}};function So(e){this._internalRoot=e}So.prototype.unstable_scheduleHydration=function(e){if(e){var t=_c();e={blockedOn:null,target:e,priority:t};for(var n=0;n<fr.length&&t!==0&&t<fr[n].priority;n++);fr.splice(n,0,e),n===0&&Nc(e)}};function bs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Eo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function qu(){}function Ud(e,t,n,s,d){if(d){if(typeof s=="function"){var h=s;s=function(){var T=Co(m);h.call(T)}}var m=Hu(t,s,e,0,null,!1,!1,"",qu);return e._reactRootContainer=m,e[Jt]=m.current,Un(e.nodeType===8?e.parentNode:e),jr(),m}for(;d=e.lastChild;)e.removeChild(d);if(typeof s=="function"){var C=s;s=function(){var T=Co(Q);C.call(T)}}var Q=As(e,0,!1,null,null,!1,!1,"",qu);return e._reactRootContainer=Q,e[Jt]=Q.current,Un(e.nodeType===8?e.parentNode:e),jr(function(){Mo(t,Q,n,s)}),Q}function Qo(e,t,n,s,d){var h=n._reactRootContainer;if(h){var m=h;if(typeof d=="function"){var C=d;d=function(){var Q=Co(m);C.call(Q)}}Mo(t,m,e,d)}else m=Ud(n,t,e,d,s);return Co(m)}Fc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Fn(t.pendingLanes);n!==0&&(oi(t,n|1),nt(t,be()),(Me&6)===0&&(yn=be()+500,kr()))}break;case 13:jr(function(){var s=nr(e,1);if(s!==null){var d=Xe();Ct(s,e,1,d)}}),Ns(e,1)}},ii=function(e){if(e.tag===13){var t=nr(e,134217728);if(t!==null){var n=Xe();Ct(t,e,134217728,n)}Ns(e,134217728)}},Lc=function(e){if(e.tag===13){var t=Mr(e),n=nr(e,t);if(n!==null){var s=Xe();Ct(n,e,t,s)}Ns(e,t)}},_c=function(){return Ee},Pc=function(e,t){var n=Ee;try{return Ee=e,t()}finally{Ee=n}},Ko=function(e,t,n){switch(t){case"input":if(Vo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var s=n[t];if(s!==e&&s.form===e.form){var d=Ul(s);if(!d)throw Error(l(90));Ke(s),Vo(s,d)}}}break;case"textarea":ic(e,n);break;case"select":t=n.value,t!=null&&Hr(e,!!n.multiple,t,!1)}},yc=Es,$c=jr;var Vd={usingClientEntryPoint:!1,Events:[Zn,tn,Ul,pc,hc,Es]},il={findFiberByHostInstance:Lr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Hd={bundleType:il.bundleType,version:il.version,rendererPackageName:il.rendererPackageName,rendererConfig:il.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:N.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=gc(e),e===null?null:e.stateNode},findFiberByHostInstance:il.findFiberByHostInstance||Od,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fo.isDisabled&&Fo.supportsFiber)try{Cl=Fo.inject(Hd),Qt=Fo}catch{}}return lt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Vd,lt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!bs(t))throw Error(l(200));return Dd(e,t,null,n)},lt.createRoot=function(e,t){if(!bs(e))throw Error(l(299));var n=!1,s="",d=Wu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(d=t.onRecoverableError)),t=As(e,1,!1,null,null,n,!1,s,d),e[Jt]=t.current,Un(e.nodeType===8?e.parentNode:e),new Is(t)},lt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(l(188)):(e=Object.keys(e).join(","),Error(l(268,e)));return e=gc(t),e=e===null?null:e.stateNode,e},lt.flushSync=function(e){return jr(e)},lt.hydrate=function(e,t,n){if(!Eo(t))throw Error(l(200));return Qo(null,e,t,!0,n)},lt.hydrateRoot=function(e,t,n){if(!bs(e))throw Error(l(405));var s=n!=null&&n.hydratedSources||null,d=!1,h="",m=Wu;if(n!=null&&(n.unstable_strictMode===!0&&(d=!0),n.identifierPrefix!==void 0&&(h=n.identifierPrefix),n.onRecoverableError!==void 0&&(m=n.onRecoverableError)),t=Hu(t,null,e,1,n??null,d,!1,h,m),e[Jt]=t.current,Un(e),s)for(e=0;e<s.length;e++)n=s[e],d=n._getVersion,d=d(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,d]:t.mutableSourceEagerHydrationData.push(n,d);return new So(t)},lt.render=function(e,t,n){if(!Eo(t))throw Error(l(200));return Qo(null,e,t,!1,n)},lt.unmountComponentAtNode=function(e){if(!Eo(e))throw Error(l(40));return e._reactRootContainer?(jr(function(){Qo(null,null,e,!1,function(){e._reactRootContainer=null,e[Jt]=null})}),!0):!1},lt.unstable_batchedUpdates=Es,lt.unstable_renderSubtreeIntoContainer=function(e,t,n,s){if(!Eo(n))throw Error(l(200));if(e==null||e._reactInternals===void 0)throw Error(l(38));return Qo(e,t,n,!1,s)},lt.version="18.3.1-next-f1338f8080-20240426",lt}var rf;function Jd(){if(rf)return Rs.exports;rf=1;function c(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c)}catch(r){console.error(r)}}return c(),Rs.exports=Kd(),Rs.exports}var nf;function ep(){if(nf)return Lo;nf=1;var c=Jd();return Lo.createRoot=c.createRoot,Lo.hydrateRoot=c.hydrateRoot,Lo}var tp=ep(),Ds={},Os={},lf;function Ur(){return lf||(lf=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.AssumptionError=c.AssumptionId=void 0,c.checkValidity=l,c.checkPositivity=o,c.log=i,c.AssumptionId={VALIDITY:"validity",DOMAIN:"domain",POSITIVITY:"positivity",SPARITY:"sparity"};class r extends Error{constructor(a){const u=`${a.id}(${a.subject})`;super(u),this.name="AssumptionError",this.violation=a}static validity(a){return new r({id:c.AssumptionId.VALIDITY,subject:a})}static positivity(a){return new r({id:c.AssumptionId.POSITIVITY,subject:a})}static sparity(a){return new r({id:c.AssumptionId.SPARITY,subject:a})}static domain(a){return new r({id:c.AssumptionId.DOMAIN,subject:a})}}c.AssumptionError=r;function l(f,a){if(f.length===0||!f.every(u=>Number.isFinite(u)))throw r.validity(a)}function o(f,a){if(f.some(u=>u<=0))throw r.positivity(a)}function i(f,a){const u=new Array(f.length);for(let p=0;p<f.length;p++){if(f[p]<=0)throw r.positivity(a);u[p]=Math.log(f[p])}return u}})(Os)),Os}var Us={},_o={},cl={},kn={},of;function rp(){if(of)return kn;of=1,Object.defineProperty(kn,"__esModule",{value:!0}),kn.Xoshiro256PlusPlus=void 0,kn.fnv1aHash=a;const c=0xffffffffffffffffn;function r(u,p){return(u<<p|u>>64n-p)&c}class l{constructor(p){this.state=p&c}next(){this.state=this.state+0x9e3779b97f4a7c15n&c;let p=this.state;return p=(p^p>>30n)*0xbf58476d1ce4e5b9n&c,p=(p^p>>27n)*0x94d049bb133111ebn&c,(p^p>>31n)&c}}class o{constructor(p){const y=new l(p);this.state=[y.next(),y.next(),y.next(),y.next()]}nextU64(){const p=this.state,y=r(p[0]+p[3]&c,23n)+p[0]&c,$=p[1]<<17n&c;return p[2]^=p[0],p[3]^=p[1],p[1]^=p[2],p[0]^=p[3],p[2]^=$,p[3]=r(p[3],45n),y}uniformFloat(){const p=this.nextU64();return Number(p>>11n)*(1/Number(1n<<53n))}uniformFloatRange(p,y){return p>=y?p:p+(y-p)*this.uniformFloat()}uniformInt(p,y){if(p>=y)return p;const $=y-p;if($>0xffffffffffffffffn)throw new RangeError("uniform_int: range overflow (max - min exceeds u64)");return p+this.nextU64()%$}uniformBool(){return this.uniformFloat()<.5}}kn.Xoshiro256PlusPlus=o;const i=0xcbf29ce484222325n,f=0x00000100000001b3n;function a(u){let p=i;const $=new TextEncoder().encode(u);for(const g of $)p^=BigInt(g),p=p*f&c;return p}return kn}var sf;function Ro(){if(sf)return cl;sf=1,Object.defineProperty(cl,"__esModule",{value:!0}),cl.Rng=void 0;const c=rp();class r{constructor(o){let i;o===void 0?i=BigInt(Date.now()):typeof o=="string"?i=(0,c.fnv1aHash)(o):typeof o=="bigint"?i=BigInt.asIntN(64,o):i=BigInt.asIntN(64,BigInt(o)),this.inner=new c.Xoshiro256PlusPlus(i)}uniformFloat(){return this.inner.uniformFloat()}uniformFloatRange(o,i){return this.inner.uniformFloatRange(o,i)}uniformInt(o,i){const f=this.inner.uniformInt(BigInt(o),BigInt(i));return Number(f)}uniformBigInt(o,i){return this.inner.uniformInt(o,i)}uniformBool(){return this.inner.uniformBool()}sample(o,i){if(i<=0)throw new Error("sample: k must be positive");if(o.length===0)throw new Error("sample: cannot sample from empty array");const f=o.length;if(i>=f)return[...o];const a=[];let u=i;for(let p=0;p<f&&u>0;p++){const y=f-p;this.uniformFloat()*y<u&&(a.push(o[p]),u--)}return a}resample(o,i){if(i<=0)throw new Error("resample: k must be positive");const f=o.length;if(f===0)throw new Error("resample: cannot resample from empty array");const a=[];for(let u=0;u<i;u++){const p=this.uniformInt(0,f);a.push(o[p])}return a}shuffle(o){if(o.length===0)throw new Error("shuffle: cannot shuffle empty array");const i=[...o],f=i.length;for(let a=f-1;a>0;a--){const u=this.uniformInt(0,a+1);[i[a],i[u]]=[i[u],i[a]]}return i}}return cl.Rng=r,cl}var cf;function np(){if(cf)return _o;cf=1,Object.defineProperty(_o,"__esModule",{value:!0}),_o.fastCenter=a;const c=Ro(),r=0xcbf29ce484222325n,l=0x00000100000001b3n,o=(1n<<64n)-1n;function i(u){const p=new ArrayBuffer(8);new Float64Array(p)[0]=u;const y=new DataView(p);return BigInt(y.getUint32(4,!0))<<32n|BigInt(y.getUint32(0,!0))}function f(u){let p=r;for(const y of u){const $=i(y);for(let g=0;g<8;g++)p^=$>>BigInt(g*8)&0xffn,p=p*l&o}return BigInt.asIntN(64,p)}function a(u){const p=u.length;if(p===0)throw new Error("Input array cannot be empty");if(p===1)return u[0];if(p===2)return(u[0]+u[1])/2;const y=new c.Rng(f(u)),$=[...u].sort((P,N)=>P-N),g=Number(BigInt(p)*BigInt(p+1)/2n),w=Math.floor((g+1)/2),v=Math.floor((g+2)/2),M=Array.from({length:p},(P,N)=>N+1),k=Array(p).fill(p);let x=$[Math.floor((p-1)/2)]+$[Math.floor(p/2)],E=g,b=0;for(;;){let P=0,N=p;const B=[];for(let V=1;V<=p;V++){for(;N>=V&&$[V-1]+$[N-1]>=x;)N--;const j=N>=V?N-V+1:0;B.push(j),P+=j}if(P===b){let V=1/0,j=-1/0;for(let _=0;_<p;_++){if(M[_]>k[_])continue;const z=$[_],Z=$[M[_]-1]+z,ne=$[k[_]-1]+z;V=Math.min(V,Z),j=Math.max(j,ne)}if(x=(V+j)/2,(x<=V||x>j)&&(x=j),V===j||E<=2)return x/2;continue}if(P===w||P===v-1){let V=-1/0,j=1/0;for(let _=0;_<p;_++){const z=B[_],Z=$[_],ne=p-_;if(z>0){const ie=_+z,pe=Z+$[ie-1];V=Math.max(V,pe)}if(z<ne){const ie=_+z+1,pe=Z+$[ie-1];j=Math.min(j,pe)}}return w<v?(j+V)/4:(P===w?V:j)/2}if(P<w)for(let V=0;V<p;V++)M[V]=V+B[V]+1;else for(let V=0;V<p;V++)k[V]=V+B[V];b=P,E=0;for(let V=0;V<p;V++){const j=k[V]-M[V]+1;j>0&&(E+=j)}if(E>2){const V=y.uniformInt(0,E);let j=0,_=0;for(let Z=0;Z<p;Z++){const ne=k[Z]-M[Z]+1;if(ne>0){if(V<j+ne){_=Z;break}j+=ne}}const z=Math.floor((M[_]+k[_])/2);x=$[_]+$[z-1]}else{let V=1/0,j=-1/0;for(let _=0;_<p;_++){if(M[_]>k[_])continue;const z=$[_],Z=$[M[_]-1]+z,ne=$[k[_]-1]+z;V=Math.min(V,Z),j=Math.max(j,ne)}if(x=(V+j)/2,(x<=V||x>j)&&(x=j),V===j)return x/2}}}return _o}var Po={},af;function lp(){if(af)return Po;af=1,Object.defineProperty(Po,"__esModule",{value:!0}),Po.fastSpread=a;const c=Ro(),r=0xcbf29ce484222325n,l=0x00000100000001b3n,o=(1n<<64n)-1n;function i(u){const p=new ArrayBuffer(8);new Float64Array(p)[0]=u;const y=new DataView(p);return BigInt(y.getUint32(4,!0))<<32n|BigInt(y.getUint32(0,!0))}function f(u){let p=r;for(const y of u){const $=i(y);for(let g=0;g<8;g++)p^=$>>BigInt(g*8)&0xffn,p=p*l&o}return BigInt.asIntN(64,p)}function a(u){const p=u.length;if(p===0)throw new Error("Input array cannot be empty");if(p===1)return 0;if(p===2)return Math.abs(u[1]-u[0]);const y=new c.Rng(f(u)),$=[...u].sort((P,N)=>P-N),g=Number(BigInt(p)*BigInt(p-1)/2n),w=Math.floor((g+1)/2),v=Math.floor((g+2)/2),M=Array.from({length:p},(P,N)=>Math.min(N+1,p)),k=Array(p).fill(p-1);for(let P=0;P<p;P++)M[P]>k[P]&&(M[P]=1,k[P]=0);const x=Array(p).fill(0);let E=$[Math.floor(p/2)]-$[Math.floor((p-1)/2)],b=-1;for(;;){let P=0,N=-1/0,B=1/0,J=1;for(let _=0;_<p-1;_++){for(J<_+1&&(J=_+1);J<p&&$[J]-$[_]<E;)J++;const z=Math.max(0,J-(_+1));if(x[_]=z,P+=z,z>0){const Z=$[J-1]-$[_];N=Math.max(N,Z)}if(J<p){const Z=$[J]-$[_];B=Math.min(B,Z)}}if(P===w||P===v-1)return w<v?.5*(N+B):P===w?N:B;if(P===b){let _=1/0,z=-1/0,Z=0;for(let ie=0;ie<p-1;ie++){const pe=M[ie],ge=k[ie];if(pe>ge)continue;const we=$[pe]-$[ie],me=$[ge]-$[ie];_=Math.min(_,we),z=Math.max(z,me),Z+=ge-pe+1}if(Z<=0)return w<v?.5*(N+B):P>=w?N:B;if(z<=_)return _;const ne=.5*(_+z);E=ne>_&&ne<=z?ne:z,b=P;continue}if(P<w)for(let _=0;_<p-1;_++){const z=_+1+x[_];z>M[_]&&(M[_]=z),M[_]>k[_]&&(M[_]=1,k[_]=0)}else for(let _=0;_<p-1;_++){const z=_+x[_];z<k[_]&&(k[_]=z),k[_]<_+1&&(M[_]=1,k[_]=0)}b=P;let j=0;for(let _=0;_<p-1;_++)M[_]<=k[_]&&(j+=k[_]-M[_]+1);if(j<=2){let _=1/0,z=-1/0;for(let Z=0;Z<p-1;Z++){if(M[Z]>k[Z])continue;const ne=$[M[Z]]-$[Z],ie=$[k[Z]]-$[Z];_=Math.min(_,ne),z=Math.max(z,ie)}return j<=0?w<v?.5*(N+B):P>=w?N:B:w<v?.5*(_+z):Math.abs(w-1-P)<=Math.abs(P-w)?_:z}else{const _=y.uniformInt(0,j);let z=0,Z=0;for(Z=0;Z<p-1;Z++){if(M[Z]>k[Z])continue;const ie=k[Z]-M[Z]+1;if(_<z+ie)break;z+=ie}const ne=Math.floor((M[Z]+k[Z])/2);E=$[ne]-$[Z]}}}return Po}var al={},uf;function op(){if(uf)return al;uf=1,Object.defineProperty(al,"__esModule",{value:!0}),al.fastShift=r,al.fastRatio=f;const c=Ur();function r(a,u,p,y=!1){if(!a||!u||!p)throw new Error("All inputs must be non-null");if(a.length===0||u.length===0)throw new Error("x and y must be non-empty");for(const N of p)if(isNaN(N)||N<0||N>1)throw new Error("Probabilities must be within [0, 1]");const $=y?a:[...a].sort((N,B)=>N-B),g=y?u:[...u].sort((N,B)=>N-B);for(const N of $)if(isNaN(N))throw new Error("NaN values found in x");for(const N of g)if(isNaN(N))throw new Error("NaN values found in y");const w=$.length,v=g.length,M=BigInt(w)*BigInt(v),k=new Set,x=[],E=Number(M);for(let N=0;N<p.length;N++){const B=1+Number(M-1n)*p[N];let J=Math.floor(B),V=Math.ceil(B);const j=B-J;J<1&&(J=1),V>E&&(V=E),x.push({lowerRank:J,upperRank:V,weight:j}),k.add(J),k.add(V)}const b=new Map;for(const N of Array.from(k).sort((B,J)=>B-J))b.set(N,l($,g,N));const P=[];for(const{lowerRank:N,upperRank:B,weight:J}of x){const V=b.get(N),j=b.get(B);P.push(J===0?V:(1-J)*V+J*j)}return P}function l(a,u,p){const y=a.length,$=u.length,g=Number(BigInt(y)*BigInt($));if(p<1||p>g)throw new Error(`k must be between 1 and ${g}`);let w=a[0]-u[$-1],v=a[y-1]-u[0];if(isNaN(w)||isNaN(v))throw new Error("NaN in input values");const M=128;let k=-1/0,x=1/0;for(let E=0;E<M&&w!==v;E++){const b=i(w,v),{countLessOrEqual:P,closestBelow:N,closestAbove:B}=o(a,u,b);if(N===B)return N;if(w===k&&v===x)return P>=p?N:B;k=w,x=v,P>=p?v=N:w=B}if(w!==v)throw new Error("Convergence failure (pathological input)");return w}function o(a,u,p){const y=a.length,$=u.length;let g=0,w=-1/0,v=1/0,M=0;for(let k=0;k<y;k++){for(;M<$&&a[k]-u[M]>p;)M++;if(g+=$-M,M<$){const x=a[k]-u[M];x>w&&(w=x)}if(M>0){const x=a[k]-u[M-1];x<v&&(v=x)}}return isFinite(w)||(w=a[0]-u[$-1]),isFinite(v)||(v=a[y-1]-u[0]),{countLessOrEqual:g,closestBelow:w,closestAbove:v}}function i(a,u){return a+(u-a)*.5}function f(a,u,p,y=!1){if(!a||!u||!p)throw new Error("All inputs must be non-null");if(a.length===0||u.length===0)throw new Error("x and y must be non-empty");const $=(0,c.log)(a,"x"),g=(0,c.log)(u,"y");return r($,g,p,y).map(v=>Math.exp(v))}return al}var Ao={},No={},ff;function Zf(){if(ff)return No;ff=1,Object.defineProperty(No,"__esModule",{value:!0}),No.gaussCdf=c;function c(r){let l;if(Math.abs(r)<1e-9)l=0;else{let o=Math.abs(r)/2;if(o>=3)l=1;else if(o<1){const i=o*o;l=((((((((.000124818987*i-.001075204047)*i+.005198775019)*i-.019198292004)*i+.059054035642)*i-.151968751364)*i+.319152932694)*i-.5319230073)*i+.797884560593)*o*2}else o=o-2,l=(((((((((((((-45255659e-12*o+.00015252929)*o-19538132e-12)*o-.000676904986)*o+.001390604284)*o-.00079462082)*o-.002034254874)*o+.006549791214)*o-.010557625006)*o+.011630447319)*o-.009279453341)*o+.005353579108)*o-.002141268741)*o+.000535310849)*o+.999936657524}return r>0?(l+1)/2:(1-l)/2}return No}var ul={},df;function zo(){if(df)return ul;df=1,Object.defineProperty(ul,"__esModule",{value:!0}),ul.minAchievableMisrateOneSample=r,ul.minAchievableMisrateTwoSample=l;const c=Ur();function r(i){if(i<=0)throw c.AssumptionError.domain("x");return Math.pow(2,1-i)}function l(i,f){if(i<=0)throw c.AssumptionError.domain("x");if(f<=0)throw c.AssumptionError.domain("y");return 2/o(i+f,i)}function o(i,f){if(f>i)return 0;if(f===0||f===i)return 1;f=Math.min(f,i-f);let a=1;for(let u=0;u<f;u++)a=a*(i-u)/(u+1);return a}return ul}var pf;function ip(){if(pf)return Ao;pf=1,Object.defineProperty(Ao,"__esModule",{value:!0}),Ao.pairwiseMargin=f;const c=Ur(),r=Zf(),l=zo(),o=400,i=65;function f(k,x,E){if(k<=0)throw c.AssumptionError.domain("x");if(x<=0)throw c.AssumptionError.domain("y");if(E<0||E>1||Number.isNaN(E))throw c.AssumptionError.domain("misrate");const b=(0,l.minAchievableMisrateTwoSample)(k,x);if(E<b)throw c.AssumptionError.domain("misrate");return k+x<=o?a(k,x,E):u(k,x,E)}function a(k,x,E){return p(k,x,E/2)*2}function u(k,x,E){return y(k,x,E/2)*2}function p(k,x,E){const b=k+x<i?g(k+x,x):w(k+x,x),P=[1],N=[0];let B=0,J=1/b;if(J>=E)return 0;for(;;){if(B++,N.length<=B){let j=0;for(let _=1;_<=k;_++)B%_===0&&B>=_&&(j+=_);for(let _=x+1;_<=x+k;_++)B%_===0&&B>=_&&(j-=_);N.push(j)}let V=0;for(let j=0;j<B;j++)V+=P[j]*N[B-j];if(V/=B,P.push(V),J+=V/b,J>=E)return B;if(V===0)break}return P.length-1}function y(k,x,E){let b=0,P=k*x;for(;b<P-1;){const N=Math.floor((b+P)/2);$(k,x,N)<E?b=N:P=N}return $(k,x,P)<E?P:b}function $(k,x,E){const b=k*x/2,P=Math.sqrt(k*x*(k+x+1)/12),N=(E-b-.5)/P,B=Math.exp(-N*N/2)/Math.sqrt(2*Math.PI),J=(0,r.gaussCdf)(N),V=k*k,j=V*k,_=V*V,z=x*x,Z=z*x,ne=z*z,ie=k*x*(k+x+1)/12,pe=k*x*(k+x+1)*(5*x*k*(x+k)-2*(z+V)+3*x*k-2*(k+x))/240,ge=k*x*(k+x+1)*(35*z*V*(z+V)+70*Z*j-42*x*k*(Z+j)-14*z*V*(k+x)+16*(_+ne)-52*k*x*(V+z)-43*V*z+32*(Z+j)+14*x*k*(k+x)+8*(V+z)+16*k*x-8*(k+x))/4032,we=ie*ie,me=we*ie,q=pe/we,te=(q-3)/24,K=(ge/me-15*q+30)/720,F=35*(q-3)*(q-3)/40320,R=N*N,re=R*N,le=re*R,de=le*R,he=-B*(re-3*N),Y=-B*(le-10*re+15*N),se=-B*(de-21*le+105*re-105*N),ae=J+te*he+K*Y+F*se;return Math.max(0,Math.min(1,ae))}function g(k,x){if(x>k)return 0;if(x===0||x===k)return 1;x=Math.min(x,k-x);let E=1;for(let b=0;b<x;b++)E=E*(k-b)/(b+1);return E}function w(k,x){if(x>k)return 0;if(x===0||x===k)return 1;x=Math.min(x,k-x);const E=v(k)-v(x)-v(k-x);return Math.exp(E)}function v(k){if(k===0||k===1)return 0;const x=k+1;return x<1e-5?0:x<1?M(x+3)-Math.log(x*(x+1)*(x+2)):x<2?M(x+2)-Math.log(x*(x+1)):x<3?M(x+1)-Math.log(x):M(x)}function M(k){let x=k*Math.log(k)-k+Math.log(2*Math.PI/k)/2;const E=1/6,b=-1/30,P=1/42,N=-1/30,B=5/66,J=k*k,V=J*k,j=V*J,_=j*J,z=_*J;return x+=E/(2*k)+b/(12*V)+P/(30*j)+N/(56*_)+B/(90*z),x}return Ao}var Io={},hf;function sp(){if(hf)return Io;hf=1,Object.defineProperty(Io,"__esModule",{value:!0}),Io.signedRankMargin=i;const c=Zf(),r=zo(),l=Ur(),o=63;function i($,g){if($<=0)throw l.AssumptionError.domain("x");if(isNaN(g)||g<0||g>1)throw l.AssumptionError.domain("misrate");const w=(0,r.minAchievableMisrateOneSample)($);if(g<w)throw l.AssumptionError.domain("misrate");return $<=o?f($,g):u($,g)}function f($,g){return a($,g/2)*2}function a($,g){const w=BigInt(1)<<BigInt($),v=Math.floor($*($+1)/2),M=new Array(v+1).fill(BigInt(0));M[0]=BigInt(1);for(let E=1;E<=$;E++){const b=Math.min(Math.floor(E*(E+1)/2),v);for(let P=b;P>=E;P--)M[P]=M[P]+M[P-E]}const k=BigInt(10)**BigInt(18);let x=BigInt(0);for(let E=0;E<=v;E++)if(x=x+M[E],Number(x*k/w)/Number(k)>=g)return E;return v}function u($,g){return p($,g/2)*2}function p($,g){const w=Math.floor($*($+1)/2);let v=0,M=w;for(;v<M-1;){const k=Math.floor((v+M)/2);y($,k)<g?v=k:M=k}return y($,M)<g?M:v}function y($,g){const w=$*($+1)/4,v=$*($+1)*(2*$+1)/24,M=Math.sqrt(v),k=(g-w+.5)/M,x=Math.exp(-k*k/2)/Math.sqrt(2*Math.PI),E=(0,c.gaussCdf)(k),P=-$*($+1)*(2*$+1)*(3*$*$+3*$-1)/240/(24*v*v),B=k*k*k,J=-x*(B-3*k),V=E+P*J;return Math.max(0,Math.min(1,V))}return Io}var bo={},yf;function cp(){if(yf)return bo;yf=1,Object.defineProperty(bo,"__esModule",{value:!0}),bo.signMarginRandomized=l;const c=zo(),r=Ur();function l(a,u,p){if(a<=0)throw r.AssumptionError.domain("x");if(isNaN(u)||u<0||u>1)throw r.AssumptionError.domain("misrate");const y=(0,c.minAchievableMisrateOneSample)(a);if(u<y)throw r.AssumptionError.domain("misrate");const $=u/2;if($<=0)return 0;if($>=1)return a*2;const[g,w,v]=o(a,$),M=Math.log($),k=M>w?f(M,w):-1/0;let x=isFinite(v)&&isFinite(k)?Math.exp(k-v):0;return x=Math.max(0,Math.min(1,x)),(p.uniformFloat()<x?g+1:g)*2}function o(a,u){const p=Math.log(u);let y=-a*Math.LN2,$=y,g=0;if($>p)return[0,$,y];for(let w=1;w<=a;w++){const v=y+Math.log(a-w+1)-Math.log(w),M=i($,v);if(M>p)return[g,$,v];g=w,y=v,$=M}return[g,$,-1/0]}function i(a,u){if(a===-1/0)return u;if(u===-1/0)return a;const p=Math.max(a,u);return p+Math.log(Math.exp(a-p)+Math.exp(u-p))}function f(a,u){if(u===-1/0)return a;const p=Math.exp(u-a);return p>=1?-1/0:a+Math.log(1-p)}return bo}var To={},$f;function ap(){if($f)return To;$f=1,Object.defineProperty(To,"__esModule",{value:!0}),To.fastCenterQuantileBounds=o;const c=1e-14;function r(i,f){const a=i.length;let u=0,p=a-1;for(let y=0;y<a;y++){const $=2*f-i[y];for(;p>=0&&i[p]>$;)p--;p>=y&&(u+=p-y+1)}return u}function l(i,f){const a=i.length,u=a*(a+1)/2;if(a===1||f===1)return i[0];if(f===u)return i[a-1];const p=i[0],y=i[a-1];let $=p,g=y;for(;g-$>c*Math.max(1,Math.abs($),Math.abs(g));){const M=($+g)/2;r(i,M)<f?$=M:g=M}const w=($+g)/2,v=[];for(let M=0;M<a;M++){const k=2*w-i[M];let x=M,E=a;for(;x<E;){const b=Math.floor((x+E)/2);i[b]<k-c?x=b+1:E=b}if(x<a&&x>=M&&Math.abs(i[x]-k)<c*Math.max(1,Math.abs(k))&&v.push((i[M]+i[x])/2),x>M){const b=(i[M]+i[x-1])/2;b<=w+c&&v.push(b)}}if(v.length===0)return w;v.sort((M,k)=>M-k);for(const M of v)if(r(i,M)>=f)return M;return w}function o(i,f,a){const u=i.length,p=u*(u+1)/2,y=Math.max(1,Math.min(f,p)),$=Math.max(1,Math.min(a,p)),g=l(i,y),w=l(i,$);return g>w?[w,g]:[g,w]}return To}var kf;function up(){return kf||(kf=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.DEFAULT_MISRATE=void 0,c.center=g,c.spread=w,c.relSpread=v,c.shift=M,c.ratio=k,c.disparity=E,c.shiftBounds=b,c.ratioBounds=P,c.centerBounds=N,c.spreadBounds=B,c.disparityBounds=V,c._avgSpread=x,c._avgSpreadBounds=J;const r=np(),l=lp(),o=op(),i=ip(),f=sp(),a=cp(),u=ap(),p=zo(),y=Ur(),$=Ro();function g(j){return(0,y.checkValidity)(j,"x"),(0,r.fastCenter)(j)}function w(j){(0,y.checkValidity)(j,"x");const _=(0,l.fastSpread)(j);if(_<=0)throw y.AssumptionError.sparity("x");return _}function v(j){(0,y.checkValidity)(j,"x"),(0,y.checkPositivity)(j,"x");const _=(0,r.fastCenter)(j);return(0,l.fastSpread)(j)/Math.abs(_)}function M(j,_){return(0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y"),(0,o.fastShift)(j,_,[.5],!1)[0]}function k(j,_){return(0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y"),(0,y.checkPositivity)(j,"x"),(0,y.checkPositivity)(_,"y"),(0,o.fastRatio)(j,_,[.5],!1)[0]}function x(j,_){(0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y");const z=j.length,Z=_.length,ne=(0,l.fastSpread)(j);if(ne<=0)throw y.AssumptionError.sparity("x");const ie=(0,l.fastSpread)(_);if(ie<=0)throw y.AssumptionError.sparity("y");return(z*ne+Z*ie)/(z+Z)}function E(j,_){(0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y");const z=j.length,Z=_.length,ne=(0,l.fastSpread)(j);if(ne<=0)throw y.AssumptionError.sparity("x");const ie=(0,l.fastSpread)(_);if(ie<=0)throw y.AssumptionError.sparity("y");const pe=(0,o.fastShift)(j,_,[.5],!1)[0],ge=(z*ne+Z*ie)/(z+Z);return pe/ge}c.DEFAULT_MISRATE=.001;function b(j,_,z=c.DEFAULT_MISRATE){(0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y");const Z=j.length,ne=_.length;if(isNaN(z)||z<0||z>1)throw y.AssumptionError.domain("misrate");const ie=(0,p.minAchievableMisrateTwoSample)(Z,ne);if(z<ie)throw y.AssumptionError.domain("misrate");const pe=[...j].sort((ae,xe)=>ae-xe),ge=[..._].sort((ae,xe)=>ae-xe),we=BigInt(Z)*BigInt(ne);if(we===1n){const ae=pe[0]-ge[0];return{lower:ae,upper:ae}}const me=BigInt((0,i.pairwiseMargin)(Z,ne,z)),q=(we-1n)/2n;let te=me/2n;te>q&&(te=q);const K=te,F=we-1n-te,R=Number(we-1n)||1,re=Number(K)/R,le=Number(F)/R,[de,he]=(0,o.fastShift)(pe,ge,[re,le],!0),Y=Math.min(de,he),se=Math.max(de,he);return{lower:Y,upper:se}}function P(j,_,z=c.DEFAULT_MISRATE){if((0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y"),isNaN(z)||z<0||z>1)throw y.AssumptionError.domain("misrate");const Z=(0,p.minAchievableMisrateTwoSample)(j.length,_.length);if(z<Z)throw y.AssumptionError.domain("misrate");const ne=(0,y.log)(j,"x"),ie=(0,y.log)(_,"y"),pe=b(ne,ie,z);return{lower:Math.exp(pe.lower),upper:Math.exp(pe.upper)}}function N(j,_=c.DEFAULT_MISRATE){if((0,y.checkValidity)(j,"x"),isNaN(_)||_<0||_>1)throw y.AssumptionError.domain("misrate");const z=j.length;if(z<2)throw y.AssumptionError.domain("x");const Z=(0,p.minAchievableMisrateOneSample)(z);if(_<Z)throw y.AssumptionError.domain("misrate");const ne=BigInt(z)*BigInt(z+1)/2n,ie=BigInt((0,f.signedRankMargin)(z,_)),pe=(ne-1n)/2n;let ge=ie/2n;ge>pe&&(ge=pe);const we=Number(ge+1n),me=Number(ne-ge),q=[...j].sort((F,R)=>F-R),[te,K]=(0,u.fastCenterQuantileBounds)(q,we,me);return{lower:te,upper:K}}function B(j,_=c.DEFAULT_MISRATE,z){if((0,y.checkValidity)(j,"x"),isNaN(_)||_<0||_>1)throw y.AssumptionError.domain("misrate");const Z=j.length,ne=Math.floor(Z/2),ie=(0,p.minAchievableMisrateOneSample)(ne);if(_<ie)throw y.AssumptionError.domain("misrate");if(j.length<2||(0,l.fastSpread)(j)<=0)throw y.AssumptionError.sparity("x");const pe=z!==void 0?new $.Rng(z):new $.Rng,ge=(0,a.signMarginRandomized)(ne,_,pe);let we=Math.floor(ge/2);const me=Math.floor((ne-1)/2);we>me&&(we=me);const q=we+1,te=ne-we,K=Array.from({length:Z},(re,le)=>le),F=pe.shuffle(K),R=[];for(let re=0;re<ne;re++){const le=F[2*re],de=F[2*re+1];R.push(Math.abs(j[le]-j[de]))}return R.sort((re,le)=>re-le),{lower:R[q-1],upper:R[te-1]}}function J(j,_,z=c.DEFAULT_MISRATE,Z){if((0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y"),isNaN(z)||z<0||z>1)throw y.AssumptionError.domain("misrate");const ne=j.length,ie=_.length;if(ne<2)throw y.AssumptionError.domain("x");if(ie<2)throw y.AssumptionError.domain("y");const pe=z/2,ge=(0,p.minAchievableMisrateOneSample)(Math.floor(ne/2)),we=(0,p.minAchievableMisrateOneSample)(Math.floor(ie/2));if(pe<ge||pe<we)throw y.AssumptionError.domain("misrate");if((0,l.fastSpread)(j)<=0)throw y.AssumptionError.sparity("x");if((0,l.fastSpread)(_)<=0)throw y.AssumptionError.sparity("y");const me=B(j,pe,Z),q=B(_,pe,Z),te=ne/(ne+ie),K=ie/(ne+ie);return{lower:te*me.lower+K*q.lower,upper:te*me.upper+K*q.upper}}function V(j,_,z=c.DEFAULT_MISRATE,Z){if((0,y.checkValidity)(j,"x"),(0,y.checkValidity)(_,"y"),isNaN(z)||z<0||z>1)throw y.AssumptionError.domain("misrate");const ne=j.length,ie=_.length;if(ne<2)throw y.AssumptionError.domain("x");if(ie<2)throw y.AssumptionError.domain("y");const pe=(0,p.minAchievableMisrateTwoSample)(ne,ie),ge=(0,p.minAchievableMisrateOneSample)(Math.floor(ne/2)),we=(0,p.minAchievableMisrateOneSample)(Math.floor(ie/2)),me=2*Math.max(ge,we);if(z<pe+me)throw y.AssumptionError.domain("misrate");const q=z-(pe+me),te=pe+q/2,K=me+q/2;if((0,l.fastSpread)(j)<=0)throw y.AssumptionError.sparity("x");if((0,l.fastSpread)(_)<=0)throw y.AssumptionError.sparity("y");const F=b(j,_,te),R=J(j,_,K,Z),re=R.lower,le=R.upper,de=F.lower,he=F.upper;if(re>0){const Y=de/re,se=de/le,ae=he/re,xe=he/le,Ie=Math.min(Y,se,ae,xe),Ke=Math.max(Y,se,ae,xe);return{lower:Ie,upper:Ke}}return le<=0?de===0&&he===0?{lower:0,upper:0}:de>=0?{lower:0,upper:1/0}:he<=0?{lower:-1/0,upper:0}:{lower:-1/0,upper:1/0}:de>0?{lower:de/le,upper:1/0}:he<0?{lower:-1/0,upper:he/le}:de===0&&he===0?{lower:0,upper:0}:de===0&&he>0?{lower:0,upper:1/0}:de<0&&he===0?{lower:-1/0,upper:0}:{lower:-1/0,upper:1/0}}})(Us)),Us}var Vs={},fl={},mf;function fp(){if(mf)return fl;mf=1,Object.defineProperty(fl,"__esModule",{value:!0}),fl.Uniform=void 0;class c{constructor(l,o){if(l>=o)throw new Error("min must be less than max");this.min=l,this.max=o}sample(l){return this.min+l.uniformFloat()*(this.max-this.min)}samples(l,o){return Array.from({length:o},()=>this.sample(l))}}return fl.Uniform=c,fl}var dl={},Dr={},xf;function Js(){return xf||(xf=1,Object.defineProperty(Dr,"__esModule",{value:!0}),Dr.SMALLEST_POSITIVE_SUBNORMAL=Dr.MACHINE_EPSILON=void 0,Dr.MACHINE_EPSILON=2220446049250313e-31,Dr.SMALLEST_POSITIVE_SUBNORMAL=5e-324),Dr}var gf;function Wf(){if(gf)return dl;gf=1,Object.defineProperty(dl,"__esModule",{value:!0}),dl.Additive=void 0;const c=Js();class r{constructor(o,i){if(i<=0)throw new Error("stdDev must be positive");this.mean=o,this.stdDev=i}sample(o){let i=o.uniformFloat();const f=o.uniformFloat();i===0&&(i=c.SMALLEST_POSITIVE_SUBNORMAL);const a=Math.sqrt(-2*Math.log(i)),u=2*Math.PI*f,p=a*Math.cos(u);return this.mean+p*this.stdDev}samples(o,i){return Array.from({length:i},()=>this.sample(o))}}return dl.Additive=r,dl}var pl={},wf;function dp(){if(wf)return pl;wf=1,Object.defineProperty(pl,"__esModule",{value:!0}),pl.Multiplic=void 0;const c=Wf();class r{constructor(o,i){if(i<=0)throw new Error("logStdDev must be positive");this.additive=new c.Additive(o,i)}sample(o){return Math.exp(this.additive.sample(o))}samples(o,i){return Array.from({length:i},()=>this.sample(o))}}return pl.Multiplic=r,pl}var hl={},vf;function pp(){if(vf)return hl;vf=1,Object.defineProperty(hl,"__esModule",{value:!0}),hl.Exp=void 0;const c=Js();class r{constructor(o){if(o<=0)throw new Error("rate must be positive");this.rate=o}sample(o){let i=o.uniformFloat();return i===1&&(i=1-c.MACHINE_EPSILON),-Math.log(1-i)/this.rate}samples(o,i){return Array.from({length:i},()=>this.sample(o))}}return hl.Exp=r,hl}var yl={},Mf;function hp(){if(Mf)return yl;Mf=1,Object.defineProperty(yl,"__esModule",{value:!0}),yl.Power=void 0;const c=Js();class r{constructor(o,i){if(o<=0)throw new Error("min must be positive");if(i<=0)throw new Error("shape must be positive");this.min=o,this.shape=i}sample(o){let i=o.uniformFloat();return i===1&&(i=1-c.MACHINE_EPSILON),this.min/Math.pow(1-i,1/this.shape)}samples(o,i){return Array.from({length:i},()=>this.sample(o))}}return yl.Power=r,yl}var Cf;function yp(){return Cf||(Cf=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.Power=c.Exp=c.Multiplic=c.Additive=c.Uniform=void 0;var r=fp();Object.defineProperty(c,"Uniform",{enumerable:!0,get:function(){return r.Uniform}});var l=Wf();Object.defineProperty(c,"Additive",{enumerable:!0,get:function(){return l.Additive}});var o=dp();Object.defineProperty(c,"Multiplic",{enumerable:!0,get:function(){return o.Multiplic}});var i=pp();Object.defineProperty(c,"Exp",{enumerable:!0,get:function(){return i.Exp}});var f=hp();Object.defineProperty(c,"Power",{enumerable:!0,get:function(){return f.Power}})})(Vs)),Vs}var Sf;function $p(){return Sf||(Sf=1,(function(c){Object.defineProperty(c,"__esModule",{value:!0}),c.Power=c.Exp=c.Multiplic=c.Additive=c.Uniform=c.Rng=c.disparityBounds=c.spreadBounds=c.centerBounds=c.ratioBounds=c.shiftBounds=c.disparity=c.ratio=c.shift=c.relSpread=c.spread=c.center=c.DEFAULT_MISRATE=c.AssumptionError=c.AssumptionId=void 0;var r=Ur();Object.defineProperty(c,"AssumptionId",{enumerable:!0,get:function(){return r.AssumptionId}}),Object.defineProperty(c,"AssumptionError",{enumerable:!0,get:function(){return r.AssumptionError}});var l=up();Object.defineProperty(c,"DEFAULT_MISRATE",{enumerable:!0,get:function(){return l.DEFAULT_MISRATE}}),Object.defineProperty(c,"center",{enumerable:!0,get:function(){return l.center}}),Object.defineProperty(c,"spread",{enumerable:!0,get:function(){return l.spread}}),Object.defineProperty(c,"relSpread",{enumerable:!0,get:function(){return l.relSpread}}),Object.defineProperty(c,"shift",{enumerable:!0,get:function(){return l.shift}}),Object.defineProperty(c,"ratio",{enumerable:!0,get:function(){return l.ratio}}),Object.defineProperty(c,"disparity",{enumerable:!0,get:function(){return l.disparity}}),Object.defineProperty(c,"shiftBounds",{enumerable:!0,get:function(){return l.shiftBounds}}),Object.defineProperty(c,"ratioBounds",{enumerable:!0,get:function(){return l.ratioBounds}}),Object.defineProperty(c,"centerBounds",{enumerable:!0,get:function(){return l.centerBounds}}),Object.defineProperty(c,"spreadBounds",{enumerable:!0,get:function(){return l.spreadBounds}}),Object.defineProperty(c,"disparityBounds",{enumerable:!0,get:function(){return l.disparityBounds}});var o=Ro();Object.defineProperty(c,"Rng",{enumerable:!0,get:function(){return o.Rng}});var i=yp();Object.defineProperty(c,"Uniform",{enumerable:!0,get:function(){return i.Uniform}}),Object.defineProperty(c,"Additive",{enumerable:!0,get:function(){return i.Additive}}),Object.defineProperty(c,"Multiplic",{enumerable:!0,get:function(){return i.Multiplic}}),Object.defineProperty(c,"Exp",{enumerable:!0,get:function(){return i.Exp}}),Object.defineProperty(c,"Power",{enumerable:!0,get:function(){return i.Power}})})(Ds)),Ds}var kp=$p();function qf(c){return new kp.Rng(c)}var Xs=[1,0,0,1,0,0];function kl(c,r){return[c[0]*r[0]+c[2]*r[1],c[1]*r[0]+c[3]*r[1],c[0]*r[2]+c[2]*r[3],c[1]*r[2]+c[3]*r[3],c[0]*r[4]+c[2]*r[5]+c[4],c[1]*r[4]+c[3]*r[5]+c[5]]}function mp(c,r,l){return{x:c[0]*r+c[2]*l+c[4],y:c[1]*r+c[3]*l+c[5]}}function xp(c){const r=Math.abs(c[0]*c[3]-c[1]*c[2]);return Math.sqrt(r)||1}function Ef(c){let r=Xs;const l=/(translate|scale|rotate|matrix)\s*\(([^)]*)\)/g;let o;for(;(o=l.exec(c))!==null;){const i=o[1],f=o[2].split(/[\s,]+/).filter(u=>u.length>0).map(Number);let a=Xs;if(i==="translate")a=[1,0,0,1,f[0]||0,f[1]||0];else if(i==="scale"){const u=f[0]||0,p=f.length>1?f[1]:u;a=[u,0,0,p,0,0]}else if(i==="rotate"){const u=(f[0]||0)*Math.PI/180,p=Math.cos(u),y=Math.sin(u),$=[p,y,-y,p,0,0];if(f.length>=3){const g=f[1],w=f[2];a=kl([1,0,0,1,g,w],kl($,[1,0,0,1,-g,-w]))}else a=$}else i==="matrix"&&f.length>=6&&(a=[f[0],f[1],f[2],f[3],f[4],f[5]]);r=kl(r,a)}return r}function Ye(c,r){const l=(" "+c).match(new RegExp("[\\s]"+r+'\\s*=\\s*"([^"]*)"'));return l?parseFloat(l[1]):void 0}function $l(c,r){const l=(" "+c).match(new RegExp("[\\s]"+r+'\\s*=\\s*"([^"]*)"'));return l?l[1]:void 0}function gp(c){const r=$l(c,"stroke");if(r===void 0||r==="none")return 0;const l=Ye(c,"stroke-width");return(l===void 0?1:l)/2}var jo=24,Qf=16,Ff=12,Lf=24;function _f(c,r,l,o,i){for(let f=0;f<=Qf;f++){const a=f/Qf,u=1-a,p=u*u*u,y=3*u*u*a,$=3*u*a*a,g=a*a*a;i.push({x:p*c.x+y*r.x+$*l.x+g*o.x,y:p*c.y+y*r.y+$*l.y+g*o.y})}}function Pf(c,r,l,o){for(let i=0;i<=Ff;i++){const f=i/Ff,a=1-f,u=a*a,p=2*a*f,y=f*f;o.push({x:u*c.x+p*r.x+y*l.x,y:u*c.y+p*r.y+y*l.y})}}function wp(c,r,l,o,i,f,a,u,p,y){if(l===0||o===0){y.push({x:u,y:p});return}l=Math.abs(l),o=Math.abs(o);const $=i*Math.PI/180,g=Math.cos($),w=Math.sin($),v=(c-u)/2,M=(r-p)/2,k=g*v+w*M,x=-w*v+g*M;let E=l*l,b=o*o;const P=k*k,N=x*x,B=P/E+N/b;if(B>1){const F=Math.sqrt(B);l*=F,o*=F,E=l*l,b=o*o}const J=f!==a?1:-1,V=Math.max(0,E*b-E*N-b*P),j=E*N+b*P,_=j===0?0:J*Math.sqrt(V/j),z=_*(l*x)/o,Z=_*-(o*k)/l,ne=g*z-w*Z+(c+u)/2,ie=w*z+g*Z+(r+p)/2,pe=(F,R,re,le)=>{const de=F*re+R*le,he=Math.sqrt((F*F+R*R)*(re*re+le*le));let Y=he===0?0:Math.acos(Math.min(1,Math.max(-1,de/he)));return F*le-R*re<0&&(Y=-Y),Y},ge=(k-z)/l,we=(x-Z)/o,me=(-k-z)/l,q=(-x-Z)/o,te=pe(1,0,ge,we);let K=pe(ge,we,me,q);!a&&K>0?K-=2*Math.PI:a&&K<0&&(K+=2*Math.PI);for(let F=0;F<=Lf;F++){const R=te+K*(F/Lf),re=Math.cos(R),le=Math.sin(R);y.push({x:g*l*re-w*o*le+ne,y:w*l*re+g*o*le+ie})}}function vp(c){const r=[],l=[],o=/([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;let i;for(;(i=o.exec(c))!==null;)i[1]?l.push({cmd:i[1]}):l.push({num:parseFloat(i[2])});let f=0,a=0,u=0,p=0,y=0,$=0,g=0,w="";const v=()=>{const M=l[f++];return M&&M.num!==void 0?M.num:0};for(;f<l.length&&(l[f].cmd!==void 0&&(w=l[f].cmd,f++),!(f>l.length));){const M=w===w.toLowerCase();switch(w.toUpperCase()){case"M":{let k=v(),x=v();M&&(k+=a,x+=u),a=k,u=x,p=k,y=x,$=k,g=x,r.push({x:k,y:x}),w=M?"l":"L";break}case"L":{let k=v(),x=v();M&&(k+=a,x+=u),a=k,u=x,$=k,g=x,r.push({x:k,y:x});break}case"H":{let k=v();M&&(k+=a),a=k,$=a,g=u,r.push({x:a,y:u});break}case"V":{let k=v();M&&(k+=u),u=k,$=a,g=u,r.push({x:a,y:u});break}case"C":{let k=v(),x=v(),E=v(),b=v(),P=v(),N=v();M&&(k+=a,x+=u,E+=a,b+=u,P+=a,N+=u),_f({x:a,y:u},{x:k,y:x},{x:E,y:b},{x:P,y:N},r),$=E,g=b,a=P,u=N;break}case"S":{let k=v(),x=v(),E=v(),b=v();M&&(k+=a,x+=u,E+=a,b+=u);const P=2*a-$,N=2*u-g;_f({x:a,y:u},{x:P,y:N},{x:k,y:x},{x:E,y:b},r),$=k,g=x,a=E,u=b;break}case"Q":{let k=v(),x=v(),E=v(),b=v();M&&(k+=a,x+=u,E+=a,b+=u),Pf({x:a,y:u},{x:k,y:x},{x:E,y:b},r),$=k,g=x,a=E,u=b;break}case"T":{let k=v(),x=v();M&&(k+=a,x+=u);const E=2*a-$,b=2*u-g;Pf({x:a,y:u},{x:E,y:b},{x:k,y:x},r),$=E,g=b,a=k,u=x;break}case"A":{const k=v(),x=v(),E=v(),b=v(),P=v();let N=v(),B=v();M&&(N+=a,B+=u),wp(a,u,k,x,E,b!==0,P!==0,N,B,r),a=N,u=B,$=N,g=B;break}case"Z":{a=p,u=y,$=a,g=u;break}default:f++;break}}return r}function Mp(c){const r=[];let l=0;const o=[Xs];let i=0;const f=/<(\/?)\s*([a-zA-Z]+)([^>]*?)(\/?)\s*>/g;let a;for(;(a=f.exec(c))!==null;){const u=a[1]==="/",p=a[2].toLowerCase(),y=a[3]||"",$=a[4]==="/";if(p==="defs"||p==="clippath"){u?i=Math.max(0,i-1):$||i++;continue}if(p==="g"){if(u)o.length>1&&o.pop();else{const x=$l(y,"transform"),E=x?kl(o[o.length-1],Ef(x)):o[o.length-1];$||o.push(E)}continue}if(u||i>0)continue;const g=$l(y,"transform"),w=o[o.length-1],v=g?kl(w,Ef(g)):w,M=[];switch(p){case"circle":{const x=Ye(y,"cx")??0,E=Ye(y,"cy")??0,b=Ye(y,"r")??0;for(let P=0;P<jo;P++){const N=2*Math.PI*P/jo;M.push({x:x+b*Math.cos(N),y:E+b*Math.sin(N)})}break}case"ellipse":{const x=Ye(y,"cx")??0,E=Ye(y,"cy")??0,b=Ye(y,"rx")??0,P=Ye(y,"ry")??0;for(let N=0;N<jo;N++){const B=2*Math.PI*N/jo;M.push({x:x+b*Math.cos(B),y:E+P*Math.sin(B)})}break}case"rect":{const x=Ye(y,"x")??0,E=Ye(y,"y")??0,b=Ye(y,"width")??0,P=Ye(y,"height")??0;M.push({x,y:E},{x:x+b,y:E},{x:x+b,y:E+P},{x,y:E+P});break}case"line":{M.push({x:Ye(y,"x1")??0,y:Ye(y,"y1")??0},{x:Ye(y,"x2")??0,y:Ye(y,"y2")??0});break}case"polygon":case"polyline":{const x=$l(y,"points");if(x){const E=x.match(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);if(E)for(let b=0;b+1<E.length;b+=2)M.push({x:parseFloat(E[b]),y:parseFloat(E[b+1])})}break}case"path":{const x=$l(y,"d");x&&M.push(...vp(x));break}}if(M.length===0)continue;const k=gp(y)*xp(v);k>l&&(l=k);for(const x of M)r.push(mp(v,x.x,x.y))}return{points:r,pad:l}}function ec(c,r,l,o){return Math.hypot(c-l,r-o)}function Hs(c,r,l=1e-7){return ec(c.x,c.y,r.x,r.y)<=c.r+l}function Zs(c,r){return{x:(c.x+r.x)/2,y:(c.y+r.y)/2,r:ec(c.x,c.y,r.x,r.y)/2}}function Cp(c,r,l){const o=2*(c.x*(r.y-l.y)+r.x*(l.y-c.y)+l.x*(c.y-r.y));if(Math.abs(o)<1e-9)return null;const i=c.x*c.x+c.y*c.y,f=r.x*r.x+r.y*r.y,a=l.x*l.x+l.y*l.y,u=(i*(r.y-l.y)+f*(l.y-c.y)+a*(c.y-r.y))/o,p=(i*(l.x-r.x)+f*(c.x-l.x)+a*(r.x-c.x))/o;return{x:u,y:p,r:ec(u,p,c.x,c.y)}}function Sp(c){if(c.length<3)return c.slice();const r=c.slice().sort((f,a)=>f.x-a.x||f.y-a.y),l=(f,a,u)=>(a.x-f.x)*(u.y-f.y)-(a.y-f.y)*(u.x-f.x),o=[];for(const f of r){for(;o.length>=2&&l(o[o.length-2],o[o.length-1],f)<=0;)o.pop();o.push(f)}const i=[];for(let f=r.length-1;f>=0;f--){const a=r[f];for(;i.length>=2&&l(i[i.length-2],i[i.length-1],a)<=0;)i.pop();i.push(a)}return o.pop(),i.pop(),o.concat(i)}function Ep(c){const r=Sp(c);if(r.length===0)return{x:0,y:0,r:0};if(r.length===1)return{x:r[0].x,y:r[0].y,r:0};let l=Zs(r[0],r[1]);for(let o=2;o<r.length;o++)if(!Hs(l,r[o])){l=Zs(r[o],r[0]);for(let i=1;i<o;i++)if(!Hs(l,r[i])){l=Zs(r[o],r[i]);for(let f=0;f<i;f++){if(Hs(l,r[f]))continue;const a=Cp(r[o],r[i],r[f]);a&&(l=a)}}}return l}function Ws(c){return Math.round(c*1e4)/1e4}function ot(c,r={}){const l=r.size??100,o=r.padding??4,i=l/2-o,{points:f,pad:a}=Mp(c);if(f.length===0)return`<g>${c}</g>`;const u=Ep(f),p=u.r+a;if(p<1e-6)return`<g>${c}</g>`;const y=Ws(i/p),$=Ws(u.x),g=Ws(u.y),w=l/2;return`<g transform="translate(${w} ${w}) scale(${y}) translate(${-$} ${-g})">${c}</g>`}function Yf(c,r,l){r/=100,l/=100;const o=(1-Math.abs(2*l-1))*r,i=o*(1-Math.abs(c/60%2-1)),f=l-o/2;let a=0,u=0,p=0;0<=c&&c<60?(a=o,u=i,p=0):60<=c&&c<120?(a=i,u=o,p=0):120<=c&&c<180?(a=0,u=o,p=i):180<=c&&c<240?(a=0,u=i,p=o):240<=c&&c<300?(a=i,u=0,p=o):300<=c&&c<360&&(a=o,u=0,p=i);const y=$=>{const g=Math.round(($+f)*255).toString(16);return g.length===1?"0"+g:g};return`#${y(a)}${y(u)}${y(p)}`}function St(c){const r=c.uniformInt(0,360),l=c.uniformInt(50,90),o=c.uniformInt(40,70);return Yf(r,l,o)}function S(c,r=20){const l=parseInt(c.slice(1),16),o=Math.max(0,(l>>16)-r),i=Math.max(0,(l>>8&255)-r),f=Math.max(0,(l&255)-r);return`#${(o<<16|i<<8|f).toString(16).padStart(6,"0")}`}function D(c,r=20){const l=parseInt(c.slice(1),16),o=Math.min(255,(l>>16)+r),i=Math.min(255,(l>>8&255)+r),f=Math.min(255,(l&255)+r);return`#${(o<<16|i<<8|f).toString(16).padStart(6,"0")}`}function O(c,r){return c[r.uniformInt(0,c.length)]}function Gf(c,r,l){return l.uniformInt(c,r+1)}function Qp(c){let r=5381;for(let l=0;l<c.length;l++)r=(r<<5)+r^c.charCodeAt(l);return(r>>>0).toString(16)}function Fp(c,r,l){const o=Qp(`${c}:${r}:${l}`);return`clip-${c}-${o}`}function Lp(c,r,l=100,o=""){const i=Fp(c,r,o);let f,a;switch(c){case"circle":f=`<circle cx="${l/2}" cy="${l/2}" r="${l/2}" fill="${r}"/>`,a=`<clipPath id="${i}"><circle cx="${l/2}" cy="${l/2}" r="${l/2}"/></clipPath>`;break;case"rounded":f=`<rect width="${l}" height="${l}" rx="15" fill="${r}"/>`,a=`<clipPath id="${i}"><rect width="${l}" height="${l}" rx="15"/></clipPath>`;break;case"square":default:f=`<rect width="${l}" height="${l}" fill="${r}"/>`,a=`<clipPath id="${i}"><rect width="${l}" height="${l}"/></clipPath>`;break}return{background:f,clipPath:a,clipId:i}}function it(c,r,l,o=100){const{background:i}=Lp(r,l,o,c);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o} ${o}" width="${o}" height="${o}">
    ${i}
    <g>${c}</g>
  </svg>`}var _p={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},skinColor:{type:"color",default:"#f5d0c5"},hairColor:{type:"color",default:"#5d4e37"},eyeColor:{type:"color",default:"#3498db"},backgroundColor:{type:"color",default:"#ecf0f1"},hairStyle:{type:"select",default:"bob",options:["bob","long","curly","bald","mohawk","ponytail"]},accessory:{type:"select",default:"none",options:["none","glasses","sunglasses","earrings"]},expression:{type:"select",default:"happy",options:["happy","neutral","sad","surprised"]}};function Pp(c){const{skinColor:r}=c,l=S(r,20);return`
    <ellipse cx="50" cy="55" rx="32" ry="38" fill="${r}"/>
    <ellipse cx="50" cy="58" rx="28" ry="32" fill="${l}" opacity="0.1"/>
  `}function Af(c){const{hairColor:r,hairStyle:l}=c,o=S(r,30);switch(l){case"bob":return`
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
      `;default:return""}}function Ap(c){const{eyeColor:r,expression:l,hairColor:o}=c,i=S(o,35);let f="";switch(l){case"happy":f=`
        <ellipse cx="38" cy="50" rx="6" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="6" ry="6" fill="white"/>
        <circle cx="38" cy="51" r="3.2" fill="${r}"/>
        <circle cx="62" cy="51" r="3.2" fill="${r}"/>
        <circle cx="38" cy="51" r="1.6" fill="#2c3e50"/>
        <circle cx="62" cy="51" r="1.6" fill="#2c3e50"/>
        <path d="M32,47 Q38,45 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,45 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;break;case"neutral":f=`
        <ellipse cx="38" cy="50" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="50" r="2.8" fill="${r}"/>
        <circle cx="62" cy="50" r="2.8" fill="${r}"/>
        <circle cx="38" cy="50" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="50" r="1.4" fill="#2c3e50"/>
      `;break;case"sad":f=`
        <ellipse cx="38" cy="52" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="52" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="53" r="2.8" fill="${r}"/>
        <circle cx="62" cy="53" r="2.8" fill="${r}"/>
        <circle cx="38" cy="53" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="53" r="1.4" fill="#2c3e50"/>
        <path d="M32,47 Q38,48 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,48 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;break;case"surprised":f=`
        <ellipse cx="38" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <ellipse cx="62" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <circle cx="38" cy="48" r="3.5" fill="${r}"/>
        <circle cx="62" cy="48" r="3.5" fill="${r}"/>
        <circle cx="38" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="62" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="36.5" cy="46.5" r="1.4" fill="white"/>
        <circle cx="60.5" cy="46.5" r="1.4" fill="white"/>
      `;break}const a=l==="sad"?`
      <path d="M30,44 Q38,41 46,44" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,41 54,44" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `:l==="surprised"?`
      <path d="M30,40 Q38,36 46,40" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,40 Q62,36 54,40" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `:`
      <path d="M30,44 Q38,42 46,44" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,42 54,44" stroke="${i}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `;return f+a}function Np(c){const{skinColor:r,expression:l}=c,o=S(r,30),i=S(r,25),f=`<path d="M50,55 L47,68 Q50,70 53,68 L50,55" stroke="${o}" stroke-width="1.4" fill="none"/>`;let a="";switch(l){case"happy":a=`<path d="M42,78 Q50,82 58,78" stroke="${i}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"neutral":a=`<path d="M42,80 Q50,80 58,80" stroke="${i}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"sad":a=`<path d="M42,82 Q50,79 58,82" stroke="${i}" stroke-width="2" fill="none" stroke-linecap="round"/>`;break;case"surprised":a=`<ellipse cx="50" cy="80" rx="4" ry="5.5" fill="none" stroke="${i}" stroke-width="2"/>`;break}return f+a}function Ip(c){const{accessory:r}=c;switch(r){case"glasses":return`
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
      `;default:return""}}function bp(c){const{skinColor:r}=c,l=S(r,15);return`
    <ellipse cx="18" cy="55" rx="5" ry="8" fill="${r}"/>
    <ellipse cx="18" cy="55" rx="3" ry="5" fill="${l}" opacity="0.3"/>
    <ellipse cx="82" cy="55" rx="5" ry="8" fill="${r}"/>
    <ellipse cx="82" cy="55" rx="3" ry="5" fill="${l}" opacity="0.3"/>
  `}function Tp(c){const{backgroundShape:r,backgroundColor:l,hairStyle:o}=c,i=o==="long",f=`
    ${i?Af(c):""}
    ${bp(c)}
    ${Pp(c)}
    ${i?"":Af(c)}
    ${Ap(c)}
    ${Np(c)}
    ${Ip(c)}
  `,a=ot(f);return it(a,r,l)}function jp(c){const r=["circle","rounded","square"],l=["bob","long","curly","bald","mohawk","ponytail"],o=["none","glasses","sunglasses","earrings"],i=["happy","neutral","sad","surprised"],f=["#f5d0c5","#e8beac","#d4a574","#c68642","#8d5524","#6b4423","#4a3728","#f9d5b8"],a=["#2c1810","#5d4e37","#8b4513","#d2691e","#ffd700","#ff6347","#4a0080","#1a1a2e"];return{backgroundShape:O(r,c),skinColor:O(f,c),hairColor:O(a,c),eyeColor:St(c),backgroundColor:St(c),hairStyle:O(l,c),accessory:O(o,c),expression:O(i,c)}}var Rp={name:"People",schema:_p,shapeParam:"hairStyle",generate:Tp,randomize:jp},zp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},animalType:{type:"select",default:"cat",options:["cat","dog","bear","bunny","fox","panda","owl","koala","penguin","lion"]},primaryColor:{type:"color",default:"#e67e22"},secondaryColor:{type:"color",default:"#ffffff"},eyeColor:{type:"color",default:"#2ecc71"},backgroundColor:{type:"color",default:"#ecf0f1"},expression:{type:"select",default:"happy",options:["happy","sleepy","surprised","grumpy"]}};function Nf(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,30),a=`
    <polygon points="18,39 25,9 40,34" fill="${r}"/>
    <polygon points="22,36 27,16 37,34" fill="${D(r,40)}"/>
    <polygon points="82,39 75,9 60,34" fill="${r}"/>
    <polygon points="78,36 73,16 63,34" fill="${D(r,40)}"/>
  `,u=`
    <ellipse cx="50" cy="55" rx="38" ry="35" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="25" ry="22" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
    <ellipse cx="50" cy="65" rx="5" ry="4" fill="${f}"/>
    <path d="M50,69 L50,74" stroke="${f}" stroke-width="2"/>
    <path d="M45,76 Q50,80 55,76" stroke="${f}" stroke-width="2" fill="none"/>
  `,$=`
    <line x1="10" y1="60" x2="30" y2="65" stroke="${f}" stroke-width="1.5"/>
    <line x1="10" y1="70" x2="30" y2="70" stroke="${f}" stroke-width="1.5"/>
    <line x1="10" y1="80" x2="30" y2="75" stroke="${f}" stroke-width="1.5"/>
    <line x1="90" y1="60" x2="70" y2="65" stroke="${f}" stroke-width="1.5"/>
    <line x1="90" y1="70" x2="70" y2="70" stroke="${f}" stroke-width="1.5"/>
    <line x1="90" y1="80" x2="70" y2="75" stroke="${f}" stroke-width="1.5"/>
  `;return a+u+p+y+$}function Bp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,30),a=`
    <ellipse cx="20" cy="45" rx="15" ry="25" fill="${f}"/>
    <ellipse cx="80" cy="45" rx="15" ry="25" fill="${f}"/>
  `,u=`
    <circle cx="50" cy="50" r="35" fill="${r}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
  `,$=i==="happy"?'<ellipse cx="50" cy="82" rx="6" ry="8" fill="#e74c3c"/>':"";return a+u+p+y+$}function Dp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,30),a=`
    <circle cx="20" cy="25" r="15" fill="${r}"/>
    <circle cx="20" cy="25" r="8" fill="${f}"/>
    <circle cx="80" cy="25" r="15" fill="${r}"/>
    <circle cx="80" cy="25" r="8" fill="${f}"/>
  `,u=`
    <circle cx="50" cy="55" r="40" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="18" ry="15" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
      `;break}return a+u+p+`
    <ellipse cx="50" cy="68" rx="7" ry="5" fill="#2c3e50"/>
    <path d="M50,73 L50,77" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,80 Q50,85 58,80" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function Op(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=D(r,40),a=`
    <ellipse cx="30" cy="20" rx="10" ry="25" fill="${r}"/>
    <ellipse cx="30" cy="20" rx="5" ry="18" fill="${f}"/>
    <ellipse cx="70" cy="20" rx="10" ry="25" fill="${r}"/>
    <ellipse cx="70" cy="20" rx="5" ry="18" fill="${f}"/>
  `,u=`
    <circle cx="50" cy="60" r="35" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="15" ry="12" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
      `;break}return a+u+p+`
    <ellipse cx="50" cy="68" rx="5" ry="4" fill="#ffb6c1"/>
    <path d="M50,72 L45,78 M50,72 L55,78" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>
  `+`
    <circle cx="25" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
    <circle cx="75" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
  `}function Up(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,25),a=`
    <polygon points="18,52 32,10 46,50" fill="${r}"/>
    <polygon points="24,50 32,22 42,48" fill="${l}"/>
    <polygon points="82,52 68,10 54,50" fill="${r}"/>
    <polygon points="76,50 68,22 58,48" fill="${l}"/>
  `,u=`
    <path d="M20 62 C22 36 38 22 50 22 C62 22 78 36 80 62 L50 92 Z" fill="${r}"/>
    <path d="M50 88 Q30 74 28 60 Q50 48 72 60 Q70 74 50 88 Z" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
        <line x1="28" y1="44" x2="44" y2="47" stroke="${f}" stroke-width="2"/>
        <line x1="72" y1="44" x2="56" y2="47" stroke="${f}" stroke-width="2"/>
      `;break}return a+u+p+`
    <polygon points="50,66 46,72 54,72" fill="#2c3e50"/>
    <path d="M50,72 L50,76" stroke="#2c3e50" stroke-width="2"/>
    <path d="M44,78 Q50,82 56,78" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function Vp(c){const{expression:r,eyeColor:l}=c,o="#ffffff",i="#1a1a2e",f=`
    <circle cx="20" cy="25" r="15" fill="${i}"/>
    <circle cx="80" cy="25" r="15" fill="${i}"/>
  `,a=`
    <circle cx="50" cy="55" r="40" fill="${o}"/>
  `;let u="";switch(r){case"happy":u=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${i}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${i}"/>
        <circle cx="32" cy="50" r="6" fill="white"/>
        <circle cx="68" cy="50" r="6" fill="white"/>
        <circle cx="32" cy="50" r="4" fill="${l}"/>
        <circle cx="68" cy="50" r="4" fill="${l}"/>
        <circle cx="33" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="69" cy="51" r="2" fill="#2c3e50"/>
      `;break;case"sleepy":u=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${i}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${i}"/>
        <ellipse cx="32" cy="50" rx="5" ry="3" fill="${l}"/>
        <ellipse cx="68" cy="50" rx="5" ry="3" fill="${l}"/>
        <path d="M24,50 Q32,45 40,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M60,50 Q68,45 76,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":u=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${i}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${i}"/>
        <circle cx="32" cy="48" r="8" fill="white"/>
        <circle cx="68" cy="48" r="8" fill="white"/>
        <circle cx="32" cy="48" r="5" fill="${l}"/>
        <circle cx="68" cy="48" r="5" fill="${l}"/>
        <circle cx="32" cy="48" r="3" fill="#2c3e50"/>
        <circle cx="68" cy="48" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":u=`
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${i}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${i}"/>
        <circle cx="32" cy="50" r="5" fill="white"/>
        <circle cx="68" cy="50" r="5" fill="white"/>
        <circle cx="32" cy="50" r="3" fill="${l}"/>
        <circle cx="68" cy="50" r="3" fill="${l}"/>
        <circle cx="32" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="68" cy="51" r="2" fill="#2c3e50"/>
        <line x1="22" y1="38" x2="42" y2="42" stroke="${i}" stroke-width="3"/>
        <line x1="78" y1="38" x2="58" y2="42" stroke="${i}" stroke-width="3"/>
      `;break}const p=`
    <ellipse cx="50" cy="70" rx="8" ry="5" fill="${i}"/>
    <path d="M50,75 L50,80" stroke="${i}" stroke-width="2"/>
    <path d="M42,83 Q50,88 58,83" stroke="${i}" stroke-width="2" fill="none"/>
  `;return f+a+u+p}function Hp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,30),a=`
    <polygon points="20,35 30,10 40,35" fill="${r}"/>
    <polygon points="25,35 30,18 35,35" fill="${f}"/>
    <polygon points="80,35 70,10 60,35" fill="${r}"/>
    <polygon points="75,35 70,18 65,35" fill="${f}"/>
  `,u=`
    <ellipse cx="50" cy="55" rx="38" ry="40" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="30" ry="32" fill="${l}"/>
  `;let p="";switch(i){case"happy":p=`
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
        <line x1="22" y1="35" x2="48" y2="40" stroke="${f}" stroke-width="3"/>
        <line x1="78" y1="35" x2="52" y2="40" stroke="${f}" stroke-width="3"/>
      `;break}return a+u+p+`
    <polygon points="50,60 42,72 50,82 58,72" fill="#f39c12"/>
  `}function Zp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=`
    <circle cx="15" cy="35" r="20" fill="${r}"/>
    <circle cx="15" cy="35" r="12" fill="${l}"/>
    <circle cx="85" cy="35" r="20" fill="${r}"/>
    <circle cx="85" cy="35" r="12" fill="${l}"/>
  `,a=`
    <ellipse cx="50" cy="55" rx="35" ry="38" fill="${r}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${l}"/>
  `;let u="";switch(i){case"happy":u=`
        <circle cx="35" cy="48" r="7" fill="white"/>
        <circle cx="65" cy="48" r="7" fill="white"/>
        <circle cx="35" cy="48" r="4" fill="${o}"/>
        <circle cx="65" cy="48" r="4" fill="${o}"/>
        <circle cx="35" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;break;case"sleepy":u=`
        <ellipse cx="35" cy="48" rx="4.5" ry="2.5" fill="${o}"/>
        <ellipse cx="65" cy="48" rx="4.5" ry="2.5" fill="${o}"/>
        <path d="M29,48 Q35,43 41,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M59,48 Q65,43 71,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;break;case"surprised":u=`
        <circle cx="35" cy="46" r="8" fill="white"/>
        <circle cx="65" cy="46" r="8" fill="white"/>
        <circle cx="35" cy="46" r="5" fill="${o}"/>
        <circle cx="65" cy="46" r="5" fill="${o}"/>
        <circle cx="35" cy="46" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="3" fill="#2c3e50"/>
      `;break;case"grumpy":u=`
        <circle cx="35" cy="48" r="5" fill="${o}"/>
        <circle cx="65" cy="48" r="5" fill="${o}"/>
        <circle cx="35" cy="48" r="2.5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="2.5" fill="#2c3e50"/>
        <line x1="28" y1="42" x2="42" y2="45" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="42" x2="58" y2="45" stroke="#2c3e50" stroke-width="2"/>
      `;break}return f+a+u+`
    <ellipse cx="50" cy="65" rx="12" ry="10" fill="#2c3e50"/>
    <ellipse cx="48" cy="63" rx="3" ry="2" fill="#555"/>
    <path d="M50,76 L50,79" stroke="#2c3e50" stroke-width="2"/>
    <path d="M43,79 Q50,82 57,79" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function Wp(c){const{secondaryColor:r,eyeColor:l,expression:o}=c,i="#1a1a2e",f=`
    <ellipse cx="50" cy="55" rx="38" ry="42" fill="${i}"/>
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
        <line x1="27" y1="38" x2="43" y2="41" stroke="${i}" stroke-width="2"/>
        <line x1="73" y1="38" x2="57" y2="41" stroke="${i}" stroke-width="2"/>
      `;break}return f+a+`
    <polygon points="50,55 40,65 50,72 60,65" fill="#f39c12"/>
  `+`
    <circle cx="25" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
    <circle cx="75" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
  `}function qp(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,30),a=S(r,35),u=`
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
  `;let y="";switch(i){case"happy":y=`
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
        <line x1="30" y1="42" x2="46" y2="45" stroke="${f}" stroke-width="2"/>
        <line x1="70" y1="42" x2="54" y2="45" stroke="${f}" stroke-width="2"/>
      `;break}return u+p+y+`
    <ellipse cx="50" cy="65" rx="6" ry="5" fill="#2c3e50"/>
    <path d="M50,70 L50,74" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,77 Q50,82 58,77" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `}function Yp(c){const{backgroundShape:r,animalType:l,backgroundColor:o}=c;let i;switch(l){case"cat":i=Nf(c);break;case"dog":i=Bp(c);break;case"bear":i=Dp(c);break;case"bunny":i=Op(c);break;case"fox":i=Up(c);break;case"panda":i=Vp(c);break;case"owl":i=Hp(c);break;case"koala":i=Zp(c);break;case"penguin":i=Wp(c);break;case"lion":i=qp(c);break;default:i=Nf(c)}const f=ot(i);return it(f,r,o)}function Gp(c){const r=["circle","rounded","square"],l=["cat","dog","bear","bunny","fox","panda","owl","koala","penguin","lion"],o=["happy","sleepy","surprised","grumpy"];return{backgroundShape:O(r,c),animalType:O(l,c),primaryColor:St(c),secondaryColor:"#ffffff",eyeColor:St(c),backgroundColor:St(c),expression:O(o,c)}}var Xp={name:"Animals",schema:zp,shapeParam:"animalType",generate:Yp,randomize:Gp},Kp={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},backgroundColor:{type:"color",default:"#e8f4f8"},bodyColor:{type:"color",default:"#9b59b6"},eyeColor:{type:"color",default:"#ffffff"},mouthColor:{type:"color",default:"#c0392b"},bodyShape:{type:"select",default:"round",options:["round","square","blob","tall"]},eyeCount:{type:"number",default:2,min:1,max:5},hasHorns:{type:"select",default:"spikes",options:["no","spikes","curved","antlers"]},hasTeeth:{type:"select",default:"yes",options:["yes","no"]},expression:{type:"select",default:"happy",options:["happy","angry","surprised","silly"]}};function Jp(c){const{bodyColor:r,bodyShape:l}=c,o=S(r,30);switch(l){case"round":return`
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
      `;default:return`<circle cx="50" cy="55" r="35" fill="${r}"/>`}}function e2(c){const{eyeColor:r,eyeCount:l,expression:o,bodyShape:i}=c,f=[],a=i==="tall"?35:40,u=60/(l+1),p=Math.max(6,12-l);for(let y=0;y<l;y++){const $=20+u*(y+1),g=a+y%2*5;f.push(`<ellipse cx="${$}" cy="${g}" rx="${p}" ry="${p+2}" fill="${r}"/>`);let w=0,v=0;switch(o){case"angry":w=2;break;case"surprised":w=-1;break;case"silly":v=y%2===0?2:-2,w=y%2===0?2:-2;break}if(f.push(`<circle cx="${$+v}" cy="${g+w}" r="${p/2}" fill="#2c3e50"/>`),f.push(`<circle cx="${$+v-1}" cy="${g+w-1}" r="${p/5}" fill="#ffffff"/>`),o==="angry"){const M=g-p-3,k=y<l/2?3:-3;f.push(`<line x1="${$-p}" y1="${M+k}" x2="${$+p}" y2="${M-k}" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>`)}}return f.join("")}function t2(c){const{mouthColor:r,expression:l,hasTeeth:o,bodyShape:i}=c,f=i==="tall"?65:70;let a="";switch(l){case"happy":a=`<path d="M30,${f} Q50,${f+15} 70,${f}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`
          <rect x="38" y="${f-2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="48" y="${f-2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="58" y="${f-2}" width="6" height="8" fill="white" rx="1"/>
        `);break;case"angry":a=`<path d="M30,${f+5} Q50,${f-5} 70,${f+5}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`
          <polygon points="35,${f+3} 38,${f+10} 41,${f+3}" fill="white"/>
          <polygon points="47,${f+1} 50,${f+8} 53,${f+1}" fill="white"/>
          <polygon points="59,${f+3} 62,${f+10} 65,${f+3}" fill="white"/>
        `);break;case"surprised":a=`<ellipse cx="50" cy="${f+5}" rx="10" ry="12" fill="${r}"/>`;break;case"silly":a=`<path d="M30,${f} Q40,${f+10} 50,${f} Q60,${f-10} 70,${f}" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>`,o==="yes"&&(a+=`<rect x="45" y="${f-8}" width="10" height="12" fill="white" rx="2"/>`);break}return a}function r2(c){const{bodyColor:r,hasHorns:l,bodyShape:o}=c;if(l==="no")return"";const i=S(r,45),f=D(r,12),a=o==="tall",p=(o==="tall"?8:o==="square"?20:o==="round"?17:10)+4,y=a?10:16,$=50-y,g=50+y;switch(l){case"spikes":{const w=a?13:15,v=a?10:12,M=2,k=p+6+M,x=p-w+M,E=v/2,b=v/4;return`
        <polygon points="${$-E},${k} ${$},${x} ${$+E},${k}" fill="${i}"/>
        <polygon points="${$-b},${k-1} ${$},${x+3} ${$+b},${k-1}" fill="${f}" opacity="0.7"/>
        <polygon points="${g-E},${k} ${g},${x} ${g+E},${k}" fill="${i}"/>
        <polygon points="${g-b},${k-1} ${g},${x+3} ${g+b},${k-1}" fill="${f}" opacity="0.7"/>
      `}case"curved":{const w=a?9:11,v=a?8:10,M=a?4:6,k=p+5,x=a?5:6,E=x-2,b=`M ${$-2},${k} C ${$-v},${p+2} ${$-v},${p-w} ${$+M},${p-w+2}`,P=`M ${g+2},${k} C ${g+v},${p+2} ${g+v},${p-w} ${g-M},${p-w+2}`;return`
        <path d="${b}" fill="none" stroke="${i}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${P}" fill="none" stroke="${i}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${b}" fill="none" stroke="${f}" stroke-width="${E}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${P}" fill="none" stroke="${f}" stroke-width="${E}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `}case"antlers":{const w=a?8:10,v=a?8:10,M=a?5:6,k=a?3:4,x=k-1,E=[`M ${$},${p+6} L ${$-4},${p-4} L ${$-v},${p-w}`,`M ${$-4},${p-2} L ${$-4-M},${p-2}`,`M ${$-6},${p-6} L ${$-6-M},${p-6}`].join(" "),b=[`M ${g},${p+6} L ${g+4},${p-4} L ${g+v},${p-w}`,`M ${g+4},${p-2} L ${g+4+M},${p-2}`,`M ${g+6},${p-6} L ${g+6+M},${p-6}`].join(" ");return`
        <path d="${E}" fill="none" stroke="${i}" stroke-width="${k}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${b}" fill="none" stroke="${i}" stroke-width="${k}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${E}" fill="none" stroke="${f}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${b}" fill="none" stroke="${f}" stroke-width="${x}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `}default:return""}}function n2(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${r2(c)}
    ${Jp(c)}
    ${e2(c)}
    ${t2(c)}
  `,i=ot(o);return it(i,r,l)}function l2(c){const r=["circle","rounded","square"],l=["round","square","blob","tall"],o=["happy","angry","surprised","silly"],i=["no","spikes","curved","antlers"],f=["yes","no"];return{backgroundShape:O(r,c),backgroundColor:St(c),bodyColor:St(c),eyeColor:"#ffffff",mouthColor:St(c),bodyShape:O(l,c),eyeCount:Gf(1,5,c),hasHorns:O(i,c),hasTeeth:O(f,c),expression:O(o,c)}}var o2={name:"Monsters",schema:Kp,shapeParam:"bodyShape",generate:n2,randomize:l2},i2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},bodyColor:{type:"color",default:"#95a5a6"},accentColor:{type:"color",default:"#3498db"},eyeColor:{type:"color",default:"#e74c3c"},backgroundColor:{type:"color",default:"#2c3e50"},headShape:{type:"select",default:"square",options:["square","round","tall","wide","hexagon","dome"]},antennaStyle:{type:"select",default:"single",options:["single","double","none","dish","bunny","lightning"]},eyeStyle:{type:"select",default:"round",options:["round","visor","led","camera","cyclops","angry","happy"]},mouthStyle:{type:"select",default:"grille",options:["grille","speaker","smile","none","zigzag","dots","rectangle"]},hasPanel:{type:"select",default:"no",options:["yes","no"]},panelLights:{type:"number",default:3,min:1,max:5}};function s2(c){const{accentColor:r,antennaStyle:l,headShape:o}=c,i=S(r,30),f=D(r,40),a=o==="tall"?8:o==="round"||o==="dome"?15:o==="hexagon"?12:18;switch(l){case"single":return`
        <line x1="50" y1="${a}" x2="50" y2="${a-12}" stroke="${r}" stroke-width="3"/>
        <circle cx="50" cy="${a-14}" r="4" fill="${r}"/>
        <circle cx="50" cy="${a-14}" r="2" fill="${f}"/>
      `;case"double":return`
        <line x1="35" y1="${a}" x2="35" y2="${a-10}" stroke="${r}" stroke-width="2"/>
        <circle cx="35" cy="${a-12}" r="3" fill="${r}"/>
        <line x1="65" y1="${a}" x2="65" y2="${a-10}" stroke="${r}" stroke-width="2"/>
        <circle cx="65" cy="${a-12}" r="3" fill="${r}"/>
      `;case"dish":return`
        <line x1="50" y1="${a}" x2="50" y2="${a-8}" stroke="${r}" stroke-width="3"/>
        <ellipse cx="50" cy="${a-10}" rx="12" ry="5" fill="${r}"/>
        <ellipse cx="50" cy="${a-11}" rx="8" ry="3" fill="${i}"/>
      `;case"bunny":return`
        <ellipse cx="38" cy="${a-4}" rx="4" ry="9" fill="${r}"/>
        <ellipse cx="38" cy="${a-4}" rx="2.5" ry="6" fill="${f}" opacity="0.5"/>
        <ellipse cx="62" cy="${a-4}" rx="4" ry="9" fill="${r}"/>
        <ellipse cx="62" cy="${a-4}" rx="2.5" ry="6" fill="${f}" opacity="0.5"/>
      `;case"lightning":return`
        <path d="M45,${a-15} L50,${a-8} L45,${a-8} L50,${a}" fill="${r}"/>
        <path d="M55,${a-15} L50,${a-8} L55,${a-8} L50,${a}" fill="${r}" transform="scale(-1,1) translate(-100,0)"/>
      `;default:return""}}function c2(c){const{bodyColor:r,headShape:l}=c,o=S(r,25),i=D(r,30);switch(l){case"square":return`
        <rect x="18" y="18" width="64" height="64" rx="8" fill="${r}"/>
        <rect x="22" y="22" width="56" height="56" rx="6" fill="${o}" opacity="0.3"/>
        <rect x="22" y="22" width="56" height="8" fill="${i}" opacity="0.5"/>
      `;case"round":return`
        <circle cx="50" cy="50" r="38" fill="${r}"/>
        <circle cx="50" cy="50" r="32" fill="${o}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="25" ry="10" fill="${i}" opacity="0.5"/>
      `;case"tall":return`
        <rect x="22" y="8" width="56" height="80" rx="10" fill="${r}"/>
        <rect x="26" y="12" width="48" height="72" rx="8" fill="${o}" opacity="0.3"/>
        <rect x="26" y="12" width="48" height="10" fill="${i}" opacity="0.5"/>
      `;case"wide":return`
        <rect x="8" y="28" width="84" height="52" rx="8" fill="${r}"/>
        <rect x="12" y="32" width="76" height="44" rx="6" fill="${o}" opacity="0.3"/>
        <rect x="12" y="32" width="76" height="8" fill="${i}" opacity="0.5"/>
      `;case"hexagon":return`
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="${r}"/>
        <polygon points="50,15 80,33 80,67 50,85 20,67 20,33" fill="${o}" opacity="0.3"/>
        <polygon points="50,15 80,33 80,40 50,25 20,40 20,33" fill="${i}" opacity="0.5"/>
      `;case"dome":return`
        <path d="M15,60 L15,45 Q15,10 50,10 Q85,10 85,45 L85,60 Q85,85 50,85 Q15,85 15,60" fill="${r}"/>
        <path d="M20,58 L20,45 Q20,18 50,18 Q80,18 80,45 L80,58 Q80,78 50,78 Q20,78 20,58" fill="${o}" opacity="0.3"/>
        <ellipse cx="50" cy="30" rx="25" ry="12" fill="${i}" opacity="0.5"/>
      `;default:return""}}function a2(c){const{eyeColor:r,eyeStyle:l,headShape:o}=c,i=D(r,40),f=o==="tall"?35:o==="wide"?48:o==="hexagon"?45:o==="dome"?40:42;switch(l){case"round":return`
        <circle cx="35" cy="${f}" r="10" fill="#1a1a2e"/>
        <circle cx="65" cy="${f}" r="10" fill="#1a1a2e"/>
        <circle cx="35" cy="${f}" r="6" fill="${r}"/>
        <circle cx="65" cy="${f}" r="6" fill="${r}"/>
        <circle cx="33" cy="${f-2}" r="2" fill="${i}"/>
        <circle cx="63" cy="${f-2}" r="2" fill="${i}"/>
      `;case"visor":return`
        <rect x="22" y="${f-8}" width="56" height="16" rx="4" fill="#1a1a2e"/>
        <rect x="25" y="${f-5}" width="50" height="10" rx="2" fill="${r}" opacity="0.8"/>
        <rect x="25" y="${f-5}" width="50" height="3" fill="${i}" opacity="0.5"/>
      `;case"led":return`
        <rect x="28" y="${f-6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="60" y="${f-6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="30" y="${f-4}" width="8" height="8" fill="${r}"/>
        <rect x="62" y="${f-4}" width="8" height="8" fill="${r}"/>
        <rect x="30" y="${f-4}" width="8" height="2" fill="${i}"/>
        <rect x="62" y="${f-4}" width="8" height="2" fill="${i}"/>
      `;case"camera":return`
        <circle cx="35" cy="${f}" r="12" fill="#1a1a2e"/>
        <circle cx="65" cy="${f}" r="12" fill="#1a1a2e"/>
        <circle cx="35" cy="${f}" r="8" fill="#2c3e50"/>
        <circle cx="65" cy="${f}" r="8" fill="#2c3e50"/>
        <circle cx="35" cy="${f}" r="4" fill="${r}"/>
        <circle cx="65" cy="${f}" r="4" fill="${r}"/>
        <circle cx="33" cy="${f-2}" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="63" cy="${f-2}" r="1.5" fill="white" opacity="0.8"/>
      `;case"cyclops":return`
        <circle cx="50" cy="${f}" r="15" fill="#1a1a2e"/>
        <circle cx="50" cy="${f}" r="10" fill="${r}"/>
        <circle cx="50" cy="${f}" r="5" fill="#1a1a2e"/>
        <circle cx="47" cy="${f-3}" r="3" fill="${i}"/>
      `;case"angry":return`
        <polygon points="25,${f-5} 45,${f-10} 45,${f+5} 25,${f+5}" fill="#1a1a2e"/>
        <polygon points="75,${f-5} 55,${f-10} 55,${f+5} 75,${f+5}" fill="#1a1a2e"/>
        <circle cx="35" cy="${f}" r="5" fill="${r}"/>
        <circle cx="65" cy="${f}" r="5" fill="${r}"/>
      `;case"happy":return`
        <path d="M25,${f} Q35,${f-12} 45,${f}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M55,${f} Q65,${f-12} 75,${f}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="35" cy="${f-3}" r="3" fill="${r}"/>
        <circle cx="65" cy="${f-3}" r="3" fill="${r}"/>
      `;default:return""}}function u2(c){const{accentColor:r,mouthStyle:l,headShape:o}=c,i=S(r,20),f=o==="tall"||o==="wide"?65:o==="hexagon"?68:o==="dome"?62:65;switch(l){case"grille":return`
        <rect x="32" y="${f}" width="36" height="12" rx="2" fill="#1a1a2e"/>
        <line x1="35" y1="${f+2}" x2="35" y2="${f+10}" stroke="${r}" stroke-width="2"/>
        <line x1="42" y1="${f+2}" x2="42" y2="${f+10}" stroke="${r}" stroke-width="2"/>
        <line x1="50" y1="${f+2}" x2="50" y2="${f+10}" stroke="${r}" stroke-width="2"/>
        <line x1="58" y1="${f+2}" x2="58" y2="${f+10}" stroke="${r}" stroke-width="2"/>
        <line x1="65" y1="${f+2}" x2="65" y2="${f+10}" stroke="${r}" stroke-width="2"/>
      `;case"speaker":return`
        <circle cx="50" cy="${f+6}" r="10" fill="#1a1a2e"/>
        <circle cx="50" cy="${f+6}" r="7" fill="${i}"/>
        <circle cx="50" cy="${f+6}" r="3" fill="${r}"/>
      `;case"smile":return`
        <path d="M35,${f+2} Q50,${f+15} 65,${f+2}" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;case"zigzag":return`
        <path d="M30,${f+5} L38,${f} L46,${f+10} L54,${f} L62,${f+10} L70,${f+5}" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      `;case"dots":return`
        <circle cx="35" cy="${f+6}" r="4" fill="${r}"/>
        <circle cx="50" cy="${f+6}" r="4" fill="${r}"/>
        <circle cx="65" cy="${f+6}" r="4" fill="${r}"/>
      `;case"rectangle":return`
        <rect x="35" y="${f}" width="30" height="10" rx="2" fill="#1a1a2e"/>
        <rect x="38" y="${f+2}" width="24" height="6" fill="${r}"/>
      `;default:return""}}function f2(c){const{bodyColor:r,accentColor:l,headShape:o,hasPanel:i,panelLights:f}=c,a=S(r,30),u=D(l,30);let p="";o==="square"?p=`
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
    `);let y="";if(i==="yes"){const $=o==="tall"?75:o==="dome"?68:78;y=`<rect x="30" y="${$}" width="40" height="8" rx="2" fill="${a}"/>`;const g=36/(f+1);for(let w=1;w<=f;w++){const v=32+g*w,M=[l,u,"#2ecc71","#e74c3c","#f39c12"];y+=`<circle cx="${v}" cy="${$+4}" r="2" fill="${M[(w-1)%M.length]}"/>`}}return p+y}function d2(c){const{bodyColor:r,accentColor:l,headShape:o}=c,i=S(r,30);if(o==="wide"||o==="hexagon")return"";const f=o==="tall"?40:o==="round"||o==="dome"?48:45;return`
    <rect x="5" y="${f-8}" width="10" height="16" rx="2" fill="${r}"/>
    <rect x="85" y="${f-8}" width="10" height="16" rx="2" fill="${r}"/>
    <rect x="7" y="${f-6}" width="6" height="12" rx="1" fill="${i}" opacity="0.5"/>
    <rect x="87" y="${f-6}" width="6" height="12" rx="1" fill="${i}" opacity="0.5"/>
    <circle cx="10" cy="${f}" r="2" fill="${l}"/>
    <circle cx="90" cy="${f}" r="2" fill="${l}"/>
  `}function p2(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${s2(c)}
    ${d2(c)}
    ${c2(c)}
    ${a2(c)}
    ${u2(c)}
    ${f2(c)}
  `,i=ot(o);return it(i,r,l)}function h2(c){const r=["circle","rounded","square"],l=["square","round","tall","wide","hexagon","dome"],o=["single","double","none","dish","bunny","lightning"],i=["round","visor","led","camera","cyclops","angry","happy"],f=["grille","speaker","smile","none","zigzag","dots","rectangle"],a=["yes","no"],u=["#95a5a6","#7f8c8d","#bdc3c7","#34495e","#5d6d7e","#aab7b8","#839192","#616a6b","#2c3e50","#1abc9c","#e74c3c","#9b59b6","#f39c12","#d35400","#c0392b","#8e44ad"];return{backgroundShape:O(r,c),bodyColor:O(u,c),accentColor:St(c),eyeColor:St(c),backgroundColor:St(c),headShape:O(l,c),antennaStyle:O(o,c),eyeStyle:O(i,c),mouthStyle:O(f,c),hasPanel:O(a,c),panelLights:Gf(1,5,c)}}var y2={name:"Robots",schema:i2,shapeParam:"headShape",generate:p2,randomize:h2},$2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},skinColor:{type:"color",default:"#7ed321"},eyeColor:{type:"color",default:"#1a1a2e"},backgroundColor:{type:"color",default:"#0a0a23"},headShape:{type:"select",default:"classic",options:["classic","bulbous","elongated","triangular","squid"]},eyeStyle:{type:"select",default:"large",options:["large","compound","multiple","glowing"]},antennae:{type:"select",default:"none",options:["none","straight","curved","bulbs","feelers"]},mouthStyle:{type:"select",default:"slit",options:["slit","none","small","tentacles","beak"]},markings:{type:"select",default:"none",options:["none","spots","stripes","glow","scales"]}};function k2(c){const{skinColor:r,headShape:l}=c,o=S(r,20),i=D(r,20);switch(l){case"classic":return`
        <ellipse cx="50" cy="45" rx="28" ry="32" fill="${r}"/>
        <ellipse cx="50" cy="70" rx="12" ry="16" fill="${r}"/>
        <ellipse cx="50" cy="42" rx="24" ry="26" fill="${i}" opacity="0.3"/>
      `;case"bulbous":return`
        <ellipse cx="50" cy="50" rx="32" ry="34" fill="${r}"/>
        <ellipse cx="38" cy="38" rx="12" ry="14" fill="${i}" opacity="0.3"/>
        <ellipse cx="62" cy="38" rx="12" ry="14" fill="${i}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="16" ry="12" fill="${i}" opacity="0.2"/>
      `;case"elongated":return`
        <ellipse cx="50" cy="52" rx="20" ry="36" fill="${r}"/>
        <ellipse cx="50" cy="45" rx="16" ry="28" fill="${i}" opacity="0.2"/>
        <path d="M35,62 Q50,90 65,62" fill="${o}" opacity="0.2"/>
      `;case"triangular":return`
        <path d="M50,18 L78,70 Q50,88 22,70 Z" fill="${r}"/>
        <path d="M50,24 L70,62 Q50,75 30,62 Z" fill="${i}" opacity="0.2"/>
      `;case"squid":return`
        <ellipse cx="50" cy="40" rx="28" ry="24" fill="${r}"/>
        <ellipse cx="50" cy="36" rx="22" ry="18" fill="${i}" opacity="0.2"/>
        <path d="M28,52 Q24,70 28,80" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M40,56 Q37,74 40,84" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M50,58 Q50,76 50,86" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M60,56 Q63,74 60,84" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M72,52 Q76,70 72,80" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
      `;default:return""}}function m2(c){const{eyeColor:r,eyeStyle:l}=c,o=D(r,40);switch(l){case"large":return`
        <ellipse cx="38" cy="48" rx="10" ry="14" fill="${r}"/>
        <ellipse cx="62" cy="48" rx="10" ry="14" fill="${r}"/>
        <ellipse cx="36" cy="44" rx="3" ry="5" fill="${o}" opacity="0.6"/>
        <ellipse cx="60" cy="44" rx="3" ry="5" fill="${o}" opacity="0.6"/>
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
      `;default:return""}}function x2(c){const{skinColor:r,antennae:l}=c,o=D(r,30);switch(l){case"straight":return`
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
      `;default:return""}}function g2(c){const{skinColor:r,mouthStyle:l}=c,o=S(r,40);switch(l){case"slit":return`<line x1="44" y1="68" x2="56" y2="68" stroke="${o}" stroke-width="2" stroke-linecap="round"/>`;case"small":return`<ellipse cx="50" cy="68" rx="3" ry="2.5" fill="${o}"/>`;case"tentacles":return`
        <path d="M42,66 Q40,74 38,78" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M47,68 Q46,76 44,82" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M53,68 Q54,76 56,82" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M58,66 Q60,74 62,78" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      `;case"beak":return`
        <path d="M46,64 L50,76 L54,64 Z" fill="${o}"/>
      `;default:return""}}function w2(c){const{skinColor:r,markings:l}=c,o=S(r,25),i=D(r,40);switch(l){case"spots":return`
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
        <ellipse cx="50" cy="50" rx="20" ry="16" fill="${i}" opacity="0.3"/>
        <ellipse cx="50" cy="50" rx="12" ry="10" fill="${i}" opacity="0.3"/>
      `;case"scales":return`
        <pattern id="scales" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${o}" opacity="0.2"/>
        </pattern>
        <ellipse cx="50" cy="50" rx="24" ry="28" fill="url(#scales)"/>
      `;default:return""}}function v2(c){const{backgroundShape:r,backgroundColor:l}=c,o=`
    ${x2(c)}
    ${k2(c)}
    ${w2(c)}
    ${m2(c)}
    ${g2(c)}
  `;return it(ot(o),r,l)}function M2(c){const r=["circle","rounded","square"],l=["classic","bulbous","elongated","triangular","squid"],o=["large","compound","multiple","glowing"],i=["none","straight","curved","bulbs","feelers"],f=["slit","none","small","tentacles","beak"],a=["none","spots","stripes","glow","scales"],u=["#7ed321","#4a9c2d","#2ecc71","#1abc9c","#3498db","#9b59b6","#8e44ad","#6c5ce7","#a0a0a0","#7f8c8d","#95a5a6","#bdc3c7","#e74c3c","#f39c12","#00cec9"],p=["#1a1a2e","#0f0f1a","#2c3e50","#000000","#e74c3c","#f1c40f","#9b59b6","#00ff00"],y=["#0a0a23","#1a1a2e","#16213e","#0f3460","#1b1b2f","#2c2c54","#40407a","#000000","#1e272e","#2f3640"];return{backgroundShape:O(r,c),skinColor:O(u,c),eyeColor:O(p,c),backgroundColor:O(y,c),headShape:O(l,c),eyeStyle:O(o,c),antennae:O(i,c),mouthStyle:O(f,c),markings:O(a,c)}}var C2={name:"Aliens",schema:$2,shapeParam:"headShape",generate:v2,randomize:M2},S2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},creatureType:{type:"select",default:"octopus",options:["octopus","fish","jellyfish","crab","whale","seahorse","pufferfish","turtle","shark","starfish"]},primaryColor:{type:"color",default:"#3498db"},secondaryColor:{type:"color",default:"#ecf0f1"},eyeColor:{type:"color",default:"#2c3e50"},backgroundColor:{type:"color",default:"#1a5276"},expression:{type:"select",default:"happy",options:["happy","neutral","surprised","grumpy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","scales"]}};function gn(c,r,l,o,i,f,a){const u=a,p=u*.5,y=u*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"neutral":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p}" fill="${r}"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"grumpy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <line x1="${l-u}" y1="${o-u}" x2="${l+u}" y2="${o-u*.5}" stroke="${r}" stroke-width="2"/>
        <line x1="${i+u}" y1="${f-u}" x2="${i-u}" y2="${f-u*.5}" stroke="${r}" stroke-width="2"/>
      `;default:return""}}function At(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"neutral":return`<line x1="${l-5}" y1="${o}" x2="${l+5}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"grumpy":return`<path d="M${l-6},${o+3} Q${l},${o-3} ${l+6},${o+3}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;default:return""}}function sr(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-i*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+i*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+i*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+i*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-i*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.3} Q${r},${l-i*.4} ${r+o*.7},${l-i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-i*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"scales":{const u=`ocean-scales-${r}-${l}`;return`
        <defs>
          <pattern id="${u}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${i*.85}" fill="url(#${u})"/>
      `}default:return""}}function If(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,$=gn(i,o,40,36,60,36,5),g=At(i,a,50,48),w=sr(r,50,38,24,22,f);return p+y+u+w+$+g}function E2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
    <circle cx="58" cy="${i==="happy"?47:46}" r="${i==="surprised"?2:3}" fill="${o}"/>
    ${i==="happy"?'<circle cx="57" cy="45" r="1.3" fill="white"/>':""}
    ${i==="grumpy"?`<line x1="54" y1="41" x2="62" y2="43" stroke="${o}" stroke-width="1.5"/>`:""}
  `,w=At(i,a,68,52),v=sr(r,45,50,30,18,f);return u+p+y+$+v+g+w}function Q2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=D(r,30),u=`
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
  `,g=gn(i,o,42,36,58,36,4),w=At(i,S(r,25),50,44),v=sr(r,50,34,22,16,f);return y+u+p+$+v+g+w}function F2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,g=gn(i,o,34,28,66,28,4),w=At(i,a,50,60),v=sr(r,50,55,28,18,f);return y+u+v+p+$+g+w}function L2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="50" cy="52" rx="36" ry="26" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="28" ry="16" fill="${l}" opacity="0.5"/>
  `,p=`
    <path d="M14,52 Q6,40 4,32 Q10,38 14,42" fill="${a}"/>
    <path d="M14,52 Q6,64 4,72 Q10,66 14,62" fill="${a}"/>
  `,y=`
    <path d="M42,65 Q36,75 30,78 Q38,72 42,68" fill="${a}" opacity="0.6"/>
  `,$=i==="happy"?`
      <path d="M62,26 Q60,18 56,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M62,26 Q64,18 68,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <circle cx="54" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
      <circle cx="70" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
    `:"",g=`
    <circle cx="68" cy="48" r="5" fill="white"/>
    <circle cx="68" cy="${i==="happy"?49:48}" r="${i==="surprised"?2:3}" fill="${o}"/>
    ${i==="happy"?'<circle cx="67" cy="47" r="1.3" fill="white"/>':""}
    ${i==="grumpy"?`<line x1="64" y1="43" x2="72" y2="45" stroke="${o}" stroke-width="1.5"/>`:""}
  `,w=At(i,a,74,56),v=sr(r,50,50,36,26,f);return p+u+y+v+g+w+$}function _2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <path d="M50,16 Q62,16 62,28 Q62,40 50,44 Q38,48 38,60 Q38,72 50,76 Q54,78 52,84 Q48,90 44,88 Q38,84 40,78" fill="${r}" stroke="${a}" stroke-width="1"/>
  `,y=`
    <path d="M52,20 Q58,20 58,30 Q58,38 50,42 Q44,46 44,56 Q44,66 50,70" fill="${l}" opacity="0.3" stroke="none"/>
  `,$=`
    <path d="M50,16 Q50,12 56,10 Q60,10 60,14" fill="${r}" stroke="${a}" stroke-width="1"/>
  `,g=`
    <path d="M62,28 Q68,32 66,38 Q64,42 58,42" fill="${u}" opacity="0.6" stroke="${a}" stroke-width="0.5"/>
  `,w=`
    <line x1="48" y1="16" x2="46" y2="10" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="52" y1="14" x2="52" y2="8" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="56" y1="16" x2="58" y2="10" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,v=`
    <circle cx="56" cy="24" r="4" fill="white"/>
    <circle cx="56" cy="${i==="happy"?25:24}" r="${i==="surprised"?1.5:2.2}" fill="${o}"/>
    ${i==="happy"?'<circle cx="55" cy="23" r="1" fill="white"/>':""}
    ${i==="grumpy"?`<line x1="53" y1="20" x2="59" y2="22" stroke="${o}" stroke-width="1.2"/>`:""}
  `,M=At(i,a,58,12),k=sr(r,50,44,14,28,f);return p+y+$+g+w+k+v+M}function P2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <circle cx="50" cy="50" r="28" fill="${r}"/>
    <circle cx="50" cy="56" r="18" fill="${l}" opacity="0.3"/>
  `;let p="";for(let M=0;M<16;M++){const k=M*Math.PI*2/16,x=50+Math.cos(k)*28,E=50+Math.sin(k)*28,b=50+Math.cos(k)*34,P=50+Math.sin(k)*34;p+=`<line x1="${x.toFixed(1)}" y1="${E.toFixed(1)}" x2="${b.toFixed(1)}" y2="${P.toFixed(1)}" stroke="${a}" stroke-width="2" stroke-linecap="round"/>`}const y=`
    <path d="M22,50 L12,42 L14,50 L12,58 Z" fill="${a}" opacity="0.7"/>
  `,$=`
    <ellipse cx="38" cy="62" rx="5" ry="3" fill="${a}" opacity="0.5" transform="rotate(-20, 38, 62)"/>
    <ellipse cx="62" cy="62" rx="5" ry="3" fill="${a}" opacity="0.5" transform="rotate(20, 62, 62)"/>
  `,g=gn(i,o,40,44,60,44,5.5),w=At(i,a,50,58),v=sr(r,50,50,28,28,f);return p+y+u+$+v+g+w}function A2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i}=c,f=S(r,15),a=`
    <ellipse cx="50" cy="52" rx="30" ry="24" fill="${r}"/>
  `,u=`
    <path d="M50,32 L65,40 L65,56 L50,64 L35,56 L35,40 Z" fill="none" stroke="${f}" stroke-width="1.5"/>
    <line x1="50" y1="32" x2="50" y2="28" stroke="${f}" stroke-width="1.5"/>
    <line x1="65" y1="40" x2="74" y2="36" stroke="${f}" stroke-width="1.5"/>
    <line x1="65" y1="56" x2="74" y2="60" stroke="${f}" stroke-width="1.5"/>
    <line x1="50" y1="64" x2="50" y2="70" stroke="${f}" stroke-width="1.5"/>
    <line x1="35" y1="56" x2="26" y2="60" stroke="${f}" stroke-width="1.5"/>
    <line x1="35" y1="40" x2="26" y2="36" stroke="${f}" stroke-width="1.5"/>
  `,p=`
    <ellipse cx="50" cy="28" rx="10" ry="8" fill="${l}"/>
  `,y=`
    <ellipse cx="26" cy="46" rx="6" ry="4" fill="${l}" transform="rotate(-30, 26, 46)"/>
    <ellipse cx="74" cy="46" rx="6" ry="4" fill="${l}" transform="rotate(30, 74, 46)"/>
    <ellipse cx="28" cy="64" rx="6" ry="4" fill="${l}" transform="rotate(20, 28, 64)"/>
    <ellipse cx="72" cy="64" rx="6" ry="4" fill="${l}" transform="rotate(-20, 72, 64)"/>
  `,$=`
    <path d="M50,76 L50,82 L48,80" fill="${l}"/>
  `,g=gn(i,o,46,26,54,26,3),w=At(i,S(l,40),50,33);return y+$+a+u+p+g+w}function N2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <path d="M15,50 Q10,44 20,40 Q35,32 60,34 Q80,36 88,50 Q80,64 60,66 Q35,68 20,60 Q10,56 15,50 Z" fill="${r}"/>
  `,p=`
    <path d="M20,54 Q35,62 60,62 Q78,60 85,52 Q78,58 60,60 Q35,60 20,54 Z" fill="${l}" opacity="0.5"/>
  `,y=`
    <path d="M45,34 L50,14 L58,34" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,$=`
    <path d="M15,50 L4,36 L10,48 L4,62 Z" fill="${a}"/>
  `,g=`
    <path d="M40,58 Q34,68 28,72 Q36,66 40,60" fill="${a}" opacity="0.6"/>
  `,w=i==="grumpy"||i==="happy"?`
      <path d="M78,52 L80,54 L82,52 L84,54 L86,52" stroke="white" stroke-width="1" fill="none"/>
    `:"",v=`
    <line x1="65" y1="44" x2="65" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
    <line x1="68" y1="44" x2="68" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
    <line x1="71" y1="44" x2="71" y2="50" stroke="${a}" stroke-width="1" opacity="0.4"/>
  `,M=`
    <circle cx="76" cy="44" r="4" fill="white"/>
    <circle cx="76" cy="${i==="happy"?45:44}" r="${i==="surprised"?1.5:2.5}" fill="${o}"/>
    ${i==="happy"?'<circle cx="75" cy="43" r="1" fill="white"/>':""}
    ${i==="grumpy"?`<line x1="73" y1="40" x2="79" y2="41" stroke="${o}" stroke-width="1.5"/>`:""}
  `,k=At(i,a,82,52),x=sr(r,48,48,32,16,f);return $+u+p+y+g+v+x+M+w+k}function I2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=50,p=50,y=32,$=14;let g="M";for(let b=0;b<5;b++){const P=(b*72-90)*(Math.PI/180),N=u+Math.cos(P)*y,B=p+Math.sin(P)*y,J=(b*72+36-90)*(Math.PI/180),V=u+Math.cos(J)*$,j=p+Math.sin(J)*$,_=(b*72-36-90)*(Math.PI/180),z=u+Math.cos(_)*$,Z=p+Math.sin(_)*$;b===0&&(g+=`${z.toFixed(1)},${Z.toFixed(1)} `),g+=`Q${N.toFixed(1)},${B.toFixed(1)} ${V.toFixed(1)},${j.toFixed(1)} `}g+="Z";const w=`<path d="${g}" fill="${r}"/>`,v=`
    <circle cx="${u}" cy="${p}" r="10" fill="${l}" opacity="0.3"/>
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
  `,k=gn(i,o,46,46,54,46,3.5),x=At(i,a,50,54),E=sr(r,u,p,20,20,f);return w+v+M+E+k+x}function b2(c){const{backgroundShape:r,creatureType:l,backgroundColor:o}=c;let i;switch(l){case"octopus":i=If(c);break;case"fish":i=E2(c);break;case"jellyfish":i=Q2(c);break;case"crab":i=F2(c);break;case"whale":i=L2(c);break;case"seahorse":i=_2(c);break;case"pufferfish":i=P2(c);break;case"turtle":i=A2(c);break;case"shark":i=N2(c);break;case"starfish":i=I2(c);break;default:i=If(c)}const f=ot(i);return it(f,r,o)}function T2(c){const r=["circle","rounded","square"],l=["octopus","fish","jellyfish","crab","whale","seahorse","pufferfish","turtle","shark","starfish"],o=["happy","neutral","surprised","grumpy"],i=["none","spots","stripes","scales"],f=["#3498db","#2980b9","#1abc9c","#16a085","#e74c3c","#e67e22","#f39c12","#9b59b6","#2ecc71","#27ae60","#00bcd4","#0097a7","#ff7043","#ff5252","#7e57c2","#26c6da"],a=["#ecf0f1","#ffffff","#fdf2e9","#fef9e7","#eaf2f8","#e8f8f5","#f5eef8","#fdebd0"],u=["#1a5276","#154360","#0e3d5c","#1b4f72","#0b3d6e","#163a5f","#0a2e4d","#1c3f60","#0d4f6e","#103d55","#0c2d48","#12394f"],p=["#2c3e50","#ffffff","#f1c40f","#27ae60","#1a3c6e"];return{backgroundShape:O(r,c),creatureType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),eyeColor:O(p,c),backgroundColor:O(u,c),expression:O(o,c),pattern:O(i,c)}}var j2={name:"Ocean",schema:S2,shapeParam:"creatureType",generate:b2,randomize:T2},R2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},dinosaurType:{type:"select",default:"trex",options:["trex","triceratops","stegosaurus","brachiosaurus","pterodactyl","ankylosaurus","velociraptor","parasaurolophus","spinosaurus","pachycephalosaurus"]},primaryColor:{type:"color",default:"#6b8e23"},secondaryColor:{type:"color",default:"#f5e6c8"},eyeColor:{type:"color",default:"#2c3e50"},backgroundColor:{type:"color",default:"#8b7355"},expression:{type:"select",default:"happy",options:["happy","fierce","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","plates"]}};function wn(c,r,l,o,i,f,a){const u=a,p=u*.5,y=u*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"fierce":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <line x1="${l-u}" y1="${o-u}" x2="${l+u}" y2="${o-u*.4}" stroke="${r}" stroke-width="2"/>
        <line x1="${i+u}" y1="${f-u}" x2="${i-u}" y2="${f-u*.4}" stroke="${r}" stroke-width="2"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Bo(c,r,l,o,i){const f=i,a=f*.5,u=f*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${u}" fill="white"/>
      `;case"fierce":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <line x1="${l-f}" y1="${o-f}" x2="${l+f}" y2="${o-f*.4}" stroke="${r}" stroke-width="1.5"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${u}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <path d="M${l-f},${o-f*.3} Q${l},${o-f*.8} ${l+f},${o-f*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Nt(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"fierce":return`
        <path d="M${l-7},${o} Q${l},${o+4} ${l+7},${o}" fill="${r}"/>
        <polygon points="${l-4},${o} ${l-3},${o+3} ${l-2},${o}" fill="white"/>
        <polygon points="${l-1},${o} ${l},${o+3} ${l+1},${o}" fill="white"/>
        <polygon points="${l+2},${o} ${l+3},${o+3} ${l+4},${o}" fill="white"/>
      `;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"sleepy":return`<line x1="${l-4}" y1="${o}" x2="${l+4}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;default:return""}}function It(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-i*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+i*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+i*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+i*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-i*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.3} Q${r},${l-i*.4} ${r+o*.7},${l-i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-i*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"plates":{const u=`dino-plates-${r}-${l}`;return`
        <defs>
          <pattern id="${u}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,8 L4,2 L8,8" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${i*.85}" fill="url(#${u})"/>
      `}default:return""}}function bf(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="20" ry="17" fill="${r}"/>
    <ellipse cx="50" cy="30" rx="16" ry="10" fill="${D(r,15)}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="42" rx="14" ry="6" fill="${a}" opacity="0.15"/>
  `,$=`
    <path d="M38,56 Q34,58 33,62" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,56 Q66,58 67,62" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,g=`
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${a}"/>
  `,w=`
    <path d="M50,78 Q36,82 28,76 Q24,73 26,70" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `,v=`
    <circle cx="45" cy="40" r="1" fill="${a}"/>
    <circle cx="55" cy="40" r="1" fill="${a}"/>
  `,M=wn(i,o,42,30,58,30,5),k=Nt(i,a,50,46),x=It(r,50,34,20,17,f);return w+g+u+$+p+y+x+v+M+k}function z2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <path d="M14,38 Q12,22 24,14 Q34,8 50,6 Q66,8 76,14 Q88,22 86,38 Z" fill="${u}" stroke="${a}" stroke-width="1.5"/>
    <circle cx="26" cy="20" r="3" fill="${a}" opacity="0.2"/>
    <circle cx="50" cy="14" r="3" fill="${a}" opacity="0.2"/>
    <circle cx="74" cy="20" r="3" fill="${a}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="46" rx="22" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="14" ry="10" fill="${l}" opacity="0.3"/>
  `,$=`
    <polygon points="38,34 36,18 40,32" fill="${u}" stroke="${a}" stroke-width="0.5"/>
    <polygon points="62,34 64,18 60,32" fill="${u}" stroke="${a}" stroke-width="0.5"/>
    <polygon points="50,54 50,48 52,53" fill="${u}" stroke="${a}" stroke-width="0.5"/>
  `,g=`
    <ellipse cx="50" cy="72" rx="18" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="76" rx="12" ry="8" fill="${l}" opacity="0.3"/>
  `,w=`
    <rect x="34" y="80" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="58" y="80" width="8" height="10" rx="3" fill="${a}"/>
  `,v=`
    <path d="M42,58 Q50,64 58,58" fill="${a}" opacity="0.15"/>
  `,M=wn(i,o,40,40,60,40,5),k=Nt(i,a,50,60),x=It(r,50,46,22,20,f);return w+g+p+y+v+x+$+M+k}function B2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,25),p=`
    <ellipse cx="48" cy="58" rx="30" ry="16" fill="${r}"/>
    <ellipse cx="48" cy="64" rx="22" ry="8" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="82" cy="56" rx="10" ry="8" fill="${r}"/>
    <ellipse cx="85" cy="58" rx="5" ry="4" fill="${l}" opacity="0.3"/>
  `,$=`
    <path d="M72,52 Q78,50 82,52" fill="${r}" stroke="${r}" stroke-width="10"/>
  `,g=`
    <polygon points="30,42 34,28 38,42" fill="${u}" stroke="${a}" stroke-width="1"/>
    <polygon points="38,42 43,24 48,42" fill="${u}" stroke="${a}" stroke-width="1"/>
    <polygon points="46,42 52,26 58,42" fill="${u}" stroke="${a}" stroke-width="1"/>
    <polygon points="54,42 59,30 64,42" fill="${u}" stroke="${a}" stroke-width="1"/>
    <polygon points="62,44 66,34 70,44" fill="${u}" stroke="${a}" stroke-width="1"/>
  `,w=`
    <path d="M18,58 Q8,56 4,52" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <line x1="6" y1="52" x2="2" y2="44" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="8" y1="54" x2="2" y2="50" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
  `,v=`
    <rect x="32" y="70" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="42" y="70" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="58" y="70" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="68" y="70" width="7" height="10" rx="3" fill="${a}"/>
  `,M=Bo(i,o,85,54,3.5),k=Nt(i,a,90,60),x=It(r,48,58,30,16,f);return w+v+p+$+y+g+x+M+k}function D2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="52" cy="72" rx="24" ry="18" fill="${r}"/>
    <ellipse cx="52" cy="78" rx="16" ry="10" fill="${l}" opacity="0.3"/>
  `,p=`
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${r}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${D(r,10)}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
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
  `,w=`
    <path d="M30,68 Q20,64 14,68" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,v=wn(i,o,42,11,52,11,3),M=Nt(i,a,46,17),k=It(r,52,72,24,18,f);return w+g+u+p+y+k+$+v+M}function O2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <path d="M50,44 L8,30 L12,48 L26,46 L38,48 Z" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M50,44 L92,30 L88,48 L74,46 L62,48 Z" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M50,44 L8,30 L12,48" fill="${u}" opacity="0.2"/>
    <path d="M50,44 L92,30 L88,48" fill="${u}" opacity="0.2"/>
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
  `,w=`
    <path d="M52,26 Q58,20 66,18 Q60,24 54,28" fill="${u}" stroke="${a}" stroke-width="0.5"/>
  `,v=`
    <polygon points="50,36 46,39 50,38 54,39" fill="${a}"/>
  `,M=`
    <path d="M46,64 L44,72 L42,71 L44,72 L46,71" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M54,64 L56,72 L58,71 L56,72 L54,71" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,k=wn(i,o,46,30,54,30,3.5),x=Nt(i,a,50,38),E=It(r,50,52,10,12,f);return p+y+M+$+g+w+v+E+k+x}function U2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,w=`
    <rect x="30" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="44" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="58" y="66" width="9" height="10" rx="3" fill="${a}"/>
    <rect x="70" y="66" width="9" height="10" rx="3" fill="${a}"/>
  `,v=Bo(i,o,88,50,3.5),M=Nt(i,a,92,56),k=It(r,50,52,32,18,f);return g+w+u+p+k+y+$+v+M}function V2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <ellipse cx="46" cy="52" rx="20" ry="14" fill="${r}"/>
    <ellipse cx="46" cy="58" rx="12" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="74" cy="38" rx="12" ry="9" fill="${r}"/>
    <ellipse cx="78" cy="40" rx="6" ry="5" fill="${l}" opacity="0.2"/>
  `,$=`
    <path d="M62,46 Q68,42 72,40" stroke="${r}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `,g=`
    <circle cx="82" cy="36" r="1" fill="${a}"/>
  `,w=`
    <path d="M56,48 Q60,52 58,56" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L56,56 L60,56 L58,54" fill="${u}" opacity="0.6"/>
  `,v=`
    <path d="M40,62 L36,72 L32,80" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32,80 L28,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36,72 L33,68" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52,62 L50,72 L46,80" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M46,80 L42,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,72 L47,68" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M26,52 Q14,48 6,44 Q2,42 4,40" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,k=`
    <path d="M4,40 L2,36 L6,38 L4,34 L8,38" fill="${u}" opacity="0.5"/>
  `,x=Bo(i,o,78,36,4),E=Nt(i,a,84,42),b=It(r,46,52,20,14,f);return M+k+v+p+w+$+y+g+b+x+E}function H2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,15),p=`
    <ellipse cx="50" cy="66" rx="18" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="12" ry="12" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${r}"/>
  `,$=`
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${u}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${a}" stroke-width="1" fill="none" opacity="0.3"/>
  `,g=`
    <ellipse cx="50" cy="48" rx="12" ry="5" fill="${u}" opacity="0.3"/>
  `,w=`
    <rect x="38" y="82" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="82" width="8" height="12" rx="3" fill="${a}"/>
  `,v=`
    <path d="M36,72 Q28,76 22,74" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M34,60 Q30,64 28,68" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,60 Q70,64 72,68" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,k=wn(i,o,43,34,57,34,4.5),x=Nt(i,a,50,50),E=It(r,50,38,16,14,f);return v+w+p+M+y+$+g+E+k+x}function Z2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,25),p=`
    <ellipse cx="48" cy="58" rx="28" ry="14" fill="${r}"/>
    <ellipse cx="48" cy="64" rx="20" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <path d="M28,44 Q32,16 42,12 Q50,10 58,14 Q66,18 70,44" fill="${u}" stroke="${a}" stroke-width="1"/>
    <line x1="36" y1="18" x2="38" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="12" x2="50" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="62" y1="20" x2="60" y2="44" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
  `,$=`
    <ellipse cx="82" cy="52" rx="14" ry="8" fill="${r}"/>
    <ellipse cx="90" cy="54" rx="6" ry="4" fill="${a}" opacity="0.1"/>
  `,g=`
    <path d="M72,52 Q76,50 80,50" stroke="${r}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `,w=`
    <circle cx="92" cy="50" r="1" fill="${a}"/>
  `,v=`
    <rect x="32" y="68" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="44" y="68" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="56" y="68" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="66" y="68" width="7" height="10" rx="3" fill="${a}"/>
  `,M=`
    <path d="M20,58 Q10,56 4,54" stroke="${r}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `,k=Bo(i,o,86,50,3.5),x=Nt(i,a,94,56),E=It(r,48,58,28,14,f);return M+v+p+y+g+$+E+w+k+x}function W2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),p=`
    <ellipse cx="50" cy="24" rx="18" ry="14" fill="${D(r,20)}"/>
    <ellipse cx="50" cy="22" rx="14" ry="10" fill="${D(r,35)}" opacity="0.3"/>
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
  `,w=`
    <path d="M36,56 Q32,60 30,64" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,56 Q68,60 70,64" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,v=`
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${a}"/>
  `,M=`
    <path d="M42,74 Q32,80 24,78 Q20,76 22,72" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,k=wn(i,o,44,38,56,38,4),x=Nt(i,a,50,48),E=It(r,50,62,16,18,f);return M+v+g+w+$+p+y+E+k+x}function q2(c){const{backgroundShape:r,dinosaurType:l,backgroundColor:o}=c;let i;switch(l){case"trex":i=bf(c);break;case"triceratops":i=z2(c);break;case"stegosaurus":i=B2(c);break;case"brachiosaurus":i=D2(c);break;case"pterodactyl":i=O2(c);break;case"ankylosaurus":i=U2(c);break;case"velociraptor":i=V2(c);break;case"parasaurolophus":i=H2(c);break;case"spinosaurus":i=Z2(c);break;case"pachycephalosaurus":i=W2(c);break;default:i=bf(c)}const f=ot(i);return it(f,r,o)}function Y2(c){const r=["circle","rounded","square"],l=["trex","triceratops","stegosaurus","brachiosaurus","pterodactyl","ankylosaurus","velociraptor","parasaurolophus","spinosaurus","pachycephalosaurus"],o=["happy","fierce","surprised","sleepy"],i=["none","spots","stripes","plates"],f=["#6b8e23","#556b2f","#8fbc8f","#228b22","#cd853f","#8b6914","#a0522d","#b8860b","#708090","#4682b4","#6a5acd","#9370db","#c75b39","#d4a574","#7b6843","#9caf88"],a=["#f5e6c8","#fdf2e9","#fef9e7","#e8f5e9","#fff8e1","#ffffff","#f0e68c","#ffe4c4"],u=["#8b7355","#6b4226","#556b2f","#2e4a1e","#8b4513","#a0785a","#5c4033","#3e6b48","#7a6652","#4a6741","#9e8c6c","#6e5c3b"],p=["#2c3e50","#f1c40f","#e67e22","#27ae60","#c0392b"];return{backgroundShape:O(r,c),dinosaurType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),eyeColor:O(p,c),backgroundColor:O(u,c),expression:O(o,c),pattern:O(i,c)}}var G2={name:"Dinosaurs",schema:R2,shapeParam:"dinosaurType",generate:q2,randomize:Y2},X2={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},creatureType:{type:"select",default:"dragon",options:["dragon","unicorn","phoenix","griffin","yeti","cerberus","kitsune","minotaur","fairy","hydra"]},primaryColor:{type:"color",default:"#7b2d8e"},secondaryColor:{type:"color",default:"#f0e6ff"},eyeColor:{type:"color",default:"#ffd700"},backgroundColor:{type:"color",default:"#1a0a2e"},expression:{type:"select",default:"happy",options:["happy","majestic","surprised","mysterious"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","scales"]}};function ft(c,r,l,o,i,f,a){const u=a,p=u*.5,y=u*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"majestic":return`
        <ellipse cx="${l}" cy="${o}" rx="${u}" ry="${u*.75}" fill="white"/>
        <ellipse cx="${i}" cy="${f}" rx="${u}" ry="${u*.75}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p}" fill="${r}"/>
        <line x1="${l-u}" y1="${o-u*.9}" x2="${l+u}" y2="${o-u*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
        <line x1="${i+u}" y1="${f-u*.9}" x2="${i-u}" y2="${f-u*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"mysterious":return`
        <ellipse cx="${l}" cy="${o}" rx="${u}" ry="${u*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${i}" cy="${f}" rx="${u}" ry="${u*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${l}" cy="${o}" rx="${p}" ry="${p*.6}" fill="${r}"/>
        <ellipse cx="${i}" cy="${f}" rx="${p}" ry="${p*.6}" fill="${r}"/>
      `;default:return""}}function K2(c,r,l,o,i){const f=i,a=f*.5,u=f*.3;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${f}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${a}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${u}" fill="white"/>
      `;case"majestic":return`
        <ellipse cx="${l}" cy="${o}" rx="${f}" ry="${f*.75}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a}" fill="${r}"/>
        <line x1="${l-f}" y1="${o-f*.9}" x2="${l+f}" y2="${o-f*.7}" stroke="${r}" stroke-width="1.5" opacity="0.6"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${f*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${a*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${u}" fill="white"/>
      `;case"mysterious":return`
        <ellipse cx="${l}" cy="${o}" rx="${f}" ry="${f*.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${l}" cy="${o}" rx="${a}" ry="${a*.6}" fill="${r}"/>
      `;default:return""}}function Et(c,r,l,o){switch(c){case"happy":return`<path d="M${l-6},${o} Q${l},${o+6} ${l+6},${o}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"majestic":return`<path d="M${l-4},${o} Q${l},${o+2} ${l+4},${o-1}" stroke="${r}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="3" ry="4" fill="${r}"/>`;case"mysterious":return`<line x1="${l-5}" y1="${o}" x2="${l+5}" y2="${o}" stroke="${r}" stroke-width="1.5" stroke-linecap="round"/>`;default:return""}}function bt(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.4}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.3}" cy="${l-i*.3}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.1}" cy="${l+i*.3}" r="${o*.07}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.5}" cy="${l+i*.1}" r="${o*.06}" fill="${a}" opacity="0.4"/>
        <circle cx="${r-o*.5}" cy="${l+i*.15}" r="${o*.05}" fill="${a}" opacity="0.4"/>
        <circle cx="${r+o*.15}" cy="${l-i*.5}" r="${o*.05}" fill="${a}" opacity="0.4"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.3} Q${r},${l-i*.4} ${r+o*.7},${l-i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.8},${l} Q${r},${l-i*.1} ${r+o*.8},${l}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="2" fill="none" opacity="0.4"/>
      `;case"scales":{const u=`myth-scales-${r}-${l}`;return`
        <defs>
          <pattern id="${u}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${a}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${i*.85}" fill="url(#${u})"/>
      `}default:return""}}function Tf(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,p=`
    <ellipse cx="50" cy="34" rx="18" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="30" rx="14" ry="10" fill="${D(r,15)}" opacity="0.2"/>
  `,y=`
    <path d="M38,24 Q34,14 30,10" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,24 Q66,14 70,10" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,$=`
    <path d="M34,50 L10,32 L16,42 L8,38 L18,48 L14,44 L26,52" fill="${r}" stroke="${a}" stroke-width="0.5" opacity="0.8"/>
    <path d="M66,50 L90,32 L84,42 L92,38 L82,48 L86,44 L74,52" fill="${r}" stroke="${a}" stroke-width="0.5" opacity="0.8"/>
  `,g=`
    <rect x="38" y="76" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="54" y="76" width="8" height="10" rx="3" fill="${a}"/>
  `,w=`
    <path d="M50,78 Q36,84 26,80 Q20,76 18,72" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M18,72 L14,68 L20,72 L16,74" fill="${a}"/>
  `,v=`
    <circle cx="45" cy="40" r="1" fill="${a}"/>
    <circle cx="55" cy="40" r="1" fill="${a}"/>
  `,M=i==="majestic"?'<path d="M56,44 Q60,40 58,36 Q62,40 60,44" fill="#ff6b35" opacity="0.6"/>':"",k=ft(i,o,42,30,58,30,5),x=Et(i,a,50,44),E=bt(r,50,34,18,16,f);return w+g+u+$+p+y+E+v+k+x+M}function J2(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <ellipse cx="50" cy="66" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="70" rx="10" ry="12" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="36" rx="12" ry="8" fill="${u}" opacity="0.2"/>
  `,$=`
    <path d="M50,24 L48,8 L52,8 Z" fill="#ffd700"/>
    <path d="M49,22 Q50,18 51,14 Q50,16 49,18" stroke="#e6c200" stroke-width="0.5" fill="none"/>
    <path d="M49,16 Q50,12 51,10" stroke="#e6c200" stroke-width="0.5" fill="none"/>
  `,g=`
    <path d="M36,28 Q30,34 28,44 Q26,52 30,58" stroke="#ff69b4" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M38,26 Q34,32 32,40 Q30,48 34,56" stroke="#9b59b6" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M64,28 Q70,34 72,44 Q74,52 70,58" stroke="#3498db" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M62,26 Q66,32 68,40 Q70,48 66,56" stroke="#2ecc71" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,w=`
    <path d="M38,26 Q36,18 40,22" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M62,26 Q64,18 60,22" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,v=`
    <rect x="38" y="80" width="7" height="12" rx="3" fill="${a}"/>
    <rect x="55" y="80" width="7" height="12" rx="3" fill="${a}"/>
  `,M=`
    <path d="M42,82 Q32,88 26,84" stroke="#ff69b4" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M42,82 Q34,90 28,88" stroke="#9b59b6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,k=ft(i,o,43,36,57,36,4.5),x=Et(i,a,50,46),E=bt(r,50,38,16,14,f);return M+v+p+g+y+w+$+E+k+x}function eh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,30),p=`
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
    <path d="M38,44 L8,28 L14,38" fill="${u}" opacity="0.3"/>
    <path d="M62,44 L92,28 L86,38" fill="${u}" opacity="0.3"/>
  `,w=`
    <path d="M46,66 Q38,78 30,90 Q28,94 32,92" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50,68 Q50,80 50,92 Q50,96 52,94" stroke="#ff6b35" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M54,66 Q62,78 70,90 Q72,94 68,92" stroke="${r}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,v=`
    <polygon points="50,36 47,39 50,38 53,39" fill="${a}"/>
  `,M=ft(i,o,46,28,54,28,3.5),k=Et(i,a,50,38),x=bt(r,50,52,12,16,f);return w+p+g+y+$+v+x+M+k}function th(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <ellipse cx="44" cy="56" rx="24" ry="16" fill="${r}"/>
    <ellipse cx="44" cy="62" rx="16" ry="8" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="76" cy="38" rx="12" ry="10" fill="${u}"/>
  `,$=`
    <path d="M62,48 Q70,42 74,40" stroke="${r}" stroke-width="12" fill="none" stroke-linecap="round"/>
  `,g=`
    <polygon points="86,38 92,40 86,42" fill="#e6a800"/>
  `,w=`
    <path d="M72,30 Q70,22 74,18" stroke="${u}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M76,28 Q76,20 78,16" stroke="${u}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M32,42 Q28,32 34,24 Q42,20 50,28 Q54,34 50,44" fill="${u}" stroke="${a}" stroke-width="0.5" opacity="0.7"/>
    <line x1="36" y1="28" x2="42" y2="40" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
    <line x1="42" y1="26" x2="46" y2="38" stroke="${a}" stroke-width="0.5" opacity="0.3"/>
  `,M=`
    <path d="M20,56 Q10,52 6,48" stroke="${r}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="46" rx="4" ry="3" fill="${a}" transform="rotate(-20, 5, 46)"/>
  `,k=`
    <path d="M60,68 L62,78 L58,78 L60,78 L64,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,68 L54,78 L50,78 L54,78 L56,78" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="28" y="68" width="8" height="10" rx="3" fill="${a}"/>
    <rect x="38" y="68" width="8" height="10" rx="3" fill="${a}"/>
  `,x=K2(i,o,80,36,4),E=Et(i,a,88,42),b=bt(r,44,56,24,16,f);return M+k+p+v+$+y+w+g+b+x+E}function rh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=D(r,25),p=`
    <ellipse cx="50" cy="58" rx="26" ry="28" fill="${r}"/>
    <ellipse cx="42" cy="50" rx="14" ry="12" fill="${u}" opacity="0.3"/>
    <ellipse cx="58" cy="50" rx="14" ry="12" fill="${u}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="16" ry="10" fill="${u}" opacity="0.25"/>
    <ellipse cx="44" cy="62" rx="12" ry="10" fill="${u}" opacity="0.2"/>
    <ellipse cx="56" cy="62" rx="12" ry="10" fill="${u}" opacity="0.2"/>
  `,y=`
    <ellipse cx="50" cy="64" rx="14" ry="12" fill="${l}" opacity="0.3"/>
  `,$=`
    <ellipse cx="50" cy="38" rx="12" ry="10" fill="${S(r,10)}"/>
  `,g=`
    <path d="M28,52 Q22,56 20,62" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M72,52 Q78,56 80,62" stroke="${r}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `,w=`
    <rect x="34" y="80" width="10" height="10" rx="4" fill="${a}"/>
    <rect x="56" y="80" width="10" height="10" rx="4" fill="${a}"/>
  `,v=`
    <ellipse cx="30" cy="44" rx="5" ry="4" fill="${u}" opacity="0.4" transform="rotate(-20, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="5" ry="4" fill="${u}" opacity="0.4" transform="rotate(20, 70, 44)"/>
    <ellipse cx="50" cy="28" rx="6" ry="3" fill="${u}" opacity="0.4"/>
  `,M=ft(i,o,44,36,56,36,4),k=Et(i,a,50,44),x=bt(r,50,58,26,28,f);return w+p+y+v+g+$+x+M+k}function nh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,w=`
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
  `,k=`
    <path d="M50,82 Q42,90 36,88 Q32,86 34,82" stroke="${r}" stroke-width="4" fill="none" stroke-linecap="round"/>
  `,x=ft(i,o,44,32,56,32,4),E=ft(i,o,21,36,31,36,3),b=ft(i,o,69,36,79,36,3),P=Et(i,a,50,42),N=Et(i,a,26,46),B=Et(i,a,74,46),J=bt(r,50,68,20,18,f);return k+M+u+g+y+$+p+w+v+J+x+E+b+P+N+B}function lh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,20),p=`
    <ellipse cx="50" cy="62" rx="16" ry="18" fill="${r}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${l}" opacity="0.3"/>
  `,y=`
    <ellipse cx="50" cy="36" rx="16" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="40" rx="10" ry="7" fill="${l}" opacity="0.4"/>
  `,$=`
    <path d="M36,28 L28,10 L40,24" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M64,28 L72,10 L60,24" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M36,26 L30,14 L39,24" fill="${u}" opacity="0.4"/>
    <path d="M64,26 L70,14 L61,24" fill="${u}" opacity="0.4"/>
  `,g=`
    <ellipse cx="50" cy="42" rx="3" ry="2" fill="${a}"/>
  `,w=`
    <path d="M42,76 Q28,80 20,74 Q14,68 18,62" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q48,88 42,92 Q36,94 34,90" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q72,80 80,74 Q86,68 82,62" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,v=`
    <rect x="38" y="76" width="7" height="10" rx="3" fill="${a}"/>
    <rect x="55" y="76" width="7" height="10" rx="3" fill="${a}"/>
  `,M=ft(i,o,42,34,58,34,4.5),k=Et(i,a,50,46),x=bt(r,50,36,16,14,f);return w+v+p+y+$+g+x+M+k}function oh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,w=`
    <path d="M32,56 Q26,62 24,70" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M68,56 Q74,62 76,70" stroke="${r}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `,v=`
    <rect x="36" y="80" width="9" height="12" rx="4" fill="${a}"/>
    <rect x="55" y="80" width="9" height="12" rx="4" fill="${a}"/>
  `,M=`
    <ellipse cx="34" cy="30" rx="5" ry="3" fill="${r}" transform="rotate(-20, 34, 30)"/>
    <ellipse cx="66" cy="30" rx="5" ry="3" fill="${r}" transform="rotate(20, 66, 30)"/>
  `,k=ft(i,o,42,32,58,32,4.5),x=Et(i,a,50,46),E=bt(r,50,64,18,20,f);return v+u+g+w+p+M+y+$+E+k+x}function ih(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,30),p=`
    <ellipse cx="50" cy="58" rx="8" ry="12" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="5" ry="6" fill="${l}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="38" r="12" fill="${D(r,40)}"/>
  `,$=`
    <path d="M42,48 Q20,28 16,40 Q12,52 38,56" fill="${r}" opacity="0.4" stroke="${u}" stroke-width="0.5"/>
    <path d="M42,52 Q18,58 16,68 Q14,78 40,62" fill="${r}" opacity="0.35" stroke="${u}" stroke-width="0.5"/>
    <path d="M58,48 Q80,28 84,40 Q88,52 62,56" fill="${r}" opacity="0.4" stroke="${u}" stroke-width="0.5"/>
    <path d="M58,52 Q82,58 84,68 Q86,78 60,62" fill="${r}" opacity="0.35" stroke="${u}" stroke-width="0.5"/>
  `,g=`
    <path d="M42,48 Q28,36 22,42" stroke="${u}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M42,52 Q26,60 24,68" stroke="${u}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,48 Q72,36 78,42" stroke="${u}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,52 Q74,60 76,68" stroke="${u}" stroke-width="0.5" fill="none" opacity="0.5"/>
  `,w=`
    <path d="M40,30 Q38,22 42,28" fill="${a}" opacity="0.4"/>
    <path d="M60,30 Q62,22 58,28" fill="${a}" opacity="0.4"/>
    <path d="M44,28 Q44,20 48,26" fill="${a}" opacity="0.3"/>
    <path d="M56,28 Q56,20 52,26" fill="${a}" opacity="0.3"/>
  `,v=`
    <line x1="46" y1="68" x2="44" y2="76" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <line x1="54" y1="68" x2="56" y2="76" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
  `,M=ft(i,o,45,36,55,36,3.5),k=Et(i,a,50,44),x=bt(r,50,58,8,12,f);return v+$+g+p+y+w+x+M+k}function sh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=`
    <ellipse cx="50" cy="70" rx="18" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="74" rx="12" ry="10" fill="${l}" opacity="0.3"/>
  `,u=`
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
  `,w=ft(i,o,45,26,55,26,3.5),v=ft(i,o,20,30,28,30,2.8),M=ft(i,o,72,30,80,30,2.8),k=`
    <path d="M44,82 Q36,90 28,88 Q22,86 20,80" stroke="${r}" stroke-width="5" fill="none" stroke-linecap="round"/>
  `,x=bt(r,50,70,18,16,f);return k+a+$+p+y+u+g+x+w+v+M}function ch(c){const{backgroundShape:r,creatureType:l,backgroundColor:o}=c;let i;switch(l){case"dragon":i=Tf(c);break;case"unicorn":i=J2(c);break;case"phoenix":i=eh(c);break;case"griffin":i=th(c);break;case"yeti":i=rh(c);break;case"cerberus":i=nh(c);break;case"kitsune":i=lh(c);break;case"minotaur":i=oh(c);break;case"fairy":i=ih(c);break;case"hydra":i=sh(c);break;default:i=Tf(c)}const f=ot(i);return it(f,r,o)}function ah(c){const r=["circle","rounded","square"],l=["dragon","unicorn","phoenix","griffin","yeti","cerberus","kitsune","minotaur","fairy","hydra"],o=["happy","majestic","surprised","mysterious"],i=["none","spots","stripes","scales"],f=["#7b2d8e","#5b1d6e","#4a0e6e","#8e44ad","#c0392b","#e74c3c","#1a6b3c","#2ecc71","#2c3e80","#3498db","#c79c2a","#d4a017","#708090","#4a4a4a","#8b1a1a","#2d5016"],a=["#f0e6ff","#ffe6f0","#e6fff0","#fff8e1","#e6f0ff","#ffffff","#fce4ec","#f3e5f5"],u=["#1a0a2e","#0d1b2a","#1b0a2e","#2a0a1b","#0a1e2e","#1e0a2e","#0a2e1a","#2e1a0a","#161625","#1a1a2e","#0f0f23","#1e1025"],p=["#ffd700","#ff6b6b","#00ffaa","#6bb5ff","#ff69b4"];return{backgroundShape:O(r,c),creatureType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),eyeColor:O(p,c),backgroundColor:O(u,c),expression:O(o,c),pattern:O(i,c)}}var uh={name:"Mythical",schema:X2,shapeParam:"creatureType",generate:ch,randomize:ah},fh={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},insectType:{type:"select",default:"butterfly",options:["butterfly","bee","ladybug","ant","beetle","dragonfly","caterpillar","firefly","mantis","spider"]},primaryColor:{type:"color",default:"#4CAF50"},secondaryColor:{type:"color",default:"#FFC107"},wingColor:{type:"color",default:"#81D4FA"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#E8F5E9"},expression:{type:"select",default:"happy",options:["happy","curious","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","gradient"]}};function Tt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"curious":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.15}" fill="white"/>
        <circle cx="${l+1}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${i+1}" cy="${f}" r="${p*1.1}" fill="${r}"/>
        <circle cx="${l}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function jt(c,r,l,o){switch(c){case"happy":return`<path d="M${l-4},${o} Q${l},${o+4} ${l+4},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;case"curious":return`<ellipse cx="${l+2}" cy="${o}" rx="2" ry="2.5" fill="${r}"/>`;case"surprised":return`<ellipse cx="${l}" cy="${o}" rx="2.5" ry="3.5" fill="${r}"/>`;case"sleepy":return`<line x1="${l-3}" y1="${o}" x2="${l+3}" y2="${o}" stroke="${r}" stroke-width="1.2" stroke-linecap="round"/>`;default:return""}}function Do(c,r,l,o,i,f){return`
    <path d="M${r},${l} Q${r-6},${l-f} ${r-10},${l-f-4}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${r-10}" cy="${l-f-4}" r="2" fill="${c}"/>
    <path d="M${o},${i} Q${o+6},${i-f} ${o+10},${i-f-4}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${o+10}" cy="${i-f-4}" r="2" fill="${c}"/>
  `}function Rt(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.35}" cy="${l-i*.15}" r="${o*.06}" fill="${a}" opacity="0.35"/>
        <circle cx="${r-o*.1}" cy="${l+i*.25}" r="${o*.07}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.4}" cy="${l+i*.2}" r="${o*.05}" fill="${a}" opacity="0.35"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.25} Q${r},${l-i*.35} ${r+o*.7},${l-i*.25}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.8},${l+i*.05} Q${r},${l-i*.05} ${r+o*.8},${l+i*.05}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
      `;case"gradient":{const u=`insect-grad-${r}-${l}`;return`
        <defs>
          <radialGradient id="${u}" cx="40%" cy="40%">
            <stop offset="0%" stop-color="${D(c,20)}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${a}" stop-opacity="0.15"/>
          </radialGradient>
        </defs>
        <ellipse cx="${r}" cy="${l}" rx="${o*.85}" ry="${i*.85}" fill="url(#${u})"/>
      `}default:return""}}function jf(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <path d="M50,42 Q22,20 14,34 Q8,46 24,52 Q34,56 50,48" fill="${o}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,42 Q78,20 86,34 Q92,46 76,52 Q66,56 50,48" fill="${o}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,52 Q28,58 20,68 Q16,76 30,74 Q40,72 50,60" fill="${D(o,15)}" stroke="${S(o,20)}" stroke-width="0.8"/>
    <path d="M50,52 Q72,58 80,68 Q84,76 70,74 Q60,72 50,60" fill="${D(o,15)}" stroke="${S(o,20)}" stroke-width="0.8"/>
  `,y=`
    <circle cx="30" cy="36" r="5" fill="${l}" opacity="0.6"/>
    <circle cx="70" cy="36" r="5" fill="${l}" opacity="0.6"/>
    <circle cx="28" cy="66" r="3.5" fill="${l}" opacity="0.5"/>
    <circle cx="72" cy="66" r="3.5" fill="${l}" opacity="0.5"/>
  `,$=`
    <ellipse cx="50" cy="50" rx="4" ry="16" fill="${r}"/>
    <ellipse cx="50" cy="50" rx="2.5" ry="14" fill="${l}" opacity="0.3"/>
  `,g=`
    <path d="M48,36 Q42,22 36,16" stroke="${u}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="16" r="2" fill="${u}"/>
    <path d="M52,36 Q58,22 64,16" stroke="${u}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="64" cy="16" r="2" fill="${u}"/>
  `,w=Tt(f,i,46,40,54,40,3.5),v=jt(f,u,50,48),M=Rt(r,50,50,4,16,a);return p+y+$+M+g+w+v}function dh(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
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
    <circle cx="50" cy="30" r="8" fill="${D(r,15)}" opacity="0.2"/>
  `,w=`
    <polygon points="50,74 48,78 52,78" fill="${u}"/>
  `,v=`
    <line x1="40" y1="66" x2="34" y2="74" stroke="${u}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="50" y1="68" x2="50" y2="76" stroke="${u}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="60" y1="66" x2="66" y2="74" stroke="${u}" stroke-width="1.5" stroke-linecap="round"/>
  `,M=Do(u,44,22,56,22,10),k=Tt(f,i,44,30,56,30,4.5),x=jt(f,u,50,38),E=Rt(r,50,54,18,20,a);return $+v+w+p+y+E+g+M+k+x}function ph(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="50" cy="56" rx="24" ry="22" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="20" ry="16" fill="${D(r,10)}" opacity="0.15"/>
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
    <circle cx="50" cy="32" r="6" fill="${D(a,15)}" opacity="0.15"/>
  `,g=`
    <line x1="30" y1="50" x2="22" y2="56" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="60" x2="20" y2="64" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="30" y1="70" x2="24" y2="76" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="50" x2="78" y2="56" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="72" y1="60" x2="80" y2="64" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="76" y2="76" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,w=Do(a,44,26,56,26,8),v=Tt(i,o,45,32,55,32,3.5),M=jt(i,l,50,39),k=Rt(r,50,56,24,22,f);return g+u+p+y+k+$+w+v+M}function hh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <circle cx="50" cy="28" r="14" fill="${r}"/>
    <circle cx="50" cy="26" r="9" fill="${D(r,12)}" opacity="0.15"/>
  `,p=`
    <ellipse cx="50" cy="50" rx="10" ry="8" fill="${r}"/>
  `,y=`
    <ellipse cx="50" cy="70" rx="14" ry="12" fill="${r}"/>
    <ellipse cx="50" cy="72" rx="9" ry="8" fill="${l}" opacity="0.2"/>
  `,$=`
    <rect x="47" y="40" width="6" height="6" rx="2" fill="${a}" opacity="0.3"/>
  `,g=`
    <rect x="47" y="56" width="6" height="6" rx="2" fill="${a}" opacity="0.3"/>
  `,w=`
    <path d="M42,38 Q38,42 36,40" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,38 Q62,42 64,40" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M42,46 L28,40 L22,46" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,46 L72,40 L78,46" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,50 L26,52 L22,58" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,50 L74,52 L78,58" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,54 L28,60 L24,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L72,60 L76,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,M=Do(a,42,18,58,18,12),k=Tt(i,o,44,26,56,26,4),x=jt(i,a,50,36),E=Rt(r,50,70,14,12,f);return v+y+g+p+$+u+w+E+M+k+x}function yh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,15),p=`
    <ellipse cx="50" cy="58" rx="22" ry="24" fill="${r}"/>
    <ellipse cx="50" cy="54" rx="18" ry="18" fill="${u}" opacity="0.12"/>
  `,y=`
    <line x1="50" y1="36" x2="50" y2="82" stroke="${a}" stroke-width="1.2"/>
  `,$=`
    <circle cx="50" cy="34" r="12" fill="${a}"/>
    <circle cx="50" cy="32" r="7" fill="${D(a,12)}" opacity="0.15"/>
  `,g=`
    <path d="M50,22 Q52,14 50,8" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,w=`
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
  `,k=Tt(i,o,44,32,56,32,3.5),x=jt(i,l,50,40),E=Rt(r,50,58,22,24,f);return v+p+y+M+E+$+g+w+k+x}function $h(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
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
  `,w=`
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${r}"/>
    <rect x="48" y="50" width="4" height="32" rx="2" fill="${l}" opacity="0.2"/>
  `,v=`
    <line x1="47" y1="56" x2="53" y2="56" stroke="${u}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="62" x2="53" y2="62" stroke="${u}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="68" x2="53" y2="68" stroke="${u}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="74" x2="53" y2="74" stroke="${u}" stroke-width="0.8" opacity="0.3"/>
  `,M=`
    <line x1="44" y1="42" x2="38" y2="50" stroke="${u}" stroke-width="1" stroke-linecap="round"/>
    <line x1="56" y1="42" x2="62" y2="50" stroke="${u}" stroke-width="1" stroke-linecap="round"/>
  `,k=Tt(f,i,43,24,57,24,5),x=jt(f,u,50,32),E=Rt(r,50,42,8,6,a);return p+y+M+w+v+g+E+$+k+x}function kh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,15),p=`
    <circle cx="18" cy="62" r="8" fill="${r}"/>
    <circle cx="30" cy="58" r="9" fill="${u}"/>
    <circle cx="43" cy="56" r="9.5" fill="${r}"/>
    <circle cx="56" cy="58" r="9" fill="${u}"/>
    <circle cx="68" cy="62" r="8.5" fill="${r}"/>
  `,y=`
    <circle cx="80" cy="56" r="12" fill="${r}"/>
    <circle cx="80" cy="54" r="8" fill="${D(r,12)}" opacity="0.15"/>
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
  `,w=`
    <path d="M76,46 Q72,38 68,34" stroke="${a}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="68" cy="34" r="1.5" fill="${a}"/>
    <path d="M84,46 Q88,38 92,34" stroke="${a}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="92" cy="34" r="1.5" fill="${a}"/>
  `,v=Tt(i,o,76,54,86,54,3.5),M=jt(i,a,80,62),k=Rt(r,43,56,9.5,9.5,f);return g+p+$+k+y+w+v+M}function mh(c){const{primaryColor:r,secondaryColor:l,wingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p="firefly-glow",y=`
    <defs>
      <radialGradient id="${p}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${l}" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="${l}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${l}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="70" r="16" fill="url(#${p})"/>
    <ellipse cx="50" cy="68" rx="10" ry="12" fill="${l}" opacity="0.7"/>
    <ellipse cx="50" cy="66" rx="6" ry="7" fill="${D(l,25)}" opacity="0.5"/>
  `,$=`
    <ellipse cx="50" cy="48" rx="10" ry="10" fill="${r}"/>
  `,g=`
    <circle cx="50" cy="32" r="10" fill="${r}"/>
    <circle cx="50" cy="30" r="6" fill="${D(r,12)}" opacity="0.15"/>
  `,w=`
    <ellipse cx="34" cy="42" rx="12" ry="5" fill="${o}" opacity="0.4" transform="rotate(-25, 34, 42)"/>
    <ellipse cx="66" cy="42" rx="12" ry="5" fill="${o}" opacity="0.4" transform="rotate(25, 66, 42)"/>
  `,v=`
    <line x1="42" y1="52" x2="36" y2="60" stroke="${u}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="58" y1="52" x2="64" y2="60" stroke="${u}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="44" y1="56" x2="38" y2="64" stroke="${u}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="56" y1="56" x2="62" y2="64" stroke="${u}" stroke-width="1.2" stroke-linecap="round"/>
  `,M=Do(u,44,24,56,24,10),k=Tt(f,i,45,30,55,30,3.5),x=jt(f,u,50,38),E=Rt(r,50,48,10,10,a);return w+v+y+$+E+g+M+k+x}function xh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <path d="M38,24 L50,14 L62,24 Q54,32 50,34 Q46,32 38,24 Z" fill="${r}"/>
    <path d="M42,22 L50,16 L58,22 Q52,28 50,30 Q48,28 42,22 Z" fill="${D(r,10)}" opacity="0.15"/>
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
  `,w=`
    <path d="M42,54 L30,58 L26,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L70,58 L74,68" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,62 L32,68 L28,78" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,62 L68,68 L72,78" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M44,16 Q38,8 32,4" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M56,16 Q62,8 68,4" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
  `,M=Tt(i,o,44,22,56,22,4),k=jt(i,a,50,30),x=Rt(r,50,70,10,14,f);return w+$+y+p+u+g+x+v+M+k}function gh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <circle cx="50" cy="54" r="18" fill="${r}"/>
    <circle cx="50" cy="56" r="12" fill="${l}" opacity="0.2"/>
  `,p=`
    <circle cx="50" cy="34" r="12" fill="${r}"/>
    <circle cx="50" cy="32" r="7" fill="${D(r,12)}" opacity="0.15"/>
  `,y=`
    <path d="M40,38 L24,24 L16,30" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60,38 L76,24 L84,30" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,42 L20,38 L12,44" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,42 L80,38 L88,44" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36,54 L18,56 L10,62" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64,54 L82,56 L90,62" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,64 L24,72 L18,80" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,64 L76,72 L82,80" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `,$=(()=>{const M=Tt(i,o,45,32,55,32,4),k=`
      <circle cx="42" cy="28" r="1.5" fill="white"/>
      <circle cx="42" cy="28" r="0.8" fill="${o}"/>
      <circle cx="58" cy="28" r="1.5" fill="white"/>
      <circle cx="58" cy="28" r="0.8" fill="${o}"/>
    `;return M+k})(),g=`
    <line x1="46" y1="42" x2="44" y2="47" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="42" x2="56" y2="47" stroke="${a}" stroke-width="1.5" stroke-linecap="round"/>
  `,w=jt(i,a,50,40),v=Rt(r,50,54,18,18,f);return y+u+v+p+$+g+w}function wh(c){const{backgroundShape:r,insectType:l,backgroundColor:o}=c;let i;switch(l){case"butterfly":i=jf(c);break;case"bee":i=dh(c);break;case"ladybug":i=ph(c);break;case"ant":i=hh(c);break;case"beetle":i=yh(c);break;case"dragonfly":i=$h(c);break;case"caterpillar":i=kh(c);break;case"firefly":i=mh(c);break;case"mantis":i=xh(c);break;case"spider":i=gh(c);break;default:i=jf(c)}const f=ot(i);return it(f,r,o)}function vh(c){const r=["circle","rounded","square"],l=["butterfly","bee","ladybug","ant","beetle","dragonfly","caterpillar","firefly","mantis","spider"],o=["happy","curious","surprised","sleepy"],i=["none","spots","stripes","gradient"],f=["#4CAF50","#388E3C","#2E7D32","#1B5E20","#5D4037","#3E2723","#212121","#37474F","#D32F2F","#E53935","#1565C0","#1976D2","#F57F17","#E65100","#4E342E","#33691E"],a=["#FFC107","#FFEB3B","#FFE0B2","#FFF9C4","#FFFFFF","#F5F5F5","#FFD54F","#FFCC80"],u=["#81D4FA","#CE93D8","#FFAB91","#80CBC4","#B39DDB","#EF9A9A","#A5D6A7","#FFF59D"],p=["#E8F5E9","#C8E6C9","#DCEDC8","#F1F8E9","#FFF8E1","#FFF3E0","#E0F2F1","#F3E5F5","#E8EAF6","#FCE4EC","#F9FBE7","#FFFDE7"],y=["#1a1a1a","#8B0000","#DAA520","#2E7D32","#FF8F00"];return{backgroundShape:O(r,c),insectType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),wingColor:O(u,c),eyeColor:O(y,c),backgroundColor:O(p,c),expression:O(o,c),pattern:O(i,c)}}var Mh={name:"Insects",schema:fh,shapeParam:"insectType",generate:wh,randomize:vh},Ch={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},birdType:{type:"select",default:"parrot",options:["parrot","owl","penguin","flamingo","eagle","toucan","peacock","hummingbird","robin","crow"]},primaryColor:{type:"color",default:"#43A047"},secondaryColor:{type:"color",default:"#FFF9C4"},crestColor:{type:"color",default:"#F44336"},eyeColor:{type:"color",default:"#212121"},backgroundColor:{type:"color",default:"#E3F2FD"},expression:{type:"select",default:"happy",options:["happy","proud","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","feathers"]}};function zt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"proud":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.6} L${l+u},${o-u*.2}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${i-u},${f-u*.2} L${i+u},${f-u*.6}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function ml(c,r,l,o){const i=S(r,20);switch(c){case"happy":return`
        <path d="M${l-4},${o} L${l},${o+5} L${l+4},${o}" fill="${r}" stroke="${i}" stroke-width="0.6"/>
      `;case"proud":return`
        <path d="M${l-4},${o} L${l},${o+4} L${l+4},${o}" fill="${r}" stroke="${i}" stroke-width="0.6"/>
      `;case"surprised":return`
        <path d="M${l-5},${o} L${l},${o+7} L${l+5},${o}" fill="${r}" stroke="${i}" stroke-width="0.6"/>
      `;case"sleepy":return`
        <path d="M${l-3},${o} L${l},${o+3} L${l+3},${o}" fill="${r}" stroke="${i}" stroke-width="0.6"/>
      `;default:return""}}function Bt(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.35}" cy="${l-i*.15}" r="${o*.06}" fill="${a}" opacity="0.35"/>
        <circle cx="${r-o*.1}" cy="${l+i*.25}" r="${o*.07}" fill="${a}" opacity="0.35"/>
        <circle cx="${r+o*.4}" cy="${l+i*.2}" r="${o*.05}" fill="${a}" opacity="0.35"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.25} Q${r},${l-i*.35} ${r+o*.7},${l-i*.25}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.8},${l+i*.05} Q${r},${l-i*.05} ${r+o*.8},${l+i*.05}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"/>
      `;case"feathers":{const u=D(c,15);return`
        <path d="M${r-o*.4},${l-i*.3} Q${r-o*.2},${l-i*.4} ${r},${l-i*.3}" stroke="${u}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r},${l-i*.2} Q${r+o*.2},${l-i*.3} ${r+o*.4},${l-i*.2}" stroke="${u}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r-o*.35},${l+i*.1} Q${r-o*.15},${l} ${r+o*.05},${l+i*.1}" stroke="${u}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${r+o*.05},${l+i*.2} Q${r+o*.25},${l+i*.1} ${r+o*.4},${l+i*.2}" stroke="${u}" stroke-width="1" fill="none" opacity="0.4"/>
      `}default:return""}}function Rf(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${l}" opacity="0.4"/>
  `,y=`
    <circle cx="50" cy="32" r="14" fill="${r}"/>
    <circle cx="50" cy="30" r="9" fill="${D(r,12)}" opacity="0.15"/>
  `,$=`
    <path d="M44,20 Q40,8 36,4" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,18 Q50,6 52,2" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,20 Q60,8 64,4" stroke="${o}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="4" r="2" fill="${o}"/>
    <circle cx="52" cy="2" r="2" fill="${o}"/>
    <circle cx="64" cy="4" r="2" fill="${o}"/>
  `,g=ml(f,"#FF8F00",50,42),w=`
    <path d="M34,48 Q22,42 18,52 Q16,60 28,62" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
    <path d="M66,48 Q78,42 82,52 Q84,60 72,62" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
  `,v=`
    <path d="M44,76 Q38,88 34,96" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,90 50,98" stroke="${S(r,10)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q62,88 66,96" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,k=zt(f,i,44,30,56,30,4),x=Bt(r,50,58,16,20,a);return v+w+p+x+y+$+g+M+k}function Sh(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <ellipse cx="50" cy="60" rx="18" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="64" rx="14" ry="14" fill="${l}" opacity="0.4"/>
  `,y=`
    <circle cx="50" cy="34" r="18" fill="${r}"/>
  `,$=`
    <path d="M34,22 Q30,10 28,4" stroke="${o}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,22 Q70,10 72,4" stroke="${o}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `,g=`
    <circle cx="42" cy="32" r="9" fill="${D(r,20)}" opacity="0.3"/>
    <circle cx="58" cy="32" r="9" fill="${D(r,20)}" opacity="0.3"/>
  `,w=zt(f,i,42,32,58,32,5.5),v=ml(f,"#FF8F00",50,42),M=`
    <path d="M32,50 Q20,48 18,58 Q16,66 26,66" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
    <path d="M68,50 Q80,48 82,58 Q84,66 74,66" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
  `,k=`
    <path d="M42,78 L38,84 M42,78 L42,84 M42,78 L46,84" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,78 L54,84 M58,78 L58,84 M58,78 L62,84" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=Bt(r,50,60,18,20,a);return M+p+x+y+$+g+w+v+k}function Eh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
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
  `,w=ml(i,"#FF6F00",50,38),v=`
    <path d="M40,76 L34,82 L44,82 Z" fill="#FF6F00"/>
    <path d="M60,76 L56,82 L66,82 Z" fill="#FF6F00"/>
  `,M=zt(i,o,44,28,56,28,3.5),k=Bt(r,50,54,18,24,f);return g+u+p+k+y+$+M+w+v}function Qh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <path d="M50,40 Q42,28 44,18 Q46,10 50,8 Q54,10 56,18 Q58,28 50,40" fill="${r}" stroke="${a}" stroke-width="0.6"/>
  `,p=`
    <ellipse cx="50" cy="52" rx="18" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="${D(r,10)}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="10" r="8" fill="${r}"/>
  `,$=`
    <path d="M46,14 L42,18 Q44,20 48,18 Z" fill="#212121" stroke="${S("#212121",20)}" stroke-width="0.4"/>
    <path d="M54,14 L58,18 Q56,20 52,18 Z" fill="#212121" stroke="${S("#212121",20)}" stroke-width="0.4"/>
  `,g=`
    <path d="M34,46 Q26,40 22,48 Q20,54 30,56" fill="${S(r,12)}" stroke="${a}" stroke-width="0.6"/>
    <path d="M66,46 Q74,40 78,48 Q80,54 70,56" fill="${S(r,12)}" stroke="${a}" stroke-width="0.6"/>
  `,w=`
    <line x1="44" y1="64" x2="40" y2="86" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <line x1="56" y1="64" x2="60" y2="86" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
    <path d="M36,86 L40,86 L44,86" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,86 L60,86 L64,86" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=`
    <path d="M50,64 Q44,70 40,68" stroke="${l}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M50,64 Q56,70 60,68" stroke="${l}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `,M=zt(i,o,46,8,54,8,2.5),k=Bt(r,50,52,18,14,f);return w+v+g+p+k+u+y+M+$}function Fh(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <ellipse cx="50" cy="56" rx="20" ry="22" fill="${r}"/>
    <ellipse cx="50" cy="60" rx="14" ry="14" fill="${l}" opacity="0.3"/>
  `,y=`
    <circle cx="50" cy="30" r="14" fill="${o}"/>
    <circle cx="50" cy="28" r="9" fill="${D(o,10)}" opacity="0.15"/>
  `,$=`
    <path d="M38,24 L44,26" stroke="${S(o,30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M62,24 L56,26" stroke="${S(o,30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,g=`
    <path d="M47,36 L50,44 L53,36" fill="#FFB300" stroke="${S("#FFB300",20)}" stroke-width="0.6"/>
    <path d="M49,40 Q50,42 51,40" stroke="${S("#FFB300",30)}" stroke-width="0.4" fill="none"/>
  `,w=`
    <path d="M30,46 Q14,36 10,44 Q8,52 22,56" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
    <path d="M70,46 Q86,36 90,44 Q92,52 78,56" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
  `,v=`
    <path d="M40,76 L36,82 M40,76 L40,84 M40,76 L44,82" stroke="${u}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M60,76 L56,82 M60,76 L60,84 M60,76 L64,82" stroke="${u}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,76 Q38,84 34,88" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,86 50,90" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q62,84 66,88" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,k=zt(f,i,44,28,56,28,4),x=Bt(r,50,56,20,22,a);return M+w+p+x+y+$+k+g+v}function Lh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=`
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${r}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${l}" opacity="0.35"/>
  `,p=`
    <circle cx="50" cy="32" r="13" fill="${r}"/>
    <circle cx="50" cy="30" r="8" fill="${D(r,12)}" opacity="0.15"/>
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
  `,w=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,v=zt(i,o,46,30,52,30,3),M=Bt(r,50,58,16,20,f);return g+$+u+M+p+y+v+w}function _h(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <path d="M50,50 Q20,10 10,20" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q16,18 12,30" stroke="${D(r,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q14,26 14,40" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q80,10 90,20" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q84,18 88,30" stroke="${D(r,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q86,26 86,40" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q50,6 50,14" stroke="${D(r,15)}" stroke-width="2" fill="none" stroke-linecap="round"/>
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
  `,w=`
    <circle cx="50" cy="42" r="10" fill="${r}"/>
  `,v=`
    <path d="M48,34 Q46,26 44,22" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="22" r="1.5" fill="${o}"/>
    <path d="M50,33 Q50,25 50,20" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="20" r="1.5" fill="${o}"/>
    <path d="M52,34 Q54,26 56,22" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="22" r="1.5" fill="${o}"/>
  `,M=ml(f,"#FF8F00",50,48),k=`
    <path d="M44,78 L40,86 M44,78 L44,86 M44,78 L48,86" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,78 L52,86 M56,78 L56,86 M56,78 L60,86" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=zt(f,i,45,40,55,40,3.5),E=Bt(r,50,64,14,16,a);return p+y+$+E+g+w+v+x+M+k}function Ph(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <ellipse cx="50" cy="50" rx="10" ry="14" fill="${r}"/>
    <ellipse cx="50" cy="52" rx="7" ry="9" fill="${l}" opacity="0.35"/>
  `,y=`
    <circle cx="50" cy="32" r="10" fill="${r}"/>
    <circle cx="50" cy="30" r="6" fill="${o}" opacity="0.4"/>
  `,$=`
    <line x1="50" y1="38" x2="50" y2="52" stroke="#424242" stroke-width="1.5" stroke-linecap="round" opacity="0"/>
    <path d="M50,38 L48,50 L50,52 L52,50 Z" fill="#616161" stroke="${S("#616161",20)}" stroke-width="0.4"/>
  `,g="hbird-wing-grad",w=`
    <defs>
      <linearGradient id="${g}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${D(r,20)}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${D(r,20)}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="28" cy="40" rx="16" ry="6" fill="url(#${g})" transform="rotate(-20, 28, 40)"/>
    <ellipse cx="72" cy="40" rx="16" ry="6" fill="url(#${g})" transform="rotate(20, 72, 40)"/>
    <ellipse cx="30" cy="44" rx="14" ry="4" fill="${D(r,15)}" opacity="0.25" transform="rotate(10, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="14" ry="4" fill="${D(r,15)}" opacity="0.25" transform="rotate(-10, 70, 44)"/>
  `,v=`
    <path d="M46,62 Q40,70 36,74" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,62 Q60,70 64,74" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <line x1="46" y1="62" x2="44" y2="68" stroke="${u}" stroke-width="1" stroke-linecap="round"/>
    <line x1="54" y1="62" x2="56" y2="68" stroke="${u}" stroke-width="1" stroke-linecap="round"/>
  `,k=zt(f,i,46,30,54,30,3),x=Bt(r,50,50,10,14,a);return v+w+p+x+y+k+$+M}function Ah(c){const{primaryColor:r,secondaryColor:l,crestColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,25),p=`
    <ellipse cx="50" cy="56" rx="18" ry="20" fill="${r}"/>
  `,y=`
    <ellipse cx="50" cy="58" rx="12" ry="14" fill="${o}" opacity="0.7"/>
    <ellipse cx="50" cy="60" rx="8" ry="10" fill="${D(o,15)}" opacity="0.3"/>
  `,$=`
    <circle cx="50" cy="32" r="13" fill="${r}"/>
    <circle cx="50" cy="30" r="8" fill="${D(r,12)}" opacity="0.15"/>
  `,g=ml(f,"#FF8F00",50,42),w=`
    <path d="M32,48 Q22,44 18,52 Q16,58 26,58" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
    <path d="M68,48 Q78,44 82,52 Q84,58 74,58" fill="${S(r,15)}" stroke="${u}" stroke-width="0.6"/>
  `,v=`
    <path d="M44,74 Q40,82 38,86" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M56,74 Q60,82 62,86" stroke="${r}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,M=`
    <path d="M42,74 L38,80 M42,74 L42,80 M42,74 L46,80" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,74 L54,80 M58,74 L58,80 M58,74 L62,80" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,k=`
    <ellipse cx="50" cy="68" rx="10" ry="6" fill="${l}" opacity="0.4"/>
  `,x=zt(f,i,44,30,56,30,3.5),E=Bt(r,50,56,18,20,a);return v+w+p+y+k+E+$+x+g+M}function Nh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,25),u=D(r,18),p=`
    <ellipse cx="50" cy="56" rx="16" ry="22" fill="${r}"/>
  `,y=`
    <ellipse cx="44" cy="50" rx="5" ry="10" fill="${u}" opacity="0.12" transform="rotate(-10, 44, 50)"/>
  `,$=`
    <circle cx="50" cy="30" r="13" fill="${r}"/>
    <circle cx="50" cy="28" r="8" fill="${u}" opacity="0.1"/>
  `,g=`
    <path d="M50,38 L46,46 L50,48 L54,46 Z" fill="#37474F" stroke="${S("#37474F",20)}" stroke-width="0.6"/>
  `,w=`
    <path d="M34,46 Q18,40 14,50 Q12,58 24,60" fill="${S(r,10)}" stroke="${a}" stroke-width="0.6"/>
    <path d="M66,46 Q82,40 86,50 Q88,58 76,60" fill="${S(r,10)}" stroke="${a}" stroke-width="0.6"/>
  `,v=`
    <path d="M14,50 L18,54 L22,52" stroke="${a}" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M86,50 L82,54 L78,52" stroke="${a}" stroke-width="0.8" fill="none" opacity="0.4"/>
  `,M=`
    <path d="M44,76 Q40,86 36,90" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,88 50,92" stroke="${S(r,8)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q60,86 64,90" stroke="${r}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `,k=`
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,x=`
    <circle cx="44" cy="27" r="1" fill="${l}" opacity="0.3"/>
    <circle cx="56" cy="27" r="1" fill="${l}" opacity="0.3"/>
  `,E=zt(i,o,44,28,56,28,3.5),b=Bt(r,50,56,16,22,f);return M+w+v+p+y+b+$+E+x+g+k}function Ih(c){const{backgroundShape:r,birdType:l,backgroundColor:o}=c;let i;switch(l){case"parrot":i=Rf(c);break;case"owl":i=Sh(c);break;case"penguin":i=Eh(c);break;case"flamingo":i=Qh(c);break;case"eagle":i=Fh(c);break;case"toucan":i=Lh(c);break;case"peacock":i=_h(c);break;case"hummingbird":i=Ph(c);break;case"robin":i=Ah(c);break;case"crow":i=Nh(c);break;default:i=Rf(c)}const f=ot(i);return it(f,r,o)}function bh(c){const r=["circle","rounded","square"],l=["parrot","owl","penguin","flamingo","eagle","toucan","peacock","hummingbird","robin","crow"],o=["happy","proud","surprised","sleepy"],i=["none","spots","stripes","feathers"],f=["#43A047","#388E3C","#2E7D32","#1B5E20","#5D4037","#3E2723","#212121","#37474F","#D32F2F","#E53935","#1565C0","#1976D2","#F57F17","#E65100","#4E342E","#EC407A"],a=["#FFF9C4","#FFFFFF","#F5F5F5","#FFE0B2","#FFECB3","#E0F7FA","#FFF3E0","#FFCC80"],u=["#F44336","#FF5722","#FF9800","#FFC107","#2196F3","#E91E63","#FF6F00","#FFAB00"],p=["#E3F2FD","#BBDEFB","#B3E5FC","#E0F7FA","#E8F5E9","#C8E6C9","#FFF8E1","#FFF3E0","#FCE4EC","#F3E5F5","#FFFDE7","#FBE9E7"],y=["#212121","#3E2723","#DAA520","#FF8F00","#E65100"];return{backgroundShape:O(r,c),birdType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),crestColor:O(u,c),eyeColor:O(y,c),backgroundColor:O(p,c),expression:O(o,c),pattern:O(i,c)}}var Th={name:"Birds",schema:Ch,shapeParam:"birdType",generate:Ih,randomize:bh},jh={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},plantType:{type:"select",default:"cactus",options:["cactus","sunflower","rose","tulip","venus-flytrap","bonsai","mushroom","fern","bamboo","succulent"]},primaryColor:{type:"color",default:"#4CAF50"},secondaryColor:{type:"color",default:"#81C784"},potColor:{type:"color",default:"#8D6E63"},bloomColor:{type:"color",default:"#E91E63"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#F1F8E9"},expression:{type:"select",default:"happy",options:["happy","shy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","spots","stripes","thorns"]}};function Dt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"shy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l-1}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i-1}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1.5}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1.5}" cy="${f-1}" r="${y}" fill="white"/>
        <ellipse cx="${l+u*1.2}" cy="${o+u*.6}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${i-u*1.2}" cy="${f+u*.6}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Ot(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"shy":return`
        <path d="M${r-2},${l+1} Q${r},${l+3} ${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Ut(c,r,l,o,i,f){const a=S(c,30);switch(f){case"spots":return`
        <circle cx="${r-o*.3}" cy="${l-i*.2}" r="${o*.08}" fill="${a}" opacity="0.3"/>
        <circle cx="${r+o*.35}" cy="${l-i*.15}" r="${o*.06}" fill="${a}" opacity="0.3"/>
        <circle cx="${r-o*.1}" cy="${l+i*.25}" r="${o*.07}" fill="${a}" opacity="0.3"/>
        <circle cx="${r+o*.4}" cy="${l+i*.2}" r="${o*.05}" fill="${a}" opacity="0.3"/>
      `;case"stripes":return`
        <path d="M${r-o*.7},${l-i*.25} Q${r},${l-i*.35} ${r+o*.7},${l-i*.25}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${r-o*.8},${l+i*.05} Q${r},${l-i*.05} ${r+o*.8},${l+i*.05}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${r-o*.7},${l+i*.3} Q${r},${l+i*.2} ${r+o*.7},${l+i*.3}" stroke="${a}" stroke-width="1.2" fill="none" opacity="0.3"/>
      `;case"thorns":{const u=D(c,15);return`
        <path d="M${r-o*.6},${l-i*.1} L${r-o*.8},${l-i*.2}" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r+o*.6},${l-i*.15} L${r+o*.8},${l-i*.25}" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r-o*.5},${l+i*.2} L${r-o*.7},${l+i*.15}" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${r+o*.5},${l+i*.25} L${r+o*.7},${l+i*.2}" stroke="${u}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
      `}default:return""}}function Vr(c,r,l,o,i){const f=S(c,20),a=D(c,12),u=i*.18,p=o/2,y=p*.75;return`
    <rect x="${r-p-2}" y="${l}" width="${o+4}" height="${u}" rx="2" fill="${f}"/>
    <path d="M${r-p},${l+u} L${r-y},${l+i} L${r+y},${l+i} L${r+p},${l+u} Z" fill="${c}"/>
    <path d="M${r-p+2},${l+u+2} L${r-p+2},${l+i*.6}" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `}function zf(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Vr(o,50,68,28,18),$=`
    <ellipse cx="50" cy="50" rx="12" ry="22" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="18" fill="${l}" opacity="0.15"/>
  `,g=`
    <path d="M38,48 Q28,48 28,38 Q28,30 32,30" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <path d="M62,44 Q72,44 72,34 Q72,26 68,26" fill="${r}" stroke="${p}" stroke-width="0.6"/>
  `,w=`
    <g stroke="${S(r,35)}" stroke-width="0.6" stroke-linecap="round" opacity="0.5">
      <line x1="44" y1="34" x2="40" y2="32"/>
      <line x1="56" y1="36" x2="60" y2="34"/>
      <line x1="43" y1="46" x2="39" y2="46"/>
      <line x1="57" y1="50" x2="61" y2="50"/>
      <line x1="44" y1="58" x2="40" y2="60"/>
      <line x1="56" y1="56" x2="60" y2="58"/>
    </g>
  `,v=`
    <circle cx="50" cy="28" r="4" fill="${i}"/>
    <circle cx="46" cy="27" r="2.5" fill="${i}" opacity="0.8"/>
    <circle cx="54" cy="27" r="2.5" fill="${i}" opacity="0.8"/>
    <circle cx="50" cy="25" r="2.5" fill="${i}" opacity="0.8"/>
    <circle cx="50" cy="28" r="1.5" fill="${D(i,25)}"/>
  `,M=Dt(a,f,45,44,55,44,3),k=Ot(a,50,50),x=Ut(r,50,50,12,22,u);return y+$+g+w+x+v+M+k}function Rh(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Vr(o,50,76,24,14),$=`
    <rect x="47" y="42" width="6" height="36" rx="3" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,g=`
    <path d="M47,58 Q36,52 32,56 Q36,60 47,58 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M53,64 Q64,58 68,62 Q64,66 53,64 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,w=i,v=S(i,15),M=`
    <g>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(45, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(90, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(135, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(180, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(225, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(270, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${w}" stroke="${v}" stroke-width="0.3" transform="rotate(315, 50, 30)"/>
    </g>
  `,k=`
    <circle cx="50" cy="30" r="10" fill="${S(r,10)}"/>
    <circle cx="50" cy="30" r="8" fill="${r}"/>
  `,x=Dt(a,f,46,28,54,28,2.5),E=Ot(a,50,33),b=Ut(r,50,30,8,8,u);return y+$+g+M+k+b+x+E}function zh(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=S(i,15),$=D(i,15),g=Vr(o,50,76,24,14),w=`
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <path d="M48,54 L45,52" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M52,60 L55,58" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M48,66 L45,64" stroke="${S(r,30)}" stroke-width="1" stroke-linecap="round"/>
  `,v=`
    <path d="M48,56 Q38,50 34,54 Q38,58 48,56 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M52,68 Q62,62 66,66 Q62,70 52,68 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,M=`
    <circle cx="50" cy="28" r="14" fill="${i}"/>
    <path d="M40,24 Q44,16 50,18 Q56,16 60,24 Q58,20 50,22 Q42,20 40,24 Z" fill="${y}" opacity="0.5"/>
    <path d="M42,32 Q46,38 50,36 Q54,38 58,32 Q56,34 50,33 Q44,34 42,32 Z" fill="${y}" opacity="0.4"/>
    <path d="M38,28 Q40,22 44,24 Q42,28 38,28 Z" fill="${$}" opacity="0.5"/>
    <path d="M62,28 Q60,22 56,24 Q58,28 62,28 Z" fill="${$}" opacity="0.5"/>
  `,k=Dt(a,f,45,26,55,26,2.5),x=Ot(a,50,32),E=Ut(i,50,28,14,14,u);return g+w+v+M+E+k+x}function Bh(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=S(i,15),$=Vr(o,50,76,26,14),g=`
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,w=`
    <path d="M48,60 Q34,50 30,58 Q34,64 48,60 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
    <path d="M52,66 Q66,56 70,64 Q66,70 52,66 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4"/>
  `,v=`
    <path d="M36,32 Q38,14 50,12 Q62,14 64,32 Q58,36 50,38 Q42,36 36,32 Z" fill="${i}" stroke="${y}" stroke-width="0.5"/>
    <path d="M40,30 Q42,18 50,16" stroke="${D(i,18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M60,30 Q58,18 50,16" stroke="${D(i,18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M42,32 Q50,38 58,32" fill="${S(i,10)}" opacity="0.3"/>
  `,M=Dt(a,f,45,24,55,24,2.5),k=Ot(a,50,30),x=Ut(i,50,24,14,12,u);return $+g+w+v+x+M+k}function Dh(c){const{primaryColor:r,secondaryColor:l,potColor:o,bloomColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Vr(o,50,72,28,16),$=`
    <path d="M44,72 Q40,56 38,44" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50,72 Q50,52 50,38" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
    <path d="M56,72 Q60,56 62,44" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"/>
  `,g=`
    <path d="M36,38 Q50,28 64,38" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <path d="M36,38 Q50,48 64,38" fill="${l}" stroke="${p}" stroke-width="0.6"/>
  `,w=`
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
    <ellipse cx="50" cy="34" rx="10" ry="3" fill="${i}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="10" ry="3" fill="${i}" opacity="0.3"/>
  `,M=`
    <path d="M30,44 Q38,38 38,44 Q38,50 30,44 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <path d="M70,44 Q62,38 62,44 Q62,50 70,44 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
  `,k=Dt(a,f,45,34,55,34,2.5),x=Ot(a,50,39),E=Ut(r,50,38,14,8,u);return y+$+M+g+v+w+E+k+x}function Oh(c){const{primaryColor:r,secondaryColor:l,potColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p="#6D4C41",y=S(p,20),$=Vr(o,50,72,34,14),g=`
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${p}" stroke-width="6" stroke-linecap="round"/>
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${y}" stroke-width="6" stroke-linecap="round" opacity="0.15"/>
  `,w=`
    <path d="M44,50 Q36,46 32,48" fill="none" stroke="${p}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46,42 Q54,38 58,40" fill="none" stroke="${p}" stroke-width="2.5" stroke-linecap="round"/>
  `,v=`
    <g>
      <ellipse cx="50" cy="26" rx="16" ry="10" fill="${r}" stroke="${u}" stroke-width="0.5"/>
      <ellipse cx="42" cy="28" rx="10" ry="8" fill="${r}"/>
      <ellipse cx="58" cy="28" rx="10" ry="8" fill="${r}"/>
      <ellipse cx="50" cy="22" rx="12" ry="7" fill="${l}" opacity="0.2"/>
      <ellipse cx="32" cy="44" rx="10" ry="7" fill="${r}" stroke="${u}" stroke-width="0.5"/>
      <ellipse cx="58" cy="36" rx="10" ry="7" fill="${r}" stroke="${u}" stroke-width="0.5"/>
    </g>
  `,M=Dt(f,i,45,24,55,24,3),k=Ot(f,50,30),x=Ut(r,50,26,16,10,a);return $+g+w+v+x+M+k}function Uh(c){const{primaryColor:r,secondaryColor:l,bloomColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <rect x="43" y="52" width="14" height="30" rx="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <rect x="45" y="54" width="4" height="26" rx="2" fill="white" opacity="0.15"/>
  `,y=`
    <path d="M22,52 Q22,20 50,16 Q78,20 78,52 Z" fill="${r}" stroke="${u}" stroke-width="0.6"/>
    <path d="M26,50 Q26,24 50,20 Q74,24 74,50" fill="${D(r,8)}" opacity="0.15"/>
  `,$=`
    <circle cx="38" cy="32" r="4" fill="${o}" opacity="0.6"/>
    <circle cx="56" cy="28" r="5" fill="${o}" opacity="0.6"/>
    <circle cx="46" cy="22" r="3" fill="${o}" opacity="0.6"/>
    <circle cx="64" cy="38" r="3.5" fill="${o}" opacity="0.6"/>
    <circle cx="34" cy="44" r="3" fill="${o}" opacity="0.6"/>
    <circle cx="60" cy="46" r="2.5" fill="${o}" opacity="0.6"/>
  `,g=`
    <path d="M30,52 Q50,58 70,52" fill="${S(l,10)}" opacity="0.3"/>
  `,w=Dt(f,i,44,38,56,38,3.5),v=Ot(f,50,46),M=Ut(r,50,36,22,18,a);return p+g+y+$+M+w+v}function Vh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=`
    <path d="M50,80 Q50,60 50,44 Q50,34 54,28 Q58,24 56,20 Q52,18 48,22" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="48" cy="22" r="6" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="48" cy="22" r="4" fill="${l}" opacity="0.2"/>
  `,p=`
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
  `,y=`
    <g opacity="0.5">
      <ellipse cx="28" cy="65" rx="3" ry="1.5" fill="${r}" transform="rotate(-20, 28, 65)"/>
      <ellipse cx="72" cy="59" rx="3" ry="1.5" fill="${r}" transform="rotate(20, 72, 59)"/>
      <ellipse cx="32" cy="51" rx="2.5" ry="1.2" fill="${l}" transform="rotate(-15, 32, 51)"/>
      <ellipse cx="68" cy="45" rx="2.5" ry="1.2" fill="${l}" transform="rotate(15, 68, 45)"/>
    </g>
  `,$=Dt(i,o,44,20,52,20,2),g=Ot(i,48,25),w=Ut(r,48,22,6,6,f);return p+y+u+w+$+g}function Hh(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=`
    <rect x="46" y="14" width="8" height="70" rx="4" fill="${r}" stroke="${a}" stroke-width="0.5"/>
  `,p=`
    <g>
      <rect x="44" y="26" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="42" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="58" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
      <rect x="44" y="72" width="12" height="2" rx="1" fill="${a}" opacity="0.4"/>
    </g>
  `,y=`
    <g>
      <path d="M46,28 Q34,22 28,24 Q34,28 46,28 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
      <path d="M46,24 Q36,16 30,18 Q36,22 46,24 Z" fill="${r}" stroke="${a}" stroke-width="0.3"/>
      <path d="M54,44 Q66,38 72,40 Q66,44 54,44 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
      <path d="M54,40 Q64,32 70,34 Q64,38 54,40 Z" fill="${r}" stroke="${a}" stroke-width="0.3"/>
      <path d="M46,60 Q34,54 28,56 Q34,60 46,60 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.3"/>
    </g>
  `,$=`
    <rect x="36" y="56" width="4" height="28" rx="2" fill="${D(r,10)}" stroke="${a}" stroke-width="0.3" opacity="0.6"/>
    <rect x="60" y="40" width="4" height="28" rx="2" fill="${D(r,10)}" stroke="${a}" stroke-width="0.3" opacity="0.6"/>
  `,g=`
    <ellipse cx="50" cy="36" rx="6" ry="5" fill="${D(r,12)}" opacity="0.3"/>
  `,w=Dt(i,o,47,34,53,34,2),v=Ot(i,50,39),M=Ut(r,50,50,4,30,f);return $+u+p+y+g+M+w+v}function Zh(c){const{primaryColor:r,secondaryColor:l,potColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=D(r,12),y=Vr(o,50,64,26,16),$=`
    <g>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${u}" stroke-width="0.5" transform="rotate(0, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${u}" stroke-width="0.5" transform="rotate(60, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${r}" stroke="${u}" stroke-width="0.5" transform="rotate(120, 50, 50)"/>
    </g>
  `,g=`
    <g>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(30, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(90, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${l}" stroke="${S(l,15)}" stroke-width="0.4" transform="rotate(150, 50, 48)"/>
    </g>
  `,w=`
    <circle cx="50" cy="46" r="10" fill="${p}"/>
    <circle cx="50" cy="46" r="8" fill="${r}" opacity="0.3"/>
  `,v=`
    <g opacity="0.3">
      <circle cx="32" cy="50" r="2" fill="${D(r,20)}"/>
      <circle cx="68" cy="50" r="2" fill="${D(r,20)}"/>
      <circle cx="50" cy="34" r="2" fill="${D(r,20)}"/>
      <circle cx="38" cy="60" r="1.5" fill="${D(l,15)}"/>
      <circle cx="62" cy="60" r="1.5" fill="${D(l,15)}"/>
    </g>
  `,M=Dt(f,i,46,44,54,44,2.5),k=Ot(f,50,50),x=Ut(r,50,46,10,10,a);return y+$+g+w+v+x+M+k}function Wh(c){const{backgroundShape:r,plantType:l,backgroundColor:o}=c;let i;switch(l){case"cactus":i=zf(c);break;case"sunflower":i=Rh(c);break;case"rose":i=zh(c);break;case"tulip":i=Bh(c);break;case"venus-flytrap":i=Dh(c);break;case"bonsai":i=Oh(c);break;case"mushroom":i=Uh(c);break;case"fern":i=Vh(c);break;case"bamboo":i=Hh(c);break;case"succulent":i=Zh(c);break;default:i=zf(c)}const f=ot(i);return it(f,r,o)}function qh(c){const r=["circle","rounded","square"],l=["cactus","sunflower","rose","tulip","venus-flytrap","bonsai","mushroom","fern","bamboo","succulent"],o=["happy","shy","surprised","sleepy"],i=["none","spots","stripes","thorns"],f=["#4CAF50","#388E3C","#2E7D32","#1B5E20","#43A047","#66BB6A","#558B2F","#33691E","#00695C","#00796B","#2E7D32","#1B5E20","#689F38","#7CB342","#8BC34A","#9CCC65"],a=["#81C784","#A5D6A7","#C8E6C9","#DCEDC8","#B2DFDB","#AED581","#E6EE9C","#C5E1A5"],u=["#8D6E63","#795548","#6D4C41","#A1887F","#BCAAA4","#5D4037","#757575","#D7CCC8"],p=["#E91E63","#F44336","#FF5722","#FF9800","#FFC107","#9C27B0","#E040FB","#FF6F00"],y=["#F1F8E9","#E8F5E9","#C8E6C9","#DCEDC8","#FFF8E1","#FFF3E0","#EFEBE9","#F5F5F5","#E0F2F1","#E8EAF6","#FBE9E7","#F9FBE7"],$=["#1a1a1a","#3E2723","#1B5E20","#212121","#33691E"];return{backgroundShape:O(r,c),plantType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),potColor:O(u,c),bloomColor:O(p,c),eyeColor:O($,c),backgroundColor:O(y,c),expression:O(o,c),pattern:O(i,c)}}var Yh={name:"Plants",schema:jh,shapeParam:"plantType",generate:Wh,randomize:qh},Gh={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},foodType:{type:"select",default:"sushi",options:["sushi","pizza","cupcake","ice-cream","donut","burger","taco","ramen","cookie","watermelon"]},primaryColor:{type:"color",default:"#FF8A65"},secondaryColor:{type:"color",default:"#FFCC80"},toppingColor:{type:"color",default:"#E53935"},plateColor:{type:"color",default:"#ECEFF1"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#FFF8E1"},expression:{type:"select",default:"happy",options:["happy","yummy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","sprinkles","sesame","drizzle"]}};function Vt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"yummy":return`
        <path d="M${l-u},${o} Q${l},${o-u*1.2} ${l+u},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${i-u},${f} Q${i},${f-u*1.2} ${i+u},${f}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${l+u*1.2}" cy="${o+u*.4}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${i-u*1.2}" cy="${f+u*.4}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Ht(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"yummy":return`
        <path d="M${r-3},${l} Q${r},${l+5} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${r}" cy="${l+3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Zt(c,r,l,o,i,f){const a=S(c,30);switch(f){case"sprinkles":return`
        <g opacity="0.5">
          <rect x="${r-o*.4}" y="${l-i*.3}" width="2" height="4" rx="1" fill="#E91E63" transform="rotate(30, ${r-o*.4}, ${l-i*.3})"/>
          <rect x="${r+o*.3}" y="${l-i*.2}" width="2" height="4" rx="1" fill="#2196F3" transform="rotate(-20, ${r+o*.3}, ${l-i*.2})"/>
          <rect x="${r-o*.1}" y="${l+i*.2}" width="2" height="4" rx="1" fill="#4CAF50" transform="rotate(50, ${r-o*.1}, ${l+i*.2})"/>
          <rect x="${r+o*.35}" y="${l+i*.15}" width="2" height="4" rx="1" fill="#FF9800" transform="rotate(-40, ${r+o*.35}, ${l+i*.15})"/>
        </g>
      `;case"sesame":return`
        <g opacity="0.4">
          <ellipse cx="${r-o*.3}" cy="${l-i*.2}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(15, ${r-o*.3}, ${l-i*.2})"/>
          <ellipse cx="${r+o*.25}" cy="${l-i*.1}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-10, ${r+o*.25}, ${l-i*.1})"/>
          <ellipse cx="${r}" cy="${l+i*.15}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(25, ${r}, ${l+i*.15})"/>
          <ellipse cx="${r+o*.4}" cy="${l+i*.2}" rx="1" ry="0.7" fill="#212121" transform="rotate(-5, ${r+o*.4}, ${l+i*.2})"/>
        </g>
      `;case"drizzle":return`
        <g opacity="0.3">
          <path d="M${r-o*.5},${l-i*.2} Q${r-o*.25},${l-i*.35} ${r},${l-i*.2} Q${r+o*.25},${l-i*.05} ${r+o*.5},${l-i*.2}" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M${r-o*.4},${l+i*.1} Q${r-o*.15},${l-i*.05} ${r+o*.1},${l+i*.1} Q${r+o*.3},${l+i*.25} ${r+o*.5},${l+i*.1}" stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;default:return""}}function Oo(c,r,l,o,i){const f=S(c,15),a=D(c,8);return`
    <ellipse cx="${r}" cy="${l}" rx="${o+3}" ry="${i+1.5}" fill="${f}" opacity="0.3"/>
    <ellipse cx="${r}" cy="${l}" rx="${o}" ry="${i}" fill="${c}"/>
    <ellipse cx="${r}" cy="${l}" rx="${o-3}" ry="${i-1}" fill="${a}" opacity="0.2"/>
  `}function Bf(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:i,eyeColor:f,expression:a,pattern:u}=c,p=Oo(i,50,72,24,6),y=`
    <ellipse cx="50" cy="56" rx="16" ry="12" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="white" opacity="0.15"/>
  `,$=`
    <path d="M34,48 Q42,38 50,40 Q58,38 66,48 Q58,52 50,50 Q42,52 34,48 Z" fill="${o}" stroke="${S(o,15)}" stroke-width="0.5"/>
    <path d="M38,46 Q50,40 62,46" stroke="${D(o,15)}" stroke-width="0.8" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,g=`
    <rect x="42" y="52" width="16" height="10" rx="1" fill="#2E3B2E" opacity="0.85"/>
    <rect x="44" y="54" width="12" height="6" rx="0.5" fill="#3E4F3E" opacity="0.2"/>
  `,w=Vt(a,f,45,44,55,44,2.5),v=Ht(a,50,49),M=Zt(r,50,48,14,10,u);return p+y+g+$+M+w+v}function Xh(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Oo(i,50,78,22,5),$=`
    <path d="M50,22 L26,76 L74,76 Z" fill="${r}" stroke="${p}" stroke-width="0.6"/>
  `,g=`
    <path d="M50,26 L28,74 L72,74 Z" fill="${l}"/>
    <path d="M72,74 Q68,68 74,76" fill="${l}" stroke="${p}" stroke-width="0.3" opacity="0.6"/>
    <path d="M28,74 Q32,68 26,76" fill="${l}" stroke="${p}" stroke-width="0.3" opacity="0.6"/>
  `,w=`
    <path d="M26,76 Q50,82 74,76" fill="${S(r,10)}" stroke="${p}" stroke-width="0.5"/>
  `,v=`
    <circle cx="44" cy="58" r="4" fill="${o}" opacity="0.8"/>
    <circle cx="56" cy="54" r="3.5" fill="${o}" opacity="0.8"/>
    <circle cx="50" cy="66" r="4" fill="${o}" opacity="0.8"/>
    <circle cx="38" cy="68" r="3" fill="${S(o,10)}" opacity="0.7"/>
    <circle cx="60" cy="66" r="3" fill="${S(o,10)}" opacity="0.7"/>
  `,M=Vt(a,f,44,44,56,44,3),k=Ht(a,50,52),x=Zt(r,50,50,16,20,u);return y+$+g+w+v+x+M+k}function Kh(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <path d="M32,58 Q34,56 36,58 Q38,56 40,58 Q42,56 44,58 Q46,56 48,58 Q50,56 52,58 Q54,56 56,58 Q58,56 60,58 Q62,56 64,58 Q66,56 68,58 L66,82 Q50,86 34,82 Z" fill="${l}" stroke="${S(l,15)}" stroke-width="0.5"/>
    <path d="M38,62 L36,78" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M50,60 L50,80" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M62,62 L64,78" stroke="${S(l,10)}" stroke-width="0.5" opacity="0.3"/>
  `,y=`
    <path d="M30,58 Q30,32 50,28 Q70,32 70,58 Z" fill="${r}" stroke="${u}" stroke-width="0.5"/>
    <path d="M36,56 Q36,36 50,32 Q64,36 64,56" fill="${D(r,10)}" opacity="0.2"/>
    <path d="M40,54 Q44,44 50,42 Q56,44 60,54" stroke="${D(r,15)}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,$=`
    <circle cx="50" cy="26" r="5" fill="${o}"/>
    <circle cx="48" cy="24" r="1.5" fill="white" opacity="0.4"/>
    <path d="M50,22 Q52,18 54,16" stroke="#4E342E" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  `,g=Vt(f,i,44,44,56,44,3),w=Ht(f,50,51),v=Zt(r,50,44,16,14,a);return p+y+v+$+g+w}function Jh(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
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
    <circle cx="50" cy="28" r="12" fill="${r}" stroke="${u}" stroke-width="0.5"/>
    <circle cx="46" cy="24" r="3" fill="${D(r,15)}" opacity="0.2"/>
  `,g=`
    <path d="M38,44 Q36,50 38,54" fill="${l}" stroke="none"/>
    <path d="M62,42 Q64,48 62,52" fill="${r}" stroke="none"/>
  `,w=`
    <path d="M40,24 Q50,20 60,24" stroke="${o}" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M42,28 Q50,32 58,28" stroke="${o}" stroke-width="1" fill="none" opacity="0.4" stroke-linecap="round"/>
  `,v=Vt(f,i,45,26,55,26,2.5),M=Ht(f,50,32),k=Zt(r,50,28,12,12,a);return p+y+$+g+w+k+v+M}function e5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Oo(i,50,74,24,5),$=`
    <ellipse cx="50" cy="50" rx="22" ry="20" fill="${l}" stroke="${S(l,15)}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${D(l,30)}"/>
  `,g=`
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${i}"/>
  `,w=`
    <path d="M28,48 Q30,36 38,30 Q50,24 62,30 Q70,36 72,48 Q68,52 62,50 Q56,54 50,50 Q44,54 38,50 Q32,52 28,48 Z" fill="${r}" stroke="${p}" stroke-width="0.5"/>
    <ellipse cx="50" cy="40" rx="8" ry="6" fill="${r}"/>
  `,v=`
    <g opacity="0.7">
      <rect x="36" y="34" width="2" height="4" rx="1" fill="${o}" transform="rotate(20, 36, 34)"/>
      <rect x="48" y="30" width="2" height="4" rx="1" fill="${D(o,20)}" transform="rotate(-15, 48, 30)"/>
      <rect x="60" y="36" width="2" height="4" rx="1" fill="${o}" transform="rotate(35, 60, 36)"/>
      <rect x="42" y="38" width="2" height="4" rx="1" fill="${D(o,10)}" transform="rotate(-30, 42, 38)"/>
      <rect x="56" y="32" width="2" height="4" rx="1" fill="${o}" transform="rotate(10, 56, 32)"/>
    </g>
  `,M=Vt(a,f,42,40,58,40,2.5),k=Ht(a,50,46),x=Zt(r,50,38,18,12,u);return y+$+g+w+v+x+M+k}function t5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=r,y=u,$=`
    <path d="M28,62 Q28,68 50,68 Q72,68 72,62 L28,62 Z" fill="${p}" stroke="${y}" stroke-width="0.5"/>
  `,g=`
    <rect x="26" y="54" width="48" height="8" rx="4" fill="#5D4037" stroke="${S("#5D4037",15)}" stroke-width="0.4"/>
  `,w=`
    <path d="M26,54 L74,54 L72,50 Q68,52 60,50 Q50,48 40,50 Q32,52 28,50 Z" fill="${l}" stroke="${S(l,10)}" stroke-width="0.3"/>
    <path d="M26,54 Q24,58 26,56" fill="${l}" stroke="none"/>
    <path d="M74,54 Q76,58 74,56" fill="${l}" stroke="none"/>
  `,v=`
    <path d="M26,50 Q32,46 38,50 Q44,46 50,50 Q56,46 62,50 Q68,46 74,50" fill="#66BB6A" stroke="${S("#66BB6A",15)}" stroke-width="0.4"/>
  `,M=`
    <path d="M28,50 Q28,28 50,26 Q72,28 72,50 Z" fill="${p}" stroke="${y}" stroke-width="0.5"/>
    <ellipse cx="50" cy="36" rx="16" ry="8" fill="${D(p,10)}" opacity="0.15"/>
  `,k=`
    <g opacity="0.5">
      <ellipse cx="42" cy="32" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(10, 42, 32)"/>
      <ellipse cx="52" cy="30" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(-15, 52, 30)"/>
      <ellipse cx="58" cy="34" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(20, 58, 34)"/>
      <ellipse cx="46" cy="36" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-5, 46, 36)"/>
    </g>
  `,x=`
    <path d="M72,50 Q74,54 72,58" fill="${o}" stroke="none" opacity="0.7"/>
  `,E=Vt(f,i,43,40,57,40,3),b=Ht(f,50,47),P=Zt(p,50,38,20,12,a);return $+g+w+v+x+M+k+P+E+b}function r5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <path d="M20,56 Q20,30 50,26 Q80,30 80,56" fill="${r}" stroke="${u}" stroke-width="0.6"/>
    <path d="M24,54 Q24,34 50,30 Q76,34 76,54" fill="${D(r,8)}" opacity="0.15"/>
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
  `,w=`
    <circle cx="38" cy="46" r="2" fill="${o}" opacity="0.6"/>
    <circle cx="50" cy="44" r="1.5" fill="${o}" opacity="0.6"/>
    <circle cx="62" cy="46" r="2" fill="${o}" opacity="0.6"/>
  `,v=Vt(f,i,42,48,58,48,3),M=Ht(f,50,54),k=Zt(r,50,44,22,14,a);return p+$+y+g+w+k+v+M}function n5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:i,eyeColor:f,expression:a,pattern:u}=c,p=`
    <path d="M18,46 Q18,78 50,80 Q82,78 82,46 Z" fill="${i}" stroke="${S(i,15)}" stroke-width="0.6"/>
    <path d="M22,48 Q22,74 50,76 Q78,74 78,48" fill="${D(i,8)}" opacity="0.15"/>
  `,y=`
    <ellipse cx="50" cy="46" rx="32" ry="8" fill="${S(i,10)}" stroke="${S(i,20)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="46" rx="30" ry="7" fill="${i}"/>
  `,$=`
    <ellipse cx="50" cy="48" rx="28" ry="6" fill="${r}" opacity="0.4"/>
  `,g=`
    <g stroke="${l}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7">
      <path d="M30,56 Q38,52 46,56 Q54,60 62,56 Q68,52 72,56"/>
      <path d="M28,62 Q36,58 44,62 Q52,66 60,62 Q66,58 70,62"/>
      <path d="M32,68 Q40,64 48,68 Q56,72 64,68"/>
    </g>
  `,w=`
    <ellipse cx="64" cy="50" rx="6" ry="5" fill="white" stroke="#E0E0E0" stroke-width="0.4"/>
    <ellipse cx="64" cy="50" rx="3" ry="2.5" fill="#FFC107"/>
  `,v=`
    <rect x="28" y="48" width="8" height="12" rx="1" fill="#2E3B2E" opacity="0.8"/>
    <rect x="29" y="50" width="6" height="8" rx="0.5" fill="#3E4F3E" opacity="0.15"/>
  `,M=`
    <circle cx="50" cy="52" r="4" fill="white" stroke="#E0E0E0" stroke-width="0.3"/>
    <path d="M48,52 Q50,48 52,52 Q50,56 48,52" fill="${o}" opacity="0.6"/>
  `,k=Vt(a,f,42,52,54,50,2.5),x=Ht(a,48,56),E=Zt(r,50,56,24,12,u);return p+y+$+g+w+v+M+E+k+x}function l5(c){const{primaryColor:r,secondaryColor:l,toppingColor:o,plateColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=Oo(i,50,72,22,5),$=`
    <circle cx="50" cy="50" r="22" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <circle cx="50" cy="50" r="20" fill="${D(r,5)}" opacity="0.15"/>
  `,g=`
    <g opacity="0.3">
      <circle cx="30" cy="44" r="2" fill="${p}"/>
      <circle cx="70" cy="46" r="1.8" fill="${p}"/>
      <circle cx="34" cy="66" r="1.5" fill="${p}"/>
      <circle cx="66" cy="64" r="2" fill="${p}"/>
      <circle cx="28" cy="54" r="1.2" fill="${p}"/>
      <circle cx="72" cy="56" r="1.5" fill="${p}"/>
    </g>
  `,w=`
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
  `,M=Vt(a,f,44,46,56,46,3),k=Ht(a,50,54),x=Zt(r,50,50,20,20,u);return y+$+g+v+w+x+M+k}function o5(c){const{primaryColor:r,toppingColor:l,eyeColor:o,expression:i,pattern:f}=c,a="#4CAF50",u=S(a,15),p=`
    <path d="M18,58 Q50,14 82,58 Q50,64 18,58 Z" fill="${a}" stroke="${u}" stroke-width="0.6"/>
  `,y=`
    <path d="M22,56 Q50,20 78,56 Q50,60 22,56 Z" fill="${D(a,30)}"/>
  `,$=`
    <path d="M24,54 Q50,22 76,54 Q50,58 24,54 Z" fill="${l}" stroke="${S(l,10)}" stroke-width="0.3"/>
    <path d="M30,52 Q50,26 70,52" fill="${D(l,10)}" opacity="0.15"/>
  `,g=`
    <g fill="${r}">
      <ellipse cx="38" cy="46" rx="1.5" ry="2" transform="rotate(15, 38, 46)"/>
      <ellipse cx="50" cy="40" rx="1.5" ry="2" transform="rotate(0, 50, 40)"/>
      <ellipse cx="62" cy="46" rx="1.5" ry="2" transform="rotate(-15, 62, 46)"/>
      <ellipse cx="44" cy="50" rx="1.2" ry="1.8" transform="rotate(10, 44, 50)"/>
      <ellipse cx="56" cy="50" rx="1.2" ry="1.8" transform="rotate(-10, 56, 50)"/>
    </g>
  `,w=`
    <path d="M50,58 Q50,64 48,68" stroke="${D(l,10)}" stroke-width="1" fill="none" opacity="0.3" stroke-linecap="round"/>
  `,v=Vt(i,o,44,42,56,42,2.5),M=Ht(i,50,48),k=Zt(l,50,44,22,14,f);return p+y+$+g+w+k+v+M}function i5(c){const{backgroundShape:r,foodType:l,backgroundColor:o}=c;let i;switch(l){case"sushi":i=Bf(c);break;case"pizza":i=Xh(c);break;case"cupcake":i=Kh(c);break;case"ice-cream":i=Jh(c);break;case"donut":i=e5(c);break;case"burger":i=t5(c);break;case"taco":i=r5(c);break;case"ramen":i=n5(c);break;case"cookie":i=l5(c);break;case"watermelon":i=o5(c);break;default:i=Bf(c)}const f=ot(i);return it(f,r,o)}function s5(c){const r=["circle","rounded","square"],l=["sushi","pizza","cupcake","ice-cream","donut","burger","taco","ramen","cookie","watermelon"],o=["happy","yummy","surprised","sleepy"],i=["none","sprinkles","sesame","drizzle"],f=["#FF8A65","#FF7043","#E64A19","#BF360C","#FFAB91","#D4A056","#A1887F","#8D6E63","#FFB74D","#FFA726","#FB8C00","#F57C00","#FFCC80","#D7CCC8","#BCAAA4","#795548"],a=["#FFCC80","#FFE0B2","#FFF8E1","#FFFDE7","#FFF9C4","#FFF3E0","#FFECB3","#FAFAFA"],u=["#E53935","#D32F2F","#C62828","#FF6F00","#F9A825","#2E7D32","#E91E63","#FF5722"],p=["#ECEFF1","#F5F5F5","#FAFAFA","#E0E0E0","#D7CCC8","#EFEBE9","#CFD8DC","#BDBDBD"],y=["#FFF8E1","#FFF3E0","#FFECB3","#FFE0B2","#E8F5E9","#F3E5F5","#E1F5FE","#FCE4EC","#FFFDE7","#FBE9E7","#EFEBE9","#F1F8E9"],$=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:O(r,c),foodType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),toppingColor:O(u,c),plateColor:O(p,c),eyeColor:O($,c),backgroundColor:O(y,c),expression:O(o,c),pattern:O(i,c)}}var c5={name:"Food",schema:Gh,shapeParam:"foodType",generate:i5,randomize:s5},a5={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},weatherType:{type:"select",default:"sun",options:["sun","cloud","raindrop","snowflake","lightning","tornado","rainbow","moon","star","comet"]},primaryColor:{type:"color",default:"#FFD54F"},secondaryColor:{type:"color",default:"#FFF9C4"},glowColor:{type:"color",default:"#FF8F00"},precipitationColor:{type:"color",default:"#90CAF9"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#E3F2FD"},expression:{type:"select",default:"happy",options:["happy","breezy","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","swirls","dots","stripes"]}};function Wt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"breezy":return`
        <path d="M${l-u},${o} Q${l},${o-u*1.2} ${l+u},${o}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${i-u},${f} Q${i},${f-u*1.2} ${i+u},${f}" stroke="${r}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${l+u*1.2}" cy="${o+u*.4}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${i-u*1.2}" cy="${f+u*.4}" rx="${u*.6}" ry="${u*.3}" fill="#FFB6C1" opacity="0.4"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function qt(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"breezy":return`
        <ellipse cx="${r+4}" cy="${l+1}" rx="2.5" ry="2" fill="#5D4037" opacity="0.6"/>
        <path d="M${r+6},${l} Q${r+10},${l+1} ${r+12},${l-1}" stroke="#90CAF9" stroke-width="0.8" fill="none" opacity="0.4" stroke-linecap="round"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Yt(c,r,l,o,i,f){const a=S(c,30);switch(f){case"swirls":return`
        <g opacity="0.2">
          <path d="M${r-o*.3},${l-i*.2} Q${r-o*.1},${l-i*.4} ${r+o*.1},${l-i*.2} Q${r+o*.2},${l} ${r},${l+i*.1}" stroke="${a}" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M${r+o*.2},${l+i*.1} Q${r+o*.4},${l-i*.1} ${r+o*.3},${l+i*.3}" stroke="${a}" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        </g>
      `;case"dots":return`
        <g opacity="0.2">
          <circle cx="${r-o*.3}" cy="${l-i*.2}" r="1.2" fill="${a}"/>
          <circle cx="${r+o*.25}" cy="${l-i*.15}" r="1" fill="${a}"/>
          <circle cx="${r-o*.1}" cy="${l+i*.2}" r="1.3" fill="${a}"/>
          <circle cx="${r+o*.35}" cy="${l+i*.1}" r="0.9" fill="${a}"/>
        </g>
      `;case"stripes":return`
        <g opacity="0.15" stroke="${a}" stroke-width="1" stroke-linecap="round">
          <line x1="${r-o*.4}" y1="${l-i*.25}" x2="${r+o*.4}" y2="${l-i*.25}"/>
          <line x1="${r-o*.35}" y1="${l}" x2="${r+o*.35}" y2="${l}"/>
          <line x1="${r-o*.3}" y1="${l+i*.25}" x2="${r+o*.3}" y2="${l+i*.25}"/>
        </g>
      `;default:return""}}function Df(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=`
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
  `,p=`
    <circle cx="50" cy="50" r="18" fill="${r}" stroke="${a}" stroke-width="0.6"/>
    <circle cx="46" cy="44" r="5" fill="${D(r,15)}" opacity="0.2"/>
  `,y=Wt(i,o,44,48,56,48,2.5),$=qt(i,50,54),g=Yt(r,50,50,16,16,f);return u+p+g+y+$}function u5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,15),u=`
    <rect x="26" y="52" width="48" height="14" rx="7" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="36" cy="46" r="14" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="54" cy="42" r="16" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <circle cx="66" cy="50" r="12" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <rect x="26" y="50" width="48" height="16" fill="${r}"/>
  `,p=`
    <circle cx="38" cy="42" r="4" fill="${D(l,10)}" opacity="0.2"/>
    <circle cx="56" cy="38" r="5" fill="${D(l,10)}" opacity="0.15"/>
  `,y=Wt(i,o,42,52,58,52,2.5),$=qt(i,50,58),g=Yt(r,50,50,22,14,f);return u+p+g+y+$}function f5(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <path d="M50,18 Q38,40 38,56 Q38,72 50,72 Q62,72 62,56 Q62,40 50,18 Z" fill="${r}" stroke="${u}" stroke-width="0.6"/>
  `,y=`
    <path d="M44,36 Q42,48 44,58 Q46,64 50,66" fill="${D(l,10)}" opacity="0.2" stroke="none"/>
  `,$=`
    <ellipse cx="50" cy="62" rx="8" ry="4" fill="${o}" opacity="0.1"/>
  `,g=Wt(f,i,45,50,55,50,2.5),w=qt(f,50,56),v=Yt(r,50,50,10,18,a);return $+p+y+v+g+w}function d5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=`
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
  `,p=`
    <circle cx="50" cy="50" r="10" fill="${r}" stroke="${a}" stroke-width="0.6"/>
    <circle cx="48" cy="47" r="3" fill="${D(r,15)}" opacity="0.2"/>
  `,y=Wt(i,o,46,48,54,48,2),$=qt(i,50,53),g=Yt(r,50,50,8,8,f);return u+p+g+y+$}function p5(c){const{primaryColor:r,secondaryColor:l,glowColor:o,eyeColor:i,expression:f,pattern:a}=c,u=`
    <circle cx="42" cy="26" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="54" cy="24" r="10" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="62" cy="28" r="7" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="36" y="28" width="30" height="8" fill="${l}"/>
  `,p=`
    <path d="M54,34 L44,52 L52,52 L42,74" stroke="${o}" stroke-width="6" fill="none" opacity="0.15" stroke-linecap="round" stroke-linejoin="round"/>
  `,y=`
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${r}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${D(r,20)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,$=Wt(f,i,44,56,54,56,2.5),g=qt(f,49,62),w=Yt(r,48,54,10,16,a);return u+p+y+w+$+g}function h5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=`
    <path d="M28,28 Q50,24 72,28 Q68,36 62,38 Q50,34 38,38 Q32,36 28,28 Z" fill="${r}" stroke="${a}" stroke-width="0.5"/>
    <path d="M34,38 Q50,34 66,38 Q62,46 58,48 Q50,44 42,48 Q38,46 34,38 Z" fill="${S(r,8)}" stroke="${a}" stroke-width="0.4"/>
    <path d="M38,48 Q50,44 62,48 Q58,56 56,58 Q50,54 44,58 Q40,56 38,48 Z" fill="${S(r,16)}" stroke="${a}" stroke-width="0.4"/>
    <path d="M42,58 Q50,54 58,58 Q56,66 54,68 Q50,64 46,68 Q44,66 42,58 Z" fill="${S(r,24)}" stroke="${a}" stroke-width="0.3"/>
    <path d="M44,68 Q50,64 56,68 Q54,76 52,78 Q50,74 48,78 Q46,76 44,68 Z" fill="${S(r,32)}" stroke="${a}" stroke-width="0.3"/>
  `,p=`
    <g opacity="0.15">
      <path d="M32,30 Q50,26 68,30" stroke="${D(l,10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M38,40 Q50,36 62,40" stroke="${D(l,10)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </g>
  `,y=Wt(i,o,44,34,56,34,2.5),$=qt(i,50,40),g=Yt(r,50,36,18,8,f);return u+p+g+y+$}function y5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=`
    <circle cx="20" cy="62" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="28" cy="60" r="6" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="16" y="62" width="16" height="6" fill="${l}"/>
  `,u=`
    <circle cx="80" cy="62" r="8" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <circle cx="72" cy="60" r="6" fill="${l}" stroke="${S(l,10)}" stroke-width="0.4"/>
    <rect x="68" y="62" width="16" height="6" fill="${l}"/>
  `,p=["#EF5350","#FF9800","#FFEB3B","#66BB6A","#42A5F5","#AB47BC"];let y="";for(let M=0;M<p.length;M++){const k=34-M*3;y+=`<path d="M${50-k},64 A${k},${k} 0 0,1 ${50+k},64" stroke="${p[M]}" stroke-width="3" fill="none" opacity="0.7"/>`}const $=`
    <path d="M18,64 A32,32 0 0,1 82,64" stroke="${r}" stroke-width="1.5" fill="none" opacity="0.2"/>
  `,g=Wt(i,o,44,48,56,48,2.5),w=qt(i,50,54),v=Yt(r,50,46,20,14,f);return a+u+y+$+v+g+w}function $5(c){const{primaryColor:r,eyeColor:l,expression:o,pattern:i}=c,f=S(r,15),a=`
    <defs>
      <clipPath id="moon-clip">
        <circle cx="50" cy="50" r="22"/>
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="22" fill="${r}" stroke="${f}" stroke-width="0.6"/>
    <g clip-path="url(#moon-clip)">
      <circle cx="62" cy="40" r="18" fill="${S(r,10)}" opacity="0.3"/>
    </g>
  `,u=`
    <g opacity="0.15">
      <circle cx="42" cy="46" r="3" fill="${f}"/>
      <circle cx="48" cy="58" r="2.5" fill="${f}"/>
      <circle cx="38" cy="56" r="1.8" fill="${f}"/>
    </g>
  `,p=`
    <circle cx="44" cy="42" r="4" fill="${D(r,15)}" opacity="0.15"/>
  `,y=Wt(o,l,42,50,52,50,2.5),$=qt(o,47,56),g=Yt(r,46,52,14,14,i);return a+u+p+g+y+$}function k5(c){const{primaryColor:r,secondaryColor:l,eyeColor:o,expression:i,pattern:f}=c,a=S(r,20),u=[];for(let M=0;M<5;M++){const k=(M*72-90)*(Math.PI/180),x=(M*72+36-90)*(Math.PI/180),E=50+24*Math.cos(k),b=50+24*Math.sin(k),P=50+10*Math.cos(x),N=50+10*Math.sin(x);u.push(`${E},${b}`,`${P},${N}`)}const p=`
    <polygon points="${u.join(" ")}" fill="${r}" stroke="${a}" stroke-width="0.6" stroke-linejoin="round"/>
  `,y=`
    <circle cx="48" cy="46" r="5" fill="${D(l,10)}" opacity="0.15"/>
  `,$=`
    <g fill="white" opacity="0.4">
      <circle cx="50" cy="26" r="1.5"/>
      <circle cx="73" cy="41" r="1.2"/>
      <circle cx="26" cy="41" r="1"/>
    </g>
  `,g=Wt(i,o,45,48,55,48,2.5),w=qt(i,50,54),v=Yt(r,50,50,10,10,f);return p+y+$+v+g+w}function m5(c){const{primaryColor:r,secondaryColor:l,glowColor:o,precipitationColor:i,eyeColor:f,expression:a,pattern:u}=c,p=S(r,20),y=`
    <g opacity="0.4">
      <path d="M50,50 Q30,42 10,36" stroke="${l}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
      <path d="M50,50 Q32,44 14,40" stroke="${i}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
      <path d="M50,50 Q34,46 18,44" stroke="${D(l,15)}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    </g>
  `,$=`
    <circle cx="54" cy="50" r="18" fill="${o}" opacity="0.12"/>
  `,g=`
    <circle cx="54" cy="50" r="14" fill="${r}" stroke="${p}" stroke-width="0.6"/>
    <circle cx="50" cy="46" r="4" fill="${D(r,15)}" opacity="0.2"/>
  `,w=Wt(a,f,50,48,58,48,2.5),v=qt(a,54,54),M=Yt(r,54,50,12,12,u);return y+$+g+M+w+v}function x5(c){const{backgroundShape:r,weatherType:l,backgroundColor:o}=c;let i;switch(l){case"sun":i=Df(c);break;case"cloud":i=u5(c);break;case"raindrop":i=f5(c);break;case"snowflake":i=d5(c);break;case"lightning":i=p5(c);break;case"tornado":i=h5(c);break;case"rainbow":i=y5(c);break;case"moon":i=$5(c);break;case"star":i=k5(c);break;case"comet":i=m5(c);break;default:i=Df(c)}const f=ot(i);return it(f,r,o)}function g5(c){const r=["circle","rounded","square"],l=["sun","cloud","raindrop","snowflake","lightning","tornado","rainbow","moon","star","comet"],o=["happy","breezy","surprised","sleepy"],i=["none","swirls","dots","stripes"],f=["#FFD54F","#FFC107","#FFB300","#FF8F00","#90CAF9","#64B5F6","#42A5F5","#BBDEFB","#B0BEC5","#CFD8DC","#ECEFF1","#FFFFFF","#CE93D8","#B39DDB","#81D4FA","#A5D6A7"],a=["#FFF9C4","#FFFDE7","#E3F2FD","#E8EAF6","#F3E5F5","#FFFFFF","#FFF8E1","#E0F7FA"],u=["#FF8F00","#FFD54F","#2979FF","#B0BEC5","#FFF9C4","#FF6F00","#448AFF","#E0E0E0"],p=["#90CAF9","#64B5F6","#BBDEFB","#E3F2FD","#FFFFFF","#B0BEC5","#FFF9C4","#CFD8DC"],y=["#E3F2FD","#BBDEFB","#E1F5FE","#E8EAF6","#FCE4EC","#FFF8E1","#E0F7FA","#F3E5F5","#1A237E","#263238","#37474F","#ECEFF1"],$=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:O(r,c),weatherType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),glowColor:O(u,c),precipitationColor:O(p,c),eyeColor:O($,c),backgroundColor:O(y,c),expression:O(o,c),pattern:O(i,c)}}var w5={name:"Weather",schema:a5,shapeParam:"weatherType",generate:x5,randomize:g5},v5={backgroundShape:{type:"select",default:"circle",options:["circle","rounded","square"]},gemType:{type:"select",default:"diamond",options:["diamond","ruby","emerald","sapphire","amethyst","opal","topaz","pearl","crystal","geode"]},primaryColor:{type:"color",default:"#B3E5FC"},secondaryColor:{type:"color",default:"#E1F5FE"},facetColor:{type:"color",default:"#FFFFFF"},eyeColor:{type:"color",default:"#1a1a1a"},backgroundColor:{type:"color",default:"#1A237E"},expression:{type:"select",default:"happy",options:["happy","dazzled","surprised","sleepy"]},pattern:{type:"select",default:"none",options:["none","facets","inclusions","shimmer"]}};function Gt(c,r,l,o,i,f,a){const u=a,p=u*.45,y=u*.25;switch(c){case"happy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"dazzled":return`
        <g fill="${r}">
          <path d="M${l},${o-u} L${l+u*.35},${o-u*.35} L${l+u},${o} L${l+u*.35},${o+u*.35} L${l},${o+u} L${l-u*.35},${o+u*.35} L${l-u},${o} L${l-u*.35},${o-u*.35} Z"/>
          <path d="M${i},${f-u} L${i+u*.35},${f-u*.35} L${i+u},${f} L${i+u*.35},${f+u*.35} L${i},${f+u} L${i-u*.35},${f+u*.35} L${i-u},${f} L${i-u*.35},${f-u*.35} Z"/>
        </g>
        <circle cx="${l}" cy="${o}" r="${y}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${y}" fill="white"/>
      `;case"surprised":return`
        <circle cx="${l}" cy="${o}" r="${u*1.2}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u*1.2}" fill="white"/>
        <circle cx="${l}" cy="${o}" r="${p*.7}" fill="${r}"/>
        <circle cx="${i}" cy="${f}" r="${p*.7}" fill="${r}"/>
        <circle cx="${l-1}" cy="${o-1}" r="${y}" fill="white"/>
        <circle cx="${i-1}" cy="${f-1}" r="${y}" fill="white"/>
      `;case"sleepy":return`
        <circle cx="${l}" cy="${o}" r="${u}" fill="white"/>
        <circle cx="${i}" cy="${f}" r="${u}" fill="white"/>
        <circle cx="${l}" cy="${o+1}" r="${p}" fill="${r}"/>
        <circle cx="${i}" cy="${f+1}" r="${p}" fill="${r}"/>
        <path d="M${l-u},${o-u*.3} Q${l},${o-u*.8} ${l+u},${o-u*.3}" fill="white" stroke="none"/>
        <path d="M${i-u},${f-u*.3} Q${i},${f-u*.8} ${i+u},${f-u*.3}" fill="white" stroke="none"/>
      `;default:return""}}function Xt(c,r,l){switch(c){case"happy":return`
        <path d="M${r-3},${l} Q${r},${l+4} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;case"dazzled":return`
        <path d="M${r-3},${l} Q${r},${l+5} ${r+3},${l}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${r}" cy="${l+3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
      `;case"surprised":return`
        <ellipse cx="${r}" cy="${l+2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;case"sleepy":return`
        <path d="M${r-2},${l+1} L${r+2},${l+1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;default:return""}}function Kt(c,r,l,o,i,f){switch(f){case"facets":return`
        <g opacity="0.2" stroke="${c}" stroke-width="0.8" fill="none" stroke-linecap="round">
          <line x1="${r}" y1="${l-i*.4}" x2="${r-o*.3}" y2="${l+i*.2}"/>
          <line x1="${r}" y1="${l-i*.4}" x2="${r+o*.3}" y2="${l+i*.2}"/>
          <line x1="${r-o*.3}" y1="${l+i*.2}" x2="${r+o*.3}" y2="${l+i*.2}"/>
          <line x1="${r-o*.5}" y1="${l-i*.1}" x2="${r+o*.5}" y2="${l-i*.1}"/>
        </g>
      `;case"inclusions":return`
        <g opacity="0.15">
          <circle cx="${r-o*.2}" cy="${l-i*.15}" r="1.5" fill="${c}"/>
          <circle cx="${r+o*.25}" cy="${l+i*.1}" r="1" fill="${c}"/>
          <ellipse cx="${r+o*.1}" cy="${l-i*.25}" rx="2" ry="0.8" fill="${c}" transform="rotate(30, ${r+o*.1}, ${l-i*.25})"/>
          <circle cx="${r-o*.3}" cy="${l+i*.2}" r="0.8" fill="${c}"/>
        </g>
      `;case"shimmer":return`
        <g opacity="0.12">
          <path d="M${r-o*.4},${l-i*.3} Q${r-o*.2},${l-i*.1} ${r},${l-i*.3} Q${r+o*.2},${l-i*.5} ${r+o*.4},${l-i*.3}" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M${r-o*.3},${l+i*.1} Q${r},${l-i*.05} ${r+o*.3},${l+i*.1}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;default:return""}}function Of(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <polygon points="38,38 62,38 72,52 28,52" fill="${r}" stroke="${u}" stroke-width="0.6"/>
  `,y=`
    <polygon points="42,38 58,38 54,44 46,44" fill="${D(r,15)}" opacity="0.4"/>
  `,$=`
    <polygon points="28,52 72,52 50,76" fill="${S(r,10)}" stroke="${u}" stroke-width="0.6"/>
  `,g=`
    <g stroke="${o}" stroke-width="0.5" opacity="0.3">
      <line x1="46" y1="44" x2="28" y2="52"/>
      <line x1="54" y1="44" x2="72" y2="52"/>
      <line x1="50" y1="38" x2="50" y2="44"/>
    </g>
  `,w=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.2">
      <line x1="38" y1="52" x2="50" y2="76"/>
      <line x1="62" y1="52" x2="50" y2="76"/>
      <line x1="50" y1="52" x2="50" y2="76"/>
    </g>
  `,v=`
    <polygon points="42,40 48,40 46,46 40,46" fill="${l}" opacity="0.2"/>
  `,M=Gt(f,i,44,48,56,48,2.5),k=Xt(f,50,54),x=Kt(o,50,50,20,16,a);return p+y+$+g+w+v+x+M+k}function M5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <ellipse cx="50" cy="50" rx="20" ry="18" fill="${r}" stroke="${u}" stroke-width="0.6"/>
  `,y=`
    <ellipse cx="50" cy="50" rx="16" ry="14" fill="${D(r,10)}" opacity="0.15"/>
    <ellipse cx="44" cy="44" rx="8" ry="6" fill="${l}" opacity="0.15"/>
  `,$=`
    <g stroke="${o}" stroke-width="0.6" opacity="0.2" stroke-linecap="round">
      <line x1="50" y1="36" x2="50" y2="64"/>
      <line x1="36" y1="44" x2="64" y2="56"/>
      <line x1="36" y1="56" x2="64" y2="44"/>
    </g>
  `,g=Gt(f,i,44,48,56,48,2.5),w=Xt(f,50,54),v=Kt(o,50,50,18,16,a);return p+y+$+v+g+w}function C5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <polygon points="36,34 64,34 70,40 70,60 64,66 36,66 30,60 30,40" fill="${r}" stroke="${u}" stroke-width="0.6"/>
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
  `,w=Gt(f,i,44,48,56,48,2.5),v=Xt(f,50,54),M=Kt(o,50,50,18,14,a);return p+y+$+g+M+w+v}function S5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <path d="M50,26 Q68,36 68,56 Q68,72 50,74 Q32,72 32,56 Q32,36 50,26 Z" fill="${r}" stroke="${u}" stroke-width="0.6"/>
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
  `,g=Gt(f,i,44,48,56,48,2.5),w=Xt(f,50,56),v=Kt(o,50,50,16,20,a);return p+y+$+v+g+w}function E5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <polygon points="40,74 34,74 28,54 34,30 40,30 46,54" fill="${S(r,12)}" stroke="${u}" stroke-width="0.5"/>
    <polygon points="54,74 48,74 42,48 48,24 54,24 60,48" fill="${r}" stroke="${u}" stroke-width="0.5"/>
    <polygon points="66,74 60,74 54,52 60,32 66,32 72,52" fill="${S(r,6)}" stroke="${u}" stroke-width="0.5"/>
  `,y=`
    <polygon points="34,30 40,30 37,22" fill="${D(r,10)}" stroke="${u}" stroke-width="0.4"/>
    <polygon points="48,24 54,24 51,16" fill="${D(r,15)}" stroke="${u}" stroke-width="0.4"/>
    <polygon points="60,32 66,32 63,24" fill="${D(r,8)}" stroke="${u}" stroke-width="0.4"/>
  `,$=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.2">
      <line x1="37" y1="30" x2="37" y2="74"/>
      <line x1="51" y1="24" x2="51" y2="74"/>
      <line x1="63" y1="32" x2="63" y2="74"/>
    </g>
  `,g=`
    <polygon points="48,28 52,28 54,40 48,40" fill="${l}" opacity="0.12"/>
  `,w=Gt(f,i,44,52,56,52,2.5),v=Xt(f,50,58),M=Kt(o,50,50,18,20,a);return p+y+$+g+M+w+v}function Q5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,15),p=`
    <ellipse cx="50" cy="52" rx="22" ry="18" fill="${r}" stroke="${u}" stroke-width="0.6"/>
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
  `,g=Gt(f,i,44,50,56,50,2.5),w=Xt(f,50,56),v=Kt(o,50,52,20,16,a);return p+y+$+v+g+w}function F5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <polygon points="42,28 58,28 68,36 68,64 58,72 42,72 32,64 32,36" fill="${r}" stroke="${u}" stroke-width="0.6"/>
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
  `,g=Gt(f,i,44,48,56,48,2.5),w=Xt(f,50,54),v=Kt(o,50,50,16,20,a);return p+y+$+v+g+w}function L5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,12),p=`
    <path d="M24,68 Q26,58 36,54 Q50,50 64,54 Q74,58 76,68 Q50,76 24,68 Z" fill="#D7CCC8" stroke="${S("#D7CCC8",15)}" stroke-width="0.5"/>
    <g stroke="#BCAAA4" stroke-width="0.4" opacity="0.3" fill="none" stroke-linecap="round">
      <path d="M30,66 Q50,56 70,66"/>
      <path d="M32,64 Q50,58 68,64"/>
      <path d="M36,60 Q50,56 64,60"/>
    </g>
  `,y=`
    <circle cx="50" cy="42" r="20" fill="${r}" stroke="${u}" stroke-width="0.5"/>
  `,$=`
    <ellipse cx="44" cy="34" rx="10" ry="8" fill="${l}" opacity="0.2"/>
    <circle cx="42" cy="32" r="4" fill="${o}" opacity="0.25"/>
    <circle cx="40" cy="30" r="1.5" fill="white" opacity="0.4"/>
  `,g=`
    <ellipse cx="50" cy="50" rx="18" ry="4" fill="${u}" opacity="0.06"/>
  `,w=Gt(f,i,44,40,56,40,2.5),v=Xt(f,50,48),M=Kt(o,50,42,18,18,a);return p+y+$+g+M+w+v}function _5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p=`
    <polygon points="40,72 32,68 32,36 40,32 50,32 58,36 58,68 50,72" fill="${r}" stroke="${u}" stroke-width="0.6"/>
  `,y=`
    <polygon points="50,72 58,68 58,36 50,32" fill="${S(r,15)}" stroke="${u}" stroke-width="0.4"/>
  `,$=`
    <polygon points="40,32 50,32 50,20 45,18 40,20" fill="${D(r,12)}" stroke="${u}" stroke-width="0.5"/>
    <polygon points="50,32 58,36 56,22 50,20" fill="${r}" stroke="${u}" stroke-width="0.4"/>
  `,g=`
    <line x1="45" y1="20" x2="45" y2="72" stroke="${l}" stroke-width="1.5" opacity="0.12"/>
    <polygon points="34" y1="38" width="6" height="12" fill="${o}" opacity="0.08"/>
  `,w=`
    <g stroke="${o}" stroke-width="0.4" opacity="0.15">
      <line x1="36" y1="40" x2="36" y2="66"/>
      <line x1="54" y1="38" x2="54" y2="68"/>
    </g>
  `,v=Gt(f,i,40,48,52,48,2.5),M=Xt(f,46,54),k=Kt(o,45,50,12,18,a);return p+y+$+g+w+k+v+M}function P5(c){const{primaryColor:r,secondaryColor:l,facetColor:o,eyeColor:i,expression:f,pattern:a}=c,u=S(r,20),p="#78909C",y=S(p,20),$=`
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
  `,w=`
    <path d="M38,32 Q50,28 62,32 L62,68 Q50,72 38,68 Z" fill="${r}" opacity="0.6"/>
  `,v=`
    <g>
      <polygon points="42,66 44,66 44,48 42,50" fill="${r}" stroke="${u}" stroke-width="0.3"/>
      <polygon points="48,68 50,68 50,42 48,44" fill="${D(r,10)}" stroke="${u}" stroke-width="0.3"/>
      <polygon points="54,66 56,66 56,46 54,48" fill="${r}" stroke="${u}" stroke-width="0.3"/>
      <polygon points="46,64 48,64 48,52 46,54" fill="${S(r,8)}" stroke="${u}" stroke-width="0.3"/>
      <polygon points="52,66 54,66 54,50 52,52" fill="${D(r,6)}" stroke="${u}" stroke-width="0.3"/>
    </g>
  `,M=`
    <g fill="${l}" opacity="0.3">
      <circle cx="43" cy="48" r="1"/>
      <circle cx="49" cy="42" r="1.2"/>
      <circle cx="55" cy="46" r="1"/>
    </g>
  `,k=Gt(f,i,44,54,56,54,2.5),x=Xt(f,50,60),E=Kt(o,50,54,12,14,a);return $+g+w+v+M+E+k+x}function A5(c){const{backgroundShape:r,gemType:l,backgroundColor:o}=c;let i;switch(l){case"diamond":i=Of(c);break;case"ruby":i=M5(c);break;case"emerald":i=C5(c);break;case"sapphire":i=S5(c);break;case"amethyst":i=E5(c);break;case"opal":i=Q5(c);break;case"topaz":i=F5(c);break;case"pearl":i=L5(c);break;case"crystal":i=_5(c);break;case"geode":i=P5(c);break;default:i=Of(c)}const f=ot(i);return it(f,r,o)}function N5(c){const r=["circle","rounded","square"],l=["diamond","ruby","emerald","sapphire","amethyst","opal","topaz","pearl","crystal","geode"],o=["happy","dazzled","surprised","sleepy"],i=["none","facets","inclusions","shimmer"],f=["#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#EF5350","#E53935","#C62828","#B71C1C","#66BB6A","#43A047","#2E7D32","#1B5E20","#42A5F5","#1E88E5","#1565C0","#0D47A1"],a=["#E1F5FE","#FFCDD2","#C8E6C9","#BBDEFB","#F3E5F5","#FFF9C4","#B2EBF2","#F5F5F5"],u=["#FFFFFF","#E0E0E0","#B3E5FC","#F8BBD0","#FFE082","#C5CAE9","#B0BEC5","#F5F5F5"],p=["#1A237E","#263238","#311B92","#004D40","#880E4F","#3E2723","#F3E5F5","#E8EAF6","#E1F5FE","#FFF8E1","#FCE4EC","#ECEFF1"],y=["#1a1a1a","#3E2723","#212121","#4E342E","#263238"];return{backgroundShape:O(r,c),gemType:O(l,c),primaryColor:O(f,c),secondaryColor:O(a,c),facetColor:O(u,c),eyeColor:O(y,c),backgroundColor:O(p,c),expression:O(o,c),pattern:O(i,c)}}var I5={name:"Gems",schema:v5,shapeParam:"gemType",generate:A5,randomize:N5},Qr={people:Rp,animals:Xp,monsters:o2,robots:y2,aliens:C2,ocean:j2,dinosaurs:G2,mythical:uh,insects:Mh,birds:Th,plants:Yh,food:c5,weather:w5,gems:I5};function xn(c,r){const l=Qr[c];if(!l)throw new Error(`Unknown theme: ${c}`);return l.generate(r)}function qs(c,r){const l=Qr[c];if(!l)throw new Error(`Unknown theme: ${c}`);const o=qf(r);return l.randomize(o)}function tc(){return Object.keys(Qr)}function Or(c){const r=Qr[c];if(!r)throw new Error(`Unknown theme: ${c}`);return{name:r.name,schema:r.schema}}function b5(c,r,l){if(c<=0)return[];const o=qf(r),i=new Map;function f(P){return P==="none"||P==="no"}function a(P,N){if(f(N))return;let B=i.get(P);B||(B=new Set,i.set(P,B)),B.add(N)}function u(P,N){var B;return f(N)?!1:((B=i.get(P))==null?void 0:B.has(N))??!1}function p(P,N){const B=N.filter(J=>!u(P,J));return B.length>0?B[o.uniformInt(0,B.length)]:N[o.uniformInt(0,N.length)]}function y(P,N,B,J){const V=[];for(let _=N;_<=B;_+=J)V.push(_);const j=V.filter(_=>!u(P,_));return j.length>0?j[o.uniformInt(0,j.length)]:V[o.uniformInt(0,V.length)]}function $(P,N){if(!u(P,N))return N;const B=parseInt(N.slice(1),16);for(let _=0;_<10;_++){const z=o.uniformInt(5,41),Z=o.uniformBool()?1:-1,ne=Math.max(0,Math.min(255,(B>>16)+Z*z)),ie=Math.max(0,Math.min(255,(B>>8&255)+Z*z)),pe=Math.max(0,Math.min(255,(B&255)+Z*z)),ge=`#${(ne<<16|ie<<8|pe).toString(16).padStart(6,"0")}`;if(!u(P,ge))return ge}const J=o.uniformInt(0,256),V=o.uniformInt(0,256),j=o.uniformInt(0,256);return`#${(J<<16|V<<8|j).toString(16).padStart(6,"0")}`}function g(P,N){const B=Qr[P],J=B.schema,V=B.shapeParam,j=B.randomize(o);j[V]=N,a(V,N);for(const[_,z]of Object.entries(J))_!==V&&(z.type==="select"&&z.options?j[_]=p(_,z.options):z.type==="color"?j[_]=$(_,j[_]):z.type==="number"&&(j[_]=y(_,z.min??0,z.max??10,z.step??1)),a(_,j[_]));return j}const w=tc(),v=o.shuffle(w.filter(P=>P!=="people")),M=new Map;for(const P of v){const N=Qr[P],B=N.shapeParam,J=N.schema[B];(J==null?void 0:J.type)==="select"&&J.options&&M.set(P,o.shuffle([...J.options]))}const k=[],x=c-1;let E=!0;for(;k.length<x&&E;){E=!1;for(const P of v){if(k.length>=x)break;const N=M.get(P);!N||N.length===0||(k.push({theme:P,shapeValue:N.pop()}),E=!0)}}for(;k.length<x;){const P=v[o.uniformInt(0,v.length)],N=Qr[P],B=N.schema[N.shapeParam];B!=null&&B.options&&k.push({theme:P,shapeValue:B.options[o.uniformInt(0,B.options.length)]})}const b=[];if(w.includes("people")){const P=Qr.people,N=P.schema[P.shapeParam],B=N!=null&&N.options?N.options[o.uniformInt(0,N.options.length)]:"bob",J=g("people",B);Uf(J,l),b.push({theme:"people",params:J,svg:xn("people",J)})}for(const P of k){const N=g(P.theme,P.shapeValue);Uf(N,l),b.push({theme:P.theme,params:N,svg:xn(P.theme,N)})}return o.shuffle(b)}function Uf(c,r){r!=null&&r.backgroundShape&&(c.backgroundShape=r.backgroundShape),r!=null&&r.transparentBackground&&(c.backgroundColor="none")}function T5(c,r){if(typeof document>"u")throw new Error("svgToPng requires a browser environment (Canvas API). This function cannot be used in Node.js.");const{size:l=256}=r??{};return new Promise((o,i)=>{const f=document.createElement("canvas"),a=f.getContext("2d");if(!a){i(new Error("Failed to get canvas 2D context"));return}const u=new Image;f.width=l,f.height=l,u.onload=()=>{a.drawImage(u,0,0,l,l),f.toBlob(y=>{y?o(y):i(new Error("Failed to convert canvas to PNG blob"))},"image/png")},u.onerror=()=>{i(new Error("Failed to load SVG into image"))};const p=new Blob([c],{type:"image/svg+xml;charset=utf-8"});u.src=URL.createObjectURL(p)})}function Ys(){return U.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[U.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),U.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}function Gs(){return U.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[U.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),U.jsx("path",{d:"M7 11V7a5 5 0 0 1 9.9-1"})]})}function j5(){return U.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[U.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"3",ry:"3"}),U.jsx("circle",{cx:"8",cy:"8",r:"1.5",fill:"currentColor",stroke:"none"}),U.jsx("circle",{cx:"16",cy:"8",r:"1.5",fill:"currentColor",stroke:"none"}),U.jsx("circle",{cx:"8",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"}),U.jsx("circle",{cx:"16",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"}),U.jsx("circle",{cx:"12",cy:"12",r:"1.5",fill:"currentColor",stroke:"none"})]})}function mn(c){return c.replace(/([A-Z])/g," $1").replace(/^./,r=>r.toUpperCase()).trim()}function R5({defaultTheme:c="people",className:r,style:l,onParamsChange:o,gridSize:i=5,gridWidth:f,gridHeight:a,backgroundColor:u,accentColor:p,layout:y="default",alwaysTransparentBackground:$=!1,onSaveSvg:g,onSavePng:w}){const v=f??i,k=v*(a??i),x=tc(),[E,b]=Ce.useState(c),[P,N]=Ce.useState(()=>({...qs(c),backgroundShape:"circle"})),[B,J]=Ce.useState("editor"),[V,j]=Ce.useState(0),[_,z]=Ce.useState(!1),[Z,ne]=Ce.useState(new Set),ie=Ce.useCallback(Y=>{ne(se=>{const ae=new Set(se);return ae.has(Y)?ae.delete(Y):ae.add(Y),ae})},[]),pe=Ce.useMemo(()=>Or(E),[E]);Ce.useEffect(()=>{o==null||o(E,P)},[]);const ge=Ce.useMemo(()=>$?{...P,backgroundColor:"none"}:P,[P,$]),we=Ce.useMemo(()=>xn(E,ge),[E,ge]),me=Ce.useCallback(Y=>{const se=Or(Y),ae={...qs(Y),backgroundShape:"circle"};for(const xe of Z)xe!=="theme"&&xe in se.schema&&xe in P&&(ae[xe]=P[xe]);b(Y),N(ae),o==null||o(Y,ae)},[o,Z,P]),q=Ce.useCallback((Y,se)=>{N(ae=>{const xe={...ae,[Y]:se};return o==null||o(E,xe),xe})},[E,o]),te=Ce.useCallback(()=>{const se=Z.has("theme")?E:x[Math.floor(Math.random()*x.length)],ae={...qs(se),backgroundShape:"circle"},xe=Or(se);for(const Ie of Z)Ie in xe.schema&&Ie in P&&(ae[Ie]=P[Ie]);b(se),N(ae),o==null||o(se,ae)},[x,o,Z,P,E]),K=Ce.useMemo(()=>{const Y=new Set(["backgroundShape"]);$&&Y.add("backgroundColor");const se=Object.entries(pe.schema).filter(([Ie])=>!Y.has(Ie)),ae=se.filter(([,Ie])=>Ie.type==="color"),xe=se.filter(([,Ie])=>Ie.type!=="color");return[...ae,...xe]},[pe.schema,$]),F=Ce.useMemo(()=>{const Y=`gallery-v${V}-${Date.now()}`;return b5(k,Y,{backgroundShape:"circle",transparentBackground:$})},[k,V,$]),R=Ce.useCallback(Y=>{const se=Or(Y.theme),ae={...Y.params};for(const xe of Z)xe!=="theme"&&xe in se.schema&&xe in P&&(ae[xe]=P[xe]);b(Y.theme),N(ae),J("editor"),o==null||o(Y.theme,ae)},[o,Z,P]),re=Ce.useCallback(()=>{j(Y=>Y+1)},[]),le=(Y,se)=>{const ae=P[Y]??se.default,xe=Z.has(Y),Ie=U.jsx("button",{className:`avatarka-lock-btn ${xe?"locked":""}`,onClick:()=>ie(Y),title:xe?"Unlock":"Lock","aria-label":xe?`Unlock ${mn(Y)}`:`Lock ${mn(Y)}`,children:xe?U.jsx(Ys,{}):U.jsx(Gs,{})});switch(se.type){case"color":return U.jsxs("div",{className:"avatarka-control-group",children:[U.jsx("label",{children:mn(Y)}),U.jsxs("div",{className:"avatarka-control-row",children:[U.jsx("input",{type:"color",value:String(ae),onChange:Ke=>q(Y,Ke.target.value)}),Ie]})]},Y);case"number":return U.jsxs("div",{className:"avatarka-control-group",children:[U.jsxs("label",{children:[mn(Y),": ",ae]}),U.jsxs("div",{className:"avatarka-control-row",children:[U.jsx("input",{type:"range",min:se.min,max:se.max,step:se.step??1,value:Number(ae),onChange:Ke=>q(Y,Number(Ke.target.value))}),Ie]})]},Y);case"select":return U.jsxs("div",{className:"avatarka-control-group",children:[U.jsx("label",{children:mn(Y)}),U.jsxs("div",{className:"avatarka-control-row",children:[U.jsx("select",{value:String(ae),onChange:Ke=>q(Y,Ke.target.value),children:se.options.map(Ke=>U.jsx("option",{value:Ke,children:mn(Ke)},Ke))}),Ie]})]},Y);default:return null}},de={...l,...u&&{"--avatarka-bg":u},...p&&{"--avatarka-accent":p},"--avatarka-grid-width":v},he=y==="compact"?"avatarka-picker--compact":"";return U.jsxs("div",{className:`avatarka-picker ${he} ${r||""}`.trim(),style:de,children:[U.jsxs("div",{className:"avatarka-tabs",children:[U.jsx("button",{className:`avatarka-tab ${B==="editor"?"active":""}`,onClick:()=>J("editor"),children:"Editor"}),U.jsx("button",{className:`avatarka-tab ${B==="gallery"?"active":""}`,onClick:()=>J("gallery"),children:"Gallery"}),U.jsxs("div",{className:"avatarka-tabs-actions",children:[g&&U.jsx("button",{className:"avatarka-action-btn",onClick:g,title:"Save as SVG",children:"SVG"}),w&&U.jsx("button",{className:"avatarka-action-btn",onClick:w,title:"Save as PNG",children:"PNG"}),U.jsx("button",{className:`avatarka-dice-btn ${_?"spinning":""}`,onClick:()=>{z(!0),(B==="editor"?te:re)()},onAnimationEnd:()=>z(!1),title:"Randomize","aria-label":"Randomize",children:U.jsx(j5,{})})]})]}),B==="editor"?U.jsx("div",{className:"avatarka-editor",children:y==="compact"?U.jsxs(U.Fragment,{children:[U.jsx("div",{className:"avatarka-editor-left",children:U.jsx("div",{className:"avatarka-preview",dangerouslySetInnerHTML:{__html:we}})}),U.jsxs("div",{className:"avatarka-editor-right",children:[U.jsxs("div",{className:"avatarka-control-row",children:[U.jsx("select",{className:"avatarka-theme-dropdown",value:E,onChange:Y=>me(Y.target.value),children:x.map(Y=>U.jsx("option",{value:Y,children:Or(Y).name},Y))}),U.jsx("button",{className:`avatarka-lock-btn ${Z.has("theme")?"locked":""}`,onClick:()=>ie("theme"),title:Z.has("theme")?"Unlock":"Lock","aria-label":Z.has("theme")?"Unlock Theme":"Lock Theme",children:Z.has("theme")?U.jsx(Ys,{}):U.jsx(Gs,{})})]}),U.jsx("div",{className:"avatarka-controls-grid",children:K.map(([Y,se])=>le(Y,se))})]})]}):U.jsxs(U.Fragment,{children:[U.jsxs("div",{className:"avatarka-control-row",children:[U.jsx("select",{className:"avatarka-theme-dropdown",value:E,onChange:Y=>me(Y.target.value),children:x.map(Y=>U.jsx("option",{value:Y,children:Or(Y).name},Y))}),U.jsx("button",{className:`avatarka-lock-btn ${Z.has("theme")?"locked":""}`,onClick:()=>ie("theme"),title:Z.has("theme")?"Unlock":"Lock","aria-label":Z.has("theme")?"Unlock Theme":"Lock Theme",children:Z.has("theme")?U.jsx(Ys,{}):U.jsx(Gs,{})})]}),U.jsx("div",{className:"avatarka-preview",dangerouslySetInnerHTML:{__html:we}}),U.jsx("div",{className:"avatarka-controls-grid",children:K.map(([Y,se])=>le(Y,se))})]})}):U.jsx("div",{className:"avatarka-gallery",children:U.jsx("div",{className:"avatarka-gallery-grid",children:F.map((Y,se)=>U.jsx("div",{className:"avatarka-gallery-item",dangerouslySetInnerHTML:{__html:Y.svg},onClick:()=>R(Y),title:`${Or(Y.theme).name} - Click to edit`},se))})})]})}const Vf=tc(),Hf=Vf[Math.floor(Math.random()*Vf.length)],z5=["primaryColor","bodyColor","skinColor"];function B5(c){const r=parseInt(c.slice(1),16),l=(r>>16)/255,o=(r>>8&255)/255,i=(r&255)/255,f=Math.max(l,o,i),a=Math.min(l,o,i),u=(f+a)/2;if(f===a)return[0,0,u*100];const p=f-a,y=u>.5?p/(2-f-a):p/(f+a);let $=0;return f===l?$=((o-i)/p+(o<i?6:0))/6:f===o?$=((i-l)/p+2)/6:$=((l-o)/p+4)/6,[$*360,y*100,u*100]}function D5(c){const[r]=B5(c);return Yf((r+180)%360,55,82)}function O5(){const[c,r]=Ce.useState(()=>localStorage.getItem("avatarka-color-mode")||"system"),[l,o]=Ce.useState(()=>localStorage.getItem("avatarka-layout")||"default"),[i,f]=Ce.useState(()=>localStorage.getItem("avatarka-transparent-bg")==="true"),[a,u]=Ce.useState(Hf),[p,y]=Ce.useState(null),$=Ce.useCallback((k,x)=>{u(k),y(x)},[]),g=Ce.useCallback(()=>{if(!p)return null;const k=i?{...p,backgroundColor:"none"}:p;return xn(a,k)},[a,p,i]),w=Ce.useCallback(()=>{const k=g();if(!k)return;const x=new Blob([k],{type:"image/svg+xml"}),E=URL.createObjectURL(x),b=document.createElement("a");b.href=E,b.download=`avatar-${a}.svg`,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(E)},[g,a]),v=Ce.useCallback(async()=>{const k=g();if(!k)return;const x=await T5(k,{size:512}),E=URL.createObjectURL(x),b=document.createElement("a");b.href=E,b.download=`avatar-${a}.png`,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(E)},[g,a]);Ce.useEffect(()=>{const k=b=>{const P=document.documentElement;if(b==="system"){const N=window.matchMedia("(prefers-color-scheme: dark)").matches;P.setAttribute("data-theme",N?"dark":"light")}else P.setAttribute("data-theme",b)};k(c),localStorage.setItem("avatarka-color-mode",c);const x=window.matchMedia("(prefers-color-scheme: dark)"),E=()=>{c==="system"&&k("system")};return x.addEventListener("change",E),()=>x.removeEventListener("change",E)},[c]),Ce.useEffect(()=>{localStorage.setItem("avatarka-layout",l)},[l]),Ce.useEffect(()=>{localStorage.setItem("avatarka-transparent-bg",String(i))},[i]);const M=Ce.useCallback(()=>{if(!p)return null;if(!i)return xn(a,p);const k=z5.find(E=>typeof p[E]=="string"),x=k?D5(p[k]):"#e0e0e0";return xn(a,{...p,backgroundColor:x})},[a,p,i]);return Ce.useEffect(()=>{const k=M();if(!k)return;const x=`data:image/svg+xml,${encodeURIComponent(k)}`;let E=document.querySelector('link[rel="icon"]');E||(E=document.createElement("link"),E.rel="icon",document.head.appendChild(E)),E.type="image/svg+xml",E.href=x},[M]),U.jsxs("div",{className:"app",children:[U.jsx("header",{className:"header",children:U.jsxs("div",{className:"header-top",children:[U.jsxs("div",{className:"layout-switcher",children:[U.jsx("button",{className:`layout-btn ${l==="default"?"active":""}`,onClick:()=>o("default"),title:"Default Layout",children:U.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:U.jsx("path",{d:"M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z"})})}),U.jsx("button",{className:`layout-btn ${l==="compact"?"active":""}`,onClick:()=>o("compact"),title:"Compact Layout",children:U.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:U.jsx("path",{d:"M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"})})}),U.jsx("button",{className:`layout-btn ${i?"active":""}`,onClick:()=>f(k=>!k),title:"Transparent Background",children:U.jsxs("svg",{viewBox:"0 0 18 18",width:"18",height:"18",fill:"currentColor",children:[U.jsx("rect",{x:"1",y:"1",width:"4",height:"4"}),U.jsx("rect",{x:"9",y:"1",width:"4",height:"4"}),U.jsx("rect",{x:"5",y:"5",width:"4",height:"4"}),U.jsx("rect",{x:"13",y:"5",width:"4",height:"4"}),U.jsx("rect",{x:"1",y:"9",width:"4",height:"4"}),U.jsx("rect",{x:"9",y:"9",width:"4",height:"4"}),U.jsx("rect",{x:"5",y:"13",width:"4",height:"4"}),U.jsx("rect",{x:"13",y:"13",width:"4",height:"4"})]})})]}),U.jsx("div",{className:"header-title",children:U.jsx("h1",{children:"Avatarka"})}),U.jsxs("div",{className:"color-mode-switcher",children:[U.jsx("button",{className:`color-mode-btn ${c==="system"?"active":""}`,onClick:()=>r("system"),title:"System",children:U.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:U.jsx("path",{d:"M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z"})})}),U.jsx("button",{className:`color-mode-btn ${c==="light"?"active":""}`,onClick:()=>r("light"),title:"Light",children:U.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:U.jsx("path",{d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"})})}),U.jsx("button",{className:`color-mode-btn ${c==="dark"?"active":""}`,onClick:()=>r("dark"),title:"Dark",children:U.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor",children:U.jsx("path",{d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"})})})]})]})}),U.jsx("main",{className:"main-card",children:U.jsx(R5,{defaultTheme:Hf,layout:l,alwaysTransparentBackground:i,onParamsChange:$,onSaveSvg:w,onSavePng:v})}),U.jsxs("footer",{className:"footer-links",children:[U.jsxs("a",{href:"https://github.com/AndreyAkinshin/avatarka",target:"_blank",rel:"noopener noreferrer",children:[U.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:U.jsx("path",{d:"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"})}),"GitHub"]}),U.jsxs("a",{href:"https://www.npmjs.com/package/avatarka",target:"_blank",rel:"noopener noreferrer",children:[U.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:U.jsx("path",{d:"M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"})}),"avatarka"]}),U.jsxs("a",{href:"https://www.npmjs.com/package/avatarka-react",target:"_blank",rel:"noopener noreferrer",children:[U.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor",children:U.jsx("path",{d:"M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"})}),"avatarka-react"]})]})]})}tp.createRoot(document.getElementById("root")).render(U.jsx(Ce.StrictMode,{children:U.jsx(O5,{})}));
