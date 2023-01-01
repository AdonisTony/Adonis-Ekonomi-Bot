module.exports = {
  guildID: "",
  başlangıçMoney: 5000,
  telefonChannelID: "",
  ambulansChannelID: "",
  polisChannelID: "",
  yardımMerkeziChannelID: [],
  ownerRolesID: [],
  ownerUsersID: [],

  // meslek ve görev rol id kısmı
  meslekler: {
    devletBaşkanı: {
      roleID: "", // meslek rolü
    },
    şerif: {
      roleID: "", // meslek rolü
    },
    polis: {
      roleID: "", // meslek rolü
    },
    doktor: {
      roleID: "", // meslek rolü
    },
    hakim: {
      roleID: "", // meslek rolü
    },
    savcı: {
      roleID: "", // meslek rolü
    },
    baron: {
      sellerRoleID: "", // satıcı rolü
      officerRoleID: "", // görev rolü
    },
    galerici: {
      sellerRoleID: "", // satıcı rolü
      officerRoleID: "", // görev rolü
    },
    elektronikçi: {
      sellerRoleID: "", // satıcı rolü
      officerRoleID: "", // görev rolü
    },
    emlakçı: {
      sellerRoleID: "", // satıcı rolü
      officerRoleID: "", // görev rolü
    },
    banka: {
      officerRoleID: "", // görev rolü
    },
  },

  // market özelleştireme kısmı
  galeriMarket: [
    {
      ID: "1", // ÜRÜN ID
      Name: "BMW X1", // ÜRÜN İSMİ
      Description: "Bu araç 4 kişiliktir.", // ÜRÜN AÇIKLAMASI
      Price: 20500, // ÜRÜN FİYAT
      Type: "Araba Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "BMW M4", // ÜRÜN İSMİ
      Description: "Bu araç 4 kişiliktir.", // ÜRÜN AÇIKLAMASI
      Price: 24500, // ÜRÜN FİYAT
      Type: "Araba Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "3", // ÜRÜN ID
      Name: "Mercedes S400d", // ÜRÜN İSMİ
      Description: "Bu araç 4 kişiliktir.", // ÜRÜN AÇIKLAMASI
      Price: 27000, // Ürün Fiyat
      Type: "Araba Market", //ÜRÜN TİP
    },
    {
      ID: "4",
      Name: "Mercedes AMG G63",
      Description: "Bu araç 4 kişiliktir.",
      Price: 30000,
      Type: "Araba Market",
    },
    {
      ID: "5",
      Name: "Ford Mustang",
      Description: "Bu araç 2 Kişiliktir.",
      Price: 32500,
      Type: "Araba Market",
    },
    {
      ID: "6",
      Name: "Chevy Bel Air Coupe",
      Description: "Bu araç 4 kişiliktir.",
      Price: 31300,
      Type: "Araba Market",
    },
    {
      ID: "7",
      Name: "Rolls Royce",
      Description: "İş Adamlarına Özel!",
      Price: 100000,
      Type: "Araba Market",
    },
  ],

  elektronikMarket: [
    {
      ID: "1", // ÜRÜN ID
      Name: "Samsung S21", // ÜRÜN İSMİ
      Description: "Son Model Telefon", // ÜRÜN AÇIKLAMASI
      Price: 2000, // ÜRÜN FİYAT
      Type: "Elektronik Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "Iphone 13", // ÜRÜN İSMİ
      Description: "Güçlü ve Güzel Fotoğraflar!", // ÜRÜN AÇIKLAMASI
      Price: 4000, // ÜRÜN FİYAT
      Type: "Elektronik Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
  ],

  emlakMarket: [
    {
      ID: "1", // ÜRÜN ID
      Name: "Ev 1+1", // ÜRÜN İSMİ
      Description: "Apartman Dairesi", // ÜRÜN AÇIKLAMASI
      Price: 45000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "Ev 2+1", // ÜRÜN İSMİ
      Description: "Apartman Dairesi", // ÜRÜN AÇIKLAMASI
      Price: 55000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "3", // ÜRÜN ID
      Name: "Ev 3+1", // ÜRÜN İSMİ
      Description: "Apartman Dairesi", // ÜRÜN AÇIKLAMASI
      Price: 65000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "4", // ÜRÜN ID
      Name: "Ev 4+1", // ÜRÜN İSMİ
      Description: "Apartman Dairesi", // ÜRÜN AÇIKLAMASI
      Price: 75000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "5", // ÜRÜN ID
      Name: "Ev 5+1", // ÜRÜN İSMİ
      Description: "Dublex [2-Kat]", // ÜRÜN AÇIKLAMASI
      Price: 100000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "6", // ÜRÜN ID
      Name: "Villa", // ÜRÜN İSMİ
      Description: "Havuz bulunmamaktadır.", // ÜRÜN AÇIKLAMASI
      Price: 145000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "7", // ÜRÜN ID
      Name: "Lüx Villa", // ÜRÜN İSMİ
      Description: "Havuz bulunmaktadır.", // ÜRÜN AÇIKLAMASI
      Price: 175000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "8", // ÜRÜN ID
      Name: "Lüx Büyük Villa", // ÜRÜN İSMİ
      Description: "Gösterişli Malikane", // ÜRÜN AÇIKLAMASI
      Price: 225000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "9", // ÜRÜN ID
      Name: "Kuaför", // ÜRÜN İSMİ
      Description: "2. Cadde-Dükkan", // ÜRÜN AÇIKLAMASI
      Price: 18000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "10", // ÜRÜN ID
      Name: "Dövmeci/Tatto", // ÜRÜN İSMİ
      Description: "Dükkan", // ÜRÜN AÇIKLAMASI
      Price: 20000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "11", // ÜRÜN ID
      Name: "Pizzacı", // ÜRÜN İSMİ
      Description: "Dükkan", // ÜRÜN AÇIKLAMASI
      Price: 20000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "12", // ÜRÜN ID
      Name: "Hamburgerci", // ÜRÜN İSMİ
      Description: "2. Cadde-Dükkan", // ÜRÜN AÇIKLAMASI
      Price: 60000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "13", // ÜRÜN ID
      Name: "Starbucks", // ÜRÜN İSMİ
      Description: "Ana Cadde-Dükkan", // ÜRÜN AÇIKLAMASI
      Price: 75000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "14", // ÜRÜN ID
      Name: "PUB", // ÜRÜN İSMİ
      Description: "En iyi içkiler!", // ÜRÜN AÇIKLAMASI
      Price: 150000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "15", // ÜRÜN ID
      Name: "Kumarhane", // ÜRÜN İSMİ
      Description: "Lüks ve Gösterişli!", // ÜRÜN AÇIKLAMASI
      Price: 150000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
    {
      ID: "16", // ÜRÜN ID
      Name: "Özel İşyeri 1+0", // ÜRÜN İSMİ
      Description: "Büro", // ÜRÜN AÇIKLAMASI
      Price: 13500, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
    {
      ID: "17", // ÜRÜN ID
      Name: "Özel İşyeri 1+1", // ÜRÜN İSMİ
      Description: "Büro", // ÜRÜN AÇIKLAMASI
      Price: 19000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
    {
      ID: "18", // ÜRÜN ID
      Name: "Özel İşyeri 2+1", // ÜRÜN İSMİ
      Description: "Büro", // ÜRÜN AÇIKLAMASI
      Price: 24000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
    {
      ID: "19", // ÜRÜN ID
      Name: "Özel İşyeri 3+1", // ÜRÜN İSMİ
      Description: "Büro", // ÜRÜN AÇIKLAMASI
      Price: 28500, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
    {
      ID: "20", // ÜRÜN ID
      Name: "Şirket", // ÜRÜN İSMİ
      Description: "Hayalini Gerçekleştir!", // ÜRÜN AÇIKLAMASI
      Price: 300000, // ÜRÜN FİYAT
      Type: "Emlak Market", // ÜRÜN TİP],
    },
  ],

  blackMarket: [
    {
      ID: "1", // ÜRÜN ID
      Name: "Baretta", // ÜRÜN İSMİ
      Description: "Tabanca Kategorisi", // ÜRÜN AÇIKLAMASI
      Price: 20000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "Revolver", // ÜRÜN İSMİ
      Description: "Tabanca Kategorisi", // ÜRÜN AÇIKLAMASI
      Price: 25000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    },
    {
      ID: "3", // ÜRÜN ID
      Name: "Glock-18", // ÜRÜN İSMİ
      Description: "Tabanca Kategorisi", // ÜRÜN AÇIKLAMASI
      Price: 35000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "4", // ÜRÜN ID
      Name: "UZİ", // ÜRÜN İSMİ
      Description: "Hafif Makineli", // ÜRÜN AÇIKLAMASI
      Price: 39000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "5", // ÜRÜN ID
      Name: "Pompalı", // ÜRÜN İSMİ
      Description: "Ağır Silah", // ÜRÜN AÇIKLAMASI
      Price: 33000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "6", // ÜRÜN ID
      Name: "AK-47", // ÜRÜN İSMİ
      Description: "Ağır Makineli", // ÜRÜN AÇIKLAMASI
      Price: 50000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
    {
      ID: "7", // ÜRÜN ID
      Name: "HK416", // ÜRÜN İSMİ
      Description: "Ağır Makineli Tüfek", // ÜRÜN AÇIKLAMASI
      Price: 100000, // ÜRÜN FİYAT
      Type: "Black Market", // ÜRÜN TİP
    }, // Çoğaltılabilir
  ],

  uyusturucuMarket: [
    {
      ID: "1", // ÜRÜN ID
      Name: "500 Gram", // ÜRÜN İSMİ
      Description: "Bu ürün Esrar çeşitidir.", // ÜRÜN AÇIKLAMASI
      Price: 5000, // ÜRÜN FİYAT
      Type: "Uyuşturucu Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "1 Kg", // ÜRÜN İSMİ
      Description: "Bu ürün Esrar çeşitidir.", // ÜRÜN AÇIKLAMASI
      Price: 10000, // ÜRÜN FİYAT
      Type: "Uyuşturucu Market", // ÜRÜN TİP
    },
    {
      ID: "3", // ÜRÜN ID
      Name: "500 Gram", // ÜRÜN İSMİ
      Description: "Bu ürün Kokain çeşitidir.", // ÜRÜN AÇIKLAMASI
      Price: 10000, // ÜRÜN FİYAT
      Type: "Uyuşturucu Market", // ÜRÜN TİP
    },
    {
      ID: "2", // ÜRÜN ID
      Name: "1 Kg", // ÜRÜN İSMİ
      Description: "Bu ürün Kokain çeşitidir", // ÜRÜN AÇIKLAMASI
      Price: 20000, // ÜRÜN FİYAT
      Type: "Uyuşturucu Market", // ÜRÜN TİP
    },
  ],
};
