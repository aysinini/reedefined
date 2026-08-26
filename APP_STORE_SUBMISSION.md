# App Store & Play Store Gönderim Kontrol Listesi

Reedefined'ın Capacitor ile sarmalanmış mobil uygulamasını mağazalara göndermek için gereken idari adımlar. Teknik/kod tarafı tamamlandı (bkz. `capacitor.config.json`, `.github/workflows/ios-build.yml`); burada listelenenler senin yapman gereken hesap/idari işler.

**Bundle ID / Package name (her iki mağazada da aynı olmalı):** `com.reedefined.magazine`
**Custom URL scheme (OAuth handoff için):** `reedefined://`

---

## App Store (iOS)

- [ ] Apple Developer Program'a kayıt ol (yıllık $99)
- [ ] App Store Connect'te `com.reedefined.magazine` identifier'ını kaydet
- [ ] Distribution sertifikası + App Store provisioning profile oluştur
- [ ] Gerçek imzalı build almak için bir yol belirle:
  - [ ] Seçenek A: Xcode 26+ çalıştırabilen bir Mac bul (bu makine çalıştıramıyor)
  - [ ] Seçenek B: Sertifikaları GitHub Actions secret olarak saklayıp `.github/workflows/ios-build.yml`'i imzalı release build alacak şekilde genişlet
- [ ] Gerçek app ikonu seti tasarlat (şu an placeholder "R" monogramı) — 1024x1024 App Store ikonu dahil
- [ ] Ekran görüntüleri hazırla (iPhone 6.9", 6.5", varsa iPad boyutları)
- [ ] Gizlilik politikası URL'sini gir (`https://reedefined.app/privacy.html` zaten mevcut)
- [ ] App Privacy (Nutrition Label) formunu doldur — toplanan veri türleri
- [ ] Export Compliance beyanını doldur (standart HTTPS için genelde basit)
- [ ] Yaş derecelendirmesi anketini doldur
- [ ] Destek URL'si, pazarlama metni (başlık, alt başlık, açıklama, anahtar kelimeler) yaz
- [ ] TestFlight ile beta test yap (önerilir, zorunlu değil)
- [ ] İnceleme notlarına native değer katan yönleri vurgula ("sadece web sitesi sarmalayıcısı" reddi riskine karşı)
- [ ] *(opsiyonel iyileştirme)* Universal Links için `apple-app-site-association` dosyasını gerçek Team ID ile `reedefined.app`'e ekle

## Google Play Store (Android)

- [ ] Google Play Console'a kayıt ol (tek seferlik $25)
- [ ] Uygulama kaydı oluştur, package name: `com.reedefined.magazine`
- [ ] Play App Signing'e kayıt ol, upload key oluştur
- [ ] İmzalı release build al (`./gradlew bundleRelease` + imzalama — şu anki CI sadece debug/unsigned build alıyor)
- [ ] Gerçek app ikonu, feature graphic (1024x500), ekran görüntüleri hazırla
- [ ] Gizlilik politikası URL'sini gir
- [ ] Data safety formunu doldur
- [ ] İçerik derecelendirmesi anketini (IARC) doldur
- [ ] Hedef kitle ve reklam beyanlarını doldur
- [ ] Store listing metnini yaz (kısa açıklama, tam açıklama, kategori)
- [ ] İç test / kapalı test track'i ile dene (önerilir)

## Her ikisi için ortak

- [ ] Versiyon numaralandırma stratejisi belirle (build number / version code artışı)
- [ ] Hesaplar açıldıktan sonra gerçek bir hesapla uçtan uca OAuth testini yap (TikTok/Spotify → `callback.html` → uygulama geri dönüşü)
