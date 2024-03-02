# Define variables
$dockerCommand = ""
$path = ".docker/docker-compose.development.yml"
$utilsPath = "utils"

function Check-ComposeVersion {
    $global:composeCommand = "docker compose"
    if (-not (Get-Command "docker compose" -ErrorAction SilentlyContinue)) {
        # can't find docker compose, tries older version
        $global:composeCommand = "docker-compose"
        if (-not (Get-Command "docker-compose" -ErrorAction SilentlyContinue)) {
            # couldn't find docker-compose i.e no version of docker compose is installed
            return
        }
    }
}


function Usage {
    Write-Host "Utils script for docker commands in development:
Required:
    compose:
        passes the command line arguments to '$($script:dockerCommand) $($path) {provided arguments}'.
$(Exec-Usage)
    seed:
        seeds database using the seeding file
    test:
        runs the docker test file, and sends any additional arguments to the pytest command
            - 'seed -s' will be the same as 'pytest -s'
"
}

function Exec-Usage {
    Write-Host "    exec:
        interactive shell for development containers (api or db)
        Options:
            api - interactive shell for api container (default)
            db - interactive mongosh shell for db
"
}
function Run-Compose {
    & $global:composeCommand -f $path @args
}

function Exec-Api {
    docker exec -it tdctl_api bash
}

function Exec-Db {
    $container = "mongodb_dev"
    $host = "td_mongodb"
    $port = 26900
    docker exec -it $container mongosh --host $host --port $port
}

function Interactive-Shell {
    if ($args.Count -eq 0) {
        Exec-Api
        exit 1
    }
    switch ($args[0]) {
        "api" { Exec-Api }
        "db" { Exec-Db }
        "-h" { Exec-Usage }
        "--help" { Exec-Usage }
        default { Exec-Usage }
    }
}

function Seed-Db {
    docker exec tdctl_api python3 -m $utilsPath.seeding
}

function Run-Tests {
    $testFile = "pytest_docker.py"
    python3 "$utilsPath/$testFile" @args
}

function Parse-Arguments {
    if ($args.Count -eq 0) {
        Usage
        exit 1
    }

    switch ($args[0]) {
        "compose" { $args = $args[1..$args.Count]; Run-Compose @args }
        "exec" { $args = $args[1..$args.Count]; Interactive-Shell @args }
        "seed" { Seed-Db }
        "test" { $args = $args[1..$args.Count]; Run-Tests @args }
        "-h" { Usage }
        "--help" { Usage }
        default { Usage }
    }
}

Check-ComposeVersion
Parse-Arguments @args
