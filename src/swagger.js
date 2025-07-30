export function getSwaggerHTML() {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resona API 文档</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/v1/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: "StandaloneLayout",
                docExpansion: "list",
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    if (!request.headers['Cookie']) {
                        request.headers['Cookie'] = 'device_id=test-device-id-' + Date.now();
                    }
                    return request;
                }
            });
        };
    </script>
</body>
</html>
`;
}

export function getSwaggerJSON() {
  return {
    "openapi": "3.0.0",
    "info": {
      "title": "Resona 共鸣交换所 API",
      "description": "匿名情绪共鸣平台的后端 API 接口文档",
      "version": "1.0.0",
      "contact": {
        "name": "Resona Team",
        "email": "7920a9c2@gmail.com"
      }
    },
    "servers": [
      {
        "url": "http://localhost:8787",
        "description": "本地开发环境"
      },
      {
        "url": "https://your-worker.your-subdomain.workers.dev",
        "description": "生产环境"
      }
    ],
    "tags": [
      {
        "name": "共鸣",
        "description": "情绪共鸣相关接口"
      },
      {
        "name": "收藏",
        "description": "收藏管理相关接口"
      },
      {
        "name": "系统",
        "description": "系统状态和配置接口"
      },
      {
        "name": "情绪管理",
        "description": "情绪类型管理相关接口"
      }
    ],
    "paths": {
      "/api/v1/submit": {
        "post": {
          "tags": ["共鸣"],
          "summary": "提交句子获取共鸣",
          "description": "用户提交一句话，系统分析情绪并返回共鸣回应（50-200字）",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["text"],
                  "properties": {
                    "text": {
                      "type": "string",
                      "description": "用户输入的文本",
                      "maxLength": 200,
                      "example": "我今天很难过"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "成功获取共鸣",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "reflection": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer",
                                "description": "共鸣ID",
                                "example": 123
                              },
                              "text": {
                                "type": "string",
                                "description": "共鸣文本",
                                "example": "我理解你的难过，一切都会好起来的"
                              },
                              "emotion": {
                                "type": "string",
                                "description": "情绪标签",
                                "example": "sad"
                              },
                              "is_generated": {
                                "type": "boolean",
                                "description": "是否AI生成",
                                "example": false
                              }
                            }
                          },
                          "submission": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer",
                                "description": "提交ID",
                                "example": 456
                              },
                              "emotion": {
                                "type": "string",
                                "description": "识别的情绪",
                                "example": "sad"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "429": {
              "description": "请求过于频繁",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "请求过于频繁，请稍后再试"
                      },
                      "retryAfter": {
                        "type": "integer",
                        "description": "重试等待时间（秒）",
                        "example": 60
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/collect": {
        "post": {
          "tags": ["收藏"],
          "summary": "收藏共鸣",
          "description": "收藏一条共鸣回应",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["reflection_id"],
                  "properties": {
                    "reflection_id": {
                      "type": "integer",
                      "description": "共鸣ID",
                      "example": 123
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "收藏成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "collection_id": {
                            "type": "integer",
                            "description": "收藏ID",
                            "example": 789
                          },
                          "message": {
                            "type": "string",
                            "example": "收藏成功"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误或收藏数量已达上限",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "409": {
              "description": "已经收藏过这条共鸣",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        "delete": {
          "tags": ["收藏"],
          "summary": "删除收藏",
          "description": "删除一条收藏记录",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["collection_id"],
                  "properties": {
                    "collection_id": {
                      "type": "integer",
                      "description": "收藏ID",
                      "example": 789
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "删除成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "message": {
                            "type": "string",
                            "example": "删除成功"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "收藏记录不存在",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/collections": {
        "get": {
          "tags": ["收藏"],
          "summary": "获取收藏列表",
          "description": "分页获取用户的收藏列表",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "description": "页码，从1开始",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 1,
                "minimum": 1
              }
            },
            {
              "name": "limit",
              "in": "query",
              "description": "每页数量",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 10,
                "minimum": 1,
                "maximum": 50
              }
            }
          ],
          "responses": {
            "200": {
              "description": "成功获取收藏列表",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "collections": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "collection_id": {
                                  "type": "integer",
                                  "description": "收藏ID",
                                  "example": 789
                                },
                                "collected_at": {
                                  "type": "string",
                                  "format": "date-time",
                                  "description": "收藏时间",
                                  "example": "2024-01-01T12:00:00Z"
                                },
                                "reflection": {
                                  "type": "object",
                                  "properties": {
                                    "id": {
                                      "type": "integer",
                                      "description": "共鸣ID",
                                      "example": 123
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "共鸣文本",
                                      "example": "我理解你的难过，一切都会好起来的"
                                    },
                                    "emotion": {
                                      "type": "string",
                                      "description": "情绪标签",
                                      "example": "sad"
                                    },
                                    "is_generated": {
                                      "type": "boolean",
                                      "description": "是否AI生成",
                                      "example": false
                                    },
                                    "created_at": {
                                      "type": "string",
                                      "format": "date-time",
                                      "description": "共鸣创建时间",
                                      "example": "2024-01-01T10:00:00Z"
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "pagination": {
                            "type": "object",
                            "properties": {
                              "page": {
                                "type": "integer",
                                "description": "当前页码",
                                "example": 1
                              },
                              "limit": {
                                "type": "integer",
                                "description": "每页数量",
                                "example": 10
                              },
                              "total": {
                                "type": "integer",
                                "description": "总数量",
                                "example": 25
                              },
                              "has_more": {
                                "type": "boolean",
                                "description": "是否有更多数据",
                                "example": true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "分页参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/health": {
        "get": {
          "tags": ["系统"],
          "summary": "健康检查",
          "description": "检查服务状态和AI配置",
          "responses": {
            "200": {
              "description": "服务正常",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "ok"
                      },
                      "timestamp": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2024-01-01T12:00:00Z"
                      },
                      "ai_config": {
                        "type": "object",
                        "properties": {
                          "services": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "example": "OpenAI"
                                },
                                "url": {
                                  "type": "string",
                                  "example": "https://api.openai.com/v1"
                                },
                                "model": {
                                  "type": "string",
                                  "example": "gpt-3.5-turbo"
                                },
                                "configured": {
                                  "type": "boolean",
                                  "example": true
                                }
                              }
                            }
                          },
                          "total_services": {
                            "type": "integer",
                            "description": "可用服务数量",
                            "example": 1
                          },
                          "primary_service": {
                            "type": "string",
                            "description": "主要服务名称",
                            "example": "OpenAI"
                          },
                          "primary_model": {
                            "type": "string",
                            "description": "主要服务模型",
                            "example": "gpt-3.5-turbo"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/config": {
        "get": {
          "tags": ["系统"],
          "summary": "获取配置详情",
          "description": "获取详细的系统配置信息",
          "responses": {
            "200": {
              "description": "成功获取配置",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "config": {
                            "type": "object",
                            "properties": {
                              "valid": {
                                "type": "boolean",
                                "description": "配置是否有效",
                                "example": true
                              },
                              "errors": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "配置错误列表",
                                "example": []
                              },
                              "warnings": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "配置警告列表",
                                "example": []
                              }
                            }
                          },
                          "services": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "example": "OpenAI"
                                },
                                "url": {
                                  "type": "string",
                                  "example": "https://api.openai.com/v1"
                                },
                                "model": {
                                  "type": "string",
                                  "example": "gpt-3.5-turbo"
                                },
                                "priority": {
                                  "type": "integer",
                                  "description": "服务优先级",
                                  "example": 1
                                },
                                "is_primary": {
                                  "type": "boolean",
                                  "description": "是否为主要服务",
                                  "example": true
                                }
                              }
                            }
                          },
                          "environment": {
                            "type": "string",
                            "description": "运行环境",
                            "example": "development"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": ["系统"],
          "summary": "更新配置",
          "description": "更新系统的配置信息",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["config"],
                  "properties": {
                    "config": {
                      "type": "object",
                      "description": "要更新的配置对象",
                      "example": {
                        "valid": true,
                        "errors": [],
                        "warnings": []
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "配置更新成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "message": {
                            "type": "string",
                            "example": "配置更新成功"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/emotions": {
        "get": {
          "tags": ["情绪管理"],
          "summary": "获取情绪列表",
          "description": "获取所有可用的情绪类型，包括基础情绪和动态情绪",
          "responses": {
            "200": {
              "description": "成功获取情绪列表",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "emotions": {
                            "type": "object",
                            "description": "情绪字典，键为情绪标识，值为情绪信息"
                          },
                          "total_count": {
                            "type": "integer",
                            "description": "情绪总数",
                            "example": 50
                          },
                          "base_count": {
                            "type": "integer",
                            "description": "基础情绪数量",
                            "example": 50
                          },
                          "dynamic_count": {
                            "type": "integer",
                            "description": "动态情绪数量",
                            "example": 0
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": ["情绪管理"],
          "summary": "添加动态情绪",
          "description": "动态添加新的情绪类型",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["emotion_key", "name"],
                  "properties": {
                    "emotion_key": {
                      "type": "string",
                      "description": "情绪标识符",
                      "example": "melancholy"
                    },
                    "name": {
                      "type": "string",
                      "description": "情绪中文名称",
                      "example": "忧郁"
                    },
                    "keywords": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "关键词列表",
                      "example": ["忧郁", "伤感", "低沉"]
                    },
                    "description": {
                      "type": "string",
                      "description": "情绪描述",
                      "example": "一种深沉的悲伤情绪"
                    },
                    "intensity": {
                      "type": "string",
                      "enum": ["low", "medium", "high"],
                      "description": "情绪强度",
                      "example": "medium"
                    },
                    "category": {
                      "type": "string",
                      "description": "情绪分类",
                      "example": "negative"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "动态情绪添加成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "emotion_key": {
                            "type": "string",
                            "example": "melancholy"
                          },
                          "name": {
                            "type": "string",
                            "example": "忧郁"
                          },
                          "message": {
                            "type": "string",
                            "example": "动态情绪添加成功"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "409": {
              "description": "情绪已存在",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "error": {
              "type": "string",
              "description": "错误信息",
              "example": "请求参数错误"
            }
          }
        }
      },
      "securitySchemes": {
        "deviceId": {
          "type": "apiKey",
          "in": "cookie",
          "name": "device_id",
          "description": "设备ID Cookie，用于匿名用户识别"
        }
      }
    },
    "security": [
      {
        "deviceId": []
      }
    ]
  };
} 