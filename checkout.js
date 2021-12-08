const taxRate = 0.18;           // Sabit degiskenlerimizi belirledik
const shippingPrice = 15.0;

// Local Storage ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Bu sekilde bu sabit degiskenlerimizi birden fazla sayfada kullanabiliyoruz
// Boylelikle browser veritabani kullanilabilir oluyor
// Sayfa acildiginda direk bunu veritabanina atmis oluyor ve kullanabilir hale geliyoruz

window.onload = () => {                                     // Sayfa yuklendiginde su fonksiyon calissin
    window.localStorage.setItem("taxRate", taxRate);        // key ve value olarak tutuyor, icinde "string" olarak tutuyor, hesaplamalarda mutlaka parseInt() ile cevirmek gerekir
    localStorage.setItem("shippingPrice", shippingPrice);   // Bu sekilde basina "window" yazmasak da oluyor cunku herseyde var aslinda bunu biliyoruz

    // Bu degerlerin (Inspect-Application-Local Storage) bolumunde tanimlandigi halini gorebiliriz
    // Browser kapansa dahi local storage da veriler tutulmaya devam eder

    window.sessionStorage.setItem("taxRate", taxRate);
    sessionStorage.setItem("shippingPrice", shippingPrice);

    // Yine ayni sekilde yukaridaki gibi degiskenlerimizi "session storage"da da tutabiliriz
    // Browser kapanirsa session kapanacagi icin icindeki veriler kapanir ama local storagedaki verilerin kullanilabilirligi devam eder
    
    calculateCartTotal();       // Bu fonksiyonu burada cagirmamizin sebebi, ilk acilista tum urunlerin miktari 1 ve hemen total price kisminda ilgili degerler gosterilsin diye 
}

// Increasing-Decreasing the Number of the Products----------------------------------------------------------------------------------------------------------------------------------------------------------------

let quantityControllerDivs = document.getElementsByClassName("quantity-controller");    // Burada arti-eksi butonlarinin oldugu div lerin HEPSINE ulasiyoruz
console.log(quantityControllerDivs);                                                    // (HTML Collection) olarak donderir,dolayisiyla bizim forEach (Arrat methodu) kullanabilmemiz icin bu collectioni array haline getirebilmemiz gerekir
                                                                                        // Ama "for" dongusu ile de HTML Collection ile islem yaptirabilirdim
[...quantityControllerDivs].forEach((quantityControllerDiv)=>{                          // !!! Iste burada "[...quantityControllerDivs]" yapisi ile bu collectioni sanki (Array.from) kullaniyormus gibi bir array haline getirebiliyoruz
                                                                                        // Boyelikle Array ler icin gecerli olan (forEach) methodunu kullanabiliyoruz
    let quantityP = quantityControllerDiv.querySelector("#product-quantity");           // Burada hemen miktarin yazildigi alani oncelikle bi yakaladim 
                                                                                        // Gorulecegi uzere "document" nesnesi yerine artik "quantityControllerDiv" kullanildi ki bunun icinde ara demek
    // (minus button) 
    quantityControllerDiv.firstElementChild.addEventListener("click", ()=>{             // Iste burada firstElementChild ile minus(-) butonuna ulasmis oldum

        /*
        if(quantityP.innerText != "1"){                                                 // Burada hemen bu sekilde bir kontrol yapisi kurararak kullanicinin 1 den kucuk bir sayi girebilmesini engelleyebilirdik, yani 1 e esit oldugunda azaltma islemi yapamayacakti
            quantityP.innerText = parseInt(quantityP.innerText) - 1;
        }
        */

        quantityP.innerText = parseInt(quantityP.innerText) - 1;                        // Kullanici her bastiginda urun miktarinin 1 azaltilmasi burada saglandi
        if(quantityP.innerText == "0"){                                                 // Eger urun miktari "0" olursa da kullaniciya bir uyaru cikartacagiz, 'OK' derse silinir aksi takdirde islem yapmaz
            confirm('The product will be removed!') ? quantityControllerDiv.parentElement.parentElement.remove() : quantityP.innerText = 1;     
        }                                                                               // Kullanici eger ok derse urun silinecek, aksi takdirde urun miktarini tekrardan 1 e esitleyecek
        calculateProductTotal(quantityP);                                               // Ve mevcut miktara gore hesaplama islemlerini tekrar yapsin diye calculateProductTotal() fonksiyonunu cagirdik
    });

    //  (plus button)
    quantityControllerDiv.lastElementChild.addEventListener("click", ()=>{              // Iste burada firstElementChild ile plus(+) butonuna ulasmis oldum
        quantityP.innerText = parseInt(quantityP.innerText) + 1;                        // Kullanici her bastiginda urun miktarinin 1 arttirilmasi burada saglandi                     
        if(quantityP.innerText == 10){                                                  // Eger urun miktari 10 ise kullaniciya maksimum miktara ulasti diye bir uyari gostersin istedim
          quantityP.innerText = 10;
          alert("You have reached the maximum number that you can order!");
        }else if (quantityP.innerText > 10) {                                           // Kullanicinin 10 dan fazla miktar girememesi icin bu sekilde bir kontrol sagladik
          alert('You can not order more than this!');                                   // Burada kullanici urun miktari 10 iken tekrar "+" butonuna basarsa quantityP.innerText == 11 olacak dolayisiyla sartimizi saglayip ikaz gosterecek 
          quantityP.innerText = 10;                                                     // Bunu burada yazmazsak miktari yine de arttirir
        }
        calculateProductTotal(quantityP);                                               // Ve son duruma gore tekrar hesaplamasini istedik
    });
});

