(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{211:function(t,o,e){var content=e(225);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(16).default)("3000f491",content,!0,{sourceMap:!1})},224:function(t,o,e){"use strict";var n=e(211);e.n(n).a},225:function(t,o,e){(t.exports=e(15)(!1)).push([t.i,".removeButton{padding:5px 10px;border:1px solid #000}.todoInput{width:300px;margin:60px auto;border:1px solid #ddd}.done{text-decoration:line-through}",""])},252:function(t,o,e){"use strict";e.r(o);var n=e(14),r=e(70),d={computed:{todoList:function(){return this.$store.state.todos.list}},methods:Object(n.a)({removeTodo:function(t){this.$store.commit("todos/remove",t)},addTodo:function(t){this.$store.commit("todos/add",t.target.value),t.target.value=""}},Object(r.b)({toggle:"todos/toggle"}))},c=(e(224),e(2)),component=Object(c.a)(d,function(){var t=this,o=t.$createElement,e=t._self._c||o;return e("div",{staticClass:"contents"},[e("ul",t._l(t.todoList,function(o){return e("li",[e("input",{attrs:{type:"checkbox"},domProps:{checked:o.done},on:{change:function(e){return t.toggle(o)}}}),t._v(" "),e("span",{class:{done:o.done}},[t._v(t._s(o.text))]),t._v(" "),e("button",{staticClass:"removeButton",on:{click:function(e){return t.removeTodo(o)}}},[t._v("remove")])])}),0),t._v(" "),e("input",{staticClass:"todoInput",attrs:{placeholder:"What needs to be done?"},on:{keyup:function(o){return!o.type.indexOf("key")&&t._k(o.keyCode,"enter",13,o.key,"Enter")?null:t.addTodo(o)}}}),t._v(" "),e("nuxt-link",{staticClass:"c-button",attrs:{to:"/"}},[t._v("トップページ")])],1)},[],!1,null,null,null);o.default=component.exports}}]);