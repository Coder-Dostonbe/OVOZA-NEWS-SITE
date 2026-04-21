/* ===== OVOZA NEWS — CATEGORIES PAGE JS ===== */
(function () {
  "use strict";

  /* ─── Category data ─────────────────────────────────── */
  const CATS = {
    siyosat: {
      name:"Siyosat", icon:"fa-landmark",
      c1:"#2471a3", c2:"#154360",
      desc:"O'zbekiston va dunyo siyosiy hayoti: parlament qarorlari, diplomatik munosabatlar va siyosiy tahlillar.",
      articles:248, today:9,
      img:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80&auto=format&fit=crop",
      featTitle:"Prezident iqtisodiy islohotlar to\'g\'risidagi muhim farmonni imzoladi",
      tags:["#Parlament","#Prezident","#Diplomatiya","#Qonun","#Hukumat","#Saylov"],
      trends:["Prezident yangi farmon imzoladi","Parlament sessiyasi yakunlandi","Tashqi siyosat: yangi shartnoma","Mahalliy hokimiyat islohotlari","Qonun loyihasi muhokamada"],
      similar:[
        {img:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=120&q=60",title:"Diplomatik uchrashuvlar yakunlandi",meta:"Kecha · 4.1K"},
        {img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=120&q=60",title:"Parlament yangi qonun ko\'rib chiqdi",meta:"2 kun · 3.2K"},
        {img:"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&q=60",title:"Saylov komissiyasi bayonot berdi",meta:"3 kun · 2.8K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=70",title:"O\'zbekiston xalqaro sammitda muhim rol o\'ynadi",meta:"3 soat · 7.2K"},
        {img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70",title:"Parlament yangi byudjet loyihasini tasdiqladi",meta:"5 soat · 5.8K"},
        {img:"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=70",title:"Mahalliy hokimlar yig\'ilishida yangi topshiriqlar berildi",meta:"7 soat · 4.1K"},
        {img:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=70",title:"Konstitutsiyaviy o\'zgartirishlar muhokama qilindi",meta:"9 soat · 3.6K"},
      ]
    },
    sport: {
      name:"Sport", icon:"fa-trophy",
      c1:"#c0392b", c2:"#7b241c",
      desc:"Futbol, boks, kurash, basketbol va barcha sport turlaridan so\'nggi natijalar va tahlillar.",
      articles:312, today:14,
      img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80&auto=format&fit=crop",
      featTitle:"O\'zbekiston bokschilaridan jahon chempionatida tarixiy rekord — 7 ta oltin medal",
      tags:["#Futbol","#Boks","#Kurash","#Olimpiada","#Pakhtakor","#Tennis","#Basketbol"],
      trends:["Xasanboy Dusmatov professional boksga o\'tdi","Pakhtakor UEFA ga yo\'l ochmoqda","Milliy futbol jamoasiga yangi murabbiy","O\'zbek kurashchilar 5 oltin qo\'lga oldi","Toshkentda olimpiya basseyn ochildi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=120&q=60",title:"Gimnastika chempioni yangi rekord o\'rnatdi",meta:"Kecha · 5.2K"},
        {img:"https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=120&q=60",title:"Yengil atletika: Osiyo rekordi yangilandi",meta:"2 kun · 3.8K"},
        {img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&q=60",title:"Futbol Superligi: 5-tur natijalari",meta:"3 kun · 2.5K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=70",title:"Futbol Superligi: Pakhtakor peshqadamlikni saqlab qoldi",meta:"3 soat · 9.3K"},
        {img:"https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=70",title:"Kurash: Jahon chempioni intervyu berdi",meta:"5 soat · 6.2K"},
        {img:"https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&q=70",title:"Basketbol terma jamoasi Osiyo chempionatiga tayyorlanmoqda",meta:"7 soat · 4.5K"},
        {img:"https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=70",title:"Tennis: Sharipova xalqaro turnirda yarim finalda",meta:"9 soat · 3.7K"},
      ]
    },
    iqtisod: {
      name:"Iqtisod", icon:"fa-chart-line",
      c1:"#1e8449", c2:"#145a32",
      desc:"Valyuta kurslari, birja, biznes yangiliklari, investitsiyalar va makroiqtisodiy ko\'rsatkichlar.",
      articles:196, today:11,
      img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80&auto=format&fit=crop",
      featTitle:"Markaziy bank yangi pul-kredit siyosatini e\'lon qildi: foiz stavkasi o\'zgardi",
      tags:["#Dollar","#So\'m","#Birja","#Investitsiya","#GDP","#Biznes","#Bank","#Eksport"],
      trends:["Dollar kursi: 1 USD = 12,720 so\'m","GDP o\'sishi 6.2% ni tashkil etdi","Yangi sanoat zonalari ochilyapti","Eksport hajmi rekord darajada","Investitsiya muhiti yaxshilanmoqda"],
      similar:[
        {img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&q=60",title:"Fond birjasida yangi rekord qayd etildi",meta:"Kecha · 4.8K"},
        {img:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&q=60",title:"Xorijiy investitsiyalar hajmi o\'sdi",meta:"2 kun · 3.5K"},
        {img:"https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=120&q=60",title:"Kichik biznes uchun yangi imtiyozlar",meta:"3 kun · 2.9K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=70",title:"Xorijiy investitsiyalar hajmi yangi rekord qo\'ydi",meta:"3 soat · 8.1K"},
        {img:"https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=70",title:"Kichik biznes uchun soliq imtiyozlari kengaytirildi",meta:"5 soat · 6.4K"},
        {img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=70",title:"Qishloq xo\'jalik mahsulotlari eksporti o\'sdi",meta:"7 soat · 4.2K"},
        {img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=70",title:"Yangi erkin iqtisodiy zonalar yaratildi",meta:"9 soat · 3.3K"},
      ]
    },
    texnologiya: {
      name:"Texnologiya", icon:"fa-microchip",
      c1:"#6c3483", c2:"#4a235a",
      desc:"Sun\'iy intellekt, 5G, IT-sanoat, startaplar va O\'zbekiston raqamli transformatsiyasi.",
      articles:174, today:8,
      img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop",
      featTitle:"O\'zbekistonda sun\'iy intellekt asosida ishlaydigan davlat xizmatlari ishga tushirildi",
      tags:["#AI","#5G","#IT-Park","#Startup","#Dasturlash","#Raqamlashtirish","#Kiberhavfsizlik"],
      trends:["ChatGPT o\'zbek tilida so\'zlaydi","5G sinovlari muvaffaqiyatli yakunlandi","IT-Park yangi rezidentlar qabul qildi","Elektron hukumat xizmatlari yangilandi","Kiber xavfsizlik konferensiyasi ochildi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&q=60",title:"Yangi startap 1 mln dollar investitsiya oldi",meta:"Kecha · 5.6K"},
        {img:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&q=60",title:"Toshkentda xalqaro IT-forum bo\'lib o\'tdi",meta:"2 kun · 4.1K"},
        {img:"https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=120&q=60",title:"Maktablarda dasturlash ta\'limi joriy etilmoqda",meta:"3 kun · 3.2K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70",title:"O\'zbekistonda birinchi AI-laboratoriyasi ochildi",meta:"3 soat · 9.8K"},
        {img:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=70",title:"Telekommunkatsiya kompaniyalari 5G tarmoqni kengaytirmoqda",meta:"5 soat · 7.1K"},
        {img:"https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&q=70",title:"IT-Park\'da 200 ta yangi ish o\'rni yaratildi",meta:"7 soat · 5.4K"},
        {img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70",title:"Raqamli to\'lov tizimi yangi bosqichga o\'tdi",meta:"9 soat · 4.0K"},
      ]
    },
    dunyo: {
      name:"Dunyo", icon:"fa-globe-asia",
      c1:"#1a5276", c2:"#0e2f44",
      desc:"Xalqaro voqealar, geosiyosat, MDH, Yevropa, Amerika va Osiyo bo\'yicha xabarlar.",
      articles:287, today:16,
      img:"https://images.unsplash.com/photo-1491466424936-e304919aada7?w=900&q=80&auto=format&fit=crop",
      featTitle:"BMT Bosh Assambleyasida O\'rta Osiyo xavfsizligi va suv resurslari masalasi ko\'rildi",
      tags:["#BMT","#NATO","#G20","#Yevropa","#AQSh","#Xitoy","#Rossiya","#MDH"],
      trends:["Xalqaro munosabatlarda yangi davr","G20 sammiti natijalar e\'lon qilindi","Ukraina-Rossiya tinchlik muzokaralari","Yaqin Sharqda vaziyat","Osiyo-Tinch okeani hamkorligi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=120&q=60",title:"Yevropa Ittifoqi yangi iqtisodiy paket e\'lon qildi",meta:"Kecha · 6.3K"},
        {img:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=120&q=60",title:"AQSh-Xitoy savdo muzokaralari yangilandi",meta:"2 kun · 5.1K"},
        {img:"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&q=60",title:"MDH davlatlari sammitida qarorlar qabul qilindi",meta:"3 kun · 3.9K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70",title:"Yevropa iqlim o\'zgarishi bo\'yicha yangi bitim imzoladi",meta:"3 soat · 11.2K"},
        {img:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=70",title:"G20 sammiti: global iqtisodiyot masalalari muhokama qilindi",meta:"5 soat · 8.7K"},
        {img:"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=70",title:"Osiyo mamlakatlar energetika hamkorligi kuchaymoqda",meta:"7 soat · 6.2K"},
        {img:"https://images.unsplash.com/photo-1491466424936-e304919aada7?w=400&q=70",title:"Xalqaro valyuta fondi yangi bashorat chiqardi",meta:"9 soat · 4.8K"},
      ]
    },
    jamiyat: {
      name:"Jamiyat", icon:"fa-users",
      c1:"#b7950b", c2:"#7d6608",
      desc:"Ta\'lim, atrof-muhit, ijtimoiy muammolar va fuqarolik hayotiga oid materiallar.",
      articles:143, today:6,
      img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80&auto=format&fit=crop",
      featTitle:"Yangi o\'quv yilida barcha maktablarga zamonaviy kompyuter laboratoriyalari o\'rnatiladi",
      tags:["#Ta\'lim","#Ekologiya","#Salomatlik","#Oila","#Yoshlar","#Madaniyat"],
      trends:["Maktablarda raqamli ta\'lim boshlandi","Ekologiya muammolari muhokamada","Yoshlar siyosati yangilandi","Ijtimoiy himoya dasturlari kengaydi","Fuqarolik jamiyati rivojlanmoqda"],
      similar:[
        {img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&q=60",title:"Yoshlarga yo\'naltirilgan yangi dasturlar",meta:"Kecha · 3.8K"},
        {img:"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&q=60",title:"Ta\'lim tizimida islohotlar davom etmoqda",meta:"2 kun · 2.9K"},
        {img:"https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&q=60",title:"Ekologik muammolar yechimi izlanmoqda",meta:"3 kun · 2.1K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=70",title:"Oliy ta\'limda yangi magistratura yo\'nalishlari ochildi",meta:"3 soat · 5.6K"},
        {img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70",title:"Yoshlar uchun biznes inkubator ochildi",meta:"5 soat · 4.2K"},
        {img:"https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=70",title:"Ijtimoiy yordam dasturlari kengaytirildi",meta:"7 soat · 3.1K"},
        {img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70",title:"Fuqarolar uchrashuvida dolzarb masalalar ko\'rildi",meta:"9 soat · 2.4K"},
      ]
    },
    madaniyat: {
      name:"Madaniyat", icon:"fa-palette",
      c1:"#943126", c2:"#641e16",
      desc:"San\'at, musiqa, kino, teatr, adabiyot va O\'zbekiston madaniy merosi bo\'yicha yangiliklar.",
      articles:118, today:5,
      img:"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=900&q=80&auto=format&fit=crop",
      featTitle:"Samarqand xalqaro musiqa festivaliga 40 mamlakatdan san\'atkorlar keladi",
      tags:["#Musiqa","#Kino","#Teatr","#San\'at","#Adabiyot","#Festival","#Meros"],
      trends:["Samarqand festivali tayyorliklari","Yangi o\'zbek filmi jahon premyerasida","Milliy teatrda yangi spektakl","San\'at ko\'rgazmasi ochildi","Adabiyot mukofoti e\'lon qilindi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&q=60",title:"Xalqaro kino festivalida o\'zbek filmi g\'olib bo\'ldi",meta:"Kecha · 4.4K"},
        {img:"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&q=60",title:"Milliy san\'at galereyasida yangi ko\'rgazma",meta:"2 kun · 3.6K"},
        {img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=60",title:"Yoshlar orasida milliy musiqa tiklanyapti",meta:"3 kun · 2.8K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=70",title:"O\'zbek kinosi xalqaro maydonga chiqmoqda",meta:"3 soat · 6.8K"},
        {img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=70",title:"Milliy musiqiy meros ro\'yxatga olindi",meta:"5 soat · 5.1K"},
        {img:"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&q=70",title:"Toshkentda xalqaro teatr festivaliga tayyorgarlik",meta:"7 soat · 3.9K"},
        {img:"https://images.unsplash.com/photo-1579547621309-5e57ab324182?w=400&q=70",title:"Yosh rassomlar ko\'rgazmasi muvaffaqiyatli o\'tdi",meta:"9 soat · 2.7K"},
      ]
    },
    salomatlik: {
      name:"Salomatlik", icon:"fa-heartbeat",
      c1:"#117a65", c2:"#0b5345",
      desc:"Tibbiyot yangiliklari, sog\'lom turmush tarzi va sog\'liqni saqlash tizimi haqida.",
      articles:92, today:4,
      img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80&auto=format&fit=crop",
      featTitle:"O\'zbekistonda zamonaviy tibbiyot markazlari tarmog\'i kengaytirilishi e\'lon qilindi",
      tags:["#Tibbiyot","#Sog\'lom turmush","#Shifokor","#Kasalxona","#Fitness","#Ruhiyat"],
      trends:["Yangi kasalxona ochildi","Sog\'lom turmush dasturlari","Tibbiy sug\'urta kengaydi","Mutaxassis shifokorlar tayyorlanmoqda","Profilaktika kampaniyalari boshlandi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&q=60",title:"Yangi tibbiy texnologiyalar joriy etilmoqda",meta:"Kecha · 3.2K"},
        {img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=60",title:"Sport va sog\'liq: mutaxassislar maslahati",meta:"2 kun · 2.6K"},
        {img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&q=60",title:"Tibbiy ta\'lim islohoti amalga oshirilmoqda",meta:"3 kun · 1.9K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=70",title:"Respublikada jismoniy faollik darajasi oshirilmoqda",meta:"3 soat · 4.8K"},
        {img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=70",title:"Yangi tibbiy jihozlar viloyat kasalxonalariga yetkazildi",meta:"5 soat · 3.7K"},
        {img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=70",title:"Onko-kasalliklar profilaktikasi bo\'yicha yangi dastur",meta:"7 soat · 2.9K"},
        {img:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=70",title:"Ruhiy salomatlik markazlari soni ikki barobarga oshdi",meta:"9 soat · 2.2K"},
      ]
    },
    ilmfan: {
      name:"Ilm-Fan", icon:"fa-flask",
      c1:"#1a6fa8", c2:"#0d3b5a",
      desc:"Ilmiy kashfiyotlar, tadqiqotlar, kosmik yangiliklar va O\'zbekiston fani rivoji haqida.",
      articles:76, today:3,
      img:"https://images.unsplash.com/photo-1532094349884-543559c8b0d4?w=900&q=80&auto=format&fit=crop",
      featTitle:"O\'zbek olimlari xalqaro ilmiy jurnalda inqilobiy kashfiyotini e\'lon qildi",
      tags:["#Fan","#Tadqiqot","#Kosmos","#Biologiya","#Kimyo","#Fizika","#Matematika"],
      trends:["Yangi ilmiy kashfiyot e\'lon qilindi","Kosmik tadqiqot dasturi","Xalqaro ilmiy hamkorlik","Yoshlar ilmiy olimpiadasi","Universitetlar reytingi yangilandi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1532094349884-543559c8b0d4?w=120&q=60",title:"Yangi laboratoriya qurilishi boshlandi",meta:"Kecha · 2.8K"},
        {img:"https://images.unsplash.com/photo-1576086213369-97a306d36557?w=120&q=60",title:"Talabalar ilmiy loyihalari mukofotlandi",meta:"2 kun · 2.1K"},
        {img:"https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=120&q=60",title:"Xalqaro ilmiy konferensiya Toshkentda o\'tadi",meta:"3 kun · 1.7K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=70",title:"O\'zbekistonda tibbiy tadqiqot markazi ochildi",meta:"3 soat · 4.2K"},
        {img:"https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=70",title:"Yangi ixtiro xalqaro patentga sazovor bo\'ldi",meta:"5 soat · 3.1K"},
        {img:"https://images.unsplash.com/photo-1532094349884-543559c8b0d4?w=400&q=70",title:"Yoshlar ilmiy tadqiqot grantlari e\'lon qilindi",meta:"7 soat · 2.4K"},
        {img:"https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&q=70",title:"Astronomiya markazi zamonaviy teleskop oldi",meta:"9 soat · 1.8K"},
      ]
    },
    talim: {
      name:"Ta\'lim", icon:"fa-graduation-cap",
      c1:"#6e2f7e", c2:"#4a1f55",
      desc:"Maktab, oliy ta\'lim, grant, stipendiya va ta\'lim islohotlari haqidagi so\'nggi yangiliklar.",
      articles:134, today:7,
      img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&auto=format&fit=crop",
      featTitle:"O\'zbekiston universitetlari xalqaro reytingda yangi o\'rinlarga ko\'tarildi",
      tags:["#Maktab","#Universitet","#Grant","#Stipendiya","#DTM","#Chet el"],
      trends:["DTM natijalari e\'lon qilindi","Xalqaro grantlar ro\'yxati yangilandi","Yangi universitetlar ochildi","Maktab dasturlari isloh qilindi","O\'qituvchilar maoshi oshirildi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&q=60",title:"Xorijda o\'qish imkoniyatlari kengaydi",meta:"Kecha · 4.1K"},
        {img:"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&q=60",title:"Magistratura yo\'nalishlari ko\'paydi",meta:"2 kun · 3.3K"},
        {img:"https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=120&q=60",title:"Maktabgacha ta\'lim tizimi modernizatsiyalandi",meta:"3 kun · 2.6K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=70",title:"Prezident stipendiyasi g\'oliblari aniqlandi",meta:"3 soat · 7.4K"},
        {img:"https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=70",title:"Maktablarda sun\'iy intellekt darslari joriy etilmoqda",meta:"5 soat · 5.8K"},
        {img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=70",title:"Chet el universitetlari bilan yangi hamkorlik shartnomasi",meta:"7 soat · 4.1K"},
        {img:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=70",title:"O\'qituvchilar malaka oshirish dasturlari yangilandi",meta:"9 soat · 3.0K"},
      ]
    },
    ekologiya: {
      name:"Ekologiya", icon:"fa-leaf",
      c1:"#196f3d", c2:"#0d4023",
      desc:"Iqlim o\'zgarishi, yashil energetika, Orol dengizi muammosi va tabiatni muhofaza qilish.",
      articles:88, today:4,
      img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&auto=format&fit=crop",
      featTitle:"Orol dengizini tiklash bo\'yicha xalqaro dastur yangi bosqichga ko\'tarildi",
      tags:["#Orol","#Iqlim","#Yashil energiya","#Tabiat","#Chiqindilar","#Atmosfera"],
      trends:["Orol dengizi loyihasi yangilandi","Quyosh elektrostansiyasi qurildi","Daraxt ekish kampaniyasi","Atmosfera ifloslanishi kamaydi","Yashil iqtisodiyot dasturi"],
      similar:[
        {img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=120&q=60",title:"Quyosh panellari o\'rnatish subsidiyalari kengaydi",meta:"Kecha · 3.4K"},
        {img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&q=60",title:"Tabiatni muhofaza qilish qonuni kuchaytirildi",meta:"2 kun · 2.7K"},
        {img:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=120&q=60",title:"Chiqindilarni qayta ishlash tizimi joriy etildi",meta:"3 kun · 2.0K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=70",title:"Navoiyda 500 MVt quyosh elektrostansiyasi qurilishi boshlandi",meta:"3 soat · 6.2K"},
        {img:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70",title:"Bir million daraxt ekish kampaniyasi muvaffaqiyatli yakunlandi",meta:"5 soat · 4.8K"},
        {img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70",title:"Suv resurslari boshqaruvi yaxshilanmoqda",meta:"7 soat · 3.5K"},
        {img:"https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=70",title:"Yashil binolar qurilishi rag\'batlantirilyapti",meta:"9 soat · 2.6K"},
      ]
    },
    video: {
      name:"Video", icon:"fa-video",
      c1:"#922b21", c2:"#641e16",
      desc:"Maxsus video reportajlar, intervyular, jonli translyatsiyalar va multimedia kontentlar.",
      articles:64, today:3,
      img:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80&auto=format&fit=crop",
      featTitle:"Ovoza TV: O\'zbekiston iqtisodiy o\'sishiga bag\'ishlangan maxsus video loyiha",
      tags:["#Video","#Intervyu","#Reportaj","#Jonli","#Podcast","#Multimedia"],
      trends:["Jonli translyatsiya: sammit","Video intervyu: ekspert","Maxsus reportaj: viloyatlar","Video tahlil: iqtisod","Hujjatli film: tarix"],
      similar:[
        {img:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=120&q=60",title:"Maxsus intervyu: ekspert fikri",meta:"Kecha · 5.2K"},
        {img:"https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=120&q=60",title:"Video reportaj: viloyatlardagi o\'zgarishlar",meta:"2 kun · 4.1K"},
        {img:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=120&q=60",title:"Podcast: mutaxassislar bilan suhbat",meta:"3 kun · 3.3K"},
      ],
      grid:[
        {img:"https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=400&q=70",title:"Viloyatlar bo\'ylab: o\'zgarishlar haqida maxsus film",meta:"3 soat · 8.4K"},
        {img:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=70",title:"Ekspert bilan suhbat: iqtisodiy o\'sish sabablari",meta:"5 soat · 6.7K"},
        {img:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=70",title:"Jonli efir: xalqaro anjuman qamrovi",meta:"7 soat · 5.1K"},
        {img:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=70",title:"Yoshlar bilan suhbat: kelajak rejalari",meta:"9 soat · 3.8K"},
      ]
    },
  };

  /* ─── DOM refs ──────────────────────────────────────── */
  const panel      = document.getElementById("expandPanel");
  const content    = document.getElementById("expandContent");
  const closeBtn   = document.getElementById("expandCloseBtn");

  /* ─── State ─────────────────────────────────────────── */
  let isOpen       = false;
  let activeCard   = null;
  let savedScroll  = 0;

  /* ─── Open expand ───────────────────────────────────── */
  window.openExpandPanel = function(catKey, cardEl) {
    if (isOpen) return;
    const cat = CATS[catKey];
    if (!cat) return;

    isOpen     = true;
    activeCard = cardEl;
    savedScroll = window.scrollY;

    /* 1. Fill panel content */
    fillPanel(cat, catKey);

    /* 2. Get card position */
    const rect = cardEl.getBoundingClientRect();

    /* 3. Place panel exactly over card (no transition yet) */
    panel.style.transition = "none";
    panel.style.top        = rect.top  + "px";
    panel.style.left       = rect.left + "px";
    panel.style.width      = rect.width  + "px";
    panel.style.height     = rect.height + "px";
    panel.style.borderRadius = "4px";
    panel.style.display    = "block";
    panel.style.pointerEvents = "none";

    /* 4. Force reflow */
    panel.getBoundingClientRect();

    /* 5. Animate to fullscreen */
    panel.classList.add("animating");
    requestAnimationFrame(() => {
      panel.classList.add("expanded");
    });

    /* 6. Show close button after animation */
    setTimeout(() => {
      closeBtn.classList.add("visible");
      document.body.style.overflow = "hidden";
    }, 480);

    /* 7. Dim the card */
    cardEl.style.opacity = "0.35";
  };

  /* ─── Close expand ──────────────────────────────────── */
  window.closeExpandPanel = function() {
    if (!isOpen) return;

    closeBtn.classList.remove("visible");
    content.style.opacity = "0";
    document.body.style.overflow = "";

    /* Shrink back to card */
    if (activeCard) {
      const rect = activeCard.getBoundingClientRect();
      panel.style.top    = rect.top    + "px";
      panel.style.left   = rect.left   + "px";
      panel.style.width  = rect.width  + "px";
      panel.style.height = rect.height + "px";
      panel.style.borderRadius = "4px";
    }

    panel.classList.remove("expanded");

    setTimeout(() => {
      panel.classList.remove("animating");
      panel.style.display = "none";
      content.style.opacity = "";
      if (activeCard) activeCard.style.opacity = "";
      isOpen     = false;
      activeCard = null;
    }, 540);
  };

  /* ─── Fill panel with category data ────────────────── */
  function fillPanel(cat, key) {
    /* Colors */
    const setVar = (v, val) => document.documentElement.style.setProperty(v, val);
    setVar("--ep-c1", cat.c1);
    setVar("--ep-c2", cat.c2);

    /* Hero bg */
    const bg = document.getElementById("epHeroBg");
    if (bg) bg.style.background = `linear-gradient(135deg, ${cat.c1}, ${cat.c2})`;

    /* Big icon */
    const bigIcon = document.getElementById("epBigIcon");
    if (bigIcon) bigIcon.className = `ep-big-icon fas ${cat.icon}`;

    /* Text */
    setText("epCatName",  cat.name);
    setText("epCatTitle", cat.name);
    setText("epCatDesc",  cat.desc);

    /* Icon */
    const ic = document.getElementById("epIcon");
    if (ic) ic.className = `fas ${cat.icon}`;

    /* Stats */
    setText("epStatArt",   cat.articles);
    setText("epStatToday", cat.today);

    /* Page count */
    const pageCount = Math.ceil(cat.articles / 6);
    const pageLast = document.getElementById("epPageLast");
    if (pageLast) pageLast.textContent = pageCount;

    /* Featured */
    const featImg = document.getElementById("epFeatImg");
    if (featImg) featImg.src = cat.img;
    const featTitle = document.getElementById("epFeatTitle");
    if (featTitle) featTitle.textContent = cat.featTitle;
    const featBadge = document.getElementById("epFeatBadge");
    if (featBadge) {
      featBadge.innerHTML = `<i class="fas ${cat.icon}"></i> ${cat.name}`;
      featBadge.style.background = cat.c1;
    }

    /* Trending */
    const trendHeader = document.getElementById("epTrendHeader");
    if (trendHeader) trendHeader.innerHTML = `<i class="fas fa-fire-alt" style="color:${cat.c1}"></i> ${cat.name} — Trendlar`;

    const trendList = document.getElementById("epTrendList");
    if (trendList && cat.trends) {
      trendList.innerHTML = cat.trends.map((t, i) => `
        <div class="ep-trend-item">
          <span class="ep-trend-num" style="color:var(--border);">0${i+1}</span>
          <div>
            <div class="ep-trend-title">${t}</div>
            <div class="ep-trend-meta"><i class="far fa-clock"></i> ${i+1} soat · <i class="fas fa-fire" style="color:${cat.c1}"></i> ${(12-i*1.8).toFixed(1)}K</div>
          </div>
        </div>`).join("");
    }

    /* Similar */
    const simList = document.getElementById("epSimilarList");
    if (simList && cat.similar) {
      simList.innerHTML = cat.similar.map(s => `
        <div class="ep-similar-item">
          <img class="ep-similar-img" src="${s.img}" alt="" loading="lazy" />
          <div>
            <div class="ep-similar-title">${s.title}</div>
            <div class="ep-similar-meta"><i class="far fa-clock"></i> ${s.meta}</div>
          </div>
        </div>`).join("");
    }

    /* Tags */
    const tagsWrap = document.getElementById("epTagsWrap");
    if (tagsWrap && cat.tags) {
      tagsWrap.innerHTML = cat.tags.map(t =>
        `<span class="ep-tag" style="border-color:var(--border);">${t}</span>`
      ).join("");
      tagsWrap.querySelectorAll(".ep-tag").forEach(tag => {
        tag.addEventListener("click", function() {
          this.style.borderColor = cat.c1;
          this.style.color = "#fff";
          setTimeout(() => { this.style.borderColor = ""; this.style.color = ""; }, 900);
        });
      });
    }

    /* Ad icon + btn color */
    const adIcon = document.getElementById("epAdIcon");
    if (adIcon) adIcon.style.background = cat.c1;
    const adBtn = document.getElementById("epAdBtn");
    if (adBtn) adBtn.style.background = cat.c1;

    /* Grid articles */
    const grid = document.getElementById("epGrid");
    if (grid && cat.grid) {
      grid.innerHTML = cat.grid.map(g => `
        <div class="ep-card">
          <div class="ep-card-img">
            <img src="${g.img}" alt="" loading="lazy" />
            <span class="ep-card-tag" style="background:${cat.c1};">${cat.name}</span>
          </div>
          <div class="ep-card-body">
            <div class="ep-card-title">${g.title}</div>
            <div class="ep-card-meta">
              <span><i class="far fa-clock" style="color:${cat.c1};"></i> ${g.meta}</span>
              <span class="ep-read" style="color:${cat.c1};">O'qish <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </div>`).join("");
    }

    /* Page btn active color */
    const pageBtn = document.getElementById("epPageColor");
    if (pageBtn) { pageBtn.style.background = cat.c1; pageBtn.style.borderColor = cat.c1; }

    /* Sub-tabs */
    document.querySelectorAll(".ep-tab").forEach((tab, i) => {
      tab.onclick = function() {
        document.querySelectorAll(".ep-tab").forEach(t => t.classList.remove("active"));
        this.classList.add("active");
      };
    });

    /* Pagination */
    document.querySelectorAll(".ep-page-btn:not(.disabled)").forEach(btn => {
      btn.onclick = function() {
        document.querySelectorAll(".ep-page-btn:not(.disabled)").forEach(b => {
          b.classList.remove("active");
          b.style.background = "";
          b.style.borderColor = "";
          b.style.color = "";
        });
        if (!this.querySelector("i")) {
          this.classList.add("active");
          this.style.background = cat.c1;
          this.style.borderColor = cat.c1;
          this.style.color = "#fff";
          document.getElementById("expandPanel").scrollTo({ top: 0, behavior: "smooth" });
        }
      };
    });
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ─── ESC key ───────────────────────────────────────── */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isOpen) closeExpandPanel();
  });

  /* ─── Attach click to every cat-card ────────────────── */
  document.querySelectorAll(".cat-card[data-cat]").forEach(card => {
    card.addEventListener("click", function(e) {
      const key = this.dataset.cat;
      if (CATS[key]) {
        openExpandPanel(key, this);
      }
    });
  });

  /* ─── Live clock ────────────────────────────────────── */
  const dateEl = document.getElementById("topbarDate");
  if (dateEl) {
    const days   = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    function tick() {
      const n = new Date();
      dateEl.textContent = `${days[n.getDay()]}, ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()} | ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
    }
    tick(); setInterval(tick, 30000);
  }

  /* ─── Lang switcher ─────────────────────────────────── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ─── Mobile nav ────────────────────────────────────── */
  const navToggler = document.getElementById("navToggler");
  const navMenu    = document.getElementById("navMenu");
  if (navToggler && navMenu) {
    navToggler.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const ic = navToggler.querySelector("i");
      if (ic) { ic.classList.toggle("fa-bars"); ic.classList.toggle("fa-times"); }
    });
  }

  /* ─── Sticky navbar shadow ──────────────────────────── */
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.8)" : "0 2px 20px rgba(0,0,0,0.5)";
    });
  }

  /* ─── Animated counters ─────────────────────────────── */
  function animCount(el, target, ms) {
    if (!el) return;
    let v = 0; const step = Math.ceil(target / (ms / 16));
    const t = setInterval(() => {
      v += step; if (v >= target) { v = target; clearInterval(t); }
      el.textContent = v.toLocaleString("ru-RU");
    }, 16);
  }
  let countersRan = false;
  const cObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersRan) {
      countersRan = true;
      animCount(document.getElementById("statArticles"), 1892, 1200);
      animCount(document.getElementById("statToday"),      47,  800);
    }
  });
  const hero = document.querySelector(".page-hero");
  if (hero) cObs.observe(hero);

  /* ─── Card staggered entrance ───────────────────────── */
  const allCards = document.querySelectorAll(".cat-card");
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); cardObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  allCards.forEach((c, i) => { c.style.transitionDelay = `${i * 55}ms`; cardObs.observe(c); });

  /* ─── Filter tags ───────────────────────────────────── */
  document.querySelectorAll(".filter-tag").forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".filter-tag").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const counts = {all:12, news:10, analysis:8, interview:5, video:3};
      const el = document.getElementById("visibleCount");
      if (el) el.textContent = `${counts[this.dataset.filter] || 12} ta kategoriya`;
    });
  });

  /* ─── Scroll to top ─────────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.opacity = window.scrollY > 400 ? "1" : "0";
      scrollBtn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── Tag pills ─────────────────────────────────────── */
  document.querySelectorAll(".tag-pill").forEach(pill => {
    pill.addEventListener("click", function() {
      this.style.borderColor = "var(--primary)";
      this.style.color = "var(--white)";
      setTimeout(() => { this.style.borderColor = ""; this.style.color = ""; }, 800);
    });
  });

  console.log("Ovoza – categories.js v3 (expand panel) yuklandi");
})();
