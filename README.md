# BipBip 🦊🐦

Subway Surfers benzeri 3D endless runner oyunu. Tilki olarak BipBip'i yakala!

## 🎮 Oynanış

- BipBip önünde koşuyor, sen onu yakalamaya çalışıyorsun
- Sağa/sola kaydır → Şerit değiştir
- Yukarı kaydır → Zıpla
- Aşağı kaydır → Kay
- Engelleri aş, coin topla, BipBip'e yaklaş!

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev

# Production build
npm run build
```

## 🛠️ Teknolojiler

- **Three.js** - 3D grafik
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı build tool
- **GitHub Pages** - Hosting

## 📱 Test

Oyunu test etmek için:

- **Lokal**: <http://localhost:5173>
- **Canlı**: https://[username].github.io/bipbip/

## 📁 Proje Yapısı

```
bipbip/
├── src/
│   ├── main.ts           # Entry point
│   ├── Game.ts           # Ana oyun controller
│   ├── engine/           # 3D engine bileşenleri
│   ├── characters/       # Karakter sınıfları
│   ├── objects/          # Engel, coin vb.
│   ├── ui/               # UI ekranları
│   └── data/             # Veri yönetimi
├── models/               # 3D GLB modeller
├── tasarim/              # UI tasarım referansları
└── index.html
```

## 📜 Lisans

MIT
