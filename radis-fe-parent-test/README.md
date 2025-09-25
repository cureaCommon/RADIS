# RADIS Klinik Karar Destek Sistemi

### 1. Genel Bakış

Bu doküman, RADIS Klinik Karar Destek Sistemi'nin mimarisini, bileşenlerini, kurulumunu ve çalışma prensiplerini açıklamaktadır. Proje, bir ana "host" uygulama (**radis-fe-parent**) ve bu uygulama içine `<iframe>` ile gömülü olarak çalışan bir karar destek modülünden (**radis-frontend**) oluşmaktadır.

### 2. Mimarî

Proje, iki ayrı ve bağımsız çalışan React (Vite) uygulamasından meydana gelir:

1.  **Parent Proje (radis-fe-parent):**
    * Kullanıcı kimlik doğrulama işlemlerini ve oturum yönetimini üstlenir.
    * Hasta verilerini hazırlar ve **radis-frontend** modülüne aktarılacak olan başlangıç tetkikini seçer.
    * **radis-frontend** projesini bir `<iframe>` içinde render eder ve `window.postMessage` API'si aracılığıyla başlangıç verilerini (hasta bilgisi, `authToken`, seçilen tetkik) iletir.

2.  **Child Proje (radis-frontend):**
    * Parent projeden `postMessage` ile gelen verileri dinleyerek kendini başlatır.
    * Klinik karar destek akışını yönetir: Kullanıcıya primer endikasyon, endikasyon detayı (varyant) seçtirir.
    * Seçilen kriterlere göre backend tarafından uygunluk skorlarını ve önerilen tetkikleri alır, kullanıcıya sunar.
    * Kullanıcının son seçimini veya manuel giriş gerekçesini birleştirerek sonucu backend API'sine kaydeder.


### 3. Kullanılan Teknolojiler

* **Framework:** React(Vite)
* **Dil:** TypeScript
* **Asenkron Veri Yönetimi:** TanStack Query (React Query)
* **HTTP İstekleri:** Axios
* **Stil/UI:** Tailwind CSS
* **İkonlar:** Lucide React
* **Routing (Parent):** React Router DOM

---

### 4. Kurulum ve Çalıştırma

Projeyi yerel makinede çalıştırmak için aşağıdaki adımların eksiksiz olarak takip edilmesi gerekmektedir.

#### Adım 1: Bağımlılıkları Yükleme

Her iki projenin de (`Parent` ve `Child`) ana dizinlerinde ayrı ayrı terminal açarak aşağıdaki komutu çalıştırın:
```bash
npm install
```

### 5.  Port Yapılandırması ve İletişim
Projenin geliştirme ortamında kararlı bir şekilde çalışması ve iki uygulama **(Parent ve Child)** arasındaki iletişimin sorunsuz kurulabilmesi için port numaraları sabitlenmiştir. Bu yapılandırma, Vite'ın varsayılan olarak boş bulduğu ilk porta yerleşme davranışının önüne geçerek, iframe iletişiminde oluşabilecek hataları engeller.

#### Mevcut Port Yapılandırması:
* Parent Proje (radis-fe-parent): http://localhost:5174

* Child Proje (radis-frontend): http://localhost:5173

Bu sabitleme işlemi, her projenin kök dizininde bulunan `vite.config.ts` dosyalarındaki `server.port` ayarı ile yapılmıştır.

#### Portları Değiştirme İhtiyacı Olursa:
Gelecekte bu port numaralarını değiştirmeniz gerekirse, uygulamanın iletişiminin kopmaması için iki adımlı bir işlem yapmanız zorunludur:

1. `vite.config.ts` Dosyasını Güncelleyin: Portunu değiştirmek istediğiniz projenin (Parent veya Child) `vite.config.ts` dosyasındaki port değerini güncelleyin.
2. #### Referans Veren Projeyi Güncelleyin:
* Eğer Child Proje'nin portunu (5173) değiştirirseniz: Parent Proje'nin `src/App.tsx` dosyasına gidip `iframeUrl` ve `childOrigin` değişkenlerinin değerini yeni port numarasıyla güncellemelisiniz.

* Eğer Parent Proje'nin portunu (5174) değiştirirseniz: Child Proje'nin `src/context/RadisContext.tsx` dosyasına gidip `parentOrigin` değişkeninin değerini yeni port numarasıyla güncellemelisiniz.

