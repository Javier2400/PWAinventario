<?php
declare(strict_types=1);

namespace App;

class ChatbotService {
    public static function sendMessage(string $message): array {
$openai_key = $_ENV['OPENAI_API_KEY'] ?? $_SERVER['OPENAI_API_KEY'] ?? getenv('OPENAI_API_KEY') ?? throw new \Exception('OPENAI_API_KEY environment variable not set');

        $prompt = "Eres un asistente virtual experto para un Sistema de Gestión de Inventario. Tu objetivo es ayudar a los usuarios a gestionar sus productos, entender el stock y resolver dudas sobre el sistema. El sistema permite ver la lista de productos, agregar nuevos productos y eliminar productos existentes. Responde de forma clara, concisa y profesional en español. Si no conoces una respuesta específica sobre los datos del usuario, indícale cómo puede encontrar esa información en la interfaz del sistema.";

        $chathistory = [
            ["role" => "system", "content" => $prompt],
            ["role" => "user", "content" => $message]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.chatanywhere.tech/v1/chat/completions");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'model' => 'gpt-3.5-turbo',
            'messages' => $chathistory,
            'max_tokens' => 150,
            'temperature' => 0.7
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            "Authorization: Bearer $openai_key"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);
        $result = json_decode($response);
        
        if (isset($result->choices[0]->message->content)) {
            return ['response' => $result->choices[0]->message->content];
        }
        
        return ['response' => $result->error->message ?? 'Error desconocido'];
    }
}
