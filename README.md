# İyi ki doğdun, Emre 🎉

Emre'ye dijital doğum günü hediyesi. Next.js (statik) + Tailwind + Framer Motion.

## İçeriği düzenlemek
Her şey tek dosyada: **`data/birthday.ts`**

- `letters` → mektuplar. Her birine `message` yaz; paragrafları boş satırla ayır.
  Boş bırakılan mektup sitede "henüz yolda" diye görünür.
- `birthDate` (`"1990-05-12"` gibi) → doldurursan "yaşadığın zaman" sayacı açılır.
- `age` → başlıkta "30. yaşın kutlu olsun" yazar.
- `photos` → `public/fotolar/` içine koyup buraya eklersen "anılar" bölümü açılır.
- `musicSrc` → kendi şarkın (`public/` içine). Boşsa müzik kutusu melodisi çalar.

## Sürprizler
Hediye kutusu · patlatılan balonlar · isme 3 kez dokununca emoji yağmuru ·
üfleyerek (mikrofon) söndürülen mumlar · mektup zarfları · hepsi okununca açılan
gizli mektup · kazı-kazan · havai fişekler.

## Yerelde çalıştır
```bash
npm install
npm run dev
```

## Yayın (Netlify)
GitHub'a gönder → Netlify'da depoyu bağla. Ayarlar `netlify.toml` içinde hazır
(`npm run build`, yayın klasörü `out`).
