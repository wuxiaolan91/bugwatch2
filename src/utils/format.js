/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象、时间戳或日期字符串
 * @param {string} format 格式化模板，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = "YYYY-MM-DD") {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const formatMap = {
    YYYY: year,
    MM: padZero(month),
    DD: padZero(day),
    HH: padZero(hour),
    mm: padZero(minute),
    ss: padZero(second),
  };

  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match) => formatMap[match]);
}

/**
 * 格式化百分比
 * @param {number} value 需要格式化的数值
 * @param {number} decimals 小数位数，默认1位
 * @param {boolean} withSign 是否显示正负号，默认false
 * @returns {string} 格式化后的百分比字符串
 */
export function formatPercent(value, decimals = 1, withSign = false) {
  if (typeof value !== "number") return "-";

  const num = (value * 100).toFixed(decimals);
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${num}%`;
}

/**
 * 数字补零
 * @param {number} num 需要补零的数字
 * @returns {string} 补零后的字符串
 */
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

/**
 * 格式化数字
 * @param {number} num 需要格式化的数字
 * @param {number} decimals 小数位数，默认0位
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num, decimals = 0) {
  if (typeof num !== "number") return "-";

  return num.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化持续时间
 * @param {number} ms 毫秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
