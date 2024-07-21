<?php
// auth.php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Extract user data from the request
$first_name = $data['first_name'];
$last_name = $data['last_name'];
$telegram_id = $data['id'];
$telegram_username = $data['username'];

// Xata API endpoint and key
$xata_api_key = 'xau_sAKUOpYM0Fnw1YdpiK3cvVEubLpocjh12';
$xata_url = 'https://raog812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main/tables/stol/data?columns=id';

// Prepare data for insertion
$body = json_encode([
    'first_name' => $first_name,
    'last_name' => $last_name,
    'telegram_id' => $telegram_id,
    'telegram_username' => $telegram_username
]);

// Initialize cURL session
$ch = curl_init($xata_url);

// Set cURL options
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $xata_api_key,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

// Execute the cURL request and get the response
$response = curl_exec($ch);

// Close the cURL session
curl_close($ch);

// Output the response
echo $response;
?>
