# Instalación y Configuración

A continuación se listan los procedimientos a seguir para instalar y configurar correctamente el backend a fin de poder correrlo localmente.

## MongoDB

### Instalación

1. Descargar la versión 2.4.14 de MongoDB desde alguno de estos lugares, dependiendo del sistema operativo:
   - [macOS](https://www.mongodb.org/dl/osx)
   - [Linux](https://www.mongodb.org/dl/linux)
   - [Windows](https://www.mongodb.org/dl/win32)
2. Instalar MongoDB siguiendo las instrucciones en alguna de estas páginas, dependiendo del sistema operativo:
   - [macOS](https://docs.mongodb.com/v2.4/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/v2.4/administration/install-on-linux/)
   - [Windows](https://docs.mongodb.com/v2.4/tutorial/install-mongodb-on-windows/)

### Configuración

1. Para poder ejecutar MongoDB en versiones modernas de macOS, se requiere indicarle al sistema operativo que es un binario seguro:

   `xattr -rd com.apple.quarantine [directorio donde se instaló mongo]`

2. Crear un archivo `mongodb.conf` con el siguiente contenido:
   ```yaml
   # Directorio vacío que usará Mongo para almacenar las colecciones
   dbpath=/etc/mongodb/data/
   # IP local desde donde se podrán recibir conexiones
   bind_ip=localhost
   # Puerto de escucha (número entero entre 1024 y 49151)
   port=27017
   # Para correr el servidor de fondo y no tener que mantener abierta la ventana de la terminal
   fork=true
   # Cosas útiles para debugging
   logpath=/var/log/mongodb/mongodb.log
   verbose=true
   journal=true
   ```
   Asegurarse de que el directorios existan y cuenten con los suficientes permisos de lectura y escritura.
3. Ejecutar el servidor de MongoDB (ubicado dentro del directorio `bin`)

   `mongod --config [ruta al archivo mongodb.conf]`

   Para terminar la ejecución hay varias formas:

   - Si `fork=false`, apretar `Ctrl+C` en la terminal que está corriendo `mongod`
   - Ejecutar `mongo --eval "db.getSiblingDB('admin').shutdownServer()"`
   - Buscar el proceso `mongod` en el administrador de procesos del sistema y terminarlo desde ahí

4. Ejecutar el cliente de MongoDB (ubicado dentro del directorio `bin`)

   `mongo`

   Si el puerto no es el por defecto (27017), se deberá especificar con `--port`.

   Para terminar la ejecución apretar `Ctrl+C`.

5. Crear la base de datos y un usuario para accederla.

   Escribir lo siguiente en el cliente de MongoDB:

   ```javascript
   use salina
   db.addUser({ user: "salina", pwd: "salina", roles: ["readWrite"]})
   ```

### Ejecución

1. Verificar la conexión a la base de datos con el usuario recién creado:

   `mongo salina --username salina --password salina`

### Importación de los datos

1. Ejecutar el programa `mongoimport` ubicado en el directorio `bin` de MongoDB:

   `mongorestore --db salina --username salina --password salina --drop data`

   `data` debería apuntar a la carpeta `data` ubicada en la raíz del proyecto Salina.

2. Asegurarse de que se hayan importado bien los lugares:

   `mongo salina --username salina --password salina --eval "db.places.count()"`

   Debería devolver `10111`.

## Salina

### Instalación

1. Instalar [Node.js](https://nodejs.org/en/)
2. Clonar el repositorio:

   `git@github.com:mrodriguezarias/salina.git`

3. Desde la raíz del proyecto ejecutar:

   `npm install`

### Configuración

1. Crear un archivo para la configuración local:

   `cp env/local.env.example env/local.env`

2. Asegurarse de que los valores en `local.env` coincidan con los que se usaron al configurar MongoDB

### Ejecución

1. Desde la raíz del proyecto ejecutar:

   `npm start`

2. Asegurarse de que devuelva el mensaje "Connected to database".

   Para terminar la ejecución se puede apretar `Ctrl+C`.

### Creación del usuario admin

1. Desde la raíz del proyecto ejecutar:

   `npm run script create_admin_user`

2. Asegurarse de que devuelva el mensaje "Created admin user".
