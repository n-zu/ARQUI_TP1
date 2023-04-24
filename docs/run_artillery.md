### Correr pruebas de carga con Artillery

1. Entrar al directorio perf: `cd perf`
2. Instalar las dependencias: `npm i`
3. Ahora se pueden correr las pruebas de carga

- `npm run node`: llama al root de la api, incrementando las conexiones
- `npm run load`: llama varias rutas, incrementando las conexiones en 2 etapas

Usando el comando `run.scenario.sh <archivo> <environment>` 
donde archivo es el nombre del .yaml a ejecutar y environment es api
dado que solo usamos un único ambiente

- `./run-scenario.sh root api`: corre escenarios de root.yaml
- `./run-scenario.sh load api`: corre escenarios de load.yaml

> Visualizar en grafana: `localhost:8081`
