/**
 * 应用布局配置
 * 
 * 统一管理应用的布局相关常量，便于维护和修改
 */
export const layoutConfig = {
  /**
   * 页面最大宽度
   * 使用MUI的断点规范：'md' 对应 960px
   * 确保在不同屏幕尺寸下有良好的阅读体验
   */
  maxWidth: 'md' as const,
  
  /**
   * 页头高度（像素）
   * 用于计算内容区域的位置和高度
   */
  headerHeight: 80,
  
  /**
   * 页面内边距配置
   * 使用MUI的spacing系统 (1个单位 = 8px)
   */
  padding: {
    top: 10,      // 顶部内边距: 10 * 8px = 80px
    bottom: 3,    // 底部内边距: 3 * 8px = 24px
    sides: 3      // 左右内边距: 3 * 8px = 24px
  }
} as const; // as const 确保类型推断为字面量类型而非string

/**
 * API相关配置
 * 
 * 对于TanStack Query初学者：
 * 这些配置会影响所有API请求，包括TanStack Query的查询行为
 * 修改这些值会影响缓存key和请求超时等行为
 */
export const apiConfig = {
  /**
   * FinMind API 基础URL
   * FinMind是台湾金融数据提供商，提供股票、财报等数据
   * 所有API请求都会以这个URL为前缀
   */
  finmindBaseUrl: 'https://api.finmindtrade.com/api/v4',
  
  /**
   * API请求默认超时时间（毫秒）
   * 10秒超时适合金融数据查询，既不会太快导致请求失败，也不会让用户等太久
   * 
   * TanStack Query相关：这个值会影响查询的超时行为
   */
  defaultTimeout: 10000,
  
  /**
   * API数据集名称配置
   * FinMind API使用数据集名称来区分不同类型的数据
   * 
   * TanStack Query相关：这些值会用作查询key的一部分，影响缓存策略
   */
  datasets: {
    /**
     * 台湾股票基本信息数据集
     * 包含股票代码、名称、行业分类等信息
     */
    stockInfo: 'TaiwanStockInfo',
    
    /**
     * 台湾股票月营收数据集
     * 包含各公司每月的营收数据，用于制作图表和计算年增率
     */
    monthlyRevenue: 'TaiwanStockMonthRevenue'
  }
} as const; // as const 确保配置为只读，避免意外修改