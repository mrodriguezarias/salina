# Salina

Salina es una API REST JSON utilizada como backend para la app SafeOut.

Su servidor principal de producción se encuentra en https://salina.nixi.icu.

A continuación se documentan todos los modelos y las rutas de la API.

Todas las rutas aceptan únicamente el método POST.

Todos las rutas son privadas excepto las de autenticación.

Las rutas privadas requieren el header `Authorization` con el token de la sesión.

## Modelos

### User

| Atributo | Tipo   | Descripción                        |
| -------- | ------ | ---------------------------------- |
| id       | string | ID del usuario                     |
| name     | string | Nombre de usuario (debe ser único) |
| password | string | Contraseña cifrada                 |

### Location

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| longitude | number | Longitud    |
| latitude  | number | Latitud     |

### Section

| Atributo   | Tipo   | Descripción                                |
| ---------- | ------ | ------------------------------------------ |
| name       | string | Nombre de la sección                       |
| capacity   | number | Capacidad máxima permitida para la sección |
| occupation | number | Nivel de ocupación actual de la sección    |

### Place

| Atributo | Tipo      | Descripción                           |
| -------- | --------- | ------------------------------------- |
| id       | string    | ID del lugar                          |
| name     | string    | Nombre del lugar                      |
| category | string    | Categoría (i.e. qué tipo de lugar es) |
| address  | string    | Dirección del lugar (calle y altura)  |
| location | Location  | Ubicación geográfica del lugar        |
| sections | [Section] | Secciones del lugar                   |

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

Retorna una lista de objetos `Place`.

Si la distancia entre `northeast` y `southwest` es mayor a un kilómetro, retorna una lista vacía.

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
