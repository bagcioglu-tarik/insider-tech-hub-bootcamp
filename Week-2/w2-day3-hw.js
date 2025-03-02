    const wrapper = document.createElement("div");

    const baslatBtn = document.createElement("button.baslat");
    baslatBtn.innerText = "Baslat";
    const sifirlaBtn = document.createElement("button.sifirla");
    sifirlaBtn.innerText = "Sifirla";
    const geriSayici = document.createElement("p");
    geriSayici.innerText = "0";

    wrapper.appendChild(baslatBtn);
    wrapper.appendChild(sifirlaBtn);
    wrapper.appendChild(geriSayici);
    document.body.appendChild(wrapper);

    let geriSayimdakiZaman = 0;
    let zamanlayici = 0;

baslatBtn.addEventListener("click", () => {
    
        let verilenSure = prompt("Geri sayim suresi girin:");
        let sureNum = Number(verilenSure);

    if (isNaN(sureNum) || verilenSure <= 0) alert("gecerli bir sure veya 0'dan buyuk bir sure girin!");
        geriSayimdakiZaman = sureNum;
        geriSayici.innerText = geriSayimdakiZaman;

        clearInterval(zamanlayici);
            zamanlayici = setInterval(() => {
            geriSayimdakiZaman--;
            geriSayici.innerText = geriSayimdakiZaman > 0 ? geriSayimdakiZaman : "!!brrrrr!!";

    if (geriSayimdakiZaman <= 0) clearInterval(zamanlayici);

  }, 1000);
});

sifirlaBtn.addEventListener("click", () => {
  clearInterval(zamanlayici);
  geriSayici.innerText = "Sifirlandi";
});
