import { faVideo } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { z } from "zod";

import { DashboardBase } from "../definitions/dashboard-base";

export default class VideoDashboard extends DashboardBase<VideoDashboardParameters> {
  public render() {
    return (
      <div>
        <iframe
          width="853"
          height="480"
          src={this.parameters.url}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    );
  }

  public getMetaData() {
    return {
      title: "Video",
      icon: faVideo,
    };
  }

  public getDefaultParameters() {
    return VideoDashboardDefaultParameters;
  }

  public static getSchema() {
    return VideoDashboardParameterSchema;
  }
}

export const VideoDashboardParameterSchema = z
  .object({
    url: z.string(),
  })
  .strict();

export type VideoDashboardParameters = z.infer<
  typeof VideoDashboardParameterSchema
>;

export const VideoDashboardDefaultParameters: VideoDashboardParameters = {
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};
