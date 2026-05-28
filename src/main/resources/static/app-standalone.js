class KanbanApp {
    constructor() {
        this.tasks = [];
        this.storageKey = 'kanban-tasks';
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadTasksFromStorage();
    }

    cacheDOM() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoTasks = document.getElementById('todoTasks');
        this.inprogressTasks = document.getElementById('inprogressTasks');
        this.doneTasks = document.getElementById('doneTasks');
        this.containers = [this.todoTasks, this.inprogressTasks, this.doneTasks];
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // ドラッグ&ドロップイベント
        this.containers.forEach(container => {
            container.addEventListener('dragover', (e) => this.handleDragOver(e));
            container.addEventListener('drop', (e) => this.handleDrop(e));
            container.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    loadTasksFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.tasks = JSON.parse(stored);
        } else {
            // サンプルデータ
            this.tasks = [
                { id: '1', title: 'プロジェクト企画書を作成', status: 'todo' },
                { id: '2', title: 'クライアントとのミーティング準備', status: 'todo' },
                { id: '3', title: 'デザイン案の確認', status: 'inprogress' },
                { id: '4', title: 'フロントエンド実装', status: 'inprogress' },
                { id: '5', title: 'テスト完了', status: 'done' },
                { id: '6', title: 'ドキュメント作成', status: 'done' }
            ];
            this.saveToStorage();
        }
        this.render();
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    addTask() {
        const title = this.taskInput.value.trim();
        if (!title) {
            alert('タスクを入力してください');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title: title,
            status: 'todo'
        };

        this.tasks.push(newTask);
        this.taskInput.value = '';
        this.taskInput.focus();
        this.saveToStorage();
        this.render();
    }

    deleteTask(id) {
        if (confirm('このタスクを削除しますか？')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    updateTaskStatus(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = newStatus;
            this.saveToStorage();
            this.render();
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        const targetContainer = e.currentTarget;

        let newStatus = 'todo';
        if (targetContainer === this.inprogressTasks) {
            newStatus = 'inprogress';
        } else if (targetContainer === this.doneTasks) {
            newStatus = 'done';
        }

        this.updateTaskStatus(taskId, newStatus);
    }

    render() {
        this.clearContainers();

        this.tasks.forEach(task => {
            const cardHTML = this.createTaskCard(task);
            const targetContainer = this.getContainerByStatus(task.status);
            targetContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        this.attachTaskCardEvents();
    }

    createTaskCard(task) {
        return `
            <div class="task-card" draggable="true" data-id="${task.id}">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-footer">
                    <select class="task-status-select" data-id="${task.id}">
                        <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>やることリスト</option>
                        <option value="inprogress" ${task.status === 'inprogress' ? 'selected' : ''}>進行中</option>
                        <option value="done" ${task.status === 'done' ? 'selected' : ''}>完了</option>
                    </select>
                    <button class="delete-button" data-id="${task.id}">削除</button>
                </div>
            </div>
        `;
    }

    attachTaskCardEvents() {
        // ドラッグイベント
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.id);
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
            });
        });

        // 削除ボタン
        document.querySelectorAll('.delete-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = btn.dataset.id;
                this.deleteTask(taskId);
            });
        });

        // ステータス変更セレクト
        document.querySelectorAll('.task-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const taskId = select.dataset.id;
                const newStatus = e.target.value;
                this.updateTaskStatus(taskId, newStatus);
            });
        });
    }

    clearContainers() {
        this.containers.forEach(container => {
            container.innerHTML = '';
        });
    }

    getContainerByStatus(status) {
        switch (status) {
            case 'inprogress':
                return this.inprogressTasks;
            case 'done':
                return this.doneTasks;
            default:
                return this.todoTasks;
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
    new KanbanApp();
});
