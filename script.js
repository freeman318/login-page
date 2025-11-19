document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('terminal-input');
    const terminalBody = document.querySelector('.terminal-body');
    const sections = document.querySelectorAll('.terminal-section');
    const typingElement = document.querySelector('.typewriter-text');
    let commandHistory = [];
    let historyIndex = -1;

    // Fonction pour afficher une section
    const showSection = (command) => {
        sections.forEach(section => {
            if (section.getAttribute('data-command') === command) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        // Si c'est 'clear', cacher toutes les sections et laisser l'écran vide
        if (command === 'clear') {
            sections.forEach(s => s.classList.remove('active'));
            terminalBody.innerHTML = `
                <div class="terminal-input-area">
                    <p class="prompt">$ <input type="text" id="terminal-input" autocomplete="off" autofocus></p>
                </div>`;
            // Re-attacher les écouteurs sur le nouveau champ d'entrée
            attachInputListeners();
        } else {
            // S'assurer que le champ d'entrée est visible à la fin
            if (!document.getElementById('terminal-input')) {
                terminalBody.insertAdjacentHTML('beforeend', `
                    <div class="terminal-input-area">
                        <p class="prompt">$ <input type="text" id="terminal-input" autocomplete="off" autofocus></p>
                    </div>`);
                attachInputListeners();
            }
        }
    };
    
    // Fonction pour ajouter une ligne de sortie au terminal
    const addOutputLine = (text, isError = false) => {
        const newOutput = document.createElement('p');
        newOutput.classList.add('prompt');
        if (isError) {
            newOutput.style.color = '#FF0000'; // Rouge néon pour les erreurs
        }
        newOutput.innerHTML = text; // Utilisez innerHTML pour les balises
        terminalBody.insertBefore(newOutput, document.querySelector('.terminal-input-area'));
    };

    // Le moteur de commande
    const executeCommand = (command) => {
        const cmd = command.trim().toLowerCase();
        
        // Cacher le contenu de la section actuelle si non 'home' ou 'clear'
        if (cmd !== 'home' && cmd !== 'clear') {
            sections.forEach(s => s.classList.remove('active'));
        }
        
        switch (cmd) {
            case 'home':
            case 'about':
            case 'projects':
            case 'contact':
            case 'help':
            case 'clear':
                showSection(cmd);
                break;
            case 'exit':
                addOutputLine(`[SYSTEM] Déconnexion... Merci de votre visite.`, false);
                break;
            default:
                addOutputLine(`[ERROR] Commande non trouvée: '${cmd}'. Tapez 'help' pour les commandes valides.`, true);
                break;
        }
        
        // Faire défiler vers le bas pour afficher la nouvelle sortie
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    // Gestionnaire d'entrée de commande
    const handleInput = (e) => {
        const input = document.getElementById('terminal-input');
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const command = input.value.trim();
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            
            // Ajouter la commande tapée comme ligne de sortie
            addOutputLine(`$ ${command}`);
            
            // Exécuter la commande
            executeCommand(command);
            
            // Vider l'entrée et se reconcentrer
            input.value = '';
            input.focus();

        } else if (e.key === 'ArrowUp') {
            // Historique des commandes : Précédente
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
            e.preventDefault(); // Empêche le curseur de se déplacer
        } else if (e.key === 'ArrowDown') {
            // Historique des commandes : Suivante
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
            e.preventDefault();
        }
    };

    // Fonction pour attacher les écouteurs sur le champ d'entrée
    const attachInputListeners = () => {
        const input = document.getElementById('terminal-input');
        if (input) {
            input.addEventListener('keydown', handleInput);
            input.focus();
        }
    };
    
    // Initialisation
    attachInputListeners();

    // Gestion des clics sur les liens 'neon-link' (pour l'interactivité)
    document.querySelectorAll('.neon-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-link');
            if (target && (target.startsWith('http') || target.startsWith('mailto:'))) {
                window.open(target, '_blank');
            } else if (target) {
                // Simuler une navigation (par exemple, pour un futur système de fichiers)
                addOutputLine(`$ open ${e.target.textContent}`);
                addOutputLine(`[INFO] Ouverture de : ${target}...`, false);
            }
        });
    });

    // Effet d'écriture (Typewriter) au chargement
    if (typingElement) {
        // Enlève l'animation de clignotement après la fin de l'écriture
        const textLength = typingElement.getAttribute('data-text').length;
        typingElement.style.animationDuration = `${textLength * 0.1}s`; // Ajuster la vitesse
        
        // Cacher le curseur de l'input après l'animation
        const promptBlink = document.querySelector('.prompt.blink');
        if (promptBlink) {
             // Retirer la classe 'blink' de la première ligne d'input
             const inputArea = document.querySelector('.terminal-input-area .prompt');
             inputArea.classList.remove('blink');
             // Ajouter le clignotement au vrai prompt après un délai
             setTimeout(() => {
                 if (promptBlink) {
                     promptBlink.classList.add('blink');
                 }
             }, (textLength * 100) + 1000); // Temps total d'animation + 1s
        }
    }
});