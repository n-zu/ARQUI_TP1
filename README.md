# Trabajo Práctico 1 - Arquitectura de Software

## Integrantes

- Agustin Leguizamon
- Franco Scaccheri
- Nicolas Zulaica
- Elian Foppiano

## Enunciado

[Link al enunciado](./enunciado.md)

## Sistema

TODO: Diagrama de arquitectura
TODO: Aclarar que cada rama es una tactica diferente


## Ejecución

### Levantar el sistema

```bash
make up
```

### Detener containers

```bash
make down
```

### Ping

```bash
make ping
```

### Logs

```bash
make logs-all
```

### Pruebas
```bash
cd perf
npm run <test> # test = {metar_load, space_news_load, ...} see package.json for more
```