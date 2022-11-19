"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[836],{1836:function(e,n,t){t.r(n),t.d(n,{default:function(){return H}});var a=t(29),s=t(7794),r=t.n(s),i=t(5147),l=t(1358),o=t(4499),u=t(5005),c=t(9521),p=t(7294),d=t(4463),m=t(2593),y=t(6076),h=t(5553),b=t(9485),x=t(6441),f=t(1046),v=t(820),g=JSON.parse('[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"ClaimedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"total","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"MultisendToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"arrayLimit","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address[]","name":"_targets","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"batchSendERC20","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable[]","name":"_targets","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"batchSendEther","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"claimBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'),k=JSON.parse('{"K":"0x71402BD4ccE356C41Bb3c5070a0E124E9989cbc0"}'),T=JSON.parse('{"K":"0xa6A8249A25287091bC3825f737EdEE9b76d262ed"}'),S=JSON.parse('{"K":"0x525E3137b1c19473aab0383042782b3031cfC747"}'),w=JSON.parse('{"K":"0xc5c13B7eA0eB0D9ceC345C16349a2b114517b66b"}'),j=t(7922),E=t(5995),N=t(5893),M=c.ZP.div.withConfig({displayName:"step2__Box",componentId:"sc-19bj6w4-0"})(["padding:40px 0;.numbers{font-size:20px;}.tips{font-size:12px;color:#999;}h5{padding:10px 0 5px 10px;color:#000000;}.ml2{margin-left:10px;}.flexNumber{word-break:break-all;}"]),A=c.ZP.div.withConfig({displayName:"step2__TableBox",componentId:"sc-19bj6w4-1"})(["margin-top:10px;height:470px;padding-bottom:20px;overflow-y:auto;.tableStyle{border-top:1px solid #eee;color:#666666;th{height:60px;line-height:60px;}.first{display:flex;justify-content:center;align-items:stretch;.form-check-inline{margin-right:0;display:flex;margin-top:13px;}}td{line-height:50px;word-break:break-all;&:nth-child(4){width:30%;}}tr:nth-child(2n+1) td{background:rgba(255,255,255,0.3)!important;color:#666666!important;}tr:hover td{background:rgba(0,0,0,0.01)!important;}}"]),I=c.ZP.h5.withConfig({displayName:"step2__H5Box",componentId:"sc-19bj6w4-2"})(["display:inline-block;margin-bottom:20px;"]),C=c.ZP.div.withConfig({displayName:"step2__TipsBox",componentId:"sc-19bj6w4-3"})(["margin-bottom:20px;"]),U={mainnet:k.K,bsc:S.K,polygon:T.K,bsctest:w.K};function H(e){var n=(0,d.$)(),t=n.state,s=n.dispatch,c=t.account,k=t.first,T=t.web3Provider,S=e.handleNext,w=(0,p.useState)("0"),H=w[0],O=w[1],_=(0,p.useState)("0"),P=_[0],Z=_[1],B=(0,p.useState)([]),R=(B[0],B[1],(0,p.useState)("0")),J=R[0],F=R[1],K=(0,p.useState)("0"),$=K[0],z=K[1],L=(0,p.useState)([]),W=L[0],X=L[1],D=(0,p.useState)([]),G=D[0],Y=D[1],Q=(0,p.useState)(200)[0],V=(0,p.useState)(""),q=V[0],ee=V[1],ne=(0,p.useState)(),te=ne[0],ae=ne[1],se=(0,p.useState)(""),re=se[0],ie=se[1],le=(0,p.useState)(""),oe=(le[0],le[1]),ue=(0,p.useState)("unlimited"),ce=ue[0],pe=ue[1],de=(0,p.useState)(!1),me=(de[0],de[1]),ye=(0,p.useState)(""),he=(ye[0],ye[1]),be=(0,p.useState)([]),xe=(be[0],be[1],(0,p.useState)("")),fe=(xe[0],xe[1]),ve=(0,p.useState)(!1),ge=ve[0],ke=ve[1],Te=(0,p.useState)(),Se=Te[0],we=Te[1],je=(0,p.useState)([]),Ee=je[0],Ne=je[1],Me=(0,p.useState)([]),Ae=Me[0],Ie=Me[1],Ce=(0,p.useState)(""),Ue=Ce[0],He=Ce[1];(0,p.useEffect)((function(){if(null!=k){var e=k.amounts,n=k.tokenAddress,t=(k.decimals,e.split("\n")),a=[];t.map((function(e){e&&a.push({address:e.split(",")[0],amount:parseFloat(e.split(",")[1])})}));X(a),Oe(),"0x000000000000000000000000000000000000bEEF"===n?Ze():Be()}}),[k]);var Oe=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,s,i,l,o,u,c,p,d,y,x;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:n=k.amounts,t=n.split("\n"),a=[],s=[],i=m.O$.from("0"),l="",o=0;case 9:if(!(o<t.length)){e.next=29;break}if(0!==(c=null===(u=t[o])||void 0===u?void 0:u.trim()).length){e.next=14;break}return console.log("skip empty line"),e.abrupt("continue",26);case 14:if(p=c.split(","),d=p[0].trim(),y=k.decimals,x=h.vz(p[1].trim(),y),parseFloat(p[1].trim()),b.UJ(d)){e.next=22;break}return console.log("Invalid address: ",d),e.abrupt("continue",26);case 22:a.push(d),s.push(x),i=i.add(m.O$.from(x)),l=h.bM(i,y);case 26:o++,e.next=9;break;case 29:O(l),Y(a),console.log("Total address : ".concat(a.length,", Total amount : ").concat(H));case 32:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),_e=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,s,i,l;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=null,e.next=3,T.getNetwork();case 3:if(a=e.sent,s=a.chainId,console.log("chainId",s),l=E.filter((function(e){return e.id===s})),t=null===(n=l[0])||void 0===n?void 0:n.url,1!==s){e.next=12;break}i=U.mainnet,e.next=26;break;case 12:if(137!==s){e.next=16;break}i=U.polygon,e.next=26;break;case 16:if(56!==s){e.next=20;break}i=U.bsc,e.next=26;break;case 20:if(97!==s){e.next=24;break}i=U.bsctest,e.next=26;break;case 24:return console.error("Unsupported network!!!!"),e.abrupt("return");case 26:ie(i),oe(t),console.log("sender address: ",i);case 29:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();(0,p.useEffect)((function(){te&&re&&Pe()}),[te,re]),(0,p.useEffect)((function(){_e()}),[]),(0,p.useEffect)((function(){null!=k&&(te||"0x000000000000000000000000000000000000bEEF"===k.tokenAddress)&&re&&Je()}),[k,te,re]);var Pe=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,s,i,l,o;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:if(te&&null!=c){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,te.allowance(c,re);case 6:return n=e.sent,console.log("My allowance: ",n.toString()),t=k.decimals,Z(h.bM(n,t)),e.next=12,te.symbol();case 12:return a=e.sent,console.log("Token symbol: ",a),ee(a),e.next=17,te.balanceOf(c);case 17:return s=e.sent,i=h.bM(s,t),console.log("My balance: ",i),F(i),l=T.getSigner(c),e.next=24,l.getBalance();case 24:o=e.sent,z(h.dF(o));case 26:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ze=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,i;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:return s({type:j.U.TIPS,payload:"Query balance in progress... "}),ae(null),Z("0"),ee("ETH"),n=k.decimals,t=T.getSigner(c),e.next=10,t.getBalance();case 10:a=e.sent,i=h.bM(a,n),F(i),z(i);case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Be=function(){var e=(0,a.Z)(r().mark((function e(){var n,t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:n=k.tokenAddress,t=new y.CH(n,v,T),s({type:j.U.TIPS,payload:"Query token contract... "}),console.log("Send ERC20 token, token address: ",n,t),ae(t);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Re=function(e){var n=e.target.value;pe(n)},Je=function(){var e=(0,a.Z)(r().mark((function e(){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:if("0x000000000000000000000000000000000000bEEF"!==k.tokenAddress){e.next=7;break}ze(),e.next=9;break;case 7:return e.next=9,Le();case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Fe=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,i,l,o,u,p;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k){e.next=2;break}return e.abrupt("return");case 2:n=new y.CH(re,g,T),t=T.getSigner(c),console.log("signer: ",t),console.log("multiSender: ",n),console.log("multiSender estimateGas",n.estimateGas),a=0,i=[],l=0;case 10:if(!(l<G.length)){e.next=22;break}return a++,o=Ee.slice(l,l+Q),u=Ae.slice(l,l+Q),p=u.reduce((function(e,n){return e.add(n)})),he("Sending Ether in progress... (".concat(a,"/").concat(Math.ceil(G.length/Q),")")),s({type:j.U.TIPS,payload:"Sending Ether in progress... (".concat(a,"/").concat(Math.ceil(G.length/Q),")")}),e.next=19,n.connect(t).batchSendEther(o,u,{from:c,value:x.$P(p)}).then((function(e){console.log("batchSendEther",e),i.push(e.hash||(null===e||void 0===e?void 0:e.transactionHash)),a>=Math.ceil(G.length/Q)&&(me(!1),s({type:j.U.TIPS,payload:null}),s({type:j.U.STORE_TXHASHLIST,payload:i}),S(3))})).catch((function(e){var n;console.error("batchSendEther error: ",e),He((null===(n=e.data)||void 0===n?void 0:n.message)||e.message),me(!1),s({type:j.U.TIPS,payload:null})}));case 19:l+=Q,e.next=10;break;case 22:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ke=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,i,l,o,u,p,d,m,h;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k&&null!=te){e.next=2;break}return e.abrupt("return");case 2:n=T.getSigner(c),k.amounts,t=k.tokenAddress,a=new y.CH(re,g,T),i=0,l=[],o=0;case 8:if(!(o<Ee.length)){e.next=34;break}return i++,u=Ee.slice(o,o+Q),p=Ae.slice(o,o+Q),he("Sending ERC20 token in progress... (".concat(i,"/").concat(Math.ceil(G.length/Q),")")),s({type:j.U.TIPS,payload:"Sending ERC20 token in progress... (".concat(i,"/").concat(Math.ceil(G.length/Q),")")}),e.prev=14,e.next=17,a.connect(n).batchSendERC20(t,u,p);case 17:return d=e.sent,e.next=20,d.wait();case 20:m=e.sent,console.log("batchSendERC20",m),l.push(m.hash||m.transactionHash),i>=Math.ceil(G.length/Q)&&(me(!1),s({type:j.U.TIPS,payload:null}),s({type:j.U.STORE_TXHASHLIST,payload:l}),S(3)),e.next=31;break;case 26:e.prev=26,e.t0=e.catch(14),me(!1),s({type:j.U.TIPS,payload:null}),He((null===(h=e.t0.data)||void 0===h?void 0:h.message)||e.t0.message);case 31:o+=Q,e.next=8;break;case 34:case"end":return e.stop()}}),e,null,[[14,26]])})));return function(){return e.apply(this,arguments)}}(),$e=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,i,l,o,u,p,d,m,b;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k&&null!=te){e.next=2;break}return e.abrupt("return");case 2:return n=T.getSigner(c),new y.CH(re,g,T),k.amounts,k.tokenAddress,t=k.decimals,e.next=7,te.allowance(c,re);case 7:if(a=e.sent,console.log("My allowance: ",a.toString()),!a.lt(Se)){e.next=67;break}if("unlimited"!==ce){e.next=39;break}return s({type:j.U.TIPS,payload:"Unlimited Approve in progress..."}),e.prev=12,e.next=15,te.connect(n).approve(re,f.Bz);case 15:return i=e.sent,he("Unlimited Approve in progress..."),e.next=19,i.wait();case 19:return l=e.sent,console.log("txHash",l),fe(l.hash||l.transactionHash),s({type:j.U.STORE_TXHASH,payload:l.hash||l.transactionHash}),s({type:j.U.TIPS,payload:null}),ke(!1),e.next=27,te.allowance(c,re);case 27:o=e.sent,Z(h.bM(o,t)),e.next=37;break;case 31:e.prev=31,e.t0=e.catch(12),console.error("approve error: ",e.t0),me(!1),s({type:j.U.TIPS,payload:null}),He((null===(u=e.t0.data)||void 0===u?void 0:u.message)||e.t0.message);case 37:e.next=65;break;case 39:return s({type:j.U.TIPS,payload:"Approve in progress..."}),e.prev=40,e.next=43,te.connect(n).approve(re,Se);case 43:return p=e.sent,he("Approve in progress..."),e.next=47,p.wait();case 47:return d=e.sent,console.log("txHash",d),fe(d.hash||d.transactionHash),s({type:j.U.STORE_TXHASH,payload:d.hash||d.transactionHash}),s({type:j.U.TIPS,payload:null}),ke(!1),e.next=55,te.allowance(c,re);case 55:m=e.sent,Z(h.bM(m,t)),e.next=65;break;case 59:e.prev=59,e.t1=e.catch(40),console.error("approve error: ",e.t1),He((null===(b=e.t1.data)||void 0===b?void 0:b.message)||e.t1.message),me(!1),s({type:j.U.TIPS,payload:null});case 65:e.next=68;break;case 67:console.log("Already have enough allowance!");case 68:case"end":return e.stop()}}),e,null,[[12,31],[40,59]])})));return function(){return e.apply(this,arguments)}}(),ze=function(){if(null!=k){var e=k.amounts,n=k.decimals;me(!0),he("Waiting..."),s({type:j.U.TIPS,payload:"Waiting..."});for(var t=e.split("\n"),a=[],r=[],i=m.O$.from("0"),l=0;l<t.length;l++){var o=t[l].trim();if(0!==o.length){var u=o.split(","),c=u[0].trim(),p=h.fi(u[1].trim());b.UJ(c)?(a.push(c),r.push(p),i=i.add(m.O$.from(p)),we(i),Ne(a),Ie(r)):console.log("Invalid address: ",c)}else console.log("skip empty line")}s({type:j.U.TIPS,payload:null}),console.log("total amount: ",i),console.log("total amount string: ",h.bM(i,n))}},Le=function(){var e=(0,a.Z)(r().mark((function e(){var n,t,a,i,l,o,u,p,d,x,f,v,S,w;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=k&&te){e.next=2;break}return e.abrupt("return");case 2:return me(!0),he("Waiting..."),s({type:j.U.TIPS,payload:"Waiting..."}),n=k.amounts,k.tokenAddress,t=new y.CH(re,g,T),a=T.getSigner(c),console.log("signer: ",a),console.log("multiSender: ",t),console.log(ce),e.next=13,te.decimals();case 13:i=e.sent,console.log("Decimals: ",i,n),l=n.split("\n"),o=[],u=[],p=m.O$.from("0"),d=0;case 20:if(!(d<l.length)){e.next=40;break}if(0!==(x=l[d].trim()).length){e.next=25;break}return console.log("skip empty line"),e.abrupt("continue",37);case 25:if(f=x.split(","),v=f[0].trim(),S=h.vz(f[1].trim(),i),b.UJ(v)){e.next=31;break}return console.log("Invalid address: ",v),e.abrupt("continue",37);case 31:o.push(v),u.push(S),p=p.add(m.O$.from(S)),we(p),Ne(o),Ie(u);case 37:d++,e.next=20;break;case 40:return s({type:j.U.TIPS,payload:null}),e.next=43,te.allowance(c,re);case 43:w=e.sent,console.log("My allowance: ",w.toString()),w.lt(p)?ke(!0):ke(!1);case 46:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,N.jsxs)(M,{children:[(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("h5",{children:"List of recipients"}),(0,N.jsx)(A,{children:(0,N.jsxs)(i.Z,{striped:!0,borderless:!0,hover:!0,className:"tableStyle",children:[(0,N.jsx)("thead",{children:(0,N.jsxs)("tr",{children:[(0,N.jsx)("th",{}),(0,N.jsx)("th",{children:"Address"}),(0,N.jsx)("th",{children:"Amount"})]})}),(0,N.jsx)("tbody",{children:W.map((function(e,n){return(0,N.jsxs)("tr",{children:[(0,N.jsx)("td",{children:n}),(0,N.jsx)("td",{children:e.address}),(0,N.jsx)("td",{children:e.amount})]},"".concat(e.address,"_").concat(n))}))})]})})]}),(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("h5",{children:"Summary"}),(0,N.jsx)(i.Z,{bordered:!0,children:(0,N.jsxs)("tbody",{children:[(0,N.jsxs)("tr",{children:[(0,N.jsxs)("td",{width:"50%",children:[(0,N.jsxs)("div",{className:"numbers",children:[H," ",q]}),(0,N.jsx)("div",{className:"tips",children:"Request approve amount"})]}),(0,N.jsxs)("td",{children:[(0,N.jsxs)("div",{className:"numbers flexNumber",children:[P," ",q]}),(0,N.jsx)("div",{className:"tips",children:"Your current allowance"})]})]}),(0,N.jsxs)("tr",{children:[(0,N.jsxs)("td",{width:"50%",children:[(0,N.jsx)("div",{className:"numbers",children:G.length}),(0,N.jsx)("div",{className:"tips",children:"Total number of addresses"})]}),(0,N.jsxs)("td",{children:[(0,N.jsxs)("div",{className:"numbers",children:[H," ",q]}),(0,N.jsx)("div",{className:"tips",children:"Total number of tokens to be sent"})]})]}),(0,N.jsxs)("tr",{children:[(0,N.jsxs)("td",{width:"50%",children:[(0,N.jsx)("div",{className:"numbers",children:Math.ceil(G.length/Q)}),(0,N.jsx)("div",{className:"tips",children:"Total number of transaction needed"})]}),(0,N.jsxs)("td",{children:[(0,N.jsxs)("div",{className:"numbers",children:[J," ",q]}),(0,N.jsx)("div",{className:"tips",children:"Your token balance"})]})]}),(0,N.jsxs)("tr",{children:[(0,N.jsxs)("td",{width:"50%",children:[(0,N.jsx)("div",{className:"numbers",children:"\xa0 "}),(0,N.jsx)("div",{className:"tips",children:"Approximate cost of operation"})]}),(0,N.jsxs)("td",{children:[(0,N.jsxs)("div",{className:"numbers",children:[$," ETH"]}),(0,N.jsx)("div",{className:"tips",children:"Your ETH balance"})]})]})]})})]}),ge&&(0,N.jsxs)("div",{className:"mb-4",children:[(0,N.jsx)(I,{children:"Amount to Approve"}),(0,N.jsxs)(l.Z.Group,{className:"ml2",children:[(0,N.jsx)("div",{className:"mb-2",children:(0,N.jsx)(l.Z.Check,{type:"radio",inline:!0,label:"Extra amount to sent",name:"approveAmount",onChange:Re,checked:"extra"===ce,value:"extra"})}),(0,N.jsx)("div",{children:(0,N.jsx)(l.Z.Check,{inline:!0,type:"radio",label:"Unlimited amount",name:"approveAmount",value:"unlimited",checked:"unlimited"===ce,onChange:Re})})]})]}),(0,N.jsx)(C,{children:!!Ue.length&&(0,N.jsx)(o.Z,{variant:"danger",children:Ue})}),ge&&(0,N.jsx)("div",{className:"ml2",children:(0,N.jsx)(u.Z,{variant:"flat",onClick:$e,children:"Approve"})}),!ge&&(0,N.jsx)("div",{className:"ml2",children:(0,N.jsx)(u.Z,{variant:"flat",onClick:function(){null!=k&&("0x000000000000000000000000000000000000bEEF"===k.tokenAddress?Fe():Ke())},children:"Send"})})]})}},820:function(e){e.exports=JSON.parse('[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]')},5995:function(e){e.exports=JSON.parse('[{"id":1,"url":"https://etherscan.io/tx/"},{"id":42,"url":"https://kovan.etherscan.io/tx/"},{"id":56,"url":"https://bscscan.com/tx/"},{"id":97,"url":"https://testnet.bscscan.com/tx/"},{"id":128,"url":"https://hecoinfo.com/tx/"},{"id":137,"url":"https://polygonscan.com/tx/"},{"id":256,"url":"https://testnet.hecoinfo.com/tx/"}]')}}]);