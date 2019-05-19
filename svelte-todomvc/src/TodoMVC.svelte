<script>
	import SAM from './lib/SAM';

	const ENTER_KEY = 13;
	const ESCAPE_KEY = 27;

	let storedItems;
	try {
		storedItems = JSON.parse(localStorage.getItem('todos-svelte')) || [];
	} catch (err) {
		storedItems = [];
	}

	const state = {
		currentFilter: 'all',
		items: storedItems,
		editing: null,
	};

	let { currentFilter, items, editing } = state;
	
	const updateView = () => {
		currentFilter = 'all';
		if (window.location.hash === '#/active') {
			currentFilter = 'active';
		} else if (window.location.hash === '#/completed') {
			currentFilter = 'completed';
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
			items = items.filter(item => !item.completed);
		}
	}

	const removeAcceptor = model => ({ index }) => {
		if (index !== undefined) {
			items = items.slice(0, index).concat(items.slice(index + 1));
		}
	}

	const toggleAllAcceptor = model => ({ toggleEvent }) => {
		if (toggleEvent) {
			items = items.map(item => ({
				id: item.id,
				description: item.description,
				completed: toggleEvent.target.checked
			}));
		}
	}

	const createNewAcceptor = model => ({ createNewEvent }) => {
		if (createNewEvent && createNewEvent.which === ENTER_KEY) {
			items = items.concat({
				id: uuid(),
				description: createNewEvent.target.value,
				completed: false
			});
			createNewEvent.target.value = '';
		}
	}

	const handleEditAcceptor = model => ({ handleEditEvent }) => {
		if (handleEditEvent && handleEditEvent.which === ENTER_KEY) handleEditEvent.target.blur();
		else if (handleEditEvent && handleEditEvent.which === ESCAPE_KEY) editing = null;
	}

	const submitAcceptor = model => ({ submitEvent }) => {
		if (submitEvent) {
			items[editing].description = submitEvent.target.value;
			editing = null;
		}
	}

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
	] = SAM( { 
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
		reactors: [] })

	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// There is no render in the SAM loop since this is handled automatically by Svelte

	$: filtered = currentFilter === 'all'
		? items
		: currentFilter === 'completed'
			? items.filter(item => item.completed)
			: items.filter(item => !item.completed);

	$: numActive = items.filter(item => !item.completed).length;

	$: numCompleted = items.filter(item => item.completed).length;

	$: try {
		localStorage.setItem('todos-svelte', JSON.stringify(items));
	} catch (err) {
		// noop
	}
</script>

<header class="header">
	<h1>todos</h1>
	<input
		class="new-todo"
		on:keydown={createNewIntent}
		placeholder="What needs to be done?"
		autofocus
	>
</header>

{#if items.length > 0}
	<section class="main">
		<input id="toggle-all" class="toggle-all" type="checkbox" on:change={toggleAllIntent} checked="{numCompleted === items.length}">
		<label for="toggle-all">Mark all as complete</label>

		<ul class="todo-list">
			{#each filtered as item, index (item.id)}
				<li class="{item.completed ? 'completed' : ''} {editing === index ? 'editing' : ''}">
					<div class="view">
						<input class="toggle" type="checkbox" bind:checked={item.completed}>
						<label on:dblclick="{() => editing = index}">{item.description}</label>
						<button on:click="{() => removeIntent(index)}" class="destroy"></button>
					</div>

					{#if editing === index}
						<input
							value='{item.description}'
							id="edit"
							class="edit"
							on:keydown={handleEditIntent}
							on:blur={submitIntent}
							autofocus
						>
					{/if}
				</li>
			{/each}
		</ul>

		<footer class="footer">
			<span class="todo-count">
				<strong>{numActive}</strong> {numActive === 1 ? 'item' : 'items'} left
			</span>

			<ul class="filters">
				<li><a class="{currentFilter === 'all' ? 'selected' : ''}" href="#/">All</a></li>
				<li><a class="{currentFilter === 'active' ? 'selected' : ''}" href="#/active">Active</a></li>
				<li><a class="{currentFilter === 'completed' ? 'selected' : ''}" href="#/completed">Completed</a></li>
			</ul>

			{#if numCompleted}
				<button class="clear-completed" on:click={clearCompletedIntent}>
					Clear completed
				</button>
			{/if}
		</footer>
	</section>
{/if}