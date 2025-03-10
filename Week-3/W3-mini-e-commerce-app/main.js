
$(document).ready(function () {
  // urunleri API'dan çektik
  $.getJSON("https://fakestoreapi.com/products", function (urunler) {
    
    // her bir urun resmini div icine ekledim. carousel islevini .slick kendisi otomatik olarak yapiyor
    $(".carousel")
      .html(
        urunler.map(
          (urun) => `<div><img src="${urun.image}"></div>`
        )
      )
      .slick({
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 1500,
      });
    
    
    //   Urun kartlari
    const urunKalibi = $(
      '<div class="urunKarti">\
              <div>\
                <h3 class="title"></h3>\
                </div>      <div>\
                <img class="image">\
              </div>     <div>\
                <p class="price"></p>\
                <button class="sepeteEkle">Sepete Ekle</button>\
                <button class="detaylar">Detay</button>\
                <p class="description"></p>\
              </div>\
            </div>'
    );

    $.each(urunler, function (index, urun) {
      const urunKarti = urunKalibi.clone(true);
      // once kalibimizi her bir gelen eleman icin olaylariyla beraber klonluyoruz

      // simdi kalibimizin icini dolduruyoruz
      urunKarti.find(".title").text(urun.title);
      urunKarti.find(".image").attr("src", urun.image);
      urunKarti.find(".price").text("$" + urun.price);
      urunKarti.find(".description").text(urun.description);
      // veri geldiginde once gizle sonra fadein yap
      urunKarti.hide().fadeIn("slow");

      $("#urunListesi").append(urunKarti);
    });


    const sepettekiler = JSON.parse(localStorage.getItem("sepettekiler"));
    // sepetteki urunleri json olarak kaydetmistik, tekrardan storage'dan array seklinde cekip each ile objelere ulasip tekrar kalibimiza koyup sepet kismina append ediyoruz
    $.each(sepettekiler, function(index, urun) {
        $("#sepeteEkle").append(
            `<div class="sepetUrunu">
                <img src="${urun.image}" class="height-50">
                <p>${urun.title}<br>${urun.price}</p>
                <button class="delete-btn">Sepetten Sil</button>  
            </div>`
      );
    }
)
// sepetteki urun sayisini tekrardan guncelliyoruz kac child varsa lenghtlerini alarak en asagidaki fonksiyonda
   sepetiGuncelle();

});


  $("#sepet").on("click", ".delete-btn", function () {
    $(this).closest(".sepetUrunu").remove();
    sepetiGuncelle();
  });
// sepetteki urunleri sadece dinamik olarak silebildim, local storage'dan da silmek icin nasil bir yontem izlemem gerekir bilmiyorum


  $("#urunListesi").on("click", ".sepeteEkle", function () {
    // sepete ekleye tiklandiginda once urun karti bilgilerine ulasip bunlari bir obje olarak kaydetmesini sagladim
    const eklenecekUrun = $(this).closest(".urunKarti");
    const urunBilgisi = {
      title: eklenecekUrun.find(".title").text(),
      price: eklenecekUrun.find(".price").text(),
      image: eklenecekUrun.find(".image").attr("src"),
    };


    //shake animasyonu verdim 
    eklenecekUrun.effect("shake", 'slow');
    sepetiGuncelle();

    // yukarida obje olarak bilgilerini aldigim urunu bir kalip (paket) icerisine koydum. Paketin yapisini ilk burada olusturmustum aslinda sonradan localStorage'dan veriyi cekerken de ayni formati kullandim
    const sepetUrunu = $('<div class="sepetUrunu">').html(
      
        `
            <img src="${urunBilgisi.image}" class="height-50">
            <p>${urunBilgisi.title}<br>${urunBilgisi.price}</p>
            <button class="delete-btn">Sepetten Sil</button>  
          `
          
    );
    //sepete yeni eklenen ogeleri ust tarafta gozukecek sekilde sepete ekledim
    $("#sepeteEkle").prepend(sepetUrunu);

    //daha once sepete eklenen ogeleri once cekiyorum, sonra cektigim ogelerle de beraber yeni sepete eklenen ogeyi localStorage'a yeniden stringify edip koyuyorum
    const sepettekiler = JSON.parse(localStorage.getItem("sepettekiler")) || [];
    sepettekiler.push(urunBilgisi);
    localStorage.setItem("sepettekiler", JSON.stringify(sepettekiler));
    
  });


//   temizle fonksiyonu
  $("#sepetiTemizle").click(function () {
    $("#sepeteEkle").empty();
    localStorage.removeItem("sepettekiler");
    sepetiGuncelle();
  });


// once input kismina yazilan degeri aliyorum, sonra her bir ogede bu degeri eslesiyormu veya iceriyor mu diye gezdiriyorum
  $("#arama").on("input", function () {
    const term = $(this).val().toLowerCase();
    $(".urunKarti").each(function () {
      const title = $(this).find(".title").text().toLowerCase();
      $(this).toggle(title.includes(term));
    });
  });


//   detay kisminin asagiya dogru acilmasi kapanmasi
  $("#urunListesi").on("click", ".detaylar", function () {
    $(this).closest(".urunKarti").find(".description").slideToggle();
  });


  function sepetiGuncelle() {
    $("aside span").text($("#sepeteEkle").children().length);
  }
});
