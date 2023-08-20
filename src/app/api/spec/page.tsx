"use client";

import "swagger-ui-react/swagger-ui.css";

import { NextPage } from "next";
import SwaggerUI from "swagger-ui-react";

const Home: NextPage = () => {
  return <SwaggerUI url="http://localhost:3000/api/openapi.json" />;
};

export default Home;
