// Arctic Wallet Demo - Full Version
console.log('🚀 Arctic Wallet loaded');

// Telegram WebApp
let tg = window.Telegram.WebApp;
let userData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM ready');
    
    // Initialize Telegram WebApp
    if (tg && tg.initDataUnsafe) {
        userData = tg.initDataUnsafe.user;
        tg.expand();
        tg.BackButton.show();
        tg.BackButton.onClick(goBack);
        console.log('✅ Telegram WebApp initialized');
    }
    
    // Show interface
    showMainApp();
    
    // Load Font Awesome if not loaded
    if (!document.querySelector('.fa')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }
});

// Main application
function showMainApp() {
    const userName = userData ? 
        `${userData.first_name || 'Пользователь'}` : 'Аноним';
    
    document.getElementById('app').innerHTML = `
        <div class="header">
            <h2>👋 ${userName}</h2>
            <p>Ваш крипто-кошелёк</p>
        </div>
        
        <div style="background: var(--card-bg); padding: 25px; border-radius: 20px; margin: 25px 0; text-align: center;">
            <p style="color: var(--text-gray); font-size: 14px; margin-bottom: 10px;">Общий баланс</p>
            <h1 style="font-size: 42px; margin-bottom: 15px;">$1,245.50</h1>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <span style="color: #00C6A2;">▲ 2.3%</span>
                <span style="color: var(--text-gray);">≈ 0.025 BTC</span>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
            <button class="button" onclick="generateQR()">
                <i class="fas fa-qrcode" style="font-size: 20px; margin-bottom: 8px;"></i><br>
                Получить QR
            </button>
            <button class="button button-primary" onclick="scanQR()">
                <i class="fas fa-camera" style="font-size: 20px; margin-bottom: 8px;"></i><br>
                Сканировать
            </button>
        </div>
        
        <h3 style="margin: 30px 0 15px 0;">💰 Мои активы</h3>
        
        <div style="background: var(--card-bg); border-radius: 15px; padding: 15px;">
            <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="width: 40px; height: 40px; background: #F7931A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <i class="fab fa-bitcoin" style="color: white; font-size: 20px;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600;">Bitcoin</div>
                    <div style="color: var(--text-gray); font-size: 14px;">0.0021 BTC</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600;">$85.40</div>
                    <div style="color: #00C6A2; font-size: 14px;">+2.3%</div>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; padding: 15px 0;">
                <div style="width: 40px; height: 40px; background: #627EEA; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <i class="fab fa-ethereum" style="color: white; font-size: 20px;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600;">Ethereum</div>
                    <div style="color: var(--text-gray); font-size: 14px;">0.15 ETH</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600;">$275.60</div>
                    <div style="color: #00C6A2; font-size: 14px;">+1.8%</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; color: var(--text-gray); font-size: 14px; text-align: center;">
            <p>Arctic Wallet • Демо-версия</p>
        </div>
    `;
}

// Generate QR Code
function generateQR() {
    document.getElementById('app').style.display = 'none';
    const qrSection = document.getElementById('qr-section');
    qrSection.style.display = 'block';
    
    qrSection.innerHTML = `
        <div class="header" style="margin-bottom: 20px;">
            <h2>📲 QR для оплаты</h2>
            <p>Покажите продавцу</p>
        </div>
        
        <div class="qr-container">
            <canvas id="qrcodeCanvas"></canvas>
        </div>
        
        <div style="background: var(--card-bg); padding: 15px; border-radius: 15px; margin: 20px 0; text-align: center;">
            <p style="color: var(--text-gray); margin-bottom: 10px;">Адрес кошелька</p>
            <p style="font-family: monospace; word-break: break-all; font-size: 14px;">bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq</p>
            <p style="color: #00C6A2; margin-top: 10px;">Сумма: 0.001 BTC</p>
        </div>
        
        <button class="button" onclick="goBack()">
            <i class="fas fa-arrow-left"></i> Назад в кошелёк
        </button>
    `;
    
    // Generate QR
    setTimeout(() => {
        if (typeof QRCode !== 'undefined') {
            QRCode.toCanvas(document.getElementById('qrcodeCanvas'), 
                'bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq?amount=0.001&label=Payment',
                { width: 200, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } }
            );
        }
    }, 100);
}

// Scan QR Code
function scanQR() {
    if (tg && tg.showPopup) {
        tg.showPopup({
            title: '📷 Сканирование QR',
            message: 'Наведите камеру на QR-код продавца.\n\nВ демо-версии нажмите "Демо оплата".',
            buttons: [
                {id: 'demo', type: 'default', text: 'Демо оплата'},
                {type: 'cancel'}
            ]
        }, function(btnId) {
            if (btnId === 'demo') {
                tg.showAlert('🔍 Сканирую QR-код...');
                setTimeout(() => {
                    tg.showAlert('✅ Оплата успешна!\n\n0.001 BTC → 4,250 ₽\nПродавец получил рубли.');
                    showMainApp();
                }, 2000);
            }
        });
    } else {
        alert('Демо: Оплата 0.001 BTC прошла успешно!\nПродавец получил 4,250 рублей.');
    }
}

// Back button
function goBack() {
    if (document.getElementById('qr-section').style.display === 'block') {
        document.getElementById('qr-section').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    } else if (tg && tg.close) {
        tg.close();
    }
}

// Initialize QR code library if not loaded
if (typeof QRCode === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
    document.head.appendChild(script);
}
