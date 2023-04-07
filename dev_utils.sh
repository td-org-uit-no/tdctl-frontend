#!/bin/bash

docker_command=""
path=".docker/docker-compose.development.yml" 

check_compose_version() {
    compose_command="docker compose"
    if ! command -v ${compose_command} &> /dev/null; then
        # can't find docker compose, tries older version
        compose_command="docker-compose"
        if ! command -v $compose_command &> /dev/null; then
            # couldn't find docker-compose i.e no version of docker compose is installed
            return
        fi
    fi
    docker_command="$compose_command -f"
}

usage() {
    echo "Utils script for docker commands in development: 
Required:
    compose:
        passes the command line arguments to '${docker_command} ${path} {provided arguments}'.
    exec:
        exec interactive shell for development container (frontend_dev)
"
}

run_command() {
    $docker_command ${path} $@
}

interactive_shell() {
    # can use static name as frontend_dev is defined in compose file
    docker exec -it frontend_dev bash
}

parse_arguments() {
    if [ $# = 0 ];then
        usage
        exit 1
    fi
    # couldn't find docker compose or docker-compose
    if [ -z "$docker_command" ];then
        echo "Could not find any versions of (docker compose or docker-compose)"
        exit 1
    fi

    case $1 in 
        compose) shift; run_command $@;;
        exec) shift; interactive_shell;;
        -h | --help) shift; usage;;
        * ) usage;;
    esac
}

check_compose_version
parse_arguments $@

