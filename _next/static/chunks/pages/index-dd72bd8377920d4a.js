(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{3415:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return f}});t(7294);var r=t(5005),i=t(4105),a=t(9521),s=t(8209),o=t(5893);function c(e,n){var t="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=function(e,n){if(!e)return;if("string"===typeof e)return l(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return l(e,n)}(e))||n&&e&&"number"===typeof e.length){t&&(e=t);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return{s:function(){t=t.call(e)},n:function(){var e=t.next();return s=e.done,e},e:function(e){o=!0,a=e},f:function(){try{s||null==t.return||t.return()}finally{if(o)throw a}}}}function l(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}var d=a.ZP.div.withConfig({displayName:"excel__Box",componentId:"sc-t5a7kr-0"})(["display:flex;align-items:center;.file{position:relative;text-decoration:none;text-indent:0;line-height:20px;width:200px;height:40px;svg{margin-right:10px;}input{position:absolute;font-size:100px;right:0;top:0;opacity:0;width:200px;height:40px;}}"]),u=a.ZP.div.withConfig({displayName:"excel__Tips",componentId:"sc-t5a7kr-1"})(["margin-left:20px;opacity:0.6;"]);function f(e){return(0,o.jsxs)(d,{children:[(0,o.jsxs)(r.Z,{variant:"flat",className:"file",children:[(0,o.jsx)(s.Z,{}),(0,o.jsx)("span",{children:"Import Addresses"}),(0,o.jsx)("input",{type:"file",accept:".xlsx, .xls, .csv",onChange:function(n){var t=n.target.files,r=new FileReader;r.readAsBinaryString(t[0]),r.onload=function(n){try{var t=n.target.result,r=i.ij(t,{type:"binary"}),a=[];for(var s in r.Sheets)if(r.Sheets.hasOwnProperty(s)){var o,l=i.P6.sheet_to_csv(r.Sheets[s],{blankrows:!1}).split("\n"),d=[],u=c(l);try{for(u.s();!(o=u.n()).done;){var f=o.value.split(","),p=f[0],h=f[1];d.push([p,h])}}catch(x){u.e(x)}finally{u.f()}a=d}console.log("Upload file successful!"),e.getChildrenMsg(a)}catch(m){console.error("Unsupported file type!")}}}})]}),(0,o.jsx)(u,{children:"Supported file formats: .xlsx, .xls, .csv,"}),(0,o.jsx)("strong",{onClick:function(){e.getChildrenMsg([{address:"<addresss>",amount:"<amount>"},{address:"0x0000000000000000000000000000000000000000",amount:"1"},{address:"0x0000000000000000000000000000000000000001",amount:"2"}])},children:"Example"})]})}},4018:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return o}});var r=t(9521),i=t(682),a=t(5893),s=r.ZP.div.withConfig({displayName:"footerBox__Footer",componentId:"sc-n6udw2-0"})(["height:80px;margin-top:100px;.midBox{display:flex;justify-content:space-between;align-items:center;}img{width:40px;height:40px;}.lft{padding-left:10px;}"]);function o(){return(0,a.jsx)(s,{children:(0,a.jsx)(i.Z,{children:(0,a.jsxs)("div",{className:"midBox",children:[(0,a.jsx)("div",{className:"lft",children:"\xa9 2022 Web3camp.us"}),(0,a.jsx)("div",{children:(0,a.jsx)("a",{href:"https://github.com/Web3-Camp/multisender",target:"_blank",rel:"noreferrer",children:(0,a.jsx)("img",{src:"https://web3camp.us/assets/images/GitHub-Mark.png",alt:""})})})]})})})}},3305:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return l}});var r=t(9521),i=t(6968),a=t(4463),s=t(5893),o=r.ZP.div.withConfig({displayName:"loading__Box",componentId:"sc-7t6fot-0"})(["background:rgba(0,0,0,0.2);width:100vw;height:100vh;position:fixed;left:0;top:0;display:flex;justify-content:center;align-items:center;z-index:99999;"]),c=r.ZP.div.withConfig({displayName:"loading__LoadingInner",componentId:"sc-7t6fot-1"})(["width:400px;background:#fff;box-shadow:0 0 5px #ccc;border-radius:6px;padding:40px 0;display:flex;flex-direction:column;justify-content:center;align-items:center;.image{margin-bottom:20px;}"]);function l(){var e=(0,a.$)().state.tips;return(0,s.jsx)(o,{children:(0,s.jsxs)(c,{children:[(0,s.jsx)("div",{className:"image",children:(0,s.jsx)(i.Z,{animation:"border",variant:"flat"})}),(0,s.jsx)("div",{children:e})]})})}},472:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return k}});var r=t(29),i=t(7794),a=t.n(i),s=t(1608),o=t(1555),c=t(4119),l=t(1358),d=t(2824),u=t(5005),f=t(9521),p=t(7294),h=t(4463),x=t(3415),m=t(7922),g=t(6076),v=t(9485),j=t(820),y=t(8864),b=t(5893);function w(e,n){var t="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=function(e,n){if(!e)return;if("string"===typeof e)return N(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return N(e,n)}(e))||n&&e&&"number"===typeof e.length){t&&(e=t);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return{s:function(){t=t.call(e)},n:function(){var e=t.next();return s=e.done,e},e:function(e){o=!0,a=e},f:function(){try{s||null==t.return||t.return()}finally{if(o)throw a}}}}function N(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}var _=f.ZP.div.withConfig({displayName:"step1__Box",componentId:"sc-2clox2-0"})(['.height50{height:200px;}.upload{svg{margin-right:10px;}}label[for="Addresses"]{background:#fff;height:33px;width:99%;line-height:4px;margin:7.5px 0 0 1px;opacity:1!important;color:#aaa;}']),Z=f.ZP.div.withConfig({displayName:"step1__TipsBox",componentId:"sc-2clox2-1"})(["margin-bottom:20px;"]);function k(e){var n=(0,h.$)(),t=n.dispatch,i=n.state,f=i.account,N=i.web3Provider,k=(0,p.useState)("0x000000000000000000000000000000000000bEEF"),C=k[0],I=k[1],S=(0,p.useState)(18),A=S[0],P=S[1],E=(0,p.useState)(""),B=E[0],T=E[1],O=(0,p.useState)(!0),F=O[0],M=O[1],U=(0,p.useState)(""),R=U[0],$=U[1],q=(0,p.useState)(null),z=q[0],H=q[1];(0,p.useEffect)((function(){M(!(f&&""!==f&&B&&C))}),[f,B,C,A]),(0,p.useEffect)((function(){if(null!=N){var e=function(){var e=(0,r.Z)(a().mark((function e(){var n,t,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("0x000000000000000000000000000000000000bEEF"!==C){e.next=2;break}return e.abrupt("return");case 2:return n=new g.CH(C,j,N),e.prev=3,e.next=6,null===n||void 0===n?void 0:n.decimals();case 6:t=e.sent,P(t),$(""),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),$((null===(r=e.t0.data)||void 0===r?void 0:r.message)||e.t0.message);case 14:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(){return e.apply(this,arguments)}}();e()}}),[C,N]),(0,p.useEffect)((function(){D()}),[]);var D=function(){var e=(0,r.Z)(a().mark((function e(){var n,t;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.getNetwork();case 2:n=e.sent,t=n.chainId,y.filter((function(e){return e.chainId===t})).length?H(!0):($("Unsupported network!!!!"),H(!1));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(e){var n=e.target,t=n.name,r=n.value;switch(t){case"token":I(r);break;case"amounts":T(r)}},W=function(){var n=(0,r.Z)(a().mark((function n(){var r,i,s,o;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:r=B.split("\n"),i=[],s="",r.map((function(e){var n=e.split(",")[0],t=e.split(",")[1];i.push({address:n,amount:t});var r=v.UJ(n);console.log(isNaN(parseFloat(t))),r&&!isNaN(parseFloat(t))&&(s+="".concat(n,",").concat(parseFloat(t)," \n"))})),t({type:m.U.STORE_IMPORT,payload:i}),e.handleNext(2),o={amounts:s,tokenAddress:C,decimals:A},t({type:m.U.STORE_FIRST,payload:o});case 8:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return(0,b.jsxs)(_,{children:[(0,b.jsxs)(s.Z,{children:[(0,b.jsx)(o.Z,{md:9,children:(0,b.jsx)(c.Z,{controlId:"Token",label:"Token",className:"mb-3",children:(0,b.jsx)(l.Z.Control,{type:"text",name:"token",placeholder:"Token",value:C,onChange:function(e){return L(e)}})})}),(0,b.jsx)(o.Z,{md:3,children:(0,b.jsx)(c.Z,{controlId:"Decimals",label:"Decimals",className:"mb-3",children:(0,b.jsx)(l.Z.Control,{type:"text",name:"decimals",placeholder:"Decimals",value:A,readOnly:!0})})})]}),(0,b.jsx)("div",{className:"mb-3",children:(0,b.jsx)(x.default,{getChildrenMsg:function(e){var n,t="",r=w(e);try{for(r.s();!(n=r.n()).done;){t+=n.value.join(","),t+="\n"}}catch(i){r.e(i)}finally{r.f()}T(t)}})}),(0,b.jsx)(s.Z,{children:(0,b.jsx)(o.Z,{md:12,children:(0,b.jsx)(c.Z,{controlId:"Addresses",label:"Addresses with Amounts",className:"mb-3 addressLabel",children:(0,b.jsx)(l.Z.Control,{placeholder:"Addresses with Amounts",as:"textarea",name:"amounts",className:"height50",value:B,onChange:function(e){return L(e)}})})})}),(0,b.jsx)(Z,{children:!!R.length&&(0,b.jsx)(d.Z,{variant:"danger",children:R})}),(0,b.jsx)("div",{children:(0,b.jsx)(u.Z,{variant:"flat",onClick:function(){return W()},disabled:!z||F,children:"Next"})})]})}},6567:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return f}});var r=t(29),i=t(7794),a=t.n(i),s=t(9521),o=t(7294),c=t(4463),l=t(5995),d=t(5893),u=s.ZP.div.withConfig({displayName:"step3__Box",componentId:"sc-1rmeuts-0"})(["h5{padding:10px 0 5px;color:#000000;}.transaction{padding:20px 0 40px;}"]);function f(){var e=(0,c.$)().state,n=e.txHash,t=e.txHashList,i=e.web3Provider,s=(0,o.useState)(""),f=s[0],p=s[1];return(0,o.useEffect)((function(){var e=function(){var e=(0,r.Z)(a().mark((function e(){var n,t,r,s,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="",e.next=3,i.getNetwork();case 3:r=e.sent,s=r.chainId,o=l.filter((function(e){return e.id===s})),t=null===(n=o[0])||void 0===n?void 0:n.url,p(t);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),(0,d.jsx)(u,{children:(0,d.jsxs)("div",{children:[null!=n&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("h5",{children:"Approval history"}),(0,d.jsx)("ul",{className:"transaction",children:(0,d.jsx)("li",{children:(0,d.jsx)("a",{href:"".concat(f,"/").concat(n),target:"_blank",rel:"noopener noreferrer",children:n})})})]}),(0,d.jsx)("h5",{children:"Transactions history"}),(0,d.jsx)("ul",{className:"transaction",children:t&&t.map((function(e){return(0,d.jsx)("li",{children:(0,d.jsx)("a",{href:"".concat(f,"/").concat(e),target:"_blank",rel:"noopener noreferrer",children:e})},e)}))})]})})}},5006:function(e,n,t){"use strict";t.r(n);var r=t(682),i=t(7525),a=t(1608),s=t(1555),o=t(9521),c=t(5497),l=t(4018),d=t(1439),u=t(9629),f=t(4324),p=t(472),h=t(1836),x=t(6567),m=t(7294),g=t(3305),v=t(4463),j=t(5893),y=o.ZP.div.withConfig({displayName:"pages__MainBox",componentId:"sc-uua8fq-0"})(["display:flex;flex-grow:1;"]),b=o.ZP.main.withConfig({displayName:"pages__MainContent",componentId:"sc-uua8fq-1"})(["display:flex;flex-direction:column;min-height:100vh;"]),w=(0,o.ZP)(r.Z).withConfig({displayName:"pages__BgBox",componentId:"sc-uua8fq-2"})(["margin-top:30px;"]),N=(0,o.ZP)(i.Z).withConfig({displayName:"pages__CardBox",componentId:"sc-uua8fq-3"})(["border:0;box-shadow:0 0 5px #ccc;border-radius:6px;"]),_=o.ZP.div.withConfig({displayName:"pages__NavBox",componentId:"sc-uua8fq-4"})(["height:120px;margin:40px;.bg{border-bottom:1px solid #eee;height:40px;}.box{width:100%;display:flex;justify-content:space-between;height:80px;}li{background:#fff;padding:0 40px;.circle{width:80px;height:80px;border-radius:80px;box-shadow:0 0 5px #eee;background:#f8f8f8;display:flex;justify-content:center;align-items:center;color:#cccccc;font-size:16px;}.title{padding:20px 0 40px;font-size:14px;opacity:0.8;span{opacity:0.6;}}&.active{.circle{background:#fff;box-shadow:0 0 10px rgba(128,0,128,0.3);color:purple;}.title{padding:20px 0 40px;font-size:14px;opacity:1;color:purple;}}}"]);n.default=function(){var e=(0,m.useState)(1),n=e[0],t=e[1],r=(0,v.$)().state.tips,i=function(e){t(e)};return(0,j.jsx)(j.Fragment,{children:(0,j.jsxs)(b,{children:[(0,j.jsx)(c.default,{}),null!=r&&(0,j.jsx)(g.default,{}),(0,j.jsx)(y,{children:(0,j.jsx)(w,{children:(0,j.jsx)(a.Z,{children:(0,j.jsxs)(s.Z,{md:12,xs:12,children:[(0,j.jsx)(_,{children:(0,j.jsx)("div",{className:"bg",children:(0,j.jsxs)("ul",{className:"box",children:[(0,j.jsxs)("li",{className:1===n?"active":"",onClick:function(){return i(1)},children:[(0,j.jsx)("div",{className:"circle",children:(0,j.jsx)(d.Z,{})}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step1. "}),"Prepare"]})]}),(0,j.jsxs)("li",{className:2===n?"active":"",children:[(0,j.jsx)("div",{className:"circle",children:(0,j.jsx)(u.Z,{})}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step2."})," Confirm"]})]}),(0,j.jsxs)("li",{className:3===n?"active":"",children:[(0,j.jsxs)("div",{className:"circle",children:[" ",(0,j.jsx)(f.Z,{})]}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step3."})," Result"]})]})]})})}),(0,j.jsxs)(N,{body:!0,children:[1===n&&(0,j.jsx)(p.default,{handleNext:i}),2===n&&(0,j.jsx)(h.default,{handleNext:i}),3===n&&(0,j.jsx)(x.default,{})]})]})})})}),(0,j.jsx)(l.default,{})]})})}},5301:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(5006)}])},67:function(){},2061:function(){}},function(e){e.O(0,[251,521,959,218,256,395,497,836,774,888,179],(function(){return n=5301,e(e.s=n);var n}));var n=e.O();_N_E=n}]);