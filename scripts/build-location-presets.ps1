$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$queries = @(
  @('manila', 'Manila', 'PH', 'Philippines'),
  @('quezon-city', 'Quezon City', 'PH', 'Philippines'),
  @('cebu', 'Cebu City', 'PH', 'Philippines'),
  @('davao', 'Davao', 'PH', 'Philippines'),
  @('baguio', 'Baguio', 'PH', 'Philippines'),
  @('iloilo', 'Iloilo', 'PH', 'Philippines'),
  @('bacolod', 'Bacolod', 'PH', 'Philippines'),
  @('cagayan-de-oro', 'Cagayan de Oro', 'PH', 'Philippines'),
  @('puerto-princesa', 'Puerto Princesa', 'PH', 'Philippines'),
  @('zamboanga', 'Zamboanga', 'PH', 'Philippines'),
  @('bangkok', 'Bangkok', 'TH', 'Asia & Pacific'),
  @('hong-kong', 'Hong Kong', 'HK', 'Asia & Pacific'),
  @('jakarta', 'Jakarta', 'ID', 'Asia & Pacific'),
  @('kuala-lumpur', 'Kuala Lumpur', 'MY', 'Asia & Pacific'),
  @('seoul', 'Seoul', 'KR', 'Asia & Pacific'),
  @('taipei', 'Taipei', 'TW', 'Asia & Pacific'),
  @('auckland', 'Auckland', 'NZ', 'Asia & Pacific'),
  @('dubai', 'Dubai', 'AE', 'Asia & Pacific'),
  @('paris', 'Paris', 'FR', 'Europe'),
  @('rome', 'Rome', 'IT', 'Europe'),
  @('berlin', 'Berlin', 'DE', 'Europe'),
  @('madrid', 'Madrid', 'ES', 'Europe'),
  @('los-angeles', 'Los Angeles', 'US', 'Americas'),
  @('toronto', 'Toronto', 'CA', 'Americas'),
  @('vancouver', 'Vancouver', 'CA', 'Americas'),
  @('sao-paulo', 'Sao Paulo', 'BR', 'Americas')
)
$locations = foreach ($query in $queries) {
  $url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + [Uri]::EscapeDataString($query[1]) + '&count=10&language=en&format=json&countryCode=' + $query[2]
  $response = Invoke-RestMethod -Uri $url -TimeoutSec 20
  $city = $response.results | Where-Object { $_.country_code -eq $query[2] -and $_.feature_code -like 'PPL*' } | Sort-Object population -Descending | Select-Object -First 1
  if (-not $city -or -not $city.timezone) { throw "No city match for $($query[1])" }
  [ordered]@{ id = $query[0]; name = $query[1]; latitude = $city.latitude; longitude = $city.longitude; timeZone = $city.timezone; group = $query[3]; geonameId = $city.id; country = $city.country; source = $url }
}
$json = ConvertTo-Json -InputObject @($locations) -Depth 5
$modulePath = Join-Path $projectRoot 'src/lib/location-presets.js'
[IO.File]::WriteAllText($modulePath, "// City centers verified through Open-Meteo / GeoNames. Retrieved 2026-10-03.`nexport const MORE_LOCATIONS = $json`n", [Text.UTF8Encoding]::new($false))
Write-Output "Verified $(@($locations).Count) city presets."
