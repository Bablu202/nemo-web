import React from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TripUser } from "@/types/custom";

interface ChartsComponentProps {
  trips: {
    trip_name: string;
    users: TripUser[];
  }[];
}

const ChartsComponent: React.FC<ChartsComponentProps> = ({ trips }) => {
  // Validate data
  if (!trips || trips.length === 0) return <p>No data available.</p>;

  // Prepare data for PolarArea Chart (Total Price for Each Trip)
  const polarAreaSeries = trips.map((trip) => {
    const totalPrice = trip.users.reduce(
      (acc, user) => acc + user.price * user.count,
      0
    );
    return totalPrice;
  });

  const polarAreaOptions: ApexOptions = {
    chart: {
      type: "polarArea",
    },
    labels: trips.map((trip) => trip.trip_name),
    colors: ["#4D9DE0", "#3BB273", "#FE5E41", "#FFC43D", "#AC6AFF"],
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: "#eaeaea",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: "#eaeaea",
        },
      },
    },
    title: {
      text: "Total Price per Trip",
      align: "center",
    },
  };

  // Prepare data for Column Chart
  const columnSeries = [
    {
      name: "Total Price",
      data: trips.map((trip) =>
        trip.users.reduce((acc, user) => acc + user.price * user.count, 0)
      ),
    },
    {
      name: "Total Count",
      data: trips.map((trip) =>
        trip.users.reduce((acc, user) => acc + user.count, 0)
      ),
    },
    {
      name: "Remaining Amount",
      data: trips.map((trip) =>
        trip.users.reduce((acc, user) => acc + user.remaining_amount, 0)
      ),
    },
  ];

  const columnOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%", // Use columnWidth for bar chart width
        // Removed 'endingShape'
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: trips.map((trip) => trip.trip_name),
      title: {
        text: "Trips",
      },
    },
    yaxis: {
      title: {
        text: "Values",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      floating: true,
    },
    title: {
      text: "Trip Metrics",
      align: "center",
    },
    colors: ["#AC6AFF", "#FFC43D", "#FE5E41"], // Customize colors for each series
  };

  return (
    <div className="container mt-12 mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 w-full">
          <ApexCharts
            type="polarArea"
            series={polarAreaSeries}
            options={polarAreaOptions}
            height={350}
          />
        </div>
        <div className="lg:w-1/2 w-full">
          <ApexCharts
            type="bar"
            series={columnSeries}
            options={columnOptions}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsComponent;
