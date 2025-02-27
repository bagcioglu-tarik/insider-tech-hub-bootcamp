const longestCollatz = (sayi) => {
    let islemSayisi = 0;
    
    while (sayi > 1) {
      sayi = sayi % 2 === 0 ? sayi / 2 : sayi * 3 + 1
      islemSayisi++
    }

    return islemSayisi + 1
  };

  const biggestNum = (ustAralik) => {
    let chain = 0
    let biggestCollatz = 0
    
    for(let i = ustAralik; i > 0; i--) {
       
        if(longestCollatz(i) > chain) {
        chain = longestCollatz(i)
        biggestCollatz = i
       }

    }
    
    return `${ustAralik} altindaki en cok terim dizisinden olusan collatz sayisi ${biggestCollatz}'dir. ${chain} terimden olusan bir zincirle 1'e kadar kuculur.`
  }
  
  console.log(biggestNum(1000000))