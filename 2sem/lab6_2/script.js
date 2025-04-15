const state = {
    tasks: [],
    sortBy: 'created'
};

const createTaskObject = (text) => ({
    id: Date.now(),
    text,
    completed: false,
    created: new Date(),
    updated: new Date()
});

const updateTask = (tasks, id, newData) =>
    tasks.map(task =>
        task.id === id ? {...task, ...newData, updated: new Date()} : task
    );

const sortTasks = (tasks, sortBy) => {
    switch(sortBy) {
        case 'created':
            return [...tasks].sort((a, b) => b.created - a.created);
        case 'updated':
            return [...tasks].sort((a, b) => b.updated - a.updated);
        case 'status':
            return [...tasks].sort((a, b) => a.completed - b.completed);
        default:
            return tasks;
    }
};

const renderTasks = (tasks) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const sortedTasks = sortTasks(tasks, state.sortBy);

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="task-text" tabindex="0">${task.text}</span>
            <button class="delete-btn">Видалити</button>
        `;

        const textSpan = li.querySelector('.task-text');
        const deleteBtn = li.querySelector('.delete-btn');

        textSpan.addEventListener('click', () => toggleComplete(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        textSpan.addEventListener('blur', (e) => {
            updateTaskText(task.id, e.target.textContent);
        });

        textSpan.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') e.target.blur();
        });

        taskList.appendChild(li);
    });
};

const addTask = (text) => {
    state.tasks = [...state.tasks, createTaskObject(text)];
    renderTasks(state.tasks);
};

const deleteTask = (id) => {
    state.tasks = state.tasks.filter(task => task.id !== id);
    renderTasks(state.tasks);
};

const toggleComplete = (id) => {
    state.tasks = updateTask(state.tasks, id, {
        completed: !state.tasks.find(task => task.id === id).completed
    });
    renderTasks(state.tasks);
};

const updateTaskText = (id, newText) => {
    if(newText.trim()) {
        state.tasks = updateTask(state.tasks, id, { text: newText.trim() });
        renderTasks(state.tasks);
    }
};

document.getElementById('todoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('taskInput');
    if(input.value.trim()) {
        addTask(input.value.trim());
        input.value = '';
    }
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderTasks(state.tasks);
});

renderTasks(state.tasks);