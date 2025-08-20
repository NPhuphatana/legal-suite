using System.Text;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Recognizers.Text.DateTime;
using UglyToad.PdfPig;
using SkiaSharp;

namespace Backend.Services.Timeline;

public record TimelineEvent(DateTime Date, string Description);

public class TimelineService
{
    public IEnumerable<TimelineEvent> ExtractEvents(Stream fileStream, string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        string text = ext switch
        {
            ".docx" => ExtractTextFromDocx(fileStream),
            ".pdf" => ExtractTextFromPdf(fileStream),
            _ => throw new NotSupportedException("Only DOCX and PDF supported")
        };

        var events = new List<TimelineEvent>();
        var pattern = new Regex(@"\b(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})\b");
        foreach (var line in text.Split('\n'))
        {
            var match = pattern.Match(line);
            if (match.Success && DateTime.TryParse(match.Value, out var date))
            {
                var description = line.Substring(match.Index + match.Length).Trim();
                events.Add(new TimelineEvent(date, description));
            }
        }
        return events.OrderBy(e => e.Date);
    }

    private string ExtractTextFromDocx(Stream stream)
    {
        using var doc = WordprocessingDocument.Open(stream, false);
        var sb = new StringBuilder();
        foreach (var text in doc.MainDocumentPart!.Document.Body!.Descendants<Text>())
        {
            sb.AppendLine(text.Text);
        }
        return sb.ToString();
    }

    private string ExtractTextFromPdf(Stream stream)
    {
        using var pdf = PdfDocument.Open(stream);
        var sb = new StringBuilder();
        foreach (var page in pdf.GetPages())
        {
            sb.AppendLine(page.Text);
        }
        return sb.ToString();
    }

    public byte[] RenderTimeline(IEnumerable<TimelineEvent> events)
    {
        const int width = 800;
        int height = 100 + events.Count() * 40;
        using var bitmap = new SKBitmap(width, height);
        using var canvas = new SKCanvas(bitmap);
        canvas.Clear(SKColors.White);
        var paint = new SKPaint { Color = SKColors.Black, TextSize = 16 };
        int y = 50;
        foreach (var e in events)
        {
            canvas.DrawText(e.Date.ToString("yyyy-MM-dd"), 10, y, paint);
            canvas.DrawText(e.Description, 150, y, paint);
            y += 40;
        }
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        return data.ToArray();
    }
}
