### Setup de Grafana

- Levantar los contenedores
- Entrar a grafana en `localhost:8081`
- Entrar con user: admin, pass: admin (opcional: cambiar contraseña)
- Agregar un data source nuevo
- Elegir el datasource de Graphite
- En el campo de URL, poner la del container de Graphite: `http://graphite`
- Ir a la sección de Dashboards e importar el dashboard de prueba: `<directorio TP>/perf/dashboard.json`
- Ejecutar pruebas con la api. (Ej: correr pruebas de Artillery)
- Revisar los gráficos del dashboard

Los stats se persisten en Graphite y también pueden visualizarse distintas métricas en `localhost:8090`, en el directorio:
`Metrics/stats/gauges/cadvisor/arqui_tp1_node_1`