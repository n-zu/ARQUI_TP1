### Correr pruebas de carga con Artillery

1. Entrar al directorio perf: `cd perf`
2. Instalar las dependencias: `npm i`
3. Ahora se pueden correr las pruebas de carga

- `npm run node`: llama al root de la api, incrementando las conexiones
- `npm run load`: llama varias rutas, incrementando las conexiones en 2 etapas

> Visualizar en grafana: `localhost:8081`
