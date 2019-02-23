# Práctica Curso Docker
Se ha implementado un stack que muestra el funcionamiento del esquema productor/consumidor de __Apache Kafka__.
# ¿Qué es Apache Kafka?
> Apache Kafka es un sistema de __cola de mensajes__ basado en una arquitectura p2p.
> Utiliza un esquema __"publish/subscribe"__ en el que una aplicación A (Productor) puede publicar 
> datos en una cola de mensajes a la espera de que otra aplicación B (Consumidor) los lea. 
> Dentro del contexto de Apache Kafka, se llama __Topic__ a cada una de las colas de mensajes. Los datos 
> escritos en un Topic son por defecto persistentes, y no se pierden al ser consumidos.

# Contenido de la entrega
#### kproducer
Es una aplicación implementada en *Node.js*. Consta de un formulario desde el cual se pueden __enviar
mensajes__ al topic de nombre "global" de *Kafka*.
El __Dockerfile incluído__ parte de una imagen *node:9-alpine*. Copia los ficheros de la aplicación en la imagen,
instala las dependencias, expone el puerto 3000 y lanza la aplicación.
#### kconsumer
Es un __visor__ que muestra de forma gráfica el contenido del topic "global". Se ha implementado en *Node.js*.
El __Dockerfile incluído__ es análogo al de *kproducer*.
#### docker-compose.yml
Se incluye un docker-compose.yml para orquestar el despliegue del stack.
Se definen 4 servicios:
 - __zookeeper__: necesario para lanzar Apache Kafka. Se ha usado una imagen existente en *Docker Hub*.
 - __kafka__: el servicio de cola de mensajes. Se ha usado una imagen existente en *Docker Hub*. Se le pasa una variable de entorno CREATE_TOPICS con la que se indica que cree un topic de nombre __"global"__ al arranque del servicio, que usaran el productor y el consumidor para el intercambio de mensajes.
 - __consumer__: despliega el contenedor de *kconsumer* implementado. Mapea el puerto 3001 para el *webserver*, y el 3002 para la conexión *websocket* del front con el backend de kconsumer.
 - __producer__: despliega el contenedor de *kproducer* implementado. El puerto para el *webserver* es el 3000.

# Despliegue en single host
#### Arranque de los servicios
```sh
$ docker-compose up -d
```
#### Parada de servicios
```sh
$ docker-compose down
```
# Despliegue en swarm:
Se ha definido un __factor de replicación__ de 3 para el servicio *producer*. Si se despliega el stack en un *swarm* con __3 nodos worker__, se puede comprobar que el productor se lanza en cada uno de ellos, y la carga de las peticiones se reparte entre los 3.
#### Arranque de los servicios (desde el nodo manager)
```sh
$ docker stack deploy --compose-file docker-compose.yml kafkademo
```
#### Verificar el estado de ejecución
```sh
$ docker stack services kafkademo
```
#### Parada de servicios
```sh
$ docker stack rm kafkademo
```
# Uso
Abrir en el navegador la url http://<host>:3000 para el productor, y http://<host>:3001 para el consumidor.
Usar el formulario del productor para enviar un mensaje. Se recibe como respuesta la fecha de envío, el ID del nodo que ha procesado la petición y el cuerpo del mensaje.
En la ventana del consumidor debe aparecer esta misma información de forma gráfica.
Si se arranca en *swarm*, cada envío puede ser procesado por un nodo diferente.

# Autor
Carlos M. Marrero Pérez - 2019
