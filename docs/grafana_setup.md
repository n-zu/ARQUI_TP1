### Setup de Grafana

- Levantar los contenedores
- Entrar a grafana en `localhost:8081`
- Entrar con user: admin, pass: admin (opcional: cambiar contraseña)
- Agregar un data source nuevo
- Elegir el datasource de Graphite
- En el campo de URL, poner la del container de Graphite: `http://graphite`
- Ir a la sección de Dashboards e importar el dashboard: `<directorio TP>/perf/dashboard_with_variables.json`
- Ejecutar pruebas con la api. (Ej: correr pruebas de Artillery)
- Revisar los gráficos del dashboard

Los stats se persisten en Graphite y también pueden visualizarse distintas métricas de artillery en `localhost:8090`, en el directorio:
`Metrics/stats/gauges/artillery-api`