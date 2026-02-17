/**
 * Главная страница - логика отображения и управления списком граждан
 */

// Элементы DOM
let tableBody;
let totalCountElement;
let searchInput;
let searchBtn;
let resetBtn;
let emptyMessage;
let tableWrapper;

/**
 * Инициализация страницы
 */
function init() {
    // Получаем ссылки на элементы
    tableBody = document.getElementById('tableBody');
    totalCountElement = document.getElementById('totalCount');
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    resetBtn = document.getElementById('resetBtn');
    emptyMessage = document.getElementById('emptyMessage');
    tableWrapper = document.querySelector('.table-wrapper');
    
    // Инициализируем демо-данные
    initDemoData();
    
    // Привязываем обработчики
    searchBtn.addEventListener('click', handleSearch);
    resetBtn.addEventListener('click', handleReset);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Отображаем данные
    renderTable(getAllCitizens());
}

/**
 * Отрисовка таблицы
 * @param {Array} citizens - Массив граждан для отображения
 */
function renderTable(citizens) {
    // Обновляем счётчик
    totalCountElement.textContent = citizens.length;
    
    // Если нет данных, показываем сообщение
    if (citizens.length === 0) {
        tableWrapper.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    // Показываем таблицу
    tableWrapper.style.display = 'block';
    emptyMessage.style.display = 'none';
    
    // Очищаем tbody
    tableBody.innerHTML = '';
    
    // Заполняем таблицу
    citizens.forEach((citizen, index) => {
        const row = createTableRow(citizen, index + 1);
        tableBody.appendChild(row);
    });
}

/**
 * Создание строки таблицы
 * @param {Object} citizen - Данные гражданина
 * @param {number} number - Порядковый номер
 * @returns {HTMLElement} Элемент строки
 */
function createTableRow(citizen, number) {
    const tr = document.createElement('tr');
    
    // Собираем ФИО
    const fullName = [citizen.lastName, citizen.firstName, citizen.middleName]
        .filter(Boolean)
        .join(' ');
    
    tr.innerHTML = `
        <td>${number}</td>
        <td>${escapeHtml(fullName)}</td>
        <td>${formatDate(citizen.birthDate)}</td>
        <td>${getGenderLabel(citizen.gender)}</td>
        <td>${escapeHtml(citizen.city)}</td>
        <td class="table__actions">
            <a href="edit.html?id=${citizen.id}" class="btn btn--small btn--outline">Редактировать</a>
            <button type="button" class="btn btn--small btn--danger" onclick="confirmDelete('${citizen.id}', '${escapeHtml(fullName)}')">Удалить</button>
        </td>
    `;
    
    return tr;
}

/**
 * Обработка поиска
 */
function handleSearch() {
    const query = searchInput.value.trim();
    const results = searchCitizens(query);
    renderTable(results);
}

/**
 * Сброс поиска
 */
function handleReset() {
    searchInput.value = '';
    renderTable(getAllCitizens());
}

/**
 * Подтверждение удаления
 * @param {string} id - ID гражданина
 * @param {string} name - ФИО для отображения
 */
function confirmDelete(id, name) {
    // Создаём модальное окно
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal">
            <h3>Подтверждение удаления</h3>
            <p>Вы действительно хотите удалить запись<br><strong>${name}</strong>?</p>
            <div class="modal__actions">
                <button type="button" class="btn btn--danger" id="confirmDeleteBtn">Удалить</button>
                <button type="button" class="btn btn--outline" id="cancelDeleteBtn">Отмена</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Обработчики кнопок
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        const success = deleteCitizen(id);
        overlay.remove();
        
        if (success) {
            showNotification('Запись успешно удалена', 'success');
            handleSearch(); // Обновляем таблицу с учётом текущего поиска
        } else {
            showNotification('Ошибка при удалении записи', 'error');
        }
    });
    
    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        overlay.remove();
    });
    
    // Закрытие по клику на оверлей
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

/**
 * Экранирование HTML
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
