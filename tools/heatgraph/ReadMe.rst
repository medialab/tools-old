**********************************************
COMPTE RENDU BRAINSTORMING SITE MEDIALAB 26/07
**********************************************
 

:Authors: Louis Jérome Léger (DSI Sciences Po), Paul Girard (médialab Sciences Po)


.. contents::


Présents
--------

- Djeff Regotaz
- Paul Girard
- Louis Jérome Léger
- Mathieu Jacomy
- Benjamin Ooghe Tabanou
- Benedetta Signaroldi
- Daniele Guido

Déroulé
-------

- rappel du cahier des charges par Paul
- présentation de l'avancement par Louis
- discussion sur le graphisme et le design de l'information
- discussion sur les médialab tools

Graphisme & Design
------------------
 
problèmes
_________

- aller vers plus de minimalisme : enlever les artifices (icônes, traits...)
- Header trop volumineux
- le menu ne ressemble pa à un menu
- trop d'information sur le home
- quid de l'accessibilité ?
- la richesse des liens entre contenus n'est pas assez mise en avant dans l'interface de navigation 
 
nouvelle homepage
__________________

De haut en bas : 

- Logo en haut à gauche
- barre de recherche en haut à droite
- header minimal pas plus haut que le logo
- menu plus clair :

  - largeur fixe pour les entrées des menus
  - passer les textes longs sur deux lignes (recherche et développement)
  - souligner les items du menu sur leur largeur et laisser un blanc entre chacune d'elles
  - rassembler les items du menu en thèmes

    - News et R&D
    - Project, Tools, Publications
    - People, contact, about 

- créer une grille éditoriale : présentation de 4-5 items maximum qui doivent être choisies la main dans n'importe qu'elle post (Project, Tool, People, News...)
- 4 colonnes textuelles qui présentent les 5 derniers éléments des catégories dans cet ordre :   

  - news
  - R&D posts
  - projets
  - tools

- Footer

La ligne de flotaison à 800px doit tomber juste en dessous des titres des colonnes de textuelles.
Il faut enlever les tags et le fil d'ariane de la home.
Cette nouvelle organisation par une grille éditoriale demande une gestion régulière des contenus.
Mais la régularité de la publication de contenus (2 news/mois, 1 post R&D/mois, 2 project/6 mois, 2 people/6 mois, 2 tools/6 mois...) reste raisonnable.

 
nouveau gabaris page Objet
__________________________

objets = contenu non dynamique = Projets, Tools, Posts R&D, News, Publications...

page de liste des objets :

- une liste des objets organisé en grille non cadrillée comme sur pinterest.com
- à droite une colonne : moteur à facette présentant des filtres par la custom taxonomy

page de présentation d'un objet : 

- contenu principal : contenu du post
- une colonne à droite : related information en mode texte seul

intégration wordpress
_____________________
 
- Recherche d’un plugin pour la grille éditoriale de la homepage à plusieurs niveaux de priorité (Priorité plus haute, zone plus grande cf. Zone édito Kit de Site)
- Recherche d'un template à la pinterest.com
- La taxonomie des posts qui permet de lier les contenus entre eux doit rester asymétrique pour un meilleur contrôle éditorial. cela sous-entend que si l'on tag un tool avec un auteur, le tool n'apparaît pas nécessairement sur la page auteur.
- trouver un plugin ou réaliser un moteur à facette à partir des liens de custom taxonomy

Tools
-----

Les vitrines des tools
______________________

- vitrine des outils logiciels ::
    
    tools.medialab.sciences-po.fr/heatgraph

- publications augmentées ::

    publications.medialab.sciences-po.fr/monads

- corpus genre open data ::

    data.medialab.sciences-po.fr/profiep

- les outils spécifiques DIME-SHS web ::

    dime-shs.sciences-po.fr/web ?

- vitrine globale des productions du médialab (data, publications, tools) ::

    medialab.sciences-po.fr/universe
    medialab.sciences-po.fr/42

- intégration des tools directement dans le site (voir ci-dessous) ::

    medialab.sciences-po.fr 


Qu'est ce qu'une vitrine
########################

C'est un portail de présentation des productions du médialab.
Il faut deux fichiers :

- un template HTML de la home qui définit des positions éditoriales

+----------------+-----------+
|                |           |
|       TOOL1    |   TOOL2   |
|                +-----------+
|                |   TOOL3   |
+----------------+-----------+ 
|      TOOLs 4 as a list     |
+----------------------------+

 
- un template HTML d'un outil :

+----------------+------+
|                |   F  |
|     TOOL1      |   A  |
|                |   C  |
|     META       |   E  |
|                |   T  |
|     RST        |   S  |
+----------------+------+ 

- un fichier index JSON qui attribue des outils aux positions du template ::

    {
        "tool1": "heatgraph",
        "tool2": "iwanthue",
        "tool3": "hci",
        "tools4": ["table2net","navicrawler","tubemynet"],
    }


workflow de production d'un outils 
##################################

- développement sur dev.medialab.sciences-po.fr non accessible depuis l'extérieur
- migration sur tools.medialab
- rédiger la documentation utilisateur toujours sur tools.medialab
- décider de le référencer sur les sites vitrine (medialab, universe, tools, dime-shs...)

Comment et où on rédige la doc user ?
#####################################

- rédiger par des développeurs
- les devs ne veulent pas faire de mise en forme
- la doc contient un référencement des pages utiles (codesource, post, tutoriel, vidéo, wiki…)
- deux fichiers de description à remplir : 
  - la doc rédigée : README.rst en ReStructuredText ou RST (voir `l'introduction à RST <http://docutils.sourceforge.net/docs/user/rst/quickref.html/>`_)
  - métadonnées : un fichier au format JSON

Comment référencer/publier un outils sur une vitrine ?
######################################################

- pour github.com : publication de la doc RST uniquement en tant que README.rst ce qui publie la documentation directement
- les vitrines : tools / universe / dime-shs web : 

  - mettre à jour l'index de la vitrine : le fichier JSON qui attribue un outil ou de soutils aux emplacements éditoriaux
  - activer le moteur d'indexation et de transformation : index JSON -> récupération des RST et JSON des outils pointés -> génération du HTML/JS par le moteur de template

comment intégrer les tools au site du médialab ?
################################################

- préparer un ou des templates HTML qui prévoi(en)t l'intégration des informations des TOOL dans le contexte de wordpress
- écrire un script PHP get_html_tool_medialab_website.php : 

  - input : identifiant d'outils
  - output : HTML (template rempli)
  - mettre en place un mécanisme de cache

- indiquer à WORDPRESS quels outils à afficher en créant un custom post TOOL avec un custom_field : tool_id
- dans le template d'affichage des custom post TOOL, on exécute PHP_CURL qui va appeler le script PHP get_html_tool_medialab_website.php avec comme argument l'id_tool



TO BE DONE
__________

- définir la liste des outils pour le test : Mathieu 
- arrêter la structuration minimale des JSON : index + tool : Mathieu
- tester SPHYNX pour générer du HTML depuis RST : Paul
- faire les templates HTML des vitrines et des tools : Daniele
- écrire le script qui génère les vitrines : Benjamin (python)
- arrête la structuration des dossiers tools : Paul
- écrire le script qui réponds à wordpress en WSGI / PYTHON
- écrire la partie WORDPRESS                : Louis + Benjamin

Rendez vous le Jeudi 2 Août à 10h au médialab pour faire tout ça