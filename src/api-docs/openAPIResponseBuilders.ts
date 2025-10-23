export const userResponses = {
  "200": {
    description: "List of users",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: { $ref: "#/components/schemas/User" },
        },
      },
    },
  },
  "201": {
    description: "User created successfully",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/User" },
      },
    },
  },
};

export const healthResponses = {
  "200": {
    description: "OK",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
          },
        },
      },
    },
  },
};
