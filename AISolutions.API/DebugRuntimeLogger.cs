using System;
using System.IO;
using System.Text.Json;

namespace AISolutions.API
{
    public static class DebugRuntimeLogger
    {
        private const string LogPath = @"D:\Final year assignment 2\AISolutions Portal\debug-eab9c7.log";

        public static void Log(string runId, string hypothesisId, string location, string message, object data)
        {
            var payload = new
            {
                sessionId = "eab9c7",
                runId,
                hypothesisId,
                location,
                message,
                data,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };

            var line = JsonSerializer.Serialize(payload);
            File.AppendAllText(LogPath, line + Environment.NewLine);
        }
    }
}
