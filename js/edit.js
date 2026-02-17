/**
 * Страница редактирования - логика работы с формой
 */

// Элементы DOM
let form;
let citizenId;

/**
 * Инициализация страницы
 */
function init() {
    form = document.getElementById('citizenForm');
    
    // Получаем ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    citizenId = urlParams.get('id');
    
    // Если ID не передан, возвращаемся на главную
    if (!citizenId) {
        showNotification('Запись не найдена', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // Загружаем данные гражданина
    const citizen = getCitizenById(citizenId);
    
    if (!citizen) {
        showNotification('Запись не найдена', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // Заполняем форму данными
    fillForm(citizen);
    
    // Устанавливаем максимальную дату рождения (сегодня)
    const birthDateInput = document.getElementById('birthDate');
    birthDateInput.max = new Date().toISOString().split('T')[0];
    
    // Привязываем обработчик отправки формы
    form.addEventListener('submit', handleSubmit);
}

/**
 * Заполнение формы данными
 * @param {Object} citizen - Данные гражданина
 */
function fillForm(citizen) {
    document.getElementById('citizenId').value = citizen.id;
    document.getElementById('lastName').value = citizen.lastName || '';
    document.getElementById('firstName').value = citizen.firstName || '';
    document.getElementById('middleName').value = citizen.middleName || '';
    document.getElementById('birthDate').value = citizen.birthDate || '';
    document.getElementById('gender').value = citizen.gender || '';
    document.getElementById('region').value = citizen.region || '';
    document.getElementById('city').value = citizen.city || '';
    document.getElementById('street').value = citizen.street || '';
    document.getElementById('house').value = citizen.house || '';
    document.getElementById('apartment').value = citizen.apartment || '';
    document.getElementById('education').value = citizen.education || '';
    document.getElementById('employment').value = citizen.employment || '';
    document.getElementById('maritalStatus').value = citizen.maritalStatus || '';
}

/**
 * Обработка отправки формы
 * @param {Event} event - Событие отправки
 */
function handleSubmit(event) {
    event.preventDefault();
    
    // Собираем данные из формы
    const formData = getFormData();
    
    // Проверяем валидность
    if (!validateForm(formData)) {
        return;
    }
    
    // Обновляем данные
    try {
        const updated = updateCitizen(citizenId, formData);
        
        if (updated) {
            showNotification('Изменения сохранены', 'success');
            
            // Перенаправляем на главную страницу
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification('Ошибка при сохранении данных', 'error');
        }
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showNotification('Ошибка при сохранении данных', 'error');
    }
}

/**
 * Получение данных из формы
 * @returns {Object} Данные формы
 */
function getFormData() {
    return {
        lastName: document.getElementById('lastName').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        region: document.getElementById('region').value.trim(),
        city: document.getElementById('city').value.trim(),
        street: document.getElementById('street').value.trim(),
        house: document.getElementById('house').value.trim(),
        apartment: document.getElementById('apartment').value.trim(),
        education: document.getElementById('education').value,
        employment: document.getElementById('employment').value,
        maritalStatus: document.getElementById('maritalStatus').value
    };
}

/**
 * Валидация формы
 * @param {Object} data - Данные для проверки
 * @returns {boolean} Результат валидации
 */
function validateForm(data) {
    // Убираем предыдущие ошибки
    clearErrors();
    
    let isValid = true;
    
    // Проверяем обязательные текстовые поля
    const requiredFields = [
        { id: 'lastName', name: 'Фамилия' },
        { id: 'firstName', name: 'Имя' },
        { id: 'birthDate', name: 'Дата рождения' },
        { id: 'gender', name: 'Пол' },
        { id: 'region', name: 'Регион' },
        { id: 'city', name: 'Город' },
        { id: 'street', name: 'Улица' },
        { id: 'house', name: 'Дом' },
        { id: 'education', name: 'Образование' },
        { id: 'employment', name: 'Занятость' },
        { id: 'maritalStatus', name: 'Семейное положение' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element.value.trim();
        
        if (!value) {
            showFieldError(element, `Поле "${field.name}" обязательно для заполнения`);
            isValid = false;
        }
    });
    
    // Проверяем, что дата рождения не в будущем
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        
        if (birthDate > today) {
            showFieldError(document.getElementById('birthDate'), 'Дата рождения не может быть в будущем');
            isValid = false;
        }
    }
    
    // Проверяем формат ФИО (только буквы, пробелы и дефисы)
    const namePattern = /^[а-яёА-ЯЁa-zA-Z\s\-]+$/;
    
    if (data.lastName && !namePattern.test(data.lastName)) {
        showFieldError(document.getElementById('lastName'), 'Фамилия может содержать только буквы');
        isValid = false;
    }
    
    if (data.firstName && !namePattern.test(data.firstName)) {
        showFieldError(document.getElementById('firstName'), 'Имя может содержать только буквы');
        isValid = false;
    }
    
    if (data.middleName && !namePattern.test(data.middleName)) {
        showFieldError(document.getElementById('middleName'), 'Отчество может содержать только буквы');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Показать ошибку поля
 * @param {HTMLElement} element - Элемент поля
 * @param {string} message - Сообщение об ошибке
 */
function showFieldError(element, message) {
    element.classList.add('input--error');
    
    // Создаём элемент с ошибкой
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;
    
    // Вставляем после поля ввода
    element.parentNode.appendChild(errorElement);
}

/**
 * Очистить все ошибки
 */
function clearErrors() {
    // Удаляем классы ошибок
    document.querySelectorAll('.input--error').forEach(el => {
        el.classList.remove('input--error');
    });
    
    // Удаляем сообщения об ошибках
    document.querySelectorAll('.form__error').forEach(el => {
        el.remove();
    });
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
