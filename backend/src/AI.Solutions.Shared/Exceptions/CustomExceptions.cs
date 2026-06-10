namespace AI.Solutions.Shared.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
    public NotFoundException(string name, object key) : base($"{name} with key ({key}) was not found.") { }
}

public class BadRequestException : Exception
{
    public List<string> Errors { get; }
    public BadRequestException(string message) : base(message) { Errors = new(); }
    public BadRequestException(string message, List<string> errors) : base(message) { Errors = errors; }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Unauthorized access") : base(message) { }
}

public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "Access denied") : base(message) { }
}

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}
