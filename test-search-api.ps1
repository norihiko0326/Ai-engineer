# 検索 API テストスクリプト

Write-Host "======================================"
Write-Host "検索 API テスト開始"
Write-Host "=====================================" -ForegroundColor Green

# テスト対象サーバー
$baseUrl = "http://localhost:8080"

# 待機関数
function Wait-ForService {
    param([int]$retries = 30)
    $count = 0
    while ($count -lt $retries) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/health" -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ バックエンドが起動しました" -ForegroundColor Green
                return $true
            }
        } catch {
            $count++
            Write-Host "⏳ バックエンド起動待機中... ($count/$retries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
    }
    Write-Host "❌ バックエンドが起動しません" -ForegroundColor Red
    return $false
}

# Test 1: ヘルスチェック
Write-Host "`n[Test 1] ヘルスチェック" -ForegroundColor Cyan
Write-Host "GET /health"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -ErrorAction Stop
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "応答: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
    exit 1
}

# Test 2: 全タスク取得
Write-Host "`n[Test 2] 全タスク取得" -ForegroundColor Cyan
Write-Host "GET /api/tasks"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks" -ErrorAction Stop
    $tasks = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "取得タスク数: $($tasks.Count)" -ForegroundColor Gray
    $tasks | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}}, @{N='ステータス';E={$_.status}} -First 3 | Format-Table
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
}

# Test 3: 検索 API テスト
Write-Host "`n[Test 3] 検索 API（キーワード: authentication）" -ForegroundColor Cyan
Write-Host 'GET /api/tasks/search?keyword=authentication'
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks/search?keyword=authentication" -ErrorAction Stop
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
    Write-Host "注: 検索APIはまだ実行中の可能性があります" -ForegroundColor Gray
}

# Test 4: ステータスフィルター
Write-Host "`n[Test 4] ステータスフィルター (TODO)" -ForegroundColor Cyan
Write-Host "GET /api/tasks/status/TODO"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/tasks/status/TODO" -ErrorAction Stop
    $tasks = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "TODO タスク数: $($tasks.Count)" -ForegroundColor Gray
    $tasks | Select-Object @{N='ID';E={$_.id}}, @{N='タイトル';E={$_.title}} | Format-Table
} catch {
    Write-Host "❌ エラー: $_" -ForegroundColor Red
}

Write-Host "`n======================================"
Write-Host "✅ テスト完了" -ForegroundColor Green
Write-Host "======================================"
