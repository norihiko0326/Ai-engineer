Write-Host "======================================"  -ForegroundColor Green
Write-Host "検索 API テスト実行"  -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080"

# Test 1: ヘルスチェック
Write-Host "`n[Test 1] ヘルスチェック" -ForegroundColor Cyan
Write-Host "GET /health"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "応答: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
}

# Test 2: 全タスク取得
Write-Host "`n[Test 2] 全タスク取得" -ForegroundColor Cyan
Write-Host "GET /api/tasks"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks" -UseBasicParsing -ErrorAction Stop
    $tasks = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "取得タスク数: $($tasks.Count)" -ForegroundColor Gray
    Write-Host ""
    $tasks | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} -First 5 | Format-Table
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
}

# Test 3: 検索 API テスト
Write-Host "`n[Test 3] 検索 API（キーワード: 実装）" -ForegroundColor Cyan
Write-Host 'GET /api/tasks/search?keyword=実装'
try {
    $keyword = [System.Web.HttpUtility]::UrlEncode("実装")
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks/search?keyword=$keyword" -UseBasicParsing -ErrorAction Stop
    $results = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    if ($results -is [array]) {
        Write-Host "検出タスク数: $($results.Count)" -ForegroundColor Gray
        $results | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} | Format-Table
    } else {
        Write-Host "検出タスク数: 1" -ForegroundColor Gray
        [array]$results | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} | Format-Table
    }
} catch {
    Write-Host "⚠️  警告: $_" -ForegroundColor Yellow
}

# Test 4: 英語キーワード検索
Write-Host "`n[Test 4] 検索 API（キーワード: Development）" -ForegroundColor Cyan
Write-Host "GET /api/tasks/search?keyword=Development"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks/search?keyword=Development" -UseBasicParsing -ErrorAction Stop
    $results = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    if ($results -is [array]) {
        Write-Host "検出タスク数: $($results.Count)" -ForegroundColor Gray
        $results | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} | Format-Table
    } else {
        Write-Host "検出タスク数: 1" -ForegroundColor Gray
        [array]$results | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} | Format-Table
    }
} catch {
    Write-Host "⚠️  警告: $_" -ForegroundColor Yellow
}

# Test 5: ステータスフィルター
Write-Host "`n[Test 5] ステータスフィルター (TODO)" -ForegroundColor Cyan
Write-Host "GET /api/tasks/status/TODO"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks/status/TODO" -UseBasicParsing -ErrorAction Stop
    $tasks = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "TODO タスク数: $($tasks.Count)" -ForegroundColor Gray
    Write-Host ""
    $tasks | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}} | Format-Table
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
}

Write-Host "`n======================================"  -ForegroundColor Green
Write-Host "✅ テスト完了" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
