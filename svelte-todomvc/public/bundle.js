(function () {
	'use strict';

	function noop() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function element(name) {
		return document.createElement(name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function empty() {
		return text('');
	}

	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
	}

	function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
		let o = old_blocks.length;
		let n = list.length;

		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;

		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();

		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);

			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else if (dynamic) {
				block.p(changed, child_ctx);
			}

			new_lookup.set(key, new_blocks[i] = block);

			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}

		const will_move = new Set();
		const did_move = new Set();

		function insert(block) {
			if (block.i) block.i(1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}

		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;

			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			}

			else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			}

			else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			}

			else if (did_move.has(old_key)) {
				o--;

			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);

			} else {
				will_move.add(old_key);
				o--;
			}
		}

		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}

		while (n) insert(new_blocks[n - 1]);

		return new_blocks;
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = blank_object();
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	// Model
	const model = {
	    _acceptors: [],
	    present(proposal) {
	        // acceptors

	        model._acceptors.forEach(a => a(proposal));

	        // Continue to state representation
	        state();
	    }
	};


	// State Represenation
	let _render = () => null;
	let _reactors = [];
	const state = () => {
	    // Reactors would go here
	    
	    _reactors.forEach(r => r());

	    _render(model);
	};


	const init$1 = (component, act, render = _render) => {
	    const { actions, acceptors, reactors } = component;

	    if (actions && acceptors && reactors) {
	        // Initialize the SAM elements
	        const _actions = actions.map(a => a(model.present));
	        acceptors.map(a => model._acceptors.push(a(model)));
	        _reactors = reactors.map(r => r(model));
	        return _actions;
	    } else {
	        // Process an action
	        _render = render;
	        // get initial state from app
	        Object.assign(model, component.get());
	        act();
	    }
	};

	/* src\TodoMVC.svelte generated by Svelte v3.4.1 */

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.item = list[i];
		child_ctx.each_value = list;
		child_ctx.index = i;
		return child_ctx;
	}

	// (155:0) {#if items.length > 0}
	function create_if_block(ctx) {
		var section, input, input_checked_value, t0, label, t2, ul0, each_blocks = [], each_1_lookup = new Map(), t3, footer, span, strong, t4, t5, t6_value = ctx.numActive === 1 ? 'item' : 'items', t6, t7, t8, ul1, li0, a0, t9, a0_class_value, t10, li1, a1, t11, a1_class_value, t12, li2, a2, t13, a2_class_value, t14, dispose;

		var each_value = ctx.filtered;

		const get_key = ctx => ctx.item.id;

		for (var i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		var if_block = (ctx.numCompleted) && create_if_block_1(ctx);

		return {
			c() {
				section = element("section");
				input = element("input");
				t0 = space();
				label = element("label");
				label.textContent = "Mark all as complete";
				t2 = space();
				ul0 = element("ul");

				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

				t3 = space();
				footer = element("footer");
				span = element("span");
				strong = element("strong");
				t4 = text(ctx.numActive);
				t5 = space();
				t6 = text(t6_value);
				t7 = text(" left");
				t8 = space();
				ul1 = element("ul");
				li0 = element("li");
				a0 = element("a");
				t9 = text("All");
				t10 = space();
				li1 = element("li");
				a1 = element("a");
				t11 = text("Active");
				t12 = space();
				li2 = element("li");
				a2 = element("a");
				t13 = text("Completed");
				t14 = space();
				if (if_block) if_block.c();
				input.id = "toggle-all";
				input.className = "toggle-all";
				attr(input, "type", "checkbox");
				input.checked = input_checked_value = ctx.numCompleted === ctx.items.length;
				label.htmlFor = "toggle-all";
				ul0.className = "todo-list";
				span.className = "todo-count";
				a0.className = a0_class_value = ctx.currentFilter === 'all' ? 'selected' : '';
				a0.href = "#/";
				a1.className = a1_class_value = ctx.currentFilter === 'active' ? 'selected' : '';
				a1.href = "#/active";
				a2.className = a2_class_value = ctx.currentFilter === 'completed' ? 'selected' : '';
				a2.href = "#/completed";
				ul1.className = "filters";
				footer.className = "footer";
				section.className = "main";
				dispose = listen(input, "change", ctx.toggleAllIntent);
			},

			m(target, anchor) {
				insert(target, section, anchor);
				append(section, input);
				append(section, t0);
				append(section, label);
				append(section, t2);
				append(section, ul0);

				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(ul0, null);

				append(section, t3);
				append(section, footer);
				append(footer, span);
				append(span, strong);
				append(strong, t4);
				append(span, t5);
				append(span, t6);
				append(span, t7);
				append(footer, t8);
				append(footer, ul1);
				append(ul1, li0);
				append(li0, a0);
				append(a0, t9);
				append(ul1, t10);
				append(ul1, li1);
				append(li1, a1);
				append(a1, t11);
				append(ul1, t12);
				append(ul1, li2);
				append(li2, a2);
				append(a2, t13);
				append(footer, t14);
				if (if_block) if_block.m(footer, null);
			},

			p(changed, ctx) {
				if ((changed.numCompleted || changed.items) && input_checked_value !== (input_checked_value = ctx.numCompleted === ctx.items.length)) {
					input.checked = input_checked_value;
				}

				const each_value = ctx.filtered;
				each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, ul0, destroy_block, create_each_block, null, get_each_context);

				if (changed.numActive) {
					set_data(t4, ctx.numActive);
				}

				if ((changed.numActive) && t6_value !== (t6_value = ctx.numActive === 1 ? 'item' : 'items')) {
					set_data(t6, t6_value);
				}

				if ((changed.currentFilter) && a0_class_value !== (a0_class_value = ctx.currentFilter === 'all' ? 'selected' : '')) {
					a0.className = a0_class_value;
				}

				if ((changed.currentFilter) && a1_class_value !== (a1_class_value = ctx.currentFilter === 'active' ? 'selected' : '')) {
					a1.className = a1_class_value;
				}

				if ((changed.currentFilter) && a2_class_value !== (a2_class_value = ctx.currentFilter === 'completed' ? 'selected' : '')) {
					a2.className = a2_class_value;
				}

				if (ctx.numCompleted) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_1(ctx);
						if_block.c();
						if_block.m(footer, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d(detaching) {
				if (detaching) {
					detach(section);
				}

				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d();

				if (if_block) if_block.d();
				dispose();
			}
		};
	}

	// (169:5) {#if editing === index}
	function create_if_block_2(ctx) {
		var input, input_value_value, dispose;

		return {
			c() {
				input = element("input");
				input.value = input_value_value = ctx.item.description;
				input.id = "edit";
				input.className = "edit";
				input.autofocus = true;

				dispose = [
					listen(input, "keydown", ctx.handleEditIntent),
					listen(input, "blur", ctx.submitIntent)
				];
			},

			m(target, anchor) {
				insert(target, input, anchor);
				input.focus();
			},

			p(changed, ctx) {
				if ((changed.filtered) && input_value_value !== (input_value_value = ctx.item.description)) {
					input.value = input_value_value;
				}
			},

			d(detaching) {
				if (detaching) {
					detach(input);
				}

				run_all(dispose);
			}
		};
	}

	// (161:3) {#each filtered as item, index (item.id)}
	function create_each_block(key_1, ctx) {
		var li, div, input, t0, label, t1_value = ctx.item.description, t1, t2, button, t3, li_class_value, dispose;

		function input_change_handler() {
			ctx.input_change_handler.call(input, ctx);
		}

		function dblclick_handler() {
			return ctx.dblclick_handler(ctx);
		}

		function click_handler() {
			return ctx.click_handler(ctx);
		}

		var if_block = (ctx.editing === ctx.index) && create_if_block_2(ctx);

		return {
			key: key_1,

			first: null,

			c() {
				li = element("li");
				div = element("div");
				input = element("input");
				t0 = space();
				label = element("label");
				t1 = text(t1_value);
				t2 = space();
				button = element("button");
				t3 = space();
				if (if_block) if_block.c();
				input.className = "toggle";
				attr(input, "type", "checkbox");
				button.className = "destroy";
				div.className = "view";
				li.className = li_class_value = "" + (ctx.item.completed ? 'completed' : '') + " " + (ctx.editing === ctx.index ? 'editing' : '');

				dispose = [
					listen(input, "change", input_change_handler),
					listen(label, "dblclick", dblclick_handler),
					listen(button, "click", click_handler)
				];

				this.first = li;
			},

			m(target, anchor) {
				insert(target, li, anchor);
				append(li, div);
				append(div, input);

				input.checked = ctx.item.completed;

				append(div, t0);
				append(div, label);
				append(label, t1);
				append(div, t2);
				append(div, button);
				append(li, t3);
				if (if_block) if_block.m(li, null);
			},

			p(changed, new_ctx) {
				ctx = new_ctx;
				if (changed.filtered) input.checked = ctx.item.completed;

				if ((changed.filtered) && t1_value !== (t1_value = ctx.item.description)) {
					set_data(t1, t1_value);
				}

				if (ctx.editing === ctx.index) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_2(ctx);
						if_block.c();
						if_block.m(li, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if ((changed.filtered || changed.editing) && li_class_value !== (li_class_value = "" + (ctx.item.completed ? 'completed' : '') + " " + (ctx.editing === ctx.index ? 'editing' : ''))) {
					li.className = li_class_value;
				}
			},

			d(detaching) {
				if (detaching) {
					detach(li);
				}

				if (if_block) if_block.d();
				run_all(dispose);
			}
		};
	}

	// (194:3) {#if numCompleted}
	function create_if_block_1(ctx) {
		var button, dispose;

		return {
			c() {
				button = element("button");
				button.textContent = "Clear completed";
				button.className = "clear-completed";
				dispose = listen(button, "click", ctx.clearCompletedIntent);
			},

			m(target, anchor) {
				insert(target, button, anchor);
			},

			p: noop,

			d(detaching) {
				if (detaching) {
					detach(button);
				}

				dispose();
			}
		};
	}

	function create_fragment(ctx) {
		var header, h1, t1, input, t2, if_block_anchor, dispose;

		var if_block = (ctx.items.length > 0) && create_if_block(ctx);

		return {
			c() {
				header = element("header");
				h1 = element("h1");
				h1.textContent = "todos";
				t1 = space();
				input = element("input");
				t2 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				input.className = "new-todo";
				input.placeholder = "What needs to be done?";
				input.autofocus = true;
				header.className = "header";
				dispose = listen(input, "keydown", ctx.createNewIntent);
			},

			m(target, anchor) {
				insert(target, header, anchor);
				append(header, h1);
				append(header, t1);
				append(header, input);
				insert(target, t2, anchor);
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				input.focus();
			},

			p(changed, ctx) {
				if (ctx.items.length > 0) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			i: noop,
			o: noop,

			d(detaching) {
				if (detaching) {
					detach(header);
					detach(t2);
				}

				if (if_block) if_block.d(detaching);

				if (detaching) {
					detach(if_block_anchor);
				}

				dispose();
			}
		};
	}

	const ENTER_KEY = 13;

	const ESCAPE_KEY = 27;

	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	function instance($$self, $$props, $$invalidate) {
		

		let storedItems;
		try {
			$$invalidate('storedItems', storedItems = JSON.parse(localStorage.getItem('todos-svelte')) || []);
		} catch (err) {
			$$invalidate('storedItems', storedItems = []);
		}

		const state = {
			currentFilter: 'all',
			items: storedItems,
			editing: null,
		};

		let { currentFilter, items, editing } = state;
		
		const updateView = () => {
			$$invalidate('currentFilter', currentFilter = 'all');
			if (window.location.hash === '#/active') {
				$$invalidate('currentFilter', currentFilter = 'active');
			} else if (window.location.hash === '#/completed') {
				$$invalidate('currentFilter', currentFilter = 'completed');
			}
		};

		window.addEventListener('hashchange', updateView);
		updateView();

		// Acceptors are tied to the component's local props
		// However, they could also be triggered by proposals from
		// other components.
		// Acceptors use the model to pass state from one component
		// to the next, however, model props need to be bound to 
		// some component props to be rendered
		const clearCompletedAcceptor = model => ({ clearCompleted }) => {
			if (clearCompleted) {
				$$invalidate('items', items = items.filter(item => !item.completed));
			}
		};

		const removeAcceptor = model => ({ index }) => {
			if (index !== undefined) {
				$$invalidate('items', items = items.slice(0, index).concat(items.slice(index + 1)));
			}
		};

		const toggleAllAcceptor = model => ({ toggleEvent }) => {
			if (toggleEvent) {
				$$invalidate('items', items = items.map(item => ({
					id: item.id,
					description: item.description,
					completed: toggleEvent.target.checked
				})));
			}
		};

		const createNewAcceptor = model => ({ createNewEvent }) => {
			if (createNewEvent && createNewEvent.which === ENTER_KEY) {
				$$invalidate('items', items = items.concat({
					id: uuid(),
					description: createNewEvent.target.value,
					completed: false
				}));
				createNewEvent.target.value = '';
			}
		};

		const handleEditAcceptor = model => ({ handleEditEvent }) => {
			if (handleEditEvent && handleEditEvent.which === ENTER_KEY) handleEditEvent.target.blur();
			else if (handleEditEvent && handleEditEvent.which === ESCAPE_KEY) $$invalidate('editing', editing = null);
		};

		const submitAcceptor = model => ({ submitEvent }) => {
			if (submitEvent) {
				items[editing].description = submitEvent.target.value; $$invalidate('items', items);
				$$invalidate('editing', editing = null);
			}
		};

		// Add Todo component to the SAM Loop
		// Any number of components can be added
		const [
			// SAM converts actions into intents
			// which are called by the view
			clearCompletedIntent,
			removeIntent,
			toggleAllIntent,
			createNewIntent,
			handleEditIntent,
			submitIntent
		] = init$1( { 
			actions: [
				// Actions are trivial in this example.
				// In general there is more work to do to  
				// create a proposal
				present => () => present({ clearCompleted: true }),
				present => index => present({ index }),
				present => event => present({ toggleEvent: event }),
				present => event => present({ createNewEvent: event }),
				present => event => present({ handleEditEvent: event }),
				present => event => present({ submitEvent: event })
			], 
			acceptors: [
				clearCompletedAcceptor,
				removeAcceptor,
				toggleAllAcceptor,
				createNewAcceptor,
				handleEditAcceptor,
				submitAcceptor
			], 
			// This example does have any reactor
			reactors: [] });

		function input_change_handler({ item, each_value, index }) {
			each_value[index].completed = this.checked;
			$$invalidate('filtered', filtered), $$invalidate('currentFilter', currentFilter), $$invalidate('items', items);
		}

		function dblclick_handler({ index }) {
			const $$result = editing = index;
			$$invalidate('editing', editing);
			return $$result;
		}

		function click_handler({ index }) {
			return removeIntent(index);
		}

		let filtered, numActive, numCompleted;

		$$self.$$.update = ($$dirty = { currentFilter: 1, items: 1 }) => {
			if ($$dirty.currentFilter || $$dirty.items) { $$invalidate('filtered', filtered = currentFilter === 'all'
					? items
					: currentFilter === 'completed'
						? items.filter(item => item.completed)
						: items.filter(item => !item.completed)); }
			if ($$dirty.items) { $$invalidate('numActive', numActive = items.filter(item => !item.completed).length); }
			if ($$dirty.items) { $$invalidate('numCompleted', numCompleted = items.filter(item => item.completed).length); }
			if ($$dirty.items) { try {
					localStorage.setItem('todos-svelte', JSON.stringify(items));
				} catch (err) {
					// noop
				} }
		};

		return {
			currentFilter,
			items,
			editing,
			clearCompletedIntent,
			removeIntent,
			toggleAllIntent,
			createNewIntent,
			handleEditIntent,
			submitIntent,
			filtered,
			numActive,
			numCompleted,
			input_change_handler,
			dblclick_handler,
			click_handler
		};
	}

	class TodoMVC extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, []);
		}
	}

	window.todomvc = new TodoMVC({
		target: document.querySelector('.todoapp')
	});

}());
//# sourceMappingURL=bundle.js.map
