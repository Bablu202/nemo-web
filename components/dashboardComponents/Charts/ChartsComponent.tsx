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
          strokeColor: "#eaeaea11",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: "#eaeaea24",
        },
      },
    },
    title: {
      text: "On each Trip",
      align: "center",
    },
  };

  // Prepare data for Column Chart (Total Price, Total Count, Remaining Amount)
  const columnSeries = [
    {
      name: "Price",
      data: trips.map((trip) =>
        trip.users.reduce((acc, user) => acc + user.price * user.count, 0)
      ),
    },
    {
      name: "Count",
      data: trips.map((trip) =>
        trip.users.reduce((acc, user) => acc + user.count, 0)
      ),
    },
    {
      name: "Balance",
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
        columnWidth: "55%",
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
      text: "Trip amount",
      align: "center",
    },
    colors: ["#AC6AFF", "#FFC43D", "#FE5E41"],
  };

  // Prepare data for Donut Chart (Number of Days for Each Trip)
  const donutSeries = trips.map((trip) => {
    const numberOfDays = Math.ceil(
      (new Date(trip.users[0].return_date).getTime() -
        new Date(trip.users[0].start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return numberOfDays;
  });

  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: trips.map((trip) => trip.trip_name),
    colors: ["#4D9DE0", "#3BB273", "#FE5E41", "#FFC43D", "#AC6AFF"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
    title: {
      text: "Number of Days per Trip",
      align: "center",
    },
  };

  // Prepare data for Line Chart (Number of People for Each Trip)
  const lineSeries = [
    {
      name: "Number of People",
      data: trips.map((trip) => trip.users.length),
    },
  ];

  const lineOptions: ApexOptions = {
    chart: {
      type: "line",
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
    xaxis: {
      categories: trips.map((trip) => trip.trip_name),
    },
    yaxis: {
      title: {
        text: "Number of People",
      },
    },
    title: {
      text: "Number of People per Trip",
      align: "left",
    },
    colors: ["#FFC43D"],
  };

  return (
    <div className="container mt-12 mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Existing Charts */}
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg">
          <ApexCharts
            type="polarArea"
            series={polarAreaSeries}
            options={polarAreaOptions}
            height={350}
          />
        </div>
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg">
          <ApexCharts
            type="bar"
            series={columnSeries}
            options={columnOptions}
            height={350}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 ">
        {/* New Charts */}
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg">
          <ApexCharts
            type="donut"
            series={donutSeries}
            options={donutOptions}
            height={350}
          />
        </div>
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg">
          <ApexCharts
            type="line"
            series={lineSeries}
            options={lineOptions}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsComponent;
