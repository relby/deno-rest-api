# Deno REST API
The REST API on [Deno](https://deno.land/) implemented with [oak framework](https://oakserver.github.io/oak/) and [PostgreSQL](https://www.postgresql.org/)
## Setup
To start you need PostgreSQL installed on you machine. You can install it [here](https://www.postgresql.org/download)
or install it as [docker](https:/www.docker.com) container like this
```console
$ docker run -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=InitialDB postgres
```
Also add a config.ts file with your database credentials
## Run
You can either start it like this
```console
$ deno run --allow-env --allow-net index.ts
```
or like this in watch mode (because this add uses [denon](https://github.com/denosaurs/denon))
```console
$ denon start
```