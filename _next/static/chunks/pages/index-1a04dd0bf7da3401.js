(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{3415:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return p}});t(7294);var r=t(5005),i=t(4105),s=t(9521),a=t(8209),c=t(5893);function o(e,n){var t="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=function(e,n){if(!e)return;if("string"===typeof e)return l(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return l(e,n)}(e))||n&&e&&"number"===typeof e.length){t&&(e=t);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,c=!1;return{s:function(){t=t.call(e)},n:function(){var e=t.next();return a=e.done,e},e:function(e){c=!0,s=e},f:function(){try{a||null==t.return||t.return()}finally{if(c)throw s}}}}function l(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}var d=s.ZP.div.withConfig({displayName:"excel__Box",componentId:"sc-t5a7kr-0"})(["display:flex;align-items:center;.file{position:relative;text-decoration:none;text-indent:0;line-height:20px;width:200px;height:40px;svg{margin-right:10px;}input{position:absolute;font-size:100px;right:0;top:0;opacity:0;width:200px;height:40px;}}"]),u=s.ZP.div.withConfig({displayName:"excel__Tips",componentId:"sc-t5a7kr-1"})(["margin-left:20px;opacity:0.6;"]);function p(e){return(0,c.jsxs)(d,{children:[(0,c.jsxs)(r.Z,{variant:"flat",className:"file",children:[(0,c.jsx)(a.Z,{}),(0,c.jsx)("span",{children:"Import Addresses"}),(0,c.jsx)("input",{type:"file",accept:".xlsx, .xls, .csv",onChange:function(n){var t=n.target.files,r=t[0].name,s=r.substr(r.lastIndexOf(".")+1,r.length),a=new FileReader;a.readAsBinaryString(t[0]),a.onload=function(n){try{var t=n.target.result,r=i.ij(t,{type:"binary"}),a=[];for(var c in r.Sheets)if(r.Sheets.hasOwnProperty(c)&&(/^xls/.test(s)&&(a=a.concat(i.P6.sheet_to_json(r.Sheets[c],{raw:!1}))),"csv"==s)){var l,d=i.P6.sheet_to_csv(r.Sheets[c]).split("\n"),u=[],p=o(d);try{for(p.s();!(l=p.n()).done;){var f=l.value.split(","),x={address:f[0],amount:f[1]};u.push(x)}}catch(h){p.e(h)}finally{p.f()}a=u}console.log("Upload file successful!"),e.getChildrenMsg(a)}catch(m){console.error("Unsupported file type!")}}}})]}),(0,c.jsx)(u,{children:"Supported file formats: .xlsx, .xls, .csv,"}),(0,c.jsx)("strong",{onClick:function(){e.getChildrenMsg([{address:"<\u5730\u5740>",amount:"<\u6570\u91cf>"},{address:"<addresss>",amount:"<amount>"},{address:"0x0000000000000000000000000000000000000000",amount:"1"}])},children:"Example"})]})}},4018:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return c}});var r=t(9521),i=t(682),s=t(5893),a=r.ZP.div.withConfig({displayName:"footerBox__Footer",componentId:"sc-n6udw2-0"})(["height:80px;margin-top:100px;.midBox{display:flex;justify-content:space-between;align-items:center;}img{width:40px;height:40px;}.lft{padding-left:10px;}"]);function c(){return(0,s.jsx)(a,{children:(0,s.jsx)(i.Z,{children:(0,s.jsxs)("div",{className:"midBox",children:[(0,s.jsx)("div",{className:"lft",children:"\xa9 2022 Web3camp.us"}),(0,s.jsx)("div",{children:(0,s.jsx)("a",{href:"https://github.com/Web3-Camp/multisender",target:"_blank",rel:"noreferrer",children:(0,s.jsx)("img",{src:"https://web3camp.us/assets/images/GitHub-Mark.png",alt:""})})})]})})})}},3305:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return l}});var r=t(9521),i=t(6968),s=t(4463),a=t(5893),c=r.ZP.div.withConfig({displayName:"loading__Box",componentId:"sc-7t6fot-0"})(["background:rgba(0,0,0,0.2);width:100vw;height:100vh;position:fixed;left:0;top:0;display:flex;justify-content:center;align-items:center;z-index:99999;"]),o=r.ZP.div.withConfig({displayName:"loading__LoadingInner",componentId:"sc-7t6fot-1"})(["width:400px;background:#fff;box-shadow:0 0 5px #ccc;border-radius:6px;padding:40px 0;display:flex;flex-direction:column;justify-content:center;align-items:center;.image{margin-bottom:20px;}"]);function l(){var e=(0,s.$)().state.tips;return(0,a.jsx)(c,{children:(0,a.jsxs)(o,{children:[(0,a.jsx)("div",{className:"image",children:(0,a.jsx)(i.Z,{animation:"border",variant:"flat"})}),(0,a.jsx)("div",{children:e})]})})}},472:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return N}});var r=t(29),i=t(7794),s=t.n(i),a=t(1608),c=t(1555),o=t(4119),l=t(1358),d=t(2824),u=t(5005),p=t(9521),f=t(7294),x=t(4463),h=t(3415),m=t(7922),g=t(6076),v=t(820),j=t(8864),y=t(5893),b=p.ZP.div.withConfig({displayName:"step1__Box",componentId:"sc-2clox2-0"})([".height50{height:200px;}.upload{svg{margin-right:10px;}}"]),w=p.ZP.div.withConfig({displayName:"step1__TipsBox",componentId:"sc-2clox2-1"})(["margin-bottom:20px;"]);function N(e){var n=(0,x.$)(),t=n.dispatch,i=n.state,p=i.account,N=i.web3Provider,_=(0,f.useState)("0x000000000000000000000000000000000000bEEF"),Z=_[0],k=_[1],C=(0,f.useState)(18),I=C[0],S=C[1],P=(0,f.useState)(""),E=P[0],A=P[1],B=(0,f.useState)(!0),T=B[0],O=B[1],F=(0,f.useState)(""),M=F[0],q=F[1],z=(0,f.useState)(null),U=z[0],$=z[1];(0,f.useEffect)((function(){O(!(p&&""!==p&&E&&Z))}),[p,E,Z,I]),(0,f.useEffect)((function(){if(null!=N){var e=function(){var e=(0,r.Z)(s().mark((function e(){var n,t,r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("0x000000000000000000000000000000000000bEEF"!==Z){e.next=2;break}return e.abrupt("return");case 2:return n=new g.CH(Z,v,N),e.prev=3,e.next=6,null===n||void 0===n?void 0:n.decimals();case 6:t=e.sent,S(t),q(""),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),q((null===(r=e.t0.data)||void 0===r?void 0:r.message)||e.t0.message);case 14:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(){return e.apply(this,arguments)}}();e()}}),[Z,N]),(0,f.useEffect)((function(){H()}),[]);var H=function(){var e=(0,r.Z)(s().mark((function e(){var n,t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.getNetwork();case 2:n=e.sent,t=n.chainId,j.filter((function(e){return e.chainId===t})).length?$(!0):(q("Unsupported network!!!!"),$(!1));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(e){var n=e.target,t=n.name,r=n.value;switch(t){case"token":k(r);break;case"amounts":A(r)}},D=function(){var n=(0,r.Z)(s().mark((function n(){var r;return s().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e.handleNext(2),r={amounts:E,tokenAddress:Z,decimals:I},t({type:m.U.STORE_FIRST,payload:r});case 3:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return(0,y.jsxs)(b,{children:[(0,y.jsxs)(a.Z,{children:[(0,y.jsx)(c.Z,{md:9,children:(0,y.jsx)(o.Z,{controlId:"Token",label:"Token",className:"mb-3",children:(0,y.jsx)(l.Z.Control,{type:"text",name:"token",placeholder:"Token",value:Z,onChange:function(e){return R(e)}})})}),(0,y.jsx)(c.Z,{md:3,children:(0,y.jsx)(o.Z,{controlId:"Decimals",label:"Decimals",className:"mb-3",children:(0,y.jsx)(l.Z.Control,{type:"text",name:"decimals",placeholder:"Decimals",value:I,readOnly:!0})})})]}),(0,y.jsx)("div",{className:"mb-3",children:(0,y.jsx)(h.default,{getChildrenMsg:function(e){console.log(e);var n="";e.map((function(e){n+="".concat(e.address,",").concat(e.amount," \n")})),A(n)}})}),(0,y.jsx)(a.Z,{children:(0,y.jsx)(c.Z,{md:12,children:(0,y.jsx)(o.Z,{controlId:"Addresses",label:"Addresses with Amounts",className:"mb-3",children:(0,y.jsx)(l.Z.Control,{placeholder:"Addresses with Amounts",as:"textarea",name:"amounts",className:"height50",value:E,onChange:function(e){return R(e)}})})})}),(0,y.jsx)(w,{children:!!M.length&&(0,y.jsx)(d.Z,{variant:"danger",children:M})}),(0,y.jsx)("div",{children:(0,y.jsx)(u.Z,{variant:"flat",onClick:function(){return D()},disabled:!U||T,children:"Next"})})]})}},6567:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return p}});var r=t(29),i=t(7794),s=t.n(i),a=t(9521),c=t(7294),o=t(4463),l=t(5995),d=t(5893),u=a.ZP.div.withConfig({displayName:"step3__Box",componentId:"sc-1rmeuts-0"})(["h5{padding:10px 0 5px;color:#000000;}.transaction{padding:20px 0 40px;}"]);function p(){var e=(0,o.$)().state,n=e.txHash,t=e.txHashList,i=e.web3Provider,a=(0,c.useState)(""),p=a[0],f=a[1];return(0,c.useEffect)((function(){var e=function(){var e=(0,r.Z)(s().mark((function e(){var n,t,r,a,c;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="",e.next=3,i.getNetwork();case 3:r=e.sent,a=r.chainId,c=l.filter((function(e){return e.id===a})),t=null===(n=c[0])||void 0===n?void 0:n.url,f(t);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),(0,d.jsx)(u,{children:(0,d.jsxs)("div",{children:[null!=n&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("h5",{children:"Approval history"}),(0,d.jsx)("ul",{className:"transaction",children:(0,d.jsx)("li",{children:(0,d.jsx)("a",{href:"".concat(p,"/").concat(n),target:"_blank",rel:"noopener noreferrer",children:n})})})]}),(0,d.jsx)("h5",{children:"Transactions history"}),(0,d.jsx)("ul",{className:"transaction",children:t&&t.map((function(e){return(0,d.jsx)("li",{children:(0,d.jsx)("a",{href:"".concat(p,"/").concat(e),target:"_blank",rel:"noopener noreferrer",children:e})},e)}))})]})})}},5006:function(e,n,t){"use strict";t.r(n);var r=t(682),i=t(7525),s=t(1608),a=t(1555),c=t(9521),o=t(5497),l=t(4018),d=t(1439),u=t(9629),p=t(4324),f=t(472),x=t(1836),h=t(6567),m=t(7294),g=t(3305),v=t(4463),j=t(5893),y=c.ZP.div.withConfig({displayName:"pages__MainBox",componentId:"sc-uua8fq-0"})(["display:flex;flex-grow:1;"]),b=c.ZP.main.withConfig({displayName:"pages__MainContent",componentId:"sc-uua8fq-1"})(["display:flex;flex-direction:column;min-height:100vh;"]),w=(0,c.ZP)(r.Z).withConfig({displayName:"pages__BgBox",componentId:"sc-uua8fq-2"})(["margin-top:30px;"]),N=(0,c.ZP)(i.Z).withConfig({displayName:"pages__CardBox",componentId:"sc-uua8fq-3"})(["border:0;box-shadow:0 0 5px #ccc;border-radius:6px;"]),_=c.ZP.div.withConfig({displayName:"pages__NavBox",componentId:"sc-uua8fq-4"})(["height:120px;margin:40px;.bg{border-bottom:1px solid #eee;height:40px;}.box{width:100%;display:flex;justify-content:space-between;height:80px;}li{background:#fff;padding:0 40px;.circle{width:80px;height:80px;border-radius:80px;box-shadow:0 0 5px #eee;background:#f8f8f8;display:flex;justify-content:center;align-items:center;color:#cccccc;font-size:16px;}.title{padding:20px 0 40px;font-size:14px;opacity:0.8;span{opacity:0.6;}}&.active{.circle{background:#fff;box-shadow:0 0 10px rgba(128,0,128,0.3);color:purple;}.title{padding:20px 0 40px;font-size:14px;opacity:1;color:purple;}}}"]);n.default=function(){var e=(0,m.useState)(1),n=e[0],t=e[1],r=(0,v.$)().state.tips,i=function(e){t(e)};return(0,j.jsx)(j.Fragment,{children:(0,j.jsxs)(b,{children:[(0,j.jsx)(o.default,{}),null!=r&&(0,j.jsx)(g.default,{}),(0,j.jsx)(y,{children:(0,j.jsx)(w,{children:(0,j.jsx)(s.Z,{children:(0,j.jsxs)(a.Z,{md:12,xs:12,children:[(0,j.jsx)(_,{children:(0,j.jsx)("div",{className:"bg",children:(0,j.jsxs)("ul",{className:"box",children:[(0,j.jsxs)("li",{className:1===n?"active":"",onClick:function(){return i(1)},children:[(0,j.jsx)("div",{className:"circle",children:(0,j.jsx)(d.Z,{})}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step1. "}),"Prepare"]})]}),(0,j.jsxs)("li",{className:2===n?"active":"",children:[(0,j.jsx)("div",{className:"circle",children:(0,j.jsx)(u.Z,{})}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step2."})," Confirm"]})]}),(0,j.jsxs)("li",{className:3===n?"active":"",children:[(0,j.jsxs)("div",{className:"circle",children:[" ",(0,j.jsx)(p.Z,{})]}),(0,j.jsxs)("div",{className:"title",children:[(0,j.jsx)("span",{children:"Step3."})," Result"]})]})]})})}),(0,j.jsxs)(N,{body:!0,children:[1===n&&(0,j.jsx)(f.default,{handleNext:i}),2===n&&(0,j.jsx)(x.default,{handleNext:i}),3===n&&(0,j.jsx)(h.default,{})]})]})})})}),(0,j.jsx)(l.default,{})]})})}},5301:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(5006)}])},67:function(){},2061:function(){}},function(e){e.O(0,[251,521,959,218,256,395,497,836,774,888,179],(function(){return n=5301,e(e.s=n);var n}));var n=e.O();_N_E=n}]);