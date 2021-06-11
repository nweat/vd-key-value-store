# API Description
A simple key-value store with a HTTP API interface that is able to:
1. Accept a key(string) and value(some json blob/string) ```{"key" : "value"}``` and store them. If
an existing key is sent, the value should be updated
2. Accept a key and return the corresponding latest value
3. When given a key AND a timestamp, return whatever the value of the key at the time was.


<br>

## Base URL: https://vd-key-value-store/v1
* All timestamps are unix timestamps according to UTC timezone.

<br>

Samples:
```
Method: POST
Endpoint: /object

Body (application/json): 
{
  "mykey": "value1"
}

Response: 
{
  "key":"mykey", 
  "value":"value1", 
  "timestamp": time //time is timestamp of the post request (6.00pm)
} 
```

```
Method: GET
Endpoint: /object/mykey

Response: 
{
  "value": value1
}
```


```
Method: POST

Endpoint: /object
Body (application/json): 
{
  "mykey": "value2"
}

Response: 
{
  "key":"mykey",
  "value":"value2",
  "timestamp": time //time is timestamp of the post request (6.05pm)
}
```

```
Method: GET
Endpoint: /object/mykey
Response: {
  "value": value2
}
```

```
Method: GET
Endpoint: /object/mykey?timestamp=1440568980 [6.03pm]

Response: 
{
  "value": value1 //still return value1, because value2 was only added at 6.05pm
} 
```

<br>

## Tech Stack
- Express server bootstrapped with express generator

<br>

## Considerations
* Use Swagger API for internal API documentation