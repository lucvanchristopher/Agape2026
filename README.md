# Agape2026
formulaire pour repas agape2026



# Documentation de reprise — Projet Formulaire Agape 2026

## 1. Présentation générale du projet

Le projet **Agape2026** est un formulaire web simple destiné à organiser les contributions pour un repas Agape.

Le formulaire permet aux participants de déclarer ce qu’ils souhaitent apporter, notamment :

* leur nom ;
* leur adresse mail, facultative ;
* une quantité de viande **Hen’omby** ;
* des fruits ;
* une autre contribution libre ;
* certains éléments réservés à une liste d’emails autorisés :

  * Lasary-voatabia ;
  * Romazava ;
  * Vary.

Les réponses sont enregistrées automatiquement dans un fichier **Google Sheet**, utilisé comme base de données.

Le front est hébergé sur **GitHub Pages** dans le repository public :

```text
Agape2026
```

Le back-end est géré par **Google Apps Script** via un fichier :

```text
Code.gs
```

---

## 2. Architecture générale

Le fonctionnement global est le suivant :

```text
Utilisateur
   ↓
Formulaire web GitHub Pages
   ↓
index.html + js/app.js
   ↓
Google Apps Script Web App
   ↓
Google Sheet
   ↓
Notifications mail utilisateur + admin
```

Le site web ne contient pas de serveur classique.
Il s’agit d’un front statique hébergé par GitHub Pages.

Google Apps Script joue le rôle d’API entre le formulaire et Google Sheet.

---

## 3. Technologies utilisées

### Front-end

* HTML
* CSS intégré dans `index.html`
* JavaScript vanilla dans `js/app.js`
* Hébergement GitHub Pages

### Back-end

* Google Apps Script
* Web App déployée publiquement
* `doPost()` pour enregistrer les réponses
* `doGet()` pour récupérer le total de viande

### Base de données

* Google Sheet
* Feuille nommée :

```text
Reponses
```

### Notification

* `MailApp.sendEmail()` dans Apps Script
* Mail de confirmation à l’utilisateur s’il a renseigné son email
* Mail récapitulatif à l’administrateur

---

## 4. Structure du repository GitHub

Le repository doit avoir cette structure :

```text
Agape2026/
│
├── index.html
└── js/
    └── app.js
```

Le fichier `index.html` doit rester à la racine du dépôt.

Le fichier `app.js` doit rester dans le dossier :

```text
js/
```

Dans `index.html`, l’appel au JavaScript doit être :

```html
<script src="js/app.js"></script>
```

En cas de problème de cache navigateur, on peut forcer le rechargement avec une version :

```html
<script src="js/app.js?v=20260614-01"></script>
```

À chaque modification importante du JavaScript, il suffit d’augmenter la version :

```html
<script src="js/app.js?v=20260614-02"></script>
```

---

## 5. Déploiement GitHub Pages

Le repository GitHub s’appelle :

```text
Agape2026
```

Il doit être public.

Pour activer GitHub Pages :

1. Aller dans le repository GitHub.
2. Aller dans **Settings**.
3. Aller dans **Pages**.
4. Dans **Build and deployment**, choisir :

```text
Deploy from a branch
```

5. Choisir la branche :

```text
main
```

6. Choisir le dossier :

```text
/root
```

7. Cliquer sur **Save**.

Le site sera accessible avec une URL de type :

```text
https://NOM-UTILISATEUR-GITHUB.github.io/Agape2026/
```

---

## 6. Google Sheet

Le Google Sheet sert de base de données.

La feuille doit s’appeler exactement :

```text
Reponses
```

Attention : le nom est sensible.
Si la feuille s’appelle autrement, Apps Script ne trouvera pas la feuille.

La première ligne du Google Sheet doit contenir les colonnes suivantes :

```text
DATE | ANARANA | MAIL | HEN'OMBY | LASARY-VOATABIA | ROMAZAVA | VARY | VOANKAZO | AUTRES | DON_ARGENT
```

Ordre des colonnes :

| Colonne | Nom             | Description                              |
| ------- | --------------- | ---------------------------------------- |
| A       | DATE            | Date et heure de soumission              |
| B       | ANARANA         | Nom du participant                       |
| C       | MAIL            | Email facultatif                         |
| D       | HEN'OMBY        | Quantité de viande en kg                 |
| E       | LASARY-VOATABIA | Champ réservé                            |
| F       | ROMAZAVA        | Champ réservé                            |
| G       | VARY            | Champ réservé                            |
| H       | VOANKAZO        | Fruits proposés                          |
| I       | AUTRES          | Autres contributions                     |
| J       | DON_ARGENT      | Don en argent si objectif viande atteint |

