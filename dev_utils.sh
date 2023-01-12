#!/bin/bash

docker_command="docker compose -f"
path=".docker/docker-compose.development.yml" 

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

    case $1 in 
        compose) shift; run_command $@;;
        exec) shift; interactive_shell;;
        -h | --help) shift; usage;;
        * ) usage;;
    esac
}

parse_arguments $@

