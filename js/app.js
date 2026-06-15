const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjcm9FTr0t1fJ1WLHdF93Vr2GhlzLHbkpheCecZTk1B2eeUxgLtw5V7LC4n7UlSpDuOQ/exec";

// URL du CSV publié (Fichier → Partager → Publier sur le web → feuille "Reponses" → CSV)
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD4kZQj44eIOlS65oZBc1_BcqcagIfRrDUKg_bFFw4ZGdtuN0T0jsYVnDAy-fMOJDvnuNmW27vIN9p/pub?gid=1950272531&single=true&output=csv";

let totalHenombyActuel = 0;

// Mode "Hanome vola fotsiny" : true quand l'utilisateur a cliqué sur le bouton
// "HANOME VOLA FOTSINY". Dans ce mode, seuls Anarana, Mail et Vola homena
// (don en argent) sont utiles.
let modeDonSeulement = false;

const OBJECTIF_HENOMBY = 60;
const MINIMUM_HENOMBY = 3;

const EMAILS_AUTORISES = [
  "edgar.randrianarivelo@gmail.com",
  "lucvanchristopher@gmail.com",
  "aliciafany@yahoo.fr",
  "racambera@yahoo.fr",
  "robinson.riantsoa@gmail.com",
  "luccic69@gmail.com",
  "solrandria@yahoo.fr"
];

const form = document.getElementById("sakafoForm");
const mailInput = document.getElementById("mail");
const henombyInput = document.getElementById("henomby");
const donArgentInput = document.getElementById("donArgent");

const restrictedFields = document.getElementById("restrictedFields");
const minimumMessage = document.getElementById("minimumMessage");
const objectifAtteintMessage = document.getElementById("objectifAtteintMessage");

const viandeSection = document.getElementById("viandeSection");
const donSection = document.getElementById("donSection");
const voankazoSection = document.getElementById("voankazoSection");
const autresSection = document.getElementById("autresSection");

const donSeulementBtn = document.getElementById("donSeulementBtn");

const totalActuelSpan = document.getElementById("totalActuel");
const resteMessage = document.getElementById("resteMessage");
const progressBar = document.getElementById("progressBar");

const statusDiv = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

function calculerReste() {
  return Math.max(OBJECTIF_HENOMBY - totalHenombyActuel, 0);
}

function calculerMinimumDemande() {
  const reste = calculerReste();

  if (reste === 0) {
    return 0;
  }

  return Math.min(MINIMUM_HENOMBY, reste);
}

function afficherObjectif() {
  const reste = calculerReste();
  const pourcentage = Math.min((totalHenombyActuel / OBJECTIF_HENOMBY) * 100, 100);

  totalActuelSpan.textContent = totalHenombyActuel;
  progressBar.style.width = pourcentage + "%";

  // --- Mode "Hanome vola fotsiny" ---
  // L'utilisateur a choisi de donner uniquement de l'argent, peu importe le
  // reste à atteindre. On masque tout sauf Anarana, Mail et Vola homena.
  if (modeDonSeulement) {
    viandeSection.classList.add("hidden");
    donSection.classList.remove("hidden");
    voankazoSection.classList.add("hidden");
    autresSection.classList.add("hidden");
    restrictedFields.classList.add("hidden");

    minimumMessage.classList.add("hidden");

    if (reste > 0) {
      resteMessage.textContent =
        `Mbola mila ${reste} kg Hen'omby hahatratra 60 kg, fa afaka manome vola fotsiny ianao.`;
      objectifAtteintMessage.classList.add("hidden");
    } else {
      resteMessage.textContent = "Tafakatra ny objectif 60 kg Hen'omby.";
      objectifAtteintMessage.classList.remove("hidden");
    }

    donSeulementBtn.textContent = "HANOME HEN'OMBY NA ZAVATRA HAFA";
    submitBtn.disabled = false;
    remettreFormulaireNormal();
    return;
  }

  // --- Mode normal ---
  voankazoSection.classList.remove("hidden");
  autresSection.classList.remove("hidden");
  donSeulementBtn.textContent = "HANOME VOLA FOTSINY";

  if (reste > 0) {
    const minimumDemande = calculerMinimumDemande();

    resteMessage.textContent =
      `Mbola mila ${reste} kg Hen'omby hahatratra 60 kg. Minimum azo omena izao : ${minimumDemande} kg.`;

    objectifAtteintMessage.classList.add("hidden");
    viandeSection.classList.remove("hidden");
    donSection.classList.add("hidden");

    henombyInput.min = minimumDemande;
    henombyInput.placeholder = `Minimum ${minimumDemande} kg`;

    minimumMessage.classList.add("hidden");
    submitBtn.disabled = false;
    remettreFormulaireNormal();

  } else {
    resteMessage.textContent = "Tafakatra ny objectif 60 kg Hen'omby.";

    objectifAtteintMessage.classList.remove("hidden");
    viandeSection.classList.add("hidden");
    donSection.classList.remove("hidden");

    minimumMessage.classList.add("hidden");
    submitBtn.disabled = false;
    remettreFormulaireNormal();
  }
}

