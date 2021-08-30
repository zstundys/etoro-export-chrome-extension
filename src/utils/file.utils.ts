export class FileUtils {
  /** Adds a date-time suffix to given string */
  static addSuffix(word: string): string {
    const dateSuffix = new Date()
      .toISOString()
      .substr(0, 19)
      .replace(/:/g, ".");
    return `${word}_${dateSuffix}`;
  }

  /** Downloads given matrix to a file */
  static downloadMatrixAsCsv(matrix: string[][], fileName: string): void {
    const csvString = matrix.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodeURI(`data:text/csv;charset=utf-8,${csvString}`)
    );
    link.setAttribute("download", `${FileUtils.addSuffix(fileName)}.csv`);
    document.body.appendChild(link);

    link.click();

    setTimeout(link.remove, 300);
  }
}
