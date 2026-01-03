# Changelog

Tüm önemli değişiklikler bu dosyada belgelenecektir.

## [0.1.0] - 2026-01-03

### Eklenen

- 🎮 Temel oyun yapısı oluşturuldu
  - Three.js tabanlı 3D sahne
  - 3 şeritli endless parkur sistemi
  - Touch/swipe ve klavye kontrolleri
  
- 🦊 Karakter sistemi
  - Tilki (Ana karakter) - GLB modellerden yükleme
  - BipBip (Hedef karakter) - AI kontrollü
  - Animasyon sistemi (koşma, zıplama, kayma)
  
- 🏃 Oyun mekaniği
  - Kovalama sistemi (gap tracking)
  - Engel sistemi (zıplama/kayma engelleri)
  - Coin toplama
  - Hız artışı (difficulty progression)
  
- 🎨 UI Ekranları
  - Başlangıç ekranı
  - Oyun içi HUD (skor, coin, mesafe göstergesi)
  - Oyun sonu ekranı
  - Mağaza ekranı (karakterler/güçler)
  
- 💾 Veri sistemi
  - LocalStorage kayıt sistemi
  - Skor ve coin takibi
  - Karakter/güç satın alma

- 🚀 CI/CD
  - GitHub Actions ile otomatik deployment
  - GitHub Pages hosting

### Yapılacaklar

- [ ] Power-up aktif kullanımı
- [ ] Tuzak mekaniği (BipBip'in bıraktığı)
- [ ] Ses efektleri
- [ ] Jetpack uçuş katmanı
- [ ] Çoklu karakter seçimi
