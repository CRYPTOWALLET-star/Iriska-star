// Arctic Wallet Pro - Расширенная версия
console.log('🚀 Arctic Wallet Pro loaded');

// Telegram WebApp
let tg = window.Telegram.WebApp;
let currentScreen = 'main';
let userData = null;

// Все криптовалюты
const allCryptos = [
    { id: 'BTC', name: 'Bitcoin', icon: 'fab fa-bitcoin', color: '#F7931A', balance: 0.0021, price: 40700, change: 2.3 },
    { id: 'ETH', name: 'Ethereum', icon: 'fab fa-ethereum', color: '#627EEA', balance: 0.15, price: 2450, change: 1.8 },
    { id: 'BNB', name: 'Binance Coin', icon: 'fas fa-coins', color: '#F0B90B', balance: 1.2, price: 320, change: -0.5 },
    { id: 'TRX', name: 'Tron', icon: 'fas fa-bolt', color: '#FF060A', balance: 500, price: 0.11, change: 0.7 },
    { id: 'TON', name: 'Toncoin', icon: 'fas fa-gem', color: '#0088CC', balance: 25, price: 2.3, change: 5.2 },
    { id: 'USDT', name: 'Tether', icon: 'fas fa-dollar-sign', color: '#26A17B', balance: 150.5, price: 1, change: 0 },
    { id: 'USDC', name: 'USD Coin', icon: 'fas fa-circle-dollar', color: '#2775CA', balance: 50, price: 1, change: 0 },
    { id: 'LTC', name: 'Litecoin', icon: 'fas fa-bolt', color: '#BFBBBB', balance: 0.5, price: 70, change: 1.2 },
    { id: 'DOGE', name: 'Dogecoin', icon: 'fas fa-dog', color: '#C2A633', balance: 1000, price: 0.08, change: 3.1 }
];

// История транзакций (фейковая)
const fakeHistory = [
    { id: 1, type: 'send', currency: 'BTC', amount: 0.001, address: 'bc1q...xyz', date: '10:30', status: 'success', rubAmount: 4250 },
    { id: 2, type: 'receive', currency: 'ETH', amount: 0.05, address: '0x123...abc', date: '09:15', status: 'success', rubAmount: 0 },
    { id: 3, type: 'send', currency: 'USDT', amount: 50, address: 'TXYZ...def', date: 'Вчера', status: 'success', rubAmount: 5000 },
    { id: 4, type: 'receive', currency: 'TON', amount: 10, address: 'EQABC...', date: '2 дня', status: 'success', rubAmount: 0 }
];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM ready');
    
    // Telegram WebApp
    if (tg && tg.initDataUnsafe) {
        userData = tg.initDataUnsafe.user;
        tg.expand();
        console.log('✅ Telegram WebApp initialized');
    }
    
    // Показать главный экран
    showScreen('main');
    
    // Загрузить Font Awesome
    if (!document.querySelector('.fa')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }
});

// ================= ЭКРАНЫ =================

// Показать экран
function showScreen(screenName, clickedElement) {
    currentScreen = screenName;
    
    // Обновить активную кнопку в меню
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Активировать нажатую кнопку
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        // Или активировать по умолчанию
        const buttons = document.querySelectorAll('.nav-btn');
        const index = ['main', 'pay', 'receive', 'history', 'settings'].indexOf(screenName);
        if (buttons[index]) buttons[index].classList.add('active');
    }
    
    // Показать нужный экран
    switch(screenName) {
        case 'main': showMainScreen(); break;
        case 'pay': showPayScreen(); break;
        case 'receive': showReceiveScreen(); break;
        case 'history': showHistoryScreen(); break;
        case 'settings': showSettingsScreen(); break;
    }
}

