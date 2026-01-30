const messageDiv = document.getElementById("message");
const form = document.getElementById("FormDemande");
const tableBody = document.getElementById("tableBody");
const compteur = document.getElementById("compteur");
const rechercheInput = document.getElementById("recherche");
const btn=document.getElementById("dark")
btn.addEventListener("click",()=>{
    document.body.classList.toggle("darkn")
    if (document.body.classList.contains("darkn")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
})
document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("darkn");
    }
});

let currentPage = 1;
const itemsPerPage = 5;

let demandes = JSON.parse(localStorage.getItem("demandes2")) || [];
let demandesAffichees = [...demandes]; //  clé du filtre

function saveDemandes() {
    localStorage.setItem("demandes2", JSON.stringify(demandes));
}

function afficherMessage(texte, type) {
    messageDiv.textContent = texte;
    messageDiv.className = "message " + type;
    messageDiv.style.display = "block";
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 4000);
}

const cercleCompteur = document.getElementById("cercleCompteur");
// function appliquerFiltre() {
//     const valeur = rechercheInput.value.toLowerCase();

//     demandesAffichees = demandes.filter(d =>
//         d.nom.toLowerCase().includes(valeur) ||
//         d.prenom.toLowerCase().includes(valeur) ||
//         d.tel.toString().includes(valeur) ||
//         d.email.toLowerCase().includes(valeur)
//     );

//     currentPage = 1;
//     afficherDemandes();
// }
function appliquerFiltre() {
    const valeur = rechercheInput.value.toLowerCase();
     demandesAffichees = [];
    for(let i=0;i<demandes.length;i++){
        if(
            demandes[i].nom.toLowerCase()===valeur||
            demandes[i].prenom.toLowerCase()===valeur||
            demandes[i].tel.toLowerCase()===valeur||
            demandes[i].email.toLowerCase()===valeur||
            demandes[i].date.toLowerCase()===valeur||
            demandes[i].motif.toLowerCase()===valeur
        ){
                demandesAffichees.push( demandes[i])
               }
              
      
    } 
    currentPage = 1;
                afficherDemandes()
}



function updateCompteur() {
    cercleCompteur.textContent = demandesAffichees.length;
}
const btnRecherche = document.getElementById("btnRecherche");

btnRecherche.addEventListener("click", () => {
    appliquerFiltre(); // appelle la même fonction que l’input
});

// rechercheInput.addEventListener("input", appliquerFiltre);

function afficherDemandes() {
    tableBody.innerHTML = "";

    const totalPages = Math.ceil(demandesAffichees.length / itemsPerPage) || 1;

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageDemandes = demandesAffichees.slice(start, end);

for (let i = 0; i < pageDemandes.length; i++) {
    const d = pageDemandes[i];
    const tr = document.createElement("tr");
    const indexReel = demandes.indexOf(d);

    tr.innerHTML = `
        <td>${d.nom}</td>
        <td>${d.prenom}</td>
        <td>${d.tel}</td>
        <td>${d.email}</td>
        <td>${d.motif}</td>
        <td>${d.date}</td>
        <td>
            <button class="btn-delete" onclick="supprimmerDemande(${indexReel})">
                supprimer
            </button>
        </td>
    `;

    tableBody.appendChild(tr);
}


    updateCompteur();
    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    document.getElementById("pageInfo").textContent =
        "Page " + currentPage + "/" + totalPages;

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function supprimmerDemande(index) {
    demandes.splice(index, 1);
    saveDemandes();
    appliquerFiltre();
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const tel = document.getElementById("tel").value.trim();
    const email = document.getElementById("email").value.trim();
    const motif = document.getElementById("motif").value;
    const date = document.getElementById("date").value;

    if (nom && prenom && tel && email && motif && date) {
        demandes.push({ nom, prenom, tel, email, motif, date });
        saveDemandes();
        form.reset();
        afficherMessage("Demande ajoutée avec succès", "success");
        appliquerFiltre();
    } else {
        afficherMessage("Veuillez compléter les champs obligatoires", "error");
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentPage--;
    afficherDemandes();
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++;
    afficherDemandes();
});
document.addEventListener("DOMContentLoaded", () => {
    demandesAffichees = [...demandes];
    afficherDemandes();
});