### 6. Geliştirme Sunucularını Başlatma
Yukarıdaki adımları tamamladıktan sonra, iki ayrı terminal penceresinde, ilgili proje klasörlerindeyken `npm run dev` komutunu çalıştırın:
```bash
# Terminal 1: Parent Proje Klasöründe
npm run dev

# Terminal 2: Child Proje Klasöründe
npm run dev
```
Projeler, `vite.config.ts` dosyalarında belirttiğiniz `5174` ve `5173` portlarında otomatik olarak başlayacaktır.

### 7. Proje Yapısı ve Detayları
#### A. Parent Proje
Parent proje, sisteme giriş kapısıdır ve Child modülü için bir "host" görevi görür.

* `App.tsx`: Uygulamanın ana giriş noktasıdır. Otomatik giriş (`autoLogin`) mantığını, yönlendirmeleri (`react-router-dom`) ve `QueryClientProvider` sarmalayıcısını içerir.
* `PatientPage.tsx`: Child projeyi barındıran `<iframe>`'i render eder. Tetkik seçimi yapıldıktan sonra, `postMessage` aracılığıyla Child'a authToken dahil olmak üzere tüm başlangıç verilerini gönderir. Child'dan gelen `child-ready` mesajını dinleyerek doğru zamanda veri gönderimini sağlar.
* `ExamSelection.tsx`: useQuery kullanarak API'den tüm tetkikleri çeker ve kullanıcıya bir arama arayüzü ile sunar.
* `api/authService.ts`: Login işlemlerini gerçekleştirir ve alınan token'ı sessionStorage'a kaydeder.
* `api/apiClient.ts`: Proje genelinde kullanılan axios istemcisidir. İstek (request) interceptor'ı ile her API çağrısına otomatik olarak Authorization başlığını ekler. Yanıt (response) interceptor'ı ile 401 Unauthorized gibi genel hataları yönetir.

#### B. Child Proje
Child proje, asıl klinik karar destek akışının yönetildiği modüldür.

* `context/RadisContext.tsx`: Uygulamanın merkezi durum (state) yönetimini ve ana iş mantığını barındıran yapıdır.

    * `message` olay dinleyicisi ile Parent'tan gelen verileri alır, `sessionStorage`'a ve uygulamanın state'ine kaydeder.
    * Parent'a hazır olduğunu bildirmek için child-ready mesajı gönderir.
    * Adımlar (`step`), kullanıcı seçimleri (`selectedExam`, `selectedIndication` vb.) ve skorlama sonuçları gibi tüm global state'i yönetir.
    * `components/steps/ClinicalIndication.tsx`: Kullanıcının `Primer Endikasyon` ve `Endikasyon Detayı (Varyant)` seçtiği ikinci adımı yönetir.
    * `components/steps/Suitability.tsx`: Akışın son ve en karmaşık adımıdır. İki ana senaryoyu yönetir:
        1. **Öneri Akışı**: Kullanıcının seçimlerine göre API'den uygunluk skorlarını ve önerileri çeker. Sonuçları ScoreCard bileşenleriyle listeler.
        2. **Manuel Akış**: Kullanıcı aradığını bulamazsa, "Önerileri Atla" seçeneği ile bu akışa geçer. Sistem, bir gerekçe ve klinik not alarak isteği doğrudan kaydeder.
    * `api/apiService.ts`: Child projenin ihtiyaç duyduğu tüm API çağrılarını (endikasyonları, detayları, skorları getirme ve tanıyı kaydetme) içerir.

### 8. Önemli Notlar
* **Backend Bağımlılığı**: Tüm sistemin çalışması için `http://localhost:8080` adresinde çalışan bir backend servisi zorunludur.
* **Token Yönetimi**: Oturum token'ı (`authToken`), Parent'ta alınır, `sessionStorage`'a yazılır ve Child'a `postMessage` ile iletilir.  Child da bu token'ı alıp kendi `sessionStorage`'ına yazar. Bu sayede her iki uygulama da aynı oturum üzerinden güvenli API istekleri yapabilir.
* **Hata Yönetimi**: API kaynaklı hatalar, TanStack Query'nin `error` ve `status` durumları kullanılarak bileşen bazında yönetilir ve kullanıcıya `ErrorMessage.tsx` bileşeni ile gösterilir.  Genel yetkilendirme hataları ise axios interceptor'ları ile global olarak yakalanır.


