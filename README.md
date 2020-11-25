# Salina

Salina es una API REST JSON utilizada como backend para la app SafeOut.

Se puede [instalar y correr localmente](https://github.com/mrodriguezarias/salina/blob/master/INSTALL.md) o bien utilizar el [servidor de producción](https://salina.nixi.icu).

A continuación se documentan todos los modelos y las rutas de la API.

Todas las rutas aceptan únicamente el método POST.

Todas las rutas son privadas excepto las de autenticación.

Las rutas privadas requieren el header `Authorization` con el token de la sesión.

## Modelos

### User

| Atributo | Tipo    | Descripción                        |
| -------- | ------- | ---------------------------------- |
| id       | string  | ID del usuario                     |
| name     | string  | Nombre de usuario (debe ser único) |
| password | string  | Contraseña cifrada                 |
| admin    | boolean | Indica si el usuario es admin      |

Los usuarios admin son los únicos que tienen acceso a la pantalla de bienvenida de los Lugares (la que se le muestra al usuario en la puerta para que pueda hacer check in o check out).

### Location

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| longitude | number | Longitud    |
| latitude  | number | Latitud     |

### Place

| Atributo   | Tipo     | Descripción                                        |
| ---------- | -------- | -------------------------------------------------- |
| id         | string   | ID del lugar                                       |
| name       | string   | Nombre del lugar                                   |
| category   | string   | Categoría (i.e. qué tipo de lugar es)              |
| address    | string   | Dirección del lugar (calle y altura)               |
| location   | Location | Ubicación geográfica del lugar                     |
| capacity   | number   | Suma de las capacidades de las secciones del lugar |
| occupation | number   | Suma de las ocupaciones de las secciones del lugar |

Los lugares son todos dentro de la Ciudad Autónoma de Buenos Aires.

### Section

| Atributo     | Tipo    | Descripción                                |
| ------------ | ------- | ------------------------------------------ |
| id           | string  | ID de la sección                           |
| place        | Place   | ID del lugar al que pertenece la sección   |
| name         | string  | Nombre de la sección                       |
| capacity     | number  | Capacidad máxima permitida para la sección |
| occupation   | number  | Nivel de ocupación actual de la sección    |
| reservations | boolean | Indica si la sección trabaja con reservas  |

## Autenticación

### Registro

Registra un nuevo usuario.

#### Ruta

`/auth/signup`

#### Parámetros

| Nombre   | Tipo   | Requerido | Descripción       |
| -------- | ------ | --------- | ----------------- |
| name     | string | Sí        | Nombre de usuario |
| password | string | Sí        | Contraseña        |

#### Valor de retorno

Retorna un objeto con los siguientes atributos:

| Nombre | Tipo   | Descripción                                  |
| ------ | ------ | -------------------------------------------- |
| user   | User   | Usuario que se registró                      |
| token  | string | Token identificador de la sesión del usuario |

### Inicio de sesión

Inicia la sesión del usuario.

#### Ruta

`/auth/login`

#### Parámetros

| Nombre   | Tipo   | Requerido | Descripción       |
| -------- | ------ | --------- | ----------------- |
| name     | string | Sí        | Nombre de usuario |
| password | string | Sí        | Contraseña        |

#### Valor de retorno

Retorna un objeto con los siguientes atributos:

| Nombre | Tipo   | Descripción                                  |
| ------ | ------ | -------------------------------------------- |
| user   | User   | Usuario que inició sesión                    |
| token  | string | Token identificador de la sesión del usuario |

## Lugares

### Información del lugar

Devuelve todos los datos de un lugar.

### Ruta

`/places/:id`

### Parámetros

#### Parámetros

| Nombre | Tipo   | Requerido | Descripción  |
| ------ | ------ | --------- | ------------ |
| id     | string | Sí        | ID del lugar |

### Valor de retorno

Datos del lugar pasado por parámetro.

### Localización

Muestra todos los lugares dentro de una región.

#### Ruta

`/places/locate`

#### Parámetros

Recibe un objeto `bounds` con los siguientes atributos:

| Nombre    | Tipo     | Requerido | Descripción                             |
| --------- | -------- | --------- | --------------------------------------- |
| northeast | Location | Sí        | Vértice superior derecho de la región   |
| southwest | Location | Sí        | Vértice inferior izquierdo de la región |

#### Valor de retorno

Retorna una lista de objetos `Place` (máximo 50).

Si la distancia entre `northeast` y `southwest` es mayor a tres kilómetros, retorna una lista vacía.

### Búsqueda

Busca lugares por nombre, categoría o dirección.

#### Ruta

`/places/search`

#### Parámetros

| Nombre | Tipo   | Requerido | Valor por defecto | Descripción                  |
| ------ | ------ | --------- | ----------------- | ---------------------------- |
| query  | string | Sí        |                   | Términos de búsqueda         |
| skip   | number | No        | 0                 | Cuántos resultados saltearse |
| limit  | number | No        | 0                 | Cuántos resultados mostrar   |

Si `limit` es 0 o mayor a 50, se muestran como máximo 50 resultados.

#### Valor de retorno

Retorna una lista de objetos `Place`.

## Secciones

### Secciones de un lugar

Devuelve todas las secciones de un lugar.

### Ruta

`/places/:placeId/sections`

### Parámetros

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción  |
| ------- | ------ | --------- | ------------ |
| placeId | string | Sí        | ID del lugar |

### Valor de retorno

Secciones pertenecientes al lugar pasado por parámetro.

## Categorías

### Obtención de la imagen

Devuelve una imagen genérica representativa de la categoría.

#### Ruta

`/categories/:name/image`

#### Método

`GET`

#### Parámetros

| Nombre | Tipo   | Requerido | Descripción            |
| ------ | ------ | --------- | ---------------------- |
| name   | string | Sí        | Nombre de la categoría |

#### Valor de retorno

Archivo de imagen PNG correspondiente a la categoría pasada por parámetro.

## Checkins

### Creación

Crea un nuevo checkin para el usuario con la sesión iniciada.

#### Ruta

`/checkins/add`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción                |
| ------- | ------ | --------- | -------------------------- |
| section | string | Sí        | ID de la sección a acceder |

#### Valor de retorno

Objeto `Checkin` creado.

### Consulta

Muestra el checkin del usuario con la sesión iniciada.

#### Ruta

`/checkins`

#### Valor de retorno

Objeto `Checkin` correspondiente o `null` si el usuario no estaba en ninguna sección.

### Eliminación

Elimina el checkin del usuario con la sesión iniciada.

#### Ruta

`/checkins/remove`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción              |
| ------- | ------ | --------- | ------------------------ |
| section | string | Sí        | ID de la sección a salir |

#### Valor de retorno

Objeto `Checkin` correspondiente.

## Reservas

### Creación

Crea una nueva reserva para el usuario con la sesión iniciada.

Las reservas pueden hacerse con dos semanas de anticipación como máximo.

#### Ruta

`/reservations/add`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción                                      |
| ------- | ------ | --------- | ------------------------------------------------ |
| section | string | Sí        | ID de la sección a reservar                      |
| date    | string | Sí        | Fecha de la reserva en formato ISO 8601 y en UTC |

#### Valor de retorno

Objeto `Reservation` creado.

### Consulta

Muestra las reservas que posee el usuario con la sesión iniciada.

#### Ruta

`/reservations`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción                |
| ------- | ------ | --------- | -------------------------- |
| section | string | No        | ID de la sección reservada |

#### Valor de retorno

Lista de objetos `Reservation`.

### Eliminación

Elimina una reserva del usuario con la sesión iniciada.

#### Ruta

`/reservations/remove/:id`

#### Parámetros

| Nombre | Tipo   | Requerido | Descripción                 |
| ------ | ------ | --------- | --------------------------- |
| id     | string | Sí        | ID de la reserva a eliminar |

#### Valor de retorno

Objeto `Reservation` eliminado.

### Consulta de días

Muestra los próximos días que se puede reservar y qué ocupación tiene cada uno.

#### Ruta

`/reservations/dates`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción                 |
| ------- | ------ | --------- | --------------------------- |
| section | string | Sí        | ID de la sección a reservar |

#### Valor de retorno

Lista de objetos `{date, occupation}` con las fechas posibles para reservar y sus respectivos niveles de ocupación para la sección indicada.

### Consulta de horas

Muestra las próximas horas que se puede reservar y qué ocupación tiene cada una.

#### Ruta

`/reservations/times`

#### Parámetros

| Nombre  | Tipo   | Requerido | Descripción                     |
| ------- | ------ | --------- | ------------------------------- |
| section | string | Sí        | ID de la sección a reservar     |
| date    | string | Sí        | Día a reservar (ISO 8601 y UTC) |

#### Valor de retorno

Lista de objetos `{time, occupation}` con las horas posibles para reservar y sus respectivos niveles de ocupación para la sección y día indicados.