---

## 7. Règles métier

### Objectif viande

L’objectif total de viande est :

```text
60 kg
```

Cette valeur est définie dans `Code.gs` et dans `app.js` :

```javascript
const OBJECTIF_HENOMBY = 60;
```

### Minimum viande

Le minimum normal est :

```text
3 kg
```

Cette valeur est définie avec :

```javascript
const MINIMUM_HENOMBY = 3;
```

### Règle dynamique du minimum

La règle est la suivante :

```text
Si le reste à atteindre est supérieur ou égal à 3 kg :
minimum demandé = 3 kg

Si le reste à atteindre est inférieur à 3 kg :
minimum demandé = le reste exact
```

Exemples :

| Total déjà collecté | Reste | Minimum accepté |
| ------------------: | ----: | --------------: |
|                0 kg | 60 kg |            3 kg |
|               40 kg | 20 kg |            3 kg |
|               57 kg |  3 kg |            3 kg |
|               58 kg |  2 kg |            2 kg |
|               59 kg |  1 kg |            1 kg |
|               60 kg |  0 kg |   Don en argent |

Cela évite de bloquer le formulaire quand il ne reste que 1 kg ou 2 kg pour atteindre l’objectif.

### Objectif atteint

Quand le total atteint ou dépasse 60 kg :

* le champ viande disparaît ;
* le formulaire propose un champ **Don en argent** ;
* le don doit être supérieur à 0 ;
* la personne peut contribuer en argent pour acheter autre chose.

---

## 8. Champs visibles pour tout le monde

Tous les utilisateurs peuvent remplir :

```text
ANARANA
MAIL
HEN'OMBY
VOANKAZO
AUTRES
```

Le champ mail est facultatif.

Libellés actuels côté formulaire :

```text
Mikasa hitondra voankazo aho ka :
```

Placeholder :

```text
Ohatra paoma 1 kilao na koa Akondro 1 kilao
```

Pour la contribution libre :

```text
Mikasa hanolotra
```

Placeholder :

```text
Ohatra vola hividianana kojakoja na samihafa
```

---

## 9. Champs réservés à certains emails

Certains champs ne s’affichent que si l’adresse email saisie fait partie de la liste autorisée.

Champs réservés :

```text
LASARY-VOATABIA
ROMAZAVA
VARY
```

Emails autorisés :

```text
edgar.randrianarivelo@gmail.com
lucvanchristopher@gmail.com
aliciafany@yahoo.fr
racambera@yahoo.fr
robinson.riantsoa@gmail.com
luccic69@gmail.com
solrandria@yahoo.fr
```

La vérification existe à deux niveaux :

1. côté front, dans `app.js`, pour afficher ou masquer les champs ;
2. côté serveur, dans `Code.gs`, pour éviter qu’une personne contourne le front.

Même si quelqu’un modifie le HTML dans son navigateur, Apps Script vérifie encore l’email avant d’enregistrer les champs réservés.

---

## 10. Fonctionnement du total affiché sur la page

Le total de viande affiché dans le formulaire n’est pas calculé localement uniquement.

Le formulaire appelle Apps Script avec une URL de type :

```text
SCRIPT_URL?action=getTotal&callback=...
```

Apps Script exécute :

```javascript
doGet(e)
```

Puis retourne le total via JSONP.

Le front met à jour :

```text
totalActuel
progressBar
resteMessage
```

Le total est rafraîchi automatiquement toutes les 30 secondes.

Dans `app.js`, cela se fait avec :

```javascript
setInterval(() => {
  chargerTotalDepuisGoogleSheet()
    .then(() => {
      console.log("Total Hen'omby mis à jour automatiquement :", totalHenombyActuel);
    })
    .catch(error => {
      console.error("Erreur mise à jour auto :", error);
    });
}, 30000);
```

`30000` signifie :

```text
30 secondes
```

---

## 11. Notifications mail

Le projet envoie deux types de notifications.

### Mail utilisateur

Si l’utilisateur renseigne son adresse email, il reçoit une confirmation.

S’il ne renseigne pas son mail, aucun mail utilisateur n’est envoyé.

Le mail contient :

* son nom ;
* sa contribution ;
* la quantité de viande ou le don ;
* les fruits ;
* les autres contributions ;
* le total actuel de viande.

### Mail administrateur

L’admin reçoit toujours un mail récapitulatif après chaque soumission.

Adresse admin configurée dans `Code.gs` :

```javascript
const ADMIN_EMAIL = "slk.fjkm.zionavaovao.paris@gmail.com";
```

Le mail admin contient :

