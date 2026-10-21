/* Generated from fixed native radar template, no financial data. */
const _Vue=Vue;
window.CashflowRender=function render(_ctx, _cache) {
  with (_ctx) {
    const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, vModelText: _vModelText, withDirectives: _withDirectives, renderList: _renderList, Fragment: _Fragment, toDisplayString: _toDisplayString, withModifiers: _withModifiers, normalizeClass: _normalizeClass, vModelSelect: _vModelSelect, vShow: _vShow, createTextVNode: _createTextVNode, vModelCheckbox: _vModelCheckbox, normalizeStyle: _normalizeStyle, Transition: _Transition, withCtx: _withCtx, createVNode: _createVNode } = _Vue

    return (_openBlock(), _createElementBlock(_Fragment, null, [_createElementVNode("div", {
      class: "mb-5 oc-nav-boundary",
      hidden: ""
    }), _createElementVNode("div", {
      class: _normalizeClass(["oc-content-shell", {'cf-selecting':exportMode}]),
      "data-layout": "contentShell"
    }, [
      isLocalData
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "oc-local-notice"
          }, [_createElementVNode("strong", null, "本地聚合"), _createElementVNode("span", null, "本日板块数据由个股本地聚合计算，涨跌幅暂不显示（\"-\"）")]))
        : _createCommentVNode("", true),
      _createElementVNode("section", {
        class: "oc-pagehead",
        "data-layout": "pageHeaderInner"
      }, [_createElementVNode("div", { class: "oc-title" }, [_createElementVNode("h1", null, "板块资金雷达"), _createElementVNode("p", null, "识别主线资金流向与趋势，对比板块强弱")]), _createElementVNode("div", { class: "oc-head-actions" }, [_createElementVNode("div", { class: "oc-search-wrap" }, [_withDirectives(_createElementVNode("input", {
        "onUpdate:modelValue": $event => ((searchQuery) = $event),
        onFocus: $event => (showDropdown = true),
        onBlur: hideDropdownDelay,
        type: "text",
        placeholder: "搜索名称、代码或首字母",
        class: "oc-search"
      }, null, 40, ["onUpdate:modelValue", "onFocus", "onBlur"]), [[_vModelText, searchQuery]]), (showDropdown && searchResults.length > 0)
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "oc-search-results",
            id: "cashflow-search-results",
            role: "listbox"
          }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(searchResults, (res) => {
            return (_openBlock(), _createElementBlock("button", {
              key: res.ts_code,
              onMousedown: _withModifiers($event => (openModal(res, 'top')), ["prevent"]),
              class: "oc-search-result",
              role: "option",
              tabindex: "-1",
              id: 'cashflow-search-option-'+res.ts_code
            }, [_createElementVNode("span", null, [_createElementVNode("span", { class: "oc-search-name" }, _toDisplayString(cleanName(res.index_name)), 1), _createElementVNode("span", { class: "oc-search-code" }, _toDisplayString(res.ts_code), 1)]), _createElementVNode("span", { class: "oc-search-type" }, _toDisplayString(res.type.replace('板块', '')), 1)], 40, ["onMousedown", "id"]))
          }), 128))]))
        : (showDropdown && searchQuery.trim())
          ? (_openBlock(), _createElementBlock("div", {
              key: 1,
              class: "oc-search-empty",
              id: "cashflow-search-results",
              role: "listbox"
            }, "未找到匹配板块"))
          : _createCommentVNode("", true)])])]),
      _createElementVNode("section", {
        class: "oc-toolbar",
        "aria-label": "资金雷达筛选条件"
      }, [_createElementVNode("div", {
        class: "oc-control-set",
        role: "group",
        "aria-label": "板块类型"
      }, [
        _createElementVNode("button", {
          onClick: $event => {activeType = '二级行业'; closeAllCalendars()},
          class: _normalizeClass([{'is-active': activeType === '二级行业'}, "oc-tab"])
        }, "二级行业", 10, ["onClick"]),
        _createElementVNode("button", {
          onClick: $event => {activeType = '三级行业'; closeAllCalendars()},
          class: _normalizeClass([{'is-active': activeType === '三级行业'}, "oc-tab"])
        }, "三级行业", 10, ["onClick"]),
        _createElementVNode("button", {
          onClick: $event => {activeType = '概念板块'; closeAllCalendars()},
          class: _normalizeClass([{'is-active': activeType === '概念板块'}, "oc-tab"])
        }, "概念", 10, ["onClick"]),
        _createElementVNode("button", {
          onClick: $event => {activeType = '风格板块'; closeAllCalendars()},
          class: _normalizeClass([{'is-active': activeType === '风格板块'}, "oc-tab"])
        }, "风格", 10, ["onClick"])
      ]), _createElementVNode("div", {
        class: "oc-control-set oc-sort-control hide-scrollbar",
        role: "group",
        "aria-label": "排序指标"
      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(tabs, (tab) => {
        return (_openBlock(), _createElementBlock("button", {
          onClick: $event => {activeTab = tab.id; closeAllCalendars()},
          class: _normalizeClass([{'is-active': activeTab === tab.id}, "oc-tab"])
        }, _toDisplayString(tab.name), 11, ["onClick"]))
      }), 256)), (activeTab === 'RankChange')
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "cf-rank-mode",
            role: "group",
            "aria-label": "排名变化设置"
          }, [_createElementVNode("div", { class: "oc-rank-control-group" }, [
            _createElementVNode("label", null, "基准"),
            _createElementVNode("button", {
              onClick: $event => (rankChangeMetric = 'Swing'),
              class: _normalizeClass([{'is-active': rankChangeMetric === 'Swing'}, "oc-tab"])
            }, "波段率", 10, ["onClick"]),
            _createElementVNode("button", {
              onClick: $event => (rankChangeMetric = 'Ratio'),
              class: _normalizeClass([{'is-active': rankChangeMetric === 'Ratio'}, "oc-tab"])
            }, "单日率", 10, ["onClick"]),
            _createElementVNode("button", {
              onClick: $event => (rankChangeMetric = 'Amount'),
              class: _normalizeClass([{'is-active': rankChangeMetric === 'Amount'}, "oc-tab"])
            }, "单日额", 10, ["onClick"])
          ]), _createElementVNode("div", { class: "oc-rank-control-group" }, [_createElementVNode("label", { for: "rank-change-days" }, "统计"), _withDirectives(_createElementVNode("select", {
            id: "rank-change-days",
            "onUpdate:modelValue": $event => ((rankChangeDays) = $event)
          }, [
            _createElementVNode("option", { value: 1 }, "近 1 天", 8, ["value"]),
            _createElementVNode("option", { value: 2 }, "近 2 天", 8, ["value"]),
            _createElementVNode("option", { value: 3 }, "近 3 天", 8, ["value"]),
            _createElementVNode("option", { value: 4 }, "近 4 天", 8, ["value"]),
            _createElementVNode("option", { value: 5 }, "近 5 天", 8, ["value"])
          ], 8, ["onUpdate:modelValue"]), [[_vModelSelect, rankChangeDays]])])]))
        : _createCommentVNode("", true)]), _createElementVNode("div", { class: "cf-toolbar-actions" }, [_createElementVNode("label", { class: "oc-date" }, [_createElementVNode("span", null, "数据日期"), _withDirectives(_createElementVNode("select", {
        class: "native-date-binding",
        "aria-hidden": "true",
        tabindex: "-1",
        "onUpdate:modelValue": $event => ((selectedDate) = $event),
        onChange: $event => (closeAllCalendars())
      }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableDates, (date) => {
        return (_openBlock(), _createElementBlock("option", {
          key: date,
          value: date
        }, _toDisplayString(date), 9, ["value"]))
      }), 128))], 40, ["onUpdate:modelValue", "onChange"]), [[_vModelSelect, selectedDate]]), _createElementVNode("button", {
        id: "cashflow-date-trigger",
        type: "button",
        disabled: exportBusy,
        "aria-label": '选择数据日期 '+selectedDate,
        "aria-haspopup": "dialog",
        "aria-expanded": "false",
        "aria-controls": "cashflow-calendar"
      }, [_createElementVNode("span", null, _toDisplayString(selectedDate), 1), (_openBlock(), _createElementBlock("svg", {
        viewBox: "0 0 20 20",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "aria-hidden": "true"
      }, [_createElementVNode("path", { d: "m6 8 4 4 4-4" })]))], 8, ["disabled", "aria-label"])]), _createElementVNode("div", {
        class: "cf-export-actions",
        role: "group",
        "aria-label": "板块成分股导出",
        "aria-busy": exportBusy
      }, [_withDirectives(_createElementVNode("button", {
        id: "cashflow-export-enter",
        onClick: enterExportSelection,
        class: "oc-export",
        type: "button",
        "aria-expanded": exportMode
      }, "导出", 8, ["onClick", "aria-expanded"]), [[_vShow, !exportMode]]), exportMode
        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createElementVNode("span", {
              class: "cf-export-count",
              role: "status",
              "aria-live": "polite"
            }, "已选 " + _toDisplayString(selectedSectors.length), 1),
            _createElementVNode("button", {
              id: "cashflow-export-confirm",
              onClick: confirmExportSelection,
              disabled: !selectedSectors.length || exportBusy,
              class: "oc-export",
              type: "button"
            }, _toDisplayString(exportBusy ? '正在导出…' : '确认导出'), 9, ["onClick", "disabled"]),
            (selectedSectors.length)
              ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  onClick: clearSelection,
                  disabled: exportBusy,
                  class: "cf-export-quiet",
                  type: "button"
                }, "清空", 8, ["onClick", "disabled"]))
              : _createCommentVNode("", true),
            _createElementVNode("button", {
              id: "cashflow-export-cancel",
              onClick: exitExportSelection,
              disabled: exportBusy,
              class: "cf-export-quiet",
              type: "button",
              title: "退出导出并清空本次勾选"
            }, "取消", 8, ["onClick", "disabled"])
          ], 64))
        : _createCommentVNode("", true)], 8, ["aria-busy"])])]),
      appNotice
        ? (_openBlock(), _createElementBlock("div", {
            key: 1,
            class: "oc-app-notice",
            role: "alert"
          }, [_createElementVNode("span", null, _toDisplayString(appNotice), 1), _createElementVNode("button", { onClick: $event => (appNotice = '') }, "关闭", 8, ["onClick"])]))
        : _createCommentVNode("", true),
      _createElementVNode("p", {
        class: "cf-update-status",
        role: "status",
        "aria-live": "polite"
      }, _toDisplayString(updateStatusText), 1),
      _createElementVNode("section", {
        class: _normalizeClass(["desktop-mirror", 'mirror-mode-' + activeTab.toLowerCase()]),
        "aria-label": "资金强弱镜像榜单"
      }, [_createElementVNode("header", { class: "mirror-grid mirror-group-head" }, [_createElementVNode("div", { class: "mirror-group-name mirror-attack-group" }, [_createElementVNode("span", { class: "mirror-polarity" }), _createElementVNode("h2", null, _toDisplayString(activeTab === 'RankChange' ? '排名上升榜' : '资金进攻榜'), 1), _createElementVNode("small", null, "TOP 10%")]), _createElementVNode("div", { class: "mirror-axis-head" }, [_createElementVNode("span", null, [_createElementVNode("i"), _createTextVNode(_toDisplayString(mirrorMetricLabel), 1), _createElementVNode("i")])]), _createElementVNode("div", { class: "mirror-group-name right mirror-weak-group" }, [_createElementVNode("small", null, "BOTTOM 10%"), _createElementVNode("h2", null, _toDisplayString(activeTab === 'RankChange' ? '排名下降榜' : '资金撤离榜'), 1), _createElementVNode("span", { class: "mirror-polarity" })])]), _createElementVNode("div", { class: "mirror-table" }, [_createElementVNode("div", { class: "mirror-grid mirror-column-head" }, [
        _createElementVNode("div", { class: "mirror-board-heading left" }, "板块"),
        _createElementVNode("div", null, [_createElementVNode("button", {
          class: "mirror-sort-button",
          onClick: $event => (handleSort('top', 'pct_change'))
        }, [_createTextVNode("涨跌幅 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'pct_change') }, null, 8, ["innerHTML"])], 8, ["onClick"])]),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mirrorAuxColumns, (aux) => {
          return (_openBlock(), _createElementBlock("div", { key: 'top-head-' + aux.id }, [(aux.key)
            ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                class: "mirror-sort-button",
                onClick: $event => (handleSort('top', aux.topKey))
              }, [_createTextVNode(_toDisplayString(aux.label) + " ", 1), _createElementVNode("span", { innerHTML: getSortIcon('top', aux.topKey) }, null, 8, ["innerHTML"])], 8, ["onClick"]))
            : _createCommentVNode("", true)]))
        }), 128)),
        _createElementVNode("div", null, [_createElementVNode("div", { class: "mirror-primary-sort" }, [_createElementVNode("button", { onClick: $event => (handleSort('top', mirrorPrimarySortKey)) }, [_createTextVNode(_toDisplayString(mirrorDirectionLabels[0]) + " ", 1), _createElementVNode("span", { innerHTML: getSortIcon('top', mirrorPrimarySortKey) }, null, 8, ["innerHTML"])], 8, ["onClick"]), _createElementVNode("button", { onClick: $event => (handleSort('bot', mirrorPrimarySortKey)) }, [_createElementVNode("span", { innerHTML: getSortIcon('bot', mirrorPrimarySortKey) }, null, 8, ["innerHTML"]), _createTextVNode(" " + _toDisplayString(mirrorDirectionLabels[1]), 1)], 8, ["onClick"])])]),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mirrorAuxColumnsReversed, (aux) => {
          return (_openBlock(), _createElementBlock("div", { key: 'bot-head-' + aux.id }, [(aux.key)
            ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                class: "mirror-sort-button",
                onClick: $event => (handleSort('bot', aux.botKey))
              }, [_createElementVNode("span", { innerHTML: getSortIcon('bot', aux.botKey) }, null, 8, ["innerHTML"]), _createTextVNode(" " + _toDisplayString(aux.label), 1)], 8, ["onClick"]))
            : _createCommentVNode("", true)]))
        }), 128)),
        _createElementVNode("div", null, [_createElementVNode("button", {
          class: "mirror-sort-button",
          onClick: $event => (handleSort('bot', 'pct_change'))
        }, [_createElementVNode("span", { innerHTML: getSortIcon('bot', 'pct_change') }, null, 8, ["innerHTML"]), _createTextVNode(" 涨跌幅")], 8, ["onClick"])]),
        _createElementVNode("div", { class: "mirror-board-heading right" }, "板块")
      ]), (mirrorRows.length === 0)
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "mirror-empty"
          }, "当前条件下没有榜单数据"))
        : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mirrorRows, (row, rowIndex) => {
        return (_openBlock(), _createElementBlock(_Fragment, { key: 'mirror-' + rowIndex + '-' + (row.top ? row.top.index_name : '') + '-' + (row.bot ? row.bot.index_name : '') }, [_createElementVNode("div", { class: "mirror-grid mirror-row" }, [
          _createElementVNode("div", { class: "mirror-cell mirror-board left" }, [(row.top)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_withDirectives(_createElementVNode("input", {
                type: "checkbox",
                disabled: !exportMode || exportBusy,
                tabindex: exportMode ? 0 : -1,
                "aria-hidden": !exportMode,
                "onUpdate:modelValue": $event => ((selectedSectors) = $event),
                value: row.top.index_name,
                onClick: _withModifiers(() => {}, ["stop"]),
                "aria-label": "勾选板块"
              }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue", "value", "onClick"]), [[_vModelCheckbox, selectedSectors]]), _createElementVNode("span", { class: "mirror-rank" }, _toDisplayString(mirrorRank(row.top)), 1), _createElementVNode("button", {
                class: "mirror-name",
                onClick: _withModifiers($event => (openModal(row.top, 'top')), ["stop"])
              }, _toDisplayString(cleanName(row.top.index_name)), 9, ["onClick"])], 64))
            : _createCommentVNode("", true)]),
          _createElementVNode("div", { class: _normalizeClass(["mirror-cell", row.top ? mirrorValueClass(row.top.pct_change, {kind:'signed'}) : '']) }, _toDisplayString(row.top ? formatPctChange(row.top.pct_change) : ''), 3),
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mirrorAuxColumns, (aux) => {
            return (_openBlock(), _createElementBlock("div", {
              key: 'top-' + rowIndex + '-' + aux.id,
              class: "mirror-cell"
            }, [(row.top && aux.kind === 'calendar')
              ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  class: "mirror-calendar-button",
                  onClick: _withModifiers($event => (toggleCalendar(row.top.index_name)), ["stop"])
                }, _toDisplayString(mirrorAuxValue(row.top, aux, 'top')), 9, ["onClick"]))
              : (row.top && aux.key)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 1,
                    class: _normalizeClass(mirrorValueClass(mirrorAuxRaw(row.top, aux, 'top'), aux))
                  }, _toDisplayString(mirrorAuxValue(row.top, aux, 'top')), 3))
                : _createCommentVNode("", true)]))
          }), 128)),
          _createElementVNode("div", { class: "mirror-cell mirror-flow" }, [_createElementVNode("div", { class: "mirror-half left" }, [(row.top)
            ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "mirror-bar",
                style: _normalizeStyle(mirrorBarStyle(row.top))
              }, _toDisplayString(formatMirrorMetric(row.top)), 5))
            : _createCommentVNode("", true)]), _createElementVNode("div", { class: "mirror-half right" }, [(row.bot)
            ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "mirror-bar",
                style: _normalizeStyle(mirrorBarStyle(row.bot))
              }, _toDisplayString(formatMirrorMetric(row.bot)), 5))
            : _createCommentVNode("", true)])]),
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(mirrorAuxColumnsReversed, (aux) => {
            return (_openBlock(), _createElementBlock("div", {
              key: 'bot-' + rowIndex + '-' + aux.id,
              class: "mirror-cell"
            }, [(row.bot && aux.kind === 'calendar')
              ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  class: "mirror-calendar-button",
                  onClick: _withModifiers($event => (toggleCalendar(row.bot.index_name)), ["stop"])
                }, _toDisplayString(mirrorAuxValue(row.bot, aux, 'bot')), 9, ["onClick"]))
              : (row.bot && aux.key)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 1,
                    class: _normalizeClass(mirrorValueClass(mirrorAuxRaw(row.bot, aux, 'bot'), aux))
                  }, _toDisplayString(mirrorAuxValue(row.bot, aux, 'bot')), 3))
                : _createCommentVNode("", true)]))
          }), 128)),
          _createElementVNode("div", { class: _normalizeClass(["mirror-cell", row.bot ? mirrorValueClass(row.bot.pct_change, {kind:'signed'}) : '']) }, _toDisplayString(row.bot ? formatPctChange(row.bot.pct_change) : ''), 3),
          _createElementVNode("div", { class: "mirror-cell mirror-board right" }, [(row.bot)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("button", {
                class: "mirror-name",
                onClick: _withModifiers($event => (openModal(row.bot, 'bottom')), ["stop"])
              }, _toDisplayString(cleanName(row.bot.index_name)), 9, ["onClick"]), _createElementVNode("span", { class: "mirror-rank" }, _toDisplayString(mirrorRank(row.bot)), 1), _withDirectives(_createElementVNode("input", {
                type: "checkbox",
                disabled: !exportMode || exportBusy,
                tabindex: exportMode ? 0 : -1,
                "aria-hidden": !exportMode,
                "onUpdate:modelValue": $event => ((selectedSectors) = $event),
                value: row.bot.index_name,
                onClick: _withModifiers(() => {}, ["stop"]),
                "aria-label": "勾选板块"
              }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue", "value", "onClick"]), [[_vModelCheckbox, selectedSectors]])], 64))
            : _createCommentVNode("", true)])
        ]), ((row.top && expandedCal === row.top.index_name) || (row.bot && expandedCal === row.bot.index_name))
          ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: "mirror-calendar"
            }, [(row.top && expandedCal === row.top.index_name)
              ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: "mirror-calendar-panel"
                }, [_createElementVNode("div", { class: "mirror-calendar-head" }, [_createElementVNode("span", null, "【" + _toDisplayString(cleanName(row.top.index_name)) + "】近 30 交易日排名轨迹", 1), _createElementVNode("button", { onClick: _withModifiers($event => (expandedCal = null), ["stop"]) }, "收起", 8, ["onClick"])]), _createElementVNode("div", { class: "flex flex-wrap gap-1" }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableDatesList, (dateStr) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: dateStr,
                    class: _normalizeClass(["cal-box", getHeatmapClass(getHistoricalRank(row.top.index_name, dateStr), 'top')]),
                    onClick: _withModifiers($event => (jumpToDate(dateStr)), ["stop"])
                  }, [_createElementVNode("span", { class: "cal-date" }, _toDisplayString(dateStr.substring(5).replace('-', '')), 1), _createElementVNode("span", { class: "cal-rank" }, _toDisplayString(getHistoricalRank(row.top.index_name, dateStr) || '-'), 1)], 10, ["onClick"]))
                }), 128))])]))
              : _createCommentVNode("", true), (row.bot && expandedCal === row.bot.index_name)
              ? (_openBlock(), _createElementBlock("div", {
                  key: 1,
                  class: "mirror-calendar-panel right"
                }, [_createElementVNode("div", { class: "mirror-calendar-head" }, [_createElementVNode("span", null, "【" + _toDisplayString(cleanName(row.bot.index_name)) + "】近 30 交易日排名轨迹", 1), _createElementVNode("button", { onClick: _withModifiers($event => (expandedCal = null), ["stop"]) }, "收起", 8, ["onClick"])]), _createElementVNode("div", { class: "flex flex-wrap gap-1" }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableDatesList, (dateStr) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: dateStr,
                    class: _normalizeClass(["cal-box", getHeatmapClass(getHistoricalRank(row.bot.index_name, dateStr), 'bot')]),
                    onClick: _withModifiers($event => (jumpToDate(dateStr)), ["stop"])
                  }, [_createElementVNode("span", { class: "cal-date" }, _toDisplayString(dateStr.substring(5).replace('-', '')), 1), _createElementVNode("span", { class: "cal-rank" }, _toDisplayString(getHistoricalRank(row.bot.index_name, dateStr) || '-'), 1)], 10, ["onClick"]))
                }), 128))])]))
              : _createCommentVNode("", true)]))
          : _createCommentVNode("", true)], 64))
      }), 128))])], 2),
      _createElementVNode("p", { class: "mobile-scroll-note" }, "左右滑动榜单可查看全部指标，字段未隐藏"),
      _createElementVNode("div", { class: "mobile-radar-only grid grid-cols-1 gap-4 md:gap-6 items-start" }, [_createElementVNode("div", { class: "bg-white rounded-xl border border-slate-200 shadow-sm relative z-0 overflow-hidden" }, [_createElementVNode("div", { class: "p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50" }, [_createElementVNode("div", { class: "flex items-center" }, [_createElementVNode("span", { class: "text-base md:text-[1.05rem] font-black text-red-600 tracking-tight" }, _toDisplayString(activeTab === 'RankChange' ? '排名上升榜' : '资金进攻榜'), 1), _createElementVNode("span", { class: "ml-2 md:ml-3 text-[9px] md:text-[10px] text-slate-500 font-bold border border-slate-300 px-2 py-0.5 rounded-full bg-white shadow-sm" }, [_createTextVNode(" TOP 10% "), (activeTab === 'RankChange')
        ? (_openBlock(), _createElementBlock("span", { key: 0 }, "(基准: " + _toDisplayString(tabs.find(t=>t.id===rankChangeMetric).name) + ")", 1))
        : _createCommentVNode("", true)])])]), _createElementVNode("div", { class: "overflow-x-auto w-full hide-scrollbar" }, [_createElementVNode("div", { class: "min-w-[760px] pb-2" }, [_createElementVNode("div", { class: "grid grid-cols-12 table-head items-center py-1.5 px-1" }, [
        _createElementVNode("div", { class: "col-span-1 text-center flex justify-center items-center custom-tooltip" }, [_withDirectives(_createElementVNode("input", {
          type: "checkbox",
          disabled: !exportMode || exportBusy,
          tabindex: exportMode ? 0 : -1,
          "aria-hidden": !exportMode,
          "onUpdate:modelValue": $event => ((isAllTopSelected) = $event),
          "aria-label": "全选资金进攻榜",
          class: "cursor-pointer"
        }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue"]), [[_vModelCheckbox, isAllTopSelected]]), _createElementVNode("div", {
          class: "tooltip-text",
          style: {"width":"100px","left":"200%"}
        }, "全选/取消全选")]),
        _createElementVNode("div", { class: "col-span-1 text-center" }, "No."),
        _createElementVNode("div", { class: "col-span-2 text-left pl-2" }, "板块名称"),
        _createElementVNode("div", {
          class: "col-span-2 text-center sortable-head flex-center-y justify-center",
          onClick: $event => (handleSort('top', 'pct_change'))
        }, [_createTextVNode(" 涨跌幅 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'pct_change') }, null, 8, ["innerHTML"])], 8, ["onClick"]),
        (activeTab === 'RankChange')
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('top', 'Swing_Rank_Chg'))
            }, [_createTextVNode("波段率 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Swing_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"]), _createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('top', 'Ratio_Rank_Chg'))
            }, [_createTextVNode("单日率 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Ratio_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"]), _createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('top', 'Amount_Rank_Chg'))
            }, [_createTextVNode("单日额 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Amount_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"])], 64))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              (activeTab !== 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center custom-tooltip",
                    onClick: $event => (handleSort('top', activeTab + '_Score'))
                  }, [
                    _createTextVNode(" 加权评分 "),
                    _createElementVNode("span", { class: "tooltip-icon" }, "?"),
                    _createElementVNode("div", { class: "tooltip-text" }, [_createElementVNode("strong", { class: "text-blue-300" }, "说明："), _createTextVNode(" 后端特征算法算出的综合加权值。")]),
                    _createElementVNode("span", { innerHTML: getSortIcon('top', activeTab + '_Score') }, null, 8, ["innerHTML"])
                  ], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('top', 'Ratio_Raw_Pct'))
                  }, [_createTextVNode(" 单日流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Ratio_Raw_Pct') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Swing')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 2,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('top', 'Swing_Ratio_Val'))
                  }, [_createTextVNode(" 波段流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Swing_Ratio_Val') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Ratio')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 3,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('top', 'Ratio_Raw_Pct'))
                  }, [_createTextVNode(" 单日流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Ratio_Raw_Pct') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 4,
                    class: "col-span-3 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('top', 'Amount_Raw_BN'))
                  }, [_createTextVNode(" 单日净额 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Amount_Raw_BN') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab !== 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 5,
                    class: "col-span-1 text-center sortable-head flex-center-y justify-center text-[11px]",
                    onClick: $event => (handleSort('top', 'Amount_Raw_BN'))
                  }, [_createTextVNode(" 净额 "), _createElementVNode("span", { innerHTML: getSortIcon('top', 'Amount_Raw_BN') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              _createElementVNode("div", {
                class: "col-span-1 text-center sortable-head flex-center-y justify-center",
                onClick: $event => (handleSort('top', activeTab + '_Top30d'))
              }, [_createTextVNode(" 在榜 "), _createElementVNode("span", { innerHTML: getSortIcon('top', activeTab + '_Top30d') }, null, 8, ["innerHTML"])], 8, ["onClick"])
            ], 64))
      ]), _createElementVNode("div", { class: "flex flex-col" }, [(topList.length === 0)
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "mirror-empty"
          }, "当前条件下没有榜单数据"))
        : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topList, (item) => {
        return (_openBlock(), _createElementBlock(_Fragment, { key: item.index_name }, [_createElementVNode("label", { class: _normalizeClass(["grid grid-cols-12 px-1 data-row items-stretch cursor-pointer relative", {'bg-blue-50 border-l-2 border-blue-500': expandedCal === item.index_name}]) }, [
          _createElementVNode("div", { class: "col-span-1 text-center flex-center-y justify-center" }, [_withDirectives(_createElementVNode("input", {
            type: "checkbox",
            disabled: !exportMode || exportBusy,
            tabindex: exportMode ? 0 : -1,
            "aria-hidden": !exportMode,
            "onUpdate:modelValue": $event => ((selectedSectors) = $event),
            value: item.index_name,
            onClick: _withModifiers(() => {}, ["stop"])
          }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue", "value", "onClick"]), [[_vModelCheckbox, selectedSectors]])]),
          _createElementVNode("div", { class: "col-span-1 text-center flex-center-y justify-center" }, [_createElementVNode("span", { class: "rank-tag bg-rank-up" }, _toDisplayString(item[(activeTab === 'RankChange' ? rankChangeMetric : activeTab) + '_RankPos']), 1)]),
          _createElementVNode("div", {
            class: "col-span-2 text-left pl-2 font-bold text-slate-800 truncate pr-2 flex-center-y hover:text-blue-600 transition",
            onClick: _withModifiers($event => (openModal(item, 'top')), ["stop"])
          }, _toDisplayString(cleanName(item.index_name)), 9, ["onClick"]),
          _createElementVNode("div", { class: _normalizeClass(["col-span-2 text-center text-sm font-semibold flex-center-y justify-center", item.pct_change > 0 ? 'text-up' : item.pct_change < 0 ? 'text-down' : '']) }, _toDisplayString(Number.isFinite(item.pct_change) ? ((item.pct_change > 0 ? '+' : '') + item.pct_change.toFixed(2) + '%') : '-'), 3),
          (activeTab === 'RankChange')
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Swing' ? 'highlight-col' : '']) }, [(item.Swing_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Swing_Rank_Chg), 1))
                : (item.Swing_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Swing_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2), _createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Ratio' ? 'highlight-col' : '']) }, [(item.Ratio_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Ratio_Rank_Chg), 1))
                : (item.Ratio_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Ratio_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2), _createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Amount' ? 'highlight-col' : '']) }, [(item.Amount_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Amount_Rank_Chg), 1))
                : (item.Amount_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Amount_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2)], 64))
            : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                (activeTab !== 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 0,
                      class: "col-span-2 flex-center-y justify-center highlight-col font-black"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString(item[activeTab + '_Score'].toFixed(1)), 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 1,
                      class: "col-span-2 flex-center-y justify-center"
                    }, [_createElementVNode("span", { class: "text-sm font-bold text-slate-700" }, _toDisplayString((item.Ratio_Raw_Pct * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Swing')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 2,
                      class: "col-span-2 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString((item.Swing_Ratio_Val * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Ratio')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 3,
                      class: "col-span-2 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString((item.Ratio_Raw_Pct * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 4,
                      class: "col-span-3 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString(item.Amount_Raw_BN.toFixed(2)) + " 亿", 1)]))
                  : _createCommentVNode("", true),
                (activeTab !== 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 5,
                      class: "col-span-1 text-center flex-center-y justify-center text-[10px] font-bold text-slate-500"
                    }, _toDisplayString(item.Amount_Raw_BN.toFixed(1)) + " 亿 ", 1))
                  : _createCommentVNode("", true),
                _createElementVNode("div", {
                  class: "col-span-1 text-center flex-center-y justify-center",
                  onClick: _withModifiers($event => (toggleCalendar(item.index_name)), ["stop"])
                }, [_createElementVNode("span", { class: "inline-flex w-6 h-6 items-center justify-center bg-slate-100 hover:bg-blue-200 text-blue-700 font-black rounded transition border border-slate-200" }, _toDisplayString(item[activeTab + '_Top30d']), 1)], 8, ["onClick"])
              ], 64))
        ], 2), (expandedCal === item.index_name)
          ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: "calendar-tray p-3 col-span-12 w-full origin-top animate-fade-in-down"
            }, [_createElementVNode("div", { class: "flex justify-between items-center mb-2" }, [_createElementVNode("span", { class: "text-[11px] font-bold text-slate-600" }, "【" + _toDisplayString(cleanName(item.index_name)) + "】近 30 交易日排名轨迹", 1), _createElementVNode("button", {
              onClick: _withModifiers($event => (expandedCal = null), ["stop"]),
              class: "text-[10px] bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm hover:bg-slate-50 text-slate-600 font-bold"
            }, "收起", 8, ["onClick"])]), _createElementVNode("div", { class: "flex flex-wrap gap-1" }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableDatesList, (dateStr) => {
              return (_openBlock(), _createElementBlock("div", {
                key: dateStr,
                class: _normalizeClass(["cal-box", getHeatmapClass(getHistoricalRank(item.index_name, dateStr), 'top')]),
                onClick: _withModifiers($event => (jumpToDate(dateStr)), ["stop"])
              }, [_createElementVNode("span", { class: "cal-date" }, _toDisplayString(dateStr.substring(5).replace('-', '')), 1), _createElementVNode("span", { class: "cal-rank" }, _toDisplayString(getHistoricalRank(item.index_name, dateStr) || '-'), 1)], 10, ["onClick"]))
            }), 128))])]))
          : _createCommentVNode("", true)], 64))
      }), 128))])])])]), _createElementVNode("div", { class: "bg-white rounded-xl border border-slate-200 shadow-sm relative z-0 overflow-hidden" }, [_createElementVNode("div", { class: "p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50" }, [_createElementVNode("div", { class: "flex items-center" }, [_createElementVNode("span", { class: "text-base md:text-[1.05rem] font-black text-green-600 tracking-tight" }, _toDisplayString(activeTab === 'RankChange' ? '排名下降榜' : '资金撤离榜'), 1), _createElementVNode("span", { class: "ml-2 md:ml-3 text-[9px] md:text-[10px] text-slate-500 font-bold border border-slate-300 px-2 py-0.5 rounded-full bg-white shadow-sm" }, [_createTextVNode(" BOTTOM 10% "), (activeTab === 'RankChange')
        ? (_openBlock(), _createElementBlock("span", { key: 0 }, "(基准: " + _toDisplayString(tabs.find(t=>t.id===rankChangeMetric).name) + ")", 1))
        : _createCommentVNode("", true)])])]), _createElementVNode("div", { class: "overflow-x-auto w-full hide-scrollbar" }, [_createElementVNode("div", { class: "min-w-[760px] pb-2" }, [_createElementVNode("div", { class: "grid grid-cols-12 table-head items-center py-1.5 px-1" }, [
        _createElementVNode("div", { class: "col-span-1 text-center flex justify-center items-center custom-tooltip" }, [_withDirectives(_createElementVNode("input", {
          type: "checkbox",
          disabled: !exportMode || exportBusy,
          tabindex: exportMode ? 0 : -1,
          "aria-hidden": !exportMode,
          "onUpdate:modelValue": $event => ((isAllBotSelected) = $event),
          "aria-label": "全选资金撤离榜",
          class: "cursor-pointer"
        }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue"]), [[_vModelCheckbox, isAllBotSelected]]), _createElementVNode("div", {
          class: "tooltip-text",
          style: {"width":"100px","left":"200%"}
        }, "全选/取消全选")]),
        _createElementVNode("div", { class: "col-span-1 text-center" }, "No."),
        _createElementVNode("div", { class: "col-span-2 text-left pl-2" }, "板块名称"),
        _createElementVNode("div", {
          class: "col-span-2 text-center sortable-head flex-center-y justify-center",
          onClick: $event => (handleSort('bot', 'pct_change'))
        }, [_createTextVNode(" 涨跌幅 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'pct_change') }, null, 8, ["innerHTML"])], 8, ["onClick"]),
        (activeTab === 'RankChange')
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('bot', 'Swing_Rank_Chg'))
            }, [_createTextVNode("波段率 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Swing_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"]), _createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('bot', 'Ratio_Rank_Chg'))
            }, [_createTextVNode("单日率 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Ratio_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"]), _createElementVNode("div", {
              class: "col-span-2 text-center sortable-head flex-center-y justify-center",
              onClick: $event => (handleSort('bot', 'Amount_Rank_Chg'))
            }, [_createTextVNode("单日额 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Amount_Rank_Chg') }, null, 8, ["innerHTML"])], 8, ["onClick"])], 64))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              (activeTab !== 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('bot', activeTab + '_Score'))
                  }, [_createTextVNode(" 加权评分 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', activeTab + '_Score') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('bot', 'Ratio_Raw_Pct'))
                  }, [_createTextVNode(" 单日流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Ratio_Raw_Pct') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Swing')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 2,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('bot', 'Swing_Ratio_Val'))
                  }, [_createTextVNode(" 波段流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Swing_Ratio_Val') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Ratio')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 3,
                    class: "col-span-2 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('bot', 'Ratio_Raw_Pct'))
                  }, [_createTextVNode(" 单日流入率 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Ratio_Raw_Pct') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab === 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 4,
                    class: "col-span-3 text-center sortable-head flex-center-y justify-center",
                    onClick: $event => (handleSort('bot', 'Amount_Raw_BN'))
                  }, [_createTextVNode(" 单日净额 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Amount_Raw_BN') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              (activeTab !== 'Amount')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 5,
                    class: "col-span-1 text-center sortable-head flex-center-y justify-center text-[11px]",
                    onClick: $event => (handleSort('bot', 'Amount_Raw_BN'))
                  }, [_createTextVNode(" 净额 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', 'Amount_Raw_BN') }, null, 8, ["innerHTML"])], 8, ["onClick"]))
                : _createCommentVNode("", true),
              _createElementVNode("div", {
                class: "col-span-1 text-center sortable-head flex-center-y justify-center",
                onClick: $event => (handleSort('bot', activeTab + '_Bot30d'))
              }, [_createTextVNode(" 在榜 "), _createElementVNode("span", { innerHTML: getSortIcon('bot', activeTab + '_Bot30d') }, null, 8, ["innerHTML"])], 8, ["onClick"])
            ], 64))
      ]), _createElementVNode("div", { class: "flex flex-col" }, [(botList.length === 0)
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "mirror-empty"
          }, "当前条件下没有榜单数据"))
        : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(botList, (item) => {
        return (_openBlock(), _createElementBlock(_Fragment, { key: item.index_name }, [_createElementVNode("label", { class: _normalizeClass(["grid grid-cols-12 px-1 data-row items-stretch cursor-pointer relative", {'bg-green-50 border-l-2 border-green-500': expandedCal === item.index_name}]) }, [
          _createElementVNode("div", { class: "col-span-1 text-center flex-center-y justify-center" }, [_withDirectives(_createElementVNode("input", {
            type: "checkbox",
            disabled: !exportMode || exportBusy,
            tabindex: exportMode ? 0 : -1,
            "aria-hidden": !exportMode,
            "onUpdate:modelValue": $event => ((selectedSectors) = $event),
            value: item.index_name,
            onClick: _withModifiers(() => {}, ["stop"])
          }, null, 8, ["disabled", "tabindex", "aria-hidden", "onUpdate:modelValue", "value", "onClick"]), [[_vModelCheckbox, selectedSectors]])]),
          _createElementVNode("div", { class: "col-span-1 text-center flex-center-y justify-center" }, [_createElementVNode("span", { class: "rank-tag bg-rank-down" }, _toDisplayString(item[(activeTab === 'RankChange' ? rankChangeMetric : activeTab) + '_RankPos']), 1)]),
          _createElementVNode("div", {
            class: "col-span-2 text-left pl-2 font-bold text-slate-800 truncate pr-2 flex-center-y hover:text-green-600 transition",
            onClick: _withModifiers($event => (openModal(item, 'bottom')), ["stop"])
          }, _toDisplayString(cleanName(item.index_name)), 9, ["onClick"]),
          _createElementVNode("div", { class: _normalizeClass(["col-span-2 text-center text-sm font-semibold flex-center-y justify-center", item.pct_change > 0 ? 'text-up' : item.pct_change < 0 ? 'text-down' : '']) }, _toDisplayString(Number.isFinite(item.pct_change) ? ((item.pct_change > 0 ? '+' : '') + item.pct_change.toFixed(2) + '%') : '-'), 3),
          (activeTab === 'RankChange')
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [_createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Swing' ? 'highlight-col' : '']) }, [(item.Swing_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Swing_Rank_Chg), 1))
                : (item.Swing_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Swing_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2), _createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Ratio' ? 'highlight-col' : '']) }, [(item.Ratio_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Ratio_Rank_Chg), 1))
                : (item.Ratio_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Ratio_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2), _createElementVNode("div", { class: _normalizeClass(["col-span-2 flex-center-y justify-center font-bold text-sm", rankChangeMetric === 'Amount' ? 'highlight-col' : '']) }, [(item.Amount_Rank_Chg > 0)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "text-up"
                  }, "↑ " + _toDisplayString(item.Amount_Rank_Chg), 1))
                : (item.Amount_Rank_Chg < 0)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 1,
                      class: "text-down"
                    }, "↓ " + _toDisplayString(Math.abs(item.Amount_Rank_Chg)), 1))
                  : (_openBlock(), _createElementBlock("span", {
                      key: 2,
                      class: "text-slate-400"
                    }, "-"))], 2)], 64))
            : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                (activeTab !== 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 0,
                      class: "col-span-2 flex-center-y justify-center highlight-col font-black"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString(item[activeTab + '_Score'].toFixed(1)), 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 1,
                      class: "col-span-2 flex-center-y justify-center"
                    }, [_createElementVNode("span", { class: "text-sm font-bold text-slate-700" }, _toDisplayString((item.Ratio_Raw_Pct * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Swing')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 2,
                      class: "col-span-2 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString((item.Swing_Ratio_Val * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Ratio')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 3,
                      class: "col-span-2 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString((item.Ratio_Raw_Pct * 100).toFixed(2)) + "%", 1)]))
                  : _createCommentVNode("", true),
                (activeTab === 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 4,
                      class: "col-span-3 flex-center-y justify-center highlight-col"
                    }, [_createElementVNode("span", { class: "text-sm" }, _toDisplayString(item.Amount_Raw_BN.toFixed(2)) + " 亿", 1)]))
                  : _createCommentVNode("", true),
                (activeTab !== 'Amount')
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 5,
                      class: "col-span-1 text-center flex-center-y justify-center text-[10px] font-bold text-slate-500"
                    }, _toDisplayString(item.Amount_Raw_BN.toFixed(1)) + " 亿 ", 1))
                  : _createCommentVNode("", true),
                _createElementVNode("div", {
                  class: "col-span-1 text-center flex-center-y justify-center",
                  onClick: _withModifiers($event => (toggleCalendar(item.index_name)), ["stop"])
                }, [_createElementVNode("span", { class: "inline-flex w-6 h-6 items-center justify-center bg-slate-100 hover:bg-green-200 text-green-700 font-black rounded transition border border-slate-200" }, _toDisplayString(item[activeTab + '_Bot30d']), 1)], 8, ["onClick"])
              ], 64))
        ], 2), (expandedCal === item.index_name)
          ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: "calendar-tray p-3 col-span-12 w-full origin-top animate-fade-in-down"
            }, [_createElementVNode("div", { class: "flex justify-between items-center mb-2" }, [_createElementVNode("span", { class: "text-[11px] font-bold text-slate-600" }, "【" + _toDisplayString(cleanName(item.index_name)) + "】近 30 交易日排名轨迹", 1), _createElementVNode("button", {
              onClick: _withModifiers($event => (expandedCal = null), ["stop"]),
              class: "text-[10px] bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm hover:bg-slate-50 text-slate-600 font-bold"
            }, "收起", 8, ["onClick"])]), _createElementVNode("div", { class: "flex flex-wrap gap-1" }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableDatesList, (dateStr) => {
              return (_openBlock(), _createElementBlock("div", {
                key: dateStr,
                class: _normalizeClass(["cal-box", getHeatmapClass(getHistoricalRank(item.index_name, dateStr), 'bot')]),
                onClick: _withModifiers($event => (jumpToDate(dateStr)), ["stop"])
              }, [_createElementVNode("span", { class: "cal-date" }, _toDisplayString(dateStr.substring(5).replace('-', '')), 1), _createElementVNode("span", { class: "cal-rank" }, _toDisplayString(getHistoricalRank(item.index_name, dateStr) || '-'), 1)], 10, ["onClick"]))
            }), 128))])]))
          : _createCommentVNode("", true)], 64))
      }), 128))])])])])]),
      _createElementVNode("footer", {
        class: "cf-page-footer",
        "aria-label": "页面说明"
      }, [_createElementVNode("span", { class: "cf-parameter-note" }, "参数说明: 波段周期取 3-10 个交易日多周期协同加权"), _createElementVNode("span", { class: "research-disclaimer" }, "仅供学习研究，不构成任何投资建议")])
    ], 2), _createVNode(_Transition, {
      name: "cf-detail",
      onBeforeEnter: detailBeforeEnter,
      onBeforeLeave: detailBeforeLeave,
      onAfterLeave: detailAfterLeave
    }, {
      default: _withCtx(() => [modalData
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "modal-overlay",
            onClick: _withModifiers(closeModal, ["self"])
          }, [_createElementVNode("div", {
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "cashflow-detail-title",
            class: "modal-content detail-dialog flex flex-col max-h-[85vh] md:max-h-[90vh]"
          }, [_createElementVNode("div", { class: "modal-head" }, [_createElementVNode("div", { class: "w-full" }, [_createElementVNode("div", { class: "modal-title-row" }, [
            _createElementVNode("h2", {
              class: "modal-title",
              id: "cashflow-detail-title"
            }, _toDisplayString(cleanName(currentModalData.index_name)), 1),
            _createElementVNode("span", { class: "modal-type" }, _toDisplayString(currentModalData.type.replace('板块', '')), 1),
            _createElementVNode("span", { class: "modal-code" }, _toDisplayString(currentModalData.ts_code), 1),
            _createElementVNode("span", { class: "modal-leader-group" }, [_createElementVNode("span", { class: "modal-leader-label" }, "当日领涨"), _createElementVNode("span", { class: "modal-leader" }, _toDisplayString(currentModalData.lead_stock || '--'), 1), _createElementVNode("span", { class: _normalizeClass([(currentModalData.pct_change_stock || 0) > 0 ? 'text-up' : (currentModalData.pct_change_stock || 0) < 0 ? 'text-down' : '', "modal-leader-change"]) }, _toDisplayString((currentModalData.pct_change_stock || 0) > 0 ? '+' : '') + _toDisplayString((currentModalData.pct_change_stock || 0).toFixed(2)) + "%", 3)]),
            _createElementVNode("span", { class: "modal-date-group" }, [_createElementVNode("span", { class: "modal-date" }, _toDisplayString(currentModalData.trade_date), 1), chartSelectedDate
              ? (_openBlock(), _createElementBlock("span", {
                  key: 0,
                  class: "modal-history"
                }, "历史回溯"))
              : _createCommentVNode("", true)]),
            _createElementVNode("div", { class: "modal-actions" }, [_createElementVNode("button", {
              onClick: $event => (copySingleSector(currentModalData)),
              class: "modal-action"
            }, [(_openBlock(), _createElementBlock("svg", {
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [_createElementVNode("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "1.7",
              d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            })])), _createElementVNode("span", null, "复制成分股")], 8, ["onClick"]), _createElementVNode("button", {
              onClick: $event => (exportSingleSector(currentModalData)),
              class: "modal-action"
            }, [(_openBlock(), _createElementBlock("svg", {
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [_createElementVNode("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "1.7",
              d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            })])), _createElementVNode("span", null, "导出成分股")], 8, ["onClick"])])
          ])]), _createElementVNode("button", {
            onClick: closeModal,
            class: "modal-close",
            "aria-label": "关闭详情"
          }, [(_openBlock(), _createElementBlock("svg", {
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [_createElementVNode("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "1.7",
            d: "M6 18L18 6M6 6l12 12"
          })]))], 8, ["onClick"])]), _createElementVNode("div", { class: "modal-body detail-workspace" }, [_createElementVNode("section", { class: "detail-observation-region" }, [
            _createElementVNode("div", { class: "detail-summary-region" }, [_createElementVNode("h3", { class: "detail-section-title" }, "当日数据切片 · 排名"), _createElementVNode("div", { class: "detail-metrics" }, [
              _createElementVNode("div", { class: "detail-metric" }, [_createElementVNode("div", { class: "detail-metric-label" }, "当日涨跌幅"), _createElementVNode("div", { class: _normalizeClass(["detail-metric-value", (currentModalData.pct_change || 0) > 0 ? 'text-up' : (currentModalData.pct_change || 0) < 0 ? 'text-down' : '']) }, _toDisplayString(Number.isFinite(currentModalData.pct_change) ? ((currentModalData.pct_change > 0 ? '+' : '') + currentModalData.pct_change.toFixed(2) + '%') : '-'), 3)]),
              _createElementVNode("div", { class: _normalizeClass(["detail-metric", {'is-active': modalActiveTab === 'Swing'}]) }, [_createElementVNode("div", { class: "detail-metric-label" }, "波段流入排名"), _createElementVNode("div", { class: "detail-metric-value" }, [_createElementVNode("span", { class: "detail-metric-unit" }, "NO."), _createTextVNode(_toDisplayString(currentModalData.Swing_RankPos || '-'), 1)]), _createElementVNode("div", { class: "detail-metric-sub" }, [_createTextVNode("波段均值 "), _createElementVNode("strong", null, _toDisplayString(((currentModalData.Swing_Ratio_Val || 0) * 100).toFixed(2)) + "%", 1)])], 2),
              _createElementVNode("div", { class: _normalizeClass(["detail-metric", {'is-active': modalActiveTab === 'Ratio'}]) }, [_createElementVNode("div", { class: "detail-metric-label" }, "单日流入排名"), _createElementVNode("div", { class: "detail-metric-value" }, [_createElementVNode("span", { class: "detail-metric-unit" }, "NO."), _createTextVNode(_toDisplayString(currentModalData.Ratio_RankPos || '-'), 1)]), _createElementVNode("div", { class: "detail-metric-sub" }, [_createTextVNode("占比 "), _createElementVNode("strong", null, _toDisplayString(((currentModalData.Ratio_Raw_Pct || 0) * 100).toFixed(2)) + "%", 1)])], 2),
              _createElementVNode("div", { class: _normalizeClass(["detail-metric", {'is-active': modalActiveTab === 'Amount'}]) }, [_createElementVNode("div", { class: "detail-metric-label" }, "单日净额排名"), _createElementVNode("div", { class: "detail-metric-value" }, [_createElementVNode("span", { class: "detail-metric-unit" }, "NO."), _createTextVNode(_toDisplayString(currentModalData.Amount_RankPos || '-'), 1)]), _createElementVNode("div", { class: "detail-metric-sub" }, [_createTextVNode("主力净流入 "), _createElementVNode("strong", null, _toDisplayString((currentModalData.Amount_Raw_BN || 0).toFixed(2)) + " 亿", 1)])], 2)
            ])]),
            _createTextVNode(),
            _createElementVNode("div", { class: "detail-trend-head" }, [_createElementVNode("h3", { class: "detail-section-title" }, "近 30 日 · " + _toDisplayString(modalActiveTab === 'Swing' ? '波段流入' : (modalActiveTab === 'Ratio' ? '单日流入' : '单日净额')) + "排名轨迹", 1), _createElementVNode("div", {
              class: "detail-tabs",
              role: "tablist",
              "aria-label": "详情排名指标"
            }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(tabs.filter(t=>t.id!=='RankChange'), (tab) => {
              return (_openBlock(), _createElementBlock("button", {
                onClick: $event => (modalActiveTab = tab.id),
                class: _normalizeClass([{'is-active': modalActiveTab === tab.id}, "detail-tab"]),
                role: "tab",
                "aria-selected": modalActiveTab === tab.id
              }, _toDisplayString(tab.name), 11, ["onClick", "aria-selected"]))
            }), 256))])]),
            _createElementVNode("div", { class: "detail-chart" }, [(_openBlock(), _createElementBlock("svg", {
              viewBox: "0 0 400 160",
              preserveAspectRatio: "none",
              "aria-hidden": "true"
            }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([32,64,96,128], (y) => {
              return (_openBlock(), _createElementBlock("line", {
                key: y,
                x1: "0",
                y1: y,
                x2: "400",
                y2: y,
                class: "detail-chart-grid"
              }, null, 8, ["y1", "y2"]))
            }), 128)), _createElementVNode("path", {
              d: getChartData(modalData.index_name, modalActiveTab).linePath,
              class: "detail-chart-line"
            }, null, 8, ["d"])])), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(getChartData(modalData.index_name, modalActiveTab).points, (pt) => {
              return (_openBlock(), _createElementBlock("div", {
                key: pt.date,
                class: _normalizeClass(["detail-chart-hit", {'is-selected': chartSelectedDate === pt.date}]),
                style: _normalizeStyle({ left: pt.xPct }),
                onClick: _withModifiers($event => (toggleChartDate(pt.date)), ["stop"])
              }, [
                _createElementVNode("div", { class: "detail-chart-cursor" }),
                _createElementVNode("div", {
                  class: "detail-chart-point",
                  style: _normalizeStyle({ top: pt.yPct })
                }, null, 4),
                _createElementVNode("div", { class: "detail-chart-date" }, _toDisplayString(pt.date.substring(5)), 1),
                _createElementVNode("div", {
                  class: "detail-chart-rank",
                  style: _normalizeStyle({ top: pt.yPct })
                }, "NO." + _toDisplayString(pt.rank), 5)
              ], 14, ["onClick"]))
            }), 128))])
          ]), _createElementVNode("aside", { class: "detail-stock-region" }, [_createElementVNode("section", {
            class: "constituent-strength",
            "aria-label": "成分强弱"
          }, [
            _createElementVNode("h3", { class: "detail-section-title" }, "成分强弱 · 个股"),
            _createElementVNode("div", { class: "constituent-controls" }, [_createElementVNode("div", {
              class: "detail-tabs",
              role: "tablist",
              "aria-label": "个股排行指标"
            }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(constituentMetrics, (metric) => {
              return (_openBlock(), _createElementBlock("button", {
                key: metric.id,
                onClick: $event => (constituentMetric=metric.id),
                class: _normalizeClass([{'is-active': constituentMetric===metric.id}, "detail-tab"]),
                role: "tab",
                "aria-selected": constituentMetric===metric.id
              }, _toDisplayString(metric.name), 11, ["onClick", "aria-selected"]))
            }), 128))]), _createElementVNode("div", {
              class: "constituent-direction",
              role: "tablist",
              "aria-label": "个股排行方向"
            }, [_createElementVNode("button", {
              onClick: $event => (constituentDirection='top'),
              class: _normalizeClass({'is-active':constituentDirection==='top'}),
              role: "tab",
              "aria-selected": constituentDirection==='top'
            }, _toDisplayString(constituentLimited ? '降序' : '前 5'), 11, ["onClick", "aria-selected"]), _createElementVNode("button", {
              onClick: $event => (constituentDirection='bottom'),
              class: _normalizeClass({'is-active':constituentDirection==='bottom'}),
              role: "tab",
              "aria-selected": constituentDirection==='bottom'
            }, _toDisplayString(constituentLimited ? '升序' : '后 5'), 11, ["onClick", "aria-selected"])])]),
            constituentNotice
              ? (_openBlock(), _createElementBlock("p", {
                  key: 0,
                  class: "detail-metric-sub"
                }, _toDisplayString(constituentNotice), 1))
              : _createCommentVNode("", true),
            constituentStatus
              ? (_openBlock(), _createElementBlock("div", {
                  key: 1,
                  class: "similar-empty"
                }, _toDisplayString(constituentStatus), 1))
              : (_openBlock(), _createElementBlock("ol", {
                  key: 2,
                  class: "constituent-list"
                }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(constituentRows, (row, index) => {
                  return (_openBlock(), _createElementBlock("li", { key: row.stock_code }, [_createElementVNode("span", { class: "constituent-rank" }, _toDisplayString(index + 1), 1), _createElementVNode("span", { class: "constituent-stock" }, [_createElementVNode("strong", null, _toDisplayString(row.stock_name || '—'), 1), _createTextVNode(_toDisplayString(row.stock_code), 1)]), _createElementVNode("b", { class: _normalizeClass(["constituent-value", row.value > 0 ? 'text-up' : row.value < 0 ? 'text-down' : '']) }, _toDisplayString(formatConstituentValue(row.value)), 3)]))
                }), 128))]))
          ]), _createElementVNode("section", { class: "detail-similar-region" }, [
            _createElementVNode("h3", { class: "detail-section-title" }, "成分相似板块 · 重合度"),
            (similarSectors.length)
              ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: "similar-list"
                }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(similarSectors, (sim) => {
                  return (_openBlock(), _createElementBlock("button", {
                    key: sim.name,
                    onClick: $event => (openModalByName(sim.name)),
                    class: "similar-item"
                  }, [_createElementVNode("span", { class: "similar-name" }, _toDisplayString(sim.name), 1), _createElementVNode("span", { class: "similar-score" }, _toDisplayString((sim.score * 100).toFixed(1)) + "% 重合", 1)], 8, ["onClick"]))
                }), 128))]))
              : _createCommentVNode("", true),
            (similarSectors.length && similarNotice)
              ? (_openBlock(), _createElementBlock("p", {
                  key: 1,
                  class: "constituent-notice"
                }, _toDisplayString(similarNotice), 1))
              : _createCommentVNode("", true),
            (!similarSectors.length)
              ? (_openBlock(), _createElementBlock("div", {
                  key: 2,
                  class: "similar-empty"
                }, _toDisplayString(similarNotice || '暂无高重合度板块信息'), 1))
              : _createCommentVNode("", true)
          ])])])])], 8, ["onClick"]))
        : _createCommentVNode("", true)]),
      _: 1
    }, 8, ["onBeforeEnter", "onBeforeLeave", "onAfterLeave"])], 64))
  }
};
window.CashflowRender._rc=true;
