/**
 * Модуль для работы с localStorage
 * Хранение данных о гражданах
 */

// Ключ для хранения данных в localStorage
const STORAGE_KEY = 'citizens';

/**
 * Получить все записи из хранилища
 * @returns {Array} Массив граждан
 */
function getAllCitizens() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения данных:', error);
        return [];
    }
}

/**
 * Сохранить все записи в хранилище
 * @param {Array} citizens - Массив граждан
 */
function saveAllCitizens(citizens) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(citizens));
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

/**
 * Получить запись по ID
 * @param {string} id - ID гражданина
 * @returns {Object|null} Данные гражданина или null
 */
function getCitizenById(id) {
    const citizens = getAllCitizens();
    return citizens.find(citizen => citizen.id === id) || null;
}

/**
 * Добавить новую запись
 * @param {Object} data - Данные гражданина
 * @returns {Object} Добавленная запись с ID
 */
function addCitizen(data) {
    const citizens = getAllCitizens();
    
    // Генерируем уникальный ID
    const newCitizen = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString()
    };
    
    citizens.push(newCitizen);
    saveAllCitizens(citizens);
    
    return newCitizen;
}

/**
 * Обновить запись
 * @param {string} id - ID гражданина
 * @param {Object} data - Новые данные
 * @returns {Object|null} Обновлённая запись или null
 */
function updateCitizen(id, data) {
    const citizens = getAllCitizens();
    const index = citizens.findIndex(citizen => citizen.id === id);
    
    if (index === -1) {
        return null;
    }
    
    citizens[index] = {
        ...citizens[index],
        ...data,
        id: id, // ID не меняем
        updatedAt: new Date().toISOString()
    };
    
    saveAllCitizens(citizens);
    
    return citizens[index];
}

/**
 * Удалить запись
 * @param {string} id - ID гражданина
 * @returns {boolean} Успешность удаления
 */
function deleteCitizen(id) {
    const citizens = getAllCitizens();
    const index = citizens.findIndex(citizen => citizen.id === id);
    
    if (index === -1) {
        return false;
    }
    
    citizens.splice(index, 1);
    saveAllCitizens(citizens);
    
    return true;
}

/**
 * Поиск по ФИО
 * @param {string} query - Поисковый запрос
 * @returns {Array} Найденные записи
 */
function searchCitizens(query) {
    if (!query || !query.trim()) {
        return getAllCitizens();
    }
    
    const searchTerm = query.toLowerCase().trim();
    const citizens = getAllCitizens();
    
    return citizens.filter(citizen => {
        const fullName = `${citizen.lastName} ${citizen.firstName} ${citizen.middleName || ''}`.toLowerCase();
        return fullName.includes(searchTerm);
    });
}

/**
 * Получить количество записей
 * @returns {number} Количество записей
 */
function getCitizensCount() {
    return getAllCitizens().length;
}

/**
 * Генерация уникального ID
 * @returns {string} Уникальный ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Инициализация тестовых данных (для демонстрации)
 */
function initDemoData() {
    // Проверяем, есть ли уже данные
    if (getAllCitizens().length > 0) {
        return;
    }
    
    const demoData = [
        {
            lastName: 'Иванов',
            firstName: 'Иван',
            middleName: 'Иванович',
            birthDate: '1985-03-15',
            gender: 'male',
            region: 'Московская область',
            city: 'Москва',
            street: 'Тверская',
            house: '12',
            apartment: '45',
            education: 'higher',
            employment: 'employed',
            maritalStatus: 'married'
        },
        {
            lastName: 'Петрова',
            firstName: 'Мария',
            middleName: 'Сергеевна',
            birthDate: '1990-07-22',
            gender: 'female',
            region: 'Санкт-Петербург',
            city: 'Санкт-Петербург',
            street: 'Невский проспект',
            house: '88',
            apartment: '12',
            education: 'higher',
            employment: 'employed',
            maritalStatus: 'single'
        },
        {
            lastName: 'Сидоров',
            firstName: 'Алексей',
            middleName: 'Петрович',
            birthDate: '1978-11-30',
            gender: 'male',
            region: 'Краснодарский край',
            city: 'Краснодар',
            street: 'Красная',
            house: '5',
            apartment: '',
            education: 'vocational',
            employment: 'employed',
            maritalStatus: 'married'
        },
        {
            lastName: 'Козлова',
            firstName: 'Анна',
            middleName: 'Викторовна',
            birthDate: '2000-01-10',
            gender: 'female',
            region: 'Новосибирская область',
            city: 'Новосибирск',
            street: 'Ленина',
            house: '34',
            apartment: '78',
            education: 'secondary',
            employment: 'student',
            maritalStatus: 'single'
        },
        {
            lastName: 'Морозов',
            firstName: 'Дмитрий',
            middleName: 'Александрович',
            birthDate: '1955-06-18',
            gender: 'male',
            region: 'Свердловская область',
            city: 'Екатеринбург',
            street: 'Малышева',
            house: '101',
            apartment: '15',
            education: 'higher',
            employment: 'retired',
            maritalStatus: 'widowed'
        }
    ];
    
    demoData.forEach(citizen => addCitizen(citizen));
}

// Словари для отображения значений
const GENDER_LABELS = {
    'male': 'Мужской',
    'female': 'Женский'
};

const EDUCATION_LABELS = {
    'primary': 'Начальное',
    'secondary': 'Среднее',
    'vocational': 'Среднее специальное',
    'higher': 'Высшее'
};

const EMPLOYMENT_LABELS = {
    'employed': 'Работаю',
    'student': 'Учусь',
    'retired': 'Пенсионер',
    'unemployed': 'Безработный',
    'other': 'Другое'
};

const MARITAL_STATUS_LABELS = {
    'single': 'Холост / Не замужем',
    'married': 'Женат / Замужем',
    'divorced': 'В разводе',
    'widowed': 'Вдовец / Вдова'
};

/**
 * Получить текстовое значение пола
 * @param {string} value - Значение
 * @returns {string} Текст
 */
function getGenderLabel(value) {
    return GENDER_LABELS[value] || value;
}

/**
 * Форматирование даты в русский формат
 * @param {string} dateString - Дата в формате YYYY-MM-DD
 * @returns {string} Дата в формате ДД.ММ.ГГГГ
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

/**
 * Показать уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип уведомления (success/error)
 */
function showNotification(message, type = 'success') {
    // Удаляем существующие уведомления
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
