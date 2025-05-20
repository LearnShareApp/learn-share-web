import styles from "./page.module.scss";

export default function AboutPageSr() {
  return (
    <div className={styles.container}>
      <h1>O nama</h1>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Ko smo mi?</h2>
        <p>
          Learn&Share je platforma za razmenu znanja gde svako može biti i
          učenik i učitelj. Stvaramo bezbednu i dinamičnu zajednicu u kojoj
          korisnici razmenjuju iskustva i međusobno se podržavaju u razvoju.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Naša misija</h2>
        <p>
          Težimo ka tome da obrazovanje bude dostupno svima, pružajući platformu
          na kojoj svi mogu da dele svoja znanja i veštine, razvijaju lični
          potencijal i otkrivaju nove horizonte.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Šta nudimo?</h2>
        <ul>
          <li>Pregledan i intuitivan interfejs</li>
          <li>Verifikovani korisnici radi sigurnosti</li>
          <li>Podrška zajednice istomišljenika i stručnjaka</li>
          <li>Mogućnost deljenja znanja u bilo kojoj oblasti</li>
        </ul>
      </div>

      <p>
        Pridruži nam se i otkrij svet znanja i razmene iskustava sa hiljadama
        korisnika širom sveta!
      </p>
    </div>
  );
}
