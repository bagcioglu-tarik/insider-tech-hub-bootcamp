
const products = [
    { id: 1, name: 'Laptop', price: 15000, stock: 5 },
    { id: 2, name: 'Telefon', price: 8000, stock: 10 },
    { id: 3, name: 'Tablet', price: 5000, stock: 8 },
    { id: 4, name: 'Kulaklık', price: 1000, stock: 15 },
    { id: 5, name: 'Mouse', price: 500, stock: 20 }
];


class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.discountApplied = false;
    }

    addItem(productId, quantity = 1) {
        try {
            const product = products.find(p => p.id === productId);
            
            
            if (!product) {
                throw new Error('Ürün bulunamadı!');
            }
            
            if (product.stock < quantity) { // < yerine <= kullanıldı
                throw new Error('Yetersiz stok!');
            }
            
            const existingItem = this.items.find(item => item.productId === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity
                });
            }
            
            product.stock -= 1;

            this.calculateTotal();
            this.updateUI();

        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            this.showError(error.message);
        }
    }

    removeItem(productId) {
        try {
            const itemIndex = this.items.findIndex(item => item.productId === productId);
            
            if (itemIndex === -1) {
                throw new Error('Ürün sepette bulunamadı!');
            }

            const item = this.items[itemIndex];
            const product = products.find(p => p.id === productId);

            if (product) {
                item.quantity-= 1 ; // item.quantity yerine sabit değer            
                product.stock += 1;
            }
            
            if (item.quantity === 0) {
                this.items.splice(itemIndex, 1);
            }

            

           document.dispatchEvent(new Event('stockUpdate'));
            this.calculateTotal();
            this.updateUI();

        } catch (error) {
            console.error('Ürün silme hatası:', error);
            this.showError(error.message);
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity); // quantity çarpımı unutuldu
        }, 0);

        if (this.discountApplied && this.total > 0) {
            this.total -= (this.total * 0.1);
        }
    }

    applyDiscount(code) {
        if (code === 'INDIRIM10' && !this.discountApplied) {
            this.discountApplied = true;
            this.calculateTotal();
            this.updateUI();
            this.showMessage('İndirim uygulandı!');
        } else {
            this.showError('Geçersiz indirim kodu!');
        }
    }

    // UI Güncelleme
    updateUI() {
        const cartElement = document.getElementById('cart');
        const totalElement = document.getElementById('total');
        
        if (cartElement && totalElement) {
            cartElement.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} adet</span>
                    <span>${item.price} TL</span>
                    <button onclick="cart.removeItem(${item.productId})">Sil</button>
                </div>
            `).join('');

            totalElement.textContent = `Toplam: ${this.total} TL`;
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            errorElement.textContent += message + '\n';
        }
    }

    showMessage(message) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        }
    }
}

class App {
    constructor() {
        window.cart = new ShoppingCart();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProducts();
            this.setupEventHandlers();
        });
    }

    renderProducts() {
        const productsElement = document.getElementById('products');
        if (productsElement) {
            productsElement.innerHTML = products.map(product => `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>Fiyat: ${product.price}.00 TL</p>
                    <p>Stok: ${product.stock}</p>
                    <button onclick="app.addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        Sepete Ekle
                    </button>
                </div>
            `).join('');
        }
    }

    setupEventHandlers() {
        const discountForm = document.getElementById('discount-form');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('discount-code');
                if (codeInput) {
                    window.cart.applyDiscount(codeInput.value);
                }
            });
        }

        document.addEventListener('stockUpdate', () => {
            this.renderProducts();
        });
    }

    addToCart(productId) {
        window.cart.addItem(productId, undefined);
        document.dispatchEvent(new Event('stockUpdate'));
    }
}

const app = new App();
window.app = app; 

// Debug etmeden once inceledigim dosyalar birbirine baglaniyor mu diye kontrol ettim. Daha sonra devtools tarafina gectim. Chrome'da projeyi actim. Incelemeye basladim. Urunleri sepete eklemeye basladim. Sepete eklerken 2 hata farkettim ayni urunu 1'den fazla sepete ekledigimde fiyat bilgisi artmiyordu. Stoktan cok urun eklemeye devam ettigimde ise herhangi bir hata vermiyordu. Daha sonra ayni urunden 1'den fazla ekledigimde ve silmeye calistigimda urun card'inin hepsini siliyordu. Adet bazinda silme islemi yapmiyordu. Diger bir konu da yuzde 10 indirim kodunu uyguladigimda 'INDIRIM10' yuzde 90 indirim yapiyordu. Once fonksiyonlarin adlarin islevlerini anlamaya calistim. addItem fonksiyonu en yakinda oldugundan ondan basladim. Fonksiyonda stoktaki urun sayisini sepetteki urun gectiginde hata vermesi gereken bir kisim oldugunu goruyorum ve buraya breakpoint koyuyorum daha sonrasinda bu fonksiyonun sonuna da bir adet breakpoint koyuyorum. stoktaki urunden fazla urun ekliyorum ama breakpointte durup fonksiyon hata firlatmadi. stoktaki urunden fazla urun ekliyorum ama breakpointte durup fonksiyon hata firlatmadi. Niye hata firlatmadi diye baktigimda quantity degeri sabit kaliyor ya da stock degeri her sorguda dusmuyor (sepete eklemede). Her fonksiyon calistirildiginda stok degerinin dusmesi icin bir kod ekliyorum. Diger yoldan giderek her sepete tiklandiginda quantity degeri de artirilabilir. Simdi stok miktari dustu ama stok miktari daha 1 varken sepete ekle butonu deactive oluyor. Tekrar fonksiyona breakpoint koyup gelen degerlere bakiyorum. <= ifadesindeki esitlik son stok urununu eklemeyi engelliyor. esitligi kaldiriyorum. Diger bir sorun sepetten urun silerken teker teker silmek yerine o urunu tamamen silmesi. Remove item fonksiyonunun ortasina ve sonuna breakpointleri koyuyorum ve gelen degerlere bakiyorum. Product stock artiyor ama bu ui'a yansimiyor. Bunu duzeltmek icin oncelikle addToCart fonksiyonuna eklendigi gibi 'document.dispatchEvent(new Event('stockUpdate'))' ifadesini bu fonksiyonun sonuna ekliyorum. Bu sefer tekrar calistiriyorum. Product stock artiyor ama bu sefer de 2 urun ekleyip urunu sil dedigimde direkt urunu sildi. Sadece adet olarak dusmesi gerekirdi. Bu islemin splice fonksiyonu ile alakali oldugunu anliyorum. Breakpointleri splice fonksiyonun onune ve arkasina koyuyorum. Splice ile oldugundan artik eminim. Splice fonksiyonunu kosullu bir yapiya aliyorum item.quantity sadece 0'a esit oldugunda urunu toptan silsin. 
// Burasi da tamam ama bir sikinti var. Stok miktari artiyor ama urunu tek tek silmek istedigimde urun miktari azalmiyor. Breakpoint koymama gerek kalmadan once urun miktarini azaltan kodu yaziyorum. Sonra onune ve arkasina breakpoint koyuyorum. Urun miktari simdi azaldi bu kisimda kod eksiksiz calisiyor. Diger kisma geciyorum. Fiyat bilgisinde hata var her urun adedinin fiyatini ayrica goremiyorum calculateTotal fonksiyonu sanirsam bununla alakali fonksiyonun ortasina ve sonuna breakpointleri koyuyorum. Burada itemlarin miktari ile degil sadece item'larin fiyatiyla yani kategorinin fiyatiyla bir onceki kategoriyi topluyor. Farkli kategorileri topluyor. Ayni kategorideki urun miktarini hesaba katmiyor. item.quantity ogesini her urun kategorisinin fiyatiyla carpiminin eksik oldugunu farkediyorum ve isleme parantez dahilinde ekliyorum. Tekrar onune ve sonuna breakpointleri koyup sorunsuz calistigini input outputlarin dogru oldugunu goruyorum. Son problem urun indirimlerini yanlis yapmasi. Indirim yine bu fonksiyonun icinde yapiliyor. ApplyDiscount yazan kosulun sonuna breakpoint koyuyorum. gelen discount miktari totalden cikarilmayip direkt carpimi discount olarak veriliyor oysa once discount miktari ile carpilmasi sonra totalden cikarilmasi lazim. Bu kod parcacigini ekliyorum ve calistiriyorum. Her sey sorunsuz ilerliyor
