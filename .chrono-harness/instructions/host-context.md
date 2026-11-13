本仓是 chrono-harness 的 mix 接入样例。源文件、项目、测试和依赖全部显式登记于 .chrono-harness/FILEMAP.json 与 projects.json；目录位置没有推断权威。

本地与 CI 的唯一检测入口见 README.md。当前采用 chrono-ci-check/v3 scoped profile 与显式独立单元；其通过不代表完整七判官、完整工具链输入闭包或本地/CI 环境等价。生产项目每个都有独立测试项目，mix 中的独立脚本也有独立测试。宿主方法由 chrono-instructions 生成，AGENTS.md 是 CLAUDE.md 的相对链接。

单元、测试归属、启动 SDK 与独立 job 显式登记在 `.chrono-harness/ci/check.json`、`units.json` 和 `bootstrap.json`。本地与 CI 都用 `check --unit ID`；收齐同一 DELTA 的原始结果后用 无值的 `check --collect`。共享 checkout 并发未提供锁，使用独立 checkout。


本轮采用固定测试版 v0.1.4-dev.43341524786.1.gf5c541e2a5cbfa2ca78760f55730fac9922717b7，源码 f5c541e2a5cbfa2ca78760f55730fac9922717b7。生成的 install.sh 安装所选工具，bootstrap.py 保留宿主 SDK profile。根 schema4 的 canonical_check 选择本地／CI 输入，普通检查为 `.chrono-harness/bin/chrono-harness check`，仅按需追加 `--unit ID`／无值 `--collect`。CI 使用 provider v4 的同一父 workflow、DELTA detector 和独立条件 job。旧单元 workflow 的调用方已迁到父 workflow。按当前 manifest 的中文选择生成指南；业务项目及专属测试沿用各自登记。

本轮规则、CI 与安装链迁移先经 feature → integration 的真实 PR 验收，再交付 integration → dev。下游尚未开放自动合并，使用现有权限启用已返回 403，不申请额外权限。等待当前 head 的适用 CI 全部通过后，匹配 head 按现有保护合并，再核实际落地 SHA 和 CI；不新增人工确认关卡。
