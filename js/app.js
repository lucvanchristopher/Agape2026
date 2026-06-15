const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsCRVRvEq7yM3qZi1t1L0oselGv7y6hd9-jwD31Iwv3fjcDMPaYQQ60mzwgG-jceKsIA/exec";

let totalHenombyActuel = 0;

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

function chargerTotalDepuisGoogleSheet() {
  return new Promise((resolve, reject) => {
    const callbackName = "callbackTotal_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    window[callbackName] = function(response) {
      try {
        if (response.success) {
          totalHenombyActuel = Number(response.totalHenomby || 0);
          afficherObjectif();
          resolve(response);
        } else {
          reject(response.message);
        }
      } catch (error) {
        reject(error);
      } finally {
        delete window[callbackName];
        script.remove();
      }
    };

    const script = document.createElement("script");
    script.src = `${SCRIPT_URL}?action=getTotal&callback=${callbackName}&t=${Date.now()}`;

    script.onerror = function() {
      delete window[callbackName];
      script.remove();
      reject("Impossible de charger le total Hen'omby.");
    };

    document.body.appendChild(script);
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

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const reste = calculerReste();
  const minimumDemande = calculerMinimumDemande();

  const anarana = document.getElementById("anarana").value.trim();
  const mail = mailInput.value.toLowerCase().trim();
  const henomby = Number(henombyInput.value || 0);
  const donArgent = Number(donArgentInput.value || 0);

  const voankazo = document.getElementById("voankazo").value.trim();
  const autres = document.getElementById("autres").value.trim();

  const isAutorise = EMAILS_AUTORISES.includes(mail);

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

  const data = {
    anarana,
    mail,
    henomby: reste > 0 ? henomby : "",
    donArgent: reste === 0 ? donArgent : "",
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
    if (reste > 0) {
      totalHenombyActuel = totalHenombyActuel + henomby;
      afficherObjectif();

      statusDiv.textContent = `✅ Misaotra ${anarana}. Hen'omby voaray : ${henomby} kg.`;
    } else {
      statusDiv.textContent = `✅ Misaotra ${anarana}. Don argent voaray : ${donArgent} €.`;
    }

    statusDiv.style.color = "green";

    form.reset();
    restrictedFields.classList.add("hidden");
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
afficherObjectif();

chargerTotalDepuisGoogleSheet()
  .then(() => {
    console.log("Total Hen'omby chargé depuis Google Sheet :", totalHenombyActuel);
  })
  .catch(error => {
    console.error(error);
    statusDiv.textContent = "⚠️ Tsy afaka naka ny total avy amin'ny Google Sheet.";
    statusDiv.style.color = "red";
    afficherObjectif();
  });

// Recharge seulement le total Hen'omby toutes les 30 secondes
setInterval(() => {
  chargerTotalDepuisGoogleSheet()
    .then(() => {
      console.log("Total Hen'omby mis à jour automatiquement :", totalHenombyActuel);
    })
    .catch(error => {
      console.error("Erreur mise à jour auto :", error);
    });
}, 30000);
