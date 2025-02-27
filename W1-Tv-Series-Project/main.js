function favButton() {
    const btn = document.querySelector('.favori-btn');
    btn.classList.toggle('active');

    if (btn.classList.contains('active')) {
        btn.innerHTML = 'Favorilerde ❤'
      } else {
        btn.innerHTML = "Favorilere Ekle";
      }
}