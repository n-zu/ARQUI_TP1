### Correr pruebas de carga con Artillery

1. Entrar al directorio perf: `cd perf`
2. Instalar las dependencias: `npm i`
3. Ahora se pueden correr las pruebas de carga

Usando el comando `run.scenario.sh <archivo> <environment>` 
donde archivo es el nombre del .yaml a ejecutar y environment es api
dado que solo usamos un único ambiente

- `./run-scenario.sh metar_load api`: corre el escenario de `scenarios/metar_load.yaml`

> Visualizar en grafana: `localhost:8081`
