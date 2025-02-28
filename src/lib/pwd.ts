function generateStrongToken(length: number = 12): string {
    const lowercaseLetters: string = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers: string = '0123456789';
    const symbols: string = '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';

    const allCharacters: string = lowercaseLetters + uppercaseLetters + numbers + symbols;

    let Token: string = '';

    // Ajouter au moins un caractère de chaque type pour garantir la présence de chaque type dans le mot de passe généré
    Token += getRandomCharacter(lowercaseLetters);
    Token += getRandomCharacter(uppercaseLetters);
    Token += getRandomCharacter(numbers);
    Token += getRandomCharacter(symbols);

    // Générer le reste du mot de passe avec des caractères aléatoires
    for (let i: number = 0; i < length - 4; i++) {
        Token += getRandomCharacter(allCharacters);
    }

    // Mélanger les caractères du mot de passe
    Token = shuffleString(Token);

    return Token;
}

// Fonction pour obtenir un caractère aléatoire d'une chaîne
function getRandomCharacter(string: string): string {
    const randomIndex: number = Math.floor(Math.random() * string.length);
    return string.charAt(randomIndex);
}

// Fonction pour mélanger une chaîne de caractères
function shuffleString(string: string): string {
    const shuffledString: string = string
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
    return shuffledString;
}

export default generateStrongToken;
