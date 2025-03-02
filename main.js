document.querySelector('form').addEventListener('submit', (e) => {  
    try {
        //submit ile sayfayi yenilemeyi engellesin diye prevent yapiyoruz
        e.preventDefault();


        const baslik = document.querySelector('.baslik').value.trim(); //etrafindaki bosluklari aldik
        const aciklama = document.querySelector('.aciklama').value.trim(); //etrafindaki bosluklari aldik
        const oncelikler = document.querySelector('input[name="oncelikler"]:checked');


        // baslik ve oncelik kismi doldurulmamissa formu submit ettirmiyoruz burada
        document.querySelector('.baslik-hatasi').style.display = 'none';
        document.querySelector('.oncelik-hatasi').style.display = 'none';

        let doluMu = true;

        if (!baslik) {
            document.querySelector('.baslik-hatasi').style.display = 'block';
            doluMu = false;
        }  
        if (!oncelikler) {
            document.querySelector('.oncelik-hatasi').style.display = 'block';
            doluMu = false;
        }
        if (doluMu === false) return;

        //gorevlerimizi ekliyoruz
        const gorevler = document.createElement('div');
        gorevler.className = 'gorevler';
        gorevler.innerHTML = `
            <h2>${baslik.toUpperCase()}</h2>
            ${aciklama ? `<p>ACIKLAMA: <span>${aciklama.toLowerCase()}</span></p>` : ''}
            <p class="oncelikler"> Onceligi: <span class="${oncelikler.value}">${oncelikler.value}</span></p>
            <div class="gorevButonlari">
                <button class="tamamlandiBtn">Tamamlandi</button>
                <button class="silBtn">Sil</button>
            </div>
        `;


        document.querySelector('.gorev-listesi').prepend(gorevler);
        document.querySelector('form').reset();

    } catch (err) {
        alert(err)
    }
});


document.querySelector('.gorev-listesi').addEventListener('click', (e) => {
    const gorev = e.target.closest('.gorevler');
    //tikladigimiz butonun .gorevler olan parent'ini al ve onun uzerinde islem yapalim

    if (e.target.classList.contains('silBtn')) {
        const onay = confirm('Emin misiniz?')
        if(onay) gorev.remove();
    } 
    else if (e.target.classList.contains('tamamlandiBtn')) {
        gorev.classList.toggle('tamamlandi');
        e.target.innerHTML = gorev.classList.contains('tamamlandi') 
            ? 'Tamamlanmadi' 
            : 'Tamamlandi';
    }
    
    e.stopPropagation(); //bubbling yok ama her ihtimale karsi yine de koydum ilerideki gelistirmeler icin iyi olabilir
});