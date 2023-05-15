const gameContainer = document.getElementById("frame");
const skorTable = document.getElementById("skor");
const zamanlayıcı = document.getElementById("zaman");
let skor = 0;  //skoru tutan değişkenimiz
let kalanSure = 60;  //kalan süreyi tutan değişkenimiz
let gameInterval;
let targets = [];  //balonları tutan array

function getRandomNumber(max) { // Hedefleri random konumlarda oluşturabilmek için gerekli fonksiyonumuz 
    return Math.floor(Math.random() * max);
}

function target_olustur() { //Hedefleri oluşturan fonksiyon
    const anlik_target = document.querySelector(".target");
    if (anlik_target) {  //Ekranda herhangi bir hedef var mı kontrolu yapılıyor
        anlik_target.parentElement.removeChild(anlik_target); // Eğer ekranda hedef varsa yeni hedef oluşturmadan önce eski hedefi ekrandan kaldırıyoruz.
    }

    const target = document.createElement("div");  //ekranda hedefi içinde tutacağımız div açılıyor
    target.classList.add("target");   //targetin class'ı ekleniyor
    //  Targetleri random konumlarda oluşturmak için atamalar yapıyoruz.
    target.style.top = getRandomNumber(gameContainer.clientHeight - 100) + "px";    // hedefimiz client ın içindeki rastgele herhangi bir yüksekliğe alıyor
    target.style.left = getRandomNumber(gameContainer.clientWidth - 100) + "px";    // hedefimiz client ın içindeki rastgele herhangi bir genişlik alıyor
    gameContainer.appendChild(target);  //gamecontainerın içine oluşturduğumuz hedefi yerleştiriyoruz

    const targetSure = setInterval(function () {   // Eğer oyuncu hedefe ulaşamadan hedefin ekranda kalma süresi biterse hedefin ekrandan silinmesini sağlayan fonksiyon
        target.parentElement.removeChild(target);   // Hedefimiz temizleniyor
        clearInterval(targetSure);     // Hedef süresi sıfırlanıyor
        if (!target.classList.contains("eskitarget")) { //POPLANIYOR
            removeLife();   // Targetin yok ediliyor
        }
        target_olustur(); // ve yeni target oluşturuluyor
    }, 1000);   // default olarak hedeflerin ekranda kalma süresi 1000ms olduğundan 1000ms de bir fonksiyon tekrar çalışıyor

    target.addEventListener("click", function () {  //  hedefe tıklama durumunuzda oluşacak durumları tetikliyor
        clearInterval(targetSure);     // hedef için kalan süreyi sıfırlayıp yeni hedefin oluşumunu tetikliyor
        target.parentElement.removeChild(target);   // hedefi ekrandan kaldırıyor
        target.classList.add("eskitarget");     //listede pop elemanı ekleniyor kontrol yapmak için
        skor++;    // Hedefe tıklandığı için skorumuz 1 puan artıyor
        skorTable.innerHTML = "Skor: " + skor;  // Skorumuz ekranda güncelleniyor
        if (skor % 4 === 0) {  // Oyunun mantıken ilerledikçe zorlaşması adına her patlatılan 4 balondan sonraki balonlar önceki balonların ekranda kalma süresinden daha az sürede ekranda kalıyor
            const targetDuration = Math.max(1000 - skor, 400);  // Max 1000ms ekranda kalacak şekilde oyun ilerledikçe skor kadar süre 1000 ms den çıkartılıyor ve hedefler artık ekranda daha az kalıyor
            clearInterval(gameInterval);    //Eski değerler siliniyor
            gameInterval = setInterval(target_olustur, targetDuration); // Yeni değerlerimizle birlikte oyun devam ediyor
        }
    });
}

function devam() {  
    while (targets.length > 0) {     
        const target = targets[0];  // Döngü her çalıştığında ilk elemanı alıyoruz.
        target.parentElement.removeChild(target); // Elemanı kaldırıyoruz.
        targets.shift();    //  targets arrayini güncelliyoruz (shift metoduyla).
    }

}

function baslat() {     // Oyunu başlatan ve bitiren fonksiyon
    function sureKontrol() {    // Kalan süreyi kontrol ediyoruz
        if (kalanSure > 0) {    // Daha süremiz kaldıysa oyuna devam edip yeni targetler oluşturuyoruz
            devam();
            target_olustur();
            kalanSure--; // Kalan zamanı 1 saniye düşürüyoruz
            zamanlayıcı.innerHTML = "Zaman: " + kalanSure; // Geriye kalan zamanı html de güncelliyoruz
            setTimeout(sureKontrol, 1000);  // 1000 ms yani 1 saniye bekletiyoruz
        } else {
            clearInterval(gameInterval);    // süre kalmadıysa temizliyoruz
            alert("Oyun sona erdi !!! Toplam skorunuz: " + skor); // Alert ile oyunun bittiğini kullanıcıya bildiriyoruz
        }
    }
    sureKontrol();  // Tekrardan kontrolleri sağlıyoruz
}


window.addEventListener("load", function () {   // Siteye giriş yapıldığında veya yenilendiğinde oyunun tekrardan başlaması için komut
    baslat();
});


const rehberButton = document.getElementById("rehber"); // Oyun rehberinin butonu için değişkeni atıyoruz
const secbg = document.getElementById("bg-sec");    //Frame backgroundu değiştirmek için olan comboboxımız için değişkeni atıyoruz 

rehberButton.addEventListener("click", function () {    // Oyun rehberi butonuna tıklandığında alert atabilmek için butona listener ekliyoruz ve oyun rehberini alert atıyoruz
    alert("WEBAIM rekabetçi fps shooter oyunlarındaki aiminizi antremana geliştirip daha üst seviyeye getirmenizi amaçlar. vurduğunuz her hedefte skorunuz 1 puan artar ve vurduğunuz her 4 hedefte bir  oyun zorluğu artar. Arkaplan seçeneklerinden bazı oyunların arkaplanlarına ulaşabilirsiniz.");
});

secbg.addEventListener("change", function () {  //Frame backgroundu değiştirmek için olan comboboxımızda herhangi bir değişikli durumu olduğunda arkaplan değiştirebilmek için listener ekliyoruz
    const secilenBg = secbg.value;  // Seçilen değerdeki değeri yani hangi background seçildiyse onun adresini alıyoruz
    gameContainer.style.backgroundImage = `url(${secilenBg})`;  // Seçilen değerin adresini framein backgrounduna atıyoruz 
});