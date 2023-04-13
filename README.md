# Punto de partida para el TP 1 de Arquitectura del Software (75.73) del 1er cuatrimestre de 2023

> **La fecha de entrega para el informe y el código es el jueves 11/05** :bangbang:

La forma de entrega será a través del canal de Slack del grupo. Deben poner ahí un link al repositorio con el código (en caso de ser privado, invitar también a los docentes) y el informe (o avisar si está en el repositorio).

El informe puede ser un PDF, Google Doc o Markdown/Wiki en el mismo repositorio del código. **Debe** incluir screenshots del dashboard de métricas para cada caso analizado que permitan observar los resultados obtenidos y **debe** incluir una **vista Components & Connectors** para los distintos casos estudiados.

## Objetivos

El objetivo principal es comparar algunas tecnologías, ver cómo diversos aspectos impactan en los atributos de calidad y probar qué cambios se podrían hacer para mejorarlos.
El objetivo menor es que aprendan a usar una variedad de tecnologías útiles y muy usadas hoy en día, incluyendo:

- Node.js (+ Express)
- Docker
- Docker Compose
- Nginx
- Redis
- Algún generador de carga (la propuesta es usar Artillery, pero pueden cambiarlo)
- Alguna forma de tomar mediciones varias y visualizarlas, preferentemente en tiempo real, con persistencia, y en un dashboard unificado (la propuesta es usar el plugin de Artillery + cAdvisor + StatsD + Graphite + Grafana, pero pueden cambiarlo).

## Consigna

Implementar un servicio HTTP en Node.js-Express que represente una API que consume otras APIs para dar información a sus usuarios, similar a lo que brindaría una API para una página de inicio personalizada. Someter sus endpoints a diversas intensidades/escenarios de carga en algunas configuraciones de deployment, tomar mediciones y analizar resultados.

A partir de este repositorio como punto inicial, van a tener que implementar el webserver y dockerizarlo (completar la carpeta `app/`), agregar los servicios con el webserver al `docker-compose.yml`, y configurar las locations y upstreams de nginx en `nginx_reverse_proxy.conf`.

> **El tráfico entre cliente y servidor debe pasar por el nginx, para que tenga la latencia del salto "extra"**

Para generar carga y ver las mediciones obtenidas, en la carpeta `perf/` tienen un dashboard de Grafana ya armado (`dashboard.json`) y un ejemplo de un escenario básico de Artillery (**deben** crear sus propios escenarios de manera apropiada para lo que estén probando). También hay un script y una configuración en el `package.json` para que puedan ejecutar los escenarios que hagan corriendo:

```npm run scenario <filename> <env>```

donde `<filename>` es el nombre del archivo con el escenario (sin la extensión `.yaml`) y `<env>` es el entorno en el cual correrá la prueba (vean la sección `environments` dentro del yaml del escenario).

### Servicios

#### Ping

*Endpoint*: `/ping`

Este servicio devolverá un valor constante, sin procesamiento. Lo utilizaremos como healthcheck y como baseline para comparar con los demás.

#### METAR

*Endpoint*: `/metar?station=<code>`

*Ejemplo*: `/metar?station=SAEZ` (para el Aeropuerto de Ezeiza)

