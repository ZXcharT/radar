# OneChart Public

OneChart 的公开静态站点仓库，用于发布板块资金雷达、实时资金页面、宏观图表及其浏览器端公开数据。

## 仓库定位

本仓库只保存可公开部署的静态产物：

- `index.html`：板块资金雷达；
- `realtime.html`：实时资金页面；
- `macro/`：宏观与高切低等公开页面；
- `assets/`：浏览器端静态资源；
- `radar_data/`、JSON 与 JavaScript 数据文件：页面使用的公开数据；
- `radar_manifest.json`：公开数据清单与版本引用。

私有计算逻辑、数据流水线、调度脚本和生产运维配置不在本仓库维护。

## 本地预览

在仓库根目录运行：

```bash
python3 -m http.server 8765
```

然后访问：

```text
http://localhost:8765/index.html
```

macOS 也可运行仓库中的 `preview.command`。

## 修改边界

- 公开数据更新应来自已验证的私有构建链；
- 直接修改只用于明确的公开静态页面问题；
- 数据文件、manifest、指纹文件名和页面引用应保持一致；
- 不提交私有算法、原始数据、凭据、内部路径、日志或运行轨迹；
- 推送、线上发布、域名和 DNS 修改需要单独批准。

参与维护前请先阅读 [`AGENTS.md`](AGENTS.md)。

## 许可证与品牌

本仓库目前没有声明统一的开源许可证。公开访问源码不等于获得复制、修改或再分发授权。OneChart、OneChartLab 名称及其 Logo 的相关权利保留；`assets/brand/` 中的品牌资产不受任何可能单独适用于代码或文档的许可证覆盖，详见 [`TRADEMARKS.md`](TRADEMARKS.md)。
