import fs from "fs";

export function savingDataToFile(): [
  (filePath: string, data: string) => void,
  (filePath: string, data: string) => void,
  (filePath: string, stateSetter: (state: any[]) => void) => void
] {
  return [
    (filePath, data) => {
      fs.appendFile(filePath, data, (err) => {
        if (!err) return;
        console.error(err);
      });
    },
    (filePath, data) => {
      fs.writeFile(filePath, data, (err) => {
        if (!err) return;
        console.error(err);
      });
    },
    (filePath, stateSetter) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const stringData = data.toString();
        if (!stringData) {
          stateSetter([]);
          return;
        }

        const parsedData = stringData
          .split("&?&")
          .slice(0, -1)
          .map((item) => JSON.parse(item));
        stateSetter(parsedData);
      });
    },
  ];
}

export function prepareData(array: any[]) {
  return array.map((item) => JSON.stringify(item) + "&?&")
}