// 1. ГЛАВНЫЙ ЭКРАН
function showMainScreen() {
    const userName = userData ? `${userData.first_name || 'Пользователь'}` : 'Гость';
    const totalBalance = allCryptos.reduce((sum, crypto) => sum + (crypto.balance * crypto.price), 0);
    
    document.getElementById('screenTitle').textContent = `👋 ${userName}`;
    document.getElementById('screenSubtitle').textContent = 'Ваш крипто-кошелёк';
    
    let cryptoListHTML = '';
    allCryptos.forEach(crypto => {
        const value = crypto.balance * crypto.price;
        cryptoListHTML += `
            <div class="crypto-card" onclick="selectCurrency('${crypto.id}')">
                <div class="crypto-icon-large" style="background: ${crypto.color}">
                    <i class="${crypto.icon}" style="color: white;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600; font-size: 16px;">${crypto.name}</div>
                    <div style="color: var(--text-gray); font-size: 14px;">${crypto.balance} ${crypto.id}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600;">$${value.toFixed(2)}</div>
                    <div style="color: ${crypto.change >= 0 ? '#00C6A2' : '#FF4757'}; font-size: 14px;">
                        ${crypto.change >= 0 ? '+' : ''}${crypto.change}%
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('screenContent').innerHTML = `
        <div class="bg-card p-20 rounded mb-20 text-center">
            <p class="text-gray" style="font-size: 14px; margin-bottom: 10px;">Общий баланс</p>
            <h1 style="font-size: 42px; margin-bottom: 15px;">$${totalBalance.toFixed(2)}</h1>
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 14px;">
                <span class="text-success">▲ 2.3% за день</span>
                <span class="text-gray">≈ ${(totalBalance / 85).toFixed(2)}₽</span>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
            <button class="button" onclick="showScreen('pay', this)">
                <i class="fas fa-paper-plane" style="font-size: 20px; margin-bottom: 8px;"></i><br>
                Оплатить
            </button>
            <button class="button button-primary" onclick="showScreen('receive', this)">
                <i class="fas fa-qrcode" style="font-size: 20px; margin-bottom: 8px;"></i><br>
                Получить
            </button>
        </div>
        
        <h3 style="margin: 30px 0 15px 0;">💰 Все активы</h3>
        
        <div style="margin-bottom: 80px;">
            ${cryptoListHTML}
        </div>
    `;
}

// 2. ЭКРАН ОПЛАТЫ
function showPayScreen() {
    document.getElementById('screenTitle').textContent = '💳 Оплата';
    document.getElementById('screenSubtitle').textContent = 'Перевод криптовалютой';
    
    document.getElementById('screenContent').innerHTML = `
        <div style="margin-bottom: 80px;">
            <div class="bg-card p-20 rounded mb-20">
                <p class="text-gray mb-10">Выберите валюту</p>
                <select id="payCurrency">
                    ${allCryptos.map(crypto => 
                        `<option value="${crypto.id}">${crypto.name} (${crypto.balance} ${crypto.id})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="bg-card p-20 rounded mb-20">
                <p class="text-gray mb-10">Сумма</p>
                <input type="number" id="payAmount" placeholder="0.001" step="0.001">
                <p class="text-gray mt-10" style="font-size: 14px;">
                    ≈ <span id="rubEquivalent">0</span> ₽
                </p>
            </div>
            
            <div class="bg-card p-20 rounded mb-20">
                <p class="text-gray mb-10">Адрес получателя</p>
                <input type="text" id="payAddress" placeholder="bc1q...">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="button" style="flex: 1;" onclick="scanQRForPay()">
                    <i class="fas fa-camera"></i> Сканировать QR
                </button>
                <button class="button button-primary" style="flex: 1;" onclick="showConfirmPayment()">
                    Далее
                </button>
            </div>
            
            <div class="mt-20 text-center">
                <p class="text-gray" style="font-size: 14px;">
                    Или покажите QR-код продавцу для сканирования
                </p>
                <button class="button mt-10" onclick="showScreen('receive', this)">
                    <i class="fas fa-qrcode"></i> Показать мой QR
                </button>
            </div>
        </div>
    `;
    
    // Обновление рублёвого эквивалента
    document.getElementById('payAmount').addEventListener('input', function() {
        const currency = allCryptos.find(c => c.id === document.getElementById('payCurrency').value);
        if (currency && this.value) {
            const rub = (this.value * currency.price * 85).toFixed(2);
            document.getElementById('rubEquivalent').textContent = rub;
        }
    });
}

// 3. ЭКРАН ПОЛУЧЕНИЯ
function showReceiveScreen() {
    document.getElementById('screenTitle').textContent = '📲 Получить';
    document.getElementById('screenSubtitle').textContent = 'Ваш адрес для пополнения';
    
    document.getElementById('screenContent').innerHTML = `
        <div style="margin-bottom: 80px; text-align: center;">
            <div class="bg-card p-20 rounded mb-20">
                <p class="text-gray mb-10">Выберите валюту</p>
                <select id="receiveCurrency" onchange="updateReceiveQR()">
                    ${allCryptos.map(crypto => 
                        `<option value="${crypto.id}">${crypto.name}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="qr-container">
                <canvas id="receiveQRCode"></canvas>
            </div>
            
            <div class="bg-card p-20 rounded mt-20">
                <p class="text-gray mb-10">Адрес кошелька</p>
                <p id="walletAddress" style="font-family: monospace; word-break: break-all; font-size: 14px; margin-bottom: 15px;">
                    bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
                </p>
                <button class="button" onclick="copyAddress()">
                    <i class="fas fa-copy"></i> Скопировать адрес
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                <button class="button" onclick="shareAddress()">
                    <i class="fas fa-share-alt"></i> Поделиться
                </button>
                <button class="button button-primary" onclick="showScreen('main', this)">
                    <i class="fas fa-home"></i> На главную
                </button>
            </div>
        </div>
    `;
    
    // Генерация QR кода
    setTimeout(() => updateReceiveQR(), 100);
}

// 4. ЭКРАН ИСТОРИИ
function showHistoryScreen() {
    document.getElementById('screenTitle').textContent = '📋 История';
    document.getElementById('screenSubtitle').textContent = 'Все транзакции';
    
    let historyHTML = '';
    fakeHistory.forEach(tx => {
        const crypto = allCryptos.find(c => c.id === tx.currency);
        historyHTML += `
            <div class="crypto-card">
                <div style="width: 40px; height: 40px; background: ${crypto.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <i class="${crypto.icon}" style="color: white;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600;">${tx.type === 'send' ? 'Отправка' : 'Получение'} ${tx.currency}</div>
                    <div class="text-gray" style="font-size: 12px;">${tx.date} • ${tx.address}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: ${tx.type === 'send' ? '#FF4757' : '#00C6A2'}">
                        ${tx.type === 'send' ? '-' : '+'}${tx.amount} ${tx.currency}
                    </div>
                    <div class="text-gray" style="font-size: 12px;">
                        ${tx.rubAmount ? tx.rubAmount + ' ₽' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('screenContent').innerHTML = `
        <div style="margin-bottom: 80px;">
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button class="button" style="flex: 1;">Все</button>
                <button class="button" style="flex: 1;">Отправка</button>
                <button class="button" style="flex: 1;">Получение</button>
            </div>
            
            ${historyHTML || '<p class="text-center text-gray p-20">История транзакций пуста</p>'}
        </div>
    `;
}

// 5. ЭКРАН НАСТРОЕК
function showSettingsScreen() {
    const userName = userData ? `${userData.first_name || 'User'}` : 'Гость';
    
    document.getElementById('screenTitle').textContent = '⚙️ Настройки';
    document.getElementById('screenSubtitle').textContent = 'Управление аккаунтом';
    
    document.getElementById('screenContent').innerHTML = `
        <div style="margin-bottom: 80px;">
            <div class="bg-card p-20 rounded mb-20 text-center">
                <div style="width: 80px; height: 80px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fas fa-user" style="color: white; font-size: 36px;"></i>
                </div>
                <h3 style="margin-bottom: 5px;">${userName}</h3>
                <p class="text-gray" style="font-size: 14px;">ID: #${userData ? userData.id.toString().slice(-4) : '0000'}</p>
            </div>
            
            <div class="settings-item">
                <div>
                    <div style="font-weight: 600;">Язык</div>
                    <div class="text-gray" style="font-size: 14px;">Русский</div>
                </div>
                <i class="fas fa-chevron-right text-gray"></i>
            </div>
            
            <div class="settings-item">
                <div>
                    <div style="font-weight: 600;">Тема</div>
                    <div class="text-gray" style="font-size: 14px;">Тёмная</div>
                </div>
                <i class="fas fa-chevron-right text-gray"></i>
            </div>
            
            <div class="settings-item">
                <div>
                    <div style="font-weight: 600;">Безопасность</div>
                    <div class="text-gray" style="font-size: 14px;">PIN-код, Биометрия</div>
                </div>
                <i class="fas fa-chevron-right text-gray"></i>
            </div>
            
            <div class="settings-item">
                <div>
                    <div style="font-weight: 600;">Уведомления</div>
                    <div class="text-gray" style="font-size: 14px;">Включены</div>
                </div>
                <i class="fas fa-chevron-right text-gray"></i>
            </div>
            
            <div class="settings-item">
                <div>
                    <div style="font-weight: 600;">О приложении</div>
                    <div class="text-gray" style="font-size: 14px;">Версия 1.0.0</div>
                </div>
                <i class="fas fa-chevron-right text-gray"></i>
            </div>
            
            <div class="mt-20 text-center">
                <button class="button" style="background: #FF4757;" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти из аккаунта
                </button>
            </div>
        </div>
    `;
}

// ================= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =================

// Обновить QR код для получения
function updateReceiveQR() {
    const currency = document.getElementById('receiveCurrency').value;
    const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
    const qrText = `${currency.toLowerCase()}:${address}`;
    
    document.getElementById('walletAddress').textContent = address;
    
    if (typeof QRCode !== 'undefined') {
        const canvas = document.getElementById('receiveQRCode');
        canvas.innerHTML = '';
        QRCode.toCanvas(canvas, qrText, {
            width: 200,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' }
        });
    }
}

// Сканировать QR для оплаты
function scanQRForPay() {
    if (tg && tg.showPopup) {
        tg.showPopup({
            title: '📷 Сканирование QR',
            message: 'Наведите камеру на QR-код продавца',
            buttons: [
                {id: 'demo', type: 'default', text: 'Демо: QR продавца'},
                {type: 'cancel'}
            ]
        }, function(btnId) {
            if (btnId === 'demo') {
                document.getElementById('payAddress').value = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
                document.getElementById('payAmount').value = '0.001';
                document.getElementById('payCurrency').value = 'BTC';
                document.getElementById('rubEquivalent').textContent = (0.001 * 40700 * 85).toFixed(2);
            }
        });
    } else {
        alert('Демо: QR-код сканирован\nАдрес: bc1q...wlh\nСумма: 0.001 BTC');
        document.getElementById('payAddress').value = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    }
}

// Подтверждение платежа
function showConfirmPayment() {
    const currency = document.getElementById('payCurrency').value;
    const amount = document.getElementById('payAmount').value;
    const address = document.getElementById('payAddress').value;
    
    if (!amount || !address) {
        alert('Заполните все поля');
        return;
    }
    
    const crypto = allCryptos.find(c => c.id === currency);
    const rubAmount = (amount * crypto.price * 85).toFixed(2);
    
    if (tg && tg.showPopup) {
        tg.showPopup({
            title: 'Подтверждение платежа',
            message: `Отправить ${amount} ${currency} (${rubAmount} ₽)\nна адрес: ${address.slice(0, 15)}...`,
            buttons: [
                {id: 'confirm', type: 'destructive', text: 'Подтвердить'},
                {type: 'cancel'}
            ]
        }, function(btnId) {
            if (btnId === 'confirm') {
                simulatePayment(currency, amount, rubAmount);
            }
        });
    } else {
        if (confirm(`Отправить ${amount} ${currency} (${rubAmount} ₽)?`)) {
            simulatePayment(currency, amount, rubAmount);
        }
    }
}

// Имитация платежа
function simulatePayment(currency, amount, rubAmount) {
    // Показать анимацию
    document.getElementById('paymentSuccess').style.display = 'flex';
    
    // Обновить баланс (фейковое)
    setTimeout(() => {
        const crypto = allCryptos.find(c => c.id === currency);
        if (crypto) {
            crypto.balance -= parseFloat(amount);
        }
        
        // Добавить в историю
        fakeHistory.unshift({
            id: fakeHistory.length + 1,
            type: 'send',
            currency: currency,
            amount: parseFloat(amount),
            address: document.getElementById('payAddress').value.slice(0, 10) + '...',
            date: 'Только что',
            status: 'success',
            rubAmount: parseFloat(rubAmount)
        });
        
        // Вернуться на главную
        setTimeout(() => {
            hidePaymentSuccess();
            showScreen('main');
        }, 1500);
    }, 1000);
}

// Скрыть попап успешного платежа
function hidePaymentSuccess() {
    document.getElementById('paymentSuccess').style.display = 'none';
}

// Копировать адрес
function copyAddress() {
    const address = document.getElementById('walletAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        if (tg && tg.showAlert) {
            tg.showAlert('Адрес скопирован!');
        } else {
            alert('Адрес скопирован в буфер обмена');
        }
    });
}

// Поделиться адресом
function shareAddress() {
    const address = document.getElementById('walletAddress').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Мой крипто-адрес',
            text: `Мой адрес для пополнения: ${address}`,
            url: window.location.href
        });
    } else {
        alert(`Адрес для отправки: ${address}`);
    }
}

// Выбрать валюту
function selectCurrency(currencyId) {
    document.getElementById('payCurrency').value = currencyId;
    showScreen('pay');
}

// Выйти
function logout() {
    if (confirm('Выйти из аккаунта?')) {
        showScreen('main');
    }
}

// Инициализация QR библиотеки
if (typeof QRCode === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
    document.head.appendChild(script);
}
