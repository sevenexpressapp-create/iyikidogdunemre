// ─────────────────────────────────────────────────────────────
//  Sitedeki TÜM içerik buradan yönetilir.
//  Mesajlar gelince sadece "letters" listesini doldurman yeterli.
// ─────────────────────────────────────────────────────────────

export type Letter = {
  id: string; // benzersiz, değiştirme (okundu bilgisi buna bağlı)
  title: string; // zarfın üstünde el yazısıyla görünür: "Annen", "Kızın"...
  name?: string; // gerçek ad (isteğe bağlı, küçük yazıyla görünür)
  emoji: string; // mühürdeki simge
  seal: string; // mühür rengi
  message: string; // paragrafları boş satırla ayır. Boşsa "mektup yolda" görünür
  signature?: string; // imza (boşsa title kullanılır)
};

export type Photo = { src: string; caption?: string };

export const birthday = {
  name: "Emre",
  from: "Serhat",

  // Doğum tarihi "YYYY-MM-DD". Boşsa "yaşadığın zaman" sayacı gizlenir.
  birthDate: "",
  // Kaçıncı yaş. null ise başlıkta yaş yazmaz.
  age: 35 as number | null,

  // Pastadaki mum sayısı (1-9)
  candles: 5,

  // Kendi şarkını koymak istersen: public/ içine at, "/sarki.mp3" yaz.
  // Boşsa tarayıcıda çalan müzik kutusu "İyi ki doğdun" melodisi çalar.
  musicSrc: "",

  scratch: {
    emoji: "🥂",
    title: "Bugünün tek kuralı",
    text: "İş konuşmak yasak. Bugün sadece kutlama var — telefonu da biraz bırak, tamam mı? 😄",
  },

  letters: [
    {
      id: "anne",
      title: "Annen",
      emoji: "💐",
      seal: "#b8405e",
      message: `Canım Yunus Emre'm,
İkinci göz ağrım,
Güzel oğlum... 💐

35 yaşın kutlu olsun annem. 🎂 Adın gibi gönlü güzel evladım benim. 🌹

Seni ilk kucağıma aldığım günden bu yana, bana ne kadar şanslı bir anne olduğumu her gün yeniden hatırlatıyorsun. Büyüdün, koca adam oldun ama benim için hep o güzel oğlumsun. 🤍

Rabbim sana önce sağlık, sonra gönlüne göre hayırlı bir ömür, bol kazanç ve tertemiz bir mutluluk nasip etsin. 🤲 Yolun hep iyilere çıksın, karşına hep iyi insanlar çıksın. 🌿

İyi ki doğdun, iyi ki benim oğlumsun. 🥰

Seni çok seviyorum. ❤️`,
      signature: "Annen",
    },
    {
      id: "kizi",
      title: "Kızın",
      emoji: "🌸",
      seal: "#c7568f",
      message: `Canım babam, 💕

Doğum günün kutlu olsun! 🎂🎉

Sen dünyanın en iyi babasısın. 🌍👑 Bunu herkes bilsin istiyorum!

İyi ki benim babamsın. 🥰 Seni çok ama çok seviyorum, hem de kocaman! 🤗💖

Allah seni hep korusun. 🤲 Hep yanımda ol, olur mu babacığım? 🌸

Mutlu yıllar babam! 🎈✨`,
      signature: "Kızın 🌸",
    },
    {
      id: "sevgili",
      title: "Sevgilin",
      emoji: "❤️",
      seal: "#a8323f",
      message: `Sevgilim, 💕

Bugün senin günün ama bilmeni isterim ki sadece bugün değil, seninle geçen her gün benim için çok değerli. En sıradan gün bile seninleyken güzelleşiyor, en basit an bile seninle anlam kazanıyor. 💫

Seninleyken dünyanın en şanslı insanı olduğumu hissediyorum. 🍀 Yanımda olman içimi huzurla dolduruyor; gülüşün, sesin, varlığın… hepsi benim için çok kıymetli. 🥰

Hayatımın bir parçası olduğun için çok mutluyum. İyi ki yollarımız kesişmiş, iyi ki sen varsın. 🌙

Yeni yaşında dilediğin her şey gerçek olsun, ben de hep yanında olayım. 🤍

Seni çok ama çok seviyorum. ❤️

İyi ki doğdun sevgilim! 🎂🎉`,
      signature: "Sevgilin ❤️",
    },
    {
      id: "gokhan",
      title: "Abin",
      name: "Gökhan",
      emoji: "💙",
      seal: "#2f6f73",
      message: `Canım kardeşim, 🤗

İyi ki doğdun, iyi ki varsın! ❤️

Hayatımda olduğun için çok şanslıyım. Seninle büyümek, seninle paylaşmak, seninle gülmek… Bunların hepsi benim için hayatın en kıymetli hediyeleri. 🎁

Yeni yaşının sana sağlık, mutluluk, huzur ve bolca güzel anı getirmesini diliyorum. 🍀 Önündeki her yıl bir öncekinden daha güzel, daha dolu, daha anlamlı olsun. ✨

Her zaman yüzün gülsün, gönlünden geçen tüm güzellikler seni bulsun. 😊🌈 Ne olursa olsun, her zaman arkanda bir abin olduğunu unutma. 💪

Seni çok seviyorum. 💙

Nice mutlu yaşlara! 🎂🎉`,
      signature: "Abin Gökhan",
    },
    {
      id: "esra",
      title: "Kız Kardeşin",
      name: "Esra",
      emoji: "🌷",
      seal: "#7b5ea7",
      message: `Canım abim, 🤗

İyi ki doğdun, iyi ki hayatımda varsın! 🎉

Çocukluğumdan bugüne kadar paylaştığımız onca güzel anı, birlikte güldüğümüz ve birbirimize destek olduğumuz her şeyi çok kıymetli buluyorum. 🌈 Hepsi kalbimin en güzel köşesinde duruyor. 💫

Hayat ne getirirse getirsin, insanın “abim var” diyebilmesi gerçekten büyük bir şans. 🍀 Ve ben bu şansa sahip olduğum için her gün şükrediyorum. 🙏

Yeni yaşının sana sağlık, huzur, mutluluk ve gönlünden geçen tüm güzellikleri getirmesini diliyorum. ✨ Hep yüzün gülsün, hep güzel günlerin olsun. 😊🌸

Seni çok seviyorum. 💜

İyi ki benim abimsin. ❤️`,
      signature: "Kız kardeşin Esra",
    },
    {
      id: "serhat",
      title: "Kardeşin Serhat",
      emoji: "🤝",
      seal: "#8a6a2f",
      message: `Kardeşim, 🤗

Bugün senin günün, doğum günün kutlu olsun! 🎉

Hayatta bazı insanlar sonradan girer ama sanki hep oradaymış gibi olur. Sen benim için tam olarak öylesin. Kan bağımız yok belki ama kardeşlik dediğin şey tam da bu: iyi günde yan yana gülmek, zor günde omuz omuza durmak. 💪

Aynı hayallere kafa yorduğumuz, aynı dertleri paylaştığımız, aynı şeylere kahkahalarla güldüğümüz her an için teşekkür ederim. Yanımda olduğunu bilmek bana her zaman güç veriyor. 🙏

Yeni yaşın sana sağlık, huzur, bereket ve bol kahkaha getirsin. Hedeflediğin ne varsa bir bir gerçek olsun; ben de her adımında yanında olacağım, bunu bil. 🚀

İyi ki doğdun, iyi ki yollarımız kesişti. 🍀

Nice mutlu yaşlara kardeşim! 🎂✨`,
      signature: "Kardeşin Serhat",
    },
    {
      id: "dilan",
      title: "Dilan",
      emoji: "🌺",
      seal: "#c2566b",
      message: `Emre, 🎉

Doğum günün kutlu olsun! İyi ki doğdun, iyi ki varsın. 🤗

Serhat'ın yanında hep böyle güvenilir, gönlü güzel bir dostun olduğunu bilmek bana da büyük bir huzur veriyor. Sen de artık bizim ailemizin bir parçasısın. 🤍

Yeni yaşın sana sağlık, huzur, bereket ve bol bol mutluluk getirsin. 🍀 Sevdiklerinle birlikte, yüzünün hep güldüğü nice güzel yıllar geçirmeni diliyorum. ✨

Nice mutlu yaşlara! 🎂🌺`,
      signature: "Dilan",
    },
    {
      id: "asil",
      title: "Asil",
      emoji: "🧸",
      seal: "#3d9a6e",
      message: `Emre amcaaa! 🎈

İyi ki doğdun! 🎉 Babam söyledi, bugün senin doğum gününmüş. Ben de sana mektup yazmak istedim. ✏️

Kocaman bir pasta ye ama bana da bir dilim ayır, tamam mı? 🍰😋

Mumları üflerken dilek tutmayı unutma! Ben de senin için dilek tuttum: hep mutlu ol, hiç hasta olma, bol bol oyun oyna! 🧸⚽

Seni şu kadaaaar çok seviyorum! 🤗 (Kollarımı sonuna kadar açtım.)

Mutlu yıllar Emre amca! 🎂🥳`,
      signature: "Asil 🧸",
    },
    {
      id: "yusuf-ortak",
      title: "Kardeşin Yusuf",
      emoji: "🫂",
      seal: "#5b6b2f",
      message: `Canım kardeşim, 🤗

Bugün senin günün, doğum günün kutlu olsun! 🎉

Allah sana hayırlı, huzurlu, mutlu ve sağlıklı bir ömür bahşetsin. 🤲 Gönlünden geçen ne varsa en güzel şekilde nasip etsin. 🌟

Yeni yaşın; sevdiklerinle ve seni sevenlerle birlikte sana huzur, mutluluk ve bolca güzel anı getirsin. 🍀 Omuz omuza yürüdüğümüz bu yolda nice güzel günleri de yan yana görelim inşallah. ✨

Her zaman yüzün gülsün, yolun açık, bahtın güzel olsun. 😊🌈

İyi ki doğdun canım kardeşim. ❤️🎂`,
      signature: "Kardeşin Yusuf",
    },
    {
      id: "gizem",
      title: "Gizem",
      emoji: "🌼",
      seal: "#6d7fb8",
      message: `Emre, 🎉

Doğum günün kutlu olsun! Nice güzel yaşlar diliyorum. 🎂

Allah sana hayırlı, uzun ve bereketli ömürler nasip etsin. 🤲 Her yeni yaşın bir öncekinden daha güzel, daha huzurlu geçsin. 🍀

Sevdiklerinle birlikte, yüzünün hep güldüğü, gönlünün hep ferah olduğu huzurlu bir ömrün olsun inşallah. 🤍✨

Nice mutlu yaşlara! 🌼`,
      signature: "Gizem",
    },
    {
      id: "benay",
      title: "Benay",
      emoji: "🦄",
      seal: "#9c6bd0",
      message: `Emre amca, merhabaaa! 👋🦄

Bugün senin doğum günün! İyi ki doğdun! 🎉🎂

Sana kocaman bir resim çizmek istedim ama kâğıda sığmadı. O yüzden sana mektup yazdım. 🖍️🌈

Doğum gününde balonların hiç patlamasın, pastan da çikolatalı olsun! 🎈🍫

Hep gülümse, hep mutlu ol. Çünkü sen gülünce herkes gülüyor! 😄

Seni çoook seviyorum! 💕

Mutlu yıllar! 🥳✨`,
      signature: "Benay 🦄",
    },
    {
      id: "yusuf",
      title: "Yusuf Abi",
      emoji: "🌟",
      seal: "#3f5f8f",
      message: `Emre, 🙌

Bugün senin günün, doğum günün kutlu olsun! 🎉

Yeni yaşında tüm hedeflerine ulaştığın bir yıl olsun. 🎯 Emek verdiğin her işin karşılığını fazlasıyla aldığın, attığın her adımın seni bir sonrakine taşıdığı bir yıl… 🚀

Yüzünden gülümsemenin eksik olmadığı, sevdiklerinle bol kahkahalı günler geçirdiğin bir yıl olsun. 😄

Kısacası: musmutlu bir yıl olsun! 🌟

Nice yaşlara kardeşim! 🎂`,
      signature: "Yusuf Abi",
    },
    {
      id: "furkan",
      title: "Kardeşin Furkan",
      emoji: "🫶",
      seal: "#7a3f6b",
      message: `Canım abim, 🤗

İnsanın birine “abi” demesi için illa aynı kandan gelmesi gerekmez. Bizim gönülden gelen, çok başka bir bağımız var. 🤍

İyi günümde de kötü günümde de hep yanımda olduğunu hissettiğim, hayatımda yeri bambaşka olan güzel insan… 🙏 Varlığın bana her zaman güç ve güven veriyor. 💪

İyi ki varsın, iyi ki yollarımız kesişmiş. 🍀

İnşallah beraber daha nice güzel senelerimiz, birlikte güleceğimiz nice güzel anılarımız olur. ✨📸

Yeni yaşın sana sağlık, huzur ve gönlünden geçen tüm güzellikleri getirsin. 🎂

İyi ki doğmuşsun abim! ❤️`,
      signature: "Kardeşin Furkan",
    },
    {
      id: "baki",
      title: "Baki Hoca",
      emoji: "🌿",
      seal: "#4f7a5a",
      message: `Kıymetli Emre, 🌿

Doğum günün kutlu olsun.

Her yeni yaş, insana geride kalan günlere şükretmeyi ve önündeki günlere umutla bakmayı hatırlatır. 🌅

Duam odur ki; kalan ömrün, geçen ömründen hayırlı olsun. 🤲

Sağlıkla, huzurla, bereketle ve sevdiklerinle geçen nice güzel yıllara. ✨`,
      signature: "Baki Hoca",
    },
    {
      id: "ali-riza",
      title: "Ali Rıza Hoca",
      emoji: "☕",
      seal: "#8b4a2b",
      message: `Sevgili Emre, 🎉

Doğum günün kutlu olsun! Yeni yaşın sağlık, huzur ve başarı dolu geçsin. 🌟

Yolun bu tarafa düşerse haber ver; geldiğinde bir çay ısmarlarım, oturur güzel bir sohbet ederiz. ☕😊

Nice mutlu yıllara! 🎂`,
      signature: "Ali Rıza Hoca",
    },
    {
      id: "onur",
      title: "Onur Hoca",
      emoji: "🌙",
      seal: "#5a5f73",
      message: `Sevgili Emre, 🎉

Doğum günün kutlu olsun! 🎂

Yeni yaşın sağlık, huzur ve bereketle dolsun. Emek verdiğin her işte yolun açık, gönlün ferah olsun. 🍀✨

Nice mutlu yıllara! 🙌`,
      signature: "Onur Hoca",
    },
    {
      id: "ayse",
      title: "Ayşe",
      emoji: "🩵",
      seal: "#6aa9d6",
      message: `Dünyanın en karizma abisiii! 😎✨

Doğum günün kutlu olsun abimm! 🎂🎉

Ne zaman kendimi kötü hissetsem, varlığını her zaman hissettirdin. 🤗

Seni çok seviyorum, her şeyin en iyisini hak ediyorsun. 🌟 Ben senin her zaman yanındayım abi, bunu da unutma! 💪

İyi ki doğdun, iyi ki varsın. 🩵🩵`,
      signature: "Ayşe",
    },
    {
      id: "serdem",
      title: "Serdem",
      emoji: "🎈",
      seal: "#c9702c",
      message: `İyi ki doğdun abim! 🎉 Yeni yaşın sana sağlık, mutluluk ve huzur getirsin. 🍀✨

Nice güzel yaşlara! 🎂🙌`,
      signature: "Serdem",
    },
    {
      id: "sengul",
      title: "Şengül Abla",
      emoji: "🌻",
      seal: "#b8902c",
      message: `Bu yılın önce sağlıkla ve mutlulukla, sorunsuz bir şekilde geçmesi dileğiyle… 🍀✨

İyi ki doğdunuz! 🎉 Mutlu yıllar! 🎂🌻`,
      signature: "Şengül Abla",
    },
    {
      id: "yagmur",
      title: "Yağmur",
      emoji: "🌈",
      seal: "#3a8fb0",
      message: `İyi ki doğdun güzel abimiz! 🎉

Yeni yaşın sana sağlık, mutlu ve de huzurlu bir yıl olsun inşallah. 🍀✨

Allah bizi senin başından eksik etmesin. 🤲🎂`,
      signature: "Yağmur",
    },
    {
      id: "sila",
      title: "Sıla",
      emoji: "🦋",
      seal: "#b0567a",
      message: `Emre abi, iyi ki doğmuşsun, iyi ki tanışmışız! 🎉🤗

Yeni yaşın sana sağlık, huzur ve bolca mutluluk getirir umarım. 🍀✨🎂`,
      signature: "Sıla",
    },
  ] as Letter[],

  // Tüm mektuplar okununca açılan gizli mektup
  secretLetter: {
    id: "gizli",
    title: "Hepimizden",
    emoji: "✨",
    seal: "#c9953f",
    message: `Buraya kadar geldiysen, tüm mektupları okudun demektir.

Bu sayfayı hazırlarken bir şeyi fark ettik: seni anlatmak için herkesin söyleyecek güzel bir sözü vardı. Bu kadar insanın kalbinde yer etmek kolay değil Emre.

Yüzünde şu an küçük de olsa bir gülümseme varsa, işimiz tamam.

İyi ki varsın. 🤍`,
    signature: "Seni sevenler",
  } as Letter,

  // Fotoğraf eklemek istersen: public/fotolar/ içine koy, buraya yaz.
  // Boşsa "anılar" bölümü görünmez.
  photos: [] as Photo[],
};
