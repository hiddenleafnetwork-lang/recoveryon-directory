# RecoveryOn Directory Local Server
# Runs a lightweight HTTP server on http://localhost:8000/ using standard .NET System.Net.HttpListener.

$Port = 8000
$Address = "http://localhost:$Port/"
$CurrentDir = Get-Location

# Create listener
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Address)

try {
    $Listener.Start()
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  RecoveryOn Directory Web Server is now LIVE!            " -ForegroundColor Green
    Write-Host "  URL: http://localhost:$Port/                            " -ForegroundColor Yellow
    Write-Host "  Directory: $CurrentDir                                  " -ForegroundColor White
    Write-Host "  Press Ctrl+C in terminal to stop the server             " -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Failed to start server: $_" -ForegroundColor Red
    Exit 1
}

# Serve requests loop
while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath
        if ($UrlPath -eq "/") {
            $UrlPath = "/index.html"
        }

        # Clean URL mapping to absolute path
        $CleanPath = $UrlPath.Replace("/", "\")
        if ($CleanPath.StartsWith("\")) {
            $CleanPath = $CleanPath.Substring(1)
        }
        $FilePath = Join-Path $CurrentDir $CleanPath

        if (Test-Path $FilePath -PathType Leaf) {
            # Determine content type
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = switch ($Extension) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".json" { "application/json" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".mp4"  { "video/mp4" }
                Default { "application/octet-stream" }
            }

            # Read file bytes and write to stream
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            # 404 Response
            $Response.StatusCode = 404
            $ErrorMsg = "404 Not Found: The file $UrlPath does not exist on this local server."
            $Bytes = [System.Text.Encoding]::UTF8.GetBytes($ErrorMsg)
            $Response.ContentType = "text/plain; charset=utf-8"
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        }
        
        $Response.Close()
        Write-Host "[HTTP $($Response.StatusCode)] Requested: $UrlPath" -ForegroundColor Cyan
    } catch {
        # Handle exceptions gracefully
        if ($Listener.IsListening) {
            Write-Host "Error serving request: $_" -ForegroundColor Red
        }
    }
}
