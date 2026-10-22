document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const promptDisplay = document.getElementById('prompt');
    
    // Système de fichiers virtuel basique
    let currentDir = '~';
    const fileSystem = {
        '~': ['documents', 'images', 'readme.txt'],
        'documents': ['projet.docx', 'budget.xls'],
        'images': ['vacances.png']
    };

    // Fonction pour afficher du texte dans le terminal
    function printLine(text, isCommand = false) {
        const line = document.createElement('div');
        if (isCommand) {
            line.innerHTML = `<span style="color: #23d18b;">user@linux:${currentDir}$</span> ${text}`;
        } else {
            line.textContent = text;
        }
        output.appendChild(line);
        // Scroller automatiquement vers le bas
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }

    // Fonction pour traiter la commande tapée
    function processCommand(cmd) {
        const parts = cmd.trim().split(' ').filter(p => p !== '');
        if (parts.length === 0) return;

        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        printLine(cmd, true); // On affiche la commande tapée

        switch (command) {
            case 'pwd':
                let path = '/home/user';
                if (currentDir !== '~') path += '/' + currentDir;
                printLine(path);
                break;

            case 'ls':
                const contents = fileSystem[currentDir] || [];
                printLine(contents.join('   '));
                break;

            case 'cd':
                const dir = args[0];
                if (!dir || dir === '~') {
                    currentDir = '~';
                } else if (dir === '..') {
                    currentDir = '~'; // Retour simplifié à la racine
                } else if (fileSystem['~'].includes(dir) && fileSystem[dir]) {
                    currentDir = dir;
                } else {
                    printLine(`bash: cd: ${dir}: Aucun fichier ou dossier de ce type`);
                }
                // Mise à jour de l'affichage du prompt
                promptDisplay.textContent = `user@linux:${currentDir}$`;
                break;

            case 'echo':
                printLine(args.join(' '));
                break;

            case 'clear':
                output.innerHTML = '';
                break;

            default:
                printLine(`${command}: commande introuvable`);
        }
    }

    // Écoute de la touche Entrée
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            input.value = '';
            processCommand(cmd);
        }
    });
    
    // Si l'utilisateur clique n'importe où dans le bloc terminal, on remet le focus sur l'input
    document.getElementById('terminal').addEventListener('click', () => {
        input.focus();
    });
    
    // Message de bienvenue au démarrage
    printLine('Bienvenue dans le simulateur Linux.');
    printLine('Essayez de taper "pwd", "ls", ou "cd documents" pour commencer.');
});