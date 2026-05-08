namespace AISolutions.Application.DTOs
{
    public class ChatRequestDTO
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponseDTO
    {
        public string Response { get; set; } = string.Empty;
    }
}