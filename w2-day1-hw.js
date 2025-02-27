// 1. gorev
let kullaniciBilgileri = {
    name: prompt("Adiniz Nedir?"),
    age: prompt("Yasiniz Kac?"),
    job: prompt("Mesleginiz nedir?"),
  };

  // 2. gorev
  const sepet = [];
  const urunSayisi = Number(prompt('Merhabalar sitemize hosgeldiniz... Sepetinize kac urun eklemek istediginiz yaziniz'))

  function sepeteEkle() {
    let urunAdi = prompt("Sepete eklemek istediginiz urunu yazin:");
    let urunFiyati = Number(prompt("Urunun Fiyati:"))

  if (urunAdi === '') return alert('Lutfen gecerli bir urun adi giriniz!');
   if (isNaN(urunFiyati) || urunFiyati <= 0) return alert('Sayi turunde bir fiyat bilgisi veya 0\'dan buyuk bir fiyat giriniz!');
    
   sepet.push({
      name: urunAdi,
      price: urunFiyati,
    });
    
    alert(`${urunAdi} urunu sepete eklendi. Fiyat ${urunFiyati} TL`);
    console.log('Sepetiniz: ', sepet)
  }

  while (true) {
    if(sepet.length === urunSayisi) {
      break;
    } else {
      sepeteEkle();
    }
  }

  // 2. gorev 2. kisim
  let sepetToplami = sepet.reduce((toplam, yeni) => toplam + yeni.price, 0);
  console.log(`Toplam Fiyat: ${sepetToplami} TL`);
  
  // 2. gorev bonus kisim
  function sepettenCikar() {
    let urunAdi = prompt("Cikarmak istediginiz urunun adi:");
    let index = sepet.findIndex(urun => urun.name === urunAdi);
   
    if (index !== -1) {
      sepet.splice(index, 1);
      console.log(`${urunAdi} sepetten cikarildi.`);
    } else {
      console.log("Urun bulunamadi.");
    }
  }
  
  sepettenCikar()