$data = $input | ConvertFrom-Json

# --- Project & Git ---
$cwd = Split-Path -Leaf $data.cwd
$branch = & git -C $data.cwd branch --show-current 2>$null
if (-not $branch) { $branch = "no-git" }
$user = & git -C $data.cwd config user.name 2>$null
$email = & git -C $data.cwd config user.email 2>$null
$remote = & git -C $data.cwd remote get-url origin 2>$null
if ($remote) { $remote = $remote -replace "^https?://[^@]*@", "https://" -replace "\.git$", "" }

# --- Model ---
$model = $data.model.display_name

# --- Code Changes ---
$linesAdded = if ($data.cost.total_lines_added -ne $null) { $data.cost.total_lines_added } else { 0 }
$linesRemoved = if ($data.cost.total_lines_removed -ne $null) { $data.cost.total_lines_removed } else { 0 }

# --- Context Window ---
if ($data.context_window.used_percentage -ne $null) {
    $usedPct = [math]::Round($data.context_window.used_percentage, 1)
    $remainPct = if ($data.context_window.remaining_percentage -ne $null) { [math]::Round($data.context_window.remaining_percentage, 1) } else { [math]::Round(100 - $data.context_window.used_percentage, 1) }
    $context = "Used:${usedPct}% Remain:${remainPct}%"
} else {
    $context = "--"
}

# --- Output ---
Write-Host "$cwd | $branch [$user $email] $remote | $model | $context | +${linesAdded}/-${linesRemoved}"
