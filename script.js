// Görsel Üretme Fonksiyonları
function openImageModal() {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('image-loading').style.display = 'none';
    document.getElementById('image-result').style.display = 'none';
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
}

function generateImage(productName) {
    const imageLoading = document.getElementById('image-loading');
    const imageResult = document.getElementById('image-result');
    const generatedImage = document.getElementById('generated-image');
    
    imageLoading.style.display = 'block';
    imageResult.style.display = 'none';
    
    const stages = ['stage1', 'stage2', 'stage3', 'stage4'];
    stages.forEach(stage => {
        document.getElementById(stage).classList.remove('active');
    });
    
    let currentStage = 0;
    const stageInterval = setInterval(() => {
        if (currentStage > 0) {
            document.getElementById(stages[currentStage - 1]).classList.remove('active');
        }
        document.getElementById(stages[currentStage]).classList.add('active');
        currentStage++;
        
        if (currentStage >= stages.length) {
            clearInterval(stageInterval);
            
            // Görseli oluştur (SÜRE ARTIRILDI: 3000ms)
            setTimeout(() => {
                const imageUrls = {
                    'RTX 8090': 'ez.png',
                    'RTX 8090 2': '8090.png',
                    'Intel 20900K': '20900k.png',
                    'Gaming Room': 'gamer room.png',
                    'Gaming PC': 'gamerpc.png',
                    'Gaming PC 2': 'gaming pc.png',
                    'RX 10090': 'gg.png',
                    'RGB Setup': 'rgb setup.png'
                };
                
                generatedImage.src = imageUrls[productName];
                generatedImage.alt = productName;
                
                imageLoading.style.display = 'none';
                imageResult.style.display = 'block';
                
                showNotification(`${productName} görseli oluşturuldu!`);
            }, 3000); // 1000ms yerine 3000ms - 3 saniye
        }
    }, 1200); // 800ms yerine 1200ms - her aşama daha uzun
}

// Global fonksiyonlar
function goToPriceSites() {
    const sites = [
        'https://www.hepsiburada.com',
        'https://www.vatanbilgisayar.com',
        'https://www.trendyol.com',
        'https://www.amazon.com.tr',
        'https://www.technopat.net',
        'https://www.donanimhaber.com'
    ];
    
    const randomSite = sites[Math.floor(Math.random() * sites.length)];
    window.open(randomSite, '_blank');
}

function askQuestionDirectly(question) {
    handleUserMessageDirectly(question);
    if (window.innerWidth <= 768) {
        closeMobileSidebar();
    }
}

// Gelişmiş veritabanı - PC bileşenleri hakkında sorular ve cevaplar
const knowledgeBase = [
    {
        question: "işlemci nedir",
        answer: "İşlemci (CPU), bir bilgisayarın beyni olarak kabul edilir. Tüm hesaplamaları yapar ve diğer bileşenleri yönetir. Örneğin Intel Core i7 veya AMD Ryzen 7 gibi modeller popülerdir."
    },
    {
        question: "ekran kartı ne işe yarar",
        answer: "Ekran kartı (GPU), bilgisayarın görüntüleri monitöre aktarmasından sorumludur. Özellikle oyun ve grafik tasarımı için önemlidir. NVIDIA ve AMD başlıca ekran kartı üreticileridir."
    },
    {
        question: "ram nedir",
        answer: "RAM (Random Access Memory), bilgisayarın geçici veri depoladığı bellektir. Daha fazla RAM, daha hızlı çoklu görev yapabilme imkanı sağlar. 8GB günümüz için minimum, 16GB orta seviye, 32GB ve üzeri ise profesyonel kullanım için idealdir."
    },
    {
        question: "ssd nedir",
        answer: "SSD (Solid State Drive), geleneksel hard disklerden çok daha hızlı çalışan depolama birimidir. Daha hızlı açılış süreleri ve veri transferi sağlar."
    },
    {
        question: "anakart nedir",
        answer: "Anakart, bilgisayarın tüm bileşenlerini birbirine bağlayan ana devre kartıdır. İşlemci, RAM, ekran kartı gibi bileşenler anakart üzerine takılır."
    }
];

// Global değişkenler
let chatContext = [];
const MAX_CONTEXT_LENGTH = 10;