Un [METAR](http://www.bom.gov.au/aviation/data/education/metar-speci.pdf) es un reporte del estado meteorológico que se registra en un aeródromo. Se lo codifica en un string, por ejemplo:

    KDEW 111218Z AUTO 20010KT 10SM -RA SCT012 BKN020 OVC033 06/05 A2981 RMK AO2 P0002 T00610050

Interpretación de algunos campos:

- KDEW: Código del aeródromo (Deer Park Airport)
- 20010KT: Viento de 10 nudos desde la dirección 200
- 10SM: Visibilidad de 10 millas
- -RA: Lluvia leve
- SCT012: Nubes dispersas a 1200 pies
- BKN020: Parcialmente nublado a 2000 pies
- OVC033: Cubierto a 3300 pies
- T00610050: Temperatura de 6,1 grados y punto de rocío de 5 grados

Nuestro servicio recibirá un [código OACI](https://www.world-airport-codes.com/) de un aeródromo y delegará la consulta a la [NOAA Text Data Server API](https://www.aviationweather.gov/dataserver) (ver [ejemplos](https://www.aviationweather.gov/dataserver/example?datatype=metar)). Solicitaremos la información en formato XML y la convertiremos a JSON para entregarla a nuestro cliente. Podemos hacerlo así:

```JavaScript
//Importamos los componentes necesarios
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { decode } = require('metar-decoder');

const parser = new XMLParser();

...

//Consultamos a la API de NOAA
const response = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`);
//Convertimos el XML obtenido a JSON, por conveniencia
const parsed = parser.parse(response.data);
//Decodificamos el METAR
decode(parsed.response.data.METAR.raw_text);
```

> **Importante**: El ejemplo anterior es solo una manera de hacerlo, pueden utilizar la que prefieran. No se están contemplando situaciones de error (METAR vuelve vacío, error de conexión a NOAA, error de parseo, etc.), que sí deberían ser contempladas por ustedes, devolviendo un error apropiado al cliente.

#### Space News

*Endpoint*: `/space_news`

Devolveremos **solo los títulos** de las 5 últimas noticias sobre actividad espacial, obtenidas desde la [Spaceflight News API](https://spaceflightnewsapi.net/).

Ver [documentación de la API](https://api.spaceflightnewsapi.net/documentation)

#### Useless fact

*Endpoint*: `/fact`

Devolveremos 1 hecho sin utilidad por cada invocación a nuestro endpoint, obtenido desde [uselessfacts](https://uselessfacts.jsph.pl/). Debe evitarse entregar el mismo hecho cada vez (salvo que lo repita la API remota).

#### APIs opcionales

Pueden agregar más endpoints que consulten a otras APIs. Para buscar APIs que sean gratuitas y de uso público, pueden consultar [aquí](https://github.com/public-apis/public-apis).

> **Importante**: Es preferible hacer un buen análisis de lo obligatorio en vez de agregar más APIs con un análisis superficial. Solo agreguen opcionales si terminaron de manera consistente con lo obligatorio, siendo también consistentes con lo que agreguen.

### Tácticas

#### Caso base

El caso base existe solo para tomar como referencia y poder verificar si hay mejoras con las tácticas aplicadas.

#### Caché

Utilizarán Redis como caché (ver [redis](https://www.npmjs.com/package/redis))

La idea es que elijan la estrategia más apropiada para llenar, conservar y vaciar la información del caché según estos criterios:

- Aplicación: Esta información, ¿es cacheable?
- Tamaño: Cuántos ítems almacenar en el caché.
- Llenado: Decidir entre
  - Active population: Incorporar la información al caché antes de que la solicite el cliente.
    - ¿Se puede traer información cada cierto tiempo para tener algo que darle al cliente?
  - Lazy population: Incorporar la información cuando la pide el primer cliente.
- Tiempo de vida: Cuánto tiempo debe permanecer el dato en el caché antes de ser eliminado. Depende de si la información que almacenamos expira (deja de tener validez por paso del tiempo) o puede estar permanentemente / hasta ser accedida por alguien.
- Vaciado: Si tomo un ítem del caché, ¿debo eliminarlo o debe permanecer para otro pedido?

#### Replicación

Escalarán el servicio a 3 copias, convirtiendo a nginx en un load balancer.

#### Rate limiting

Deberán experimentar con una solución que limite el rate de consumo de la API. Pueden ver [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) o [cómo hacerlo con nginx](https://www.nginx.com/blog/rate-limiting-nginx/). No es necesario que prueben ambas, alcanza con una.

#### Tácticas opcionales

Pueden probar otras tácticas, pero recuerden que es mejor ser consistentes con lo que entregan y que no se puede cambiar algo obligatorio por algo opcional.

### Generación de carga para las pruebas

> **Importante**: Generen valores de carga que tengan relación con los tiempos que ven en la aplicación. No agrega valor que generen una carga enorme y luego cueste saber cuál de todos los componentes está fallando. Vayan de a poco con la carga y verifiquen cómo se van afectando los atributos de calidad.

Hay muchos tipos de escenarios de carga y pruebas de performance en general. Pueden leer por ejemplo [aquí](https://www.softwaretestingclass.com/what-is-performance-testing/) (o en cualquiera de los miles de links al googlear sobre el tema) sobre algunos tipos de escenarios que pueden implementar. Queda a decisión de cada grupo elegir cuáles implementar, considerando siempre cuál es el que más útil les resulta para analizar lo que quieran estudiar.

Tengan en cuenta que, en el caso de los METARs, la carga generada **debe enviar distintos códigos de aeródromo** cuando simulen los pedidos de los clientes. Vean formas de hacerlo [aquí](https://www.artillery.io/docs/guides/guides/test-script-reference#payload---loading-data-from-csv-files) y [aquí](https://www.artillery.io/docs/guides/guides/test-script-reference#variables---inline-variables).

### Métricas propias

Deberán generar las siguientes métricas, que se agregarán como gráficos adicionales a los que les damos en el dashboard:

- Demora de cada endpoint en responder
- Demora de cada API remota en responder

Pueden usar [hot-shots](https://www.npmjs.com/package/hot-shots)

## Aclaraciones sobre la entrega

1. El trabajo debe entregarse **completo**. No se aceptan entregas parciales.
2. Asumimos que todo el grupo participa en la resolución del trabajo. De ocurrir problemas o surgir contratiempos, es el grupo quien debe responder y solucionarlos. Pueden consultar a los docentes pero deben demostrar primero que intentaron solucionarlos internamente.
3. De haber defectos importantes en el desarrollo o en el informe del TP, se solicitará una re-entrega. Esto tiene un impacto considerable en la nota final, por lo que les recomendamos que controlen entre todo el grupo las conclusiones y justificaciones antes de entregar el trabajo.

-----------

## Links útiles

- Node.js:
  - https://nodejs.org/
  - https://github.com/creationix/nvm
  - https://nodejs.org/dist/latest-v16.x/docs/api/ o https://nodejs.org/dist/latest-v18.x/docs/api/
- Express:
  - https://expressjs.com/en/starter/hello-world.html
- Nginx:
  - https://nginx.org/
- Redis:
  - https://redis.io/
  - https://www.npmjs.com/package/redis
- Docker:
  - https://docker-k8s-lab.readthedocs.io/en/latest/docker/docker-engine.html
  - https://www.docker.com/
- Docker-compose:
  - https://docs.docker.com/compose/
- StatsD:
  - https://github.com/etsy/statsd
  - https://github.com/etsy/statsd/blob/master/docs/graphite.md
- Graphite:
  - https://graphiteapp.org/
  - https://graphite.readthedocs.io/en/latest/
- Grafana:
  - https://grafana.com/
  - https://docs.grafana.org/guides/getting_started/
- Imagen usada (statsd + graphite):
  - https://hub.docker.com/r/graphiteapp/graphite-statsd/
  - https://github.com/graphite-project/docker-graphite-statsd
- Gotchas:
  - http://dieter.plaetinck.be/post/25-graphite-grafana-statsd-gotchas/
- Artillery:
  - https://artillery.io/docs/
  - https://www.npmjs.com/package/artillery
  - https://www.npmjs.com/package/artillery-plugin-statsd
- JMeter:
  - https://jmeter.apache.org/

## Pequeño cheatsheet de docker

Es posible que necesiten ejecutar los comandos con `sudo`, según el sistema que usen y cómo lo hayan instalado.

```sh
# Ver qué containers existen
docker ps [-a]

# Ver qué imagenes hay en mi máquina
docker images

# Ver uso de recursos de containers (como "top" en linux)
# Ejemplo con formato específico: docker stats --format '{{.Name}}\t{{.ID}}\t{{.CPUPerc}}\t{{.MemUsage}}'
docker stats [--format <format_string>]

# Descargar una imagen
docker pull <image>[:<tag>]

# Eliminar un container
docker rm <container_id> [-f]

# Eliminar una imagen
docker rmi <image_id> [-f]

# Eliminar imágenes "colgadas" (dangling)
docker rmi $(docker images -q -f dangling=true)

# Versión instalada
docker version
```

## Pequeño cheatsheet de docker-compose

Todos los siguientes comandos deben ejecutarse desde la carpeta en donde está el archivo `docker-compose.yml` del proyecto.

Es posible que necesiten ejecutar los comandos con `sudo`, según el sistema que usen y cómo lo hayan instalado.

```sh
# ALIAS para escribir menos
alias docc='docker-compose'

# Ayuda general
docc --help

# Ayuda genral para cualquier comando
docc [COMMAND] --help

# Levantar servicios.
# Sugerencia: Usar la opción -d para levantar en background, y poder seguir usando la terminal
# También sirve para escalar horizontalmente un servicio que ya se esté ejecutando [buscar opción --scale].
# Si no se especifica al menos un servicio, se levantan todos
docc up [options] [SERVICE...]

# Ver logs de un servicio ejecutándose en background
docc logs [options] [SERVICE]

# Listar containers y sus estados
docc ps

# Restartear servicios
# Si no se indica al menos un servicio, se restartean todos
docc restart [SERVICE...]

# Frenar servicios corriendo en background (con la opción --detach del `up`)
# Si no se lista ningún servicio, se frenan todos.
# Esto solo frena servicio, no borra el container ni los datos que hayan en el mismo
docc stop [SERVICE...]

# Frenar containers y borrar tanto los containers como las imágenes y los volúmenes de almacenamiento
# (se pierden todos los datos que hubiera en el container).
# Esto aplica a TODOS los levantados con `up`, no filtra por servicio
docc down

# Levantar un nuevo container de un servicio y ejecutar un comando adentro
# (util para tener por ejemplo una terminal dentro de un container e inspeccionarlo o hacer pruebas manuales).
# Como es siempre sobre un container nuevo, lo que ven es el resultado de su docker-compose.yml y sus dockerfiles
# Ejemplo: docc run graphite bash
docc run SERVICE COMMAND

# Correr un comando en un container que ya existe y ya está corriendo.
# Parecido a `run` pero sobre un container en ejecución.
# Útil para alterar o inspeccionar algo que se está ejecutando.
#Lo que ven adentro puede no ser el resultado directo del docker-compose.yml + dockerfiles, así que mucho cuidado
# si van a modificar sus containers así, porque puede ser difícil de reproducir luego.
# Ejemplo: docc exec graphite bash
docc exec SERVICE COMMAND

# Versión instalada
docc version
```
