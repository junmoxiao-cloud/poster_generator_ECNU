"use strict";(()=>{var e={};e.id=429,e.ids=[429],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4672:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>l,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m});var r={};o.r(r),o.d(r,{POST:()=>i});var s=o(9303),a=o(8716),n=o(670),p=o(7070);async function i(e){try{let t;let{prompt:o}=await e.json(),r=process.env.DEEPSEEK_API_KEY||process.env.OPENAI_API_KEY;if(!r)return p.NextResponse.json({error:"未配置 API Key"},{status:500});let s=await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({model:"deepseek-chat",messages:[{role:"system",content:`你是一个校园活动宣发专家，负责为社团活动生成多平台推广文案。
请根据活动信息，生成以下三种文案（直接返回JSON，不要有任何其他内容）：
1. moments: 朋友圈文案 - 简洁有力，1-2个emoji，50字以内
2. xiaohongshu: 小红书文案 - 活泼有趣，分段清晰，带话题标签，150字以内  
3. summary: 一句话总结 - 提炼核心信息，60字以内

返回格式：
{
  "moments": "文案内容",
  "xiaohongshu": "文案内容",
  "summary": "文案内容"
}`},{role:"user",content:o}],temperature:.7,max_tokens:500})});if(!s.ok)throw Error("模型 API 调用失败");let a=await s.json(),n=a.choices?.[0]?.message?.content;try{t=JSON.parse(n)}catch{let e=n.match(/\{[\s\S]*\}/);if(e)t=JSON.parse(e[0]);else throw Error("无法解析模型返回内容")}return p.NextResponse.json({copies:t})}catch(e){return console.error("模型调用错误:",e),p.NextResponse.json({error:"模型调用失败"},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/copy-model/route",pathname:"/api/copy-model",filename:"route",bundlePath:"app/api/copy-model/route"},resolvedPagePath:"C:\\Users\\dou12\\Desktop\\乔钰成\\华东师范大学\\大一\\programming\\trae\\app\\api\\copy-model\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:m,serverHooks:d}=u,l="/api/copy-model/route";function h(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[948,972],()=>o(4672));module.exports=r})();