Add-Type -AssemblyName System.Drawing

$sourcePath = "d:\Project\CollegeManagement-main\mobile\assets\Icon.png"
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source icon not found at $sourcePath"
    exit 1
}

# 1. Update assets folder
Copy-Item $sourcePath "d:\Project\CollegeManagement-main\mobile\assets\icon.png" -Force
Write-Host "Updated mobile/assets/icon.png"

$resBase = "d:\Project\CollegeManagement-main\mobile\android\app\src\main\res"

$densities = @{
    "mipmap-mdpi"    = @{ launcher = 48;  fg = 108 }
    "mipmap-hdpi"    = @{ launcher = 72;  fg = 162 }
    "mipmap-xhdpi"   = @{ launcher = 96;  fg = 216 }
    "mipmap-xxhdpi"  = @{ launcher = 144; fg = 324 }
    "mipmap-xxxhdpi" = @{ launcher = 192; fg = 432 }
}

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($dir in $densities.Keys) {
    $targetDir = Join-Path $resBase $dir
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $lSize = $densities[$dir].launcher
    $fgSize = $densities[$dir].fg

    # Generate standard ic_launcher.png
    $lBmp = New-Object System.Drawing.Bitmap($lSize, $lSize)
    $g = [System.Drawing.Graphics]::FromImage($lBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcImg, 0, 0, $lSize, $lSize)
    $g.Dispose()

    $lPath = Join-Path $targetDir "ic_launcher.png"
    $lBmp.Save($lPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $lBmp.Dispose()

    # Generate round ic_launcher_round.png
    $rBmp = New-Object System.Drawing.Bitmap($lSize, $lSize)
    $g = [System.Drawing.Graphics]::FromImage($rBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $lSize, $lSize)
    $g.SetClip($path)
    $g.DrawImage($srcImg, 0, 0, $lSize, $lSize)
    $g.Dispose()

    $rPath = Join-Path $targetDir "ic_launcher_round.png"
    $rBmp.Save($rPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $rBmp.Dispose()

    # Generate adaptive ic_launcher_foreground.png (scaled to 72% safe zone of 108dp)
    $fgBmp = New-Object System.Drawing.Bitmap($fgSize, $fgSize)
    $g = [System.Drawing.Graphics]::FromImage($fgBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $iconDrawSize = [int]($fgSize * 0.72)
    $offset = [int](($fgSize - $iconDrawSize) / 2)
    $g.DrawImage($srcImg, $offset, $offset, $iconDrawSize, $iconDrawSize)
    $g.Dispose()

    $fgPath = Join-Path $targetDir "ic_launcher_foreground.png"
    $fgBmp.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $fgBmp.Dispose()

    # Remove old .webp files to avoid duplicate resource conflict
    Remove-Item (Join-Path $targetDir "ic_launcher.webp") -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $targetDir "ic_launcher_round.webp") -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $targetDir "ic_launcher_foreground.webp") -ErrorAction SilentlyContinue

    Write-Host "Generated launcher icons for $dir"
}

$srcImg.Dispose()
Write-Host "All icons generated successfully!"