// Mobil sidebar fonksiyonları
function openMobileSidebar() {
    document.getElementById('suggestion-sidebar').classList.add('active');
    document.getElementById('mobile-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    document.getElementById('suggestion-sidebar').classList.remove('active');
    document.getElementById('mobile-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    // Hoşgeldin animasyonunu göster
    const welcomeAnimation = document.getElementById('welcome-animation');
    const mainContainer = document.querySelector('.main-container');
    
    // 3 saniye sonra hoşgeldin animasyonunu kapat ve ana içeriği göster
    setTimeout(() => {
        welcomeAnimation.style.display = 'none';
        mainContainer.style.display = 'flex';
        
        // Ana içerik gösterildikten sonra ilk mesajı ekle
        setTimeout(() => {
            addMessageToChat("Merhaba! Hoşgeldiniz. Ben MERA AI beta 0.9, PC bileşenleri hakkında sorularınızı yanıtlayabilen gelişmiş bir yapay zeka asistanıyım. Sağ taraftaki 'Görsel Üretme' butonuna tıklayarak çeşitli PC bileşenlerinin görsellerini oluşturabilirsiniz. Size nasıl yardımcı olabilirim?", 'ai');
        }, 300);
    }, 3000);

    // Elementleri seç
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');
    const allQuestionsBtn = document.getElementById('all-questions-btn');
    const modal = document.getElementById('questions-modal');
    const closeBtn = document.querySelector('.close');
    const questionsList = document.getElementById('questions-list');
    const questionSearch = document.getElementById('question-search');
    const themeToggle = document.getElementById('theme-toggle');
    const notification = document.getElementById('notification');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarClose = document.getElementById('sidebar-close');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    // Mobil menü butonu
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
    
    // Sidebar kapatma butonu
    sidebarClose.addEventListener('click', closeMobileSidebar);
    
    // Mobil overlay tıklama
    mobileOverlay.addEventListener('click', closeMobileSidebar);
    
    // Tema değiştirme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Tüm sorular modalını açma/kapama
    allQuestionsBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        populateQuestionsList();
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        if (event.target == document.getElementById('image-modal')) {
            closeImageModal();
        }
    });
    
    // Soru arama
    questionSearch.addEventListener('input', function() {
        populateQuestionsList(this.value.toLowerCase());
    });
    
    // Soru listesini doldur
    function populateQuestionsList(searchTerm = '') {
        questionsList.innerHTML = '';
        knowledgeBase.forEach((item, index) => {
            if (searchTerm === '' || item.question.toLowerCase().includes(searchTerm)) {
                const questionItem = document.createElement('div');
                questionItem.classList.add('question-item');
                
                const questionText = document.createElement('div');
                questionText.textContent = item.question;
                
                const favoriteBtn = document.createElement('button');
                favoriteBtn.classList.add('favorite-btn');
                favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
                favoriteBtn.title = 'Favorilere ekle';
                
                // Favori kontrolü
                const favorites = getFavorites();
                if (favorites.includes(index)) {
                    favoriteBtn.classList.add('active');
                    favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
                }
                
                favoriteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleFavorite(index);
                    populateQuestionsList(searchTerm);
                });
                
                questionItem.appendChild(questionText);
                questionItem.appendChild(favoriteBtn);
                
                questionItem.addEventListener('click', function() {
                    userInput.value = item.question;
                    modal.style.display = 'none';
                    handleUserMessage();
                });
                
                questionsList.appendChild(questionItem);
            }
        });
    }
    
    // Favori yönetimi
    function getFavorites() {
        return JSON.parse(localStorage.getItem('meraFavorites')) || [];
    }
    
    function toggleFavorite(index) {
        const favorites = getFavorites();
        const favoriteIndex = favorites.indexOf(index);
        
        if (favoriteIndex === -1) {
            favorites.push(index);
            showNotification('Favorilere eklendi!');
        } else {
            favorites.splice(favoriteIndex, 1);
            showNotification('Favorilerden kaldırıldı!');
        }
        
        localStorage.setItem('meraFavorites', JSON.stringify(favorites));
    }
    
    // Sohbet geçmişi kaydetme
    function saveToHistory(question, answer) {
        const history = JSON.parse(localStorage.getItem('meraChatHistory')) || [];
        history.push({
            question: question,
            answer: answer,
            timestamp: new Date().toISOString()
        });
        
        // Son 50 mesajı sakla
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }
        
        localStorage.setItem('meraChatHistory', JSON.stringify(history));
    }
    
    // Bağlam hafızası güncelleme
    function updateContext(question, answer) {
        chatContext.push({ role: 'user', content: question });
        chatContext.push({ role: 'assistant', content: answer });
        
        if (chatContext.length > MAX_CONTEXT_LENGTH * 2) {
            chatContext = chatContext.slice(-MAX_CONTEXT_LENGTH * 2);
        }
    }
    
    // Gönder butonuna tıklama olayı
    sendBtn.addEventListener('click', handleUserMessage);
    
    // Enter tuşuna basma olayı
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Gönder butonunda yükleme animasyonunu göster
        const btnText = sendBtn.querySelector('.btn-text');
        const btnLoading = sendBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        
        // Kullanıcı mesajını sohbet kutusuna ekle
        addMessageToChat(message, 'user');
        
        // "Düşünülüyor..." mesajını göster
        const thinkingMessage = addThinkingMessage();
        
        // Yapay zeka yanıtını al
        setTimeout(() => {
            const response = getAIResponse(message);
            
            // "Düşünülüyor..." mesajını kaldır
            thinkingMessage.remove();
            
            // Yanıtı sohbet kutusuna ekle
            addMessageToChat(response, 'ai');
            
            // Geçmişe kaydet ve bağlamı güncelle
            saveToHistory(message, response);
            updateContext(message, response);
            
            // Yükleme animasyonunu kapat
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            
            // Sohbet kutusunu en aşağı kaydır
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 2000);
        
        // Giriş alanını temizle
        userInput.value = '';
    }
    
    // Direkt soru sorma fonksiyonu (sağdaki butonlar için)
    function handleUserMessageDirectly(question) {
        // Gönder butonunda yükleme animasyonunu göster
        const btnText = sendBtn.querySelector('.btn-text');
        const btnLoading = sendBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        
        // Kullanıcı mesajını sohbet kutusuna ekle
        addMessageToChat(question, 'user');
        
        // "Düşünülüyor..." mesajını göster
        const thinkingMessage = addThinkingMessage();
        
        // Yapay zeka yanıtını al
        setTimeout(() => {
            const response = getAIResponse(question);
            
            // "Düşünülüyor..." mesajını kaldır
            thinkingMessage.remove();
            
            // Yanıtı sohbet kutusuna ekle
            addMessageToChat(response, 'ai');
            
            // Geçmişe kaydet ve bağlamı güncelle
            saveToHistory(question, response);
            updateContext(question, response);
            
            // Yükleme animasyonunu kapat
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            
            // Sohbet kutusunu en aşağı kaydır
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 2000);
    }
    
    function addThinkingMessage() {
        const thinkingElement = document.createElement('div');
        thinkingElement.classList.add('message', 'ai-message');
        thinkingElement.style.opacity = '0.7';
        
        const thinkingHeader = document.createElement('div');
        thinkingHeader.classList.add('message-header');
        thinkingHeader.textContent = 'MERA AI beta 0.9 düşünüyor...';
        
        const thinkingAnimation = document.createElement('div');
        thinkingAnimation.classList.add('thinking-animation');
        thinkingAnimation.innerHTML = '<span></span><span></span><span></span>';
        
        thinkingElement.appendChild(thinkingHeader);
        thinkingElement.appendChild(thinkingAnimation);
        chatBox.appendChild(thinkingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return thinkingElement;
    }
    
    function addMessageToChat(message, sender, animate = true) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        
        if (!animate) {
            messageElement.style.animation = 'none';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }
        
        const messageHeader = document.createElement('div');
        messageHeader.classList.add('message-header');
        messageHeader.textContent = sender === 'user' ? 'Siz' : 'MERA AI beta 0.9';
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        messageElement.appendChild(messageHeader);
        messageElement.appendChild(messageText);
        chatBox.appendChild(messageElement);
        
        // Sohbet kutusunu en aşağı kaydır
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return messageElement;
    }
    
    function showNotification(text) {
        notification.textContent = text;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
    
    function getAIResponse(userMessage) {
        // Bağlam hafızasını kullanarak daha akıllı yanıtlar
        const context = chatContext.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        const fullMessage = context + '\nuser: ' + userMessage;
        
        // Gelen mesajı küçük harfe çevir ve soru işaretlerini kaldır
        const cleanMessage = userMessage.toLowerCase().replace('?', '');
        
        // Tam eşleşme kontrolü
        for (const item of knowledgeBase) {
            if (item.question.toLowerCase() === cleanMessage) {
                return item.answer;
            }
        }
        
        // Kısmi eşleşme kontrolü
        for (const item of knowledgeBase) {
            if (cleanMessage.includes(item.question.toLowerCase()) || 
                item.question.toLowerCase().includes(cleanMessage)) {
                return item.answer;
            }
        }
        
        // Bağlamsal yanıt
        if (chatContext.length > 0) {
            const lastUserMessage = chatContext[chatContext.length - 1].content.toLowerCase();
            
            // Önceki mesajla ilişkili yanıtlar
            if (lastUserMessage.includes("ekran kartı") && userMessage.includes("fiyat")) {
                return "Ekran kartı fiyatları model ve markaya göre değişiklik gösterir. RTX 3000 serisi için güncel fiyatları araştırma sitelerinden kontrol etmenizi öneririm.";
            }
            
            if (lastUserMessage.includes("işlemci") && userMessage.includes("öner")) {
                return "Hangi bütçe ve kullanım amacına uygun işlemci önermemi istiyorsunuz? Oyun, ofis kullanımı, video düzenleme gibi detayları belirtirseniz daha iyi yardımcı olabilirim.";
            }
        }
        
        // Varsayılan yanıtlar
        const defaultResponses = [
            "Bu konu hakkında daha detaylı bilgi verebilmem için sorunuzu biraz daha spesifik hale getirebilir misiniz?",
            "PC bileşenleri hakkında size nasıl yardımcı olabilirim? İşlemciler, ekran kartları, RAM'ler veya diğer bileşenlerle ilgili sorularınızı yanıtlayabilirim.",
            "Üzgünüm, bu sorunun cevabını bilgi tabanımda bulamadım. Başka bir soru sormak ister misiniz?",
            "Bu konuda size yardımcı olabilmem için sorunuzu farklı şekilde ifade edebilir misiniz?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
});
