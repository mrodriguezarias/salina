# Salina

Salina es una API REST JSON utilizada como backend para la app SafeOut.

Su servidor principal de producción se encuentra en https://salina.nixi.icu.

A continuación se documentan todas las rutas de la API.

Todas las rutas aceptan únicamente el método POST.

Todos las rutas son privadas excepto las de autenticación.

Las rutas privadas requieren el header `Authorization` con el token de la sesión.

## Autenticación

### Registro

Registra un nuevo usuario.

#### Ruta

`/auth/signup`

#### Parámetros

| Nombre   | Tipo   | Requerido | Valor por defecto | Descripción       |
| -------- | ------ | --------- | ----------------- | ----------------- |
| name     | string | Sí        |                   | Nombre de usuario |
| password | string | Sí        |                   | Contraseña        |

#### Valor de retorno

Retorna un objeto con los siguientes atributos:

| Nombre | Tipo   | Descripción                                  |
| ------ | ------ | -------------------------------------------- |
| user   | object | Objeto con todos los datos del usuario       |
| token  | string | Token identificador de la sesión del usuario |

### Inicio de sesión

Inicia la sesión del usuario.

#### Ruta

`/auth/login`

#### Parámetros

| Nombre   | Tipo   | Requerido | Valor por defecto | Descripción       |
| -------- | ------ | --------- | ----------------- | ----------------- |
| name     | string | Sí        |                   | Nombre de usuario |
| password | string | Sí        |                   | Contraseña        |

#### Valor de retorno

Retorna un objeto con los siguientes atributos:

| Nombre | Tipo   | Descripción                                  |
| ------ | ------ | -------------------------------------------- |
| user   | object | Objeto con todos los datos del usuario       |
| token  | string | Token identificador de la sesión del usuario |

## Lugares

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
