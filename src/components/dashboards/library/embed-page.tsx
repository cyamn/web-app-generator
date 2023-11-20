"use client";

import { faFile } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import React from "react";
import { z } from "zod";

import { PageRenderer } from "@/components/page/page-renderer";
import { api } from "@/utils/api";

import { DashboardBase } from "../definitions/dashboard-base";
import { DashboardContext, UpdateFunction } from "../definitions/types";

const ParameterSchema = z
  .object({
    page: z.string(),
  })
  .strict();

export type Parameters = z.infer<typeof ParameterSchema>;

export default class EmbedPageDashboard extends DashboardBase<Parameters> {
  public render() {
    return <Embed page={this.parameters.page} context={this.context} />;
  }

  public getMetaData() {
    return {
      title: "Embed page",
      icon: faFile,
    };
  }

  public getControls(updateFunction: UpdateFunction<Parameters>) {
    return (
      <Form
        page={this.parameters.page}
        onSetData={updateFunction}
        project={this.context.projectId}
      />
    );
  }

  public getDefaultParameters() {
    return {
      page: "example",
    };
  }

  public static getSchema() {
    return ParameterSchema;
  }
}

type EmbedProperties = {
  page: string;
  context: DashboardContext;
};

const Embed: React.FC<EmbedProperties> = ({ page, context }) => {
  const { data, isLoading, isError } = api.pages.get.useQuery({
    page,
    project: context.projectId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <PageRenderer
      page={data.page}
      project={context.projectId}
      recurse={context.recurse}
    />
  );
};

type FormProperties = {
  project: string;
  page: string;
  onSetData: (data: Parameters) => void;
};

const Form: React.FC<FormProperties> = ({ page, onSetData, project }) => {
  const {
    data: pages,
    error,
    isError,
    isLoading,
  } = api.pages.list.useQuery({ project });
  if (isError) return <div>{error.message}</div>;
  if (isLoading || pages === undefined) return <div>Loading...</div>;
  return (
    <>
      <label
        htmlFor="table"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Select page
      </label>
      <select
        id="table"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        value={page}
        onChange={(event) => {
          onSetData({
            page: event.target.value,
          });
        }}
      >
        {pages.map((page) => (
          <option key={page.name} value={page.name}>
            {page.name}
          </option>
        ))}
      </select>
      <Link href={`/${project}/page/${page}/edit`}> Go to page </Link>
    </>
  );
};