// Calculating the Product Total Price------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const calculateProductTotal = (quantityP) =>{                                           // calculateProductTotal() fonksiyonu ile miktarlara gore degisen bir yapi kuruyoruz
    let productInfoDiv = quantityP.parentElement.parentElement;                         // classi ".product-info" olan dive ulasmis olduk, cunku ilk parentElement ile sadece classi "quantity-controller" olan dive ulasabiliyoruz bunun icin 2 adet kullandik
    const productPrice = parseFloat(productInfoDiv.querySelector("strong").innerText);  // Bu div vasitasiyla urunlerin fiyatlarina ulasabildik ve onu bir degiskene atadik
    // console.log(productPrice);
    // console.log(quantityP.innerText);
    let productTotalPrice = productPrice * parseInt(quantityP.innerText);               // En son olarak urun miktari ve fiyatini carparak product total price bulmus olduk 
    // console.log(productTotalPrice);
    let productTotalDiv = productInfoDiv.querySelector(".product-line-price");          // Urun toplam fiyatinin yazilacagi alani yakaladik 
    productTotalDiv.innerText = productTotalPrice.toFixed(2);                           // O alanin icersine noktadan sonra 2 hane olacak sekilde yazdirdik
    calculateCartTotal();                                                               // calculateCartTotal(); fonksiyonu ile tum sepetin toplam fiyatini tekrar hesaplattik       
}

// Calculating the cart Total Price-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const calculateCartTotal = () =>{

  // NodeList.forEach or array.forEach                                                  // (".querySelectorAll") ile donderilen (NodeList) olur
  let productTotalPrices = document.querySelectorAll('.product-line-price');            // Ayni mantikla tum urunlere ait olan total price kisimlarini bir ("NodeList") de topladik, "NodeList" lere de "forEach" metodunu uygulayabiliyoruz
                            
  // HTML Collection [...].forEach --> anca boyle olur
  // let productTotalPrices = document.getElementsByClassName("product-line-price");    // (".getElementsByClassName") ve benzerleri ile donderilenler de ("HTML Collection") olur

  let subtotal = 0;
  console.log(productTotalPrices);
  productTotalPrices.forEach(productPrice => {                                          // Tum total pricelara tek tek ulasabiliyoruz
    subtotal += parseFloat(productPrice.innerText);                                     // Baslangicta "0" olarak belirlenen subtotale de her gelen miktari ekliyoruz boylelikle total price hesaplamis oluruz
  });

  // let taxPrice = subtotal * taxRate;                                                 // Bu sekilde de kullanabiliriz, alttaki sekilde de kullanilabilir

  let taxPrice = subtotal * parseFloat(localStorage.getItem('taxRate'));                // taxPrice, local storagedan gelen vergi orani ve toplam fiyata gore "taxPrice" belirleniyor
  let shipping = subtotal > 0 ? shippingPrice : 0;                                      // Eger subtotal '0' dan buyukse ki urun var demektir, local storagedan "shippingPrice" gelir ve shipping degiskenine atanir aksi takdirde "0" gelir
  let cartTotal = subtotal + taxPrice + shipping;                                       // En son olarak da tum masraflari cartTotal diye bir degiskene atadik

  document.querySelector('#cart-subtotal p:nth-child(2)').innerText = subtotal.toFixed(2);      // id si "cart-subtotal" olan div in p lerinden 2. sinin icine yazdirdik
  document.querySelector('#cart-tax p:nth-child(2)').innerText = taxPrice.toFixed(2);           // id si "cart-tax" olan div in p lerinden 2. sinin icine yazdirdik
  document.querySelector('#cart-shipping p:nth-child(2)').innerText = shipping.toFixed(2);      // id si "cart-shipping" olan div in p lerinden 2. sinin icine yazdirdik
  document.getElementById('cart-total').lastElementChild.innerText = cartTotal.toFixed(2);      // Burada da degisik olsun diye ilgili divin son elemaninin icine yazdirdik, ayni yere isaret ediyor ("p:nth-child(2)")

} // ! Gorulcegi uzere eger ".querySelector" kullanilirsa "p:nth-child(2)" seklinde yazmaliyiz, ".getElementById" kullanilirsa da DOM kullanmaliyiz

// Removing Product --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.querySelectorAll(".remove-product").forEach((removeButton)=>{      // classi ".remove-product" olan tum "Remove" buttonlara ulastik ve (".querySelectorAll") onlari bir ("NodeList"e) atti
    removeButton.addEventListener("click", ()=>{                            // Butona tiklandiginda da removeProduct(removeButton) cagirilacak 
        removeProduct(removeButton);                                        // Peki bu ne yapiyor? Cevabi asagida...
    });
});

const removeProduct = (removeButton) =>{                                    // Fonksiyon icerisine bu butonu alabilelim ki onun uzerinden atalarina ulasabilelim
    confirm("Are you sure you want to remove?") ? removeButton.parentElement.parentElement.parentElement.remove(): null; // Bu sekilde classi "product" olan dive (komple urun bilgileri olan div) ulastik ve sildik
    calculateCartTotal();                                                   // Tekrar cagirmamiz gerekir ki son guncel duruma gore fiyatlari yazsin
}

// Removing All Products -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let removeAllButton = document.querySelector('.removeAll');
let products = document.querySelector('.products');

removeAllButton.addEventListener('click', () => {
  products.remove();                                                        // All product divs have been deleted
  removeAllButton.remove();                                                 // The Remove All button has been deleted
  calculateCartTotal();                                                     // Son haline gore tekrardan total price hesaplansin dedik ki urunler gittigi icin "0" olur hersey
});





