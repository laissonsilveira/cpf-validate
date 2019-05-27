define({ "api": [
  {
    "type": "post",
    "url": "http://localhost:3000/cpf-validate/auth/login",
    "title": "Autenticação",
    "description": "Authenticação do usuário",
    "name": "login",
    "group": "Auth",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST \\\n  'http://localhost:3000/cpf-validate/auth/login' \\\n    -H 'Content-Type: application/json' \\\n    -d '{\n    \t\"username\": \"usuario\",\n    \t\"password\": \"senha\"\n    }'",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "Usuário de acesso"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "Senha de acesso"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"username\": \"usuario\",\n\t\"password\": \"senha\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "Token de acesso do usuário"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"token\": \"sjdlasjlsdjpweorpw....\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "Usuário/Senha incorreto"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"Usuário ou Senha incorreta\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "http://localhost:3000/cpf-validate/blacklist",
    "title": "Remove CPF",
    "description": "Remove CPF da lista",
    "name": "DeleteCPF",
    "group": "Blacklist",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE \\\n  'http://localhost:3000/cpf-validate/blacklist/05523549983' \\\n  -H 'Authorization: Bearer skdlkjlkje....'",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/blacklist.js",
    "groupTitle": "Blacklist"
  },
  {
    "type": "get",
    "url": "http://localhost:3000/cpf-validate/blacklist",
    "title": "Consulta CPF",
    "description": "Consulta CPF na lista",
    "name": "GetCPF",
    "group": "Blacklist",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET 'https://localhost/cpf-validate/blacklist?cpf=05523549983' \\\n    -H 'Authorization: Bearer skdlkjlkje....'",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cpf",
            "description": "Número do CPF (Com ou sem separadores)"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "Indica se o CPF está cadastrado (FREE=não/BLOCK=sim)"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n status: 'FREE'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "Mensagem de erro"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "CPF não numérico",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF não é numérico.\"\n}",
          "type": "json"
        },
        {
          "title": "CPF inválido",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF é inválido.\"\n}",
          "type": "json"
        },
        {
          "title": "CPF não informado",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF não foi informado.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/blacklist.js",
    "groupTitle": "Blacklist"
  },
  {
    "type": "post",
    "url": "http://localhost:3000/cpf-validate/blacklist",
    "title": "Adiciona CPF",
    "description": "Adiciona CPF na lista",
    "name": "PostCPF",
    "group": "Blacklist",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST \\\n  'http://localhost:3000/cpf-validate/blacklist' \\\n  -H 'Authorization: Bearer skdlkjlkje....'\n  -d '{\n     \t\"cpf\": \"05523549983\",\n     }'",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "Mensagem de erro"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "CPF existente",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número de CPF já existe.\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "CPF não numérico",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF não é numérico.\"\n}",
          "type": "json"
        },
        {
          "title": "CPF inválido",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF é inválido.\"\n}",
          "type": "json"
        },
        {
          "title": "CPF não informado",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"O número do CPF não foi informado.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/blacklist.js",
    "groupTitle": "Blacklist"
  },
  {
    "type": "get",
    "url": "http://localhost:3000/cpf-validate/suporte/status",
    "title": "Status",
    "description": "Informa o status do serviço cpf-validate",
    "name": "status",
    "group": "Index",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET 'http://localhost:3000/cpf-validatez/suporte/status'\\\n-H 'Authorization: Basic YWRtaW46YWRtaW5wd2Q='",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "totalQueryCPF",
            "description": "Quantidade de vezes que foi feita uma consulta de CPF após o servidor ser reiniciado"
          },
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "blacklistSize",
            "description": "Quantidade de CPFs na blacklist"
          },
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "pid",
            "description": "ID do processo que está rodando o servidor"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "nodeVersion",
            "description": "Versão do node"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "uptime",
            "description": "Tempo em que o serviço está em execução (segundos)"
          },
          {
            "group": "Success",
            "type": "Object",
            "optional": false,
            "field": "memoryUsage",
            "description": "Dados de uso de memória do serviço"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "memoryUsage.rss",
            "description": "Tamanho do conjunto"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "memoryUsage.heapTotal",
            "description": "Tamanho total do heap"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "memoryUsage.heapUsed",
            "description": "Heap realmente usado"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n     \"totalQueryCPF\": 3,\n     \"blacklistSize\": 10,\n     \"pid\": 13760,\n     \"nodeVersion\": \"8.16.0\",\n     \"uptime\": \"3 seconds\",\n     \"memoryUsage\": {\n         \"rss\": \"50.72 MB\",\n         \"heapTotal\": \"24.13 MB\",\n         \"heapUsed\": \"14.39 MB\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/support.js",
    "groupTitle": "Index"
  },
  {
    "type": "get",
    "url": "http://localhost:3000/cpf-validate/users",
    "title": "Lista Usuários",
    "description": "Lista os usuários",
    "name": "GetUsers",
    "group": "User",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET 'http://localhost:3000/cpf-validate/users' \\\n  -H 'Authorization: Bearer CJstk7cypEDwaFW4...' \\",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "Identificador único do cliente"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "Nome do usuário"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "createdAt",
            "description": "Data de criação do usuário"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n      \"id\": \"5cdb4ee81fe76800228cfa5b\"\n      \"name\": \"laisson\",\n      \"createdAt\": \"2019-05-14T23:27:36.705Z\",\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "http://localhost:3000/cpf-validate/users/:id",
    "title": "Busca Usuário",
    "description": "Busca usuário pelo ID",
    "name": "GetUsersID",
    "group": "User",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET 'http://localhost:3000/cpf-validate/users/5cdb4ee81fe76800228cfa5b' \\\n  -H 'Authorization: Bearer CJstk7cypEDwaFW4...'",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "Identificador único do cliente"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "Identificador único do cliente"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "Nome do usuário"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "createdAt",
            "description": "Data de criação do usuário"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"_id\": \"5cdb4ee81fe76800228cfa5b\"\n    \"name\": \"laisson\",\n    \"createdAt\": \"2019-05-14T23:27:36.705Z\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "ID inválido"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"ID do usuário (5ce899508f8d4d5f929c11a) inválido\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "http://localhost:3000/cpf-validate/users",
    "title": "Adiciona Usuário",
    "description": "Adiciona um novo usuário",
    "name": "PostUsers",
    "group": "User",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST \\\n  'http://localhost:3000/cpf-validate/users' \\\n  -H 'Authorization: Bearer CJstk7cypEDwaFW4...' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n        \"name\": \"Um novo usuário\",\n        \"username\": \"novo usuário\",\n        \"password\": \"senhaTeste\",\n      }'",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "Nome do usuário"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "Login de usuário"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "Senha do suário"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   \"name\": \"Um novo usuário\"\n   \"username\": \"novo usuário\",\n   \"password\": \"senhaTeste\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "Usuário/Senha incorreto"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"message\": \"Já existe um usuário com este nome.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "/home/laissonsilveira/Documents/Sem_backup/cpf-validate/src/routes/users.js",
    "groupTitle": "User"
  }
] });
