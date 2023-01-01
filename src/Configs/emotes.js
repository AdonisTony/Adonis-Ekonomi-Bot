module.exports = {
  tabanca: "",
  bakiyen: "",
  envantermoney: "",
  money: "",
  ambulans: "",
  polis: "", // virgüllere dikkat edilerek çoğaltılabilir.
};

/* 

Bir komuta emoji eklemek için yolu belirtmek gerekiyor.

Kodun en üstüne bunu yaz
const { emote.js içinde ne isim verdiysen buraya onu yazıcaksın } = require("../Configs/emotes");  

Örnek: const { xirEmojiID } = require("../Configs/emotes");  

Sonra emoji eklemek için mesajın `` bu tırnaklar ile açılması gerekiyor

Mesajın içine ${message.guild.emojis.cache.get(emote.js içinde ne isim verdiysen buraya onu yazıcaksın)} yaz

Örnek: ${message.guild.emojis.cache.get(xirEmojiID)}

Yazdığın emoji ID'sini mesajda görüceksin

NOT: emotes.js içine sadece emoji'nin ID'sini yazmalısın.

*/
