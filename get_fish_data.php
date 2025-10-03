<?php
// Set header agar outputnya berupa JSON yang bisa dibaca JavaScript
header('Content-Type: application/json');

// Definisikan direktori utama tempat folder ikan berada
define('FISH_DIR', __DIR__ . '/fish/');

// Daftar tier/rarity sesuai dengan nama folder
$tiers = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'trash'];
$all_fish = [];

// Loop melalui setiap folder tier
foreach ($tiers as $tier) {
    $tierPath = FISH_DIR . $tier . '/';

    // Cari semua file gambar (jpg, png, gif) di dalam folder tier
    $images = glob($tierPath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

    if (empty($images)) {
        continue; // Lanjut ke tier berikutnya jika folder kosong
    }

    // Loop melalui setiap gambar yang ditemukan
    foreach ($images as $imagePath) {
        $imageName = pathinfo($imagePath, PATHINFO_FILENAME);
        $rewardFile = $tierPath . $imageName . '.txt';
        $reward = 1; // Default reward jika file .txt tidak ada

        // Baca file .txt untuk mendapatkan harga/reward
        if (file_exists($rewardFile)) {
            $reward = (int)trim(file_get_contents($rewardFile));
        }
        
        // Kumpulkan data ikan ke dalam satu array
        $all_fish[] = [
            'name' => str_replace('_', ' ', $imageName), // Ganti underscore dengan spasi untuk nama
            'rarity' => ucfirst($tier), // 'common' -> 'Common'
            'price' => $reward,
            'image_url' => 'fish/' . $tier . '/' . basename($imagePath) // Path gambar untuk website
        ];
    }
}

// Cetak semua data ikan dalam format JSON
echo json_encode($all_fish, JSON_PRETTY_PRINT);
?>