function verifierEmailAutorise() {
  if (modeDonSeulement) {
    // En mode "vola fotsiny", les champs réservés ne s'affichent jamais.
    restrictedFields.classList.add("hidden");
    return;
  }

  const mail = mailInput.value.toLowerCase().trim();

  if (EMAILS_AUTORISES.includes(mail)) {
    restrictedFields.classList.remove("hidden");
  } else {
    restrictedFields.classList.add("hidden");

    document.getElementById("lasaryVoatabia").value = "";
    document.getElementById("romazava").value = "";
    document.getElementById("vary").value = "";
  }
}

function verifierMinimumHenomby() {
  if (modeDonSeulement) {
    minimumMessage.classList.add("hidden");
    submitBtn.disabled = false;
    remettreFormulaireNormal();
    return;
  }

  const reste = calculerReste();

  if (reste === 0) {
    minimumMessage.classList.add("hidden");
    submitBtn.disabled = false;
    remettreFormulaireNormal();
    return;
  }

  const minimumDemande = calculerMinimumDemande();
  const valeur = Number(henombyInput.value);

  if (!henombyInput.value) {
    minimumMessage.classList.add("hidden");
    submitBtn.disabled = false;
    remettreFormulaireNormal();
    return;
  }

  if (valeur < minimumDemande) {
    minimumMessage.textContent =
      `⚠️ Minimum ${minimumDemande} kg de Hen'omby. Il reste ${reste} kg pour atteindre l'objectif de 60 kg.`;

    minimumMessage.classList.remove("hidden");
    submitBtn.disabled = true;
    griserFormulaireSaufViande();
    return;
  }

  minimumMessage.classList.add("hidden");
  submitBtn.disabled = false;
  remettreFormulaireNormal();
}

function griserFormulaireSaufViande() {
  document.querySelectorAll("input, textarea, button").forEach(element => {
    if (element.id !== "henomby") {
      element.style.opacity = "0.35";
      element.style.pointerEvents = "none";
    }
  });
}

function remettreFormulaireNormal() {
  document.querySelectorAll("input, textarea, button").forEach(element => {
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
  });
}

// Petit parseur CSV qui gère les guillemets et les virgules dans les champs texte
function parserLigneCSV(ligne) {
  const valeurs = [];
  let valeurCourante = "";
  let dansGuillemets = false;

  for (let i = 0; i < ligne.length; i++) {
    const car = ligne[i];

    if (car === '"') {
      dansGuillemets = !dansGuillemets;
    } else if (car === "," && !dansGuillemets) {
      valeurs.push(valeurCourante);
      valeurCourante = "";
    } else {
      valeurCourante += car;
    }
  }

  valeurs.push(valeurCourante);
  return valeurs;
}

function chargerTotalDepuisGoogleSheet() {
  return new Promise((resolve, reject) => {
    // Cache-busting : on ajoute un paramètre aléatoire
    const url = CSV_URL + "&t=" + new Date().getTime();

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Réponse réseau invalide : " + response.status);
        }
        return response.text();
      })
      .then(texteCSV => {
        const lignes = texteCSV.trim().split("\n");

        // On ignore la première ligne (en-têtes)
        let total = 0;

        for (let i = 1; i < lignes.length; i++) {
          const colonnes = parserLigneCSV(lignes[i]);

          // Colonne D = index 3 = HEN'OMBY
          const valeurBrute = colonnes[3] ? colonnes[3].trim() : "";

          if (valeurBrute !== "") {
            const valeur = Number(valeurBrute.replace(",", "."));

            if (!isNaN(valeur)) {
              total += valeur;
            }
          }
        }

        totalHenombyActuel = total;
        afficherObjectif();
        resolve({ success: true, totalHenomby: total });
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function envoyerVersGoogleSheet(data) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });
}

mailInput.addEventListener("input", verifierEmailAutorise);
henombyInput.addEventListener("input", verifierMinimumHenomby);

