class FileUtils {
  /**
   * Adds a date-time suffix to given string
   * @param {string} word
   */
  static addSuffix(word) {
    const dateSuffix = new Date()
      .toISOString()
      .substr(0, 19)
      .replace(/:/g, ".");
    return `${word}_${dateSuffix}`;
  }

  /**
   * Downloads given matrix to a file
   * @param {string[][]} matrix
   * @param {string} fileName
   */
  static downloadMatrixAsCsv(matrix, fileName) {
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
