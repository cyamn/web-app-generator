"use client";

import "swagger-ui-react/swagger-ui.css";

import SwaggerUI from "swagger-ui-react";

const OpenApiPanel: React.FC = () => {
  return (
    <SwaggerUI url="http://localhost:3000/api/openapi.json" filter={true} />
  );
};

export default OpenApiPanel;
