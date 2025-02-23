import{_ as C,r as d,k as w,c as u,a as t,b as p,w as m,l as y,v as x,m as E,F as L,d as D,e as N,o as c,f as v,t as n,u as _,h as V,y as A,j as M}from"./index-PDS2Q5JA.js";const $={class:"event-list-page"},B={class:"page-header"},F={class:"filter-section"},I={class:"filter-item"},S={class:"filter-item"},U={class:"event-table"},j=["onClick"],q=["onClick"],K={__name:"EventList",setup(R){const k=M(),l=d(""),r=d(""),a=d([{id:1,name:"view_product",description:"用户查看商品详情",type:"pv",properties:[{key:"product_id",type:"string",description:"商品ID"},{key:"category",type:"string",description:"商品分类"},{key:"price",type:"number",description:"商品价格"}],todayTriggers:12543,createdAt:"2024-01-10T08:30:00"},{id:2,name:"add_to_cart",description:"用户添加商品到购物车",type:"click",properties:[{key:"product_id",type:"string",description:"商品ID"},{key:"quantity",type:"number",description:"添加数量"}],todayTriggers:8976,createdAt:"2024-01-12T15:20:00"},{id:3,name:"start_checkout",description:"用户开始结算",type:"custom",properties:[{key:"total_amount",type:"number",description:"总金额"},{key:"item_count",type:"number",description:"商品数量"}],todayTriggers:5432,createdAt:"2024-01-14T11:45:00"}]),f=o=>({pv:"页面浏览",click:"点击事件",custom:"自定义事件"})[o]||o,b=w(()=>a.value.filter(o=>{const e=l.value?o.name.toLowerCase().includes(l.value.toLowerCase())||o.description.toLowerCase().includes(l.value.toLowerCase()):!0,i=r.value?o.type===r.value:!0;return e&&i})),g=o=>{k.push(`/track/edit/${o.id}`)},h=o=>{confirm("确定要删除这个事件吗？")&&(a.value=a.value.filter(e=>e.id!==o))};return(o,e)=>{const i=N("router-link");return c(),u("div",$,[t("div",B,[e[3]||(e[3]=t("h2",null,"事件列表",-1)),p(i,{to:"/track/create",class:"create-btn"},{default:m(()=>e[2]||(e[2]=[v(" 创建事件 ")])),_:1})]),t("div",F,[t("div",I,[y(t("input",{"onUpdate:modelValue":e[0]||(e[0]=s=>l.value=s),type:"text",placeholder:"搜索事件名称或描述",class:"search-input"},null,512),[[x,l.value]])]),t("div",S,[y(t("select",{"onUpdate:modelValue":e[1]||(e[1]=s=>r.value=s),class:"filter-select"},e[4]||(e[4]=[t("option",{value:""},"全部类型",-1),t("option",{value:"pv"},"页面浏览",-1),t("option",{value:"click"},"点击事件",-1),t("option",{value:"custom"},"自定义事件",-1)]),512),[[E,r.value]])])]),t("div",U,[t("table",null,[e[6]||(e[6]=t("thead",null,[t("tr",null,[t("th",null,"事件名称"),t("th",null,"事件描述"),t("th",null,"事件类型"),t("th",null,"属性数量"),t("th",null,"今日触发"),t("th",null,"创建时间"),t("th",null,"操作")])],-1)),t("tbody",null,[(c(!0),u(L,null,D(b.value,s=>(c(),u("tr",{key:s.id},[t("td",null,n(s.name),1),t("td",null,n(s.description),1),t("td",null,n(f(s.type)),1),t("td",null,n(s.properties.length),1),t("td",null,n(_(V)(s.todayTriggers)),1),t("td",null,n(_(A)(s.createdAt)),1),t("td",null,[p(i,{to:`/track/detail/${s.id}`,class:"action-btn view-btn"},{default:m(()=>e[5]||(e[5]=[v(" 查看 ")])),_:2},1032,["to"]),t("button",{class:"action-btn edit-btn",onClick:T=>g(s)}," 编辑 ",8,j),t("button",{class:"action-btn delete-btn",onClick:T=>h(s.id)}," 删除 ",8,q)])]))),128))])])])])}}},G=C(K,[["__scopeId","data-v-4d91e91f"]]);export{G as default};
