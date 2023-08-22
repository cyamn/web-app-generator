"use client";

import "swagger-ui-react/swagger-ui.css";

import SwaggerUI from "swagger-ui-react";

const OpenApiPanel: React.FC = () => {
  const backendURL = process.env.NEXT_URL ?? "";
  return <SwaggerUI url={`${backendURL}/api/openapi.json`} filter={true} />;
};

export default OpenApiPanel;