donSeulementBtn.addEventListener("click", function() {
  modeDonSeulement = !modeDonSeulement;

  // On vide les champs qui ne servent plus dans le mode choisi
  henombyInput.value = "";
  donArgentInput.value = "";

  afficherObjectif();

  if (!modeDonSeulement) {
    verifierEmailAutorise();
    verifierMinimumHenomby();
  }

  statusDiv.textContent = "";
});

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const reste = calculerReste();
  const minimumDemande = calculerMinimumDemande();

  const anarana = document.getElementById("anarana").value.trim();
  const mail = mailInput.value.toLowerCase().trim();
  const henomby = Number(henombyInput.value || 0);
  const donArgent = Number(donArgentInput.value || 0);

  const voankazo = modeDonSeulement
    ? ""
    : document.getElementById("voankazo").value.trim();

  const autres = modeDonSeulement
    ? ""
    : document.getElementById("autres").value.trim();

  const isAutorise = !modeDonSeulement && EMAILS_AUTORISES.includes(mail);

  const lasaryVoatabia = isAutorise
    ? document.getElementById("lasaryVoatabia").value.trim()
    : "";

  const romazava = isAutorise
    ? document.getElementById("romazava").value.trim()
    : "";

  const vary = isAutorise
    ? document.getElementById("vary").value.trim()
    : "";

  if (!anarana) {
    statusDiv.textContent = "❌ Fenoy azafady ny anarana.";
    statusDiv.style.color = "red";
    return;
  }

  if (modeDonSeulement) {
    if (donArgent <= 0) {
      statusDiv.textContent = "❌ Azafady, ampidiro ny vola homena.";
      statusDiv.style.color = "red";
      return;
    }
  } else {
    if (reste > 0 && henomby < minimumDemande) {
      statusDiv.textContent =
        `❌ Minimum ${minimumDemande} kg Hen'omby. Il reste ${reste} kg pour atteindre l'objectif.`;
      statusDiv.style.color = "red";
      return;
    }

    if (reste === 0 && donArgent <= 0) {
      statusDiv.textContent = "❌ Azafady, ampidiro ny montant du don.";
      statusDiv.style.color = "red";
      return;
    }
  }

  // Hen'omby n'est enregistré que si on n'est pas en mode "vola fotsiny"
  // ET qu'il reste de la viande à collecter.
  const henombyAEnvoyer = (!modeDonSeulement && reste > 0) ? henomby : "";

  // Le don en argent est enregistré soit en mode "vola fotsiny",
  // soit quand l'objectif viande est déjà atteint.
  const donArgentAEnvoyer = (modeDonSeulement || reste === 0) ? donArgent : "";

  const data = {
    anarana,
    mail,
    henomby: henombyAEnvoyer,
    donArgent: donArgentAEnvoyer,
    donSeulement: modeDonSeulement,
    voankazo,
    autres,
    lasaryVoatabia,
    romazava,
    vary
  };

  submitBtn.disabled = true;
  statusDiv.textContent = "⏳ Mandefa...";
  statusDiv.style.color = "#555";

  try {
    await envoyerVersGoogleSheet(data);

    // Ici, on considère l'envoi comme réussi.
    // Avec mode no-cors, le navigateur ne peut pas lire la réponse,
    // mais si la ligne arrive dans Google Sheet, c'est bien enregistré.
    if (!modeDonSeulement && reste > 0) {
      totalHenombyActuel = totalHenombyActuel + henomby;
      statusDiv.textContent = `✅ Misaotra ${anarana}. Hen'omby voaray : ${henomby} kg.`;
    } else {
      statusDiv.textContent = `✅ Misaotra ${anarana}. Vola voaray : ${donArgent} €.`;
    }

    statusDiv.style.color = "green";

    // On revient au mode normal pour la prochaine personne
    modeDonSeulement = false;

    form.reset();
    restrictedFields.classList.add("hidden");
    afficherObjectif();
    remettreFormulaireNormal();

    // On essaie de resynchroniser le total, mais sans afficher d'erreur utilisateur
    chargerTotalDepuisGoogleSheet()
      .then(() => {
        console.log("Total resynchronisé après envoi :", totalHenombyActuel);
      })
      .catch(error => {
        console.warn("Réponse enregistrée, mais total non resynchronisé :", error);
      });

  } catch (error) {
    console.error("Erreur réelle pendant l'envoi :", error);

    statusDiv.textContent =
      "⚠️ La réponse a peut-être été envoyée. Vérifie Google Sheet avant de renvoyer.";
    statusDiv.style.color = "orange";

  } finally {
    submitBtn.disabled = false;
  }
});

// Au chargement de la page, on récupère d'abord le vrai total depuis le CSV publié
chargerTotalDepuisGoogleSheet()
  .then(() => {
    console.log("✅ Total Hen'omby chargé depuis le CSV publié :", totalHenombyActuel);
  })
  .catch(error => {
    console.error("❌ Erreur chargement total initial :", error);
    statusDiv.textContent = "⚠️ Tsy afaka naka ny total amin'izao fotoana izao. Afaka mameno formulaire ihany ianao.";
    statusDiv.style.color = "red";
  });

// Recharge seulement le total Hen'omby toutes les 30 secondes
setInterval(() => {
  chargerTotalDepuisGoogleSheet()
    .then(() => {
      console.log("✅ Total Hen'omby mis à jour automatiquement :", totalHenombyActuel);
    })
    .catch(error => {
      console.error("❌ Erreur mise à jour auto :", error);
    });
}, 30000);
