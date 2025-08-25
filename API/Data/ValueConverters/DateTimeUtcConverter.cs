using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data.ValueConverters;

public class DateTimeUtcConverter : ValueConverter<DateTime, DateTime>
{
    public DateTimeUtcConverter() : base(
        value => value.ToUniversalTime(),
        value => DateTime.SpecifyKind(value, DateTimeKind.Utc))
    {       
    }
}
