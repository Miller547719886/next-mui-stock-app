import { create } from 'zustand';
import { StockInfo } from '../api/finmind';

/**
 * 时间范围类型定义
 * 用户可以选择查看不同时间段的数据
 */
export type TimeRangePeriod = 'one_year' | 'three_years' | 'five_years' | 'eight_years';

/**
 * 日期范围接口
 * 用于定义数据查询的起始和结束日期
 */
interface DateRange {
  startDate: string; // 格式: YYYY-MM-DD
  endDate: string;   // 格式: YYYY-MM-DD
}

/**
 * 股票Store接口定义
 * 
 * 对于TanStack Query初学者：
 * 这个Store管理应用的客户端状态（用户选择的股票、时间范围等）
 * 与TanStack Query管理的服务器状态（API数据）配合使用
 */
interface StockStore {
  // === 状态属性 ===
  selectedStockId: string | null;    // 当前选中的股票ID
  selectedStock: StockInfo | null;   // 当前选中的完整股票信息
  timeRangePeriod: TimeRangePeriod;  // 用户选择的时间范围
  dateRange: DateRange;              // 计算出的具体日期范围（用于UI显示）
  cachedTopStocks: StockInfo[];      // 缓存的热门股票列表，避免重复查询
  
  // === 行为方法 ===
  setSelectedStock: (stock: StockInfo | null) => void;  // 设置选中股票
  setTimeRangePeriod: (period: TimeRangePeriod) => void; // 设置时间范围
  setDateRange: (range: DateRange) => void;             // 手动设置日期范围
  getApiDateRange: () => DateRange;                     // 获取API查询用的日期范围
  setCachedTopStocks: (stocks: StockInfo[]) => void;    // 设置缓存的股票列表
}

/**
 * API查询日期范围计算函数
 * 
 * 重要说明：为了计算年增率，我们需要比显示范围多一年的数据
 * 例如：用户选择查看"1年"数据，我们需要获取2年的数据来计算年增率
 * 
 * 对于TanStack Query初学者：
 * 这个函数的返回值会作为API查询的参数，影响缓存key的生成
 */
const getDateRangeByPeriod = (period: TimeRangePeriod): DateRange => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // 获取今天日期 YYYY-MM-DD 格式
  const currentYear = now.getFullYear();
  
  switch (period) {
    case 'one_year':
      // 用户想看1年，API获取2年数据（多1年用于年增率计算）
      return {
        startDate: `${currentYear - 2}-01-01`,
        endDate: todayStr
      };
    case 'three_years':
      // 用户想看3年，API获取4年数据
      return {
        startDate: `${currentYear - 4}-01-01`,
        endDate: todayStr
      };
    case 'five_years':
      // 用户想看5年，API获取6年数据
      return {
        startDate: `${currentYear - 6}-01-01`,
        endDate: todayStr
      };
    case 'eight_years':
      // 用户想看8年，API获取9年数据
      return {
        startDate: `${currentYear - 9}-01-01`,
        endDate: todayStr
      };
    default:
      // 默认返回5年显示范围对应的6年API数据
      return {
        startDate: `${currentYear - 6}-01-01`,
        endDate: todayStr
      };
  }
};

/**
 * 显示日期范围计算函数
 * 
 * 这个函数返回用户实际想看的数据范围，用于：
 * 1. 过滤图表显示的数据
 * 2. 过滤表格显示的数据
 * 3. UI上显示给用户的时间范围信息
 */
export const getDisplayDateRangeByPeriod = (period: TimeRangePeriod): DateRange => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentYear = now.getFullYear();
  
  switch (period) {
    case 'one_year':
      // 显示最近1年的数据
      return {
        startDate: `${currentYear - 1}-01-01`,
        endDate: todayStr
      };
    case 'three_years':
      // 显示最近3年的数据
      return {
        startDate: `${currentYear - 3}-01-01`,
        endDate: todayStr
      };
    case 'five_years':
      // 显示最近5年的数据
      return {
        startDate: `${currentYear - 5}-01-01`,
        endDate: todayStr
      };
    case 'eight_years':
      // 显示最近8年的数据
      return {
        startDate: `${currentYear - 8}-01-01`,
        endDate: todayStr
      };
    default:
      // 默认显示5年数据
      return {
        startDate: `${currentYear - 5}-01-01`,
        endDate: todayStr
      };
  }
};

/**
 * 使用 Zustand 创建股票状态管理Store
 * 
 * 对于TanStack Query初学者的重要概念：
 * 
 * 1. 客户端状态 vs 服务器状态：
 *    - 这个Store管理的是"客户端状态"（用户选择、UI状态等）
 *    - TanStack Query管理"服务器状态"（API数据、加载状态、错误状态等）
 * 
 * 2. 状态协作：
 *    - 当用户改变股票选择或时间范围时，这里的状态改变会触发TanStack Query重新获取数据
 *    - TanStack Query会使用这里的状态作为查询key的一部分
 * 
 * 3. 为什么选择Zustand而非useState：
 *    - 需要跨组件共享状态
 *    - 避免prop drilling
 *    - 状态更新逻辑集中管理
 */
export const useStockStore = create<StockStore>((set, get) => ({
  // === 初始状态 ===
  selectedStockId: null,                              // 初始未选择任何股票
  selectedStock: null,                                // 初始未选择任何股票详情
  timeRangePeriod: 'five_years',                     // 默认显示5年数据
  dateRange: getDisplayDateRangeByPeriod('five_years'), // 计算5年的显示范围
  cachedTopStocks: [],                               // 初始无缓存数据

  // === 状态更新方法 ===
  
  /**
   * 设置选中的股票
   * 同时更新股票ID和完整信息，并重新计算日期范围
   * 
   * TanStack Query相关：这个变化会触发新的API查询
   */
  setSelectedStock: (stock) => set({ 
    selectedStock: stock, 
    selectedStockId: stock?.stock_id || null,
    dateRange: getDisplayDateRangeByPeriod(get().timeRangePeriod)
  }),

  /**
   * 设置时间范围
   * 同时更新时间周期和对应的具体日期范围
   * 
   * TanStack Query相关：这个变化会触发使用新日期范围的API查询
   */
  setTimeRangePeriod: (period) => set({ 
    timeRangePeriod: period,
    dateRange: getDisplayDateRangeByPeriod(period)
  }),

  /**
   * 手动设置日期范围
   * 通常用于特殊情况下的日期范围覆盖
   */
  setDateRange: (range) => set({ dateRange: range }),

  /**
   * 获取API查询用的日期范围
   * 
   * TanStack Query相关：这个方法的返回值用作API查询参数
   * 返回的范围比显示范围大1年，用于年增率计算
   */
  getApiDateRange: () => getDateRangeByPeriod(get().timeRangePeriod),

  /**
   * 设置缓存的热门股票列表
   * 避免重复查询热门股票数据，提升用户体验
   * 
   * TanStack Query相关：这是对TanStack Query缓存的补充
   * 用于在组件间快速共享不经常变化的数据
   */
  setCachedTopStocks: (stocks) => set({ cachedTopStocks: stocks }),
}));