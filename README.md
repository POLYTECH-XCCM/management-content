XCCM (eXtended Content Composition Module)
Présentation du projet
XCCM (eXtended Content Composition Module) est une application web conçue pour simplifier la création, la structuration et la recomposition de contenus pédagogiques. Elle permet aux utilisateurs de combiner des fragments de contenu pré-segmentés pour créer des cours et des matériaux éducatifs cohérents. Ce projet a été développé dans le cadre du cours de Systèmes Multi-Agents (SMA) et de Projet Software Engineering (SE) à l'École Nationale Supérieure Polytechnique de Yaoundé.

Objectifs
L'objectif principal de XCCM est de fournir une plateforme intuitive et flexible pour la création de contenus pédagogiques. L'application intègre des fonctionnalités avancées telles que :

Gestion dynamique des projets : Créez, modifiez et organisez vos projets de contenu pédagogique en temps réel.

Exportation de fichiers : Exportez vos contenus au format PDF ou Word pour une utilisation hors ligne.

Chatbot assisté par IA : Bénéficiez d'une assistance intelligente pour l'amélioration et la correction du texte.

Interface utilisateur moderne et réactive : Une expérience utilisateur fluide et adaptée à tous les appareils.

Installation et configuration
Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

Node.js (version 16 ou supérieure)

MongoDB (pour la base de données)

Comptes Google et GitHub (pour l'authentification OAuth)

Étapes d'installation
Clonez le dépôt :

    git clone https://github.com/POLYTECH-XCCM/management-content.git
    cd management-content
    
Installez les dépendances :

    npm install
    
Configurez les variables d'environnement :

Créez un fichier .env à la racine du projet.

Ajoutez les variables suivantes :


    DATABASE_URL=mongodb+srv://james1:7256@cluster0.jxuoyvr.mongodb.net/AuthNextX?retryWrites=true&w=majority
    AUTH_SECRET=f09c2adecf3cd60783cadbb1433433c7
    NEXTAUTH_SECRET=f09c2adecf3cd60783cadbb1433433c7
    GOOGLE_CLIENT_ID=694962707438-iekjgrbp3l5uusvk55vblu2vod3m8ri5.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=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
    RESEND_API_KEY=re_2sfJRRyy_H6e4xNhfDUUcAHEisJJ31myR
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    EMAIL_SERVER_USER=resend
    EMAIL_SERVER_PASSWORD=re_2sfJRRyy_H6e4xNhfDUUcAHEisJJ31myR
    EMAIL_SERVER_HOST=smtp.resend.com
    EMAIL_SERVER_PORT=465
    EMAIL_FROM=onboarding@resend.dev
    
Lancez l'application :

    npm run dev
    
Accédez à l'application :
Ouvrez votre navigateur et accédez à http://localhost:3000.

Contribution
Nous apprécions les contributions à ce projet ! Si vous souhaitez contribuer, veuillez suivre les étapes suivantes :

Forkez le dépôt.

Créez une nouvelle branche pour vos modifications :

git checkout -b feature/nouvelle-fonctionnalite
Committez vos modifications :

git commit -m "Ajout d'une nouvelle fonctionnalité"
Poussez vos modifications vers votre fork :

git push origin feature/nouvelle-fonctionnalite
Ouvrez une Pull Request sur le dépôt principal.

Contact
Pour toute question ou suggestion, n'hésitez pas à nous contacter :

Équipe XCCM : davidtolokoum8@gmail.com

Dépôt GitHub : https://github.com/POLYTECH-XCCM/management-content

Remerciements
Nous tenons à remercier nos professeurs et l'École Nationale Supérieure Polytechnique de Yaoundé pour leur soutien dans la réalisation de ce projet.