* la date ;
* le nom ;
* le mail si fourni ;
* la contribution ;
* le total actuel ;
* le reste à atteindre ou l’indication que l’objectif est atteint.

### Autorisation MailApp

Pour que les emails fonctionnent, Google Apps Script doit être autorisé à envoyer des emails.

Une fonction de test peut être ajoutée temporairement :

```javascript
function testEmail() {
  MailApp.sendEmail({
    to: "slk.fjkm.zionavaovao.paris@gmail.com",
    subject: "Test mail Formulaire Sakafo",
    body: "Ceci est un test d'envoi depuis Google Apps Script."
  });
}
```

Ensuite :

1. sélectionner `testEmail` dans Apps Script ;
2. cliquer sur **Exécuter** ;
3. accepter les autorisations Google ;
4. vérifier la boîte mail admin.

Les emails peuvent parfois arriver avec un léger retard.

---

## 12. Déploiement Google Apps Script

Le script doit être déployé comme **Application Web**.

Paramètres importants :

```text
Type : Application Web
Exécuter en tant que : Moi
Qui a accès : Tout le monde
```

Le point critique est :

```text
Exécuter en tant que : Moi
```

Cela permet aux visiteurs du formulaire d’interagir avec le Google Sheet sans avoir accès directement au fichier.

Si le script est déployé avec :

```text
Exécuter en tant que : Utilisateur accédant à l'application Web
```

alors seuls les utilisateurs ayant accès au Google Sheet peuvent voir le bon total.

Après chaque modification de `Code.gs`, il faut redéployer :

```text
Déployer
→ Gérer les déploiements
→ Modifier avec le crayon
→ Version : Nouvelle version
→ Déployer
```

Sinon l’ancienne version du script peut continuer à être utilisée.

---

## 13. URL Apps Script dans `app.js`

Dans `app.js`, il y a une constante :

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
```

Cette URL doit correspondre au déploiement actif de Google Apps Script.

Si on recrée un déploiement ou si l’URL change, il faut mettre à jour cette ligne dans `app.js`, puis committer le fichier sur GitHub.

---

## 14. Problème de cache navigateur

Un problème rencontré : certains utilisateurs pouvaient continuer à voir un ancien comportement à cause du cache navigateur.

Le problème ne venait pas forcément du code, mais du navigateur qui conservait une ancienne version de la page ou du JavaScript.

### Solutions possibles

#### Forcer une version du script

Dans `index.html`, utiliser :

```html
<script src="js/app.js?v=20260614-01"></script>
```

Puis augmenter la version après modification :

```html
<script src="js/app.js?v=20260614-02"></script>
```

#### Supprimer les données du site dans Chrome

Sur ordinateur :

```text
Cliquer sur l’icône à gauche de l’URL
→ Paramètres du site
→ Supprimer les données
→ Fermer l’onglet
→ Rouvrir le lien
```

Autre méthode :

```text
chrome://settings/siteData
→ rechercher github.io
→ supprimer les données liées au site GitHub Pages
```

Sur Android Chrome :

```text
Ouvrir le site
→ Menu trois points
→ Paramètres du site
→ Effacer et réinitialiser
→ Rouvrir le lien
```

---

## 15. Sécurité et limites

Le repository GitHub est public.

Cela signifie que tout le monde peut voir le code front, y compris l’URL Apps Script dans `app.js`.

Conséquence :

* quelqu’un peut techniquement copier l’URL Apps Script ;
* il peut tenter d’envoyer de fausses réponses vers Google Sheet ;
* il ne peut pas ouvrir directement le Google Sheet s’il n’a pas les droits ;
* il ne peut pas lire toutes les données sauf si Apps Script expose une fonction pour cela.

Le `doGet()` actuel expose seulement le total de viande, pas toutes les réponses.

### Bonnes pratiques

Ne pas stocker dans ce formulaire :

```text
mot de passe
données bancaires
données médicales
informations confidentielles
```

Pour ce projet communautaire, le niveau de risque est acceptable, mais il faut surveiller les réponses dans Google Sheet.

---

## 16. Tests à effectuer après modification

Après toute modification, faire ces tests :

### Test 1 — Envoi normal avec viande

1. Ouvrir le formulaire.
2. Remplir `Anarana`.
3. Mettre `Hen'omby = 3`.
4. Remplir éventuellement `Mail`.
5. Cliquer sur `Alefa`.

Résultat attendu :

```text
Une ligne est ajoutée dans Google Sheet.
Le total augmente.
L’admin reçoit un mail.
L’utilisateur reçoit un mail s’il a rempli son adresse.
```

### Test 2 — Minimum viande

