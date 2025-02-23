<template>
  <div class="event-guide">
    <h1>埋点示例</h1>
    <div class="tutorial-section">
      <h2>电商平台：优化购物车流程，提升转化率</h2>
      <p><strong>背景：</strong>某电商平台通过埋点发现，用户在进入购物车后，大量流失在“选择配送方式”环节。</p>
      <p><strong>优化措施：</strong>简化配送方式选择流程，并默认推荐最常用的配送选项。</p>
      <p><strong>效果：</strong>购物车到支付的转化率提升了 <span class="highlight">12%</span>。</p>
    </div>
    <div class="tutorial-section">
      <h2>内容平台：优化推荐算法，增加用户停留时间</h2>
      <p><strong>背景：</strong>某新闻类App通过埋点发现，用户在浏览完一篇文章后，很少点击推荐内容。</p>
      <p><strong>优化措施：</strong>基于用户兴趣优化推荐算法，增加个性化推荐内容的曝光。</p>
      <p><strong>效果：</strong>用户平均停留时间增加了 <span class="highlight">25%</span>，页面浏览量提升了 <span class="highlight">18%</span>。
      </p>
    </div>
    <div class="tutorial-section">
      <h2>SaaS产品：优化注册流程，提高用户留存率</h2>
      <p><strong>背景：</strong>某SaaS公司通过埋点发现，用户在注册过程中，大量流失在“填写公司信息”步骤。</p>
      <p><strong>优化措施：</strong>将“填写公司信息”改为可选步骤，并简化注册流程。</p>
      <p><strong>效果：</strong>注册转化率提升了 <span class="highlight">20%</span>，次日留存率提高了 <span class="highlight">10%</span>。
      </p>
    </div>
    <div class="tutorial-section">
      <h2>社交App：优化分享功能，提升用户活跃度</h2>
      <p><strong>背景：</strong>某社交App通过埋点发现，用户很少使用分享功能。</p>
      <p><strong>优化措施：</strong>在用户生成内容后，增加一键分享提示，并优化分享按钮的视觉设计。</p>
      <p><strong>效果：</strong>分享功能使用率提升了 <span class="highlight">30%</span>，用户活跃度显著提高。</p>
    </div>
    <div class="tutorial-section">
      <h2>在线教育平台：优化课程推荐，提高购买率</h2>
      <p><strong>背景：</strong>某在线教育平台通过埋点发现，用户在浏览课程详情页后，很少点击“购买”按钮。</p>
      <p><strong>优化措施：</strong>在详情页增加用户评价展示，并优化购买按钮的位置和颜色。</p>
      <p><strong>效果：</strong>课程购买率提升了 <span class="highlight">15%</span>。</p>
    </div>
    <div class="tutorial-section">
      <h2>旅游网站：优化搜索功能，提升预订率</h2>
      <p><strong>背景：</strong>某旅游网站通过埋点发现，用户在搜索酒店时，多次修改搜索条件但仍未找到合适结果。</p>
      <p><strong>优化措施：</strong>优化搜索算法，增加智能推荐和筛选功能。</p>
      <p><strong>效果：</strong>酒店预订率提升了 <span class="highlight">18%</span>。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventGuide'
}
</script>

<style scoped>
.event-guide {
  padding: 20px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

h1 {
  text-align: center;
  /* margin-left: 20px; */
  color: #2c3e50;
  margin-bottom: 40px;
}

.tutorial-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.tutorial-section h2 {
  color: #34495e;
  margin-bottom: 10px;
}

.tutorial-section p {
  margin: 10px 0;
}

.tutorial-section p strong {
  color: #2c3e50;
}

.highlight {
  color: #e74c3c;
  font-weight: bold;
}
</style>