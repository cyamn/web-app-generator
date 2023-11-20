import {
  faCheck,
  faCog,
  faFileExport,
  faTable,
  faTools,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const HeroSection = () => {
  return (
    <div className="container mx-auto text-center">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: faCog,
            title: "Configuration based",
            description: "Human readable config file based on JSON",
          },
          {
            icon: faTools,
            title: "WYSIWYG editor",
            description: "Graphical editor for seamless configuration",
          },
          {
            icon: faUsers,
            title: "Permissions",
            description: "Effortless role based permission system",
          },
          {
            icon: faTable,
            title: "Spreadsheets",
            description: "Intuitive table spreadsheet editor",
          },
          {
            icon: faFileExport,
            title: "Open source & data",
            description: "Own your data with export and import options",
          },
          {
            icon: faCheck,
            title: "Functionality focused",
            description:
              "Spend no time on custom designs. Focus on the functionality instead.",
          },
        ].map((feature, index) => (
          <div key={index} className="flex flex-col items-start">
            <FontAwesomeIcon
              className="h-8 w-8 overflow-hidden rounded-lg bg-slate-800 p-2 text-center text-3xl text-slate-100 shadow-lg"
              icon={feature.icon}
            />
            <p className="text-2xl font-semibold">{feature.title}</p>
            <p className="text-left text-lg">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
