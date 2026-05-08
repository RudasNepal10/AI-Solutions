using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface IChatbotService
    {
        Task<string> GetChatResponseAsync(string message);
    }
}
