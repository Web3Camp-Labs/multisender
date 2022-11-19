(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[351],{3415:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return p}});n(7294);var a=n(5005),r=n(4105),s=n(9521),i=n(8209),o=n(5893),l=s.ZP.div.withConfig({displayName:"excel__Box",componentId:"sc-t5a7kr-0"})(["display:flex;align-items:center;.file{position:relative;text-decoration:none;text-indent:0;line-height:20px;width:200px;height:40px;svg{margin-right:10px;}input{position:absolute;font-size:100px;right:0;top:0;opacity:0;width:200px;height:40px;}}"]),u=s.ZP.div.withConfig({displayName:"excel__Tips",componentId:"sc-t5a7kr-1"})(["margin-left:20px;opacity:0.6;a{color:#000;font-weight:bolder;}"]);function p(e){return(0,o.jsxs)(l,{children:[(0,o.jsxs)(a.Z,{variant:"flat",className:"file",children:[(0,o.jsx)(i.Z,{}),(0,o.jsx)("span",{children:"Import Addresses"}),(0,o.jsx)("input",{type:"file",accept:".xlsx, .xls, .csv",onChange:function(t){var n=t.target.files,a=new FileReader;a.onload=function(t){try{var n=t.target.result,a=r.ij(n,{type:"binary"}),s=[];for(var i in a.Sheets)a.Sheets.hasOwnProperty(i)&&(s=s.concat(r.P6.sheet_to_json(a.Sheets[i],{raw:!1})));console.log("Upload file successful!"),e.getChildrenMsg(s)}catch(o){console.error("Unsupported file type!")}},a.readAsBinaryString(n[0])}})]}),(0,o.jsxs)(u,{children:["Supported file formats: .xlsx, .xls, .csv, ",(0,o.jsx)("a",{href:"/multisender/Book1.csv",target:"_blank",children:"Example"})]})]})}},472:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return T}});var a=n(29),r=n(7794),s=n.n(r),i=n(1608),o=n(1555),l=n(4119),u=n(1358),p=n(4499),c=n(5005),d=n(9521),y=n(7294),m=n(4463),f=n(3415),h=n(7922),x=n(6076),v=n(820),b=n(5893),g=d.ZP.div.withConfig({displayName:"step1__Box",componentId:"sc-2clox2-0"})([".height50{height:200px;}.upload{svg{margin-right:10px;}}"]),w=d.ZP.div.withConfig({displayName:"step1__TipsBox",componentId:"sc-2clox2-1"})(["margin-bottom:20px;"]);function T(e){var t=(0,m.$)(),n=t.dispatch,r=t.state,d=r.account,T=r.web3Provider,j=(0,y.useState)("0x000000000000000000000000000000000000bEEF"),_=j[0],Z=j[1],k=(0,y.useState)(18),N=k[0],E=k[1],O=(0,y.useState)(""),C=O[0],M=O[1],S=(0,y.useState)(!0),A=S[0],P=S[1],I=(0,y.useState)(""),z=I[0],R=I[1];(0,y.useEffect)((function(){P(!(d&&""!==d&&C&&_))}),[d,C,_,N]),(0,y.useEffect)((function(){if(null!=T){var e=function(){var e=(0,a.Z)(s().mark((function e(){var t,n,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("0x000000000000000000000000000000000000bEEF"!==_){e.next=2;break}return e.abrupt("return");case 2:return t=new x.CH(_,v,T),e.prev=3,e.next=6,null===t||void 0===t?void 0:t.decimals();case 6:n=e.sent,E(n),R(""),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),R((null===(a=e.t0.data)||void 0===a?void 0:a.message)||e.t0.message);case 14:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(){return e.apply(this,arguments)}}();e()}}),[_,T]);var B=function(e){var t=e.target,n=t.name,a=t.value;switch(n){case"token":Z(a);break;case"amounts":M(a)}},$=function(){var t=(0,a.Z)(s().mark((function t(){var a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.handleNext(2),a={amounts:C,tokenAddress:_,decimals:N},n({type:h.U.STORE_FIRST,payload:a});case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,b.jsxs)(g,{children:[(0,b.jsxs)(i.Z,{children:[(0,b.jsx)(o.Z,{md:9,children:(0,b.jsx)(l.Z,{controlId:"Token",label:"Token",className:"mb-3",children:(0,b.jsx)(u.Z.Control,{type:"text",name:"token",placeholder:"Token",value:_,onChange:function(e){return B(e)}})})}),(0,b.jsx)(o.Z,{md:3,children:(0,b.jsx)(l.Z,{controlId:"Decimals",label:"Decimals",className:"mb-3",children:(0,b.jsx)(u.Z.Control,{type:"text",name:"decimals",placeholder:"Decimals",value:N,readOnly:!0})})})]}),(0,b.jsx)("div",{className:"mb-3",children:(0,b.jsx)(f.default,{getChildrenMsg:function(e){console.log(e);var t="";e.map((function(e){t+="".concat(e.address,",").concat(e.amount," \n")})),M(t)}})}),(0,b.jsx)(i.Z,{children:(0,b.jsx)(o.Z,{md:12,children:(0,b.jsx)(l.Z,{controlId:"Addresses",label:"Addresses with Amounts",className:"mb-3",children:(0,b.jsx)(u.Z.Control,{placeholder:"Addresses with Amounts",as:"textarea",name:"amounts",className:"height50",value:C,onChange:function(e){return B(e)}})})})}),(0,b.jsx)(w,{children:!!z.length&&(0,b.jsx)(p.Z,{variant:"danger",children:z})}),(0,b.jsx)("div",{children:(0,b.jsx)(c.Z,{variant:"flat",onClick:function(){return $()},disabled:A,children:"Next"})})]})}},213:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/components/step1",function(){return n(472)}])},8209:function(e,t,n){"use strict";var a=n(7294),r=n(5697),s=n.n(r),i=["color","size","title"];function o(){return o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o.apply(this,arguments)}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=(0,a.forwardRef)((function(e,t){var n=e.color,r=e.size,s=e.title,u=l(e,i);return a.createElement("svg",o({ref:t,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:r,height:r,fill:n},u),s?a.createElement("title",null,s):null,a.createElement("path",{fillRule:"evenodd",d:"M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"}),a.createElement("path",{fillRule:"evenodd",d:"M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"}))}));u.propTypes={color:s().string,size:s().oneOfType([s().string,s().number]),title:s().string},u.defaultProps={color:"currentColor",size:"1em",title:null},t.Z=u},1608:function(e,t,n){"use strict";var a=n(4184),r=n.n(a),s=n(7294),i=n(6792),o=n(5893);const l=s.forwardRef((({bsPrefix:e,className:t,as:n="div",...a},s)=>{const l=(0,i.vE)(e,"row"),u=(0,i.pi)(),p=(0,i.zG)(),c=`${l}-cols`,d=[];return u.forEach((e=>{const t=a[e];let n;delete a[e],null!=t&&"object"===typeof t?({cols:n}=t):n=t;const r=e!==p?`-${e}`:"";null!=n&&d.push(`${c}${r}-${n}`)})),(0,o.jsx)(n,{ref:s,...a,className:r()(t,l,...d)})}));l.displayName="Row",t.Z=l},67:function(){},2061:function(){},820:function(e){"use strict";e.exports=JSON.parse('[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]')}},function(e){e.O(0,[251,521,777,774,888,179],(function(){return t=213,e(e.s=t);var t}));var t=e.O();_N_E=t}]);