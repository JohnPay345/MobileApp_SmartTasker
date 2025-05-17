export const replyResult = (result) => {
  switch (result.type) {
    case "result":
      return rep.code(200).send({ code: 200, url: req.url, message: result.result });
    case "errorMsg":
      return rep.code(400).send({ code: 400, url: req.url, message: result.errorMsg });
    default: {
      return rep.code(500).send({ code: 500, url: req.url, message: "An unpredictable error" });
    }
  }
}

export const errorReplyCodes = {
  reply400: async (reasonError = "DEFAULT", errorMessage = "") => {
    const reasonErrorTypes = {
      "INVALID_INPUT": "One or more input parameters are invalid",
      "MISSING_REQUIRED_FIELD": "A required field is missing from the request",
      "UNPROCESSABLE_DATA": "The server could not process the provided data",
      "DEFAULT": "Bad request"
    }
    errorMessage = !errorMessage ? reasonErrorTypes[reasonError] || reasonErrorTypes["DEFAULT"] : errorMessage;
    return rep.code(400).send({ code: 400, url: req.url, message: errorMessage });
  },
  reply401: async (reasonError = "DEFAULT", errorMessage = "") => {
    const reasonErrorTypes = {
      "INVALID_CREDENTIALS": "Invalid username or password",
      "MISSING_TOKEN": "Authorization token is missing",
      "EXPIRED_TOKEN": "Authorization token has expired",
      "DEFAULT": "Unauthorized"
    }
    errorMessage = !errorMessage ? reasonErrorTypes[reasonError] || reasonErrorTypes["DEFAULT"] : errorMessage;
    return rep.code(401).send({ code: 401, url: req.url, message: errorMessage });
  },
  reply403: async (reasonError = "DEFAULT", errorMessage = "") => {
    const reasonErrorTypes = {
      "INSUFFICIENT_PERMISSIONS": "You do not have permission to access this resource",
      "ACCOUNT_DISABLED": "Account is disabled",
      "DEFAULT": "Not access"
    }
    errorMessage = !errorMessage ? reasonErrorTypes[reasonError] || reasonErrorTypes["DEFAULT"] : errorMessage;
    return rep.code(403).send({ code: 403, url: req.url, message: errorMessage });
  },
  reply404: async (reasonError = "DEFAULT", errorMessage = "") => {
    const reasonErrorTypes = {
      "RESOURCE_NOT_FOUND": "Resource not found",
      "ROUTE_NOT_FOUND": "Route not found",
      "DEFAULT": "Not found"
    }
    errorMessage = !errorMessage ? reasonErrorTypes[reasonError] || reasonErrorTypes["DEFAULT"] : errorMessage;
    return rep.code(404).send({ code: 404, url: req.url, message: errorMessage });
  },
  reply500: async (reasonError = "DEFAULT", errorMessage = "") => {
    const reasonErrorTypes = {
      "DATABASE_ERROR": "A database error occurred",
      "THIRD_PARTY_API_ERROR": "Error communicating with a third-party API",
      "DEFAULT": "Bad request"
    }
    errorMessage = !errorMessage ? reasonErrorTypes[reasonError] || reasonErrorTypes["DEFAULT"] : reasonErrorTypes["DEFAULT"];
    return rep.code(500).send({ code: 500, url: req.url, message: errorMessage });
  },
}

export const updateDataInTable = (tableName, data, whereClause, returningColumns) => {
  try {
    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    // Формирование SET-части запроса (для обновления)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];

        if (value === undefined || value === null || (typeof value === 'string' && value === '')) {
          continue;
        }

        if (typeof value === 'object' && value !== null) {
          setClauses.push(`"${key}" = $${paramIndex}`);
          values.push(JSON.stringify(value));
          paramIndex++;
        } else if (value === 'DEFAULT') {
          setClauses.push(`"${key}" = DEFAULT`);
        } else {
          setClauses.push(`"${key}" = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }
    }

    // Формирование WHERE-части запроса (для фильтрации)
    let whereClauses = [];
    for (const key in whereClause) {
      if (whereClause.hasOwnProperty(key)) {
        whereClauses.push(`"${key}" = $${paramIndex}`);
        values.push(whereClause[key]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return { type: "Error", message: 'There is not data to update' };
    }
    if (whereClauses.length === 0) {
      return { type: "Error", message: 'The conditions for updating are not specified' };
    }

    const setString = setClauses.join(', ');
    const whereString = whereClauses.join(' AND ');
    const sql = `
      UPDATE "${tableName}"
      SET ${setString}
      WHERE ${whereString}
    `;

    if (returningColumns && returningColumns.length > 0) {
      const returningString = returningColumns.map(col => `"${col}"`).join(', ');
      sql += ` RETURNING ${returningString}`;
    }
    return { type: "Success", message: sql, values: values };
  } catch (error) {
    console.error('Error at created sql request:', error);
    return { type: "Error", message: "An unpredictable error" };
  }
}