export class Log {
  private static readonly prefix = "%ceToro Exporter";
  private static readonly prefixCss =
    "color: white;background-color:#8bc34a;font-family:sans-serif; border-radius: 2px; padding: 0 4px;text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)";

  static info(...args: any[]) {
    console.log(this.prefix, this.prefixCss, ...args);
  }
}
