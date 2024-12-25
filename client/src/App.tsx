import { useEffect, useState } from "react";
import "./App.css";
import { ResponsiveAreaBump, AreaBumpDatum } from "@nivo/bump";
import { ResponsiveBar, BarDatum } from "@nivo/bar";

type EnergySerie = { id: string; data: AreaBumpDatum[] };

interface EnergyInstalledPowerSource {
  name: string;
  data: (number | null)[];
}

interface EnergyInstalledPowerRes {
  time: string[];
  production_types: EnergyInstalledPowerSource[];
}

const energySourcesToCompare = [
  "Nuclear",
  "Fossil brown coal / lignite",
  "Fossil hard coal",
  "Fossil gas",
  "Fossil oil",
  "Other, non-renewable",
  "Hydro",
  "Hydro pumped storage",
  "Battery Storage (Power)",
  // "Battery Storage (Capacity)",
  "Biomass",
  "Wind offshore",
  "Wind onshore",
  // "Wind onshore planned (EEG 2023)",
  "Solar",
  // "Solar planned (EEG 2023)"
];

const fetchData = async (): Promise<EnergyInstalledPowerRes> => {
  const response = await fetch("http://localhost:3173/api/installed_power");
  // const response = await fetch("http://localhost:3173/api/installed_power_hardcoded");
  const result = await response.json();

  return result;
};

const formatResForBar = (res: EnergyInstalledPowerRes): BarDatum[] => {
  const formatedData = res.time.map((year, yearIndex) => {
    const resultObject = Object.fromEntries(
      res.production_types.map((ob) => [ob.name, ob.data[yearIndex]])
    );

    return {
      year: year,
      ...resultObject,
    };
  });

  // TODO move Filter
  // const filterStartYear = 2002;
  // const filterEndYear = 2024;
  const filterEveryWhichYear = 2;

  const filteredData = formatedData
    .slice(0, 24)
    .filter((_, i) => i % filterEveryWhichYear === 0);

  return filteredData;
};

const formatResForAreaBump = (res: EnergyInstalledPowerRes): EnergySerie[] => {
  const formatedData = res.production_types.map((energyProductionType) => {
    return {
      id: energyProductionType.name,
      data: energyProductionType.data.map(
        (usagePercentage, usagePercentageYearIndex) => {
          return {
            x: Number(res.time[usagePercentageYearIndex]),
            y: Number(usagePercentage) || 0,
          };
        }
      ),
    };
  });

  // TODO move Filter
  // const filterStartYear = 2002;
  // const filterEndYear = 2024;
  const filterEveryWhichYear = 2;

  const filteredData = formatedData
    .map((energySource) => ({
      id: energySource.id,
      data: energySource.data
        .slice(0, 24)
        .filter((datum) => datum.x % filterEveryWhichYear === 0),
    }))
    .filter((energySource) => energySourcesToCompare.includes(energySource.id));

  return filteredData;
};

function App() {
  const [chartData, setChartData] = useState<EnergyInstalledPowerRes | null>(
    null
  );
  useEffect(() => {
    fetchData()
      .then((data) => {
        // console.log(data);
        setChartData(data);
      })
      .catch();
  }, []);

  if (!chartData) return null;

  const areaBumpData = formatResForAreaBump(chartData);
  const barData = formatResForBar(chartData);
  // const barKeys = chartData.production_types.map((item) => item.name);

  return (
    <>
      <div className="chartWrapper">
        <ResponsiveAreaBump<AreaBumpDatum, EnergySerie>
          data={areaBumpData}
          margin={{ top: 40, right: 160, bottom: 40, left: 160 }}
          spacing={14}
          colors={{ scheme: "nivo" }}
          blendMode="multiply"
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "Nuclear",
              },
              id: "dots",
            },
            {
              match: {
                id: "Biomass",
              },
              id: "lines",
            },
          ]}
          startLabel={(datum) => datum.id}
          endLabel={(datum) => datum.id}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: -36,
            truncateTickAt: 0,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
        />
      </div>

      <div className="chartWrapper">
        <ResponsiveBar<BarDatum>
          keys={energySourcesToCompare}
          data={barData}
          margin={{ top: 50, right: 180, bottom: 50, left: 60 }}
          indexBy="year"
          padding={0.2}
          labelTextColor="inherit:darker(1.4)"
          valueFormat={(v) => {
            return v.toFixed(0);
          }}
          enableTotals
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Year",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Power",
            legendPosition: "middle",
            legendOffset: -40,
            truncateTickAt: 0,
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}

export default App;