Si le total est à 0 kg :

```text
Hen'omby = 2
```

Résultat attendu :

```text
Le formulaire bloque avec un message minimum 3 kg.
```

### Test 3 — Reste inférieur à 3 kg

Si le total est à 58 kg :

```text
Reste = 2 kg
Minimum demandé = 2 kg
```

Résultat attendu :

```text
1 kg est refusé.
2 kg est accepté.
3 kg est accepté.
```

### Test 4 — Objectif atteint

Si le total est à 60 kg ou plus :

```text
Le champ viande disparaît.
Le champ Don en argent apparaît.
```

### Test 5 — Email autorisé

Avec un email autorisé, par exemple :

```text
lucvanchristopher@gmail.com
```

Résultat attendu :

```text
Les champs Lasary-voatabia, Romazava et Vary apparaissent.
```

Avec un email non autorisé :

```text
Les champs réservés restent masqués.
```

### Test 6 — Navigation privée

Tester le lien dans une fenêtre privée ou sur le téléphone d’une autre personne.

Résultat attendu :

```text
Le total affiché doit être identique pour tout le monde.
```

---

## 17. Dépannage rapide

### La ligne est créée dans Google Sheet mais aucun mail n’arrive

Causes possibles :

```text
MailApp non autorisé
Nouvelle version Apps Script non déployée
Mail arrivé en spam ou promotions
Quota d’envoi atteint
```

Solution :

```text
Exécuter testEmail()
Autoriser MailApp
Redéployer en Nouvelle version
Vérifier spam/promotions
```

### Le total reste à 0 kg pour les autres utilisateurs

Cause probable :

```text
Apps Script n’est pas déployé avec “Exécuter en tant que : Moi”
```

Solution :

```text
Déployer
→ Gérer les déploiements
→ Modifier
→ Exécuter en tant que : Moi
→ Qui a accès : Tout le monde
→ Nouvelle version
→ Déployer
```

### Le navigateur continue à afficher l’ancienne version

Cause probable :

```text
Cache navigateur
```

Solution :

```text
Modifier la version dans le script :
<script src="js/app.js?v=20260614-02"></script>

ou supprimer les données du site dans le navigateur.
```

### L’envoi fonctionne mais le total affiché ne change pas

Vérifier :

```text
1. L’URL SCRIPT_URL dans app.js
2. Le déploiement Apps Script actif
3. Le nom exact de la feuille : Reponses
4. Le contenu de la colonne D : HEN'OMBY
```

---

## 18. Points importants pour la personne qui reprend

La personne qui reprend le projet doit savoir ceci :

1. Le front est dans GitHub, repository `Agape2026`.
2. La base de données est un Google Sheet.
3. Le back-end est Google Apps Script.
4. Le fichier principal côté serveur est `Code.gs`.
5. Le fichier principal côté client est `js/app.js`.
6. Le formulaire utilise `SCRIPT_URL` pour contacter Apps Script.
7. Il faut redéployer Apps Script après chaque modification de `Code.gs`.
8. Il faut committer sur GitHub après chaque modification de `index.html` ou `app.js`.
9. Le total viande est lu depuis Google Sheet toutes les 30 secondes.
10. Le mail est facultatif pour l’utilisateur.
11. L’admin reçoit toujours un mail.
12. Les champs réservés dépendent d’une liste d’emails autorisés.
13. Le navigateur peut garder une ancienne version en cache.
14. Le Google Sheet ne doit pas être renommé sans modifier `Code.gs`.

---

## 19. Message WhatsApp final

Le message envoyé aux participants peut être :

```text
Salama 👋

Fenoy azafady ity formulaire ity :

👉 https://NOM-UTILISATEUR-GITHUB.github.io/Agape2026/
```

WhatsApp rendra automatiquement le lien cliquable.

---

## 20. État actuel du projet

À ce stade, le projet permet :

```text
✅ d’afficher le formulaire public
✅ d’enregistrer les réponses dans Google Sheet
✅ de calculer le total Hen'omby
✅ d’afficher le reste à atteindre
✅ d’appliquer un minimum dynamique
✅ de basculer vers le don en argent quand 60 kg est atteint
✅ d’envoyer un mail admin
✅ d’envoyer un mail utilisateur si l’email est renseigné
✅ de masquer certains champs selon l’email
✅ de publier le formulaire via GitHub Pages
```

Le projet est fonctionnel, mais il faut toujours surveiller :

```text
- le cache navigateur ;
- le bon déploiement Apps Script ;
- les autorisations MailApp ;
- l’URL SCRIPT_URL dans app.js ;
- la structure des colonnes Google Sheet.
```
