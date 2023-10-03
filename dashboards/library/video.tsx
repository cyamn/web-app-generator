import { faVideo } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { z } from "zod";

import { UnknownDashboard } from "./unknown";

export default class VideoDashboard extends UnknownDashboard {
  public render() {
    return (
      <div>
        <h1>Video {this.parameters.url}</h1>
      </div>
    );
  }
  public static readonly title = "Video";
  public static readonly icon = faVideo;
  private parameters: VideoDashboardParameters =
    VideoDashboardDefaultParameters;
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
