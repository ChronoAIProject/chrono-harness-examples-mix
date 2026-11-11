# chrono-harness-examples-mix

可实际运行的宿主接入样例，用不同语言和目录检验显式登记、DELTA 选测和统一入口。

`backend/calc/` 是 Go 库，`checks/go-contract/` 是独立 Go 测试；`client/view/` 是 TS 库，`checks/ui/` 是独立测试；`jobs/normalize.py` 与 `checks/scripts/normalize_test.py` 是独立脚本及其测试。`contracts/invoice.json` 显式连接 Go 和 TS 两个消费者。

## 运行

需要 Git、Python ≥3.9、curl 和可下载固定发布/SDK 的网络。harness 使用 [chrono-harness v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c](https://github.com/ChronoAIProject/chrono-harness/releases/tag/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c) 的预构建二进制；`.chrono-harness/distribution.json` 锁定发布清单、平台与摘要，生成的 `install.sh` 执行统一安装。宿主不保留 harness 源码包，不需要 Rust。宿主 Go/Node/TypeScript SDK 独立登记在 bootstrap.json，支持 macOS arm64、Linux x86_64。

```sh
python3 .chrono-harness/bootstrap.py . --profile rates
.chrono-harness/bin/chrono-harness check --unit rates
```

候选必须是当前干净提交。schema4 的 `canonical_check` 选择本地／CI 输入，普通完整检查只运行 `.chrono-harness/bin/chrono-harness check`，不手传基线、候选或配置。单元追加 `--unit ID`，汇总追加无值 `--collect`；CI 设置 `CHRONO_CHECK_SOURCE=ci`。相同命令不证明完整环境相同。

## 独立单元与汇总

`.chrono-harness/ci/units.json` 是 CI 的唯一生成源。父 workflow 按显式登记检测 DELTA，再执行选中的独立 job；SDK profile、checkout、报告和重跑边界分别登记，不按语言或目录猜测。业务输入、测试计划和 SDK 选择保持原合同。

| 单元 ID | 完整测试计划 | 当前 workflow |
|---|---|---|
| `rates` | `test:rates-tests` | `.github/workflows/chrono-ci.yml` |
| `labels` | `test:labels-tests` | `.github/workflows/chrono-ci.yml` |
| `normalize` | `test:normalize-tests` | `.github/workflows/chrono-ci.yml` |
| `harness` | `test:bootstrap-tests` | `.github/workflows/chrono-ci.yml` |

`chrono / collection` 在原生 needs 完成后收集同一候选、事件和基线的原始报告，然后调用相同的短命令汇总：

```sh
python3 .chrono-harness/bootstrap.py . --profile collection
.chrono-harness/bin/chrono-harness check --collect
```

汇总不重跑业务测试。缺失、重复、陈旧、失败或绑定不一致的原件须失败。上传显式包括隐藏的 `.chrono-harness/state/`；未选中的单元只表示本次 DELTA 不需运行其测试。独立 job 互不取消，恢复沿原 workflow 的失败作业重跑入口，不另造轮询器。

## 登记与验收

- `backend/calc/rate.go` → `test:rates-tests`；`client/view/label.mts` → `test:labels-tests`；`contracts/invoice.json` → 两者；`jobs/normalize.py` → `test:normalize-tests`。
- README.md 修改 → 不运行产品测试；未登记文件 → 失败；实际测试非零 → harness 非零。
- 项目配对、命令参数和依赖均在 `.chrono-harness/` 登记；不从扩展名、import、module 或目录推断选测。
- `CLAUDE.md` 由原子规则生成；`AGENTS.md` 是其相对符号链接。修改指令源后运行 `.chrono-harness/bin/chrono-instructions generate --host-root .`。
- CI 修改入口是 `.chrono-harness/ci/units.json`；运行 `.chrono-harness/bin/chrono-ci generate --host-root . --config .chrono-harness/ci/units.json`。受管工作流由 `chrono-ci verify` 检查。PR 覆盖 dev 与 integration/**，检查固定合并候选；dev push 以事件 before/after 验真实落地变化。

## 当前边界

本仓运行现役 `chrono-ci-check/v3` scoped profile，验证实际命令、显式选测、干净快照和退出结果。它不冒充完整七判官治理，不证明工具链输入闭包完整或测试依赖无遗漏。该版本的通用 projects 判官已允许省略 manifest/lock/root 并接受任意显式 action；语言专属检查由可选适配器承载。本仓完整治理的接入仍未完成。

本地与 CI 通过相同 bootstrap 从公开 Release 校验安装；不需要跨仓凭据。安装结果见 `.chrono-harness/state/distribution.json`，语言 SDK 版本另见 `bootstrap-result.json`。成本暂未测量，登记为 unknown。

[主库与示例索引](https://github.com/ChronoAIProject/chrono-harness/blob/dev/docs/examples.md) 列出 Go、TS 和混合语言宿主。

## Registered worktrees

The pinned release also installs `chrono-worktree`. The host policy is
`.chrono-harness/worktree.json`; shared registries explicitly declare `dev`,
`feature/`, `integration/`, file ownership and artifacts. Project and FILEMAP
registrations have one owner; directory names and languages do not select work.

The pinned release supports the adopted v2 policy. Successful creation
or reconstruction publishes the finalized original report and
`.chrono-harness/state/origin.json` in the new destination. Both branch kinds use
the `integration` check role; local context and collection manifest paths are
`.chrono-harness/state/local/context.json` and
`.chrono-harness/state/collection/manifest.json`. The source and fetched target
`dev` must carry the same committed policy before starting a lane. Existing lanes
without an origin receipt need reconstruction from an adopted source; no origin
evidence is synthesized. Full governance requires separate full-host activation; schema4 short commands select this host’s scoped profile.

```sh
.chrono-harness/bin/chrono-worktree start --host-root . --config .chrono-harness/worktree.json --kind feature --name change --path ../my-change
```

The destination must not exist. `reconstruct` uses the same arguments plus
`--plan .chrono-harness/state/reconstruction.json`, with explicit fixed base and
candidate OIDs and a complete carry/retire path list. See the
[worktree contract](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/worktree.md).
Creation/reconstruction records actual Git results and preserves old work;
reconstruction stages changes and requires a new commit and the canonical check.
PR creation and merge remain caller-owned. Shared full-governance
registries are proposed; worktree use does not activate them or establish full
input closure, freshness certification or deterministic local/CI parity.

## Registered maintenance

The same installed `chrono-worktree` consumes explicit maintenance plans under
`.chrono-harness/state/` with the registered `.chrono-harness/worktree.json`:

```sh
.chrono-harness/bin/chrono-worktree recover --host-root . --config .chrono-harness/worktree.json --plan .chrono-harness/state/recover.json
.chrono-harness/bin/chrono-worktree cleanup --host-root . --config .chrono-harness/worktree.json --plan .chrono-harness/state/cleanup.json
.chrono-harness/bin/chrono-worktree cleanup-fetch --host-root . --config .chrono-harness/worktree.json --plan .chrono-harness/state/cleanup-fetch.json
```

Recovery validates the original failure, reconciled HEAD/index and owned lock;
staged changes still need a candidate commit and the canonical check. Cleanup
requires an explicit retained branch/commit and selected disposable artifacts.
Fetch-ref cleanup requires its original failed receipt and a fixed local branch
preserving the expected commit. Reports retain failures and distinguish verified
removal from unverified partial effects. See the pinned
[maintenance contract](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/worktree.md#registered-recovery-and-cleanup)
for complete plan formats. Lost recovery identity, damaged Git metadata and
PR/merge orchestration remain separate obligations.


## Interrupted operations

The installed tool writes separate immutable intents before checkout/lock effects
and before fetching. After establishing that the original process stopped, supply
an explicit intent digest and original-result presence/digest to:

```sh
.chrono-harness/bin/chrono-worktree recover-interrupted --host-root . --config .chrono-harness/worktree.json --plan .chrono-harness/state/interrupted-checkout.json
.chrono-harness/bin/chrono-worktree cleanup-fetch-interrupted --host-root . --config .chrono-harness/worktree.json --plan .chrono-harness/state/interrupted-fetch.json
```

Checkout recovery also requires the reconciled HEAD/index tree. Fetch cleanup
requires the expected current OID and a local branch retaining it; an already
absent ref needs an explicit retry plan. Both preserve the original bytes and
keep the original outcome unknown; terminal reports use ordinary maintenance.
See the pinned [interruption contracts](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/worktree.md#interrupted-checkout-recovery).
These commands do not reconstruct a lost index, make concurrent writers atomic,
or certify full governance or deterministic parity.

The pinned release also provides optional explicitly bound Git readers. This host keeps its registered scoped profile; adopting new binaries does not implicitly change the Git-binding or governance policy. See the pinned [Git facts contract](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/git-facts.md).

## CI projections and remote retirement

The pinned binaries also provide explicit release-workflow generation and full-context CI transport. This host retains its registered scoped profile; installing binaries does not activate full governance. See the pinned [release CI](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/release-ci.md) and [full context CI](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/full-ci.md) contracts.

`chrono-worktree cleanup-remote` consumes an explicit state plan with the expected remote URL, work-branch OID and retained target commit. It performs exact leased deletion, verifies absence and preserves original failures; this is not an atomic remote transaction or a PR/merge verdict. See [remote retirement](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/worktree.md#remote-branch-retirement).

## Literal checkout and metadata recovery

The pinned binaries compare registered Git-tree/index identities with physical bytes, file types and owner executable bits. Git configuration cannot silently normalize changed inputs for this comparison; checkouts must materialize the registered exact bytes.

`chrono-worktree inspect-rebind` and `rebind` use an explicit branch, HEAD, chosen index tree, backup and donor to repair missing or damaged linked-checkout metadata while preserving observed work. The released `chrono-worktree resume-rebind` command continues an interrupted or failed rebind only from its retained intent and original plan; it does not infer a new index, backup, donor or ownership choice. These commands do not infer the lost historical index or original outcome. See [metadata rebind](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/worktree.md#explicit-metadata-rebind) and [literal identity](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/git-facts.md#literal-checkout-identity).

The pinned `chrono-ci migrate` command supports explicit owned workflow transitions and preserves host configuration. For ordinary binary upgrades the existing provider, SDK profiles and generated workflows stay unchanged; use `verify` and the same unit checks. See [host customization and updates](https://github.com/ChronoAIProject/chrono-harness/blob/v0.1.1-dev.43081032713.1.g4ac3661ab3a17a5822360e0860a04820e852999c/docs/ci-units.md#host-customization-and-updates).
