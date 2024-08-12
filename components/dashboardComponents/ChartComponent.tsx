import React from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { differenceInDays } from "date-fns";

interface TripUser {
  id: string;
  email: string;
  count: number;
  paid_amount: number;
  remaining_amount: number;
  confirmed: boolean;
  refund: boolean;
  price: number;
  start_date: string;
  return_date: string;
}

interface ChartsComponentProps {
  trips: {
    trip_name: string;
    users: TripUser[];
  }[];
}

// Function to calculate the number of days between two dates using date-fns
const calculateNumberOfDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return differenceInDays(end, start);
};

const ChartsComponent: React.FC<ChartsComponentProps> = ({ trips }) => {
  // Prepare data for Polar Area Chart
  const polarAreaSeries = trips.map((trip) => {
    const totalDays = trip.users.reduce(
      (acc, user) =>
        acc + calculateNumberOfDays(user.start_date, user.return_date),
      0
    );
    return totalDays;
  });

  const polarAreaLabels = trips.map((trip) => trip.trip_name);

  // Polar Area Chart options
  const polarAreaOptions: ApexOptions = {
    chart: {
      type: "polarArea",
    },
    labels: polarAreaLabels,
    colors: ["#4D9DE0", "#3BB273", "#FE5E41", "#FFC43D"],
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
    title: {
      text: "Total Days per Trip",
      align: "center",
    },
    dataLabels: {
      enabled: true,
    },
  };

  // Prepare data for Spline Area Chart
  const splineSeries = trips.map((trip) => ({
    name: trip.trip_name,
    data: trip.users.map((user) => ({
      x: user.email,
      y: user.price * user.count,
      z: user.remaining_amount,
    })),
  }));

  // Spline Area Chart options
  const splineOptions: ApexOptions = {
    chart: {
      type: "area",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Price * Count vs Remaining Amount",
      align: "left",
    },
    xaxis: {
      type: "category",
      categories: trips.flatMap((trip) => trip.users.map((user) => user.email)),
    },
    yaxis: [
      {
        title: {
          text: "Price * Count",
        },
      },
      {
        opposite: true,
        title: {
          text: "Remaining Amount",
        },
      },
    ],
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
            type="area"
            series={splineSeries}
            options={splineOptions}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsComponent;
