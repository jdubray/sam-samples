const localState = (prop) => {
  if (prop && typeof prop === 'object') {
    const todos = state()._todos
    const index = todos.indexOf(prop)
    return todos[index]
  }
  if (prop === 'todos') {
    return state('_todos')
  }
  return state(prop)
}

const todoComponent = Vue.component('todo-app', {
  data() {
    return localState()
  },
  methods: {
    destroy: deleteIntent,
    startEditing(todo) {
      // this.editingTodo = todo;
      // this.beforeText = todo.text;
    },
    finishEditing(todo) {
      // this.editingTodo = null;
    },
    cancelEditing(todo) {
      // this.editingTodo = null;
      // todo.text = this.beforeText;
    },
    complete: completeIntent,
    createTodo(event) {
      createTodoIntent(event)
      this.newTodo = null
    },
    clearCompleted: clearIntent
  },
  computed: {
    todos() {
        const out = localState('_todos').filter(todo => !todo.isDeleted);
        const foo = localState('exists')
        console.log(out)
        return out
    },
    status() {
      return this.$route.params.status;
    },
    filteredTodos () {
      switch (this.status) {
        case 'active':
          return localState('activeTodos');
        case 'completed':
          return localState('completedTodos');

        default:
          return localState('_todos').filter(todo => !todo.isDeleted);
      }
    }
  },
  watch: {
    todos: {
      deep: true,
      handler(newValue) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
      }
    }
  },
  template: `
    <div>
      <section class="todoapp">
        <header class="header">
          <h1>Todos</h1>
          <input class="new-todo" placeholder="What needs to be done?"
            v-model.trim="newTodo"
            @keyup.enter="createTodo($event)"
            autofocus>
        </header>

        <!-- This section should be hidden by default and shown when there are todos -->
        <section class="main">
          <ul class="todo-list">

            <li v-for="todo in filteredTodos"
                :class="{completed: todo.isDone, editing: todo === editingTodo}">

              <div class="view">
                <input class="toggle" type="checkbox" @click="complete(todo)" v-bind:checked="todo.isDone">
                <label @dblclick="startEditing(todo)">{{todo.text}}</label>
                <button class="destroy" @click="destroy(todo)"></button>
              </div>

              <input class="edit"
                @keyup.escape="cancelEditing(todo)"
                @keyup.enter="finishEditing(todo)"
                @blur="finishEditing(todo)"
                v-model.trim="todo.text">
            </li>

          </ul>
        </section>

        <!-- This footer should hidden by default and shown when there are todos -->
        <footer class="footer">
          <span class="todo-count">
            <strong>{{itemsLeft}}</strong> item(s) left</span>

          <!-- Remove this if you don't implement routing -->
          <ul class="filters">
            <li>
              <router-link to="/all" :class="{ selected: status === 'all' }">All</router-link>
            </li>
            <li>
              <router-link to="/active" :class="{ selected: status === 'active' }">Active</router-link>
            </li>
            <li>
              <router-link to="/completed" :class="{ selected: status === 'completed' }">Completed</router-link>
            </li>
          </ul>

          <!-- Hidden if no completed items are left ↓ -->
          <button class="clear-completed" @click="clearCompleted">Clear completed</button>
        </footer>
      </section>

      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Esc to cancel edit</p>
        <p>Enter to accept edit</p>
      </footer>
    </div>`,
});

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/:status', component: { template: `<todo-app></todo-app>`} },
    { path: '*', redirect: '/all' },
  ]
});

const app = new Vue({
  router
}).$mount('#app')